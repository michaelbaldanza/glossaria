var express = require('express');
var router = express.Router();

const listsCtrl = require('../controllers/lists');

router.get('/', listsCtrl.index);
router.get('/new', isLoggedIn, listsCtrl.new);
router.get('/:id', listsCtrl.show);
router.get('/:id/edit', isLoggedIn, listsCtrl.edit);
router.post('/', isLoggedIn, listsCtrl.create);
router.delete('/:id', isLoggedIn, listsCtrl.delete);
router.put('/:id', isLoggedIn, listsCtrl.update);

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/auth/google');
}

module.exports = router;