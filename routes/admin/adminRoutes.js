// routesRoutes.js
const express = require('express');
const router = express.Router();

// Import admin sub-routes


//-------CREATE ROUTES FOR ADMIN FUNCTIONALITY-------//
const addnewEmployee=require('./create/addnewEmployee');
const saveHierarchy= require('./create/saveHierarchy')
const requestMock=require('./create/requestMock');

//------GET ROUTES FOR ADMIN FUNCTIONALITY-------//
const getEmployees = require('./get/getEmployees');
const getEmployeeById = require('./get/getEmployeeById');
const getEmployeesByDept=require('./get/getEmpoyeesBydepartment')
const getNotification = require('./get/getNotification');

//------UPDATE ROUTES FOR EMPLOYEE FUNCTIONALITY-------//
const updateEmployee = require('./update/updateEmployee');

//-------DELETE ROUTES FOR ADMIN FUNCTIONALITY-------//
const deleteEmployee = require('./delete/deleteEmployee');




// Use them
router.use(getEmployees);
router.use(getEmployeeById);
router.use(addnewEmployee);
router.use(updateEmployee);
router.use(deleteEmployee);
router.use(saveHierarchy)
router.use(getEmployeesByDept)
router.use(requestMock);
router.use(getNotification);


module.exports = router;
