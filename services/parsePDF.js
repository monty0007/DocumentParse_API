// services/pdfParser.js
const axios = require('axios');
const pdfParse = require('pdf-parse');

async function parsePDFfromUrl(downloadUrl) {
  try {
    const response = await axios.get(downloadUrl, { responseType: 'arraybuffer' });

    const pdfBuffer = Buffer.from(response.data); // 🧠 Keep in memory

    const parsed = await pdfParse(pdfBuffer);

    return parsed.text; // Just text for now
  } catch (error) {
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
}

module.exports = { parsePDFfromUrl };
