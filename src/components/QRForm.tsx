import React, { useState, useRef } from 'react';
import { QRConfig, QRCorrectionLevel, QRLogoType, PDFLayoutType } from '../types';
import { 
  Palette, 
  Settings, 
  QrCode, 
  FileText, 
  Upload, 
  FileCode, 
  Type, 
  Info, 
  Sparkles,
  Link,
  Wifi,
  Mail,
  Phone,
  Image as ImageIcon
} from 'lucide-react';

interface QRFormProps {
  config: QRConfig;
  onChange: (updatedConfig: QRConfig) => void;
}

// Preset color palettes
const PRESET_FOREGROUNDS = [
  { name: 'Slate Dark (Default)', hex: '#0f172a' },
  { name: 'Royal Indigo', hex: '#3730a3' },
  { name: 'Forest Emerald', hex: '#065f46' },
  { name: 'Ruby Crimson', hex: '#9f1239' },
  { name: 'Rust Terracotta', hex: '#9a3412' },
  { name: 'Pure Charcoal', hex: '#171717' },
];

const PRESET_BACKGROUNDS = [
  { name: 'White', hex: '#ffffff' },
  { name: 'Parchment Cream', hex: '#fafaf9' },
  { name: 'Ice Blue', hex: '#f0f9ff' },
  { name: 'Mint Green', hex: '#f0fdf4' },
];

// SVGs strings formatted as Base64/DataURL for center logo previews
const PRESET_LOGOS_DATA = {
  'preset-web': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',
  'preset-wifi': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-wifi"><path d="M12 20h.01"/><path d="M8.5 16.5a5 5 0 0 1 7 0"/><path d="M5 13a10 10 0 0 1 14 0"/><path d="M1.5 9.5a15 15 0 0 1 21 0"/></svg>',
  'preset-mail': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
  'preset-phone': 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
};

