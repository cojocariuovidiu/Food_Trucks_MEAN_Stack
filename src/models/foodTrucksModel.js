/**
 * Created by celstn on 2016-10-25.
 */
"use strict";

var mongoose = require("mongoose");

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
module.exports.model = function (name) {
    return mongoose.model( name ,  mongoose.Schema({
        geo: {type: [Number], index: '2dsphere'},
        
        properties: {

            fd_date: String,
            start_time: String,
            end_time: String, 
            place: String,
            truck_name: String,
            truck_id: String
        }
    }, { collection: name  }));
};
