export const INITIAL_VISITS = [
  {
    id: "v-1",
    title: "Quarterly Review & Upsell Pitch",
    contactName: "John Smith",
    contactId: "cnt-123",
    dealName: "Enterprise Renewal Q3",
    dealId: "dl-456",
    location: "123 Tech Blvd, Silicon Valley, CA",
    latitude: 37.3875,
    longitude: -122.0575,
    visitDate: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(), // Today at 10 AM
    duration: 60, // minutes
    status: "Completed",
    notes: "Discussed the new modular features and how it integrates with their existing tech stack. Need to follow up with pricing for the add-ons.",
    outcome: "Success - Requested Proposal",
    owner: "Sarah Doe",
    attachments: [],
    checkInTime: new Date(new Date().setHours(9, 58, 0, 0)).toISOString(),
    checkOutTime: new Date(new Date().setHours(11, 0, 0, 0)).toISOString(),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString()
  },
  {
    id: "v-2",
    title: "Initial Product Demo",
    contactName: "Emma Johnson",
    contactId: "cnt-124",
    dealName: "Digital Transformation Project",
    dealId: "dl-457",
    location: "456 Market St, San Francisco, CA",
    latitude: 37.7749,
    longitude: -122.4194,
    visitDate: new Date(new Date().setHours(14, 30, 0, 0)).toISOString(), // Today at 2:30 PM
    duration: 90,
    status: "Checked-In",
    notes: "Giving a full end-to-end demo of the CRM focusing on automation rules.",
    outcome: "",
    owner: "Sarah Doe",
    attachments: [],
    checkInTime: new Date(new Date().setHours(14, 25, 0, 0)).toISOString(),
    checkOutTime: null,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString()
  },
  {
    id: "v-3",
    title: "Contract Negotiation Luncheon",
    contactName: "Michael Chang",
    contactId: "cnt-125",
    dealName: "Global POS Rollout",
    dealId: "dl-458",
    location: "789 Pine St, Seattle, WA",
    latitude: 47.6062,
    longitude: -122.3321,
    visitDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), // Tomorrow
    duration: 120,
    status: "Scheduled",
    notes: "Meeting over lunch to hammer out the final MSA redlines.",
    outcome: "",
    owner: "John Sales",
    attachments: [],
    checkInTime: null,
    checkOutTime: null,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString()
  },
  {
    id: "v-4",
    title: "Technical Site Audit",
    contactName: "Sarah Connor",
    contactId: "cnt-126",
    dealName: "",
    dealId: null,
    location: "101 Cyberdyne Way, Los Angeles, CA",
    latitude: 34.0522,
    longitude: -118.2437,
    visitDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(), // Yesterday
    duration: 45,
    status: "Missed",
    notes: "Client had a building emergency and had to reschedule.",
    outcome: "Needs Reschedule",
    owner: "John Sales",
    attachments: [],
    checkInTime: null,
    checkOutTime: null,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString()
  }
];

export const STATUS_COLORS = {
  'Scheduled': { bg: '#eff6ff', text: '#3b82f6', border: '#bfdbfe', dot: '#3b82f6' },
  'Checked-In': { bg: '#fff7ed', text: '#ea580c', border: '#fed7aa', dot: '#f97316' },
  'Completed': { bg: '#ecfdf5', text: '#10b981', border: '#a7f3d0', dot: '#10b981' },
  'Missed': { bg: '#fef2f2', text: '#ef4444', border: '#fecaca', dot: '#ef4444' },
  'Cancelled': { bg: '#f1f5f9', text: '#64748b', border: '#e2e8f0', dot: '#94a3b8' }
};

export const MOCK_CONTACTS = ['John Smith', 'Emma Johnson', 'Michael Chang', 'Sarah Connor', 'Alan Turing'];
export const MOCK_DEALS = ['Enterprise Renewal Q3', 'Digital Transformation Project', 'Global POS Rollout', 'Phase 2 Implementation', 'Cloud Migration Setup'];
