/**
 * Created by celstn on 2016-10-25.
 */
"use strict";

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

var environnement = require("./environnement");

const saltRounds = 10;

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
module.exports.generateSaltHash = function (value, callback) {
    bcrypt.hash(value, saltRounds, function (error, hash) {
        if (error) return callback(error, null);
        return callback(null, hash);
    });
};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
module.exports.compareHash = function (value, hash, callback) {
    bcrypt.compare(value, hash, function (error, response) {
        if (error) return callback(error, null);
        return callback(null, response);
    });
};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
module.exports.generateToken = function (payload, callback) {
    jwt.sign({email: payload}, environnement.SECRET, {expiresIn: 86400}, function (error, token) {
        if (error)return callback(error, null);
        return callback(null, token);
    });
};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
module.exports.decodeToken = function (token, callback) {
    jwt.verify(token, environnement.SECRET, function (error, decoded) {
        if (error) return callback(error, null);
        return callback(null, decoded.email);
    });
};


