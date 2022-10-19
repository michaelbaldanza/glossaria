var express = require('express');
var router = express.Router();

const defaults = require('../config/defaults');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: defaults.appName });
});

module.exports = router;
