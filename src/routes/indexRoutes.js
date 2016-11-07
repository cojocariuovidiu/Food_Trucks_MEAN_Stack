/**
 * Created by celstn on 2016-10-25.
 */
"use strict";

var express = require('express');
var router = express.Router();

var response = require('./../views/responses');
var passport = require('passport');;
var app = require('./../../app');
var DAO_users = require('./../DAO/DAO_users');

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
router.get('/', function (req, res, next) {
    res.status(200).send(response.responseJson(true, "the home page"));
});

module.exports = router;
