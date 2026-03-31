export const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Standard Double Room",
    sku: "RM-STD-DBL",
    category: "Room Service",
    price: 4500,
    tax: 12,
    stock: 25,
    unit: "night",
    description: "Spacious double room with queen bed and city view.",
    status: "Active",
    owner: "John Sales",
    createdAt: "2024-03-20T10:00:00Z"
  },
  {
    id: 2,
    name: "Luxury Suite",
    sku: "RM-LUX-STE",
    category: "Room Service",
    price: 12500,
    tax: 18,
    stock: 5,
    unit: "night",
    description: "Premium suite with king bed, balcony, and spa access.",
    status: "Active",
    owner: "John Sales",
    createdAt: "2024-03-21T11:30:00Z"
  },
  {
    id: 3,
    name: "Airport Transfer - SUV",
    sku: "SRV-TRN-SUV",
    category: "Transportation",
    price: 2500,
    tax: 5,
    stock: null,
    unit: "trip",
    description: "Private SUV transfer to/from the airport.",
    status: "Active",
    owner: "Sarah Clark",
    createdAt: "2024-03-22T09:15:00Z"
  },
  {
    id: 4,
    name: "Conference Room Half Day",
    sku: "SRV-CONF-HD",
    category: "Events",
    price: 15000,
    tax: 18,
    stock: 2,
    unit: "session",
    description: "State-of-the-art conference room for up to 50 people.",
    status: "Inactive",
    owner: "Mike Ross",
    createdAt: "2024-03-23T14:45:00Z"
  },
  {
    id: 5,
    name: "Gourmet Breakfast Buffet",
    sku: "FD-BRK-BUFF",
    category: "Food & Beverage",
    price: 850,
    tax: 5,
    stock: 100,
    unit: "pcs",
    description: "Unlimited breakfast buffet with international cuisine.",
    status: "Active",
    owner: "John Sales",
    createdAt: "2024-03-24T08:00:00Z"
  }
];

export const PRODUCT_CATEGORIES = [
  "Room Service",
  "Food & Beverage",
  "Transportation",
  "Events",
  "Spa & Wellness",
  "Maintenance",
  "Other"
];
