import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ZhenAI — AI-Powered Practice Management for TCM",
  description:
    "The first practice management platform built by an acupuncturist. AI tongue diagnosis, herbal prescribing, SOAP notes from audio, and more.",
  keywords: [
    "TCM",
    "acupuncture",
    "practice management",
    "AI diagnosis",
    "herbal medicine",
    "SOAP notes",
    "traditional Chinese medicine",
  ],
  openGraph: {
    title: "ZhenAI — AI-Powered Practice Management for TCM",
    description:
      "Built by a practitioner with 15 years of clinical experience. AI tongue diagnosis, herbal prescribing, pattern synthesis.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased grain`}
      >
        {children}
      </body>
    </html>
  );
}
