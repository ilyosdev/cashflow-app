import { Injectable } from '@nestjs/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable()
export class ExportService {
  exportToCSV<T extends Record<string, any>>(
    data: T[],
    filename: string,
  ): Buffer {
    if (data.length === 0) {
      return Buffer.from('');
    }

    const headers = Object.keys(data[0]);
    const csvRows: string[] = [];

    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = headers.map((header) => {
        const value = row[header];
        const stringValue = value === null || value === undefined ? '' : String(value);
        return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
      });
      csvRows.push(values.join(','));
    }

    const csvString = csvRows.join('\n');
    return Buffer.from(csvString, 'utf-8');
  }

  exportRevenueToPDF(
    data: any[],
    total: number,
    dateRange: { startDate: Date; endDate: Date },
  ): Buffer {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Revenue Report', 14, 22);
    
    doc.setFontSize(10);
    doc.text(`Date Range: ${dateRange.startDate.toDateString()} - ${dateRange.endDate.toDateString()}`, 14, 30);
    doc.text(`Total Revenue: $${total.toLocaleString()}`, 14, 36);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 42);

    const tableData = data.map((item) => [
      item.id,
      item.clientName || '-',
      item.amount,
      item.currency,
      new Date(item.paymentDate).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [['ID', 'Client', 'Amount', 'Currency', 'Date']],
      body: tableData,
      startY: 50,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [14, 165, 233] },
    });

    return Buffer.from(doc.output('arraybuffer'));
  }

  exportExpensesToPDF(
    data: any[],
    total: number,
    dateRange: { startDate: Date; endDate: Date },
  ): Buffer {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Expenses Report', 14, 22);
    
    doc.setFontSize(10);
    doc.text(`Date Range: ${dateRange.startDate.toDateString()} - ${dateRange.endDate.toDateString()}`, 14, 30);
    doc.text(`Total Expenses: $${total.toLocaleString()}`, 14, 36);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 42);

    const tableData = data.map((item) => [
      item.id,
      item.type,
      item.description,
      item.vendor || '-',
      item.amount,
      item.currency,
      new Date(item.paidDate).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [['ID', 'Type', 'Description', 'Vendor', 'Amount', 'Currency', 'Date']],
      body: tableData,
      startY: 50,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [239, 68, 68] },
    });

    return Buffer.from(doc.output('arraybuffer'));
  }

  exportCashFlowToPDF(
    revenue: number,
    expenses: number,
    net: number,
    dateRange: { startDate: Date; endDate: Date },
  ): Buffer {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Cash Flow Statement', 14, 22);
    
    doc.setFontSize(10);
    doc.text(`Date Range: ${dateRange.startDate.toDateString()} - ${dateRange.endDate.toDateString()}`, 14, 30);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 36);

    const tableData = [
      ['Total Revenue', `$${revenue.toLocaleString()}`],
      ['Total Expenses', `$${expenses.toLocaleString()}`],
      ['Net Cash Flow', `$${net.toLocaleString()}`],
    ];

    autoTable(doc, {
      head: [['Category', 'Amount']],
      body: tableData,
      startY: 50,
      styles: { fontSize: 12 },
      headStyles: { fillColor: [34, 197, 94] },
      columnStyles: {
        0: { fontStyle: 'bold' },
      },
    });

    return Buffer.from(doc.output('arraybuffer'));
  }
}
