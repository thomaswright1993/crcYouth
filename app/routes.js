module.exports = function(app, passport) {

// normal routes ===============================================================

    app.get('/', function (req, res) {
        res.sendFile('index.html', { root: "./views/html" });
    });

    // PROFILE SECTION =========================
    app.get('/getProfile', checkAccessLevel(1), function (req, res) {
        var user = req.user;
        if (user.imagePath === undefined)
            user.imagePath = "noProfilePic.jpg";
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(user));
    });

    // LOGOUT ==============================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/#/');
    });


//  =============================================================================
//  AUTHENTICATE (FIRST LOGIN) ==================================================
//  =============================================================================

    app.get('/getLogin', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        var message = req.flash('loginMessage');
        console.log(req.flash('loginMessage'));
        res.end(JSON.stringify(message));
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/#profile', // redirect to the secure profile section
        failureRedirect: '/#login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));


    // SIGNUP =================================
    // show the signup form
    app.get('/signup', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        var message = req.flash('loginMessage');
        console.log(req.flash('loginMessage'));
        res.end(JSON.stringify(message));
    });

////    process the signup form
//    app.post('/signup/:id', passport.authenticate('local-signup', {
//            successRedirect: '/#profile', // redirect to the secure profile section
//            failureRedirect:  '/#signUp/AriseYouth', // redirect back to the signup page if there is an error
//            failureFlash: true // allow flash messages
//    }));

    app.post('/signUp/:id', function(req, res, next) {
        passport.authenticate('local-signup', function(err, user, info) {
            if (err) { return next(err); }
            // Redirect if it fails
            if (!user) { return res.redirect('/#signUp/'+req.params.id); }
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                // Redirect if it succeeds
                return res.redirect('/#profile');
            });
        })(req, res, next);
    });
//    app.post('/signUp/:id', function(req) {
//        var failureUrl = '/#signUp/'+req.params.id;
//        passport.authenticate('local-signup',{
//            successRedirect: '/#profile',
//            failureRedirect: failureUrl,
//            failureFlash : true
//        })
//    });


    // send to facebook to do the authentication
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/#profile',
            failureRedirect: '/#/'
        }));

//  =============================================================================
//  AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
//  =============================================================================

    // locally --------------------------------
    app.get('/connect/local', function (req, res) {
        res.render('connect-local.ejs', { message: req.flash('loginMessage') });
    });
    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect: '/#profile', // redirect to the secure profile section
        failureRedirect: '/connect/local', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // send to facebook to do the authentication
    app.get('/connect/facebook', passport.authorize('facebook', { scope: 'email' }));

    // handle the callback after facebook has authorized the user
    app.get('/connect/facebook/callback',
        passport.authorize('facebook', {
            successRedirect: '/#profile',
            failureRedirect: '/#/'
        }));

//  =============================================================================
//  UNLINK ACCOUNTS =============================================================
//  =============================================================================

//    // local -----------------------------------
//    app.get('/unlink/local', function(req, res) {
//        var user = req.user;
//        user.local.email = undefined;
//        user.local.password = undefined;
//        user.save(function(err) {
//            res.redirect('/#profile');
//        });
//    });

    // facebook -------------------------------
    app.get('/unlink/facebook', function (req, res) {
        var user = req.user;
        user.facebook.token = undefined;
        user.save(function (err) {
            res.redirect('/#profile');
        });
    });


//  =============================================================================
//  Resource Database Query Routes ==============================================
//  =============================================================================
    var Resource = require('../app/models/resource');

    app.get('/getResources/:i', checkAccessLevel(3), function (req, res) {
        var resourceData = [];
        var cursorPosition = req.params.i.split(':')[1];
        Resource.find().count(function(error, counter){
            var limitCount = 20;
            var offset = counter - cursorPosition;
            if (offset <= 20){
                if(offset > 0) limitCount = offset;
                else limitCount = 0;
            }
            if (cursorPosition < counter + 20) {
                Resource.find({},
                    function (err, resources) { //callback
                        for (var i = 0; i < resources.length; i++) {
                            resourceData.push(resources[i].getPreview());
                        }
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(resourceData));
                    }
                ).sort({date:-1}).skip(cursorPosition).limit(limitCount);////////////////////////////////////WHY NO SORTING?!?!?!?!?!?!?!?!?!?!?!? GOTTA LEAVE IT FOR NOW!!!!
            }
        });
    });

    app.get('/getResources~:searchValue/:i', checkAccessLevel(3), function (req, res) {
        var resourceData = [];
        var cursorPosition = req.params.i.split(':')[1];
        var regEX = new RegExp(req.params.searchValue, "i");
        Resource.find({ $or: [{ "tags.value" : regEX},{ "title" : regEX}]}).count(function(error, counter){
            var limitCount = 20;
            var offset = counter - cursorPosition;
            if (offset <= 20){
                if(offset > 0) limitCount = offset;
                else limitCount = 0;
            }
            if (cursorPosition < counter + 20) {
                Resource.find({ $or: [{ "tags.value" : regEX},{ "title" : regEX}]},
                    function (err, resources) { //callback
                        for (var i = 0; i < resources.length; i++) {
                            resourceData.push(resources[i].getPreview());
                        }
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(resourceData));
                    }
                ).sort({date:-1}).skip(cursorPosition).limit(limitCount);////////////////////////////////////WHY NO SORTING?!?!?!?!?!?!?!?!?!?!?!? GOTTA LEAVE IT FOR NOW!!!!
            }
        });
    });

    app.get('/getResources^:searchTag/:i', checkAccessLevel(3), function (req, res) {
        var resourceData = [];
        Resource.find({tags: new RegExp(req.params.searchTag, "i")}, function (err, resources) {
            for (var i = 0; i < resources.length; i++) {
        var cursorPosition = req.params.i;
                resourceData.push(resources[i].getPreview());
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(resourceData));
        }).limit(20).skip(cursorPosition); //i being increments of 20 for each page;;
    });

    app.get('/getResource/:id', checkAccessLevel(3), function (req, res) {
        var resourceData = [];
        Resource.find({_id: req.params.id}, function (err, resources) {
            resourceData.push(resources[0].getFull());
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(resourceData));
        });
    });

    app.post('/addResourceLike/:id', checkAccessLevel(3), function(req, res){
        var likeCount;
        Resource.find({_id: req.params.id}, function (err, resources) {
            likeCount = resources[0].addLike(req.user._id);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(likeCount));
        });
    });

    app.post('/removeResourceLike/:id', checkAccessLevel(3), function(req, res){
        var likeCount;
        Resource.find({_id: req.params.id}, function (err, resources) {
            likeCount = resources[0].removeLike(req.user._id);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(likeCount));
        });
    });

    app.get('/checkResourceLikes/:id', checkAccessLevel(3), function(req, res){
        var resourceLikes = [];
        Resource.find({_id: req.params.id}, function (err, resources) {
            resourceLikes.push(resources[0].checkLikes(req.user._id));
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(resourceLikes));
        });
    });

