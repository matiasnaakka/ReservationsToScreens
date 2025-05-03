import { memo } from 'react';
import PropTypes from 'prop-types';
import universityIcon from '../assets/university.png';

/**
 * Header component that displays the main navigation bar
 * @param {Object} props - Component props
 * @param {string} props.title - The title to display in the header
 * @returns {JSX.Element} Header component
 */
const Header = memo(({ title = 'Room Management' }) => {
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

          {/* Title Section */}
          <div className="mt-4 sm:mt-0">
            <h1
              className="text-2xl font-bold text-gray-800 text-center sm:text-left"
              tabIndex="0"
            >
              {title}
            </h1>
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
  title: PropTypes.string
};

// Default props
Header.defaultProps = {
  title: 'Rooms Content Management'
};

export default Header;
