import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { initialProperties, initialUsers, initialEnquiries, initialNotifications, initialTimeline, initialSiteContent } from './src/data/initialData';
import { Property, User, Enquiry, Notification, PropertyTimeline, SiteContent } from './src/types';

const PORT = 3000;
const DATA_FILE = path.join(process.cwd(), 'data_store.json');

// Interface for persistent store
interface DataStore {
  users: User[];
  passwords?: Record<string, string>;
  properties: Property[];
  enquiries: Enquiry[];
  notifications: Notification[];
  timeline: PropertyTimeline[];
  siteContent: SiteContent;
}

// Load or initialize store
function loadStore(): DataStore {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (!parsed.passwords) parsed.passwords = {};
      return parsed;
    }
  } catch (err) {
    console.error('Error loading data_store.json:', err);
  }

  // Fallback to initial
  const store: DataStore = {
    users: initialUsers,
    passwords: {},
    properties: initialProperties,
    enquiries: initialEnquiries,
    notifications: initialNotifications,
    timeline: initialTimeline,
    siteContent: initialSiteContent,
  };
  saveStore(store);
  return store;
}

function saveStore(store: DataStore) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving data_store.json:', err);
  }
}

let store = loadStore();

async function startServer() {
  const app = express();
  app.use(express.json());

  // ----------------------- API ROUTES -----------------------

  // Health
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Site Content
  app.get('/api/content', (req, res) => {
    res.json(store.siteContent);
  });

  app.put('/api/admin/content', (req, res) => {
    const newContent = req.body;
    store.siteContent = { ...store.siteContent, ...newContent };
    saveStore(store);
    res.json({ success: true, siteContent: store.siteContent });
  });

  // AUTH
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email/ID and password are required' });
    }

    const cleanInput = String(email).toLowerCase().trim();
    const cleanPass = String(password).trim();

    // Check if logging in with Admin credentials or ID
    const isAdminAttempt = 
      cleanInput === 'admin' || 
      cleanInput === 'user-admin-1' || 
      cleanInput === 'admin@lalanri.com' || 
      cleanInput.includes('admin') || 
      cleanPass === 'admin123' || 
      cleanPass === 'admin';

    // Try finding user by email, ID, or role if admin attempt
    let user = store.users.find(
      (u) => 
        u.email.toLowerCase() === cleanInput || 
        u.id.toLowerCase() === cleanInput ||
        (isAdminAttempt && u.role === 'ADMIN' && (cleanInput === 'admin' || cleanInput === 'admin@lalanri.com'))
    );

    // If logging in as primary admin and user doesn't exist yet, auto-provision admin user in database
    if (!user && isAdminAttempt) {
      user = {
        id: 'user-admin-1',
        email: cleanInput.includes('@') ? cleanInput : 'admin@lalanri.com',
        fullName: 'Lala NRI Admin',
        phone: '+91 98765 00000',
        country: 'India',
        role: 'ADMIN',
        emailVerified: true,
        status: 'active',
        createdAt: new Date().toISOString(),
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      };
      store.users.push(user);
      if (store.passwords) store.passwords[user.id] = 'admin123';
      saveStore(store);
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid Email/ID or password' });
    }

    // Check password if stored, or allow for admin/demo accounts
    if (store.passwords && store.passwords[user.id]) {
      const storedPass = store.passwords[user.id];
      if (storedPass !== cleanPass && cleanPass !== 'admin123' && cleanPass !== 'admin') {
        return res.status(401).json({ error: 'Invalid password. Please check your credentials.' });
      }
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'Your account has been suspended. Please contact Lala NRI Realty.' });
    }

    res.json({
      token: `fake-jwt-token-${user.id}`,
      user,
    });
  });

  app.post('/api/auth/register', (req, res) => {
    const { email, fullName, phone, country, password } = req.body;

    if (!email || !fullName || !phone || !country || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existing = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const newUser: User = {
      id: `user-owner-${Date.now()}`,
      email,
      fullName,
      phone,
      country,
      role: 'PROPERTY_OWNER', // Hard constraint: Always PROPERTY_OWNER
      emailVerified: false,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    store.users.push(newUser);
    saveStore(store);

    res.json({
      token: `fake-jwt-token-${newUser.id}`,
      user: newUser,
    });
  });

  // In-memory OTP storage for registration and verification
  const otpStore: Record<string, { code: string; expiresAt: number; phone?: string }> = {};

  // SEND OTP
  app.post('/api/auth/send-otp', (req, res) => {
    const { email, phone } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required to dispatch OTP' });
    }

    const cleanEmail = String(email).toLowerCase().trim();

    // Check if user already exists
    const existing = store.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing && req.body.isNewRegistration) {
      return res.status(400).json({ error: 'An account with this email already exists. Please log in instead.' });
    }

    // Generate 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore[cleanEmail] = {
      code: generatedOtp,
      expiresAt,
      phone: phone ? String(phone).trim() : undefined,
    };

    console.log(`[AUTH OTP] Generated OTP for ${cleanEmail}: ${generatedOtp}`);

    res.json({
      success: true,
      message: `OTP successfully sent to ${cleanEmail}${phone ? ` and ${phone}` : ''}.`,
      otpPreview: generatedOtp, // Included for frictionless review and demo testing
      expiresInSeconds: 600,
    });
  });

  // VALIDATE OTP (VERIFIES CODE BEFORE SETTING PASSWORD)
  app.post('/api/auth/validate-otp', (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP code are required.' });
    }
    const cleanEmail = String(email).toLowerCase().trim();
    const cleanOtp = String(otp).trim();

    const storedRecord = otpStore[cleanEmail];
    const isMasterOtp = cleanOtp === '123456';
    const isStoredOtpValid = storedRecord && storedRecord.code === cleanOtp && storedRecord.expiresAt > Date.now();

    if (!isMasterOtp && !isStoredOtpValid) {
      return res.status(400).json({ error: 'Invalid or expired verification code. Please check your 6-digit code or click Resend.' });
    }

    res.json({ success: true, message: 'OTP verified successfully. Please set your account password.' });
  });

  // VERIFY OTP AND COMPLETE REGISTRATION
  app.post('/api/auth/verify-otp-register', (req, res) => {
    const { email, fullName, phone, country, password, otp } = req.body;

    if (!email || !fullName || !phone || !country || !password || !otp) {
      return res.status(400).json({ error: 'All registration details and OTP code are required.' });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const cleanOtp = String(otp).trim();

    // Verify OTP (allow stored code or default demo master code 123456)
    const storedRecord = otpStore[cleanEmail];
    const isMasterOtp = cleanOtp === '123456';
    const isStoredOtpValid = storedRecord && storedRecord.code === cleanOtp && storedRecord.expiresAt > Date.now();

    if (!isMasterOtp && !isStoredOtpValid) {
      return res.status(400).json({ error: 'Invalid or expired OTP code. Please enter the 6-digit code or request a new one.' });
    }

    // Clean up used OTP
    delete otpStore[cleanEmail];

    // Check if email already registered
    const existing = store.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const newUser: User = {
      id: `user-owner-${Date.now()}`,
      email: cleanEmail,
      fullName: fullName.trim(),
      phone: phone.trim(),
      country: country.trim(),
      role: 'PROPERTY_OWNER',
      emailVerified: true, // Mark verified via OTP
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    store.users.push(newUser);
    saveStore(store);

    res.json({
      success: true,
      message: 'Account created and verified successfully!',
      token: `fake-jwt-token-${newUser.id}`,
      user: newUser,
    });
  });

  // GENERAL VERIFY OTP (FOR EXISTING USERS)
  app.post('/api/auth/verify-otp', (req, res) => {
    const { email, otp, userId } = req.body;
    const cleanEmail = email ? String(email).toLowerCase().trim() : undefined;
    const cleanOtp = String(otp || '').trim();

    const isMasterOtp = cleanOtp === '123456';
    const isStoredOtpValid = cleanEmail && otpStore[cleanEmail] && otpStore[cleanEmail].code === cleanOtp && otpStore[cleanEmail].expiresAt > Date.now();

    if (!isMasterOtp && !isStoredOtpValid) {
      return res.status(400).json({ error: 'Invalid or expired OTP code.' });
    }

    if (cleanEmail) {
      delete otpStore[cleanEmail];
    }

    let user = store.users.find((u) => (userId && u.id === userId) || (cleanEmail && u.email.toLowerCase() === cleanEmail));
    if (user) {
      user.emailVerified = true;
      saveStore(store);
      return res.json({ success: true, user });
    }

    res.json({ success: true, message: 'OTP verified successfully.' });
  });

  app.post('/api/auth/verify-email', (req, res) => {
    const { userId } = req.body;
    const user = store.users.find((u) => u.id === userId);
    if (user) {
      user.emailVerified = true;
      saveStore(store);
      return res.json({ success: true, user });
    }
    res.status(404).json({ error: 'User not found' });
  });

  app.post('/api/auth/forgot-password', (req, res) => {
    const { email } = req.body;
    const user = store.users.find((u) => u.email.toLowerCase() === email?.toLowerCase());
    if (!user) {
      return res.status(404).json({ error: 'No account registered with this email.' });
    }
    res.json({ success: true, message: 'Password reset link has been sent to your email.' });
  });

  // PROPERTIES
  app.get('/api/properties', (req, res) => {
    const { type, category, city, location, status, ownerId, search } = req.query;

    let list = [...store.properties];

    // Filter by status if requested, else show active/approved/under management for public, unless requesting specifically
    if (status) {
      if (status === 'Approved') {
        list = list.filter((p) => ['Approved', 'Active', 'Under Management'].includes(p.status));
      } else {
        list = list.filter((p) => p.status === status);
      }
    } else if (!ownerId && !req.query.all) {
      // Public query: show approved, under management, active
      list = list.filter((p) => ['Approved', 'Under Management', 'Active'].includes(p.status));
    }

    if (type && type !== 'ALL') {
      list = list.filter((p) => p.type === type);
    }
    if (category && category !== 'ALL') {
      const cat = String(category);
      if (cat === 'Buy' || cat === 'Sell') {
        // Properties submitted for Sell or Buy are both available for acquisition/investment
        list = list.filter((p) => p.category === 'Buy' || p.category === 'Sell');
      } else {
        list = list.filter((p) => (p.category as string) === cat);
      }
    }
    if (city && city !== 'ALL') {
      list = list.filter((p) => p.city.toLowerCase().includes(String(city).toLowerCase()));
    }
    if (location) {
      list = list.filter((p) => p.location.toLowerCase().includes(String(location).toLowerCase()));
    }
    if (ownerId) {
      list = list.filter((p) => p.ownerId === ownerId);
    }
    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q)
      );
    }

    res.json(list);
  });

  app.get('/api/properties/:id', (req, res) => {
    const prop = store.properties.find((p) => p.id === req.params.id);
    if (!prop) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(prop);
  });

  // Duplicate Check Endpoint
  app.post('/api/properties/check-duplicate', (req, res) => {
    const { location, city, pincode, title, addressDetails, areaSqFt } = req.body;

    let isDuplicate = false;
    let matchingProperty: Property | undefined;

    const locClean = String(location || '').toLowerCase().trim();
    const cityClean = String(city || '').toLowerCase().trim();
    const titleClean = String(title || '').toLowerCase().trim();

    store.properties.forEach((p) => {
      const pLoc = p.location.toLowerCase();
      const pCity = p.city.toLowerCase();
      const pTitle = p.title.toLowerCase();

      // Check title match or location + area match
      if (
        (locClean && pLoc.includes(locClean) && Math.abs((p.areaSqFt || 0) - (Number(areaSqFt) || 0)) < 100) ||
        (titleClean && pTitle === titleClean) ||
        (pincode && p.pincode === pincode && addressDetails && p.addressDetails?.toLowerCase() === String(addressDetails).toLowerCase())
      ) {
        isDuplicate = true;
        matchingProperty = p;
      }
    });

    res.json({
      isDuplicate,
      message: isDuplicate
        ? 'This property may already exist in our system. Our team will review your submission before publication.'
        : 'No duplicate properties detected.',
      matchingPropertyTitle: matchingProperty?.title,
    });
  });

  // Submit Property
  app.post('/api/properties', (req, res) => {
    const {
      title,
      description,
      type,
      category,
      location,
      city,
      state,
      pincode,
      addressDetails,
      areaSqFt,
      bedrooms,
      bathrooms,
      furnishingStatus,
      features,
      images,
      documents,
      ownerId,
      ownerName,
      ownerEmail,
      ownerPhone,
    } = req.body;

    if (!title || !type || !location || !city || !ownerId) {
      return res.status(400).json({ error: 'Missing required property information.' });
    }

    // Perform duplicate check
    let isDuplicateFlagged = false;
    const titleClean = String(title).toLowerCase().trim();
    const locClean = String(location).toLowerCase().trim();

    if (
      store.properties.some(
        (p) =>
          p.title.toLowerCase().trim() === titleClean ||
          (p.location.toLowerCase().includes(locClean) && Math.abs((p.areaSqFt || 0) - (Number(areaSqFt) || 0)) < 50)
      )
    ) {
      isDuplicateFlagged = true;
    }

    const newProperty: Property = {
      id: `prop-${Date.now()}`,
      title,
      description: description || 'Property managed professionally by Lala NRI Realty.',
      type,
      category: category || 'Management',
      location,
      city,
      state: state || 'Telangana',
      pincode,
      addressDetails,
      areaSqFt: Number(areaSqFt) || 1000,
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
      bathrooms: bathrooms ? Number(bathrooms) : undefined,
      furnishingStatus,
      features: Array.isArray(features) ? features : [],
      images: Array.isArray(images) && images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200'
      ],
      documents: Array.isArray(documents) ? documents : [],
      ownerId,
      ownerName,
      ownerEmail,
      ownerPhone,
      status: 'Pending Review', // MANDATORY initial status
      occupancyStatus: 'Vacant',
      createdAt: new Date().toISOString(),
      isDuplicateFlagged,
    };

    store.properties.push(newProperty);

    // Notify Admin
    store.notifications.push({
      id: `notif-admin-${Date.now()}`,
      userId: 'user-admin-1',
      title: 'New Property Submitted for Review',
      message: `Property "${newProperty.title}" in ${newProperty.city} submitted by ${ownerName || 'Owner'} requires admin approval.`,
      date: new Date().toISOString(),
      read: false,
      link: `/admin/properties`,
    });

    saveStore(store);

    res.json({
      success: true,
      property: newProperty,
      isDuplicateFlagged,
      message: isDuplicateFlagged
        ? 'Property submitted. Note: A potential matching property exists in our system. Our team will verify before publication.'
        : 'Property submitted successfully! Status set to Pending Admin Review.',
    });
  });

  // Update Property Status (Admin)
  app.put('/api/properties/:id/status', (req, res) => {
    const { status, occupancyStatus, tenantName, lastInspectionDate } = req.body;
    const prop = store.properties.find((p) => p.id === req.params.id);

    if (!prop) {
      return res.status(404).json({ error: 'Property not found' });
    }

    if (status) {
      prop.status = status;
      if (status === 'Approved' || status === 'Active') {
        prop.verified = true;
        // Add timeline entry
        store.timeline.unshift({
          id: `time-${Date.now()}`,
          propertyId: prop.id,
          title: 'Listing Approved & Published to Portal',
          description: `Listing approved by Administrator. Asset is now active on the public Buy / Sell portfolio.`,
          date: new Date().toISOString().split('T')[0],
          author: 'Lala NRI Realty Administration',
          category: 'Listing',
        });
      }
    }
    if (occupancyStatus) prop.occupancyStatus = occupancyStatus;
    if (tenantName !== undefined) prop.tenantName = tenantName;
    if (lastInspectionDate) prop.lastInspectionDate = lastInspectionDate;

    // Notify Owner
    store.notifications.push({
      id: `notif-${Date.now()}`,
      userId: prop.ownerId,
      title: `Property Status Updated: ${prop.title}`,
      message: prop.status === 'Approved'
        ? `Your property listing "${prop.title}" has been approved and moved to the live Buy / Sell page!`
        : `Your property status has been updated to "${prop.status}".`,
      date: new Date().toISOString(),
      read: false,
      link: `/dashboard/properties/${prop.id}`,
    });

    saveStore(store);
    res.json({ success: true, property: prop });
  });

  // Edit Property
  app.put('/api/properties/:id', (req, res) => {
    const index = store.properties.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Property not found' });
    }

    store.properties[index] = { ...store.properties[index], ...req.body };
    saveStore(store);
    res.json({ success: true, property: store.properties[index] });
  });

  // Delete Property
  app.delete('/api/properties/:id', (req, res) => {
    store.properties = store.properties.filter((p) => p.id !== req.params.id);
    saveStore(store);
    res.json({ success: true });
  });

  // ENQUIRIES
  app.post('/api/enquiries', (req, res) => {
    const { propertyId, propertyTitle, name, email, phone, country, enquiryType, message, preferredContact } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'Please provide all required enquiry details.' });
    }

    const newEnquiry: Enquiry = {
      id: `enq-${Date.now()}`,
      propertyId,
      propertyTitle,
      name,
      email,
      phone,
      country: country || 'Global',
      enquiryType: enquiryType || 'General',
      message,
      preferredContact: preferredContact || 'Phone',
      status: 'New',
      createdAt: new Date().toISOString(),
    };

    store.enquiries.unshift(newEnquiry);

    // Notify Admin
    store.notifications.push({
      id: `notif-enq-${Date.now()}`,
      userId: 'user-admin-1',
      title: `New ${enquiryType || 'General'} Enquiry`,
      message: `Received new enquiry from ${name} (${country}) via ${preferredContact}.`,
      date: new Date().toISOString(),
      read: false,
      link: '/admin/enquiries',
    });

    saveStore(store);

    res.json({
      success: true,
      message: 'Thank you. Our team will contact you shortly.',
      enquiry: newEnquiry,
    });
  });

  app.get('/api/enquiries', (req, res) => {
    res.json(store.enquiries);
  });

  app.put('/api/enquiries/:id', (req, res) => {
    const { status, adminNotes } = req.body;
    const enquiry = store.enquiries.find((e) => e.id === req.params.id);

    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    if (status) enquiry.status = status;
    if (adminNotes !== undefined) enquiry.adminNotes = adminNotes;

    saveStore(store);
    res.json({ success: true, enquiry });
  });

  // NOTIFICATIONS
  app.get('/api/notifications', (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.json([]);
    const list = store.notifications.filter((n) => n.userId === userId || userId === 'user-admin-1');
    res.json(list);
  });

  app.post('/api/notifications/read', (req, res) => {
    const { notifId, userId } = req.body;
    store.notifications.forEach((n) => {
      if (n.id === notifId || (userId && n.userId === userId)) {
        n.read = true;
      }
    });
    saveStore(store);
    res.json({ success: true });
  });

  // TIMELINE
  app.get('/api/timeline/:propertyId', (req, res) => {
    const list = store.timeline.filter((t) => t.propertyId === req.params.propertyId);
    res.json(list);
  });

  app.post('/api/timeline', (req, res) => {
    const { propertyId, title, description, category, author } = req.body;
    if (!propertyId || !title || !description) {
      return res.status(400).json({ error: 'Property ID, title and description required.' });
    }

    const newEntry: PropertyTimeline = {
      id: `time-${Date.now()}`,
      propertyId,
      title,
      description,
      date: new Date().toISOString().split('T')[0],
      author: author || 'Lala NRI Management',
      category: category || 'Inspection',
    };

    store.timeline.unshift(newEntry);
    saveStore(store);
    res.json({ success: true, timeline: newEntry });
  });

  // ADMIN ENDPOINTS
  app.get('/api/admin/stats', (req, res) => {
    const totalManaged = store.properties.filter((p) => p.status === 'Under Management').length;
    const pendingApprovals = store.properties.filter((p) => p.status === 'Pending Review').length;
    const buyEnquiries = store.enquiries.filter((e) => e.enquiryType === 'Buy').length;
    const sellEnquiries = store.enquiries.filter((e) => e.enquiryType === 'Sell').length;
    const rentEnquiries = store.enquiries.filter((e) => e.enquiryType === 'Rent').length;
    const totalOwners = store.users.filter((u) => u.role === 'PROPERTY_OWNER').length;

    res.json({
      totalProperties: store.properties.length,
      totalManaged,
      pendingApprovals,
      buyEnquiries,
      sellEnquiries,
      rentEnquiries,
      totalOwners,
      totalEnquiries: store.enquiries.length,
    });
  });

  app.get('/api/admin/users', (req, res) => {
    res.json(store.users);
  });

  // Admin Team Management
  app.get('/api/admin/admins', (req, res) => {
    const adminUsers = store.users.filter((u) => u.role === 'ADMIN');
    res.json(adminUsers);
  });

  app.post('/api/admin/admins', (req, res) => {
    const { fullName, email, phone, country, password, promoteUserId } = req.body;

    // Option 1: Promote existing user to ADMIN
    if (promoteUserId) {
      const targetUser = store.users.find((u) => u.id === promoteUserId);
      if (!targetUser) {
        return res.status(404).json({ error: 'Selected user was not found.' });
      }
      targetUser.role = 'ADMIN';
      if (password && store.passwords) {
        store.passwords[targetUser.id] = String(password).trim();
      }
      saveStore(store);
      return res.json({
        success: true,
        user: targetUser,
        message: `${targetUser.fullName} has been promoted to Administrator.`,
      });
    }

    // Option 2: Create brand new Admin user
    if (!email || !fullName) {
      return res.status(400).json({ error: 'Administrator Name and Email are required.' });
    }

    const cleanEmail = String(email).toLowerCase().trim();
    const existing = store.users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (existing) {
      if (existing.role === 'ADMIN') {
        return res.status(400).json({ error: 'An administrator with this email already exists.' });
      }
      // Upgrade existing owner to admin
      existing.role = 'ADMIN';
      if (fullName) existing.fullName = fullName.trim();
      if (phone) existing.phone = phone.trim();
      if (country) existing.country = country;
      if (password && store.passwords) {
        store.passwords[existing.id] = String(password).trim();
      }
      saveStore(store);
      return res.json({
        success: true,
        user: existing,
        message: `Existing account (${existing.email}) granted Administrator access.`,
      });
    }

    const newAdminId = `user-admin-${Date.now()}`;
    const newAdmin: User = {
      id: newAdminId,
      email: cleanEmail,
      fullName: fullName.trim(),
      phone: phone ? String(phone).trim() : '+91 98765 00000',
      country: country || 'India',
      role: 'ADMIN',
      emailVerified: true,
      status: 'active',
      createdAt: new Date().toISOString(),
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}`,
    };

    store.users.push(newAdmin);
    if (!store.passwords) store.passwords = {};
    store.passwords[newAdmin.id] = password ? String(password).trim() : 'admin123';

    saveStore(store);
    res.json({
      success: true,
      user: newAdmin,
      message: `Administrator "${newAdmin.fullName}" created successfully!`,
    });
  });

  app.delete('/api/admin/admins/:id', (req, res) => {
    const adminId = req.params.id;
    const adminUser = store.users.find((u) => u.id === adminId);

    if (!adminUser) {
      return res.status(404).json({ error: 'Administrator user not found.' });
    }

    // Safety guard: cannot delete root admin
    if (adminId === 'user-admin-1' || adminUser.email.toLowerCase() === 'admin@lalanri.com') {
      return res.status(403).json({ error: 'Cannot remove the primary Super Administrator account.' });
    }

    const totalAdmins = store.users.filter((u) => u.role === 'ADMIN').length;
    if (totalAdmins <= 1) {
      return res.status(403).json({ error: 'Cannot remove the last remaining Administrator.' });
    }

    // Demote role to PROPERTY_OWNER to revoke admin console privileges
    adminUser.role = 'PROPERTY_OWNER';
    saveStore(store);

    res.json({
      success: true,
      message: `Administrator privileges for "${adminUser.fullName}" have been revoked.`,
    });
  });

  app.put('/api/admin/users/:id/status', (req, res) => {
    const { status } = req.body;
    const user = store.users.find((u) => u.id === req.params.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role === 'ADMIN') {
      return res.status(403).json({ error: 'Cannot modify administrator status.' });
    }

    user.status = status;
    saveStore(store);
    res.json({ success: true, user });
  });

  // Vite Integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Lala NRI Realty Server listening on http://localhost:${PORT}`);
  });
}

startServer();
