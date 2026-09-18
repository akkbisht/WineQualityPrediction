import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression

print("1. Loading the New XWines dataset...")
df = pd.read_csv('XWines_Expanded_150_wines.csv')

print("2. Preprocessing the data...")
# The new dataset has multiple types (Red, White, Sparkling, Rosé, etc.)
# We will mathematically map these to numbers so the AI can understand them
type_mapping = {
    'Red': 0, 'White': 1, 'Rosé': 2, 'Sparkling': 3, 'Dessert': 4, 'Dessert/Port': 5
}
df['TypeNum'] = df['Type'].map(type_mapping).fillna(0)

# Extract only the chemical features needed for the AI
features = ['FixedAcidity', 'VolatileAcidity', 'CitricAcid', 'ResidualSugar', 
            'Chlorides', 'FreeSulfurDioxide', 'TotalSulfurDioxide', 'Density', 
            'pH', 'Sulphates', 'Alcohol', 'TypeNum']

X = df[features] 
y = df['Quality']              

print("3. Splitting data into Training and Testing sets...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print("\n--- 🏁 ALGORITHM TOURNAMENT STARTING ---")

models = {
    "Random Forest": RandomForestClassifier(n_estimators=100, random_state=42),
    "Decision Tree": DecisionTreeClassifier(random_state=42),
    "Gradient Boosting": GradientBoostingClassifier(random_state=42),
    "Logistic Regression": LogisticRegression(max_iter=10000, random_state=42)
}

# Train and test each model in a loop, and SAVE them all!
for name, model in models.items():
    model.fit(X_train, y_train)
    predictions = model.predict(X_test)
    accuracy = accuracy_score(y_test, predictions)
    print(f"✅ {name} Accuracy: {accuracy * 100:.2f}%")
    
    filename = name.replace(" ", "_").lower() + "_model.pkl"
    joblib.dump(model, filename)
    print(f"   -> Saved as {filename}")

print("\n✅ Success! All 4 models have been saved on the new dataset.")