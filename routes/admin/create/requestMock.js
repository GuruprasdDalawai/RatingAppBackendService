const express = require('express');
const router = express.Router();
const connection = require('../../../db/dbConnection');
const verifyToken = require('../../../services/middlewares/auth'); // optional: enable if you want auth
const sendEmailmockRequest = require('../../../services/email/sendEmailMockRequest');
const { v4: uuidv4 } = require('uuid');
const util = require('util');

// Promisify MySQL queries
const query = util.promisify(connection.query).bind(connection);

// POST /requestMock
router.post('/requestMock', /* verifyToken, */ async (req, res) => {
  try {
    const {
      User_Id,
      Requested_Date,
      Status,
      Reviewer_name,
      Mock_Type,
      // Request_Id,  // not needed; we generate uuid
      SelectedId,
    } = req.body;

    // 1) Basic validation
    if (!User_Id || !Requested_Date || !Status || !Mock_Type || !SelectedId) {
      return res.status(400).json({ error: 'Missing required fields in request body.' });
    }

    // 2) Check for duplicate pending request for same user + mock type + selectedId
    const duplicateSQL = `
      SELECT 1
      FROM admin_notification
      WHERE User_Id = ? AND Status = 'Pending' AND Mock_Type = ? AND SelectedId = ?
      LIMIT 1
    `;
    const dup = await query(duplicateSQL, [User_Id, Mock_Type, SelectedId]);
    if (dup.length > 0) {
      return res.status(409).json({ error: 'Request Mock already exists for this user.' });
    }

    // 3) Insert new record
    const insertSQL = `
      INSERT INTO admin_notification
      (User_Id, Requested_Date, Status, Reviewer_name, Mock_Type, Request_Id, SelectedId)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const requestId = uuidv4();
    const insertResult = await query(insertSQL, [
      User_Id,
      Requested_Date,
      Status,
      Reviewer_name || null,
      Mock_Type,
      requestId,
      SelectedId,
    ]);

    // 4) Fetch reviewer (User_Id) and employee (SelectedId) details IN PARALLEL
    const employeeSQL = `SELECT Employee_Id, Employee_Name, Employee_Email FROM employee_table WHERE Employee_Id = ?`;

    const [reviewerRows, employeeRows] = await Promise.all([
      query(employeeSQL, [SelectedId]),
      query(employeeSQL, [User_Id]),
    ]);

    if (!reviewerRows || reviewerRows.length === 0) {
      // Optional: you might want to rollback the insert here if you use transactions.
      return res.status(404).json({ error: 'Reviewer not found.' });
    }
    if (!employeeRows || employeeRows.length === 0) {
      // Optional: you might want to rollback the insert here if you use transactions.
      return res.status(404).json({ error: 'Employee not found.' });
    }

    const reviewerObje = reviewerRows[0];
    const employeeObje = employeeRows[0];

    // 5) Build email payload safely (no undefineds)
    const emailPayload = {
      reviewerName: reviewerObje.Employee_Name || '',
      employeeName: employeeObje.Employee_Name || '',
      email: reviewerObje.Employee_Email || '', // send to reviewer
      // You can add more fields if your email template needs them:
      // requestId,
      // mockType: Mock_Type,
      // requestedDate: Requested_Date,
    };

    // Optional: basic sanity check before sending mail
    if (!emailPayload.email) {
      // Don’t fail the whole API if email missing—choose your policy:
      // return res.status(422).json({ error: 'Reviewer email is missing.' });
      console.warn('Reviewer email missing; skipping sendEmailmockRequest');
    } else {
      try {
        // If sendEmailmockRequest returns a promise, await it. If it’s sync, this will still work.
        sendEmailmockRequest(emailPayload);
      } catch (mailErr) {
        console.error('Error sending email notification:', mailErr);
        // Decide whether to fail the request or not. Typically you still return success for the DB insert.
      }
    }

    return res.status(201).json({
      message: 'Request Mock created successfully!',
      id: insertResult.insertId,
      requestId, // expose the UUID if useful to the client
    });
  } catch (error) {
    console.error('Error in /requestMock:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
 