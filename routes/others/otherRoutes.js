const express = require('express');
const router = express.Router();

const sendOTP = require('./sendOTP');
const verifyOTP = require('./verifyOTP');
const resetPassword = require('./resetPassword');

router.use(sendOTP);
router.use(verifyOTP);
router.use(resetPassword);

module.exports = router;