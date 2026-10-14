import React, { useState } from 'react';
import { EXPORTABLE_PYTHON_LESSON, LESSON_META, LESSON_SECTIONS, REAL_WORLD_EXAMPLES } from '../data/lessonPlanData';
import { X, Copy, Check, Download, FileCode, FileText } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [format, setFormat] = useState<'python' | 'markdown'>('python');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  // Build markdown export
  const buildMarkdown = () => {
    let md = `# ${LESSON_META.courseTitle} (${LESSON_META.courseCode})\n\n`;
    md += `**Duration:** ${LESSON_META.totalDurationMinutes} minutes | **Level:** ${LESSON_META.level} | **Python:** ${LESSON_META.pythonVersion}\n\n`;
    md += `> ${LESSON_META.summary}\n\n`;

    md += `## Real-World Case Studies\n\n`;
    REAL_WORLD_EXAMPLES.forEach((ex) => {
      md += `### ${ex.title} (${ex.category.toUpperCase()})\n`;
      md += `**Domain:** ${ex.domain}\n\n`;
      md += `**Why Chosen:** ${ex.whyChosen}\n\n`;
      md += `**Why Alternative Fails:** ${ex.whyAlternativeFails}\n\n`;
      md += "```python\n" + ex.pythonCode + "\n```\n\n";
    });

    md += `## Curriculum Modules\n\n`;
    LESSON_SECTIONS.forEach((sec) => {
      md += `### ${sec.title}\n`;
      md += `*${sec.subtitle}* (${sec.estimatedMinutes} mins)\n\n`;
      sec.concepts.forEach((c) => {
        md += `#### ${c.title}\n${c.description}\n\n`;
        c.examples.forEach((ex) => {
          md += `##### ${ex.title}\n`;
          md += "```python\n" + ex.code + "\n```\n\n";
        });
      });
    });

    return md;
  };

  const exportContent = format === 'python' ? EXPORTABLE_PYTHON_LESSON : buildMarkdown();

  const handleCopy = () => {
    navigator.clipboard.writeText(exportContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = format === 'python' ? 'lesson_plan_lists_tuples.py' : 'lesson_plan_lists_tuples.md';
    const mimeType = format === 'python' ? 'text/x-python' : 'text/markdown';
    const blob = new Blob([exportContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-base">Export Lesson Plan</span>
            <span className="text-xs text-slate-500 font-mono">PY-102</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 bg-slate-950/60 border-b border-slate-800">
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800">
            <button
              onClick={() => setFormat('python')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                format === 'python'
                  ? 'bg-sky-500 text-slate-950 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Python Script (.py)</span>
            </button>

            <button
              onClick={() => setFormat('markdown')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                format === 'markdown'
                  ? 'bg-sky-500 text-slate-950 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Markdown Guide (.md)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-md transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-950 font-mono text-xs text-slate-300">
          <pre className="whitespace-pre-wrap leading-relaxed select-all">
            <code>{exportContent}</code>
          </pre>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
          <span>Ready to execute with <code className="text-slate-400 font-mono">python3 lesson_plan_lists_tuples.py</code></span>
          <button
            onClick={onClose}
            className="px-3 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
