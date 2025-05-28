import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * LoginRegister component handles user authentication via Metropolia Streams API
 * @param {Object} props - Component props
 * @param {Function} props.onLoginSuccess - Callback function called after successful login
 * @returns {JSX.Element} Login/Register form
 */
const LoginRegister = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  /**
   * Handles authentication using Metropolia Streams API
   * @param {Event} e
   */
  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('https://streams.metropolia.fi/2.0/api/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      console.log('Login API response:', data);

      if (data.message === 'invalid username or password') {
        console.log('Login failed: invalid username or password');
        setError('Invalid username or password.');
        setLoading(false);
        return;
      }

      if (data.staff === true) {
        console.log('Login failed: staff account not allowed', data);
        setError('Staff accounts are not allowed to login.');
        setLoading(false);
        return;
      }

      if (data.user && data.staff === false) {
        console.log('Login success:', data);
        onLoginSuccess();
        navigate('/dashboard');
        return;
      }

      console.log('Login failed: unexpected response', data);
      setError('Unexpected response from authentication service.');
    } catch (err) {
      console.log('Login error:', err);
      setError(`Login failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleAuth} className="mb-6">
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            autoComplete="username"
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
            disabled={loading}
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
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
            disabled={loading}
          />
        </div>
        {error && <p className="text-red-500 text-sm" role="alert">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {/* Registration is not supported with this API */}
      </form>
    </div>
  );
};

LoginRegister.propTypes = {
  onLoginSuccess: PropTypes.func.isRequired
};

export default LoginRegister;
