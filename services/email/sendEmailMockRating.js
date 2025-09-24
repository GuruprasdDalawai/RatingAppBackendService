const sendMail=require("./sendEmail");
const getHeirarchyEmails=require("./getHeirarchyEmails")

function sendEmailMockRating(obj){
    let subject="Mock Ratings";
    let template=`
    <pre>
  Hi All,

  I hope everyone is doing well.

  We have completed the recent mock assessment and are pleased to share your ratings and feedback below.

  Mock Rating:

  Feedback:
  - Work Quality:                 ${obj.Employee_Work_Quality}
  - Attendance/Punctuality:       ${obj.Employee_Attendence_punctuality}
  - Productivity:                 ${obj.Employee_Productivity}
  - Communication/Listening Skills: ${obj.Employee_Communication}
  - Behavior:                     ${obj.Employee_Behaviour}

  Please feel free to reach out if you have any questions.




  Thanks & Regards,
  ${obj.Rew_Name}  
  Signiwis Technologies </pre> `
      
    getHeirarchyEmails(obj.Employee_Id).then((emails)=>{
       console.log(emails)
        sendMail(emails, subject, template);
      });

}

module.exports=sendEmailMockRating

 