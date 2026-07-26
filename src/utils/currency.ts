export type CurrencyType = 'USD' | 'KRW' | 'EUR' | 'JPY';

const RATES: Record<CurrencyType, { rate: number; symbol: string; prefix: boolean }> = {
  USD: { rate: 1, symbol: '$', prefix: true },
  KRW: { rate: 1380, symbol: '₩', prefix: true },
  EUR: { rate: 0.92, symbol: '€', prefix: true },
  JPY: { rate: 155, symbol: '¥', prefix: true },
};

export const formatPrice = (priceInUSD: number, currency: CurrencyType = 'USD'): string => {
  const config = RATES[currency] || RATES.USD;
  const converted = priceInUSD * config.rate;

  if (currency === 'KRW') {
    return `${config.symbol}${Math.round(converted).toLocaleString('ko-KR')}`;
  } else if (currency === 'JPY') {
    return `${config.symbol}${Math.round(converted).toLocaleString('ja-JP')}`;
  } else if (currency === 'EUR') {
    return `${config.symbol}${converted.toFixed(2)}`;
  }
  return `${config.symbol}${converted.toFixed(2)}`;
};
