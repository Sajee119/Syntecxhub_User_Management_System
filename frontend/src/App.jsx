import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Account from './pages/Account';
import About from './pages/About';
import BackendLoadingScreen from './components/BackendLoadingScreen';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import { API_BASE_URL } from './services/api';

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-indigo-600"></i>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" replace />} />
      <Route path="/account" element={user ? <Account /> : <Navigate to="/login" replace />} />
      <Route path="/about" element={user ? <About /> : <Navigate to="/login" replace />} />
      <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
};

function App() {
  const [isBackendReady, setIsBackendReady] = useState(false);
  const [attempts, setAttempts] = useState(1);

  useEffect(() => {
    let cancelled = false;

    const checkBackend = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/health`, { cache: 'no-store' });
        if (!cancelled && response.ok) {
          setIsBackendReady(true);
          return;
        }

        if (!cancelled) {
          setAttempts((prev) => prev + 1);
          setTimeout(checkBackend, 2000);
        }
      } catch {
        if (!cancelled) {
          setAttempts((prev) => prev + 1);
          setTimeout(checkBackend, 2000);
        }
      }
    };

    checkBackend();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!isBackendReady) {
    return <BackendLoadingScreen attempts={attempts} />;
  }

  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="colored"
        />
      </Router>
    </AuthProvider>
  );
}

export default App;