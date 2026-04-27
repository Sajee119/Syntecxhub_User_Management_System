// components/UserTable.jsx
const UserTable = ({ users, onEdit, onDelete, onSendMail }) => {
  const escapeHtml = (str) => {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    });
  };

  const roleBadgeClasses = {
    Admin: 'bg-indigo-100 text-indigo-700',
    Manager: 'bg-blue-100 text-blue-700',
    Editor: 'bg-amber-100 text-amber-700',
    Viewer: 'bg-gray-100 text-gray-700'
  };

  const formatDateTime = (value) => {
    if (!value) return 'N/A';
    if (value === 'never') return 'Never';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'N/A';

    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (users.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="text-center py-10 text-slate-400 bg-white dark:bg-slate-800 text-sm">
          <i className="fas fa-user-slash mr-2"></i> No matching users
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="overflow-x-auto custom-scroll">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-900/50">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">User</th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Role</th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Age</th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">City</th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Last Login</th>
              <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Created At</th>
              <th className="px-4 py-4 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-800/40 dark:to-indigo-700/40 flex items-center justify-center font-semibold text-indigo-700 dark:text-indigo-300 text-sm">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{escapeHtml(user.name)}</p>
                      <p className="text-xs text-slate-400">{escapeHtml(user.email)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${roleBadgeClasses[user.role] || 'bg-gray-100'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {user.status === 'Active' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
                      <i className="fas fa-circle text-[6px]"></i> Active
                    </span>
                  ) : (
                    <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-700 text-slate-600">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                  {user.age || '—'}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                  {escapeHtml(user.city || '—')}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500">
                  {formatDateTime(user.lastLogin)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-slate-500">
                  {formatDateTime(user.createdAt)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  <button 
                    onClick={() => onSendMail(user)}
                    className="text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 p-2 rounded-lg mr-2 transition"
                    title="Send email"
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                  <button 
                    onClick={() => onEdit(user)}
                    className="text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 p-2 rounded-lg mr-2 transition"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button 
                    onClick={() => onDelete(user.id)}
                    className="text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 p-2 rounded-lg transition"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;