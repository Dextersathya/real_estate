import { Property, User, Enquiry, Notification, PropertyTimeline, SiteContent } from '../types';

const TOKEN_KEY = 'lala_nri_auth_token';
const USER_KEY = 'lala_nri_user';

export function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredSession(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// API Fetch Helpers
export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'An unexpected error occurred');
  }

  return data as T;
}

// Auth & OTP
export async function sendOtp(data: { email: string; phone?: string; isNewRegistration?: boolean }) {
  return apiFetch<{ success: boolean; message: string; otpPreview?: string; expiresInSeconds?: number }>('/api/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function validateOtp(data: { email: string; otp: string }) {
  return apiFetch<{ success: boolean; message: string }>('/api/auth/validate-otp', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function verifyOtpAndRegister(data: {
  email: string;
  fullName: string;
  phone: string;
  country: string;
  password?: string;
  otp: string;
}) {
  return apiFetch<{ success: boolean; message: string; token: string; user: User }>('/api/auth/verify-otp-register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function verifyOtp(data: { email?: string; otp: string; userId?: string }) {
  return apiFetch<{ success: boolean; message?: string; user?: User }>('/api/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Properties
export async function fetchProperties(params: Record<string, string> = {}): Promise<Property[]> {
  const query = new URLSearchParams(params).toString();
  return apiFetch<Property[]>(`/api/properties${query ? `?${query}` : ''}`);
}

export async function fetchPropertyById(id: string): Promise<Property> {
  return apiFetch<Property>(`/api/properties/${id}`);
}

export async function checkDuplicateProperty(data: {
  location: string;
  city: string;
  pincode?: string;
  title: string;
  addressDetails?: string;
  areaSqFt?: number;
}) {
  return apiFetch<{ isDuplicate: boolean; message: string; matchingPropertyTitle?: string }>('/api/properties/check-duplicate', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function submitProperty(data: Partial<Property>) {
  return apiFetch<{ success: boolean; property: Property; isDuplicateFlagged: boolean; message: string }>('/api/properties', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updatePropertyStatus(id: string, data: { status?: string; occupancyStatus?: string; tenantName?: string; lastInspectionDate?: string }) {
  return apiFetch<{ success: boolean; property: Property }>(`/api/properties/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function updateProperty(id: string, data: Partial<Property>) {
  return apiFetch<{ success: boolean; property: Property }>(`/api/properties/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteProperty(id: string) {
  return apiFetch<{ success: boolean }>(`/api/properties/${id}`, {
    method: 'DELETE',
  });
}

// Enquiries
export async function submitEnquiry(data: Partial<Enquiry>) {
  return apiFetch<{ success: boolean; message: string; enquiry: Enquiry }>('/api/enquiries', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function fetchEnquiries(): Promise<Enquiry[]> {
  return apiFetch<Enquiry[]>('/api/enquiries');
}

export async function updateEnquiryStatus(id: string, data: { status?: string; adminNotes?: string }) {
  return apiFetch<{ success: boolean; enquiry: Enquiry }>(`/api/enquiries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Notifications & Timeline
export async function fetchNotifications(userId: string): Promise<Notification[]> {
  return apiFetch<Notification[]>(`/api/notifications?userId=${userId}`);
}

export async function markNotificationsRead(userId: string) {
  return apiFetch<{ success: boolean }>('/api/notifications/read', {
    method: 'POST',
    body: JSON.stringify({ userId }),
  });
}

export async function fetchPropertyTimeline(propertyId: string): Promise<PropertyTimeline[]> {
  return apiFetch<PropertyTimeline[]>(`/api/timeline/${propertyId}`);
}

export async function addTimelineEntry(data: { propertyId: string; title: string; description: string; category?: string; author?: string }) {
  return apiFetch<{ success: boolean; timeline: PropertyTimeline }>('/api/timeline', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Admin API
export async function fetchAdminStats() {
  return apiFetch<{
    totalProperties: number;
    totalManaged: number;
    pendingApprovals: number;
    buyEnquiries: number;
    sellEnquiries: number;
    rentEnquiries: number;
    totalOwners: number;
    totalEnquiries: number;
  }>('/api/admin/stats');
}

export async function fetchAdminUsers(): Promise<User[]> {
  return apiFetch<User[]>('/api/admin/users');
}

export async function fetchAdmins(): Promise<User[]> {
  return apiFetch<User[]>('/api/admin/admins');
}

export async function createAdmin(data: {
  fullName: string;
  email: string;
  phone?: string;
  country?: string;
  password?: string;
  promoteUserId?: string;
}) {
  return apiFetch<{ success: boolean; user: User; message: string }>('/api/admin/admins', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function removeAdmin(adminId: string) {
  return apiFetch<{ success: boolean; message: string }>(`/api/admin/admins/${adminId}`, {
    method: 'DELETE',
  });
}

export async function updateUserStatus(userId: string, status: 'active' | 'suspended') {
  return apiFetch<{ success: boolean; user: User }>(`/api/admin/users/${userId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

export async function fetchSiteContent(): Promise<SiteContent> {
  return apiFetch<SiteContent>('/api/content');
}

export async function updateSiteContent(data: Partial<SiteContent>) {
  return apiFetch<{ success: boolean; siteContent: SiteContent }>('/api/admin/content', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
