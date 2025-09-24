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
async function sendMail(recipients, subject, htmlbody) {
  try {
    // Ensure recipients is always an array
    const recipientArray = Array.isArray(recipients) ? recipients : [recipients];

    await graphClient.api('/users/guruprasad@signiwis.com/sendMail')
      .post({
        message: {
          subject: subject,
          body: {
            contentType: "html",
            content: htmlbody,
          },
          toRecipients: recipientArray.map(email => ({
            emailAddress: { address: email }
          }))
        }
      });

    console.log("Email sent successfully!");
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

module.exports = sendMail;


// sendMail("Ramakrishna.m@signiwis.com", "Test Subject", "<p>Hello World</p>");

// // Multiple recipients
// sendMail(["Ramakrishna.m@signiwis.com", "girish.ne@signiwis.com"], "Group Subject", "<p>Hello Everyone</p>")