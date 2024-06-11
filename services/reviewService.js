const catchAsync = require('express-async-handler');
const appError = require("../utils/apiError")
const factory = require('./handlersFactory');
const Event = require("../models/eventModel");
const Review = require("../models/reviewModel")

exports.createOne = catchAsync(async (req, res, next) => {

    req.body.user = req.user.id
    
    const event = await Event.findOne({ _id: req.query.eventId });

    if (!event) {
        return next(new appError(`Can't find Event with this ID`, 404));
    }

    req.body.event = req.query.eventId

    const doc = await Review.create(req.body)

    res.status(201).json({
        status: 'success',
        data: doc
    })

})

exports.getAll = catchAsync(async (req, res) => {

    const documents = await Review.find({ event: req.query.eventId });

    res
        .status(200)
        .json({ results: documents.length, data: documents });
});

exports.getMyReviews = catchAsync(async (req, res) => {

    const documents = await Review.find({ user: req.user.id });

    res
        .status(200)
        .json({ results: documents.length, data: documents });
});

exports.deleteReview = factory.deleteOne(Review);
