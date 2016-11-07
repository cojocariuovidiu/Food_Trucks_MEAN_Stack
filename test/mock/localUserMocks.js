/**
 * Created by celstn on 2016-10-25.
 */
"use strict";

module.exports =  {
    defaultUser01 : {
        first_name : 'celstn',
        last_name : 'example',
        email : 'celstn01@example.io',
        password : '#Celstn01'
    },

    defaultUser01EmptyInformations :{
        first_name : '',
        last_name : '',
        email : '',
        password : ''
    },
    
    defaultUser01ErrorEmail01 :{
        first_name : 'celstn',
        last_name : 'example',
        email : 'celstn011@example.io',
        password : '#Celstn01'
    },

    defaultUser01ErrorEmail02 :{
        first_name : 'celstn',
        last_name : 'example',
        email : 'cedvsfbdbsfwfvbwfvbfvssf',
        password : '#Celstn01'
    },
    
    defaultUser01ErrorEmail03 :{
        first_name : 'celstn',
        last_name : 'example',
        email : '',
        password : '#Celstn01'
    },
    
    defaultUser01ErrorPassword01:{
        first_name : 'celstn',
        last_name : 'example',
        email : 'celstn01@example.io',
        password : '#CelstnsdafadFadfadFAadfDAF01'
    },

    defaultUser01ErrorPassword02 :{
        first_name : 'celstn',
        last_name : 'example',
        email : 'celstn01@example.io',
        password : '!'
    },

    defaultUser01ErrorPassword03 :{
        first_name : 'celstn',
        last_name : 'example',
        email : 'celstn01@example.io',
        password : ''
    }
};