import { memo } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import universityIcon from '../assets/university.png';

/**
 * Header component that displays the main navigation bar
 * @param {Object} props - Component props
 * @param {string} props.title - The title to display in the header
 * @param {boolean} props.isAuthenticated - Whether the user is authenticated
 * @param {Function} props.onLogout - Logout handler function
 * @returns {JSX.Element} Header component
 */
const Header = memo(({ title = 'Room Management', isAuthenticated = false, onLogout }) => {
  const navigate = useNavigate();
  
  /**
   * Handles user logout
   * Clears the authentication token and redirects to login page
   */
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    navigate('/', { replace: true });
  };

  return (
    <header role="banner">
      <nav
        className="bg-white shadow-lg"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-wrap items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-800 text-orange">
              Metropolia
            </h1>
            <img
              src={universityIcon} // Replace with the path to your icon
              alt="Metropolia Icon"
              className="h-8 w-8"
            />
          </div>

          {/* Title and Logout Section */}
          <div className="flex items-center space-x-4">
            <h1
              className="text-2xl font-bold text-gray-800 text-center sm:text-left"
              tabIndex="0"
            >
              {title}
            </h1>            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-orange hover:bg-amber-600 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange"
                aria-label="Logout"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
});

// Add display name for debugging
Header.displayName = 'Header';

// PropTypes for type checking
Header.propTypes = {
  title: PropTypes.string,
  isAuthenticated: PropTypes.bool,
  onLogout: PropTypes.func
};

// Default props
Header.defaultProps = {
  title: 'Rooms Content Management'
};

export default Header;
