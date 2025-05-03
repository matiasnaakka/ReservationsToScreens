import express from 'express';
import openData from '../utils/opendata.js';
import logger from '../utils/logger.js';

const router = express.Router();

export default (apiKey) => {
  // GET /api/reservations
  router.get('/api/reservations', async (req, res) => {
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

  // POST /api/reservations/search
  router.post('/api/reservations/search', async (req, res) => {
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

  return router;
};
