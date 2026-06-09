import React, { useState, useEffect } from 'react';
import { QRConfig, HistoryItem } from './types';
import QRForm from './components/QRForm';
import QRPreview from './components/QRPreview';
import QRHistory from './components/QRHistory';
import { 
  QrCode, 
  Sparkles, 
  Share2, 
  HelpCircle, 
  RefreshCw,
  PlusCircle,
  FileText
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'qr_generator_history';

// Helper to get formatted Indonesian date
const getFormattedDate = () => {
  return new Date().toLocaleDateString('id-ID', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
};

const createDefaultConfig = (): QRConfig => ({
  id: Math.random().toString(36).substring(2, 9),
  title: 'Menu Utama Kafe Nusantara',
  subtitle: 'Silakan pindai barcode berikut untuk memesan secara digital dari meja Anda.',
  content: 'https://ai.studio/build',
  fgColor: '#0f172a',
  bgColor: '#ffffff',
  correctionLevel: 'H',
  margin: 4,
  logoType: 'none',
  pdfLayout: 'clean',
  dateCreated: getFormattedDate(),
});

export default function App() {
  const [config, setConfig] = useState<QRConfig>(createDefaultConfig());
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history from localStorage on mount
  useEffect(() => {
    const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedHistory) {
      try {
        setHistory(JSON.parse(storedHistory));
      } catch (err) {
        console.error('Error parsing local QR history:', err);
      }
    }
  }, []);

  const handleConfigChange = (updatedConfig: QRConfig) => {
    setConfig(updatedConfig);
  };

  const handleSaveToHistory = (newConfig: QRConfig) => {
    setHistory((prevHistory) => {
      // Avoid duplication by removing item with same parameters if it already exists
      const filtered = prevHistory.filter(
        item => !(item.title === newConfig.title && item.content === newConfig.content && item.pdfLayout === newConfig.pdfLayout)
      );
      
      const updatedItem: HistoryItem = {
        ...newConfig,
        id: Math.random().toString(36).substring(2, 9), // Assign fresh ID
        dateCreated: getFormattedDate(),
      };

      const newHistory = [updatedItem, ...filtered].slice(0, 50); // Keep last 50 items
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => {
      const filtered = prev.filter(item => item.id !== id);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
      return filtered;
    });
  };

  const handleClearHistory = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus seluruh riwayat pembuatan QR Anda di browser ini?')) {
      setHistory([]);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  const handleLoadHistoryItem = (item: HistoryItem) => {
    setConfig({
      ...item,
      id: Math.random().toString(36).substring(2, 9), // assign new ID for further editing
    });
    // Scroll to top for editing
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetForm = () => {
    setConfig(createDefaultConfig());
  };

  return (
    <div id="main-layout-root" className="min-h-screen bg-[#0B0E14] text-slate-200 flex flex-col font-sans selection:bg-indigo-600/30 antialiased">
      
      {/* Sleek, professional dark Navbar */}
      <header className="border-b border-slate-800/80 bg-[#0B0E14] sticky top-0 z-50 backdrop-blur-md relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <QrCode className="w-5.5 h-5.5" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-white tracking-tight leading-none">
                QRPDF<span className="text-indigo-500 underline decoration-indigo-500/30 underline-offset-4">Gen</span>
              </h1>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mt-1">
                Bento QR Engine • Instan &amp; Presisi
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-full border border-slate-800">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PDF Engine: Ready</span>
            </div>

            <button
              onClick={handleResetForm}
              className="px-3.5 py-2 hover:bg-slate-900 bg-slate-950/60 text-slate-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-800"
            >
              <PlusCircle className="w-4 h-4" />
              Sesi Baru
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        
        {/* Descriptive intro bar */}
        <div className="mb-8">
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Pembuat QR Cetak Otomatis</span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
            Sistem Pembuat Kode QR dengan Keluaran PDF Kustom
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Hasilkan QR Code fungsional dan ekspor instan sebagai dokumen satu halaman PDF ukuran A4 siap cetak dengan judul khusus serta instruksi pindai beresolusi tajam.
          </p>
        </div>

        {/* Adaptive Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          
          {/* Bento Block 1: QR configurator inputs */}
          <section className="col-span-1 md:col-span-7 flex flex-col">
            <QRForm 
              config={config} 
              onChange={handleConfigChange} 
            />
          </section>

          {/* Bento Block 2: Live preview */}
          <section className="col-span-1 md:col-span-5 flex flex-col">
            <QRPreview 
              config={config} 
              onSaveToHistory={handleSaveToHistory} 
            />
          </section>

          {/* Bento Row 2 - Block 3: History list (Width spans 8 on desktop and tablet) */}
          <section className="col-span-1 md:col-span-8 flex flex-col">
            <QRHistory 
              items={history} 
              onSelectItem={handleLoadHistoryItem} 
              onDeleteItem={handleDeleteHistoryItem} 
              onClearHistory={handleClearHistory} 
            />
          </section>

          {/* Bento Row 2 - Block 4: Quick stats (Width spans 4 on desktop and tablet) */}
          <section className="col-span-1 md:col-span-4 bg-indigo-600 rounded-3xl p-6 flex flex-col justify-between shadow-lg shadow-indigo-600/10 min-h-[180px] md:min-h-0">
            <div>
              <span className="text-[10px] font-bold text-indigo-100/70 uppercase tracking-widest block">Statistik Aktif</span>
              <h3 className="text-white font-extrabold text-lg mt-1">Kinerja Pembuatan</h3>
              <p className="text-indigo-100/70 text-xs mt-1 leading-relaxed">
                Jumlah QR aktif yang tersimpan dalam riwayat penjelajahan Anda hari ini.
              </p>
            </div>
            
            <div className="flex justify-between items-end mt-6">
              <div className="text-5xl font-black text-white tracking-tight">
                {history.length}
              </div>
              <div className="text-right text-[10px] text-indigo-100 leading-tight uppercase font-bold tracking-wider">
                Dokumen PDF<br/>Tergenerasi
              </div>
            </div>
          </section>

        </div>

        {/* User Guide Card Block */}
        <section className="mt-8 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/10 text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-500/20">
              1
            </div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Isi Judul &amp; Data QR</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tulis judul eksklusif (seperti menu meja, nomor seri, atau kartu identitas) beserta alamat URL tujuan kode QR Anda.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/10 text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-500/20">
              2
            </div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Kustomisasi Desain</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Atur kontras palet warna piksel, sisipkan icon penanda di tengah, dan pilih jenis layout yang cocok untuk cetakan PDF.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/10 text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-500/20">
              3
            </div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Unduh PDF Instan</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ekspor QR langsung menjadi berkas cetak PDF A4. Judul khusus diletakkan presisi agar tidak tertukar saat pembagian lembar.
            </p>
          </div>
        </section>
      </main>

      {/* Elegant dark Footer */}
      <footer className="border-t border-slate-800 bg-[#0B0E14] py-6 mt-16 text-center text-xs text-slate-500 font-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>
            &copy; 2026 QRPDFGen. Semua pengolahan berlangsung aman secara lokal di sisi klien.
          </span>
          <div className="flex items-center gap-1.5 bg-slate-950/40 border border-slate-800 px-3 py-1 rounded-full text-[10px]">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span>Format output terstandarisasi untuk resolusi cetak tinggi.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
