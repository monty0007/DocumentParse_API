const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

function writeInvoicesToExcel(results, outputFilename = 'Invoices.xlsx') {
  const allRows = [];

  for (const result of results) {
    const file = result.file;

    if (Array.isArray(result.fields)) {
      result.fields.forEach((field) => {
        allRows.push({ file, ...field });
      });
    } else if (result.fields) {
      allRows.push({ file, ...result.fields });
    }
  }

  const worksheet = xlsx.utils.json_to_sheet(allRows);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Invoices');

  const outputPath = path.join(__dirname, '..', 'output', outputFilename);

  // Ensure output folder exists
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  xlsx.writeFile(workbook, outputPath);
  console.log(`✅ Excel saved to: ${outputPath}`);
}

module.exports = { writeInvoicesToExcel };
