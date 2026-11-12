export interface SeoStrategyData {
  primaryTarget: string;
  locationFocus: string;
  audience: string;
  goal: string;
  domain: string;
  blogTitle: string;
  seoTitle: string;
  urlSlug: string;
  metaDescription: string;
  keywords: string[];
}

export const DEFAULT_SEO_STRATEGY: SeoStrategyData = {
  primaryTarget: 'Graphic design and digital marketing services',
  locationFocus: 'Kerala, Malappuram and India',
  audience: 'Startups, small businesses and established brands',
  goal: 'Organic visibility, enquiries and brand awareness',
  domain: 'typixel.vercel.app',
  blogTitle: 'Typixel: Graphic Design, Branding & Digital Marketing Services in Kerala',
  seoTitle: 'Typixel | Graphic Design & Digital Marketing Kerala',
  urlSlug: '/blog/graphic-design-digital-marketing-kerala',
  metaDescription: 'Professional graphic design, branding and digital marketing services by Typixel. Explore creative solutions for startups and businesses in Kerala and across India.',
  keywords: [
    'Graphic Design Kerala',
    'Digital Marketing Kerala',
    'Branding Malappuram',
    'Typixel',
    'Logo Design Kerala',
    'Social Media Marketing Kerala',
    'Creative Design Studio Kerala',
    'Poster Design Kerala',
    'Flyer Brochure Design Malappuram',
    'UI UX Design Kerala',
    'Digital Campaigns India'
  ]
};

const SEO_STORAGE_KEY = 'typixel_admincontrol_seo_strategy_v1';

export const getStoredSeoStrategy = (): SeoStrategyData => {
  try {
    const raw = localStorage.getItem(SEO_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return {
          ...DEFAULT_SEO_STRATEGY,
          ...parsed
        };
      }
    }
  } catch (err) {
    console.error('Failed to read SEO strategy from storage:', err);
  }
  return DEFAULT_SEO_STRATEGY;
};

export const saveSeoStrategyToStorage = (data: SeoStrategyData): void => {
  try {
    localStorage.setItem(SEO_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save SEO strategy to storage:', err);
  }
};

export const resetSeoStrategyToDefault = (): SeoStrategyData => {
  saveSeoStrategyToStorage(DEFAULT_SEO_STRATEGY);
  return DEFAULT_SEO_STRATEGY;
};
