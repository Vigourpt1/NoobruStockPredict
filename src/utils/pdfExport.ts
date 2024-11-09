import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { OrderData } from '../types';
import { calculatePeriodMetrics } from './timeComparison';
import { calculateAnalytics } from './analytics';
import { formatDate } from './dateUtils';

interface PDFExportOptions {
  data: OrderData[];
  selectedPeriods: {
    type: string;
    period1: string;
    period2: string;
    customRange?: {
      start1: string;
      end1: string;
      start2: string;
      end2: string;
    };
  };
  activeTab: string;
  tabsData: {
    seasonal: HTMLElement | null;
    products: HTMLElement | null;
    orders: HTMLElement | null;
    customers: HTMLElement | null;
  };
}

export function generatePDF({ data, selectedPeriods, activeTab }: PDFExportOptions) {
  const doc = new jsPDF();
  let yPos = 20;

  // Helper function to format numbers
  const formatNumber = (num: number) => num.toLocaleString();
  const formatPercent = (num: number) => `${num > 0 ? '+' : ''}${num.toFixed(1)}%`;

  // Title
  doc.setFontSize(24);
  doc.setTextColor(41, 128, 185);
  doc.text('Sales Analytics Report', 20, yPos);
  yPos += 15;

  // Generation date
  doc.setFontSize(12);
  doc.setTextColor(80, 80, 80);
  doc.text(`Generated: ${formatDate(new Date())}`, 20, yPos);
  yPos += 15;

  // Period Information
  const period1Label = selectedPeriods.type === 'custom' 
    ? `${selectedPeriods.customRange?.start1} to ${selectedPeriods.customRange?.end1}`
    : selectedPeriods.period1;
  
  const period2Label = selectedPeriods.type === 'custom'
    ? `${selectedPeriods.customRange?.start2} to ${selectedPeriods.customRange?.end2}`
    : selectedPeriods.period2;

  const periodData = [
    ['Period Type:', selectedPeriods.type.charAt(0).toUpperCase() + selectedPeriods.type.slice(1)],
    ['First Period:', period1Label],
    ['Second Period:', period2Label]
  ];

  doc.autoTable({
    startY: yPos,
    head: [],
    body: periodData,
    theme: 'plain',
    styles: { fontSize: 10 },
    columnStyles: { 0: { fontStyle: 'bold' } }
  });

  yPos = (doc as any).lastAutoTable.finalY + 20;

  // Add metrics based on the active tab
  const metrics = calculatePeriodMetrics(data);
  const analytics = calculateAnalytics(data);

  const metricsData = [
    ['Metric', 'Value', 'Change'],
    ['Total Orders', formatNumber(metrics.totalOrders), formatPercent(analytics.monthOverMonthGrowth)],
    ['Total Items', formatNumber(metrics.totalItems), formatPercent((metrics.totalItems / analytics.totalOrders - 1) * 100)],
    ['Average Order Size', metrics.averageOrderSize.toFixed(1), formatPercent((metrics.averageOrderSize / analytics.averageOrderSize - 1) * 100)]
  ];

  doc.autoTable({
    startY: yPos,
    head: [metricsData[0]],
    body: metricsData.slice(1),
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185] }
  });

  // Add page numbers
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }

  doc.save('sales-analytics-report.pdf');
}