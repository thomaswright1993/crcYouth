module.exports = function(app, passport) {

// normal routes ===============================================================

    app.get('/', function (req, res) {
        res.sendFile('index.html', { root: "./views/html" });
    });

    // PROFILE SECTION =========================
    app.get('/getProfile', isLoggedIn, function (req, res) {
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
    app.get('/signup', function (req, res) {
        res.render('signup.ejs', { message: req.flash('loginMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/#profile', // redirect to the secure profile section
        failureRedirect: '/#signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // send to facebook to do the authentication
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/#profile',
            failureRedirect: '/'
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

    // process the login form
    app.post('/submitGroup', function (req, res) {
        var newGroup = new Group();
        var leader = {name:"", _id:""};

        if(req.user !== undefined){
            leader = {name: req.user.name, _id:req.user._id};
        }

        console.log(req.body.groupId, req.body.name, "image", req.body.country, req.body.city, leader);
        newGroup.update(req.body.groupId, req.body.name, "image", req.body.country, req.body.city, leader);
        res.redirect('/#groups:' + req.body.groupId);
    });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/#/');
}