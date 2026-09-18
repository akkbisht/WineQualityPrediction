export const History = () => {
    return `
        <div class="max-w-7xl mx-auto animate-fade-in pb-12 pt-6">

            <div class="flex flex-col md:flex-row md:justify-between md:items-end mb-8 border-b border-gray-200 pb-5">
                <div>
                    <h2 class="text-4xl md:text-5xl font-serif text-gray-900 tracking-tight mb-2">Analysis <span class="text-rose-800">History</span></h2>
                    <p class="text-sm text-gray-500 font-medium flex items-center gap-2">
                        Past predictions for <strong id="history-user-name" class="text-gray-900">Loading...</strong>
                    </p>
                </div>
                <button onclick="window.routeTo('predictor')" class="mt-4 md:mt-0 flex items-center gap-2 text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 transition-colors px-6 py-3 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    New Analysis
                </button>
            </div>

            <div class="bg-white/50 backdrop-blur-xl rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 min-h-[400px]">
                
                <div id="history-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    </div>

            </div>
        </div>
    `;
};