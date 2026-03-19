import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ProposalData, CURRENCY_SYMBOLS } from '../types';

const generateInvoiceNumber = (): string => {
  const timestamp = Date.now().toString().slice(-6);
  return `INV-${timestamp.padStart(6, '0')}`;
};

export const generateProposalPDF = (data: ProposalData): jsPDF => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const currencySymbol = CURRENCY_SYMBOLS[data.currency];
  const invoiceNumber = generateInvoiceNumber();

  const leftMargin = 15;
  const rightMargin = pageWidth - 15;
  const boxWidth = (pageWidth - 30 - 10) / 2;

  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 50, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('InvoiceDesk', leftMargin, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 200, 200);
  doc.text('Official Project Proposal & Invoice', leftMargin, 28);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Invoice: ${invoiceNumber}`, rightMargin, 18, { align: 'right' });

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(180, 180, 180);
  doc.text(`Date: ${today}`, rightMargin, 28, { align: 'right' });

  let yPos = 63;

  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);

  doc.setFillColor(242, 242, 242);
  doc.rect(leftMargin, yPos, boxWidth, 35, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(leftMargin, yPos, boxWidth, 35);

  doc.setTextColor(107, 114, 128);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('FROM', leftMargin + 5, yPos + 4);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(data.freelancerName, leftMargin + 5, yPos + 12);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text(data.freelancerEmail, leftMargin + 5, yPos + 18);

  if (data.freelancerPhone) {
    doc.text(data.freelancerPhone, leftMargin + 5, yPos + 24);
  }

  const rightBoxX = leftMargin + boxWidth + 10;
  doc.setFillColor(242, 242, 242);
  doc.rect(rightBoxX, yPos, boxWidth, 35, 'F');
  doc.setDrawColor(200, 200, 200);
  doc.rect(rightBoxX, yPos, boxWidth, 35);

  doc.setTextColor(107, 114, 128);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('BILL TO', rightBoxX + 5, yPos + 4);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(data.clientName, rightBoxX + 5, yPos + 12);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text(data.clientEmail, rightBoxX + 5, yPos + 18);

  yPos += 45;

  doc.setTextColor(31, 41, 55);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(data.projectTitle, leftMargin, yPos);

  yPos += 8;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  const splitDescription = doc.splitTextToSize(data.projectDescription, pageWidth - 30);
  doc.text(splitDescription, leftMargin, yPos);

  yPos += Math.max(splitDescription.length * 4.5, 15);

  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.3);
  doc.line(leftMargin, yPos, rightMargin, yPos);

  yPos += 5;

  doc.setTextColor(107, 114, 128);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('PROPOSAL', leftMargin, yPos);

  yPos += 7;

  const tableData = data.services.map((service, index) => [
    service.name,
    service.quantity.toString(),
    `${currencySymbol}${service.price.toFixed(2)}`,
    `${currencySymbol}${(service.quantity * service.price).toFixed(2)}`,
  ]);

  const subtotal = data.services.reduce(
    (sum, service) => sum + service.quantity * service.price,
    0
  );

  autoTable(doc, {
    startY: yPos,
    head: [['Service', 'Qty', 'Unit Price', 'Total']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 9,
      halign: 'left',
      cellPadding: 5,
    },
    bodyStyles: {
      fontSize: 9,
      cellPadding: 5,
      lineColor: [220, 220, 220],
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
    styles: {
      lineColor: [220, 220, 220],
      lineWidth: 0.3,
    },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { halign: 'center', cellWidth: 25 },
      2: { halign: 'right', cellWidth: 35 },
      3: { halign: 'right', cellWidth: 35 },
    },
    didDrawPage: () => {
      return;
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 5;

  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.line(leftMargin, yPos, rightMargin, yPos);

  yPos += 8;

  const summaryBoxX = pageWidth - 105;
  const summaryBoxWidth = 90;

  doc.setFillColor(15, 23, 42);
  doc.rect(summaryBoxX, yPos, summaryBoxWidth, 12, 'F');
  doc.setDrawColor(15, 23, 42);

  doc.setTextColor(200, 200, 200);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Subtotal', summaryBoxX + 5, yPos + 4.5);

  doc.setTextColor(200, 200, 200);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(`${currencySymbol}${subtotal.toFixed(2)}`, summaryBoxX + summaryBoxWidth - 5, yPos + 4.5, {
    align: 'right',
  });

  doc.setFillColor(15, 23, 42);
  doc.rect(summaryBoxX, yPos + 12, summaryBoxWidth, 14, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('GRAND TOTAL', summaryBoxX + 5, yPos + 19);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`${currencySymbol}${subtotal.toFixed(2)}`, summaryBoxX + summaryBoxWidth - 5, yPos + 19, {
    align: 'right',
  });

  yPos += 32;

  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.3);
  doc.line(leftMargin, yPos, rightMargin, yPos);

  yPos += 5;

  doc.setTextColor(107, 114, 128);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE DETAILS', leftMargin, yPos);

  yPos += 8;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 41, 55);
  doc.text('Payment Terms:', leftMargin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text(data.paymentTerms, leftMargin + 40, yPos);

  yPos += 6;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(31, 41, 55);
  doc.text('Due Date:', leftMargin, yPos);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  const formattedDate = new Date(data.dueDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(formattedDate, leftMargin + 40, yPos);

  if (data.thankYouNote) {
    yPos += 15;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(107, 114, 128);
    const splitNote = doc.splitTextToSize(data.thankYouNote, pageWidth - 30);
    doc.text(splitNote, leftMargin, yPos);
  }

  const footerY = pageHeight - 8;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(156, 163, 175);
  doc.text(
    `Prepared by ${data.freelancerName} | ${invoiceNumber} | ${new Date().toLocaleDateString()}`,
    pageWidth / 2,
    footerY,
    { align: 'center' }
  );

  return doc;
};
