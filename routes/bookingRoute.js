const express = require('express');
const {
  findAllBookings,
  checkoutSession,
} = require('../services/bookingService');

const authService = require('../services/authService');

const router = express.Router();

router.use(authService.protect);

router.get(
  '/checkout-session/:cartId',
  authService.allowedTo('user'),
  checkoutSession
);

router.get(
  '/',
  authService.allowedTo('user', 'admin', 'manager'),
  findAllBookings
);

module.exports = router;
