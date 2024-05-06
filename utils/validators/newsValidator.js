const slugify = require('slugify');
const { check, body } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validatorMiddleware');

exports.getNewsValidator = [
  check('id').isMongoId().withMessage('Invalid News id format'),
  validatorMiddleware,
];

exports.createNewsValidator = [
  check('name')
    .notEmpty()
    .withMessage('News required')
    .isLength({ min: 3 })
    .withMessage('Too short News name')
    .isLength({ max: 32 })
    .withMessage('Too long News name')
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.updateNewsValidator = [
  check('id').isMongoId().withMessage('Invalid News id format'),
  body('name')
    .optional()
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  validatorMiddleware,
];

exports.deleteNewsValidator = [
  check('id').isMongoId().withMessage('Invalid News id format'),
  validatorMiddleware,
];
