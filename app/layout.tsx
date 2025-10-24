// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Nav from '@/app/components/Navbar';
import Footer from "@/app/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://sachinsecurity.co.in'),
  title: {
    default: "Sachin Security Services Pvt. Ltd. | Professional Security Since 1996",
    template: "%s | Sachin Security Services"
  },
  description: "ISO 9001:2015 certified security services provider in Gujarat, UP, MP, and Rajasthan. Offering corporate, industrial, retail, event security, and more since 1996.",
  keywords: [
    "security services",
    "security guards",
    "Vadodara security",
    "Gujarat security company",
    "corporate security",
    "industrial security",
    "event security",
    "retail security",
    "armed guards",
    "CCTV monitoring",
    "ISO certified security",
  ],
  authors: [{ name: "Sachin Security Services Pvt. Ltd." }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://sachinsecurity.co.in",
    siteName: "Sachin Security Services Pvt. Ltd.",
    title: "Sachin Security Services | Professional Security Since 1996",
    description: "ISO 9001:2015 certified security services provider offering comprehensive security solutions across Gujarat, UP, MP, and Rajasthan.",
    images: [
      {
        url: "/og-image.jpg", // Add this image to your public folder
        width: 1200,
        height: 630,
        alt: "Sachin Security Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sachin Security Services | Professional Security Since 1996",
    description: "ISO 9001:2015 certified security services provider",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  verification: {
    google: "your-google-verification-code", // Add your Google Search Console verification
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <Nav/>
         {children}
        <Footer/>
        </body>
    </html>
  );
}
