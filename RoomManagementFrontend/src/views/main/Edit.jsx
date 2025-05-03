import { memo, useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RoomsAccordion from '../../components/RoomsAccordion';
import CampusAccordion from '../../components/CampusAccordion';

/**
 * Edit component for managing rooms and business hours data
 * @returns {JSX.Element} Edit page component
 */
const Edit = memo(() => {
  const [rooms, setRooms] = useState({});
  const [businessHours, setBusinessHours] = useState({ campuses: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch existing data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const metropoliaDataRef = collection(db, 'MetropoliaData');
        const roomsDoc = await getDoc(doc(metropoliaDataRef, 'rooms'));
        const businessHoursDoc = await getDoc(doc(metropoliaDataRef, 'businesshours'));

        if (roomsDoc.exists()) {
          setRooms(roomsDoc.data().rooms || {});
        }
        if (businessHoursDoc.exists()) {
          setBusinessHours(businessHoursDoc.data() || { campuses: [] });
        }
      } catch (err) {
        setError('Error loading data: ' + err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Save all changes
  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const metropoliaDataRef = collection(db, 'MetropoliaData');

      await setDoc(doc(metropoliaDataRef, 'rooms'), { rooms });
      await setDoc(doc(metropoliaDataRef, 'businesshours'), businessHours);

      setSuccess('Changes saved successfully!');
    } catch (err) {
      setError('Error saving changes: ' + err.message);
      console.error('Error saving data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Data</h2>

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

      <div className="space-y-4">
        <RoomsAccordion
          rooms={rooms}
          setRooms={setRooms}
          setError={setError}
          setSuccess={setSuccess}
        />

        <CampusAccordion businessHours={businessHours} setBusinessHours={setBusinessHours} />
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleSave}
          disabled={loading}
          className={`px-6 py-2 ${loading ? ' bg-red' : ' bg-blue hover:bg-indigo-950'}
            text-white rounded transition-colors`}
        >
          {loading ? 'Saving...' : 'Save all Changes'}
        </button>
      </div>
    </div>
  );
});

Edit.displayName = 'Edit';

export default Edit;
