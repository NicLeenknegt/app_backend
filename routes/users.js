let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let User = mongoose.model('user');
let passport = require('passport');

router.post('/register', function (req, res, next) {
    if (!req.body.email || !req.body.password || !req.body.firstname || !req.body.lastname || !req.body.telNr || !req.body.rights) {
        return res.status(400).json({message: 'Please fill out all fields'});
    }
    let user = new User();
    user.email = req.body.email;
    user.firstname = req.body.firstname
    user.lastname = req.body.lastname
    user.telNr = req.body.telNr
    user.rights = req.body.rights
    user.setPassword(req.body.password);
    user.save(function (err, user) {
        if (err) {
            return next(err);
        }
        user.generateJWT();
        var obj = user.toObject({virtuals: true});
        delete obj.hash;
        delete obj.salt;
        return res.json(obj);
    });
});

router.post('/login', function (req, res, next) {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({message: 'Please fill out all fields'});
    }
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (user) {
            user.generateJWT();
            var obj = user.toObject({virtuals: true});
            delete obj.hash;
            delete obj.salt;
            return res.json(obj);
        } else {
            return res.status(401).json(info);
        }
    })(req, res, next);
});

router.post('/checkusername', function (req, res, next) {
    User.find({email: req.body.email}, function (err, result) {
        if (result.length) {
            res.json({email: 'alreadyexists'});
        } else {
            res.json({email: 'ok'});
        }
    });
});
module.exports = router;
