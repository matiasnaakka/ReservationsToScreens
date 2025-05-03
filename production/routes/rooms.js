import express from 'express';
import openData from '../utils/opendata.js';
import logger from '../utils/logger.js';
import Room from '../models/Room.js';
import {
  getUtcNow,
  finlandTimezoneOffset,
  isDaylightSavingTime,
  utcToFinland,
  finnishToUtc,
} from '../utils/timezone.js';

import BusinessHours from '../models/BusinessHours.js';

const router = express.Router();

export default (apiKey) => {
  // /api/rooms
  router.get('/api/rooms', async (req, res) => {
    if (req.headers.apikey !== apiKey) {
      logger.warn('Unauthorized access attempt', {ip: req.ip, path: req.path});
      return res.status(401).json({message: 'Unauthorized'});
    }
    try {
      const allRoomsArr = await Room.find({});
      if (!allRoomsArr.length) {
        res.status(404).json({message: 'Rooms data not found'});
      } else {
        // Convert array to object keyed by roomNumber for compatibility
        const allRooms = {};
        allRoomsArr.forEach(room => { allRooms[room.roomNumber] = room.toObject(); });
        res.json(allRooms);
      }
    } catch (error) {
      logger.error('Error fetching rooms data', {error: error.message});
      res.status(500).json({message: error.message});
    }
  });

  // /api/rooms/reservations
  router.get('/api/rooms/reservations', async (req, res) => {
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
      const allRoomsArr = await Room.find({});
      if (!allRoomsArr.length) {
        return res.status(404).json({message: 'Rooms data not found'});
      }
      const filteredRooms = allRoomsArr.filter((room) => {
        const matchesFloor = floor === 'All Floors' || room.floor === floor;
        const matchesStaff =
          Staffworkspace === 'true'
            ? room.details === 'Henkilöstön työtila' &&
              room.reservableStaff === 'true'
            : true;
        return matchesFloor && matchesStaff && room.building === 'KM';
      });
      const enrichedRooms = await Promise.all(
        filteredRooms.map(async (room) => {
          const reservations = await openData.checkOpenDataReservation(
            room.roomNumber,
            startDate,
            endDate,
          );
          return {
            ...room.toObject(),
            reserved: reservations.reservations.length > 0,
            reservationDetails: reservations.reservations[0] || null,
          };
        }),
      );
      res.json(enrichedRooms);
    } catch (error) {
      logger.error('Error fetching filtered rooms with reservations', {
        error: error.message,
      });
      res.status(500).json({message: error.message});
    }
  });

  // /api/rooms/freespace

  // /api/rooms/freespace
  router.get('/api/rooms/freespace', async (req, res) => {
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
          !squareMeters ||
          parseInt(room.squareMeters) >= parseInt(squareMeters);
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
            closingTime.setUTCHours(
              utcCloseHours,
              todayHours.closeMinutes,
              0,
              0,
            );

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

  // /api/rooms/freespace-full
  router.get('/api/rooms/freespace-full', async (req, res) => {
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
          !squareMeters ||
          parseInt(room.squareMeters) >= parseInt(squareMeters);
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
            isOpen &&
            closingTime &&
            !nextReservation &&
            minutesUntilClosing > 0;

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
                (r) =>
                  new Date(r.startDate) <= now && new Date(r.endDate) >= now,
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

  return router;
};
