const  express = require('express');
const router = express.Router();
const connection = require('../../../db/dbConnection'); 

router.put('/update-notification', (req, res) => {
    const { requestId, status } = req.body;

    if (!requestId || !status) {
        return res.status(400).json({ error: 'Request ID and status are required.' });
    }

    const sql = `
        UPDATE admin_notification 
        SET Status = ? 
        WHERE Request_Id = ?
    `;

    connection.query(sql, [status, requestId], (err, results) => {
        if (err) {
            console.error('Error updating notification:', err);
            return res.status(500).json({ error: 'Database query error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Notification not found or already updated.' });
        }
        res.json({ message: 'Notification updated successfully.' });
    });  
})

module.exports = router;    