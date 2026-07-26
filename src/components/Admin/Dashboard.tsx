import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCMS } from '../../cms';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Trash2, Save, LogOut, Image as ImageIcon, Settings, Layout, ShoppingBag, Type, Sparkles, Move, Maximize } from 'lucide-react';
import { Banner, Product, SiteSettings, TypographySettings, LayoutSettings } from '../../types';
import { GoogleGenAI } from "@google/genai";

const TypographyEditor = ({ label, settings, onSave }: { label: string, settings: TypographySettings, onSave: (val: TypographySettings) => void }) => {
  return (
    <div className="p-6 border border-neutral-100 rounded-2xl bg-neutral-50/50 space-y-6">
      <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-neutral-400 border-b border-black/5 pb-2">{label} Style</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-[8px] uppercase tracking-widest font-bold text-neutral-400">Size (e.g. 15vw, 24px)</label>
          <input 
            className="w-full border border-neutral-200 focus:border-neutral-900 rounded-xl p-2.5 text-xs outline-none transition-colors"
            value={settings.fontSize}
            onChange={(e) => onSave({ ...settings, fontSize: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[8px] uppercase tracking-widest font-bold text-neutral-400">Weight</label>
          <select 
            className="w-full border border-neutral-200 focus:border-neutral-900 rounded-xl p-2.5 text-xs outline-none bg-white transition-colors"
            value={settings.fontWeight}
            onChange={(e) => onSave({ ...settings, fontWeight: e.target.value })}
          >
            <option value="100">Thin</option>
            <option value="300">Light</option>
            <option value="400">Regular</option>
            <option value="700">Bold</option>
            <option value="900">Black</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-[8px] uppercase tracking-widest font-bold text-neutral-400">Spacing</label>
          <input 
            className="w-full border border-neutral-200 focus:border-neutral-900 rounded-xl p-2.5 text-xs outline-none transition-colors"
            value={settings.letterSpacing}
            onChange={(e) => onSave({ ...settings, letterSpacing: e.target.value })}
          />
        </div>
        <div className="space-y-1">
          <label className="text-[8px] uppercase tracking-widest font-bold text-neutral-400">Line Height</label>
          <input 
            className="w-full border border-neutral-200 focus:border-neutral-900 rounded-xl p-2.5 text-xs outline-none transition-colors"
            value={settings.lineHeight}
            onChange={(e) => onSave({ ...settings, lineHeight: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};

const LayoutEditor = ({ label, settings, onSave }: { label: string, settings: LayoutSettings, onSave: (val: LayoutSettings) => void }) => {
  return (
    <div className="p-6 border border-neutral-100 rounded-2xl bg-neutral-50/50 space-y-6">
      <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-neutral-400 border-b border-black/5 pb-2">{label} Layout</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Object.entries(settings).map(([key, val]) => (
          <div key={key} className="space-y-1">
            <label className="text-[8px] uppercase tracking-widest font-bold text-neutral-400">{key}</label>
            <input 
              className="w-full border border-neutral-200 focus:border-neutral-900 rounded-xl p-2.5 text-xs outline-none transition-colors"
              value={val}
              onChange={(e) => onSave({ ...settings, [key]: e.target.value })}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const EditableField = ({ label, value, onSave, type = 'text', description, aiPrompt }: { label: string, value: string, onSave: (val: string) => void, type?: 'text' | 'textarea' | 'color', description?: string, aiPrompt?: string }) => {
  const [localValue, setLocalValue] = useState(value);
  const [isGenerating, setIsGenerating] = useState(false);
  const isDirtyRef = useRef(false);

  // Sync from parent of outside changes
  useEffect(() => {
    if (!isDirtyRef.current) {
      setLocalValue(value);
    }
  }, [value]);

  // When value catches up or becomes equal, reset dirty state
  useEffect(() => {
    if (localValue === value) {
      isDirtyRef.current = false;
    }
  }, [localValue, value]);

  const onSaveRef = useRef(onSave);
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  // Handle automatic saving with a 450ms debounce
  useEffect(() => {
    if (localValue === value) return;

    const handler = setTimeout(() => {
      onSaveRef.current(localValue);
    }, 450);

    return () => clearTimeout(handler);
  }, [localValue, value]);

  const generateAI = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a professional luxury brand and corporate copywriter. ${aiPrompt}. Current text: "${localValue}". Provide a highly polished, elegant, and impactful corporate statement. Keep it concise.`,
      });
      const text = response.text;
      if (text) {
        isDirtyRef.current = true;
        setLocalValue(text);
        onSaveRef.current(text);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChange = (newVal: string) => {
    isDirtyRef.current = true;
    setLocalValue(newVal);
  };

  const handleBlur = () => {
    isDirtyRef.current = false;
    onSaveRef.current(localValue);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-end">
        <label className="text-[10px] uppercase tracking-[0.3em] font-black text-black/40">{label}</label>
        <div className="flex items-center space-x-4">
          {aiPrompt && (
            <button 
              onClick={generateAI}
              disabled={isGenerating}
              className="flex items-center space-x-2 text-[9px] uppercase tracking-widest text-accent font-black hover:scale-105 transition-all disabled:opacity-50"
            >
              <Sparkles className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Generating...' : 'AI Suggest'}</span>
            </button>
          )}
          {description && <span className="text-[9px] uppercase tracking-widest text-accent font-bold">{description}</span>}
        </div>
      </div>
      {type === 'textarea' ? (
        <textarea 
          className="w-full border border-neutral-200 rounded-2xl p-4 focus:bg-neutral-50/20 focus:border-neutral-900 outline-none text-sm transition-all resize-none"
          rows={3}
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
        />
      ) : type === 'color' ? (
        <div className="flex items-center space-x-4 p-2 border border-neutral-200 rounded-xl bg-white">
          <input 
            type="color"
            className="w-10 h-10 border border-neutral-200 rounded-lg cursor-pointer animate-none"
            value={localValue}
            onChange={(e) => {
              handleChange(e.target.value);
              onSaveRef.current(e.target.value);
            }}
            onBlur={handleBlur}
          />
          <span className="text-xs font-semibold tracking-widest uppercase text-neutral-600">{localValue}</span>
        </div>
      ) : (
        <input 
          className="w-full border border-neutral-200 rounded-2xl p-4 focus:bg-neutral-50/20 focus:border-neutral-900 outline-none text-sm transition-all"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
        />
      )}
    </div>
  );
};

const compressImage = async (file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.80): Promise<string> => {
  if (!file) return '';

  // Try createImageBitmap first for memory-efficient async decoding on high-resolution camera photos
  if ('createImageBitmap' in window) {
    try {
      const bitmap = await createImageBitmap(file);
      let width = bitmap.width;
      let height = bitmap.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(bitmap, 0, 0, width, height);
        bitmap.close?.();
        const url = canvas.toDataURL('image/jpeg', quality);
        if (url && url.length > 50) return url;
      }
    } catch (e) {
      console.warn("createImageBitmap failed, trying FileReader fallback:", e);
    }
  }

  // FileReader fallback
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const resultStr = event.target?.result as string;
      if (!resultStr) {
        resolve('');
        return;
      }
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve('');
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedBase64);
        } catch (err) {
          console.error("Canvas compression failed:", err);
          resolve('');
        }
      };
      img.onerror = () => resolve('');
      img.src = resultStr;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
};

const compressBase64Image = (base64Str: string, maxWidth = 1200, maxHeight = 1200, quality = 0.80): Promise<string> => {
  return new Promise((resolve) => {
    if (!base64Str || !base64Str.startsWith('data:image')) {
      resolve(base64Str);
      return;
    }
    // Skip if already reasonable size (less than ~150KB base64 length)
    if (base64Str.length < 150000) {
      resolve(base64Str);
      return;
    }
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(base64Str);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const url = canvas.toDataURL('image/jpeg', quality);
        resolve(url);
      } catch (e) {
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
    img.src = base64Str;
  });
};

export const Dashboard = ({ onLogout }: { onLogout: () => void }) => {
  const { 
    banners, settings, products, storageError, dbConnected,
    updateSettings, addBanner, updateBanner, deleteBanner, 
    addProduct, updateProduct, deleteProduct,
    resetToDefaultData, forcePublishToCloud
  } = useCMS();
  const [activeTab, setActiveTab] = useState<'banners' | 'settings' | 'products'>('banners');
  const [activeSubTab, setActiveSubTab] = useState<string>('branding');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [optimizing, setOptimizing] = useState(false);
  const [optimizationLogs, setOptimizationLogs] = useState<string>('');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const optimizeAllExistingImages = useCallback(async () => {
    if (optimizing) return;
    setOptimizing(true);
    setOptimizationLogs('기존 이미지 용량 최적화 중...');
    try {
      // 1. Editorial image
      if (settings.editorialImageUrl && settings.editorialImageUrl.startsWith('data:image')) {
        const compressed = await compressBase64Image(settings.editorialImageUrl, 750, 750, 0.5);
        if (compressed !== settings.editorialImageUrl) {
          updateSettings({ editorialImageUrl: compressed });
        }
      }

      // 2. Banner images
      for (const b of banners) {
        if (b.imageUrl && b.imageUrl.startsWith('data:image')) {
          const compressed = await compressBase64Image(b.imageUrl, 750, 750, 0.5);
          if (compressed !== b.imageUrl) {
            updateBanner(b.id, { imageUrl: compressed });
          }
        }
      }

      // 3. Product images
      for (const p of products) {
        if (p.imageUrl && p.imageUrl.startsWith('data:image')) {
          const compressed = await compressBase64Image(p.imageUrl, 750, 750, 0.5);
          if (compressed !== p.imageUrl) {
            updateProduct(p.id, { imageUrl: compressed });
          }
        }
      }

      setOptimizationLogs('최적화 완료! 이미지 용량이 수십 분의 일 수준으로 가벼워졌습니다.');
      setTimeout(() => setOptimizationLogs(''), 4000);
    } catch (e) {
      console.error(e);
      setOptimizationLogs('최적화 처리 중 오류가 발생했습니다.');
    } finally {
      setOptimizing(false);
    }
  }, [banners, settings, products, updateSettings, updateBanner, updateProduct, optimizing]);

  // Run automatically if storage error is detected
  useEffect(() => {
    if (storageError && !optimizing) {
      optimizeAllExistingImages();
    }
  }, [storageError, optimizeAllExistingImages, optimizing]);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, []);

  // Enhanced auto-save feedback with clearable single-source-of-truth timers
  const handleUpdate = useCallback((fn: Function) => (...args: any[]) => {
    setSaveStatus('saving');
    
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);

    fn(...args);

    saveTimeoutRef.current = setTimeout(() => {
      setSaveStatus('saved');
      idleTimeoutRef.current = setTimeout(() => {
        setSaveStatus('idle');
      }, 1500);
    }, 600);
  }, []);

  const wrapUpdateSettings = handleUpdate(updateSettings);
  const wrapUpdateBanner = handleUpdate(updateBanner);
  const wrapUpdateProduct = handleUpdate(updateProduct);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file: File) => {
    if (!file) return '';
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일(JPG, PNG, WEBP 등)만 선택 가능합니다.');
      return '';
    }
    setUploading(true);
    try {
      const url = await compressImage(file);
      if (!url) {
        alert('이미지 압축 처리에 실패했습니다. 다른 사진을 선택해 주세요.');
        return '';
      }
      return url;
    } catch (err) {
      console.error("Image upload failed:", err);
      alert('사진 선택 처리 중 오류가 발생했습니다.');
      return '';
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Sidebar */}
      <aside className="lg:w-72 bg-white border-b lg:border-b-0 lg:border-r border-neutral-100 p-6 lg:p-10 flex flex-row lg:flex-col items-center lg:items-stretch justify-between lg:justify-start relative z-20 overflow-x-auto lg:overflow-x-visible no-scrollbar">
        <div className="mb-0 lg:mb-16 flex items-center lg:block shrink-0 mr-8 lg:mr-0">
          <h1 className="text-2xl lg:text-3xl font-display font-light tracking-tighter uppercase whitespace-nowrap text-neutral-800">{settings?.logoText || "L'AURA"}</h1>
          <p className="hidden lg:block text-[9px] uppercase tracking-[0.4em] text-neutral-400 font-bold mt-2">Admin Panel</p>
        </div>
        
        <nav className="flex flex-row lg:flex-col space-y-2 lg:space-y-3 shrink-0">
          <button 
            onClick={() => setActiveTab('banners')}
            className={`flex items-center space-x-2 lg:space-x-4 px-4 lg:px-6 py-2.5 lg:py-4 rounded-xl transition-all duration-300 whitespace-nowrap ${activeTab === 'banners' ? 'bg-neutral-900 text-white shadow-md' : 'text-neutral-400 hover:bg-neutral-50 hover:text-neutral-800'}`}
          >
            <Layout className="w-4 h-4 lg:w-5 lg:h-5" />
            <span className="text-[8px] lg:text-[10px] uppercase tracking-[0.2em] lg:tracking-[0.3em] font-black">Banners</span>
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`flex items-center space-x-2 lg:space-x-4 px-4 lg:px-6 py-2.5 lg:py-4 rounded-xl transition-all duration-300 whitespace-nowrap ${activeTab === 'products' ? 'bg-neutral-900 text-white shadow-md' : 'text-neutral-400 hover:bg-neutral-50 hover:text-neutral-800'}`}
          >
            <ShoppingBag className="w-4 h-4 lg:w-5 lg:h-5" />
            <span className="text-[8px] lg:text-[10px] uppercase tracking-[0.2em] lg:tracking-[0.3em] font-black">Products</span>
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-2 lg:space-x-4 px-4 lg:px-6 py-2.5 lg:py-4 rounded-xl transition-all duration-300 whitespace-nowrap ${activeTab === 'settings' ? 'bg-neutral-900 text-white shadow-md' : 'text-neutral-400 hover:bg-neutral-50 hover:text-neutral-800'}`}
          >
            <Settings className="w-4 h-4 lg:w-5 lg:h-5" />
            <span className="text-[8px] lg:text-[10px] uppercase tracking-[0.2em] lg:tracking-[0.3em] font-black">Site Content</span>
          </button>
        </nav>

        <button 
          onClick={onLogout}
          className="ml-4 lg:ml-0 lg:mt-auto flex items-center space-x-2 lg:space-x-4 px-3 lg:px-6 py-2 lg:py-4 text-black/40 hover:text-red-500 transition-all border-2 border-transparent hover:border-red-500 whitespace-nowrap"
        >
          <LogOut className="w-4 h-4 lg:w-5 lg:h-5" />
          <span className="text-[8px] lg:text-[10px] uppercase tracking-[0.2em] lg:tracking-[0.3em] font-black">Sign Out</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-16 overflow-y-auto relative">
        <div className="noise-bg opacity-20" />
        <div className="max-w-5xl mx-auto relative z-10">
          {optimizationLogs && (
            <div className="mb-8 p-6 border-2 border-accent bg-[#F9F9F9] text-black rounded-none space-y-1 focus-within:outline-none animate-in fade-in duration-300">
              <p className="font-sans font-bold uppercase tracking-[0.15em] text-[10px] text-accent flex items-center space-x-2">
                <span className="animate-spin mr-1">⚡</span>
                <span>System Optimization Engine (시스템 용량 최적화 진행 중)</span>
              </p>
              <p className="text-xs leading-relaxed font-sans font-semibold text-black">
                {optimizationLogs}
              </p>
            </div>
          )}
          {storageError && (
            <div className="mb-8 p-6 border-2 border-red-500 bg-red-50 text-red-900 rounded-none space-y-4 focus-within:outline-none animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="space-y-2">
                <p className="font-sans font-bold uppercase tracking-[0.15em] text-[10px] text-red-800 flex items-center space-x-2">
                  <span>⚠️ Storage Limit Alert (용량 초과 알림)</span>
                </p>
                <p className="text-xs leading-relaxed font-sans font-medium text-red-700">
                  {storageError}
                </p>
              </div>
              <button
                onClick={optimizeAllExistingImages}
                disabled={optimizing}
                className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-neutral-300 text-white font-bold text-[10px] uppercase tracking-[0.2em] px-4 py-2 border-2 border-transparent transition-all cursor-pointer"
              >
                <span>{optimizing ? '최적화 가동 중...' : '⚡ 고화질 즉시 압축 및 용량 최적화 실행'}</span>
              </button>
            </div>
          )}
          <div className="fixed top-8 right-8 z-50 pointer-events-none">
            <AnimatePresence>
              {saveStatus !== 'idle' && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`px-6 py-3 border-2 border-black flex items-center space-x-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                    saveStatus === 'saving' ? 'bg-white' : 'bg-accent'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${saveStatus === 'saving' ? 'bg-black animate-pulse' : 'bg-black'}`} />
                  <span className="text-[10px] uppercase tracking-widest font-black">
                    {saveStatus === 'saving' ? 'Auto-saving...' : 'Changes Saved'}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-12 md:mb-16">
            <div>
              <h2 className="text-5xl md:text-7xl font-display tracking-tighter uppercase font-black">{activeTab}</h2>
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <div className="w-8 h-[2px] bg-accent" />
                <p className="text-[10px] uppercase tracking-[0.3em] text-black/40 font-black">Management Console</p>
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 border ${dbConnected ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-amber-50 text-amber-800 border-amber-300'}`}>
                  {dbConnected ? '🔥 Firebase Cloud DB Active' : '⚡ Local Backup Mode'}
                </span>
              </div>
              {/* Quick Tab Switcher & Cloud Publish Actions */}
              <div className="flex flex-wrap items-center gap-2 mt-5">
                <button 
                  onClick={() => setActiveTab('banners')} 
                  className={`px-4 py-2 text-[10px] font-extrabold uppercase tracking-widest border transition-all cursor-pointer ${activeTab === 'banners' ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm' : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-900 hover:text-neutral-900'}`}
                >
                  Banners ({banners.length})
                </button>
                <button 
                  onClick={() => setActiveTab('products')} 
                  className={`px-4 py-2 text-[10px] font-extrabold uppercase tracking-widest border transition-all cursor-pointer ${activeTab === 'products' ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm' : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-900 hover:text-neutral-900'}`}
                >
                  Products ({products.length})
                </button>
                <button 
                  onClick={() => setActiveTab('settings')} 
                  className={`px-4 py-2 text-[10px] font-extrabold uppercase tracking-widest border transition-all cursor-pointer ${activeTab === 'settings' ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm' : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-900 hover:text-neutral-900'}`}
                >
                  Site Content
                </button>

                <div className="h-4 w-[1px] bg-neutral-300 mx-2 hidden sm:block" />

                <button
                  onClick={forcePublishToCloud}
                  className="px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-sm cursor-pointer"
                  title="현재 수정본을 클라우드 데이터베이스에 강제 저장하여 퍼블리시에 즉시 반영합니다"
                >
                  ☁️ 현재 데이터 클라우드 저장 (Publish)
                </button>

                <button
                  onClick={() => {
                    if (confirm("정말로 예전 클라우드/로컬 데이터를 모두 삭제하고, 최신 기본 원본 코드로 깨끗이 리셋하시겠습니까?")) {
                      resetToDefaultData();
                    }
                  }}
                  className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest bg-neutral-100 text-neutral-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-neutral-200 transition-all cursor-pointer"
                  title="예전 파편 데이터를 모두 지우고 원본 데이터로 리셋합니다"
                >
                  🧹 예전 데이터 완전히 삭제/초기화
                </button>
              </div>
            </div>
            {activeTab === 'banners' && (
              <button 
                onClick={() => addBanner({ imageUrl: '', title: 'NEW BANNER', subtitle: 'COLLECTION', link: '#', order: banners.length })} 
                className="px-10 py-5 bg-black text-white text-[10px] uppercase tracking-widest font-black hover:bg-accent hover:text-black transition-all border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 flex items-center space-x-4"
              >
                <Plus className="w-4 h-4" />
                <span>Add Banner</span>
              </button>
            )}
            {activeTab === 'products' && (
              <button 
                onClick={() => addProduct({ name: 'NEW PRODUCT', price: 0, imageUrl: '', category: 'GENERAL', description: '' })} 
                className="px-10 py-5 bg-black text-white text-[10px] uppercase tracking-widest font-black hover:bg-accent hover:text-black transition-all border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 flex items-center space-x-4"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
            )}
          </header>

          {activeTab === 'banners' && (
            <div className="grid gap-12">
              {banners.map((banner) => (
                <div key={banner.id} className="bg-white p-6 md:p-8 border border-neutral-100 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex flex-col md:flex-row gap-8 md:gap-12 group">
                  <div className="w-full md:w-64 h-48 md:h-40 bg-neutral-50 border border-neutral-100 rounded-2xl overflow-hidden relative shrink-0">
                    {banner.imageUrl && <img src={banner.imageUrl} alt="" className="w-full h-full object-cover transition-all duration-700" />}
                    <div className="absolute inset-0 bg-black/75 opacity-100 md:opacity-0 md:group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300 pointer-events-none">
                      <ImageIcon className="text-accent w-8 h-8 mb-2" />
                      <span className="text-[9px] uppercase tracking-widest font-black text-white">Change Visual (사진 변경)</span>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleImageUpload(file);
                          if (url) updateBanner(banner.id, { imageUrl: url });
                        }
                        e.target.value = '';
                      }}
                    />
                  </div>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                    <EditableField label="Title" value={banner.title} onSave={(val) => updateBanner(banner.id, { title: val })} aiPrompt="Write a catchy fashion banner title" />
                    <EditableField label="Subtitle" value={banner.subtitle} onSave={(val) => updateBanner(banner.id, { subtitle: val })} aiPrompt="Write a short fashion subtitle" />
                    <EditableField label="CTA Button Text" value={banner.ctaText || 'Shop Collection'} onSave={(val) => updateBanner(banner.id, { ctaText: val })} />
                    <EditableField label="Decorative Text" value={banner.decorativeText || 'STUDIO'} onSave={(val) => updateBanner(banner.id, { decorativeText: val })} />
                    <EditableField label="Link" value={banner.link} onSave={(val) => updateBanner(banner.id, { link: val })} />
                    <div className="flex items-end justify-end">
                      <button onClick={() => deleteBanner(banner.id)} className="p-4 border-2 border-transparent hover:border-red-500 text-black/20 hover:text-red-500 transition-all">
                        <Trash2 className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'products' && (
            <div className="grid gap-12">
              {products.map((product) => (
                <div key={product.id} className="bg-white p-6 md:p-8 border border-neutral-100 rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.03)] flex flex-col md:flex-row gap-8 md:gap-12 group">
                  <div className="w-full md:w-48 h-60 md:h-48 bg-neutral-50 border border-neutral-100 rounded-2xl overflow-hidden relative shrink-0">
                    {product.imageUrl && <img src={product.imageUrl} alt="" className="w-full h-full object-cover transition-all duration-700" />}
                    <div className="absolute inset-0 bg-black/75 opacity-100 md:opacity-0 md:group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300 pointer-events-none">
                      <ImageIcon className="text-accent w-8 h-8 mb-2" />
                      <span className="text-[9px] uppercase tracking-widest font-black text-white">Change Visual (사진 변경)</span>
                    </div>
                    <input 
                      type="file" 
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleImageUpload(file);
                          if (url) updateProduct(product.id, { imageUrl: url });
                        }
                        e.target.value = '';
                      }}
                    />
                  </div>
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                    <EditableField label="Name" value={product.name} onSave={(val) => updateProduct(product.id, { name: val })} aiPrompt="Write a luxury product name" />
                    <EditableField label="Price" value={String(product.price)} onSave={(val) => updateProduct(product.id, { price: Number(val) })} />
                    <EditableField label="Category" value={product.category} onSave={(val) => updateProduct(product.id, { category: val })} />
                    <EditableField 
                      label="Description" 
                      value={product.description} 
                      onSave={(val) => updateProduct(product.id, { description: val })} 
                      type="textarea"
                      aiPrompt={`Write a luxury description for a ${product.category} named ${product.name}`}
                    />
                    <div className="col-span-2 flex items-end justify-between">
                      <EditableField 
                        label="Purchase Link (구매 링크 URL)" 
                        value={product.buyUrl || product.link || ''} 
                        onSave={(val) => updateProduct(product.id, { buyUrl: val, link: val })} 
                        description="구매하기 버튼 클릭 시 이동할 링크 (스마트스토어, 무신사, 결제페이지 등)"
                      />
                      <button onClick={() => deleteProduct(product.id)} className="p-4 border-2 border-transparent hover:border-red-500 text-black/20 hover:text-red-500 transition-all">
                        <Trash2 className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'settings' && settings && (
            <div className="flex flex-col lg:flex-row gap-12 pb-40">
              {/* Sticky Sub-navigation */}
              <div className="lg:w-64 shrink-0">
                <div className="sticky top-12 space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.4em] font-black text-black/20 mb-6 px-4">Sections</p>
                  {[
                    { id: 'branding', label: 'Global Branding', icon: Type },
                    { id: 'theme', label: 'Aesthetic Presets', icon: Sparkles },
                    { id: 'hero', label: 'Hero & Marquee', icon: Layout },
                    { id: 'curated', label: 'Curated Store', icon: ShoppingBag },
                    { id: 'editorial', label: 'Editorial Showcase', icon: ImageIcon },
                    { id: 'story', label: 'Brand Story (Our Essence)', icon: Layout },
                    { id: 'newsletter', label: 'Newsletter Banner', icon: Move },
                    { id: 'ui', label: 'UI Labels & Links', icon: Settings },
                    { id: 'features', label: 'Smart Features', icon: Sparkles },
                    { id: 'spacing', label: 'Layout Spacing', icon: Move },
                    { id: 'seo', label: 'SEO & Social Sharing', icon: Settings },
                  ].map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => setActiveSubTab(sub.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-[9px] uppercase tracking-widest font-black transition-all border-2 ${
                        activeSubTab === sub.id 
                          ? 'bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                          : 'border-transparent text-black/40 hover:text-black hover:border-black'
                      }`}
                    >
                      <sub.icon className="w-4 h-4" />
                      <span>{sub.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 space-y-8">
                {activeSubTab === 'branding' && (
                  <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-3xl uppercase tracking-[0.4em] font-black border-b-4 border-black pb-6 flex items-center space-x-6">
                      <Type className="w-8 h-8" />
                      <span>Global Branding</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-2 border-black p-8 bg-paper/30">
                      <div className="space-y-8">
                        <EditableField label="Logo Text" value={settings.logoText} onSave={(val) => wrapUpdateSettings({ logoText: val })} />
                        <TypographyEditor label="Logo" settings={settings.logoStyle} onSave={(val) => wrapUpdateSettings({ logoStyle: val })} />
                      </div>
                      <div className="space-y-8">
                        <EditableField label="Footer Description" value={settings.footerDescription} onSave={(val) => wrapUpdateSettings({ footerDescription: val })} type="textarea" aiPrompt="Write a luxury brand footer description" />
                        <TypographyEditor label="Nav Links" settings={settings.navLinkStyle} onSave={(val) => wrapUpdateSettings({ navLinkStyle: val })} />
                      </div>
                    </div>
                  </section>
                )}

                {activeSubTab === 'theme' && (
                  <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-3xl uppercase tracking-[0.4em] font-black border-b-4 border-black pb-6 flex items-center space-x-6">
                      <Sparkles className="w-8 h-8" />
                      <span>Aesthetic Presets & Fonts</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-2 border-black p-8 bg-paper/30">
                      <div className="space-y-6">
                        <div>
                          <label className="text-[10px] uppercase tracking-[0.3em] font-black text-black/40 mb-3 block">Font Family Preset (한글/영문 글씨체)</label>
                          <div className="grid grid-cols-1 gap-2.5">
                            {[
                              { id: 'round', label: '둥근 글씨체 (NanumSquareRound)', desc: '다정하고 부드러운 하이클래스 라운드 폰트' },
                              { id: 'modern', label: '현대적인 고딕 (Pretendard / Inter)', desc: '깔끔하고 정밀하게 설계된 현대적인 세련미' },
                              { id: 'classic', label: '클래식 명조 (Noto Serif / Gowun)', desc: '시적이고 단아함을 머금은 서정적 분위기' },
                              { id: 'minimal', label: '미니멀 시크 (Syne / Montserrat)', desc: '임팩트 있는 타이포 브랜딩 비주얼 연출' },
                            ].map((preset) => (
                              <button
                                key={preset.id}
                                onClick={() => wrapUpdateSettings({ fontSet: preset.id as any })}
                                className={`p-4 border text-left transition-all rounded-none ${
                                  settings.fontSet === preset.id
                                    ? 'bg-neutral-900 border-neutral-900 text-white'
                                    : 'bg-white border-neutral-200 text-neutral-800 hover:border-neutral-900'
                                }`}
                              >
                                <div className="text-[11px] font-bold uppercase tracking-wider">{preset.label}</div>
                                <div className={`text-[9px] mt-1 ${settings.fontSet === preset.id ? 'text-neutral-300' : 'text-neutral-400'}`}>
                                  {preset.desc}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="text-[10px] uppercase tracking-[0.3em] font-black text-black/40 mb-3 block">Aesthetic Presets (테마)</label>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              { id: 'DEFAULT', label: 'Default Sumsum', bg: '#F9F9F9', text: '#222222', accent: '#1E291B' },
                              { id: 'NOCTURNAL', label: 'Nocturnal Black', bg: '#111111', text: '#F9F9F9', accent: '#E5E5E5' },
                              { id: 'PARCHMENT', label: 'Warm Parchment', bg: '#FAF6EE', text: '#2A2421', accent: '#8B5A2B' },
                              { id: 'ROSE', label: 'Silent Rose', bg: '#FAF2F2', text: '#3A2E2E', accent: '#8B5A65' },
                            ].map((preset) => (
                              <button
                                key={preset.id}
                                onClick={() => {
                                  wrapUpdateSettings({ 
                                    themePreset: preset.id as any,
                                    primaryColor: preset.text,
                                    accentColor: preset.accent
                                  });
                                }}
                                className={`p-4 border text-left transition-all rounded-none flex flex-col justify-between h-28 ${
                                  settings.themePreset === preset.id
                                    ? 'bg-neutral-900 border-neutral-900 text-white'
                                    : 'bg-white border-neutral-200 text-neutral-800 hover:border-neutral-900'
                                }`}
                              >
                                <span className="text-[10px] font-bold tracking-wider">{preset.label}</span>
                                <div className="flex gap-1.5 mt-2">
                                  <div className="w-5 h-5 rounded-full border border-neutral-200" style={{ backgroundColor: preset.bg }} />
                                  <div className="w-5 h-5 rounded-full border border-neutral-200" style={{ backgroundColor: preset.text }} />
                                  <div className="w-5 h-5 rounded-full border border-neutral-200" style={{ backgroundColor: preset.accent }} />
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-neutral-200">
                          <EditableField label="Custom Primary Color" value={settings.primaryColor} onSave={(val) => wrapUpdateSettings({ primaryColor: val })} type="color" />
                          <EditableField label="Custom Accent Color" value={settings.accentColor} onSave={(val) => wrapUpdateSettings({ accentColor: val })} type="color" />
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {activeSubTab === 'features' && (
                  <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-3xl uppercase tracking-[0.4em] font-black border-b-4 border-black pb-6 flex items-center space-x-6">
                      <Sparkles className="w-8 h-8" />
                      <span>Smart Features & Interaction (스마트 기능)</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-2 border-black p-8 bg-paper/30">
                      <div className="space-y-8">
                        <div className="flex items-center justify-between p-4 border border-neutral-100 bg-white">
                          <div>
                            <div className="text-[10px] uppercase tracking-widest font-black text-neutral-800">Custom Premium Cursor (감각적 커서)</div>
                            <div className="text-[9px] text-[#777777] mt-1">인터랙티브 마우스 디테일 애니메이션 효과 활성화</div>
                          </div>
                          <button 
                            onClick={() => wrapUpdateSettings({ showCustomCursor: !settings.showCustomCursor })}
                            className={`w-14 h-7 border transition-all relative ${settings.showCustomCursor ? 'bg-neutral-950' : 'bg-neutral-100'}`}
                          >
                            <div className={`absolute top-0.5 bottom-0.5 w-5 bg-white border transition-all ${settings.showCustomCursor ? 'right-0.5' : 'left-0.5'}`} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-neutral-100 bg-white">
                          <div>
                            <div className="text-[10px] uppercase tracking-widest font-black text-neutral-800">Dynamic Scroll Progress (스크롤 리시버)</div>
                            <div className="text-[9px] text-[#777777] mt-1">상단 바 스크롤 읽기 진척도 인디케이터 활성화</div>
                          </div>
                          <button 
                            onClick={() => wrapUpdateSettings({ showScrollProgress: !settings.showScrollProgress })}
                            className={`w-14 h-7 border transition-all relative ${settings.showScrollProgress ? 'bg-neutral-950' : 'bg-neutral-100'}`}
                          >
                            <div className={`absolute top-0.5 bottom-0.5 w-5 bg-white border transition-all ${settings.showScrollProgress ? 'right-0.5' : 'left-0.5'}`} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-8">
                        <div className="flex items-center justify-between p-4 border border-neutral-100 bg-white">
                          <div>
                            <div className="text-[10px] uppercase tracking-widest font-black text-neutral-800">Floating Decorative Element (떠다니는 플로터)</div>
                            <div className="text-[9px] text-[#777777] mt-1">세련된 일상 키워드를 흘려보내는 백그라운드 애니메이션</div>
                          </div>
                          <button 
                            onClick={() => wrapUpdateSettings({ showFloatingElements: !settings.showFloatingElements })}
                            className={`w-14 h-7 border transition-all relative ${settings.showFloatingElements ? 'bg-neutral-950' : 'bg-neutral-100'}`}
                          >
                            <div className={`absolute top-0.5 bottom-0.5 w-5 bg-white border transition-all ${settings.showFloatingElements ? 'right-0.5' : 'left-0.5'}`} />
                          </button>
                        </div>

                        <div className="flex items-center justify-between p-4 border border-neutral-100 bg-white">
                          <div>
                            <div className="text-[10px] uppercase tracking-widest font-black text-neutral-800">Welcome Newsletter Overlay (구독 팝업창)</div>
                            <div className="text-[9px] text-[#777777] mt-1">첫 페이지 접속 시 럭셔리 이메일 구독 다이얼로그 노출</div>
                          </div>
                          <button 
                            onClick={() => wrapUpdateSettings({ showNewsletterPopup: !settings.showNewsletterPopup })}
                            className={`w-14 h-7 border transition-all relative ${settings.showNewsletterPopup ? 'bg-neutral-950' : 'bg-neutral-100'}`}
                          >
                            <div className={`absolute top-0.5 bottom-0.5 w-5 bg-white border transition-all ${settings.showNewsletterPopup ? 'right-0.5' : 'left-0.5'}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {activeSubTab === 'hero' && (
                  <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-3xl uppercase tracking-[0.4em] font-black border-b-4 border-black pb-6 flex items-center space-x-6">
                      <Layout className="w-8 h-8" />
                      <span>Hero & Marquee Content</span>
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <div className="space-y-8">
                        <EditableField label="Hero Title" value={settings.heroTitle} onSave={(val) => wrapUpdateSettings({ heroTitle: val })} aiPrompt="Write a bold hero title" />
                        <TypographyEditor label="Hero Title Style" settings={settings.heroTitleStyle} onSave={(val) => wrapUpdateSettings({ heroTitleStyle: val })} />
                      </div>
                      <div className="space-y-8">
                        <EditableField label="Hero Subtitle" value={settings.heroSubtitle} onSave={(val) => wrapUpdateSettings({ heroSubtitle: val })} />
                        <TypographyEditor label="Hero Subtitle Style" settings={settings.heroSubtitleStyle} onSave={(val) => wrapUpdateSettings({ heroSubtitleStyle: val })} />
                      </div>
                      <div className="col-span-full space-y-8 pt-8 border-t-2 border-black/10">
                        <EditableField label="Marquee Text" value={settings.marqueeText} onSave={(val) => wrapUpdateSettings({ marqueeText: val })} aiPrompt="Write a high-energy marquee announcement" />
                        <TypographyEditor label="Marquee Style" settings={settings.marqueeStyle} onSave={(val) => wrapUpdateSettings({ marqueeStyle: val })} />
                      </div>
                    </div>
                  </section>
                )}

                {activeSubTab === 'curated' && (
                  <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-3xl uppercase tracking-[0.4em] font-black border-b-4 border-black pb-6 flex items-center space-x-6">
                      <ShoppingBag className="w-8 h-8" />
                      <span>Curated Store Section</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <EditableField label="Curated Badge / Tag" value={settings.curatedBadgeText || 'CURATED STORE'} onSave={(val) => wrapUpdateSettings({ curatedBadgeText: val })} />
                      <EditableField label="Curated Section Title" value={settings.curatedTitle || 'NEW & FEATURED OBJECTS'} onSave={(val) => wrapUpdateSettings({ curatedTitle: val })} />
                    </div>
                  </section>
                )}

                {activeSubTab === 'editorial' && (
                  <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-3xl uppercase tracking-[0.4em] font-black border-b-4 border-black pb-6 flex items-center space-x-6">
                      <ImageIcon className="w-8 h-8" />
                      <span>Editorial Showcase</span>
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <div className="space-y-8">
                        <EditableField label="Editorial Subtitle" value={settings.editorialSubtitle} onSave={(val) => wrapUpdateSettings({ editorialSubtitle: val })} />
                        <EditableField label="Editorial Title" value={settings.editorialTitle} onSave={(val) => wrapUpdateSettings({ editorialTitle: val })} />
                        <TypographyEditor label="Editorial Title Style" settings={settings.editorialTitleStyle} onSave={(val) => wrapUpdateSettings({ editorialTitleStyle: val })} />
                      </div>
                      <div className="space-y-8">
                        <EditableField label="Editorial Description" value={settings.editorialDescription} onSave={(val) => wrapUpdateSettings({ editorialDescription: val })} type="textarea" aiPrompt="Write a poetic editorial description" />
                        <TypographyEditor label="Editorial Description Style" settings={settings.editorialDescriptionStyle} onSave={(val) => wrapUpdateSettings({ editorialDescriptionStyle: val })} />
                      </div>

                      {/* Keypoints */}
                      <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t-2 border-black/10">
                        <EditableField label="Keypoint 1 Title" value={settings.editorialKeypoint1Title || '01. NATURAL CLAY'} onSave={(val) => wrapUpdateSettings({ editorialKeypoint1Title: val })} />
                        <EditableField label="Keypoint 1 Description" value={settings.editorialKeypoint1Desc || '자연의 흙과 트라버틴 석재 고유의 질감'} onSave={(val) => wrapUpdateSettings({ editorialKeypoint1Desc: val })} />
                        <EditableField label="Keypoint 2 Title" value={settings.editorialKeypoint2Title || '02. SLOW DESIGN'} onSave={(val) => wrapUpdateSettings({ editorialKeypoint2Title: val })} />
                        <EditableField label="Keypoint 2 Description" value={settings.editorialKeypoint2Desc || '오래도록 질리지 않는 정돈된 미니멀 형태'} onSave={(val) => wrapUpdateSettings({ editorialKeypoint2Desc: val })} />
                        <EditableField label="Explore Button Text" value={settings.editorialButtonText} onSave={(val) => wrapUpdateSettings({ editorialButtonText: val })} />
                        <EditableField label="Explore Button Link" value={settings.editorialButtonLink || '/shop'} onSave={(val) => wrapUpdateSettings({ editorialButtonLink: val })} />
                        <EditableField label="Image Overlay Tag" value={settings.editorialOverlayTag || 'CURATED LOOKBOOK'} onSave={(val) => wrapUpdateSettings({ editorialOverlayTag: val })} />
                        <EditableField label="Image Overlay Title" value={settings.editorialOverlayTitle || 'STUDIO SUMSUM ARCHIVE'} onSave={(val) => wrapUpdateSettings({ editorialOverlayTitle: val })} />
                      </div>

                      <div className="col-span-full">
                        <label className="text-[10px] uppercase tracking-[0.3em] font-black text-black/40 mb-4 block">Editorial Visual Image</label>
                        <div className="relative aspect-video border-2 border-black overflow-hidden group">
                          <img src={settings.editorialImageUrl} className="w-full h-full object-cover" alt="" />
                          <div className="absolute inset-0 bg-black/75 opacity-100 md:opacity-0 md:group-hover:opacity-100 flex flex-col items-center justify-center transition-all pointer-events-none">
                            <ImageIcon className="text-accent w-10 h-10 mb-2" />
                            <span className="text-white text-[10px] uppercase tracking-widest font-black">Upload Visual Image (사진 변경)</span>
                          </div>
                          <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = await handleImageUpload(file);
                              if (url) wrapUpdateSettings({ editorialImageUrl: url });
                            }
                            e.target.value = '';
                          }} />
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {activeSubTab === 'story' && (
                  <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-3xl uppercase tracking-[0.4em] font-black border-b-4 border-black pb-6 flex items-center space-x-6">
                      <Layout className="w-8 h-8" />
                      <span>Brand Story (Our Essence) Section</span>
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                      <div className="space-y-8">
                        <EditableField label="Badge / Section Tag" value={settings.aboutBadgeText || 'OUR ESSENCE & STORY'} onSave={(val) => wrapUpdateSettings({ aboutBadgeText: val })} />
                        <EditableField label="About Title" value={settings.aboutTitle} onSave={(val) => wrapUpdateSettings({ aboutTitle: val })} />
                        <TypographyEditor label="About Title Style" settings={settings.aboutTitleStyle} onSave={(val) => wrapUpdateSettings({ aboutTitleStyle: val })} />
                      </div>
                      <div className="space-y-8">
                        <EditableField label="About Description" value={settings.aboutDescription} onSave={(val) => wrapUpdateSettings({ aboutDescription: val })} type="textarea" aiPrompt="Write an authentic brand story for Studio Sumsum" />
                        <TypographyEditor label="About Description Style" settings={settings.aboutDescriptionStyle} onSave={(val) => wrapUpdateSettings({ aboutDescriptionStyle: val })} />
                      </div>

                      <div className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t-2 border-black/10">
                        <EditableField label="Feature 1 Title" value={settings.philosophyFeature1Title} onSave={(val) => wrapUpdateSettings({ philosophyFeature1Title: val })} />
                        <EditableField label="Feature 1 Description" value={settings.philosophyFeature1Description} onSave={(val) => wrapUpdateSettings({ philosophyFeature1Description: val })} type="textarea" />
                        <EditableField label="Feature 2 Title" value={settings.philosophyFeature2Title} onSave={(val) => wrapUpdateSettings({ philosophyFeature2Title: val })} />
                        <EditableField label="Feature 2 Description" value={settings.philosophyFeature2Description} onSave={(val) => wrapUpdateSettings({ philosophyFeature2Description: val })} type="textarea" />
                      </div>

                      {/* Story Images Upload */}
                      <div className="col-span-full space-y-6 pt-6 border-t-2 border-black/10">
                        <h4 className="text-xl uppercase tracking-widest font-black">Brand Story Visual Photos</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                          {/* Image 1 */}
                          <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest font-black text-black/40">Story Image 1</label>
                            <div className="relative aspect-[3/4] border-2 border-black overflow-hidden group">
                              <img src={settings.archiveImage1 || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600'} className="w-full h-full object-cover" alt="" />
                              <div className="absolute inset-0 bg-black/75 opacity-100 md:opacity-0 md:group-hover:opacity-100 flex flex-col items-center justify-center transition-all pointer-events-none">
                                <ImageIcon className="text-accent w-8 h-8 mb-2" />
                                <span className="text-white text-[10px] uppercase tracking-widest font-black">Upload Photo 1 (사진 변경)</span>
                              </div>
                              <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const url = await handleImageUpload(file);
                                  if (url) wrapUpdateSettings({ archiveImage1: url });
                                }
                                e.target.value = '';
                              }} />
                            </div>
                            <EditableField label="Image 1 URL" value={settings.archiveImage1 || ''} onSave={(val) => wrapUpdateSettings({ archiveImage1: val })} />
                          </div>

                          {/* Image 2 */}
                          <div className="space-y-4">
                            <label className="text-[10px] uppercase tracking-widest font-black text-black/40">Story Image 2</label>
                            <div className="relative aspect-[3/4] border-2 border-black overflow-hidden group">
                              <img src={settings.archiveImage2 || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=600'} className="w-full h-full object-cover" alt="" />
                              <div className="absolute inset-0 bg-black/75 opacity-100 md:opacity-0 md:group-hover:opacity-100 flex flex-col items-center justify-center transition-all pointer-events-none">
                                <ImageIcon className="text-accent w-8 h-8 mb-2" />
                                <span className="text-white text-[10px] uppercase tracking-widest font-black">Upload Photo 2 (사진 변경)</span>
                              </div>
                              <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const url = await handleImageUpload(file);
                                  if (url) wrapUpdateSettings({ archiveImage2: url });
                                }
                                e.target.value = '';
                              }} />
                            </div>
                            <EditableField label="Image 2 URL" value={settings.archiveImage2 || ''} onSave={(val) => wrapUpdateSettings({ archiveImage2: val })} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {activeSubTab === 'newsletter' && (
                  <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-3xl uppercase tracking-[0.4em] font-black border-b-4 border-black pb-6 flex items-center space-x-6">
                      <Move className="w-8 h-8" />
                      <span>Newsletter Signup Banner</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <EditableField label="Banner Badge / Tag" value={settings.newsletterTag || 'SENSORY JOURNAL'} onSave={(val) => wrapUpdateSettings({ newsletterTag: val })} />
                      <EditableField label="Banner Title" value={settings.newsletterTitle || 'SUBSCRIBE FOR NEW RELEASES & EXCLUSIVE PROPS'} onSave={(val) => wrapUpdateSettings({ newsletterTitle: val })} />
                      <div className="col-span-full">
                        <EditableField label="Banner Description" value={settings.newsletterDescription || '새로운 오브제 드롭 및 스페셜 에디션 출시 소식을 가장 먼저 이메일로 받아보세요.'} onSave={(val) => wrapUpdateSettings({ newsletterDescription: val })} type="textarea" />
                      </div>
                      <EditableField label="Input Placeholder" value={settings.newsletterPlaceholder || 'Enter your email address'} onSave={(val) => wrapUpdateSettings({ newsletterPlaceholder: val })} />
                      <EditableField label="Button Text" value={settings.newsletterButtonText || 'SUBSCRIBE'} onSave={(val) => wrapUpdateSettings({ newsletterButtonText: val })} />
                    </div>
                  </section>
                )}

                {activeSubTab === 'ui' && (
                  <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-3xl uppercase tracking-[0.4em] font-black border-b-4 border-black pb-6 flex items-center space-x-6">
                      <Settings className="w-8 h-8" />
                      <span>UI Labels & Social Links</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                      <EditableField label="Nav: Home" value={settings.navHomeText} onSave={(val) => wrapUpdateSettings({ navHomeText: val })} />
                      <EditableField label="Nav: Shop" value={settings.navShopText} onSave={(val) => wrapUpdateSettings({ navShopText: val })} />
                      <EditableField label="Nav: Editorial" value={settings.navEditorialText} onSave={(val) => wrapUpdateSettings({ navEditorialText: val })} />
                      <EditableField label="Nav: About" value={settings.navAboutText} onSave={(val) => wrapUpdateSettings({ navAboutText: val })} />
                      <EditableField label="Search Placeholder" value={settings.searchPlaceholder} onSave={(val) => wrapUpdateSettings({ searchPlaceholder: val })} />
                      <EditableField label="Footer Newsletter Title" value={settings.footerNewsletterTitle} onSave={(val) => wrapUpdateSettings({ footerNewsletterTitle: val })} />
                      <EditableField label="Footer Newsletter Placeholder" value={settings.footerNewsletterPlaceholder} onSave={(val) => wrapUpdateSettings({ footerNewsletterPlaceholder: val })} />
                      <EditableField label="Footer Newsletter Button" value={settings.footerNewsletterButtonText} onSave={(val) => wrapUpdateSettings({ footerNewsletterButtonText: val })} />
                      <div className="space-y-8">
                        <EditableField label="Footer Rights Text" value={settings.footerRightsText} onSave={(val) => wrapUpdateSettings({ footerRightsText: val })} />
                        <TypographyEditor label="Footer Rights Style" settings={settings.footerRightsStyle} onSave={(val) => wrapUpdateSettings({ footerRightsStyle: val })} />
                      </div>
                      <div className="space-y-8">
                        <EditableField label="Shop Page Title" value={settings.shopTitle} onSave={(val) => wrapUpdateSettings({ shopTitle: val })} />
                        <TypographyEditor label="Shop Title Style" settings={settings.shopTitleStyle} onSave={(val) => wrapUpdateSettings({ shopTitleStyle: val })} />
                      </div>
                      <EditableField label="Shop: Buy Now" value={settings.shopBuyNowText} onSave={(val) => wrapUpdateSettings({ shopBuyNowText: val })} />
                      <EditableField label="Shop: Coming Soon" value={settings.shopComingSoonText} onSave={(val) => wrapUpdateSettings({ shopComingSoonText: val })} />
                      <EditableField label="Instagram Link" value={settings.instagramLink} onSave={(val) => wrapUpdateSettings({ instagramLink: val })} />
                      <EditableField label="Twitter Link" value={settings.twitterLink} onSave={(val) => wrapUpdateSettings({ twitterLink: val })} />
                      <EditableField label="Facebook Link" value={settings.facebookLink} onSave={(val) => wrapUpdateSettings({ facebookLink: val })} />
                    </div>

                    <div className="pt-12 border-t-2 border-black/10 space-y-8">
                      <h4 className="text-xl uppercase tracking-[0.4em] font-black">Final Call to Action</h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div className="space-y-8">
                          <EditableField label="CTA Title" value={settings.ctaTitle} onSave={(val) => wrapUpdateSettings({ ctaTitle: val })} type="textarea" aiPrompt="Write a high-impact call to action title" />
                          <TypographyEditor label="CTA Title Style" settings={settings.ctaTitleStyle} onSave={(val) => wrapUpdateSettings({ ctaTitleStyle: val })} />
                        </div>
                        <div className="space-y-8">
                          <EditableField label="CTA Button Text" value={settings.ctaButtonText} onSave={(val) => wrapUpdateSettings({ ctaButtonText: val })} />
                          <TypographyEditor label="CTA Button Style" settings={settings.ctaButtonStyle} onSave={(val) => wrapUpdateSettings({ ctaButtonStyle: val })} />
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {activeSubTab === 'spacing' && (
                  <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-3xl uppercase tracking-[0.4em] font-black border-b-4 border-black pb-6 flex items-center space-x-6">
                      <Move className="w-8 h-8" />
                      <span>Layout & Spacing</span>
                    </h3>
                    <LayoutEditor label="Global Section Spacing" settings={settings.sectionSpacing} onSave={(val) => wrapUpdateSettings({ sectionSpacing: val })} />
                  </section>
                )}

                {activeSubTab === 'seo' && (
                  <section className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h3 className="text-3xl uppercase tracking-[0.4em] font-black border-b-4 border-black pb-6 flex items-center space-x-6">
                      <Settings className="w-8 h-8" />
                      <span>SEO & Social Sharing</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <EditableField label="SEO Title" value={settings.seoTitle} onSave={(val) => wrapUpdateSettings({ seoTitle: val })} />
                      <EditableField label="SEO Description" value={settings.seoDescription} onSave={(val) => wrapUpdateSettings({ seoDescription: val })} type="textarea" />
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.3em] font-black text-black/40">Default Language</label>
                        <select 
                          className="w-full border-2 border-black p-4 text-xs font-black"
                          value={settings.language}
                          onChange={(e) => wrapUpdateSettings({ language: e.target.value as 'EN' | 'KR' })}
                        >
                          <option value="EN">English</option>
                          <option value="KR">Korean / 한국어</option>
                        </select>
                      </div>
                      
                      <div className="col-span-full space-y-4">
                        <label className="text-[10px] uppercase tracking-[0.3em] font-black text-black/40">Open Graph Social Preview Image</label>
                        <div className="relative aspect-video border-2 border-black overflow-hidden group bg-paper">
                          <img src={settings.ogImage} className="w-full h-full object-cover" alt="SEO Preview" />
                          <div className="absolute inset-0 bg-black/75 opacity-100 md:opacity-0 md:group-hover:opacity-100 flex flex-col items-center justify-center transition-all pointer-events-none">
                            <ImageIcon className="text-accent w-10 h-10 mb-2" />
                            <span className="text-white text-[10px] uppercase tracking-widest font-black">Upload OG Preview Image (사진 변경)</span>
                          </div>
                          <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = await handleImageUpload(file);
                              if (url) wrapUpdateSettings({ ogImage: url });
                            }
                            e.target.value = '';
                          }} />
                        </div>
                        <EditableField label="OG Image URL" value={settings.ogImage} onSave={(val) => wrapUpdateSettings({ ogImage: val })} />
                      </div>
                    </div>
                  </section>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
