import { memo, useState } from 'react';
import { db } from '../../config/firebase';
import { collection, writeBatch, doc, setDoc } from 'firebase/firestore';
import roomsData from '../../data/rooms.json';
import businessHoursData from '../../data/businesshours.json';

/**
 * Setup component for initial system configuration and data import
 * @returns {JSX.Element} Setup page component
 */
const Setup = memo(() => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  /**
   * Imports room data into Firestore as a single document
   * @returns {Promise<void>}
   */
  const importRoomsData = async () => {
    try {
      const metropoliaDataRef = collection(db, 'MetropoliaData');
      const roomsDocRef = doc(metropoliaDataRef, 'rooms');

      // Create a rooms object with roomNumber as keys
      const roomsObject = {
        rooms: roomsData.reduce((acc, room) => {
          acc[room.roomNumber] = room;
          return acc;
        }, {})
      };

      await setDoc(roomsDocRef, roomsObject);
    } catch (error) {
      console.error('Error importing rooms:', error);
      throw new Error('Failed to import rooms data');
    }
  };

  /**
   * Imports business hours data into Firestore using batch writes
   * @returns {Promise<void>}
   */
  const importBusinessHoursData = async () => {
    try {
      const batch = writeBatch(db);
      const metropoliaDataRef = collection(db, 'MetropoliaData');
      const businessHoursRef = doc(metropoliaDataRef, 'businesshours');
  
      const updatedData = businessHoursData.campuses.map(campus => ({
        ...campus,
        imageUrl: campus.imageUrl || 'https://defaultimage.com/default.jpg' // Default image if none provided
      }));
  
      batch.set(businessHoursRef, { campuses: updatedData });
      await batch.commit();
    } catch (error) {
      console.error('Error importing business hours:', error);
      throw new Error('Failed to import business hours data');
    }
  };
  

  /**
   * Handles the data import process with error handling
   * @param {React.MouseEvent} e - Click event
   */
  const handleImportData = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await importRoomsData();
      await importBusinessHoursData();
      setSuccess('Data imported successfully!');
    } catch (err) {
      setError(`Error importing data: ${err.message}`);
      console.error('Import error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">System Setup</h2>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Data Import</h3>
        <p className="text-gray-600 mb-4">
          Import rooms and business hours data into the Firestore database.
        </p>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded" role="alert">
            {success}
          </div>
        )}

        <button
          onClick={handleImportData}
          disabled={isLoading}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
            ${isLoading ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'}
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors
            disabled:cursor-not-allowed`}
          aria-busy={isLoading}
        >
          {isLoading ? 'Importing Data...' : 'Import Data'}
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Data Summary</h3>
        <div className="space-y-2">
          <p className="text-gray-600">
            Rooms to import: {roomsData.length}
          </p>
          <p className="text-gray-600">
            Campuses to import: {businessHoursData.campuses.length}
          </p>
        </div>
      </div>
    </div>
  );
});

Setup.displayName = 'Setup';

export default Setup;
