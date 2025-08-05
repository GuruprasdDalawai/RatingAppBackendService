const express = require('express');
const router = express.Router();
const connection = require('../../db/dbConnection');
const verifyToken = require('../../services/middlewares/auth');

// POST /api/reset-password
router.post('/reset-password', (req, res) => {

  const { employeeId, newPassword } = req.body;
   
    connection.query(
    "UPDATE employee_table SET Employee_Password = ? WHERE Employee_Id = ?",
    [newPassword, employeeId],(err,results) => {
    
      if (err) {
        console.error("Error updating password:", err);
        return res.status(500).json({ error: "Internal server error." });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Employee not found." });
      }
      res.status(200).json({ message: "Password reset successful." });
    });
});

module.exports = router;

 