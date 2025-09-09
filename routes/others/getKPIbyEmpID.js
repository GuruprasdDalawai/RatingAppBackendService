const express = require('express');
const router = express.Router();
const connection = require('../../db/dbConnection');

router.get('/KPIbyEmpID/:employeeId', (req, res) => {

    const { employeeId } = req.params;
    connection.query('SELECT * FROM kpi_master WHERE employee_id = ?' , [employeeId], (err, results) => {
        if (err) {
            console.error('Error fetching KPI:', err);
            return res.status(500).json({ ok: false, message: 'Failed to fetch KPI', error: String(err) });
        }
        return res.json({ ok: true, data: results });
    });
})