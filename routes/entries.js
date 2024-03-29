var express = require('express');
var router = express.Router();

const entriesCtrl = require('../controllers/entries');

// auth checks left in, as in intended product
// router.get('/', entriesCtrl.index);
// router.get('/new', isLoggedIn, entriesCtrl.new);
// router.get('/:id', entriesCtrl.show);
// router.get('/:id/edit', isLoggedIn, entriesCtrl.edit);
// router.post('/', isLoggedIn, entriesCtrl.create);
// router.delete('/:id', isLoggedIn, entriesCtrl.delete);
// router.put('/:id', isLoggedIn, entriesCtrl.update);

// auth checks removed to speed up development
router.get('/', entriesCtrl.index);
router.get('/new', entriesCtrl.new);
router.get('/:id', entriesCtrl.show);
router.get('/:id/edit', entriesCtrl.edit);
router.post('/', entriesCtrl.create);
router.delete('/:id', entriesCtrl.delete);
router.put('/:id', entriesCtrl.update);

function isLoggedIn(req, res, next) {
  console.log('hitting entries isLoggedIn');
  if (req.isAuthenticated()) return next();
  res.redirect('/auth/google' + '?redirect_url=' + req.originalUrl);
}

module.exports = router;