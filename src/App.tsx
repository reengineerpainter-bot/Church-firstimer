import { useState, useEffect } from 'react';
import { Book, Compass, FileText, AlertCircle, ShieldCheck } from 'lucide-react';
import { TempleRecord, RecordStatus } from './types';
import { INITIAL_RECORDS } from './data';
import StatsGrid from './components/StatsGrid';
import RecordForm from './components/RecordForm';
import RecordTable from './components/RecordTable';
import ReceiptModal from './components/ReceiptModal';

export default function App() {
  // Load initial dataset or retrieve persistent storage, auto-migrating any old schemas
  const [records, setRecords] = useState<TempleRecord[]>(() => {
    try {
      const saved = localStorage.getItem('follow_up_records_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Map old legacy models gracefully to complete the new Sex & Address schema
        return parsed.map((item: any) => ({
          id: item.id || `rec_${Date.now()}`,
          name: item.name || 'Anonymous Visitor',
          sex: item.sex || 'Female',
          phoneNumber: item.phoneNumber || 'Unspecified Contact',
          address: item.address || 'Unspecified Address',
          followUpReport: item.followUpReport || item.report || 'Blank Report Statement',
          date: item.date || '2026-06-17',
          time: item.time || '12:00',
          status: (item.status === 'Completed & Closed' || item.status === 'Completed' || item.status === 'Archived')
            ? 'Completed & Closed'
            : (item.status === 'In Progress' ? 'In Progress' : 'Pending Follow-up')
        }));
      }
    } catch (e) {
      console.error("Failed to load records from local storage, defaults to preset list", e);
    }
    return INITIAL_RECORDS;
  });

  // Track state of printable slip modal
  const [selectedReceipt, setSelectedReceipt] = useState<TempleRecord | null>(null);

  // Track state of record currently being edited
  const [editingRecord, setEditingRecord] = useState<TempleRecord | null>(null);

  // Live Clock
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    // Sync storage values when state changes
    localStorage.setItem('follow_up_records_v3', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Creation Action
  const handleAddRecord = (newDoc: Omit<TempleRecord, 'id' | 'date' | 'time' | 'status'>) => {
    const now = new Date();
    const pad = (num: number) => num.toString().padStart(2, '0');
    
    const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    const timeString = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const parsedDoc: TempleRecord = {
      ...newDoc,
      id: `rec_${Date.now()}`,
      date: dateStr,
      time: timeString,
      status: 'Pending Follow-up'
    };

    setRecords(prev => [parsedDoc, ...prev]);
  };

  // Update Status Action
  const handleUpdateStatus = (id: string, nextStatus: RecordStatus) => {
    setRecords(prev => prev.map(record => {
      if (record.id === id) {
        return { ...record, status: nextStatus };
      }
      return record;
    }));
  };

  // Update Record Action
  const handleUpdateRecord = (updatedRecord: TempleRecord) => {
    setRecords(prev => prev.map(record => {
      if (record.id === updatedRecord.id) {
        return updatedRecord;
      }
      return record;
    }));
    setEditingRecord(null);
  };

  // Delete Action
  const handleDeleteRecord = (id: string) => {
    setRecords(prev => prev.filter(record => record.id !== id));
    if (selectedReceipt?.id === id) {
      setSelectedReceipt(null);
    }
    if (editingRecord?.id === id) {
      setEditingRecord(null);
    }
  };

  return (
    <div className="min-h-screen bg-warm-paper text-ink-dark flex flex-col font-sans" id="temple-app-root">
      {/* Absolute top black broadsheet line */}
      <div className="h-1.5 bg-ink-dark w-full" />

      {/* Main Sheet Header */}
      <header className="bg-white border-b border-ink-dark/15 sticky top-0 z-40 shadow-none" id="app-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-ink-dark text-white rounded-none shrink-0">
              <Book size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-serif font-light tracking-tight text-ink-dark">
                  Follow Up and Report Sheet
                </h1>
                <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-none text-[9px] font-sans bg-ink-dark text-white uppercase font-bold tracking-widest">
                  <ShieldCheck size={10} />
                  <span>Verified Access</span>
                </span>
              </div>
              <p className="text-xs text-stone-450 mt-0.5 font-sans uppercase tracking-wider font-semibold">
                Dynamic Registration Ledger & Coordination Template
              </p>
            </div>
          </div>

          {/* Time and live status metadata */}
          <div className="flex items-center gap-4 shrink-0 sm:self-center">
            <div className="text-right max-sm:text-left font-sans">
              <span className="text-[10px] text-stone-400 uppercase tracking-widest block font-bold">
                CURRENT SHEET WORK-HOUR
              </span>
              <span className="text-sm font-mono font-bold text-ink-dark tracking-wider">
                {timeStr || '10:38 AM'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 space-y-6 md:space-y-8" id="main-content">
        {/* Real-time stats dashboard */}
        <StatsGrid records={records} />

        {/* Grid layout for registry insertion and records ledger */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start" id="app-layout-split">
          {/* Add/Edit Visitor Panel (Form) */}
          <div className="xl:col-span-4 xl:sticky xl:top-[92px]">
            <RecordForm 
              onAddRecord={handleAddRecord} 
              editingRecord={editingRecord}
              onUpdateRecord={handleUpdateRecord}
              onCancelEdit={() => setEditingRecord(null)}
            />
          </div>

          {/* Table list view */}
          <div className="xl:col-span-8 space-y-4">
            <RecordTable 
              records={records}
              onUpdateStatus={handleUpdateStatus}
              onDeleteRecord={handleDeleteRecord}
              onSelectReceipt={setSelectedReceipt}
              onEditRecord={setEditingRecord}
            />
          </div>
        </div>
      </main>

      {/* Sheet footer */}
      <footer className="bg-white border-t border-ink-dark/15 mt-16 py-10 text-stone-500 font-sans text-[10px] uppercase tracking-[0.2em] text-center" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-2">
          <div className="flex items-center gap-1.5 font-bold text-ink-dark">
            <Compass size={12} className="text-ink-dark animate-spin-slow" />
            <span>Registry Coordination & Reporting Office</span>
          </div>
          <p className="text-[9px] text-stone-400 italic font-serif tracking-normal lowercase first-letter:uppercase">
            May responsive attention guide all recorded. All records stored with persistent local cache.
          </p>
        </div>
      </footer>

      {/* Printer Excerpt Card slip Modal */}
      {selectedReceipt && (
        <ReceiptModal 
          record={selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
        />
      )}
    </div>
  );
}
