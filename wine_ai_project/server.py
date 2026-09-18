from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import pandas as pd
import joblib
from datetime import datetime
import google.generativeai as genai
import json
import re

# --- Configure Gemini AI ---
genai.configure(api_key="AIzaSyByM_B9E0hIUCWkIDHx78Dh-QVNnZXjCl0") 
gemini_model = genai.GenerativeModel('gemini-2.5-flash') # Or gemini-1.5-flash

app = Flask(__name__)
# Allow our frontend to securely communicate with this backend API
CORS(app) 

# --- 1. Database Configuration ---
print("Connecting to MongoDB...")
# Ensure MongoDB is running locally on the default port
client = MongoClient("mongodb://127.0.0.1:27017/") 
db = client["vino_ai_platform"]
history_collection = db["user_predictions"]
users_collection = db["users"]

# --- 2. Load ALL Machine Learning Models ---
print("Loading Machine Learning Models...")
ai_models = {}
try:
    ai_models["Random Forest"] = joblib.load('random_forest_model.pkl')
    ai_models["Decision Tree"] = joblib.load('decision_tree_model.pkl')
    ai_models["Gradient Boosting"] = joblib.load('gradient_boosting_model.pkl')
    ai_models["Logistic Regression"] = joblib.load('logistic_regression_model.pkl')
    print("✅ All 4 Models loaded successfully!")
except FileNotFoundError as e:
    print(f"❌ ERROR: Missing a model file. Please ensure you ran the updated train.py first! Details: {e}")

# --- 3. API Endpoints ---

