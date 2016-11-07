/**
 * Created by celstn on 2016-10-25.
 */
"use strict";

var mongoose = require("mongoose");

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
module.exports.model = function (name) {
    var schema = mongoose.Schema({
        empty_spaces : Number,
        bike_count : Number,
        name : String,
        station_id : Number,
        geo: {type: [Number], index: '2dsphere'},
    }, { collection: name  });
    
    return mongoose.model( name, schema);
};
