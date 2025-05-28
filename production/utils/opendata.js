import { config } from 'dotenv';
import doFetch from './doFetch.js';
import logger from './logger.js';

config();

/**
 * Check reservations from open data.
 *
 * @param {string} code - The code of the realization.
 * @param {string} studentGroup - The student group.
 * @returns {Promise} The data from the API.
 */
const checkOpenDataReservations = async (code, studentGroup) => {
  const url = 'https://opendata.metropolia.fi/r1/reservation/search';
  logger.debug('Checking OpenData reservations', { code, studentGroup });

  const body = JSON.stringify({
    ...(code ? {realization: [code]} : {}),
    ...(studentGroup ? {studentGroup: [studentGroup]} : {}),
  });

  const options = {
    method: 'POST',
    headers: {
     'Authorization': 'Basic ' + btoa(`${process.env.APIKEYMETROPOLIA}:`),
      'Content-Type': 'application/json',
    },
    body: body,
  };

  try {
    return await doFetch(url, options);
  } catch (error) {
    logger.error('OpenData reservation check failed', { error: error.message, code, studentGroup });
    throw error;
  }
};

/**
 * Check realization from open data.
 *
 * @param {string} code - The code of the realization.
 * @returns {Promise} The data from the API.
 */
const checkOpenDataRealization = async (code) => {
  const url = 'https://opendata.metropolia.fi/r1/realization/search';
  logger.debug('Checking OpenData realization', { code });

  const options = {
    method: 'POST',
    headers: {
   'Authorization': 'Basic ' + btoa(`${process.env.APIKEYMETROPOLIA}:`),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({codes: [code]}),
  };

  try {
    return await doFetch(url, options);
  } catch (error) {
    logger.error('OpenData realization check failed', { error: error.message, code });
    throw error;
  }
};

/**
 * Check single reservation from open data.
 *
 * @param {string} [room] - The room code.
 * @param {string} [startDate] - Optional start date in ISO format
 * @param {string} [endDate] - Optional end date in ISO format
 * @returns {Promise} The data from the API.
 */
const checkOpenDataReservation = async (room, startDate, endDate) => {
  const url = 'https://opendata.metropolia.fi/r1/reservation/search';
  logger.debug('Checking OpenData reservation', { room, startDate, endDate });

  const searchParams = {
    ...(room && { room: [room] }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate })
  };

  const options = {
    method: 'POST',
    headers: {
    'Authorization': 'Basic ' + btoa(`${process.env.APIKEYMETROPOLIA}:`),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(searchParams)
  };

  try {
    return await doFetch(url, options);
  } catch (error) {
    logger.error('OpenData reservation check failed', { error: error.message, room, startDate, endDate });
    throw error;
  }
};

/**
 * Open data functions.
 */
const openData = {
  checkOpenDataReservations,
  checkOpenDataRealization,
  checkOpenDataReservation,
};

export default openData;
