const connection = require('./db/dbConnection');

let sql=` SELECT 
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
WHERE km.employee_id = 'S003368'
  AND km.status = 'Completed' AND km.kpi_type = 'Monthly KPI'
GROUP BY km.Uid`
connection.query(sql,(err,result)=>{

    if(err){
        console.log(err)
    }else{
        console.log(JSON.stringify(result))
    }
})

