import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, Send, Sparkles, HelpCircle, Lock, KeyRound, CheckCircle2, MessageSquare, ShieldCheck, AlertCircle, RefreshCw } from 'lucide-react';
import { useCMS } from '../cms';
import { Product, QnaInquiry } from '../types';

interface AiConciergeWidgetProps {
  onProductClick: (p: Product) => void;
  isOpenExternal?: boolean;
  onCloseExternal?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  isFallback?: boolean;
}

export const AiConciergeWidget: React.FC<AiConciergeWidgetProps> = ({
  onProductClick,
  isOpenExternal,
  onCloseExternal
}) => {
  const { aiFaqs, inquiries, addInquiry } = useCMS();
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isOpenExternal !== undefined ? isOpenExternal : internalOpen;

  const handleClose = () => {
    if (onCloseExternal) {
      onCloseExternal();
    } else {
      setInternalOpen(false);
    }
  };

  const [activeTab, setActiveTab] = useState<'ai' | 'qna' | 'my_qna'>('ai');

  // AI Chat State
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: '안녕하세요! STUDIO SUMSUM AI 1:1 안내 센터입니다. 아래 등록된 자주 묻는 질문을 클릭하시거나 궁금한 점을 입력해 주세요.'
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1:1 Q&A Form State
  const [qnaForm, setQnaForm] = useState({
    userName: '',
    contact: '',
    title: '',
    content: '',
    password: '',
    isSecret: true
  });

  // Anti-Bot Captcha State
  const [captchaMath, setCaptchaMath] = useState({ num1: 5, num2: 7, answer: 12 });
  const [userCaptcha, setUserCaptcha] = useState('');
  const [captchaError, setCaptchaError] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // My Q&A Password unlock state
  const [unlockedInquiryIds, setUnlockedInquiryIds] = useState<string[]>([]);
  const [passwordInputs, setPasswordInputs] = useState<{ [id: string]: string }>({});
  const [passwordErrorIds, setPasswordErrorIds] = useState<{ [id: string]: boolean }>({});

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 15) + 3;
    const num2 = Math.floor(Math.random() * 15) + 2;
    setCaptchaMath({ num1, num2, answer: num1 + num2 });
    setUserCaptcha('');
    setCaptchaError(false);
  };

  useEffect(() => {
    if (isOpen) {
      generateCaptcha();
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages, activeTab]);

  const handleSend = (userQuery?: string) => {
    const text = userQuery || input;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text
    };

    setMessages(prev => [...prev, userMsg]);
    if (!userQuery) setInput('');

    setTimeout(() => {
      const qLower = text.toLowerCase().trim();

      // Search matching FAQ in aiFaqs
      const matchedFaq = aiFaqs.find(f => {
        const qTextMatch = f.question.toLowerCase().includes(qLower) || qLower.includes(f.question.toLowerCase());
        const keywordMatch = f.keywords ? f.keywords.split(',').some(k => k.trim() && qLower.includes(k.trim().toLowerCase())) : false;
        return qTextMatch || keywordMatch;
      });

      let replyText = '';
      let isFallback = false;

      if (matchedFaq) {
        replyText = matchedFaq.answer;
      } else {
        isFallback = true;
        replyText = `⚠️ [답변 불가 안내]\n등록된 질문 범위 이외의 내용은 AI가 직접 답변할 수 없습니다.\n\n해당 문의 사항은 상단 [1:1 Q&A 문의 접수] 탭에서 글을 남겨주시면 담당자가 신속히 확인 후 친절하게 답변드리겠습니다.`;
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        isFallback
      };

      setMessages(prev => [...prev, aiMsg]);
    }, 400);
  };

  const handleQnaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(userCaptcha) !== captchaMath.answer) {
      setCaptchaError(true);
      return;
    }

    if (!qnaForm.userName || !qnaForm.contact || !qnaForm.title || !qnaForm.content) {
      alert('모든 필수 입력 사항을 작성해 주세요.');
      return;
    }

    if (qnaForm.password.length < 4) {
      alert('비밀번호는 최소 4자리 이상 입력해 주세요.');
      return;
    }

    addInquiry({
      userName: qnaForm.userName,
      contact: qnaForm.contact,
      title: qnaForm.title,
      content: qnaForm.content,
      password: qnaForm.password,
      isSecret: qnaForm.isSecret
    });

    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setQnaForm({ userName: '', contact: '', title: '', content: '', password: '', isSecret: true });
      setActiveTab('my_qna');
    }, 1200);
  };

  const handleUnlockInquiry = (id: string, correctPassword?: string) => {
    const entered = passwordInputs[id] || '';
    if (entered === correctPassword || !correctPassword) {
      setUnlockedInquiryIds(prev => [...prev, id]);
      setPasswordErrorIds(prev => ({ ...prev, [id]: false }));
    } else {
      setPasswordErrorIds(prev => ({ ...prev, [id]: true }));
    }
  };

  return (
    <>
      {/* Floating Button (shown if external control not explicitly provided) */}
      {isOpenExternal === undefined && (
        <motion.button
          onClick={() => setInternalOpen(!internalOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 z-[90] p-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-2xl rounded-full flex items-center justify-center cursor-pointer ring-4 ring-amber-500/20"
          title="AI 1:1 상담 / Q&A"
        >
          {isOpen ? (
            <X className="w-6 h-6 text-black" />
          ) : (
            <div className="relative flex items-center space-x-2">
              <Bot className="w-6 h-6 text-black" />
              <span className="hidden md:inline font-mono font-black text-xs uppercase tracking-wider pr-1">
                AI Q&A 상담
              </span>
            </div>
          )}
        </motion.button>
      )}

      {/* Floating Chat Drawer Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-20 right-4 sm:right-6 z-[100] w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[85vh] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden font-sans text-neutral-900 dark:text-white"
          >
            {/* Header */}
            <div className="p-4 bg-neutral-900 text-white flex items-center justify-between border-b border-neutral-800">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-amber-500 text-black rounded-lg">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold font-display uppercase tracking-wider text-amber-400">
                    AI 1:1 CS & Q&A Center
                  </h4>
                  <span className="text-[10px] font-mono text-neutral-400 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    <span>실시간 자동 응답 시스템</span>
                  </span>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="grid grid-cols-3 bg-neutral-100 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-bold font-mono">
              <button
                onClick={() => setActiveTab('ai')}
                className={`py-2.5 flex items-center justify-center space-x-1 transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'ai'
                    ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-white dark:bg-neutral-900 font-extrabold'
                    : 'border-transparent text-neutral-500 hover:text-black dark:hover:text-white'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>AI FAQ</span>
              </button>
              <button
                onClick={() => setActiveTab('qna')}
                className={`py-2.5 flex items-center justify-center space-x-1 transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'qna'
                    ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-white dark:bg-neutral-900 font-extrabold'
                    : 'border-transparent text-neutral-500 hover:text-black dark:hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>1:1 문의작성</span>
              </button>
              <button
                onClick={() => setActiveTab('my_qna')}
                className={`py-2.5 flex items-center justify-center space-x-1 transition-colors cursor-pointer border-b-2 ${
                  activeTab === 'my_qna'
                    ? 'border-amber-500 text-amber-600 dark:text-amber-400 bg-white dark:bg-neutral-900 font-extrabold'
                    : 'border-transparent text-neutral-500 hover:text-black dark:hover:text-white'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Q&A 내역 ({inquiries.length})</span>
              </button>
            </div>

            {/* TAB 1: AI Chat & Registered FAQs */}
            {activeTab === 'ai' && (
              <div className="flex-1 flex flex-col h-full overflow-hidden bg-neutral-50/50 dark:bg-neutral-900/50">
                {/* Chat Messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                  {messages.map(m => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] p-3 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                          m.sender === 'user'
                            ? 'bg-neutral-900 text-white rounded-br-none'
                            : m.isFallback
                            ? 'bg-amber-500/10 border border-amber-500/30 text-neutral-900 dark:text-amber-200 rounded-bl-none font-sans'
                            : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-bl-none'
                        }`}
                      >
                        {m.text}
                      </div>

                      {m.isFallback && (
                        <button
                          onClick={() => setActiveTab('qna')}
                          className="mt-2 text-[10px] font-bold text-amber-600 dark:text-amber-400 underline flex items-center space-x-1 cursor-pointer"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>👉 지금 1:1 Q&A 문의 작성하러 가기</span>
                        </button>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* FAQ Quick Chips */}
                {aiFaqs.length > 0 && (
                  <div className="p-2 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
                    <p className="text-[10px] font-mono font-bold text-neutral-400 mb-1.5 px-1">
                      💡 자주 묻는 질문 선택 (클릭):
                    </p>
                    <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                      {aiFaqs.map(faq => (
                        <button
                          key={faq.id}
                          onClick={() => handleSend(faq.question)}
                          className="text-[10px] px-2.5 py-1 bg-neutral-100 dark:bg-neutral-800 hover:bg-amber-500 hover:text-black dark:hover:bg-amber-500 dark:hover:text-black text-neutral-700 dark:text-neutral-300 rounded-full border border-neutral-200 dark:border-neutral-700 transition-colors text-left cursor-pointer truncate max-w-full"
                        >
                          {faq.question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input Bar */}
                <div className="p-3 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex items-center space-x-2">
                  <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="질문을 입력하세요..."
                    className="flex-1 px-3 py-2 text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 text-neutral-900 dark:text-white"
                  />
                  <button
                    onClick={() => handleSend()}
                    className="p-2 bg-amber-500 hover:bg-amber-400 text-black rounded-xl cursor-pointer transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: 1:1 Q&A Inquiry Form (With Anti-Bot Math & Password) */}
            {activeTab === 'qna' && (
              <div className="flex-1 p-4 overflow-y-auto bg-white dark:bg-neutral-900 text-xs">
                {submitSuccess ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-10">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-bounce" />
                    <h4 className="text-sm font-bold">1:1 문의가 성공적으로 접수되었습니다!</h4>
                    <p className="text-neutral-400 text-[11px]">
                      담당자가 확인 후 정성스럽게 답변드리겠습니다. 작성하신 내역은 'Q&A 내역' 탭에서 확인하실 수 있습니다.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleQnaSubmit} className="space-y-3">
                    <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-700 dark:text-amber-300">
                      🔒 1:1 고객 문의 센터 (비밀번호 및 봇 방지 보안 적용)
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500 mb-1">작성자 이름 *</label>
                        <input
                          type="text"
                          required
                          value={qnaForm.userName}
                          onChange={e => setQnaForm({ ...qnaForm, userName: e.target.value })}
                          placeholder="홍길동"
                          className="w-full p-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-neutral-500 mb-1">연락처/이메일 *</label>
                        <input
                          type="text"
                          required
                          value={qnaForm.contact}
                          onChange={e => setQnaForm({ ...qnaForm, contact: e.target.value })}
                          placeholder="010-0000-0000 / email"
                          className="w-full p-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-neutral-500 mb-1">문의 제목 *</label>
                      <input
                        type="text"
                        required
                        value={qnaForm.title}
                        onChange={e => setQnaForm({ ...qnaForm, title: e.target.value })}
                        placeholder="문의하실 제목을 입력하세요."
                        className="w-full p-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-neutral-500 mb-1">문의 내용 *</label>
                      <textarea
                        required
                        rows={3}
                        value={qnaForm.content}
                        onChange={e => setQnaForm({ ...qnaForm, content: e.target.value })}
                        placeholder="상세한 문의 내용을 남겨주시면 빠르게 안내드리겠습니다."
                        className="w-full p-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-neutral-500 mb-1">비밀번호 (4자리 이상) *</label>
                      <input
                        type="password"
                        required
                        minLength={4}
                        value={qnaForm.password}
                        onChange={e => setQnaForm({ ...qnaForm, password: e.target.value })}
                        placeholder="조회 시 필요한 비밀번호"
                        className="w-full p-2 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-mono"
                      />
                    </div>

                    {/* Anti-Bot Captcha Section */}
                    <div className="p-3 bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold flex items-center gap-1 text-amber-600 dark:text-amber-400">
                          <ShieldCheck className="w-3.5 h-3.5" /> 봇 자동 등록 방지 (Anti-Bot)
                        </span>
                        <button
                          type="button"
                          onClick={generateCaptcha}
                          className="text-[9px] text-neutral-400 hover:text-black dark:hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3" /> 새로고침
                        </button>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="p-2 bg-amber-500 text-black font-mono font-bold rounded-lg text-sm tracking-widest">
                          {captchaMath.num1} + {captchaMath.num2} = ?
                        </span>
                        <input
                          type="number"
                          required
                          value={userCaptcha}
                          onChange={e => {
                            setUserCaptcha(e.target.value);
                            setCaptchaError(false);
                          }}
                          placeholder="정답 입력"
                          className="flex-1 p-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 rounded-lg text-xs font-mono"
                        />
                      </div>
                      {captchaError && (
                        <p className="text-[10px] text-rose-500 font-bold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> 봇 방지 정답이 일치하지 않습니다. 다시 계산해 주세요.
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-colors shadow-lg"
                    >
                      1:1 Q&A 문의 접수하기
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* TAB 3: My Q&A List with Password Unlock */}
            {activeTab === 'my_qna' && (
              <div className="flex-1 p-4 overflow-y-auto bg-neutral-50/50 dark:bg-neutral-900/50 text-xs space-y-3">
                {inquiries.length === 0 ? (
                  <div className="text-center py-12 text-neutral-400 space-y-2">
                    <MessageSquare className="w-8 h-8 mx-auto opacity-40" />
                    <p className="text-xs">등록된 1:1 Q&A 문의가 없습니다.</p>
                  </div>
                ) : (
                  inquiries.map(inquiry => {
                    const isUnlocked = !inquiry.password || unlockedInquiryIds.includes(inquiry.id);
                    const isError = passwordErrorIds[inquiry.id];

                    return (
                      <div
                        key={inquiry.id}
                        className="p-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl space-y-2 shadow-sm"
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${
                              inquiry.status === 'ANSWERED'
                                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-300'
                                : 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-300'
                            }`}
                          >
                            {inquiry.status === 'ANSWERED' ? '답변 완료' : '답변 대기중'}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-400">{inquiry.createdAt}</span>
                        </div>

                        <h5 className="font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                          {inquiry.password && <Lock className="w-3 h-3 text-amber-500 shrink-0" />}
                          <span className="truncate">{inquiry.title}</span>
                          <span className="text-[10px] font-normal text-neutral-400">({inquiry.userName})</span>
                        </h5>

                        {/* Lock / Password Verification Box */}
                        {!isUnlocked ? (
                          <div className="p-2.5 bg-neutral-100 dark:bg-neutral-900 rounded-lg space-y-1.5 border border-neutral-200 dark:border-neutral-700">
                            <p className="text-[10px] text-neutral-500 font-mono flex items-center gap-1">
                              <KeyRound className="w-3 h-3 text-amber-500" /> 비밀글입니다. 설정하신 비밀번호를 입력하세요:
                            </p>
                            <div className="flex items-center space-x-2">
                              <input
                                type="password"
                                placeholder="비밀번호"
                                value={passwordInputs[inquiry.id] || ''}
                                onChange={e => setPasswordInputs({ ...passwordInputs, [inquiry.id]: e.target.value })}
                                onKeyDown={e => e.key === 'Enter' && handleUnlockInquiry(inquiry.id, inquiry.password)}
                                className="flex-1 p-1.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded text-xs font-mono"
                              />
                              <button
                                onClick={() => handleUnlockInquiry(inquiry.id, inquiry.password)}
                                className="px-3 py-1.5 bg-amber-500 text-black font-bold text-[10px] rounded hover:bg-amber-400 cursor-pointer"
                              >
                                확인
                              </button>
                            </div>
                            {isError && (
                              <p className="text-[9px] text-rose-500 font-bold">비밀번호가 일치하지 않습니다.</p>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2 pt-1 border-t border-neutral-100 dark:border-neutral-700">
                            <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap bg-neutral-50 dark:bg-neutral-900/50 p-2 rounded-lg text-xs">
                              {inquiry.content}
                            </p>

                            {inquiry.adminAnswer ? (
                              <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs space-y-1">
                                <div className="flex items-center justify-between text-[10px] font-bold text-amber-600 dark:text-amber-400">
                                  <span>[관리자 답변]</span>
                                  <span className="font-mono text-neutral-400">{inquiry.answeredAt}</span>
                                </div>
                                <p className="text-neutral-900 dark:text-neutral-100 whitespace-pre-wrap font-sans">
                                  {inquiry.adminAnswer}
                                </p>
                              </div>
                            ) : (
                              <p className="text-[10px] text-neutral-400 italic">
                                ⏳ 관리자가 답변을 작성 중입니다. 잠시만 기다려 주세요.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
