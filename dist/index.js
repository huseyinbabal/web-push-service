'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var port = process.env.PORT || 5000;

app.use(_express2.default.static('public'));

app.listen(port, function (err) {
    if (err) {
        console.error('Error occurred while running app. Err: ' + err);
    } else {
        console.info('App is running on port: ' + port);
    }
});