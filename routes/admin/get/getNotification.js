const express = require("express");
const router = express.Router();
const connection = require("../../../db/dbConnection");
router.get("/notification", (req, res) => {
  try {
    const sql = `
        SELECT 
            User_Id,
            Requested_Date,
            Status,
            Reviewer_name,
            Mock_Type,
            Request_Id,
            SelectedId
        FROM admin_notification
    `;

    connection.query(sql, (err, results) => {
      if (err) {
        console.error("Error fetching notifications:", err);
        return res.status(500).json({ error: "Database query error" });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: "No notifications found." });
      }
      res.json(results);
    });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});
module.exports = router;