//  =============================================================================
//  Group Database Query Routes =================================================
//  =============================================================================
    var Group = require('../app/models/group');

    app.get('/getGroups', function (req, res) {
        var groupData = [];
        Group.find({}, function (err, groups) {
            for (var i = 0; i < groups.length; i++) {
                groupData.push(groups[i].getPreview());
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(groupData));
        });
    });

    app.get('/getGroups~:searchValue', function (req, res) {
        var groupData = [];
        Group.find({name: new RegExp(req.params.searchValue, "i")}, function (err, groups) {
            for (var i = 0; i < groups.length; i++) {
                groupData.push(groups[i].getPreview());
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(groupData));
        });
        //Group.find().limit(20).skip(i) //i being increments of 20 for each page
    });

    app.get('/getGroup/:id', function (req, res) {
        var groupData = [];
        Group.findOne({ id : req.params.id}, function (err, groups) {
            if(groups !== undefined && groups !== null){
                groupData.push(groups.getFull());
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(groupData));
        });
    });

    app.get('/checkID:id', function (req, res) {
        var groupIDUnique = false;
        Group.find({id: req.params.id}, function (err, groups) {
            if (groups.length === 0){
                groupIDUnique = true;
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(groupIDUnique));
        });
    });

    var multer       = require('multer');
// FILE UPLOADING=============================================================
    var mMulter = multer({ dest: '././views/images/',
        done: false,
        rename: function (fieldname, filename) {
            return filename + Date.now();
        },
        onFileUploadStart: function (file) {
            console.log(file.originalname + ' is starting ...')
        },
        onFileUploadComplete: function (file) {
            console.log(file.fieldname + ' uploaded to  ' + file.path);
            mMulter.done = true;
        }
    });

    app.post('/submitGroup', mMulter, function(req, res){
        if(mMulter.done == true) {
            console.log(req.files);


            var newGroup = new Group();
            var leader = {name: "", _id: ""};

            if (req.user !== undefined) {
                leader = {name: req.user.name, _id: req.user._id};
            }

            console.log(req.body.groupId, req.body.name, req.files.userPhoto.name, req.body.country, req.body.city, leader);
            newGroup.update(req.body.groupId, req.body.name, req.files.userPhoto.name, req.body.country, req.body.city, leader);
            res.redirect('/#groups:' + req.body.groupId);
        }
    });

    app.post('/submitNameAndEmail', checkAccessLevel(1), function(req, res){
        User.find({_id: req.user._id}, function (err, user) {
            user[0].name = req.body.name;
            user[0].local.email = req.body.email.toLowerCase();

            user[0].save();
            res.redirect('/#profile');
        });
    });

    var fs           = require('fs');
    var User = require('../app/models/user');

    app.post('/submitProfilePic', checkAccessLevel(1), mMulter, function (req, res) {
        if(mMulter.done == true) {
            fs.unlink('././views/images/' + req.user.imagePath, function (err) {
                if (err) console.log(err);
                else console.log('successfully deleted ././views/images/' + req.user.imagePath);

                var arr = req.files.userPhoto.name.split('.');
                var extension = "." + arr[arr.length-1];
                var fileName = "profile_pictures/" + req.user._id + extension;
                fs.rename('././views/images/' + req.files.userPhoto.name, "././views/images/" + fileName, function (err) {
                    if (err) throw err;
                    console.log('renamed complete');
                    User.find({_id: req.user._id}, function (err, user) {
                        user[0].imagePath = fileName;
                        user[0].save();

                        if(req.user.security_level >= 3){
                            Group.find({id: req.user.group.id}, function (err, group) {
                                for (var i = 0; i < group[0].leaders.length; i++){
                                    if((""+group[0].leaders[i]._id) === (""+req.user._id)){

                                        group[0].leaders[i].imagePath = fileName;
                                        group[0].save();
                                    }
                                }
                            });
                        }

                        console.dir(user[0].imagePath);
                        mMulter.done = false;
                        res.redirect('/#profile');
                    });
                });


            });
        }
    });
};

// route middleware to ensure user is logged in and of appropriate level
var checkAccessLevel = function(accessLevel) {
    return function(req, res, next) {
        if (req.isAuthenticated() && req.user.security_level >= accessLevel) {
            return next();
        }
//        console.log("Redirect");
        //res.redirect('/#/'); ///////////////////////////////////////////////////////////////THIS SHOULD REDIRECT BUT IT ONLY CONSOLE.LOGS THE HTML OF /#/ INTO THE BROWSER
    };
};