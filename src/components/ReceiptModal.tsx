import { motion } from 'motion/react';
import { X, Copy, Check, Printer, Download, FileCode } from 'lucide-react';
import { useState } from 'react';
import { TempleRecord } from '../types';

interface ReceiptModalProps {
  record: TempleRecord | null;
  onClose: () => void;
}

export default function ReceiptModal({ record, onClose }: ReceiptModalProps) {
  const [copied, setCopied] = useState(false);

  if (!record) return null;

  // Formatting text download (Notepad plain formatting style)
  const getPlaintextOutput = () => {
    return `
===================================================
           FOLLOW UP AND REPORT RECORD
             Official Ledger Template
===================================================
LEDGER REFID : #${record.id.toUpperCase()}
DATE TIME    : ${record.date} @ ${record.time}
VISITOR NAME : ${record.name}
SEX          : ${record.sex}
CONTACT NO   : ${record.phoneNumber}
ADDRESS      : ${record.address}
LEDGER STATE : ${record.status}

---------------------------------------------------
FOLLOW-UP REPORT DETAILS:
"${record.followUpReport}"
---------------------------------------------------
This record is registered securely inside the local
database cache of the Follow Up and Report Sheet.
===================================================
    `.trim();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getPlaintextOutput());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // Download individual record as a Notepad .txt file:
  const handleDownloadNotepad = () => {
    const textOutput = getPlaintextOutput();
    const blob = new Blob([textOutput], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `follow_up_record_${record.name.replace(/\s+/g, '_').toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download individual record as a real, mobile-friendly .html document:
  const handleDownloadHtml = () => {
    const htmlOutput = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Follow Up Report - ${record.name}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 20px; color: #1a1a1a; line-height: 1.5; background-color: #f5f5f4; }
          .certificate { border: 2px solid #1a1a1a; padding: 30px; max-width: 600px; margin: 20px auto; background-color: #fff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
          h2 { font-family: Georgia, serif; text-align: center; text-transform: uppercase; letter-spacing: 2px; border-bottom: 2px dashed #1a1a1a; padding-bottom: 15px; font-weight: normal; margin-top: 0; }
          .section-title { font-weight: bold; font-size: 10px; text-transform: uppercase; color: #666; margin-top: 15px; margin-bottom: 5px; tracking-wider; font-family: sans-serif; }
          .content-text { font-size: 14px; margin-bottom: 15px; }
          .report-box { border: 1px solid #ddd; padding: 15px; background: #faf9f6; font-style: italic; margin-top: 15px; font-size: 13px; font-family: Georgia, serif; }
          .footer { text-align: center; font-size: 10px; color: #777; margin-top: 30px; font-family: monospace; border-top: 1px dashed #ddd; padding-top: 15px; }
        </style>
      </head>
      <body>
        <div class="certificate">
          <h2>Follow Up Record</h2>
          <div style="text-align: center; font-size: 11px; font-family: monospace; color: #555; margin-bottom: 25px;">
            REF CODE: #${record.id.toUpperCase()}<br/>
            REGISTRATION DATE: ${record.date} @ ${record.time}
          </div>
          
          <div class="section-title">Registered Name</div>
          <div class="content-text" style="font-size:18px;"><strong>${record.name}</strong></div>
          
          <div class="section-title">Sex Designation</div>
          <div class="content-text">✦ ${record.sex}</div>

          <div class="section-title">Contact Pathway</div>
          <div class="content-text">${record.phoneNumber}</div>

          <div class="section-title">Physical Area/Address</div>
          <div class="content-text"><em>${record.address}</em></div>

          <div class="section-title">Ledger State</div>
          <div class="content-text"><strong>${record.status}</strong></div>

          <div class="section-title">Follow-Up Report Transcript</div>
          <div class="report-box">
            "${record.followUpReport}"
          </div>

          <div class="footer">
            Follow Up and Report Sheet Ledger Office<br/>
            Official Digital Verification • Pax et Veritas<br/>
            &copy; ${new Date().getFullYear()} All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;
    const blob = new Blob([htmlOutput], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `follow_up_record_${record.name.replace(/\s+/g, '_').toLowerCase()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download individual record as a MS Word compatible .doc document:
  const handleDownloadWord = () => {
    const htmlOutput = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <title>Follow Up Report - ${record.name}</title>
        <style>
          body { font-family: 'Times New Roman', serif; padding: 40px; color: #111; line-height: 1.5; }
          .certificate { border: 3px double #333; padding: 30px; max-width: 600px; margin: auto; }
          h2 { font-family: 'Georgia', serif; text-align: center; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #333; padding-bottom: 15px; font-weight: normal; }
          .section-title { font-weight: bold; font-family: Arial, sans-serif; font-size: 10px; text-transform: uppercase; color: #555; margin-top: 15px; margin-bottom: 5px; }
          .content-text { font-size: 14px; margin-bottom: 15px; }
          .report-box { border: 1px solid #999; padding: 15px; background: #fafafa; font-style: italic; margin-top: 15px; font-size: 13px; }
          .footer { text-align: center; font-size: 10px; color: #777; margin-top: 30px; font-family: monospace; }
        </style>
      </head>
      <body>
        <div class="certificate">
          <h2>Follow Up Record</h2>
          <div style="text-align: center; font-size: 11px; font-family: monospace; color: #555; margin-bottom: 25px;">
            REF CODE: #${record.id.toUpperCase()}<br/>
            REGISTRATION DATE: ${record.date} @ ${record.time}
          </div>
          
          <div class="section-title">Registered Name</div>
          <div class="content-text">${record.name}</div>
          
          <div class="section-title">Sex Designation</div>
          <div class="content-text">${record.sex}</div>

          <div class="section-title">Contact Pathway</div>
          <div class="content-text">${record.phoneNumber}</div>

          <div class="section-title">Physical Area/Address</div>
          <div class="content-text">${record.address}</div>

          <div class="section-title">Ledger State</div>
          <div class="content-text"><strong>${record.status}</strong></div>

          <div class="section-title">Follow-Up Report Transcript</div>
          <div class="report-box">
            "${record.followUpReport}"
          </div>

          <div class="footer">
            Follow Up and Report Sheet Ledger Office<br/>
            Print of Official Digital Verification • Pax et Veritas
          </div>
        </div>
      </body>
      </html>
    `;
    const blob = new Blob(['\ufeff' + htmlOutput], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `follow_up_record_${record.name.replace(/\s+/g, '_').toLowerCase()}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in" id="receipt-modal-backdrop">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 15 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-xl bg-[#FAF9F6] border-2 border-ink-dark rounded-none shadow-xl relative overflow-hidden"
        id="receipt-modal-card"
      >
        {/* Broadside Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-dark/15 bg-white text-ink-dark">
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-sans uppercase tracking-[0.25em] text-ink-dark font-bold">Official Document Excerpt</span>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-ink-dark p-1 hover:bg-stone-100 transition-colors cursor-pointer"
            id="close-receipt-modal-btn"
          >
            <X size={18} />
          </button>
        </div>

        {/* Certificate Style body */}
        <div className="p-6 md:p-8 space-y-6 printable-section max-h-[70vh] overflow-y-auto" id="printable-record-slip">
          <div className="border border-ink-dark/20 p-6 md:p-8 bg-white rounded-none relative space-y-5">
            {/* Broadside Crop Marks décor */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-ink-dark/40" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-ink-dark/40" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-ink-dark/40" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-ink-dark/40" />

            {/* Title Block */}
            <div className="text-center pb-5 border-b border-ink-dark/15 border-dashed">
              <span className="text-[9px] text-stone-400 font-mono tracking-wider block">LEDGER REFID : #{record.id.slice(0, 8).toUpperCase()}</span>
              <h3 className="font-serif text-3xl font-light text-ink-dark mt-1.5 leading-tight">Follow Up Slip</h3>
              <p className="text-[10px] text-stone-500 uppercase font-sans tracking-[0.2em] font-bold mt-1">Template Registry Service</p>
            </div>

            {/* Structured details */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 pt-2 text-ink-dark">
              <div>
                <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-stone-450 block">Name of Registered</span>
                <span className="text-base font-serif font-light block mt-0.5">{record.name}</span>
              </div>
              <div>
                <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-stone-450 block">Descriptive Sex</span>
                <span className="text-xs font-serif italic text-stone-800 block mt-1">✦ {record.sex}</span>
              </div>
              <div>
                <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-stone-450 block">Contact Pathway</span>
                <span className="text-xs font-mono text-stone-700 block mt-1">{record.phoneNumber}</span>
              </div>
              <div>
                <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-stone-450 block">Registry Seal Time</span>
                <span className="text-[10px] font-mono text-stone-650 block mt-1">{record.date} @ {record.time}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-stone-450 block">Physical Area Address</span>
                <span className="text-xs font-sans text-stone-700 block mt-1 italic">{record.address}</span>
              </div>
            </div>

            {/* Report Content Panel */}
            <div className="pt-4 border-t border-ink-dark/15 border-dashed">
              <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-stone-450 block mb-1.5">Follow-Up Report Transcript</span>
              <div className="border border-stone-200 bg-[#FAF9F6] p-4 rounded-none">
                <p className="text-xs text-stone-750 italic font-serif leading-relaxed h-[100px] overflow-y-auto whitespace-pre-line">
                  "{record.followUpReport}"
                </p>
              </div>
            </div>

            {/* Status sign off */}
            <div className="flex items-center justify-between text-[10px] font-sans text-stone-500 pt-2 border-t border-stone-100">
              <span className="flex items-center gap-1.5 uppercase font-bold text-[9px] tracking-widest text-stone-550">
                <span className="w-1.5 h-1.5 rounded-full bg-ink-dark" />
                <span>State: {record.status}</span>
              </span>
              <span className="italic font-serif">Pax et Veritas.</span>
            </div>
          </div>
        </div>

        {/* Footer actions with notepad, word, print downloads */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-4 bg-[#FAF9F6] border-t border-ink-dark/15 text-xs">
          <button
            onClick={handleCopy}
            className="text-stone-500 hover:text-ink-dark font-sans uppercase font-bold tracking-wider hover:underline transition-all cursor-pointer"
          >
            {copied ? "Copied Plaintext!" : "Copy Text"}
          </button>

          <div className="flex items-center gap-2">
            {/* Download individual Notepad */}
            <button
              onClick={handleDownloadNotepad}
              title="Save this record to Notepad file"
              className="flex items-center gap-1.5 px-3 py-1.5 border border-ink-dark/20 hover:border-ink-dark text-ink-dark hover:bg-stone-50 text-xs font-sans uppercase font-bold tracking-wider rounded-none transition-all cursor-pointer"
            >
              <FileCode size={12} />
              <span className="max-sm:hidden">Notepad</span>
            </button>

            {/* Download individual Word */}
            <button
              onClick={handleDownloadWord}
              title="Save this record to Word document"
              className="flex items-center gap-1.5 px-3 py-1.5 border border-ink-dark/20 hover:border-ink-dark text-ink-dark hover:bg-stone-50 text-xs font-sans uppercase font-bold tracking-wider rounded-none transition-all cursor-pointer"
            >
              <Download size={12} />
              <span className="max-sm:hidden">Word (.doc)</span>
            </button>

            {/* Download individual Web Page (Parse-proof mobile view) */}
            <button
              onClick={handleDownloadHtml}
              title="Save this record to HTML (best for mobile devices with no parse errors)"
              className="flex items-center gap-1.5 px-3 py-1.5 border border-ink-dark/20 hover:border-ink-dark text-ink-dark hover:bg-stone-50 text-xs font-sans uppercase font-bold tracking-wider rounded-none transition-all cursor-pointer"
            >
              <FileCode size={12} />
              <span>Web Doc (.html)</span>
            </button>
            
            {/* Individual PDF/Print */}
            <button
              onClick={handlePrint}
              title="Print single record card"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-ink-dark hover:bg-neutral-800 text-white text-xs font-sans uppercase font-bold tracking-wider rounded-none transition-all cursor-pointer"
              id="print-slip-btn"
            >
              <Printer size={12} />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
