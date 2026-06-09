import React, { useState } from 'react';
import { HistoryItem } from '../types';
import { 
  History, 
  Trash2, 
  ChevronRight, 
  Search, 
  ExternalLink, 
  Calendar,
  Layers,
  Copy,
  Check
} from 'lucide-react';

interface QRHistoryProps {
  items: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearHistory: () => void;
}

export default function QRHistory({ items, onSelectItem, onDeleteItem, onClearHistory }: QRHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredItems = items.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyLink = async (id: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid selecting item
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="qr-history-container" className="bg-[#131722]/60 border border-slate-800 rounded-3xl p-6 flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
          <History className="w-4 h-4 text-indigo-400" />
          Riwayat Pembuatan ({items.length})
        </h3>
        {items.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="text-[9px] text-rose-400 hover:text-rose-350 font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Bersihkan Semua
          </button>
        )}
      </div>

      {/* Search Input Bar */}
      {items.length > 0 && (
          <div className="relative">
            <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari berdasarkan judul khusus atau isi data..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 text-slate-100 placeholder-slate-700"
            />
          </div>
      )}

      {/* History Items List Grid */}
      <div className="flex-grow overflow-y-auto max-h-[220px] pr-1 space-y-2">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <History className="w-8 h-8 text-slate-800 mb-2" />
            <p className="text-xs font-semibold text-slate-400">Belum ada riwayat</p>
            <p className="text-[10px] text-slate-500 mt-1 max-w-[200px]">
              Setiap kali Anda mengunduh QR atau PDF, data otomatis tercatat di sini.
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="group flex items-center justify-between p-3 rounded-xl border border-slate-800/40 hover:border-indigo-500/40 bg-slate-950/20 hover:bg-indigo-500/5 cursor-pointer transition-all duration-150"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Visual Accent representation */}
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[9px] font-bold shadow-sm flex-shrink-0"
                  style={{ backgroundColor: item.bgColor, color: item.fgColor }}
                >
                  QR
                </div>
                
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] text-slate-500 font-mono truncate max-w-[120px] sm:max-w-[200px]">
                      {item.content}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-800" />
                    <span className="text-[9px] text-slate-500 flex items-center gap-0.5">
                      <Layers className="w-2.5 h-2.5" />
                      {item.pdfLayout}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions element right side */}
              <div className="flex items-center gap-1.5 ml-3">
                {/* Copy link shortcut */}
                <button
                  type="button"
                  title="Salin Isi"
                  onClick={(e) => handleCopyLink(item.id, item.content, e)}
                  className="p-1.5 text-slate-500 hover:text-indigo-400 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                >
                  {copiedId === item.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>

                {/* Individual deletion */}
                <button
                  type="button"
                  title="Hapus"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteItem(item.id);
                  }}
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                
                <ChevronRight className="w-4 h-4 text-slate-700 group-hover:text-indigo-400 transition-colors" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
