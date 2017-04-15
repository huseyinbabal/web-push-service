import mongoose from 'mongoose';

const Schema = mongoose.Schema;

class SubscriptionSchema extends Schema {
    constructor() {
        super({
            endpoint: String,
            keys: Schema.Types.Mixed,
            createDate: {
                type: Date,
                default: Date.now
            }
        })
    }
}

export default mongoose.model('Subscription', new SubscriptionSchema());