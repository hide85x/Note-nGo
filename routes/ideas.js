const express = require('express');
const router = express.Router();

const Idea = require('../models/Idea');
const { ensureAuthenticated } = require('../helpers/auth'); // destrukturyzujekmy sobie obiekt helper.auth i bierzemy ensureAuth...



router.get('/', ensureAuthenticated, (req, res, next) => {
    Idea.find({ user: req.user.id })
        .sort({ date: 'desc' })
        .then(ideas => {

            res.render('ideas/index', {
                ideas: ideas
            });
        });
});
router.get('/edit/:id', ensureAuthenticated, (req, res, next) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            if (idea.user != req.user.id) {
                req.flash('error_msg', "what are You doing here!? Youre not auth!")
                res.redirect('/ideas')
            }else {
                res.render('ideas/edit', {
                    idea: idea
                })
            }
        })
})
router.get('/add', ensureAuthenticated, (req, res, next) => {
    res.render('ideas/add')
});
router.post('/', ensureAuthenticated, (req, res, next) => {
    let errors = [];
    const title = req.body.title;
    const details = req.body.details;
    console.log(req.user)

    if (!req.body.title || !req.body.details) {
        errors.push({ message: 'fill the form bitch!' })
    }
    if (errors.length > 0) {

        console.log(errors[0].message)
        res.render('ideas/add', {
            errors: errors,
            title: title,
            details: details
        })
    } else {
        const newUser = new Idea({
            title: title,
            details: details,
            user: req.user.id
        })
            .save()
            .then(idea => {
                req.flash('success_msg', "Video idea added!");

                res.redirect('/ideas')
            })
    }
});

router.put('/:id', ensureAuthenticated, (req, res, next) => {
    Idea.findOne({
        _id: req.params.id
    })
        .then(idea => {
            idea.title = req.body.title;
            idea.details = req.body.details;
            idea.save()
                .then(idea => {
                    req.flash('success_msg', "Video idea updated!");

                    res.redirect('/ideas')
                })
        });
});

router.delete('/:id', ensureAuthenticated, (req, res, next) => {
    const id = req.params.id
    Idea.findByIdAndDelete(id)
        .then(idea => {
            idea.save()
                .then(() => {
                    console.log(' im done with that shit');
                    req.flash('success_msg', "Video idea removed!");
                    res.redirect('/ideas')
                }
                )
        })
        .catch(err => console.log(err));
});


module.exports = router;