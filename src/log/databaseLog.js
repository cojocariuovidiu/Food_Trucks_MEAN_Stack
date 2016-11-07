/**
 * Created by celstn on 2016-10-25.
 */
"use strict";

var fs = require('fs');
var moment = require('moment');

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
module.exports.writeDatabaseLog = function (infos) {
    var writeStream = fs.createWriteStream('databaseLogs.txt', {'flags': 'a'});
    writeStream.write(moment().format('LTS') + infos );
    writeStream.end();

};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
module.exports.writeFoodTruckJSON= function (informations, filename) {
    var writeStream = fs.createWriteStream(filename);
    writeStream.write(informations);
    writeStream.end();
};