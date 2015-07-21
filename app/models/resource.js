var mongoose = require('mongoose');

var idSchema = mongoose.Schema({ _id: String });
var ID = mongoose.model('ID', idSchema);

var resourceSchema = mongoose.Schema({
    title           : String,
    body            : String,
    tags            : [],
    writerID        : String,
    dateWritten     : Date,
    likes           : [idSchema]
});


resourceSchema.methods.getPreview = function() {
    return {id: this._id, title: this.title, tags: this.tags, writerID: this.writerID, date: this.dateWritten, likes: this.likes[0]};
};

resourceSchema.methods.getFull = function() {
    return {id: this._id, title: this.title, body: this.body, tags: this.tags, writerID: this.writerID, date: this.dateWritten, likes: this.likes[0]};
};

resourceSchema.methods.checkLikes = function(userID) {
    var userLikes = false;
    var newID = new ID({_id:userID});
    for(var i = 0; i < this.likes.length; i++){
        if (this.likes[i]._id === newID._id){
            userLikes = true;
        }
    }
    return [this.likes[0]._id, userLikes];
};

resourceSchema.methods.addLike = function(userID){
    var userLikes = false;
    var newID = new ID({_id:userID});
    for(var i = 0; i < this.likes.length; i++){
        if (this.likes[i]._id === newID._id){
            userLikes = true
        }
    }
    if(!userLikes){
        this.likes[0]._id =  parseInt(this.likes[0]._id) + 1;
        this.likes.push(newID);
    }
    this.save();
    return this.likes[0];
};

resourceSchema.methods.removeLike = function(userID){
    var newID = new ID({_id:userID});
    for(var i = 0; i < this.likes.length; i++){
        if (this.likes[i]._id === newID._id){
            this.likes[0]._id = parseInt(this.likes[0]._id) - 1;
            this.likes.splice(i, 1);
        }
    }
    this.save();
    return this.likes[0];
};

resourceSchema.methods.update = function(title, tags, body, writer) {
    this.title = title;
    this.tags = tags;
    this.body = body;
    this.writerID = writer;
    this.save(function(err, resource) {
        if (err) return console.error(err);
        console.dir(resource);
    });
};

resourceSchema.statics.findByTitle = function(resourceTitle, callback) {
    return this.find({ title: resourceTitle }, callback);
};

resourceSchema.statics.getAll = function(callback) {
    return this.find({}, callback);
};

module.exports = mongoose.model('Resource', resourceSchema);


// NEED A CHECKER TO REMOVE #'s ~'s and :'s when tag or title is inputted  =============================================================================

//==================Create Resource Here============================
//var Resource = mongoose.model('Resource', resourceSchema);
//for (var o = 0; o < 75; o++) {
//    var tag1 = {value: "Awesome"};
//    var tag2 = {value: "Epic"};
//    var tag3 = {value: o};
//    var tags = [tag1, tag2, tag3];
//    if (o % 5 === 1){
//        tags.push({value: "Rare"});
//    }
//    if (o % 20 === 1){
//        tags.push({value: "A"});
//        tags.push({value: "B"});
//        tags.push({value: "Hello"});
//        tags.push({value: "World"});
//        tags.push({value: "TAG WITH SPACE"});
//        tags.push({value: "RareTAG"});
//        tags.push({value: "SUPERLONGTAGTHATISSUPERSUPERLONGANDOBNOXIOUS"});
//        tags.push({value: "SmallTag"});
//
//    }
//    var newResource = new Resource({
//        title: 'Article '+o,
//        tags: tags,
//        body: '<h1><b>Hello</b>World</h1><iframe id="player" type="text/html" width="640" height="390" ' +
//            'src="http://www.youtube.com/embed/dy9nwe9_xzw?enablejsapi=1&origin=http/crcyouth.com" ' +
//            'frameborder="0"></iframe>',
//        writerID: 'Thomas '+o+' Wright',
//        dateWritten: new Date(),
//        likes: [new ID({_id:0})]
//    });
//    newResource.save(function (err, newGroup) {
//        if (err) return console.error(err);
//        console.dir(newGroup);
//    });
//}
//===============================================================

//==================Update Group Here============================
//    mongoose.model('Resource', resourceSchema).find({}, function(err, resource) {
//        if (err) return console.error(err);
//        for(var i = 0; i < resource.length; i++){
//            resource[i].likes = [1,"555c44fee896efcc788c40bd"];
//            resource[i].save();
//        }
//
//    });
//===============================================================



