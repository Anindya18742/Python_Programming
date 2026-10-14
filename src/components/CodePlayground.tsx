import React, { useState, useEffect } from 'react';
import { runPythonSimulation, ExecutionResult } from '../utils/pythonInterpreter';
import { Play, RotateCcw, Copy, Check, Terminal, Database, Code } from 'lucide-react';

interface CodePlaygroundProps {
  initialCode?: string;
}

const PLAYGROUND_PRESETS = [
  {
    id: 'cart',
    name: '1. Shopping Cart (List)',
    code: `# Real-World Case: E-Commerce Shopping Cart
cart = ["Mechanical Keyboard", "USB-C Cable", "Ergonomic Mousepad"]
print("Initial Cart:", cart)

# Customer adds new item
cart.append("Noise Cancelling Headphones")
print("After adding item:", cart)

# Customer removes USB-C Cable
cart.remove("USB-C Cable")
print("After removing item:", cart)

# Customer saves last item for later
saved_for_later = cart.pop()
print(f"Saved for later: '{saved_for_later}'")
print("Active cart for checkout:", cart)

# Sort for receipt printout
cart.sort()
print("Sorted receipt items:", cart)`
  },
  {
    id: 'grades',
    name: "2. Student's Grades (List)",
    code: `# Real-World Case: Student Gradebook
grades = [88.5, 92.0, 74.5, 96.0, 85.0]
print("Mid-semester grades:", grades)

# Final exam entered
grades.append(94.0)

# Academic policy: drop lowest test score
lowest = min(grades)
grades.remove(lowest)
print(f"Dropped lowest grade ({lowest}), remaining:", grades)

# Compute GPA average
average = sum(grades) / len(grades)
print(f"Calculated Semester Average: {average:.2f}%")

# List comprehension: honors scores (>= 90%)
honors = [score for score in grades if score >= 90.0]
print("Honors-level submissions:", honors)`
  },
  {
    id: 'geo',
    name: '3. GPS Coordinates (Tuple)',
    code: `# Real-World Case: Geographical Waypoints (Immutable)
golden_gate = (37.8199, -122.4783, 67.1)
lat, lon, alt = golden_gate
print(f"Golden Gate GPS: {lat}° N, {lon}° W, Elevation: {alt}m")

# Test immutability defense
print("\\nTesting invariant guard:")
try:
    golden_gate[0] = 0.0
except TypeError as err:
    print("Security Exception Caught:", err)

# Spatial dictionary lookup using coordinate tuples as keys
spatial_cache = {
    (37.8199, -122.4783): "Golden Gate Bridge, SF",
    (35.6586, 139.7454): "Tokyo Tower, Japan",
    (27.9881, 86.9250): "Mount Everest, Nepal"
}
target = (35.6586, 139.7454)
print(f"Lookup at {target}:", spatial_cache[target])`
  },
  {
    id: 'colors',
    name: '4. RGB Colors (Tuple)',
    code: `# Real-World Case: Design System RGB Palette
COLOR_WHITE   = (255, 255, 255)
COLOR_EMERALD = (16, 185, 129)
COLOR_CRIMSON = (220, 20, 60)

# Unpacking channels
r, g, b = COLOR_EMERALD
luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
print(f"Emerald Color: ({r}, {g}, {b}) | Luminance: {luminance:.1f}")

# Color lookup dictionary (Tuples as hash keys)
palette = {
    COLOR_WHITE: "Pure White",
    COLOR_EMERALD: "Emerald Green",
    COLOR_CRIMSON: "Crimson Red"
}
print("Palette name for (16, 185, 129):", palette[COLOR_EMERALD])`
  },
  {
    id: 'slicing',
    name: '5. Slicing Explorer',
    code: `numbers = [10, 20, 30, 40, 50, 60, 70, 80]

print("Original list:", numbers)
print("First 3 items ([:3]):", numbers[:3])
print("From index 3 to end ([3:]):", numbers[3:])
print("Slice index 2 to 6 ([2:6]):", numbers[2:6])
print("Every second element ([::2]):", numbers[::2])
print("Reversed sequence ([::-1]):", numbers[::-1])`
  },
  {
    id: 'unpacking',
    name: '6. Unpacking & Swapping',
    code: `# Unpacking coordinates
point = (10, 20)
x, y = point
print(f"Unpacked: x={x}, y={y}")

# Pythonic variable swap
a = 100
b = 200
a, b = b, a
print(f"Swapped in-place: a={a}, b={b}")

# Singleton tuple comma rule test
single_not_tuple = (42)
single_is_tuple = (42,)
print("Type of (42):", type(single_not_tuple))
print("Type of (42,):", type(single_is_tuple))`
  }
];

