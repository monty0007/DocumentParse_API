const pdf = require('pdf-parse');

async function extractTextFromPDF(stream) {
  const buffer = await streamToBuffer(stream);
  const data = await pdf(buffer);
  return data.text;
}

function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

module.exports = { extractTextFromPDF };
