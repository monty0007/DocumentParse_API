// services/msGraphAuth.js
const { ClientSecretCredential } = require('@azure/identity');

async function getAccessToken() {
  const credential = new ClientSecretCredential(
    process.env.TENANT_ID,
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET
  );

  const tokenResponse = await credential.getToken('https://graph.microsoft.com/.default');
  return tokenResponse.token;
}

module.exports = { getAccessToken };
