'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _webPush = require('web-push');

var _webPush2 = _interopRequireDefault(_webPush);

var _q = require('q');

var _q2 = _interopRequireDefault(_q);

var _mongo = require('./lib/mongo');

var _mongo2 = _interopRequireDefault(_mongo);

var _subscription = require('./model/subscription.model');

var _subscription2 = _interopRequireDefault(_subscription);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongo2.default.connect();

var app = (0, _express2.default)();

var port = process.env.PORT || 5000;

app.use(_express2.default.static('public'));
app.use(_bodyParser2.default.json());

app.post('/subscribe', function (req, res) {
    var subscriptionModel = new _subscription2.default(req.body);
    subscriptionModel.save(function (err, subscription) {
        if (err) {
            console.error('Error occurred while saving subscription. Err: ' + err);
            res.status(500).json({
                error: 'Technical error occurred'
            });
        } else {
            res.json({
                data: 'Subscription saved.'
            });
        }
    });
});

app.post('/push', function (req, res) {
    var payload = {
        title: req.body.title,
        message: req.body.message,
        url: req.body.url,
        ttl: req.body.ttl,
        icon: req.body.icon
    };

    _subscription2.default.find({}, function (err, subscriptions) {
        if (err) {
            console.error('Error occurred while getting subscriptions');
            res.status(500).json({
                error: 'Technical error occurred'
            });
        } else {
            var parallelSubscriptionCalls = subscriptions.map(function (subscription) {
                return new Promise(function (resolve, reject) {
                    var pushSubscription = {
                        endpoint: subscription.endpoint,
                        keys: {
                            p256dh: subscription.keys.p256dh,
                            auth: subscription.keys.auth
                        }
                    };

                    var pushPayload = JSON.stringify(payload);

                    var pushOptions = {
                        vapidDetails: {
                            subject: "https://web.push.io",
                            privateKey: process.env.VAPID_PRIVATE_KEY,
                            publicKey: process.env.VAPID_PUBLIC_KEY
                        },
                        TTL: payload.ttl,
                        headers: {}
                    };

                    _webPush2.default.sendNotification(pushSubscription, pushPayload, pushOptions).then(function (value) {
                        resolve({ status: true, endpoint: subscription.endpoint, data: value });
                    }).catch(function (err) {
                        reject({ status: false, endpoint: subscription.endpoint, data: err });
                    });
                });
            });

            _q2.default.allSettled(parallelSubscriptionCalls).then(function (pushResults) {
                console.info(pushResults);
            });

            res.json({
                data: 'Push triggered'
            });
        }
    });
});

app.listen(port, function (err) {
    if (err) {
        console.error('Error occurred while running app. Err: ' + err);
    } else {
        console.info('App is running on port: ' + port);
    }
});