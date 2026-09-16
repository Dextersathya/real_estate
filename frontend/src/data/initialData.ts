import { Property, User, Enquiry, Notification, PropertyTimeline, SiteContent } from '../types';

export const initialSiteContent: SiteContent = {
  companyEmail: 'contact@lalanri.com',
  companyPhone: '+91 99625 25935',
  companyWhatsApp: '+91 99625 25935',
  officeAddress: 'Lala NRI Realty Towers, Suite 802, Jubilee Hills, Hyderabad, Telangana 500033, India',
  heroHeading: 'Your Property. Professionally Managed.',
  heroSubheading: 'Trusted property management and real estate services for Non-Resident Indians.',
  aboutText: 'Lala NRI Realty is India’s premier bespoke property management and real estate firm dedicated strictly to Non-Resident Indians across USA, UK, UAE, Canada, Australia, and worldwide. We serve as your single trusted point of contact, taking complete ownership of your investments so you can enjoy total peace of mind.',
  socialLinks: {
    linkedin: 'https://linkedin.com/company/lalanri-realty',
    instagram: 'https://instagram.com/lalanri_realty',
    facebook: 'https://facebook.com/lalanrirealty',
    twitter: 'https://x.com/lalanrirealty',
  },
};

export const initialUsers: User[] = [
  {
    id: 'user-admin-1',
    email: 'admin@lalanri.com',
    fullName: 'Lala NRI Admin',
    phone: '+91 98765 00000',
    country: 'India',
    role: 'ADMIN',
    emailVerified: true,
    status: 'active',
    createdAt: '2025-01-01T10:00:00Z',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'user-owner-1',
    email: 'rajesh.sharma@nri.com',
    fullName: 'Rajesh Sharma',
    phone: '+1 408 555 0192',
    country: 'United States',
    role: 'PROPERTY_OWNER',
    emailVerified: true,
    status: 'active',
    createdAt: '2025-02-15T14:30:00Z',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'user-owner-2',
    email: 'priya.patel@nri.com',
    fullName: 'Priya Patel',
    phone: '+44 20 7946 0912',
    country: 'United Kingdom',
    role: 'PROPERTY_OWNER',
    emailVerified: true,
    status: 'active',
    createdAt: '2025-03-01T09:15:00Z',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
  },
  {
    id: 'user-owner-3',
    email: 'vikram.singh@nri.com',
    fullName: 'Vikram Singh',
    phone: '+971 50 123 4567',
    country: 'United Arab Emirates',
    role: 'PROPERTY_OWNER',
    emailVerified: true,
    status: 'active',
    createdAt: '2025-03-10T11:45:00Z',
  },
];

