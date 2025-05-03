import { memo } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Dashboard component that provides navigation to Setup and Edit pages
 * @component
 * @returns {JSX.Element} Dashboard with navigation links
 */
const Dashboard = memo(() => {
  // Custom button component for consistent styling and accessibility
  const NavigationCard = ({ to, title, description }) => (
    <Link
      to={to}
      className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow
                  border hover:border-orange focus:outline-none
                 focus:ring-2 focus:ring-orange focus:ring-offset-2"
      aria-label={`Navigate to ${title}`}
    >
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Link>
  );

  NavigationCard.propTypes = {
    to: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Room Management Dashboard
        </h1>
        <p className="text-gray-600">
          Welcome to the room management system. Choose an option below to get started.
        </p>
      </header>

      <main className="grid gap-6 md:grid-cols-2">
        <NavigationCard
          to="/setup"
          title="System Setup"
          description="Initialize and configure the room management system. Import initial data and configure system settings."
        />

        <NavigationCard
          to="/edit"
          title="Edit Data"
          description="Modify room information and business hours. Update, add, or remove room and campus data."
        />
      </main>

      <footer className="mt-8 text-center text-sm text-gray-500">
        <p className=' underline'>Select an option above to manage room and campus data.</p>
      </footer>
    </div>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
