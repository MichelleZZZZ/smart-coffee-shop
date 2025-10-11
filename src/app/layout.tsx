import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Coffee Shop | Home",
  description: "Your local artisan coffee, freshly roasted and brewed daily.",
  openGraph: {
    title: "Coffee Shop",
    description: "Discover our coffee, stories, and sustainable sourcing.",
    url: "https://your-vercel-app.vercel.app",
    siteName: "Coffee Shop",
    images: [
      {
        url: "https://your-vercel-app.vercel.app/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Coffee beans and espresso",
      },
    ],
    locale: "en_US",
    type: "website",
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
        <Navigation />
        {children}
      </body>
    </html>
  );
}
