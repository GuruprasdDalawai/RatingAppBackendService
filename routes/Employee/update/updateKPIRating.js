// routes/kpiReviewSubmit.js
const express = require('express');
const router = express.Router();
const connection =require('../../../db/dbConnection');  // classic mysql connection (callbacks)
// const verifyToken = require('../../services/middlewares/auth'); // if you need auth

// POST /api/employee/kpi/review/submit
router.post('/review/submit', /*verifyToken,*/ (req, res) => {
  const payload = req.body || {};

  // tolerate "noification_id" typo
  const notificationId = payload.notification_id ?? payload.noification_id ?? null;

  const {
    kpi_master_uid,        // kpi_master.Uid
    request_id,            // admin_notification.Request_Id
    reviewer_id,           // optional: admin_notification.selectedId
    from_date,             // optional: update kpi_master.from_date
    to_date,               // optional: update kpi_master.to_date
    details = [],          // [{ uid, rating, comment }]
    // overall_feedback, overall_rating // (ignored unless you add columns)
  } = payload;

  if (!kpi_master_uid) {
    return res.status(400).json({ ok: false, message: 'kpi_master_uid is required' });
  }
  if (!request_id) {
    return res.status(400).json({ ok: false, message: 'request_id is required (admin_notification.Request_Id)' });
  }
  if (!Array.isArray(details) || details.length === 0) {
    return res.status(400).json({ ok: false, message: 'details array is required and must be non-empty' });
  }

  // SQLs
  const updateDetailSQL = `
    UPDATE kpi_details
       SET rating = ?, comment = ?
     WHERE Uid = ? AND kpi_master_id = ?`;

  // Build dynamic SET for kpi_master
  const masterSets = [`status = 'Completed'`];
  const masterParams = [];
  if (from_date) { masterSets.push('from_date = ?'); masterParams.push(from_date); }
  if (to_date)   { masterSets.push('to_date = ?');   masterParams.push(to_date); }
  if (notificationId) { masterSets.push('notification_id = ?'); masterParams.push(notificationId); }

  const updateMasterSQL = `
    UPDATE kpi_master
       SET ${masterSets.join(', ')}
     WHERE Uid = ?`;

  const updateNotifBaseSQL = `UPDATE admin_notification SET Status = 'Completed' WHERE Request_Id = ?`;
  const notifParams = [request_id];
  const updateNotifSQL = reviewer_id
    ? `${updateNotifBaseSQL} AND selectedId = ?`
    : updateNotifBaseSQL;
  if (reviewer_id) notifParams.push(reviewer_id);

  // Transaction start
  connection.beginTransaction((txErr) => {
    if (txErr) {
      console.error('beginTransaction error:', txErr);
      return res.status(500).json({ ok: false, message: 'Failed to start transaction' });
    }

    // 1) Update kpi_details one-by-one (sequentially to keep it simple)
    let idx = 0;
    const updateNextDetail = () => {
      if (idx >= details.length) {
        // proceed to master update
        return updateMaster();
      }
      const d = details[idx];
      const uid = d.uid || d.Uid;
      if (!uid) {
        return rollbackWithError(new Error('Every detail item must include uid/Uid'));
      }

      const rating = (d.rating === '' || d.rating === undefined || d.rating === null)
        ? null
        : Number(d.rating);
      const comment = (d.comment || '').trim();

      connection.query(
        updateDetailSQL,
        [rating, comment, uid, kpi_master_uid],
        (qErr) => {
          if (qErr) return rollbackWithError(qErr);
          idx += 1;
          updateNextDetail();
        }
      );
    };

    // 2) Update kpi_master
    const updateMaster = () => {
      const params = [...masterParams, kpi_master_uid];
      connection.query(updateMasterSQL, params, (qErr) => {
        if (qErr) return rollbackWithError(qErr);
        updateNotification();
      });
    };

    // 3) Update admin_notification
    const updateNotification = () => {
      connection.query(updateNotifSQL, notifParams, (qErr) => {
        if (qErr) return rollbackWithError(qErr);
        commitAll();
      });
    };

    // Commit
    const commitAll = () => {
      connection.commit((cErr) => {
        if (cErr) return rollbackWithError(cErr);
        return res.json({ ok: true, message: 'KPI review submitted and statuses updated.' });
      });
    };

    // Rollback helper
    const rollbackWithError = (err) => {
      connection.rollback(() => {
        console.error('Transaction rolled back:', err);
        return res.status(500).json({
          ok: false,
          message: 'Failed to submit KPI review',
          error: String(err && err.message ? err.message : err),
        });
      });
    };

    // kick off details updates
    updateNextDetail();
  });
});

module.exports = router;
