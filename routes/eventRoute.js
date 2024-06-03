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
  uploadEventImage,
  resizeEventImage,
} = require('../services/eventService');

const authService = require('../services/authService');

const router = express.Router();

router
  .route('/')
  .get(getEvents)
  .post(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    uploadEventImage,
    resizeEventImage,
    createEventValidator,
    createEvent
  );
router
  .route('/:id')
  .get(getEventValidator, getEvent)
  .put(
    authService.protect,
    authService.allowedTo('admin', 'manager'),
    uploadEventImage,
    resizeEventImage,
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
