import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, MessageSquare, Plus, Trash2, Edit2, Save, Lock, CheckCircle2, Sparkles, Send } from 'lucide-react';
import { useCMS } from '../cms';
import { AiFaq, QnaInquiry } from '../types';

interface AdminInquiryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminInquiryManagerModal: React.FC<AdminInquiryManagerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { aiFaqs, inquiries, addAiFaq, updateAiFaq, deleteAiFaq, answerInquiry, deleteInquiry } = useCMS();
  const [activeTab, setActiveTab] = useState<'faq' | 'qna'>('qna');

  // New FAQ state
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');
  const [newFaqKeywords, setNewFaqKeywords] = useState('');
  const [editingFaqId, setEditingFaqId] = useState<string | null>(null);
  const [editFaqQuestion, setEditFaqQuestion] = useState('');
  const [editFaqAnswer, setEditFaqAnswer] = useState('');
  const [editFaqKeywords, setEditFaqKeywords] = useState('');

  // Q&A Answer State
  const [answeringInquiryId, setAnsweringInquiryId] = useState<string | null>(null);
  const [adminAnswerText, setAdminAnswerText] = useState('');

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) {
      alert('질문과 답변을 모두 입력해주세요.');
      return;
    }
    addAiFaq(newFaqQuestion, newFaqAnswer, newFaqKeywords);
    setNewFaqQuestion('');
    setNewFaqAnswer('');
    setNewFaqKeywords('');
  };

  const handleStartEditFaq = (faq: AiFaq) => {
    setEditingFaqId(faq.id);
    setEditFaqQuestion(faq.question);
    setEditFaqAnswer(faq.answer);
    setEditFaqKeywords(faq.keywords || '');
  };

  const handleSaveEditFaq = (id: string) => {
    updateAiFaq(id, editFaqQuestion, editFaqAnswer, editFaqKeywords);
    setEditingFaqId(null);
  };

  const handleSaveAnswer = (id: string) => {
    if (!adminAnswerText.trim()) {
      alert('답변 내용을 입력해 주세요.');
      return;
    }
    answerInquiry(id, adminAnswerText);
    setAnsweringInquiryId(null);
    setAdminAnswerText('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 font-sans">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md cursor-pointer"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 md:p-8 max-w-3xl w-full shadow-2xl rounded-2xl z-10 space-y-4 max-h-[88vh] flex flex-col"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 text-neutral-900 dark:text-white">
              <Bot className="w-6 h-6 text-amber-500" />
              <div>
                <h3 className="text-base font-bold font-display uppercase tracking-wider">
                  AI FAQ 및 1:1 Q&A 통합 관리자
                </h3>
                <p className="text-[10px] font-mono text-neutral-400">
                  AI가 답변할 FAQ 질문/답변 설정 및 고객 1:1 Q&A 문의 답변을 처리합니다.
                </p>
              </div>
            </div>

            {/* Sub Tabs */}
            <div className="grid grid-cols-2 bg-neutral-100 dark:bg-neutral-950 p-1 rounded-xl text-xs font-bold font-mono">
              <button
                onClick={() => setActiveTab('qna')}
                className={`py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center space-x-2 ${
                  activeTab === 'qna' ? 'bg-amber-500 text-black shadow-sm font-extrabold' : 'text-neutral-500 hover:text-white'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>접수된 1:1 Q&A 문의 ({inquiries.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('faq')}
                className={`py-2 rounded-lg transition-colors cursor-pointer flex items-center justify-center space-x-2 ${
                  activeTab === 'faq' ? 'bg-amber-500 text-black shadow-sm font-extrabold' : 'text-neutral-500 hover:text-white'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>AI FAQ 응답 규칙 설정 ({aiFaqs.length})</span>
              </button>
            </div>

            {/* TAB 1: 1:1 Q&A List */}
            {activeTab === 'qna' && (
              <div className="flex-1 overflow-y-auto space-y-3 p-1">
                {inquiries.length === 0 ? (
                  <div className="py-16 text-center text-neutral-400 font-mono text-xs italic">
                    접수된 1:1 Q&A 문의글이 없습니다.
                  </div>
                ) : (
                  inquiries.map(inquiry => (
                    <div
                      key={inquiry.id}
                      className="p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono ${
                              inquiry.status === 'ANSWERED'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            }`}
                          >
                            {inquiry.status === 'ANSWERED' ? '답변 완료' : '답변 대기'}
                          </span>
                          <span className="font-bold text-neutral-900 dark:text-white">{inquiry.userName}</span>
                          <span className="text-[10px] font-mono text-neutral-400">({inquiry.contact})</span>
                          {inquiry.password && (
                            <span className="text-[9px] font-mono bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-amber-500 flex items-center gap-0.5">
                              <Lock className="w-2.5 h-2.5" /> 비번: {inquiry.password}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-mono text-neutral-400">{inquiry.createdAt}</span>
                          <button
                            onClick={() => deleteInquiry(inquiry.id)}
                            className="p-1 text-rose-400 hover:text-rose-600 cursor-pointer"
                            title="삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h5 className="font-bold text-neutral-900 dark:text-white text-sm">{inquiry.title}</h5>
                      <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap bg-white dark:bg-neutral-900 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800">
                        {inquiry.content}
                      </p>

                      {/* Admin Answer Box */}
                      {inquiry.adminAnswer ? (
                        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-bold text-amber-600 dark:text-amber-400">
                            <span>[작성된 관리자 답변]</span>
                            <span className="font-mono text-neutral-400">{inquiry.answeredAt}</span>
                          </div>
                          <p className="text-neutral-900 dark:text-white whitespace-pre-wrap">{inquiry.adminAnswer}</p>
                          <button
                            onClick={() => {
                              setAnsweringInquiryId(inquiry.id);
                              setAdminAnswerText(inquiry.adminAnswer || '');
                            }}
                            className="text-[10px] text-amber-500 underline font-bold mt-1 cursor-pointer block"
                          >
                            답변 수정하기
                          </button>
                        </div>
                      ) : (
                        <div>
                          {answeringInquiryId === inquiry.id ? (
                            <div className="space-y-2 mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                              <textarea
                                rows={3}
                                value={adminAnswerText}
                                onChange={e => setAdminAnswerText(e.target.value)}
                                placeholder="고객에게 전달할 공식 답변을 입력하세요."
                                className="w-full p-2.5 bg-white dark:bg-neutral-900 border border-amber-500 rounded-lg text-xs"
                              />
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => setAnsweringInquiryId(null)}
                                  className="px-3 py-1 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded text-xs cursor-pointer"
                                >
                                  취소
                                </button>
                                <button
                                  onClick={() => handleSaveAnswer(inquiry.id)}
                                  className="px-3 py-1 bg-amber-500 text-black font-bold rounded text-xs cursor-pointer flex items-center space-x-1"
                                >
                                  <Send className="w-3 h-3" />
                                  <span>답변 등록</span>
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setAnsweringInquiryId(inquiry.id);
                                setAdminAnswerText('');
                              }}
                              className="px-3 py-1.5 bg-amber-500 text-black font-extrabold rounded-lg text-[11px] cursor-pointer hover:bg-amber-400 transition-colors"
                            >
                              ✍️ 답변 작성하기
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 2: AI FAQ Settings */}
            {activeTab === 'faq' && (
              <div className="flex-1 overflow-y-auto space-y-4 p-1">
                {/* Add New FAQ Form */}
                <form onSubmit={handleAddFaq} className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl space-y-3 text-xs">
                  <h4 className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 text-xs">
                    <Plus className="w-4 h-4" /> 새로운 AI FAQ (질문/답변) 규칙 등록
                  </h4>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-500 mb-1">고객 질문 내용 *</label>
                    <input
                      type="text"
                      required
                      value={newFaqQuestion}
                      onChange={e => setNewFaqQuestion(e.target.value)}
                      placeholder="예: 교환 및 반품 절차가 궁금합니다."
                      className="w-full p-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-500 mb-1">AI 자동 답변 내용 *</label>
                    <textarea
                      required
                      rows={2}
                      value={newFaqAnswer}
                      onChange={e => setNewFaqAnswer(e.target.value)}
                      placeholder="AI가 이 질문에 답할 정확한 안내 텍스트를 입력하세요."
                      className="w-full p-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-neutral-500 mb-1">매칭 키워드 (쉼표 구분)</label>
                    <input
                      type="text"
                      value={newFaqKeywords}
                      onChange={e => setNewFaqKeywords(e.target.value)}
                      placeholder="교환, 반품, 환불, 취소"
                      className="w-full p-2 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg font-mono text-[11px]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-lg cursor-pointer transition-colors shadow-xs"
                  >
                    FAQ 규칙 추가하기
                  </button>
                </form>

                {/* FAQ List */}
                <div className="space-y-2">
                  <p className="text-[10px] font-mono font-bold text-neutral-400 uppercase">
                    현재 등록된 AI FAQ 목록 ({aiFaqs.length}개):
                  </p>
                  {aiFaqs.map(faq => (
                    <div
                      key={faq.id}
                      className="p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-2 text-xs"
                    >
                      {editingFaqId === faq.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editFaqQuestion}
                            onChange={e => setEditFaqQuestion(e.target.value)}
                            className="w-full p-2 bg-white dark:bg-neutral-900 border border-amber-500 rounded-lg"
                          />
                          <textarea
                            rows={2}
                            value={editFaqAnswer}
                            onChange={e => setEditFaqAnswer(e.target.value)}
                            className="w-full p-2 bg-white dark:bg-neutral-900 border border-amber-500 rounded-lg resize-none"
                          />
                          <input
                            type="text"
                            value={editFaqKeywords}
                            onChange={e => setEditFaqKeywords(e.target.value)}
                            className="w-full p-2 bg-white dark:bg-neutral-900 border border-amber-500 rounded-lg font-mono text-[11px]"
                          />
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => setEditingFaqId(null)}
                              className="px-3 py-1 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded cursor-pointer"
                            >
                              취소
                            </button>
                            <button
                              onClick={() => handleSaveEditFaq(faq.id)}
                              className="px-3 py-1 bg-amber-500 text-black font-bold rounded cursor-pointer"
                            >
                              저장
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <h5 className="font-bold text-neutral-900 dark:text-white text-xs">Q. {faq.question}</h5>
                            <div className="flex items-center space-x-1">
                              <button
                                onClick={() => handleStartEditFaq(faq)}
                                className="p-1 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteAiFaq(faq.id)}
                                className="p-1 text-rose-400 hover:text-rose-600 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-neutral-600 dark:text-neutral-300 text-[11px] whitespace-pre-wrap bg-white dark:bg-neutral-900 p-2 rounded-lg border border-neutral-200 dark:border-neutral-800">
                            A. {faq.answer}
                          </p>
                          {faq.keywords && (
                            <p className="text-[9px] font-mono text-neutral-400 mt-1">
                              키워드: {faq.keywords}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
