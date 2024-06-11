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
      enum:["Premium","Regular"],
      required:true
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
      max: [200000, 'Too long event seatnumber'],
      required:true,
    },
    imageCover: {
      type: String,
      //required: [true, 'event Image cover is required'],
    },
    date:Date
  },
  { timestamps: true }
);


reqSchema.post('save', async function(doc, next) {
  try {
   // console.log("object");
    const m = await mongoose.model('User').findByIdAndUpdate(
      doc.userId,
      { $inc: { Booking: 1 } },
      { new: true, useFindAndModify: false }
    );
    //console.log(m);
    next();
  } catch (error) {
   // console.log(error);
    next(error);
  }
});

module.exports = mongoose.model('request', reqSchema);
