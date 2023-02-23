var express = require('express');
var router = express.Router();

const responsesCtrl = require('../controllers/responses');

router.get('/', responsesCtrl.index);
router.get('/new', responsesCtrl.new);
router.get('/:word', responsesCtrl.show);
router.post('/', responsesCtrl.create);

module.exports = router;