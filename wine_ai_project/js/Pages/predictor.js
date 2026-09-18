export const Predictor = () => {
    return `
        <div class="max-w-4xl mx-auto animate-fade-in pb-12 pt-6">
            
            <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-10">
                <div class="text-left">
                    <h2 class="text-4xl md:text-5xl font-serif text-gray-900 tracking-tight mb-2">Wine <span class="text-transparent bg-clip-text bg-gradient-to-r from-rose-700 to-red-900">Intelligence</span></h2>
                    <p class="text-sm text-gray-500 font-medium flex items-center gap-2" id="user-profile-badge">
                        <span class="animate-pulse h-2 w-2 bg-rose-500 rounded-full inline-block"></span> Loading profile...
                    </p>
                </div>
                <button onclick="window.handleLogout()" class="mt-4 md:mt-0 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-rose-700 transition-colors px-5 py-2.5 rounded-full border border-gray-200 hover:border-rose-200 bg-white shadow-sm hover:shadow transform hover:-translate-y-0.5">
                    Log Out
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                </button>
            </div>
            
            <div class="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white p-8 md:p-12 relative overflow-visible">
                <div class="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 rounded-full bg-rose-600 blur-3xl opacity-10"></div>
                
                <h3 class="text-xl font-bold text-gray-900 mb-6 text-center relative z-10">Which wine would you like to analyze?</h3>
                
                <div class="relative z-50 mb-10" id="wine-search-container">
                    <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <span class="text-2xl">🍷</span>
                    </div>
                    
                    <input type="text" id="wine_search_name" autocomplete="off" placeholder="Type to search or click to browse..." 
                        class="w-full relative z-10 bg-gray-50 border-2 border-gray-200 text-gray-900 rounded-2xl focus:bg-white focus:ring-0 focus:border-rose-500 block pl-14 pr-5 py-5 text-lg font-medium shadow-inner transition-all outline-none cursor-text">
                    
                    <div id="custom-dropdown" class="absolute left-0 right-0 top-full mt-2 bg-white/95 backdrop-blur-3xl border border-gray-100 rounded-2xl shadow-2xl max-h-72 overflow-y-auto hidden transform transition-all duration-200 opacity-0 -translate-y-2 z-50">
                        </div>
                </div>

                <div class="mb-10 relative z-10">
                    <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 text-center">Select AI Architectures</label>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <label class="cursor-pointer relative text-center">
                            <input type="checkbox" class="peer sr-only model-checkbox" value="Random Forest" checked>
                            <div class="rounded-xl border-2 border-gray-100 bg-white p-3 hover:bg-gray-50 peer-checked:border-rose-500 peer-checked:bg-rose-50 transition-all shadow-sm">
                                <span class="text-xs font-bold text-gray-700 peer-checked:text-rose-700">Random Forest</span>
                            </div>
                        </label>
                        <label class="cursor-pointer relative text-center">
                            <input type="checkbox" class="peer sr-only model-checkbox" value="Gradient Boosting">
                            <div class="rounded-xl border-2 border-gray-100 bg-white p-3 hover:bg-gray-50 peer-checked:border-rose-500 peer-checked:bg-rose-50 transition-all shadow-sm">
                                <span class="text-xs font-bold text-gray-700 peer-checked:text-rose-700">Gradient Boost</span>
                            </div>
                        </label>
                        <label class="cursor-pointer relative text-center">
                            <input type="checkbox" class="peer sr-only model-checkbox" value="Decision Tree">
                            <div class="rounded-xl border-2 border-gray-100 bg-white p-3 hover:bg-gray-50 peer-checked:border-rose-500 peer-checked:bg-rose-50 transition-all shadow-sm">
                                <span class="text-xs font-bold text-gray-700 peer-checked:text-rose-700">Decision Tree</span>
                            </div>
                        </label>
                        <label class="cursor-pointer relative text-center">
                            <input type="checkbox" class="peer sr-only model-checkbox" value="Logistic Regression">
                            <div class="rounded-xl border-2 border-gray-100 bg-white p-3 hover:bg-gray-50 peer-checked:border-rose-500 peer-checked:bg-rose-50 transition-all shadow-sm">
                                <span class="text-xs font-bold text-gray-700 peer-checked:text-rose-700">Logistic Reg</span>
                            </div>
                        </label>
                    </div>
                </div>

                <button onclick="window.makePrediction()" class="w-full relative z-10 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 text-white font-bold rounded-2xl text-lg px-5 py-5 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex justify-center items-center gap-3">
                    <span id="btn-text">Extract DNA & Predict</span>
                </button>

                <div id="result" class="mt-8 relative z-10"></div>
            </div>
        </div>
    `;
};