var mongoose = require('mongoose');

var groupSchema = mongoose.Schema({
    id              : String,
    name            : String,
    imagePath       : String,
    country         : String,
    city            : String,
    longitude       : String,
    latitude        : String
});

var leaderSchema = mongoose.Schema({
    name : String,
    _id : String
});

var Leader = mongoose.model('Leader', leaderSchema);

groupSchema.methods.getPreview = function() {
    return {id: this.id, name: this.name, imagePath: this.imagePath, country: this.country, city: this.city, long: this.longitude, lat: this.latitude};
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
//    var newGroup = new Group({
//        id              : 'CFCYouth',
//        name            : 'CFC Youth',
//        imagePath       : 'cfc.jpg',
//        country         : 'Australia',
//        city            : 'Adelaide',
//          longitude       : '',
//          latitude        : ''
//    });
//    newGroup.save(function(err, newGroup) {
//        if (err) return console.error(err);
//        console.dir(newGroup);
//    });
//===============================================================

//==================Update Group Here============================
//    mongoose.model('Group', groupSchema).findByName('Arise Youth', function(err, groups) {
//        if (err) return console.error(err);
//        for(var i = 0; i < groups.length; i++){
//            groups[i].update('AriseYouth','Arise Youth','arise.jpg','Australia','Cairns','-16.959322','145.740749', {})
//        }
//    });
//===============================================================