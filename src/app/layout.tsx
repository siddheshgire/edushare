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
  title: "EduShare — Learn Together. Share Knowledge. Grow Together.",
  description:
    "A centralized, peer-verified platform where students discover, upload, organize, and request educational resources with AI-assisted document summaries and grounded Q&A.",
  keywords: [
    "EduShare",
    "lecture notes",
    "previous year question papers",
    "PYQ",
    "lab manuals",
    "study materials",
    "engineering curriculum",
    "open educational resources",
    "AI study assistant",
  ],
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
