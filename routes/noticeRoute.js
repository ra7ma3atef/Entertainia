const express = require('express')
const router = express.Router();

const authController = require('../services/authService.js')
const noticeController = require("../services/noticeService.js")

router.use(authController.protect)

router.get("/",noticeController.getAll)


module.exports = router