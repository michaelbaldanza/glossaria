var express = require('express');
var router = express.Router();

const entriesCtrl = require('../controllers/entries');
 
router.get('/', entriesCtrl.index);

module.exports = router;