const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const ApiFeatures = require('../utils/apiFeatures');
const Model = require("../models/requestModel")
const Event = require("../models/eventModel")
const Not = require("../models/noticeService")

exports.deleteOne = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    res.status(204).send();
  });

exports.updateOne = asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!document) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ data: document });
  });

exports.createOne = asyncHandler(async (req, res,next) => {
  req.body.userId = req.user.id;
  req.body.eventId = req.query.eventId;
  let seatnumber = req.body.seatnumber;

  if (seatnumber) {
      const event = await Event.findById(req.query.eventId);

      if (!event) {
          return next(new ApiError(`Event not found`, 404));
      }

      if (event.seatNumbers.includes(seatnumber)) {
          return next(new ApiError(`This seat number is booked up`, 400));
      }

      if (seatnumber < 1 || seatnumber > event.seatnumber) {
          return next(new ApiError(`Seat number must be between 1 and ${event.seatnumber}`, 400));
      }

      if (req.body.type === "Regular") {
          req.body.price = event.price;
      } else if (req.body.type === "Premium") {
          req.body.price = event.pricePre;
      } else {
          return next(new ApiError(`Invalid ticket type`, 400));
      }

      req.body.imageCover = event.imageCover;
      event.seatNumbers.push(seatnumber);
      // console.log("ahmed");
       await event.save();

  } else {
      return next(new ApiError(`Seat number is required`, 400));
  }

  // Assuming you are creating a booking or a similar document
  
    const newDoc = await Model.create(req.body);

     await Not.create({
        notification:`Your ticket booking was successful!`,
        user: req.user.id,
        image:req.user.profileImg,
        allUser:false
    })
    res.status(201).json({ data: newDoc });
  });

exports.getOne = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findById(id);
    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });

exports.getAll =  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    // Build query
    const documentsCounts = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(documentsCounts)
      .filter()
      .limitFields()
      .sort();

    // Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;

    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  });
