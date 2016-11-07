/**
 * Created by celstn on 2016-10-25.
 */
"use strict";

var express = require('express');
var router = express.Router();

var DAO_FoodTrucks = require('./../DAO/DAO_FoodTrucks');
var DAO_BikeRacks = require('./../DAO/DAO_BikeRacks');

var response = require('../views/responses');
var util = require('../../configuration/util');

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
router.get('/', function (req, res, next) {
    var radius = req.query.rad;
    var longitude = req.query.long;
    var latitude = req.query.lat;
    
    if (req.query === null) {
        res.status(400)
            .send(response.responseJson(false, "Wrong queries for bike racks"));

    } else if (req.query != null &&
        (radius === '' || radius === undefined) &&
        (longitude === '' || longitude === undefined) &&
        (latitude === '' || latitude === undefined)) {
        DAO_BikeRacks.findAll(function (err, data) {
            if (err) {
                res.status(400).send(response.responseJson(false, err));
            } else {
                res.status(200).send(response.responseJson(true, data));
            }
            }
        );
    } else if (req.query != null &&
        (radius != '' && radius != undefined) &&
        (longitude != '' && longitude != undefined) &&
        (latitude != '' && latitude != undefined)) {
        
        var regexID = new RegExp("^-?[0-9]+\.?[0-9]*$"); //
        if (regexID.test(radius) === false){
            return res.status(400).send(response.responseJson(false, 'Not valid radius'));
        }
        if (regexID.test(longitude) === false) return res.status(400).send(response.responseJson(false, 'Not valid longitude'));
        if (regexID.test(latitude) === false) return res.status(400).send(response.responseJson(false, 'Not valid latitude'));

        
        DAO_BikeRacks.findInRadius(
            radius,
            longitude,
            latitude,
            function (err, data) {
                if (err) {
                    res.status(400).send(response.responseJson(false, err));
                } else {
                    res.status(200).send(response.responseJson(true, data));
                }
            }
        );
    } else if (radius === '' || radius === undefined) {
        res.status(400).send(response.responseJson(false, "Missing parameter rad"));
    } else if (longitude === '' || longitude === undefined) {
        res.status(400).send(response.responseJson(false, "Missing parameter long"));
    } else if (latitude === '' || latitude === undefined) {
        res.status(400).send(response.responseJson(false, "Missing parameter lat"));
    }
});

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
router.get('/:id', function (req, res, next) {
    var id = req.params.id;
    var regexID = new RegExp('^[0-9]+$');
    if (regexID.test(id) === false) return res.status(400).send(response.responseJson(false, 'Not valid id'));

    DAO_BikeRacks.findById(
        id,
        function (err, data) {
            if (err) {
                res.status(400).send(response.responseJson(false, err));
            } else {
                res.status(200).send(response.responseJson(true, data));
            }
        }
    );
});

module.exports = router;