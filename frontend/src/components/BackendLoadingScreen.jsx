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
        <div className="mx-auto h-16 w-16 rounded-2xl bg-white dark:bg-slate-700 p-2 border border-slate-200 dark:border-slate-600 mb-5">
          <img src={adminHubLogo} alt="AdminHub logo" className="h-full w-full object-contain" />
        </div>

        <div className="mx-auto h-16 w-16 relative mb-5">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-200 dark:border-indigo-900/50"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 border-r-indigo-500 animate-spin"></div>
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
