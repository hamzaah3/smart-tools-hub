'use client';

import { useEffect, useState } from 'react';

export function CookieConsent() {
  // Start with `false` on both server and client so the initial HTML matches.
  const [showConsent, setShowConsent] = useState(false);

  // Read from localStorage only on the client, after hydration.
  useEffect(() => {
    try {
      const hasConsent = typeof window !== 'undefined'
        ? window.localStorage.getItem('cookie-consent') === 'accepted'
        : false;

      if (!hasConsent) {
        setShowConsent(true);
      }
    } catch {
      // If localStorage is unavailable, silently skip showing the banner.
    }
  }, []);

  const acceptCookies = () => {
    try {
      window.localStorage.setItem('cookie-consent', 'accepted');
    } catch {
      // Ignore write errors (e.g., privacy mode).
    }
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 text-sm text-slate-600 sm:flex-row">
        <p className="text-center sm:text-left">
          We use cookies to improve your experience and show relevant ads. By continuing, you agree to our use of cookies.
          <a href="/privacy" className="ml-1 font-semibold text-slate-900 underline-offset-2 hover:underline">Learn more</a>
        </p>
        <button
          onClick={acceptCookies}
          className="w-full rounded-full bg-slate-900 px-6 py-2 font-semibold text-white transition hover:bg-slate-700 sm:w-auto"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
