export interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  link: string;
  order: number;
  ctaText?: string;
  decorativeText?: string;
  imagePosition?: string; // e.g. 'center', 'top', 'bottom', '50% 20%', etc.
}

export interface TypographySettings {
  fontSize: string;
  fontWeight: string;
  letterSpacing: string;
  lineHeight: string;
  color?: string;
}

export interface LayoutSettings {
  marginTop: string;
  marginBottom: string;
  paddingTop: string;
  paddingBottom: string;
}

export interface SiteSettings {
  logoText: string;
  footerDescription: string;
  primaryColor: string;
  accentColor: string;
  fontSet: 'modern' | 'classic' | 'minimal' | 'round';
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
  language: 'EN' | 'KR';
  themePreset: 'DEFAULT' | 'NOCTURNAL' | 'PARCHMENT' | 'ROSE';
  
  // Announcement Bar
  showAnnouncement: boolean;
  announcementText: string;
  announcementLink: string;

  // Features
  showNewsletterPopup: boolean;
  showCustomCursor: boolean;
  showScrollProgress: boolean;

  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  heroTitleStyle: TypographySettings;
  heroSubtitleStyle: TypographySettings;
  
  // Marquee
  marqueeText: string;
  marqueeStyle: TypographySettings;
  
  // Editorial Section
  editorialTitle: string;
  editorialSubtitle: string;
  editorialDescription: string;
  editorialImageUrl: string;
  editorialImagePosition?: string;
  editorialTitleStyle: TypographySettings;
  editorialDescriptionStyle: TypographySettings;
  
  // Philosophy Section
  aboutTitle: string;
  aboutDescription: string;
  philosophyImageUrl: string;
  philosophyImagePosition?: string;
  aboutTitleStyle: TypographySettings;
  aboutDescriptionStyle: TypographySettings;

  // Philosophy Features
  philosophyFeature1Title: string;
  philosophyFeature1Description: string;
  philosophyFeature2Title: string;
  philosophyFeature2Description: string;

  // Floating Elements
  floatingText1: string;
  floatingText2: string;
  showFloatingElements: boolean;

  // Final CTA
  ctaTitle: string;
  ctaButtonText: string;
  ctaTitleStyle: TypographySettings;
  ctaButtonStyle: TypographySettings;

  // Curated Store Section
  curatedBadgeText?: string;
  curatedTitle?: string;

  // Editorial Keypoints & Overlay
  editorialKeypoint1Title?: string;
  editorialKeypoint1Desc?: string;
  editorialKeypoint2Title?: string;
  editorialKeypoint2Desc?: string;
  editorialButtonLink?: string;
  editorialOverlayTag?: string;
  editorialOverlayTitle?: string;

  // Philosophy / Brand Story Section
  aboutBadgeText?: string;

  // Newsletter Section
  newsletterTag?: string;
  newsletterTitle?: string;
  newsletterDescription?: string;
  newsletterPlaceholder?: string;
  newsletterButtonText?: string;

  // New Editable UI Texts
  navHomeText: string;
  navShopText: string;
  navEditorialText: string;
  navAboutText: string;
  searchPlaceholder: string;
  editorialButtonText: string;
  footerNewsletterTitle: string;
  footerNewsletterPlaceholder: string;
  footerNewsletterButtonText: string;
  footerRightsText: string;
  shopTitle: string;
  shopBuyNowText: string;
  shopComingSoonText: string;
  
  // UI Styles
  logoStyle: TypographySettings;
  navLinkStyle: TypographySettings;
  footerRightsStyle: TypographySettings;
  shopTitleStyle: TypographySettings;
  
  // Social Links
  instagramLink: string;
  twitterLink: string;
  facebookLink: string;

  // Project Archive / Brand Story Images
  archiveImage1?: string;
  archiveImage2?: string;
  archiveImage3?: string;
  archiveImage4?: string;
  archiveImage5?: string;
  
  // Global Layout
  sectionSpacing: LayoutSettings;

  // New CMS Customizations
  customCss?: string;
  enableWatermark?: boolean;
  watermarkText?: string;
  promoDiscountCode?: string;
  promoDiscountPercent?: number;
  promoDiscountActive?: boolean;
  couponTitle?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  description: string;
  link?: string;
  buyUrl?: string;
  imagePosition?: string;
  inStock?: boolean;
  stockCount?: number;
  isNewProduct?: boolean;
  isBestSeller?: boolean;
  views?: number;
}

export interface ProductReview {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  photoUrl?: string;
}

export interface StockAlert {
  id: string;
  productId: string;
  contact: string;
  createdAt: string;
  notified?: boolean;
}

export interface CouponClaim {
  id: string;
  phoneNumber: string;
  couponCode: string;
  claimedAt: string;
  status?: 'NEW' | 'CONTACTED' | 'USED';
  note?: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface SectionContent {
  id: string;
  sectionId: string;
  title: string;
  description: string;
}
