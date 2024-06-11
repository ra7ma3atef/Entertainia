const mongoose = require('mongoose');
const Event = require('./eventModel');

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    rating: {
      type: Number,
      required: [true, 'review ratings required'],
    },
    event: {
      type: mongoose.Schema.ObjectId,
      ref: 'event',
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

reviewSchema.statics.calcAverageRatingsAndQuantity = async function (event) {
  const result = await this.aggregate([
    // Stage 1: Get all reviews for a specific driver
    {
      $match: { event:event },
    },
    // Stage 2: Group reviews based on driverId and calculate average rating
    {
      $group: {
        _id: '$event', // Group by driverId
        avgRatings: { $avg: '$rating' }, // Calculate average rating
      },
    },
  ]);
  // console.log(Math.round(result[0].avgRatings));

  if (result.length > 0) {
    await Event.findByIdAndUpdate(event, {
      rate: Math.round(result[0].avgRatings),
    });
  } else {
    await Event.findByIdAndUpdate(event, {
      rate: 0,
    });
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.event);
});

reviewSchema.post('remove', async function () {
  await this.constructor.calcAverageRatingsAndQuantity(this.event);
});
reviewSchema.post('save', async function(doc, next) {
  try {
   // console.log("object");
    const m = await mongoose.model('User').findByIdAndUpdate(
      doc.user,
      { $inc: { Review: 1 } },
      { new: true, useFindAndModify: false }
    );
    //console.log(m);
    next();
  } catch (error) {
   // console.log(error);
    next(error);
  }
});

module.exports = mongoose.model('Review', reviewSchema);