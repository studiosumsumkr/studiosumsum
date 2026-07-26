import { useState, useEffect, useRef } from 'react';
import { Banner, SiteSettings, SectionContent, Product } from './types';
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
  const isRemoteUpdatingRef = useRef(false);
  const quotaExceededRef = useRef(false);

  // Firestore Real-time Sync
  useEffect(() => {
    let unsubscribeFn: (() => void) | null = null;
    const docRef = doc(db, FIRESTORE_DOC_PATH[0], FIRESTORE_DOC_PATH[1]);
    
    unsubscribeFn = onSnapshot(docRef, (snapshot) => {
      setDbConnected(true);
      setLoading(false);

      if (snapshot.exists()) {
        const remoteData = snapshot.data() as CMSData;
        isRemoteUpdatingRef.current = true;
        setData(prev => {
          const localTime = prev.updatedAt || 0;
          const remoteTime = remoteData.updatedAt || 0;
          // If local data has recent edits that are newer than remote snapshot, keep local data
          if (localTime > remoteTime) {
            return prev;
          }
          const mergedSettings = { ...DEFAULT_DATA.settings, ...(remoteData.settings || {}) };
          return {
            ...DEFAULT_DATA,
            ...remoteData,
            settings: mergedSettings,
            cart: prev.cart,
            wishlist: prev.wishlist
          };
        });
        setTimeout(() => {
          isRemoteUpdatingRef.current = false;
        }, 100);
      } else {
        // Initialize remote document if missing (only CMS content)
        if (quotaExceededRef.current) return;
        const { cart, wishlist, ...initialCms } = DEFAULT_DATA;
        setDoc(docRef, { ...initialCms, updatedAt: Date.now() }, { merge: true }).catch(err => {
          if (err?.code === 'resource-exhausted' || err?.message?.includes('Quota limit exceeded')) {
            quotaExceededRef.current = true;
          }
        });
      }
    }, (error) => {
      if (error?.code === 'resource-exhausted' || error?.message?.includes('Quota limit exceeded')) {
        quotaExceededRef.current = true;
        if (unsubscribeFn) {
          try {
            unsubscribeFn();
          } catch (e) {
            // ignore
          }
        }
      }
      setDbConnected(false);
      setLoading(false);
    });

    return () => {
      if (unsubscribeFn) unsubscribeFn();
    };
  }, []);

  // Sync to localStorage & Debounced Firestore Sync (Only for global CMS data)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setStorageError(null);
    } catch (e) {
      console.warn("Failed to persist data in storage:", e);
      setStorageError("설정 데이터를 저장할 브라우저 용량(5MB)이 초과되었습니다. 이미지가 너무 크거나 많을 수 있으니, 더 작거나 가벼운 이미지를 사용해 주세요.");
    }

    if (isRemoteUpdatingRef.current || quotaExceededRef.current) return;

    // Debounce Firestore sync to prevent exceeding write quotas on fast typing/edits
    const syncTimer = setTimeout(() => {
      if (quotaExceededRef.current) return;

      const docRef = doc(db, FIRESTORE_DOC_PATH[0], FIRESTORE_DOC_PATH[1]);
      const { cart, wishlist, ...cmsPayload } = data;
      setDoc(docRef, cmsPayload, { merge: true }).catch(err => {
        if (err?.code === 'resource-exhausted' || err?.message?.includes('Quota limit exceeded')) {
          quotaExceededRef.current = true;
          console.info("Firestore daily write quota reached. CMS changes will continue to be safely saved in local browser storage.");
        } else {
          console.warn("Firestore sync warning:", err?.message || err);
        }
      });
    }, 1000);

    return () => clearTimeout(syncTimer);
  }, [data]);

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
      updatedAt: Date.now()
    }));
  };

  const addBanner = (banner: Omit<Banner, 'id'>) => {
    const newBanner = { ...banner, id: Date.now().toString() };
    setData(prev => ({
      ...prev,
      banners: [...prev.banners, newBanner],
      updatedAt: Date.now()
    }));
  };

  const updateBanner = (id: string, banner: Partial<Banner>) => {
    setData(prev => ({
      ...prev,
      banners: prev.banners.map(b => b.id === id ? { ...b, ...banner } : b),
      updatedAt: Date.now()
    }));
  };

  const deleteBanner = (id: string) => {
    setData(prev => ({
      ...prev,
      banners: prev.banners.filter(b => b.id !== id),
      updatedAt: Date.now()
    }));
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now().toString() };
    setData(prev => ({
      ...prev,
      products: [...prev.products, newProduct],
      updatedAt: Date.now()
    }));
  };

  const updateProduct = (id: string, product: Partial<Product>) => {
    setData(prev => ({
      ...prev,
      products: prev.products.map(p => p.id === id ? { ...p, ...product } : p),
      updatedAt: Date.now()
    }));
  };

  const deleteProduct = (id: string) => {
    setData(prev => ({
      ...prev,
      products: prev.products.filter(p => p.id !== id),
      updatedAt: Date.now()
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

  return { 
    banners: data.banners, 
    settings: data.settings, 
    content: data.content, 
    products: data.products, 
    cart: data.cart,
    wishlist: data.wishlist,
    loading,
    dbConnected,
    storageError,
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
    toggleWishlist
  };
};
