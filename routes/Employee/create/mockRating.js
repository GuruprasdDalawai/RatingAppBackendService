const express=require('express')
const router = express.Router();
const connection=require('../../../db/dbConnection')
const { v4: uuidv4 } = require('uuid');


// POST API for inserting monthly review
router.post('/monthly-review', (req, res) => {
  const {
    Request_Id,
    Employee_Id,
    Rew_Name,
    Employee_Job_knowledge,
    Employee_Work_Quality,
    Employee_Attendence_punctuality,
    Employee_Productivity,
    Employee_Communication,
    Employee_Behaviour,
    Employee_Total_Rating,
    Employee_Overall_Feedback,
    Reviewer_Id,
    Recording_Link
  } = req.body;

  // // Validate required fields
  if (!Employee_Id || !Rew_Name || !Reviewer_Id ) {
    return res.status(400).json({ error: 'Employee_Id, Rew_Name, Reviewer_Id' });
  }

  const UniqueId = uuidv4();
  const Review_Date = new Date();

  const sql = `
    INSERT INTO employee_rating (
      UniqueId,
      Employee_Id,
      Rew_Name,
      Review_Date,
      Employee_Job_knowledge,
      Employee_Work_Quality,
      Employee_Attendence_punctuality,
      Employee_Productivity,
      Employee_Communication,
      Employee_Behaviour,
      Employee_Total_Rating,
      Employee_Overall_Feedback,
      Reviewer_Id,
      Recording_Link
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    UniqueId,
    Employee_Id,
    Rew_Name,
    Review_Date,
    Employee_Job_knowledge,
    Employee_Work_Quality,
    Employee_Attendence_punctuality,
    Employee_Productivity,
    Employee_Communication,
    Employee_Behaviour,
    Employee_Total_Rating,
    Employee_Overall_Feedback,
    Reviewer_Id,
    Recording_Link
  ];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting data:', err.message);
      return res.status(500).json({ error: 'Database insert failed' });
    }

    connection.query('UPDATE admin_notification SET Status = ? WHERE Request_Id = ?', ['Completed', Request_Id], (updateErr) => {
      if (updateErr) {
        console.error('Error updating request status:', updateErr.message);
        return res.status(500).json({ error: 'Request status update failed' });
      }


      
        res.status(201).json({
        message: 'Review inserted successfully',
        UniqueId
      });

    });

    
  });
});

module.exports =router;