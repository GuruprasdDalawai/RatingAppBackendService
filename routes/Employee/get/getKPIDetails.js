const express = require("express");
const router = express.Router();
const connection = require("../../../db/dbConnection");

router.post("/KPI-Details", async (req, res) => {
  try {
    const { employeeId, kpi_type } = req.body;

    if (!employeeId || !kpi_type) {
      return res.status(400).json({
        message: "employeeId and kpiType are required",
      });
    }

    const sql = `
      SELECT 
        km.Uid AS kpiMasterId,
        JSON_OBJECT(
            'employee_id', km.employee_id,
            'reviewer_id', km.reviewer_id,
            'reviewer_name', km.reviewer_name,
            'status', km.status,
            'kpi_type', km.kpi_type,
            'from_date', km.from_date,
            'to_date', km.to_date,
            'document_link', km.document_link
        ) AS masterDetails,
        JSON_ARRAYAGG(
            JSON_OBJECT(
                'kpi_detail_uid', kd.Uid,
                'kpi_points', kd.kpi_points,
                'rating', kd.rating,
                'comment', kd.comment
            )
        ) AS kpiDetails
      FROM signiwis_schema.kpi_master km
      JOIN signiwis_schema.kpi_details kd 
          ON km.Uid = kd.kpi_master_id
      WHERE km.employee_id = ? 
        AND km.status = 'Completed' 
        AND km.kpi_type = ?
      GROUP BY km.Uid
    `;

    connection.query(sql, [employeeId, kpi_type], (err, result) => {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({
          message: "Error fetching KPI Details",
          error: err.message,
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          message: "No KPI Details found",
          employeeId,
          kpi_type,
        });
      }

      res.status(200).json(result);
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({
      message: "Unexpected server error",
      error: error.message,
    });
  }
});

module.exports = router;
