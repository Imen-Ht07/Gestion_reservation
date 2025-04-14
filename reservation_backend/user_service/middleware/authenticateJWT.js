const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.redirect('/login');
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user; 
    next(); 
  } catch (err) {
    return res.redirect('/login?token_invalid=1');
  }
};

module.exports = authenticateJWT;
