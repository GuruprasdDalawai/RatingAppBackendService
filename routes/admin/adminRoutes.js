// routesRoutes.js
const express = require('express');
const router = express.Router();

// Import admin sub-routes


//-------CREATE ROUTES FOR ADMIN FUNCTIONALITY-------//
const addnewEmployee=require('./create/addnewEmployee');
const saveHierarchy= require('./create/saveHierarchy')
const requestMock=require('./create/requestMock');
const KPIrequest=require('./create/KPIrequest') 

//------GET ROUTES FOR ADMIN FUNCTIONALITY-------//
const getEmployees = require('./get/getEmployees');
const getEmployeeById = require('./get/getEmployeeById');
const getEmployeesByDept=require('./get/getEmpoyeesBydepartment')
const getNotification = require('./get/getNotification');
const getPreviousEmployees=require('./get/getPreviousEmployees')

//------UPDATE ROUTES FOR EMPLOYEE FUNCTIONALITY-------//
const updateEmployee = require('./update/updateEmployee');
const updateProfileImage=require('./update/updateProfileImage')

//-------DELETE ROUTES FOR ADMIN FUNCTIONALITY-------//
const deleteEmployee = require('./delete/deleteEmployee');
const detletNoticfication=require('./delete/deleteNotifications')
const deletePrevsEmp=require('./delete/deletePrevsEmp')
const resetBackEmp=require('./delete/resetBackEmp')




// Use them
router.use(KPIrequest);
router.use(getEmployees);
router.use(getEmployeeById);
router.use(addnewEmployee);
router.use(updateEmployee);
router.use(deleteEmployee);
router.use(saveHierarchy)
router.use(getEmployeesByDept)
router.use(requestMock);
router.use(getNotification);
router.use(detletNoticfication);
router.use(getPreviousEmployees);
router.use(updateProfileImage);
router.use(deletePrevsEmp);
router.use(resetBackEmp);   

module.exports = router;
