const slugify = require('slugify');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.createEventValidator = [
  check('title')
    .isLength({ min: 3 })
    .withMessage('must be at least 3 chars')
    .notEmpty()
    .withMessage('Event required')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check('description')
    .notEmpty()
    .withMessage('Event description is required')
    .isLength({ max: 2000 })
    .withMessage('Too long description'),
  check('quantity')
    .notEmpty()
    .withMessage('Event quantity is required')
    .isNumeric()
    .withMessage('Event quantity must be a number'),
  check('sold')
    .optional()
    .isNumeric()
    .withMessage('Event quantity must be a number'),
  check('price')
    .notEmpty()
    .withMessage('Event price is required')
    .isNumeric()
    .withMessage('Event price must be a number')
    .isLength({ max: 32 })
    .withMessage('To long price'),
  check('priceAfterDiscount')
    .optional()
    .isNumeric()
    .withMessage('Event priceAfterDiscount must be a number')
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error('priceAfterDiscount must be lower than price');
      }
      return true;
    }),

  check('imageCover').notEmpty().withMessage('Event imageCover is required'),
  check('images')
    .optional()
    .isArray()
    .withMessage('images should be array of string'),

  validatorMiddleware,
];

exports.getEventValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleware,
];

exports.updateEventValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  body('title')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteEventValidator = [
  check('id').isMongoId().withMessage('Invalid ID formate'),
  validatorMiddleware,
];
