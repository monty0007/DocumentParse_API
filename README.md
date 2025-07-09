# 🧾 Invoice Extraction Agent with OneDrive + GPT + Power Automate

A backend Express.js solution that connects to OneDrive, fetches invoice PDFs, extracts structured invoice fields using GPT-4, and sends the result to Power Automate for further processing (like storing into Excel).

---

## 🚀 Features

- ✅ Fetch PDF invoices from OneDrive's `Documents` folder
- ✅ Extract invoice fields using GPT (flexible layout support)
- ✅ Return structured JSON (can integrate with Power Automate)
- 🔒 Uses Microsoft Graph API with secure OAuth2
- 🧠 Optional: Plug in Qdrant for semantic search or document memory

---

```bash
📁 invoice-agent-backend
├── 📁 routes
│   └── processRoute.js         <-- POST /api/process-onedrive (fetch PDFs)
│   └── extractRoute.js         <-- POST /api/extract-invoice (parse + extract fields)
│
├── 📁 services
│   └── msGraphAuth.js          <-- Auth logic to MS Graph (get access token)
│   └── onedriveService.js      <-- List + download files from OneDrive
│   └── pdfParser.js            <-- Text extraction from PDF (PDF-Parse / pdf-lib etc.)
│   └── aiExtractor.js          <-- GPT call to extract structured invoice fields
│
├── 📁 utils
│   └── formatUtils.js          <-- Clean up text, handle field formatting (optional)
│
├── 📁 data
│   └── qdrantClient.js         <-- (optional) Qdrant logic if using embeddings
│
├── 📄 server.js                <-- Entry point for Express API
├── 📄 .env                     <-- Secrets, tokens, API keys
├── 📄 package.json
└── 📄 README.md
