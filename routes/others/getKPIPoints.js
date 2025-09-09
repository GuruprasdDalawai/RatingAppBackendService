const express = require('express');
const router = express.Router();
const connection = require('../../db/dbConnection');

router.get('/KPIPoints', (req, res) => {
    const { employeeId } = req.params;
    let sql= `SELECT KPINewPoint FROM kpipoint`;;


    connection.query(sql,(err, results) => {
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