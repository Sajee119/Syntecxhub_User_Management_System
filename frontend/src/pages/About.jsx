import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import ConfirmationModal from '../components/ConfirmationModal';
import developerProfile from '../assets/developer-profile.png';

const About = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [confirmationConfig, setConfirmationConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  const initTheme = () => {
    const savedTheme = localStorage.getItem('dashboardTheme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    setIsDark(dark);
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleAddUser = () => {
    navigate('/dashboard');
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    initTheme();
  }, []);

  return (
    <div className={`bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 theme-transition min-h-screen ${isDark ? 'dark' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3">
              <i className="fas fa-users-gear text-indigo-500 text-3xl"></i>
              <span>User Management</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Manage users, roles, access & advanced analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />

            <button
              onClick={handleAddUser}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition"
            >
              <i className="fas fa-plus-circle"></i> <span className="hidden sm:inline">Add user</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full pl-2 pr-3 py-1.5 shadow-sm hover:shadow-md transition"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {user?.name?.charAt(0) || 'AD'}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-semibold">{user?.name || 'Admin User'}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{user?.role || 'Super Admin'}</p>
                </div>
                <i className="fas fa-chevron-down text-xs text-slate-400"></i>
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-20 overflow-hidden">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex gap-3">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                      {user?.name?.charAt(0) || 'AD'}
                    </div>
                    <div>
                      <h4 className="font-bold">{user?.name || 'Admin User'}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-full">
                        {user?.role || 'Super Admin'}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Account created:</span>
                      <span className="font-medium">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-700 my-2"></div>
                    <Link
                      to="/account"
                      className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-lg transition"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <i className="fas fa-user-circle w-5"></i>
                      <span>My Account</span>
                    </Link>
                    <div className="border-t border-slate-100 dark:border-slate-700 my-2"></div>
                    <Link
                      to="/about"
                      className="flex items-center gap-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-lg transition"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <i className="fas fa-info-circle w-5"></i>
                      <span>About</span>
                    </Link>
                    <div className="border-t border-slate-100 dark:border-slate-700 my-2"></div>
                    <button
                      onClick={() => setConfirmationConfig({ isOpen: true, title: 'Sign Out', message: 'Are you sure you want to sign out?', onConfirm: logout })}
                      className="w-full text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg transition"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i> Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* About Content */}
        <div className="space-y-8">
          {/* Platform Overview Section */}
          <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
                <span className="text-indigo-500"><i className="fas fa-rocket"></i></span>
                About AdminHub
              </h2>
              <div className="space-y-4 text-slate-600 dark:text-slate-300">
                <p>
                  AdminHub is a comprehensive user management dashboard designed to streamline administrative tasks
                  and provide efficient user management capabilities. Built with modern web technologies, AdminHub
                  offers a seamless experience for managing users, roles, and access controls.
                </p>
                <p>
                  Our platform provides real-time analytics, advanced filtering options, and a responsive interface
                  that works across all devices. Whether you are a small business owner or part of a large enterprise,
                  AdminHub scales to meet your needs.
                </p>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
                <span className="text-indigo-500"><i className="fas fa-star"></i></span>
                Key Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/40 p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-users text-xl"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">User Management</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Complete CRUD operations for user accounts</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/40 p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-chart-line text-xl"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Real-time Analytics</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Track user statistics and metrics</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/40 p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-search text-xl"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Advanced Filtering</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Search and filter users efficiently</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/40 p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-moon text-xl"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Dark Mode</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Comfortable viewing in any lighting</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/40 p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-shield-alt text-xl"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Secure Authentication</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">JWT-based authentication with refresh tokens</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/40 p-5 shadow-sm hover:shadow-md transition">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-mobile-alt text-xl"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Responsive Design</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Works seamlessly on all devices</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Tech Stack Section */}
          <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
                <span className="text-indigo-500"><i className="fas fa-code"></i></span>
                Technology Stack
              </h2>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium">React 18</span>
                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium">Node.js</span>
                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium">Express.js</span>
                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium">MongoDB</span>
                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium">Tailwind CSS</span>
                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium">JWT</span>
                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium">Axios</span>
                <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-medium">Vite</span>
              </div>
            </div>
          </section>

          {/* Developer Section */}
          <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
                <span className="text-indigo-500"><i className="fa-solid fa-code"></i></span>
                Developer
              </h2>
              <div className="about-page-developer flex flex-col md:flex-row gap-8">
                <div className="about-page-developer-img flex-shrink-0">
                  <div className="w-48 h-48 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    {developerProfile ? (
                      <img
                        src={developerProfile}
                        alt="Sivanadarajah Sajeepan - Developer Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-white text-6xl font-bold">SS</div>
                    )}
                  </div>
                </div>
                <div className="about-page-developer-info flex-1">
                  <h3 className="text-2xl font-bold mb-2">Sivanadarajah Sajeepan</h3>
                  <p className="text-indigo-600 dark:text-indigo-400 font-semibold mb-1">Software Engineer</p>
                  <p className="text-slate-500 dark:text-slate-400 mb-4">Full Stack Developer</p>
                  <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                    Sajeepan is a passionate full stack developer with expertise in building modern web applications.
                    With a strong background in JavaScript, React, and Node.js, Sajeepan is dedicated to creating seamless
                    user experiences and efficient code. When not coding, Sajeepan enjoys hiking and exploring new technologies.
                  </p>
                  <div className="about-page-developer-contact space-y-2 mb-6">
                    <p className="flex items-center gap-3 text-sm">
                      <span className="text-indigo-500 w-5"><i className="fa-solid fa-envelope"></i></span>
                      <span className="text-slate-600 dark:text-slate-300">Sajeepan634@gmail.com</span>
                    </p>
                    <p className="flex items-center gap-3 text-sm">
                      <span className="text-indigo-500 w-5"><i className="fa-solid fa-phone"></i></span>
                      <span className="text-slate-600 dark:text-slate-300">+94783566823</span>
                    </p>
                  </div>
                  <div className="about-page-developer-links flex flex-wrap gap-3">
                    <a
                      href="https://www.linkedin.com/in/sivanadaraja-sajeepan/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm font-medium"
                    >
                      <i className="fa-brands fa-linkedin"></i> LinkedIn
                    </a>
                    <a
                      href="https://github.com/Sajee119"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition text-sm font-medium"
                    >
                      <i className="fa-brands fa-github"></i> GitHub
                    </a>
                    <a
                      href="https://x.com/SSajeepan3492"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-lg transition text-sm font-medium"
                    >
                      <i className="fa-brands fa-x-twitter"></i> X
                    </a>
                    <a
                      href="mailto:Sajeepan634@gmail.com"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-sm font-medium"
                    >
                      <i className="fa-solid fa-envelope"></i> Email
                    </a>
                    <a
                      href="https://sajeepan-portfolio.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition text-sm font-medium"
                    >
                      <i className="fa-solid fa-briefcase"></i> Portfolio
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Version Info Section */}
          <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-bold flex items-center gap-3 mb-4">
                <span className="text-indigo-500"><i className="fas fa-tag"></i></span>
                Version Information
              </h2>
              <div className="space-y-1 text-slate-600 dark:text-slate-300">
                <p><strong>Current Version:</strong> 1.0.0</p>
                <p><strong>Release Date:</strong> April, 2026</p>
                <p><strong>License:</strong> MIT</p>
                <p><strong>Support:</strong> For support inquiries, please contact the development team.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <ConfirmationModal
        isOpen={confirmationConfig.isOpen}
        title={confirmationConfig.title}
        message={confirmationConfig.message}
        onConfirm={() => confirmationConfig.onConfirm && confirmationConfig.onConfirm()}
        onCancel={() => setConfirmationConfig({ isOpen: false, title: '', message: '', onConfirm: null })}
      />
    </div>
  );
};

export default About;
