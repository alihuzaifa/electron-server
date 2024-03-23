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
    .fontSize(12).font("Helvetica-Bold")
    .text(invoice.heading, 50, 30, { align: "center" });
  doc
    .image("logo.png", 50, 45, { width: 80 })
    .fillColor("#444444")
    .fontSize(10).font("Helvetica")
    .text("Azeem Badshah", 250, 50)
    .text(invoice.number1, 250, 65)
    .text(invoice.number2, 250, 80)
    .text("Hamza", 200, 50, { align: "right" })
    .text(invoice.number3, 200, 65, { align: "right" })
    .text(invoice.number4, 200, 80, { align: "right" })
    .moveDown();
  doc
    .fillColor("#444444")
    .fontSize(14).font("Helvetica-Bold")
    .text(invoice.shopName, 50, 110, { align: "center" });
  doc.font("Helvetica");

  doc
    .fontSize(10).font("Helvetica")
    .text(
      invoice.shopDescription,
      50,
      130,
      { align: "center" }
    );

  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, 150)
    .lineTo(550, 150)
    .stroke();

  const customerInformationTop = 170;

  doc
    .fontSize(10)
    .font("Helvetica-Bold")
    .text("Name", 50, customerInformationTop);

  doc.font('Helvetica').fontSize(10).text(invoice.name, 150, customerInformationTop);

  doc.font("Helvetica-Bold").fontSize(10)
    .text("Phone Number:", 50, customerInformationTop + 15)
  doc.font('Helvetica').fontSize(10).text(invoice.phone, 150, customerInformationTop + 15);

  doc.font("Helvetica-Bold")
    .text("Invoice No:", 300, customerInformationTop);
  doc.font('Helvetica').fontSize(10).text(invoice.invoice_nr, 450, customerInformationTop)
  doc.font("Helvetica-Bold").fontSize(10)
    .text("Date:", 300, customerInformationTop + 15);
  doc.font("Helvetica").fontSize(10).text(invoice.date, 450, customerInformationTop + 15)
    .moveDown();
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, 212)
    .lineTo(550, 212)
    .stroke();


  let i;
  const invoiceTableTop = 225;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Item Detail",
    "",
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
      item?.name?.label,
      "",
      item.sellingQuantity,
      item.sellingPrice.toLocaleString(),
      item?.totalPrice.toLocaleString()
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "",
    "Total",
    invoice.items?.reduce((acc, { totalPrice }) => acc + totalPrice, 0).toLocaleString() ?? 0,
    "",
  );
  doc.font("Helvetica");
  doc
    .fontSize(10)
    .text(
      invoice.shopAddress,
      50,
      635,
      { align: "center", width: 500 }
    );
  doc
    .fontSize(10)
    .text(
      "Thank you for purchase",
      50,
      705,
      { align: "left", width: 500 }
    );
  doc
    .fontSize(10)
    .text(
      "Signature",
      50,
      708,
      { align: "right", width: 500 }
    );
  const lineSize = 174;
  const signatureHeight = 390;
  // const endLine3 = startLine3 + lineSize;

  const endLine2 = 128
    + 174 + 120 + lineSize
  doc
    .moveTo(128 + 174 + 120, signatureHeight + 300)
    .lineTo(endLine2, signatureHeight + 300)
    .stroke();
  doc.end();
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
