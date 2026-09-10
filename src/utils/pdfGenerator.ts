import jsPDF from 'jspdf';

interface Receipt {
  id: string;
  invoice_id: string;
  amount: number;
  payment_method: 'credit_card' | 'bank_transfer' | 'credit_note' | 'cash';
  paid_at: string;
  receipt_url: string;
  status: 'completed' | 'processing' | 'failed';
  description: string;
  reference_number: string;
}

// Helper function to convert number to words
const numberToWords = (num: number): string => {
  const ones = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];
  const tens = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];
  const teens = ['TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'];

  if (num === 0) return 'ZERO';

  const convertLessThanThousand = (n: number): string => {
    if (n === 0) return '';
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) {
      return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
    }
    return ones[Math.floor(n / 100)] + ' HUNDRED' + (n % 100 !== 0 ? ' ' + convertLessThanThousand(n % 100) : '');
  };

  let result = '';
  const billion = Math.floor(num / 1000000000);
  const million = Math.floor((num % 1000000000) / 1000000);
  const thousand = Math.floor((num % 1000000) / 1000);
  const remainder = num % 1000;

  if (billion > 0) result += convertLessThanThousand(billion) + ' BILLION ';
  if (million > 0) result += convertLessThanThousand(million) + ' MILLION ';
  if (thousand > 0) result += convertLessThanThousand(thousand) + ' THOUSAND ';
  if (remainder > 0) result += convertLessThanThousand(remainder);

  return result.trim();
};

