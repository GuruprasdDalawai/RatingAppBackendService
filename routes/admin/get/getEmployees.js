const express = require('express');
const router = express.Router();
const db = require('../../../db/dbConnection');
const verifyToken = require('../../../services/middlewares/auth')

router.get('/employees',(req, res) => {
  db.query(`SELECT 
  Employee_Id,
  Employee_Name,
  Employee_Designation,
  Employee_Email,
  Employee_Department,
  Employee_Password,
  Employee_Icon,
  Employee_Mock_Taken,
  Employee_Mock_Given,
  Employee_Status,
  dateOfBirth,
  mobil,
  employeeNo,
  mentor,
  position,
  mentorId
FROM employee_table`, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

module.exports = router;
