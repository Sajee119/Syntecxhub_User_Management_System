import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import UserTable from '../components/UserTable';
import UserInputModal from '../components/UserInputModal';
import SendMailModal from '../components/SendMailModal';
import ConfirmationModal from '../components/ConfirmationModal';
import ThemeToggle from '../components/ThemeToggle';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, avgAge: 0, uniqueCities: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [mailTargetUser, setMailTargetUser] = useState(null);
  const [isSendMailModalOpen, setIsSendMailModalOpen] = useState(false);
  const [isSendingMail, setIsSendingMail] = useState(false);
  const [confirmationConfig, setConfirmationConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: null });
  const [loading, setLoading] = useState(true);

  const normalizeUsers = (rawUsers = []) => {
    return rawUsers.map((rawUser) => ({
      ...rawUser,
      id: rawUser.id || rawUser._id
    }));
  };

  const buildDerivedStats = (userList = []) => {
    const total = userList.length;
    const active = userList.filter((u) => u.status === 'Active').length;
    const ages = userList
      .map((u) => Number(u.age))
      .filter((age) => Number.isFinite(age) && age > 0);
    const avgAge = ages.length ? Math.round(ages.reduce((sum, age) => sum + age, 0) / ages.length) : 0;
    const uniqueCities = new Set(
      userList
        .map((u) => (u.city || '').trim().toLowerCase())
        .filter(Boolean)
    ).size;

    return { total, active, avgAge, uniqueCities };
  };

  const fetchUsers = useCallback(async () => {
    try {
      const response = await api.get('/users');
      const normalizedUsers = normalizeUsers(response.data || []);
      setUsers(normalizedUsers);
      setStats((previousStats) => ({
        ...previousStats,
        ...buildDerivedStats(normalizedUsers)
      }));
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get('/users/stats');
      const apiStats = response.data || {};
      setStats((previousStats) => ({
        ...previousStats,
        total: apiStats.total ?? apiStats.totalUsers ?? previousStats.total,
        active: apiStats.active ?? apiStats.activeUsers ?? previousStats.active,
        avgAge: apiStats.avgAge ?? previousStats.avgAge,
        uniqueCities: apiStats.uniqueCities ?? previousStats.uniqueCities
      }));
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      toast.error('Failed to load user stats');
    }
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers();
    fetchStats();
  }, [user, navigate, fetchUsers, fetchStats]);

  const getFilteredUsers = () => {
    const term = searchTerm.trim().toLowerCase();
    return users.filter(u => {
      const matchSearch = term === '' || u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term) || (u.city && u.city.toLowerCase().includes(term));
      const matchRole = roleFilter === 'all' || u.role === roleFilter;
      const matchStatus = statusFilter === 'all' || u.status === statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  const handleOpenSendMail = (selectedUser) => {
    setMailTargetUser(selectedUser);
    setIsSendMailModalOpen(true);
  };

  const handleSendMail = async ({ subject, message }) => {
    if (!mailTargetUser?.id) {
      toast.error('Invalid user selected for email');
      return;
    }

    setIsSendingMail(true);
    try {
      const response = await api.post(`/users/${mailTargetUser.id}/send-mail`, { subject, message });
      toast.success(`Email sent to ${mailTargetUser.email}`);
      if (response.data?.previewUrl) {
        toast.info(`Preview URL: ${response.data.previewUrl}`);
      }
      setIsSendMailModalOpen(false);
      setMailTargetUser(null);
    } catch (error) {
      const messageText = error.response?.data?.error || error.response?.data?.message || 'Failed to send email';
      toast.error(messageText);
    } finally {
      setIsSendingMail(false);
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, userData);
        toast.success('User updated successfully');
      } else {
        await api.post('/users', { ...userData, password: 'default123' });
        toast.success('User created successfully');
      }
      await fetchUsers();
      await fetchStats();
      setIsUserModalOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Failed to save user:', error);
      toast.error(error.response?.data?.message || 'Failed to save user');
    }
  };

  const handleDeleteUser = (userId) => {
    const userToDelete = users.find(u => u.id === userId);
    setConfirmationConfig({
      isOpen: true,
      title: 'Delete User',
      message: `Delete "${userToDelete?.name}" permanently?`,
      onConfirm: async () => {
        try {
          await api.delete(`/users/${userId}`);
          await fetchUsers();
          await fetchStats();
          toast.success('User deleted successfully');
          setConfirmationConfig({ isOpen: false, title: '', message: '', onConfirm: null });
        } catch (error) {
          console.error('Failed to delete user:', error);
          toast.error(error.response?.data?.message || 'Failed to delete user');
        }
      }
    });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setRoleFilter('all');
    setStatusFilter('all');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-indigo-600"></i>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 theme-transition min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Header */}
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
            
            {/* Admin Profile */}
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
            
            <button 
              onClick={handleAddUser}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition"
            >
              <i className="fas fa-plus-circle"></i> <span className="hidden sm:inline">Add user</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 flex items-center justify-between">
            <div><p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total users</p><p className="text-3xl font-bold mt-1">{stats.total}</p></div>
            <div className="h-12 w-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400"><i className="fas fa-users text-xl"></i></div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 flex items-center justify-between">
            <div><p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active users</p><p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{stats.active}</p></div>
            <div className="h-12 w-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600"><i className="fas fa-user-check text-xl"></i></div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 flex items-center justify-between">
            <div><p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Avg. Age</p><p className="text-3xl font-bold text-amber-600 dark:text-amber-400 mt-1">{stats.avgAge}</p></div>
            <div className="h-12 w-12 bg-amber-50 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600"><i className="fas fa-calendar-alt text-xl"></i></div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-5 flex items-center justify-between">
            <div><p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Cities</p><p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400 mt-1">{stats.uniqueCities}</p></div>
            <div className="h-12 w-12 bg-cyan-50 dark:bg-cyan-900/30 rounded-full flex items-center justify-center text-cyan-600"><i className="fas fa-city text-xl"></i></div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 md:p-5 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email or city..." 
                className="w-full pl-9 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-900 focus:bg-white dark:focus:bg-slate-800 transition" 
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="border border-slate-200 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-900 px-4 py-2.5 text-sm"
              >
                <option value="all">All roles</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-slate-200 dark:border-slate-600 rounded-xl bg-gray-50 dark:bg-slate-900 px-4 py-2.5 text-sm"
              >
                <option value="all">All status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <button 
                onClick={resetFilters}
                className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2"
              >
                <i className="fas fa-rotate-right text-xs"></i> Reset
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <UserTable 
          users={getFilteredUsers()} 
          onEdit={handleEditUser} 
          onDelete={handleDeleteUser} 
          onSendMail={handleOpenSendMail}
        />
      </div>

      {/* Modals */}
      <UserInputModal 
        key={`${isUserModalOpen ? 'open' : 'closed'}-${editingUser?._id || editingUser?.id || 'new'}`}
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setEditingUser(null);
        }}
        onSave={handleSaveUser}
        editingUser={editingUser}
        existingUsers={users}
      />

      <SendMailModal
        isOpen={isSendMailModalOpen}
        user={mailTargetUser}
        isSending={isSendingMail}
        onClose={() => {
          if (isSendingMail) return;
          setIsSendMailModalOpen(false);
          setMailTargetUser(null);
        }}
        onSend={handleSendMail}
      />

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

export default Dashboard;