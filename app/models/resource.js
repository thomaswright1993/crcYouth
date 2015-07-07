var mongoose = require('mongoose');

var resourceSchema = mongoose.Schema({
    title           : String,
    body            : String,
    tags            : {},
    writerID        : String,
    dateWritten     : Date
});

resourceSchema.methods.getPreview = function() {
    return {id: this._id, title: this.title, tags: this.tags, writerID: this.writerID, date: this.dateWritten};
};

resourceSchema.methods.getFull = function() {
    return {id: this._id, title: this.title, body: this.body, tags: this.tags, writerID: this.writerID, date: this.dateWritten};
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


//==================Create Resource Here============================
//for (var o = 26; o < 50; o++) {
//    var Resource = mongoose.model('Resource', resourceSchema);
//    var tag1 = "Awesome";
//    var tag2 = "Epic";
//    var tag3 = o;
//    var tags = [tag1, tag2, tag3];
//    var newResource = new Resource({
//        title: 'Article '+o,
//        tags: tags,
//        body: '<h1><b>Hello</b>World</h1><iframe id="player" type="text/html" width="640" height="390" ' +
//            'src="http://www.youtube.com/embed/dy9nwe9_xzw?enablejsapi=1&origin=http/crcyouth.com" ' +
//            'frameborder="0"></iframe>',
//        writerID: 'Thomas '+o+' Wright',
//        dateWritten: new Date()
//    });
//    newResource.save(function (err, newGroup) {
//        if (err) return console.error(err);
//        console.dir(newGroup);
//    });
//}
//===============================================================

//==================Update Group Here============================
//    mongoose.model('Group', groupSchema).findByName('Arise Youth', function(err, groups) {
//        if (err) return console.error(err);
//        for(var i = 0; i < groups.length; i++){
//            groups[i].update('AriseYouth','Arise Youth','arise.jpg','Australia','Cairns','-16.959322','145.740749', {})
//        }
//    });
//===============================================================