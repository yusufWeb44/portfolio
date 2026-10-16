import { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';

export const LanguageSwitcher = () => {
  const { currentLang, availableLanguages, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const languageFlagMap: Record<string, string> = {
    en: '🇬🇧',
    ar: '🇸🇦',
    tr: '🇹🇷',
    fr: '🇫🇷',
    de: '🇩🇪',
    es: '🇪🇸'
  };

  const languageNameMap: Record<string, string> = {
    en: 'English',
    ar: 'العربية',
    tr: 'Türkçe',
    fr: 'Français',
    de: 'Deutsch',
    es: 'Español'
  };

  const currentLangObj = availableLanguages.find(l => l.languageCode === currentLang);
  const currentName = currentLangObj?.languageName || languageNameMap[currentLang] || currentLang.toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-white/50 hover:bg-white/75 dark:bg-white/[0.08] dark:hover:bg-white/[0.13] border border-slate-900/[0.07] hover:border-slate-900/[0.14] dark:border-white/[0.12] dark:hover:border-white/[0.22] text-foreground transition-all duration-200 cursor-pointer shadow-xs dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] backdrop-blur-md text-xs sm:text-sm font-semibold select-none group"
        aria-label="Select Language"
      >
        <Globe className="w-4 h-4 text-muted-foreground group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors shrink-0" />
        <span className="hidden sm:inline font-medium text-xs sm:text-sm">
          {currentName}
        </span>
        <span className="inline sm:hidden font-mono uppercase text-xs">
          {currentLang}
        </span>
        <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute end-0 mt-2 w-40 rounded-xl border border-slate-900/[0.08] dark:border-white/[0.14] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl shadow-lg shadow-black/5 dark:shadow-[0_12px_36px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.10)] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground px-2.5 py-1">
            Languages
          </div>
          {availableLanguages.length === 0 ? (
            ['ar', 'en'].map(code => {
              const isSelected = code === currentLang;
              const flag = languageFlagMap[code] || '🌐';
              const name = languageNameMap[code] || code.toUpperCase();
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setLanguage(code);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between w-full px-2.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 dark:bg-emerald-500/20 dark:border dark:border-emerald-500/30 dark:shadow-[0_0_12px_rgba(16,185,129,0.2)] font-bold'
                      : 'text-foreground/80 hover:bg-muted/60 dark:hover:bg-white/[0.08] hover:text-foreground dark:hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{flag}</span>
                    <span>{name}</span>
                  </span>
                  {isSelected && <Check size={14} className="text-emerald-500 dark:text-emerald-400 shrink-0" />}
                </button>
              );
            })
          ) : (
            availableLanguages.map((lang) => {
              const isSelected = lang.languageCode === currentLang;
              const flag = languageFlagMap[lang.languageCode] || '🌐';
              return (
                <button
                  key={lang.languageCode}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.languageCode);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between w-full px-2.5 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 dark:bg-emerald-500/20 dark:border dark:border-emerald-500/30 dark:shadow-[0_0_12px_rgba(16,185,129,0.2)] font-bold'
                      : 'text-foreground/80 hover:bg-muted/60 dark:hover:bg-white/[0.08] hover:text-foreground dark:hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{flag}</span>
                    <span>{lang.languageName}</span>
                  </span>
                  {isSelected && <Check size={14} className="text-emerald-500 dark:text-emerald-400 shrink-0" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
