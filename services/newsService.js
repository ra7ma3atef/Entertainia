const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');

const factory = require('./handlersFactory');
const { uploadSingleImage } = require('../middlewares/uploadImageMiddleware');
const News = require('../models/newsModel');

// Upload single image
exports.uploadNewsImage = uploadSingleImage('image');

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `news-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat('jpeg')
    .jpeg({ quality: 95 })
    .toFile(`uploads/newss/${filename}`);

  // Save image into our db 
   req.body.image = filename;

  next();
});

//  Get list of news
//  GET /api/v1/news
//  Public
exports.getNewss = factory.getAll(News);

//   Get specific news by id
//   GET /api/v1/news/:id
//   Public
exports.getNews = factory.getOne(News);

//    Create news
//    POST  /api/v1/news
//    Private
exports.createNews = factory.createOne(News);

//   Update specific news
//   PUT /api/v1/news/:id
//   Private
exports.updateNews = factory.updateOne(News);

//   Delete specific news
//   DELETE /api/v1/news/:id
//   Private
exports.deleteNews = factory.deleteOne(News);
