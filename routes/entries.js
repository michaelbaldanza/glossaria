var express = require('express');
var router = express.Router();

const entriesCtrl = require('../controllers/entries');
 
router.get('/', entriesCtrl.index);
router.get('/new', entriesCtrl.new);

module.exports = router;