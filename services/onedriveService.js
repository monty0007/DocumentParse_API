// services/onedriveService.js
const { Client } = require("@microsoft/microsoft-graph-client");
require("isomorphic-fetch");

function getAuthenticatedClient(token) {
  const client = Client.init({
    authProvider: (done) => {
      done(null, token); // token from Azure
    },
  });
  return client;
}

async function listPDFFiles(accessToken) {
  const client = getAuthenticatedClient(accessToken);
  const userId = process.env.ONEDRIVE_USER_ID || 'me';

  const res = await client
    .api(`/users/${userId}/drive/root:/Documents:/children`)
    .get();

  return res.value; // array of files
}

async function downloadFile(accessToken, fileId) {
  const client = getAuthenticatedClient(accessToken);
  const stream = await client
    .api(`/me/drive/items/${fileId}/content`)
    .getStream();

  return stream; // You can pipe it to PDF parser
}

module.exports = {
  listPDFFiles,
  downloadFile,
};
