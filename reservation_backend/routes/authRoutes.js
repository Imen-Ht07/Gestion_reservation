const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    successRedirect: '/dashboard', // à adapter selon ton front
  })
);

router.get('/logout', (req, res) => {
  req.logout(err => {
    if (err) return res.status(500).send(err);
    res.redirect('/');
  });
});

module.exports = router;