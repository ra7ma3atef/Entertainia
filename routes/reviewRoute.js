const express = require('express')
const router = express.Router();

const authController = require('../services/authService.js')
const reviewController = require("../services/reviewService.js")

router.use(authController.protect)

//admin
router.post("/",reviewController.createOne)
router.get("/getMyReviews",reviewController.getMyReviews)
router.get("/getAllReviews",reviewController.getAll)
router.delete("/:id",reviewController.deleteReview)

// router.patch("/updateone/:id",reviewController.updateOne)
// router.delete("/deleteone/:id",reviewController.deleteOne)


module.exports = router