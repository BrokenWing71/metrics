var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    var StatsD = require('node-statsd');
    var client = new StatsD();

    var start = new Date().getTime();

    res.render('index', {title: 'Express'});

    var end = new Date().getTime();
    client.timing('response_time', end - start);
});

router.get('/welcome', function (req, res, next) {
  res.render('welcome');
});

router.get('/secure', function (req, res, next) {
  res.render('secure');
});

router.get('/login', function (req, res, next) {
  res.render('login');
});

router.post('/login', function (req, res, next) {

  var StatsD = require('node-statsd');
  var client = new StatsD();

  if (req.body.username && req.body.username === 'user' && req.body.password && req.body.password === 'pass') {
    client.increment('login.successful')

      req.session.authenticated = true;
      console.log('Authenticated')
      res.redirect('/secure');
  } else {
      client.increment('login.unsuccessful')

      console.log('Error: Username and password are incorrect');
      res.redirect('/login');
  }

});

router.get('/logout', function (req, res, next) {
  delete req.session.authenticated;
  res.redirect('/');
});

module.exports = router;
