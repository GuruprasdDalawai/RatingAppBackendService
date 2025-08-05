const express=require('express')
const router = express.Router();
const connection=require('../../../db/dbConnection')
const verifyToken = require('../../../services/middlewares/auth')
const getEmployeeGHR = require('../../../services/gryteHR/getEmpoyeeDetails')

router.post('/addnewEmployee', async (req, res)=>{
    try{
        //const {employeeId, designation,department, image}=req.body
        const {
                employeeId: employeeId,
                designation: designation,
                department: department,
                image:image

            } = req.body;
           
            if (!employeeId || !designation || !department || !image) {
                return res.status(400).json({ error: 'Missing required fields in request body.' });
            }
            // === Step 3: Fetch from external GHR ===
            const empDetails = await getEmployeeGHR(employeeId);
            if (!empDetails) {
                return res.status(404).json({ error: 'Employee not found in GHR system.' });
            }
        
            const {
                name,
                email,
                gender,
                mobile,
                dateOfBirth,
                employeeNo
            } = empDetails;

            console.log(employeeNo)
             
            // === Step 4: Check for duplicate employee ===
            const checkSQL = `SELECT * FROM employee_table WHERE Employee_Id = ?`;
            connection.query(checkSQL, [employeeNo], (checkErr, results) => {
       
                if (checkErr) {
                    console.error('DB Check Error:', checkErr);
                    return res.status(500).json({ error: 'Database error during duplication check.' });
                }
                if (results.length > 0) {
                    return res.status(409).json({ error: 'Employee already exists in the system.' });
                }
            // === Step 5: Prepare values for insert ===
            const insertSQL = `
                    INSERT INTO employee_table (
                        Employee_Id, Employee_Name, Employee_Designation, Employee_Email,
                        Employee_Department, Employee_Password, Employee_Icon,
                        Employee_Status, Employee_Mock_Taken, Employee_Mock_Given,
                        IMG_file, dateOfBirth, mobil, employeeNo, mentor, position
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
                const values = [
                    employeeNo, name, designation, email, department,
                    'Default@123', gender, 'Working', 0, 0,
                    image, dateOfBirth, mobile, employeeNo, null, null
                ];
                // === Step 6: Insert into database ===
                connection.query(insertSQL, values, (insertErr, result) => {
                    if (insertErr) {
                        console.error('DB Insert Error:', insertErr);
                        return res.status(500).json({ error: 'Failed to insert employee into database.' });
                    }

                    return res.status(200).json({ message: 'Employee added successfully.' });
                });
            });
    }catch(err){
        console.error('Unexpected Server Error:', err);
        return res.status(500).json({ error: 'An unexpected server error occurred.' });
    }
})

module.exports=router;