/**
 * Created by celstn on 2016-10-25.
 */
"use strict";

var mongoose = require("mongoose");

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
module.exports.model = function (name) {
    console.log(name,  "module.exports  MODEL");

    return mongoose.model( name , new mongoose.Schema({
        rack_id : Number, // INV_ID
        brand : String, // MARQ
        park : String,
        geo: {type: [Number], index: '2dsphere'}
    }, { collection : name  }));
};
