import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [email, setEmail] = useState('admin@adminhub.com');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('dashboardTheme') || localStorage.getItem('loginTheme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme === 'dark' || (!savedTheme && prefersDark);
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('dashboardTheme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);

    try {
      const result = await login(email, password, rememberMe);

      if (result.success) {
        navigate('/dashboard');
      } else {
        setPassword('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 theme-transition min-h-screen flex items-center justify-center p-4">
      <button 
        onClick={toggleTheme}
        className="fixed left-4 bottom-4 z-50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-3xl px-3 py-2 shadow-md hover:shadow-lg transition flex items-center text-sm font-medium"
        aria-label="Toggle theme"
      >
        <i className={`${isDark ? 'fas fa-sun' : 'fas fa-moon'} text-indigo-500 dark:text-amber-400`}></i>
      </button>

      <div className="w-full max-w-md login-card">
        

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-500 shadow-lg mb-4">
                <i className="fas fa-users-gear text-white text-3xl"></i>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">AdminHub Portal</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Sign in to manage your dashboard</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  <i className="fas fa-envelope mr-2 text-indigo-500"></i>Email Address
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  placeholder="admin@adminhub.com" 
                  className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 transition input-focus-effect"
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  <i className="fas fa-lock mr-2 text-indigo-500"></i>Password
                </label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                    placeholder="Enter your password" 
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 transition input-focus-effect pr-12"
                    autoComplete="current-password"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition"
                  >
                    <i className={`${showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Remember me</span>
                </label>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <><i className="fas fa-spinner fa-spin"></i><span>Signing in...</span></>
                ) : (
                  <><i className="fas fa-arrow-right-to-bracket"></i><span>Sign In</span></>
                )}
              </button>
            </form>

            {/* <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
              <div className="text-center text-xs text-slate-500 dark:text-slate-400 mb-3">
                <i className="fas fa-flask mr-1"></i> Demo Credentials
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-2 text-center">
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">admin@adminhub.com</span>
                  <p className="text-slate-400">Default email</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-2 text-center">
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">admin123</span>
                  <p className="text-slate-400">Default password</p>
                </div>
              </div>
            </div> */}
            <p className="text-center text-xs text-green-600 dark:text-green-400 mt-6">
              <i className="fas fa-envelope mr-1"></i> admin@adminhub.com • <i className="fas fa-lock mr-1"></i> admin123
            </p>
            <p className="text-center text-xs text-green-600 dark:text-green-400 mt-6">
              <i className="fas fa-shield-alt mr-1"></i> Secure admin access • Protected by encryption
            </p>

          </div>
        </div>

        
      </div>
    </div>
  );
};

export default Login;