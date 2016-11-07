/**
 * Created by celstn on 2016-10-25.
 */
"use strict";
var moment = require('moment');
var async = require('async');

var databaseAccess = require('./DAO_Access');
var databaseLog = require('./../log/databaseLog');
var appModels = require('./../../app');
var environnement = require('./../../configuration/environnement');

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////;
module.exports.createDatabase = function (data, callback) {
    var model = appModels.modelFoodTruck;
    var listInstanceModel = [];

    data.forEach(function (foodtruck) {
        var modelInstance = new model({});
        
        modelInstance.type = foodtruck.type;
        modelInstance.geo = [foodtruck.geometry.coordinates[0], foodtruck.geometry.coordinates[1]];
        modelInstance.properties.fd_date = foodtruck.properties.Date;
        modelInstance.properties.start_time = foodtruck.properties.Heure_debut;
        modelInstance.properties.end_time = foodtruck.properties.Heure_fin;
        modelInstance.properties.place = foodtruck.properties.Lieu;
        modelInstance.properties.truck_name = foodtruck.properties.Camion;
        modelInstance.properties.truck_id = foodtruck.properties.Truckid;

        listInstanceModel.push(modelInstance);
    });
    databaseAccess.createDatabase(model, listInstanceModel, environnement.COLLECTIONS.fd, callback)
};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
module.exports.findAll = function (callback) {
    databaseLog.writeDatabaseLog(" : FIND ALL Food Trucks\n");

    appModels.modelFoodTruck.find({}).exec(function (err, result) {
        if (err) return callback('Internal Server Error', null);
        return callback(null, result);
    });
};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
module.exports.findByDateRange = function (from, to, callback) {
    databaseLog.writeDatabaseLog(" : FIND BY DATE Food Trucks , from: " + from + " to: " + to + "\n");

    databaseAccess.validateDates(from, to, function (err, valid) {
        if (valid === null) {
            return callback(err, null);
        }
        appModels.modelFoodTruck.find({}).where('properties.fd_date').gt(from).lt(to).exec(function (err, result) {
            if (err) return callback('Internal Server Error', null);
            return callback(null, result);
        });
    });
};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
module.exports.findById = function (truck_id, callback) {
    databaseLog.writeDatabaseLog(" : FIND BY ID Food Trucks , truck_id : " + truck_id + "\n");

    appModels.modelFoodTruck.find({}).where('properties.truck_id').equals(truck_id).exec(function (err, result) {
        if (err) return callback('Internal Server Error', null);
        return callback(null, result);
    });
};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////,
/////////////////////////////////////////////////////////
module.exports.findByName = function (name, callback) {
    databaseLog.writeDatabaseLog(" : FIND BY ID Food Trucks , name : " + name + "\n");

    appModels.modelFoodTruck.find({}).where('properties.truck_name').equals(name).exec(function (err, result) {
        if (err) return callback('Internal Server Error', null);
        return callback(null, result);
    });
};

