import React from 'react';
import { Smartphone, Monitor, Target, Check } from 'lucide-react';

interface ImageFocalPickerProps {
  imageUrl: string;
  position: string;
  onChange: (newPosition: string) => void;
  title?: string;
}

const PRESETS = [
  { label: '중앙 (기본)', value: 'center', desc: '중앙 기준 정밀 맞춰짐' },
  { label: '상단 (위쪽 위주)', value: 'top', desc: '인물/제품 위쪽 영역 강조' },
  { label: '상단 25%', value: '50% 25%', desc: '상단 1/4 위치 초점' },
  { label: '하단 (아래쪽 위주)', value: 'bottom', desc: '아래쪽 영역 강조' },
  { label: '하단 75%', value: '50% 75%', desc: '하단 3/4 위치 초점' },
  { label: '좌측', value: 'left', desc: '왼쪽 영역 중심' },
  { label: '우측', value: 'right', desc: '오른쪽 영역 중심' },
];

export const ImageFocalPicker: React.FC<ImageFocalPickerProps> = ({
  imageUrl,
  position = 'center',
  onChange,
  title = '사진 위치 및 크롭 영역 (Focal Point) 조절'
}) => {
  if (!imageUrl) return null;

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
    onChange(`${x}% ${y}%`);
  };

  // Extract percentage values if available for target ring
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
      targetX = parseInt(parts[0]) || 50;
      targetY = parseInt(parts[1]) || 50;
    }
  }

  return (
    <div className="bg-neutral-900 text-white p-5 border border-neutral-800 space-y-5 rounded-none mt-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3">
        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-100">{title}</h4>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 border border-emerald-800 font-bold">
          현재 좌표: {position}
        </span>
      </div>

      <p className="text-[11px] text-neutral-400 leading-relaxed">
        💡 <strong>사진 클릭 또는 버튼 선택:</strong> 원본 사진을 클릭하면 그 위치가 초점(Focal Point)으로 지정되어, 모바일/데스크톱 화면 크기에 따라 잘릴 때 해당 영역이 우선적으로 표시됩니다.
      </p>

      {/* Preset Position Buttons */}
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((p) => {
          const isSelected = position === p.value;
          return (
            <button
              key={p.value}
              type="button"
              onClick={() => onChange(p.value)}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border flex items-center space-x-1 cursor-pointer ${
                isSelected 
                  ? 'bg-emerald-500 text-black border-emerald-400 shadow-sm' 
                  : 'bg-neutral-800 text-neutral-300 border-neutral-700 hover:border-neutral-500 hover:text-white'
              }`}
            >
              {isSelected && <Check className="w-3 h-3" />}
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      {/* Live Device Crop Preview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* Interactive Click Canvas */}
        <div className="space-y-2">
          <div className="flex items-center space-x-1.5 text-[10px] uppercase font-bold text-neutral-400">
            <Target className="w-3.5 h-3.5 text-amber-400" />
            <span>사진 직접 클릭하여 초점 지정</span>
          </div>
          <div 
            onClick={handleImageClick}
            className="relative aspect-square bg-black border border-neutral-700 cursor-crosshair overflow-hidden group select-none"
            title="원하는 포인트를 클릭하세요"
          >
            <img 
              src={imageUrl} 
              alt="Source" 
              className="w-full h-full object-contain pointer-events-none opacity-90"
              referrerPolicy="no-referrer"
            />
            {/* Focal Point Target Marker */}
            <div 
              className="absolute w-6 h-6 border-2 border-emerald-400 bg-emerald-500/30 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none shadow-[0_0_10px_rgba(52,211,153,0.8)] flex items-center justify-center"
              style={{ left: `${targetX}%`, top: `${targetY}%` }}
            >
              <div className="w-1.5 h-1.5 bg-emerald-300 rounded-full" />
            </div>
          </div>
          <p className="text-[9px] text-neutral-500 text-center">원하는 지점을 클릭하면 초점이 이동합니다</p>
        </div>

        {/* Mobile View Preview (9:16 Crop) */}
        <div className="space-y-2">
          <div className="flex items-center space-x-1.5 text-[10px] uppercase font-bold text-neutral-400">
            <Smartphone className="w-3.5 h-3.5 text-blue-400" />
            <span>모바일 화면 (세로 크롭 결과)</span>
          </div>
          <div className="relative aspect-[9/16] max-h-[220px] mx-auto bg-neutral-950 border-2 border-neutral-700 rounded-lg overflow-hidden p-1 shadow-lg">
            <img 
              src={imageUrl} 
              alt="Mobile Preview" 
              style={{ objectPosition: position }}
              className="w-full h-full object-cover transition-all duration-300 rounded"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 border border-white/10 pointer-events-none rounded" />
            <span className="absolute bottom-2 left-2 bg-black/80 text-white text-[8px] font-mono px-1.5 py-0.5 rounded">Mobile 9:16</span>
          </div>
        </div>

        {/* Desktop View Preview (16:9 Crop) */}
        <div className="space-y-2">
          <div className="flex items-center space-x-1.5 text-[10px] uppercase font-bold text-neutral-400">
            <Monitor className="w-3.5 h-3.5 text-purple-400" />
            <span>데스크톱 화면 (가로 크롭 결과)</span>
          </div>
          <div className="relative aspect-[16/9] bg-neutral-950 border-2 border-neutral-700 rounded-lg overflow-hidden p-1 shadow-lg">
            <img 
              src={imageUrl} 
              alt="Desktop Preview" 
              style={{ objectPosition: position }}
              className="w-full h-full object-cover transition-all duration-300 rounded"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 border border-white/10 pointer-events-none rounded" />
            <span className="absolute bottom-2 left-2 bg-black/80 text-white text-[8px] font-mono px-1.5 py-0.5 rounded">PC Desktop 16:9</span>
          </div>
        </div>
      </div>
    </div>
  );
};
