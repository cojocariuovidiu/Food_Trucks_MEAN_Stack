/**
 * Created by celstn on 2016-10-25.
 */
"use strict";

var moment = require('moment');
var async = require('async');

var databaseAccess = require('./DAO_Access');
var DAO_FoodTrucks = require('./DAO_FoodTrucks');
var DAO_users = require('./DAO_users');
var util = require('../../configuration/util');
var databaseLog = require('./../log/databaseLog');
var appModels = require('./../../app');
var environnement = require('./../../configuration/environnement');
var localUserMocks = require('./../../test/mock/localUserMocks');

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
module.exports.createDatabase = function (callback) {
    var model = appModels.modelUser;
    var modelInstance = new model({});
    
    modelInstance.local.first_name = localUserMocks.defaultUser01.first_name;
    modelInstance.local.last_name = localUserMocks.defaultUser01.last_name;
    modelInstance.local.email = localUserMocks.defaultUser01.email;
    modelInstance.local.password = localUserMocks.defaultUser01.password;
    
    var errorMessage = '!!! ERROR user schema : \n';
    modelInstance.validate(function (error) {
        if (error && error.errors['local.first_name']) {
            errorMessage = errorMessage + error.errors['local.first_name'].message + "\n";
        }
        if (error && error.errors['local.last_name']) {
            errorMessage = errorMessage + error.errors['local.last_name'].message + "\n";
        }
        if (error && error.errors['local.email']) {
            errorMessage = errorMessage + error.errors['local.email'].message + "\n";
        }
        if (error && error.errors['local.password']) {
            errorMessage = errorMessage + error.errors['local.password'].message + "\n";
        }
        if (error) {
            return callback(errorMessage, null);
        } else {
            util.generateSaltHash(modelInstance.local.password, function (err, hash) {
                if (err) return callback("Server error.", null);
                modelInstance.local.password = hash;
                databaseAccess.createEmptyDatabase(model, modelInstance, environnement.COLLECTIONS.ur, callback)
            });
        }

    });

};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
// module.exports.beforeSignup = function (req, callback) {
//     var model = appModels.modelUser;
//     var modelInstance = new model({});
//
//     modelInstance.user_type = req.body.type;
//
//     if (modelInstance.user_type === 'local user') {
//         modelInstance.local.first_name = req.body.firstname;
//         modelInstance.local.last_name = req.body.lastname;
//         modelInstance.local.email = req.body.email;
//         modelInstance.local.password = req.body.password;
//
//         modelInstance.validate(function (error) {
//             if (error) callback(modelInstance.local.validate.message, null);
//         });
//
//         util.generateToken(modelInstance.local.email, function (error, token) {
//             if (token) {
//                 callback(null, token);
//             } else callback('Can not generate a email signup token.', null);
//         });
//        
//     } else if (modelInstance.user_type === 'facebook user') {
//
//     }
//
// }

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
// module.exports.userSignup = function (req, callback) {
//     databaseLog.writeDatabaseLog(" add user document \n");
//
//     var model = appModels.modelUser;
//     var modelInstance = new model({});
//     modelInstance.user_type = req.body.type;
//    
//     if (modelInstance.user_type === 'local user') {
//
//         modelInstance.local.first_name = req.body.firstname;
//         modelInstance.local.last_name = req.body.lastname;
//
//         modelInstance.local.email = req.body.email;
//         modelInstance.local.password = req.body.password;
//
//     } else if (modelInstance.user_type === 'facebook user') {
//
//     }
// };

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
module.exports.manageUserFavorites = function (userId, req, callback) {
    if (req.body.query === 'read') {
        console.log(" router.post(/favorites req.type === read ");
        DAO_users.findAllFavoritesFoodtrucks(
            req.body.names,
            function (err, data) {
                if (err) return callback('Server error', null);
                callback(null, data);
            }
        );
    } else if (req.body.query === 'create') {
        console.log(" router.post(/favorites req.type === create ");
        DAO_users.createFavorites(
            userId,
            req.body.names,
            function (err, data) {
                if (err) return callback('Server error', null);
                callback(null, data);
            }
        );
    } else if (req.body.query === 'delete') {
        console.log(" router.post(/favorites req.type === delete ");
        DAO_users.deleteFavorites(
            userId,
            req.body.names,
            function (err, data) {
                if (err) return callback('Server error', null);
                callback(null, data);
            }
        );
    }
};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
module.exports.validateUserAccount = function (req, callback) {
    console.log(" validate User Account token = ", req.body.token);
    util.decodeToken(req.body.token, function (error, email) {
        if (error) return callback("Server error", null);
        DAO_users.findLocalUser(email, function (error, dataUser) {
            if (error) return callback('Server error', null);
            return callback(null, dataUser);
        })
    })
};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
module.exports.findByTypeUsername = function (type, name, callback) {
    databaseLog.writeDatabaseLog("  find By Type Username ,  email : " + name + "\n");

    appModels.modelUser.find({}).where('local.email').equals(name).
    exec(function (err, result) {
        if (err) return callback('Server error', null);
        if (result.length === 0) return callback('You do not have an account', null);
        return callback(null, result[0]);
    });

};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
function findFavoritesFoodTrucksByName(name, callback) {
    DAO_FoodTrucks.findByName(name, callback);
}

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
module.exports.findAllFavoritesFoodtrucks = function (names, callback) {
    databaseLog.writeDatabaseLog("  find All Favorites Food Trucks , names : " + names + "\n");

    async.map(names, findFavoritesFoodTrucksByName, function (err, result) {
            if (err) return callback('Server error', null);
            return callback(null, result);
        }
    );
};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
module.exports.createFavorites = function (id, names, callback) {
    databaseLog.writeDatabaseLog("  createFavorites , names : " + names + "\n");
    
    async.each(names, function (name, callback) {
        appModels.modelUser.findOneAndUpdate({_id: id},
            {$addToSet: {favorites: name}},
            function (err, dbUser) {
                if (err) return callback('Server error', null);
                return callback(null, dbUser);
            }
        );
    }, function (errAsync) {
        if (errAsync) return callback('Server error', null);
        return callback(null, 'All informations in create favorites have been saved successfully ');
    });
};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
module.exports.deleteFavorites = function (id, names, callback) {
    databaseLog.writeDatabaseLog("  find All Favorites Food Trucks , names : " + names + "\n");

    async.each(names, function (name, callback) {
        appModels.modelUser.findOneAndUpdate({_id: id},
            {$pull: {favorites: name}},
            function (err, dbUser) {
                if (err) return callback('Server error.', null);
                return callback(null, dbUser);
            }
        );
    }, function (errAsync) {
        if (errAsync) return callback('Server error', null);
        return callback(null, 'All informations in delete favorites have been saved successfully ');

    });
};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
function deleteSelectFavorite(name, callback) {
    DAO_users.deleteOneFavorite(name, callback);
}

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
module.exports.findFacebookUser = function (profile, callback) {
    appModels.modelUser.findOne({'facebook.id': profile.id}, function (err, user) {
        if (err) return callback('Server error', null);
        if (user) return callback(null, user);
        return callback(null, null);
    })
};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
module.exports.findLocalUser = function (email, callback) {
    appModels.modelUser.findOne({'local.email': email}, function (err, user) {
        if (err) return callback('Server error', null);
        if (user) return callback(null, user);
        return callback(null, null);
    })
};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
module.exports.findLocalUserByEmail = function (email, callback) {
    appModels.modelUser.findOne({'local.email': email}, function (err, user) {
        if (err) return callback('Server error', null);
        return callback(null, user);
    })
};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
module.exports.createLocalUser = function (req, callback) {
    var model = appModels.modelUser;
    var modelInstance = new model({});

    modelInstance.local.password = req.body.password;
    modelInstance.local.first_name = req.body.first_name;
    modelInstance.local.last_name = req.body.last_name;
    modelInstance.local.email = req.body.email;

    util.generateSaltHash(modelInstance.local.password, function (error, token) {
        if (error) return callback(error);
        modelInstance.local.password = token;
        modelInstance.save(function (err, user) {
            if (err) return callback('Server error');
            return callback(null, user);
        });
    });
};

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
module.exports.createFacebookUser = function (accessToken, profile, callback) {
    var model = appModels.modelUser;
    var modelInstance = new model({});
    modelInstance.facebook.id = profile.id;
    modelInstance.facebook.token = accessToken;
    modelInstance.facebook.first_name = profile.name.givenName;
    modelInstance.facebook.last_name = profile.name.familyName;
    modelInstance.facebook.email = profile.emails[0].value;

    modelInstance.save(function (err, result) {
        if (err) return callback('Server error', null);
        return callback(null, result);

    });
};
