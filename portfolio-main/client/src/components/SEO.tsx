import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import api from '../services/api';

export interface SeoData {
  metaTitle: string;
  metaDescription: string;
  keywords?: string;
  author?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterHandle?: string;
  twitterCardType?: string;
  canonicalUrl?: string;
  robots?: string;
  structuredData?: string;
  pageOverrides?: string;
}

interface SeoProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  canonical?: string;
  type?: string;
  pageKey?: string;
}

export const SEO: React.FC<SeoProps> = ({
  title,
  description,
  keywords,
  image,
  canonical,
  type = 'website',
  pageKey
}) => {
  const [seo, setSeo] = useState<SeoData | null>(null);

  useEffect(() => {
    const fetchSeo = async () => {
      try {
        const res = await api.get('/seo');
        if (res.data.success && res.data.data) {
          setSeo(res.data.data);
        }
      } catch (err) {
        console.warn('Could not load SEO settings', err);
      }
    };
    fetchSeo();
  }, []);

  // Parse page overrides if available
  let pageOverrideData: Record<string, any> = {};
  if (seo?.pageOverrides && pageKey) {
    try {
      const allOverrides = typeof seo.pageOverrides === 'string' ? JSON.parse(seo.pageOverrides) : seo.pageOverrides;
      if (allOverrides && allOverrides[pageKey]) {
        pageOverrideData = allOverrides[pageKey];
      }
    } catch {
      // ignore
    }
  }

  const finalTitle = title || pageOverrideData.title || seo?.metaTitle || 'Yusuf Ayoubi | Software Developer & Engineer';
  const finalDescription = description || pageOverrideData.description || seo?.metaDescription || 'Building scalable web applications, custom CRM systems, and high-performance APIs.';
  const finalKeywords = keywords || pageOverrideData.keywords || seo?.keywords || 'Software Engineer, Full-Stack Developer, React, Next.js, Node.js';
  const finalAuthor = seo?.author || 'Yusuf Ayoubi';
  const finalOgTitle = seo?.ogTitle || finalTitle;
  const finalOgDescription = seo?.ogDescription || finalDescription;
  const finalOgImage = image || seo?.ogImage || '/portfolio_photo.png';
  const finalCanonical = canonical || seo?.canonicalUrl || 'https://yusufayoubi.com';
  const finalRobots = seo?.robots || 'index, follow';
  const finalTwitterHandle = seo?.twitterHandle || '@yusuf';
  const finalTwitterCard = seo?.twitterCardType || 'summary_large_image';

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      {finalKeywords && <meta name="keywords" content={finalKeywords} />}
      <meta name="author" content={finalAuthor} />
      <meta name="robots" content={finalRobots} />
      {finalCanonical && <link rel="canonical" href={finalCanonical} />}

      {/* Open Graph / Facebook / LinkedIn / WhatsApp */}
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDescription} />
      <meta property="og:type" content={type || seo?.ogType || 'website'} />
      {finalCanonical && <meta property="og:url" content={finalCanonical} />}
      {finalOgImage && <meta property="og:image" content={finalOgImage} />}

      {/* Twitter */}
      <meta name="twitter:card" content={finalTwitterCard} />
      {finalTwitterHandle && <meta name="twitter:creator" content={finalTwitterHandle} />}
      <meta name="twitter:title" content={finalOgTitle} />
      <meta name="twitter:description" content={finalOgDescription} />
      {finalOgImage && <meta name="twitter:image" content={finalOgImage} />}

      {/* JSON-LD Structured Data */}
      {seo?.structuredData && (
        <script type="application/ld+json">
          {typeof seo.structuredData === 'string' ? seo.structuredData : JSON.stringify(seo.structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
