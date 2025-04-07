// middleware/authorize.js
module.exports = function authorize(roles = []) {
    if (typeof roles === 'string') roles = [roles];
  
    return (req, res, next) => {
      const user = req.user; // injecté via middleware OAuth
  
      if (!user || (roles.length && !roles.includes(user.role))) {
        return res.status(403).json({ message: 'Accès refusé' });
      }
  
      next();
    };
  };
  