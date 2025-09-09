// routes/adminRoutes.js
const express = require('express');
const router = express.Router();

// Import admin sub-routes

//-------CREATE ROUTES FOR ADMIN FUNCTIONALITY-------// 

const newMockRating=require('./create/mockRating')

//-------GET ROUTES FOR EMPLOYEE FUNCTIONALITY-------//
const getEmpoyeeNotiication = require('./get/getNoficationByID');
const getEmployeeById = require('./get/employeeByID');
const getKPIRequests = require('./get/getKPI');
const getKPIDetails = require('./get/getKPIDetails');


//------UPDATE ROUTES FOR EMPLOYEE FUNCTIONALITY-------//
const updateEmployeeNotification = require('./update/updatenotification');
const updateKpireivew= require('./update/updateKPIRating');

//-------DELETE ROUTES FOR EMPLOYEE FUNCTIONALITY-------// THIS SECTION IS NOT USED TILL NOW


// Use them
router.use(newMockRating);
router.use(getEmpoyeeNotiication);
router.use(updateEmployeeNotification);
router.use(getEmployeeById);
router.use(getKPIRequests);
router.use(updateKpireivew);
router.use(getKPIDetails);

module.exports = router;
