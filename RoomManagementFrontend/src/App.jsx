import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import LoginRegister from './views/main/LoginRegister';
import Edit from './views/main/Edit';
import Dashboard from './views/main/Dashboard';
import Header from './views/Header';
import NoAdminRights from './views/main/NoAdminRights';

const API_URL = import.meta.env.VITE_APP_API_URL;

/**
 * Protected Route wrapper component
 */
const ProtectedRoute = ({ isAuthenticated, authChecking, children }) => {
  // If still checking auth status, show loading
  if (authChecking) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  // Only redirect if auth check is complete and user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true); // Add a loading state

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
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      return response.ok && data.valid;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    // Start with authChecking=true
    setAuthChecking(true);

    (async () => {
      const valid = await checkTokenValidity();
      setIsAuthenticated(valid);
      if (!valid) {
        localStorage.removeItem('roomsmanagement_token');
      }
      // Auth check is complete
      setAuthChecking(false);
    })();
  }, [checkTokenValidity]);
  const handleLoginSuccess = async () => {
    const valid = await checkTokenValidity();
    setIsAuthenticated(valid);
    if (!valid) {
      localStorage.removeItem('roomsmanagement_token');
    }
  };

  /**
   * Handles user logout
   * Clears the authentication token and updates authentication state
   */
  const handleLogout = () => {
    localStorage.removeItem('roomsmanagement_token');
    setIsAuthenticated(false);
  };

  const basename = import.meta.env.MODE === 'production' ? '/roomsmanagement/' : '/';

  return (
    <Router basename={basename}>
      <div className="min-h-screen bg-gray-100">
        <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
        <main className="px-4 py-6 mx-auto max-w-7xl">
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <LoginRegister onLoginSuccess={handleLoginSuccess} />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} authChecking={authChecking}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated} authChecking={authChecking}>
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
