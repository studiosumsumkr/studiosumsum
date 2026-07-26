import { useState, useEffect, useRef } from 'react';
import { Banner, SiteSettings, SectionContent, Product, ProductReview, StockAlert, CouponClaim, ActivityLog } from './types';
import { db, doc, setDoc, onSnapshot } from './lib/firebase';

const STORAGE_KEY = 'studio_sumsum_v6_cool_props_data';
const FIRESTORE_DOC_PATH = ['appData', 'cmsData'] as const;

interface CMSData {
  banners: Banner[];
  settings: SiteSettings;
  content: SectionContent[];
  products: Product[];
  cart: { productId: string, quantity: number }[];
  wishlist: string[];
  recentlyViewed?: string[];
  compareList?: string[];
  currency?: 'USD' | 'KRW' | 'EUR' | 'JPY';
  themeMode?: 'light' | 'dark' | 'ambient';
  reviews?: ProductReview[];
  stockAlerts?: StockAlert[];
  couponClaims?: CouponClaim[];
  activityLogs?: ActivityLog[];
  updatedAt?: number;
}

const DEFAULT_DATA: CMSData = {
  banners: [
    {
      id: '1',
      imageUrl: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&q=80&w=2070',
      title: 'STUDIO SUMSUM',
      subtitle: 'VOL I. SENSORY HOME PROPS',
      link: '#',
      order: 1
    },
    {
      id: '2',
      imageUrl: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=2070',
      title: 'ORGANIC ACCENTS',
      subtitle: 'HANDCRAFTED MINIMAL DESIGN OBJECTS FOR EVERYDAY SPACE',
      link: '#',
      order: 2
    }
  ],
  settings: {
    logoText: "STUDIO SUMSUM",
    footerDescription: "STUDIO SUMSUM은 감각적인 현대인의 일상과 예술적 경계를 허물며 공간에 잔잔한 여운을 채워 넣는 핸드메이드 디자인 홈오브제 및 라이프스타일 소품 셀렉트숍입니다.",
    primaryColor: "#111111",
    accentColor: "#1A1A1A",
    fontSet: 'round',
    seoTitle: "STUDIO SUMSUM | Premium Home Objects",
    seoDescription: "감각적인 일상을 위한 미니멀 인테리어 데스크 오브제, 세라믹 소품 및 프래그런스 라인업을 소개하는 라이프스타일 셀렉숍 스튜디오 숨숨.",
    ogImage: "",
    language: 'KR',
    themePreset: 'DEFAULT',
    
    // Announcement Bar
    showAnnouncement: true,
    announcementText: "STUDIO SUMSUM: ENJOY FREE SHIPPING ON ALL SENSORY HOME OBJECTS & PROPS",
    announcementLink: "/shop",

    showNewsletterPopup: false,
    showCustomCursor: true,
    showScrollProgress: true,
    
    heroTitle: "STUDIO SUMSUM: 일상의 다정한 영감",
    heroSubtitle: "MODERN INTERIOR PROPS • 2026",
    heroTitleStyle: { fontSize: '10vw', fontWeight: '900', letterSpacing: '-0.04em', lineHeight: '0.9' },
    heroSubtitleStyle: { fontSize: '14px', fontWeight: '900', letterSpacing: '0.6em', lineHeight: '1' },
    
    marqueeText: "★ STUDIO SUMSUM ★ SENSORY SHAPES ★ HANDCRAFTED PROPS ★ MODERN ACCENTS ★ TIME_LESS OBJECTS ★",
    marqueeStyle: { fontSize: '48px', fontWeight: '900', letterSpacing: '-0.01em', lineHeight: '1' },
    
    editorialTitle: "SUMSUM",
    editorialSubtitle: "CREATIVE LABS • 2026",
    editorialDescription: "수공예적인 디테일과 과감한 조형미의 조화. 스튜디오 숨숨은 단순한 홈소품을 넘어 일상의 풍경과 무드를 멋스럽게 바꾸어내는 소박하고 고고한 오브제를 제안합니다.",
    editorialImageUrl: "https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&q=80&w=1000",
    editorialTitleStyle: { fontSize: '18vw', fontWeight: '900', letterSpacing: '-0.03em', lineHeight: '0.95' },
    editorialDescriptionStyle: { fontSize: '4vw', fontWeight: '300', letterSpacing: '-0.01em', lineHeight: '1.2' },
    
    aboutTitle: "Our Essence",
    aboutDescription: "정돈된 공간이 전달하는 정밀한 위로. 정성껏 매만진 소품 하나가 삶의 은근한 여유와 감각적인 매일의 결을 조율합니다.",
    philosophyImageUrl: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=1000",
    aboutTitleStyle: { fontSize: '8vw', fontWeight: '900', letterSpacing: '-0.04em', lineHeight: '0.85' },
    aboutDescriptionStyle: { fontSize: '18px', fontWeight: '300', letterSpacing: '0', lineHeight: '1.8' },

    philosophyFeature1Title: "Natural Material",
    philosophyFeature1Description: "자연에서 채취한 황토, 세라믹, 그리고 원석 고유의 질감을 드러내어, 시간의 깊이를 차분히 담아낼 수 있는 오브제를 선보입니다.",
    philosophyFeature2Title: "Sustaining Form",
    philosophyFeature2Description: "공장형 대량 생산을 넘어, 공예 작가의 섬세한 수작업과 독립적인 오더 공정을 통해 온전하고 개성 있는 오브제를 정성스럽게 고릅니다.",

    floatingText1: "SUMSUM",
    floatingText2: "OBJECTS",
    showFloatingElements: true,

    ctaTitle: "Join Our Curated\nCreative Sphere",
    ctaButtonText: "Explore Collection",
    ctaTitleStyle: { fontSize: '8vw', fontWeight: '900', letterSpacing: '-0.04em', lineHeight: '1' },
    ctaButtonStyle: { fontSize: '11px', fontWeight: '900', letterSpacing: '0.4em', lineHeight: '1' },

    // Curated Store Section
    curatedBadgeText: "CURATED STORE",
    curatedTitle: "NEW & FEATURED OBJECTS",

    // Editorial Keypoints & Overlay
    editorialKeypoint1Title: "01. NATURAL CLAY",
    editorialKeypoint1Desc: "자연의 흙과 트라버틴 석재 고유의 질감",
    editorialKeypoint2Title: "02. SLOW DESIGN",
    editorialKeypoint2Desc: "오래도록 질리지 않는 정돈된 미니멀 형태",
    editorialButtonLink: "/shop",
    editorialOverlayTag: "CURATED LOOKBOOK",
    editorialOverlayTitle: "STUDIO SUMSUM ARCHIVE",

    // Brand Story
    aboutBadgeText: "OUR ESSENCE & STORY",

    // Newsletter Banner Section
    newsletterTag: "SENSORY JOURNAL",
    newsletterTitle: "SUBSCRIBE FOR NEW RELEASES & EXCLUSIVE PROPS",
    newsletterDescription: "새로운 오브제 드롭 및 스페셜 에디션 출시 소식을 가장 먼저 이메일로 받아보세요.",
    newsletterPlaceholder: "Enter your email address",
    newsletterButtonText: "SUBSCRIBE",

    navHomeText: "HOME",
    navShopText: "SHOP",
    navEditorialText: "EDITORIAL",
    navAboutText: "OUR STORY",
    searchPlaceholder: "SEARCH PIECES",
    editorialButtonText: "Explore Pieces",
    footerNewsletterTitle: "Sensory Mood Journal",
    footerNewsletterPlaceholder: "Enter your personal email",
    footerNewsletterButtonText: "Join Feed",
    footerRightsText: "© 2026 STUDIO SUMSUM GLOBAL. ALL RIGHTS RESERVED.",
    shopTitle: "Collection",
    shopBuyNowText: "Add to Bag",
    shopComingSoonText: "Awaiting Stock",
    
    logoStyle: { fontSize: '4xl', fontWeight: '900', letterSpacing: '-0.03em', lineHeight: '1' },
    navLinkStyle: { fontSize: '11px', fontWeight: '900', letterSpacing: '0.4em', lineHeight: '1' },
    footerRightsStyle: { fontSize: '9px', fontWeight: '900', letterSpacing: '0.3em', lineHeight: '1' },
    shopTitleStyle: { fontSize: '14vw', fontWeight: '900', letterSpacing: '-0.02em', lineHeight: '1' },
    
    instagramLink: "https://instagram.com/studiosumsum.global",
    twitterLink: "https://twitter.com",
    facebookLink: "https://facebook.com",

    archiveImage1: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600",
    archiveImage2: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600",
    archiveImage3: "https://images.unsplash.com/photo-1539109132382-381bb3f1c2b3?auto=format&fit=crop&q=80&w=600",
    archiveImage4: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600",
    archiveImage5: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=600",
    
    sectionSpacing: { marginTop: '0px', marginBottom: '0px', paddingTop: '120px', paddingBottom: '120px' }
  },
  content: [],
  products: [
    {
      id: '1',
      name: 'Asymmetric Ceramic Incense Holder',
      price: 38,
      imageUrl: 'https://images.unsplash.com/photo-1606744824163-985d376605aa?auto=format&fit=crop&q=80&w=1000',
      category: 'SCENTS',
      description: '부드러운 천연 점토의 수공예적 결이 살아있는 세라믹 홀더. 타오르는 연기와 멋스런 조화를 이루어 데스크 공간에 평온함을 더합니다.',
      link: '#'
    },
    {
      id: '2',
      name: 'Travertine Arch Stoneware Tray',
      price: 64,
      imageUrl: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=1000',
      category: 'OBJECTS',
      description: '천연석 본연의 정취 가득한 트라버틴 석재 트레이. 일상 소품, 주얼리 홀더 및 영감의 데스크탑 오브제로 아름답게 배치됩니다.',
      link: '#'
    },
    {
      id: '3',
      name: 'Geometric Scented Clay Candle',
      price: 28,
      imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=1000',
      category: 'SCENTS',
      description: '천연 에센셜 오일과 소이 왁스를 입힌 비정형 수제 오브제 캔들. 태우지 않을 때도 일상의 포근한 향과 무드를 완성합니다.',
      link: '#'
    }
  ],
  cart: [],
  wishlist: []
};

