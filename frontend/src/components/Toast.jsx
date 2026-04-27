import { useEffect } from 'react';

const Toast = ({ id, message, type, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <i className="fas fa-check-circle"></i>;
      case 'error':
        return <i className="fas fa-exclamation-circle"></i>;
      case 'warning':
        return <i className="fas fa-exclamation-triangle"></i>;
      case 'info':
        return <i className="fas fa-info-circle"></i>;
      default:
        return <i className="fas fa-bell"></i>;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-300';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-300';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 text-yellow-700 dark:text-yellow-300';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-700 dark:text-blue-300';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 border-gray-500 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div
      className={`toast-notification flex items-center gap-3 p-4 rounded-lg shadow-lg border-l-4 transform transition-all duration-300 ease-in-out ${getStyles()}`}
    >
      <div className="text-xl">{getIcon()}</div>
      <div className="flex-1 text-sm font-medium">{message}</div>
      <button
        onClick={() => onClose(id)}
        className="ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
      >
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

export default Toast;