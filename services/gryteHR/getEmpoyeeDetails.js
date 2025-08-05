const axios=require('axios')

async function generateAccessToken() {
    const response = await axios({
        url: "https://signiwistech1.greythr.com/uas/v1/oauth2/client-token",
        method: "post",
        data: "grant_type=client_credentials",
        auth: {
            username: "Ganesh",
            password: "89dd801c-a874-4ec5-b59d-67fa34153d18"
        }
    })
    return response.data.access_token;
}
async function getEmployeeGHR(empID){
    const accessToken = await generateAccessToken();
    console.log(accessToken)
    console.log(empID)
    // /employee/v2/employees/lookup?q=S000336
    // https://api.greythr.com/employee/v2/employees?page=1&size=180
    if(accessToken){
        try{
            const response = await fetch(`https://api.greythr.com/employee/v2/employees/lookup?q=${empID}`, {          
                method: "GET",
                headers:{
                "Access-Control-Allow-Origin": '*',
                    "Content-Type": "application/json",
                    'Access-Token': accessToken,
                    'x-greythr-domain':`signiwistech1.greythr.com`
                }
            })
            var data=await response.json()
            return data
        }
        catch{
            console.log("encounterd issue with while fetching data for GryetHR")
            return null
        }
    }
    else
    {
            console.log("Access token is not valid")
            return null;      
    }
}
module.exports=getEmployeeGHR
   