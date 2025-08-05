// routes/mainRoutes.js
const express = require('express');
const router = express.Router();

const adminRoutes = require('./admin/adminRoutes');
const loginRoute=require('./loginauth')
const otherRoutes = require('./others/otherRoutes'); // For OTP and password reset
const employeeRoutes = require('./Employee/employeeRoutes'); // Future use

router.use('/admin', adminRoutes);
router.use('/verify', otherRoutes); // For OTP and password reset
router.use('/employee', employeeRoutes); // if needed later

router.use('/auth',loginRoute)
module.exports = router;
