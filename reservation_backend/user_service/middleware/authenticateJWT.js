const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.redirect('/home');
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user; 
    next(); 
  } catch (err) {
    return res.redirect('/home?token_invalid=1');
  }
};

module.exports = authenticateJWT;
