const mongoose = require('mongoose');
// 1- Create Schema
const newsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'News required'],
      unique: [true, 'News must be unique'],
      minlength: [3, 'Too short News name'],
      maxlength: [32, 'Too long News name'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    newsImage: String,
    date:Date,
    description:String
  },
  { timestamps: true }
);


// 2- Create model
module.exports = mongoose.model('News', newsSchema);