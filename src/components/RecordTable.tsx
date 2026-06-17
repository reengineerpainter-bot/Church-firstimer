import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Trash2, 
  FileText, 
  CheckCircle, 
  Clock, 
  Sparkles, 
  Filter,
  Check,
  Download,
  Printer,
  FileCode,
  Pencil
} from 'lucide-react';
import { TempleRecord, RecordStatus } from '../types';

interface RecordTableProps {
  records: TempleRecord[];
  onUpdateStatus: (id: string, nextStatus: RecordStatus) => void;
  onDeleteRecord: (id: string) => void;
  onSelectReceipt: (record: TempleRecord) => void;
  onEditRecord: (record: TempleRecord) => void;
}

const STATUS_STYLING: Record<RecordStatus, { text: string; bg: string; icon: any }> = {
  'Pending Follow-up': { 
    text: 'Pending', 
    bg: 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50 hover:border-ink-dark', 
    icon: Clock 
  },
  'In Progress': { 
    text: 'In Progress', 
    bg: 'bg-ink-dark text-white border-ink-dark hover:bg-neutral-800', 
    icon: Sparkles 
  },
  'Completed & Closed': { 
    text: 'Closed & Archived', 
    bg: 'bg-stone-50 text-stone-400 border-stone-200/50 hover:bg-stone-100', 
    icon: CheckCircle 
  }
};

