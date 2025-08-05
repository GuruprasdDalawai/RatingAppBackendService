/**
 * @module routes/updateEmployee
 * @description Route for updating an employee by ID using HTTP PUT method.
 */

const express = require('express');
const router = express.Router();
const verifyToken = require('../../../services/middlewares/auth');
const { updateEmployeeById } = require('../../../services/employeeService');


/**
 * @route PUT /updateEmployee/:id
 * @group Employee - Operations related to employee data
 * @summary Update an existing employee by ID
 * @param {string} id.path.required - ID of the employee to update
 * @param {object} request.body.required - JSON object containing updated employee fields
 * @returns {object} 200 - Success message
 * @returns {object} 404 - Employee not found
 * @returns {object} 400 - Bad request or validation error
 * @example Request Body
 * {
 *   "name": "John Doe",
 *   "email": "john.doe@example.com",
 *   "department": "Engineering"
 * }
 */

router.put('/updateEmployee/:id', async (req, res) => {
    try {
        const employeeId = req.params.id;
        await updateEmployeeById(employeeId, req.body); // true for full validation
        return res.status(200).json({ message: `Employee fully updated (PUT).` });
    } catch (err) {
        if (err.message === 'NOT_FOUND') {
            return res.status(404).json({ error: 'Employee not found.' });
        }
        return res.status(400).json({ error: err.message || 'Update failed.' });
    }
});

module.exports = router;