export const generateReceiptPDF = (receipt: Receipt, language: string = 'en') => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Colors
  const black = [0, 0, 0];
  const gray = [128, 128, 128];

  // Hardcoded data
  const schoolData = {
    name: "King's College",
    location: 'BANGKOK',
    address: '727 Ratchadapisek Road, Bang Phongphang, Yannawa, Bangkok 10120, Thailand',
    phone: '+66 (0) 2481 9955',
    email: 'finance@kingsbangkok.ac.th',
    website: 'www.kingsbangkok.ac.th'
  };

  const studentData = {
    id: 'KC2025277',
    name: 'Harper Black',
    contactName: 'David Black',
    address: '',
    yearGroup: 'Year 7',
    schoolYear: '2025-2026'
  };

  const invoiceData = {
    no: 1,
    invoiceNo: receipt.invoice_id,
    invoiceDate: new Date(receipt.paid_at).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }),
    invoiceAmount: receipt.amount,
    receivedAmount: receipt.amount,
    outstandingAmount: 0
  };

  const paymentData = {
    method: receipt.payment_method === 'bank_transfer' ? 'bank-transfer' : receipt.payment_method,
    bankName: '-',
    bankBranch: '-',
    chequeNo: '-',
    chequeDate: '-'
  };

  // Start drawing PDF
  doc.setTextColor(black[0], black[1], black[2]);

  // Logo placeholder (using text)
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text("King's College", pageWidth / 2, 20, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  doc.text('INTERNATIONAL SCHOOL', pageWidth / 2, 25, { align: 'center' });

  // Location
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text(schoolData.location, pageWidth / 2, 35, { align: 'center' });

  // Address and contact
  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  doc.text(schoolData.address, pageWidth / 2, 42, { align: 'center' });
  doc.text(
    `${schoolData.phone}, ${schoolData.email}, ${schoolData.website}`,
    pageWidth / 2,
    47,
    { align: 'center' }
  );

  // RECEIPT header
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('RECEIPT', pageWidth / 2, 58, { align: 'center' });

  // Student and Receipt info section (two columns with proper spacing)
  const infoY = 70;
  doc.setFontSize(9);

  // Left column - Student info with proper spacing
  doc.setFont(undefined, 'normal');
  const leftLabelX = 15;
  const leftValueX = 50;

  doc.text('Student ID no.', leftLabelX, infoY);
  doc.text(studentData.id, leftValueX, infoY);

  doc.text('Student name', leftLabelX, infoY + 5);
  doc.text(studentData.name, leftValueX, infoY + 5);

  doc.text('Contact name', leftLabelX, infoY + 10);
  doc.text(studentData.contactName, leftValueX, infoY + 10);

  doc.text('Address', leftLabelX, infoY + 15);

  // Right column - Receipt info with proper alignment
  const receiptDate = new Date(receipt.paid_at).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const rightLabelX = pageWidth - 90;
  const rightValueX = pageWidth - 15;

  doc.text('Receipt no.', rightLabelX, infoY);
  doc.text(receipt.reference_number, rightValueX, infoY, { align: 'right' });

  doc.text('Receipt date', rightLabelX, infoY + 5);
  doc.text(receiptDate, rightValueX, infoY + 5, { align: 'right' });

  doc.text('Year group', rightLabelX, infoY + 10);
  doc.text(studentData.yearGroup, rightValueX, infoY + 10, { align: 'right' });

  doc.text('School year', rightLabelX, infoY + 15);
  doc.text(studentData.schoolYear, rightValueX, infoY + 15, { align: 'right' });

  // Invoice table with better spacing
  const tableY = infoY + 35;
  doc.setFontSize(8);

  // Table headers with borders
  const colWidths = [15, 40, 35, 30, 30, 30]; // Column widths
  let currentX = 15;

  // Draw header row background
  doc.setFillColor(245, 245, 245);
  doc.rect(15, tableY, pageWidth - 30, 12, 'F');
  doc.setDrawColor(0, 0, 0);
  doc.rect(15, tableY, pageWidth - 30, 12, 'S');

  // Draw vertical lines for columns
  currentX = 15;
  for (let i = 0; i < colWidths.length; i++) {
    if (i > 0) {
      doc.line(currentX, tableY, currentX, tableY + 12);
    }
    currentX += colWidths[i];
  }

  // Header text
  doc.setFont(undefined, 'bold');
  doc.text('No.', 18, tableY + 5);
  doc.text('Invoice no.', 32, tableY + 5);
  doc.text('Invoice date', 73, tableY + 5);
  doc.text('Invoice amount', 108, tableY + 5);
  doc.text('Received amount', 138, tableY + 5);
  doc.text('Outstanding amount', 168, tableY + 5);
  doc.setFontSize(7);
  doc.text('(THB)', 118, tableY + 9);
  doc.text('(THB)', 148, tableY + 9);
  doc.text('(THB)', 178, tableY + 9);

  // Table data row
  const rowY = tableY + 12;
  doc.setFontSize(8);
  doc.rect(15, rowY, pageWidth - 30, 10, 'S');

  // Draw vertical lines for data row
  currentX = 15;
  for (let i = 0; i < colWidths.length; i++) {
    if (i > 0) {
      doc.line(currentX, rowY, currentX, rowY + 10);
    }
    currentX += colWidths[i];
  }

  // Data
  doc.setFont(undefined, 'normal');
  doc.text(invoiceData.no.toString(), 22, rowY + 6, { align: 'center' });
  doc.text(invoiceData.invoiceNo, 32, rowY + 6);
  doc.text(invoiceData.invoiceDate, 73, rowY + 6);
  doc.text(invoiceData.invoiceAmount.toLocaleString('en-US', { minimumFractionDigits: 2 }), 133, rowY + 6, { align: 'right' });
  doc.text(invoiceData.receivedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 }), 163, rowY + 6, { align: 'right' });
  doc.text(invoiceData.outstandingAmount === 0 ? '-' : invoiceData.outstandingAmount.toLocaleString('en-US', { minimumFractionDigits: 2 }), 193, rowY + 6, { align: 'right' });

  // Amount in words and total
  const totalY = rowY + 17;
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  const bahtWhole = Math.floor(receipt.amount);
  const satang = Math.round((receipt.amount - bahtWhole) * 100);
  const amountInWords = numberToWords(bahtWhole) + ' BAHT' + (satang > 0 ? ' ' + numberToWords(satang) + ' SATANG' : '') + ' ONLY';
  doc.text(amountInWords, 20, totalY);

  doc.setFont(undefined, 'bold');
  doc.setFontSize(10);
  doc.text('TOTAL', 155, totalY);
  doc.text(`${receipt.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}-`, 195, totalY, { align: 'right' });

  // Payment method table with better layout
  const paymentTableY = totalY + 10;
  const payColWidths = [35, 35, 35, 35, 35];

  // Header row
  doc.setFillColor(245, 245, 245);
  doc.rect(15, paymentTableY, pageWidth - 30, 10, 'F');
  doc.setDrawColor(0, 0, 0);
  doc.rect(15, paymentTableY, pageWidth - 30, 10, 'S');

  // Vertical lines
  currentX = 15;
  for (let i = 0; i < payColWidths.length; i++) {
    if (i > 0) {
      doc.line(currentX, paymentTableY, currentX, paymentTableY + 10);
    }
    currentX += payColWidths[i];
  }

  doc.setFontSize(8);
  doc.setFont(undefined, 'bold');
  doc.text('Payment method', 32, paymentTableY + 6, { align: 'center' });
  doc.text('Bank name', 67, paymentTableY + 6, { align: 'center' });
  doc.text('Bank branch', 102, paymentTableY + 6, { align: 'center' });
  doc.text('Cheque no.', 137, paymentTableY + 6, { align: 'center' });
  doc.text('Cheque date', 172, paymentTableY + 6, { align: 'center' });

  // Payment data row
  const payDataY = paymentTableY + 10;
  doc.rect(15, payDataY, pageWidth - 30, 10, 'S');

  currentX = 15;
  for (let i = 0; i < payColWidths.length; i++) {
    if (i > 0) {
      doc.line(currentX, payDataY, currentX, payDataY + 10);
    }
    currentX += payColWidths[i];
  }

  doc.setFont(undefined, 'normal');
  doc.text(paymentData.method, 32, payDataY + 6, { align: 'center' });
  doc.text(paymentData.bankName, 67, payDataY + 6, { align: 'center' });
  doc.text(paymentData.bankBranch, 102, payDataY + 6, { align: 'center' });
  doc.text(paymentData.chequeNo, 137, payDataY + 6, { align: 'center' });
  doc.text(paymentData.chequeDate, 172, payDataY + 6, { align: 'center' });

  // Collector and signature
  const sigY = paymentTableY + 30;
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.text('System', 60, sigY, { align: 'center' });
  doc.text('Porntip Jansintrangkul', pageWidth - 60, sigY, { align: 'center' });
  doc.setFont(undefined, 'bold');
  doc.text('Collector', 60, sigY + 5, { align: 'center' });
  doc.text('Authorised signature', pageWidth - 60, sigY + 5, { align: 'center' });

  // Disclaimer
  doc.setFontSize(7);
  doc.setFont(undefined, 'italic');
  doc.setTextColor(gray[0], gray[1], gray[2]);
  doc.text(
    'In case of payment made by cheque, this receipt will not be valid until the cheque has been honoured by the bank.',
    pageWidth / 2,
    sigY + 15,
    { align: 'center', maxWidth: pageWidth - 30 }
  );

  // Download the PDF
  doc.save(`receipt-${receipt.reference_number}.pdf`);
};

