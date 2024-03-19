import express from 'express';
import PDFDocument from 'pdfkit'

const app = express();
const port = 3000;

// Define a route to generate PDF
app.get('/generate-pdf', (_req, res) => {
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="generated-pdf.pdf"');
  doc.pipe(res);
  doc.fontSize(24).text('Sample Table in PDF', { align: 'center' });
  const table = {
    headers: ['Name', 'Age', 'Country'],
    rows: [
      ['John Doe', '30', 'USA'],
      ['Jane Smith', '25', 'Canada'],
      ['Ahmed Khan', '40', 'India']
    ]
  };

  const tableTop = 150;
  const tableLeft = 50;
  const cellPadding = 10;
  const rowHeight = 30;

  // Draw table headers
  table.headers.forEach((header, i) => {
    doc.font('Helvetica-Bold').fontSize(12).text(header, tableLeft + i * 200, tableTop, { width: 200, align: 'center' });
  });

  // Draw table rows
  table.rows.forEach((row, i) => {
    row.forEach((cell, j) => {
      doc.font('Helvetica').fontSize(12).text(cell, tableLeft + j * 200, tableTop + (i + 1) * rowHeight, { width: 200, align: 'center' });
    });
  });
  doc.end();
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
