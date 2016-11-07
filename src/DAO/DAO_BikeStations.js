/**
 * Created by celstn on 2016-10-25.
 */
"use strict";

var async = require('async');
var moment = require('moment');

var databaseAccess = require('./DAO_Access');
var databaseLog = require('./../log/databaseLog');
var appModels = require('./../../app');
var environnement = require('./../../configuration/environnement');

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
module.exports.createDatabase = function (data, callback) {
    var model = appModels.modelBikeStation;

    var listInstanceModel = [];
    data.forEach(function (bikeStation) {
        var modelInstance = new model({});

        modelInstance.empty_spaces = bikeStation.nbEmptyDocks[0];
        modelInstance.bike_count = bikeStation.nbBikes[0];
        modelInstance.geo = [bikeStation.long[0], bikeStation.lat[0]];
        modelInstance.name = bikeStation.name[0];
        modelInstance.station_id = bikeStation.id[0];
        listInstanceModel.push(modelInstance);
    });
    databaseAccess.createDatabase(model, listInstanceModel, environnement.COLLECTIONS.bs, callback)
};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
module.exports.findAll = function (callback) {
    databaseLog.writeDatabaseLog(" : FIND ALL bike stations \n");

    appModels.modelBikeStation.find({}).exec(function (err, result) {
        if (err) return callback('Server error', null);
        return callback(null, result);
    });
};

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
module.exports.findInRadius = function (rad, long, lat, callback) {
    databaseLog.writeDatabaseLog(" : FIND BY RADIUS  bike stations , rad: " + rad + " long: " + long + " lat: " + lat + "\n");

    appModels.modelBikeStation.find({
        geo: {
            '$near': {
                '$maxDistance': rad,
                '$geometry': {type: 'Point', coordinates: [long, lat]}
            }
        }
    }).exec(function (err, city) {
        if (err) return callback('Server error', null);
        return callback(null, city);
    });
};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
module.exports.findById = function (id, callback) {
    databaseLog.writeDatabaseLog(" : FIND BY ID bike station , id : " + id + "\n");

    appModels.modelBikeStation.find({}).where('station_id').equals(id).exec(function (err, result) {
        if (err) return callback('Server error', null);
        return callback(null, result);
    });
};
