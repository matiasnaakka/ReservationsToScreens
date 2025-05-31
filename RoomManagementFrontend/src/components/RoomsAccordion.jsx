import { useState, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const API_URL = import.meta.env.VITE_APP_API_URL;
const token = localStorage.getItem('roomsmanagement_token');

/**
 * Validates room input fields based on specific requirements
 * @param {string} field - The field name to validate
 * @param {string} value - The value to validate
 * @returns {boolean} - Whether the value is valid for the given field
 */
const validateField = (field, value) => {
  const validators = {
    // Room number: exactly 6 letters/numbers allowed
    roomNumber: (val) => val === '' || /^[a-zA-Z0-9]{0,6}$/.test(val),
    // Floor: one number only
    floor: (val) => val === '' || /^[0-9]{0,1}$/.test(val),
    // Building: exactly 2 letters only, no numbers
    building: (val) => val === '' || /^[\p{L}]{0,2}$/u.test(val),
    // Wing: one letter only
    wing: (val) => val === '' || /^[\p{L}]{0,1}$/u.test(val),
    // Persons: max 3 numbers, only numbers
    persons: (val) => val === '' || /^[0-9]{0,3}$/.test(val),
    // Square meters: numbers only
    squareMeters: (val) => val === '' || /^[0-9]*$/.test(val),
    // Details: text only allowed (letters, spaces, and common punctuation) - Unicode support added
    details: (val) => val === '' || /^[\p{L}0-9\s.,;:!?-]*$/u.test(val),
  };

  return validators[field] ? validators[field](value) : true;
};

/**
 * Gets validation error message for a field
 * @param {string} field - The field name
 * @returns {string} - The validation error message
 */
const getValidationMessage = (field) => {
  const messages = {
    roomNumber: 'Room number must be exactly 6 characters (letters or numbers)',
    floor: 'Floor must be a single digit',
    building: 'Building must be exactly 2 letters',
    wing: 'Wing must be a single letter',
    persons: 'Persons must be up to 3 digits',
    squareMeters: 'Square meters must be a number',
    details: 'Details must contain only text characters',
  };

  return messages[field] || 'Invalid input';
};

const RoomsAccordion = ({ rooms, setRooms, setError, setSuccess, saveRoom }) => {
  const [expandedRoom, setExpandedRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortedRooms, setSortedRooms] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    const sorted = Object.entries(rooms).sort(([aKey, aRoom], [bKey, bRoom]) => {
      if (aRoom.building < bRoom.building) return -1;
      if (aRoom.building > bRoom.building) return 1;
      if (aRoom.floor < bRoom.floor) return -1;
      if (aRoom.floor > bRoom.floor) return 1;
      if (aRoom.roomNumber < bRoom.roomNumber) return -1;
      if (aRoom.roomNumber > bRoom.roomNumber) return 1;
      return 0;
    });
    setSortedRooms(sorted);
  }, [rooms]);
  // Handle room updates with validation
  const handleRoomUpdate = (roomNumber, updatedField) => {
    // Get the field name that's being updated (the only key in the object)
    const changedField = Object.keys(updatedField)[0];
    const newValue = updatedField[changedField];
    
    if (changedField) {
      // Validate the field if it has a validator
      if (!validateField(changedField, newValue)) {
        // Set validation error
        setValidationErrors(prev => ({
          ...prev,
          [`${roomNumber}-${changedField}`]: getValidationMessage(changedField)
        }));
        
        // Don't update if invalid
        return;
      }
      
      // Clear validation error if valid
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated[`${roomNumber}-${changedField}`];
        return updated;
      });
    }

    // Update the room if validation passes
    setRooms((prevRooms) => ({
      ...prevRooms,
      [roomNumber]: {
        ...prevRooms[roomNumber],
        ...updatedField,
      },
    }));
  };

  const validateRoomWithMetropolia = async (roomNumber) => {
    try {
      const response = await fetch(`${API_URL}/api/rooms/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          apikey: import.meta.env.VITE_APP_API_KEY, // Ensure API key is included
        },
        body: JSON.stringify({ roomNumber }),
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || 'Room validation failed');
      }

      const { exists } = await response.json();
      return exists;
    } catch (error) {
      setError(`Validation error: ${error.message}`);
      throw error;
    }
  };


  const handleAddRoom = async () => {
    const newRoomNumber = prompt('Enter new room number: Example KMC201');
    if (!newRoomNumber || newRoomNumber.trim().length < 3) {
      setError('Please enter a valid room number.');
      return;
    }

    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      // ✅ Tarkista Metropolian open API:n kautta (backendin kautta)
      const isValidRoom = await validateRoomWithMetropolia(newRoomNumber);
      if (!isValidRoom) {
        setError(`Room ${newRoomNumber} not found in Metropolia open API.`);
        return;
      }

      // ✅ Tarkista ettei ole jo lisätty
      if (rooms[newRoomNumber]) {
        setError('The room already exists in the local data.');
        return;
      }

      const newRoom = {
        roomNumber: newRoomNumber,
        floor: '',
        building: '',
        wing: '',
        persons: '0',
        squareMeters: '0',
        details: '',
        reservableStudents: 'false',
        reservableStaff: 'false',
      };

      const response = await fetch(`${API_URL}/api/rooms/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          apikey: import.meta.env.VITE_APP_API_KEY, // Add API key here
        },
        body: JSON.stringify(newRoom),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add room.');
      }      const { room } = await response.json();
      // Direct update to room state to avoid validation issues with new room
      setRooms((prevRooms) => ({
        ...prevRooms,
        [room.roomNumber]: room
      }));
      setSuccess(`Room ${room.roomNumber} added successfully.`);
    } catch (error) {
      setError(`Error adding room: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Save room (API)
  const handleSaveRoom = async (roomNumber, updatedRoom) => {
    if (!updatedRoom || !roomNumber) {
      setError('Room data or room number is missing. Cannot save changes.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(`${API_URL}/api/rooms/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          apikey: import.meta.env.VITE_APP_API_KEY,
        },
        body: JSON.stringify({ roomNumber, updates: updatedRoom }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save room');
      }
      
      const data = await response.json();
      
      // Update with the room data from response, not the entire response object
      if (data.room) {
        setRooms((prevRooms) => ({
          ...prevRooms,
          [roomNumber]: data.room
        }));
      }
      
      setSuccess('Room saved successfully');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (roomNumber) => {
    if (!roomNumber) {
      setError('Room number is missing. Cannot delete room.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete room ${roomNumber}?`)) {
      setLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const response = await fetch(`${API_URL}/api/rooms/delete`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            apikey: import.meta.env.VITE_APP_API_KEY, // Ensure API key is included
          },
          body: JSON.stringify({ roomNumber }), // Ensure roomNumber is sent in the body
        });
        if (!response.ok) {
          const { message } = await response.json();
          throw new Error(message || 'Failed to delete room');
        }
        setSuccess('Room deleted successfully');
        setRooms((prevRooms) => {
          const updatedRooms = { ...prevRooms };
          delete updatedRooms[roomNumber];
          return updatedRooms;
        });
      } catch (error) {
        setError(`Error deleting room: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="rooms-content"
        id="rooms-header"
        className="bg-gray-50"
      >
        <div className="flex justify-between items-center w-full pr-4">
          <h3 className="text-xl font-semibold">Rooms</h3>
          <div
            onClick={(e) => {
              e.stopPropagation();
              handleAddRoom();
            }}
            className="px-3 py-1 bg-green text-white rounded hover:bg-green-700 text-sm cursor-pointer"
          >
            Add new Room
          </div>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div className="space-y-2">
          {sortedRooms.map(([roomNumber, room]) => (
            <Accordion
              key={roomNumber}
              expanded={expandedRoom === roomNumber}
              onChange={() => setExpandedRoom(expandedRoom === roomNumber ? null : roomNumber)}
              className="border rounded-lg shadow-sm"
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`room-${roomNumber}-content`}
                id={`room-${roomNumber}-header`}
                className="bg-white"
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-semibold">{roomNumber}</span>
                  <span className="text-sm text-gray-500">
                    {room.building} - Floor {room.floor}
                  </span>
                </div>
              </AccordionSummary>
              <AccordionDetails className="bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Room Number</label>
                    <input
                      type="text"
                      value={room.roomNumber || ''}
                      onChange={(e) => handleRoomUpdate(roomNumber, { roomNumber: e.target.value })}
                      className="border rounded px-3 py-2 bg-white"
                    />
                    {validationErrors[`${roomNumber}-roomNumber`] && (
                      <span className="text-red-500 text-xs mt-1">
                        {validationErrors[`${roomNumber}-roomNumber`]}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Floor</label>
                    <input
                      type="text"
                      value={room.floor || ''}
                      onChange={(e) => handleRoomUpdate(roomNumber, { floor: e.target.value })}
                      className="border rounded px-3 py-2 bg-white"
                    />
                    {validationErrors[`${roomNumber}-floor`] && (
                      <span className="text-red-500 text-xs mt-1">
                        {validationErrors[`${roomNumber}-floor`]}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Building</label>
                    <input
                      type="text"
                      value={room.building || ''}
                      onChange={(e) => handleRoomUpdate(roomNumber, { building: e.target.value })}
                      className="border rounded px-3 py-2 bg-white"
                    />
                    {validationErrors[`${roomNumber}-building`] && (
                      <span className="text-red-500 text-xs mt-1">
                        {validationErrors[`${roomNumber}-building`]}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Wing</label>
                    <input
                      type="text"
                      value={room.wing || ''}
                      onChange={(e) => handleRoomUpdate(roomNumber, { wing: e.target.value })}
                      className="border rounded px-3 py-2 bg-white"
                    />
                    {validationErrors[`${roomNumber}-wing`] && (
                      <span className="text-red-500 text-xs mt-1">
                        {validationErrors[`${roomNumber}-wing`]}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Persons</label>
                    <input
                      type="text"
                      value={room.persons || ''}
                      onChange={(e) => handleRoomUpdate(roomNumber, { persons: e.target.value })}
                      className="border rounded px-3 py-2 bg-white"
                    />
                    {validationErrors[`${roomNumber}-persons`] && (
                      <span className="text-red-500 text-xs mt-1">
                        {validationErrors[`${roomNumber}-persons`]}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Square Meters</label>
                    <input
                      type="text"
                      value={room.squareMeters || ''}
                      onChange={(e) => handleRoomUpdate(roomNumber, { squareMeters: e.target.value })}
                      className="border rounded px-3 py-2 bg-white"
                    />
                    {validationErrors[`${roomNumber}-squareMeters`] && (
                      <span className="text-red-500 text-xs mt-1">
                        {validationErrors[`${roomNumber}-squareMeters`]}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Details</label>
                    <input
                      type="text"
                      value={room.details || ''}
                      onChange={(e) => handleRoomUpdate(roomNumber, { details: e.target.value })}
                      className="border rounded px-3 py-2 bg-white"
                    />
                    {validationErrors[`${roomNumber}-details`] && (
                      <span className="text-red-500 text-xs mt-1">
                        {validationErrors[`${roomNumber}-details`]}
                      </span>
                    )}
                  </div>                  <div className="flex flex-col">
                    <div>
                      <label className="text-sm text-gray-600 mb-1">Reservable by Students</label>
                      <input
                        type="checkbox"
                        checked={room.reservableStudents === 'true'}
                        onChange={(e) => {
                          const newValue = e.target.checked ? 'true' : 'false';
                          // Update local state only, don't save immediately to avoid partial updates
                          handleRoomUpdate(roomNumber, { reservableStudents: newValue });
                        }}
                        className="border rounded ml-4 bg-white"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div>
                      <label className="text-sm text-gray-600 mb-1">Reservable by Staff</label>
                      <input
                        type="checkbox"
                        checked={room.reservableStaff === 'true'}
                        onChange={(e) => {
                          const newValue = e.target.checked ? 'true' : 'false';
                          // Update local state only, don't save immediately to avoid partial updates
                          handleRoomUpdate(roomNumber, { reservableStaff: newValue });
                        }}
                        className="border rounded ml-4 bg-white"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                  <button
                    onClick={() => handleSaveRoom(roomNumber, rooms[roomNumber])}
                    disabled={loading}
                    className={`px-4 py-2 ${loading ? ' bg-gray' : ' bg-blue hover:bg-indigo-400'} text-white rounded transition-colors`}
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={() => handleDeleteRoom(roomNumber)}
                    className="px-4 py-2 bg-red hover:bg-red-700 text-white rounded transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default RoomsAccordion;
