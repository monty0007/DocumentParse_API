const express = require('express');
const router = express.Router();

const { getAccessToken } = require('../services/msGraphAuth');
const { listPDFFiles, downloadFile } = require('../services/onedriveService');

router.post('/', async (req, res) => {
  try {
    const token = await getAccessToken();

    const files = await listPDFFiles(token);

    const filtered = files.filter(f => f.name.toLowerCase().endsWith('.pdf'));

    // console.log(
    //   files.map(f => ({
    //     name: f.name,
    //     type: f.folder ? 'folder' : 'file',
    //     path: f.parentReference?.path
    //   }))
    // );
    


    return res.json({
      message: "Fetched PDF files from OneDrive",
      count: filtered.length,
      files: filtered
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong', details: err.message });
  }
});

module.exports = router;
