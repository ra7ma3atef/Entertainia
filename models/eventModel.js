const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, 'Too short event title'],
      maxlength: [100, 'Too long event title'],
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'event description is required'],
      minlength: [20, 'Too short event description'],
    },
    numberofticket: {
      type: Number,
      required: [true, 'event quantity is required'],
    },
   /* sold: {
      type: Number,
      default: 0,
    },*/
    price: {
      type: Number,
      required: [true, 'event price is required'],
      trim: true,
      max: [200000, 'Too long event price'],
    },
    priceAfterDiscount: {
      type: Number,
    },
    
    seatnumber: {
      type: Number,
      //required: [true, 'event seatnumber is required'],
      trim: true,
      max: [200000, 'Too long event seatnumber']},

    imageCover: {
      type: String,
      required: [true, 'event Image cover is required'],
    },
    images: [String],
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  if (doc.imageCover) {
    const imageUrl = `${process.env.BASE_URL}/event/${doc.imageCover}`;
    doc.imageCover = imageUrl;
  }
  if (doc.images) {
    const imagesList = [];
    doc.images.forEach((image) => {
      const imageUrl = `${process.env.BASE_URL}/event/${image}`;
      imagesList.push(imageUrl);
    });
    doc.images = imagesList;
  }
};
// findOne, findAll and update
eventSchema.post('init', (doc) => {
  setImageURL(doc);
});

// create
eventSchema.post('save', (doc) => {
  setImageURL(doc);
});

module.exports = mongoose.model('event', eventSchema);
