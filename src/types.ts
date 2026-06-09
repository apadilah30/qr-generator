export type QRCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type QRLogoType = 'none' | 'preset-web' | 'preset-wifi' | 'preset-mail' | 'preset-phone' | 'custom';

export type PDFLayoutType = 'clean' | 'badge' | 'poster' | 'minimalist';

export interface QRConfig {
  id: string;
  title: string;       // Custom title for the PDF and QR
  subtitle: string;    // Secondary subtitle (optional)
  content: string;     // URL, Text, etc.
  fgColor: string;     // Color of the QR pixels
  bgColor: string;     // Background color
  correctionLevel: QRCorrectionLevel;
  margin: number;
  logoType: QRLogoType;
  logoUrl?: string;    // Base64 or local asset URL
  pdfLayout: PDFLayoutType;
  dateCreated: string;
}

export interface HistoryItem extends QRConfig {}
