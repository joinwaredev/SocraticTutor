import React, { useState } from 'react';
import { MathConcept } from '../data/conceptLibrary';
import { ArrowRight, RotateCw, Check, Sparkles } from 'lucide-react';

interface Props {
  concept: MathConcept;
}

export const ConceptIllustration: React.FC<Props> = ({ concept }) => {
  switch (concept.interactiveType) {
    case 'fraction_bars':
      return <FractionBarsVisual data={concept.interactiveData} />;
    case 'array_grid':
      return <ArrayGridVisual data={concept.interactiveData} />;
    case 'area_vs_perimeter':
      return <AreaVsPerimeterVisual data={concept.interactiveData} />;
    case 'partial_products':
      return <PartialProductsVisual data={concept.interactiveData} />;
    case 'clock_fractions':
      return <ClockFractionsVisual data={concept.interactiveData} />;
    case 'number_line_jumps':
      return <NumberLineJumpsVisual data={concept.interactiveData} />;
    case 'constant_difference':
      return <ConstantDifferenceVisual data={concept.interactiveData} />;
    case 'multiplicative_comparison':
      return <MultiplicativeComparisonVisual data={concept.interactiveData} />;
    case 'decimal_hundredths':
      return <DecimalHundredthsVisual data={concept.interactiveData} />;
    case 'volume_layers':
      return <VolumeLayersVisual data={concept.interactiveData} />;
    case 'powers_of_ten':
      return <PowersOfTenVisual data={concept.interactiveData} />;
    case 'coordinate_plane':
      return <CoordinatePlaneVisual data={concept.interactiveData} />;
    default:
      return <FractionBarsVisual data={{ defaultNumerator: 3, defaultDenominator: 4 }} />;
  }
};

