const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user.js');
const DB_Url = process.env.DB_URL;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

module.exports = (passport) => {
  passport.use('local-login', new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password'},
      (username, password, done) => {
      User.findOne({ username: username }, function (err, user) {
        //DB err can't find
        if (err) throw err;
        // When the username itself is not in the DB
        if (!user) {
          return done(null, false,{message:'Incorrect username.'});
        } else {
          bcrypt.compare(password,user.password,(err,isMatch) => {
              if (err) { return done(err); }
              else {
                if(isMatch) done(null,user);
                else done(null,false,{message:'Incorrect password.'});
              }
          });
        }
      });
  }));

  passport.serializeUser(function(user, done) {
    //only user._id is stored in the session
      return done(null, user._id);
  });
  passport.deserializeUser(function(_id, done) {
    //maintains the login after successful authentication and is called every time the user visits the web page .
      User.findById(_id, function (err, user) {
        return done(err, user);
        // At this time, the second argument, user, becomes req.user
      });
  });
        //   login page.
        function ensureAuthenticated(req, res, next) {
          if (req.isAuthenticated()) { return next(); }
          res.redirect('/users/login');
        }

}
// module.exports = passport;
