var express = require('express');
var router = express.Router();

const entriesCtrl = require('../controllers/entries');

router.get('/:id', entriesCtrl.show);
router.get('/', entriesCtrl.index);
router.get('/new', entriesCtrl.new);
router.post('/', entriesCtrl.create);

module.exports = router;