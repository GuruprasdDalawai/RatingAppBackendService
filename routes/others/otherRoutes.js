const express = require('express');
const router = express.Router();

const sendOTP = require('./sendOTP');
const verifyOTP = require('./verifyOTP');
const resetPassword = require('./resetPassword');
const getRatings= require('./getRating');
const getKPIPoints= require('./getKPIPoints');

router.use(sendOTP);
router.use(verifyOTP);
router.use(resetPassword);
router.use(getRatings);
router.use(getKPIPoints);

module.exports = router;