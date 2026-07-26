import { TypographySettings, LayoutSettings } from './types';

export const getTypographyStyle = (settings: TypographySettings) => {
  let fontSize = settings.fontSize;
  if (fontSize.includes('vw')) {
    const val = parseFloat(fontSize);
    const minSize = Math.max(1.2, val * 0.1); 
    fontSize = `clamp(${minSize}rem, ${fontSize}, ${val * 1.1}rem)`;
  } else if (fontSize.includes('px')) {
    const val = parseFloat(fontSize);
    fontSize = `clamp(${Math.min(14, val * 0.4)}px, ${fontSize}, ${val}px)`;
  }

  return {
    fontSize,
    fontWeight: settings.fontWeight as any,
    letterSpacing: settings.letterSpacing,
    lineHeight: settings.lineHeight,
    color: settings.color,
  };
};

export const getLayoutSpacing = (settings: LayoutSettings) => ({
  marginTop: `clamp(0px, ${settings.marginTop}, 20vh)`,
  marginBottom: `clamp(0px, ${settings.marginBottom}, 20vh)`,
  paddingTop: `clamp(40px, ${settings.paddingTop}, 20vh)`,
  paddingBottom: `clamp(40px, ${settings.paddingBottom}, 20vh)`,
});
