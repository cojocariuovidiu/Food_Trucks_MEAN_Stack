/**
 * Created by celstn on 2016-10-25.
 */
"use strict";

/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
module.exports = {
    PORT: process.env.PORT || 3000,
    BASE_URL: process.env.BASE_URL || 'http://localhost:3000',
    DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost/montrealServicesDB',
    COLLECTIONS: {fd: 'foodtrucks', bs: 'bikeStations', br: 'bikeRacks', ur: 'users'},
    SECRET: process.env.SECRET || 'rep er fre der top qa g jo pp di er xc bas',
    CLIENT_ID: process.env.CLIENT_ID || 293729378390237372937,
    CLIENT_SECRET: process.env.CLIENT_SECRET || 'a26a8c59392ba5abe63b9fb69e6624a4',
    PATH: ['/', '/foodtrucks', /^\/foodtrucks\/.*/,
        '/bikestations', /^\/bikestations\/.*/,
        '/bikeracks', /^\/bikeracks\/.*/,
        '/no_login', '/no_signup', /^\/users\/.*/, '/users/login', '/users/logout', '/users/favorites',
        '/auth/facebook', '/auth/facebook/callback',
        '/favicon.ico'],
    USER_TYPE: {local: 'local user', facebook: 'facebook user'},
    USER_DEFAULT_FAVORITES: ['Gaufrabec', 'Le Cheese Truck'],

    FacebookID: '...',
    FacebookSECRET: '....',
    FacebookCALLBACK: 'http://localhost:'+ (process.env.PORT || 3000) +'/auth/facebook/callback'
};
