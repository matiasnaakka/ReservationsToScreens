import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import clockIcon from '../assets/clock.png';

const CampusAccordion = ({ businessHours, setBusinessHours }) => {
  // Handle campus updates
  const handleCampusUpdate = (index, updatedCampus) => {
    setBusinessHours(prev => ({
      ...prev,
      campuses: prev.campuses.map((campus, i) =>
        i === index ? updatedCampus : campus
      )
    }));
  };

  // Handle adding new campus
  const handleAddCampus = () => {
    const newCampus = {
      name: '',
      shorthand: '',
      hours: {
        monday: { hours: 7, minutes: 30, closeHours: 21, closeMinutes: 0, isClosed: false },
        tuesday: { hours: 7, minutes: 30, closeHours: 21, closeMinutes: 0, isClosed: false },
        wednesday: { hours: 7, minutes: 30, closeHours: 21, closeMinutes: 0, isClosed: false },
        thursday: { hours: 7, minutes: 30, closeHours: 21, closeMinutes: 0, isClosed: false },
        friday: { hours: 7, minutes: 30, closeHours: 21, closeMinutes: 0, isClosed: false },
        saturday: { hours: null, minutes: null, closeHours: null, closeMinutes: null, isClosed: true },
        sunday: { hours: null, minutes: null, closeHours: null, closeMinutes: null, isClosed: true }
      }
    };

    setBusinessHours(prev => ({
      ...prev,
      campuses: [...prev.campuses, newCampus]
    }));
  };

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="campus-content"
        id="campus-header"
        className="bg-gray-50"
      >
        <div className="flex items-center justify-between w-full pr-4">
          <div className="flex">
            <h3 className="text-xl font-semibold">Campus Business Hours</h3>
            <img
              src={clockIcon} // Replace with the path to your icon
              alt="Metropolia Icon"
              className="h-7 ml-3 hidden md:block" // Adjust size and spacing
            />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddCampus();
            }}
            className="px-3 py-1 bg-green text-white rounded hover:bg-green-700 text-sm"
          >
            Add Campus
          </button>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div className="space-y-6">
          {businessHours.campuses.map((campus, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white shadow">
              <div className="flex items-start gap-4">
                {/* Display Campus Image */}
                <img
                  src={campus.imageUrl || 'https://via.placeholder.com/150'}
                  alt={`${campus.name} campus`}
                  className="w-24 h-24 object-cover rounded shadow"
                />

                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-sm text-gray-600">Campus Name</label>
                      <input
                        type="text"
                        value={campus.name}
                        onChange={(e) =>
                          handleCampusUpdate(index, { ...campus, name: e.target.value })
                        }
                        className="border rounded px-2 py-1 w-full"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Shorthand</label>
                      <input
                        type="text"
                        value={campus.shorthand}
                        onChange={(e) =>
                          handleCampusUpdate(index, { ...campus, shorthand: e.target.value })
                        }
                        className="border rounded px-2 py-1 w-full"
                      />
                    </div>
                  </div>

                  {/* Add Input for Campus Image URL */}
                  <div className="mb-4">
                    <label className="text-sm text-gray-600">Image URL</label>
                    <input
                      type="text"
                      value={campus.imageUrl || ''}
                      onChange={(e) =>
                        handleCampusUpdate(index, { ...campus, imageUrl: e.target.value })
                      }
                      className="border rounded px-2 py-1 w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Object.entries(campus.hours).map(([day, hours]) => (
                  <div key={day} className="border rounded p-3">
                    <h5 className="font-semibold mb-2 capitalize">{day}</h5>
                    <label className="block text-sm">
                      <input
                        type="checkbox"
                        checked={!hours.isClosed}
                        onChange={(e) => {
                          const updatedHours = { ...campus.hours };
                          updatedHours[day].isClosed = !e.target.checked;
                          handleCampusUpdate(index, { ...campus, hours: updatedHours });
                        }}
                        className="mr-2"
                      />
                      Open
                    </label>
                    {!hours.isClosed && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <label className="text-xs text-gray-600">Open</label>
                          <div className="flex gap-1">
                            <input
                              type="number"
                              value={hours.hours || ''}
                              onChange={(e) => {
                                const updatedHours = { ...campus.hours };
                                updatedHours[day].hours = parseInt(e.target.value) || null;
                                handleCampusUpdate(index, { ...campus, hours: updatedHours });
                              }}
                              className="border rounded w-full px-1"
                              min="0"
                              max="23"
                            />
                            <input
                              type="number"
                              value={hours.minutes || ''}
                              onChange={(e) => {
                                const updatedHours = { ...campus.hours };
                                updatedHours[day].minutes = parseInt(e.target.value) || null;
                                handleCampusUpdate(index, { ...campus, hours: updatedHours });
                              }}
                              className="border rounded w-full px-1"
                              min="0"
                              max="59"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">Close</label>
                          <div className="flex gap-1">
                            <input
                              type="number"
                              value={hours.closeHours || ''}
                              onChange={(e) => {
                                const updatedHours = { ...campus.hours };
                                updatedHours[day].closeHours = parseInt(e.target.value) || null;
                                handleCampusUpdate(index, { ...campus, hours: updatedHours });
                              }}
                              className="border rounded w-full px-1"
                              min="0"
                              max="23"
                            />
                            <input
                              type="number"
                              value={hours.closeMinutes || ''}
                              onChange={(e) => {
                                const updatedHours = { ...campus.hours };
                                updatedHours[day].closeMinutes = parseInt(e.target.value) || null;
                                handleCampusUpdate(index, { ...campus, hours: updatedHours });
                              }}
                              className="border rounded w-full px-1"
                              min="0"
                              max="59"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default CampusAccordion;
