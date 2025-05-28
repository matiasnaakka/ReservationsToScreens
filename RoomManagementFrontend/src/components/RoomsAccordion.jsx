import { useState, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const API_KEY = import.meta.env.VITE_APP_API_KEY;
const API_URL = import.meta.env.VITE_APP_URL_PATH;

const RoomsAccordion = ({ rooms, setRooms, setError, setSuccess, saveRoom }) => {
  const [expandedRoom, setExpandedRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortedRooms, setSortedRooms] = useState([]);

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

  // Handle room updates
  const handleRoomUpdate = (roomNumber, updatedRoom) => {
    setRooms((prevRooms) => ({
      ...prevRooms,
      [roomNumber]: {
        ...prevRooms[roomNumber],
        ...updatedRoom,
      },
    }));
  };

  const validateRoomWithMetropolia = async (roomNumber) => {
  const response = await fetch(`${API_URL}/api/rooms/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: API_KEY,
    },
    body: JSON.stringify({ roomNumber }),
  });

  if (!response.ok) {
    throw new Error('Room validation failed');
  }

  const { exists } = await response.json();
  return exists;
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
        apikey: API_KEY,
      },
      body: JSON.stringify(newRoom),
    });

    if (!response.ok) {
      const { message } = await response.json();
      throw new Error(message || 'Failed to add room.');
    }

    const { room } = await response.json();
    handleRoomUpdate(room.roomNumber, room);
    setSuccess(`Room ${room.roomNumber} added successfully.`);
  } catch (error) {
    setError(`Error adding room: ${error.message}`);
  } finally {
    setLoading(false);
  }
};

  // Save room (API)
  const handleSaveRoom = async (roomNumber, updatedRoom) => {
    if (!updatedRoom) {
      setError('Room data is missing. Cannot save changes.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await saveRoom(roomNumber, updatedRoom);
    } catch (err) {
      setError('Error saving room.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (roomNumber) => {
    if (window.confirm(`Are you sure you want to delete room ${roomNumber}?`)) {
      setLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const response = await fetch(`${API_URL}/api/rooms/delete`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            apikey: API_KEY
          },
          body: JSON.stringify({ roomNumber })
        });

        if (!response.ok) {
          const { message } = await response.json();
          throw new Error(message || 'Failed to delete room.');
        }

        const updatedRooms = { ...rooms };
        delete updatedRooms[roomNumber];
        setRooms(updatedRooms);
        setSuccess(`Room ${roomNumber} deleted successfully.`);
      } catch (err) {
        setError(`Error deleting room: ${err.message}`);
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddRoom();
            }}
            className="px-3 py-1 bg-green text-white rounded hover:bg-green-700 text-sm"
          >
            Add new Room
          </button>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Room Number</label>
                    <input
                      type="text"
                      value={room.roomNumber !== undefined ? room.roomNumber : ''}
                      onChange={(e) => handleRoomUpdate(roomNumber, { ...room, roomNumber: e.target.value || '' })}
                      className="border rounded px-3 py-2 bg-white"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Floor</label>
                    <input
                      type="text"
                      value={room.floor !== undefined ? room.floor : ''}
                      onChange={(e) => handleRoomUpdate(roomNumber, { ...room, floor: e.target.value || '' })}
                      className="border rounded px-3 py-2 bg-white"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Building</label>
                    <input
                      type="text"
                      value={room.building !== undefined ? room.building : ''}
                      onChange={(e) => handleRoomUpdate(roomNumber, { ...room, building: e.target.value || '' })}
                      className="border rounded px-3 py-2 bg-white"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Wing</label>
                    <input
                      type="text"
                      value={room.wing !== undefined ? room.wing : ''}
                      onChange={(e) => handleRoomUpdate(roomNumber, { ...room, wing: e.target.value || '' })}
                      className="border rounded px-3 py-2 bg-white"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Persons</label>
                    <input
                      type="text"
                      value={room.persons !== undefined ? room.persons : ''}
                      onChange={(e) => handleRoomUpdate(roomNumber, { ...room, persons: e.target.value || '' })}
                      className="border rounded px-3 py-2 bg-white"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Square Meters</label>
                    <input
                      type="text"
                      value={room.squareMeters !== undefined ? room.squareMeters : ''}
                      onChange={(e) => handleRoomUpdate(roomNumber, { ...room, squareMeters: e.target.value || '' })}
                      className="border rounded px-3 py-2 bg-white"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Details</label>
                    <input
                      type="text"
                      value={room.details !== undefined ? room.details : ''}
                      onChange={(e) => handleRoomUpdate(roomNumber, { ...room, details: e.target.value || '' })}
                      className="border rounded px-3 py-2 bg-white"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div>
                      <label className="text-sm text-gray-600 mb-1">Reservable by Students</label>
                      <input
                        type="checkbox"
                        checked={room.reservableStudents === 'true'}
                        onChange={(e) => {
                          const newValue = e.target.checked ? 'true' : 'false';
                          const updatedRoom = { reservableStudents: newValue };

                          handleRoomUpdate(roomNumber, updatedRoom); // Päivitä local state
                          handleSaveRoom(roomNumber, updatedRoom); // Tallenna Firestoreen
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
                          const updatedRoom = { reservableStaff: newValue };

                          handleRoomUpdate(roomNumber, updatedRoom); // Päivitä local state
                          handleSaveRoom(roomNumber, updatedRoom); // Tallenna Firestoreen
                        }}
                        className="border rounded ml-4 bg-white"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-4 space-x-2">
                  <button
                    onClick={() => handleSaveRoom(roomNumber, rooms[roomNumber])} // Lähetetään päivitetty huoneen tiedot
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
