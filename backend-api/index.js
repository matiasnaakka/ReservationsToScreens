import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import openData from './utils/opendata.js';
import logger from './utils/logger.js';
import {db} from './utils/firebase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
const app = express();

// Enable CORS for all routes
app.use(cors({origin: '*'}));

// Middleware to parse JSON bodies
app.use(express.json());

// Example environment variable usage
const apiKey = process.env.PASSWORDMETROPOLIA;

// Basic route
app.get('/', (req, res) => {
  res.json({message: 'API is running'});
});

// Example protected route using API key
app.get('/protected', (req, res) => {
  if (req.headers.apikey === apiKey) {
    res.json({message: 'Access granted'});
  } else {
    res.status(401).json({message: 'Unauthorized'});
  }
});

// OpenData API routes for fetching data of specific room
app.get('/api/reservations', async (req, res) => {
  if (req.headers.apikey !== apiKey) {
    logger.warn('Unauthorized access attempt', {ip: req.ip, path: req.path});
    return res.status(401).json({message: 'Unauthorized'});
  }
  const {room, startDate, endDate} = req.query;

  try {
    logger.info('Fetching reservations', {room, startDate, endDate});
    const data = await openData.checkOpenDataReservation(
      room,
      startDate,
      endDate,
    );
    res.json(data);
  } catch (error) {
    logger.error('Error fetching reservations', {
      error: error.message,
      room,
      startDate,
      endDate,
    });
    res.status(500).json({message: error.message});
  }
});

//Not needed in this project
app.post('/api/reservations/search', async (req, res) => {
  if (req.headers.apikey !== apiKey) {
    logger.warn('Unauthorized access attempt', {ip: req.ip, path: req.path});
    return res.status(401).json({message: 'Unauthorized'});
  }
  try {
    logger.info('Searching reservations', {
      realization: req.body.realization,
      studentGroup: req.body.studentGroup,
    });
    const data = await openData.checkOpenDataReservations(
      req.body.realization,
      req.body.studentGroup,
    );
    res.json(data);
  } catch (error) {
    logger.error('Error searching reservations', {
      error: error.message,
      realization: req.body.realization,
      studentGroup: req.body.studentGroup,
    });
    res.status(500).json({message: error.message});
  }
});

// Route to fetch all up to date rooms data from Firestore database
app.get('/api/rooms', async (req, res) => {
  if (req.headers.apikey !== apiKey) {
    logger.warn('Unauthorized access attempt', {ip: req.ip, path: req.path});
    return res.status(401).json({message: 'Unauthorized'});
  }
  try {
    const roomsDoc = await db.collection('MetropoliaData').doc('rooms').get();
    if (roomsDoc.exists) {
      res.json(roomsDoc.data().rooms || {});
    } else {
      res.status(404).json({message: 'Rooms data not found'});
    }
  } catch (error) {
    logger.error('Error fetching rooms data', {error: error.message});
    res.status(500).json({message: error.message});
  }
});

// Route to fetch all business hours of data from Firestore
app.get('/api/businesshours', async (req, res) => {
  if (req.headers.apikey !== apiKey) {
    logger.warn('Unauthorized access attempt', {ip: req.ip, path: req.path});
    return res.status(401).json({message: 'Unauthorized'});
  }
  try {
    const businessHoursDoc = await db
      .collection('MetropoliaData')
      .doc('businesshours')
      .get();
    if (businessHoursDoc.exists) {
      res.json(businessHoursDoc.data() || {campuses: []});
    } else {
      res.status(404).json({message: 'Business hours data not found'});
    }
  } catch (error) {
    logger.error('Error fetching business hours data', {error: error.message});
    res.status(500).json({message: error.message});
  }
});

