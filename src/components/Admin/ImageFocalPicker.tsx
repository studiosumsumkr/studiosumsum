import React, { useState, useRef, useEffect } from 'react';
import { Smartphone, Monitor, Target, Check, RotateCcw, Move, Sliders, LayoutGrid, Square } from 'lucide-react';

interface ImageFocalPickerProps {
  imageUrl: string;
  position: string;
  onChange: (newPosition: string) => void;
  title?: string;
}

const PRESETS = [
  { label: '중앙 (Center)', value: '50% 50%', desc: '중앙 기준' },
  { label: '상단 (Top)', value: '50% 0%', desc: '상단 영역' },
  { label: '상단 25%', value: '50% 25%', desc: '상단 1/4' },
  { label: '하단 (Bottom)', value: '50% 100%', desc: '하단 영역' },
  { label: '하단 75%', value: '50% 75%', desc: '하단 3/4' },
  { label: '좌측 (Left)', value: '0% 50%', desc: '왼쪽 영역' },
  { label: '우측 (Right)', value: '100% 50%', desc: '오른쪽 영역' },
];

const GRID_3X3 = [
  { label: 'TL', x: 0, y: 0, title: 'Top-Left (좌상단)' },
  { label: 'TC', x: 50, y: 0, title: 'Top-Center (상단중앙)' },
  { label: 'TR', x: 100, y: 0, title: 'Top-Right (우상단)' },
  { label: 'CL', x: 0, y: 50, title: 'Center-Left (좌측중앙)' },
  { label: 'CC', x: 50, y: 50, title: 'Center (중앙)' },
  { label: 'CR', x: 100, y: 50, title: 'Center-Right (우측중앙)' },
  { label: 'BL', x: 0, y: 100, title: 'Bottom-Left (좌하단)' },
  { label: 'BC', x: 50, y: 100, title: 'Bottom-Center (하단중앙)' },
  { label: 'BR', x: 100, y: 100, title: 'Bottom-Right (우하단)' },
];

