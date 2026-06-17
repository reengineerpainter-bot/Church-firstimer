export interface TempleRecord {
  id: string;
  name: string;
  sex: string; // "Male" | "Female" | "Other" | "Prefer Not to Say"
  phoneNumber: string;
  address: string;
  followUpReport: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: RecordStatus;
}

export type RecordStatus = 
  | 'Pending Follow-up'
  | 'In Progress'
  | 'Completed & Closed';

export interface ZenQuote {
  text: string;
  author: string;
}