app.get('/api/rooms/reservations', async (req, res) => {
  if (req.headers.apikey !== apiKey) {
    logger.warn('Unauthorized access attempt', {ip: req.ip, path: req.path});
    return res.status(401).json({message: 'Unauthorized'});
  }

  const {floor, Staffworkspace, startDate, endDate} = req.query;

  try {
    logger.info('Fetching filtered rooms with reservations', {
      floor,
      Staffworkspace,
      startDate,
      endDate,
    });

    // Fetch all rooms from your database
    const roomsDoc = await db.collection('MetropoliaData').doc('rooms').get();
    if (!roomsDoc.exists) {
      return res.status(404).json({message: 'Rooms data not found'});
    }

    const allRooms = roomsDoc.data().rooms || {};

    // Filter rooms by floor
    const filteredRooms = Object.values(allRooms).filter((room) => {
      const matchesFloor = floor === 'All Floors' || room.floor === floor;
      const matchesStaff =
        Staffworkspace === 'true'
          ? room.details === 'Henkilöstön työtila' &&
            room.reservableStaff === 'true'
          : true; // If Staffworkspace=false or not specified, don't filter by staff workspaces

      return matchesFloor && matchesStaff && room.building === 'KM'; // Ensure it's from Karamalmi campus
    });

    // Fetch reservations for the filtered rooms
    const enrichedRooms = await Promise.all(
      filteredRooms.map(async (room) => {
        const reservations = await openData.checkOpenDataReservation(
          room.roomNumber,
          startDate,
          endDate,
        );
        return {
          ...room,
          reserved: reservations.reservations.length > 0,
          reservationDetails: reservations.reservations[0] || null, // Include reservation details if any
        };
      }),
    );

    console.log('🚀 ~ app.get ~ enrichedRooms:', enrichedRooms);
    res.json(enrichedRooms);
  } catch (error) {
    logger.error('Error fetching filtered rooms with reservations', {
      error: error.message,
    });
    res.status(500).json({message: error.message});
  }
});

// Update timezone helpers with correct conversion logic
const getUtcNow = () => {
  return new Date();
};

const finlandTimezoneOffset = () => {
  const now = new Date();
  const winterTime = !isDaylightSavingTime(now);
  return winterTime ? 2 : 3; // Hours ahead of UTC
};

const isDaylightSavingTime = (date) => {
  // European DST rules: starts last Sunday in March, ends last Sunday in October
  const year = date.getUTCFullYear();

  // Last Sunday in March (start of DST)
  const marchStart = new Date(Date.UTC(year, 2, 31)); // 31st day will roll back to last day of March
  marchStart.setUTCDate(31 - marchStart.getUTCDay()); // Last Sunday
  marchStart.setUTCHours(1, 0, 0, 0); // 01:00 UTC

  // Last Sunday in October (end of DST)
  const octoberEnd = new Date(Date.UTC(year, 9, 31)); // 31st day will roll back to last day of October
  octoberEnd.setUTCDate(31 - octoberEnd.getUTCDay()); // Last Sunday
  octoberEnd.setUTCHours(1, 0, 0, 0); // 01:00 UTC

  return date >= marchStart && date < octoberEnd;
};

const utcToFinland = (utcHours, utcMinutes) => {
  const offset = finlandTimezoneOffset();
  let finlandHours = utcHours + offset; // Add offset to convert from UTC to Finland time

  // Handle day wraparound
  if (finlandHours >= 24) {
    finlandHours -= 24;
  }

  return {
    hours: finlandHours,
    minutes: utcMinutes,
  };
};

// Helper function to convert Finnish time to UTC time
const finnishToUtc = (finnishTimeString) => {
  const finnishTime = new Date(finnishTimeString);
  const offset = finlandTimezoneOffset(); // Get the current Finland timezone offset
  // Subtract the offset to convert from Finnish time to UTC
  finnishTime.setHours(finnishTime.getHours() - offset);
  return finnishTime;
};

// Define floor color codes
const floorColorCodes = {
  7: '#74B0F9',
  6: '#D70580',
  5: '#FA6707',
  4: '#0E7C7B',
  3: '#D6D6D6',
  2: '#F8DC0E',
  1: '#FFFFFF',
  0: '#FFFFFF',
};
const groupDetailsMappings = {
  work: ['Työtila', 'Henkilöstön työtila'],
  studyspace: ['Oppimistila', 'Avoin oppimistila', 'Digitila'],
  groupwork: ['Ryhmätyötila', 'Yhteistyötila'],
  other: [
    'Aula',
    'Karamalmin kampuksen pääaula',
    'Smart IoT -laboratorio',
    'VR/AR -laboratorio',
    'Medialaboratorio',
    'Hissiaula',
    'Testikeskus',
    'Varasto/medialaboratorio',
    'Taltiointitila',
    'METKA',
    'Opiskelijoiden tila',
    'Tarkkaamo',
  ],
};

