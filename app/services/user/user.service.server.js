// USER SERVICE SETUP
// =================================================================================================

// get all requirements
var passport         = require('passport');
var LocalStrategy    = require('passport-local').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var mongoose         = require("mongoose");

// =================================================================================================

module.exports = function(app) {

    var userModel = require("../../models/user/user.model.server.js")();

// defining the the api urls
    var auth = authorized;
    app.post  ('/api/login', passport.authenticate('local'), login);
    app.post  ('/api/logout',         logout);

    app.post  ('/api/register',       register);
    app.post  ('/api/user',     auth, createUser); // change this to /api/register/user (or account)
    app.get   ('/api/register/emailAvailable', isEmailAvailable);

    app.get   ('/api/loggedin',       loggedin);
    app.get   ('/api/user',     auth, findAllUsers);
    app.put   ('/api/user/:id', auth, updateUser);
    app.delete('/api/user/:id', auth, deleteUser);

// =================================================================================================

// authenticate facebook login
    app.get   ('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {

            successRedirect: '/#/home',
            failureRedirect: '/#/login'
        }));

// authenticate google login
    app.get   ('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    app.get   ('/auth/google/callback',
        passport.authenticate('google', {

            successRedirect: '/#/home',
            failureRedirect: '/#/login'
        }));

// =================================================================================================

// configuring Oauth from google apis
    var googleConfig = {
        clientID        : '351761035685-v4u71gbv28hpuu4tjra4i90dn67cv36m.apps.googleusercontent.com',
        clientSecret    : 'MI-2RX75Jx5FuDLiInd_U37v',
        callbackURL     : '/auth/google/callback'
    };

