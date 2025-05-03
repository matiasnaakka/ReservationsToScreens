import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import PropTypes from 'prop-types';

/**
 * LoginRegister component handles user authentication
 * @param {Object} props - Component props
 * @param {Function} props.onLoginSuccess - Callback function called after successful login
 * @returns {JSX.Element} Login/Register form
 */
const LoginRegister = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdmin = async (userEmail) => {
    try {
      setIsLoading(true);
      const adminRef = doc(db, 'admins', userEmail);
      const adminDoc = await getDoc(adminRef);
      setIsAdmin(adminDoc.exists());
      return adminDoc.exists();
    } catch (err) {
      console.error('Admin check error:', err);
      setError('Failed to verify admin status');
      setIsAdmin(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isLogin) {
        await loginUser(email, password);
        const isAdminUser = await checkAdmin(email);
        onLoginSuccess();
        navigate(isAdminUser ? '/dashboard' : '/noadminrights');
      } else {
        await registerUser(email, password);
        alert('User registered successfully');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleAuth} className="mb-6">
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm" role="alert">{error}</p>}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isLogin ? 'Login' : 'Register'}
        </button>
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
         className="w-full flex justify-center py-2 px-4 mt-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isLogin ? 'Switch to Register' : 'Switch to Login'}
        </button>
      </form>
    </div>
  );
};

LoginRegister.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired
};

export default LoginRegister;
