const sendMail=require("./sendEmail");
const getHeirarchyEmails=require("./getHeirarchyEmails");

function sendEmailMockRequest(obj){
    let subject="Mock Request";
    let template=`
    <p> Hi ${obj.reviewerName}
    

    

    <i>hope this mail finds you well.</i>
    

    

    Please take mock for <strong> ${obj.employeeName}</strong> , and provide us the feedback after the discussion.
    

    

    <strong> Note:</strong>

    The mock ratings should be updated through the Rating Application.


    

    

    

    Thanks & Regards
    </br>
    <strong>Signiwis Technologies.
    </strong> </br>
    <a href="https://www.signiwis.com/">www.signiwis.com</a>
</p>`
      
     sendMail(obj.email, subject, template);

}

module.exports=sendEmailMockRequest
   
 