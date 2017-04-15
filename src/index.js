import express from 'express';
import bodyParser from 'body-parser';
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

app.listen(port, (err) => {
    if (err) {
        console.error(`Error occurred while running app. Err: ${err}`);
    } else {
        console.info(`App is running on port: ${port}`);
    }
});
