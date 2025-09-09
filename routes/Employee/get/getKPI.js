// routes/kpi/getFullKpiByNotification.js
const express = require('express');
const router = express.Router();
const connection = require('../../../db/dbConnection'); // adjust if needed
// const verifyToken = require('../../../services/middlewares/auth');
// router.use(verifyToken);

/**
 * GET /kpi/full/by-notification/:notificationId
 * Uses ONLY kpi_master and kpi_details.
 * Response:
 * {
 *   master: { ...kpi_master fields... },
 *   details: [{ ...kpi_details... }],
 *   totals: { total_points, rated_points, unrated_points, fully_rated }
 * }
 */
router.get('/kpi/full/by-notification/:notificationId', (req, res) => {
  const { notificationId } = req.params;

  if (!notificationId) {
    return res.status(400).json({ error: 'notificationId is required.' });
  }

  const masterSQL = `
    SELECT
      Uid                 AS kpi_master_uid,
      employee_id         AS User_Id,
      reviewer_id         AS SelectedId,
      reviewer_name,
      status,
      kpi_type,
      from_date,
      to_date,
      document_link,
      notification_id     AS Request_Id
    FROM kpi_master
    WHERE notification_id = ?
    ORDER BY from_date DESC
    LIMIT 1
  `;

  connection.query(masterSQL, [notificationId], (mErr, masters) => {
    if (mErr) {
      console.error('Error fetching kpi_master:', mErr);
      return res.status(500).json({ error: 'Database error.' });
    }
    if (!masters || masters.length === 0) {
      return res.status(404).json({ error: 'No KPI master found for this notification_id.' });
    }

    const master = masters[0];

    const detailsSQL = `
      SELECT
        Uid,
        kpi_points,
        rating,
        comment,
        kpi_master_id
      FROM kpi_details
      WHERE kpi_master_id = ?
      ORDER BY Uid ASC
    `;
    connection.query(detailsSQL, [master.kpi_master_uid], (dErr, details) => {
      if (dErr) {
        console.error('Error fetching kpi_details:', dErr);
        return res.status(500).json({ error: 'Database error.' });
      }

      const total_points = details.length;
      const rated_points = details.filter(d => d.rating !== null && d.rating !== undefined).length;
      const unrated_points = total_points - rated_points;

      return res.status(200).json({
        master,
        details,
        totals: {
          total_points,
          rated_points,
          unrated_points,
          fully_rated: total_points > 0 && rated_points === total_points
        }
      });
    });
  });
});

module.exports = router;
