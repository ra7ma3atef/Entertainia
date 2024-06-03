const express = require('express');
const {
  getNewsValidator,
  createNewsValidator,
  updateNewsValidator,
  deleteNewsValidator,
} = require('../utils/validators/newsValidator');

const authService = require('../services/authService');

const {
  getNewss,
  getNews,
  createNews,
  updateNews,
  deleteNews,
  uploadNewsImage,
  resizeImage,
} = require('../services/newsService');

const router = express.Router();

router
  .route('/')
  .get(getNewss)
  .post(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    uploadNewsImage,
    resizeImage,//createNewsValidator
    createNews
  );
router
  .route('/:id')
  .get(getNews)//getNewsValidator
  .put(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    uploadNewsImage,
    resizeImage,//updateNewsValidator
    updateNews
  )
  .delete(
    authService.protect,
    authService.allowedTo('admin'),//deleteNewsValidator
    deleteNews
  );

module.exports = router;
