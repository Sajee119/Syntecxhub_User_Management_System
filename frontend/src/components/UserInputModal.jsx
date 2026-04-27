import { useState } from 'react';

const getInitialFormData = (editingUser) => {
  if (editingUser) {
    return {
      name: editingUser.name,
      email: editingUser.email,
      age: editingUser.age || '',
      city: editingUser.city || '',
      role: editingUser.role,
      status: editingUser.status
    };
  }

  return {
    name: '',
    email: '',
    age: '',
    city: '',
    role: 'Viewer',
    status: 'Active'
  };
};

const UserInputModal = ({ isOpen, onClose, onSave, editingUser, existingUsers }) => {
  const [formData, setFormData] = useState(() => getInitialFormData(editingUser));
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email) => {
    return /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]+$/.test(email);
  };

  const isEmailUnique = (email, excludeId = null) => {
    return !existingUsers.some(u => u.email.toLowerCase() === email.trim().toLowerCase() && u._id !== excludeId && u.id !== excludeId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert("Name required");
      return;
    }
    
    if (!formData.email || !validateEmail(formData.email)) {
      setEmailError("Invalid email");
      return;
    }
    
    if (!isEmailUnique(formData.email, editingUser?._id || editingUser?.id)) {
      setEmailError("Email already taken");
      return;
    }
    
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 modal-transition">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 modal-card">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 px-6 py-4">
          <h3 className="text-xl font-bold">{editingUser ? 'Edit User' : 'Add New User'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full name *</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required 
              className="w-full border rounded-xl px-4 py-2.5 bg-gray-50 dark:bg-slate-900 dark:border-slate-600"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                setEmailError('');
              }}
              required 
              className="w-full border rounded-xl px-4 py-2.5 bg-gray-50 dark:bg-slate-900"
            />
            {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label>Age</label>
              <input 
                type="number" 
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="w-full border rounded-xl px-4 py-2.5 bg-gray-50 dark:bg-slate-900"
              />
            </div>
            <div>
              <label>City</label>
              <input 
                type="text" 
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g., New York" 
                className="w-full border rounded-xl px-4 py-2.5"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label>Role</label>
              <select 
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full border rounded-xl px-4 py-2.5"
              >
                <option>Admin</option>
                <option>Manager</option>
                <option>Editor</option>
                <option>Viewer</option>
              </select>
            </div>
            <div>
              <label>Status</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full border rounded-xl px-4 py-2.5"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>
          
          {!editingUser && (
            <div>
              <label>Password (default: default123)</label>
              <input 
                type="text" 
                placeholder="Password will be set to default123" 
                disabled
                className="w-full border rounded-xl px-4 py-2.5 bg-gray-100 dark:bg-slate-800 text-gray-500"
              />
            </div>
          )}
          
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border py-2.5 rounded-xl">Cancel</button>
            <button type="submit" className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl">Save User</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserInputModal;