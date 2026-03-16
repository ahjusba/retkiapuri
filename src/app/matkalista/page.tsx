'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GearResults from '@/components/GearResults';

const LS_KEY = 'retkiapuri-checklist';

function readHasData(): boolean {
  try {
    return localStorage.getItem(LS_KEY) !== null;
  } catch {
    return false;
  }
}

export default function MatkalistaPage() {
  const router = useRouter();
  // useState with a lazy initializer runs only on the client, after hydration
  const [hasData] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return readHasData();
  });

  // Avoid hydration mismatch — render nothing until localStorage is read
  if (hasData === null) return null;

  if (!hasData) {
    return (
      <main
        className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center gap-6"
        style={{ background: 'var(--background)' }}
      >
        <span style={{ fontSize: '3.5rem' }}>🎒</span>
        <div className="flex flex-col gap-2">
          <h1
            className="text-2xl font-bold"
            style={{ color: 'var(--foreground)', fontFamily: 'Lusitana, serif' }}
          >
            Matkalista on tyhjä
          </h1>
          <p className="text-sm max-w-xs" style={{ color: 'var(--muted)' }}>
            Sinulla ei ole vielä tallennettua matkalistaa. Käy ensin Retkilaskin-sivulla
            ja lähetä lomake saadaksesi varustussuositukset.
          </p>
        </div>
        <Link
          href="/"
          className="px-8 py-3 rounded-xl text-base font-semibold text-white transition-colors"
          style={{ background: 'var(--primary)' }}
        >
          Siirry Retkilaskimeen →
        </Link>
      </main>
    );
  }

  return (
    <main
      className="flex-1 px-4 py-10"
      style={{ background: 'var(--background)' }}
    >
      <div className="w-full max-w-lg mx-auto">
        <GearResults onReset={() => {
          localStorage.removeItem(LS_KEY);
          router.push('/');
        }} />
      </div>
    </main>
  );
}
