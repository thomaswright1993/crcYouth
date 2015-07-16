module.exports = function(app, passport) {

// normal routes ===============================================================

    app.get('/', function (req, res) {
        res.sendFile('index.html', { root: "./views/html" });
    });

    // PROFILE SECTION =========================
    app.get('/getProfile', checkAccessLevel(1), function (req, res) {
        var user = req.user;
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
    app.get('/signUp', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        var message = req.flash('loginMessage');
        console.log(req.flash('loginMessage'));
        res.end(JSON.stringify(message));
    });

    // process the signup form
    app.post('/signUp', passport.authenticate('local-signup', {
        successRedirect: '/#profile', // redirect to the secure profile section
        failureRedirect: '/#signUp', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

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
        Resource.find({title: new RegExp(req.params.searchValue, "i")}).count(function(error, counter){
            var limitCount = 20;
            var offset = counter - cursorPosition;
            if (offset <= 20){
                if(offset > 0) limitCount = offset;
                else limitCount = 0;
            }
            if (cursorPosition < counter + 20) {
                Resource.find({title: new RegExp(req.params.searchValue, "i")},
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
        var cursorPosition = req.params.i;
        Resource.find({tags: new RegExp(req.params.searchTag, "i")}, function (err, resources) {
            for (var i = 0; i < resources.length; i++) {
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
        var resourceLikes = [];
        Resource.find({_id: req.params.id}, function (err, resources) {
            resourceLikes.push(resources[0].addLike(req.user._id));
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(resourceLikes));
        });
    });

    app.post('/removeResourceLike/:id', checkAccessLevel(3), function(req, res){
        var resourceLikes = [];
        Resource.find({_id: req.params.id}, function (err, resources) {
            resourceLikes.push(resources[0].removeLike(req.user._id));
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(resourceLikes));
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
        Group.find({id: req.params.id}, function (err, groups) {
            groupData.push(groups[0].getPreview());
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

//    // process the group
//    app.post('/submitGroup', function (req, res) {
//        var newGroup = new Group();
//        var leader = {name:"", _id:""};
//
//        if(req.user !== undefined){
//            leader = {name: req.user.name, _id:req.user._id};
//        }
//
//        console.log(req.body.groupId, req.body.name, "image", req.body.country, req.body.city, leader);
//        newGroup.update(req.body.groupId, req.body.name, "image", req.body.country, req.body.city, leader);
//        res.redirect('/#groups:' + req.body.groupId);
//    });
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