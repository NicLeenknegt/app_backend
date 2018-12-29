let mongoose = require('mongoose')
let User = mongoose.model('user')

let ChildSchema = new mongoose.Schema({
    firstname: {
        type:String,
        required: true
    },
    lastname: {
        type:String,
        required: true
    },
    condition: {
        type: String,
        trim: true
    },
    medication: [{
        name: String,
        note:String
    }],
    allergies: {
        type:String,
        trim: true
    }, dates: [{
        date:Date,
        time:String
    }],
    birthDate: Date,
    birthDateString:String,
    sex:String
})

ChildSchema.pre('remove', function(next){
    this.model('user').update(
        {},
        { $pull: { 'children': { 'child': this._id }  } },
        { safe: true },
        function(err, user) {
            if (err) {
                console.log(err);
                console.log("CHECK");
                return next(err)
            }
            return next();
        }
    );
}) 

mongoose.model('child', ChildSchema)