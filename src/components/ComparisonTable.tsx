import React from 'react';
import { COMPARISON_MATRIX } from '../data/lessonPlanData';
import { Check, X, Shield, Zap } from 'lucide-react';

export const ComparisonTable: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-sky-400 font-medium">
          <span>Architectural Matrix</span>
          <span aria-hidden="true">·</span>
          <span>Side-by-Side Invariants</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
          Python Lists vs. Tuples: Head-to-Head Comparison
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-3xl mt-2 leading-relaxed">
          Quick reference table comparing technical invariants, memory consumption, CPython behavior, and real-world domain suitability for lists and tuples.
        </p>
      </div>

      {/* Matrix Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-xs font-semibold uppercase text-slate-400 tracking-wider">
                <th className="py-3.5 px-4 sm:px-6 w-1/4">Evaluation Metric</th>
                <th className="py-3.5 px-4 sm:px-6 w-1/3 text-amber-400">
                  Python List <code className="text-xs font-mono font-normal text-amber-300">[ ]</code>
                </th>
                <th className="py-3.5 px-4 sm:px-6 w-1/3 text-sky-400">
                  Python Tuple <code className="text-xs font-mono font-normal text-sky-300">( )</code>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs sm:text-sm">
              {COMPARISON_MATRIX.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-4 px-4 sm:px-6 font-semibold text-slate-200 align-top">
                    <div>{row.criterion}</div>
                    <div className="text-[11px] text-slate-500 font-normal mt-0.5">
                      {row.note}
                    </div>
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-slate-300 font-mono text-xs align-top bg-amber-950/5">
                    {row.listVal}
                  </td>
                  <td className="py-4 px-4 sm:px-6 text-slate-300 font-mono text-xs align-top bg-sky-950/5">
                    {row.tupleVal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Decision Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* When to use List */}
        <div className="p-6 bg-slate-900/60 border border-amber-900/40 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-base">
            <Zap className="w-5 h-5" />
            <span>When to Choose a LIST</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong>Dynamic Collections:</strong> Elements need to be added, inserted, or removed as the program runs (e.g. <em>Shopping Carts, Job Queues</em>).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong>Homogeneous Data:</strong> Items represent similar entities that undergo sorting, filtering, or list comprehensions (e.g. <em>Student Scores</em>).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span><strong>In-Place Mutation:</strong> Reversing, shuffling, or slicing replacements in memory without allocating new structures.</span>
            </li>
          </ul>
        </div>

        {/* When to use Tuple */}
        <div className="p-6 bg-slate-900/60 border border-sky-900/40 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-base">
            <Shield className="w-5 h-5" />
            <span>When to Choose a TUPLE</span>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-sky-400 font-bold">•</span>
              <span><strong>Invariant Attributes:</strong> Data represents a fixed physical entity that must never change (e.g. <em>GPS Coordinates, RGB Color Specs</em>).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-400 font-bold">•</span>
              <span><strong>Dictionary Keys &amp; Sets:</strong> Using composite coordinates or categories as lookup keys in a hash map.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-400 font-bold">•</span>
              <span><strong>Memory &amp; Performance:</strong> Lower RAM consumption and faster instantiation in performance-critical loops.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-sky-400 font-bold">•</span>
              <span><strong>Multiple Return Values:</strong> Returning multi-part results from functions (<code className="text-sky-300 font-mono">return x, y, z</code>).</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
