/**
 * Nodemailer email transport using Gmail SMTP.
 *
 * Required env vars:
 *   GMAIL_USER         — your Gmail address (e.g. notifications@yourdomain.com)
 *   GMAIL_APP_PASSWORD — Google App Password (not your Gmail login password)
 *                        Generate at: https://myaccount.google.com/apppasswords
 *   NEXT_PUBLIC_APP_URL — used for links in email bodies
 */

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendOtpEmail(to: string, otp: string): Promise<void> {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log(`[DEV EMAIL OTP for ${to}]: ${otp}`);
    return;
  }

  await transporter.sendMail({
    from: `"Lala NRI Realty" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Your Lala NRI Realty Verification Code",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #0F172A; color: #F8FAFC; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #C5A059 0%, #A0813F 100%); padding: 32px 40px;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">Lala NRI Realty</h1>
          <p style="margin: 4px 0 0; opacity: 0.85; font-size: 13px;">Premium Property Management for NRIs</p>
        </div>
        <div style="padding: 40px;">
          <h2 style="margin: 0 0 16px; font-size: 20px; font-weight: 600; color: #F8FAFC;">Verify your account</h2>
          <p style="margin: 0 0 32px; color: #94A3B8; font-size: 15px; line-height: 1.6;">
            Use the verification code below to complete your registration. This code expires in 10 minutes.
          </p>
          <div style="background: #1E293B; border: 1px solid #334155; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
            <span style="font-size: 40px; font-weight: 800; letter-spacing: 12px; color: #C5A059; font-variant-numeric: tabular-nums;">${otp}</span>
          </div>
          <p style="margin: 0; color: #64748B; font-size: 13px;">
            If you didn't request this, please ignore this email. Never share your verification code with anyone.
          </p>
        </div>
        <div style="background: #1E293B; padding: 20px 40px; text-align: center;">
          <p style="margin: 0; color: #475569; font-size: 12px;">© ${new Date().getFullYear()} Lala NRI Realty · Jubilee Hills, Hyderabad</p>
        </div>
      </div>
    `,
  });
}

export async function sendPropertyStatusEmail(
  to: string,
  ownerName: string,
  propertyTitle: string,
  status: string,
  notes?: string
): Promise<void> {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log(`[DEV EMAIL STATUS for ${to}]: ${propertyTitle} -> ${status}`);
    return;
  }

  const statusLabels: Record<string, string> = {
    published: "Approved & Published",
    rejected: "Requires Changes",
    under_management: "Under Management",
    rented: "Rented",
    sold: "Sold",
  };
  const label = statusLabels[status] || status;

  await transporter.sendMail({
    from: `"Lala NRI Realty" <${process.env.GMAIL_USER}>`,
    to,
    subject: `Property Update: "${propertyTitle}" — ${label}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #0F172A; color: #F8FAFC; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #C5A059 0%, #A0813F 100%); padding: 32px 40px;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Lala NRI Realty</h1>
        </div>
        <div style="padding: 40px;">
          <h2 style="margin: 0 0 8px; font-size: 20px; color: #F8FAFC;">Dear ${ownerName},</h2>
          <p style="margin: 0 0 24px; color: #94A3B8; font-size: 15px; line-height: 1.6;">
            Your property listing has been updated.
          </p>
          <div style="background: #1E293B; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <p style="margin: 0 0 8px; color: #94A3B8; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Property</p>
            <p style="margin: 0 0 16px; color: #F8FAFC; font-size: 16px; font-weight: 600;">${propertyTitle}</p>
            <p style="margin: 0 0 8px; color: #94A3B8; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">New Status</p>
            <p style="margin: 0; color: #C5A059; font-size: 16px; font-weight: 700;">${label}</p>
            ${notes ? `<p style="margin: 16px 0 0; color: #94A3B8; font-size: 14px;">${notes}</p>` : ""}
          </div>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard" style="display: inline-block; background: #C5A059; color: #0F172A; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px;">
            View in Dashboard →
          </a>
        </div>
      </div>
    `,
  });
}

export async function sendEnquiryNotificationEmail(
  adminEmail: string,
  enquirerName: string,
  enquiryType: string,
  message: string
): Promise<void> {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.log(`[DEV EMAIL ENQUIRY for ${adminEmail}]: from ${enquirerName} (${enquiryType})`);
    return;
  }

  await transporter.sendMail({
    from: `"Lala NRI Realty Platform" <${process.env.GMAIL_USER}>`,
    to: adminEmail,
    subject: `New ${enquiryType} Enquiry from ${enquirerName}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #0F172A; color: #F8FAFC; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #C5A059 0%, #A0813F 100%); padding: 32px 40px;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 700;">New Enquiry Received</h1>
        </div>
        <div style="padding: 40px;">
          <div style="background: #1E293B; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <p style="margin: 0 0 4px; color: #94A3B8; font-size: 13px;">From</p>
            <p style="margin: 0 0 16px; color: #F8FAFC; font-weight: 600;">${enquirerName}</p>
            <p style="margin: 0 0 4px; color: #94A3B8; font-size: 13px;">Type</p>
            <p style="margin: 0 0 16px; color: #C5A059; font-weight: 600;">${enquiryType}</p>
            <p style="margin: 0 0 4px; color: #94A3B8; font-size: 13px;">Message</p>
            <p style="margin: 0; color: #F8FAFC;">${message}</p>
          </div>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/enquiries" style="display: inline-block; background: #C5A059; color: #0F172A; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 14px;">
            View in Admin Panel →
          </a>
        </div>
      </div>
    `,
  });
}
