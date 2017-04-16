import express from 'express';
import bodyParser from 'body-parser';
import webPush from 'web-push';
import q from 'q';

import Mongo from './lib/mongo';

Mongo.connect();

import Subscription from './model/subscription.model';

const app = express();

const port = process.env.PORT || 5000;

app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/subscribe', (req, res) => {
    const subscriptionModel = new Subscription(req.body);
    subscriptionModel.save((err, subscription) => {
        if (err) {
            console.error(`Error occurred while saving subscription. Err: ${err}`);
            res.status(500).json({
                error: 'Technical error occurred'
            });
        } else {
            res.json({
                data: 'Subscription saved.'
            })
        }
    });
});

app.post('/push', (req, res) => {
    const payload = {
        title: req.body.title,
        message: req.body.message,
        url: req.body.url,
        ttl: req.body.ttl,
        icon: req.body.icon
    };

    Subscription.find({}, (err, subscriptions) => {
        if (err) {
            console.error(`Error occurred while getting subscriptions`);
            res.status(500).json({
                error: 'Technical error occurred'
            });
        } else {
            let parallelSubscriptionCalls = subscriptions.map((subscription) => {
                return new Promise((resolve, reject) => {
                    const pushSubscription = {
                        endpoint: subscription.endpoint,
                        keys: {
                            p256dh: subscription.keys.p256dh,
                            auth: subscription.keys.auth
                        }
                    };

                    const pushPayload = JSON.stringify(payload);

                    const pushOptions = {
                        vapidDetails: {
                            subject: "http://nodeschool.ist/",
                            privateKey: process.env.VAPID_PRIVATE_KEY,
                            publicKey: process.env.VAPID_PUBLIC_KEY
                        },
                        TTL: payload.ttl,
                        headers: {}
                    };

                    webPush.sendNotification(
                        pushSubscription,
                        pushPayload,
                        pushOptions
                    ).then((value) => {
                        resolve({status: true, endpoint: subscription.endpoint, data: value});
                    }).catch((err) => {
                        reject({status: false, endpoint: subscription.endpoint, data: err});
                    });
                });
            });

            q.allSettled(parallelSubscriptionCalls).then((pushResults) => {
                console.info(pushResults);
            });

            res.json({
                data: 'Push triggered'
            })
        }
    });
});

app.listen(port, (err) => {
    if (err) {
        console.error(`Error occurred while running app. Err: ${err}`);
    } else {
        console.info(`App is running on port: ${port}`);
    }
});
