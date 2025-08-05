
const express= require('express')
const router = express.Router();
const connection=require('../../../db/dbConnection')
const verifyToken = require('../../../services/middlewares/auth');
const e = require('express');



router.post('/requestMock', async (req, res) => {
    try{
        const {
            User_Id,
            Requested_Date,
            Status,
            Reviewer_name,
            Mock_Type,
            Request_Id,
            SelectedId  
        }=req.body
        // 1️⃣ Basic validation checks        
        if (!User_Id || !Requested_Date || !Status ||
            !Mock_Type || !SelectedId) {
            return res.status(400).json({ error: 'Missing required fields in request body.' });
        }
        // 2️⃣ Check if the user exists in the database with User_Id Status=Pending and Mock_Type=Mock and SelectedId= SelectedId if it return value return as  alredy exists else proceed to insert      
        const checkUserSQL = `SELECT * FROM admin_notification WHERE User_Id = ? AND Status = 'Pending' AND Mock_Type = ? AND SelectedId = ?`;
        // Check if the user exists
        connection.query(checkUserSQL, [User_Id,Mock_Type,SelectedId], (error, results) => {  
            if (error) {
                console.error("Error checking user in database:", error);
                return res.status(500).json({ error: "Database error." });
            }
            if (results.length > 0) {
                return res.status(409).json({ error: "Request Mock already exists for this user." });
            }
            // Proceed to insert if user does not exist
            // 2️⃣ Prepare SQL insert
            const sql = `
                INSERT INTO admin_notification
                (User_Id, Requested_Date, Status, Reviewer_name, Mock_Type,Request_Id,SelectedId)
                VALUES (?, ?, ?, ?, ?, ?,?)
            `;
            let reqId = Math.floor(Math.random() * 1000000);
            const requestId = 'REQID' + reqId; 

            const prefix = 'M001';
            const randomNumber = Math.floor(Math.random() * 10000);
            const meetingId = `${prefix}${randomNumber.toString().padStart(4, '0')}`;

            connection.query(sql, [User_Id, Requested_Date, Status,meetingId, Mock_Type, requestId, SelectedId], (error, results) => {
                if (error) {
                    console.error("Error inserting data into database:", error);
                    return res.status(500).json({ error: "Database error while inserting record." });
                }
                res.status(201).json({ message: "Request Mock created successfully!", id: results.insertId });
            });  // End of insert query
        });
    }
    catch (error) {
        console.error("Error in requestMock endpoint:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
})
module.exports = router;





