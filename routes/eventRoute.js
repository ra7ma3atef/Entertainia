const express = require('express');
const {
  getEventValidator,
  createEventValidator,
  updateEventValidator,
  deleteEventValidator,
} = require('../utils/validators/eventValidator');

const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  uploadEventImages,
} = require('../services/eventService');
const { resizeEventImages } = require('../services/resizeEventImages');
const authService = require('../services/authService');

const router = express.Router();

router
  .route('/')
  .get(getEvents)
  .post(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    uploadEventImages,
    resizeEventImages,
    createEventValidator,
    createEvent
  );
router
  .route('/:id')
  .get(getEventValidator, getEvent)
  .put(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    uploadEventImages,
    resizeEventImages,
    updateEventValidator,
    updateEvent
  )
  .delete(
    authService.protect,
    authService.allowedTo('admin'),
    deleteEventValidator,
    deleteEvent
  );

module.exports = router;
