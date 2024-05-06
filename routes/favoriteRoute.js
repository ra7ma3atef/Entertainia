const express = require('express');

const authService = require('../services/authService');

const {
  addEventTofavorite,
  removeEventFromfavorite,
  getLoggedUserfavorite,
} = require('../services/favoriteService');

const router = express.Router();

router.use(authService.protect, authService.allowedTo('user'));

router.route('/').post(addEventTofavorite).get(getLoggedUserfavorite);

router.delete('/:eventId', removeEventFromfavorite);

module.exports = router;
