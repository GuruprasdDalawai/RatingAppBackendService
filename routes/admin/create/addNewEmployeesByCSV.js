const express = require("express");
const router = express.Router();
const connection = require("../../../db/dbConnection");
const verifyToken = require("../../../services/middlewares/auth");
const getEmployeeGHR = require("../../../services/gryteHR/getEmpoyeeDetails");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const { Readable } = require("stream");

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

function mapRowToDb(row) {
  return {

    name:row.name||null,
    email:row.email||null,
    gender:row.gender||null,
    mobile:row.mobile||null,
    dateOfBirth:row.dateOfBirth||null,
    employeeNo:row.employeeNo,
    department:row.department||null,
    designation:row.designation||null
  };
}

async function insertEmployees(row) {
   const {
                name,
                email,
                gender,
                mobile,
                dateOfBirth,
                employeeNo,
                designation,
                department
            }= row

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
                    null, dateOfBirth, mobile, employeeNo, null, null
                ];


      connection.query(insertSQL, values, (insertErr, insertResults) => {
        if (insertErr) {
          console.error("DB Insert Error:", insertErr);
        } else {
          console.log("Inserted Employee ID:", insertResults.insertId);
        }
      });
}

router.post("/csv-upload", upload.single("csvFile"), async (req, res) => {
  console.log(req.file);
  console.log("Working")
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "No file uploaded. Please upload a CSV file." });
    } else {
      const rows = [];

      await new Promise((resolve, reject) => {
        Readable.from(req.file.buffer)
          .pipe(csv({ skipLines: 0, strict: true }))
          .on("data", (data) => {
            const mapped = mapRowToDb(data);
            if (!mapped.name) return; // validation
            rows.push(mapped);
          })
          .on("end", () => resolve())
          .on("error", (err) => reject(err));
      });
      console.log("Parsed Rows:", rows);
      for (const row of rows) {
        await insertEmployees(row);
      }
      res
        .status(200)
        .json({ message: "CSV upload endpoint is under construction." });
    }
  } catch (err) {
    console.error("Unexpected Server Error:", err);
    return res
      .status(500)
      .json({ error: "An unexpected server error occurred." });
  }
});

module.exports = router;
