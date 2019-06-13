const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/Users');

module.exports = function (passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        console.log(email)
        User.findOne({
            email: email
        }).then(user => {
            if (!user) {
                return done(null, false, { message: "No user found!" }) // null= error, false to nasz brak usera
            }
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        console.log('passwords macth!')
                        return done(null, user)
                    } else {
                        return done(null, false, { message: "Password incoreect!" }) // null= error, false to nasz brak usera
                    }
                })
                .catch(err=> {
                    console.log(err)
                })

        })
    }));
    passport.serializeUser(function(user, done) {
        done(null, user.id);
      });
      
      passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });
}