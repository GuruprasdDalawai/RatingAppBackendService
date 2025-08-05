const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const connection =require('../../db/dbConnection')

require('dotenv').config(); 

const loginService = async (employeeId, password) => {

    return new Promise((resolve, reject) => {
        if (!employeeId || !password) {
            return reject({ status: 400, message: "Employee ID and password are required." });
        }

        if(employeeId=='Admin' && password=='12345'){
            const token= jwt.sign(
                {
                    employeeId:employeeId
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: process.env.JWT_EXPIRY || '1h'
                }
            )
            return resolve({token,user:{satus:200, message :"Admin Login successfully",role:'Admin'}})
        }

        

        const sql = `SELECT Employee_Id, Employee_Password, Employee_Name, Employee_Email FROM employee_table WHERE Employee_Id = ?`;

        connection.query(sql, [employeeId], async (err, results) => {
            if (err) {
                console.error("DB Error:", err);
                return reject({ status: 500, message: "Database error during login." });
            }

            if (results.length === 0) {
                return reject({ status: 404, message: "Employee not found." });
            }

            const user = results[0];
            const hashed = await bcrypt.hash(user.Employee_Password, 10);
            const isMatch = await bcrypt.compare(password, hashed  );
            
            if (!isMatch) {
                return reject({ status: 401, message: "Invalid password." });
            }
            const token = jwt.sign(
                {
                    employeeId: user.Employee_Id,
                    name: user.Employee_Name,
                    email: user.Employee_Email
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: process.env.JWT_EXPIRY || '1h'
                }
            );
            return resolve({ token,user: { id: user.Employee_Id, name: user.Employee_Name, email: user.Employee_Email,role:'user' } });
        });
    });
};

module.exports = loginService;