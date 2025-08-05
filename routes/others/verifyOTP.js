// POST /api/verify-otp
const express = require('express');
const router = express.Router();
const connection = require('../../db/dbConnection');
const verifyToken = require('../../services/middlewares/auth');

router.post('/verify-otp', (req, res) => {
  const { employeeId, otp } = req.body;
  connection.query(
    "SELECT * FROM employee_table WHERE Employee_Id = ? AND OTP = ?",
    [employeeId, otp],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ message: "Internal server error." });
      }

      if (results.length === 0) {
        return res.status(400).json({ message: "Invalid OTP. Please try again." });
      }

      res.json({ message: "OTP verified. You can now reset your password." });
    }
  );
});

module.exports = router;
