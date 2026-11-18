import { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Plus, Trash2, Check, Download, Upload, 
  Star, FileJson, Search, Loader2, 
  Sparkles, CheckCircle2, AlertCircle 
} from 'lucide-react';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';

import { useLanguage, defaultEnTranslations, flattenTranslations } from '../../contexts/LanguageContext';

interface TranslationItem {
  id: string;
  lang: string;
  name: string;
  flag?: string | null;
  isRtl: boolean;
  isDefault: boolean;
  data: string; // JSON string
  updatedAt: string;
}

const TEMPLATE_KEYS = defaultEnTranslations;


const AdminTranslations = () => {
  const { refreshLanguages, currentLang, currentDirection } = useLanguage();
  const isAr = currentLang === 'ar';
  const [languages, setLanguages] = useState<TranslationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLang, setActiveLang] = useState<TranslationItem | null>(null);
  const [editorMode, setEditorMode] = useState<'visual' | 'raw'>('visual');
  const [rawJson, setRawJson] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modal for New Language
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLangForm, setNewLangForm] = useState({
    lang: '',
    name: '',
    flag: '🌐',
    isRtl: false,
    isDefault: false,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchLanguages();
  }, []);

  const getFlagForLang = (code: string, flag?: string | null) => {
    if (flag && flag !== '🌐') return flag;
    const c = (code || '').toLowerCase();
    if (c === 'ar') return '🇸🇦';
    if (c === 'en') return '🇬🇧';
    if (c === 'tr') return '🇹🇷';
    if (c === 'fr') return '🇫🇷';
    if (c === 'de') return '🇩🇪';
    if (c === 'es') return '🇪🇸';
    if (c === 'it') return '🇮🇹';
    if (c === 'ru') return '🇷🇺';
    if (c === 'zh') return '🇨🇳';
    if (c === 'ja') return '🇯🇵';
    return '🌐';
  };

  const mapToTranslationItem = (item: any): TranslationItem => {
    const lang = item.languageCode || item.lang || 'en';
    const name = item.languageName || item.name || (lang === 'ar' ? 'العربية' : 'English');
    const isRtl = item.direction === 'rtl' || item.isRtl === true || lang === 'ar';
    return {
      id: item.id,
      lang,
      name,
      flag: getFlagForLang(lang, item.flag),
      isRtl,
      isDefault: !!item.isDefault,
      data: item.data,
      updatedAt: item.updatedAt || '',
    };
  };

  const fetchLanguages = async () => {
    try {
      setLoading(true);
      const res = await api.get('/translations');
      const rawList = res.data?.data || [];
      const list: TranslationItem[] = rawList.map(mapToTranslationItem);
      setLanguages(list);
      if (list.length > 0) {
        if (!activeLang) {
          selectLanguage(list[0]);
        } else {
          const found = list.find(l => l.id === activeLang.id || l.lang === activeLang.lang);
          selectLanguage(found || list[0]);
        }
      }
    } catch {
      showToast('Failed to fetch translations', 'error');
    } finally {
      setLoading(false);
    }
  };

  const selectLanguage = (item: TranslationItem) => {
    setActiveLang(item);
    try {
      const parsed = typeof item.data === 'string' ? JSON.parse(item.data) : item.data;
      const flat = flattenTranslations(parsed);
      // Merge with TEMPLATE_KEYS so any missing keys are visible and editable
      const merged = { ...TEMPLATE_KEYS, ...flat };
      setRawJson(JSON.stringify(merged, null, 2));
      setJsonError(null);
    } catch {
      setRawJson(typeof item.data === 'string' ? item.data : '{}');
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Add Language
  const handleAddLanguage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLangForm.lang.trim() || !newLangForm.name.trim()) {
      showToast('Language code and name are required', 'error');
      return;
    }

    try {
      setSaving(true);
      const code = newLangForm.lang.trim().toLowerCase();
      const name = newLangForm.name.trim();
      const isRtl = newLangForm.isRtl;
      const res = await api.post('/translations', {
        languageCode: code,
        languageName: name,
        direction: isRtl ? 'rtl' : 'ltr',
        isDefault: newLangForm.isDefault,
        lang: code,
        name: name,
        flag: newLangForm.flag,
        isRtl: isRtl,
        data: TEMPLATE_KEYS,
      });
      setIsAddModalOpen(false);
      showToast(`Language ${name} added!`);
      await fetchLanguages();
      await refreshLanguages();
      if (res.data?.data) {
        selectLanguage(mapToTranslationItem(res.data.data));
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to create language';
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Set Default Language
  const handleSetDefault = async (lang: TranslationItem) => {
    try {
      await api.put(`/translations/${lang.id}/default`);
      await fetchLanguages();
      await refreshLanguages();
      showToast(`${lang.name} set as default language`);
    } catch {
      showToast('Failed to set default language', 'error');
    }
  };

  // Delete Language
  const handleDeleteLanguage = async (lang: TranslationItem) => {
    if (languages.length <= 1) {
      showToast('Cannot delete the last remaining language', 'error');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete ${lang.name} (${lang.lang})?`)) return;

    try {
      await api.delete(`/translations/${lang.id}`);
      const remaining = languages.filter(l => l.id !== lang.id);
      setLanguages(remaining);
      if (activeLang?.id === lang.id) {
        selectLanguage(remaining[0]);
      }
      await refreshLanguages();
      showToast('Language deleted');
    } catch {
      showToast('Failed to delete language', 'error');
    }
  };

  // Save Translations
  const handleSaveTranslations = async () => {
    if (!activeLang) return;

    let payloadData: Record<string, string>;
    try {
      payloadData = JSON.parse(rawJson);
      setJsonError(null);
    } catch (err: any) {
      setJsonError(err.message || 'Invalid JSON syntax');
      showToast('Please fix JSON syntax errors before saving', 'error');
      return;
    }

    try {
      setSaving(true);
      await api.post('/translations', {
        languageCode: activeLang.lang,
        languageName: activeLang.name,
        direction: activeLang.isRtl ? 'rtl' : 'ltr',
        isDefault: activeLang.isDefault,
        lang: activeLang.lang,
        name: activeLang.name,
        flag: activeLang.flag,
        isRtl: activeLang.isRtl,
        data: payloadData,
      });
      showToast(`Translations for ${activeLang.name} saved successfully!`);
      await fetchLanguages();
      await refreshLanguages();
      try {
        localStorage.removeItem('portfolio_settings');
        window.dispatchEvent(new CustomEvent('portfolio_settings_updated'));
      } catch {}
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Failed to save translations';
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  // Download Template
  const handleDownloadTemplate = () => {
    const currentData = activeLang ? (() => {
      try { return JSON.parse(rawJson); } catch { return TEMPLATE_KEYS; }
    })() : TEMPLATE_KEYS;

    const blob = new Blob([JSON.stringify(currentData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `translations_${activeLang?.lang || 'template'}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Template JSON downloaded');
  };

  // Upload JSON File
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (typeof parsed !== 'object' || parsed === null) {
          throw new Error('Root of JSON file must be an object');
        }
        const flat = flattenTranslations(parsed);
        const current = (() => {
          try { return JSON.parse(rawJson || '{}'); } catch { return TEMPLATE_KEYS; }
        })();
        const merged = { ...current, ...flat };
        setRawJson(JSON.stringify(merged, null, 2));
        setJsonError(null);
        showToast(`JSON file loaded with ${Object.keys(flat).length} keys! Click "Save Changes" to apply.`);
      } catch (err: any) {
        setJsonError(err.message || 'Failed to parse JSON file');
        showToast('Invalid JSON file', 'error');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Update a single key in visual editor
  const handleVisualKeyChange = (key: string, value: string) => {
    try {
      const current = JSON.parse(rawJson || '{}');
      current[key] = value;
      setRawJson(JSON.stringify(current, null, 2));
    } catch {
      // ignore
    }
  };

  // Get active dictionary object for visual editor
  const currentDictionary: Record<string, string> = (() => {
    try {
      return JSON.parse(rawJson || '{}');
    } catch {
      return {};
    }
  })();

  const filteredKeys = Object.keys(currentDictionary).filter(k => 
    k.toLowerCase().includes(searchFilter.toLowerCase()) || 
    String(currentDictionary[k] || '').toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="relative min-h-[80vh] pb-20" dir={currentDirection}>
      <Helmet><title>{isAr ? 'مركز إدارة اللغات والترجمة | لوحة التحكم' : 'Translations Hub | Admin'}</title></Helmet>

      {toast && (
        <div className={`fixed bottom-5 ${isAr ? 'left-5' : 'right-5'} z-50 px-4 py-3 rounded-lg shadow-xl border flex items-center gap-2 animate-in slide-in-from-bottom-5 ${
          toast.type === 'success' ? 'bg-card border-green-500/50 text-foreground' : 'bg-destructive text-destructive-foreground'
        }`}>
          {toast.type === 'success' && <Check size={16} className="text-green-500" />}
          <span className="font-medium text-sm">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {isAr ? 'مركز إدارة اللغات والترجمات' : 'Translations & Localization Hub'}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isAr
              ? 'رفع ملفات JSON أو التعديل البصري المباشر للمفاتيح والعبارات مع دعم التبديل التلقائي لاتجاه الخط (RTL / LTR).'
              : 'Easily upload a JSON file or visually edit translations with automatic RTL/LTR direction switching.'}
          </p>
        </div>
        <div className="flex gap-2.5 flex-wrap">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json,application/json"
            className="hidden"
          />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={saving || !activeLang} className="gap-1.5">
            <Upload size={15} />
            {isAr ? 'رفع ملف JSON' : 'Upload JSON'}
          </Button>
          <Button variant="outline" onClick={handleDownloadTemplate} disabled={!activeLang} className="gap-1.5">
            <Download size={15} />
            {isAr ? 'تنزيل ملف JSON' : 'Download JSON'}
          </Button>
          <Button onClick={handleSaveTranslations} disabled={saving || !activeLang} className="min-w-[120px] gap-1.5">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <CheckCircle2 size={15} />}
            {isAr ? 'حفظ التعديلات' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : (
        <>
          {/* Language Selector Bar */}
          <div className="flex items-center justify-between gap-3 p-3 rounded-xl bg-card border border-border mb-6 overflow-x-auto">
            <div className="flex items-center gap-2">
              {languages.map((item) => (
                <button
                  key={item.id}
                  onClick={() => selectLanguage(item)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                    activeLang?.id === item.id
                      ? 'bg-foreground text-background font-bold shadow-sm'
                      : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <span>{item.flag || '🌐'}</span>
                  <span>{item.name}</span>
                  <span className="text-[10px] font-mono opacity-80 uppercase">({item.lang})</span>
                  {item.isDefault && <Star size={12} className="text-amber-400 fill-amber-400" />}
                </button>
              ))}
            </div>

            <Button size="sm" variant="secondary" onClick={() => setIsAddModalOpen(true)} className="gap-1">
              <Plus size={14} /> {isAr ? 'إضافة لغة' : 'Add Language'}
            </Button>
          </div>

          {activeLang && (
            <div className="space-y-6">
              {/* Language Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{activeLang.flag || '🌐'}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base">{activeLang.name} ({activeLang.lang})</h3>
                      {activeLang.isDefault ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                          {isAr ? 'اللغة الافتراضية' : 'Default Language'}
                        </span>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-[11px] px-2 text-muted-foreground hover:text-foreground"
                          onClick={() => handleSetDefault(activeLang)}
                        >
                          {isAr ? 'تعيين كافتراضية' : 'Make Default'}
                        </Button>
                      )}
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-muted text-muted-foreground">
                        {isAr
                          ? `اتجاه الكتابة: ${activeLang.isRtl ? 'من اليمين لليسار (RTL)' : 'من اليسار لليمين (LTR)'}`
                          : `Direction: ${activeLang.isRtl ? 'RTL (Right-to-Left)' : 'LTR (Left-to-Right)'}`}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isAr
                        ? `تحتوي على ${Object.keys(currentDictionary).length} عبارة ومفتاح ترجمة`
                        : `Contains ${Object.keys(currentDictionary).length} localized strings`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex rounded-lg border border-border overflow-hidden">
                    <button
                      onClick={() => setEditorMode('visual')}
                      className={`px-3 py-1.5 text-xs font-medium ${editorMode === 'visual' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
                    >
                      {isAr ? 'المحرر البصري' : 'Visual Editor'}
                    </button>
                    <button
                      onClick={() => setEditorMode('raw')}
                      className={`px-3 py-1.5 text-xs font-medium flex items-center gap-1 ${editorMode === 'raw' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'}`}
                    >
                      <FileJson size={13} /> {isAr ? 'محرر JSON المباشر' : 'Raw JSON'}
                    </button>
                  </div>

                  {!activeLang.isDefault && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteLanguage(activeLang)}
                      title={isAr ? 'حذف اللغة' : 'Delete Language'}
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
              </div>

              {/* Visual Editor */}
              {editorMode === 'visual' && (
                <div className="p-6 bg-card rounded-xl border border-border space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="relative w-full sm:w-80">
                      <Search size={15} className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-muted-foreground`} />
                      <Input
                        value={searchFilter}
                        onChange={e => setSearchFilter(e.target.value)}
                        placeholder={isAr ? 'بحث في مفاتيح أو نصوص الترجمة...' : 'Search translation keys or text...'}
                        className={`${isAr ? 'pr-9' : 'pl-9'} h-9 text-xs`}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {isAr
                        ? `عرض ${filteredKeys.length} من أصل ${Object.keys(currentDictionary).length} مفتاح`
                        : `Showing ${filteredKeys.length} of ${Object.keys(currentDictionary).length} keys`}
                    </span>
                  </div>

                  <div className="space-y-3 pt-2">
                    {filteredKeys.map((key) => (
                      <div key={key} className="p-3.5 rounded-lg border border-border/80 bg-background/50 grid md:grid-cols-3 gap-3 items-center">
                        <div className="space-y-0.5">
                          <span className="font-mono text-xs font-bold text-primary">{key}</span>
                          <p className="text-[11px] text-muted-foreground line-clamp-1">
                            {isAr ? 'القيمة الافتراضية:' : 'Default:'} {TEMPLATE_KEYS[key] || '—'}
                          </p>
                        </div>
                        <div className="md:col-span-2">
                          <Input
                            value={currentDictionary[key] ?? ''}
                            onChange={e => handleVisualKeyChange(key, e.target.value)}
                            dir={activeLang.isRtl ? 'rtl' : 'ltr'}
                            className="h-9 text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Raw JSON Editor */}
              {editorMode === 'raw' && (
                <div className="p-6 bg-card rounded-xl border border-border space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold flex items-center gap-1.5">
                      <FileJson size={16} className="text-primary" />
                      {isAr ? 'هيكل بيانات JSON المباشر' : 'Raw JSON Payload'}
                    </h3>
                    {jsonError && (
                      <span className="text-xs text-destructive flex items-center gap-1">
                        <AlertCircle size={13} /> {jsonError}
                      </span>
                    )}
                  </div>

                  <Textarea
                    value={rawJson}
                    onChange={e => {
                      setRawJson(e.target.value);
                      try {
                        JSON.parse(e.target.value);
                        setJsonError(null);
                      } catch (err: any) {
                        setJsonError(err.message);
                      }
                    }}
                    rows={20}
                    className="font-mono text-xs leading-relaxed"
                    placeholder="{ ... }"
                    dir="ltr"
                  />
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* Add Language Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full p-6 space-y-5" dir={currentDirection}>
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                {isAr ? 'إضافة لغة جديدة' : 'Add New Language'}
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddLanguage} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    {isAr ? 'رمز اللغة' : 'Code'}
                  </label>
                  <Input
                    value={newLangForm.lang}
                    onChange={e => setNewLangForm({ ...newLangForm, lang: e.target.value.toLowerCase() })}
                    placeholder="tr, fr, de"
                    maxLength={5}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    {isAr ? 'اسم اللغة' : 'Language Name'}
                  </label>
                  <Input
                    value={newLangForm.name}
                    onChange={e => setNewLangForm({ ...newLangForm, name: e.target.value })}
                    placeholder="e.g. Türkçe, Français"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1">
                    {isAr ? 'إيموجي العلم' : 'Flag Emoji'}
                  </label>
                  <Input
                    value={newLangForm.flag}
                    onChange={e => setNewLangForm({ ...newLangForm, flag: e.target.value })}
                    placeholder="🇹🇷, 🇫🇷, 🇸🇦"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newLangForm.isRtl}
                      onChange={e => setNewLangForm({ ...newLangForm, isRtl: e.target.checked })}
                      className="rounded border-input text-primary w-4 h-4"
                    />
                    <span>{isAr ? 'من اليمين لليسار (RTL)' : 'RTL (Right to Left)'}</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                  {isAr ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button type="submit" disabled={saving} className="gap-1.5">
                  {saving ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  {isAr ? 'إضافة اللغة' : 'Create Language'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTranslations;
