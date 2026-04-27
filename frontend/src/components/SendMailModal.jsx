import { useEffect, useState } from 'react';

const getDefaultMail = (user) => ({
  subject: `Message for ${user?.name || 'User'}`,
  message: ''
});

const SendMailModal = ({ isOpen, user, onClose, onSend, isSending }) => {
  const [mailData, setMailData] = useState(() => getDefaultMail(user));

  useEffect(() => {
    if (isOpen) {
      setMailData(getDefaultMail(user));
    }
  }, [isOpen, user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mailData.subject.trim() || !mailData.message.trim()) {
      return;
    }
    onSend({
      subject: mailData.subject.trim(),
      message: mailData.message.trim()
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold">Send Email</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">To</label>
            <input
              type="text"
              value={user?.email || ''}
              disabled
              className="w-full border rounded-xl px-4 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <input
              type="text"
              value={mailData.subject}
              onChange={(e) => setMailData((prev) => ({ ...prev, subject: e.target.value }))}
              required
              className="w-full border rounded-xl px-4 py-2.5 bg-gray-50 dark:bg-slate-900 dark:border-slate-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              rows={6}
              value={mailData.message}
              onChange={(e) => setMailData((prev) => ({ ...prev, message: e.target.value }))}
              required
              className="w-full border rounded-xl px-4 py-2.5 bg-gray-50 dark:bg-slate-900 dark:border-slate-600 resize-none"
              placeholder="Write your message here..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border py-2.5 rounded-xl">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSending ? 'Sending...' : 'Send Email'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SendMailModal;