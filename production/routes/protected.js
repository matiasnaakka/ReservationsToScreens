import express from 'express';
const router = express.Router();

export default (apiKey) => {
  router.get('/protected', (req, res) => {
    if (req.headers.apikey === apiKey) {
      res.json({message: 'Access granted'});
    } else {
      res.status(401).json({message: 'Unauthorized'});
    }
  });
  return router;
};
