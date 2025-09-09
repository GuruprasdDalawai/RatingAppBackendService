const express = require("express");
const router = express.Router();
const connection = require("../../../db/dbConnection"); // assumed mysql (callbacks)
const verifyToken = require("../../../services/middlewares/auth");
const { v4: uuidv4 } = require("uuid");

// Optional: protect the route
// router.post('/KPIrequest', verifyToken, async (req, res) => {
router.post("/KPIrequest", async (req, res) => {
  try {
    const Request_Id = uuidv4();
    // Keep the same field names coming from the client:
    const {
      User_Id,
      Requested_Date,
      Reviewer_name,
      Mock_Type,
      SelectedId, // reviewer_id
      kpi_points, // expected to be an Array (of strings or objects)
      document_link,
      from_date, // required by kpi_master
      to_date, // required by kpi_master
    } = req.body;

    // Basic validation (don't change field names)
    if (!User_Id || !Requested_Date || !Mock_Type || !SelectedId) {
      return res
        .status(400)
        .json({ error: "Missing required fields in request body." });
    }
    if (!Array.isArray(kpi_points) || kpi_points.length === 0) {
      return res
        .status(400)
        .json({ error: "kpi_points must be a non-empty array." });
    }
    // if (!from_date || !to_date) {
    //   return res.status(400).json({ error: 'from_date and to_date are required.' });
    // }

    // Start a DB transaction to keep data consistent
    connection.beginTransaction((err) => {
      if (err) {
        console.error("Error starting transaction:", err);
        return res.status(500).json({ error: "Database transaction error." });
      }

      // 1) Check for duplicate pending request
      const checkUserSQL = `
      SELECT 1
      FROM admin_notification
      WHERE User_Id = ?
        AND Status = 'Pending'
        AND Mock_Type = ?
        AND SelectedId = ?
      LIMIT 1
    `;
      connection.query(
        checkUserSQL,
        [User_Id, Mock_Type, SelectedId],
        (error, results) => {
          if (error) {
            console.error("Error checking user in database:", error);
            return rollbackAndSend(500, "Database error.");
          }
          if (results.length > 0) {
            return rollbackAndSend(
              409,
              "Request Mock already exists for this user."
            );
          }

          // 2) Insert into admin_notification
          const insertNotifSQL = `
        INSERT INTO admin_notification
          (User_Id, Requested_Date, Status, Reviewer_name, Mock_Type, Request_Id, SelectedId)
        VALUES
          (?, ?, 'Pending', ?, ?, ?, ?)
      `;
          connection.query(
            insertNotifSQL,
            [
              User_Id,
              Requested_Date,
              Reviewer_name || null,
              Mock_Type,
              Request_Id,
              SelectedId,
            ],
            (error, notifResult) => {
              if (error) {
                console.error(
                  "Error inserting data into admin_notification:",
                  error
                );
                return rollbackAndSend(
                  500,
                  "Database error while inserting record."
                );
              }

              // 3) Insert into kpi_master
              const kpiMasterId = uuidv4();
              const insertMasterSQL = `
            INSERT INTO kpi_master
              (Uid, employee_id, reviewer_id, reviewer_name, status, kpi_type, from_date, to_date, document_link, notification_id)
            VALUES
              (?, ?, ?, ?, 'Pending', ?, ?, ?, ?, ?)
          `;
              connection.query(
                insertMasterSQL,
                [
                  kpiMasterId,
                  User_Id,
                  SelectedId,
                  Reviewer_name || null,
                  Mock_Type,
                  from_date,
                  to_date,
                  document_link || null,
                  Request_Id,
                ],
                (error, masterResult) => {
                  if (error) {
                    console.error(
                      "Error inserting data into kpi_master:",
                      error
                    );
                    return rollbackAndSend(
                      500,
                      "Database error while inserting KPI record."
                    );
                  }

                  // 4) Insert KPI details (bulk, one by one)
                  const insertDetailSQL = `
                INSERT INTO kpi_details
                  (Uid, kpi_points, rating, comment, kpi_master_id)
                VALUES
                  (?, ?, ?, ?, ?)
              `;

                  // Prepare values; allow both object form { kpi_points: 'X' } or plain string/number
                  const details = kpi_points.map((p) => {
                    const val = p && typeof p === "object" ? p.kpi_points : p;
                    return {
                      Uid: uuidv4(),
                      kpi_points: val,
                      rating: null,
                      comment: null,
                      kpi_master_id: kpiMasterId,
                    };
                  });

                  // Simple serial insertion to keep callback style
                  let i = 0;
                  const insertNext = () => {
                    if (i >= details.length) {
                      // All good — commit
                      return connection.commit((commitErr) => {
                        if (commitErr) {
                          console.error("Commit failed:", commitErr);
                          return rollbackAndSend(500, "Database commit error.");
                        }
                        return res.status(201).json({
                          message: "Request Mock created successfully!",
                          notification_insert_id: notifResult.insertId,
                          kpi_master_uid: kpiMasterId,
                          request_id: Request_Id,
                          inserted_kpi_details: details.length,
                        });
                      });
                    }

                    const d = details[i++];
                    connection.query(
                      insertDetailSQL,
                      [
                        d.Uid,
                        d.kpi_points,
                        d.rating,
                        d.comment,
                        d.kpi_master_id,
                      ],
                      (error) => {
                        if (error) {
                          console.error(
                            "Error inserting data into kpi_details:",
                            error
                          );
                          return rollbackAndSend(
                            500,
                            "Database error while inserting KPI details."
                          );
                        }
                        insertNext();
                      }
                    );
                  };

                  insertNext(); // kick off detail inserts
                }
              );
            }
          );
        }
      );

      // Helper to rollback and send a response once
      const rollbackAndSend = (statusCode, errorMessage) => {
        connection.rollback(() => {
          return res.status(statusCode).json({ error: errorMessage });
        });
      };
    });
  } catch {
    return res.status(500).json({ error: "Server error." });
  }
});
module.exports = router;
