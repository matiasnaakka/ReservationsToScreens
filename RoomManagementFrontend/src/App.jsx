import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LoginRegister from './views/main/LoginRegister';
import Setup from './views/main/Setup';
import Edit from './views/main/Edit';
import Dashboard from './views/main/Dashboard';
import Header from './views/Header';
import NoAdminRights from './views/main/NoAdminRights';

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

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
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
