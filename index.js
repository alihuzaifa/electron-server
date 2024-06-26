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
    .fontSize(13).font("./fonts/LilitaOne-Regular.ttf")
    .text(invoice.heading, 50, 20, { align: "center" });
  doc
    .image("logo.png", 50, 45, { width: 80 })
    .fillColor("#444444")
    .fontSize(10).font("./fonts/LibreFranklin-SemiBoldItalic.ttf")
    .text("Azeem Badshah", 380, 50)
    .text(invoice.number1, 380, 65)
    .text(invoice.number2, 380, 80)
    .text("Mr Hamza", 200, 50, { align: "right" })
    .text(invoice.number3, 200, 65, { align: "right" })
    .text(invoice.number4, 200, 80, { align: "right" })
    .moveDown();
  doc
    .fillColor("#444444")
    .fontSize(16).font("./fonts/Shrikhand-Regular.ttf")
    .text(invoice.shopName, 50, 115, { align: "center" });
  doc.font("./fonts/LibreFranklin-SemiBoldItalic.ttf");

  doc
    .fontSize(10).font("./fonts/LibreFranklin-SemiBoldItalic.ttf")
    .text(
      invoice.shopDescription,
      50,
      140,
      { align: "center" }
    );

  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, 160)
    .lineTo(550, 160)
    .stroke();

  const customerInformationTop = 180;

  doc
    .fontSize(10)
    .font("./fonts/LilitaOne-Regular.ttf")
    .text("Name", 50, customerInformationTop);

  doc.font('./fonts/LibreFranklin-SemiBoldItalic.ttf').fontSize(10).text(invoice.name, 150, customerInformationTop);

  doc.font("./fonts/LilitaOne-Regular.ttf").fontSize(10)
    .text("Phone Number:", 50, customerInformationTop + 15)
  doc.font('./fonts/LibreFranklin-SemiBoldItalic.ttf').fontSize(10).text(invoice.phone, 150, customerInformationTop + 15);

  doc.font("./fonts/LilitaOne-Regular.ttf")
    .text("Invoice No:", 300, customerInformationTop);
  doc.font('./fonts/LibreFranklin-SemiBoldItalic.ttf').fontSize(10).text(invoice.invoice_nr, 450, customerInformationTop)
  doc.font("./fonts/LilitaOne-Regular.ttf").fontSize(10)
    .text("Date:", 300, customerInformationTop + 15);
  doc.font("./fonts/LibreFranklin-SemiBoldItalic.ttf").fontSize(10).text(invoice.date, 450, customerInformationTop + 15)
    .moveDown();

  let i;
  const invoiceTableTop = 245;

  doc.font("./fonts/LilitaOne-Regular.ttf").rect(50, invoiceTableTop - 10, 500, 30).fill('black').fillColor('white');
  generateTableRow(
    doc,
    invoiceTableTop,
    "Item Detail",
    "",
    "Quantity",
    "Price",
    "Total"
  );
  doc.font("./fonts/LibreFranklin-SemiBoldItalic.ttf").fillColor('black');
  for (i = 0; i < invoice.items.length; i++) {
    const item = invoice.items[i];
    const position = invoiceTableTop + (i + 1) * 25;
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

  const subtotalPosition = invoiceTableTop + (i + 1) * 25;
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
  doc.font("./fonts/LibreFranklin-SemiBoldItalic.ttf");
  doc
    .fontSize(10)
    .text(
      invoice.shopAddress,
      50,
      625,
      { align: "center", width: 500 }
    );
  doc
    .fontSize(10)
    .text(
      "Thank you for purchase",
      50,
      695,
      { align: "left", width: 500 }
    );
  doc
    .fontSize(10)
    .text(
      "Signature",
      50,
      700,
      { align: "right", width: 500 }
    );
  const lineSize = 174;
  const signatureHeight = 390;

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
