import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Truck, CheckCircle2, Clock, MapPin, Package, Search } from 'lucide-react';

interface ShippingTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface TrackingStatus {
  trackingNumber: string;
  status: 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Processing';
  carrier: string;
  estimatedDelivery: string;
  origin: string;
  destination: string;
  timeline: {
    time: string;
    location: string;
    description: string;
    completed: boolean;
  }[];
}

export const ShippingTrackerModal: React.FC<ShippingTrackerModalProps> = ({ isOpen, onClose }) => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [result, setResult] = useState<TrackingStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResult({
        trackingNumber: trackingNumber.toUpperCase(),
        status: 'In Transit',
        carrier: 'CJ 대한통운 / Global Express',
        estimatedDelivery: '2026.07.28 (Tue)',
        origin: 'STUDIO SUMSUM 물류 센터 (Seoul, KR)',
        destination: '서울특별시 강남구 테헤란로 123',
        timeline: [
          { time: '07.26 10:30', location: '서울 강남 Hub', description: '간선하차 완료 및 배송 준비 중', completed: true },
          { time: '07.25 18:45', location: '옥천 Hub', description: '허브터미널 입고 및 분류 작업 중', completed: true },
          { time: '07.25 14:10', location: 'STUDIO SUMSUM Center', description: '상품 출고 완료 및 운송장 등록', completed: true },
          { time: '07.25 09:00', location: 'Order Management', description: '주문 확인 및 수제 포장 작업 완료', completed: true },
        ]
      });
    }, 600);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white text-neutral-900 rounded-none border border-neutral-200 shadow-2xl p-6 sm:p-8 overflow-hidden z-10"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-neutral-100 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-neutral-800" />
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900">Real-Time Shipping Tracker</h3>
                  <p className="text-[10px] uppercase text-neutral-400 tracking-wider">실시간 배송 조회 및 여정 추적</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-neutral-100 transition-colors">
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>

            <form onSubmit={handleTrack} className="mb-6">
              <label className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 block mb-2">
                Order or Tracking Number (운송장 번호 또는 주문번호)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="예: SUMSUM-98214 또는 CJ12345678"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="flex-1 border border-neutral-200 p-3 text-xs outline-none focus:border-neutral-900 transition-colors font-mono uppercase"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-neutral-900 text-white px-5 py-3 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all flex items-center space-x-2"
                >
                  <Search className="w-4 h-4" />
                  <span>{loading ? '조회 중...' : '조회'}</span>
                </button>
              </div>
            </form>

            {result && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 border-t border-neutral-100 pt-6">
                <div className="bg-neutral-50 p-4 border border-neutral-100 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-neutral-500">{result.trackingNumber}</span>
                    <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider">
                      {result.status}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-neutral-900">택배사: {result.carrier}</div>
                  <div className="text-[11px] text-neutral-600">예상 도착일: <strong className="text-neutral-900">{result.estimatedDelivery}</strong></div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">배송 현황 라인</p>
                  <div className="space-y-3 relative pl-6 border-l-2 border-neutral-200">
                    {result.timeline.map((step, idx) => (
                      <div key={idx} className="relative">
                        <div className={`absolute -left-[31px] top-0 w-4 h-4 rounded-full border-2 ${step.completed ? 'bg-neutral-900 border-neutral-900' : 'bg-white border-neutral-300'}`} />
                        <div className="text-[10px] font-mono text-neutral-400">{step.time}</div>
                        <div className="text-xs font-bold text-neutral-800">{step.description}</div>
                        <div className="text-[10px] text-neutral-500">{step.location}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
