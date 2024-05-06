const asyncHandler = require('express-async-handler');

const User = require('../models/userModel');

//   Add product to favorite
//   POST /api/v1/favorite
//  Protected/User
exports.addEventTofavorite = asyncHandler(async (req, res, next) => {
  // $addToSet => add eventId to favorite array if eventId not exist
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { favorite: req.body.eventId },
    },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    message: 'Event added successfully to your favorite.',
    data: user.favorite,
  });
});

//    Remove product from favorite
//   DELETE /api/v1/favorite/:eventId
//   Protected/User
exports.removeEventFromfavorite = asyncHandler(async (req, res, next) => {
  // $pull => remove eventId from favorite array if eventId exist
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { favorite: req.params.eventId },
    },
    { new: true }
  );

  res.status(200).json({
    status: 'success',
    message: 'Event removed successfully from your favorite.',
    data: user.favorite,
  });
});

//     Get logged user favorite
//   GET /api/v1/favorite
//   Protected/User
exports.getLoggedUserfavorite = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('favorite');

  res.status(200).json({
    status: 'success',
    results: user.favorite.length,
    data: user.favorite,
  });
});
