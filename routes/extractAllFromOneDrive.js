const express = require('express')
const router = express.Router()
const { getAccessToken } = require('../services/msGraphAuth')
const { listPDFFiles } = require('../services/onedriveService')
const { parsePDFfromUrl } = require('../services/parsePDF')
const { extractFieldsFromText } = require('../services/aiExtractor')
const { writeInvoicesToExcel } = require('../services/excelWriter')

router.post('/', async (req, res) => {
  try {
    const token = await getAccessToken()
    const files = await listPDFFiles(token)
    const pdfFiles = files.filter((f) => f.name.toLowerCase().endsWith('.pdf'))

    const results = []

    for (const file of pdfFiles) {
      const downloadUrl = file['@microsoft.graph.downloadUrl']
      const name = file.name

      try {
        const parsedText = await parsePDFfromUrl(downloadUrl) // 🧠 step 1
        const fields = await extractFieldsFromText(parsedText) // 🤖 step 2 (GPT extraction)

        results.push({
          file: name,
          fields, // 📦 JSON fields from GPT
        })
      } catch (err) {
        results.push({
          file: name,
          error: err.message,
        })
      }
    }

    // ✅ Store to Excel
    await writeInvoicesToExcel(results);
    
    res.json({
      message: '✅ Extracted fields from all PDF invoices',
      count: results.length,
      results,
    })
  } catch (err) {
    console.error('❌ Failed to extract from OneDrive:', err.message)
    res.status(500).json({
      error: 'Failed to extract and parse files',
      details: err.message,
    })
  }
})

module.exports = router
