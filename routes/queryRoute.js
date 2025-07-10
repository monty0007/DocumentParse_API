const express = require("express");
const router = express.Router();
const { queryByFileId } = require("../services/qdrantClient");
const { askOpenAI } = require("../services/aiExtractor");

router.get("/query/:fileId", async (req, res) => {
  try {
    const fileId = req.params.fileId;

    // Fetch relevant chunks from Qdrant
    const chunks = await queryByFileId(fileId);

    const fullText = chunks.map(chunk => chunk.payload.text).join("\n");

    // Ask Azure OpenAI to extract fields
    const fields = await askOpenAI(fullText);

    res.json({
      message: "Fields extracted",
      data: fields,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to extract fields", details: err.message });
  }
});

module.exports = router;
