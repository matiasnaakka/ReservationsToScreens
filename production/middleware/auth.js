// Middleware to check API key
export default (apiKey) => (req, res, next) => {
  if (req.headers.apikey !== apiKey) {
    return res.status(401).json({message: 'Unauthorized'});
  }
  next();
};
