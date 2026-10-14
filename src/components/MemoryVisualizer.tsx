import React, { useState } from 'react';
import { Layers, ShieldAlert, Cpu, Check, AlertCircle } from 'lucide-react';

export const MemoryVisualizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lists-vs-tuples' | 'nested-paradox' | 'shallow-deep'>('lists-vs-tuples');

  // List memory state
  const [listItems, setListItems] = useState<string[]>(['Apple', 'Banana', 'Cherry']);
  const [tupleItems] = useState<string[]>(['Latitude', 'Longitude', 'Altitude']);

  // Nested paradox state
  const [innerGrades, setInnerGrades] = useState<number[]>([90, 85, 95]);
  const [paradoxError, setParadoxError] = useState<string | null>(null);

  // Shallow vs deep copy state
  const [origNested, setOrigNested] = useState<number[]>([1, 2]);
  const [shallowTarget, setShallowTarget] = useState<string>('Original shares reference');

  // Interactive list append
  const handleAddToList = () => {
    if (listItems.length >= 7) return;
    setListItems([...listItems, `Item #${listItems.length + 1}`]);
  };

  const handlePopFromList = () => {
    if (listItems.length <= 1) return;
    setListItems(listItems.slice(0, -1));
  };

  // Trigger tuple mutation error
  const [tupleError, setTupleError] = useState<boolean>(false);
  const handleTryMutateTuple = () => {
    setTupleError(true);
    setTimeout(() => setTupleError(false), 3000);
  };

  // Nested paradox handlers
  const handleAppendToInnerList = () => {
    if (innerGrades.length >= 6) return;
    setInnerGrades([...innerGrades, Math.floor(Math.random() * 15) + 85]);
    setParadoxError(null);
  };

  const handleReassignTupleSlot = () => {
    setParadoxError("TypeError: 'tuple' object does not support item assignment (cannot replace student_record[2])");
    setTimeout(() => setParadoxError(null), 4000);
  };

  // CPython memory math simulation
  // Empty list = 56 bytes, each element = 8 byte pointer + over-allocation buffer
  const listLen = listItems.length;
  const listAllocated = listLen === 0 ? 0 : Math.ceil(listLen * 1.125) + 3;
  const listBytes = 56 + listAllocated * 8;

  // Empty tuple = 40 bytes, exact 8 bytes per item
  const tupleLen = tupleItems.length;
  const tupleBytes = 40 + tupleLen * 8;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-sky-400 font-medium">
          <span>CPython Internals</span>
          <span aria-hidden="true">·</span>
          <span>Heap Allocation & Pointer Architecture</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
          Memory Model & Allocation Architecture
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Both Python lists and tuples are arrays of pointer references to objects on the heap. Inspect the architectural difference: lists maintain over-allocated buffer slots for dynamic growth, while tuples allocate exact fixed blocks with zero memory waste.
        </p>
      </div>

      {/* Model Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900/60 border border-slate-800 rounded-lg">
        <button
          onClick={() => setActiveTab('lists-vs-tuples')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'lists-vs-tuples'
              ? 'bg-sky-500 text-slate-950 shadow-xs'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          Dynamic Buffer vs Exact Tuple
        </button>
        <button
          onClick={() => setActiveTab('nested-paradox')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'nested-paradox'
              ? 'bg-sky-500 text-slate-950 shadow-xs'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          The Nested Mutability Paradox
        </button>
        <button
          onClick={() => setActiveTab('shallow-deep')}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeTab === 'shallow-deep'
              ? 'bg-sky-500 text-slate-950 shadow-xs'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          Shallow vs Deep Copy
        </button>
      </div>

      {/* TAB 1: DYNAMIC BUFFER VS EXACT TUPLE */}
      {activeTab === 'lists-vs-tuples' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* List Memory Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-5 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-amber-400 font-semibold">
                  Dynamic Array (PyListObject)
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Python List Memory Layout
                </h3>
              </div>
              <div className="text-right font-mono text-xs">
                <span className="text-slate-400 block">sys.getsizeof()</span>
                <span className="text-amber-400 font-bold text-sm">{listBytes} bytes</span>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">ob_size (Len)</span>
                <span className="text-slate-200 font-bold">{listLen} items</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">allocated (Slots)</span>
                <span className="text-amber-400 font-bold">{listAllocated} slots</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Unused Headroom</span>
                <span className="text-emerald-400 font-bold">{listAllocated - listLen} slots</span>
              </div>
            </div>

            {/* Interactive Array Slots */}
            <div className="space-y-2">
              <span className="text-xs text-slate-400 font-mono">
                Contiguous Pointer Array in Memory (ob_item)
              </span>
              <div className="flex flex-wrap gap-2 p-3 bg-slate-950 rounded-lg border border-slate-800">
                {Array.from({ length: listAllocated }).map((_, idx) => {
                  const hasItem = idx < listLen;
                  return (
                    <div
                      key={idx}
                      className={`h-16 w-16 rounded-md border flex flex-col items-center justify-center text-center p-1 font-mono transition-all ${
                        hasItem
                          ? 'bg-amber-950/40 border-amber-600/70 text-amber-300'
                          : 'bg-slate-900/40 border-dashed border-slate-700/80 text-slate-600'
                      }`}
                    >
                      <span className="text-[10px] text-slate-500">[{idx}]</span>
                      <span className="text-xs font-semibold truncate w-full">
                        {hasItem ? listItems[idx] : 'NULL'}
                      </span>
                      <span className="text-[9px] text-slate-500">
                        {hasItem ? 'ptr ->' : 'empty'}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-slate-500">
                Dashed slots represent CPython over-allocation buffer, enabling <span className="font-mono text-slate-400">O(1)</span> amortized appends.
              </p>
            </div>

            {/* List Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleAddToList}
                disabled={listItems.length >= 7}
                className="flex-1 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 rounded-lg transition-colors"
              >
                + list.append() (Use buffer slot)
              </button>
              <button
                onClick={handlePopFromList}
                disabled={listItems.length <= 1}
                className="flex-1 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg transition-colors border border-slate-700"
              >
                - list.pop() (Shrink size)
              </button>
            </div>
          </div>

          {/* Tuple Memory Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-5 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-sky-400 font-semibold">
                  Fixed Block (PyTupleObject)
                </span>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  Python Tuple Memory Layout
                </h3>
              </div>
              <div className="text-right font-mono text-xs">
                <span className="text-slate-400 block">sys.getsizeof()</span>
                <span className="text-sky-400 font-bold text-sm">{tupleBytes} bytes</span>
              </div>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">ob_size (Len)</span>
                <span className="text-slate-200 font-bold">{tupleLen} items</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">allocated (Slots)</span>
                <span className="text-sky-400 font-bold">{tupleLen} slots (Exact)</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Buffer Waste</span>
                <span className="text-emerald-400 font-bold">0 bytes (0%)</span>
              </div>
            </div>

            {/* Interactive Array Slots */}
            <div className="space-y-2">
              <span className="text-xs text-slate-400 font-mono">
                Exact Contiguous Pointer Slots (Locked Invariant)
              </span>
              <div className="flex flex-wrap gap-2 p-3 bg-slate-950 rounded-lg border border-slate-800">
                {tupleItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="h-16 w-16 rounded-md border bg-sky-950/40 border-sky-600/70 text-sky-300 flex flex-col items-center justify-center text-center p-1 font-mono"
                  >
                    <span className="text-[10px] text-slate-500">[{idx}]</span>
                    <span className="text-xs font-semibold truncate w-full">{item}</span>
                    <span className="text-[9px] text-sky-400">locked</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500">
                Tuples allocate zero over-allocation buffer. Memory layout is immutable and finalized at creation time.
              </p>
            </div>

            {/* Tuple Mutation Attempt Button */}
            <div className="space-y-2">
              <button
                onClick={handleTryMutateTuple}
                className="w-full py-2 text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-lg transition-colors"
              >
                Attempt In-Place Mutation: tuple[0] = &quot;New Val&quot;
              </button>

              {tupleError && (
                <div className="p-3 bg-rose-950/50 border border-rose-800 rounded-lg text-xs font-mono text-rose-300 flex items-start gap-2 animate-shake">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <div>
                    <span className="font-bold block">TypeError Raised:</span>
                    &apos;tuple&apos; object does not support item assignment
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: NESTED MUTABILITY PARADOX */}
      {activeTab === 'nested-paradox' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-semibold">
              <Cpu className="w-4 h-4" />
              <span>Classic Python Technical Interview Question</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              Can a Tuple Be Mutated? The Reference vs Object Dilemma
            </h3>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
              Consider a student record tuple: <code className="text-sky-300 font-mono">student = (101, &apos;Alice&apos;, [90, 85, 95])</code>. The tuple references are strictly immutable (index 2 cannot point to a different object). However, the object at index 2 is a mutable List living on the heap. Mutating that list changes the record&apos;s visible contents while preserving pointer integrity!
            </p>
          </div>

          {/* Interactive Visual Heap Diagram */}
          <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Slot 0: Int */}
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-[11px] font-mono text-slate-500 block">student[0] (int)</span>
                <span className="text-base font-bold font-mono text-slate-200">101</span>
                <span className="text-[10px] text-slate-500 block mt-1">Address: 0x7FA10</span>
              </div>

              {/* Slot 1: String */}
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-[11px] font-mono text-slate-500 block">student[1] (str)</span>
                <span className="text-base font-bold font-mono text-slate-200">&apos;Alice&apos;</span>
                <span className="text-[10px] text-slate-500 block mt-1">Address: 0x7FA28</span>
              </div>

              {/* Slot 2: Pointer to List */}
              <div className="p-3 bg-amber-950/30 rounded-lg border border-amber-800/60">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-amber-400 block">student[2] (list pointer)</span>
                  <span className="text-[10px] text-amber-500 font-mono">Pointer: 0x7FB80</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {innerGrades.map((g, i) => (
                    <span key={i} className="px-2 py-0.5 bg-amber-900/60 text-amber-200 font-mono text-xs rounded">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Test Action Controls */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleAppendToInnerList}
                className="px-4 py-2 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg transition-colors"
              >
                Execute: student[2].append(98)
              </button>

              <button
                onClick={handleReassignTupleSlot}
                className="px-4 py-2 text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-lg transition-colors"
              >
                Attempt: student[2] = [100, 100]
              </button>
            </div>

            {paradoxError && (
              <div className="p-3 bg-rose-950/50 border border-rose-800 rounded-lg text-xs font-mono text-rose-300 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{paradoxError}</span>
              </div>
            )}

            <div className="p-3.5 bg-slate-900/80 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1">
              <div className="font-semibold text-sky-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Interview Verdict & Explanation:</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                The tuple pointer at index 2 still points to memory address <code className="text-amber-300 font-mono">0x7FB80</code>. Reassigning the pointer is forbidden. But the heap object at <code className="text-amber-300 font-mono">0x7FB80</code> is a mutable list, so in-place operations like <code className="text-amber-300 font-mono">.append()</code> succeed without violating tuple constraints.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SHALLOW VS DEEP COPY */}
      {activeTab === 'shallow-deep' && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-mono font-semibold">
              <Layers className="w-4 h-4" />
              <span>Copying Semantics</span>
            </div>
            <h3 className="text-xl font-bold text-white mt-1">
              Defensive Copying: Shallow Copy vs. copy.deepcopy()
            </h3>
            <p className="text-slate-400 text-sm mt-1 max-w-3xl leading-relaxed">
              When copying sequences with nested objects, a shallow copy (<code className="text-sky-300 font-mono">list.copy()</code> or <code className="text-sky-300 font-mono">seq[:]</code>) creates a new outer array, but duplicates the memory pointers to inner elements. A deep copy recursively duplicates every nested object.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shallow copy explanation */}
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3">
              <span className="text-xs font-mono font-semibold text-amber-400 uppercase">
                Shallow Copy: list.copy() or seq[:]
              </span>
              <pre className="p-3 bg-slate-900 rounded font-mono text-xs text-slate-300 overflow-x-auto">
{`orig = [1, [20, 30]]
shallow = orig.copy()

# Mutating nested list affects BOTH!
shallow[1].append(40)
print(orig)  # [1, [20, 30, 40]]`}
              </pre>
              <p className="text-xs text-slate-400">
                ⚠️ Danger in production: modifying nested elements in a shallow copy silently mutates the original dataset.
              </p>
            </div>

            {/* Deep copy explanation */}
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3">
              <span className="text-xs font-mono font-semibold text-emerald-400 uppercase">
                Deep Copy: import copy; copy.deepcopy()
              </span>
              <pre className="p-3 bg-slate-900 rounded font-mono text-xs text-slate-300 overflow-x-auto">
{`import copy

orig = [1, [20, 30]]
deep = copy.deepcopy(orig)

# Completely isolated in memory
deep[1].append(40)
print(orig)  # [1, [20, 30]] (Unchanged!)`}
              </pre>
              <p className="text-xs text-slate-400">
                ✅ Safe for production pipelines: creates completely distinct memory allocations recursively.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
