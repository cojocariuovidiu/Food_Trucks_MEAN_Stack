/**
 * Created by celstn on 2016-10-25.
 */
"use strict";

var mongoose = require('mongoose');
var moment = require('moment');
var request = require('request');
var cron = require('node-schedule');
var xml2js = require('xml2js');

var databaseManager = require('./../DAO/DAO_BikeStations');
var databaseLog = require('./../log/databaseLog');

// // http://www.codexpedia.com/javascript/nodejs-cron-schedule-examples/
// // https://www.npmjs.com/package/node-schedule
// // *    *    *    *    *    *
// // ┬    ┬    ┬    ┬    ┬    ┬
// // │    │    │    │    │    |
// // │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// // │    │    │    │    └───── month (1 - 12)
// // │    │    │    └────────── day of month (1 - 31)
// // │    │    └─────────────── hour (0 - 23)
// // │    └──────────────────── minute (0 - 59)
// // └───────────────────────── second (0 - 59, OPTIONAL)

module.exports.schedule = function (urlBikeStationXML) {
    // cron.scheduleJob('* */10 * * * *', function () {//Every 10 minutes
        request(urlBikeStationXML, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                xml2js.parseString(body, function (err, result) {
                    //TODO: Tests => use BikeStationsCurrentSeason.json
                    if (result.stations.station === 0) {
                        console.log('!!!! WARNING : bike stations list is empty !!!!');
                        fs.readFile('BikeStationsCurrentSeason.json', 'utf8', function (err, dataFile) {
                            if (err) return console.log(err + ' can not read bike stations JSON file ');
                            var data = JSON.parse(dataFile);
                            createDatabase(data.stations.station);
                        });
                        
                    } else {
                        console.log('!!!! OK : bike stations received from server !!!!');
                        databaseLog.writeFoodTruckJSON(JSON.stringify(result), 'BikeStationsCurrentSeason.json');
                        createDatabase(result.stations.station);
                    }
                });
            } else {
                console.log('Can\'t get BIKE STATIONS from server')
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


