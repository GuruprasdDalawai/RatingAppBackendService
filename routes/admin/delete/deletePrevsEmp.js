const express = require("express");
const router = express.Router();
const connection = require("../../../db/dbConnection");
const verifyToken = require("../../../services/middlewares/auth");

router.delete("/PreviousEmployees/:id", (req, res) => {
  try {
    const employeeId = req.params.id;

    if (!employeeId) {
      return res.status(400).json({ error: "Employee ID is required." });
    }

    const sql = `DELETE FROM previous_employees WHERE Employee_Id = ?`;
    connection.query(sql, [employeeId], (err, results) => {
      if (err) {
        console.error("Error deleting previous employee :", err);
        return res.status(500).json({ error: "Database query error" });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Notification not found." });
      }
      res.json({ message: "Previous employee deleted successfully." });
    });
  } catch (err) {
    console.error("Error deleting previous employee:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});
module.exports = router;
