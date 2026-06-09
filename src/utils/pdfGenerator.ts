import { jsPDF } from 'jspdf';
import { QRConfig } from '../types';

/**
 * Utility to generate a high-quality PDF containing the custom QR code and specific title.
 */
export function generatePdf(config: QRConfig, qrCanvas: HTMLCanvasElement): void {
  // Create a new A4 PDF page (210mm wide x 297mm high)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 20;

  // Get QR Image as PNG data URL from the canvas
  const qrDataUrl = qrCanvas.toDataURL('image/png');

  // Convert hex color to RGB
  const hexToRgb = (hex: string) => {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
    const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
    const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
    return { r, g, b };
  };

  const primaryRgb = hexToRgb(config.fgColor);
  const bgRgb = hexToRgb(config.bgColor);

  switch (config.pdfLayout) {
    case 'poster':
      // === POSTER LAYOUT (Modern attention-grabbing sign) ===
      // Background Accent (subtle top border or split color)
      doc.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
      doc.rect(0, 0, pageWidth, 15, 'F');

      // "SCAN ME / PINDAI DI SINI" header banner
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(28);
      doc.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
      doc.text('PINDAI DI SINI', pageWidth / 2, 45, { align: 'center' });

      // Frame for QR
      doc.setDrawColor(230, 230, 230);
      doc.setFillColor(bgRgb.r, bgRgb.g, bgRgb.b);
      doc.roundedRect(pageWidth / 2 - 60, 65, 120, 120, 4, 4, 'FD');

      // QR Image centered inside frame
      doc.addImage(qrDataUrl, 'PNG', pageWidth / 2 - 55, 70, 110, 110);

      // Custom main Title (Title Khusus)
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(40, 40, 40);
      const posterTitleLines = doc.splitTextToSize(config.title.toUpperCase(), pageWidth - 40);
      doc.text(posterTitleLines, pageWidth / 2, 205, { align: 'center' });

      // Subtitle / Action message
      if (config.subtitle) {
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        const posterSubtitleLines = doc.splitTextToSize(config.subtitle, pageWidth - 50);
        doc.text(posterSubtitleLines, pageWidth / 2, 220, { align: 'center' });
      }

      // Small target content description at the bottom
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(140, 140, 140);
      const posterContentTruncated = config.content.length > 50 
        ? config.content.substring(0, 47) + '...' 
        : config.content;
      doc.text(`Tujuan: ${posterContentTruncated}`, pageWidth / 2, 255, { align: 'center' });

      // Decorative divider & Logo footer
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.3);
      doc.line(marginX, 265, pageWidth - marginX, 265);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(160, 160, 160);
      doc.text('Sistem QR PDF Generator Autentik', pageWidth / 2, 275, { align: 'center' });
      break;

    case 'badge':
      // === BADGE / LABEL LAYOUT (Table top tent or card) ===
      // Draw outer guideline border simulating a table stand or card cutout
      doc.setDrawColor(180, 180, 180);
      doc.setLineDashPattern([2, 2], 0);
      doc.rect(15, 15, pageWidth - 30, pageHeight - 30, 'D');
      doc.setLineDashPattern([], 0); // Reset dash

      // Header strip in Badge
      doc.setFillColor(245, 245, 247);
      doc.rect(16, 16, pageWidth - 32, 25, 'F');
      
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(60, 60, 60);
      doc.text('DOKUMEN QR RESMI', pageWidth / 2, 32, { align: 'center' });

      // Draw standard double lines
      doc.setDrawColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
      doc.setLineWidth(1);
      doc.line(20, 41, pageWidth - 20, 41);

      // Title
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(20, 20, 20);
      const titleLinesBadge = doc.splitTextToSize(config.title, pageWidth - 40);
      doc.text(titleLinesBadge, pageWidth / 2, 60, { align: 'center' });

      // Subtitle
      if (config.subtitle) {
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(110, 110, 110);
        const subLinesBadge = doc.splitTextToSize(config.subtitle, pageWidth - 45);
        doc.text(subLinesBadge, pageWidth / 2, 75, { align: 'center' });
      }

      // Rounded frame for QR code
      const qrY = 95;
      doc.setDrawColor(210, 210, 215);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(pageWidth / 2 - 50, qrY, 100, 100, 3, 3, 'FD');

      // Draw QR Image
      doc.addImage(qrDataUrl, 'PNG', pageWidth / 2 - 45, qrY + 5, 90, 90);

      // Sub-QR Instructions
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text('Pindai kode QR di atas menggunakan kamera ponsel atau aplikasi pemindai.', pageWidth / 2, qrY + 112, { align: 'center' });

      // Action content block
      const blockY = 225;
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(25, blockY, pageWidth - 50, 28, 2, 2, 'F');
      
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text('TAUTAN / TEKS ASLI:', 30, blockY + 8);
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      const contentLinesBadge = doc.splitTextToSize(config.content, pageWidth - 65);
      doc.text(contentLinesBadge, 30, blockY + 16);

      // Footer
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(150, 150, 150);
      doc.text(`ID Kode: ${config.id} | Dibuat pada: ${config.dateCreated}`, pageWidth / 2, pageHeight - 20, { align: 'center' });
      break;

    case 'minimalist':
      // === MINIMALIST LAYOUT (Clean, modern aesthetic, zero distractions) ===
      // Minimal Header Date-stamp
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text(config.dateCreated, marginX, 30);
      
      // Fine elegant grid line
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(0.3);
      doc.line(marginX, 35, pageWidth - marginX, 35);

      // Clean Title
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(15, 23, 42); // slate-900
      const minTitleLines = doc.splitTextToSize(config.title, pageWidth - 40);
      doc.text(minTitleLines, marginX, 50);

      // Subtitle
      if (config.subtitle) {
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(12);
        doc.setTextColor(71, 85, 105); // slate-600
        const minSubLines = doc.splitTextToSize(config.subtitle, pageWidth - 40);
        doc.text(minSubLines, marginX, 59 + (minTitleLines.length - 1) * 6);
      }

      // Centered QR Image with minimalist drop border
      const contentOffset = (minTitleLines.length - 1) * 6 + (config.subtitle ? 15 : 5);
      const minQrY = 70 + contentOffset;
      const minQrSize = 100;
      doc.addImage(qrDataUrl, 'PNG', pageWidth / 2 - minQrSize / 2, minQrY, minQrSize, minQrSize);

      // Metadata info beneath
      const metaY = minQrY + minQrSize + 25;
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('Informasi Dekripsi:', marginX, metaY);
      
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      const truncatedContentMin = config.content.length > 70 
        ? config.content.substring(0, 67) + '...' 
        : config.content;
      doc.text(truncatedContentMin, marginX + 32, metaY);

      // Simple footer
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(160, 174, 192);
      doc.text('Keaslian Dokumen Terverifikasi QR PDF', marginX, pageHeight - 25);
      break;

    case 'clean':
    default:
      // === EXECUTIVE CLEAN LAYOUT (Default pristine visual theme with headers) ===
      // Top header graphic
      doc.setFillColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
      doc.rect(0, 0, pageWidth, 8, 'F');

      // Visual accents
      doc.setFillColor(bgRgb.r, bgRgb.g, bgRgb.b);
      doc.rect(marginX, 25, 6, 20, 'F');

      // "Sertifikat / Lembar QR" label
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(primaryRgb.r, primaryRgb.g, primaryRgb.b);
      doc.text('DOKUMEN DENGAN KODE QR', marginX, 22);

      // Master Title
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(24);
      doc.setTextColor(26, 32, 44); // dark navy/charcoal
      const titleLines = doc.splitTextToSize(config.title, pageWidth - 45);
      doc.text(titleLines, marginX, 33);

      let currentY = 35 + (titleLines.length * 6);

      // Subtitle
      if (config.subtitle) {
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(13);
        doc.setTextColor(74, 85, 104);
        const subtitleLines = doc.splitTextToSize(config.subtitle, pageWidth - 45);
        doc.text(subtitleLines, marginX, currentY);
        currentY += (subtitleLines.length * 5) + 5;
      } else {
        currentY += 5;
      }

      // Elegant divider rule
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(marginX, currentY, pageWidth - marginX, currentY);
      currentY += 15;

      // QR Code centered frame
      const qrSize = 95;
      const qrX = (pageWidth - qrSize) / 2;
      
      // Frame shadow simulation
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(qrX - 4, currentY - 4, qrSize + 8, qrSize + 8, 3, 3, 'F');
      
      // Border outline
      doc.setDrawColor(203, 213, 225);
      doc.setLineWidth(0.2);
      doc.roundedRect(qrX - 5, currentY - 5, qrSize + 10, qrSize + 10, 4, 4, 'D');

      // Place QR code image
      doc.addImage(qrDataUrl, 'PNG', qrX, currentY, qrSize, qrSize);
      currentY += qrSize + 15;

      // Scan Instructions box
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(marginX, currentY, pageWidth - (marginX * 2), 15, 2, 2, 'F');
      
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      doc.text('INSTRUKSI PINDAI:', marginX + 5, currentY + 9);
      
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      doc.text('Arahkan kamera Anda ke kode QR untuk membuka tautan.', marginX + 40, currentY + 9);
      
      currentY += 28;

      // Content Detail Panel
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(26, 32, 44);
      doc.text('Detail Isi / Tautan QR:', marginX, currentY);
      currentY += 6;

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(74, 85, 104);
      const contentLines = doc.splitTextToSize(config.content, pageWidth - (marginX * 2));
      doc.text(contentLines, marginX, currentY);

      // Bottom Footer area
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(marginX, pageHeight - 25, pageWidth - marginX, pageHeight - 25);

      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(160, 174, 192);
      doc.text(`PKBM Aluna`, marginX, pageHeight - 18);
      doc.text(`Tahun Ajaran 2025/2026`, pageWidth - marginX - 45, pageHeight - 18);
      break;
  }

  // Create a clean filename from title
  const sanitizedTitle = config.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const filename = sanitizedTitle ? `qr-${sanitizedTitle}.pdf` : `qr-code-${config.id}.pdf`;

  // Save the document
  doc.save(filename);
}
