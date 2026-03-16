'use client';

import { useState } from 'react';

// ---------------------------------------------------------------------------
// Map source: public/Finland_Regions_Map.svg  (1850 × 3220 px original)
//
// Marker positions are expressed as percentages of the rendered image
// container (left%, top%). Adjust the values below to move pins.
//
//   left: 0% = left edge of image,  100% = right edge
//   top:  0% = top edge of image,   100% = bottom edge
// ---------------------------------------------------------------------------

interface Park {
  id: string;
  name: string;
  shortName: string;
  description: string;
  difficulty: string;
  terrain: string;
  /** Horizontal marker position as % of image width  (0–100) */
  left: number;
  /** Vertical marker position as % of image height (0–100) */
  top: number;
}

const PARKS: Park[] = [
  {
    id: 'ukk',
    name: 'Urho Kekkosen kansallispuisto',
    shortName: 'UKK',
    description:
      'Suomen toiseksi suurin kansallispuisto Saariselän tunturimaisemissa Lapissa. ' +
      'Laajat erämaat, avoimet tunturit ja revontulet tekevät siitä unohtumattoman vaelluspaikan.',
    difficulty: 'Haastava',
    terrain: 'Tunturi, erämaa, suo',
    left: 66.5, // ← adjust me (original SVG x ≈ 1156 / 1850)
    top:  20.4, // ← adjust me (original SVG y ≈  657 / 3220)
  },
  {
    id: 'nuuksio',
    name: 'Nuuksion kansallispuisto',
    shortName: 'Nuuksio',
    description:
      'Espoon ja Vihdin rajalla sijaitseva metsäinen puisto. Kalliomaisemat, ' +
      'kirkkaat järvet ja monipuolinen luonto ovat helposti saavutettavissa pääkaupunkiseudulta.',
    difficulty: 'Helppo – Keskivaikea',
    terrain: 'Metsä, kallio, järvet',
    left: 41.7, // ← adjust me (original SVG x ≈  771 / 1850)
    top:  95.2, // ← adjust me (original SVG y ≈ 3066 / 3220)
  },
  {
    id: 'seitseminen',
    name: 'Seitsemisen kansallispuisto',
    shortName: 'Seitseminen',
    description:
      'Pirkanmaalla sijaitseva puisto, jossa vanhat kuusimetsät, kauniit suot ja pienet ' +
      'järvet luovat rauhallisen retkeilymaiseman. Erinomainen kohde perheille ja aloittelijoille.',
    difficulty: 'Helppo',
    terrain: 'Vanha metsä, suo, järvet',
    left: 29.2, // ← adjust me (original SVG x ≈  540 / 1850)
    top:  78.7, // ← adjust me (original SVG y ≈ 2533 / 3220)
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface KohdeQuestionProps {
  value: string | null;
  onChange: (parkId: string) => void;
}

export default function KohdeQuestion({ value, onChange }: KohdeQuestionProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const infoPark = PARKS.find((p) => p.id === (hoveredId ?? value)) ?? null;

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <p className="text-xl font-semibold text-center" style={{ color: 'var(--foreground)' }}>
        Valitse retkikohde
      </p>

      {/* ── Map with overlaid markers ── */}
      <div
        className="relative mx-auto select-none"
        style={{ width: 240, height: Math.round(240 * (3220 / 1850)) }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/Finland_Regions_Map.svg"
          alt="Suomen kartta"
          width={240}
          height={Math.round(240 * (3220 / 1850))}
          style={{ display: 'block', width: '100%', height: '100%' }}
        />

        {PARKS.map((park) => {
          const isSelected = value === park.id;
          const isHovered = hoveredId === park.id;
          const active = isSelected || isHovered;

          return (
            <button
              key={park.id}
              type="button"
              aria-label={park.name}
              aria-pressed={isSelected}
              onClick={() => onChange(park.id)}
              onMouseEnter={() => setHoveredId(park.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                position: 'absolute',
                left: `${park.left}%`,
                top: `${park.top}%`,
                transform: 'translate(-50%, -50%)',
                width: active ? 33 : 24,
                height: active ? 33 : 24,
                borderRadius: '50%',
                background: isSelected
                  ? 'var(--primary)'
                  : isHovered
                  ? 'var(--accent)'
                  : 'var(--muted)',
                border: '2.5px solid white',
                boxShadow: isSelected ? '0 0 0 4px rgba(58,107,50,0.25)' : '0 1px 3px rgba(0,0,0,0.3)',
                cursor: 'pointer',
                transition: 'width 0.15s ease, height 0.15s ease, background 0.15s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
              }}
            >
              {isSelected && (
                <span style={{ color: 'white', fontSize: 9, fontWeight: 700, lineHeight: 1 }}>✓</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Info panel (below map, full width) ── */}
      {/* ── Info panel (fixed height – all cards pre-rendered to prevent layout shifts) ── */}
      <div className="w-full relative" style={{ height: 210 }}>

        {/* Placeholder – visible only when nothing is hovered/selected */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-xl text-xs text-center px-4 leading-relaxed"
          style={{
            color: 'var(--muted)',
            border: '1px dashed var(--border)',
            opacity: infoPark ? 0 : 1,
            transition: 'opacity 0.15s',
            pointerEvents: infoPark ? 'none' : 'auto',
          }}
        >
          Vie hiiri kohteen päälle tai valitse kohde kartalta.
        </div>

        {/* One card per park, all rendered, only the active one is visible */}
        {PARKS.map((park) => {
          const isActive = infoPark?.id === park.id;
          const isSel = !hoveredId && value === park.id;
          return (
            <div
              key={park.id}
              className="absolute inset-0 rounded-xl p-4 flex flex-col gap-3 overflow-hidden"
              style={{
                background: isSel ? '#edf6ea' : 'var(--background)',
                border: `1px solid ${isSel ? 'var(--primary)' : 'var(--border)'}`,
                opacity: isActive ? 1 : 0,
                transition: 'opacity 0.15s, border-color 0.2s, background 0.2s',
                pointerEvents: isActive ? 'auto' : 'none',
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-bold leading-snug" style={{ color: 'var(--foreground)' }}>
                  {park.name}
                </h3>
                {isSel && (
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: 'var(--primary)', color: 'white' }}
                  >
                    Valittu
                  </span>
                )}
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>
                {park.description}
              </p>
              <div className="flex flex-col gap-1 text-xs" style={{ color: 'var(--muted)' }}>
                <span>🏔 <strong style={{ color: 'var(--foreground)' }}>Maasto:</strong> {park.terrain}</span>
                <span>📊 <strong style={{ color: 'var(--foreground)' }}>Vaativuus:</strong> {park.difficulty}</span>
              </div>
            </div>
          );
        })}

      </div>

    </div>
  );
}
