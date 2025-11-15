import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">SmartToolsHub</h3>
            <p className="mt-3 text-sm text-slate-500">
              Free online tools to make everyday tasks easier and faster.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900">Tools</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li><Link href="/#pdf" className="hover:text-slate-900">PDF Tools</Link></li>
              <li><Link href="/#image" className="hover:text-slate-900">Image Tools</Link></li>
              <li><Link href="/#csv" className="hover:text-slate-900">CSV Tools</Link></li>
              <li><Link href="/#text" className="hover:text-slate-900">Text Tools</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li><Link href="/about" className="hover:text-slate-900">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-slate-900">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-slate-900">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900">Legal</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li><Link href="/privacy" className="hover:text-slate-900">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-slate-900">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
          <p>Advertisement Space</p>
          <p className="text-xs text-slate-400">(728x90 or 970x90 banner)</p>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
          <p>
            © {new Date().getFullYear()} SmartToolsHub. Files are processed securely and deleted immediately.
          </p>
        </div>
      </div>
    </footer>
  );
}
