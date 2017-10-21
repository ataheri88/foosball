var express = require('express');
var router = express.Router();
var tableInterface = require('../utils/tableInterface');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/new', function(req, res, next) {
  res.send('new game');
});

router.get('/table', function(req,res,next) {
  tableInterface.sendCommand('glow');
  res.status(200);
});

module.exports = router;
