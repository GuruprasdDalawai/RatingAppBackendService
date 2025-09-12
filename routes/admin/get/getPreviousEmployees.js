const express = require("express");
const router = express.Router();
const db = require("../../../db/dbConnection");
const verifyToken = require("../../../services/middlewares/auth");

router.get("/PreviousEmployees", (req, res) => {
  try {
    db.query(
      `SELECT 
  Employee_Id,
  Employee_Name,
  Employee_Designation,
  Employee_Email,
  Employee_Department,
  Employee_Password,
  Employee_Mock_Taken,
  Employee_Mock_Given,
  Employee_Status,
  dateOfBirth,
  mobil,
  employeeNo,
  mentor,
  position,
  mentorId
FROM resign_employeetab`,
      (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
      }
    );
  } catch (err) {
    console.error("Error fetching employees:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
