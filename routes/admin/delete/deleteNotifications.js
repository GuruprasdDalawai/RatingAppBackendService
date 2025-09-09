const express = require("express");
const router = express.Router();
const connection = require("../../../db/dbConnection");
const verifyToken = require("../../../services/middlewares/auth");

router.delete("/deleteNotifications/:id", (req, res) => {
  try {
    const notificationId = req.params.id;

    if (!notificationId) {
      return res.status(400).json({ error: "Notification ID is required." });
    }

    const sql = `DELETE FROM admin_notification WHERE Request_Id = ?`;
    connection.query(sql, [notificationId], (err, results) => {
      if (err) {
        console.error("Error deleting notification:", err);
        return res.status(500).json({ error: "Database query error" });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Notification not found." });
      }
      res.json({ message: "Notification deleted successfully." });
    });
  } catch (err) {
    console.error("Error deleting notification:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});
module.exports = router;
