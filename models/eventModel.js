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
    // numberofticket: {
    //   type: Number,
    //   required: [true, 'event quantity is required'],
    // },
    // sold: {
    //   type: Number,
    //   default: 0,
    // },
    pricePre: {
      type: Number,
      required: [true, 'event premium price is required'],
      trim: true,
      max: [200000, 'Too long event price'],
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
      max: [200000, 'Too long event seatnumber']
    },
    seatNumbers: {
      type: [Number],
      default: [], 
      validate: {
        validator: function(arr) {
          return arr.every(num => num >= 1 && num <= this.seatnumber);
        },
        message: props => `All seat numbers must be between 1 and ${props.value}.`,
      },
    },
    imageCover: {
      type: String,
      //required: [true, 'event Image cover is required'],
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: 'Category',
    },
    subcategorie:
      {
        type: mongoose.Schema.ObjectId,
        ref: 'SubCategory',
      },
      from:Date,
      to:Date
  },
  { timestamps: true }
);



module.exports = mongoose.model('event', eventSchema);
