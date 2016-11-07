/**
 * Created by celstn on 2016-10-25.
 */
"use strict";

var mongoose = require('mongoose');
var moment = require('moment');
var async = require('async');

var databaseLog = require('./../log/databaseLog');
var environnement = require('./../../configuration/environnement');

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
module.exports.createDatabase = function (model, listInstanceModel, name, callback) {
    databaseLog.writeDatabaseLog(" : drop and save new "+ name +" collection \n");
    
    model.remove({}, function(errorRemove, result) {
        if (errorRemove) return callback('ERROR: Can not remove ' + name , null);

        async.each(listInstanceModel, function(value, callback) {
            value.save(function (errSave) {
                if (errSave) return callback('A information in '+ name +' has been SAVED successfully ' , null);
            });
        }, function(errAsync) {
            if( errAsync ) {
                return callback('A information in '+ name +' failed to process' , null);
            } else {
                return callback(null, 'All informations in '+ name +'have been SAVED successfully ');
            }
        });
    });
};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
module.exports.createEmptyDatabase = function (model, userInstanceModel, name, callback) {
    databaseLog.writeDatabaseLog(" create Empty Database "+ name +" collection \n");

    userInstanceModel.save(function (err) {
        if (err) return callback('Can not create empty '+ name + "  err = "+ err , null);
        return callback(null, 'First '+ name +' has been created successfully ' );
    });
};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
module.exports.validateDates =  function (from, to, callback) {
    var dateFormat = 'YYYY-MM-DD';
  
    var fromDateIsValid = moment(from, dateFormat).isValid();
    var toDateIsValid = moment(to, dateFormat).isValid();
    
    if (!fromDateIsValid || from.length != dateFormat.length ) {
        return callback('Wrong FROM date format', null);
    }
    if (!toDateIsValid || to.length != dateFormat.length) {
        return callback('Wrong TO date format', null);
    }
    if (fromDateIsValid && toDateIsValid && moment(to).isBefore(from)) {
        return callback('TO date is earlier than the FROM date', null);
    }
    return callback(null, true );
};
