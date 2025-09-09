const express = require("express");
const router = express.Router();
const connection = require("../../../db/dbConnection");
const verifyToken = require("../../../services/middlewares/auth");

// GET /employees/:department
router.get("/department/employees/:department", (req, res) => {
  try {
    const department = req.params.department;
    const query = `SELECT Employee_Id,Employee_Name FROM employee_table WHERE Employee_Department = ?`;
    connection.query(query, [department], (err, results) => {
      if (err) {
        console.error("Error fetching employees:", err);
        return res.status(500).json({ error: "Database query error" });
      }

      if (results.length === 0) {
        return res
          .status(404)
          .json({ message: "No employees found in this department." });
      }

      res.json(results);
    });
  } catch (err) {
    console.error("Error fetching employees by department:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
