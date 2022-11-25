var express = require('express');
var router = express.Router();
const passport = require('passport');
const User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user);
  User.find({}, (err, allUsers) => {
    res.render('index', {
      user: req.user,
      allUsers: allUsers,
    });
  })
});

router.get('/auth/google', passport.authenticate(
  'google',
  { scope: ['profile', 'email'] }
));

router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successReturnToOrRedirect: '/',
    failureRedirect: '/',
  }
));

router.get('/logout', function(req, res) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;
