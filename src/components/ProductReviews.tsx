import React, { useState } from 'react';
import { Star, MessageSquare, Plus, Check } from 'lucide-react';
import { useCMS } from '../cms';
import { ProductReview } from '../types';

interface ProductReviewsProps {
  productId: string;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const { reviews, addReview } = useCMS();
  const [showForm, setShowForm] = useState(false);
  const [userName, setUserName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const productReviews = reviews.filter((r) => r.productId === productId);
  const avgRating = productReviews.length
    ? (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
    : '5.0';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) return;
    addReview({
      productId,
      userName: userName.trim(),
      rating,
      comment: comment.trim(),
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
      setUserName('');
      setComment('');
    }, 1500);
  };

  return (
    <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
      {/* Summary Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-amber-500">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`w-3.5 h-3.5 ${
                  s <= Math.round(Number(avgRating)) ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white">
            {avgRating} ({productReviews.length} 리뷰)
          </span>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 hover:underline flex items-center space-x-1 cursor-pointer"
        >
          <Plus className="w-3 h-3" />
          <span>리뷰 작성하기</span>
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg space-y-3">
          <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
            구매 후기 & 평점 남기기
          </h5>

          <div>
            <label className="text-[10px] font-mono uppercase text-neutral-500 block mb-1">작성자 성함</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="예: 김민수"
              required
              className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded outline-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-neutral-500 block mb-1">별점 선택</label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  className="p-1 text-amber-400 cursor-pointer"
                >
                  <Star className={`w-5 h-5 ${s <= rating ? 'fill-amber-400' : 'text-neutral-300'}`} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-neutral-500 block mb-1">상세 후기</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="오브제의 실물 느낌, 질감, 디스플레이 경험에 대해 공유해 주세요."
              required
              rows={3}
              className="w-full px-3 py-2 text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded outline-none"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 text-[10px] font-mono text-neutral-500 uppercase hover:underline"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={submitted}
              className="px-4 py-1.5 text-[10px] font-mono font-bold uppercase bg-black text-white dark:bg-white dark:text-black rounded cursor-pointer flex items-center space-x-1"
            >
              {submitted ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>등록 완료!</span>
                </>
              ) : (
                <span>등록하기</span>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Review List */}
      <div className="space-y-2.5 max-h-48 overflow-y-auto">
        {productReviews.length === 0 ? (
          <p className="text-[11px] font-mono text-neutral-400 italic">
            아직 등록된 후기가 없습니다. 첫 번째 리뷰어가 되어 보세요!
          </p>
        ) : (
          productReviews.map((r) => (
            <div
              key={r.id}
              className="p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 rounded-lg space-y-1"
            >
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="font-bold text-neutral-900 dark:text-white">{r.userName}</span>
                <span className="text-neutral-400">{r.createdAt}</span>
              </div>
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3 h-3 ${s <= r.rating ? 'fill-amber-400' : 'text-neutral-300'}`}
                  />
                ))}
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 font-sans leading-relaxed">
                {r.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
