const express = require('express');
const router = express.Router();
const connection = require('../../../db/dbConnection');
const verifyToken = require('../../../services/middlewares/auth');

// Promisify query
const queryAsync = (sql, values = []) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, values, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};
router.delete('/deleteEmployee/:id', verifyToken, async (req, res) => {
    try {
        const employeeId = req.params.id;

        if (!employeeId) {
            return res.status(400).json({ error: 'Employee ID is required.' });
        }

        // Step 1: Check if employee exists
        const existing = await queryAsync(
            `SELECT 1 FROM employee_table WHERE Employee_Id = ?`,
            [employeeId]
        );

        if (existing.length === 0) {
            return res.status(404).json({ error: 'Employee not found.' });
        }

        // Step 2: Delete the employee
        await queryAsync(`DELETE FROM employee_table WHERE Employee_Id = ?`, [employeeId]);

        return res.status(200).json({ message: 'Employee deleted successfully.' });

    } catch (err) {
        console.error('Delete Error:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;
