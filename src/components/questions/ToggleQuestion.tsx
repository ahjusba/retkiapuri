'use client';

export interface ToggleQuestionProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export default function ToggleQuestion({ label, value, onChange }: ToggleQuestionProps) {
  return (
    <div className="flex flex-col items-center gap-8">
      <p className="text-2xl font-semibold text-center" style={{color: 'var(--foreground)'}}>{label}</p>

      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
        className={`relative w-20 h-10 rounded-full transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 ${
          value
            ? 'focus:ring-green-300'
            : 'focus:ring-stone-200'
        }`}
        style={{background: value ? 'var(--primary)' : 'var(--border)'}}
      >
        <span
          className={`absolute top-1 left-1 w-8 h-8 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
            value ? 'translate-x-10' : 'translate-x-0'
          }`}
        />
      </button>

      <p className="text-base font-medium" style={{color: 'var(--muted)'}}>
        {value ? 'Kyllä' : 'Ei'}
      </p>
    </div>
  );
}
