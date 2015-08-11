var mongoose = require('mongoose');

var leaderSchema = mongoose.Schema({
    title : String,
    name : String,
    _id : String,
    imagePath : String
});
var Leader = mongoose.model('Leader', leaderSchema);

var groupSchema = mongoose.Schema({
    id              : String,
    name            : String,
    imagePath       : String,
    splashBackPath  : String,
    country         : String,
    city            : String,
    longitude       : String,
    latitude        : String,
    church :{
        name: String,
        websiteAddress: String
    },
    leaders:[leaderSchema]
});

groupSchema.methods.getPreview = function() {
    return {id: this.id, name: this.name, imagePath: this.imagePath, country: this.country, city: this.city, long: this.longitude, lat: this.latitude};
};

groupSchema.methods.getFull = function() {
    return {id: this.id, name: this.name, imagePath: this.imagePath, country: this.country, city: this.city, long: this.longitude, lat: this.latitude, splashBackPath: this.splashBackPath, church: this.church, leaders: this.leaders};
};

groupSchema.methods.update = function(id, name, imagePath, country, city, lat, long, leader) {
    this.id = id;
    this.name = name;
    this.imagePath = imagePath;
    this.country = country;
    this.city = city;
    this.longitude = long;
    this.latitude = lat;
    var leaderList = new Leader({
            name : leader.name,
            _id : leader._id
    });
    this.leaders = [leaderList];
    this.save(function(err, group) {
        if (err) return console.error(err);
        console.dir(group);
    });
};

groupSchema.statics.findByName = function(groupName, callback) {
    return this.find({ name: groupName }, callback);
};

groupSchema.statics.getAll = function(callback) {
    return this.find({}, callback);
};

module.exports = mongoose.model('Group', groupSchema);


//==================Create Group Here============================
//    var Group = mongoose.model('Group', groupSchema);
//    var ariseYouth = new Group({
//        id              : 'AriseYouth',
//        name            : 'Arise Youth',
//        imagePath       : 'arise.jpg',
//        splashBackPath  : 'ariseSplashBack.png',
//        country         : 'Australia',
//        city            : 'Cairns',
//        longitude       : '145.740781',
//        latitude        : '-16.959313',
//        church          : {
//            name           : 'Cairns Family Church',
//            websiteAddress : 'http://www.cairnsfamilychurch.org.au/'
//        },
//        leaders         : [
//            {
//                title: "Master Chief",
//                _id: "55afa4668f24533008892e63",
//                name: "Thomas Wright",
//                imagePath: "thomas.jpg"
//            },
//            {
//                title: "Razel Dazel",
//                _id: "55afa4668f24533008892e63",
//                name: "Ramon Affleck",
//                imagePath: "thomas.jpg"
//            },
//            {
//                title: "On Missions",
//                _id: "555c44fee896efcc788c40bd",
//                name: "Laura Wright",
//                imagePath: "thomas.jpg"
//            }
//        ]
//    });
//    ariseYouth.save(function(err, newGroup) {
//        if (err) return console.error(err);
//        console.dir(newGroup);
//    });
//    var newGroup = new Group({
//        id              : 'CFCYouth',
//        name            : 'CFC Youth',
//        imagePath       : 'cfc.jpg',
//        country         : 'Australia',
//        city            : 'Adelaide',
//        longitude       : '138.505573',
//        latitude        : '-34.897773',
//        church          : {
//            name           : 'Seaton Christian Family Centre',
//            websiteAddress : 'http://www.familycentre.org.au/'
//        }
//    });
//    newGroup.save(function(err, newGroup) {
//        if (err) return console.error(err);
//        console.dir(newGroup);
//    });
//
//    var newGroup3 = new Group({
//        id              : 'NovaYouth',
//        name            : 'Nova Youth',
//        imagePath       : 'nova.jpg',
//        country         : 'Australia',
//        city            : 'Murray Bridge',
//        longitude       : '139.252089',
//        latitude        : '-35.129448',
//        church          : {
//            name           : 'Murray Bridge CFC',
//            websiteAddress : 'http://www.christianfamilycentre.com.au/'
//        }
//    });
//    newGroup3.save(function(err, newGroup) {
//        if (err) return console.error(err);
//        console.dir(newGroup);
//    });
//    var newGroup4 = new Group({
//        id              : 'IgnitedYouth',
//        name            : 'Ignited Youth',
//        imagePath       : 'ignited.jpg',
//        splashBackPath  : 'ignitedSplashBack.jpg',
//        country         : 'Australia',
//        city            : 'Ballarat',
//        longitude       : '143.852794',
//        latitude        : '-37.555070',
//        church          : {
//            name           : 'Ballarat Christian Fellowship',
//            websiteAddress : 'http://ballaratcrc.org.au/'
//        }
//    });
//    newGroup4.save(function(err, newGroup) {
//        if (err) return console.error(err);
//        console.dir(newGroup);
//    });
//    var newGroup5 = new Group({
//        id              : 'YoungHearts',
//        name            : 'Young Hearts',
//        imagePath       : 'younghearts.jpg',
//        country         : 'Australia',
//        city            : 'Melbourne',
//        longitude       : '144.782924',
//        latitude        : '-37.875796',
//        church          : {
//            name           : 'Altona Christian Centre',
//            websiteAddress : 'http://altonacc.org/'
//        }
//    });
//    newGroup5.save(function(err, newGroup) {
//        if (err) return console.error(err);
//        console.dir(newGroup);
//    });
//    var newGroup6 = new Group({
//        id              : 'TorqueYouth',
//        name            : 'Torque Youth',
//        imagePath       : 'torque.jpg',
//        country         : 'Australia',
//        city            : 'Red Cliffs',
//        longitude       : '142.187740',
//        latitude        : '-34.306678',
//        church          : {
//            name           : 'DiggerLand',
//            websiteAddress : 'http://diggerland.org.au/'
//        }
//    });
//    newGroup6.save(function(err, newGroup) {
//        if (err) return console.error(err);
//        console.dir(newGroup);
//    });
//    var newGroup7 = new Group({
//        id              : 'HopeToYouth',
//        name            : 'Hope To Youth',
//        imagePath       : 'hope.jpg',
//        country         : 'Australia',
//        city            : 'Atherton',
//        longitude       : '145.4720601439476',
//        latitude        : '-17.26337116897664',
//        church          : {
//            name           : 'Atherton Family Church',
//            websiteAddress : ''
//        }
//    });
//    newGroup7.save(function(err, newGroup) {
//        if (err) return console.error(err);
//        console.dir(newGroup);
//    });
//===============================================================

//==================Update Group Here============================
//    mongoose.model('Group', groupSchema).findByName('Nova Youth', function(err, groups) {
//        if (err) return console.error(err);
//        for(var i = 0; i < groups.length; i++){
//            groups[i].splashBackPath = "crcYthSPLASHBACKnoTEXT.png";
//            console.dir(groups[i].splashBackPath);
//        }
//    });

//===============================================================