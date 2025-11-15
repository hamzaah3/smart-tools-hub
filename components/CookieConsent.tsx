'use client';

import { useState } from 'react';

const getInitialConsentState = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  return !localStorage.getItem('cookie-consent');
};

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(getInitialConsentState);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
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
