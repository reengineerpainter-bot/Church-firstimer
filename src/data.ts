import { TempleRecord, ZenQuote } from './types';

export const ZEN_QUOTES: ZenQuote[] = [
  {
    text: "Consistent follow-up is the bridge that turns initial contact into dependable community support.",
    author: "Registry Desk"
  },
  {
    text: "Detail in reports preserves the clarity of memory and the continuity of care.",
    author: "Administrative Diligence"
  },
  {
    text: "To listen patiently is the first step of service; to update records ensures that nothing is forgotten.",
    author: "Care Guidelines"
  },
  {
    text: "An organized ledger is a silent helper that helps coordinate wellness, safety, and check-ins.",
    author: "Stewardship Practice"
  },
  {
    text: "May all who are registered in these sheets experience responsive attention and accurate coordination.",
    author: "Service Dedication"
  }
];

export const INITIAL_RECORDS: TempleRecord[] = [
  {
    id: "rec_1",
    name: "Ariya Chen",
    sex: "Female",
    phoneNumber: "+1 (555) 234-5678",
    address: "742 Evergreen Terrace, Springfield",
    followUpReport: "Spoke with Ariya regarding her grandmother's general wellness list. Confirmed health condition is improving steadily. Will check in again next Tuesday.",
    date: "2026-06-16",
    time: "09:30",
    status: "In Progress"
  },
  {
    id: "rec_2",
    name: "Marcus Aurelius Vance",
    sex: "Male",
    phoneNumber: "+1 (555) 765-4321",
    address: "10 Downing Street, London",
    followUpReport: "Marcus requested follow-up resources for continuous standard coordination. Delivered reference material packages via email. No immediate action required.",
    date: "2026-06-17",
    time: "08:15",
    status: "Completed & Closed"
  },
  {
    id: "rec_3",
    name: "Serena Thorne",
    sex: "Female",
    phoneNumber: "+1 (555) 890-1234",
    address: "Westminster Abbey Grounds, London",
    followUpReport: "Initial check-in completed. Handled registration details and noted emergency contact numbers. Scheduled a comprehensive personal follow-up in July.",
    date: "2026-06-17",
    time: "10:10",
    status: "Pending Follow-up"
  },
  {
    id: "rec_4",
    name: "Kenji Sato",
    sex: "Other",
    phoneNumber: "+1 (555) 345-6789",
    address: "1-1 Chiyoda, Chiyoda City, Tokyo",
    followUpReport: "Shared career transition check-lists and organized local contact lines. Scheduled a brief feedback session via voice call for later this week.",
    date: "2026-06-15",
    time: "14:45",
    status: "In Progress"
  }
];
