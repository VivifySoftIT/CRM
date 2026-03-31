export const INITIAL_CAMPAIGNS = [
  {
    id: "camp-1",
    name: "Q3 Enterprise Software Solutions Launch",
    type: "Email Campaign",
    status: "Active",
    startDate: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 20)).toISOString(),
    budget: 5000,
    actualCost: 2150,
    targetAudience: ["Enterprise Clients", "SaaS Contacts"],
    content: "We are thrilled to announce the Q3 Rollout of our new software framework...",
    metrics: {
      sent: 15400,
      opened: 8120,
      clicked: 3200,
      leads: 145,
      conversions: 12,
      revenue: 45000
    },
    owner: "Sarah Doe",
    createdAt: new Date().toISOString()
  },
  {
    id: "camp-2",
    name: "Summer Promo - 20% Off SMS Blast",
    type: "SMS Campaign",
    status: "Completed",
    startDate: new Date(new Date().setDate(new Date().getDate() - 40)).toISOString(),
    endDate: new Date(new Date().setDate(new Date().getDate() - 35)).toISOString(),
    budget: 800,
    actualCost: 650,
    targetAudience: ["Recent Churns", "Newsletter Subscribers"],
    content: "Summer is here! Enjoy 20% off all VivifySoft services. Code: SUMMER20 https://vivify.link/promo",
    metrics: {
      sent: 8000,
      opened: 8000, // SMS essentially "opened" upon delivery
      clicked: 1450,
      leads: 300,
      conversions: 45,
      revenue: 12800
    },
    owner: "John Sales",
    createdAt: new Date(new Date().setDate(new Date().getDate() - 45)).toISOString()
  },
  {
    id: "camp-3",
    name: "Tech Summit 2026 Booth Invites",
    type: "Event Campaign",
    status: "Planned",
    startDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 18)).toISOString(),
    budget: 15000,
    actualCost: 0,
    targetAudience: ["West Coast Prospects", "VIP Partners"],
    content: "Join us at Booth #404 at the SV Tech Summit. Drinks on us!",
    metrics: {
      sent: 0,
      opened: 0,
      clicked: 0,
      leads: 0,
      conversions: 0,
      revenue: 0
    },
    owner: "Emma Johnson",
    createdAt: new Date().toISOString()
  },
  {
    id: "camp-4",
    name: "LinkedIn Lead Gen - B2B Retargeting",
    type: "Social Media Campaign",
    status: "Active",
    startDate: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 25)).toISOString(),
    budget: 3500,
    actualCost: 1200,
    targetAudience: ["C-Level Execs", "IT Directors"],
    content: "Are your legacy systems slowing your team down? Read our whitepaper...",
    metrics: {
      sent: 25000, // Impressions
      opened: 0, 
      clicked: 850,
      leads: 65,
      conversions: 4,
      revenue: 8500
    },
    owner: "Michael Chang",
    createdAt: new Date().toISOString()
  }
];

export const STATUS_COLORS = {
  'Planned': { bg: '#f1f5f9', text: '#64748b', border: '#e2e8f0', dot: '#94a3b8' },
  'Active': { bg: '#ecfdf5', text: '#10b981', border: '#a7f3d0', dot: '#10b981' },
  'Completed': { bg: '#eff6ff', text: '#3b82f6', border: '#bfdbfe', dot: '#3b82f6' },
  'Cancelled': { bg: '#fef2f2', text: '#ef4444', border: '#fecaca', dot: '#ef4444' }
};

export const CAMPAIGN_TYPES = [
  'Email Campaign',
  'SMS Campaign',
  'Social Media Campaign',
  'Event Campaign',
  'Advertisement Campaign'
];
