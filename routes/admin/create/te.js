
const express= require('express')
const router = express.Router();
const connection=require('../../../db/dbConnection')
const verifyToken = require('../../../services/middlewares/auth')
const { v4: uuidv4 } = require('uuid');

router.post('/KPIrequest', async (req, res)=>{
    const UniqueId = uuidv4();
    const{User_Id, Requested_Date, Reviewer_name, Mock_Type,SelectedId, kpi_points, document_link}=req.body
    if (!User_Id || !Requested_Date ||
            !Mock_Type || !SelectedId) {
            return res.status(400).json({ error: 'Missing required fields in request body.' });
        }
    const checkUserSQL = `SELECT * FROM admin_notification WHERE User_Id = ? AND Status = 'Pending' AND Mock_Type = ? AND SelectedId = ?`;
    connection.query(checkUserSQL, [User_Id,Mock_Type,SelectedId], (error, results) => {  
        if (error) { 
            console.error("Error checking user in database:", error);
            return res.status(500).json({ error: "Database error." });
        }
        if (results.length > 0) {
            return res.status(409).json({ error: "Request Mock already exists for this user." });
        }
        const sql = `
            INSERT INTO admin_notification
            (User_Id, Requested_Date, Status, Reviewer_name, Mock_Type,Request_Id,SelectedId)
            VALUES (?, ?, ?, ?, ?, ?,?)
        `;
        connection.query(sql, [User_Id, Requested_Date, 'Pending', Reviewer_name, Mock_Type, UniqueId, SelectedId], (error, results) => {
            if (error) {
                console.error("Error inserting data into database:", error);
                return res.status(500).json({ error: "Database error while inserting record." });

            }
            const masterid=uuidv4();
            const kpiMasterSql=`INSERT INTO kpi_master
            (Uid, employee_id, reviewer_id, reviewer_name, status, kpi_type, from_date, to_date, document_link,notification_id)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
            connection.query(kpiMasterSql, [masterid, User_Id, SelectedId, Reviewer_name, 'Pending', Mock_Type, from_date, to_date, document_link,UniqueId], (error, results) => {
                if (error) {
                    console.error("Error inserting data into kpi_master:", error);
                    return res.status(500).json({ error: "Database error while inserting KPI record." });
                } 

                kpi_points.array.forEach(element => {
                    const detailsID=uuidv4()
                    const detailsSql=`
                    INSERT INTO kpi_details
                    (Uid, kpi_points, rating, comment, kpi_master_id)
                    VALUES (?, ?, ?, ?, ?)
                    `

                connection.query(detailsSql, [detailsID, element.kpi_points,null, null, masterid], (error, results) => {
                });
            

            
                });
            });
            res.status(201).json({ message: "Request Mock created successfully!", id: results.insertId });
        });  // End of insert query
    });
})

module.exports = router;
