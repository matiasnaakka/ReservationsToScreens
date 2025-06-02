// Middleware to check both API key and JWT token
import jwt from 'jsonwebtoken';

export default (apiKey) => (req, res, next) => {
  // First check API key
  if (req.headers.apikey !== apiKey) {
    return res.status(401).json({message: 'Unauthorized: Invalid API Key'});
  }  console.log('Request path:', req.path);
  console.log('Request url:', req.url);
  console.log('Original url:', req.originalUrl);
  console.log('Headers present:', Object.keys(req.headers));
  // Routes that only require API key (no JWT token needed)
  // Since the middleware is mounted on /api, req.path will be without the /api prefix
  const publicRoutes = [
    '/login',        // This is for the login endpoint
    '/token/validate', // This is for token validation
    '/rooms/freespace-full',  // Only these two routes should be accessible without JWT
    '/rooms/freespace'        // Only these two routes should be accessible without JWT
  ];
  
  // Check if current path is in the public routes list
  const isPublicRoute = publicRoutes.includes(req.path);
  
  console.log('Is public route:', isPublicRoute);
  
  // Then check JWT token (except for public routes)
  if (!isPublicRoute) {
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
  } else {
    console.log('Public route accessed:', req.path);
  }

  next();
};