# Load the dataset into server memory so we can search it quickly!
print("Loading Wine Database for Search...")
wine_db = pd.read_csv('XWines_Expanded_150_wines.csv')


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        username = data.get('username')
        wine_name = data.get('wine_name') 
        selected_models = data.get('models', ['Random Forest']) 

        if not username or not wine_name:
            return jsonify({"status": "error", "message": "Missing wine name"}), 400

        # --- 1. SEARCH LOCAL DATABASE FIRST ---
        wine_record = wine_db[wine_db['WineName'].str.lower() == wine_name.lower()]
        
        wine_data = {}
        is_ai_generated = False

        if not wine_record.empty:
            # Found locally! Extract the exact row.
            wine_data = wine_record.iloc[0].to_dict()
        else:
            # --- 2. LOCAL MISS! INITIATE GEMINI FALLBACK ---
            print(f"'{wine_name}' not found locally. Asking Gemini...")
            
            prompt = f"""
            You are an expert Master Sommelier and wine chemist. I need the standard chemical profile for the wine: '{wine_name}'.
            
            If you do not have the exact lab results for this specific vintage, you MUST provide a highly educated, scientifically accurate ESTIMATE based on the typical chemical profile of this exact style and region of wine (for example, if asked for Dom Pérignon, use the standard profile of a premium vintage Champagne).
            
            Only return an error {{"error": "Data not available"}} IF the wine name is complete nonsense or doesn't exist.
            
            Return ONLY a raw JSON object (no markdown formatting, no code blocks) with these exact keys and numerical values:
            "FixedAcidity" (float)
            "VolatileAcidity" (float)
            "CitricAcid" (float)
            "ResidualSugar" (float)
            "Chlorides" (float)
            "FreeSulfurDioxide" (float)
            "TotalSulfurDioxide" (float)
            "Density" (float)
            "pH" (float)
            "Sulphates" (float)
            "Alcohol" (float)
            "Type" (String: Must be exactly "Red", "White", "Rosé", "Sparkling", "Dessert", or "Dessert/Port")
            """
            
            gemini_response = gemini_model.generate_content(prompt)
            response_text = gemini_response.text.strip()
            
            # Clean up potential markdown blocks if Gemini accidentally includes them
            response_text = re.sub(r"```json\n|\n```|```", "", response_text).strip()
            
            try:
                gemini_json = json.loads(response_text)
            except json.JSONDecodeError:
                return jsonify({"status": "error", "message": "Failed to parse AI chemical data."}), 500

            if "error" in gemini_json:
                return jsonify({"status": "error", "message": f"'{wine_name}' is not in our database, and the AI could not reliably determine its chemical profile."}), 404

            # Success! Map the Gemini JSON to our expected format
            wine_data = gemini_json
            wine_data['WineName'] = wine_name + " (AI Extracted Profile)"
            is_ai_generated = True
            print("Gemini successfully extracted the DNA!")

        # --- 3. PREPARE THE EXTRACTED DNA FOR THE ML MODELS ---
        type_mapping = {'Red': 0, 'White': 1, 'Rosé': 2, 'Sparkling': 3, 'Dessert': 4, 'Dessert/Port': 5}
        type_num = type_mapping.get(wine_data['Type'], 0)
        
        features = [
            float(wine_data['FixedAcidity']), float(wine_data['VolatileAcidity']), float(wine_data['CitricAcid']), 
            float(wine_data['ResidualSugar']), float(wine_data['Chlorides']), float(wine_data['FreeSulfurDioxide']), 
            float(wine_data['TotalSulfurDioxide']), float(wine_data['Density']), float(wine_data['pH']), 
            float(wine_data['Sulphates']), float(wine_data['Alcohol']), type_num
        ]

        feature_names = ['FixedAcidity', 'VolatileAcidity', 'CitricAcid', 'ResidualSugar', 'Chlorides', 'FreeSulfurDioxide', 'TotalSulfurDioxide', 'Density', 'pH', 'Sulphates', 'Alcohol', 'TypeNum']
        df = pd.DataFrame([features], columns=feature_names)
        
        # --- 4. FEED TO ML MODELS ---
        predictions = {}
        for model_name in selected_models:
            if model_name in ai_models:
                predictions[model_name] = int(ai_models[model_name].predict(df)[0])

        # Save to History
        history_collection.insert_one({
            "username": username,
            "wine_name": wine_data['WineName'],
            "features": features,
            "predictions": predictions, 
            "is_ai_generated": is_ai_generated, # Keep track of which ones Gemini found!
            "timestamp": datetime.now().strftime("%B %d, %Y - %I:%M %p")
        })

        return jsonify({
            "status": "success", 
            "wine_details": {
                "name": wine_data['WineName'], 
                "type": wine_data['Type'], 
                "alcohol": wine_data['Alcohol'],
                "source": "Gemini Knowledge Base" if is_ai_generated else "Local Database"
            },
            "predictions": predictions
        }), 200

    except Exception as e:
        print(f"Prediction Error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({"status": "error", "message": "Missing email or password"}), 400

        user = users_collection.find_one({"email": email})

        if user and user.get("password") == password:
            # NEW: We fetch the role from the database (default to 'user' if it doesn't exist)
            user_role = user.get("role", "user") 
            
            return jsonify({
                "status": "success", 
                "message": "Login successful!", 
                "name": user.get("full_name"),
                "role": user_role  # Send the role back to the React UI!
            }), 200
        else:
            return jsonify({"status": "error", "message": "Invalid email or password"}), 401

    except Exception as e:
        print(f"Login Error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        full_name = data.get('fullName')
        email = data.get('email')
        password = data.get('password') 

        if not full_name or not email or not password:
            return jsonify({"status": "error", "message": "Missing required fields"}), 400

        if users_collection.find_one({"email": email}):
            return jsonify({"status": "error", "message": "Email is already registered"}), 409

        users_collection.insert_one({
            "full_name": full_name,
            "email": email,
            "password": password, 
            "role": "user", # NEW: All new signups default to a standard 'user'
            "created_at": datetime.now().strftime("%B %d, %Y - %I:%M %p")
        })

        return jsonify({"status": "success", "message": "User registered successfully!"}), 201

    except Exception as e:
        print(f"Signup Error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/user/<email>', methods=['GET'])
def get_user_profile(email):
    try:
        user = users_collection.find_one({"email": email})
        if user:
            return jsonify({
                "status": "success",
                "full_name": user.get("full_name"),
                "email": user.get("email"),
                "member_since": user.get("created_at")
            }), 200
        else:
            return jsonify({"status": "error", "message": "User not found"}), 404

    except Exception as e:
        print(f"Profile Fetch Error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500        


@app.route('/history/<username>', methods=['GET'])
def get_history(username):
    try:
        records = list(history_collection.find(
            {"username": username}, 
            {"_id": 0}
        ).sort("_id", -1))
        
        return jsonify(records), 200

    except Exception as e:
        print(f"Database Error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/wines', methods=['GET'])
def get_wines():
    try:
        # Get all unique wine names from the loaded CSV, sort them alphabetically
        wine_names = sorted(wine_db['WineName'].dropna().unique().tolist())
        return jsonify({"status": "success", "wines": wine_names}), 200
    except Exception as e:
        print(f"Wine List Error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500



# --- ADMIN ENDPOINTS ---

@app.route('/admin/dashboard', methods=['GET'])
def get_admin_dashboard():
    try:
        # 1. Count platform metrics
        total_users = users_collection.count_documents({})
        total_predictions = history_collection.count_documents({})
        
        # 2. Fetch the 50 most recent predictions across ALL users
        recent_activity = list(history_collection.find({}, {"_id": 0}).sort("_id", -1).limit(50))

        return jsonify({
            "status": "success",
            "metrics": {
                "total_users": total_users,
                "total_predictions": total_predictions
            },
            "recent_activity": recent_activity
        }), 200

    except Exception as e:
        print(f"Admin DB Error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500



# --- 4. Start the Server ---
if __name__ == '__main__':
    print("🚀 Vino AI Backend running on http://127.0.0.1:5000")
    app.run(debug=True, port=5000)