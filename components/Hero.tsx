import Link from 'next/link';

export function Hero() {
  return (
    <section className="bg-white pt-12 pb-10">
      <div className="container mx-auto px-4">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-sky-50 via-white to-blue-50 px-6 py-12 text-center shadow-sm lg:px-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            Lightweight productivity suite
          </p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-slate-900 md:text-5xl lg:text-6xl">
            Every smart tool you need in one clean workspace
          </h1>
          <p className="mt-6 text-lg text-slate-600 md:text-xl">
            Upload, convert, and tidy up files without pop-ups, ads, or sign-ups. SmartToolsHub keeps
            everything fast, private, and beautifully simple.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="#tools"
              className="w-full rounded-full bg-slate-900 px-10 py-3 text-center text-base font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-700 sm:w-auto"
            >
              Start with a tool
            </Link>
            <Link
              href="/blog"
              className="w-full rounded-full border border-slate-300 px-10 py-3 text-center text-base font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 sm:w-auto"
            >
              Browse tutorials
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 text-left sm:grid-cols-4">
            {[
              { value: '25+', label: 'Instant tools' },
              { value: '0 files', label: 'Stored on servers' },
              { value: '60 sec', label: 'Average task time' },
              { value: '100%', label: 'Free forever' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur"
              >
                <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
