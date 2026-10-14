import { useState } from 'react';
import { TopNav } from './components/TopNav';
import { LessonCurriculum } from './components/LessonCurriculum';
import { RealWorldShowcase } from './components/RealWorldShowcase';
import { SlicingVisualizer } from './components/SlicingVisualizer';
import { MemoryVisualizer } from './components/MemoryVisualizer';
import { CodePlayground } from './components/CodePlayground';
import { ComparisonTable } from './components/ComparisonTable';
import { KnowledgeQuiz } from './components/KnowledgeQuiz';
import { ExportModal } from './components/ExportModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('real-world');
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [sandboxCode, setSandboxCode] = useState<string | undefined>(undefined);

  const handleLoadInPlayground = (code: string) => {
    setSandboxCode(code);
    setActiveTab('sandbox');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-sky-500 selection:text-white">
      {/* Top Bar following Top Bar Contract */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {activeTab === 'curriculum' && (
          <LessonCurriculum onLoadInPlayground={handleLoadInPlayground} />
        )}

        {activeTab === 'real-world' && (
          <RealWorldShowcase onLoadInPlayground={handleLoadInPlayground} />
        )}

        {activeTab === 'slicing' && (
          <SlicingVisualizer onLoadInPlayground={handleLoadInPlayground} />
        )}

        {activeTab === 'memory' && (
          <MemoryVisualizer />
        )}

        {activeTab === 'comparison' && (
          <ComparisonTable />
        )}

        {activeTab === 'sandbox' && (
          <CodePlayground initialCode={sandboxCode} />
        )}

        {activeTab === 'quiz' && (
          <KnowledgeQuiz />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Python Sequences Curriculum</span>
            <span aria-hidden="true">·</span>
            <span>Lists &amp; Tuples Masterclass</span>
          </div>
          <div className="flex items-center gap-4">
            <span>CPython 3.10+ Invariants</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setIsExportOpen(true)}
              className="text-sky-400 hover:text-sky-300 transition-colors"
            >
              Export Lesson Script (.py)
            </button>
          </div>
        </div>
      </footer>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
}
