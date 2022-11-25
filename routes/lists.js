var express = require('express');
var router = express.Router();

const listsCtrl = require('../controllers/lists');

router.get('/', listsCtrl.index);
router.get('/new', isLoggedIn, listsCtrl.new);
router.get('/:id', listsCtrl.show);

router.post('/', listsCtrl.create);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/auth/google');
}

module.exports = router;