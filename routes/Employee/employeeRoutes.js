// routes/adminRoutes.js
const express = require('express');
const router = express.Router();

// Import admin sub-routes

//-------CREATE ROUTES FOR ADMIN FUNCTIONALITY-------// THIS SECTION IS NOT USED TILL NOW

//-------GET ROUTES FOR EMPLOYEE FUNCTIONALITY-------//
const getEmpoyeeNotiication = require('./get/getNoficationByID');

//------UPDATE ROUTES FOR EMPLOYEE FUNCTIONALITY-------//
const updateEmployeeNotification = require('./update/updatenotification');

//-------DELETE ROUTES FOR ADMIN FUNCTIONALITY-------// THIS SECTION IS NOT USED TILL NOW







// Use them
router.use(getEmpoyeeNotiication);
router.use(updateEmployeeNotification);

module.exports = router;