export default function RecordTable({ 
  records, 
  onUpdateStatus, 
  onDeleteRecord, 
  onSelectReceipt,
  onEditRecord
}: RecordTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedSex, setSelectedSex] = useState<string>('ALL');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  
  // Quick status cycle handler
  const handleCycleStatus = (id: string, current: RecordStatus) => {
    let next: RecordStatus = 'Pending Follow-up';
    if (current === 'Pending Follow-up') next = 'In Progress';
    else if (current === 'In Progress') next = 'Completed & Closed';
    else if (current === 'Completed & Closed') next = 'Pending Follow-up';
    onUpdateStatus(id, next);
  };

  // Filter records
  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.phoneNumber.includes(searchTerm) ||
      record.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.followUpReport.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = selectedStatus === 'ALL' || record.status === selectedStatus;
    const matchesSex = selectedSex === 'ALL' || record.sex === selectedSex;
    
    return matchesSearch && matchesStatus && matchesSex;
  });

  // Notepad Exporter (.txt)
  const handleExportNotepad = () => {
    let text = "FOLLOW UP AND REPORT SHEET - LEGER EXPORT\n";
    text += `Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n`;
    text += "========================================================================================================\n\n";
    
    filteredRecords.forEach((record, index) => {
      text += `[#${index + 1}] ID: ${record.id.toUpperCase()}\n`;
      text += `NAME:    ${record.name}\n`;
      text += `SEX:     ${record.sex}\n`;
      text += `PHONE:   ${record.phoneNumber}\n`;
      text += `ADDRESS: ${record.address}\n`;
      text += `DATE:    ${record.date} @ ${record.time}\n`;
      text += `REPORT:  ${record.followUpReport}\n`;
      text += "--------------------------------------------------------------------------------------------------------\n";
    });
    
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `follow_up_ledger_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Word Exporter (.doc XML layout)
  const handleExportWord = () => {
    let html = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <title>Follow Up and Report Sheet Ledger</title>
        <style>
          body { font-family: 'Arial', sans-serif; color: #1a1a1a; margin: 40px; }
          h1 { font-family: 'Georgia', serif; border-bottom: 2px solid #1a1a1a; padding-bottom: 10px; font-weight: normal; }
          .meta { font-size: 11px; color: #666; font-family: monospace; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #f5f5f5; border: 1px solid #ddd; padding: 10px; font-size: 11px; font-weight: bold; text-align: left; text-transform: uppercase; }
          td { border: 1px solid #ddd; padding: 10px; font-size: 11px; vertical-align: top; }
          .footer { margin-top: 40px; font-size: 10px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 10px; }
        </style>
      </head>
      <body>
        <h1>Follow Up and Report Sheet Ledger</h1>
        <div class="meta font-serif">Exported: ${new Date().toLocaleDateString()} @ ${new Date().toLocaleTimeString()} | Records Included: ${filteredRecords.length}</div>
        <table>
          <thead>
            <tr>
              <th style="width: 15%">Date & Time</th>
              <th style="width: 25%">First timer name</th>
              <th style="width: 10%">Sex</th>
              <th style="width: 20%">Contact & Address</th>
              <th style="width: 30%">Follow-up Report Details</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    filteredRecords.forEach(record => {
      html += `
            <tr>
              <td><strong>${record.date}</strong><br/>${record.time}</td>
              <td><strong>${record.name}</strong></td>
              <td>${record.sex}</td>
              <td><strong>${record.phoneNumber}</strong><br/>${record.address}</td>
              <td><em>"${record.followUpReport}"</em></td>
            </tr>
      `;
    });
    
    html += `
          </tbody>
        </table>
        <div class="footer">Follow Up and Report Sheet &copy; ${new Date().getFullYear()} - Handled registered information locally.</div>
      </body>
      </html>
    `;
    
    const blob = new Blob(['\ufeff' + html], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `follow_up_ledger_${new Date().toISOString().slice(0, 10)}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Web Page Exporter (.html) for offline viewing with zero parse errors
  const handleExportHtml = () => {
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Follow Up and Report Sheet Ledger</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1a1a1a; margin: 20px; line-height: 1.5; background-color: #fcfbf9; }
          .container { max-width: 1000px; margin: 0 auto; padding: 30px; border: 1px solid #e5e5e0; background: #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
          h1 { font-family: Georgia, serif; border-bottom: 2px solid #1a1a1a; padding-bottom: 12px; font-weight: normal; margin-top: 0; font-size: 28px; }
          .meta { font-size: 11px; color: #666; font-family: monospace; margin-bottom: 25px; background: #faf9f5; padding: 8px 12px; border-left: 3px solid #1a1a1a; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th { background-color: #f5f5f0; border: 1px solid #dcdcd5; padding: 12px 10px; font-size: 11px; font-weight: bold; text-align: left; text-transform: uppercase; letter-spacing: 0.1em; }
          td { border: 1px solid #dcdcd5; padding: 12px 10px; font-size: 12px; vertical-align: top; }
          .text-serif { font-family: Georgia, serif; }
          .badge { display: inline-block; padding: 2px 6px; font-size: 9px; font-weight: bold; text-transform: uppercase; background: #f0ede5; border: 1px solid #d5d0by; margin-top: 4px; }
          .footer { margin-top: 40px; font-size: 10px; color: #888; text-align: center; border-top: 1px dashed #dcdcd5; padding-top: 15px; }
          @media print {
            body { background: #fff; margin: 0; }
            .container { border: none; box-shadow: none; padding: 0; max-width: 100%; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Follow Up and Report Sheet Ledger</h1>
          <div class="meta">Exported: ${new Date().toLocaleDateString()} @ ${new Date().toLocaleTimeString()} | Records Included: ${filteredRecords.length}</div>
          <table>
            <thead>
              <tr>
                <th style="width: 15%">Date & Time</th>
                <th style="width: 25%">First timer name</th>
                <th style="width: 10%">Sex</th>
                <th style="width: 20%">Contact & Address</th>
                <th style="width: 30%">Follow-up Report Details</th>
              </tr>
            </thead>
            <tbody>
    `;
    
    filteredRecords.forEach(record => {
      html += `
              <tr>
                <td><strong>${record.date}</strong><br/><span style="font-family: monospace; font-size: 10px; color: #666;">${record.time}</span></td>
                <td class="text-serif" style="font-size: 14px;"><strong>${record.name}</strong></td>
                <td><span class="badge">${record.sex}</span></td>
                <td><strong>${record.phoneNumber}</strong><br/><span style="color: #555; font-size: 11px;">${record.address}</span></td>
                <td class="text-serif" style="font-style: italic;">"${record.followUpReport}"</td>
              </tr>
      `;
    });
    
    html += `
            </tbody>
          </table>
          <div class="footer">Follow Up and Report Sheet &copy; ${new Date().getFullYear()} - Digital Sheet Ledger.</div>
        </div>
      </body>
      </html>
    `;
    
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `follow_up_ledger_${new Date().toISOString().slice(0, 10)}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Printable layout window trigger
  const handlePrintLedger = () => {
    window.print();
  };

  return (
    <div className="bg-white border-2 border-ink-dark rounded-none shadow-none overflow-hidden" id="records-table-container">
      {/* Table Toolbar */}
      <div className="p-5 border-b border-ink-dark/15 bg-[#FAF9F6] space-y-4" id="table-toolbar">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-bold opacity-60 text-stone-500 block">Ledger Registry Database</span>
            <h3 className="text-2xl font-serif font-light text-ink-dark mt-1 flex items-center gap-2">
              <span>The Active Records</span>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-ink-dark text-white rounded-none font-bold">
                {filteredRecords.length} Ref
              </span>
            </h3>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
              <Search size={13} />
            </span>
            <input
              type="text"
              placeholder=""
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-stone-200 rounded-none text-ink-dark placeholder-stone-400 focus:outline-none focus:border-ink-dark transition-all"
              id="search-input"
            />
          </div>
        </div>

        {/* Global Exporter and Filter Options */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-stone-200/50">
          {/* Filter Sub-selectors */}
          <div className="flex flex-wrap items-center gap-3 text-[10px] font-sans h-full">
            <div className="flex items-center gap-1 text-stone-500 font-bold uppercase tracking-widest shrink-0">
              <Filter size={11} className="text-stone-400" />
              <span>Filters:</span>
            </div>

            {/* Sex Selection */}
            <select
              value={selectedSex}
              onChange={(e) => setSelectedSex(e.target.value)}
              className="px-2 py-1 text-[9px] font-sans font-bold uppercase tracking-wider border border-stone-250 bg-white rounded-none text-stone-600 focus:outline-none focus:border-ink-dark cursor-pointer"
            >
              <option value="ALL">All Sexes</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
              <option value="Prefer Not to Say">Prefer Not</option>
            </select>

            {/* Status Selector */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2 py-1 text-[9px] font-sans font-bold uppercase tracking-wider border border-stone-250 bg-white rounded-none text-stone-600 focus:outline-none focus:border-ink-dark cursor-pointer"
              id="status-filter-select"
            >
              <option value="ALL">All Statuses</option>
              <option value="Pending Follow-up">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed & Closed">Closed</option>
            </select>
          </div>

          {/* Export Action Strip (THE HIGH-FIDELITY EXPORTERS) */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-stone-400 mr-1 max-sm:hidden">
              Export Sheet:
            </span>
            {/* Notepad Download */}
            <button
              onClick={handleExportNotepad}
              title="Download Ledger as Notepad Text file"
              className="flex items-center gap-1 px-2.5 py-1 text-[9px] uppercase tracking-wider font-bold border border-ink-dark/20 text-ink-dark hover:border-ink-dark hover:bg-stone-50 transition-colors cursor-pointer rounded-none"
            >
              <FileCode size={11} />
              <span>Notepad (.txt)</span>
            </button>

            {/* Word Download */}
            <button
              onClick={handleExportWord}
              title="Download Ledger as Word format file"
              className="flex items-center gap-1 px-2.5 py-1 text-[9px] uppercase tracking-wider font-bold border border-ink-dark/20 text-ink-dark hover:border-ink-dark hover:bg-stone-50 transition-colors cursor-pointer rounded-none"
            >
              <Download size={11} />
              <span>Word (.doc)</span>
            </button>

            {/* Web Doc Download (Parse-proof view for mobile devices) */}
            <button
              onClick={handleExportHtml}
              title="Download Ledger as Web Doc HTML (best for mobile devices to prevent parse errors)"
              className="flex items-center gap-1 px-2.5 py-1 text-[9px] uppercase tracking-wider font-bold border border-ink-dark/20 text-ink-dark hover:border-ink-dark hover:bg-stone-50 transition-colors cursor-pointer rounded-none"
            >
              <FileCode size={11} />
              <span>Web Doc (.html)</span>
            </button>

            {/* PDF/Print */}
            <button
              onClick={handlePrintLedger}
              title="Print Ledger or save as PDF"
              className="flex items-center gap-1 px-2.5 py-1 text-[9px] uppercase tracking-wider font-bold bg-ink-dark text-white hover:bg-neutral-800 transition-colors cursor-pointer rounded-none"
            >
              <Printer size={11} />
              <span>PDF / Print</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Records Presentation */}
      <div className="overflow-x-auto">
        {filteredRecords.length === 0 ? (
          <div className="p-16 text-center" id="empty-state">
            <p className="font-serif text-stone-400 italic text-lg leading-relaxed">
              "The Sheet Ledger remains empty under these filter constraints."
            </p>
            <p className="text-stone-450 font-sans text-[10px] mt-2 uppercase tracking-widest">
              Add a new record above or update search queries to display entries.
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse" id="records-dataset-table">
            <thead>
              <tr className="border-b border-ink-dark/20 bg-stone-50/40 text-[9px] font-sans text-stone-600 uppercase tracking-[0.25em] font-bold">
                <th className="px-5 py-4 w-[15%]">Date Registered</th>
                <th className="px-5 py-4 w-[20%]">Visitor Name</th>
                <th className="px-5 py-4 w-[10%]">Sex</th>
                <th className="px-5 py-4 w-[25%]">Contact & Address</th>
                <th className="px-5 py-4 hidden md:table-cell w-[25%]">Follow Up Transcript Report</th>
                <th className="px-5 py-4 text-right pr-6 w-[5%]">Action</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredRecords.map((record) => {
                  const statusInfo = STATUS_STYLING[record.status];
                  const StatusIcon = statusInfo.icon;

                  return (
                    <motion.tr
                      key={record.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="border-b border-stone-200/70 hover:bg-warm-paper/30 transition-colors align-middle"
                      id={`row-${record.id}`}
                    >
                      {/* Date and hour */}
                      <td className="px-5 py-4 text-xs whitespace-nowrap">
                        <span className="font-sans text-ink-dark block font-bold tracking-tight">{record.date}</span>
                        <span className="font-mono text-stone-400 text-[10px] block mt-0.5">{record.time}</span>
                      </td>

                      {/* Visitor Name */}
                      <td className="px-5 py-4 max-w-[200px] truncate">
                        <span className="text-lg font-light text-ink-dark block font-serif tracking-tight leading-tight">
                          {record.name}
                        </span>
                      </td>

                      {/* Sex column */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="inline-block px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest font-sans border border-ink-dark/15 text-stone-500 bg-stone-50">
                          {record.sex}
                        </span>
                      </td>

                      {/* Contact Phone & Address */}
                      <td className="px-5 py-4 max-w-[220px]">
                        <span className="font-mono text-ink-dark text-xs block font-semibold">
                          {record.phoneNumber}
                        </span>
                        <span className="text-[10px] text-stone-450 block font-sans mt-0.5 line-clamp-1 italic" title={record.address}>
                          {record.address}
                        </span>
                      </td>

                      {/* Follow-up transcript */}
                      <td className="px-5 py-4 hidden md:table-cell max-w-sm">
                        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed font-serif italic" title={record.followUpReport}>
                          "{record.followUpReport}"
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right pr-6 whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Edit record option */}
                          <button
                            onClick={() => onEditRecord(record)}
                            className="p-1.5 border border-stone-200 hover:border-ink-dark text-stone-500 hover:text-ink-dark transition-colors cursor-pointer rounded-none"
                            title="Edit Follow Up Record"
                            id={`edit-btn-${record.id}`}
                          >
                            <Pencil size={13} />
                          </button>

                          {/* Receipts modal view / certificate pullout */}
                          <button
                            onClick={() => onSelectReceipt(record)}
                            className="p-1.5 border border-stone-200 hover:border-ink-dark text-stone-500 hover:text-ink-dark transition-colors cursor-pointer rounded-none"
                            title="View Follow Up Record Sheet Card"
                            id={`view-slip-btn-${record.id}`}
                          >
                            <FileText size={13} />
                          </button>

                          {/* Delete with inline confirmation */}
                          {confirmDeleteId === record.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  onDeleteRecord(record.id);
                                  setConfirmDeleteId(null);
                                }}
                                className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white text-[9px] font-sans font-bold uppercase tracking-wider rounded-none cursor-pointer"
                                title="Confirm Deletion"
                                id={`confirm-delete-btn-${record.id}`}
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2 py-1 border border-stone-200 text-stone-550 hover:text-ink-dark text-[9px] font-sans font-bold uppercase tracking-wider rounded-none cursor-pointer bg-white"
                                title="Cancel"
                                id={`cancel-delete-btn-${record.id}`}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setConfirmDeleteId(record.id)}
                              className="p-1.5 border border-stone-200 hover:border-rose-450 hover:bg-rose-50 text-stone-400 hover:text-rose-700 transition-colors cursor-pointer rounded-none"
                              title="Strike Record"
                              id={`delete-btn-${record.id}`}
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        )}
      </div>

      {/* Mobiles tip fallback */}
      <div className="p-4 bg-stone-50 md:hidden border-t border-stone-200/70 flex items-center gap-2 justify-between">
        <span className="text-[10px] text-stone-400 font-sans italic">
          Tip: Tap status filters/buttons to toggle state. Use exports to save files.
        </span>
      </div>
    </div>
  );
}
