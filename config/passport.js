let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let mongoose = require('mongoose');
let User = mongoose.model('user');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    function (email, password, done) {
      User.findOne({ "email": email }, function (err, user) {
        if (err) {
          console.log("error");
          return done(err);
        }
        if (!user) {
          console.log("no user");
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
          console.log("false ww");
          return done(null, false, { message: 'Incorrect password.' });
        }
        console.log("done");
        return done(null, user);
      });
    })
);