// Route to fetch filtered rooms with reservations
app.get('/api/rooms/freespace', async (req, res) => {
  if (req.headers.apikey !== apiKey) {
    logger.warn('Unauthorized access attempt', {ip: req.ip, path: req.path});
    return res.status(401).json({message: 'Unauthorized'});
  }

  const {
    floor,
    building,
    wing,
    persons,
    squareMeters,
    details,
    groupDetails,
    reservableStudents,
    reservableStaff,
    startDate,
    endDate,
  } = req.query;
  try {
    logger.info('Fetching filtered rooms with reservations', {
      floor,
      building,
      wing,
      persons,
      squareMeters,
      details,
      groupDetails,
      reservableStudents,
      reservableStaff,
      startDate,
      endDate,
    });

    const formattedDetails = details ? details.trim() : null;
    const roomsDoc = await db.collection('MetropoliaData').doc('rooms').get();
    if (!roomsDoc.exists) {
      return res.status(404).json({message: 'Rooms data not found'});
    }

    const allRooms = roomsDoc.data().rooms || {};

    // Extract unique metadata
    const metadata = {
      floors: [
        ...new Set(Object.values(allRooms).map((room) => room.floor)),
      ].sort(),
      buildings: [
        ...new Set(Object.values(allRooms).map((room) => room.building)),
      ].sort(),
      wings: [
        ...new Set(Object.values(allRooms).map((room) => room.wing)),
      ].sort(),
      details: [
        ...new Set(Object.values(allRooms).map((room) => room.details)),
      ].sort(),
      detailsGroups: Object.keys(groupDetailsMappings),
    };

    // Enhanced filtering logic
    const filteredRooms = Object.values(allRooms).filter((room) => {
      const matchesFloor =
        !floor || floor === 'All Floors' || room.floor === floor;
      const matchesBuilding = !building || room.building === building;
      const matchesWing = !wing || room.wing === wing;
      const matchesPersons =
        !persons || parseInt(room.persons) >= parseInt(persons);
      const matchesSquareMeters =
        !squareMeters || parseInt(room.squareMeters) >= parseInt(squareMeters);
      const matchesDetails =
        !formattedDetails ||
        room.details.toLowerCase().includes(formattedDetails.toLowerCase());

      const matchesDetailsGroup =
        !groupDetails ||
        groupDetailsMappings[groupDetails]?.includes(room.details);
      const matchesReservableStudents =
        !reservableStudents || room.reservableStudents === reservableStudents;
      const matchesReservableStaff =
        !reservableStaff || room.reservableStaff === reservableStaff;

      return (
        matchesFloor &&
        matchesBuilding &&
        matchesWing &&
        matchesPersons &&
        matchesSquareMeters &&
        matchesDetails &&
        matchesDetailsGroup &&
        matchesReservableStudents &&
        matchesReservableStaff
      );
    });

    // Fetch business hours
    const businessHoursDoc = await db
      .collection('MetropoliaData')
      .doc('businesshours')
      .get();
    const businessHours = businessHoursDoc.exists
      ? businessHoursDoc.data()
      : {campuses: []};

    const enrichedRooms = await Promise.all(
      filteredRooms.map(async (room) => {
        const reservations = await openData.checkOpenDataReservation(
          room.roomNumber,
          startDate,
          endDate,
        );

        const now = getUtcNow();

        // Find campus business hours using shorthand
        const campus = businessHours.campuses.find(
          (c) => c.shorthand === room.building,
        );
        const days = [
          'sunday',
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday',
        ];
        const todayHours = campus?.hours?.[days[now.getDay()]];

        let closingTime = null;
        let isOpen = false;
        if (todayHours && !todayHours.isClosed) {
          // Convert business hours (which are in Finland time) to UTC for comparison
          const finlandToUtcOffset = -finlandTimezoneOffset(); // Negative offset to go from Finland to UTC

          // Opening time in UTC
          const openTimeUTC = new Date(now);
          let utcOpenHours = todayHours.hours + finlandToUtcOffset;
          if (utcOpenHours < 0) utcOpenHours += 24;
          openTimeUTC.setUTCHours(utcOpenHours, todayHours.minutes, 0, 0);

          // Closing time in UTC
          closingTime = new Date(now);
          let utcCloseHours = todayHours.closeHours + finlandToUtcOffset;
          if (utcCloseHours < 0) utcCloseHours += 24;
          closingTime.setUTCHours(utcCloseHours, todayHours.closeMinutes, 0, 0);

          // Check if we're currently open
          isOpen = now >= openTimeUTC && now <= closingTime;
        }

        // Convert reservation times from Finnish time to UTC for comparison
        const isCurrentlyReserved = reservations.reservations.some((r) => {
          const reservationStartUTC = finnishToUtc(r.startDate);
          const reservationEndUTC = finnishToUtc(r.endDate);
          return reservationStartUTC <= now && reservationEndUTC >= now;
        });

        // Find current reservation with UTC conversion
        const currentReservation =
          reservations.reservations.find((r) => {
            const reservationStartUTC = finnishToUtc(r.startDate);
            const reservationEndUTC = finnishToUtc(r.endDate);
            return reservationStartUTC <= now && reservationEndUTC >= now;
          }) || null;

        // Convert Finnish time to UTC for next reservation check
        const sortedReservations = reservations.reservations
          .map((r) => ({
            ...r,
            startDateUTC: finnishToUtc(r.startDate),
            endDateUTC: finnishToUtc(r.endDate),
          }))
          .sort((a, b) => a.startDateUTC - b.startDateUTC);

        const nextReservation = sortedReservations.find(
          (r) => r.startDateUTC > now,
        );

        const freeDuration = nextReservation
          ? Math.floor((nextReservation.startDateUTC - now) / (1000 * 60))
          : null;

        // Calculate minutes until closing
        const minutesUntilClosing =
          closingTime && isOpen
            ? Math.floor((closingTime - now) / (1000 * 60))
            : null;

        // Determine effective free duration
        const effectiveFreeDuration =
          minutesUntilClosing !== null && isOpen
            ? freeDuration === null
              ? minutesUntilClosing
              : Math.min(freeDuration, minutesUntilClosing)
            : freeDuration;

        // Update freeUntilClosing to account for proper reservation checking
        const freeUntilClosing =
          isOpen &&
          closingTime &&
          !nextReservation &&
          minutesUntilClosing > 0 &&
          !isCurrentlyReserved;

        // Determine floor color code
        const floorColorCode = floorColorCodes[room.floor] || null;

        return {
          ...room,
          campus: campus?.name || null,
          isOpen,
          reserved: isCurrentlyReserved,
          currentReservation,
          nextReservation: nextReservation
            ? {
                ...nextReservation,
                startDate: nextReservation.startDate,
                endDate: nextReservation.endDate,
              }
            : null,
          freeUntil: nextReservation
            ? nextReservation.startDate
            : isOpen
            ? closingTime.toISOString()
            : null,
          freeForMinutes: effectiveFreeDuration,
          closingTime: closingTime ? closingTime.toISOString() : null,
          minutesUntilClosing,
          freeUntilClosing,
          floorColorCode,
        };
      }),
    );

    enrichedRooms.sort((a, b) => {
      const floorComparison = parseInt(a.floor) - parseInt(b.floor);
      if (floorComparison !== 0) {
        return floorComparison;
      }
      const wingComparison = a.wing.localeCompare(b.wing);
      if (wingComparison !== 0) {
        return wingComparison;
      }
      const roomNumberA = parseInt(a.roomNumber.slice(3));
      const roomNumberB = parseInt(b.roomNumber.slice(3));
      return roomNumberA - roomNumberB;
    });

    const packedData = {metadata, rooms: enrichedRooms};
    res.json(packedData);
  } catch (error) {
    logger.error('Error fetching filtered rooms with reservations', {
      error: error.message,
    });
    res.status(500).json({message: error.message});
  }
});

