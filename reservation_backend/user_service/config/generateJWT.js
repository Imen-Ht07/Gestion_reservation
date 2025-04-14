const jwt = require('jsonwebtoken');
const generateJWT = (user) => {
  const payload = {
    userId: user._id,  // Utilisez l'ID de l'utilisateur pour le payload
    email: user.email,
    role: user.role,  // Inclure un rôle utilisateur si nécessaire
  };

  const secretKey = process.env.JWT_SECRET || '654654646cfdfvhidfhvildghd';  
  const token = jwt.sign(payload, secretKey, { expiresIn: '1d' }); 

  return token;
};

module.exports = generateJWT;
