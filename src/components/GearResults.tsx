'use client';

import { useState } from 'react';

// ---------------------------------------------------------------------------
// Gear data (fixed mock result)
// ---------------------------------------------------------------------------

interface GearItem {
  id: string;
  label: string;
}

interface GearCategory {
  id: string;
  emoji: string;
  title: string;
  items: GearItem[];
}

const GEAR: GearCategory[] = [
  {
    id: 'clothing',
    emoji: '🧥',
    title: 'Vaatetus',
    items: [
      { id: 'c1', label: 'Kerrasto (paita + housut)' },
      { id: 'c2', label: 'Fleece- tai villapaita' },
      { id: 'c3', label: 'Kuorijakku (tuuli- ja sadetakki)' },
      { id: 'c4', label: 'Kuorihousut' },
      { id: 'c5', label: 'Vaellusuket (2–3 paria)' },
      { id: 'c6', label: 'Vaelluskengät tai -saappaat' },
      { id: 'c7', label: 'Hattu tai pipo' },
      { id: 'c8', label: 'Käsineet' },
      { id: 'c9', label: 'Aurinkolasit' },
    ],
  },
  {
    id: 'sleeping',
    emoji: '🛏️',
    title: 'Yöpyminen',
    items: [
      { id: 's1', label: 'Makuupussi (lämpötila kohteen mukaan)' },
      { id: 's2', label: 'Makuualusta tai -patja' },
      { id: 's3', label: 'Teltta tai riippumatto + sadesuoja' },
      { id: 's4', label: 'Päälämpömyssy (kylmiin öihin)' },
    ],
  },
  {
    id: 'food',
    emoji: '🍽️',
    title: 'Ruoka ja juoma',
    items: [
      { id: 'f1', label: 'Keitin + polttoaine (kaasu/spriii)' },
      { id: 'f2', label: 'Kattila ja lusikka' },
      { id: 'f3', label: 'Retkiannokset tai omat eväät' },
      { id: 'f4', label: 'Välipalat (pähkinät, patukat, kuivahedelmät)' },
      { id: 'f5', label: 'Vesipullo (1–2 l)' },
      { id: 'f6', label: 'Vesisuodatin tai puhdistustabletit' },
      { id: 'f7', label: 'Kahvi / tee' },
    ],
  },
  {
    id: 'navigation',
    emoji: '🗺️',
    title: 'Navigointi',
    items: [
      { id: 'n1', label: 'Kartta (paperinen)' },
      { id: 'n2', label: 'Kompassi' },
      { id: 'n3', label: 'GPS-laite tai puhelin + offline-kartat' },
      { id: 'n4', label: 'Varavirtalähde (powerbank)' },
    ],
  },
  {
    id: 'safety',
    emoji: '🩹',
    title: 'Turvallisuus',
    items: [
      { id: 'sa1', label: 'Ensiapupakkaus' },
      { id: 'sa2', label: 'Pilli (hätämerkki)' },
      { id: 'sa3', label: 'Taskulamppu tai otsalamppu + varaparistot' },
      { id: 'sa4', label: 'Tulitikut tai sytytin (vedenpitävässä pakkauksessa)' },
      { id: 'sa5', label: 'Hätäpeite' },
      { id: 'sa6', label: 'Hyönteissuoja ja zeckienpinsetti' },
      { id: 'sa7', label: 'Aurinkosuojavoide' },
    ],
  },
  {
    id: 'comfort',
    emoji: '🎒',
    title: 'Mukavuus',
    items: [
      { id: 'co1', label: 'Reppu (tilavuus reitin mukaan)' },
      { id: 'co2', label: 'Repun sadeverhous' },
      { id: 'co3', label: 'Vaellussauvat' },
      { id: 'co4', label: 'Pyyhe (pikakuivuva)' },
      { id: 'co5', label: 'Wc-paperi + biohajoava saippua' },
      { id: 'co6', label: 'Roskapussi' },
      { id: 'co7', label: 'Kirja tai muu vapaa-ajan viihde' },
    ],
  },
];

const LS_KEY = 'retkiapuri-checklist';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface GearResultsProps {
  onReset: () => void;
}

