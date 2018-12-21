let mongoose = require('mongoose');
let crypto = require('crypto');
let jwt = require('jsonwebtoken');

let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        unique: true
    },
    firstname: String,
    lastname: String,
    telNr: String,
    rights: Number,
    hash: String,
    salt: String,
    token: {
        type: String,
        default: null
    },
    children: [{
        child:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'child'
            }
    }]

});

UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(32).toString('hex');
    this.hash = crypto
        .pbkdf2Sync(password, this.salt, 10000, 64, 'sha512')
        .toString('hex');
};

UserSchema.methods.validPassword = function (password) {
    let hash = crypto
        .pbkdf2Sync(password, this.salt, 10000, 64, 'sha512')
        .toString('hex');
    return this.hash === hash;
};

UserSchema.methods.generateJWT = function () {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    this.token = jwt.sign(
        {
            _id: this._id,
            email: this.email,
            rights: this.rights,
            exp: parseInt(exp.getTime() / 1000)
        },
        process.env.LENTEKIND_SECRET
    );
};

mongoose.model('user', UserSchema);
