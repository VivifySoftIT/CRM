export const INITIAL_EMAILS = [
  {
    id: "msg-1",
    from: "Jane Smith <jane.smith@example.com>",
    to: ["sales@omnicrm.com"],
    subject: "Pricing Inquiry for Enterprise Plan",
    body: "Hi Sales Team,\n\nWe are currently evaluating OmniCRM for our global team of 500 sales representatives. Could you provide a detailed breakdown of your Enterprise pricing tier, including any volume discounts and implementation fees?\n\nAdditionally, we need to know if custom SLA terms are available.\n\nBest regards,\nJane Smith\nVP of Operations, Acme Corp",
    attachments: [],
    status: "Unread",
    folder: "Inbox",
    isStarred: true,
    relatedContact: "Jane Smith",
    relatedDeal: "Q4 Enterprise Deal",
    createdAt: "2024-03-27T08:30:00Z"
  },
  {
    id: "msg-2",
    from: "John Doe <john.doe@techstartup.io>",
    to: ["support@omnicrm.com"],
    subject: "Re: Need help with API Integration",
    body: "Thanks for the quick response! The documentation you provided helped resolve the authentication error. We are now able to sync our leads successfully.\n\nOne more question: Is there a rate limit on the /v1/deals endpoint?\n\nThanks,\nJohn",
    attachments: [],
    status: "Read",
    folder: "Inbox",
    isStarred: false,
    relatedContact: "John Doe",
    relatedDeal: null,
    createdAt: "2024-03-26T14:15:00Z"
  },
  {
    id: "msg-3",
    from: "sales@omnicrm.com",
    to: ["Charlie Brown <charlie@logistics.net>"],
    subject: "Follow up on our meeting",
    body: "Hi Charlie,\n\nIt was great speaking with you yesterday. As discussed, I've attached the proposal for the customized shipping module integration.\n\nPlease let me know if you have any questions before our next call on Friday.\n\nBest,\nOmniCRM Team",
    attachments: ["proposal_logistics_v1.pdf"],
    status: "Read",
    folder: "Sent",
    isStarred: false,
    relatedContact: "Charlie Brown",
    relatedDeal: "Custom Integration",
    createdAt: "2024-03-26T09:00:00Z"
  },
  {
    id: "msg-4",
    from: "Diana Prince <diana.prince@marketing.co>",
    to: ["sales@omnicrm.com"],
    subject: "Contract Signed!",
    body: "Hi Team,\n\nI've reviewed and signed the annual contract. Looking forward to kicking off the implementation phase next week.\n\nLet me know what the next steps are.\n\nCheers,\nDiana",
    attachments: ["signed_contract_2024.pdf"],
    status: "Unread",
    folder: "Inbox",
    isStarred: true,
    relatedContact: "Diana Prince",
    relatedDeal: "Marketing Campaign",
    createdAt: "2024-03-27T10:15:00Z"
  },
  {
    id: "msg-5",
    from: "sales@omnicrm.com",
    to: ["marketing-list@omnicrm.com"],
    subject: "Draft: Q2 Newsletter Updates",
    body: "Draft content covering the new Sales Inbox features releasing in Q2. Need to add screenshots before sending.",
    attachments: [],
    status: "Read",
    folder: "Drafts",
    isStarred: false,
    relatedContact: null,
    relatedDeal: null,
    createdAt: "2024-03-25T16:45:00Z"
  }
];

export const FOLDERS = [
  { id: 'inbox', label: 'Inbox', icon: 'Inbox' },
  { id: 'sent', label: 'Sent', icon: 'Send' },
  { id: 'drafts', label: 'Drafts', icon: 'FileEdit' },
  { id: 'starred', label: 'Starred', icon: 'Star' },
  { id: 'spam', label: 'Spam', icon: 'AlertOctagon' },
  { id: 'trash', label: 'Trash', icon: 'Trash2' }
];
