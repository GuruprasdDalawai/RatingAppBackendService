/**
 * @module routes/saveHierarchy
 * @description Route to update multiple employee records in bulk, setting mentor and department info.
 */


const express=require('express')
const router = express.Router();
const connection=require('../../../db/dbConnection')
const verifyToken = require('../../../services/middlewares/auth')
const getEmployeeGHR = require('../../../services/gryteHR/getEmpoyeeDetails')


/**
 * @route POST /saveHierarchy
 * @group Employee - Operations related to employee data
 * @summary Update mentor and department for multiple employees (batch update)
 * @param {Array<object>} request.body.employees.required - Array of employee objects to update
 * @returns {object} 200 - Success message
 * @returns {object} 400 - Invalid or missing employee data
 * @returns {object} 500 - Internal server/database error
 * 
 * @example Request Body
 * {
 *   "employees": [
 *     {
 *       "Employee_Id": "101",
 *       "mentorId": "501",
 *       "Employee_Department": "Engineering"
 *     },
 *     {
 *       "Employee_Id": "102",
 *       "mentorId": "502",
 *       "Employee_Department": "Marketing"
 *     }
 *   ]
 * }
 * 
 * @example Success Response
 * {
 *   "message": "Hierarchy updated successfully."
 * }
 */

router.post('/saveHierarchy', async (req, res) => {
  try {
    const { employees } = req.body;

    if (!employees || !Array.isArray(employees) || employees.length === 0) {
      return res.status(400).json({ error: "No employees to update." });
    }

    // Build batch update queries
    const updates = employees.map(emp => {
      return new Promise((resolve, reject) => {
        connection.query(
          `UPDATE employee_table
           SET mentorId = ?, Employee_Department = ?
           WHERE Employee_Id = ?`,
          [emp.mentorId, emp.Employee_Department, emp.Employee_Id],
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
      });
    });

    // Execute all
    await Promise.all(updates);

    res.json({ message: "Hierarchy updated successfully." });
  } catch (err) {
    console.error("Error saving hierarchy:", err);
    return res.status(500).json({ error: "Failed to update hierarchy." });
  }
});

module.exports = router;