const express = require('express');
const router = express.Router();
const { getAccessToken } = require('../services/msGraphAuth');
const { listPDFFiles } = require('../services/onedriveService');
const { parsePDFfromUrl } = require('../services/parsePDF');

router.post('/', async (req, res) => {
  try {
    // Step 1: Auth + Get OneDrive files
    const token = await getAccessToken();
    const files = await listPDFFiles(token);
    
    const pdfFiles = files.filter(f => f.name.toLowerCase().endsWith('.pdf'));

    const results = [];

    // Step 2: Parse each file
    for (const file of pdfFiles) {
      const downloadUrl = file['@microsoft.graph.downloadUrl'];
      const name = file.name;

      try {
        const parsedText = await parsePDFfromUrl(downloadUrl);
        results.push({ file: name, parsedText });
      } catch (err) {
        results.push({ file: name, error: err.message });
      }
    }

    // res.json({
    //   message: 'Fetched and parsed all PDF files from OneDrive',
    //   count: results.length,
    //   results,
    // });
    res.json(results);
  } catch (err) {
    console.error('❌ Failed to extract from OneDrive:', err.message);
    res.status(500).json({
      error: 'Failed to extract and parse files',
      details: err.message,
    });
  }
});

module.exports = router;
