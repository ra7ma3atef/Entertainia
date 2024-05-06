const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/apiError');

const Event = require('../models/eventModel');
const Coupon = require('../models/couponModel');
const Cart = require('../models/cartModel');

const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  return totalPrice;
};

//    Add event to  cart
//    POST /api/v1/cart
//    Private/User
exports.addEventToCart = asyncHandler(async (req, res, next) => {
  const { eventId, ticket } = req.body;
  const event = await Event.findById(eventId);

  // 1) Get Cart for logged user
  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    // create cart fot logged user with event
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{ event: eventId, ticket, price: event.price }],
    });
  } else {
    // event exist in cart, update product quantity
    const eventIndex = cart.cartItems.findIndex(
      (item) => item.event === eventId && item.ticket === ticket
    );

    if (eventIndex > -1) {
      const cartItem = cart.cartItems[eventIndex];
      cartItem.quantity += 1;

      cart.cartItems[eventIndex] = cartItem;
    } else {
      // event not exist in cart,  push event to cartItems array
      cart.cartItems.push({ event: eventId, ticket, price: event.price });
    }
  }

  // Calculate total cart price

  calcTotalCartPrice(cart);
  await cart.save();

  res.status(200).json({
    status: 'success',
    message: 'Event added to cart successfully',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});


//    Get logged user cart
//    GET /api/v1/cart
//    Private/User
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(
      new ApiError(`There is no cart for this user id : ${req.user._id}`, 404)
    );
  }

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

//   Remove specific cart item
//   DELETE /api/v1/cart/:itemId
//   Private/User
exports.removeSpecificCartItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true }
  );

  calcTotalCartPrice(cart);
  cart.save();

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

//   clear logged user cart
//   DELETE /api/v1/cart
//   Private/User
exports.clearCart = asyncHandler(async (req, res, next) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.status(204).send();
});

//   Update specific cart item quantity
//   PUT /api/v1/cart/:itemId
//   Private/User
exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    return next(new ApiError(`there is no cart for user ${req.user._id}`, 404));
  }

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );
  if (itemIndex > -1) {
    const cartItem = cart.cartItems[itemIndex];
    cartItem.quantity = quantity;
    cart.cartItems[itemIndex] = cartItem;
  } else {
    return next(
      new ApiError(`there is no item for this id :${req.params.itemId}`, 404)
    );
  }

  calcTotalCartPrice(cart);

  await cart.save();

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });
});

//    Apply coupon on logged user cart
//    PUT /api/v1/cart/applyCoupon
//    Private/User
exports.applyCoupon = asyncHandler(async (req, res, next) => {
  // 1) Get coupon based on coupon name
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expire: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(new ApiError(`Coupon is invalid or expired`));
  }

  // 2) Get logged user cart to get total cart price
  const cart = await Cart.findOne({ user: req.user._id });

  const totalPrice = cart.totalCartPrice;

  // 3) Calculate price after priceAfterDiscount
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice ) / 100
  ).toFixed(2); // 99.23

  cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
  await cart.save();

  res.status(200).json({
    status: 'success',
    numOfCartItems: cart.cartItems.length,
    data: cart,
  });

});