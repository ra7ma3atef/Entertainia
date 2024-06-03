const asyncHandler = require('express-async-handler');
const factory = require('./handlersFactory');
const News = require('../models/newsModel');
const appError = require("../utils/apiError")
const multer = require("multer")
const cloudinary = require("../utils/cloudImage")


const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true)
    } else {
        cb(new appError('not an image ! please upload only images..', 400), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

exports.uploadNewsImage = upload.single('newsImage')

exports.resizeImage = asyncHandler(async (req, res, next) => {

    if (!req.file) return next()

    const fileName = `${req.file.originalname}`

    const filePath = `EnterTainia/news`

    const result = await uploadToClodinary(req.file.buffer, fileName, filePath)
    req.body.newsImage = result.secure_url

    next()
})


const uploadToClodinary = (buffer, filename, folderPath, options = {}) => {
    return new Promise((resolve, reject) => {
        options.folder = folderPath;
        options.public_id = filename;

        const uploadStream = cloudinary.uploader.upload_stream(
            options,
            (error, result) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(result)
                }
            }
        )
        uploadStream.end(buffer)
    })
}

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
