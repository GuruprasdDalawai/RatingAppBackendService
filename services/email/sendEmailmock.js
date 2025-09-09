const sendMail=require("./sendEmail");

function sendEmailformock(obj){

    let subject="Mock Scheduled";
    let template=`<p> Hi <strong>${obj.Employee_Name} </strong> your mock is scheduled on <strong>${obj.date}</strong>, It will be taken by  <strong>${obj.ReviewerName}</strong> in ${obj.mode} mode Please be prepared for the mock. </br> </br>
                                                                          
            <strong>
            -- </br>
            Thanks & Regards, </br>
            Signiwis Technologies.
            </strong> </br>
            <a href="https://www.signiwis.com/">www.signiwis.com</a>
            </p>
            `

       sendMail(obj.email, subject, template);

}

module.exports=sendEmailformock;
