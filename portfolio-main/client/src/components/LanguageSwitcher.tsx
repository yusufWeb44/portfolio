import { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown } from 'lucide-react';
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

  const currentFlag = languageFlagMap[currentLang] || '🌐';


  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-border/60 bg-card/40 hover:bg-card/70 dark:bg-white/[0.04] dark:hover:bg-white/[0.08] backdrop-blur-md transition-all duration-200 text-foreground cursor-pointer shadow-sm"
        aria-label="Select Language"
      >
        <span className="text-sm leading-none">{currentFlag}</span>
        <span className="font-mono uppercase tracking-wider">{currentLang.toUpperCase()}</span>
        <ChevronDown size={12} className={`text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute end-0 mt-2 w-36 rounded-2xl border border-border/60 bg-card/90 dark:bg-zinc-900/90 backdrop-blur-xl shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground px-2 py-1">
            Language
          </div>
          {availableLanguages.length === 0 ? (
            <div className="px-2 py-1.5 text-xs text-muted-foreground">Loading...</div>
          ) : (
            availableLanguages.map((lang) => {
              const isSelected = lang.languageCode === currentLang;
              const flag = languageFlagMap[lang.languageCode] || '🌐';
              return (
                <button
                  key={lang.languageCode}
                  onClick={() => {
                    setLanguage(lang.languageCode);
                    setIsOpen(false);
                  }}
                  className={`flex items-center justify-between w-full px-2.5 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 font-semibold'
                      : 'text-foreground/80 hover:bg-muted/60 hover:text-foreground'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>{flag}</span>
                    <span>{lang.languageName}</span>
                  </span>
                  {isSelected && <Check size={12} className="text-emerald-500 shrink-0" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
