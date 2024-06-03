const factory = require('./handlersFactory');
const SubCategory = require('../models/subCategoryModel');
const asyncHandler = require('express-async-handler');
const cloudinary = require("../utils/cloudImage")
const multer = require("multer")

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

exports.uploadSubImage = upload.single('image')

exports.resizeImage = asyncHandler(async (req, res, next) => {

    if (!req.file) return next()

    const fileName = `${req.file.originalname}`

    const filePath = `EnterTainia/SubCategory`

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



exports.setCategoryIdToBody = (req, res, next) => {
  // Nested route (Create)
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// Nested route
// GET /api/v1/categories/:categoryId/subcategories
exports.createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObj = filterObject;
  next();
};

//  Get list of subcategories
//  GET /api/v1/subcategories
//  Public
exports.getSubCategories = factory.getAll(SubCategory);

//  Get specific subcategory by id
//  GET /api/v1/subcategories/:id
//  Public
exports.getSubCategory = factory.getOne(SubCategory);

//   Create subCategory
//   POST  /api/v1/subcategories
//   Private
exports.createSubCategory = factory.createOne(SubCategory);

//   Update specific subcategory
//   PUT /api/v1/subcategories/:id
//   Private
exports.updateSubCategory = factory.updateOne(SubCategory);

//    Delete specific subCategory
//    DELETE /api/v1/subcategories/:id
//    Private
exports.deleteSubCategory = factory.deleteOne(SubCategory);
