'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import KohdeQuestion from './questions/KohdeQuestion';
import AjankohtaQuestion from './questions/AjankohtaQuestion';
import YopymisQuestion from './questions/YopymisQuestion';
import MatkaTiedotQuestion, { MatkaTiedotValue } from './questions/MatkaTiedotQuestion';
import RuuanvalmistusQuestion from './questions/RuuanvalmistusQuestion';

// ---------------------------------------------------------------------------
// Question definitions
// ---------------------------------------------------------------------------

type QuestionType = 'kohde' | 'ajankohta' | 'matkatiedot' | 'yopymis' | 'ruuanvalmistus';
type AnswerValue = boolean | string | number | string[] | MatkaTiedotValue | null;

interface QuestionDef {
  id: string;
  label: string;
  type: QuestionType;
}

const QUESTIONS: QuestionDef[] = [
  { id: 'q0', label: 'Valitse retkikohde', type: 'kohde'          },
  { id: 'q1', label: 'Valitse ajankohta',  type: 'ajankohta'      },
  { id: 'q2', label: 'Matkan tiedot',      type: 'matkatiedot'    },
  { id: 'q3', label: 'Yöpymistapa',        type: 'yopymis'        },
  { id: 'q4', label: 'Ruuanvalmistus',     type: 'ruuanvalmistus' },
];

type Answers = Record<string, AnswerValue>;

// ---------------------------------------------------------------------------
// Survey component
// ---------------------------------------------------------------------------

type Phase = 'survey' | 'thinking';

const THINKING_MS = 2000;

export default function Survey() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [phase, setPhase] = useState<Phase>('survey');
  const [thinkProgress, setThinkProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = QUESTIONS.length;
  const currentQuestion = QUESTIONS[currentIndex];
  const isLast = currentIndex === total - 1;

  const currentAnswer: AnswerValue =
    currentQuestion.id in answers
      ? answers[currentQuestion.id]
      : currentQuestion.type === 'yopymis' || currentQuestion.type === 'ruuanvalmistus'
      ? []
      : currentQuestion.type === 'matkatiedot'
      ? { days: 5, km: 10 }
      : null;

  const progressPercent = Math.round((currentIndex / total) * 100);

  const handleAnswer = (value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleContinue = () => {
    const confirmedAnswers = {
      ...answers,
      [currentQuestion.id]: currentQuestion.id in answers
        ? answers[currentQuestion.id]
        : currentQuestion.type === 'matkatiedot'
        ? { days: 5, km: 10 }
        : null,
    };
    setAnswers(confirmedAnswers);

    if (isLast) {
      startThinking();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const startThinking = () => {
    setThinkProgress(0);
    setPhase('thinking');
    const start = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / THINKING_MS) * 100));
      setThinkProgress(pct);
      if (pct >= 100) {
        clearInterval(intervalRef.current!);
        if (!localStorage.getItem('retkiapuri-checklist')) {
          localStorage.setItem('retkiapuri-checklist', '[]');
        }
        router.push('/matkalista');
      }
    }, 30);
  };

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  // ------------------------------------------------------------------
  // Thinking state
  // ------------------------------------------------------------------
  if (phase === 'thinking') {
    return (
      <div className="flex flex-col items-center gap-8 py-16 text-center">
        <div className="flex flex-col items-center gap-3">
          <span style={{ fontSize: '3rem' }}>🤔</span>
          <h2 className="text-xl font-bold" style={{ color: 'var(--foreground)', fontFamily: 'Lusitana, serif' }}>
            Lasketaan suosituksia…
          </h2>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Hetki, analysoidaan vastauksiasi.</p>
        </div>
        <div className="w-full max-w-sm flex flex-col gap-2">
          <div className="w-full h-4 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${thinkProgress}%`,
                background: 'var(--primary)',
                transition: 'width 0.05s linear',
              }}
            />
          </div>
          <p className="text-xs tabular-nums text-right" style={{ color: 'var(--muted)' }}>
            {thinkProgress}%
          </p>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // Survey flow
  // ------------------------------------------------------------------
  return (
    <div className="flex flex-col w-full" style={{ gap: 0 }}>

      {/* ── Progress bar ── */}
      <div className="flex flex-col gap-2 pb-6">
        <div className="flex items-center justify-between text-sm font-medium" style={{ color: 'var(--muted)' }}>
          <span>Kysymys {currentIndex + 1} / {total}</span>
          <span>{progressPercent}% valmis</span>
        </div>
        <div className="w-full h-5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
          <div
            className="h-full rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${progressPercent}%`, background: 'var(--primary)' }}
          />
        </div>
      </div>

      {/* ── Question card ── */}
      <div
        className="rounded-2xl shadow-sm px-6 py-8 flex items-center justify-center"
        style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
      >
        {currentQuestion.type === 'kohde' && (
          <KohdeQuestion value={currentAnswer as string | null} onChange={handleAnswer} />
        )}
        {currentQuestion.type === 'ajankohta' && (
          <AjankohtaQuestion value={currentAnswer as number | null} onChange={handleAnswer} />
        )}
        {currentQuestion.type === 'matkatiedot' && (
          <MatkaTiedotQuestion value={currentAnswer as MatkaTiedotValue} onChange={handleAnswer} />
        )}
        {currentQuestion.type === 'yopymis' && (
          <YopymisQuestion value={currentAnswer as string[]} onChange={handleAnswer} />
        )}
        {currentQuestion.type === 'ruuanvalmistus' && (
          <RuuanvalmistusQuestion value={currentAnswer as string[]} onChange={handleAnswer} />
        )}
      </div>

      {/* ── Navigation ── */}
      <div className="flex items-center justify-between mt-6">
        <button
          type="button"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((prev) => prev - 1)}
          className="px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          style={{ color: 'var(--muted)' }}
        >
          ← Takaisin
        </button>
        <button
          type="button"
          onClick={handleContinue}
          className="px-8 py-3 rounded-xl text-base font-semibold text-white transition-colors"
          style={{ background: 'var(--primary)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--primary-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--primary)')}
        >
          {isLast ? 'Lähetä' : 'Jatka →'}
        </button>
      </div>
    </div>
  );
}
