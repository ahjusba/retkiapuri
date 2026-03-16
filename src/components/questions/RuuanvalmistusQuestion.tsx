'use client';

// ---------------------------------------------------------------------------
// Cooking method definitions
// ---------------------------------------------------------------------------

interface CookingOption {
  id: string;
  emoji: string;
  label: string;
}

const OPTIONS: CookingOption[] = [
  { id: 'kaasukeitin',  emoji: '🔵', label: 'Kaasukeitin'  },
  { id: 'spriikeitin',  emoji: '🍶', label: 'Spriikeitin'  },
  { id: 'nuotio',       emoji: '🔥', label: 'Nuotio'       },
  { id: 'risukeitin',   emoji: '🪵', label: 'Risukeitin'   },
  { id: 'valmisruoka',  emoji: '🥫', label: 'Valmisruoka'  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export interface RuuanvalmistusQuestionProps {
  value: string[];
  onChange: (selected: string[]) => void;
}

export default function RuuanvalmistusQuestion({ value, onChange }: RuuanvalmistusQuestionProps) {
  const toggle = (id: string) => {
    onChange(
      value.includes(id)
        ? value.filter((v) => v !== id)
        : [...value, id]
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="text-center">
        <p className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>
          Ruuanvalmistus
        </p>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
          Voit valita useamman vaihtoehdon.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 w-full">
        {OPTIONS.map((opt) => {
          const isSelected = value.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggle(opt.id)}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl py-6 px-4 transition-all duration-150 select-none"
              style={{
                background: isSelected ? '#edf6ea'        : 'var(--background)',
                border:     `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                color:      isSelected ? 'var(--primary)' : 'var(--foreground)',
                boxShadow:  isSelected ? '0 0 0 3px rgba(58,107,50,0.12)' : 'none',
                transform:  isSelected ? 'scale(1.03)'   : 'scale(1)',
              }}
            >
              <span style={{ fontSize: '2.4rem', lineHeight: 1 }}>{opt.emoji}</span>
              <span className="text-base font-semibold">{opt.label}</span>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: isSelected ? 'var(--primary)' : 'transparent',
                  color:      isSelected ? 'white'          : 'transparent',
                  border: '1px solid transparent',
                  transition: 'background 0.15s, color 0.15s',
                  userSelect: 'none',
                }}
              >
                ✓ Valittu
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
