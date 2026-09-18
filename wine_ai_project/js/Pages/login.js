export const Login = () => {
    return `
        <div class="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
            <div class="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 md:p-10">
                
                <div class="text-center mb-8">
                    <div class="w-16 h-16 bg-gradient-to-br from-rose-50 to-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-rose-200">
                        <span class="text-2xl">🔐</span>
                    </div>
                    <h2 class="text-3xl font-serif text-gray-900 tracking-tight font-bold mb-2">Welcome Back</h2>
                    <p class="text-sm text-gray-500 font-medium">Access your AI wine analyses and history.</p>
                </div>

                <div class="space-y-6">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                        <input type="email" id="login-email" placeholder="hello@example.com" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl focus:bg-white focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 block px-5 py-4 transition-all outline-none">
                    </div>
                    
                    <div>
                        <div class="flex justify-between items-center mb-2 ml-1">
                            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
                         
                        </div>
                        <input type="password" id="login-password" placeholder="••••••••" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl focus:bg-white focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 block px-5 py-4 transition-all outline-none">
                    </div>

                    <button onclick="window.handleLogin()" class="w-full bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 text-white font-bold rounded-2xl text-lg px-5 py-4 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 mt-4">
                        Sign In
                    </button>
                </div>

                <div class="mt-8 text-center">
                    <p class="text-sm text-gray-600 font-medium">
                        Don't have an account? 
                        <button onclick="window.routeTo('signup')" class="text-rose-700 font-bold hover:text-rose-800 transition-colors ml-1">Sign up</button>
                    </p>
                </div>
            </div>
        </div>
    `;
};