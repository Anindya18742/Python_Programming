import React, { useState, useMemo } from 'react';
import { Play, Copy, Check, RotateCcw, ArrowRight } from 'lucide-react';

interface SlicingVisualizerProps {
  onLoadInPlayground: (code: string) => void;
}

const PRESET_SEQUENCES = [
  {
    id: 'numbers-list',
    name: 'Numbers List [10..80]',
    type: 'list' as const,
    items: [10, 20, 30, 40, 50, 60, 70, 80],
    varName: 'numbers'
  },
  {
    id: 'weekdays-tuple',
    name: 'Days of Week Tuple',
    type: 'tuple' as const,
    items: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    varName: 'days'
  },
  {
    id: 'grades-list',
    name: 'Student Grades List',
    type: 'list' as const,
    items: [75, 82, 88, 91, 94, 98],
    varName: 'grades'
  },
  {
    id: 'coords-tuple',
    name: 'Coordinates Waypoints Tuple',
    type: 'tuple' as const,
    items: ['Origin', 'Waypoint A', 'Waypoint B', 'Summit', 'Basecamp'],
    varName: 'waypoints'
  }
];

export const SlicingVisualizer: React.FC<SlicingVisualizerProps> = ({ onLoadInPlayground }) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('numbers-list');
  const [start, setStart] = useState<number>(1);
  const [stop, setStop] = useState<number>(6);
  const [step, setStep] = useState<number>(2);
  const [copied, setCopied] = useState(false);

  const activePreset = PRESET_SEQUENCES.find((p) => p.id === selectedPresetId) || PRESET_SEQUENCES[0];
  const items = activePreset.items;
  const length = items.length;

  // Calculate slice items and selected indices
  const { slicedItems, selectedIndices } = useMemo(() => {
    const indices: number[] = [];
    const results: any[] = [];

    if (step > 0) {
      let actualStart = start < 0 ? Math.max(0, length + start) : start;
      let actualStop = stop < 0 ? Math.max(0, length + stop) : stop;
      actualStop = Math.min(length, actualStop);

      for (let i = actualStart; i < actualStop; i += step) {
        if (i >= 0 && i < length) {
          indices.push(i);
          results.push(items[i]);
        }
      }
    } else if (step < 0) {
      // Backward traversal
      let actualStart = start < 0 ? length + start : start;
      let actualStop = stop < 0 ? length + stop : stop;
      if (start >= length) actualStart = length - 1;

      for (let i = actualStart; i > actualStop; i += step) {
        if (i >= 0 && i < length) {
          indices.push(i);
          results.push(items[i]);
        }
      }
    }

    return { slicedItems: results, selectedIndices: indices };
  }, [items, length, start, stop, step]);

  const sliceExpression = `${activePreset.varName}[${start}:${stop}:${step}]`;
  const pythonCode = `# Python Slicing on ${activePreset.type === 'list' ? 'List' : 'Tuple'}
${activePreset.varName} = ${activePreset.type === 'list' ? JSON.stringify(items) : `(${items.map(x => typeof x === 'string' ? `'${x}'` : x).join(', ')})`}

# Slice extraction with [start:stop:step]
result = ${sliceExpression}
print("Original:", ${activePreset.varName})
print("Sliced result:", result)
print("Length of slice:", len(result))`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sliceExpression);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setStart(0);
    setStop(length);
    setStep(1);
  };

  const handleReversePreset = () => {
    setStart(length - 1);
    setStop(-1);
    setStep(-1);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-sky-400 font-medium">
          <span>Interactive Tool</span>
          <span aria-hidden="true">·</span>
          <span>Zero-Cost Subsequence Extraction</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
          Python Slice Syntax Explorer: <code className="text-sky-400 font-mono">[start:stop:step]</code>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Slicing works identically on both Lists and Tuples. Slices extract a new sequence without modifying the original. Notice how the <span className="text-slate-200 font-semibold">stop index is exclusive</span> (half-open interval <code className="text-sky-300 font-mono">[start, stop)</code>) and negative steps traverse backwards.
        </p>
      </div>

      {/* Preset Selector */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900/60 border border-slate-800 rounded-lg">
        <span className="text-xs text-slate-400 px-3 font-medium">Choose Sequence:</span>
        {PRESET_SEQUENCES.map((preset) => (
          <button
            key={preset.id}
            onClick={() => {
              setSelectedPresetId(preset.id);
              setStart(0);
              setStop(preset.items.length);
              setStep(1);
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              selectedPresetId === preset.id
                ? 'bg-sky-500 text-slate-950 font-semibold shadow-xs'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {preset.name} ({preset.type === 'list' ? 'List [ ]' : 'Tuple ( )'})
          </button>
        ))}
      </div>

      {/* Interactive Visualizer Canvas */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl">
        {/* Memory Cells Visual representation */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold uppercase tracking-wider">
              Sequence Array Indexing Map
            </span>
            <span className="font-mono text-slate-500">
              Total Length: {length} elements
            </span>
          </div>

          {/* Element cells with positive & negative indices */}
          <div className="overflow-x-auto pb-2">
            <div className="inline-flex gap-2 min-w-full justify-start md:justify-center p-2 bg-slate-950/80 rounded-lg border border-slate-800">
              {items.map((item, idx) => {
                const isSelected = selectedIndices.includes(idx);
                const orderInSlice = selectedIndices.indexOf(idx);
                const negIdx = idx - length;

                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5">
                    {/* Positive index */}
                    <span className="text-[11px] font-mono font-medium text-slate-400">
                      +{idx}
                    </span>

                    {/* Value Card */}
                    <div
                      className={`w-14 sm:w-16 h-14 sm:h-16 rounded-lg border flex flex-col items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-sky-950/60 border-sky-400 text-sky-200 shadow-lg shadow-sky-950/50 scale-105 ring-1 ring-sky-400/50'
                          : 'bg-slate-900/80 border-slate-800 text-slate-400 opacity-60'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-bold font-mono truncate px-1">
                        {String(item)}
                      </span>
                      {isSelected && (
                        <span className="text-[9px] font-mono text-sky-400">
                          #{orderInSlice}
                        </span>
                      )}
                    </div>

                    {/* Negative index */}
                    <span className="text-[11px] font-mono font-medium text-amber-500/80">
                      {negIdx}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 px-2 font-mono">
            <span>Top row: Positive Index (0 to {length - 1})</span>
            <span>Bottom row: Negative Index (-{length} to -1)</span>
          </div>
        </div>

        {/* Sliders Control Deck */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-5 bg-slate-950 rounded-lg border border-slate-800">
          {/* Start Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300 font-semibold">Start Index:</span>
              <span className="text-sky-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {start}
              </span>
            </div>
            <input
              type="range"
              min={-length}
              max={length}
              value={start}
              onChange={(e) => setStart(parseInt(e.target.value, 10))}
              className="w-full accent-sky-400 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>-{length}</span>
              <span>Default: 0</span>
              <span>{length}</span>
            </div>
          </div>

          {/* Stop Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300 font-semibold">Stop Index (Exclusive):</span>
              <span className="text-sky-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {stop}
              </span>
            </div>
            <input
              type="range"
              min={-length - 1}
              max={length}
              value={stop}
              onChange={(e) => setStop(parseInt(e.target.value, 10))}
              className="w-full accent-sky-400 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>-1</span>
              <span>Default: {length}</span>
              <span>{length}</span>
            </div>
          </div>

          {/* Step Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-mono">
              <span className="text-slate-300 font-semibold">Step Stride:</span>
              <span className="text-amber-400 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {step}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setStep(step === -1 ? 1 : -1)}
                className="px-2 py-1 text-xs font-mono bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-700 whitespace-nowrap"
              >
                {step < 0 ? 'Reverse ◀' : 'Forward ▶'}
              </button>
              <input
                type="range"
                min={-3}
                max={4}
                value={step === 0 ? 1 : step}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setStep(val === 0 ? 1 : val);
                }}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>-3 (Reverse)</span>
              <span>+1 (Normal)</span>
              <span>+4 (Skip)</span>
            </div>
          </div>
        </div>

        {/* Quick Slice Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400">Quick Slices:</span>
          <button
            onClick={() => {
              setStart(0);
              setStop(3);
              setStep(1);
            }}
            className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-mono"
          >
            [:3] First 3
          </button>
          <button
            onClick={() => {
              setStart(3);
              setStop(length);
              setStep(1);
            }}
            className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-mono"
          >
            [3:] From 3 to End
          </button>
          <button
            onClick={() => {
              setStart(0);
              setStop(length);
              setStep(2);
            }}
            className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-mono"
          >
            [::2] Every Other
          </button>
          <button
            onClick={handleReversePreset}
            className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-mono"
          >
            [::-1] Reverse
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 rounded ml-auto"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>

        {/* Live Output & Action Zone */}
        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <span className="text-xs text-slate-400 block">Evaluated Slice Expression:</span>
              <code className="text-lg font-mono font-bold text-sky-400">
                {sliceExpression}
              </code>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-md transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
              <button
                onClick={() => onLoadInPlayground(pythonCode)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-md transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run in Sandbox</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-400">
              <span>Result Output</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
            <div className="p-2.5 bg-slate-900 rounded-md border border-slate-800/80 text-emerald-400 font-semibold flex-1 overflow-x-auto">
              {activePreset.type === 'list' ? (
                <span>[{slicedItems.map(x => typeof x === 'string' ? `'${x}'` : x).join(', ')}]</span>
              ) : (
                <span>({slicedItems.map(x => typeof x === 'string' ? `'${x}'` : x).join(', ')}{slicedItems.length === 1 ? ',' : ''})</span>
              )}
            </div>
            <span className="text-slate-500 whitespace-nowrap">
              ({slicedItems.length} items extracted)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
