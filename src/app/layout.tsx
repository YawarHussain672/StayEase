import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import ChatBot from "@/components/ai/ChatBot";
import { Toaster } from "react-hot-toast";
import BackgroundOrbs from "@/components/ui/BackgroundOrbs";

export const metadata: Metadata = {
  title: "StayEase — Smart Hostel, PG & Budget Hotel Booking",
  description:
    "Find and book verified hostels, PGs, and budget hotels across India. AI-powered recommendations, instant booking, and secure payments.",
  keywords: "hostel booking, PG, paying guest, budget hotel, student accommodation, co-living",
  openGraph: {
    title: "StayEase — Smart Hostel & PG Booking",
    description: "Find your perfect stay with AI-powered recommendations",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased relative min-h-screen">
        <BackgroundOrbs />
        <Providers>
          {children}
          <ChatBot />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              className: 'glass-toast',
              style: {
                color: 'var(--text-primary)',
                fontSize: '14px',
                fontWeight: 500,
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
