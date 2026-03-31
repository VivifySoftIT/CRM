export const INITIAL_CATEGORIES = [
  'Technical Issues',
  'Billing & Subscriptions',
  'General Queries',
  'Product Help'
];

export const INITIAL_SOLUTIONS = [
  {
    id: "sol-1",
    title: "How to resolve 'Error Code 401' on mobile app",
    category: "Technical Issues",
    content: "<h3>Overview</h3><p>If a user encounters Error 401 on the mobile application, it means their session token has either expired or become invalid during a background refresh.</p><h3>Resolution Steps</h3><ul><li>Ask the user to completely close the app (swipe up to kill process).</li><li>Navigate to Phone Settings > Apps > Our App > Clear Cache.</li><li>Open the app and re-authenticate using their credentials.</li></ul>",
    tags: ["login", "mobile", "error 401", "authentication"],
    status: "Published",
    attachments: [],
    author: "Alice Admin",
    createdAt: "2024-03-20T10:00:00Z",
    updatedAt: "2024-03-21T14:30:00Z",
    viewCount: 142
  },
  {
    id: "sol-2",
    title: "Understanding annual vs monthly billing cycles",
    category: "Billing & Subscriptions",
    content: "<h3>Billing Cycles Explained</h3><p>We offer two primary subscription cycles: Monthly and Annual.</p><ul><li><strong>Monthly:</strong> Charged on the calendar date the subscription originated (e.g., the 14th of every month). No prorated refunds are offered for mid-month cancellations.</li><li><strong>Annual:</strong> Charged upfront for 12 months with a built-in 20% discount.</li></ul>",
    tags: ["billing", "subscription", "annual", "refund"],
    status: "Published",
    attachments: [],
    author: "Bob Manager",
    createdAt: "2024-03-22T09:15:00Z",
    updatedAt: "2024-03-24T11:00:00Z",
    viewCount: 89
  },
  {
    id: "sol-3",
    title: "Drafting an Enterprise SLA Agreement",
    category: "Product Help",
    content: "<p>Work in progress. Do not share with customers yet.</p><ul><li>Gather requirements from Deal phase</li><li>Align with legal compliance markers</li></ul>",
    tags: ["sla", "enterprise"],
    status: "Draft",
    attachments: [],
    author: "Sarah Executive",
    createdAt: "2024-03-26T16:45:00Z",
    updatedAt: "2024-03-26T16:50:00Z",
    viewCount: 0
  }
];

export const STATUS_COLORS = {
  'Draft': { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200' },
  'Published': { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' }
};