export default function GearResults({ onReset }: GearResultsProps) {
  const [checked, setChecked] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(LS_KEY);
      if (stored) return new Set(JSON.parse(stored) as string[]);
    } catch { /* ignore */ }
    return new Set();
  });

  // Persist to localStorage on every change
  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      try { localStorage.setItem(LS_KEY, JSON.stringify([...next])); } catch { /* ignore */ }
      return next;
    });
  };

  const totalItems = GEAR.reduce((s, c) => s + c.items.length, 0);
  const checkedCount = checked.size;

  return (
    <div className="flex flex-col gap-6 w-full">

      {/* Header */}
      <div className="text-center flex flex-col gap-1">
        <h2
          className="text-2xl font-bold"
          style={{ color: 'var(--foreground)', fontFamily: 'Lusitana, serif' }}
        >
          🎒 Varustesuositukset
        </h2>
        <p className="text-sm" style={{ color: 'var(--muted)' }}>
          Merkitse pakatut tavarat. Valinnat tallentuvat automaattisesti.
        </p>
      </div>

      {/* Disclaimer */}
      <div
        className="rounded-xl px-4 py-3 text-xs leading-relaxed"
        style={{ background: '#fdf6e3', border: '1px solid #e8d8a0', color: '#7a6a30' }}
      >
        ⚠️ <strong>Huomio:</strong> Tämä lista on demo, eivätkä käyttäjän vastaukset vaikuta sisältöön. Älä luota siihen sokeasti — arvioi aina itse kohteen olosuhteet, sääennuste ja oma kokemustasosi ennen retkelle lähtöä.
      </div>

      {/* Overall progress */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-sm" style={{ color: 'var(--muted)' }}>
          <span>Pakattu</span>
          <span>{checkedCount} / {totalItems}</span>
        </div>
        <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${Math.round(checkedCount / totalItems * 100)}%`, background: 'var(--primary)' }}
          />
        </div>
      </div>

      {/* Categories */}
      {GEAR.map((cat) => {
        const catChecked = cat.items.filter((i) => checked.has(i.id)).length;
        const allDone = catChecked === cat.items.length;
        return (
          <div
            key={cat.id}
            className="rounded-2xl overflow-hidden"
            style={{ border: `1px solid ${allDone ? 'var(--primary)' : 'var(--border)'}`, transition: 'border-color 0.3s' }}
          >
            {/* Category header */}
            <div
              className="flex items-center justify-between px-5 py-3"
              style={{ background: allDone ? '#edf6ea' : 'var(--card)', transition: 'background 0.3s' }}
            >
              <span className="font-bold text-base" style={{ color: 'var(--foreground)' }}>
                {cat.emoji} {cat.title}
              </span>
              <span className="text-sm font-medium" style={{ color: allDone ? 'var(--primary)' : 'var(--muted)' }}>
                {allDone ? '✓ Valmis' : `${catChecked}/${cat.items.length}`}
              </span>
            </div>

            {/* Items */}
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {cat.items.map((item) => {
                const isDone = checked.has(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggle(item.id)}
                    className="w-full flex items-center gap-3 px-5 py-3 text-left transition-colors"
                    style={{ background: isDone ? '#f6fbf4' : 'var(--background)' }}
                  >
                    {/* Checkbox */}
                    <span
                      className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
                      style={{
                        background: isDone ? 'var(--primary)' : 'transparent',
                        border: `2px solid ${isDone ? 'var(--primary)' : 'var(--border)'}`,
                        color: 'white',
                        transition: 'background 0.15s, border-color 0.15s',
                      }}
                    >
                      {isDone && '✓'}
                    </span>
                    <span
                      className="text-sm"
                      style={{
                        color: isDone ? 'var(--muted)' : 'var(--foreground)',
                        textDecoration: isDone ? 'line-through' : 'none',
                        transition: 'color 0.15s',
                      }}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Reset survey button */}
      <button
        type="button"
        onClick={onReset}
        className="mt-2 w-full py-3 rounded-xl text-sm font-medium transition-colors"
        style={{ background: 'var(--border)', color: 'var(--foreground)' }}
      >
        ← Aloita alusta
      </button>
    </div>
  );
}
