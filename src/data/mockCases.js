export const INITIAL_CASES = [
  {
    id: "case-1",
    caseNumber: "CAS-2024-001",
    subject: "Login issue with Mobile App",
    description: "The customer is unable to login using the latest iOS version of the app. Returning error code 401 despite correct credentials.",
    contactName: "Jane Smith",
    relatedDeal: "",
    priority: "High",
    status: "Open",
    assignedTo: "Alice Admin",
    createdAt: "2024-03-25T09:15:00Z",
    updatedAt: "2024-03-25T09:15:00Z",
    comments: [
      { id: 1, text: "Customer reported via email. Initial troubleshooting failed.", author: "Alice Admin", date: "2024-03-25T09:30:00Z" }
    ]
  },
  {
    id: "case-2",
    caseNumber: "CAS-2024-002",
    subject: "Billing discrepancy on recent invoice",
    description: "Invoice #INV-9901 shows a duplicate charge for the annual maintenance contract.",
    contactName: "Acme Corp",
    relatedDeal: "Annual Maintenance",
    priority: "Medium",
    status: "In Progress",
    assignedTo: "Bob Manager",
    createdAt: "2024-03-24T14:20:00Z",
    updatedAt: "2024-03-26T10:00:00Z",
    comments: [
      { id: 1, text: "Checking with accounting team.", author: "Bob Manager", date: "2024-03-25T11:00:00Z" }
    ]
  },
  {
    id: "case-3",
    caseNumber: "CAS-2024-003",
    subject: "How-to: Export data to CSV",
    description: "User wants to know how to export all contact lists to CSV format.",
    contactName: "John Doe",
    relatedDeal: "",
    priority: "Low",
    status: "Closed",
    assignedTo: "Sarah Executive",
    createdAt: "2024-03-20T11:00:00Z",
    updatedAt: "2024-03-21T09:45:00Z",
    comments: [
      { id: 1, text: "Sent knowledge base article link.", author: "Sarah Executive", date: "2024-03-21T09:40:00Z" },
      { id: 2, text: "Customer confirmed it works. Closing.", author: "Sarah Executive", date: "2024-03-21T09:45:00Z" }
    ]
  },
  {
    id: "case-4",
    caseNumber: "CAS-2024-004",
    subject: "System outage during checkout",
    description: "Multiple users reporting checkout failures resulting in cart abandonment.",
    contactName: "Diana Prince",
    relatedDeal: "Website Redesign",
    priority: "High",
    status: "Escalated",
    assignedTo: "Alice Admin",
    createdAt: "2024-03-26T15:30:00Z",
    updatedAt: "2024-03-26T16:15:00Z",
    comments: [
      { id: 1, text: "Escalating to engineering immediately. Seems related to the payment gateway.", author: "Alice Admin", date: "2024-03-26T16:00:00Z" }
    ]
  },
  {
    id: "case-5",
    caseNumber: "CAS-2024-005",
    subject: "Update contact details for main account",
    description: "Need to change billing email address to accounting@example.com based on recent changes.",
    contactName: "Charlie Brown",
    relatedDeal: "",
    priority: "Medium",
    status: "Open",
    assignedTo: "Bob Manager",
    createdAt: "2024-03-27T08:00:00Z",
    updatedAt: "2024-03-27T08:00:00Z",
    comments: []
  }
];

export const PRIORITY_OPTIONS = ['High', 'Medium', 'Low'];
export const STATUS_OPTIONS = ['Open', 'In Progress', 'Escalated', 'Closed'];

export const STATUS_COLORS = {
  'Open': { text: 'text-gray-600', bg: 'bg-gray-500/10', dot: 'bg-gray-500' },
  'In Progress': { text: 'text-blue-600', bg: 'bg-blue-500/10', dot: 'bg-blue-500' },
  'Escalated': { text: 'text-orange-600', bg: 'bg-orange-500/10', dot: 'bg-orange-500' },
  'Closed': { text: 'text-emerald-600', bg: 'bg-emerald-500/10', dot: 'bg-emerald-500' }
};

export const PRIORITY_COLORS = {
  'High': { text: 'text-red-600', icon: 'text-red-500' },
  'Medium': { text: 'text-yellow-600', icon: 'text-yellow-500' },
  'Low': { text: 'text-gray-600', icon: 'text-gray-400' }
};
