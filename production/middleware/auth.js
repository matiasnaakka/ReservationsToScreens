// Middleware to check both API key and JWT token
import jwt from 'jsonwebtoken';

export default (apiKey) => (req, res, next) => {
  // First check API key
  if (req.headers.apikey !== apiKey) {
    return res.status(401).json({message: 'Unauthorized: Invalid API Key'});
  }
  
  // Then check JWT token (except for /api/login and /api/token/validate routes)
  if (req.path !== '/api/login' && req.path !== '/api/token/validate') {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret');
      req.user = decoded;
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  }
  
  next();
};
