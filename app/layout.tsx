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
  title: "Sachin Security Services Pvt. Ltd. | Professional Security Provider in India",
  description:
    "Sachin Security Services Pvt. Ltd. is a trusted provider of complete security and investigation solutions for industries, corporates, retail, and construction sectors across India.",
  keywords: [
    "security services",
    "private security company",
    "corporate security",
    "industrial security",
    "event security",
    "bodyguard services",
    "detective agency",
    "Sachin Security Services",
  ],
  authors: [{ name: "Sachin Security Services Pvt. Ltd." }],
  openGraph: {
    title: "Sachin Security Services Pvt. Ltd.",
    description:
      "Trusted security provider delivering professional protection and investigation solutions across India.",
    url: "https://sachinsecurity.co.in/",
    siteName: "Sachin Security Services Pvt. Ltd.",
    images: [
      {
        url: "https://sachinsecurity.co.in/logo", // Replace with your OG image
        width: 1200,
        height: 630,
        alt: "Sachin Security Services Pvt. Ltd.",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sachin Security Services Pvt. Ltd.",
    description:
      "Providing trusted, professional, and technology-driven security solutions for businesses and individuals.",
    images: ["https://sachinsecurity.co.in/logo"],
  },
  metadataBase: new URL("https://sachinsecurity.co.in"),
  alternates: {
    canonical: "https://sachinsecurity.co.in",
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
