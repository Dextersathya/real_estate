export type UserRole = 'PROPERTY_OWNER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  country: string;
  role: UserRole;
  emailVerified: boolean;
  status: 'active' | 'suspended';
  createdAt: string;
  avatar?: string;
}

export type PropertyType = 
  | 'Residential' 
  | 'Commercial' 
  | 'Land' 
  | 'Farmland' 
  | 'Industrial' 
  | 'Investment';

export type Category = 'Buy' | 'Sell' | 'Rent' | 'Management';

export type PropertyStatus = 
  | 'Pending Review' 
  | 'Approved' 
  | 'Rejected' 
  | 'Active' 
  | 'Under Management' 
  | 'Available' 
  | 'Rented' 
  | 'Sold' 
  | 'Archived';

export interface PropertyDocument {
  id: string;
  name: string;
  url: string;
  dateUploaded: string;
  fileType: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  category: Category;
  location: string;
  city: string;
  state: string;
  pincode?: string;
  addressDetails?: string;
  areaSqFt: number;
  price?: string;
  priceFormat?: string;
  verified?: boolean;
  bedrooms?: number;
  bathrooms?: number;
  furnishingStatus?: 'Unfurnished' | 'Semi-Furnished' | 'Fully Furnished';
  features: string[];
  images: string[];
  documents?: PropertyDocument[];
  timeline?: PropertyTimeline[];
  ownerId: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  status: PropertyStatus;
  occupancyStatus?: 'Vacant' | 'Occupied' | 'Under Renovation';
  tenantName?: string;
  lastInspectionDate?: string;
  createdAt: string;
  isFeatured?: boolean;
  isDuplicateFlagged?: boolean;
}

export interface Enquiry {
  id: string;
  propertyId?: string;
  propertyTitle?: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  enquiryType: 'Management' | 'Buy' | 'Sell' | 'Rent' | 'General';
  message: string;
  preferredContact: 'Phone' | 'Email' | 'WhatsApp';
  status: 'New' | 'In Progress' | 'Contacted' | 'Completed' | 'Archived';
  adminNotes?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  link?: string;
}

export interface PropertyTimeline {
  id: string;
  propertyId: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: 'Inspection' | 'Maintenance' | 'Tenant' | 'Document' | 'Listing' | 'Management';
}

export interface SiteContent {
  companyEmail: string;
  companyPhone: string;
  companyWhatsApp: string;
  officeAddress: string;
  heroHeading: string;
  heroSubheading: string;
  aboutText: string;
  socialLinks: {
    linkedin?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}
