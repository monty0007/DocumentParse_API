// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const processRoute = require('./routes/processRoute');
const processAllExtractRoute = require('./routes/extractAllFromOneDrive');

require('dotenv').config({ quiet: true });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is alive 🚀');
  });
  

app.use('/api/process-onedrive', processRoute);
app.use('/api/process-onedrive/extract', processAllExtractRoute);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
