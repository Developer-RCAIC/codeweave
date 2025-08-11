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
  title: "CodeWeave - AI Code Generator by Royal College AI Club",
  description: "A completely free AI-powered coding platform developed by the Royal College Artificial Intelligence Club. Transform your ideas into production-ready web applications instantly.",
  keywords: "AI code generator, free coding platform, web development, HTML CSS JavaScript, Royal College AI Club",
  authors: [{ name: "Royal College Artificial Intelligence Club" }],
  creator: "Royal College AI Club",
  publisher: "Royal College AI Club",
  openGraph: {
    title: "CodeWeave - AI Code Generator",
    description: "Transform your ideas into production-ready web applications with AI. Completely free forever.",
    url: "https://codeweave.rcaic.com",
    siteName: "CodeWeave",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
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
