
const express = require('express');
const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const passport = require('passport');

const router = express.Router();

router.get('/login', (req, res, next) => {
    res.render('users/login')
});

router.get('/register', (req, res, next) => {
    res.render('users/register')

});
router.post('/register', (req, res, next) => {
    const name = req.body.name
    const email = req.body.email
    const password = req.body.password
    const password2 = req.body.password2

    const errors = [];
    if (req.body.password !== req.body.password2) {
        errors.push({ message: ' Passwords has to match!' })
    }
    if (req.body.password.length < 4) {
        errors.push({ message: ' Password is too short, at least 4 chars' })
    }
    if (errors.length > 0) {
        res.render('users/register', {
            name: name,
            email: email,
            // password: password,
            // password2: password2,
            errors: errors
        });
        console.log(errors[0].message)


    } else {
        User.findOne({ email: email })
            .then(user => {
                if (user) {
                    console.log('this guy is already here!!!!');
                    req.flash('error_msg', "That email is alredy in our database!")
                    res.redirect('register')
                } else {
                    bcrypt
                        .hash(password, 12)
                        .then(hashedPassword => {
                            const newUser = new User({
                                name: name,
                                email: email,
                                password: hashedPassword,
                                // password2: password2
                            })
                            return newUser.save()
                        })
                        .then(result => {
                            console.log(result)
                            req.flash('success_msg', " You are IN!!!!");
                            res.redirect('login')
                        })


                }
            })
            .catch(err => console.log(err))
    }
});

router.post('/login', (req, res, next)=> {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);

});
router.get('/logout', (req, res, next)=> {
    req.logout();
    req.flash('success_msg', 'Youre logout!');
    res.redirect('/users/login');
})


module.exports = router