export const initialProperties: Property[] = [
  {
    id: 'prop-101',
    title: 'The Sky Villa at Jubilee Hills',
    description: 'A magnificent 4-BHK duplex sky villa offering panoramic city views, private plunge pool, double-height living room, automated smart security, and dedicated concierge services. Fully maintained under Lala NRI Realty Premium Management.',
    type: 'Residential',
    category: 'Management',
    location: 'Jubilee Hills, Road No. 36',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500033',
    addressDetails: 'Plot 412, Sky Villa Enclave, Jubilee Hills',
    areaSqFt: 5200,
    bedrooms: 4,
    bathrooms: 5,
    furnishingStatus: 'Fully Furnished',
    features: [
      'Private Plunge Pool',
      '24/7 Security CCTV',
      'Smart Home Automation',
      'Italian Marble Flooring',
      'Italian Modular Kitchen',
      '3 Reserved Underground Parking',
      'Clubhouse & Gym Access'
    ],
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=1200'
    ],
    documents: [
      { id: 'doc-1', name: 'Title Deed & Encumbrance Certificate.pdf', url: '#', dateUploaded: '2025-02-16', fileType: 'PDF' },
      { id: 'doc-2', name: 'Quarterly Property Inspection Report Q2 2026.pdf', url: '#', dateUploaded: '2026-06-15', fileType: 'PDF' },
      { id: 'doc-3', name: 'Property Tax Receipt FY 2025-26.pdf', url: '#', dateUploaded: '2026-04-10', fileType: 'PDF' }
    ],
    ownerId: 'user-owner-1',
    ownerName: 'Rajesh Sharma',
    ownerEmail: 'rajesh.sharma@nri.com',
    ownerPhone: '+1 408 555 0192',
    status: 'Under Management',
    occupancyStatus: 'Occupied',
    tenantName: 'Senior Corporate Executive (MNC Tech)',
    lastInspectionDate: '2026-07-12',
    createdAt: '2025-02-16T10:00:00Z',
    isFeatured: true
  },
  {
    id: 'prop-102',
    title: 'Cyber Towers Tech Park Office Suite',
    description: 'Grade-A commercial office space situated in the heart of HITEC City. Features LEED Gold certified infrastructure, 100% power backup, high-speed elevator access, and structured tenant management handled by Lala NRI Realty.',
    type: 'Commercial',
    category: 'Rent',
    location: 'HITEC City, Phase 2',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500081',
    areaSqFt: 12500,
    features: [
      '100% Power Backup',
      'LEED Gold Certified',
      'Centralized HVAC',
      '20 Reserved Parking Slots',
      'High-Speed Elevators',
      '24/7 Access & Guarded Lobby'
    ],
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1200'
    ],
    documents: [
      { id: 'doc-4', name: 'Occupancy Certificate.pdf', url: '#', dateUploaded: '2025-03-02', fileType: 'PDF' }
    ],
    ownerId: 'user-owner-2',
    ownerName: 'Priya Patel',
    ownerEmail: 'priya.patel@nri.com',
    ownerPhone: '+44 20 7946 0912',
    status: 'Approved',
    occupancyStatus: 'Vacant',
    createdAt: '2025-03-02T11:20:00Z',
    isFeatured: true
  },
  {
    id: 'prop-103',
    title: 'Gated Community Farmhouse & Plantation Land',
    description: 'Serene 3-acre farmland property with mature teakwood & fruit orchard, modern timber farmhouse, drip irrigation system, perimeter solar fencing, and on-site caretaker monitored weekly by Lala NRI field teams.',
    type: 'Farmland',
    category: 'Buy',
    location: 'Shankarpally - Chevella Highway',
    city: 'Ranga Reddy District',
    state: 'Telangana',
    pincode: '501203',
    areaSqFt: 130680, // 3 acres
    bedrooms: 2,
    bathrooms: 2,
    features: [
      '3 Acres Gated Farmland',
      'Organic Fruit Orchard',
      'Drip Irrigation System',
      'Solar Powered Perimeter',
      'Borewell with High Yield',
      'Clear Title & Single Owner'
    ],
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&q=80&w=1200'
    ],
    ownerId: 'user-owner-3',
    ownerName: 'Vikram Singh',
    ownerEmail: 'vikram.singh@nri.com',
    ownerPhone: '+971 50 123 4567',
    status: 'Active',
    occupancyStatus: 'Vacant',
    createdAt: '2025-03-12T15:10:00Z',
    isFeatured: true
  },
  {
    id: 'prop-104',
    title: 'Commercial Growth Corridor Corner Plot',
    description: 'Prime commercial land measuring 2,400 sq yards right on the Outer Ring Road service highway. Ideal for hotel development, retail showroom, or logistics hub with high visibility and clear 100-ft road frontage.',
    type: 'Land',
    category: 'Buy',
    location: 'Gachibowli Financial District Ext.',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500032',
    areaSqFt: 21600, // 2400 sq yards
    features: [
      'Corner Plot with 2 Sides Road',
      'HMDA Approved Layout',
      '100 Feet Wide Road Frontage',
      'Immediate Clearance Available',
      'Commercial Zoned Land'
    ],
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200'
    ],
    ownerId: 'user-owner-1',
    ownerName: 'Rajesh Sharma',
    ownerEmail: 'rajesh.sharma@nri.com',
    ownerPhone: '+1 408 555 0192',
    status: 'Approved',
    occupancyStatus: 'Vacant',
    createdAt: '2025-04-01T08:00:00Z',
    isFeatured: false
  },
  {
    id: 'prop-105',
    title: 'Modern Logistic & Logistics Industrial Facility',
    description: 'Pre-engineered warehouse and distribution facility complete with dock levelers, fire safety sprinklers, heavy vehicle maneuvering yard, and 24/7 CCTV surveillance managed end-to-end for NRI investors.',
    type: 'Industrial',
    category: 'Management',
    location: 'Patancheru Industrial Zone',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '502319',
    areaSqFt: 45000,
    features: [
      'FM2 Grade Flooring',
      'Height Clearance 12 Meters',
      'Dock Levelers Included',
      'NFPA Fire Sprinkler System',
      'High Voltage Transformer Station'
    ],
    images: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1200'
    ],
    ownerId: 'user-owner-2',
    ownerName: 'Priya Patel',
    ownerEmail: 'priya.patel@nri.com',
    ownerPhone: '+44 20 7946 0912',
    status: 'Under Management',
    occupancyStatus: 'Occupied',
    tenantName: 'Global E-Commerce Logistics Ltd',
    lastInspectionDate: '2026-06-20',
    createdAt: '2025-04-10T12:00:00Z',
    isFeatured: false
  },
  {
    id: 'prop-106',
    title: 'Bespoke Luxury Estate at Sadashivnagar',
    description: 'An architectural masterpiece featuring modern stone facade, teakwood paneling, expansive landscaped gardens, smart home energy grid, and 24/7 security. Maintained in pristine condition for overseas family trips.',
    type: 'Residential',
    category: 'Management',
    location: 'Sadashivnagar, Palace Area',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560080',
    areaSqFt: 6800,
    bedrooms: 5,
    bathrooms: 6,
    furnishingStatus: 'Fully Furnished',
    features: [
      'Landscaping & Lawn Care',
      'Solar Energy Microgrid',
      'Private Elevator',
      'Home Theater Room',
      'Staff Quarters Included'
    ],
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=1200'
    ],
    ownerId: 'user-owner-3',
    ownerName: 'Vikram Singh',
    ownerEmail: 'vikram.singh@nri.com',
    ownerPhone: '+971 50 123 4567',
    status: 'Under Management',
    occupancyStatus: 'Vacant',
    lastInspectionDate: '2026-07-28',
    createdAt: '2025-05-01T09:30:00Z',
    isFeatured: true
  }
];

