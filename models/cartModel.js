const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        event: {
          type: mongoose.Schema.ObjectId,
          ref: 'Event',
        },
        quantity: {
          type: Number,
          default: 1,
        },
        ticket: Number,
        price: Number,
      },
    ],
    totalCartPrice: Number,
    totalPriceAfterDiscount: Number,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cart', cartSchema);
