'use client';

import { useState } from 'react';
import ToggleQuestion from './questions/ToggleQuestion';
import KohdeQuestion from './questions/KohdeQuestion';
import AjankohtaQuestion from './questions/AjankohtaQuestion';

// ---------------------------------------------------------------------------
// Question definitions
// ---------------------------------------------------------------------------

type QuestionType = 'toggle' | 'kohde' | 'ajankohta';
type AnswerValue = boolean | string | number | null;

interface QuestionDef {
  id: string;
  label: string;
  type: QuestionType;
}

const QUESTIONS: QuestionDef[] = [
  { id: 'q0', label: 'Valitse retkikohde',                   type: 'kohde'     },
  { id: 'q1', label: 'Valitse ajankohta',                    type: 'ajankohta' },
  { id: 'q2', label: 'Onko matka useamman päivän mittainen?', type: 'toggle'    },
  { id: 'q3', label: 'Yövytäänkö matkalla?',                  type: 'toggle'    },
  { id: 'q4', label: 'Onko reitti merkitty maastoon?',       type: 'toggle'    },
  { id: 'q5', label: 'Liikutaanko kansallispuiston alueella?', type: 'toggle'  },
  { id: 'q6', label: 'Osallistuuko matkalle lapsia?',        type: 'toggle'    },
];

type Answers = Record<string, AnswerValue>;

// ---------------------------------------------------------------------------
// Survey component
// ---------------------------------------------------------------------------

interface SurveyProps {
  onSubmit?: (answers: Answers) => void;
}

export default function Survey({ onSubmit }: SurveyProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);

  const total = QUESTIONS.length;
  const currentQuestion = QUESTIONS[currentIndex];
  const isLast = currentIndex === total - 1;
  const currentAnswer: AnswerValue =
    currentQuestion.id in answers
      ? answers[currentQuestion.id]
      : currentQuestion.type === 'toggle'
      ? false
      : null;

  // Progress: how many questions have been completed (i.e. navigated past)
  const progressPercent = Math.round((currentIndex / total) * 100);

  const handleAnswer = (value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleContinue = () => {
    const defaultValue: AnswerValue = currentQuestion.type === 'toggle' ? false : null;
    const confirmedAnswers = {
      ...answers,
      [currentQuestion.id]: currentQuestion.id in answers ? answers[currentQuestion.id] : defaultValue,
    };
    setAnswers(confirmedAnswers);

    if (isLast) {
      setSubmitted(true);
      onSubmit?.(confirmedAnswers);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // ------------------------------------------------------------------
  // Submitted state
  // ------------------------------------------------------------------
  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-6 py-16 text-center">
        <div className="flex items-center justify-center w-20 h-20 rounded-full" style={{background: '#d4edcf'}}>
          <svg
            className="w-10 h-10" style={{color: 'var(--primary)'}}
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold" style={{color: 'var(--foreground)'}}>Vastaukset lähetetty!</h2>
        <p className="max-w-sm" style={{color: 'var(--muted)'}}>
          Tässä kohtaa näytettäisiin varustussuositukset vastausten perusteella.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setCurrentIndex(0);
            setAnswers({});
          }}
          className="mt-4 px-6 py-2 rounded-lg font-medium transition-colors" style={{background: 'var(--border)', color: 'var(--foreground)'}}
        >
          Aloita alusta
        </button>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // Survey flow
  // ------------------------------------------------------------------
  return (
    <div className="flex flex-col w-full" style={{gap: 0}}>

      {/* ── Fixed header: progress bar ── */}
      <div className="flex flex-col gap-2 pb-6">
        <div className="flex items-center justify-between text-sm font-medium" style={{color: 'var(--muted)'}}>
          <span>Kysymys {currentIndex + 1} / {total}</span>
          <span>{progressPercent}% valmis</span>
        </div>
        <div className="w-full h-5 rounded-full overflow-hidden" style={{background: 'var(--border)'}}>
          <div
            className="h-full rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${progressPercent}%`, background: 'var(--primary)' }}
          />
        </div>
      </div>

      {/* ── Question area (natural height) ── */}
      <div
        className="rounded-2xl shadow-sm px-6 py-8 flex items-center justify-center"
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
        }}
      >
        {currentQuestion.type === 'toggle' && (
          <ToggleQuestion
            label={currentQuestion.label}
            value={currentAnswer as boolean}
            onChange={handleAnswer}
          />
        )}
        {currentQuestion.type === 'kohde' && (
          <KohdeQuestion
            value={currentAnswer as string | null}
            onChange={handleAnswer}
          />
        )}
        {currentQuestion.type === 'ajankohta' && (
          <AjankohtaQuestion
            value={currentAnswer as number | null}
            onChange={handleAnswer}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          type="button"
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((prev) => prev - 1)}
          className="px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed transition-colors" style={{color: 'var(--muted)'}}
        >
          ← Takaisin
        </button>

        <button
          type="button"
          onClick={handleContinue}
          className="px-8 py-3 rounded-xl text-base font-semibold text-white transition-colors"
            style={{background: 'var(--primary)'}}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--primary-hover)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'var(--primary)')}
        >
          {isLast ? 'Lähetä' : 'Jatka →'}
        </button>
      </div>
    </div>
  );
}
