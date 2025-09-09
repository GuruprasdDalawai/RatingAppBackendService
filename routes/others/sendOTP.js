const express = require('express');
const router = express.Router();
const connection = require('../../db/dbConnection');
const verifyToken = require('../../services/middlewares/auth');
const sendEmailOTP = require('../../services/email/sendEmailOTP');


// POST /api/send-otp


router.post('/send-otp', (req, res) => {
    
  const { employeeId } = req.body;
  connection.query("SELECT * FROM employee_table WHERE Employee_Id = ?", [employeeId], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Server error." });
    }
    if (rows.length === 0) {
      return res.status(404).json({ message: "Employee ID not found. Please contact HR." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    connection.query("UPDATE employee_table SET OTP = ? WHERE Employee_Id = ?", [otp, employeeId], (err2) => {
      if (err2) {
        console.error(err2);
        return res.status(500).json({ message: "Failed to save OTP." });
      }
      sendEmailOTP({EMPLOYEENAME:rows[0].Employee_Name,Email:rows[0].Employee_Email,Otp:otp});

      console.log(`Generated OTP ${otp} for employee ${employeeId}`);
      res.json({ message: "OTP sent to your registered email." });
    });
  });
});

module.exports = router;    

