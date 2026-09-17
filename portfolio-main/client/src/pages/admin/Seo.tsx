import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Save, Loader2, Check, Globe, Share2, 
  Search, Code, Eye, RefreshCw, AlertCircle 
} from 'lucide-react';
import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';

interface SeoData {
  siteName: string;
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  canonicalUrl: string;
  ogImage: string;
  twitterHandle: string;
  twitterCardType: string;
  keywords: string;
  robots: string;
  schemaType: string;
  jsonLdCustom: string;
}

const defaultSeo: SeoData = {
  siteName: 'Yusuf Ayoubi',
  defaultTitle: 'Yusuf Ayoubi | Full-Stack Developer & Software Engineer',
  titleTemplate: '%s | Yusuf Ayoubi',
  defaultDescription: 'Experienced Full-Stack Developer specializing in building high-performance web applications, scalable APIs, and modern user interfaces.',
  canonicalUrl: 'https://yusufayoubi.com',
  ogImage: '/og-image.png',
  twitterHandle: '@yusufayoubi',
  twitterCardType: 'summary_large_image',
  keywords: 'software engineer, full-stack developer, React, Next.js, Node.js, Express, TypeScript, portfolio',
  robots: 'index, follow',
  schemaType: 'Person',
  jsonLdCustom: '',
};

