import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * NoAdminRights component displays a message for users without admin privileges
 * @returns {JSX.Element} No admin rights message page
 */
const NoAdminRights = () => {
  const navigate = useNavigate();

  /**
   * Handles navigation back to the login page
   * @param {Event} e - Click event
   */
  const handleBackToLogin = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-50"
      role="main"
      aria-labelledby="no-access-heading"
    >
      <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1
            id="no-access-heading"
            className="text-2xl font-bold text-gray-900 mb-4"
          >
            No Admin Rights
          </h1>
          <p
            className="text-gray-600 mb-6"
            role="alert"
          >
            Sorry, you don't have admin rights yet. Please contact your system administrator for access.
          </p>
          <button
            onClick={handleBackToLogin}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            aria-label="Return to login page"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

NoAdminRights.propTypes = {};

export default React.memo(NoAdminRights);