// Route to fetch filtered rooms with reservations (full version)
// This route is similar to the previous one but includes additional details and logic
app.get('/api/rooms/freespace-full', async (req, res) => {
  if (req.headers.apikey !== apiKey) {
    logger.warn('Unauthorized access attempt', {ip: req.ip, path: req.path});
    return res.status(401).json({message: 'Unauthorized'});
  }

  const {
    floor,
    building,
    wing,
    persons,
    squareMeters,
    details,
    groupDetails,
    reservableStudents,
    reservableStaff,
    startDate,
    endDate,
  } = req.query;
  try {
    logger.info('Fetching filtered rooms with reservations', {
      floor,
      building,
      wing,
      persons,
      squareMeters,
      details,
      groupDetails,
      reservableStudents,
      reservableStaff,
      startDate,
      endDate,
    });

    const formattedDetails = details ? details.trim() : null;
    const roomsDoc = await db.collection('MetropoliaData').doc('rooms').get();
    if (!roomsDoc.exists) {
      return res.status(404).json({message: 'Rooms data not found'});
    }

    const allRooms = roomsDoc.data().rooms || {};

    // Extract unique metadata
    const metadata = {
      floors: [
        ...new Set(Object.values(allRooms).map((room) => room.floor)),
      ].sort(),
      buildings: [
        ...new Set(Object.values(allRooms).map((room) => room.building)),
      ].sort(),
      wings: [
        ...new Set(Object.values(allRooms).map((room) => room.wing)),
      ].sort(),
      details: [
        ...new Set(Object.values(allRooms).map((room) => room.details)),
      ].sort(),
      detailsGroups: Object.keys(groupDetailsMappings),
    };

    // Enhanced filtering logic
    const filteredRooms = Object.values(allRooms).filter((room) => {
      const matchesFloor =
        !floor || floor === 'All Floors' || room.floor === floor;
      const matchesBuilding = !building || room.building === building;
      const matchesWing = !wing || room.wing === wing;
      const matchesPersons =
        !persons || parseInt(room.persons) >= parseInt(persons);
      const matchesSquareMeters =
        !squareMeters || parseInt(room.squareMeters) >= parseInt(squareMeters);
      const matchesDetails =
        !formattedDetails ||
        room.details.toLowerCase().includes(formattedDetails.toLowerCase());

      const matchesDetailsGroup =
        !groupDetails ||
        groupDetailsMappings[groupDetails]?.includes(room.details);
      const matchesReservableStudents =
        !reservableStudents || room.reservableStudents === reservableStudents;
      const matchesReservableStaff =
        !reservableStaff || room.reservableStaff === reservableStaff;

      return (
        matchesFloor &&
        matchesBuilding &&
        matchesWing &&
        matchesPersons &&
        matchesSquareMeters &&
        matchesDetails &&
        matchesDetailsGroup &&
        matchesReservableStudents &&
        matchesReservableStaff
      );
    });

    // Fetch business hours
    const businessHoursDoc = await db
      .collection('MetropoliaData')
      .doc('businesshours')
      .get();
    const businessHours = businessHoursDoc.exists
      ? businessHoursDoc.data()
      : {campuses: []};

    const enrichedRooms = await Promise.all(
      filteredRooms.map(async (room) => {
        const reservations = await openData.checkOpenDataReservation(
          room.roomNumber,
          startDate,
          endDate,
        );
        const now = getUtcNow();

        // Find campus business hours using shorthand
        const campus = businessHours.campuses.find(
          (c) => c.shorthand === room.building,
        );
        const days = [
          'sunday',
          'monday',
          'tuesday',
          'wednesday',
          'thursday',
          'friday',
          'saturday',
        ];
        const todayHours = campus?.hours?.[days[now.getDay()]];

        let closingTime = null;
        let isOpen = false;
        if (todayHours && !todayHours.isClosed) {
          // Convert Finnish business hours to UTC
          const openTimeUTC = utcToFinland(
            todayHours.hours,
            todayHours.minutes,
          );
          const closeTimeUTC = utcToFinland(
            todayHours.closeHours,
            todayHours.closeMinutes,
          );

          closingTime = new Date(now);
          closingTime.setUTCHours(
            closeTimeUTC.hours,
            closeTimeUTC.minutes,
            0,
            0,
          );

          const openTime = new Date(now);
          openTime.setUTCHours(openTimeUTC.hours, openTimeUTC.minutes, 0, 0);

          isOpen = now >= openTime && now <= closingTime;
        }

        const sortedReservations = reservations.reservations.sort(
          (a, b) => new Date(a.startDate) - new Date(b.startDate),
        );

        const nextReservation = sortedReservations.find(
          (r) => new Date(r.startDate) > now,
        );
        const freeDuration = nextReservation
          ? Math.floor(
              (new Date(nextReservation.startDate) - now) / (1000 * 60),
            )
          : null;

        // Calculate minutes until closing
        const minutesUntilClosing =
          closingTime && isOpen
            ? Math.floor((closingTime - now) / (1000 * 60))
            : null;

        // Determine effective free duration
        const effectiveFreeDuration =
          minutesUntilClosing !== null && isOpen
            ? freeDuration === null
              ? minutesUntilClosing
              : Math.min(freeDuration, minutesUntilClosing)
            : freeDuration;

        // Determine if room is free until closing
        const freeUntilClosing =
          isOpen && closingTime && !nextReservation && minutesUntilClosing > 0;

        // Determine floor color code
        const floorColorCode = floorColorCodes[room.floor] || null;

        return {
          ...room,
          campus: campus?.name || null,
          isOpen,
          reserved: reservations.reservations.some(
            (r) => new Date(r.startDate) <= now && new Date(r.endDate) >= now,
          ),
          currentReservation:
            reservations.reservations.find(
              (r) => new Date(r.startDate) <= now && new Date(r.endDate) >= now,
            ) || null,
          nextReservation: nextReservation || null,
          freeUntil: nextReservation
            ? nextReservation.startDate
            : isOpen
            ? closingTime.toISOString()
            : null,
          freeForMinutes: effectiveFreeDuration,
          closingTime: closingTime ? closingTime.toISOString() : null,
          minutesUntilClosing,
          freeUntilClosing,
          floorColorCode,
        };
      }),
    );

    // Sort enriched rooms by floor, wing letter, and numeric part of room number
    enrichedRooms.sort((a, b) => {
      const floorComparison = parseInt(a.floor) - parseInt(b.floor);
      if (floorComparison !== 0) {
        return floorComparison;
      }
      const wingComparison = a.wing.localeCompare(b.wing);
      if (wingComparison !== 0) {
        return wingComparison;
      }
      const roomNumberA = parseInt(a.roomNumber.slice(3));
      const roomNumberB = parseInt(b.roomNumber.slice(3));
      return roomNumberA - roomNumberB;
    });

    const packedData = {metadata, rooms: enrichedRooms};
    res.json(packedData);
  } catch (error) {
    logger.error('Error fetching filtered rooms with reservations', {
      error: error.message,
    });
    res.status(500).json({message: error.message});
  }
});

// New route to fetch all rooms in Karamalmi campus from OpenData API
app.get('/api/karamalmi/rooms', async (req, res) => {
  if (req.headers.apikey !== apiKey) {
    logger.warn('Unauthorized access attempt', {ip: req.ip, path: req.path});
    return res.status(401).json({message: 'Unauthorized'});
  }

  try {
    logger.info('Fetching Karamalmi rooms from OpenData API');

    // Fetch data from the OpenData API
    const response = await fetch(
      'https://opendata.metropolia.fi/r1/reservation/building/78025',
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            process.env.APIKEYMETROPOLIA || '',
          ).toString('base64')}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`OpenData API responded with status ${response.status}`);
    }

    const data = await response.json();

    // Filter only rooms from the response
    const rooms =
      data.resources?.filter((resource) => resource.type === 'room') || [];

    res.json({status: 'success', rooms});
  } catch (error) {
    logger.error('Error fetching Karamalmi rooms from OpenData API', {
      error: error.message,
    });
    res.status(500).json({message: error.message});
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server started`, {
    port: PORT,
    environment: process.env.NODE_ENV,
  });
});
