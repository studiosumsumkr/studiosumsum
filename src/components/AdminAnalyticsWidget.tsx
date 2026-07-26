import React from 'react';
import { TrendingUp, Eye, ShoppingBag, Heart, BarChart3 } from 'lucide-react';
import { useCMS } from '../cms';
import { formatPrice } from '../utils/currency';

export const AdminAnalyticsWidget: React.FC = () => {
  const { products, wishlist, currency } = useCMS();

  const totalProducts = products.length;
  const inStockProducts = products.filter((p) => p.inStock !== false).length;
  const soldOutProducts = totalProducts - inStockProducts;
  const totalWishlists = wishlist.length;

  // Estimated store catalog value
  const totalCatalogValue = products.reduce((sum, p) => sum + p.price, 0);

  // Category breakdown
  const categoryCounts: Record<string, number> = {};
  products.forEach((p) => {
    categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
  });

  return (
    <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
        <div className="flex items-center space-x-2 text-neutral-900 dark:text-white">
          <BarChart3 className="w-5 h-5 text-amber-500" />
          <h3 className="text-sm font-bold uppercase tracking-wider font-display">
            스토어 실시간 통계 & 카탈로그 요약
          </h3>
        </div>
        <span className="text-[10px] font-mono text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded">
          LIVE METRICS
        </span>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-mono uppercase font-bold">전체 등록 오브제</span>
            <ShoppingBag className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-2xl font-mono font-extrabold text-neutral-900 dark:text-white block">
            {totalProducts}개
          </span>
          <span className="text-[9px] font-mono text-neutral-400">
            판매 중 {inStockProducts}개 / 품절 {soldOutProducts}개
          </span>
        </div>

        <div className="p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-mono uppercase font-bold">총 카탈로그 자산</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-mono font-extrabold text-neutral-900 dark:text-white block">
            {formatPrice(totalCatalogValue, currency)}
          </span>
          <span className="text-[9px] font-mono text-neutral-400">평균 단가 ~${Math.round(totalCatalogValue / (totalProducts || 1))}</span>
        </div>

        <div className="p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-mono uppercase font-bold">위시리스트 보관수</span>
            <Heart className="w-4 h-4 text-rose-500" />
          </div>
          <span className="text-2xl font-mono font-extrabold text-neutral-900 dark:text-white block">
            {totalWishlists}건
          </span>
          <span className="text-[9px] font-mono text-neutral-400">고객 관심도 지표</span>
        </div>

        <div className="p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-[10px] font-mono uppercase font-bold">카테고리 구성</span>
            <Eye className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-2xl font-mono font-extrabold text-neutral-900 dark:text-white block">
            {Object.keys(categoryCounts).length}개 분류
          </span>
          <span className="text-[9px] font-mono text-neutral-400">다양성 카탈로그</span>
        </div>
      </div>

      {/* Category Visual Bars */}
      <div className="space-y-3 pt-2">
        <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-400">
          카테고리별 오브제 분포
        </h4>
        <div className="space-y-2">
          {Object.entries(categoryCounts).map(([cat, count]) => {
            const percent = Math.round((count / totalProducts) * 100);
            return (
              <div key={cat} className="space-y-1">
                <div className="flex justify-between text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200">
                  <span>{cat}</span>
                  <span>
                    {count}개 ({percent}%)
                  </span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black dark:bg-white rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
