import React, { useRef, useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { QRConfig } from '../types';
import { generatePdf } from '../utils/pdfGenerator';
import { 
  FileDown, 
  Download, 
  Copy, 
  Check, 
  Sparkles,
  RefreshCw,
  QrCode,
  ArrowRight,
  Eye
} from 'lucide-react';

interface QRPreviewProps {
  config: QRConfig;
  onSaveToHistory: (config: QRConfig) => void;
}

export default function QRPreview({ config, onSaveToHistory }: QRPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  // Redraw QR and Logo when config changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsRendered(false);
    setErrorText(null);

    // Default content if empty
    const qrContent = config.content.trim() || 'https://ai.studio/build';

    // QR Configuration options
    const options = {
      width: 400,
      margin: config.margin,
      errorCorrectionLevel: config.correctionLevel,
      color: {
        dark: config.fgColor,
        light: config.bgColor,
      }
    };

    QRCode.toCanvas(canvas, qrContent, options, (error) => {
      if (error) {
        console.error('QR Generator Error:', error);
        setErrorText('Gagal membuat QR. Teks terlalu panjang untuk level koreksi ini.');
        return;
      }

      // If there is an overlay logo, draw it in the center
      if (config.logoType !== 'none' && config.logoUrl) {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsRendered(true);
          return;
        }

        const logoImg = new Image();
        logoImg.onload = () => {
          // Calculate proportional logo size (usually 20-22% of QR code width)
          const logoSize = canvas.width * 0.20;
          const x = (canvas.width - logoSize) / 2;
          const y = (canvas.height - logoSize) / 2;

          // Draw a background container for the logo to separate it from the QR pixels
          ctx.fillStyle = config.bgColor;
          
          // Render solid background block (rounded or circle)
          ctx.beginPath();
          const padding = 6;
          ctx.roundRect 
            ? ctx.roundRect(x - padding, y - padding, logoSize + (padding * 2), logoSize + (padding * 2), 10)
            : ctx.rect(x - padding, y - padding, logoSize + (padding * 2), logoSize + (padding * 2));
          ctx.fill();

          // Draw circular brand circle border around custom logos
          ctx.strokeStyle = config.fgColor;
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Draw the loaded logo in the center
          ctx.drawImage(logoImg, x, y, logoSize, logoSize);
          setIsRendered(true);
        };

        logoImg.onerror = () => {
          console.error("Gagal memuat logo overlay.");
          setIsRendered(true); // fall back to regular render
        };

        logoImg.src = config.logoUrl;
      } else {
        setIsRendered(true);
      }
    });
  }, [config]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(config.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    
    // Clean name
    const cleanTitle = config.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').substring(0, 30);
    link.download = cleanTitle ? `qr-code-${cleanTitle}.png` : `qr-code-${config.id}.png`;
    link.href = dataUrl;
    link.click();
    
    // Save to history automatically on download
    onSaveToHistory(config);
  };

  const handleDownloadPdf = () => {
    const canvas = canvasRef.current;
    if (!canvas || !isRendered) return;

    // Call PDF generator
    generatePdf(config, canvas);

    // Save to history
    onSaveToHistory(config);
  };

  return (
    <div id="qr-preview-container" className="bg-[#131722]/60 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between h-full space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <Eye className="w-4 h-4 text-indigo-400" />
            Live Preview QR &amp; PDF
          </h3>
          <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Terhubung
          </span>
        </div>

        {/* QR Code Canvas container */}
        <div className="relative flex flex-col items-center justify-center bg-slate-950/40 rounded-2xl border border-slate-800/80 p-4 sm:p-6 shadow-inner min-h-[200px] sm:min-h-[260px] group transition-all">
          
          <div className="relative max-w-[140px] sm:max-w-[180px] md:max-w-[200px] w-full aspect-square rounded-2xl bg-white shadow-xl p-3 border border-slate-800/10 group-hover:scale-[1.015] transition-transform duration-300">
            {errorText ? (
              <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-[11px] text-rose-500 font-medium bg-slate-950 rounded-2xl">
                {errorText}
              </div>
            ) : (
              <canvas 
                ref={canvasRef} 
                id="qr-canvas-element"
                className="!w-full !h-full block object-contain"
                style={{ width: '100%', height: '100%', maxWidth: '100%', maxHeight: '100%' }}
              />
            )}
            
            {/* Loading Cover */}
            {!isRendered && !errorText && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 rounded-2xl border border-slate-800">
                <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
                <span className="text-[10px] text-slate-500 font-medium mt-2">Merender QR...</span>
              </div>
            )}
          </div>

          <div className="mt-3 text-center min-w-0 w-full px-2">
            <h4 className="text-sm font-bold text-slate-200 truncate max-w-full">
              {config.title || 'Tanpa Judul Khusus'}
            </h4>
            {config.subtitle && (
              <p className="text-xs text-slate-500 truncate max-w-full mt-1">
                {config.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Selected PDF Template Meta visualizer */}
        <div className="mt-4 p-3.5 bg-slate-950/40 rounded-xl border border-slate-850 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/10">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider">Desain Template Dokumen</span>
              <span className="block text-xs font-bold text-slate-300 capitalize">
                Gaya {config.pdfLayout === 'clean' ? 'Executive Clean' : config.pdfLayout}
              </span>
            </div>
          </div>
          <span className="text-[9px] font-bold text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">
            A4 Cetak
          </span>
        </div>
      </div>

      {/* Primary Actions Button section */}
      <div className="space-y-3">
        {/* DOWNLOAD PDF BUTTON */}
        <button
          id="btn-download-pdf"
          type="button"
          disabled={!isRendered || errorText !== null}
          onClick={handleDownloadPdf}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-50 disabled:pointer-events-none text-white rounded-xl font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-indigo-600/10 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
        >
          <FileDown className="w-4.5 h-4.5" />
          Unduh PDF dengan Judul
        </button>

        {/* Secondary Downloads */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* DOWNLOAD PNG BUTTON */}
          <button
            id="btn-download-png"
            type="button"
            disabled={!isRendered || errorText !== null}
            onClick={handleDownloadPng}
            className="py-2.5 px-3 border border-slate-800 bg-slate-950/40 hover:bg-slate-900/20 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Piksel PNG
          </button>

          {/* COPY URL BUTTON */}
          <button
            id="btn-copy-content"
            type="button"
            onClick={handleCopy}
            className="py-2.5 px-3 border border-slate-800 bg-slate-950/40 hover:bg-slate-900/20 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl font-bold text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Berhasil
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Salin Konten
              </>
            )}
          </button>
        </div>
        
        <p className="text-[10px] text-slate-500 text-center">
          Format PDF terarah presisi otomatis siap potong atau jepit untuk hasil cetak.
        </p>
      </div>
    </div>
  );
}
