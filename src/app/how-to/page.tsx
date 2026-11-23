'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Terminal } from 'lucide-react';
import { DEFAULT_LOCALE, LOCALES, Locale, howToContent } from '@/lib/i18n/how-to';

const STORAGE_KEY = 'kantor-kita:locale';

function isLocale(value: string | null): value is Locale {
  return !!value && (LOCALES as string[]).includes(value);
}

export default function HowToPage() {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);

  // Restore the language preference: ?lang= wins, then localStorage, then English.
  useEffect(() => {
    const fromQuery = new URLSearchParams(window.location.search).get('lang');
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(fromQuery)) setLocale(fromQuery);
    else if (isLocale(stored)) setLocale(stored);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const t = howToContent[locale];

  return (
    <main className="h-screen w-screen overflow-y-auto bg-[#0a0a12] text-slate-200 font-mono">
      <div className="mx-auto w-full max-w-3xl px-5 py-8 sm:py-12">
        {/* Top bar: back link + language switch */}
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-white transition"
          >
            <ArrowLeft size={13} />
            {t.backToOffice}
          </Link>

          <div
            role="group"
            aria-label="Language"
            className="flex items-center gap-0.5 rounded border border-[#2e3458] bg-[#12121e] p-0.5"
          >
            {LOCALES.map((code) => (
              <button
                key={code}
                onClick={() => setLocale(code)}
                aria-pressed={locale === code}
                className={`px-2.5 py-1 text-[10px] font-bold rounded transition ${
                  locale === code
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-[#2e3458]'
                }`}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Hero */}
        <header className="mt-10 mb-8">
          <p className="text-[10px] uppercase tracking-[0.22em] text-indigo-400">{t.hero.badge}</p>
          <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {t.hero.title}
          </h1>
          <p className="mt-3 text-[13px] leading-relaxed text-slate-400 max-w-2xl">
            {t.hero.subtitle}
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex items-center gap-1.5 rounded border border-[#2e3458] bg-[#1b1b2f] px-3 py-1.5 text-[11px] font-bold text-slate-200 hover:border-indigo-500 hover:text-white transition"
          >
            {t.hero.cta}
            <ArrowRight size={13} />
          </Link>
        </header>

        {/* Sections */}
        <div className="space-y-4">
          {t.sections.map((section, index) => (
            <section
              key={section.title}
              className="rounded-lg border border-[#2e3458] bg-[#12121e]/80 p-5"
            >
              <div className="flex items-baseline gap-3">
                <span className="shrink-0 text-[11px] font-bold text-indigo-400">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h2 className="text-[15px] font-bold text-white">{section.title}</h2>
              </div>

              {section.intro && (
                <p className="mt-2 text-[12.5px] leading-relaxed text-slate-400">{section.intro}</p>
              )}

              {section.steps && (
                <ol className="mt-4 space-y-3">
                  {section.steps.map((step, stepIndex) => (
                    <li key={step.title} className="flex gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-indigo-500/40 bg-indigo-500/10 text-[10px] font-bold text-indigo-300">
                        {stepIndex + 1}
                      </span>
                      <div>
                        <p className="text-[12.5px] font-bold text-slate-100">{step.title}</p>
                        <p className="mt-0.5 text-[12.5px] leading-relaxed text-slate-400">
                          {step.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}

              {section.code && (
                <div className="mt-4 overflow-hidden rounded border border-[#2e3458] bg-black/60">
                  <div className="flex items-center gap-1.5 border-b border-[#2e3458] px-3 py-1.5 text-[10px] text-slate-500">
                    <Terminal size={12} />
                    <span>bash</span>
                  </div>
                  <pre className="overflow-x-auto px-3 py-3 text-[12px] leading-relaxed text-emerald-300">
                    <code>
                      {section.code.commands.map((command) => (
                        <div key={command}>
                          <span className="mr-2 text-slate-600 select-none">$</span>
                          {command}
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>
              )}

              {section.bullets && (
                <ul className="mt-4 space-y-2">
                  {section.bullets.map((bullet) => (
                    <li key={bullet.text} className="flex gap-2.5 text-[12.5px] leading-relaxed">
                      <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-indigo-400" />
                      <span className="text-slate-400">
                        {bullet.label && (
                          <span className="font-bold text-slate-100">{bullet.label}</span>
                        )}
                        {bullet.label ? ' — ' : ''}
                        {bullet.text}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {section.note && (
                <div className="mt-4 border-l-2 border-indigo-500/60 bg-indigo-500/5 px-3 py-2 text-[11.5px] leading-relaxed text-slate-400">
                  {section.note}
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-10 flex flex-wrap items-center justify-between gap-2 border-t border-[#2e3458] pt-4 text-[10.5px] text-slate-500">
          <span>{t.footer}</span>
          <Link href="/" className="text-slate-400 hover:text-white transition">
            {t.backToOffice}
          </Link>
        </footer>
      </div>
    </main>
  );
}
