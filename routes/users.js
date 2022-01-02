const express = require('express');
const router = express.Router();
const connect = require('connect-ensure-login');
const passport = require('passport');
const User = require('../models/user');

/* GET users listing. */
// connect.ensureLoggedIn('/users/login'),
router.get('/',
(req, res, next) => {
      User.find({}).then((users) => {
          return res.render('index', {users: users});
      }).catch(err =>{
        if(err) console.log(err);
      });
});

// logout
// passport.authenticate('local-login', { successFlash: 'Welcome!' }),
router.get('/signup',
 (req, res) => {
	res.render('users/signup');
});

router.post('/users/signup', (req, res) => {
  let user = new User({
    username: req.body.username,
    password: req.body.password
  });
  user.save()
  .then(success => {
    res.redirect('/users/login');
  }).catch(failed => console.log(failed));
	res.redirect('/');
});


// Login

// passport.authenticate('local-login', { successFlash: 'Welcome!' },
router.get('/users/login',
(req, res) => {
  if (req.user) {
    // res.sendFile(path.join(__dirname, 'login.html'));

    res.redirect('/users/'+ req.user.username);
  } else res.render('users/login', {user: req.user});
});
// Why doesn't this work?
router.post('/login',
  passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash:true
  })
);



router.get('/users/logout', (req, res) => {
  //req.user property is cleared and the login session is destroyed
  req.logout();
  req.session.save((err) => {
    if (err) throw err;
    req.flash('success', 'you are logouts')
    res.redirect('/');
  });
});
module.exports = router;
