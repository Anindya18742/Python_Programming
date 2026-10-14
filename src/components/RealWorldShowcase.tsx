import React, { useState } from 'react';
import { REAL_WORLD_EXAMPLES } from '../data/lessonPlanData';
import { ShoppingCart, GraduationCap, MapPin, Palette, Play, Copy, Check, ShieldCheck, AlertTriangle } from 'lucide-react';

interface RealWorldShowcaseProps {
  onLoadInPlayground: (code: string) => void;
}

export const RealWorldShowcase: React.FC<RealWorldShowcaseProps> = ({ onLoadInPlayground }) => {
  const [activeCaseId, setActiveCaseId] = useState<string>('case-shopping-cart');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Live state for interactive widgets
  // 1. Shopping Cart State
  const [cartItems, setCartItems] = useState<string[]>([
    'Mechanical Keyboard',
    'USB-C Cable',
    'Ergonomic Mousepad'
  ]);
  const [newItemInput, setNewItemInput] = useState<string>('');

  // 2. Grades State
  const [gradeItems, setGradeItems] = useState<number[]>([88.5, 92.0, 74.5, 96.0, 85.0]);
  const [newGradeInput, setNewGradeInput] = useState<string>('');

  // 3. Geo State
  const [geoMutationError, setGeoMutationError] = useState<string | null>(null);
  const [activeLandmark, setActiveLandmark] = useState<{
    name: string;
    coords: [number, number, number];
  }>({
    name: 'Golden Gate Bridge, SF',
    coords: [37.8199, -122.4783, 67.1]
  });

  // 4. Color State
  const [rgbValues, setRgbValues] = useState<[number, number, number]>([16, 185, 129]);

  const activeCase = REAL_WORLD_EXAMPLES.find((c) => c.id === activeCaseId) || REAL_WORLD_EXAMPLES[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Cart operations
  const handleAddToCart = () => {
    if (!newItemInput.trim()) return;
    setCartItems([...cartItems, newItemInput.trim()]);
    setNewItemInput('');
  };

  const handleRemoveFromCart = (index: number) => {
    const updated = [...cartItems];
    updated.splice(index, 1);
    setCartItems(updated);
  };

  const handleSortCart = () => {
    setCartItems([...cartItems].sort());
  };

  // Grade operations
  const handleAddGrade = () => {
    const val = parseFloat(newGradeInput);
    if (isNaN(val) || val < 0 || val > 100) return;
    setGradeItems([...gradeItems, val]);
    setNewGradeInput('');
  };

  const handleDropLowestGrade = () => {
    if (gradeItems.length <= 1) return;
    const lowest = Math.min(...gradeItems);
    const idx = gradeItems.indexOf(lowest);
    if (idx !== -1) {
      const updated = [...gradeItems];
      updated.splice(idx, 1);
      setGradeItems(updated);
    }
  };

  const handleCurveGrades = () => {
    setGradeItems(gradeItems.map((g) => Math.min(100, Math.round((g + 5) * 10) / 10)));
  };

  // Geo mutation attempt
  const triggerGeoMutation = () => {
    setGeoMutationError("TypeError: 'tuple' object does not support item assignment at index 0");
    setTimeout(() => setGeoMutationError(null), 4000);
  };

  // Calculate live values
  const gradeAverage = gradeItems.length
    ? (gradeItems.reduce((a, b) => a + b, 0) / gradeItems.length).toFixed(1)
    : '0';

  const [r, g, b] = rgbValues;
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b).toFixed(1);
  const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-sky-400 font-medium">
          <span>Production Architecture</span>
          <span aria-hidden="true">·</span>
          <span>Contextual Data Structures</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
          Real-World Applications: Lists vs. Tuples
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Choosing between a list and a tuple is not an arbitrary syntax preference—it is a critical architectural decision. Examine how dynamic requirements (Shopping Carts, Gradebooks) mandate mutable Lists, while invariant specifications (GPS coordinates, RGB color channels) demand immutable Tuples.
        </p>
      </div>

      {/* Case Study Selector Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {REAL_WORLD_EXAMPLES.map((example) => {
          const isActive = activeCaseId === example.id;
          const isList = example.category === 'list';
          return (
            <button
              key={example.id}
              onClick={() => setActiveCaseId(example.id)}
              className={`p-3.5 rounded-lg border text-left transition-all ${
                isActive
                  ? 'border-sky-500 bg-slate-900 shadow-md ring-1 ring-sky-500/30'
                  : 'border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-[11px] font-mono font-semibold uppercase tracking-wider ${
                    isList ? 'text-amber-400' : 'text-sky-400'
                  }`}
                >
                  {isList ? 'List [ ]' : 'Tuple ( )'}
                </span>
                <span className="text-xs text-slate-500">
                  {example.category === 'list' ? 'Mutable' : 'Immutable'}
                </span>
              </div>
              <div className="font-semibold text-sm text-slate-100 flex items-center gap-2">
                {example.id === 'case-shopping-cart' && <ShoppingCart className="w-4 h-4 text-amber-400 shrink-0" />}
                {example.id === 'case-student-grades' && <GraduationCap className="w-4 h-4 text-amber-400 shrink-0" />}
                {example.id === 'case-geo-coordinates' && <MapPin className="w-4 h-4 text-sky-400 shrink-0" />}
                {example.id === 'case-rgb-colors' && <Palette className="w-4 h-4 text-sky-400 shrink-0" />}
                <span className="truncate">{example.title}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Feature Card */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        {/* Top Case Context Banner */}
        <div className="p-6 border-b border-slate-800/80 bg-slate-950/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-mono text-slate-300">{activeCase.domain}</span>
                <span aria-hidden="true">·</span>
                <span className={activeCase.category === 'list' ? 'text-amber-400 font-semibold' : 'text-sky-400 font-semibold'}>
                  Structure: Python {activeCase.category === 'list' ? 'List' : 'Tuple'}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {activeCase.title}
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                {activeCase.subtitle}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onLoadInPlayground(activeCase.pythonCode)}
                className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Test in Sandbox</span>
              </button>
              <button
                onClick={() => handleCopy(activeCase.pythonCode, activeCase.id)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
              >
                {copiedId === activeCase.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 2-Zone Body: Interactive Sandbox Simulator on Left / Rationale on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          {/* Left Zone: Live Interactive Widget (Cols 1-7) */}
          <div className="lg:col-span-7 p-6 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Interactive State Simulation
              </span>
              <span className="text-xs text-slate-500 font-mono">Live In-Memory State</span>
            </div>

            {/* CASE 1: SHOPPING CART SIMULATOR */}
            {activeCase.id === 'case-shopping-cart' && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span className="font-mono">cart = [...] ({cartItems.length} items)</span>
                    <button
                      onClick={handleSortCart}
                      className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors"
                    >
                      Sort In-Place (.sort)
                    </button>
                  </div>

                  {cartItems.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-sm">
                      Your cart is empty. Add an item below!
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {cartItems.map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2.5 bg-slate-900 rounded-md border border-slate-800/80 text-sm"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-xs text-slate-500 w-5">
                              [{index}]
                            </span>
                            <span className="text-slate-200 font-medium">{item}</span>
                          </div>
                          <button
                            onClick={() => handleRemoveFromCart(index)}
                            className="text-xs text-rose-400 hover:text-rose-300 font-mono hover:underline px-2 py-0.5"
                          >
                            .pop({index})
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newItemInput}
                    onChange={(e) => setNewItemInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddToCart()}
                    placeholder="e.g. Ergonomic Keyboard, 4K Webcam..."
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-hidden focus:border-sky-500"
                  />
                  <button
                    onClick={handleAddToCart}
                    className="px-4 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors whitespace-nowrap"
                  >
                    .append(item)
                  </button>
                </div>

                <div className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 text-xs text-slate-400">
                  <span className="text-slate-300 font-semibold">Python Syntax Equivalent: </span>
                  <code className="text-amber-300 font-mono">
                    cart.append(&quot;{newItemInput || 'New Item'}&quot;)
                  </code>
                  {' · '}In-place amortized <span className="font-mono text-slate-300">O(1)</span> pointer array expansion.
                </div>
              </div>
            )}

            {/* CASE 2: STUDENT GRADEBOOK SIMULATOR */}
            {activeCase.id === 'case-student-grades' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-center">
                    <span className="text-xs text-slate-500">Class Average</span>
                    <p className="text-xl font-bold font-mono text-amber-400 mt-1">
                      {gradeAverage}%
                    </p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-center">
                    <span className="text-xs text-slate-500">Highest Score</span>
                    <p className="text-xl font-bold font-mono text-emerald-400 mt-1">
                      {gradeItems.length ? Math.max(...gradeItems) : 0}%
                    </p>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-center">
                    <span className="text-xs text-slate-500">Lowest Score</span>
                    <p className="text-xl font-bold font-mono text-rose-400 mt-1">
                      {gradeItems.length ? Math.min(...gradeItems) : 0}%
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-mono">grades = [{gradeItems.join(', ')}]</span>
                    <span className="text-slate-500">{gradeItems.length} scores</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {gradeItems.map((grade, idx) => (
                      <div
                        key={idx}
                        className={`px-3 py-1.5 rounded-md font-mono text-xs font-semibold border ${
                          grade >= 90
                            ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                            : grade >= 80
                            ? 'bg-sky-950/40 border-sky-800/60 text-sky-300'
                            : 'bg-amber-950/40 border-amber-800/60 text-amber-300'
                        }`}
                      >
                        {grade}%
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex gap-2 flex-1 min-w-[220px]">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="100"
                      value={newGradeInput}
                      onChange={(e) => setNewGradeInput(e.target.value)}
                      placeholder="Exam score (0-100)"
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-600 focus:outline-hidden focus:border-sky-500"
                    />
                    <button
                      onClick={handleAddGrade}
                      className="px-3 py-1.5 text-xs font-medium bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg transition-colors whitespace-nowrap"
                    >
                      .append(score)
                    </button>
                  </div>

                  <button
                    onClick={handleDropLowestGrade}
                    className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700"
                  >
                    Drop Lowest (.remove(min))
                  </button>

                  <button
                    onClick={handleCurveGrades}
                    className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700"
                  >
                    +5% Curve (Comprehension)
                  </button>
                </div>
              </div>
            )}

            {/* CASE 3: GEOGRAPHICAL COORDINATES SIMULATOR */}
            {activeCase.id === 'case-geo-coordinates' && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block font-mono">Target Landmark</span>
                      <span className="text-base font-semibold text-slate-100">
                        {activeLandmark.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block font-mono">Immutable Tuple</span>
                      <span className="text-xs font-mono text-sky-400">
                        ({activeLandmark.coords.join(', ')})
                      </span>
                    </div>
                  </div>

                  {/* Visual coordinate HUD */}
                  <div className="grid grid-cols-3 gap-3 p-3 bg-slate-900 rounded-lg border border-slate-800/80 font-mono text-xs">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Latitude [0]</span>
                      <span className="text-slate-200 text-sm font-semibold">{activeLandmark.coords[0]}° N</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Longitude [1]</span>
                      <span className="text-slate-200 text-sm font-semibold">{activeLandmark.coords[1]}° W</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Elevation [2]</span>
                      <span className="text-slate-200 text-sm font-semibold">{activeLandmark.coords[2]}m</span>
                    </div>
                  </div>

                  {/* Switch Landmark */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Preset Waypoints:</span>
                    <button
                      onClick={() =>
                        setActiveLandmark({
                          name: 'Golden Gate Bridge, SF',
                          coords: [37.8199, -122.4783, 67.1]
                        })
                      }
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors"
                    >
                      Golden Gate
                    </button>
                    <button
                      onClick={() =>
                        setActiveLandmark({
                          name: 'Tokyo Tower, Japan',
                          coords: [35.6586, 139.7454, 332.9]
                        })
                      }
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors"
                    >
                      Tokyo Tower
                    </button>
                    <button
                      onClick={() =>
                        setActiveLandmark({
                          name: 'Mount Everest Summit',
                          coords: [27.9881, 86.925, 8848.86]
                        })
                      }
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors"
                    >
                      Everest
                    </button>
                  </div>
                </div>

                {/* Mutation Test Button */}
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-200">
                        Test Immutability Defense
                      </h4>
                      <p className="text-xs text-slate-400">
                        Attempt to execute: <code className="text-sky-300 font-mono">golden_gate[0] = 0.0</code>
                      </p>
                    </div>
                    <button
                      onClick={triggerGeoMutation}
                      className="px-3.5 py-1.5 text-xs font-semibold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-lg transition-colors whitespace-nowrap"
                    >
                      Simulate Mutation Attempt
                    </button>
                  </div>

                  {geoMutationError && (
                    <div className="p-3 bg-rose-950/40 border border-rose-800/80 rounded-lg text-xs font-mono text-rose-300 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                      <div>
                        <span className="font-semibold block">Runtime Exception Caught:</span>
                        {geoMutationError}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CASE 4: RGB COLOR SIMULATOR */}
            {activeCase.id === 'case-rgb-colors' && (
              <div className="space-y-4">
                <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 flex flex-col sm:flex-row items-center gap-6">
                  {/* Color Swatch Box */}
                  <div
                    className="w-28 h-28 rounded-xl shadow-lg border border-white/20 shrink-0 transition-colors"
                    style={{ backgroundColor: `rgb(${r}, ${g}, ${b})` }}
                  />

                  <div className="space-y-2 flex-1 w-full text-xs">
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-slate-400">RGB Tuple:</span>
                      <span className="text-sky-400 font-bold">({r}, {g}, {b})</span>
                    </div>
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-slate-400">CSS Hex Code:</span>
                      <span className="text-slate-200 font-bold">{hexColor}</span>
                    </div>
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-slate-400">Perceived Luminance:</span>
                      <span className="text-emerald-400 font-bold">{luminance} / 255</span>
                    </div>
                    <div className="flex items-center justify-between font-mono">
                      <span className="text-slate-400">Optimal Text Color:</span>
                      <span className={Number(luminance) > 130 ? 'text-slate-950 font-bold bg-white px-2 rounded' : 'text-white font-bold bg-slate-900 px-2 rounded'}>
                        {Number(luminance) > 130 ? 'Dark Text (#000)' : 'Light Text (#FFF)'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* RGB Channel Sliders */}
                <div className="space-y-3 p-4 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-rose-400 font-semibold">Red Channel [0]:</span>
                      <span className="text-slate-300">{r}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="255"
                      value={r}
                      onChange={(e) => setRgbValues([parseInt(e.target.value), g, b])}
                      className="w-full accent-rose-500 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-emerald-400 font-semibold">Green Channel [1]:</span>
                      <span className="text-slate-300">{g}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="255"
                      value={g}
                      onChange={(e) => setRgbValues([r, parseInt(e.target.value), b])}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-sky-400 font-semibold">Blue Channel [2]:</span>
                      <span className="text-slate-300">{b}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="255"
                      value={b}
                      onChange={(e) => setRgbValues([r, g, parseInt(e.target.value)])}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                  </div>

                  <div className="flex gap-2 pt-2 text-xs">
                    <span className="text-slate-400">Palette Presets:</span>
                    <button
                      onClick={() => setRgbValues([220, 20, 60])}
                      className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-rose-300 rounded"
                    >
                      Crimson
                    </button>
                    <button
                      onClick={() => setRgbValues([16, 185, 129])}
                      className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded"
                    >
                      Emerald
                    </button>
                    <button
                      onClick={() => setRgbValues([14, 165, 233])}
                      className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded"
                    >
                      Sky Blue
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Code Block for Active Example */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Python Implementation Code
              </span>
              <pre className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
                <code>{activeCase.pythonCode}</code>
              </pre>
            </div>
          </div>

          {/* Right Zone: Architectural Rationale & Why One Beats The Other (Cols 8-12) */}
          <div className="lg:col-span-5 p-6 space-y-6 bg-slate-950/20">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Architectural Trade-Off Analysis
            </span>

            {/* Why Chosen Box */}
            <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-900/40 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Why {activeCase.category === 'list' ? 'Lists' : 'Tuples'} Are Preferred</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeCase.whyChosen}
              </p>
            </div>

            {/* Why Alternative Fails Box */}
            <div className="p-4 rounded-lg bg-rose-950/20 border border-rose-900/40 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Why {activeCase.category === 'list' ? 'Tuples' : 'Lists'} Would Fail Here</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {activeCase.whyAlternativeFails}
              </p>
            </div>

            {/* Key Architectural Checklist */}
            <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800 space-y-3">
              <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Engineering Invariants
              </h4>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-sky-400 font-mono">01.</span>
                  <span>
                    <strong className="text-slate-200">Lifecycle Mutability: </strong>
                    {activeCase.category === 'list'
                      ? 'Frequent element additions/deletions during execution lifecycle.'
                      : 'Fixed reference schema defined once and protected against mutation.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-400 font-mono">02.</span>
                  <span>
                    <strong className="text-slate-200">Hashability Guard: </strong>
                    {activeCase.category === 'list'
                      ? 'Lists cannot be used as dictionary keys (unhashable).'
                      : 'Tuples can safely serve as hash keys in dictionaries and sets.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-400 font-mono">03.</span>
                  <span>
                    <strong className="text-slate-200">Memory Profile: </strong>
                    {activeCase.category === 'list'
                      ? 'Over-allocated buffer headroom for fast O(1) appends.'
                      : 'Zero overhead buffer; exact memory allocation.'}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
