/**
 * Created by celstn on 2016-10-25.
 */
"use strict";

var mongoose = require("mongoose");
var theValidator = require('validator');
var  validators = require('mongoose-validators')

var environnnement = require('./../../configuration/environnement');

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
module.exports.model = function (name) {
    console.log(name,  "module.exports  MODEL");
    return mongoose.model( name ,  mongoose.Schema({

        favorites : { type: [], default: environnnement.USER_DEFAULT_FAVORITES },
        user_type : {
            type: String,
            enum: [environnnement.USER_TYPE.local, environnnement.USER_TYPE.facebook],
            default: environnnement.USER_TYPE.local
        },


        local: {
            first_name: {
                type: String,
                trim: true,
                require: [false],
                validate: { ///http://mongoosejs.com/docs/validation.html
                    validator: function(value, callback) {
                        callback(true ||theValidator.isLength(value,{min:2, max: 50}) && theValidator.isAlpha(value));
                    },
                    message: 'Your first name should contains only characters and at least 2 characters and a maximum of 50.'
                }
            },

            last_name: {
                type: String,
                require: [false],
                trim: true, 
                validate: { 
                    validator: function(value, callback) {
                        callback( true || theValidator.isLength(value,{min:2, max: 50})&& theValidator.isAlpha(value));
                    },
                    message: 'Your last name should contains only characters and at least 2 characters and a maximum of 50.'
                }
            },

            email: {
                type: String,
                unique: true,
                require: [true, 'You should provide an email.'],
                validate: { 
                    validator: function(value, callback) {
                        callback(true || theValidator.isEmail(value));
                    },
                    message: 'You should provide a valid email : jhondoe@exemple.com'
                }
            },

            password: {
                type: String,
                require: [true, 'You should provide a password.'],
                validate: {
                    validator: function (value,callback) {
                        callback(
                            theValidator.isLength(value,{min:2, max: undefined}) &&
                            /((?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*\W).{8,})/.test(value)
                        );
                    },
                    message: 'Your password {VALUE} should contain at least 8 characters ( uppercase, lowercase, numeric and special characters).'
                }
            }
        },
        
        
        facebook: {
            id: {
                type: String,
                unique: true
            },
            
            token: String,
            email: String,
            first_name: String,
            last_name:String
        }
    }, { collection: name  }));
};
