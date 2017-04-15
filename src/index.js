import express from 'express';

const app = express();

const port = process.env.PORT || 5000;

app.use(express.static('public'));

app.listen(port, (err) => {
    if (err) {
        console.error(`Error occurred while running app. Err: ${err}`);
    } else {
        console.info(`App is running on port: ${port}`);
    }
});
