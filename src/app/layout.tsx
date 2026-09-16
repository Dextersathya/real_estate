import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Lala NRI Realty — Premium Property Management for NRIs",
    template: "%s | Lala NRI Realty",
  },
  description:
    "India's premier property management and real estate platform for Non-Resident Indians. Buy, Sell, Rent, and Manage your Indian properties with confidence.",
  keywords: [
    "NRI property management",
    "Indian real estate NRI",
    "buy property India NRI",
    "manage property India",
    "Hyderabad real estate",
  ],
  openGraph: {
    title: "Lala NRI Realty — Premium Property Management for NRIs",
    description:
      "Trusted property management and real estate services for Non-Resident Indians.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
