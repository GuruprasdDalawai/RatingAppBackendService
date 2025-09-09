const express = require('express');
const router = express.Router();
const connection = require('../../db/dbConnection');

// Route to get notifications by employee id with status Pending or Accepted
router.get('/rating/:employeeId', (req, res) => {
    const { employeeId } = req.params;
    let sql;

    if(employeeId ==='all'){
         sql = `SELECT  * FROM employee_rating`;
    }else{
        sql = `SELECT  * FROM employee_rating WHERE Employee_Id = '${employeeId}'`;
    }

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