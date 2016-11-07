/**
 * Created by celstn on 2016-10-25.
 */
"use strict";

module.exports.responseJson = function (success, body) {
    return {
        success: success,
        body: body
        // hateoas: hateoas
    };
};