export const useCMS = () => {
  const [data, setData] = useState<CMSData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_DATA,
          ...parsed,
          settings: { ...DEFAULT_DATA.settings, ...(parsed.settings || {}) },
          cart: parsed.cart || [],
          wishlist: parsed.wishlist || []
        };
      } catch (e) {
        console.error("Error parsing local CMS data:", e);
      }
    }
    return DEFAULT_DATA;
  });

  const [loading, setLoading] = useState(true);
  const [dbConnected, setDbConnected] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'saved' | 'saving' | 'error' | 'idle'>('saved');
  const [syncErrorMessage, setSyncErrorMessage] = useState<string | null>(null);

  const isRemoteUpdatingRef = useRef(false);
  const quotaExceededRef = useRef(false);
  const localLastEditTimeRef = useRef<number>(data.updatedAt || Date.now());

  // Firestore Real-time Sync with strict Timestamp Lock
  useEffect(() => {
    let unsubscribeFn: (() => void) | null = null;
    const docRef = doc(db, FIRESTORE_DOC_PATH[0], FIRESTORE_DOC_PATH[1]);
    
    unsubscribeFn = onSnapshot(docRef, (snapshot) => {
      setDbConnected(true);
      setLoading(false);

      if (snapshot.exists()) {
        const remoteData = snapshot.data() as CMSData;
        const remoteUpdatedAt = remoteData.updatedAt || 0;
        const hasPendingWrites = snapshot.metadata.hasPendingWrites;

        // ONLY update local state if remote data is STRICTLY newer than local last edit time
        // and there are no pending local writes being pushed
        if (!hasPendingWrites && remoteUpdatedAt > localLastEditTimeRef.current) {
          isRemoteUpdatingRef.current = true;
          localLastEditTimeRef.current = remoteUpdatedAt;
          
          setData(prev => {
            const mergedSettings = { ...DEFAULT_DATA.settings, ...(remoteData.settings || {}) };
            const nextData = {
              ...DEFAULT_DATA,
              ...remoteData,
              settings: mergedSettings,
              cart: prev.cart,
              wishlist: prev.wishlist
            };
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
            } catch (e) {
              console.warn("LocalStorage save warning:", e);
            }
            return nextData;
          });

          setSyncStatus('saved');
          setTimeout(() => {
            isRemoteUpdatingRef.current = false;
          }, 300);
        }
      } else {
        // Initialize remote document if missing
        if (quotaExceededRef.current) return;
        const { cart, wishlist, ...initialCms } = DEFAULT_DATA;
        const now = Date.now();
        setDoc(docRef, { ...initialCms, updatedAt: now }, { merge: true }).catch(err => {
          if (err?.code === 'resource-exhausted' || err?.message?.includes('Quota limit exceeded')) {
            quotaExceededRef.current = true;
          }
        });
      }
    }, (error) => {
      if (error?.code === 'resource-exhausted' || error?.message?.includes('Quota limit exceeded')) {
        quotaExceededRef.current = true;
        if (unsubscribeFn) {
          try { unsubscribeFn(); } catch (e) {}
        }
      }
      setDbConnected(false);
      setLoading(false);
    });

    return () => {
      if (unsubscribeFn) unsubscribeFn();
    };
  }, []);

  // Primary function to push data to Cloud DB with auto-retry
  const pushToFirestore = async (cmsData: CMSData, retries = 3): Promise<boolean> => {
    if (quotaExceededRef.current) {
      setSyncStatus('error');
      setSyncErrorMessage("Firestore 일일 할당량이 초과되어 로컬 저장소에만 보관됩니다.");
      return false;
    }

    const { cart, wishlist, ...cmsPayload } = cmsData;
    const payloadString = JSON.stringify(cmsPayload);
    
    if (payloadString.length > 950000) {
      setSyncStatus('error');
      setSyncErrorMessage("이미지 데이터 용량이 큽니다. (1MB 제한) 이미지를 더 작거나 가볍게 변경해 주세요.");
      return false;
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        setSyncStatus('saving');
        const docRef = doc(db, FIRESTORE_DOC_PATH[0], FIRESTORE_DOC_PATH[1]);
        await setDoc(docRef, cmsPayload, { merge: true });
        setSyncStatus('saved');
        setSyncErrorMessage(null);
        return true;
      } catch (err: any) {
        console.warn(`Firestore sync attempt ${attempt} failed:`, err);
        if (attempt === retries) {
          setSyncStatus('error');
          setSyncErrorMessage(err?.message || "클라우드 동기화 실패 (오프라인 로컬 저장 중)");
          return false;
        }
        // Wait 800ms before retrying
        await new Promise(r => setTimeout(r, 800 * attempt));
      }
    }
    return false;
  };


  // Sync to localStorage & Debounced Firestore Sync
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setStorageError(null);
    } catch (e) {
      console.warn("Failed to persist data in storage:", e);
      setStorageError("설정 데이터를 저장할 브라우저 용량(5MB)이 초과되었습니다. 이미지를 더 작거나 가볍게 변경해 주세요.");
    }

    if (isRemoteUpdatingRef.current || quotaExceededRef.current) return;

    setSyncStatus('saving');
    const syncTimer = setTimeout(() => {
      pushToFirestore(data);
    }, 400);

    return () => clearTimeout(syncTimer);
  }, [data]);

  // Helper state setters with timestamp tracking
  const updateDataWithTimestamp = (updater: (prev: CMSData) => CMSData) => {
    const now = Date.now();
    localLastEditTimeRef.current = now;
    setData(prev => {
      const updated = updater(prev);
      return {
        ...updated,
        updatedAt: now
      };
    });
  };

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    updateDataWithTimestamp(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
  };

  const addBanner = (banner: Omit<Banner, 'id'>) => {
    const newBanner = { ...banner, id: Date.now().toString() };
    updateDataWithTimestamp(prev => ({
      ...prev,
      banners: [...prev.banners, newBanner]
    }));
  };

  const updateBanner = (id: string, banner: Partial<Banner>) => {
    updateDataWithTimestamp(prev => ({
      ...prev,
      banners: prev.banners.map(b => b.id === id ? { ...b, ...banner } : b)
    }));
  };

  const deleteBanner = (id: string) => {
    updateDataWithTimestamp(prev => ({
      ...prev,
      banners: prev.banners.filter(b => b.id !== id)
    }));
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now().toString() };
    updateDataWithTimestamp(prev => ({
      ...prev,
      products: [...prev.products, newProduct]
    }));
  };

  const updateProduct = (id: string, product: Partial<Product>) => {
    updateDataWithTimestamp(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === id ? { ...p, ...product } : p)
    }));
  };

  const deleteProduct = (id: string) => {
    updateDataWithTimestamp(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== id)
    }));
  };

  const addToCart = (productId: string) => {
    setData(prev => {
      const existing = prev.cart.find(item => item.productId === productId);
      if (existing) {
        return {
          ...prev,
          cart: prev.cart.map(item => 
            item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
          )
        };
      }
      return {
        ...prev,
        cart: [...prev.cart, { productId, quantity: 1 }]
      };
    });
  };

  const removeFromCart = (productId: string) => {
    setData(prev => ({
      ...prev,
      cart: prev.cart.filter(item => item.productId !== productId)
    }));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setData(prev => ({
      ...prev,
      cart: prev.cart.map(item => 
        item.productId === productId ? { ...item, quantity } : item
      )
    }));
  };

  const clearCart = () => {
    setData(prev => ({ ...prev, cart: [] }));
  };

  const toggleWishlist = (productId: string) => {
    setData(prev => {
      const exists = prev.wishlist.includes(productId);
      if (exists) {
        return {
          ...prev,
          wishlist: prev.wishlist.filter(id => id !== productId)
        };
      }
      return {
        ...prev,
        wishlist: [...prev.wishlist, productId]
      };
    });
  };

  const addRecentlyViewed = (productId: string) => {
    setData(prev => {
      const current = prev.recentlyViewed || [];
      const filtered = current.filter(id => id !== productId);
      const updated = [productId, ...filtered].slice(0, 10);
      return { ...prev, recentlyViewed: updated };
    });
  };

  const toggleCompare = (productId: string) => {
    setData(prev => {
      const current = prev.compareList || [];
      if (current.includes(productId)) {
        return { ...prev, compareList: current.filter(id => id !== productId) };
      }
      if (current.length >= 4) {
        alert("비교함에는 최대 4개의 상품만 담을 수 있습니다.");
        return prev;
      }
      return { ...prev, compareList: [...current, productId] };
    });
  };

  const clearCompare = () => {
    setData(prev => ({ ...prev, compareList: [] }));
  };

  const setCurrency = (curr: 'USD' | 'KRW' | 'EUR' | 'JPY') => {
    setData(prev => ({ ...prev, currency: curr }));
  };

  const setThemeMode = (mode: 'light' | 'dark' | 'ambient') => {
    setData(prev => ({ ...prev, themeMode: mode }));
  };

  const addReview = (review: Omit<ProductReview, 'id' | 'createdAt'>) => {
    const newRev: ProductReview = {
      ...review,
      id: Date.now().toString(),
      createdAt: new Date().toLocaleDateString('ko-KR')
    };
    setData(prev => {
      const updated = [newRev, ...(prev.reviews || [])];
      return { ...prev, reviews: updated };
    });
  };

  const addStockAlert = (productId: string, contact: string) => {
    const newAlert: StockAlert = {
      id: Date.now().toString(),
      productId,
      contact,
      createdAt: new Date().toLocaleString('ko-KR'),
      notified: false
    };
    setData(prev => {
      const updated = [newAlert, ...(prev.stockAlerts || [])];
      return { ...prev, stockAlerts: updated };
    });
  };

  const addCouponClaim = (phoneNumber: string, couponCode: string = 'SUMSUM15') => {
    const newClaim: CouponClaim = {
      id: Date.now().toString(),
      phoneNumber,
      couponCode,
      claimedAt: new Date().toLocaleString('ko-KR'),
      status: 'NEW'
    };
    setData(prev => {
      const updated = [newClaim, ...(prev.couponClaims || [])];
      return { ...prev, couponClaims: updated };
    });
    logActivity('쿠폰 신청', `전화번호: ${phoneNumber} (코드: ${couponCode})`);
  };

  const deleteCouponClaim = (id: string) => {
    setData(prev => ({
      ...prev,
      couponClaims: (prev.couponClaims || []).filter(c => c.id !== id)
    }));
  };

  const updateCouponClaimStatus = (id: string, status: 'NEW' | 'CONTACTED' | 'USED') => {
    setData(prev => ({
      ...prev,
      couponClaims: (prev.couponClaims || []).map(c => c.id === id ? { ...c, status } : c)
    }));
  };

  const logActivity = (action: string, details: string) => {
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      action,
      details,
      timestamp: new Date().toLocaleTimeString('ko-KR')
    };
    setData(prev => ({
      ...prev,
      activityLogs: [newLog, ...(prev.activityLogs || [])].slice(0, 30)
    }));
  };

  const duplicateProduct = (productId: string) => {
    setData(prev => {
      const target = prev.products.find(p => p.id === productId);
      if (!target) return prev;
      const copy: Product = {
        ...target,
        id: Date.now().toString(),
        name: `${target.name} (Copy)`
      };
      return { ...prev, products: [copy, ...prev.products] };
    });
    logActivity('상품 복제', `상품 ID: ${productId} 복제 생성`);
  };

  const bulkUpdateProducts = (updatedProducts: Product[]) => {
    setData(prev => ({ ...prev, products: updatedProducts }));
    logActivity('일괄 수정', `상품 ${updatedProducts.length}개 일괄 변경`);
  };

  const resetToDefaultData = async () => {
    const freshData = {
      ...DEFAULT_DATA,
      updatedAt: Date.now()
    };
    setData(freshData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(freshData));
      const docRef = doc(db, FIRESTORE_DOC_PATH[0], FIRESTORE_DOC_PATH[1]);
      const { cart, wishlist, ...cmsPayload } = freshData;
      await setDoc(docRef, cmsPayload);
      alert("클라우드 DB와 로컬 데이터가 최신 기본 데이터로 깨끗하게 초기화되었습니다.");
    } catch (e) {
      console.error("Error resetting data:", e);
      alert("데이터 초기화 완료 (로컬 저장소 적용)");
    }
  };

  const forcePublishToCloud = async () => {
    const currentData = {
      ...data,
      updatedAt: Date.now()
    };
    setData(currentData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentData));
      const docRef = doc(db, FIRESTORE_DOC_PATH[0], FIRESTORE_DOC_PATH[1]);
      const { cart, wishlist, ...cmsPayload } = currentData;
      const jsonString = JSON.stringify(cmsPayload);
      
      if (jsonString.length > 950000) {
        alert("⚠️ [경고] 현재 등록된 이미지 및 데이터 용량이 클라우드 DB 제한(1MB)에 가깝거나 초과했습니다. 데이터 저장이 실패할 수 있으니 이미지를 크기가 작은 파일로 다시 등록해 주세요.");
      }

      await setDoc(docRef, cmsPayload);
      alert("✅ 현재 화면의 최신 데이터가 클라우드 DB(Firebase)에 성공적으로 퍼블리시 되었습니다!\n이제 Vercel 및 외부 접속자, 모든 모바일/PC 기기에서 동일하게 반영됩니다.");
    } catch (e: any) {
      console.error("Error publishing to cloud:", e);
      alert(`❌ 클라우드 동기화 실패: ${e?.message || '알 수 없는 오류'}\n(이미지 파일 크기가 너무 큰 경우일 수 있습니다. 이미지를 더 작게 압축해 주세요.)`);
    }
  };

  const exportJsonBackup = () => {
    const backupObj = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      cmsData: data
    };
    const jsonStr = JSON.stringify(backupObj, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studiosumsum-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJsonBackup = async (jsonText: string) => {
    try {
      const parsed = JSON.parse(jsonText);
      const incoming = parsed.cmsData || parsed;
      if (!incoming || typeof incoming !== 'object') {
        throw new Error('유효하지 않은 백업 데이터 형식입니다.');
      }
      const restoredData: CMSData = {
        ...DEFAULT_DATA,
        ...incoming,
        updatedAt: Date.now()
      };
      setData(restoredData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(restoredData));
      const docRef = doc(db, FIRESTORE_DOC_PATH[0], FIRESTORE_DOC_PATH[1]);
      const { cart, wishlist, ...cmsPayload } = restoredData;
      await setDoc(docRef, cmsPayload);
      alert("✅ 성공적으로 백업 데이터를 불러왔으며, 클라우드 DB와 화면이 복구되었습니다!");
    } catch (err: any) {
      alert(`❌ 백업 파일 복원 실패: ${err?.message || '오류가 발생했습니다.'}`);
    }
  };

  return { 
    banners: data.banners, 
    settings: data.settings, 
    content: data.content, 
    products: data.products, 
    cart: data.cart,
    wishlist: data.wishlist,
    recentlyViewed: data.recentlyViewed || [],
    compareList: data.compareList || [],
    currency: data.currency || 'USD',
    themeMode: data.themeMode || 'light',
    reviews: data.reviews || [],
    stockAlerts: data.stockAlerts || [],
    couponClaims: data.couponClaims || [],
    activityLogs: data.activityLogs || [],
    loading,
    dbConnected,
    storageError,
    syncStatus,
    syncErrorMessage,
    updateSettings, 
    addBanner, 
    updateBanner, 
    deleteBanner,
    addProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    toggleWishlist,
    addRecentlyViewed,
    toggleCompare,
    clearCompare,
    setCurrency,
    setThemeMode,
    addReview,
    addStockAlert,
    addCouponClaim,
    deleteCouponClaim,
    updateCouponClaimStatus,
    logActivity,
    duplicateProduct,
    bulkUpdateProducts,
    resetToDefaultData,
    forcePublishToCloud,
    exportJsonBackup,
    importJsonBackup
  };
};
