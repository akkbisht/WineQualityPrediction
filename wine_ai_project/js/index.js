import { Home } from './pages/home.js';
import { Login } from './pages/login.js';
import { Predictor } from './pages/predictor.js';
import { History } from './pages/history.js'; 
import { Signup } from './pages/signup.js';
import { AdminDashboard } from './pages/admin-dashboard.js'; // Notice AdminLogin is completely gone!

const appContainer = document.getElementById('app');

// --- 1. GLOBAL STATE & CONFIG ---
const API_URL = 'http://127.0.0.1:5000'; 

// Check browser memory on boot
window.currentUser = localStorage.getItem('vino_user_email') || null;
window.currentUserName = localStorage.getItem('vino_user_name') || null;
window.isAdmin = localStorage.getItem('vino_is_admin') === 'true';

// --- 2. ROUTER ---
window.routeTo = (page) => {
    // 1. Security Check: Protect Admin Dashboard
    if (page === 'admin-dashboard' && !window.isAdmin) {
        alert("Unauthorized. Admin access required.");
        page = 'login';
    }

    // 2. Security Check: Protect User Tools
    if ((page === 'predictor' || page === 'history') && !window.currentUser) {
        alert("Please log in first to access this feature.");
        page = 'login';
    }

    // 3. Render the Page
    if (page === 'home') appContainer.innerHTML = Home();
    if (page === 'login') appContainer.innerHTML = Login();
    if (page === 'signup') appContainer.innerHTML = Signup(); 
    if (page === 'predictor') {
        appContainer.innerHTML = Predictor();
        window.loadUserProfile(); 
        window.loadWineList();
    }
    if (page === 'history') {
        appContainer.innerHTML = History();
        window.loadUserHistory();
    }
    if (page === 'admin-dashboard') {
        appContainer.innerHTML = AdminDashboard();
        window.loadAdminData(); 
    }

    // 4. Update Navigation UI Active States
    document.querySelectorAll('.nav-links button').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`nav-${page}`);
    if (activeBtn) activeBtn.classList.add('active');
    
    // 5. Show/Hide buttons based on login state
    const loginBtn = document.getElementById('nav-login');
    const signupBtn = document.getElementById('nav-signup'); 
    const historyBtn = document.getElementById('nav-history');
    const predictorBtn = document.getElementById('nav-predictor');

    if (window.currentUser) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none'; 
        
        // Hide standard user tabs if they are an admin
        if (window.isAdmin) {
            if (historyBtn) historyBtn.style.display = 'none';
            if (predictorBtn) predictorBtn.style.display = 'none';
        } else {
            if (historyBtn) historyBtn.style.display = 'inline-block';
            if (predictorBtn) predictorBtn.style.display = 'inline-block';
        }
    } else {
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (signupBtn) signupBtn.style.display = 'inline-block'; 
        if (historyBtn) historyBtn.style.display = 'none';
        if (predictorBtn) predictorBtn.style.display = 'inline-block';
    }
};

// --- 3. AUTHENTICATION LOGIC ---

window.handleSignup = async () => {
    const fullName = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const messageDiv = document.getElementById('signup-message');

    if (!fullName || !email || !password) {
        messageDiv.innerText = "Please fill out all fields.";
        messageDiv.style.color = "red";
        return;
    }

    messageDiv.innerText = "Creating account...";
    messageDiv.style.color = "var(--text-main)";

    try {
        const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, email, password })
        });

        const data = await response.json();

        if (response.ok) {
            messageDiv.innerText = "Success! Redirecting to login...";
            messageDiv.style.color = "green";
            setTimeout(() => window.routeTo('login'), 1500); 
        } else {
            messageDiv.innerText = data.message || "Signup failed.";
            messageDiv.style.color = "red";
        }
    } catch (err) {
        console.error("Signup Fetch Error:", err);
        messageDiv.innerText = "Error connecting to server.";
        messageDiv.style.color = "red";
    }
};