interface InvoiceForPDF {
  id: string;
  description: string;
  amount_due: number;
  due_date: string;
  status: string;
  term?: string;
  studentName?: string;
  studentClass?: string;
}

export const generateInvoicePDF = (invoice: InvoiceForPDF) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  const schoolData = {
    name: "King's College",
    location: 'BANGKOK',
    address: '727 Ratchadapisek Road, Bang Phongphang, Yannawa, Bangkok 10120, Thailand',
    phone: '+66 (0) 2481 9955',
    email: 'finance@kingsbangkok.ac.th',
    website: 'www.kingsbangkok.ac.th'
  };

  // Header
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text(schoolData.name, pageWidth / 2, 20, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  doc.text('INTERNATIONAL SCHOOL', pageWidth / 2, 25, { align: 'center' });
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text(schoolData.location, pageWidth / 2, 33, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont(undefined, 'normal');
  doc.text(schoolData.address, pageWidth / 2, 39, { align: 'center' });
  doc.text(`${schoolData.phone}  |  ${schoolData.email}  |  ${schoolData.website}`, pageWidth / 2, 44, { align: 'center' });

  // Title
  doc.setFontSize(16);
  doc.setFont(undefined, 'bold');
  doc.text('INVOICE', pageWidth / 2, 55, { align: 'center' });

  // Divider
  doc.setDrawColor(0, 0, 0);
  doc.line(15, 59, pageWidth - 15, 59);

  // Info section
  const infoY = 67;
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');

  // Left
  doc.text('Student Name', 15, infoY);
  doc.text(':', 50, infoY);
  doc.text(invoice.studentName || '-', 54, infoY);

  doc.text('Class', 15, infoY + 6);
  doc.text(':', 50, infoY + 6);
  doc.text(invoice.studentClass || '-', 54, infoY + 6);

  if (invoice.term) {
    doc.text('Term', 15, infoY + 12);
    doc.text(':', 50, infoY + 12);
    doc.text(invoice.term, 54, infoY + 12);
  }

  // Right
  doc.text('Invoice No.', pageWidth - 90, infoY);
  doc.text(':', pageWidth - 50, infoY);
  doc.text(invoice.id, pageWidth - 46, infoY);

  doc.text('Due Date', pageWidth - 90, infoY + 6);
  doc.text(':', pageWidth - 50, infoY + 6);
  doc.text(new Date(invoice.due_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }), pageWidth - 46, infoY + 6);

  doc.text('Status', pageWidth - 90, infoY + 12);
  doc.text(':', pageWidth - 50, infoY + 12);
  doc.text(invoice.status.toUpperCase(), pageWidth - 46, infoY + 12);

  // Table
  const tableY = infoY + 26;
  doc.setFillColor(245, 245, 245);
  doc.rect(15, tableY, pageWidth - 30, 10, 'F');
  doc.rect(15, tableY, pageWidth - 30, 10, 'S');

  doc.setFont(undefined, 'bold');
  doc.setFontSize(8);
  doc.text('Description', 20, tableY + 6);
  doc.text('Amount (THB)', pageWidth - 18, tableY + 6, { align: 'right' });

  // Data row
  const rowY = tableY + 10;
  doc.rect(15, rowY, pageWidth - 30, 12, 'S');
  doc.setFont(undefined, 'normal');
  doc.text(invoice.description, 20, rowY + 7);
  doc.text(invoice.amount_due.toLocaleString('en-US', { minimumFractionDigits: 2 }), pageWidth - 18, rowY + 7, { align: 'right' });

  // Total
  const totalY = rowY + 20;
  doc.setFont(undefined, 'bold');
  doc.setFontSize(10);
  doc.text('TOTAL DUE', 15, totalY);
  doc.text(`THB ${invoice.amount_due.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, pageWidth - 15, totalY, { align: 'right' });
  doc.line(15, totalY + 3, pageWidth - 15, totalY + 3);

  // Amount in words
  const bahtWhole = Math.floor(invoice.amount_due);
  const satang = Math.round((invoice.amount_due - bahtWhole) * 100);
  const amountInWords = numberToWords(bahtWhole) + ' BAHT' + (satang > 0 ? ' ' + numberToWords(satang) + ' SATANG' : '') + ' ONLY';
  doc.setFontSize(8);
  doc.setFont(undefined, 'italic');
  doc.setTextColor(100, 100, 100);
  doc.text(amountInWords, 15, totalY + 10);

  doc.save(`invoice-${invoice.id}.pdf`);
};
