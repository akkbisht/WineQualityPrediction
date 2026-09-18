export const Home = () => {
    return `
        <div class="max-w-6xl mx-auto animate-fade-in pb-12 pt-8 md:pt-16">
            
            <div class="text-center mb-20">
                <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold tracking-widest uppercase mb-8 shadow-sm">
                    <span class="relative flex h-2 w-2">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                    </span>
                    Vino AI Engine v2.0 Live
                </div>
                
                <h1 class="text-5xl md:text-7xl font-serif text-gray-900 tracking-tight mb-6 leading-tight">
                    The Future of <br class="hidden md:block">
                    <span class="text-transparent bg-clip-text bg-gradient-to-r from-rose-700 to-red-900">Digital Sommeliery</span>
                </h1>
                
                <p class="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium mb-10 leading-relaxed">
                    Upload chemical profiles and let our ensemble of Machine Learning models instantly predict wine quality with pinpoint accuracy.
                </p>
                
                <div class="flex flex-col sm:flex-row justify-center gap-4">
                    <button onclick="window.routeTo('predictor')" class="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 text-white font-bold rounded-full text-lg px-8 py-4 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                        Start Analysis 
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                
                <div class="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div class="w-14 h-14 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-md">
                        🧪
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-3">Chemical Profiling</h3>
                    <p class="text-gray-500 text-sm leading-relaxed font-medium">
                        Analyze 12 distinct chemical properties including volatile acidity, chlorides, and pH levels to understand the fundamental DNA of your wine.
                    </p>
                </div>

                <div class="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div class="w-14 h-14 bg-rose-700 text-white rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-md">
                        🧠
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-3">Ensemble AI</h3>
                    <p class="text-gray-500 text-sm leading-relaxed font-medium">
                        Don't rely on a single algorithm. Run your data through Random Forest, Gradient Boosting, and Logistic Regression simultaneously.
                    </p>
                </div>

                <div class="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div class="w-14 h-14 bg-gray-100 text-gray-900 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-sm border border-gray-200">
                        📊
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-3">Instant Scoring</h3>
                    <p class="text-gray-500 text-sm leading-relaxed font-medium">
                        Get immediate quality predictions mapped on a standard 9-point scale, backed by thousands of real-world historical datasets.
                    </p>
                </div>

            </div>
            
        </div>
    `;
};