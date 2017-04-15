import mongoose from 'mongoose';

class Mongo {
    static connect() {
        const mongoUri = process.env.MONGO_URI;
        mongoose.Promise = global.Promise;
        mongoose.connect(mongoUri);

        const db = mongoose.connection;

        db.on('error', (err) => {
            console.error(`Mongo connection error: ${err}`);
        });

        db.once('open', () => {
            console.info(`Mongo connection established`);
        })
    }
}

export default Mongo;