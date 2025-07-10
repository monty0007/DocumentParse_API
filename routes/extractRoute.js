const express = require('express');
const router = express.Router();

const { getAccessToken } = require('../services/msGraphAuth');
const { downloadFile } = require('../services/onedriveService');
const { parsePDF } = require('../services/pdfParser');
const { chunkText } = require('../utils/chunkText');
const { getEmbedding } = require('../services/embedder');
const { upsertToQdrant } = require('../services/qdrantClient');

router.post('/extract/:fileId', async (req, res) => {
  try {
    const token = await getAccessToken();
    const fileId = req.params.fileId;

    const pdfStream = await downloadFile(token, fileId);

    // Convert stream to buffer
    const buffer = await streamToBuffer(pdfStream);

    // Parse PDF
    const rawText = await parsePDF(buffer);

    // Chunk it
    const chunks = chunkText(rawText, 500); // adjust size

    // Embed & upsert
    for (let i = 0; i < chunks.length; i++) {
      const vector = await getEmbedding(chunks[i]);
      await upsertToQdrant({
        id: `${fileId}-${i}`,
        vector,
        payload: {
          fileId,
          text: chunks[i],
          chunkIndex: i,
        },
      });
    }

    res.json({ message: 'Parsed, chunked, embedded, and stored in Qdrant', chunkCount: chunks.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Processing failed', details: err.message });
  }
});

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

module.exports = router;
