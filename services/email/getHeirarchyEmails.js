const connection = require("../../db/dbConnection");

function getHeirarchyEmails(employeeId) {
  return new Promise((resolve, reject) => {
    const sql = `
      WITH RECURSIVE chain AS (
        SELECT 
          e.Employee_Id,
          e.Employee_Email,
          e.Employee_Designation,
          e.mentorId
        FROM employee_table e
        WHERE e.Employee_Id = ?

        UNION ALL

        SELECT 
          m.Employee_Id,
          m.Employee_Email,
          m.Employee_Designation,
          m.mentorId
        FROM employee_table m
        JOIN chain c ON m.Employee_Id = c.mentorId
        WHERE LOWER(COALESCE(c.Employee_Designation, '')) <> 'lead'
      )
      SELECT Employee_Email FROM chain
    `;

    connection.query(sql, [employeeId], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results.map((row) => row.Employee_Email));
    });
  });
}

// 👇 Export function
module.exports = { getHeirarchyEmails };