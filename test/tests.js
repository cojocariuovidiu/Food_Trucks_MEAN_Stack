/**
 * Created by celstn on 2016-10-25.
 */
"use strict";

var moment = require('moment');
var chai = require("chai");
chai.should();
chai.use(require('chai-things'));
var expect = chai.expect; 
var geolib = require('geolib');
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
var myApp = require('../app');
var request = require('supertest')(myApp);
var localUserMocks = require('./mock/localUserMocks');
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
describe('GET /', function () {
    it('get /', function (done) {
        request
            .get('/')
            .expect(200)
            .end(function (err, res) {
                expect(res.body.body).to.equal('the home page');
                done();
            })
    });
});
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
describe('FOOD TRUCKS', function () {
    describe('GET /foodtrucks/:id', function () {
        it('get id: T00010001 => truck name: Gaufrabec', function (done) {
            request
                .get('/foodtrucks/T00010001')
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.instanceof(Array);

                    var isValid = res.body.body.every(function (elememt) {
                        return elememt.properties.truck_name === "Gaufrabec";
                    });
                    expect(isValid).to.equal(true);
                    done();
                })
        });

        it('get id: T000100012 => empty array', function (done) {
            request
                .get('/foodtrucks/T000100012')
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.instanceof(Array);
                    expect(res.body.body).to.have.lengthOf(0);
                    done();
                })
        });

        it('get id: T@000100012 => not valid id', function (done) {
            request
                .get('/foodtrucks/T@000100012')
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.a('string');
                    expect(res.body.body).to.equal('Not valid id');
                    done();
                })
        });

        it('get id: T => not valid id', function (done) {
            request
                .get('/foodtrucks/T@000100012')
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.a('string');
                    expect(res.body.body).to.equal('Not valid id');
                    done();
                })
        });

        it('get id: @@ => not valid id', function (done) {
            request
                .get('/foodtrucks/T@000100012')
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.a('string');
                    expect(res.body.body).to.equal('Not valid id');
                    done();
                })
        });

        it('get id: ?1 => not valid id', function (done) {
            request
                .get('/foodtrucks/T@000100012')
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.a('string');
                    expect(res.body.body).to.equal('Not valid id');
                    done();
                })
        });

    });
    
    
    describe('GET /foodtrucks', function () {
        it('get all food trucks => all ', function (done) {
            request
                .get('/foodtrucks')
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.instanceof(Array);
                    expect(res.body.body).to.have.lengthOf(9);
                    done();
                })
        });

        it('get food trucks findByDateRange 01 => list with elements => test range 01', function (done) {
            request
                .get('/foodtrucks?from=2016-11-02&to=2016-11-15')
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.instanceof(Array);
                    var isValid = res.body.body.every(function (elememt) {
                        return moment(elememt.properties.fd_date).isBefore('2016-11-15') &&
                            moment(elememt.properties.fd_date).isAfter('2016-11-02');
                    });
                    expect(isValid).to.equal(true);

                    done();
                })
        });

        it('get food trucks findByDateRange => Wrong FROM date format', function (done) {
            request
                .get('/foodtrucks?from=2015-11-00&to=2016-11-05')
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.a('string');
                    expect(res.body.body).to.equal('Wrong FROM date format');
                    done();
                })
        });

        it('get food trucks findByDateRange => Wrong TO date format', function (done) {
            request
                .get('/foodtrucks?from=2015-11-01&to=2016-21-05')
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.a('string');
                    expect(res.body.body).to.equal('Wrong TO date format');
                    done();
                })
        });

        it('get food trucks findByDateRange => TO date is earlier than the FROM date', function (done) {
            request
                .get('/foodtrucks?from=2016-11-05&to=2016-11-04')
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.a('string');
                    expect(res.body.body).to.equal('TO date is earlier than the FROM date');
                    done();
                })
        });


        it('get all food trucks findByDateRange => empty list', function (done) {
            request
                .get('/foodtrucks?from=2016-11-02&to=2016-11-02')
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.have.lengthOf(0);
                    done();
                })
        });

        it('get food trucks errorMissParamFrom => error', function (done) {
            request
                .get('/foodtrucks?from=&to=2016-11-04')
                .expect(400)
                .end(function (err, res) {
                    expect(res.body.body).to.equal('Missing parameter from');
                    done();
                })
        });

        it('get food trucks errorMissParamFrom => error', function (done) {
            request
                .get('/foodtrucks?to=2016-11-02')
                .expect(400)
                .end(function (err, res) {
                    expect(res.body.body).to.equal('Missing parameter from');
                    done();
                })
        });

        it('get food trucks errorMissParamTo => error', function (done) {
            request
                .get('/foodtrucks?from=2016-11-04&to=')
                .expect(400)
                .end(function (err, res) {
                    expect(res.body.body).to.equal('Missing parameter to');
                    done();
                })
        });

        it('get food trucks errorMissParamTo => error', function (done) {
            request
                .get('/foodtrucks?from=2016-11-02&')
                .expect(400)
                .end(function (err, res) {
                    expect(res.body.body).to.equal('Missing parameter to');
                    done();
                })
        });
    });
});
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
describe('BIKE STATIONS', function () {

    describe('GET /bikestations/:id', function () {
        it('get bikestations station_id: 6 => truck name: 18e avenue/Rosemont', function (done) {
            request
                .get('/bikestations/6')
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.instanceof(Array);

                    var isValid = res.body.body.every(function (elememt) {
                        return elememt.name === "18e avenue/Rosemont";
                    });
                    expect(isValid).to.equal(true);

                    done();
                })
        });

        it('get bikestations station_id: 127080 => empty array', function (done) {
            request
                .get('/bikestations/127080')
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.instanceof(Array);
                    expect(res.body.body).to.have.lengthOf(0);
                    done();
                })
        });

        it('get bikestations station_id: T22 => not valid id', function (done) {
            request
                .get('/bikestations/T22')
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.a('string');
                    expect(res.body.body).to.equal('Not valid id');
                    done();
                })
        });

        it('get bikestations station_id: @@ => not valid id', function (done) {
            request
                .get('/bikestations/@@')
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.a('string');
                    expect(res.body.body).to.equal('Not valid id');
                    done();
                })
        });

        it('get bikestations station_id: 1?1! => not valid id', function (done) {
            request
                .get('/bikestations/1?1!')
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.instanceof(Array);
                    done();
                })
        });

        it('get bikestations station_id: 11! => not valid id', function (done) {
            request
                .get('/bikestations/11!')
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.a('string');
                    expect(res.body.body).to.equal('Not valid id');
                    done();
                })
        });
    });

    
    var selectRadius = 500;
    var selectLatitude = '45.509292692973';
    var selectLongitude = '-73.554419651628';
    describe('GET /bikestations', function () {
        // it('get all bike stations => all ', function (done) {
        //     request
        //         .get('/bikestations')
        //         .expect(200)
        //         .end(function (err, res) {
        //             expect(res.body.body).to.be.instanceof(Array);
        //             expect(res.body.body).to.have.lengthOf(438);
        //             done();
        //         })
        // });

        it('get bike stations by radius = ' + selectRadius + ' M => list with elements', function (done) {
            request
                .get('/bikestations?rad=' + selectRadius + '&long=' + selectLongitude + '&lat=' + selectLatitude)
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.instanceof(Array);

                    var isValid = res.body.body.every(function (elememt) {
                        var dist = geolib.getDistance(
                            {latitude: elememt.geo[1], longitude: elememt.geo[0]},
                            {latitude: selectLatitude, longitude: selectLongitude}
                        );
                        return dist <= selectRadius;
                    });
                    expect(isValid).to.equal(true);

                    done();

                })
        });

        it('get bike stations by radius = 0 M => list with elements', function (done) {
            request
                .get('/bikestations?rad=0&long=' + selectLongitude + '&lat=' + selectLatitude)
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.instanceof(Array);

                    var isValid = res.body.body.every(function (elememt) {
                        var dist = geolib.getDistance(
                            {latitude: elememt.geo[1], longitude: elememt.geo[0]},
                            {latitude: selectLatitude, longitude: selectLongitude}
                        );
                        return dist <= 0;
                    });
                    expect(isValid).to.equal(true);

                    done();

                })
        });

        it('get bike stations by radius rad=23.25a  => Not valid radius', function (done) {
            request
                .get('/bikestations?rad=23.25a&long=' + selectLongitude + '&lat=' + selectLatitude)
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.a('string');
                    expect(res.body.body).to.equal('Not valid radius');
                    done();

                })
        });

        it('get bike stations by radius rad=23.25a  => Not valid radius', function (done) {
            request
                .get('/bikestations?rad= 23.25 &long=' + selectLongitude + '&lat=' + selectLatitude)
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.a('string');
                    expect(res.body.body).to.equal('Not valid radius');
                    done();

                })
        });


        it('get bike stations by radius long=75.23d  => Not valid longitude', function (done) {
            request
                .get('/bikestations?rad=' + selectRadius + '&long=75.23d&lat=' + selectLatitude)
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.a('string');
                    expect(res.body.body).to.equal('Not valid longitude');
                    done();

                })
        });

        it('get bike stations by radius long=75.23d  => Not valid longitude', function (done) {
            request
                .get('/bikestations?rad=' + selectRadius + '&long= 75.23d &lat=' + selectLatitude)
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.a('string');
                    expect(res.body.body).to.equal('Not valid longitude');
                    done();

                })
        });

        it('get bike stations by radius lat=45.35d3  => Not a valid latitude', function (done) {
            request
                .get('/bikestations?rad=' + selectRadius + '&long=' + selectLongitude + '&lat=45.35d3')
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.a('string');
                    expect(res.body.body).to.equal('Not valid latitude');
                    done();

                })
        });

        it('get bike stations test radius => Missing parameter rad', function (done) {
            request
                .get('/bikestations?rad=&long=' + selectLongitude + '&lat=' + selectLatitude)
                .expect(400)
                .end(function (err, res) {
                    expect(res.body.body).to.equal('Missing parameter rad');
                    done();
                })
        });

        it('get bike stations test radius => Missing parameter rad', function (done) {
            request
                .get('/bikestations?long=' + selectLongitude + '&lat=' + selectLatitude)
                .expect(400)
                .end(function (err, res) {
                    expect(res.body.body).to.equal('Missing parameter rad');
                    done();
                })
        });


        it('get bike stations test longitude => Missing parameter long', function (done) {
            request
                .get('/bikestations?rad=' + selectRadius + '&long=&lat=' + selectLatitude)
                .expect(400)
                .end(function (err, res) {
                    expect(res.body.body).to.equal('Missing parameter long');
                    done();
                })
        });

        it('get bike stations test longitude => Missing parameter long', function (done) {
            request
                .get('/bikestations?rad=' + selectRadius + '&lat=' + selectLatitude)
                .expect(400)
                .end(function (err, res) {
                    expect(res.body.body).to.equal('Missing parameter long');
                    done();
                })
        });


        it('get bike stations test latitude => Missing parameter lat', function (done) {
            request
                .get('/bikestations?rad=' + selectRadius + '&long=' + selectLongitude + '&lat=')
                .expect(400)
                .end(function (err, res) {
                    expect(res.body.body).to.equal('Missing parameter lat');
                    done();
                })
        });

        it('get bike stations test latitude => Missing parameter lat', function (done) {
            request
                .get('/bikestations?rad=' + selectRadius + '&long=' + selectLongitude + '&')
                .expect(400)
                .end(function (err, res) {
                    expect(res.body.body).to.equal('Missing parameter lat');
                    done();
                })
        });
    });


});
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
describe('BIKE RACKS', function () {
    var selectRadius = 500;
    var selectLatitude = '45.509292692973';
    var selectLongitude = '-73.554419651628';

    describe('GET /bikeracks/:id', function () {
        it('get bikeracks rack_id: 6 => empty array' , function (done) {
            request
                .get('/bikeracks/6')
                .expect(200)
                .end(function (err, res) { 
                    expect(res.body.body).to.be.instanceof(Array);
                    expect(res.body.body).to.have.lengthOf(0);
                    done();
                })
        });

        it('get bikeracks rack_id: 1551304 => park: CAP-SAINT-JACQUES', function (done) {
            request
                .get('/bikeracks/1551304')
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.instanceof(Array);

                    var isValid = res.body.body.every(function (elememt) {
                        return elememt.park === "CAP-SAINT-JACQUES";
                    });
                    expect(isValid).to.equal(true);
                    done();
                })
        });

        it('get bikeracks rack_id: 127080 => empty array', function (done) {
            request
                .get('/bikeracks/127080')
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.instanceof(Array);
                    expect(res.body.body).to.have.lengthOf(0);
                    done();
                })
        });

        it('get bikeracks rack_id: T22 => not valid id', function (done) {
            request
                .get('/bikeracks/T22')
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.a('string');
                    expect(res.body.body).to.equal('Not valid id');
                    done();
                })
        });

        it('get bikeracks rack_id: @@ => not valid id', function (done) {
            request
                .get('/bikeracks/@@')
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.a('string');
                    expect(res.body.body).to.equal('Not valid id');
                    done();
                })
        });

        it('get bikeracks rack_id: 1?1! => empty array', function (done) {
            request
                .get('/bikeracks/1?1!')
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.instanceof(Array);
                    expect(res.body.body).to.have.lengthOf(0);
                    done();
                })
        });

        it('get bikeracks id: 11! => not valid id', function (done) {
            request
                .get('/bikestations/11!')
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.a('string');
                    expect(res.body.body).to.equal('Not valid id');
                    done();
                })
        });
    });


    describe('GET /bikeracks', function () {
        // it('get all bike racks => all ', function (done) {
        //     request
        //         .get('/bikeracks')
        //         .expect(200)
        //         .end(function (err, res) {
        //             expect(res.body.body).to.be.instanceof(Array);
        //             expect(res.body.body).to.have.lengthOf(438);
        //             done();
        //         })
        // });

        it('get bike racks by radius = ' + selectRadius + ' M => list with elements', function (done) {
            request
                .get('/bikeracks?rad=' + selectRadius + '&long=' + selectLongitude + '&lat=' + selectLatitude)
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.instanceof(Array);
                    var isValid = res.body.body.every(function (elememt) {
                        var dist = geolib.getDistance(
                            {latitude: elememt.geo[1], longitude: elememt.geo[0]},
                            {latitude: selectLatitude, longitude: selectLongitude}
                        );
                        return dist <= selectRadius;
                    });
                    expect(isValid).to.equal(true);
                    done();
                })
        });

        it('get bike racks by radius = 0 M => list with elements', function (done) {
            request
                .get('/bikeracks?rad=0&long=' + selectLongitude + '&lat=' + selectLatitude)
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.instanceof(Array);
                    var isValid = res.body.body.every(function (elememt) {
                        var dist = geolib.getDistance(
                            {latitude: elememt.geo[1], longitude: elememt.geo[0]},
                            {latitude: selectLatitude, longitude: selectLongitude}
                        );
                        return dist <= 0;
                    });
                    expect(isValid).to.equal(true);
                    done();
                })
        });

        it('get bike racks by radius rad=23.25a  => Not valid radius', function (done) {
            request
                .get('/bikeracks?rad=23.25a&long=' + selectLongitude + '&lat=' + selectLatitude)
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.a('string');
                    expect(res.body.body).to.equal('Not valid radius');
                    done();
                })
        });

        it('get bike racks by radius rad=23.25a  => Not valid radius', function (done) {
            request
                .get('/bikeracks?rad= 23.25 &long=' + selectLongitude + '&lat=' + selectLatitude)
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.a('string');
                    expect(res.body.body).to.equal('Not valid radius');
                    done();
                })
        });


        it('get bike racks by radius long=75.23d  => Not valid longitude', function (done) {
            request
                .get('/bikeracks?rad=' + selectRadius + '&long=75.23d&lat=' + selectLatitude)
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.a('string');
                    expect(res.body.body).to.equal('Not valid longitude');
                    done();

                })
        });

        it('get bike racks by radius long=75.23d  => Not valid longitude', function (done) {
            request
                .get('/bikeracks?rad=' + selectRadius + '&long= 75.23d &lat=' + selectLatitude)
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.a('string');
                    expect(res.body.body).to.equal('Not valid longitude');
                    done();
                })
        });

        it('get bike racks by radius lat=45.35d3  => Not a valid latitude', function (done) {
            request
                .get('/bikeracks?rad=' + selectRadius + '&long=' + selectLongitude + '&lat=45.35d3')
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.be.a('string');
                    expect(res.body.body).to.equal('Not valid latitude');
                    done();
                })
        });

        it('get bike racks test radius => Missing parameter rad', function (done) {
            request
                .get('/bikeracks?rad=&long=' + selectLongitude + '&lat=' + selectLatitude)
                .expect(400)
                .end(function (err, res) {
                    expect(res.body.body).to.equal('Missing parameter rad');
                    done();
                })
        });

        it('get bike racks test radius => Missing parameter rad', function (done) {
            request
                .get('/bikeracks?long=' + selectLongitude + '&lat=' + selectLatitude)
                .expect(400)
                .end(function (err, res) {
                    expect(res.body.body).to.equal('Missing parameter rad');
                    done();
                })
        });


        it('get bike racks test longitude => Missing parameter long', function (done) {
            request
                .get('/bikeracks?rad=' + selectRadius + '&long=&lat=' + selectLatitude)
                .expect(400)
                .end(function (err, res) {
                    expect(res.body.body).to.equal('Missing parameter long');
                    done();
                })
        });

        it('get bike racks test longitude => Missing parameter long', function (done) {
            request
                .get('/bikeracks?rad=' + selectRadius + '&lat=' + selectLatitude)
                .expect(400)
                .end(function (err, res) {
                    expect(res.body.body).to.equal('Missing parameter long');
                    done();
                })
        });

        it('get bike racks test latitude => Missing parameter lat', function (done) {
            request
                .get('/bikeracks?rad=' + selectRadius + '&long=' + selectLongitude + '&lat=')
                .expect(400)
                .end(function (err, res) {
                    expect(res.body.body).to.equal('Missing parameter lat');
                    done();
                })
        });

        it('get bike racks test latitude => Missing parameter lat', function (done) {
            request
                .get('/bikeracks?rad=' + selectRadius + '&long=' + selectLongitude + '&')
                .expect(400)
                .end(function (err, res) {
                    expect(res.body.body).to.equal('Missing parameter lat');
                    done();
                })
        });
    });
});
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
describe('LOCAL USER', function () {
    describe('POST /users/login', function () {
        it('post login defaultUser01EmptyInformations', function (done) {
            request
                .post('/users/login')
                .send(localUserMocks.defaultUser01EmptyInformations)
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.not.be.an('object');
                    expect(null).to.be.a('null');
                    expect(undefined).to.be.an('undefined');
                    done();
                });
        });

        it('post login defaultUser01', function (done) {
            request
                .post('/users/login')
                .send(localUserMocks.defaultUser01)
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body.type).to.equal('Exist account');
                    done();
                });
        });

        it('post login defaultUser01ErrorEmail01', function (done) {
            request
                .post('/users/login')
                .send(localUserMocks.defaultUser01ErrorEmail01)
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body.type).to.equal('Invalid email');
                    done();
                });
        });

        it('post login defaultUser01ErrorEmail02', function (done) {
            request
                .post('/users/login')
                .send(localUserMocks.defaultUser01ErrorEmail02)
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body.type).to.equal('Invalid email');
                    done();
                });
        });

        it('post login defaultUser01ErrorEmail03', function (done) {
            request
                .post('/users/login')
                .send(localUserMocks.defaultUser01ErrorEmail03)
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.not.be.an('object');
                    expect(null).to.be.a('null');
                    expect(undefined).to.be.an('undefined');
                    done();
                });
        });

        it('post login defaultUser01ErrorPassword01', function (done) {
            request
                .post('/users/login')
                .send(localUserMocks.defaultUser01ErrorPassword01)
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body.type).to.equal('Invalid password');
                    done();
                });
        });

        it('post login defaultUser01ErrorPassword02', function (done) {
            request
                .post('/users/login')
                .send(localUserMocks.defaultUser01ErrorPassword02)
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body.type).to.equal('Invalid password');
                    done();
                });
        });

        it('post login defaultUser01ErrorPassword03', function (done) {
            request
                .post('/users/login')
                .send(localUserMocks.defaultUser01ErrorPassword03)
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.not.be.an('object');
                    expect(null).to.be.a('null');
                    expect(undefined).to.be.an('undefined');
                    done();
                });
        });
    });


    describe('POST /users/signup', function () {

        it('post signup defaultUser01EmptyInformations', function (done) {
            request
                .post('/users/signup')
                .send(localUserMocks.defaultUser01EmptyInformations)
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.not.be.an('object');
                    expect(null).to.be.a('null');
                    expect(undefined).to.be.an('undefined');
                    done();
                });
        });

        it('post signup defaultUser01', function (done) {
            request
                .post('/users/signup')
                .send(localUserMocks.defaultUser01)
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body.type).to.equal('Exist account');
                    done();
                });
        });

        it('post signup defaultUser01ErrorEmail01', function (done) {
            request
                .post('/users/signup')
                .send(localUserMocks.defaultUser01ErrorEmail01)
                .expect(500)
                .end(function (err, res) {
                    expect(res.body.body).to.equal('Server error');
                    done();
                });
        });

        it('post signup defaultUser01ErrorEmail02', function (done) {
            request
                .post('/users/signup')
                .send(localUserMocks.defaultUser01ErrorEmail02)
                .expect(500)
                .end(function (err, res) {
                    expect(res.body.body).to.equal('Server error');
                    done();
                });
        });

        it('post signup defaultUser01ErrorEmail03', function (done) {
            request
                .post('/users/signup')
                .send(localUserMocks.defaultUser01ErrorEmail03)
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.not.be.an('object');
                    expect(null).to.be.a('null');
                    expect(undefined).to.be.an('undefined');
                    done();
                });
        });

        it('post signup defaultUser01ErrorPassword01', function (done) {
            request
                .post('/users/signup')
                .send(localUserMocks.defaultUser01ErrorPassword01)
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body.type).to.equal('Invalid password');
                    done();
                });
        });

        it('post signup defaultUser01ErrorPassword02', function (done) {
            request
                .post('/users/signup')
                .send(localUserMocks.defaultUser01ErrorPassword02)
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body.type).to.equal('Invalid password');
                    done();
                });
        });

        it('post signup defaultUser01ErrorPassword03', function (done) {
            request
                .post('/users/signup')
                .send(localUserMocks.defaultUser01ErrorPassword03)
                .expect(200)
                .end(function (err, res) {
                    expect(res.body.body).to.not.be.an('object');
                    expect(null).to.be.a('null');
                    expect(undefined).to.be.an('undefined');
                    done();
                });
        });
    });
});
