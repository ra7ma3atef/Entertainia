const mongoose = require('mongoose');

const reqSchema = new mongoose.Schema(
  {
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'user',
    },
    eventId: {
        type: mongoose.Schema.ObjectId,
        ref: 'event',
    },
    type: {
      type: String,
      enum:["Premium,Regular"]
    }, 
    price: {
      type: Number,
      required: [true, 'event price is required'],
      trim: true,
      max: [200000, 'Too long event price'],
    }, 
    seatnumber: {
      type: Number,
      required: [true, 'event seatnumber is required'],
      trim: true,
      max: [200000, 'Too long event seatnumber']},

    imageCover: {
      type: String,
      //required: [true, 'event Image cover is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('request', reqSchema);