export const CodePlayground: React.FC<CodePlaygroundProps> = ({ initialCode }) => {
  const [code, setCode] = useState<string>(initialCode || PLAYGROUND_PRESETS[0].code);
  const [activeTab, setActiveTab] = useState<'console' | 'variables'>('console');
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [copied, setCopied] = useState(false);

  // Sync initialCode if changed from parent
  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
      const res = runPythonSimulation(initialCode);
      setResult(res);
    }
  }, [initialCode]);

  // Initial execution on mount
  useEffect(() => {
    if (!result) {
      const res = runPythonSimulation(code);
      setResult(res);
    }
  }, []);

  const handleRun = () => {
    const res = runPythonSimulation(code);
    setResult(res);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectPreset = (presetCode: string) => {
    setCode(presetCode);
    const res = runPythonSimulation(presetCode);
    setResult(res);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-sky-400 font-medium">
          <span>Executable Sandbox</span>
          <span aria-hidden="true">·</span>
          <span>Client-Side Python Engine</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
          Interactive Python Code Sandbox
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Write and execute live Python list and tuple code. Inspect stdout output, execution times, authentic exception tracebacks (such as <code className="text-sky-300 font-mono">TypeError</code> on tuple mutation), and the active in-memory variable table.
        </p>
      </div>

      {/* Preset Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900/60 border border-slate-800 rounded-lg">
        <span className="text-xs text-slate-400 px-3 font-medium">Load Preset:</span>
        {PLAYGROUND_PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => handleSelectPreset(preset.code)}
            className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors whitespace-nowrap"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* 2-Pane Editor & Output Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Pane: Code Editor (Cols 1-7) */}
        <div className="lg:col-span-7 flex flex-col bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          {/* Editor Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <Code className="w-4 h-4 text-sky-400" />
              <span>script.py</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleRun}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-md transition-colors shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Code</span>
              </button>
            </div>
          </div>

          {/* Text Area Code Editor */}
          <div className="relative flex-1 min-h-[380px] p-4 bg-slate-950 font-mono text-xs sm:text-sm">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="w-full h-full min-h-[360px] bg-transparent text-slate-100 resize-none focus:outline-hidden leading-relaxed font-mono selection:bg-sky-500/30"
              placeholder="# Write Python list or tuple code here..."
            />
          </div>

          {/* Editor Footer */}
          <div className="px-4 py-2 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Press &apos;Run Code&apos; to execute in sandboxed runtime</span>
            <span>Lines: {code.split('\n').length}</span>
          </div>
        </div>

        {/* Right Pane: Terminal Output & Variable Inspector (Cols 8-12) */}
        <div className="lg:col-span-5 flex flex-col bg-slate-900/70 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          {/* Output Header Tabs */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('console')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  activeTab === 'console'
                    ? 'bg-slate-800 text-sky-400 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Console Terminal</span>
              </button>

              <button
                onClick={() => setActiveTab('variables')}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  activeTab === 'variables'
                    ? 'bg-slate-800 text-sky-400 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Scope Variables</span>
              </button>
            </div>

            {result && (
              <span className="text-[11px] font-mono text-slate-500">
                {result.executionTimeMs}ms
              </span>
            )}
          </div>

          {/* TAB 1: CONSOLE STDOUT */}
          {activeTab === 'console' && (
            <div className="flex-1 min-h-[380px] p-4 bg-slate-950 font-mono text-xs overflow-y-auto space-y-2">
              <div className="text-slate-600 pb-2 border-b border-slate-900 flex items-center justify-between">
                <span>Python 3.10.12 Simulated REPL</span>
                <span className="text-emerald-500 font-bold">READY</span>
              </div>

              {result?.stdout && result.stdout.length > 0 ? (
                result.stdout.map((line, idx) => {
                  const isError = line.startsWith('Traceback') || line.includes('Error:');
                  return (
                    <div
                      key={idx}
                      className={`leading-relaxed whitespace-pre-wrap ${
                        isError ? 'text-rose-400 font-semibold' : 'text-slate-200'
                      }`}
                    >
                      {line}
                    </div>
                  );
                })
              ) : (
                <div className="text-slate-600 italic py-8 text-center">
                  No standard output generated. Use print(...) to display results.
                </div>
              )}
            </div>
          )}

          {/* TAB 2: VARIABLE SCOPE INSPECTOR */}
          {activeTab === 'variables' && (
            <div className="flex-1 min-h-[380px] p-4 bg-slate-950 font-mono text-xs overflow-y-auto">
              {result && Object.keys(result.variables).length > 0 ? (
                <div className="space-y-3">
                  <div className="text-slate-500 text-[11px] uppercase tracking-wider pb-1 border-b border-slate-800">
                    Active Identifiers in Global Scope
                  </div>
                  <div className="space-y-2">
                    {Object.values(result.variables).map((v) => (
                      <div
                        key={v.name}
                        className="p-3 bg-slate-900 rounded-lg border border-slate-800/80 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-100">{v.name}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                              v.type === 'list'
                                ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                                : v.type === 'tuple'
                                ? 'bg-sky-950/60 text-sky-300 border border-sky-800/60'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {v.type} {v.isMutable ? '· Mutable' : '· Immutable'}
                          </span>
                        </div>
                        <div className="text-slate-400 text-[11px] truncate">
                          Value: <span className="text-slate-200">{v.value}</span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/50">
                          <span>Length: {v.length !== undefined ? v.length : 'N/A'}</span>
                          <span>Heap Ref: {v.memoryId}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-slate-600 italic py-8 text-center">
                  No variables currently declared in global scope.
                </div>
              )}
            </div>
          )}

          {/* Output Footer */}
          <div className="px-4 py-2 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>Status: {result?.error ? 'Runtime Error' : 'Success'}</span>
            <button
              onClick={() => setResult({ stdout: [], variables: {}, executionTimeMs: 0 })}
              className="text-slate-400 hover:text-slate-200 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
