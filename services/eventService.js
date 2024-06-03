const factory = require('./handlersFactory');
const Event = require('../models/eventModel');
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

exports.uploadEventImage = upload.single('imageCover')

exports.resizeEventImage = asyncHandler(async (req, res, next) => {

    if (!req.file) return next()

    const fileName = `${req.file.originalname}`

    const filePath = `EnterTainia/category`

    const result = await uploadToClodinary(req.file.buffer, fileName, filePath)
    req.body.imageCover = result.secure_url

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

//    Get list of events
//    GET /api/v1/events
//    Public
exports.getEvents = factory.getAll(Event, 'Events');

//    Get specific event by id
//    GET /api/v1/events/:id
//    Public
exports.getEvent = factory.getOne(Event);

//    Create event
//    POST  /api/v1/events
//    Private
exports.createEvent = factory.createOne(Event);
//    Update specific event
//    PUT /api/v1/events/:id
//    Private
exports.updateEvent = factory.updateOne(Event);

//     Delete specific eventt
//     DELETE /api/v1/eventss/:id
//     Private
exports.deleteEvent = factory.deleteOne(Event);
