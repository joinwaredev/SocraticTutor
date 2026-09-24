import React, { useState } from 'react';
import { FractionScaffoldData, BalanceScaffoldData, ArrayGridScaffoldData, NumberLineScaffoldData, ScaffoldType } from '../types';
import { Scale, PieChart, Grid3X3, ArrowRight, RefreshCw, Sparkles, PenTool } from 'lucide-react';
import { soundFX } from '../utils/soundFX';

interface Props {
  type: ScaffoldType;
  data?: any;
  onInteract?: (action: string) => void;
  onOpenScratchpad: () => void;
}

export const VisualScaffolding: React.FC<Props> = ({ type, data = {}, onInteract, onOpenScratchpad }) => {
  // Local state to make visual aids interactive for the student
  const [interactiveFractionA, setInteractiveFractionA] = useState(data.numeratorA ?? 2);
  const [interactiveDenominatorA, setInteractiveDenominatorA] = useState(data.denominatorA ?? 4);
  const [interactiveFractionB, setInteractiveFractionB] = useState(data.numeratorB ?? 1);
  const [interactiveDenominatorB, setInteractiveDenominatorB] = useState(data.denominatorB ?? 2);

  const [leftUnknowns, setLeftUnknowns] = useState(data.leftUnknowns ?? 3);
  const [leftConstants, setLeftConstants] = useState(data.leftConstants ?? 4);
  const [rightConstants, setRightConstants] = useState(data.rightConstants ?? 19);

  const [gridRows, setGridRows] = useState(data.rows ?? 6);
  const [gridCols, setGridCols] = useState(data.cols ?? 6);
  const [selectedCells, setSelectedCells] = useState<number>(0);

  const [numberLinePos, setNumberLinePos] = useState(data.start ?? 0);

  return (
    <div className="bg-white/95 backdrop-blur rounded-2xl p-4 shadow-sm border border-amber-200/80 transition-all">
      <div className="flex items-center justify-between pb-3 border-b border-amber-100 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
            {type === 'fractions' && <PieChart className="w-4 h-4" />}
            {type === 'balance_scale' && <Scale className="w-4 h-4" />}
            {type === 'array_grid' && <Grid3X3 className="w-4 h-4" />}
            {type !== 'fractions' && type !== 'balance_scale' && type !== 'array_grid' && <Sparkles className="w-4 h-4 text-amber-600" />}
          </div>
          <div>
            <h3 className="font-heading font-semibold text-slate-800 text-sm md:text-base flex items-center gap-1.5">
              Visual Thinking Aid
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-normal">
                Hands-On Model
              </span>
            </h3>
            <p className="text-xs text-slate-500">Touch, move, and test your ideas without fear of mistakes!</p>
          </div>
        </div>

        <button
          onClick={onOpenScratchpad}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors shadow-xs cursor-pointer"
          title="Open drawing scratchpad to write out your thoughts"
        >
          <PenTool className="w-3.5 h-3.5 text-amber-600" />
          <span className="hidden sm:inline">Doodle</span> Scratchpad
        </button>
      </div>

      {/* FRACTIONS SCAFFOLD */}
      {type === 'fractions' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Fraction Bar A */}
            <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-100">
              <div className="flex justify-between items-center text-xs font-bold text-amber-900 mb-2">
                <span>{data.labelA || 'Fraction A'}</span>
                <span className="bg-amber-200/80 px-2 py-0.5 rounded-md font-mono text-sm">
                  {interactiveFractionA} / {interactiveDenominatorA}
                </span>
              </div>
              <div className="h-9 w-full bg-slate-100 rounded-lg flex overflow-hidden border border-slate-300 p-0.5 gap-0.5 shadow-inner">
                {Array.from({ length: interactiveDenominatorA }).map((_, i) => {
                  const isFilled = i < interactiveFractionA;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        soundFX.playPop();
                        const next = i + 1 === interactiveFractionA ? i : i + 1;
                        setInteractiveFractionA(next);
                        onInteract?.(`Changed Fraction A to ${next}/${interactiveDenominatorA}`);
                      }}
                      className={`flex-1 h-full rounded transition-all cursor-pointer flex items-center justify-center text-[10px] font-bold ${
                        isFilled
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'bg-white hover:bg-amber-100 text-slate-400'
                      }`}
                      title={`Slice ${i + 1}`}
                    >
                      {isFilled ? '★' : ''}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] text-slate-500">Cut into:</span>
                {[2, 3, 4, 6, 8].map((den) => (
                  <button
                    key={den}
                    onClick={() => {
                      setInteractiveDenominatorA(den);
                      if (interactiveFractionA > den) setInteractiveFractionA(den);
                    }}
                    className={`text-[11px] px-1.5 py-0.5 rounded ${
                      interactiveDenominatorA === den
                        ? 'bg-amber-600 text-white font-bold'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    /{den}
                  </button>
                ))}
              </div>
            </div>

            {/* Fraction Bar B */}
            <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100">
              <div className="flex justify-between items-center text-xs font-bold text-blue-900 mb-2">
                <span>{data.labelB || 'Fraction B'}</span>
                <span className="bg-blue-200/80 px-2 py-0.5 rounded-md font-mono text-sm">
                  {interactiveFractionB} / {interactiveDenominatorB}
                </span>
              </div>
              <div className="h-9 w-full bg-slate-100 rounded-lg flex overflow-hidden border border-slate-300 p-0.5 gap-0.5 shadow-inner">
                {Array.from({ length: interactiveDenominatorB }).map((_, i) => {
                  const isFilled = i < interactiveFractionB;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        const next = i + 1 === interactiveFractionB ? i : i + 1;
                        setInteractiveFractionB(next);
                        onInteract?.(`Changed Fraction B to ${next}/${interactiveDenominatorB}`);
                      }}
                      className={`flex-1 h-full rounded transition-all cursor-pointer flex items-center justify-center text-[10px] font-bold ${
                        isFilled
                          ? 'bg-sky-500 text-white shadow-xs'
                          : 'bg-white hover:bg-sky-100 text-slate-400'
                      }`}
                      title={`Slice ${i + 1}`}
                    >
                      {isFilled ? '★' : ''}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] text-slate-500">Cut into:</span>
                {[2, 3, 4, 6, 8].map((den) => (
                  <button
                    key={den}
                    onClick={() => {
                      setInteractiveDenominatorB(den);
                      if (interactiveFractionB > den) setInteractiveFractionB(den);
                    }}
                    className={`text-[11px] px-1.5 py-0.5 rounded ${
                      interactiveDenominatorB === den
                        ? 'bg-sky-600 text-white font-bold'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    /{den}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-amber-100/50 p-2.5 rounded-xl text-xs text-amber-900 flex items-center justify-between">
            <span className="font-medium">
              💡 Notice: <strong>{interactiveFractionA}/{interactiveDenominatorA}</strong> fills{' '}
              {Math.round((interactiveFractionA / interactiveDenominatorA) * 100)}% of the bar, while{' '}
              <strong>{interactiveFractionB}/{interactiveDenominatorB}</strong> fills{' '}
              {Math.round((interactiveFractionB / interactiveDenominatorB) * 100)}%!
            </span>
            {Math.abs(interactiveFractionA / interactiveDenominatorA - interactiveFractionB / interactiveDenominatorB) < 0.001 && (
              <span className="bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-md text-[11px] animate-pulse-subtle">
                Exact Match! 🎉
              </span>
            )}
          </div>
        </div>
      )}

      {/* ALGEBRA BALANCE SCALE */}
      {type === 'balance_scale' && (
        <div className="space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
            <div className="flex justify-between items-center text-xs text-slate-600 mb-2">
              <span className="font-bold text-slate-700">Left Pan: {leftUnknowns}x + {leftConstants}</span>
              <span className="font-bold text-emerald-600">Balance Goal: Level Seesaw (=)</span>
              <span className="font-bold text-slate-700">Right Pan: {rightConstants}</span>
            </div>

            {/* Visual SVG Scale */}
            <div className="relative w-full h-32 flex items-center justify-center">
              <svg viewBox="0 0 400 130" className="w-full max-w-md h-full">
                {/* Fulcrum base */}
                <polygon points="200,60 185,115 215,115" fill="#475569" />
                <rect x="160" y="115" width="80" height="8" rx="3" fill="#334155" />
                <circle cx="200" cy="60" r="5" fill="#F59E0B" />

                {/* Seesaw Beam */}
                <line x1="60" y1="60" x2="340" y2="60" stroke="#0284C7" strokeWidth="6" strokeLinecap="round" />

                {/* Left Pan strings & plate */}
                <line x1="90" y1="60" x2="70" y2="90" stroke="#94A3B8" strokeWidth="2" />
                <line x1="90" y1="60" x2="110" y2="90" stroke="#94A3B8" strokeWidth="2" />
                <path d="M 60 90 Q 90 98 120 90" fill="none" stroke="#0284C7" strokeWidth="4" />

                {/* Right Pan strings & plate */}
                <line x1="310" y1="60" x2="290" y2="90" stroke="#94A3B8" strokeWidth="2" />
                <line x1="310" y1="60" x2="330" y2="90" stroke="#94A3B8" strokeWidth="2" />
                <path d="M 280 90 Q 310 98 340 90" fill="none" stroke="#0284C7" strokeWidth="4" />

                {/* Left side items */}
                {Array.from({ length: Math.min(leftUnknowns, 4) }).map((_, i) => (
                  <g key={`x-${i}`}>
                    <rect x={65 + i * 14} y={72} width="12" height="15" fill="#60A5FA" stroke="#2563EB" rx="2" />
                    <text x={71 + i * 14} y={83} fontSize="9" fontWeight="bold" textAnchor="middle" fill="#1E3A8A">x</text>
                  </g>
                ))}
                {leftConstants > 0 && (
                  <circle cx="112" cy="79" r="7" fill="#F59E0B" />
                )}
                {leftConstants > 0 && (
                  <text x="112" y="82" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#78350F">+{leftConstants}</text>
                )}

                {/* Right side items */}
                <circle cx="310" cy="78" r="10" fill="#10B981" />
                <text x="310" y="82" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#FFFFFF">{rightConstants}</text>
              </svg>
            </div>

            {/* Interactive actions for student */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-slate-200">
              <span className="text-xs text-slate-500 font-medium">Try an action on BOTH sides:</span>
              <button
                onClick={() => {
                  if (leftConstants > 0 && rightConstants > 0) {
                    setLeftConstants((prev: number) => Math.max(0, prev - 1));
                    setRightConstants((prev: number) => Math.max(0, prev - 1));
                    onInteract?.('Subtracted 1 marble from both pans');
                  }
                }}
                disabled={leftConstants <= 0}
                className="px-2.5 py-1 text-xs rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-semibold disabled:opacity-40 cursor-pointer"
              >
                ➖ Remove 1 from both sides
              </button>
              <button
                onClick={() => {
                  if (leftConstants >= 4 && rightConstants >= 4) {
                    setLeftConstants(0);
                    setRightConstants((prev: number) => prev - 4);
                    onInteract?.('Removed all 4 extra marbles from both pans!');
                  }
                }}
                disabled={leftConstants === 0}
                className="px-2.5 py-1 text-xs rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-semibold disabled:opacity-40 cursor-pointer"
              >
                ✨ Remove all 4 marbles (-4)
              </button>
              <button
                onClick={() => {
                  setLeftUnknowns(data.leftUnknowns ?? 3);
                  setLeftConstants(data.leftConstants ?? 4);
                  setRightConstants(data.rightConstants ?? 19);
                }}
                className="px-2 py-1 text-xs rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer"
                title="Reset scale"
              >
                <RefreshCw className="w-3 h-3 inline" /> Reset
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-500 text-center">
            ⚖️ <strong>Golden Rule of Equations:</strong> Whatever you take away or add to one side, you must do to the other side to keep the seesaw level!
          </p>
        </div>
      )}

      {/* ARRAY & GRID SCAFFOLD */}
      {type === 'array_grid' && (
        <div className="space-y-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2">
              <span>Multiplication & Grouping Grid ({gridRows} rows × {gridCols} columns = {gridRows * gridCols})</span>
              <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                Clicked: {selectedCells} cells
              </span>
            </div>
            <div
              className="grid gap-1 max-w-fit mx-auto p-2 bg-white rounded-lg border border-slate-200 shadow-inner"
              style={{ gridTemplateColumns: `repeat(${Math.min(gridCols, 12)}, minmax(18px, 24px))` }}
            >
              {Array.from({ length: Math.min(gridRows * gridCols, 72) }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCells((prev) => (prev > idx ? idx : idx + 1))}
                  className={`h-5 sm:h-6 rounded transition-colors cursor-pointer text-[9px] font-mono flex items-center justify-center ${
                    idx < selectedCells
                      ? 'bg-amber-400 text-amber-950 font-bold'
                      : 'bg-slate-100 hover:bg-amber-100 text-slate-400'
                  }`}
                  title={`Cell ${idx + 1}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="text-xs text-slate-500">Grid size:</span>
              {[
                { r: 4, c: 6 },
                { r: 6, c: 6 },
                { r: 6, c: 12 },
              ].map((preset, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setGridRows(preset.r);
                    setGridCols(preset.c);
                    setSelectedCells(0);
                  }}
                  className="px-2 py-0.5 text-xs bg-slate-200 hover:bg-slate-300 rounded text-slate-700 font-mono"
                >
                  {preset.r}×{preset.c}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NUMBER LINE */}
      {type === 'number_line' && (
        <div className="space-y-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
            <span>Number Line Trail</span>
            <span className="font-mono bg-sky-100 text-sky-800 px-2 py-0.5 rounded">
              Current Spot: {numberLinePos}
            </span>
          </div>
          <div className="relative py-6">
            <div className="h-1.5 bg-slate-300 rounded-full w-full relative">
              {/* Stepping marks */}
              {Array.from({ length: 11 }).map((_, i) => {
                const val = i * 2;
                return (
                  <div
                    key={i}
                    className="absolute -top-1 transform -translate-x-1/2 flex flex-col items-center"
                    style={{ left: `${(i / 10) * 100}%` }}
                  >
                    <div className="w-1 h-3.5 bg-slate-400 rounded" />
                    <span className="text-[10px] font-mono text-slate-500 mt-1">{val}</span>
                  </div>
                );
              })}
              {/* Jumper Token */}
              <div
                className="absolute -top-3.5 transform -translate-x-1/2 transition-all duration-300"
                style={{ left: `${Math.min(100, Math.max(0, (numberLinePos / 20) * 100))}%` }}
              >
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md font-bold text-xs animate-bounce">
                  🐸
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setNumberLinePos((prev: number) => Math.max(0, prev - 2))}
              className="px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded-lg text-xs font-semibold text-slate-700"
            >
              ← Jump Back 2
            </button>
            <button
              onClick={() => setNumberLinePos((prev: number) => Math.min(20, prev + 2))}
              className="px-3 py-1 bg-sky-500 hover:bg-sky-600 rounded-lg text-xs font-semibold text-white"
            >
              Jump Forward 2 →
            </button>
          </div>
        </div>
      )}

      {/* DEFAULT / PLACE VALUE SCAFFOLD */}
      {type === 'none' && (
        <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-3 text-xs text-amber-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌟</span>
            <span>
              <strong>Step Explorer Active:</strong> You can open the drawing scratchpad anytime to scribble numbers, draw grouping circles, or underline clues!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