// configuring Oauth from google apis
    var facebookConfig = {
        clientID        : '1159403214146998',
        clientSecret    : '189520cd2f908eb579365bdf315f686b',
        callbackURL     : '/auth/facebook/callback'
    };


    passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));
    passport.use(new GoogleStrategy(googleConfig, googleStrategy));
    passport.use(new LocalStrategy(localStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

// =================================================================================================

    // bringing token from facebook to our app
    function facebookStrategy(token, refreshToken, profile, done) {
        userModel
            .findUserByFacebookId(profile.id)
            .then(
                function(user) {
                    if(user) {
                        return done(null, user);
                    } else {
                        var names = profile.displayName.split(" ");
                        var newFacebookUser = {
                            lastName:  names[1],
                            firstName: names[0],
                            email:     profile.emails ? profile.emails[0].value:"",
                            facebook: {
                                id:    profile.id,
                                token: token
                            }
                        };
                        return userModel.createUser(newFacebookUser);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            )
            .then(
                function(user){
                    return done(null, user);
                },
                function(err){
                    if (err) { return done(err); }
                }
            );
    }

// =================================================================================================

    // bringing the google token over to our app
    function googleStrategy(token, refreshToken, profile, done) {
        userModel
            .findUserByGoogleId(profile.id)
            .then(
                function(user) {
                    if(user) {
                        return done(null, user);
                    } else {
                        var newGoogleUser = {
                            lastName: profile.name.familyName,
                            firstName: profile.name.givenName,
                            email: profile.emails[0].value,
                            google: {
                                id:          profile.id,
                                token:       token
                            }
                        };
                        return userModel.createUser(newGoogleUser);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            )
            .then(
                function(user){
                    return done(null, user);
                },
                function(err){
                    if (err) { return done(err); }
                }
            );
    }

// =================================================================================================

    // having a token from local registration on app
    function localStrategy(username, password, done) {
        userModel
            .findUserByCredentials({username: username, password: password})
            .then(
                function(user) {
                    if (!user) { return done(null, false); }
                    return done(null, user);
                },
                function(err) {
                    if (err) { return done(err); }
                }

            );

    }

// =================================================================================================

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        userModel
            .findUserById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }

// =================================================================================================
    function login(req, res) {
        var user = req.user;
        res.json(user);

    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function logout(req, res) {
        req.logOut();
        res.sendStatus(200);
    }

    function isEmailAvailable( req, res )
    {
        var usernameParam = req.param('username');
        console.log('outputting email to see if need to accept differently : ' + JSON.stringify(usernameParam) );
        userModel.findUserByEmail(usernameParam).then( function( user )  {
            //if user found.
            console.log( 'user returned ' +  JSON.stringify( user )  );
            var response = { available: true };
            if (user !== null )
            {
                response.available = false;
            }

            res.json( response );
        });
        // TODO: check if email already exists in the database, if it does, {available: false}
        // TODO: else { available: true }
    }

    // local registration get assigned the client role id
    function register(req, res) {
        var newUser = req.body;
        newUser.roles = ['client'];

        userModel
            .findUserByUsername(newUser.username)
            .then(
                function(user){
                    if(user) {
                        res.json(null);
                    } else {
                        return userModel.createUser(newUser);
                    }
                },
                function(err){
                    res.status(400).send(err);
                }
            )
            .then(
                function(user){
                    if(user){
                        req.login(user, function(err) {
                            if(err) {
                                res.status(400).send(err);
                            } else {
                                res.json(user);
                            }
                        });
                    }
                },
                function(err){
                    res.status(400).send(err);
                }
            );
    }

    // admin having the permission to find all users
    function findAllUsers(req, res) {
        if(isAdmin(req.user)) {
            userModel
                .findAllUsers()
                .then(
                    function (users) {
                        res.json(users);
                    },
                    function () {
                        res.status(400).send(err);
                    }
                );
        } else {
            res.status(403);
        }
    }

    function deleteUser(req, res) {
        if(isAdmin(req.user)) {

            userModel
                .removeUser(req.params.id)
                .then(
                    function(user){
                        return userModel.findAllUsers();
                    },
                    function(err){
                        res.status(400).send(err);
                    }
                )
                .then(
                    function(users){
                        res.json(users);
                    },
                    function(err){
                        res.status(400).send(err);
                    }
                );
        } else {
            res.status(403);
        }
    }

    function updateUser(req, res) {
        var newUser = req.body;
        if(!isAdmin(req.user)) {
            delete newUser.roles;
        }
        if(typeof newUser.roles == "string") {
            newUser.roles = newUser.roles.split(",");
        }

        userModel
            .updateUser(req.params.id, newUser)
            .then(
                function(user){
                    return userModel.findAllUsers();
                },
                function(err){
                    res.status(400).send(err);
                }
            )
            .then(
                function(users){
                    res.json(users);
                },
                function(err){
                    res.status(400).send(err);
                }
            );
    }

    // new users role set to client
    function createUser(req, res) {
        var newUser = req.body;
        if(newUser.roles && newUser.roles.length > 1) {
            newUser.roles = newUser.roles.split(",");
        } else {
            newUser.roles = ["client"];
        }

        // first check if a user already exists with the username
        userModel
            .findUserByUsername(newUser.username, newUser.email)
            .then(
                function(user){
                    // if the user does not already exist
                    if(user == null) {
                        // create a new user
                        return userModel.createUser(newUser)
                            .then(
                                // fetch all the users
                                function(){
                                    return userModel.findAllUsers();
                                },
                                function(err){
                                    res.status(400).send(err);
                                }
                            );
                    // if the user already exists, then just fetch all the users
                    } else {
                        return userModel.findAllUsers();
                    }
                },
                function(err){
                    res.status(400).send(err);
                }
            )
            .then(
                function(users){
                    res.json(users);
                },
                function(){
                    res.status(400).send(err);
                }
            )
    }

    // if the role is assigned as admin we check to authenticate
    function isAdmin(user) {
        if (user.roles.indexOf("admin") > 0) {
            return true
        }
        return false;
    }

    function authorized (req, res, next) {
        if (!req.isAuthenticated()) {
            res.sendStatus(401);
        } else {
            next();
        }
    };
}