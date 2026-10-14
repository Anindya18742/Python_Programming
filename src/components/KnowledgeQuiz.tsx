import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/lessonPlanData';
import { CheckCircle2, XCircle, RotateCcw, HelpCircle, Trophy } from 'lucide-react';

export const KnowledgeQuiz: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    if (submitted) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionIdx
    });
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  // Calculate score
  let correctCount = 0;
  QUIZ_QUESTIONS.forEach((q) => {
    if (selectedAnswers[q.id] === q.correctIndex) {
      correctCount++;
    }
  });

  const totalQuestions = QUIZ_QUESTIONS.length;
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);
  const isComplete = Object.keys(selectedAnswers).length === totalQuestions;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-sky-400 font-medium">
          <span>Formative Assessment</span>
          <span aria-hidden="true">·</span>
          <span>Concept Mastery Verification</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
          Python Lists &amp; Tuples Knowledge Check
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Test your comprehension of core sequence semantics, the comma singleton rule, mutability traps, dictionary key hashability, and real-world data structure selection.
        </p>
      </div>

      {/* Progress & Score Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-mono">Answered Questions</div>
            <div className="text-base font-bold text-white font-mono">
              {Object.keys(selectedAnswers).length} / {totalQuestions}
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs text-slate-400 font-mono">Final Mastery Score</span>
              <div className="text-xl font-bold font-mono text-sky-400">
                {correctCount} / {totalQuestions} ({scorePercent}%)
              </div>
            </div>
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSubmitted(true)}
            disabled={!isComplete}
            className="px-5 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors shadow-xs"
          >
            {isComplete ? 'Submit Answers & Review' : `Select All ${totalQuestions} Answers`}
          </button>
        )}
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {QUIZ_QUESTIONS.map((q, idx) => {
          const userChoice = selectedAnswers[q.id];
          const isAnswered = userChoice !== undefined;
          const isCorrect = userChoice === q.correctIndex;

          return (
            <div
              key={q.id}
              className={`p-6 rounded-xl border transition-all ${
                submitted
                  ? isCorrect
                    ? 'bg-emerald-950/20 border-emerald-900/60'
                    : 'bg-rose-950/20 border-rose-900/60'
                  : 'bg-slate-900/50 border-slate-800'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <span>Question {idx + 1} of {totalQuestions}</span>
                    <span aria-hidden="true">·</span>
                    <span className="uppercase text-sky-400">{q.topic}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-slate-100">
                    {q.question}
                  </h3>
                </div>

                {submitted && (
                  <div className="shrink-0">
                    {isCorrect ? (
                      <span className="flex items-center gap-1.5 text-xs font-semibold font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800">
                        <CheckCircle2 className="w-4 h-4" />
                        Correct
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-semibold font-mono text-rose-400 bg-rose-950/80 px-2.5 py-1 rounded border border-rose-800">
                        <XCircle className="w-4 h-4" />
                        Incorrect
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Optional Code Snippet */}
              {q.codeSnippet && (
                <pre className="my-3 p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-sky-300 overflow-x-auto">
                  <code>{q.codeSnippet}</code>
                </pre>
              )}

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4">
                {q.options.map((opt, optIdx) => {
                  const isSelected = userChoice === optIdx;
                  let btnStyle = 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900';

                  if (submitted) {
                    if (optIdx === q.correctIndex) {
                      btnStyle = 'border-emerald-600 bg-emerald-950/60 text-emerald-200 font-medium';
                    } else if (isSelected && !isCorrect) {
                      btnStyle = 'border-rose-600 bg-rose-950/60 text-rose-300';
                    } else {
                      btnStyle = 'border-slate-800/60 bg-slate-950/40 text-slate-500 opacity-60';
                    }
                  } else if (isSelected) {
                    btnStyle = 'border-sky-500 bg-sky-950/40 text-sky-200 font-medium ring-1 ring-sky-500/30';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      disabled={submitted}
                      className={`p-3 text-left rounded-lg border text-xs sm:text-sm transition-all flex items-start gap-2.5 ${btnStyle}`}
                    >
                      <span className="font-mono text-xs text-slate-500 shrink-0 mt-0.5">
                        {String.fromCharCode(65 + optIdx)}.
                      </span>
                      <span className="leading-snug">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Explanation (Shown when submitted) */}
              {submitted && (
                <div className="mt-4 p-3.5 bg-slate-950/90 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-sky-400">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Explanation:</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
