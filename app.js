/**
 * Created by celstn on 2016-10-25.
 */
"use strict";

var mongoose = require('mongoose');
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressJWT = require('express-jwt');
var path = require('path');
var passport = require('passport');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var connection = require('./configuration/connection');
var environnement = require('./configuration/environnement');
var response  = require('./src/views/responses');

var modelFoodTruck =  require('./src/models/foodTrucksModel').model(environnement.COLLECTIONS.fd);
var modelBikeStation =  require('./src/models/bikeStationsModel').model(environnement.COLLECTIONS.bs);
var modelBikeRack =  require('./src/models/bikeRacksModel').model(environnement.COLLECTIONS.br);
var modelUser =  require('./src/models/userModel').model(environnement.COLLECTIONS.ur);

var foodTruckScheduler = require('./src/schedules/foodTruckScheduler');
var bikeStationScheduler = require('./src/schedules/bikeStationScheduler');
var bikeRackScheduler = require('./src/schedules/bikeRackScheduler');
var userScheduler = require('./src/schedules/userScheduler');

var index = require('./src/routes/indexRoutes');
var foodTrucksRoutes = require('./src/routes/foodTrucksRoutes');
var bikeStationsRoutes = require('./src/routes/bikeStationsRoutes');
var bikeRacksRoutes = require('./src/routes/bikeRacksRoutes');
var usersRoutes = require('./src/routes/usersRoutes');

module.exports.modelFoodTruck = modelFoodTruck;
module.exports.modelBikeStation = modelBikeStation;
module.exports.modelBikeRack = modelBikeRack;
module.exports.modelUser = modelUser;
module.exports.passport = passport;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////   EXPRESS                    /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(expressJWT({ secret: environnement.SECRET }).unless({ path: environnement.PATH }));
app.use(passport.initialize());
app.use(passport.session());

app.use(connection.getDatabaseConnection);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////   ROUTES                     /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.use('/', index);
app.use('/users', usersRoutes);
app.use('/foodtrucks', foodTrucksRoutes);
app.use('/bikestations', bikeStationsRoutes);
app.use('/bikeracks', bikeRacksRoutes);

app.use(function (req, res, next) {
    res.status(404).send(response.responseJson(false, 'Not Found'));
});

app.use(function (err, req, res, next) {
    res.status(500).send(response.responseJson(false, err));
});

app.get('/favicon.ico', function(req, res) {
    res.sendStatus(200);
});

module.exports = app;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////   SCHEDULES                  /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var urlFoodTruckJSON = "http://camionderue.com/donneesouvertes/geojson";
var urlBikeStationXML = "https://montreal.bixi.com/data/bikeStations.xml";
var urlBikeRackCSV = "http://donnees.ville.montreal.qc.ca/dataset/" +
    "c4dfdeb1-cdb7-44f4-8068-247755a56cc6/resource/" +
    "78dd2f91-2e68-4b8b-bb4a-44c1ab5b79b6/download/supportvelosigs.csv";

mongoose.Promise = global.Promise;
mongoose.connect(require('./configuration/environnement').DATABASE_URL);
mongoose.connection.on('connected', function() {
    console.log('COMPLETED :::::: database connected');
    // foodTruckScheduler.schedule(urlFoodTruckJSON);
    // bikeStationScheduler.schedule(urlBikeStationXML);
    // bikeRackScheduler.schedule(urlBikeRackCSV);
    // userScheduler.createUser();
});

mongoose.connection.on('disconnected', function() {
    console.log('WARNING :::::: database disconnected');
    mongoose.connect(require('./configuration/environnement').DATABASE_URL);
});

mongoose.connection.on('error', function(err) {
    console.log( 'ERROR :::::: database connection error');
});