export default function QRForm({ config, onChange }: QRFormProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'pdf'>('content');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateField = (field: keyof QRConfig, value: any) => {
    onChange({
      ...config,
      [field]: value
    });
  };

  const handleCustomLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onChange({
            ...config,
            logoType: 'custom',
            logoUrl: reader.result
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPresetLogo = (type: QRLogoType) => {
    if (type === 'none') {
      onChange({
        ...config,
        logoType: 'none',
        logoUrl: undefined
      });
    } else if (type === 'custom') {
      fileInputRef.current?.click();
    } else {
      onChange({
        ...config,
        logoType: type,
        logoUrl: PRESET_LOGOS_DATA[type as keyof typeof PRESET_LOGOS_DATA]
      });
    }
  };

  return (
    <div id="qr-form-container" className="bg-[#131722]/60 border border-slate-800 rounded-3xl overflow-hidden flex flex-col h-full">
      {/* Navigation tabs */}
      <div className="flex border-b border-slate-800/80 bg-slate-950/40">
        <button
          id="tab-content-btn"
          type="button"
          onClick={() => setActiveTab('content')}
          className={`flex-1 py-4 px-2 sm:px-4 font-bold text-[10px] tracking-wider uppercase flex items-center justify-center gap-1.5 sm:gap-2 border-b-2 transition-all duration-200 ${
            activeTab === 'content'
              ? 'border-indigo-500 text-white bg-slate-950/20'
              : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-900/10'
          }`}
        >
          <QrCode className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="hidden sm:inline">KONTEN &amp; JUDUL</span>
          <span className="sm:hidden">KONTEN</span>
        </button>
        <button
          id="tab-design-btn"
          type="button"
          onClick={() => setActiveTab('design')}
          className={`flex-1 py-4 px-2 sm:px-4 font-bold text-[10px] tracking-wider uppercase flex items-center justify-center gap-1.5 sm:gap-2 border-b-2 transition-all duration-200 ${
            activeTab === 'design'
              ? 'border-indigo-500 text-white bg-slate-950/20'
              : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-900/10'
          }`}
        >
          <Palette className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="hidden sm:inline">DESAIN QR</span>
          <span className="sm:hidden">DESAIN</span>
        </button>
        <button
          id="tab-pdf-btn"
          type="button"
          onClick={() => setActiveTab('pdf')}
          className={`flex-1 py-4 px-2 sm:px-4 font-bold text-[10px] tracking-wider uppercase flex items-center justify-center gap-1.5 sm:gap-2 border-b-2 transition-all duration-200 ${
            activeTab === 'pdf'
              ? 'border-indigo-500 text-white bg-slate-950/20'
              : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-900/10'
          }`}
        >
          <FileText className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="hidden sm:inline">TATA LETAK PDF</span>
          <span className="sm:hidden">LAYOUT</span>
        </button>
      </div>

      {/* Form content block */}
      <div className="p-6 flex-grow overflow-y-auto space-y-5">
        
        {/*=== TAB 1: KONTEN & JUDUL ===*/}
        {activeTab === 'content' && (
          <div className="space-y-4 fade-in">
            {/* Custom Specific Title Section */}
            <div>
              <span className="text-[9px] font-bold text-indigo-400 tracking-wider uppercase block mb-1">01. Metadata Lembaran</span>
              <label htmlFor="qr-title-input" className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-indigo-500" />
                Judul Khusus (Tampil di PDF) <span className="text-rose-500">*</span>
              </label>
              <input
                id="qr-title-input"
                type="text"
                required
                value={config.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="Contoh: Menu Makanan Kafe Lestari, Meja 12..."
                className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all text-slate-100 font-medium placeholder-slate-700"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Judul unik untuk mengidentifikasi lembaran PDF QR hasil cetakan.
              </p>
            </div>

            {/* Subtitle Section */}
            <div>
              <label htmlFor="qr-subtitle-input" className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Sub-Judul / Keterangan Tambahan (Opsional)
              </label>
              <input
                id="qr-subtitle-input"
                type="text"
                value={config.subtitle}
                onChange={(e) => updateField('subtitle', e.target.value)}
                placeholder="Contoh: Silakan pindai untuk melihat daftar menu lengkap kami"
                className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all text-slate-100 placeholder-slate-700"
              />
            </div>

            {/* Main Content QR Section */}
            <div>
              <span className="text-[9px] font-bold text-indigo-400 tracking-wider uppercase block mb-1">02. Input Pola QR</span>
              <label htmlFor="qr-content-input" className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Link className="w-3.5 h-3.5 text-indigo-500" />
                Isi Data / Tautan URL QR <span className="text-rose-500">*</span>
              </label>
              <textarea
                id="qr-content-input"
                rows={3}
                required
                value={config.content}
                onChange={(e) => updateField('content', e.target.value)}
                placeholder="Masukkan link website (https://...) atau teks yang akan dikonversi menjadi QR Code"
                className="w-full px-4 py-3 bg-slate-950/50 border border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all text-slate-100 placeholder-slate-700 font-mono resize-none leading-relaxed"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Semakin panjang teks, modul QR akan semakin padat. Gunakan shortener link jika perlu.
              </p>
            </div>
            
            {/* Tip Banner */}
            <div className="bg-indigo-950/20 rounded-xl p-3.5 flex gap-2.5 border border-indigo-500/10">
              <Sparkles className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">Petunjuk Penting</h5>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                  Isi <b>Judul Khusus</b> yang unik di lembar ini bertujuan untuk memudahkan penyortiran saat Anda mencetak beberapa lembar QR PDF sekaligus.
                </p>
              </div>
            </div>
          </div>
        )}

        {/*=== TAB 2: DESAIN QR ===*/}
        {activeTab === 'design' && (
          <div className="space-y-5 fade-in">
            {/* Color Configurator */}
            <div>
              <span className="text-[9px] font-bold text-indigo-400 tracking-wider uppercase block mb-1">03. Palet Warna</span>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-indigo-500" />
                Warna Utama QR Code
              </label>
              
              {/* Foreground Presets */}
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Preset Piksel QR</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-1.5">
                    {PRESET_FOREGROUNDS.map((col) => (
                      <button
                        key={col.hex}
                        type="button"
                        onClick={() => updateField('fgColor', col.hex)}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-[11px] transition-all duration-150 cursor-pointer ${
                          config.fgColor === col.hex 
                            ? 'border-indigo-500 bg-indigo-500/10 font-bold text-white' 
                            : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 text-slate-400'
                        }`}
                      >
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-white/10 flex-shrink-0" 
                          style={{ backgroundColor: col.hex }}
                        />
                        <span className="truncate">{col.name.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Color Picker */}
                <div className="flex items-center gap-3 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">
                  <div className="relative">
                    <input
                      id="qr-fgcolor-picker"
                      type="color"
                      value={config.fgColor}
                      onChange={(e) => updateField('fgColor', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent block"
                    />
                  </div>
                  <div>
                    <label htmlFor="qr-fgcolor-picker" className="block text-xs font-bold text-slate-300">Warna Piksel Kustom</label>
                    <span className="text-[10px] font-mono text-indigo-400 uppercase">{config.fgColor}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Configurator */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Warna Latar Belakang QR
              </label>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_BACKGROUNDS.map((col) => (
                  <button
                    key={col.hex}
                    type="button"
                    onClick={() => updateField('bgColor', col.hex)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border text-center transition-all duration-150 cursor-pointer ${
                      config.bgColor === col.hex 
                        ? 'border-indigo-500 bg-indigo-500/10 text-white' 
                        : 'border-slate-800 hover:border-slate-700 bg-slate-950/40 text-slate-400'
                    }`}
                  >
                    <span 
                      className="w-5 h-5 rounded-md border border-neutral-700" 
                      style={{ backgroundColor: col.hex }}
                    />
                    <span className="text-[9px] font-medium">{col.name}</span>
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-3 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80 mt-2.5">
                <input
                  id="qr-bgcolor-picker"
                  type="color"
                  value={config.bgColor}
                  onChange={(e) => updateField('bgColor', e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent block"
                />
                <div>
                  <label htmlFor="qr-bgcolor-picker" className="block text-xs font-bold text-slate-300">Latar Kustom</label>
                  <span className="text-[10px] font-mono text-indigo-400 uppercase">{config.bgColor}</span>
                </div>
              </div>
            </div>

            {/* Central Logo Overlay */}
            <div>
              <span className="text-[9px] font-bold text-indigo-400 tracking-wider uppercase block mb-1">04. Label Tengah Icon</span>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
                Logo di Pusat QR Code
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {/* None Option */}
                <button
                  type="button"
                  onClick={() => selectPresetLogo('none')}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                    config.logoType === 'none' 
                      ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500' 
                      : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
                  }`}
                >
                  <span className="text-[9px] font-bold text-slate-400 h-6 flex items-center justify-center">Tanpa Logo</span>
                </button>

                {/* Preset-Web Option */}
                <button
                  type="button"
                  onClick={() => selectPresetLogo('preset-web')}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                    config.logoType === 'preset-web' 
                      ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500' 
                      : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
                  }`}
                >
                  <Link className="w-5 h-5 text-indigo-400 h-6" />
                </button>

                {/* Preset-Wifi Option */}
                <button
                  type="button"
                  onClick={() => selectPresetLogo('preset-wifi')}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                    config.logoType === 'preset-wifi' 
                      ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500' 
                      : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
                  }`}
                >
                  <Wifi className="w-5 h-5 text-emerald-400 h-6" />
                </button>

                {/* Preset-Mail Option */}
                <button
                  type="button"
                  onClick={() => selectPresetLogo('preset-mail')}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                    config.logoType === 'preset-mail' 
                      ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500' 
                      : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
                  }`}
                >
                  <Mail className="w-5 h-5 text-rose-400 h-6" />
                </button>

                {/* Preset-Phone Option */}
                <button
                  type="button"
                  onClick={() => selectPresetLogo('preset-phone')}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                    config.logoType === 'preset-phone' 
                      ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500' 
                      : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
                  }`}
                >
                  <Phone className="w-5 h-5 text-amber-400 h-6" />
                </button>

                {/* Custom Base64 Upload */}
                <button
                  type="button"
                  onClick={() => selectPresetLogo('custom')}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all cursor-pointer ${
                    config.logoType === 'custom' 
                      ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500' 
                      : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
                  }`}
                >
                  <Upload className="w-5 h-5 text-slate-400 h-6" />
                </button>
              </div>

              {/* Hidden file input for custom logo */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleCustomLogoUpload}
                className="hidden"
              />

              {config.logoType === 'custom' && config.logoUrl && (
                <div className="mt-2 text-center flex items-center justify-between bg-slate-950/40 p-2 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <img 
                      src={config.logoUrl} 
                      alt="Logo Kustom" 
                      className="w-8 h-8 object-contain rounded border border-slate-755 bg-slate-900 p-0.5" 
                    />
                    <span className="text-[10px] text-slate-300 font-semibold truncate">Logo Kustom Berhasil Diunggah</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => selectPresetLogo('none')}
                    className="text-[10px] text-rose-400 hover:underline font-bold cursor-pointer"
                  >
                    Hapus
                  </button>
                </div>
              )}
            </div>

            {/* Error correction level and margins */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label htmlFor="qr-correction-select" className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Tingkat Koreksi Error
                </label>
                <select
                  id="qr-correction-select"
                  value={config.correctionLevel}
                  onChange={(e) => updateField('correctionLevel', e.target.value as QRCorrectionLevel)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-200"
                >
                  <option value="L">L - Rendah (7%)</option>
                  <option value="M">M - Sedang (15%)</option>
                  <option value="Q">Q - Kwarki (25%)</option>
                  <option value="H">H - Tinggi (30% - Rekomendasi Logo)</option>
                </select>
              </div>

              <div>
                <label id="qr-margin-label" className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Ketebalan Garis Batas ({config.margin})
                </label>
                <input
                  aria-labelledby="qr-margin-label"
                  type="range"
                  min={1}
                  max={10}
                  value={config.margin}
                  onChange={(e) => updateField('margin', parseInt(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer text-indigo-500 border-0"
                />
              </div>
            </div>
            {config.logoType !== 'none' && config.correctionLevel !== 'H' && (
              <div className="text-[10px] text-amber-300 bg-amber-500/10 rounded-xl p-3 flex gap-1.5 border border-amber-500/20">
                <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span>
                  Disarankan menggunakan <b>Tinggi (H)</b> ketika memakai Logo di tengah agar QR tetap mudah dipindai dengan lancar.
                </span>
              </div>
            )}
          </div>
        )}

        {/*=== TAB 3: TATA LETAK PDF ===*/}
        {activeTab === 'pdf' && (
          <div className="space-y-4 fade-in">
            <span className="text-[9px] font-bold text-indigo-400 tracking-wider uppercase block mb-1">05. Template Ekspor</span>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5 text-indigo-500" />
              Pilih Gaya Template Halaman PDF
            </label>

            <div className="grid grid-cols-1 gap-3">
              {/* Layout: Clean (Default) */}
              <button
                type="button"
                onClick={() => updateField('pdfLayout', 'clean')}
                className={`flex text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  config.pdfLayout === 'clean'
                    ? 'border-indigo-500 bg-indigo-500/10 shadow-sm shadow-indigo-600/10'
                    : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900/20 bg-slate-950/20'
                }`}
              >
                <div className="flex gap-3 items-start">
                  <div className={`p-2 rounded-lg ${config.pdfLayout === 'clean' ? 'bg-indigo-600/20 text-indigo-400' : 'bg-slate-900 text-slate-500'}`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Bersih &amp; Eksekutif (Default)</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Sempurna untuk sertifikat, instruksi meja, penempatan menu kafe, atau dokumen formal terstruktur dengan pembatas minimalis.
                    </p>
                  </div>
                </div>
              </button>

              {/* Layout: Poster */}
              <button
                type="button"
                onClick={() => updateField('pdfLayout', 'poster')}
                className={`flex text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  config.pdfLayout === 'poster'
                    ? 'border-indigo-500 bg-indigo-500/10 shadow-sm shadow-indigo-600/10'
                    : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900/20 bg-slate-950/20'
                }`}
              >
                <div className="flex gap-3 items-start">
                  <div className={`p-2 rounded-lg ${config.pdfLayout === 'poster' ? 'bg-indigo-600/20 text-indigo-400' : 'bg-slate-900 text-slate-500'}`}>
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Poster Promosi / Signage "Pindai Saya"</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Desain tulisan header tebal warna-warni yang mencolok. Sangat bagus untuk dipajang di dinding, pintu toko, atau papan petunjuk utama.
                    </p>
                  </div>
                </div>
              </button>

              {/* Layout: Badge Label */}
              <button
                type="button"
                onClick={() => updateField('pdfLayout', 'badge')}
                className={`flex text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  config.pdfLayout === 'badge'
                    ? 'border-indigo-500 bg-indigo-500/10 shadow-sm shadow-indigo-600/10'
                    : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900/20 bg-slate-950/20'
                }`}
              >
                <div className="flex gap-3 items-start">
                  <div className={`p-2 rounded-lg ${config.pdfLayout === 'badge' ? 'bg-indigo-600/20 text-indigo-400' : 'bg-slate-900 text-slate-500'}`}>
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Kartu Meja / Label Stand</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Dilengkapi dengan garis gunting putus-putus dan instruksi lengkap di bagian bawah. Cocok untuk pencetakan label ukuran standar meja/standee akrilik.
                    </p>
                  </div>
                </div>
              </button>

              {/* Layout: Minimalist */}
              <button
                type="button"
                onClick={() => updateField('pdfLayout', 'minimalist')}
                className={`flex text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                  config.pdfLayout === 'minimalist'
                    ? 'border-indigo-500 bg-indigo-500/10 shadow-sm shadow-indigo-600/10'
                    : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900/20 bg-slate-950/20'
                }`}
              >
                <div className="flex gap-3 items-start">
                  <div className={`p-2 rounded-lg ${config.pdfLayout === 'minimalist' ? 'bg-indigo-600/20 text-indigo-400' : 'bg-slate-900 text-slate-500'}`}>
                    <Type className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Modern Minimalis (Tanpa Border)</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                      Desain asimetris, super bersih, dengan tipografi premium dan tanpa elemen garis penghalang. Sangat elegan untuk proyek desain kelas atas.
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
