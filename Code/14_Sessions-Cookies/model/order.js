const {Schema, model} = require('mongoose');

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
        name: {
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

module.exports = model('Order', orderSchema);