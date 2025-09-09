const express = require("express");
const router = express.Router();
const connection = require("../../../db/dbConnection");
const verifyToken = require("../../../services/middlewares/auth");
const e = require("express");

// Promisify query
const queryAsync = (sql, values = []) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, values, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};

router.delete("/deleteEmployee/:id", async (req, res) => {
  try {
    const employeeId = req.params.id;
    let sql = `Select * From employee_table where Employee_Id=?`;
    connection.query(sql, [employeeId], async (err, results) => {
      if (err) {
        console.error("Error fetching employee:", err);
        return res.status(500).json({ error: "Internal server error." });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Employee not found." });
      }
      const existing = results[0];

      // Employee exists, proceed with deletion
      sql = `DELETE FROM employee_table WHERE Employee_Id=?`;
      connection.query(sql, [employeeId], (err, results) => {
        if (err) {
          console.error("Error deleting employee:", err);
          return res.status(500).json({ error: "Internal server error." });
        }
      });

      let sql3 = `INSERT INTO resign_employeetab (
                Employee_Id, Employee_Name, Employee_Designation, Employee_Email,
                Employee_Department, Employee_Password, Employee_Icon,
                Employee_Status, Employee_Mock_Taken, Employee_Mock_Given,
                IMG_file, dateOfBirth, mobil, employeeNo, mentor, position, mentorId
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
      connection.query(
        sql3,
        [
          existing.Employee_Id,
          existing.Employee_Name,
          existing.Employee_Designation,
          existing.Employee_Email,
          existing.Employee_Department,
          existing.Employee_Password,
          existing.Employee_Icon,
          existing.Employee_Mock_Taken,
          existing.Employee_Mock_Given,
          existing.Employee_Status,
          existing.IMG_file,
          existing.dateOfBirth,
          existing.mobil,
          existing.employeeNo,
          existing.mentor,
          existing.position,
          existing.mentorId
        ],
        (err, results) => {
          if (err) {
            console.error("Error inserting into resign_employeetab:", err);
            return res.status(500).json({ error: "Internal server error." });
          }
          return res
            .status(200)
            .json({ message: "Employee deleted successfully." });
        }
      );
    });
  } catch (err) {
    console.error("Error deleting employee:", err);
    return res.status(500).json({ error: "Internal server error." });
  }finally {
   
  }
});

module.exports = router;