// ==========================================
// 1. FRACTION BARS & EQUIVALENCE
// ==========================================
const FractionBarsVisual: React.FC<{ data: any }> = ({ data }) => {
  const [denom, setDenom] = useState<number>(data.defaultDenominator || 4);
  const [num, setNum] = useState<number>(data.defaultNumerator || 3);

  const safeNum = Math.min(num, denom);

  return (
    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <span>🍕 Interactive Fraction Bar:</span>
          <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 font-extrabold text-sm">
            {safeNum} / {denom}
          </span>
        </span>
        <span className="text-[11px] text-slate-500 font-medium">Click slices to shade/unshade</span>
      </div>

      {/* Main Fraction Strip */}
      <div className="h-10 rounded-xl bg-white border-2 border-slate-300 flex overflow-hidden shadow-inner">
        {Array.from({ length: denom }).map((_, i) => {
          const isShaded = i < safeNum;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setNum(i + 1 === safeNum ? i : i + 1)}
              className={`flex-1 border-r last:border-r-0 border-slate-300 transition-colors flex items-center justify-center text-xs font-bold cursor-pointer ${
                isShaded
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
              }`}
              title={`Slice ${i + 1} of ${denom} (1/${denom})`}
            >
              1/{denom}
            </button>
          );
        })}
      </div>

      {/* Equivalence display if applicable */}
      {denom % 2 === 0 && safeNum === denom / 2 && (
        <div className="text-[11px] text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 font-semibold flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Notice: {safeNum}/{denom} is exactly equal to 1/2 of the whole bar!</span>
        </div>
      )}

      {/* Interactive Controls */}
      <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-[11px]">Slices (Denominator):</span>
          {[2, 3, 4, 6, 8].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => {
                setDenom(d);
                if (num > d) setNum(d);
              }}
              className={`w-6 h-6 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                denom === d ? 'bg-amber-500 text-white shadow-xs' : 'bg-white border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. ARRAY GRID & COMMUTATIVE FLIP
// ==========================================
const ArrayGridVisual: React.FC<{ data: any }> = ({ data }) => {
  const [rows, setRows] = useState<number>(data.defaultRows || 4);
  const [cols, setCols] = useState<number>(data.defaultCols || 6);
  const [isFlipped, setIsFlipped] = useState(false);

  const displayRows = isFlipped ? cols : rows;
  const displayCols = isFlipped ? rows : cols;
  const total = displayRows * displayCols;

  return (
    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">🧁 Cookie Tray Array:</span>
          <span className="px-2 py-0.5 rounded-lg bg-indigo-100 text-indigo-900 font-extrabold text-xs">
            {displayRows} rows × {displayCols} columns = {total} cookies
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsFlipped(!isFlipped)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-indigo-200 text-indigo-700 text-xs font-bold hover:bg-indigo-50 transition-all cursor-pointer shadow-2xs"
          title="Rotate tray 90 degrees to prove Commutative Property"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Turn Tray</span>
        </button>
      </div>

      {/* Grid of cookies / dots */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 overflow-x-auto">
        <div
          className="inline-grid gap-1.5 p-1 mx-auto"
          style={{
            gridTemplateColumns: `repeat(${displayCols}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: displayRows }).map((_, r) =>
            Array.from({ length: displayCols }).map((_, c) => (
              <div
                key={`${r}-${c}`}
                className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-amber-400 border border-amber-500 shadow-xs flex items-center justify-center text-[10px] font-bold text-amber-950 transition-transform hover:scale-110"
                title={`Row ${r + 1}, Column ${c + 1}`}
              >
                •
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
        <span>Commutative Property: {rows} × {cols} = {cols} × {rows} = {total}</span>
        <div className="flex items-center gap-1">
          <span>Size:</span>
          {[
            { r: 3, c: 5 },
            { r: 4, c: 6 },
            { r: 5, c: 7 },
          ].map((preset, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setRows(preset.r);
                setCols(preset.c);
                setIsFlipped(false);
              }}
              className="px-2 py-0.5 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer"
            >
              {preset.r}×{preset.c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. AREA VS PERIMETER
// ==========================================
const AreaVsPerimeterVisual: React.FC<{ data: any }> = ({ data }) => {
  const [width, setWidth] = useState<number>(data.width || 5);
  const [height, setHeight] = useState<number>(data.height || 3);

  const perimeter = 2 * (width + height);
  const area = width * height;

  return (
    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-950">
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
            Perimeter (Fence Border)
          </div>
          <div className="text-sm font-extrabold">
            {width} + {height} + {width} + {height} = <span className="text-blue-600">{perimeter} ft</span>
          </div>
          <div className="text-[10px] text-blue-600">Single units (distance around)</div>
        </div>

        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950">
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
            Area (Carpet / Grass Inside)
          </div>
          <div className="text-sm font-extrabold">
            {width} × {height} = <span className="text-amber-600">{area} sq ft</span>
          </div>
          <div className="text-[10px] text-amber-600">Square units (flat tiles inside)</div>
        </div>
      </div>

      {/* Visual Box with border and grid tiles */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col items-center justify-center">
        <div className="text-[11px] font-bold text-blue-600 mb-1">Top Fence: {width} ft</div>
        <div className="flex items-center gap-2">
          <div className="text-[11px] font-bold text-blue-600 transform -rotate-90">
            {height} ft
          </div>
          <div
            className="grid border-4 border-blue-500 rounded-lg bg-amber-100/50 p-1 shadow-xs"
            style={{
              gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: height }).map((_, r) =>
              Array.from({ length: width }).map((_, c) => (
                <div
                  key={`${r}-${c}`}
                  className="w-5 h-5 sm:w-6 sm:h-6 border border-amber-300 bg-amber-200/80 rounded-xs flex items-center justify-center text-[9px] font-bold text-amber-900"
                >
                  1
                </div>
              ))
            )}
          </div>
          <div className="text-[11px] font-bold text-blue-600 transform rotate-90">
            {height} ft
          </div>
        </div>
        <div className="text-[11px] font-bold text-blue-600 mt-1">Bottom Fence: {width} ft</div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-600">
        <span>Adjust dimensions:</span>
        <div className="flex items-center gap-2">
          <span>Width:</span>
          {[4, 5, 6].map((w) => (
            <button
              key={w}
              onClick={() => setWidth(w)}
              className={`px-2 py-0.5 rounded text-xs font-bold cursor-pointer ${
                width === w ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200'
              }`}
            >
              {w}
            </button>
          ))}
          <span>Height:</span>
          {[2, 3, 4].map((h) => (
            <button
              key={h}
              onClick={() => setHeight(h)}
              className={`px-2 py-0.5 rounded text-xs font-bold cursor-pointer ${
                height === h ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200'
              }`}
            >
              {h}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. PARTIAL PRODUCTS & 4-ROOM HOUSE
// ==========================================
const PartialProductsVisual: React.FC<{ data: any }> = ({ data }) => {
  const [activeRoom, setActiveRoom] = useState<number | null>(null);

  // 24 x 18 = (20 + 4) * (10 + 8)
  const room1 = 20 * 10; // 200
  const room2 = 20 * 8; // 160
  const room3 = 4 * 10; // 40
  const room4 = 4 * 8; // 32
  const total = room1 + room2 + room3 + room4;

  return (
    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700">🏠 4-Room Area Model: 24 × 18</span>
        <span className="text-xs font-extrabold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-lg">
          Total Area = {total}
        </span>
      </div>

      {/* 4-Room Grid Box */}
      <div className="bg-white p-3 rounded-xl border border-slate-200">
        <div className="grid grid-cols-12 gap-1 text-center font-bold text-xs">
          {/* Top labels */}
          <div className="col-span-2"></div>
          <div className="col-span-6 text-indigo-700 bg-indigo-50 py-1 rounded-t-lg">
            20 (Tens)
          </div>
          <div className="col-span-4 text-indigo-700 bg-indigo-50 py-1 rounded-t-lg">
            4 (Ones)
          </div>

          {/* Row 1: 10 */}
          <div className="col-span-2 text-purple-700 bg-purple-50 flex items-center justify-center rounded-l-lg text-xs">
            10
          </div>
          <div
            onMouseEnter={() => setActiveRoom(1)}
            onMouseLeave={() => setActiveRoom(null)}
            className={`col-span-6 p-3 rounded-lg border transition-all cursor-pointer ${
              activeRoom === 1
                ? 'bg-amber-200 border-amber-400 scale-[1.02] shadow-xs'
                : 'bg-amber-50 border-amber-200'
            }`}
          >
            <div className="text-[10px] text-amber-700 font-semibold">Living Room</div>
            <div className="text-xs font-extrabold text-amber-950">20 × 10 = 200</div>
          </div>
          <div
            onMouseEnter={() => setActiveRoom(2)}
            onMouseLeave={() => setActiveRoom(null)}
            className={`col-span-4 p-3 rounded-lg border transition-all cursor-pointer ${
              activeRoom === 2
                ? 'bg-emerald-200 border-emerald-400 scale-[1.02] shadow-xs'
                : 'bg-emerald-50 border-emerald-200'
            }`}
          >
            <div className="text-[10px] text-emerald-700 font-semibold">Bedroom</div>
            <div className="text-xs font-extrabold text-emerald-950">4 × 10 = 40</div>
          </div>

          {/* Row 2: 8 */}
          <div className="col-span-2 text-purple-700 bg-purple-50 flex items-center justify-center rounded-l-lg text-xs">
            8
          </div>
          <div
            onMouseEnter={() => setActiveRoom(3)}
            onMouseLeave={() => setActiveRoom(null)}
            className={`col-span-6 p-3 rounded-lg border transition-all cursor-pointer ${
              activeRoom === 3
                ? 'bg-blue-200 border-blue-400 scale-[1.02] shadow-xs'
                : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="text-[10px] text-blue-700 font-semibold">Kitchen</div>
            <div className="text-xs font-extrabold text-blue-950">20 × 8 = 160</div>
          </div>
          <div
            onMouseEnter={() => setActiveRoom(4)}
            onMouseLeave={() => setActiveRoom(null)}
            className={`col-span-4 p-3 rounded-lg border transition-all cursor-pointer ${
              activeRoom === 4
                ? 'bg-rose-200 border-rose-400 scale-[1.02] shadow-xs'
                : 'bg-rose-50 border-rose-200'
            }`}
          >
            <div className="text-[10px] text-rose-700 font-semibold">Balcony</div>
            <div className="text-xs font-extrabold text-rose-950">4 × 8 = 32</div>
          </div>
        </div>
      </div>

      <div className="bg-purple-50 p-2 rounded-xl text-center text-xs font-bold text-purple-900 border border-purple-200">
        Sum the 4 Partial Products: 200 + 160 + 40 + 32 = 432!
      </div>
    </div>
  );
};

// ==========================================
// 5. CLOCK FRACTIONS & ANGLES
// ==========================================
const ClockFractionsVisual: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700">⏰ Clock Face Fractions (1 Hour = 60 Min)</span>
        <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-lg">
          1/3 hr (20m) + 1/4 hr (15m) = 35/60 = 7/12!
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-around gap-4 bg-white p-3 rounded-xl border border-slate-200">
        {/* Clock SVG graphic */}
        <div className="relative w-28 h-28">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            {/* Clock Circle */}
            <circle cx="50" cy="50" r="45" fill="#f8fafc" stroke="#94a3b8" strokeWidth="3" />

            {/* 1/3 slice (0 to 120 deg = 20 mins) in amber */}
            <path
              d="M 50 50 L 95 50 A 45 45 0 0 1 27.5 88.9 Z"
              fill="rgba(245, 158, 11, 0.4)"
              stroke="#f59e0b"
              strokeWidth="1.5"
            />

            {/* 1/4 slice (120 to 210 deg = 15 mins) in indigo */}
            <path
              d="M 50 50 L 27.5 88.9 A 45 45 0 0 1 5 50 Z"
              fill="rgba(99, 102, 241, 0.4)"
              stroke="#6366f1"
              strokeWidth="1.5"
            />

            {/* Center dot */}
            <circle cx="50" cy="50" r="4" fill="#334155" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[10px] font-extrabold text-slate-700 mt-6">35 min</span>
          </div>
        </div>

        {/* Legend / Breakdown */}
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2 text-amber-800 font-semibold">
            <span className="w-3 h-3 rounded-full bg-amber-400"></span>
            <span>1/3 of an hour = 20 minutes (4 × 5 min)</span>
          </div>
          <div className="flex items-center gap-2 text-indigo-800 font-semibold">
            <span className="w-3 h-3 rounded-full bg-indigo-400"></span>
            <span>1/4 of an hour = 15 minutes (3 × 5 min)</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-800 font-bold pt-1 border-t border-slate-200">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span>Total = 35 minutes out of 60 = 7/12 of an hour!</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. NUMBER LINE FRIENDLY JUMPS
// ==========================================
const NumberLineJumpsVisual: React.FC<{ data: any }> = ({ data }) => {
  return (
    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700">🐸 Frog Jumps on the Open Line</span>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">
          Goal: 38 + ? = 74
        </span>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4">
        {/* Visual Number Line Arc */}
        <div className="relative pt-6 pb-4">
          <div className="h-1 bg-slate-300 w-full rounded-full relative flex justify-between items-center px-4">
            {/* Tick 38 */}
            <div className="flex flex-col items-center">
              <div className="w-2.5 h-2.5 bg-slate-700 rounded-full mb-1"></div>
              <span className="text-xs font-extrabold text-slate-800">38</span>
            </div>

            {/* Jump +2 to 40 */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-amber-600 -mt-6">Hop +2</span>
              <div className="w-2.5 h-2.5 bg-amber-500 rounded-full mb-1"></div>
              <span className="text-xs font-bold text-amber-700">40</span>
            </div>

            {/* Jump +30 to 70 */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-indigo-600 -mt-6">Leap +30</span>
              <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full mb-1"></div>
              <span className="text-xs font-bold text-indigo-700">70</span>
            </div>

            {/* Jump +4 to 74 */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-emerald-600 -mt-6">Hop +4</span>
              <div className="w-2.5 h-2.5 bg-emerald-600 rounded-full mb-1"></div>
              <span className="text-xs font-extrabold text-emerald-800">74</span>
            </div>
          </div>
        </div>

        <div className="text-center text-xs font-semibold text-slate-700 bg-slate-100 py-1.5 rounded-lg">
          Add the jumps: <span className="font-extrabold text-slate-900">2 + 30 + 4 = 36 total distance!</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 7. CONSTANT DIFFERENCE SUBTRACTION
// ==========================================
const ConstantDifferenceVisual: React.FC<{ data: any }> = () => {
  return (
    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700">📏 Shift Both Numbers by -1:</span>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-lg">
          No Borrowing Across Zeros!
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Old Hard Way */}
        <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 text-rose-950 space-y-1">
          <div className="text-[11px] font-bold uppercase text-rose-700">
            ❌ Messy Old Way (Borrowing Zeros):
          </div>
          <div className="font-mono text-sm">
            &nbsp; 5 0 0<br />- 2 9 7<br />
            <span className="text-[10px] text-rose-600 font-sans">
              (Must cross out 500, borrow from 10, borrow again...)
            </span>
          </div>
        </div>

        {/* Constant Difference Shift Way */}
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
          <div className="text-[11px] font-bold uppercase text-emerald-700 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>✨ Bridges Constant Difference:</span>
          </div>
          <div className="font-mono text-sm font-bold">
            &nbsp; 4 9 9 <span className="text-xs font-sans text-emerald-700">(-1)</span><br />
            - 2 9 6 <span className="text-xs font-sans text-emerald-700">(-1)</span><br />
            <div className="border-t border-emerald-300 pt-0.5 text-emerald-900">
              = 2 0 3 <span className="text-xs font-sans font-normal">(Instant answer!)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 8. MULTIPLICATIVE COMPARISON
// ==========================================
const MultiplicativeComparisonVisual: React.FC<{ data: any }> = () => {
  return (
    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700">🔭 Tape Diagram: "3 Times as Many" vs "3 More"</span>
      </div>

      <div className="space-y-2 bg-white p-3 rounded-xl border border-slate-200 text-xs">
        {/* Ben */}
        <div className="flex items-center gap-2">
          <span className="w-20 font-bold text-slate-700 shrink-0">Ben:</span>
          <div className="w-16 h-7 bg-blue-400 rounded-lg flex items-center justify-center font-bold text-white shadow-2xs">
            4
          </div>
          <span className="text-slate-500 font-medium">= 4 cars</span>
        </div>

        {/* Multiplicative comparison (3 times as many) */}
        <div className="flex items-center gap-2">
          <span className="w-20 font-bold text-indigo-700 shrink-0">3× as many:</span>
          <div className="flex gap-1">
            <div className="w-16 h-7 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white shadow-2xs">
              4
            </div>
            <div className="w-16 h-7 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white shadow-2xs">
              4
            </div>
            <div className="w-16 h-7 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-white shadow-2xs">
              4
            </div>
          </div>
          <span className="text-indigo-900 font-extrabold">= 12 cars!</span>
        </div>

        {/* Additive comparison (3 more) */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
          <span className="w-20 font-bold text-slate-500 shrink-0">Just 3 more:</span>
          <div className="flex gap-1">
            <div className="w-16 h-7 bg-slate-400 rounded-lg flex items-center justify-center font-bold text-white shadow-2xs">
              4
            </div>
            <div className="w-12 h-7 bg-slate-300 rounded-lg flex items-center justify-center font-bold text-slate-700 shadow-2xs">
              +3
            </div>
          </div>
          <span className="text-slate-700 font-bold">= 7 cars</span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 9. DECIMAL HUNDREDTHS & MONEY
// ==========================================
const DecimalHundredthsVisual: React.FC<{ data: any }> = () => {
  return (
    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700">🪙 Comparing 0.4 and 0.35 with Dimes & Pennies</span>
      </div>

      <div className="grid grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
          <div className="text-xs font-extrabold text-amber-900">0.4 = 0.40 (4 Tenths)</div>
          <div className="text-[11px] text-amber-800">
            Think: <strong>4 Dimes = 40¢</strong> (40/100)
          </div>
          <div className="flex gap-1 pt-1">
            <span className="w-5 h-5 rounded-full bg-amber-300 border border-amber-500 flex items-center justify-center text-[9px] font-bold">
              10¢
            </span>
            <span className="w-5 h-5 rounded-full bg-amber-300 border border-amber-500 flex items-center justify-center text-[9px] font-bold">
              10¢
            </span>
            <span className="w-5 h-5 rounded-full bg-amber-300 border border-amber-500 flex items-center justify-center text-[9px] font-bold">
              10¢
            </span>
            <span className="w-5 h-5 rounded-full bg-amber-300 border border-amber-500 flex items-center justify-center text-[9px] font-bold">
              10¢
            </span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
          <div className="text-xs font-extrabold text-slate-800">0.35 (35 Hundredths)</div>
          <div className="text-[11px] text-slate-600">
            Think: <strong>3 Dimes + 5 Pennies = 35¢</strong>
          </div>
          <div className="flex gap-1 pt-1">
            <span className="w-5 h-5 rounded-full bg-amber-200 border border-amber-400 flex items-center justify-center text-[9px] font-bold">
              10¢
            </span>
            <span className="w-5 h-5 rounded-full bg-amber-200 border border-amber-400 flex items-center justify-center text-[9px] font-bold">
              10¢
            </span>
            <span className="w-5 h-5 rounded-full bg-amber-200 border border-amber-400 flex items-center justify-center text-[9px] font-bold">
              10¢
            </span>
            <span className="w-4 h-4 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-[8px] font-bold">
              5¢
            </span>
          </div>
        </div>
      </div>

      <div className="text-center text-xs font-bold text-emerald-800 bg-emerald-50 py-1 rounded-lg border border-emerald-200">
        40 cents is more than 35 cents, so <strong>0.4 &gt; 0.35</strong>!
      </div>
    </div>
  );
};

// ==========================================
// 10. VOLUME STACKING LAYERS
// ==========================================
const VolumeLayersVisual: React.FC<{ data: any }> = () => {
  const [layers, setLayers] = useState<number>(3);
  const baseArea = 5 * 4; // 20
  const totalVolume = baseArea * layers;

  return (
    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700">🏢 Apartment Tower: V = Base Area × Height</span>
        <span className="text-xs font-extrabold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-lg">
          Volume = {totalVolume} cubic units
        </span>
      </div>

      <div className="bg-white p-3 rounded-xl border border-slate-200 flex items-center justify-around gap-3">
        <div className="space-y-1 text-center">
          {Array.from({ length: layers })
            .map((_, i) => layers - i)
            .map((floorNum) => (
              <div
                key={floorNum}
                className="px-6 py-2 rounded-lg bg-indigo-500 border border-indigo-600 text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2"
              >
                <span>Floor {floorNum}:</span>
                <span className="text-indigo-200 text-[11px] font-normal">20 cubic rooms</span>
              </div>
            ))}
        </div>

        <div className="text-xs space-y-1 text-slate-600">
          <div>
            <strong>Base Floor:</strong> 5 long × 4 wide = <strong>20 rooms</strong>
          </div>
          <div>
            <strong>Stories High:</strong> {layers} floors
          </div>
          <div className="text-indigo-900 font-bold pt-1 border-t border-slate-200">
            20 × {layers} = {totalVolume} cubic units!
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-600">
        <span>Stack Floors:</span>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map((f) => (
            <button
              key={f}
              onClick={() => setLayers(f)}
              className={`px-2.5 py-0.5 rounded-lg text-xs font-bold cursor-pointer ${
                layers === f ? 'bg-indigo-600 text-white' : 'bg-white border border-slate-200'
              }`}
            >
              {f} {f === 1 ? 'floor' : 'floors'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 11. POWERS OF TEN SLIDER
// ==========================================
const PowersOfTenVisual: React.FC<{ data: any }> = () => {
  const [power, setPower] = useState<number>(1);
  const base = 45;
  const value = base * Math.pow(10, power);

  return (
    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700">🛫 Runway Slide: 45 × 10^{power}</span>
        <span className="text-xs font-extrabold text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-lg">
          = {value.toLocaleString()}
        </span>
      </div>

      {/* Place Value Columns */}
      <div className="grid grid-cols-5 gap-1 text-center bg-white p-3 rounded-xl border border-slate-200 font-bold text-xs">
        <div className="p-1 rounded bg-slate-100 text-slate-600 text-[10px]">Ten Thousands</div>
        <div className="p-1 rounded bg-slate-100 text-slate-600 text-[10px]">Thousands</div>
        <div className="p-1 rounded bg-slate-100 text-slate-600 text-[10px]">Hundreds</div>
        <div className="p-1 rounded bg-slate-100 text-slate-600 text-[10px]">Tens</div>
        <div className="p-1 rounded bg-slate-100 text-slate-600 text-[10px]">Ones</div>

        {/* Digit placements based on power */}
        <div className="h-9 flex items-center justify-center bg-purple-50 rounded text-sm text-purple-900">
          {power >= 3 ? '4' : ''}
        </div>
        <div className="h-9 flex items-center justify-center bg-purple-50 rounded text-sm text-purple-900">
          {power === 2 ? '4' : power >= 3 ? '5' : ''}
        </div>
        <div className="h-9 flex items-center justify-center bg-purple-50 rounded text-sm text-purple-900">
          {power === 1 ? '4' : power === 2 ? '5' : power >= 3 ? '0' : ''}
        </div>
        <div className="h-9 flex items-center justify-center bg-purple-50 rounded text-sm text-purple-900">
          {power === 0 ? '4' : power === 1 ? '5' : '0'}
        </div>
        <div className="h-9 flex items-center justify-center bg-purple-50 rounded text-sm text-purple-900">
          {power === 0 ? '5' : '0'}
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-600">
        <span>Multiply by Power of 10:</span>
        <div className="flex gap-1.5">
          {[
            { p: 0, label: '× 10⁰ (1)' },
            { p: 1, label: '× 10¹ (10)' },
            { p: 2, label: '× 10² (100)' },
            { p: 3, label: '× 10³ (1,000)' },
          ].map((item) => (
            <button
              key={item.p}
              onClick={() => setPower(item.p)}
              className={`px-2 py-0.5 rounded text-xs font-bold cursor-pointer ${
                power === item.p ? 'bg-purple-600 text-white' : 'bg-white border border-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 12. COORDINATE PLANE (WALK THEN FLY)
// ==========================================
const CoordinatePlaneVisual: React.FC<{ data: any }> = () => {
  const [point, setPoint] = useState<{ x: number; y: number }>({ x: 4, y: 5 });

  return (
    <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-700">🏢 Hotel Floor & Elevator: Point (X, Y)</span>
        <span className="text-xs font-extrabold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-lg">
          Point ({point.x}, {point.y})
        </span>
      </div>

      <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
        <div className="relative w-48 h-48 mx-auto border-l-2 border-b-2 border-slate-800 bg-slate-50">
          {/* Grid lines */}
          {Array.from({ length: 6 }).map((_, i) => (
            <React.Fragment key={i}>
              <div
                className="absolute w-full border-t border-slate-200"
                style={{ bottom: `${(i / 6) * 100}%` }}
              ></div>
              <div
                className="absolute h-full border-r border-slate-200"
                style={{ left: `${(i / 6) * 100}%` }}
              ></div>
            </React.Fragment>
          ))}

          {/* Point Dot */}
          <div
            className="absolute w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md transform -translate-x-1/2 translate-y-1/2 flex items-center justify-center text-[8px] font-bold text-white transition-all"
            style={{
              left: `${(point.x / 6) * 100}%`,
              bottom: `${(point.y / 6) * 100}%`,
            }}
          ></div>
        </div>

        <div className="text-center text-xs text-slate-700">
          1. Walk <strong>{point.x}</strong> along hallway (X) → 2. Take elevator up{' '}
          <strong>{point.y}</strong> floors (Y)!
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-600">
        <span>Test point:</span>
        <div className="flex gap-1.5">
          {[
            { x: 2, y: 4 },
            { x: 4, y: 5 },
            { x: 5, y: 2 },
            { x: 3, y: 6 },
          ].map((pt, i) => (
            <button
              key={i}
              onClick={() => setPoint(pt)}
              className={`px-2 py-0.5 rounded text-xs font-bold cursor-pointer ${
                point.x === pt.x && point.y === pt.y
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-slate-200'
              }`}
            >
              ({pt.x}, {pt.y})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
