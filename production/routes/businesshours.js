import express from 'express';
import logger from '../utils/logger.js';
import {db} from '../utils/firebase.js';

const router = express.Router();

export default (apiKey) => {
  router.get('/api/businesshours', async (req, res) => {
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
      logger.error('Error fetching business hours data', {
        error: error.message,
      });
      res.status(500).json({message: error.message});
    }
  });
  return router;
};
