import React, { useRef, useState, useEffect } from 'react';
import { X, Eraser, RotateCcw, Pen, Download, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onShareWork?: (dataUrl: string) => void;
}

export const ScratchpadModal: React.FC<Props> = ({ isOpen, onClose, onShareWork }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#2563EB');
  const [lineWidth, setLineWidth] = useState(4);
  const [mode, setMode] = useState<'pen' | 'eraser'>('pen');

  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high resolution
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Draw grid background for math
    drawGrid(ctx, rect.width, rect.height);
  }, [isOpen]);

  const drawGrid = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.fillStyle = '#FAFAF9';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#E7E5E4';
    ctx.lineWidth = 1;

    // 24px grid
    for (let x = 0; x < w; x += 24) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 24) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (mode === 'eraser') {
      ctx.strokeStyle = '#FAFAF9';
      ctx.lineWidth = lineWidth * 4;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    drawGrid(ctx, rect.width, rect.height);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-amber-100/70 to-orange-100/70 border-b border-amber-200">
          <div className="flex items-center gap-2">
            <span className="text-xl">✏️</span>
            <div>
              <h3 className="font-heading font-bold text-slate-800 text-base">Student Math Scratchpad</h3>
              <p className="text-xs text-slate-600">Draw groupings, test sums, or sketch pictures freely!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/10 text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setMode('pen')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                mode === 'pen' ? 'bg-amber-500 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Pen className="w-3.5 h-3.5" /> Pen
            </button>
            <button
              onClick={() => setMode('eraser')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                mode === 'eraser' ? 'bg-amber-500 text-white shadow-xs' : 'bg-white text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Eraser className="w-3.5 h-3.5" /> Eraser
            </button>

            <div className="h-4 w-px bg-slate-300 mx-1" />

            {/* Colors */}
            <div className="flex items-center gap-1">
              {['#2563EB', '#DC2626', '#16A34A', '#D97706', '#9333EA', '#1E293B'].map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setColor(c);
                    setMode('pen');
                  }}
                  className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                    color === c && mode === 'pen' ? 'scale-125 border-slate-900 shadow-xs' : 'border-white'
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearCanvas}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-slate-700 bg-white hover:bg-slate-200 border border-slate-300 cursor-pointer font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear All
            </button>
            <button
              onClick={() => {
                if (canvasRef.current && onShareWork) {
                  onShareWork(canvasRef.current.toDataURL());
                }
                onClose();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" /> Keep in Notes
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 min-h-[360px] p-2 bg-slate-100 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="w-full h-full min-h-[350px] rounded-2xl shadow-inner border border-slate-300 bg-stone-50 cursor-crosshair touch-none"
          />
        </div>
      </div>
    </div>
  );
};
