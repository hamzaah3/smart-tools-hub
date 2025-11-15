import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";
import { CookieConsent } from "@/components/CookieConsent";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SmartToolsHub - Free Online Tools for Daily Tasks",
  description: "Free online tools for PDF, image, CSV conversion, text utilities, and more. Fast, secure, and mobile-friendly.",
  keywords: "PDF tools, image converter, CSV tools, online utilities, free tools",
  authors: [{ name: "SmartToolsHub" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://smarttoolshub.com",
    siteName: "SmartToolsHub",
    title: "SmartToolsHub - Free Online Tools",
    description: "Free online tools for PDF, image, CSV conversion, and more.",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
        <Script id="structured-data" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "SmartToolsHub",
            "url": "https://smarttoolshub.com",
            "description": "Free online tools for daily tasks",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://smarttoolshub.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </Script>
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-slate-50 text-slate-900`}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <CookieConsent />
          </div>
        </Providers>
      </body>
    </html>
  );
}
