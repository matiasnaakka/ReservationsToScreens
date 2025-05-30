import { memo, useState, useEffect, useCallback } from 'react';
import RoomsAccordion from '../../components/RoomsAccordion';
import CampusAccordion from '../../components/CampusAccordion';

const API_URL = import.meta.env.VITE_APP_API_URL;
const token = localStorage.getItem('roomsmanagement_token');

/**
 * Edit component for managing rooms and business hours data via API
 * @returns {JSX.Element} Edit page component
 */
const Edit = memo(() => {
  const [rooms, setRooms] = useState({});
  const [businessHours, setBusinessHours] = useState({ campuses: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  /**
   * Fetch all rooms from backend
   */
  const fetchRooms = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/rooms/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: import.meta.env.VITE_APP_API_KEY
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }
      const roomsArr = await response.json();
      const roomsObj = roomsArr.reduce((acc, room) => {
        acc[room.roomNumber] = room;
        return acc;
      }, {});
      setRooms(roomsObj);
    } catch (error) {
      setError(error.message);
    }
  }, []);

  /**
   * Fetch all campus business hours from backend
   */
  const fetchBusinessHours = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/campuses/hours`, {
        headers: {
          Authorization: `Bearer ${token}`,
          apikey: import.meta.env.VITE_APP_API_KEY
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch business hours');
      }
      const data = await response.json();
      setBusinessHours(data);
    } catch (error) {
      setError(error.message);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      await fetchRooms();
      await fetchBusinessHours();
      setLoading(false);
    };
    loadData();
  }, [fetchRooms, fetchBusinessHours]);

  /**
   * Save room details to backend
   * @param {string} roomNumber
   * @param {object} updates
   */
  const saveRoom = async (roomNumber, updates) => {
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`${API_URL}/api/rooms/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          apikey: import.meta.env.VITE_APP_API_KEY // Add API key here
        },
        body: JSON.stringify({ roomNumber, updates })
      });
      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || 'Failed to update room');
      }
      const { room } = await response.json();
      setRooms(prev => ({ ...prev, [roomNumber]: room }));
      setSuccess(`Room ${roomNumber} updated successfully.`);
    } catch (err) {
      setError(`Error saving room: ${err.message}`);
    }
  };

  /**
   * Save campus hours to backend
   * @param {string} campusShorthand
   * @param {object} hours
   */
  const saveCampusHours = async (campusShorthand, hours) => {
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(`${API_URL}/api/campus/hours/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          apikey: import.meta.env.VITE_APP_API_KEY // Add API key here
        },
        body: JSON.stringify({ campusShorthand, hours })
      });
      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || 'Failed to update campus hours');
      }
      const { campus } = await response.json();
      setBusinessHours(prev => ({
        ...prev,
        campuses: prev.campuses.map(c =>
          c.shorthand === campusShorthand ? campus : c
        )
      }));
      setSuccess(`Campus ${campusShorthand} hours updated successfully.`);
    } catch (err) {
      setError(`Error saving campus hours: ${err.message}`);
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
          saveRoom={saveRoom}
        />

        <CampusAccordion
          businessHours={businessHours}
          setBusinessHours={setBusinessHours}
          saveCampusHours={saveCampusHours}
        />
      </div>
    </div>
  );
});

Edit.displayName = 'Edit';

export default Edit;
