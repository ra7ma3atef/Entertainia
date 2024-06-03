const asyncHandler = require('express-async-handler');
const cloudinary = require("../utils/cloudImage")
const multer = require("multer")
const factory = require('./handlersFactory');
const Category = require('../models/categoryModel');


const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true)
    } else {
        cb(new ApiError('not an image ! please upload only images..', 400), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

exports.uploadCategoryImage = upload.single('image')

exports.resizeImage = asyncHandler(async (req, res, next) => {

    if (!req.file) return next()

    const fileName = `${req.file.originalname}`

    const filePath = `EnterTainia/category`

    const result = await uploadToClodinary(req.file.buffer, fileName, filePath)
    req.body.image = result.secure_url

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



//   Get list of categories
//   GET /api/v1/categories
//   Public
exports.getCategories = factory.getAll(Category);

//   Get specific category by id
//   GET /api/v1/categories/:id
//   Public
exports.getCategory = factory.getOne(Category);

//   Create category
//   POST  /api/v1/categories
//   Private/Admin-Manager
exports.createCategory = factory.createOne(Category);

//   Update specific category
//   PUT /api/v1/categories/:id
//   Private/Admin-Manager
exports.updateCategory = factory.updateOne(Category);

//    Delete specific category
//    DELETE /api/v1/categories/:id
//    Private/Admin
exports.deleteCategory = factory.deleteOne(Category);
