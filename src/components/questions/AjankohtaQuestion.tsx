'use client';

import { useState } from 'react';

// ---------------------------------------------------------------------------
// Season / gradient configuration
// ---------------------------------------------------------------------------

// Gradient stop positions (% of slider 0–100) matching the seasons:
//   Winter  Jan 1  – Feb 28  (days   1–59,  0–16%)
//   Spring  Mar 1  – May 31  (days  60–151, 16–41%)
//   Summer  Jun 1  – Aug 31  (days 152–243, 42–67%)
//   Autumn  Sep 1  – Nov 30  (days 244–334, 67–92%)
//   Winter  Dec 1  – Dec 31  (days 335–365, 92–100%)
const GRADIENT =
  'linear-gradient(to right,' +
  '#b8d4e8 0%,'    + // winter start
  '#b8d4e8 8%,'    + // deep winter
  '#6ab04c 22%,'   + // spring arriving
  '#6ab04c 41%,'   + // spring end
  '#f9ca24 54%,'   + // summer mid
  '#f9ca24 66%,'   + // summer end
  '#c0702a 79%,'   + // autumn mid
  '#c0702a 91%,'   + // autumn end
  '#b8d4e8 100%'   + // winter returns
  ')';

const SEASON_LABELS = [
  { label: 'Talvi', percent: 4 },
  { label: 'Kevät', percent: 29 },
  { label: 'Kesä',  percent: 54 },
  { label: 'Syksy', percent: 79 },
  { label: 'Talvi', percent: 96 },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const FINNISH_MONTHS = [
  'tammikuuta', 'helmikuuta', 'maaliskuuta', 'huhtikuuta',
  'toukokuuta', 'kesäkuuta', 'heinäkuuta', 'elokuuta',
  'syyskuuta', 'lokakuuta', 'marraskuuta', 'joulukuuta',
];

function dayOfYearToDate(day: number): string {
  const d = new Date(2025, 0, day);
  return `${d.getDate()}. ${FINNISH_MONTHS[d.getMonth()]}`;
}

function getSeason(day: number): { name: string; bg: string; fg: string } {
  if (day <= 59  || day >= 335) return { name: 'Talvi', bg: '#b8d4e8', fg: '#2c2416' };
  if (day <= 151)               return { name: 'Kevät', bg: '#6ab04c', fg: '#ffffff' };
  if (day <= 243)               return { name: 'Kesä',  bg: '#f9ca24', fg: '#2c2416' };
  return                               { name: 'Syksy', bg: '#c0702a', fg: '#ffffff' };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface AjankohtaQuestionProps {
  value: number | null;
  onChange: (day: number) => void;
}

export default function AjankohtaQuestion({ value, onChange }: AjankohtaQuestionProps) {
  const day = value ?? 1;
  const season = getSeason(day);
  const [flashing, setFlashing] = useState<string | null>(null);

  const fire = (id: string, delta: number) => {
    onChange(Math.min(365, Math.max(1, day + delta)));
    setFlashing(id);
    setTimeout(() => setFlashing(null), 300);
  };

  const btnStyle = (id: string, disabled: boolean) => ({
    background: flashing === id ? '#3a6b32' : 'var(--border)',
    color:      flashing === id ? '#ffffff'  : 'var(--foreground)',
    opacity: disabled ? 0.3 : 1,
    cursor:  disabled ? 'not-allowed' : 'pointer',
    transition: 'background 0.15s, color 0.15s',
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      <p className="text-xl font-semibold text-center" style={{ color: 'var(--foreground)' }}>
        Valitse ajankohta
      </p>

      {/* ── Date & season badge ── */}
      <div className="flex flex-col items-center gap-2">
        <span
          className="text-4xl font-bold tracking-tight"
          style={{ color: 'var(--foreground)', fontFamily: 'Lusitana, serif' }}
        >
          {dayOfYearToDate(day)}
        </span>
        <span
          className="text-sm font-semibold px-4 py-1 rounded-full transition-colors duration-300"
          style={{ background: season.bg, color: season.fg }}
        >
          {season.name}
        </span>
      </div>

      {/* ── Slider + labels ── */}
      <div className="flex flex-col gap-1 w-full">
        {/* Season labels */}
        <div className="relative w-full" style={{ height: '1.3rem' }}>
          {SEASON_LABELS.map(({ label, percent }, i) => (
            <span
              key={i}
              className="absolute text-xs font-medium"
              style={{
                left: `${percent}%`,
                transform: 'translateX(-50%)',
                color: 'var(--muted)',
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Gradient range input */}
        <input
          type="range"
          min={1}
          max={365}
          value={day}
          onChange={(e) => onChange(Number(e.target.value))}
          className="ajankohta-slider w-full"
          style={{ background: GRADIENT }}
        />
      </div>

      {/* ── Fine-tune buttons ── */}
      <div className="flex items-center justify-center gap-3">

        {/* −5 days */}
        <button
          type="button"
          onClick={() => fire('m5', -5)}
          disabled={day <= 1}
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold disabled:cursor-not-allowed"
          style={btnStyle('m5', day <= 1)}
        >
          «
        </button>

        {/* −1 day */}
        <button
          type="button"
          onClick={() => fire('m1', -1)}
          disabled={day <= 1}
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold disabled:cursor-not-allowed"
          style={btnStyle('m1', day <= 1)}
        >
          ‹
        </button>

        {/* +1 day */}
        <button
          type="button"
          onClick={() => fire('p1', 1)}
          disabled={day >= 365}
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold disabled:cursor-not-allowed"
          style={btnStyle('p1', day >= 365)}
        >
          ›
        </button>

        {/* +5 days */}
        <button
          type="button"
          onClick={() => fire('p5', 5)}
          disabled={day >= 365}
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold disabled:cursor-not-allowed"
          style={btnStyle('p5', day >= 365)}
        >
          »
        </button>

      </div>
    </div>
  );
}
