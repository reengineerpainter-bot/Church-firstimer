import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Phone, 
  BookOpen, 
  MapPin, 
  FileText,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { TempleRecord } from '../types';

interface RecordFormProps {
  onAddRecord: (record: Omit<TempleRecord, 'id' | 'date' | 'time' | 'status'>) => void;
  editingRecord: TempleRecord | null;
  onUpdateRecord: (record: TempleRecord) => void;
  onCancelEdit: () => void;
}

export default function RecordForm({ 
  onAddRecord, 
  editingRecord, 
  onUpdateRecord, 
  onCancelEdit 
}: RecordFormProps) {
  const [name, setName] = useState('');
  const [sex, setSex] = useState('Female');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [followUpReport, setFollowUpReport] = useState('');
  
  // Validation State
  const [errors, setErrors] = useState<{ 
    name?: string; 
    phone?: string; 
    address?: string; 
    followUpReport?: string;
  }>({});
  const [success, setSuccess] = useState(false);

  // Sync edits
  useEffect(() => {
    if (editingRecord) {
      setName(editingRecord.name);
      setSex(editingRecord.sex);
      setPhoneNumber(editingRecord.phoneNumber);
      setAddress(editingRecord.address);
      setFollowUpReport(editingRecord.followUpReport);
    } else {
      setName('');
      setSex('Female');
      setPhoneNumber('');
      setAddress('');
      setFollowUpReport('');
    }
    setErrors({});
  }, [editingRecord]);

  // Validate fields on submit
  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!phoneNumber.trim()) {
      newErrors.phone = 'Phone number is required for follow-up coordination';
    } else {
      const rawPhone = phoneNumber.replace(/\D/g, '');
      if (rawPhone.length < 7) {
        newErrors.phone = 'Specify a valid phone number (at least 7 digits)';
      }
    }

    if (!address.trim()) {
      newErrors.address = 'Physical address is required for geographic tracking';
    } else if (address.trim().length < 5) {
      newErrors.address = 'Specify a more descriptive address';
    }

    if (!followUpReport.trim()) {
      newErrors.followUpReport = 'Follow-up report details are required';
    } else if (followUpReport.trim().length < 10) {
      newErrors.followUpReport = 'Specify a more comprehensive report (at least 10 characters)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingRecord) {
      onUpdateRecord({
        ...editingRecord,
        name: name.trim(),
        sex,
        phoneNumber: phoneNumber.trim(),
        address: address.trim(),
        followUpReport: followUpReport.trim(),
      });
    } else {
      onAddRecord({
        name: name.trim(),
        sex,
        phoneNumber: phoneNumber.trim(),
        address: address.trim(),
        followUpReport: followUpReport.trim()
      });
    }

    // Reset Form & Show Success Feedback
    setName('');
    setSex('Female');
    setPhoneNumber('');
    setAddress('');
    setFollowUpReport('');
    setErrors({});
    
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
  };

  return (
    <div className="bg-white border-2 border-ink-dark p-6 md:p-8 rounded-none relative overflow-hidden" id="entry-form-container">
      <div className="absolute top-0 left-0 w-full h-[4px] bg-ink-dark" />
      
      <div className="mb-6 border-b border-stone-200 pb-4">
        <span className="text-[10px] uppercase tracking-[0.2em] font-sans font-bold opacity-60 text-stone-500 block">
          {editingRecord ? "Modifying Registered Registry" : "Diligence Transcription"}
        </span>
        <h2 className="text-2xl font-serif font-light text-ink-dark mt-1">
          {editingRecord ? "Edit Follow Up Record" : "Follow Up Registration Entry"}
        </h2>
        <p className="text-stone-500 text-xs italic mt-1 font-serif">
          {editingRecord 
            ? `Editing the record of ${editingRecord.name}. Securely save changes to update the ledger.`
            : "Record names, sex, address, contact pathways, and report specifics below to commit them to the ledger."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" id="visitor-ledger-form">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Full Name */}
          <div className="md:col-span-2">
            <label className="block text-stone-700 font-bold text-[10px] font-sans uppercase tracking-widest mb-1.5" htmlFor="visitor-name">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                <User size={14} />
              </span>
              <input
                id="visitor-name"
                type="text"
                placeholder=""
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                }}
                className={`w-full pl-9 pr-4 py-2 bg-stone-50/50 border-b ${errors.name ? 'border-rose-450 focus:border-rose-500' : 'border-stone-200 focus:border-ink-dark'} rounded-none text-ink-dark placeholder-stone-400 text-xs focus:outline-none transition-all`}
              />
            </div>
            {errors.name && (
              <span className="text-rose-600 text-[10px] font-mono mt-1 flex items-center gap-1">
                <AlertCircle size={10} />
                {errors.name}
              </span>
            )}
          </div>

          {/* Sex Selection */}
          <div>
            <label className="block text-stone-700 font-bold text-[10px] font-sans uppercase tracking-widest mb-1.5" htmlFor="visitor-sex">
              Sex Designation
            </label>
            <select
              id="visitor-sex"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50/50 border-b border-stone-200 focus:border-ink-dark rounded-none text-ink-dark text-xs focus:outline-none transition-all cursor-pointer font-sans"
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
              <option value="Prefer Not to Say">Prefer Not to Say</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Phone Number */}
          <div>
            <label className="block text-stone-700 font-bold text-[10px] font-sans uppercase tracking-widest mb-1.5" htmlFor="visitor-phone">
              Contact Phone
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                <Phone size={14} />
              </span>
              <input
                id="visitor-phone"
                type="tel"
                placeholder=""
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
                }}
                className={`w-full pl-9 pr-4 py-2 bg-stone-50/50 border-b ${errors.phone ? 'border-rose-450 focus:border-rose-500' : 'border-stone-200 focus:border-ink-dark'} rounded-none text-ink-dark placeholder-stone-400 text-xs focus:outline-none transition-all`}
              />
            </div>
            {errors.phone && (
              <span className="text-rose-600 text-[10px] font-mono mt-1 flex items-center gap-1">
                <AlertCircle size={10} />
                {errors.phone}
              </span>
            )}
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-stone-700 font-bold text-[10px] font-sans uppercase tracking-widest mb-1.5" htmlFor="visitor-address">
              Physical Address
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                <MapPin size={14} />
              </span>
              <input
                id="visitor-address"
                type="text"
                placeholder=""
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (errors.address) setErrors(prev => ({ ...prev, address: undefined }));
                }}
                className={`w-full pl-9 pr-4 py-2 bg-stone-50/50 border-b ${errors.address ? 'border-rose-450 focus:border-rose-500' : 'border-stone-200 focus:border-ink-dark'} rounded-none text-ink-dark placeholder-stone-400 text-xs focus:outline-none transition-all`}
              />
            </div>
            {errors.address && (
              <span className="text-rose-600 text-[10px] font-mono mt-1 flex items-center gap-1">
                <AlertCircle size={10} />
                {errors.address}
              </span>
            )}
          </div>
        </div>

        {/* Follow Up Report */}
        <div>
          <label className="block text-stone-700 font-bold text-[10px] font-sans uppercase tracking-widest mb-1.5" htmlFor="followup-report">
            Follow Up Report & Details
          </label>
          <div className="relative">
            <textarea
              id="followup-report"
              rows={4}
              value={followUpReport}
              onChange={(e) => {
                setFollowUpReport(e.target.value);
                if (errors.followUpReport) setErrors(prev => ({ ...prev, followUpReport: undefined }));
              }}
              placeholder=""
              className={`w-full px-3 py-2 bg-stone-50/55 border ${errors.followUpReport ? 'border-rose-450 focus:border-rose-500' : 'border-stone-200 focus:border-ink-dark'} rounded-none text-ink-dark placeholder-stone-400 text-xs focus:outline-none resize-none`}
            />
          </div>
          {errors.followUpReport && (
            <span className="text-rose-600 text-[10px] font-mono mt-1 flex items-center gap-1">
              <AlertCircle size={10} />
              {errors.followUpReport}
            </span>
          )}
        </div>

        {/* Submit button bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-3 border-t border-stone-100">
          <div className="flex-1">
            {success && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-stone-700 text-xs font-sans italic flex items-center gap-1.5 h-6"
                id="form-success-message"
              >
                ✓ {editingRecord ? "Changes saved successfully." : "Registered permanently in local sheet ledger."}
              </motion.span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {editingRecord && (
              <button
                type="button"
                onClick={onCancelEdit}
                className="px-4 py-3.5 border border-stone-300 text-stone-600 hover:text-ink-dark hover:border-ink-dark rounded-none text-[10px] font-sans uppercase font-bold tracking-[0.15em] transition-all duration-200 cursor-pointer select-none bg-white"
                id="cancel-edit-btn"
              >
                Cancel Edit
              </button>
            )}

            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-5 py-3.5 bg-ink-dark hover:bg-neutral-800 text-white rounded-none text-[10px] font-sans uppercase font-bold tracking-[0.2em] transition-all duration-200 cursor-pointer select-none"
              id="submit-record-btn"
            >
              <span>{editingRecord ? "Save Record Changes" : "Add Record to Ledger"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