export const initialEnquiries: Enquiry[] = [
  {
    id: 'enq-201',
    propertyId: 'prop-101',
    propertyTitle: 'The Sky Villa at Jubilee Hills',
    name: 'Siddharth Rao',
    email: 'siddharth.rao@example.com',
    phone: '+1 650 999 1234',
    country: 'United States',
    enquiryType: 'Management',
    message: 'I own a similar penthouse villa in Jubilee Hills and want Lala NRI Realty to handle complete tenant management, monthly rent collection, and physical inspections.',
    preferredContact: 'WhatsApp',
    status: 'In Progress',
    adminNotes: 'Assigned Senior Manager Mr. Ramesh for initial video consultation call.',
    createdAt: '2026-08-01T11:20:00Z'
  },
  {
    id: 'enq-202',
    propertyId: 'prop-103',
    propertyTitle: 'Gated Community Farmhouse & Plantation Land',
    name: 'Ananya Deshmukh',
    email: 'ananya.d@example.co.uk',
    phone: '+44 7700 900123',
    country: 'United Kingdom',
    enquiryType: 'Buy',
    message: 'Interested in buying agricultural farmland near Shankarpally. Request title verification summary and site visit assistance when I travel to India next month.',
    preferredContact: 'Phone',
    status: 'New',
    createdAt: '2026-08-03T16:40:00Z'
  },
  {
    id: 'enq-203',
    name: 'Karan Mehta',
    email: 'karan.mehta@example.com',
    phone: '+971 55 888 7766',
    country: 'United Arab Emirates',
    enquiryType: 'Sell',
    message: 'I want to sell my commercial land parcel near ORR Hyderabad through Lala NRI Realty reach. Please guide on listing procedures and confidentiality.',
    preferredContact: 'Email',
    status: 'Contacted',
    adminNotes: 'Email sent with property onboarding questionnaire and privacy agreement.',
    createdAt: '2026-08-04T09:10:00Z'
  }
];

export const initialNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-owner-1',
    title: 'Inspection Completed',
    message: 'Q2 2026 Property Inspection Report for "The Sky Villa at Jubilee Hills" has been uploaded to your document portal.',
    date: '2026-07-13T10:00:00Z',
    read: false,
    link: '/dashboard/properties/prop-101'
  },
  {
    id: 'notif-2',
    userId: 'user-owner-1',
    title: 'Tenant Rent Remittance Received',
    message: 'July rent payment for Jubilee Hills Sky Villa has been verified and safely remitted to your NRE account.',
    date: '2026-07-05T14:20:00Z',
    read: true,
    link: '/dashboard/properties/prop-101'
  },
  {
    id: 'notif-3',
    userId: 'user-owner-2',
    title: 'Maintenance Update',
    message: 'HVAC filter replacement & electrical panel safety check completed at Cyber Towers Tech Park Suite.',
    date: '2026-06-21T11:15:00Z',
    read: true,
    link: '/dashboard/properties/prop-102'
  }
];

export const initialTimeline: PropertyTimeline[] = [
  {
    id: 'time-1',
    propertyId: 'prop-101',
    title: 'Bi-Monthly Physical Inspection',
    description: 'Full 45-point physical inspection conducted by Field Manager Mr. S. Reddy. Plunge pool filtration operational, plumbing lines pressure-tested, smart locks updated.',
    date: '2026-07-12',
    author: 'Lala NRI Field Team',
    category: 'Inspection'
  },
  {
    id: 'time-2',
    propertyId: 'prop-101',
    title: 'Property Tax Payment Completed',
    description: 'GHMC Annual Property Tax paid in full for FY 2025-26 under early bird discount scheme. Receipt archived in owner vault.',
    date: '2026-04-10',
    author: 'Lala NRI Accounts',
    category: 'Document'
  },
  {
    id: 'time-3',
    propertyId: 'prop-101',
    title: 'Tenant Lease Renewal Executed',
    description: 'Lease extended for 12 months with pre-agreed 5% escalation. Both parties signed digitally.',
    date: '2026-02-01',
    author: 'Lala NRI Legal Desk',
    category: 'Tenant'
  }
];
