import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { motion } from 'motion/react';
import { Banner, TypographySettings } from '../types';
import { ArrowUpRight } from 'lucide-react';
import { useCMS } from '../cms';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

import { getTypographyStyle, getLayoutSpacing } from '../utils';

const HeroTitle = ({ title, style }: { title: string; style?: TypographySettings }) => {
  const customStyleSize = style ? getTypographyStyle(style) : {};
  
  return (
    <h2 
      style={customStyleSize}
      className={`font-display text-white leading-[1.05] tracking-wide uppercase font-light transition-all duration-700 break-words max-w-[95vw] mx-auto overflow-hidden ${!style ? 'text-[clamp(1.75rem,8vw,10vw)]' : ''}`}
    >
      {title.split(' ').map((word, i) => (
        <span key={i} className="block">{word}</span>
      ))}
    </h2>
  );
};

export const HeroSlider = ({ banners }: { banners: Banner[] }) => {
  const { settings } = useCMS();
  
  if (banners.length === 0) {
    const placeholders: Banner[] = [
      {
        id: '1',
        imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=2070',
        title: 'SPRING SUMMER 2026',
        subtitle: 'NEW ERA OF MINIMALISM',
        link: '#',
        order: 1,
        ctaText: 'Shop Collection',
        decorativeText: 'STUDIO'
      },
      {
        id: '2',
        imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=2070',
        title: 'THE ART OF FORM',
        subtitle: 'EDITORIAL SELECTION',
        link: '#',
        order: 2,
        ctaText: 'Shop Collection',
        decorativeText: 'STUDIO'
      }
    ];
    banners = placeholders;
  }

  return (
    <section className="relative min-h-[75vh] md:h-[100dvh] w-full overflow-hidden bg-black flex items-center">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1500}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true, dynamicBullets: true }}
        className="h-full w-full min-h-[75vh] md:min-h-full"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="relative min-h-[75vh] md:h-full w-full flex items-center justify-center py-12 md:py-0">
              {/* Background Ambient Blur + Main Image */}
              <div className="absolute inset-0 z-0 overflow-hidden bg-black">
                {/* Ambient Blurred Background Layer */}
                <img 
                  src={banner.imageUrl} 
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full object-cover opacity-30 blur-2xl scale-125"
                  referrerPolicy="no-referrer"
                />
                {/* Main Focused Image */}
                <img 
                  src={banner.imageUrl} 
                  alt={banner.title}
                  className="relative h-full w-full object-cover object-center opacity-70 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70" />
              </div>

              {/* Content */}
              <div className="relative z-10 max-w-7xl mx-auto px-6 w-full text-center my-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "circOut" }}
                  className="space-y-4 md:space-y-6 lg:space-y-10 py-4"
                >
                  <p 
                    style={settings?.heroSubtitleStyle ? getTypographyStyle(settings.heroSubtitleStyle) : {}}
                    className={`uppercase text-neutral-200/90 font-medium tracking-[0.3em] sm:tracking-[0.5em] lg:tracking-[0.8em] mb-2 sm:mb-4 ${!settings?.heroSubtitleStyle ? 'text-[10px] md:text-xs' : ''}`}
                  >
                    {banner.subtitle}
                  </p>
                  
                  <HeroTitle title={banner.title} style={settings?.heroTitleStyle} />

                  <div className="pt-4 sm:pt-8 lg:pt-12 flex justify-center">
                    <Link to={banner.link || "/shop"} className="luxury-button px-8 py-4 sm:px-10 sm:py-5 lg:px-16 lg:py-6 text-[10px] lg:text-[12px]">
                      {banner.ctaText || 'Shop Collection'}
                    </Link>
                  </div>
                </motion.div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12 hidden sm:block">
                <div className="flex items-center space-x-4 text-[10px] uppercase tracking-[0.4em] text-white/50 font-bold">
                  <span>0{(banners.indexOf(banner) + 1).toString()}</span>
                  <div className="w-12 h-[1px] bg-white/30" />
                  <span>{banner.decorativeText || 'STUDIO'}</span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
