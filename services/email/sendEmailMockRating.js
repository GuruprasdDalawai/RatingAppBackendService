const sendMail=require("./sendEmail");
const getHeirarchyEmails=require("./getHeirarchyEmails");

function sendEmailMockRating(obj){
    let subject="Mock Ratings";
    let template=`
  Hi All,

  I hope everyone is doing well.

  We have completed the recent mock assessment and are pleased to share your ratings and feedback below.

  Mock Rating: ${Overall_Ratings}

  Feedback:
  - Work Quality:                 ${Work_Quality}
  - Attendance/Punctuality:       ${Attendance_Punctuality}
  - Productivity:                 ${Productivity}
  - Communication/Listening Skills: ${Communication_listening_Skill}
  - Behavior:                     ${Behaviour}

  Please feel free to reach out if you have any questions.




  Thanks & Regards,
  ${Rew_name}  
  Signiwis Technologies `
      
    getHeirarchyEmails(obj.Employee_Id).then((emails)=>{
        sendMail(emails, subject, template);
      });

}

module.exports=sendEmailMockRating
   