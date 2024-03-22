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
    .text("Invoice", 50, 30, { align: "center" });
  doc
    .image("logo.png", 50, 45, { width: 80 })
    .fillColor("#444444")
    .fontSize(10).font("Helvetica")
    .text("Azeem Badshah.", 200, 50, { align: "right" })
    .text("123 Main Street", 200, 65, { align: "right" })
    .text("New York, NY, 10025", 200, 80, { align: "right" })
    .moveDown();
  doc
    .fillColor("#444444")
    .fontSize(20).font("Helvetica-Bold")
    .text("AL NOOR CABLE MERCHANT", 50, 130, { align: "center" });
  doc.font("Helvetica");
  const lineSize = 174;
  const signatureHeight = 390;

  doc.fillAndStroke('#021c27');
  doc.strokeOpacity(0.2);

  const startLine1 = 128;
  const endLine1 = 128 + lineSize;
  doc
    .moveTo(startLine1, signatureHeight)
    .lineTo(endLine1, signatureHeight)
    .stroke();

  const startLine2 = endLine1 + 32;
  const endLine2 = startLine2 + lineSize;
  doc
    .moveTo(startLine2, signatureHeight)
    .lineTo(endLine2, signatureHeight)
    .stroke();

  const startLine3 = endLine2 + 32;
  const endLine3 = startLine3 + lineSize;
  doc
    .moveTo(startLine3, signatureHeight)
    .lineTo(endLine3, signatureHeight)
    .stroke();

  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .fill('#021c27')
    .text('John Doe', startLine1, signatureHeight + 10, {
      columns: 1,
      columnGap: 0,
      height: 40,
      width: lineSize,
      align: 'center',
    });

  doc
    .font('Helvetica')
    .fontSize(10)
    .fill('#021c27')
    .text('Associate Professor', startLine1, signatureHeight + 25, {
      columns: 1,
      columnGap: 0,
      height: 40,
      width: lineSize,
      align: 'center',
    });

  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .fill('#021c27')
    .text('Student Name', startLine2, signatureHeight + 10, {
      columns: 1,
      columnGap: 0,
      height: 40,
      width: lineSize,
      align: 'center',
    });

  doc
    .font('Helvetica')
    .fontSize(10)
    .fill('#021c27')
    .text('Student', startLine2, signatureHeight + 25, {
      columns: 1,
      columnGap: 0,
      height: 40,
      width: lineSize,
      align: 'center',
    });

  doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .fill('#021c27')
    .text('Jane Doe', startLine3, signatureHeight + 10, {
      columns: 1,
      columnGap: 0,
      height: 40,
      width: lineSize,
      align: 'center',
    });

  doc
    .font('Helvetica')
    .fontSize(10)
    .fill('#021c27')
    .text('Director', startLine3, signatureHeight + 25, {
      columns: 1,
      columnGap: 0,
      height: 40,
      width: lineSize,
      align: 'center',
    });

  jumpLine(doc, 4);
  // doc
  //   .fontSize(10)
  //   .text(
  //     "Power Cable, Electric Cable, Welding Cable, Internet Cable, Heat-Proof Cable & Water-Proof Cable",
  //     50,
  //     150,
  //     { align: "center", width: 500 }
  //   );

  // doc
  //   .strokeColor("#aaaaaa")
  //   .lineWidth(1)
  //   .moveTo(50, 185)
  //   .lineTo(550, 185)
  //   .stroke();

  // const customerInformationTop = 200;

  // doc
  //   .fontSize(10)
  //   .font("Helvetica-Bold")
  //   .text("Name", 50, customerInformationTop)
  //   .text("Ali Huzaifa", 150, customerInformationTop)
  //   .font("Helvetica-Bold")
  //   .text("Phone Number:", 50, customerInformationTop + 15)
  //   .text("0311-1260357", 150, customerInformationTop + 15)

  //   .font("Helvetica-Bold")
  //   .text("Invoice No:", 300, customerInformationTop)
  //   .text("123456", 450, customerInformationTop)
  //   .font("Helvetica-Bold")
  //   .text("Date:", 300, customerInformationTop + 15)
  //   .text("12/1/2024", 450, customerInformationTop + 15)
  //   .moveDown();
  // doc
  //   .strokeColor("#aaaaaa")
  //   .lineWidth(1)
  //   .moveTo(50, 252)
  //   .lineTo(550, 252)
  //   .stroke();
  // let i;
  // const invoiceTableTop = 300;

  // doc.font("Helvetica-Bold");
  // generateTableRow(
  //   doc,
  //   invoiceTableTop,
  //   "Item Detail",
  //   "Quantity",
  //   "Price",
  //   "Total"
  // );
  // generateHr(doc, invoiceTableTop + 20);
  // doc.font("Helvetica");

  // for (i = 0; i < invoice.items.length; i++) {
  //   const item = invoice.items[i];
  //   const position = invoiceTableTop + (i + 1) * 30;
  //   generateTableRow(
  //     doc,
  //     position,
  //     item.item,
  //     item.quantity,
  //     formatCurrency(item.amount / item.quantity),
  //     formatCurrency(item.amount)
  //   );

  //   generateHr(doc, position + 20);
  // }

  // const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  // generateTableRow(
  //   doc,
  //   subtotalPosition,
  //   "",
  //   "",
  //   "Total",
  //   "",
  //   formatCurrency(invoice.subtotal)
  // );
  // doc.font("Helvetica");
  // doc
  //   .fontSize(10)
  //   .text(
  //     "Shop # 8, Subhan Allah Market, Near MashaAllah Godown, Dargah Road, Kabari Bazar, Shershah Karachi.",
  //     50,
  //     700,
  //     { align: "center", width: 500 }
  //   );
  doc.end();
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
