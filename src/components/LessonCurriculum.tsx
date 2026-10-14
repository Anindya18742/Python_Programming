import React, { useState } from 'react';
import { LESSON_SECTIONS, LESSON_META } from '../data/lessonPlanData';
import { Play, Copy, Check, ChevronDown, ChevronUp, BookOpen, Clock, Award, AlertCircle } from 'lucide-react';

interface LessonCurriculumProps {
  onLoadInPlayground: (code: string) => void;
}

export const LessonCurriculum: React.FC<LessonCurriculumProps> = ({ onLoadInPlayground }) => {
  const [activeModuleId, setActiveModuleId] = useState<string>('module-1');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'module-1': true,
    'module-2': true,
    'module-3': true,
    'module-4': true,
    'module-5': true
  });

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="space-y-8">
      {/* Course Overview Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs text-sky-400 font-medium">
              <span>{LESSON_META.courseCode}</span>
              <span aria-hidden="true">·</span>
              <span>{LESSON_META.level}</span>
              <span aria-hidden="true">·</span>
              <span>{LESSON_META.pythonVersion}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
              {LESSON_META.courseTitle}
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
              {LESSON_META.summary}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950 p-4 rounded-lg border border-slate-800 shrink-0">
            <div className="flex items-center gap-2 text-slate-300 text-xs font-mono">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>{LESSON_META.totalDurationMinutes} mins total</span>
            </div>
            <div className="h-4 w-px bg-slate-800" />
            <div className="flex items-center gap-2 text-slate-300 text-xs font-mono">
              <Award className="w-4 h-4 text-amber-400" />
              <span>5 Modules</span>
            </div>
          </div>
        </div>

        {/* Prerequisites & Target Audience */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-950/70 rounded-lg border border-slate-800/80 space-y-1.5">
            <span className="font-semibold text-slate-300 block uppercase tracking-wider text-[11px]">
              Course Prerequisites
            </span>
            <ul className="text-slate-400 space-y-1 list-disc list-inside">
              {LESSON_META.prerequisites.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-slate-950/70 rounded-lg border border-slate-800/80 space-y-1.5">
            <span className="font-semibold text-slate-300 block uppercase tracking-wider text-[11px]">
              Target Audience
            </span>
            <p className="text-slate-400 leading-relaxed">
              {LESSON_META.targetAudience}
            </p>
          </div>
        </div>
      </div>

      {/* Module Index Navigation Bar */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900/60 border border-slate-800 rounded-lg sticky top-16 z-30 backdrop-blur-md">
        <span className="text-xs text-slate-400 px-3 font-medium">Jump to Module:</span>
        {LESSON_SECTIONS.map((section, idx) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            onClick={(e) => {
              e.preventDefault();
              setActiveModuleId(section.id);
              document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeModuleId === section.id
                ? 'bg-slate-800 text-sky-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Mod {idx + 1}
          </a>
        ))}
      </div>

      {/* Modules List */}
      <div className="space-y-8">
        {LESSON_SECTIONS.map((section) => {
          const isExpanded = expandedSections[section.id] !== false;

          return (
            <section
              key={section.id}
              id={section.id}
              className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-lg transition-all scroll-mt-28"
            >
              {/* Section Header */}
              <div
                onClick={() => toggleSection(section.id)}
                className="p-6 cursor-pointer hover:bg-slate-900/80 transition-colors flex items-center justify-between gap-4 border-b border-slate-800/80 bg-slate-950/40"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <span className="text-sky-400 font-semibold">{section.estimatedMinutes} minutes</span>
                    <span aria-hidden="true">·</span>
                    <span>{section.concepts.length} Core Concepts</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                    {section.title}
                  </h2>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1">
                    {section.subtitle}
                  </p>
                </div>

                <button
                  type="button"
                  className="p-2 text-slate-400 hover:text-slate-200 bg-slate-900 rounded-lg border border-slate-800"
                >
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>

              {isExpanded && (
                <div className="p-6 space-y-8">
                  {/* Learning Objectives */}
                  <div className="p-4 bg-slate-950/80 rounded-lg border border-slate-800 space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 block">
                      Learning Objectives (Bloom&apos;s Taxonomy)
                    </span>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-400">
                      {section.learningObjectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-sky-400 font-bold">•</span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Concepts */}
                  <div className="space-y-8">
                    {section.concepts.map((concept, cIdx) => (
                      <div key={cIdx} className="space-y-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-100">
                            {concept.title}
                          </h3>
                          <p className="text-slate-300 text-xs sm:text-sm mt-1 leading-relaxed">
                            {concept.description}
                          </p>
                        </div>

                        {/* Syntax Box if available */}
                        {concept.syntaxBox && (
                          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 font-mono text-xs text-amber-300/90 whitespace-pre-wrap">
                            {concept.syntaxBox}
                          </div>
                        )}

                        {/* Code Examples */}
                        <div className="space-y-4">
                          {concept.examples.map((example) => (
                            <div
                              key={example.id}
                              className="rounded-lg border border-slate-800 bg-slate-950 overflow-hidden"
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs">
                                <div>
                                  <span className="font-semibold text-slate-200">
                                    {example.title}
                                  </span>
                                  <p className="text-[11px] text-slate-400">
                                    {example.description}
                                  </p>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    onClick={() => handleCopy(example.code, example.id)}
                                    className="flex items-center gap-1 px-2.5 py-1 text-slate-400 hover:text-slate-200 transition-colors"
                                  >
                                    {copiedId === example.id ? (
                                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                    <span>{copiedId === example.id ? 'Copied' : 'Copy'}</span>
                                  </button>

                                  <button
                                    onClick={() => onLoadInPlayground(example.code)}
                                    className="flex items-center gap-1.5 px-3 py-1 font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded transition-colors"
                                  >
                                    <Play className="w-3 h-3 fill-current" />
                                    <span>Run in Sandbox</span>
                                  </button>
                                </div>
                              </div>

                              <pre className="p-4 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
                                <code>{example.code}</code>
                              </pre>

                              {example.outputPreview && (
                                <div className="p-3 bg-slate-900/60 border-t border-slate-800 text-xs font-mono">
                                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                                    Expected Output
                                  </span>
                                  <pre className="text-emerald-400 whitespace-pre-wrap">
                                    {example.outputPreview}
                                  </pre>
                                </div>
                              )}

                              {example.explanation && (
                                <div className="p-3 bg-slate-950 border-t border-slate-800 text-xs text-slate-400">
                                  <strong className="text-slate-300">Explanation: </strong>
                                  {example.explanation}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Common Gotchas */}
                        {concept.commonGotchas && (
                          <div className="p-3 bg-amber-950/20 border border-amber-900/40 rounded-lg text-xs space-y-1 text-amber-200/90">
                            <div className="flex items-center gap-1.5 font-semibold text-amber-400">
                              <AlertCircle className="w-3.5 h-3.5" />
                              <span>Common Pitfalls to Avoid:</span>
                            </div>
                            <ul className="list-disc list-inside space-y-1 text-slate-400">
                              {concept.commonGotchas.map((g, gi) => (
                                <li key={gi}>{g}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};
