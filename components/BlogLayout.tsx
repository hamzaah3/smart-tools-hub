import { ReactNode } from 'react';
import Link from 'next/link';
import Script from 'next/script';

interface BlogLayoutProps {
  children: ReactNode;
}

export function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Google AdSense Script */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      {/* Header Ad Placeholder */}
      <div className="bg-gray-100 dark:bg-gray-800 py-2 text-center text-sm text-gray-600 dark:text-gray-400">
        <div className="container mx-auto px-4">
          {/* AdSense Ad Unit - Replace with your ad code */}
          <div className="h-20 flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-700 rounded">
            <span>Header Ad Space (728x90)</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main>{children}</main>

    </div>
  );
}