window.handleLogin = async () => {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (!email || !password) {
        alert("Please enter both email and password.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            window.currentUser = email; 
            window.currentUserName = data.name || email; 
            
            localStorage.setItem('vino_user_email', window.currentUser);
            localStorage.setItem('vino_user_name', window.currentUserName);
            
            // Role-Based Routing
            if (data.role === 'admin') {
                window.isAdmin = true;
                localStorage.setItem('vino_is_admin', 'true');
                window.routeTo('admin-dashboard');
            } else {
                window.isAdmin = false;
                localStorage.setItem('vino_is_admin', 'false');
                window.routeTo('predictor');
            }

        } else {
            alert(data.message || "Invalid credentials.");
        }
    } catch (err) {
        console.error("Login Fetch Error:", err);
        alert("Error connecting to server. Check browser console for details.");
    }
};

// Universal Logout for BOTH Users and Admins
window.handleLogout = () => {
    window.currentUser = null;
    window.currentUserName = null; 
    window.isAdmin = false;
    
    localStorage.removeItem('vino_user_email');
    localStorage.removeItem('vino_user_name');
    localStorage.removeItem('vino_is_admin');
    
    window.routeTo('home'); 
};

// --- 4. PREDICTION LOGIC ---
window.makePrediction = async () => {
    const wineName = document.getElementById('wine_search_name').value.trim();

    if (!wineName) {
        alert("Please type a wine name to search.");
        return;
    }

    const checkboxes = document.querySelectorAll('.model-checkbox:checked');
    const selectedModels = Array.from(checkboxes).map(cb => cb.value);

    if (selectedModels.length === 0) {
        alert("Please select at least one AI Architecture.");
        return;
    }

    const btnText = document.getElementById('btn-text');
    if(btnText) btnText.innerText = "Searching database & analyzing...";

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ``; 

    try {
        const response = await fetch(`${API_URL}/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username: window.currentUser, 
                wine_name: wineName,         // <--- Sending the Name!
                models: selectedModels 
            }) 
        });
      const data = await response.json();
        
        if (!response.ok) {
            // Display the "I don't know" error gracefully
            resultDiv.innerHTML = `<div class="bg-amber-50 text-amber-700 p-5 rounded-2xl font-bold border border-amber-200 text-center shadow-sm">⚠️ ${data.message}</div>`;
            return;
        }

        // Determine if it was an AI fallback to show a cool badge
        const sourceBadge = data.wine_details.source === "Gemini Knowledge Base" 
            ? `<span class="bg-indigo-100 text-indigo-800 text-xs font-black px-3 py-1 rounded-full border border-indigo-200 flex items-center gap-1 shadow-sm">✨ Deep Web Extraction</span>`
            : `<span class="bg-emerald-100 text-emerald-800 text-xs font-black px-3 py-1 rounded-full border border-emerald-200 shadow-sm">Verified Local Data</span>`;

        // Show the found wine details AND the AI Scores
        let resultsHTML = `
            <div class="bg-gray-50 rounded-2xl p-6 border border-gray-100 animate-fade-in shadow-inner">
                
                <div class="flex justify-between items-start mb-6 pb-5 border-b border-gray-200">
                    <div>
                        <span class="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Target Identified</span>
                        <h4 class="text-xl font-bold text-gray-900">${data.wine_details.name}</h4>
                        <div class="mt-2">${sourceBadge}</div>
                    </div>
                    <div class="text-right">
                        <span class="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full border border-rose-200 block mb-1">${data.wine_details.type}</span>
                        <span class="text-sm font-mono text-gray-500 font-bold">Alc: ${data.wine_details.alcohol}%</span>
                    </div>
                </div>

                <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">ML Ensemble Consensus</h3>
                <div class="space-y-4">
        `;
        
        for (const [modelName, score] of Object.entries(data.predictions)) {
            const percentage = (score / 9) * 100;
            const barColor = score >= 7 ? 'bg-green-500' : (score <= 4 ? 'bg-red-500' : 'bg-amber-500');
            const textColor = score >= 7 ? 'text-green-600' : (score <= 4 ? 'text-red-600' : 'text-amber-600');
            
            resultsHTML += `
                <div>
                    <div class="flex justify-between items-end mb-1">
                        <span class="font-bold text-gray-700 text-sm">${modelName}</span>
                        <div class="flex items-baseline gap-1">
                            <span class="text-xl font-black ${textColor}">${score}</span>
                            <span class="text-xs text-gray-400 font-bold uppercase">/ 9</span>
                        </div>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div class="${barColor} h-2 rounded-full transition-all duration-1000 ease-out" style="width: 0%" onload="this.style.width='${percentage}%'"></div>
                    </div>
                </div>`;
        }
        resultsHTML += `</div></div>`;
        
        resultDiv.innerHTML = resultsHTML;
        
        setTimeout(() => {
            const bars = resultDiv.querySelectorAll('.transition-all');
            bars.forEach(bar => {
                const targetWidth = bar.getAttribute('onload').match(/'([^']+)'/)[1];
                bar.style.width = targetWidth;
            });
        }, 50);

    } catch (err) {
        resultDiv.innerHTML = `<div class="bg-red-50 text-red-600 p-4 rounded-2xl font-medium border border-red-100 mt-4 text-center">Server disconnected.</div>`;
    } finally {
        if(btnText) btnText.innerText = "Extract DNA & Predict";
    }
};

// --- CUSTOM AUTOCOMPLETE LOGIC ---

// Global array to cache the wines so we only fetch them once!
window.wineDatabaseCache = []; 

window.loadWineList = async () => {
    // If we already downloaded the list, just set up the UI and skip the fetch
    if (window.wineDatabaseCache.length > 0) {
        window.setupCustomDropdown();
        return;
    }

    try {
        const response = await fetch(`${API_URL}/wines`);
        const data = await response.json();
        
        if (response.ok) {
            window.wineDatabaseCache = data.wines;
            window.setupCustomDropdown();
        }
    } catch (err) {
        console.error("Failed to fetch wine list:", err);
    }
};

window.setupCustomDropdown = () => {
    const input = document.getElementById('wine_search_name');
    const dropdown = document.getElementById('custom-dropdown');

    if (!input || !dropdown) return;

    // Helper function to draw the list
    const renderOptions = (filterText = '') => {
        const lowerFilter = filterText.toLowerCase();
        
        // Filter the cached database
        const filteredWines = window.wineDatabaseCache.filter(wine => 
            wine.toLowerCase().includes(lowerFilter)
        );

        if (filteredWines.length === 0) {
            dropdown.innerHTML = `<div class="p-5 text-gray-500 text-center font-medium">No matching wines found.</div>`;
            return;
        }

        let html = '<ul class="py-2">';
        
        // Only render the top 50 to keep the UI lightning fast
        filteredWines.slice(0, 50).forEach(wine => {
            
            // Magic UI Trick: Highlight the exact letters the user typed!
            let highlightedName = wine;
            if (filterText) {
                const regex = new RegExp(`(${filterText})`, "gi");
                highlightedName = wine.replace(regex, `<span class="text-rose-700 font-black">$1</span>`);
            }

            // Need to escape single quotes (e.g., "Jacob's Creek") so it doesn't break the JS onclick
            const safeWineName = wine.replace(/'/g, "\\'");

            html += `
                <li onclick="window.selectWine('${safeWineName}')" class="px-5 py-3.5 hover:bg-rose-50 cursor-pointer transition-colors border-b border-gray-50 last:border-0 flex items-center gap-4 group">
                    <span class="text-xl opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all">🍾</span>
                    <span class="text-gray-700 font-medium group-hover:text-rose-900">${highlightedName}</span>
                </li>
            `;
        });
        html += '</ul>';
        dropdown.innerHTML = html;
    };

    // 1. Show the dropdown when the user clicks into the box
    input.addEventListener('focus', () => {
        renderOptions(input.value);
        dropdown.classList.remove('hidden');
        // Tiny timeout allows Tailwind transitions to animate smoothly
        setTimeout(() => {
            dropdown.classList.remove('opacity-0', '-translate-y-2');
            dropdown.classList.add('opacity-100', 'translate-y-0');
        }, 10);
    });

    // 2. Filter the list instantly as they type
    input.addEventListener('input', (e) => {
        renderOptions(e.target.value);
    });

    // 3. Hide the dropdown if they click anywhere else on the screen
    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.remove('opacity-100', 'translate-y-0');
            dropdown.classList.add('opacity-0', '-translate-y-2');
            setTimeout(() => dropdown.classList.add('hidden'), 200); 
        }
    });
};

// Fired when the user clicks a specific wine in the dropdown
window.selectWine = (wineName) => {
    const input = document.getElementById('wine_search_name');
    const dropdown = document.getElementById('custom-dropdown');

    if (input) input.value = wineName;

    // Smoothly close the menu
    if (dropdown) {
        dropdown.classList.remove('opacity-100', 'translate-y-0');
        dropdown.classList.add('opacity-0', '-translate-y-2');
        setTimeout(() => dropdown.classList.add('hidden'), 200);
    }
};


// --- 5. HISTORY LOGIC ---
window.loadUserHistory = async () => {
    const historyContainer = document.getElementById('history-list');
    
    const nameLabel = document.getElementById('history-user-name');
    if (nameLabel) nameLabel.innerText = window.currentUserName || window.currentUser;

    historyContainer.innerHTML = `
        <div class="col-span-full flex justify-center items-center h-40">
            <div class="animate-pulse text-rose-600 font-medium text-lg">Loading historical data...</div>
        </div>`;

    try {
        const response = await fetch(`${API_URL}/history/${window.currentUser}`);
        const data = await response.json();
        
        if (data.length === 0) {
            historyContainer.innerHTML = `
                <div class="col-span-full text-center py-16">
                    <div class="text-6xl mb-4">🍷</div>
                    <h3 class="text-xl font-bold text-gray-900 mb-2">No history yet</h3>
                    <p class="text-gray-500 text-base">Your past AI wine analyses will appear here.</p>
                </div>`;
            return;
        }

        let html = '';
        data.forEach(item => {
            let modelsHtml = '';
            
            if (item.predictions) {
                for (const [model, score] of Object.entries(item.predictions)) {
                    const badgeColor = score >= 7 ? 'bg-green-100 text-green-700' : (score <= 4 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700');
                    modelsHtml += `
                        <div class="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-0">
                            <span class="text-sm font-medium text-gray-700">${model}</span>
                            <span class="px-2.5 py-1 rounded-md text-xs font-bold shadow-sm ${badgeColor}">${score}/9</span>
                        </div>`;
                }
            } else if (item.prediction) {
                 modelsHtml = `<div class="text-sm font-medium text-gray-600">Legacy Prediction: <strong class="text-rose-600">${item.prediction}/9</strong></div>`;
            }

            html += `
                <div class="bg-white rounded-3xl p-6 border border-gray-200 hover:border-rose-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full group">
                    <div class="flex justify-between items-start mb-5">
                        <div>
                            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Analysis Date</span>
                            <span class="text-sm font-medium text-gray-800">${item.timestamp.split(' - ')[0]}</span>
                        </div>
                        <div class="bg-rose-50 text-rose-700 px-3 py-1.5 rounded-xl text-xs font-bold border border-rose-100 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                            Alc: ${item.features[10]}%
                        </div>
                    </div>
                    <div class="bg-gray-50 rounded-2xl p-4 border border-gray-100 shadow-inner flex-grow mb-5">
                        ${modelsHtml}
                    </div>
                    <div class="text-[11px] font-mono text-gray-500 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 mt-auto flex justify-between">
                        <span>pH: ${item.features[8]}</span>
                        <span>Den: ${item.features[7]}</span>
                        <span>RS: ${item.features[3]}</span>
                    </div>
                </div>`;
        });
        
        historyContainer.innerHTML = html;

    } catch (err) {
        console.error("History Fetch Error:", err);
        historyContainer.innerHTML = `
            <div class="col-span-full bg-red-50 text-red-600 p-6 rounded-2xl font-medium border border-red-100 text-center">
                Error fetching history. Ensure the Python backend is running.
            </div>`;
    }
};

// --- 6. USER PROFILE LOGIC ---
window.loadUserProfile = async () => {
    const profileBadge = document.getElementById('user-profile-badge');
    if (!profileBadge || !window.currentUser) return;

    try {
        const response = await fetch(`${API_URL}/user/${window.currentUser}`);
        const data = await response.json();

        if (response.ok) {
            profileBadge.innerHTML = `
                Welcome back, <span style="color: var(--accent-wine);">${data.full_name}</span> 
            `;
        } else {
            profileBadge.innerText = "Error loading profile.";
        }
    } catch (err) {
        console.error("Profile Fetch Error:", err);
        profileBadge.innerText = "Connection error.";
    }
};

// --- 7. ADMIN LOGIC ---

window.loadAdminData = async () => {
    try {
        const response = await fetch(`${API_URL}/admin/dashboard`);
        const data = await response.json();

        if (response.ok) {
            const metricsDiv = document.getElementById('admin-metrics');
            metricsDiv.innerHTML = `
                <div class="bg-indigo-50 rounded-3xl p-6 border border-indigo-100 shadow-sm flex items-center gap-5">
                    <div class="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-2xl shadow-md">👥</div>
                    <div>
                        <p class="text-sm font-bold text-indigo-800 uppercase tracking-wider mb-1">Total Registered Users</p>
                        <p class="text-4xl font-black text-indigo-900">${data.metrics.total_users}</p>
                    </div>
                </div>
                <div class="bg-emerald-50 rounded-3xl p-6 border border-emerald-100 shadow-sm flex items-center gap-5">
                    <div class="w-14 h-14 bg-emerald-500 text-white rounded-2xl flex items-center justify-center text-2xl shadow-md">🧠</div>
                    <div>
                        <p class="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-1">Total AI Predictions</p>
                        <p class="text-4xl font-black text-emerald-900">${data.metrics.total_predictions}</p>
                    </div>
                </div>
            `;

            const tableBody = document.getElementById('admin-table-body');
            let rowsHtml = '';
            
            data.recent_activity.forEach(item => {
                let highestScore = 0;
                if (item.predictions) {
                    highestScore = Math.max(...Object.values(item.predictions));
                } else if (item.prediction) {
                    highestScore = item.prediction;
                }

                const scoreColor = highestScore >= 7 ? 'text-green-600 bg-green-50' : (highestScore <= 4 ? 'text-red-600 bg-red-50' : 'text-amber-600 bg-amber-50');

                rowsHtml += `
                    <tr class="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td class="p-4 text-xs font-medium text-slate-500">${item.timestamp}</td>
                        <td class="p-4 text-sm font-bold text-slate-800">${item.username}</td>
                        <td class="p-4 text-xs font-mono text-slate-600">
                            Alc: ${item.features[10]}% | pH: ${item.features[8]} | Den: ${item.features[7]}
                        </td>
                        <td class="p-4">
                            <span class="px-3 py-1 rounded-md text-xs font-bold border ${scoreColor} border-current border-opacity-20">
                                Max Score: ${highestScore}/9
                            </span>
                        </td>
                    </tr>
                `;
            });
            
            tableBody.innerHTML = rowsHtml || `<tr><td colspan="4" class="p-8 text-center text-slate-500">No predictions yet.</td></tr>`;
        }
    } catch (err) {
        console.error("Admin Fetch Error:", err);
    }
};

// Start the app: Smart routing based on role!
if (window.currentUser) {
    if (window.isAdmin) {
        window.routeTo('admin-dashboard');
    } else {
        window.routeTo('predictor');
    }
} else {
    window.routeTo('home');
}