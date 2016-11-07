/**
 * Created by celstn on 2016-10-25.
 */
"use strict";

var mongoose = require('mongoose');

var environnement = require('./environnement');
var response = require('../src/views/responses');

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
module.exports.getDatabaseConnection = function (req, res, next) {
    if (mongoose.connection.readyState === 1) {
        console.log("DataBase connection -- Already connect --");
        next();
    } else {
        console.log("DataBase connection -- Will connect --"); 
        mongoose.connect(environnement.DATABASE_URL, function (err) {
            if (err) {
                res.status(400)
                    .send(response.responseJson(false, "Error , can\'t connect to the database...!"));
                next();
            } else {
                console.log("Sucessfuly connected to " + environnement.DATABASE_URL + " :) ");
                next();
            }
        })
    }
};