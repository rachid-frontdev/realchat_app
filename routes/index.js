const router = require('express').Router();
const passport = require('passport');
require('../passport')(passport);
const User = require('../models/user');
/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'Express' });
});


module.exports = router;
