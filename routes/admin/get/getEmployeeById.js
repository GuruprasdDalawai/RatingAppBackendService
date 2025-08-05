/**
 * @module routes/getEmployeeById
 * @description Route for fetching a single employee's details by ID.
 */

const express = require('express');
const router = express.Router();
const db = require('../../../db/dbConnection');

/**
 * @route GET /employees/:id
 * @group Employee - Operations related to employee data
 * @summary Get employee details by ID
 * @param {string} id.path.required - ID of the employee to retrieve
 * @returns {object} 200 - Employee object
 * @returns {object} 404 - Employee not found
 * @returns {object} 500 - Internal server/database error
 * @example Response
 * {
 *   "Employee_Id": "101",
 *   "Name": "John Doe",
 *   "Email": "john@example.com",
 *   "Department": "Engineering"
 * }
 */

router.get('/employees/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM employee_table WHERE Employee_Id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Employee not found' });
    res.json(results[0]);
  });
});
module.exports = router;
                        