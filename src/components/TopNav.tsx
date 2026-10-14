import React from 'react';
import { BookOpen, Download } from 'lucide-react';

interface TopNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenExport: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ activeTab, setActiveTab, onOpenExport }) => {
  const navItems = [
    { id: 'curriculum', label: 'Curriculum' },
    { id: 'real-world', label: 'Real-World Cases' },
    { id: 'slicing', label: 'Slice Explorer' },
    { id: 'memory', label: 'Memory Models' },
    { id: 'comparison', label: 'Matrix' },
    { id: 'sandbox', label: 'Code Sandbox' },
    { id: 'quiz', label: 'Knowledge Quiz' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="text-base font-bold tracking-tight text-white whitespace-nowrap">
            PySeq <span className="text-sky-400 font-semibold">Masterclass</span>
          </span>
        </div>

        {/* Zone 2: Navigation Links (Single line, text with active state) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 text-xs xl:text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-white bg-slate-800/80 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenExport}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-md transition-colors whitespace-nowrap shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export .py Plan</span>
          </button>
        </div>
      </div>

      {/* Mobile nav scrollbar */}
      <div className="lg:hidden flex overflow-x-auto px-4 py-2 border-t border-slate-800/60 gap-1 scrollbar-none bg-slate-950">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap ${
              activeTab === item.id
                ? 'bg-slate-800 text-sky-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
