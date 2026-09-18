export const AdminDashboard = () => {
    return `
        <div class="max-w-7xl mx-auto animate-fade-in pb-12 pt-6">
            
            <div class="flex flex-col md:flex-row md:justify-between md:items-end mb-8">
                <div>
                    <h2 class="text-3xl md:text-4xl font-serif text-slate-900 font-bold mb-2 flex items-center gap-3">
                        <span class="bg-indigo-600 text-white p-2 rounded-lg text-sm">ADMIN</span>
                        Command Center
                    </h2>
                    <p class="text-sm text-slate-500 font-medium">Platform overview and user analytics.</p>
                </div>
                <button onclick="window.handleLogout()" class="mt-4 md:mt-0 text-sm font-bold text-slate-500 hover:text-indigo-600 border border-slate-200 px-4 py-2 rounded-full bg-white shadow-sm hover:shadow">
                    Exit Admin Mode
                </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" id="admin-metrics">
                <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm animate-pulse h-32"></div>
                <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm animate-pulse h-32"></div>
            </div>

            <div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 class="text-lg font-bold text-slate-800">Global Analysis Feed</h3>
                    <span class="text-xs font-bold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">Live Data</span>
                </div>
                
                <div class="overflow-x-auto">
                    <table class="w-full text-left border-collapse">
                        <thead>
                            <tr class="bg-white text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
                                <th class="p-4 font-bold">Date & Time</th>
                                <th class="p-4 font-bold">User</th>
                                <th class="p-4 font-bold">Wine Specs</th>
                                <th class="p-4 font-bold">AI Consensus</th>
                            </tr>
                        </thead>
                        <tbody id="admin-table-body" class="text-sm">
                            <tr><td colspan="4" class="p-8 text-center text-slate-500">Loading platform data...</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    `;
};