export const ImageFocalPicker: React.FC<ImageFocalPickerProps> = ({
  imageUrl,
  position = 'center',
  onChange,
  title = '사진 위치 및 초점(Focal Point) 미세 조절'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  if (!imageUrl) return null;

  // Extract percentage values
  let targetX = 50;
  let targetY = 50;

  if (position === 'top') { targetX = 50; targetY = 0; }
  else if (position === 'bottom') { targetX = 50; targetY = 100; }
  else if (position === 'left') { targetX = 0; targetY = 50; }
  else if (position === 'right') { targetX = 100; targetY = 50; }
  else if (position === 'center') { targetX = 50; targetY = 50; }
  else if (position.includes('%')) {
    const parts = position.split(' ');
    if (parts.length === 2) {
      targetX = Math.min(100, Math.max(0, parseInt(parts[0]) || 50));
      targetY = Math.min(100, Math.max(0, parseInt(parts[1]) || 50));
    }
  }

  const updateCoordinates = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const rawX = ((clientX - rect.left) / rect.width) * 100;
    const rawY = ((clientY - rect.top) / rect.height) * 100;
    const clampedX = Math.round(Math.min(100, Math.max(0, rawX)));
    const clampedY = Math.round(Math.min(100, Math.max(0, rawY)));
    onChange(`${clampedX}% ${clampedY}%`);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    updateCoordinates(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length > 0) {
      setIsDragging(true);
      updateCoordinates(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        updateCoordinates(e.clientX, e.clientY);
      }
    };
    const handleMouseUp = () => setIsDragging(false);

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length > 0) {
        updateCoordinates(e.touches[0].clientX, e.touches[0].clientY);
      }
    };
    const handleTouchEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);

  const normalizedPosStr = `${targetX}% ${targetY}%`;

  return (
    <div className="bg-neutral-900 text-white p-5 border border-neutral-800 space-y-6 rounded-none mt-4 font-sans select-none">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-3">
        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-emerald-400 animate-pulse" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-100">{title}</h4>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 border border-emerald-800 font-bold">
            X: {targetX}% | Y: {targetY}%
          </span>
          <button
            type="button"
            onClick={() => onChange('50% 50%')}
            className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 text-[10px] font-bold uppercase tracking-widest flex items-center space-x-1 cursor-pointer transition-all"
            title="중앙(50% 50%)으로 리셋"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <p className="text-[11px] text-neutral-400 leading-relaxed">
        💡 <strong>드래그 & 슬라이더 미세 조정:</strong> 메인 사진 위에서 <u>마우스나 터치로 드래그</u>하거나 아래 <strong>X/Y 정밀 슬라이더</strong>를 움직이면, 각 디바이스(모바일/1:1 grid/PC)의 잘림(Crop) 중심점이 실시간 반영됩니다.
      </p>

      {/* Control Tools Grid: 3x3 Matrix & Fine-tune Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 p-4 bg-neutral-950/60 border border-neutral-800">
        {/* 3x3 Quick Location Matrix */}
        <div className="lg:col-span-4 space-y-2">
          <div className="flex items-center space-x-1.5 text-[10px] uppercase font-extrabold text-neutral-400">
            <LayoutGrid className="w-3.5 h-3.5 text-emerald-400" />
            <span>3x3 빠른 초점 그리드</span>
          </div>
          <div className="grid grid-cols-3 gap-1 max-w-[180px]">
            {GRID_3X3.map((g) => {
              const isMatch = targetX === g.x && targetY === g.y;
              return (
                <button
                  key={g.label}
                  type="button"
                  title={g.title}
                  onClick={() => onChange(`${g.x}% ${g.y}%`)}
                  className={`h-9 text-[9px] font-mono font-black border transition-all cursor-pointer flex items-center justify-center ${
                    isMatch
                      ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                      : 'bg-neutral-800/80 text-neutral-400 border-neutral-700 hover:border-neutral-500 hover:text-white'
                  }`}
                >
                  {g.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fine-tuning Precision Sliders & Presets */}
        <div className="lg:col-span-8 space-y-3">
          <div className="flex items-center space-x-1.5 text-[10px] uppercase font-extrabold text-neutral-400">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>정밀 슬라이더 (Precision Sliders)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-900 p-3 border border-neutral-800">
            {/* X Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-neutral-400">가로 위치 (X Axis)</span>
                <span className="text-emerald-400 font-bold">{targetX}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={targetX}
                onChange={(e) => onChange(`${e.target.value}% ${targetY}%`)}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-neutral-700 rounded"
              />
            </div>

            {/* Y Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-neutral-400">세로 위치 (Y Axis)</span>
                <span className="text-emerald-400 font-bold">{targetY}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={targetY}
                onChange={(e) => onChange(`${targetX}% ${e.target.value}%`)}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-neutral-700 rounded"
              />
            </div>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {PRESETS.map((p) => {
              const isSelected = normalizedPosStr === p.value;
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => onChange(p.value)}
                  className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider transition-all border flex items-center space-x-1 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500 text-black border-emerald-400'
                      : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:border-neutral-500 hover:text-white'
                  }`}
                >
                  {isSelected && <Check className="w-2.5 h-2.5" />}
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Drag Canvas & Device Crop Previews */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
        {/* Interactive Drag & Drop Canvas */}
        <div className="md:col-span-1 space-y-2">
          <div className="flex items-center space-x-1.5 text-[10px] uppercase font-bold text-neutral-400">
            <Move className="w-3.5 h-3.5 text-amber-400" />
            <span>원하는 위치 드래그 & 클릭</span>
          </div>
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            className={`relative aspect-square bg-black border-2 transition-colors overflow-hidden group select-none ${
              isDragging ? 'border-emerald-400 cursor-grabbing' : 'border-neutral-700 cursor-crosshair hover:border-neutral-500'
            }`}
            title="원하는 위치로 클릭하거나 마우스를 끌어다놓으세요"
          >
            <img
              src={imageUrl}
              alt="Source Canvas"
              className="w-full h-full object-contain pointer-events-none opacity-90"
              referrerPolicy="no-referrer"
            />
            
            {/* Grid Overlay for Guide */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20 border border-white/30">
              <div className="border border-white/20" />
              <div className="border border-white/20" />
              <div className="border border-white/20" />
              <div className="border border-white/20" />
              <div className="border border-white/20" />
              <div className="border border-white/20" />
              <div className="border border-white/20" />
              <div className="border border-white/20" />
              <div className="border border-white/20" />
            </div>

            {/* Target Crosshair Marker */}
            <div
              className="absolute w-7 h-7 border-2 border-emerald-400 bg-emerald-500/40 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none shadow-[0_0_12px_rgba(52,211,153,0.9)] flex items-center justify-center transition-transform"
              style={{ left: `${targetX}%`, top: `${targetY}%` }}
            >
              <div className="w-2 h-2 bg-white rounded-full shadow-sm" />
            </div>
          </div>
          <p className="text-[9px] text-neutral-500 text-center font-mono">
            클릭/드래그하여 초점을 맞춥니다
          </p>
        </div>

        {/* 1:1 Square Product Card Preview */}
        <div className="space-y-2">
          <div className="flex items-center space-x-1.5 text-[10px] uppercase font-bold text-neutral-400">
            <Square className="w-3.5 h-3.5 text-emerald-400" />
            <span>상품 그리드 (1:1 정사각형)</span>
          </div>
          <div className="relative aspect-square max-h-[220px] mx-auto bg-neutral-950 border-2 border-neutral-700 rounded-none overflow-hidden p-1 shadow-lg">
            <img
              src={imageUrl}
              alt="1:1 Preview"
              style={{ objectPosition: normalizedPosStr }}
              className="w-full h-full object-cover transition-all duration-200"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-2 left-2 bg-black/80 text-white text-[8px] font-mono px-1.5 py-0.5 border border-white/20">
              1:1 Card
            </span>
          </div>
        </div>

        {/* Mobile View Preview (9:16 Crop) */}
        <div className="space-y-2">
          <div className="flex items-center space-x-1.5 text-[10px] uppercase font-bold text-neutral-400">
            <Smartphone className="w-3.5 h-3.5 text-blue-400" />
            <span>모바일 화면 (9:16 세로)</span>
          </div>
          <div className="relative aspect-[9/16] max-h-[220px] mx-auto bg-neutral-950 border-2 border-neutral-700 rounded-lg overflow-hidden p-1 shadow-lg">
            <img
              src={imageUrl}
              alt="Mobile Preview"
              style={{ objectPosition: normalizedPosStr }}
              className="w-full h-full object-cover transition-all duration-200 rounded"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-2 left-2 bg-black/80 text-white text-[8px] font-mono px-1.5 py-0.5 rounded border border-white/20">
              Mobile 9:16
            </span>
          </div>
        </div>

        {/* Desktop View Preview (16:9 Crop) */}
        <div className="space-y-2">
          <div className="flex items-center space-x-1.5 text-[10px] uppercase font-bold text-neutral-400">
            <Monitor className="w-3.5 h-3.5 text-purple-400" />
            <span>PC 데스크톱 (16:9 와이드)</span>
          </div>
          <div className="relative aspect-[16/9] bg-neutral-950 border-2 border-neutral-700 rounded-lg overflow-hidden p-1 shadow-lg">
            <img
              src={imageUrl}
              alt="Desktop Preview"
              style={{ objectPosition: normalizedPosStr }}
              className="w-full h-full object-cover transition-all duration-200 rounded"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-2 left-2 bg-black/80 text-white text-[8px] font-mono px-1.5 py-0.5 rounded border border-white/20">
              PC 16:9
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
