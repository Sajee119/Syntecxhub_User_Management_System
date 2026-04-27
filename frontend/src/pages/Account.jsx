import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ThemeToggle from '../components/ThemeToggle';
import ConfirmationModal from '../components/ConfirmationModal';

const Account = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    age: '',
    city: '',
    role: '',
    status: '',
    createdAt: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [confirmationConfig, setConfirmationConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: null });

  const initTheme = () => {
    const savedTheme = localStorage.getItem('dashboardTheme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await api.get('/auth/profile');
      setProfileData({
        name: response.data.name || '',
        email: response.data.email || '',
        age: response.data.age || '',
        city: response.data.city || '',
        role: response.data.role || '',
        status: response.data.status || '',
        createdAt: response.data.createdAt || new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile data' });
    }
  };

  useEffect(() => {
    initTheme();
    if (!user) {
      navigate('/login');
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.put(`/users/${user._id || user.id}`, {
        name: profileData.name,
        age: profileData.age ? parseInt(profileData.age, 10) : null,
        city: profileData.city
      });

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);

      if (response.data.user) {
        await fetchProfile();
      }

      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update profile'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to change password'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setConfirmationConfig({
      isOpen: true,
      title: 'Delete Account',
      message: 'Are you sure you want to delete your account? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await api.delete(`/users/${user._id || user.id}`);
          await logout();
          navigate('/login');
        } catch {
          setMessage({ type: 'error', text: 'Failed to delete account' });
          setConfirmationConfig({ isOpen: false, title: '', message: '', onConfirm: null });
        }
      }
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleAddUser = () => {
    navigate('/dashboard');
  };

  return (
    <div className="bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 theme-transition min-h-screen">
      
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

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 mb-6">
          <div className="border-b border-slate-200 dark:border-slate-700">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm transition ${
                  activeTab === 'profile'
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                <i className="fas fa-user"></i>
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm transition ${
                  activeTab === 'security'
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                <i className="fas fa-lock"></i>
                Security
              </button>
              <button
                onClick={() => setActiveTab('danger')}
                className={`py-4 px-1 inline-flex items-center gap-2 border-b-2 font-medium text-sm transition ${
                  activeTab === 'danger'
                    ? 'border-red-500 text-red-600 dark:text-red-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                <i className="fas fa-exclamation-triangle"></i>
                Danger Zone
              </button>
            </nav>
          </div>
        </div>

        {message.text && (
          <div className={`mb-6 rounded-lg p-4 ${
            message.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 text-green-700 dark:text-green-300'
              : 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-300'
          }`}>
            <div className="flex items-center gap-3">
              <i className={`fas ${message.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
              <p className="text-sm">{message.text}</p>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <i className="fas fa-id-card text-indigo-500"></i>
                  Personal Information
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
                  >
                    <i className="fas fa-edit"></i>
                    Edit Profile
                  </button>
                )}
              </div>

              {!isEditing ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-700">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                      {profileData.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{profileData.name}</h3>
                      <p className="text-slate-500 dark:text-slate-400">{profileData.role}</p>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-2 ${
                        profileData.status === 'Active'
                          ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600'
                      }`}>
                        <i className="fas fa-circle text-[6px]"></i>
                        {profileData.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                        <i className="fas fa-envelope mr-2"></i>Email Address
                      </label>
                      <p className="text-slate-900 dark:text-slate-100">{profileData.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                        <i className="fas fa-calendar-alt mr-2"></i>Age
                      </label>
                      <p className="text-slate-900 dark:text-slate-100">{profileData.age || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                        <i className="fas fa-map-marker-alt mr-2"></i>City
                      </label>
                      <p className="text-slate-900 dark:text-slate-100">{profileData.city || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                        <i className="fas fa-calendar-plus mr-2"></i>Member Since
                      </label>
                      <p className="text-slate-900 dark:text-slate-100">{formatDate(profileData.createdAt)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 transition"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Age</label>
                      <input
                        type="number"
                        value={profileData.age}
                        onChange={(e) => setProfileData({ ...profileData, age: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 transition"
                        min="18"
                        max="120"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">City</label>
                      <input
                        type="text"
                        value={profileData.city}
                        onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                        className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 transition"
                        placeholder="e.g., New York"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition flex items-center gap-2"
                    >
                      {loading ? (
                        <><i className="fas fa-spinner fa-spin"></i>Saving...</>
                      ) : (
                        <><i className="fas fa-save"></i>Save Changes</>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        fetchProfile();
                      }}
                      className="border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 px-6 py-2 rounded-lg font-medium transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <i className="fas fa-key text-indigo-500"></i>
                Change Password
              </h2>

              <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
                <div>
                  <label className="block text-sm font-medium mb-2">Current Password *</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 transition pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
                    >
                      <i className={`fas ${showCurrentPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">New Password *</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 transition pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
                    >
                      <i className={`fas ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Password must be at least 6 characters</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Confirm New Password *</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-gray-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 transition pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
                    >
                      <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition flex items-center gap-2"
                >
                  {loading ? (
                    <><i className="fas fa-spinner fa-spin"></i>Updating...</>
                  ) : (
                    <><i className="fas fa-key"></i>Change Password</>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'danger' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-red-600 dark:text-red-400 mb-4">
                <i className="fas fa-exclamation-triangle"></i>
                Danger Zone
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Once you delete your account, there is no going back. Please be certain.
              </p>

              <div className="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-900/10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-red-700 dark:text-red-300 mb-1">Delete Account</h3>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Permanently remove your personal account and all of your data.
                    </p>
                  </div>
                  <button
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition flex items-center gap-2 self-start"
                  >
                    <i className="fas fa-trash-alt"></i>
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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

export default Account;
