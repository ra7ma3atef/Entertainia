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
    image: String,
  },
  { timestamps: true }
);

const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/newss/${doc.image}`;
    doc.image = imageUrl;
  }
};
// findOne, findAll and update
newsSchema.post('init', (doc) => {
  setImageURL(doc);
});

// create
newsSchema.post('save', (doc) => {
  setImageURL(doc);
});
// 2- Create model
module.exports = mongoose.model('News', newsSchema);
