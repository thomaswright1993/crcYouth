var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({

    name             : String,
    security_level   : String,
    profile_pic_path : String,
    gender           : String,
    imagePath        : String,
    local            : {
        email           : String,
        password        : String
    },
    facebook         : {
        name            : String,
        id              : String,
        token           : String,
        email           : String
    },
    group            : {
        id              : String,
        name            : String,
        city            : String,
        country         : String
    }
});



// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// ============================================== //
// ============== SECURITY LEVELS =============== //
// ============================================== //

// === public - UNCLAIMED USER - 1 === //
// === youth - CLAIMED YOUTH - 2 === //
// === leader - STANDARD YOUTH LEADER - 3 === //
// === groupAdmin - HEAD LEADER/ GROUP ADMIN - 4 === //
// === siteAdmin - SITE ADMIN/ STATE YOUTH LEADER - 5 === //

userSchema.methods.setAccessLevel = function (accessLevel) {

    if(accessLevel === "public")
        this.security_level = 1;
    else if(accessLevel === "youth")
        this.security_level = 2;
    else if(accessLevel === "leader")
        this.security_level = 3;
    else if(accessLevel === "groupAdmin")
        this.security_level = 4;
    else if(accessLevel === "siteAdmin")
        this.security_level = 5;

    this.save(function(err, group) {
        if (err) return console.error(err);
        console.dir(group);
    });
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);

//mongoose.model('User', userSchema).find({}, function (err, users) {
//    for(var i = 0; i < users.length;i++){
//        if(users[i].name === "Thomas J Wright")
//        users[i].group._id = "55b07291d0f87b540ad3f6b2";
//        users[i].save();
//    }
//});
//mongoose.model('User', userSchema).find({}, function (err, users) {
//
//        if (err) return console.error(err);
//        for(var i = 0; i < users.length; i++){
//            if (users[i].local.email ===  "thomaswright1993@hotmail.com") {
//                users[i].imagePath = "thomas.jpg";
//                users[i].setAccessLevel("siteAdmin");
////                users[i].group = {
////                    id              : 'AriseYouth',
////                    name            : 'Arise Youth',
////                    country         : 'Australia',
////                    city            : 'Cairns'
////                };
//                users[i].save()
//            }
//        }
//});
