const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, 'Too short event title'],
      //maxlength: [100, 'Too long event title'],
    },
    slug: {
      type: String,
      //required: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'event description is required'],
     // minlength: [20, 'Too short event description'],
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
    //  max: [200000, 'Too long event seatnumber']
    },
    placesLeft: {
      type: Number,
     // required: true,
      trim: true,
     // max: [200000, 'Too long event quantity'],
    },
    seatNumbers: {
      type: [Number],
      default: [], 
      select:false,
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
    rate:Number,
    subcategorie:
      {
        type: mongoose.Schema.ObjectId,
        ref: 'SubCategory',
      },
      from:Date,
      to:Date,
      location:String
  },
  { timestamps: true }
);

eventSchema.pre('save', function(next) {
  if (this.isNew && this.placesLeft === undefined) {
    this.placesLeft = this.seatnumber;
  }
  next();
});

module.exports = mongoose.model('event', eventSchema);
