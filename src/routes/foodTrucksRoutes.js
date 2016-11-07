/**
 * Created by celstn on 2016-10-25.
 */
"use strict";
var express = require('express');
var router = express.Router();

var DAO_FoodTrucks = require('./../DAO/DAO_FoodTrucks');
var response = require('../views/responses');
var util = require('../../configuration/util');

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
router.get('/', function (req, res, next) {
    var fromDate = req.query.from;
    var toDate = req.query.to;
    
    if (req.query === null) {
        res.status(400).send(response.responseJson(false, "Empty query"));
        
    } else if (req.query != null &&
        (fromDate === '' || fromDate === undefined) &&
        (toDate === '' || toDate === undefined)
    ) {
        DAO_FoodTrucks.findAll(function (err, data) {
                if (err)
                    res.status(400).send(response.responseJson(false, "No"));
                else 
                    res.status(200).send(response.responseJson(true, data));
            }
        );
    } else if (req.query != null &&
        (fromDate != '' && fromDate != undefined) &&
        (toDate != '' && toDate != undefined)) {
        DAO_FoodTrucks.findByDateRange(
            fromDate,
            toDate,
            function (err, data) {
                if (err)
                    res.status(400).send(response.responseJson(false, err));
                else 
                    res.status(200).send(response.responseJson(true, data));
            });
    } else if (fromDate === '' || fromDate === undefined) {
        res.status(400).send(response.responseJson(false, 'Missing parameter from'));
    } else if (toDate === '' || toDate === undefined) {
        res.status(400).send(response.responseJson(false, 'Missing parameter to'));
    }
});

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
router.get('/:id', function (req, res, next) {
    var id = req.params.id;
    var regexID = new RegExp('^[0-9A-Za-z]+$');// only hexadeimal
    if (regexID.test(id) === false) return res.status(400).send(response.responseJson(false, 'Not valid id'));
    
    DAO_FoodTrucks.findById(
        id,
        function (err, data) {
            if (err) 
                res.status(400).send(response.responseJson(false, err));
            else 
                res.status(200).send(response.responseJson(true, data));
        }
    );
});

module.exports = router;
