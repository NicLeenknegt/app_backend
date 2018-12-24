var express = require('express');
var router = express.Router();
let mongoose = require('mongoose');
let Recipe = mongoose.model('Recipe');
let Ingredient = mongoose.model('Ingredient');
let jwt = require('express-jwt');

let User = mongoose.model('user')
let Child = mongoose.model('child')
let auth = jwt({
    secret: process.env.LENTEKIND_SECRET
});

router.get('/API/', function (req, res, next) {
    res.json({message: "android verbind lokaal"});

});

router.post('/API/parent/:userid/children', function (req, res, next) {
    let child = new Child(req.body)
    child.save(function (err, child) {
        if (err) {
            console.log("POST");
            return next(err);
        }
        let userQuerry = User.updateOne({_id: req.params.userid}, {'$push': {children: {'child': child}}})
        userQuerry.exec(function (err, user) {
            if (err) {
                return next(err);
            }
            res.json(child);
        })
    })
})

router.put('/API/parent/children', function (req, res, next) {
    Child.findByIdAndUpdate(req.body._id, req.body, function (err, child) {
        if (err) {
            return next(err);
        }
        res.json({'message': 'ok'})
    })
})

router.get('/API/parent/:user', function (req, res, next) {
    console.log(JSON.stringify(req.userParam.children[2].child));
    res.json(req.userParam.children)
})

router.delete('/API/parent/:child', function (req, res, next) {
    req.child.remove(function (err) {
        if (err) {
            return next(err)
        }
        res.json({'message': 'ok'})
    });
});

router.put('/API/parent/dates/:child', function (req, res, next) {
    req.child.update({$set: {dates: req.body}}, function (err, child) {
        if (err) {
            return next(err);
        }
        res.json({'message': 'ok'})
    })
})

router.param('user', function (req, res, next, id) {
    let query = User.findById(id).populate('children.child');
    query.exec(function (err, userParam) {
        if (err) {
            return next(err);
        }
        if (!userParam) {
            return next(new Error('user ' + id + ' not found'));
        }
        req.userParam = userParam;
        return next();
    })
});

router.param('child', function (req, res, next, id) {
    let query = Child.findById(id)
    query.exec(function (err, child) {
        if (err) {
            return next(err);
        }
        if (!child) {
            return next(new Error('user ' + id + ' not found'))
        }
        req.child = child;
        return next();
    });
});

router.get('/API/admin/parents', function (req, res, next) {
    User
        .find({rights: 1}, {firstname: 1, lastname: 1, children: 1, paidDates: 1})
        .populate('children.child')
        .exec(function (err, users) {
            if (err) {
                return next(err);
            }
            console.log(JSON.stringify(users[0].children[0].child))
            res.json(users)
        })
})

router.put('/API/admin/parent/:parent_id/paid', function (req, res, next) {
    User.findOneAndUpdate({ _id:req.params.parent_id }, { $push: { paidDates: req.body.date } }, function (err, child) {
        if (err) { return next(err); }
        res.json({'message': 'ok'})
    })
});

router.put('/API/admin/parent/:parent_id/unpaid', function (req, res, next) {
    User.findOneAndUpdate({ _id:req.params.parent_id }, { $pull: { paidDates: req.body.date } }, function (err, child) {
        if (err) { return next(err); }
        res.json({'message': 'ok'})
    })
});

module.exports = router;
