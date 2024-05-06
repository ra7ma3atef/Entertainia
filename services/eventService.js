const { uploadMixOfImages } = require('../middlewares/uploadImageMiddleware');
const factory = require('./handlersFactory');
const Event = require('../models/eventModel');

exports.uploadEventImages = uploadMixOfImages([
  {
    name: 'imageCover',
    maxCount: 1,
  },
  {
    name: 'images',
    maxCount: 5,
  },
]);

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
