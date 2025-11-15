'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(href);
  };

  const linkClasses = (href: string) =>
    `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
      isActive(href)
        ? 'bg-sky-50 text-sky-700 border border-sky-200 shadow-sm'
        : 'text-slate-600 hover:text-slate-900'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-6">
          <Link href="/" className="text-2xl font-bold tracking-tight text-slate-900">
            SmartToolsHub
          </Link>

          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className={linkClasses(link.href)}>
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="ml-4 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-[#ffffff] hover:bg-slate-700 transition-colors"
            >
              Request a Tool
            </Link>
          </div>

          <button
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="lg:hidden rounded-full border border-slate-200 p-2 text-slate-600"
            aria-label="Toggle menu"
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="mt-4 space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-xl px-4 py-2 text-base font-medium ${
                  isActive(link.href) ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="block rounded-xl bg-slate-900 px-4 py-2 text-center text-sm font-semibold text-white"
              onClick={() => setIsMenuOpen(false)}
            >
              Request a Tool
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
