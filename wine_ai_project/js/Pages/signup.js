export const Signup = () => {
    return `
        <div class="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
            <div class="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 md:p-10">
                
                <div class="text-center mb-8">
                    <div class="w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-md">
                        <span class="text-2xl text-white font-serif font-bold">V</span>
                    </div>
                    <h2 class="text-3xl font-serif text-gray-900 tracking-tight font-bold mb-2">Create Account</h2>
                    <p class="text-sm text-gray-500 font-medium">Join the future of digital sommeliery.</p>
                </div>

                <div class="space-y-5">
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Full Name</label>
                        <input type="text" id="signup-name" placeholder="John Doe" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl focus:bg-white focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 block px-5 py-3 transition-all outline-none">
                    </div>

                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Email Address</label>
                        <input type="email" id="signup-email" placeholder="hello@example.com" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl focus:bg-white focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 block px-5 py-3 transition-all outline-none">
                    </div>
                    
                    <div>
                        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Password</label>
                        <input type="password" id="signup-password" placeholder="••••••••" class="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-2xl focus:bg-white focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 block px-5 py-3 transition-all outline-none">
                    </div>

                    <div id="signup-message" class="text-sm font-bold text-center mt-2 min-h-[20px]"></div>

                    <button onclick="window.handleSignup()" class="w-full bg-gradient-to-r from-rose-700 to-rose-900 hover:from-rose-800 hover:to-red-900 text-white font-bold rounded-2xl text-lg px-5 py-4 shadow-[0_10px_20px_rgba(225,29,72,0.3)] hover:shadow-[0_15px_30px_rgba(225,29,72,0.4)] transform hover:-translate-y-1 transition-all duration-300 mt-2">
                        Create Account
                    </button>
                </div>

                <div class="mt-8 text-center">
                    <p class="text-sm text-gray-600 font-medium">
                        Already have an account? 
                        <button onclick="window.routeTo('login')" class="text-rose-700 font-bold hover:text-rose-800 transition-colors ml-1">Sign in</button>
                    </p>
                </div>
            </div>
        </div>
    `;
};