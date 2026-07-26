import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smartphone, Tablet, Monitor, X, RotateCw } from 'lucide-react';

interface AdminDevicePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDevicePreviewModal: React.FC<AdminDevicePreviewModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [key, setKey] = useState(0); // Refresh key

  if (!isOpen) return null;

  const currentUrl = window.location.origin;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex flex-col bg-neutral-950 text-white font-sans">
        {/* Top Control Bar */}
        <div className="h-14 px-6 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">
              DEVICE SIMULATION PREVIEW
            </span>
            <span className="text-[10px] font-mono text-neutral-400">| {currentUrl}</span>
          </div>

          <div className="flex items-center space-x-2 bg-neutral-800 p-1 rounded-xl">
            <button
              onClick={() => setDevice('mobile')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                device === 'mobile' ? 'bg-amber-400 text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>iPhone 15</span>
            </button>

            <button
              onClick={() => setDevice('tablet')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                device === 'tablet' ? 'bg-amber-400 text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Tablet className="w-4 h-4" />
              <span>iPad Air</span>
            </button>

            <button
              onClick={() => setDevice('desktop')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                device === 'desktop' ? 'bg-amber-400 text-black' : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>Studio Display</span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setKey((k) => k + 1)}
              className="p-2 text-neutral-400 hover:text-white cursor-pointer"
              title="새로고침"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 text-neutral-400 hover:text-white cursor-pointer">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Viewport Frame Canvas */}
        <div className="flex-1 overflow-auto p-8 flex items-center justify-center bg-neutral-900/50">
          <div
            className={`transition-all duration-500 bg-white shadow-2xl rounded-2xl overflow-hidden border-8 border-neutral-800 relative ${
              device === 'mobile'
                ? 'w-[390px] h-[780px]'
                : device === 'tablet'
                ? 'w-[768px] h-[950px]'
                : 'w-full h-full max-w-6xl max-h-[850px]'
            }`}
          >
            <iframe
              key={key}
              src={currentUrl}
              title="Device Frame Preview"
              className="w-full h-full border-none"
            />
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};
