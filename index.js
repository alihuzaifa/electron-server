import express from 'express';
import PDFDocument from 'pdfkit'
import { formatCurrency, formatDate, generateHr, generateTableRow } from './createInvoice.js';
import bodyParser from "body-parser";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
const port = 3000;
app.post('/generate-pdf', (_req, res) => {
  const invoice = _req?.body
  const doc = new PDFDocument();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="generated-pdf.pdf"');
  doc.pipe(res);
  doc.fillColor("#444444")
    .fontSize(20)
    .text("Invoice", 50, 30, { align: "center" });
  doc
    .image("logo.png", 50, 55, { width: 100 })
    .fillColor("#444444")
    .fontSize(10)
    .text("Azeem Badshah.", 200, 60, { align: "right" })
    .text("123 Main Street", 200, 75, { align: "right" })
    .text("New York, NY, 10025", 200, 90, { align: "right" })
    .moveDown();
  doc
    .fillColor("#444444")
    .fontSize(20).font("Helvetica-Bold")
    .text("AL NOOR CABLE MERCHANT", 50, 130, { align: "center" });
  doc.font("Helvetica");
  doc
    .fontSize(10)
    .text(
      "Power Cable, Electric Cable, Welding Cable, Internet Cable, Heat-Proof Cable & Water-Proof Cable",
      50,
      145,
      { align: "center", width: 500 }
    );

  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, 185)
    .lineTo(550, 185)
    .stroke();

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("Name", 50, customerInformationTop)
    .text("Ali Huzaifa", 150, customerInformationTop)
    .font("Helvetica-Bold")
    .text("Phone Number:", 50, customerInformationTop + 15)
    .text("0311-1260357", 150, customerInformationTop + 15)

    .font("Helvetica-Bold")
    .text("Invoice No:", 300, customerInformationTop)
    .text("123456", 450, customerInformationTop)
    .font("Helvetica-Bold")
    .text("Date:", 300, customerInformationTop + 15)
    .text("12/1/2024", 450, customerInformationTop + 15)
    .moveDown();
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, 252)
    .lineTo(550, 252)
    .stroke();
  let i;
  const invoiceTableTop = 300;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Item Detail",
    "Quantity",
    "Price",
    "Total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.item,
      item.quantity,
      formatCurrency(item.amount / item.quantity),
      formatCurrency(item.amount)
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Total",
    "",
    formatCurrency(invoice.subtotal)
  );
  doc.font("Helvetica");
  doc
    .fontSize(10)
    .text(
      "Shop # 8, Subhan Allah Market, Near MashaAllah Godown, Dargah Road, Kabari Bazar, Shershah Karachi.",
      50,
      700,
      { align: "center", width: 500 }
    );
  doc.end();
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
