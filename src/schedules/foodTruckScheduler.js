/**
 * Created by celstn on 2016-10-25.
 */
"use strict";

var mongoose = require('mongoose');
var moment = require('moment');
var request = require('request');
var cron = require('node-schedule');
var fs = require('fs');
var databaseManager = require('./../DAO/DAO_FoodTrucks');
var databaseLog = require('./../log/databaseLog');

// // *    *    *    *    *    *
// // ┬    ┬    ┬    ┬    ┬    ┬
// // │    │    │    │    │    |
// // │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// // │    │    │    │    └───── month (1 - 12)
// // │    │    │    └────────── day of month (1 - 31)
// // │    │    └─────────────── hour (0 - 23)
// // │    └──────────────────── minute (0 - 59)
// // └───────────────────────── second (0 - 59, OPTIONAL)

module.exports.schedule = function (urlFoodTruckJSON) {
    // cron.scheduleJob('* * 12,0 * * *', function () {// at 12pm and 12am
        request(urlFoodTruckJSON, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body);
                //TODO: Tests => use FoodTruckCurrentSeason.json
                if (data.features.length < 9) { // TODO: QTE = 9 verified 2016-11-96 
                    console.log('!!!! WARNING : food trucks list is empty !!!!');
                    fs.readFile('BikeRacksLastSeason.json', 'utf8', function (err, dataFile) {
                        if (err) return console.log(err + ' Can\'t read food trucks JSON file');
                        data = JSON.parse(dataFile);
                        createDatabase(data.features);
                    });
                } else {
                    console.log('!!!! OK : food trucks received from server !!!!');
                    databaseLog.writeFoodTruckJSON(body, 'FoodTruckCurrentSeason.json');
                    createDatabase(data.features);
                }
            } else {
                console.log('Can\'t get FOOD TRUCKS from server')
            }
        });
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

