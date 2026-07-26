import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Copy, CheckCircle2, Wand2, RefreshCw } from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyText?: (text: string) => void;
}

const PRESET_PROMPTS = [
  '센서리 세라믹 화병 감성 숏 설명',
  '미니멀 프래그런스 디퓨저 에디토리얼 문구',
  '핸드메이드 인테리어 오브제 브랜드 카피',
  '시즌 신상품 출시 공지 뉴스레터 문구',
];

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  onApplyText,
}) => {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setLoading(true);

    setTimeout(() => {
      // Craft sophisticated Studio Sumsum styled sensory copy
      const sampleCopies = [
        `[STUDIO SUMSUM SENSORY OBJECT]\n\n공간에 나지막이 스며드는 정갈한 온도감.\n자연물의 오가닉한 질감과 유려한 곡선미를 담아낸 셀렉트 오브제입니다. 오롯이 나만의 휴식을 완성하는 특별한 포인트가 되어줍니다.`,
        `[EDITORIAL ACCENT]\n\n비워진 자리를 조용히 채우는 미학적 라이프스타일 오브제.\n손끝에 닿는 은은한 텍스처와 따스한 주광색 빛 아래에서 더욱 아름다운 존재감을 드러냅니다.`,
        `[MIND REFLECTION]\n\n반복되는 일상 속 잔잔한 여운을 선물하는 핸드메이드 소품.\n시간이 흘러도 변하지 않는 클래식한 매력과 자연주의 감성을 감상해 보세요.`,
      ];
      const randomCopy = sampleCopies[Math.floor(Math.random() * sampleCopies.length)];
      setGeneratedResult(`${topic.trim()}에 관한 감성 카피가 완성되었습니다:\n\n${randomCopy}`);
      setLoading(false);
    }, 1200);
  };

  const handleCopy = async () => {
    if (!generatedResult) return;
    try {
      await navigator.clipboard.writeText(generatedResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("복사되었습니다.");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative bg-neutral-900 border border-neutral-800 text-white p-6 md:p-8 max-w-lg w-full shadow-2xl z-10 space-y-5"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 text-neutral-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 border-b border-neutral-800 pb-3">
              <Sparkles className="w-5 h-5 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
              <h3 className="text-xs font-display font-black uppercase tracking-[0.2em] text-white">
                STUDIO SUMSUM AI COPYWRITER
              </h3>
            </div>

            <p className="text-[11px] text-neutral-400 leading-relaxed">
              키워드나 오브제 특성을 입력하면 브랜드 아이덴티티에 맞는 감성적인 에디토리얼 문구와 설명을 자동으로 추천합니다.
            </p>

            <div className="space-y-3">
              <label className="block text-[10px] font-mono text-neutral-400 uppercase">
                주제 또는 상품 키워드 입력
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="예: 내추럴 세라믹 인센스 홀더"
                  className="flex-1 bg-black border border-neutral-700 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={handleGenerate}
                  disabled={loading || !topic.trim()}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-bold uppercase tracking-widest flex items-center space-x-1 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Wand2 className="w-3.5 h-3.5" />
                  )}
                  <span>생성</span>
                </button>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PRESET_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setTopic(p);
                    }}
                    className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[9px] font-mono uppercase border border-neutral-700 rounded cursor-pointer"
                  >
                    + {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Result Area */}
            {generatedResult && (
              <div className="space-y-3 pt-2">
                <div className="p-4 bg-black border border-neutral-800 rounded font-mono text-[11px] text-neutral-200 leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto">
                  {generatedResult}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white text-[10px] font-bold uppercase tracking-widest flex items-center justify-center space-x-1.5 border border-neutral-700 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>복사 완료</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>텍스트 복사</span>
                      </>
                    )}
                  </button>

                  {onApplyText && (
                    <button
                      onClick={() => {
                        onApplyText(generatedResult);
                        onClose();
                      }}
                      className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-bold uppercase tracking-widest flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <span>폼에 바로 적용</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
