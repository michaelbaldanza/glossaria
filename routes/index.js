var express = require('express');
const api = require('../utils/api');
var router = express.Router();
const passport = require('passport');
const User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  User.find({}, (err, allUsers) => {
    res.render('index', {
      word: req.word,
      user: req.user,
      allUsers: allUsers,
    });
  })
});

router.get('/auth/google', (req, res, next) => {
  const authenticator = passport.authenticate('google', {scope: ['profile', 'email']});
  authenticator(req, res, next);
})

router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect: '/',
    failureRedirect: '/',
  }),
);

router.post('/:lookup', async function(req, res) {
  console.log(req.body);
  const lookup = req.body.word;
  const keys = Object.keys(api.info);
  const dict = {};
  for (let a = 0; a < keys.length; a ++) {
    const key = keys[a];
    dict[key] = await api.info[key].compose(lookup);
  }
  console.log(dict['fd']);
  res.render('lookup', {
    info: api.info,
    mws: dict['mw'],
    oxfordUS: dict['odus'],
    oxfordGB: dict['odgb'],
    fds: dict['fd'],
    lookup: lookup,
    user: req.user,
  });
});

// router.get('/oauth2callback',
//   passport.authenticate('google', { failureRedirect: '/login'}),
//   (req, res) => {
//     try {
//       console.log(`hitting /oauh2callback`);
//       console.log(req.query);
//       console.log(`........seems to be kicking around`);
//       const { state } = req.query.state;
//       console.log(`........assigning req.query.state to const { state }`);
//       console.log(req.query.state);
//       const { returnTo } = JSON.parse(new Buffer(state, 'base64').toString())
//       console.log(`.........parsing JSON`);
//       console.log(returnTo);
//       console.log(`I'm going back to ${returnTo}`);
//       if (typeof returnTo === 'string' && returnTo.startsWith('/')) {
//         console.log(returnTo);
//         return res.redirect(returnTo);
//       }
//     } catch {

//     }
//     res.redirect('/')
//   }
// );

router.get('/logout', function(req, res) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function isLoggedIn(req, res, next) {
  console.log(`hitting isLoggedIn`);
  req.session.returnTo = req.originalUrl;
  console.log(req.originalUrl);
  if (req.isAuthenticated()) return next();
  res.redirect('/auth/google' + '?redirect_to=' + req.originalUrl);
}

module.exports = router;
