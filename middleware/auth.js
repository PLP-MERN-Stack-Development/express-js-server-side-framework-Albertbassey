// middleware/auth.js
const auth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validKey = '123456'; // Replace with your actual key or use .env

  if (apiKey === validKey) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized: Invalid API Key' });
  }
};

module.exports = auth;
