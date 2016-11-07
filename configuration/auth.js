/**
 * Created by celstn on 2016-10-25.
 */
"use strict";

var environment = require('./environnement');

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
module.exports = {

    'facebookAuth': {
        'clientID': environment.FacebookID,
        'clientSecret': environment.FacebookSECRET,
        'callbackURL': environment.FacebookCALLBACK
    }
    //
    // , 'twitterAuth': {
    //     'consumerKey': 'your-consumer-key-here',
    //     'consumerSecret': 'your-client-secret-here',
    //     'callbackURL': 'http://localhost:8080/auth/twitter/callback'
    // }
    //
    // , 'googleAuth': {
    //     'clientID': 'your-secret-clientID-here',
    //     'clientSecret': 'your-client-secret-here',
    //     'callbackURL': 'http://localhost:8080/auth/google/callback'
    // }
};