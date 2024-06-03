const express = require('express');

const authService = require('../services/authService');

const {
  addEventTofavorite,
  removeEventFromfavorite,
  getLoggedUserfavorite,
} = require('../services/favoriteService');

const router = express.Router();

router.use(authService.protect, authService.allowedTo('user'));

router.post('/',addEventTofavorite)
router.get('/',getLoggedUserfavorite)
router.delete('/', removeEventFromfavorite);

module.exports = router;
