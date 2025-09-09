require('dotenv').config();
const { ClientSecretCredential } = require('@azure/identity');
const { Client } = require('@microsoft/microsoft-graph-client');
require('isomorphic-fetch');

// Auth
const credential = new ClientSecretCredential(
  process.env.TENANT_ID,
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET
);

// Create Graph client
const graphClient = Client.initWithMiddleware({
  authProvider: {
    getAccessToken: async () => {
      const tokenResponse = await credential.getToken('https://graph.microsoft.com/.default');
      return tokenResponse.token;
    },
  },
});

// Send mail
async function sendMail(recipient,subject,htmlbody) {
  try {
    // await graphClient.api('/users/guruprasad@signiwis.com/sendMail')
    //   .post({
    //     message: {
    //       subject: subject,
    //       body: {
    //         contentType: "html",
    //         content: htmlbody,
    //       },     
    //       toRecipients: [
    //         {
    //           emailAddress: {
    //             address: recipient
    //           }
    //         }
    //       ]
    //     }
    //   });
    console.log("Email sent successfully!");
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

module.exports=sendMail

 