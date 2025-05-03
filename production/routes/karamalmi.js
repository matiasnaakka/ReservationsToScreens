import express from 'express';
import logger from '../utils/logger.js';

const router = express.Router();

export default (apiKey) => {
  router.get('/api/karamalmi/rooms', async (req, res) => {
    if (req.headers.apikey !== apiKey) {
      logger.warn('Unauthorized access attempt', {ip: req.ip, path: req.path});
      return res.status(401).json({message: 'Unauthorized'});
    }
    try {
      logger.info('Fetching Karamalmi rooms from OpenData API');
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
        throw new Error(
          `OpenData API responded with status ${response.status}`,
        );
      }
      const data = await response.json();
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
  return router;
};
