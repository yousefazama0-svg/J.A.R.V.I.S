import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "J.A.R.V.I.S - AI Assistant",
  description: "Your intelligent AI assistant with powerful capabilities for image generation, video creation, voice interaction, and presentation building.",
  keywords: ["JARVIS", "AI", "Assistant", "Image Generation", "Video", "Voice", "Presentations", "Next.js"],
  authors: [{ name: "JARVIS Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "J.A.R.V.I.S - AI Assistant",
    description: "Your intelligent AI assistant powered by Z.AI",
    siteName: "J.A.R.V.I.S",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "J.A.R.V.I.S - AI Assistant",
    description: "Your intelligent AI assistant powered by Z.AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
