const connection = require('../db/dbConnection');

// Promisified MySQL query
const queryAsync = (sql, values = []) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, values, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
};

/**
 * Updates employee by ID.
 * @param {string} employeeId
 * @param {object} data - Employee fields to update
 * @param {boolean} requireAllFields - If true, throws error on missing fields (for PUT)
 */
const updateEmployeeById = async (employeeId, data, requireAllFields = false) => {
    // Required fields for PUT
    const requiredFields = [
        'name', 'designation', 'department', 'email', 'gender',
        'mobile', 'dateOfBirth', 'image', 'position'
    ];
    if (requireAllFields) {
        for (const field of requiredFields) {
            if (!data[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }
    }

    // Check if employee exists
    const existing = await queryAsync(
        `SELECT * FROM employee_table WHERE Employee_Id = ?`,
        [employeeId]
    );
    
   
    if (existing.length === 0) {
        throw new Error('NOT_FOUND');
    }

    
    

    // Merge existing values with new ones for PATCH
    const current = existing[0];
    
    const updated = {
        name: data.name || current.Employee_Name,
        designation: data.designation || current.Employee_Designation,
        department: data.department || current.Employee_Department,
        email: data.email || current.Employee_Email,
        gender: data.gender || current.Employee_Icon,
        mobile: data.mobile || current.mobil,
        dateOfBirth: data.dateOfBirth || current.dateOfBirth,
        image: data.image || current.IMG_file,
        position: data.position || current.position,
        mentor: data.mentor || current.mentor,
    };
    
    const updateSQL = `
        UPDATE employee_table SET
            Employee_Name = ?, Employee_Designation = ?, Employee_Department = ?,
            Employee_Email = ?, Employee_Icon = ?, mobil = ?, dateOfBirth = ?,
            position = ?, mentor = ?, IMG_file = ?
        WHERE Employee_Id = ?

    `;

    const values = [
        updated.name,
        updated.designation,
        updated.department,
        updated.email,
        updated.gender,
        updated.mobile,
        updated.dateOfBirth,
        updated.position,
        updated.mentor,
        updated.image,
        employeeId
    ];

    await queryAsync(updateSQL, values);
};

module.exports = {
    updateEmployeeById
};
