import React, { useState } from 'react';
import { ChevronDown, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

export const ProductFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const items = [
    {
      icon: <Truck className="w-3.5 h-3.5 text-neutral-500" />,
      title: '배송 및 단단한 안심 포장 안내',
      content:
        '스튜디오 숨숨의 모든 도자기 및 수공예 세라믹 오브제는 충격 완화 친환경 완충재와 하드 패키지로 이중 포장되어 안전하게 배송됩니다. (기본 배송 1~3일 소요)',
    },
    {
      icon: <ShieldCheck className="w-3.5 h-3.5 text-neutral-500" />,
      title: '수공예 핸드메이드 소재의 자연스러운 특징',
      content:
        '자연 발색 황토 및 인조 수지가 조합된 고유 질감 제품으로, 오차 범위 내의 은근한 표면 모공, 기포, 미세한 빛깔 차이는 수공예품 고유의 아름다운 개성입니다.',
    },
    {
      icon: <RefreshCw className="w-3.5 h-3.5 text-neutral-500" />,
      title: '교환 및 반품 정책',
      content:
        '상품 수령 후 7일 이내 교환/반품 신청이 가능하며, 파손 수령 시 100% 무료 재발송 처리 도와드립니다.',
    },
  ];

  return (
    <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2">
      <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400">
        HELP & CARE GUIDE
      </p>

      <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div key={idx} className="py-2.5">
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full flex items-center justify-between text-left text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  {item.icon}
                  <span>{item.title}</span>
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <p className="mt-2 text-[11px] font-sans text-neutral-500 dark:text-neutral-400 leading-relaxed pl-5">
                  {item.content}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
