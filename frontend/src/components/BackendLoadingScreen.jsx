import { useEffect, useState } from 'react';
import adminHubLogo from '../assets/AdminHub-logo.png';

const MESSAGES = [
  'Waking up user service...',
  'Connecting to Network...',
  'Preparing your dashboard...'
];

const BackendLoadingScreen = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl p-8 text-center">
        <div className="flex items-center justify-center h-full">
            <img src={adminHubLogo} alt="AdminHub logo" className="h-20 w-20 object-contain" />
        </div>

        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Starting AdminHub</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{MESSAGES[messageIndex]}</p>

        <div className="mt-5 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-indigo-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default BackendLoadingScreen;
