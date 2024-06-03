const express = require('express')
const router = express.Router();

const authController = require('../services/authService.js')
const reqController = require("../services/requsetService.js")

router.use(authController.protect)

router.post("/",reqController.createOne)
router.get("/",reqController.getAll)


module.exports = router