const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Booking must be belong to user'],
    },
    cartItems: [
      {
        event: {
          type: mongoose.Schema.ObjectId,
          ref: 'Event',
        },
        quantity: Number,
        price: Number,
      },
    ],

    totalBookingPrice: {
      type: Number,
    },
    paymentMethodType: {
      type: String,
      enum: ['card'],
      default: 'cash',
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
  },
  { timestamps: true }
);

bookingSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name profileImg email phone',
  }).populate({
    path: 'cartItems.event',
    select: 'title imageCover ',
  });

  next();
});

module.exports = mongoose.model('Booking', bookingSchema);

