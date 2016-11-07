/**
 * Created by celstn on 2016-10-25.
 */
"use strict";

var LocalStrategy = require('passport-local').Strategy;
// var FacebookStrategy = require('passport-facebook').Strategy;

var DAO_users = require('./../src/DAO/DAO_users');
var util = require('./util');

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
module.exports = function (passport) {
    //TODO: Not ready create Facebook strategy tests 
    // passport.use('facebook', new FacebookStrategy({
    //         clientID: configAuth.facebookAuth.clientID,
    //         clientSecret: configAuth.facebookAuth.clientSecret,
    //         callbackURL: configAuth.facebookAuth.callbackURL
    //     },
    //     function (accessToken, refreshToken, profile, done) {
    //         /// TIME 8:50 https://www.youtube.com/watch?v=OMcWgmkMpEE
    //         process.nextTick(function () {
    //             DAO_users.findFacebookUser(profile,function (err, user) {
    //                 if (err) return done(err);
    //                 if (user) return done(null, user.token);
    //                 DAO_users.createFacebookUser(accessToken, profile, function (error, newUser) {
    //                     if (error) return done(error);
    //                     return done(null, newUser.token);
    //                 })
    //             });
    //         });
    //     })
    // );

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            process.nextTick(function () {
                loginLocalUser(req, function (error, result) {
                    if (error && !result) {
                        return done(error);
                    }
                    if (error && result) {
                        return done(null, result);
                    }
                    if (result) {
                        return done(null, result);
                    }
                });
            });
        }
    ));
    
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true 
        },
        function (req, email, password, done) {
            process.nextTick(function () {
                signinLocalUser(req, function (error, result) {
                    if (error && !result) {
                        return done(error);
                    }
                    return done(null, result);
                })
            });
        }
    ));
    
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
    passport.deserializeUser(function (id, done) {
        //
        // User.findById(id, function(err, user) {
        //     done(err, user);
        // });
    });
};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
function loginLocalUser(req, callback) {
    if (req.body.email === '') {
        setResponseInformations(req, 'Invalid email', '', false);
        return callback('invalid', 'Invalid email');
    }
    DAO_users.findLocalUserByEmail(req.body.email, function (error, user) {
        if (error) return callback(error, null);
        if (user === null) {
            setResponseInformations(req, 'Invalid email', '', false);
            return callback('invalid', 'Invalid email');
        }
        util.compareHash(req.body.password, user.local.password, function (errorPassword, response) {
            if (errorPassword) return callback(errorPassword, null);
            if (!response) {
                setResponseInformations(req, 'Invalid password', '', false);
                return callback('invalid', 'Invalid password');
            }
            util.generateToken(req.body.email, function (error, token) {
                if (error)  return callback(error, null);
                setResponseInformations(req, 'Exist account', token, true);
                return callback('exist', 'Exist account');
            });
        });
    });
}

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
function signinLocalUser(req, callback) {
    DAO_users.findLocalUserByEmail(req.body.email, function (error, user) {
        if (error) return callback(error, null);
        if (!user) {
            DAO_users.createLocalUser(req, function (errorCreate, newUser) {
                if (errorCreate) return callback('Server error');

                util.generateToken(newUser.local.email, function (error, token) {
                    if (error) return callback('Server error');
                    setResponseInformations(req, 'New account', '', true);
                    return callback('new', 'New account');
                });
            });
        }
        if (user) {
            util.compareHash(req.body.password, user.local.password, function (errorPassword, response) {
                if (errorPassword) return callback('Server error');
                if (!response) {
                    setResponseInformations(req, 'Invalid password', '', false);
                    return callback('invalid', 'Invalid password');
                }
                util.generateToken(req.body.email, function (error, token) {
                    if (error)  return callback('Server error');
                    setResponseInformations(req, 'Exist account', token, true);
                    return callback('exist', 'Exist account');
                });
            });
        }
    });
}

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
function setResponseInformations(req, str, token, isValid) {
    req.body.first_name = isValid;
    req.body.email =
    {
        token: token,
        type: str
    };
}