const AdminSeo = () => {
  const [data, setData] = useState<SeoData>(defaultSeo);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'social' | 'schema' | 'preview'>('general');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    fetchSeo();
  }, []);

  const fetchSeo = async () => {
    try {
      setLoading(true);
      const res = await api.get('/seo');
      if (res.data?.data) {
        const fetched = res.data.data;
        setData({
          siteName: fetched.siteName || defaultSeo.siteName,
          defaultTitle: fetched.defaultTitle || defaultSeo.defaultTitle,
          titleTemplate: fetched.titleTemplate || defaultSeo.titleTemplate,
          defaultDescription: fetched.defaultDescription || defaultSeo.defaultDescription,
          canonicalUrl: fetched.canonicalUrl || defaultSeo.canonicalUrl,
          ogImage: fetched.ogImage || defaultSeo.ogImage,
          twitterHandle: fetched.twitterHandle || defaultSeo.twitterHandle,
          twitterCardType: fetched.twitterCardType || defaultSeo.twitterCardType,
          keywords: fetched.keywords || defaultSeo.keywords,
          robots: fetched.robots || defaultSeo.robots,
          schemaType: fetched.schemaType || defaultSeo.schemaType,
          jsonLdCustom: fetched.jsonLdCustom || defaultSeo.jsonLdCustom,
        });
      }
    } catch {
      showToast('Failed to fetch SEO settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const validateJsonLd = (str: string): boolean => {
    if (!str.trim()) {
      setJsonError(null);
      return true;
    }
    try {
      JSON.parse(str);
      setJsonError(null);
      return true;
    } catch (err: any) {
      setJsonError(err.message || 'Invalid JSON format');
      return false;
    }
  };

  const handleSave = async () => {
    if (data.jsonLdCustom && !validateJsonLd(data.jsonLdCustom)) {
      showToast('Please fix JSON-LD syntax error before saving', 'error');
      return;
    }

    try {
      setSaving(true);
      await api.put('/seo', data);
      showToast('SEO settings saved successfully!');
    } catch {
      showToast('Failed to save SEO settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="relative min-h-[80vh] pb-20">
      <Helmet><title>SEO &amp; Social Hub | Admin</title></Helmet>

      {toast && (
        <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-lg shadow-xl border flex items-center gap-2 animate-in slide-in-from-bottom-5 ${
          toast.type === 'success' ? 'bg-card border-green-500/50 text-foreground' : 'bg-destructive text-destructive-foreground'
        }`}>
          {toast.type === 'success' && <Check size={16} className="text-green-500" />}
          <span className="font-medium text-sm">{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">100% Controllable SEO Hub</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Configure metadata, OpenGraph cards, Twitter previews, robot indexation, and Schema.org JSON-LD.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchSeo} disabled={saving}>
            <RefreshCw size={16} className="mr-1.5" />
            Reload
          </Button>
          <Button onClick={handleSave} disabled={saving} className="min-w-[120px]">
            {saving ? <Loader2 size={16} className="animate-spin mr-1.5" /> : <Save size={16} className="mr-1.5" />}
            Save SEO
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border mb-6">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'general'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Globe size={16} /> Meta &amp; Indexing
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'social'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Share2 size={16} /> OpenGraph &amp; Social
        </button>
        <button
          onClick={() => setActiveTab('schema')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'schema'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Code size={16} /> Structured Data
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'preview'
              ? 'border-primary text-primary font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Eye size={16} /> Live Previews
        </button>
      </div>

      {/* Tab: Meta & Indexing */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="p-6 bg-card rounded-xl border border-border space-y-4">
            <h2 className="text-lg font-semibold">Standard Meta Tags</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Site / Brand Name</label>
                <Input
                  value={data.siteName}
                  onChange={e => setData({ ...data, siteName: e.target.value })}
                  placeholder="e.g. Yusuf Ayoubi"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Canonical Base URL</label>
                <Input
                  value={data.canonicalUrl}
                  onChange={e => setData({ ...data, canonicalUrl: e.target.value })}
                  placeholder="https://yusufayoubi.com"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Default Page Title <span className="font-normal text-muted-foreground">({data.defaultTitle.length} chars)</span>
              </label>
              <Input
                value={data.defaultTitle}
                onChange={e => setData({ ...data, defaultTitle: e.target.value })}
                placeholder="Yusuf Ayoubi | Full-Stack Developer & Software Engineer"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Meta Description <span className="font-normal text-muted-foreground">({data.defaultDescription.length} chars — ideal 140-160)</span>
              </label>
              <Textarea
                value={data.defaultDescription}
                onChange={e => setData({ ...data, defaultDescription: e.target.value })}
                rows={3}
                placeholder="High-converting description that appears on search engines..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Title Template</label>
                <Input
                  value={data.titleTemplate}
                  onChange={e => setData({ ...data, titleTemplate: e.target.value })}
                  placeholder="%s | Yusuf Ayoubi"
                />
                <p className="text-[11px] text-muted-foreground mt-1">Use %s where the specific page title will be injected.</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Robots Directives</label>
                <select
                  value={data.robots}
                  onChange={e => setData({ ...data, robots: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="index, follow">index, follow (Recommended for production)</option>
                  <option value="noindex, follow">noindex, follow</option>
                  <option value="noindex, nofollow">noindex, nofollow (Block all crawlers)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Keywords (comma-separated)</label>
              <Input
                value={data.keywords}
                onChange={e => setData({ ...data, keywords: e.target.value })}
                placeholder="software engineer, react developer, full stack, api design..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab: Social & OpenGraph */}
      {activeTab === 'social' && (
        <div className="space-y-6">
          <div className="p-6 bg-card rounded-xl border border-border space-y-4">
            <h2 className="text-lg font-semibold">Social Sharing &amp; Cards (OpenGraph / X)</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">OpenGraph Image URL</label>
                <Input
                  value={data.ogImage}
                  onChange={e => setData({ ...data, ogImage: e.target.value })}
                  placeholder="/og-image.png or full https:// URL"
                />
                <p className="text-[11px] text-muted-foreground mt-1">Recommended dimension: 1200 x 630 px</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Twitter / X Handle</label>
                <Input
                  value={data.twitterHandle}
                  onChange={e => setData({ ...data, twitterHandle: e.target.value })}
                  placeholder="@yourusername"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground block mb-1">Twitter Card Format</label>
                <select
                  value={data.twitterCardType}
                  onChange={e => setData({ ...data, twitterCardType: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="summary_large_image">Large Image Card (summary_large_image)</option>
                  <option value="summary">Small Thumbnail Card (summary)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Schema.org */}
      {activeTab === 'schema' && (
        <div className="space-y-6">
          <div className="p-6 bg-card rounded-xl border border-border space-y-4">
            <h2 className="text-lg font-semibold">Schema.org JSON-LD Structured Data</h2>
            <p className="text-xs text-muted-foreground">
              Structured metadata helps Google understand your professional credentials, knowledge graphs, and services.
            </p>

            <div className="max-w-md">
              <label className="text-xs font-semibold text-muted-foreground block mb-1">Primary Entity Type</label>
              <select
                value={data.schemaType}
                onChange={e => setData({ ...data, schemaType: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
              >
                <option value="Person">Person (Freelancer / Independent Engineer)</option>
                <option value="ProfessionalService">ProfessionalService (Consultant / Agency)</option>
                <option value="Organization">Organization (Company / Studio)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-muted-foreground block">
                  Custom JSON-LD Override (Optional)
                </label>
                {jsonError && (
                  <span className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle size={12} /> {jsonError}
                  </span>
                )}
              </div>
              <Textarea
                value={data.jsonLdCustom}
                onChange={e => {
                  setData({ ...data, jsonLdCustom: e.target.value });
                  validateJsonLd(e.target.value);
                }}
                rows={8}
                className="font-mono text-xs"
                placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "Person",\n  "name": "${data.siteName}",\n  "jobTitle": "Full-Stack Engineer"\n}`}
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Leave empty to automatically generate standard Schema.org tags based on your settings.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Live Previews */}
      {activeTab === 'preview' && (
        <div className="space-y-8">
          {/* Google Search Result Preview */}
          <div className="p-6 bg-card rounded-xl border border-border space-y-4">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-500" />
              <h2 className="text-base font-bold">Google Search Result Preview</h2>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-[#1f1f1f] border border-border/80 max-w-2xl font-sans">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[9px] font-bold text-primary">
                  Y
                </div>
                <span className="text-xs text-muted-foreground">{data.canonicalUrl.replace(/^https?:\/\//, '')}</span>
              </div>
              <h3 className="text-lg text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer font-medium leading-normal mb-1">
                {data.defaultTitle}
              </h3>
              <p className="text-xs text-[#4d5156] dark:text-[#bdc1c6] leading-relaxed">
                {data.defaultDescription}
              </p>
            </div>
          </div>

          {/* Social Card Preview */}
          <div className="p-6 bg-card rounded-xl border border-border space-y-4">
            <div className="flex items-center gap-2">
              <Share2 className="w-5 h-5 text-emerald-500" />
              <h2 className="text-base font-bold">WhatsApp &amp; Social Card Preview</h2>
            </div>

            <div className="max-w-md rounded-xl overflow-hidden border border-border/80 bg-background shadow-lg">
              <div className="h-44 bg-muted flex items-center justify-center relative overflow-hidden">
                {data.ogImage ? (
                  <img
                    src={data.ogImage}
                    alt="OG Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/portfolio_photo.png';
                    }}
                  />
                ) : (
                  <div className="text-muted-foreground text-xs font-mono">No Image Configured</div>
                )}
              </div>
              <div className="p-4 space-y-1.5 bg-card">
                <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">
                  {data.canonicalUrl.replace(/^https?:\/\//, '')}
                </span>
                <h4 className="text-sm font-bold text-foreground leading-tight line-clamp-1">
                  {data.defaultTitle}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {data.defaultDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSeo;
