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
    var model = appModels.modelBikeRack;
    var listInstanceModel = [];

    data.forEach(function (bikerack) {
        var modelInstance = new model({});

        modelInstance.rack_id = bikerack.INV_ID;
        modelInstance.brand = bikerack.MARQ;
        modelInstance.park = bikerack.PARC;
        modelInstance.geo = [bikerack.LONG, bikerack.LAT];
        listInstanceModel.push(modelInstance);
    });
    databaseAccess.createDatabase(model, listInstanceModel, environnement.COLLECTIONS.br, callback)
};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
module.exports.findAll = function (callback) {
    databaseLog.writeDatabaseLog(" : FIND ALL bike racks\n");

    appModels.modelBikeStation.find({}).exec(function (err, result) {
        if (err) return callback('Server error', null);
        return callback(null, result);
    });
};

///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
///////////////////////////////////////////////////////
module.exports.findInRadius = function (rad, long, lat, callback) {
    databaseLog.writeDatabaseLog(" : FIND BY RADIUS  bike racks  , rad: " + rad + " long: " + long + " lat: " + lat + "\n");

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
    databaseLog.writeDatabaseLog(" : FIND BY ID bike racks  , id : " + id + "\n");

    appModels.modelBikeStation.find({}).where('rack_id').equals(id).exec(function (err, result) {
        if (err) return callback('Server error', null);
        return callback(null, result);
    });
};


