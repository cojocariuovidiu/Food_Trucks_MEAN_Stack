/**
 * Created by celstn on 2016-10-25.
 */
"use strict";

var mongoose = require('mongoose');
var databaseManager = require('./../DAO/DAO_users');

module.exports.createUser = function () {
    databaseManager.createDatabase(
        function (err, result) {
            if (err) console.log(err);
            console.log(result)
        }
    );
};

