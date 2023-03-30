import {Schema, model} from 'mongoose';

const orderSchema = new Schema({
    items: [{
        product: {
            type: Object,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        }
    } ],
    user: {
        email: {
            type: String,
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }
    },
    totalPrice: {
        type: Number,
        required: true,
    }
});

export default model('Order', orderSchema);