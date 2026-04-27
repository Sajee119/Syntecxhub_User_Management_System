import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import adminHubLogo from '../assets/AdminHub-logo.png';


const Login = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [email, setEmail] = useState('admin@adminhub.com');
  const [password, setPassword] = useState('admin123');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDark] = useState(() => {
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
      <ThemeToggle />

      <div className="w-full max-w-md login-card">
        

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="text-center mb-8">
              <img src={adminHubLogo} alt="AdminHub logo" className="h-20 w-20 margin-center object-contain" />
              
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
                    className="w-full px-4 py-3 border border-slate-200 text-white-400 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 transition input-focus-effect pr-12"
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
                    className="rounded border-slate-300 text-indigo-600 dark:text-white-400 focus:ring-indigo-500"
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
            <p className="text-center text-xs text-blue-600 dark:text-white-400 mt-6">
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