const express = require('express');
const router = express.Router();
const connection = require('../../../db/dbConnection');

// Route to get notifications by employee id with status Pending or Accepted
router.get('/notification/:employeeId', (req, res) => {
    const { employeeId } = req.params;

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
        WHERE  SelectedId = ? AND (Status = 'Pending' OR Status = 'Accepted')
    `;
    connection.query(sql, [employeeId], (err, results) => {
        if (err) {
            console.error('Error fetching notifications:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'No notifications found for this user.' });
        }
        res.json(results);
    });
});

module.exports = router;
