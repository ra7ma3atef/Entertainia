const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require('express-async-handler');
const factory = require('./handlersFactory');
const ApiError = require('../utils/apiError');

const User = require('../models/userModel');
const Event = require('../models/eventModel');
const Cart = require('../models/cartModel');
const Booking = require('../models/bookingModel');

//   Get all bookings
//   POST /api/v1/bookings
//   Protected/User-Admin-Manager
exports.findAllBookings = factory.getAll(Booking);

//   Get checkout session from stripe and send it as response
//   GET /api/v1/bookings/checkout-session/cartId
//   Protected/User
exports.checkoutSession = asyncHandler(async (req, res, next) => {
  // app settings


  // 1) Get cart depend on cartId
  const cart = await Cart.findById(req.params.cartId);
  if (!cart) {
    return next(
      new ApiError(`There is no such cart with id ${req.params.cartId}`, 404)
    );
  }

  // 2) Get booking price depend on cart price "Check if coupon apply"
  const cartPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalCartPrice;

  const totalBookingPrice = cartPrice ;

  // 3) Create stripe checkout session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      { 
        price_data: {
          currency: 'egp',
          unit_amount: totalBookingPrice * 100,
          product_data: {
            name: 'events' ,
          },
        },
        quantity: 1,
      }],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/bookings`,
    cancel_url: `${req.protocol}://${req.get('host')}/cart`,
    customer_email: req.user.email,
    client_reference_id: req.params.cartId,
    metadata: req.body.shippingAddress,
  });

  // 4) send session to response
  res.status(200).json({ status: 'success', session });
});

const createCardBooking = async (session) => {
  const cartId = session.client_reference_id;
  const shippingAddress = session.metadata;
  const oderPrice = session.amount_total / 100;

  const cart = await Cart.findById(cartId);
  const user = await User.findOne({ email: session.customer_email });

  // 3) Create booking with default paymentMethodType card
  const booking = await Booking.create({
    user: user._id,
    cartItems: cart.cartItems,
    shippingAddress,
    totalBookingPrice: oderPrice,
    isPaid: true,
    paidAt: Date.now(),
    paymentMethodType: 'card',
  });

  // 4) After creating booking, decrement event quantity, increment event sold
  if (booking) {
    const bulkOption = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.event },
        update: { $inc: { quantity: -item.quantity, sold: +item.quantity } },
      },
    }));
    await Event.bulkWrite(bulkOption, {});

    // 5) Clear cart depend on cartId
    await Cart.findByIdAndDelete(cartId);
  }
};

//   This webhook will run when stripe payment success paid
//   POST /webhook-checkout
//   Protected/User
exports.webhookCheckout = asyncHandler(async (req, res, next) => {
  const sig = req.headers['stripe-signature'];

  let eventtt;

  try {
    eventtt = stripe.webhooks.constructEventtt(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  if (eventtt.type === 'checkout.session.completed') {
    //  Create booking
    createCardBooking(eventtt.data.object);
  }

  res.status(200).json({ received: true });
});
