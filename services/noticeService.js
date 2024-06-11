const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');
const Model = require("../models/noticeService")

exports.deleteOne = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);

    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    res.status(204).json({msg:"deleted successful"});
  });


exports.getOne = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findById(id);
    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });

  exports.getAll = asyncHandler(async (req, res) => {
    let filter = {
      $and: [
        {
          $or: [
            { user: req.user.id },
            { forAllUsers: true }
          ]
        },
        {
          createdAt: { $gte: req.user.createdAt } // Filter notices created after the user account creation
        }
      ]
    };
  
    const documents = await Model.find(filter).sort({ createdAt: -1 });
  
    res
      .status(200)
      .json({ results: documents.length, data: documents });
  });
  