/**
 * Created by celstn on 2016-10-25.
 */
"use strict";

var express = require('express');
var router = express.Router();
var stringify = require('node-stringify');
var passport = require('passport');

var DAO_FoodTrucks = require('./../DAO/DAO_FoodTrucks');
var DAO_users = require('./../DAO/DAO_users');
var response = require('../views/responses');
var util = require('../../configuration/util');
var app = require('./../../app');
require('./../../configuration/passport')(passport);

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
router.post('/login',
    passport.authenticate(
        'local-login'
    ),
    function (req, res) {
        if (req.body.first_name === true) {
            res.status(200).send(response.responseJson(true, req.body.email));
        } else {
            res.status(400).send(response.responseJson(false, req.body.email));
        }
    }
);

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
router.post('/signup',
    passport.authenticate(
        'local-signup'
    ),
    function (req, res) {
        if (req.body.first_name === true) {
            res.status(200).send(response.responseJson(true, req.body.email));
        } else {
            res.status(400).send(response.responseJson(false, req.body.email));
        }
    }
);

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/// http://passportjs.org/docs/facebook
// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
//// http://passportjs.org/docs/facebook
router.get('/auth/facebook',
    passport.authenticate('facebook', {scope: 'read_stream'})
);

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
router.get('/auth/facebook/callback',
    passport.authenticate(
        'facebook'
    ),
    function (req, res) {
        if (req.body.first_name === true) {
            res.status(200).send(response.responseJson(true, req.body.email));
        } else {
            res.status(400).send(response.responseJson(false, req.body.email));
        }
    }
);

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
router.post('/logout', function (req, res, next) {
    DAO_users.validateUserAccount(req, function (error, dbUser) {
        if (error) {
            res.status(400).send(response.responseJson(false,
                {firstname: '', lastname: ''}
            ));
        } else {
            res.status(200).send(response.responseJson(true,
                {firstname: dbUser.local.first_name, lastname: dbUser.local.last_name}
            ));
        }
    });
});

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
router.post('/favorites', function (req, res, next) {
    console.log(" router.post( /users/favorite ");

    DAO_users.validateUserAccount(req, function (error, dbUser) {
        if (error) {
            res.status(400).send(response.responseJson(false, error));
        } else {
            console.log("users/favorites validateUserAccount = TRUE")

            DAO_users.manageUserFavorites(dbUser._id, req, function (error, data) {
                if (error) {
                    res.status(400).send(response.responseJson(false, error));
                } else {
                    res.status(200).send(response.responseJson(true, data));
                }
            });
        }
    });
});

module.exports = router;