const mongoose = require('mongoose');
//const User = require('./userModel');

const notificationSchema = new mongoose.Schema(
  {
    notification: {
      type: String,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    allUser:{
        type:Boolean,
        default:false,
        select:false,
    },
    image:String
  },
  { timestamps: true }
);



module.exports = mongoose.model('Notification', notificationSchema);