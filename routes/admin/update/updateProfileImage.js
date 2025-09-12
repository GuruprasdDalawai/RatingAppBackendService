
const express = require("express");
const router = express.Router();
const verifyToken = require("../../../services/middlewares/auth");
const { updateEmployeeById } = require("../../../services/employeeService");
const connection = require("../../../db/dbConnection");


router.put("/updateProfileImage/:id", async (req, res) => {
  const employeeId = req.params.id;
  const { IMG_file } = req.body;

  try {
      let sql = `UPDATE employee_table SET IMG_file = ? WHERE Employee_Id = ?`;
      connection.query(sql, [IMG_file, employeeId], (err, result) => {
        if (err) {
          console.error("Error updating profile image:", err);
          return res.status(500).json({ message: "Database error" });
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "Employee not found" });
        }
        res.status(200).json({ message: "Profile image updated successfully" });
      });

  } catch (error) {
    console.error("Error updating profile image:", error);
    res.status(500).json({ message: "Internal server error" }); 
  }
});

module.exports = router;
