'use client';

import { useState } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MatkaTiedotValue {
  days: number | null;
  km: number | null;
}

export interface MatkaTiedotQuestionProps {
  value: MatkaTiedotValue;
  onChange: (val: MatkaTiedotValue) => void;
}

// ---------------------------------------------------------------------------
// Sub-component: a single numeric picker row
// ---------------------------------------------------------------------------

interface PickerProps {
  label: string;
  unit: string;
  value: number | null;
  onChange: (n: number | null) => void;
}

function NumericPicker({ label, unit, value, onChange }: PickerProps) {
  const [inputVal, setInputVal] = useState(value !== null ? String(value) : '');

  const handleInput = (raw: string) => {
    setInputVal(raw);
    const parsed = parseInt(raw, 10);
    onChange(!isNaN(parsed) && parsed > 0 ? parsed : null);
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <p className="text-base font-semibold" style={{ color: 'var(--foreground)' }}>
        {label}
      </p>

      <div className="flex items-center gap-3">
        <input
          type="number"
          min={1}
          value={inputVal}
          onChange={(e) => handleInput(e.target.value)}
          placeholder="—"
          className="rounded-2xl text-center outline-none"
          style={{
            width: '7rem',
            padding: '0.6rem 1rem',
            fontSize: '1.5rem',
            fontWeight: 700,
            background: 'var(--background)',
            border: `2px solid ${value !== null ? 'var(--primary)' : 'var(--border)'}`,
            color: 'var(--foreground)',
            transition: 'border-color 0.15s',
          }}
        />
        <span className="text-lg font-medium" style={{ color: 'var(--muted)' }}>{unit}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function MatkaTiedotQuestion({ value, onChange }: MatkaTiedotQuestionProps) {
  return (
    <div className="flex flex-col gap-8 w-full">
      <p className="text-xl font-semibold text-center" style={{ color: 'var(--foreground)' }}>
        Matkan tiedot
      </p>

      <NumericPicker
        label="Kuinka monta päivää retki kestää?"
        unit="pv"
        value={value.days}
        onChange={(days) => onChange({ ...value, days })}
      />

      <div style={{ height: 1, background: 'var(--border)' }} />

      <NumericPicker
        label="Kuinka monta kilometriä päivässä?"
        unit="km"
        value={value.km}
        onChange={(km) => onChange({ ...value, km })}
      />
    </div>
  );
}
