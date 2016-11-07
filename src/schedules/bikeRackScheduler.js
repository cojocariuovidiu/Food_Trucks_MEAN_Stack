/**
 * Created by celstn on 2016-10-25.
 */
"use strict";

var mongoose = require('mongoose');
var moment = require('moment');
var request = require('request');
var cron = require('node-schedule');
var Converter = require("csvtojson").Converter;

var databaseManager = require('./../DAO/DAO_BikeRacks');
var databaseLog = require('./../log/databaseLog');

// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    |
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)

module.exports.schedule = function (urlBikeRackCSV) {
    // cron.scheduleJob('0 0 0 1 * *', function () {//first day of the month
        var converter = new Converter({constructResult: false}); //for big csv data
        var data = {bikeRacks: []};
        converter.on("record_parsed", function (json) {
            data.bikeRacks.push(json);
        });
        
        converter.on("end_parsed", function () {
            //TODO:  Tests => use BikeRacksCurrentSeason.json
            if (data.bikeRacks === 0) {
                console.log('!!!! WARNING : bike racks list is empty !!!!');
                fs.readFile('BikeRacksCurrentSeason.json', 'utf8', function (err, dataFile) {
                    if (err) return console.log(err + ' can not read bike racks JSON file ');
                    var dataRead = JSON.parse(dataFile);
                    createDatabase(dataRead.bikeRacks);
                });
                
            } else {
                console.log('!!!! OK : bike racks received from server !!!!');
                databaseLog.writeFoodTruckJSON(JSON.stringify(data), 'BikeRacksCurrentSeason.json');
                createDatabase(data.bikeRacks);
            }
        });
        
        converter.on("error", function (errMsg, errData) {
            console.log('error: ' + errMsg);
            console.log(errData)
        });
        
        request.get(urlBikeRackCSV).pipe(converter);
    // });
};

function createDatabase(data) {
    databaseManager.createDatabase(
        data,
        function (err, result) {
            if (err) console.log(err);
            console.log(result)
        }
    );
}

