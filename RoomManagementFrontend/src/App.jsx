import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import LoginRegister from './views/main/LoginRegister';
import Setup from './views/main/Setup';
import Edit from './views/main/Edit';
import Dashboard from './views/main/Dashboard';
import Header from './views/Header';
import NoAdminRights from './views/main/NoAdminRights';

const API_URL = import.meta.env.VITE_APP_API_URL;

/**
 * Protected Route wrapper component
 */
const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * Checks if the JWT token is valid by calling the backend
   * @returns {Promise<boolean>}
   */
  const checkTokenValidity = useCallback(async () => {
    const token = localStorage.getItem('roomsmanagement_token');
    if (!token) return false;
    try {
      const response = await fetch(`${API_URL}/api/token/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      return response.ok && data.valid;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    (async () => {
      const valid = await checkTokenValidity();
      setIsAuthenticated(valid);
      if (!valid) {
        localStorage.removeItem('roomsmanagement_token');
      }
    })();
  }, [checkTokenValidity]);

  const handleLoginSuccess = async () => {
    const valid = await checkTokenValidity();
    setIsAuthenticated(valid);
    if (!valid) {
      localStorage.removeItem('roomsmanagement_token');
      // Optionally, show a message to the user here
    }
  };

  const basename = import.meta.env.MODE === 'production' ? '/roomsmanagement/' : '/';

  return (
    <Router basename={basename}>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="px-4 py-6 mx-auto max-w-7xl">
          <Routes>
            <Route
              path="/"
              element={<LoginRegister onLoginSuccess={handleLoginSuccess} />}
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/setup"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Setup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <Edit />
                </ProtectedRoute>
              }
            />
            <Route path="/noadminrights" element={<NoAdminRights />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
