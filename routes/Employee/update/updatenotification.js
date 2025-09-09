const  express = require('express');
const router = express.Router();
const sendEmailformock =require('../../../services/email/sendEmailmock');
const connection = require('../../../db/dbConnection'); 

router.put('/update-notification', (req, res) => {
    const { requestId, status , mode , dateTime } = req.body;

    if (!requestId || !status || !mode || !dateTime) {
        return res.status(400).json({ error: 'Request ID, status, mode, and date are required.' });
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

        const sql = `
        SELECT
            an.Reviewer_name   AS reviewer_name,
            e.Employee_Name    AS employee_name,
            e.Employee_Email  AS employee_email
        FROM admin_notification AS an
        JOIN employee_table   AS e
            ON e.Employee_Id = an.User_Id
        WHERE an.Request_Id = ?;
        `;
        connection.query(sql, [requestId], (err, rows) => {
        if (err){
            console.error('Error fetching notification details:', err);
            return res.status(500).json({ error: 'Database query error' });
        } 
        sendEmailformock({mode:mode, date: dateTime, ReviewerName: rows[0].reviewer_name, Employee_Name: rows[0].employee_name, email:rows[0].employee_email  });
        res.json({ message: 'Notification updated successfully.' });
        });
    });  
})

module.exports = router;    