export interface ShowcaseItem {
  id: string;
  title: string;
  subtitle: string;
  client: string;
  year: string;
  category: string;
  githubUrl: string;
  badge?: string;
  accentColor: string;
  aspect: string;
  dimensions: string;
  tools: string[];
  description: string;
  keyFeatures: string[];
  languages: string[];
  imageUrl?: string;
  mediaType?: 'image' | 'video';
  videoUrl?: string;
  duration?: string;
  fileSize?: string;
  row?: 1 | 2;
  type?: string;
}

export interface ShowcasePresetImage {
  name: string;
  filename: string;
  path: string;
  defaultTitle: string;
  defaultSubtitle: string;
  defaultCategory: string;
  defaultBadge: string;
  row: 1 | 2;
}

export const SHOWCASE_PRESET_IMAGES: ShowcasePresetImage[] = [
  {
    name: 'Chamayam',
    filename: 'Chamayam.jpg',
    path: '/showcase/Chamayam.jpg',
    defaultTitle: 'Chamayam',
    defaultSubtitle: 'Festive Elegance & Cultural Jewellery Campaign',
    defaultCategory: 'Festive & Cultural Poster',
    defaultBadge: 'Festival Campaign',
    row: 1
  },
  {
    name: 'Classy Coat',
    filename: 'classycoat.jpg',
    path: '/showcase/classycoat.jpg',
    defaultTitle: 'Classy Coat',
    defaultSubtitle: 'Live Beautifully Fully — Premium Architectural Finishes',
    defaultCategory: 'Commercial Poster Design',
    defaultBadge: 'Commercial Art',
    row: 1
  },
  {
    name: 'Crystalmart Eid',
    filename: 'eidcrystalmart.webp',
    path: '/showcase/eidcrystalmart.webp',
    defaultTitle: 'Crystalmart — Eid Mubarak',
    defaultSubtitle: 'Retail Electronics & Festive Kitchenware Offer Campaign',
    defaultCategory: 'Festive & Social Media',
    defaultBadge: 'Festive Offer',
    row: 1
  },
  {
    name: 'Swahwa Eid',
    filename: 'eidswahwa.jpg',
    path: '/showcase/eidswahwa.jpg',
    defaultTitle: 'Eid Mubarak — Swahwa',
    defaultSubtitle: 'Sacred Islamic Typography & Ambient Golden Celebration Poster',
    defaultCategory: 'Spiritual Typography & Poster',
    defaultBadge: 'Calligraphy Art',
    row: 1
  },
  {
    name: 'Flow',
    filename: 'flow.png',
    path: '/showcase/flow.png',
    defaultTitle: 'Flow',
    defaultSubtitle: 'Luxury Fashion & Minimalist Brand Monogram Architecture',
    defaultCategory: 'Visual Identity & Branding',
    defaultBadge: 'Brand Monogram',
    row: 1
  },
  {
    name: 'Frost Desserts',
    filename: 'frost.jpg',
    path: '/showcase/frost.jpg',
    defaultTitle: 'Frost — Delicious Desserts',
    defaultSubtitle: 'Gourmet Confectionery Packaging & Sweet Box Branding',
    defaultCategory: 'Product & Packaging Mockup',
    defaultBadge: 'Packaging Art',
    row: 2
  },
  {
    name: 'Save The Date',
    filename: 'savethedatepost.jpg',
    path: '/showcase/savethedatepost.jpg',
    defaultTitle: 'Nikah Ceremony — Save The Date',
    defaultSubtitle: 'Royal Floral Wedding Invitation & Keepsake Poster',
    defaultCategory: 'Event Branding & Invitation',
    defaultBadge: 'Wedding Series',
    row: 2
  },
  {
    name: 'Skillovia',
    filename: 'Skillovia.jpg',
    path: '/showcase/Skillovia.jpg',
    defaultTitle: 'Skillovia — Growth Arrow Mark',
    defaultSubtitle: 'Minimalist Vector Emblem & Geometry for EdTech Learning',
    defaultCategory: 'Logo Design & Identity',
    defaultBadge: 'Identity System',
    row: 2
  },
  {
    name: 'Vishu Chamayam',
    filename: 'vishuchamayam.jpg',
    path: '/showcase/vishuchamayam.jpg',
    defaultTitle: 'Vishu Chamayam — Festive Greeting',
    defaultSubtitle: 'Traditional Cultural Krishna Illustration & Festival Art',
    defaultCategory: 'Cultural Poster & Digital Art',
    defaultBadge: 'Festive Special',
    row: 2
  },
  {
    name: 'Yenza',
    filename: 'Yenza.jpg',
    path: '/showcase/Yenza.jpg',
    defaultTitle: 'Yenza — Modern Brand Identity',
    defaultSubtitle: 'Contemporary Brand Architecture & Geometric Logotype',
    defaultCategory: 'Brand Identity & Logo',
    defaultBadge: 'Logomark',
    row: 2
  }
];

export const SHOWCASE_ROW_1: ShowcaseItem[] = [
  {
    id: 'chamayam-jewellery-poster',
    title: 'Chamayam',
    subtitle: 'Festive Elegance & Cultural Jewellery Campaign',
    client: 'Chamayam Jewellery & Silks',
    year: '2026',
    category: 'Festive & Cultural Poster',
    mediaType: 'image',
    imageUrl: '/showcase/Chamayam.jpg',
    githubUrl: 'https://github.com/typixelofficial/portfolio',
    badge: 'Festival Campaign',
    accentColor: '#D97706',
    aspect: '4/5',
    dimensions: '1080 × 1350 px Social Promotion',
    tools: ['Adobe Photoshop', 'Illustrator', 'Lightroom'],
    description: 'Promotional festival campaign for Chamayam showcasing rich cultural heritage, celebratory festive announcements, and traditional elegance with warm glowing highlights.',
    keyFeatures: [
      'Authentic traditional temple architecture motifs with glowing golden arches',
      'Dynamic typography lockup tailored for Kerala festival promotions',
      'Rich magenta, gold, and ivory palette optimized for high social engagement'
    ],
    languages: ['Malayalam', 'English'],
    row: 1,
    type: 'custom'
  },
  {
    id: 'classycoat-commercial-poster',
    title: 'Classy Coat',
    subtitle: 'Live Beautifully Fully — Premium Interior Coatings & Texture Art',
    client: 'Classy Coat Architectural Finishes',
    year: '2026',
    category: 'Commercial Poster Design',
    mediaType: 'image',
    imageUrl: '/showcase/classycoat.jpg',
    githubUrl: 'https://github.com/typixelofficial/portfolio',
    badge: 'Commercial Art',
    accentColor: '#78716C',
    aspect: '4/5',
    dimensions: '1080 × 1350 px Commercial Editorial',
    tools: ['Adobe Photoshop', 'InDesign', 'Lightroom'],
    description: 'Minimalist high-end commercial editorial poster highlighting architectural interior wall finishes, organic earth tones, and warm modern furniture aesthetics.',
    keyFeatures: [
      'Refined geometric framing overlay highlighting tactile interior textures',
      'Neutral warm taupe and sandy concrete tone balance',
      'Elegant typographic hierarchy designed for luxury home decor advertising'
    ],
    languages: ['English'],
    row: 1,
    type: 'custom'
  },
  {
    id: 'eid-crystalmart-offer',
    title: 'Crystalmart — Eid Mubarak',
    subtitle: 'Retail Electronics & Festive Kitchenware Offer Campaign',
    client: 'Crystalmart Home & Kitchen',
    year: '2026',
    category: 'Festive & Social Media',
    mediaType: 'image',
    imageUrl: '/showcase/eidcrystalmart.webp',
    githubUrl: 'https://github.com/typixelofficial/portfolio',
    badge: 'Festive Offer',
    accentColor: '#0284C7',
    aspect: '1/1',
    dimensions: '1080 × 1080 px Square Social Ad',
    tools: ['Adobe Photoshop', 'Illustrator'],
    description: 'Vibrant retail commercial poster for Crystalmart celebrating Eid-ul-Adha with festive product packaging showcases and bright celebratory golden lighting.',
    keyFeatures: [
      'Crisp 3D product rendering arrangement with glowing mosque silhouette',
      'Bold branded blue and vibrant gold festive contrast',
      'Clear promotional hierarchy for immediate retail customer conversion'
    ],
    languages: ['Malayalam', 'English'],
    row: 1,
    type: 'custom'
  },
  {
    id: 'eid-swahwa-calligraphy',
    title: 'Eid Mubarak — Swahwa',
    subtitle: 'Sacred Islamic Typography & Ambient Golden Celebration Poster',
    client: 'Swahwa Cultural Foundation',
    year: '2026',
    category: 'Spiritual Typography & Poster',
    mediaType: 'image',
    imageUrl: '/showcase/eidswahwa.jpg',
    githubUrl: 'https://github.com/typixelofficial/portfolio',
    badge: 'Calligraphy Art',
    accentColor: '#10B981',
    aspect: '4/5',
    dimensions: '1080 × 1350 px Cultural Artboard',
    tools: ['Adobe Photoshop', 'Illustrator', 'Arabic Calligraphy Suite'],
    description: 'Serene spiritual greeting poster crafted with traditional script letterforms, antique parchment textures, and radiant lantern highlights.',
    keyFeatures: [
      'Handcrafted Arabic script typography framed by heritage textures',
      'Photorealistic ambient lantern illumination and shadow play',
      'Balanced dual-language blessing layout for community sharing'
    ],
    languages: ['Arabic', 'English'],
    row: 1,
    type: 'custom'
  },
  {
    id: 'flow-brand-identity',
    title: 'Flow',
    subtitle: 'Luxury Fashion & Minimalist Brand Monogram Architecture',
    client: 'Flow Studio & Apparel',
    year: '2026',
    category: 'Visual Identity & Branding',
    mediaType: 'image',
    imageUrl: '/showcase/flow.png',
    githubUrl: 'https://github.com/typixelofficial/portfolio',
    badge: 'Brand Monogram',
    accentColor: '#991B1B',
    aspect: '16/9',
    dimensions: '1920 × 1080 px Brand Architecture',
    tools: ['Adobe Illustrator', 'Figma'],
    description: 'Haute couture fashion brand emblem combining classic serif curves with modern geometric minimalism on rich deep burgundy canvas.',
    keyFeatures: [
      'Custom interlocking F-monogram vector geometry',
      'Timeless high-contrast gold metallic vector styling',
      'Versatile application across apparel tags, packaging, and digital storefronts'
    ],
    languages: ['English'],
    row: 1,
    type: 'custom'
  }
];

export const SHOWCASE_ROW_2: ShowcaseItem[] = [
  {
    id: 'frost-delicious-desserts',
    title: 'Frost — Delicious Desserts',
    subtitle: 'Gourmet Confectionery Packaging & Sweet Box Branding',
    client: 'Frost Patisserie & Bakes',
    year: '2026',
    category: 'Product & Packaging Mockup',
    mediaType: 'image',
    imageUrl: '/showcase/frost.jpg',
    githubUrl: 'https://github.com/typixelofficial/portfolio',
    badge: 'Packaging Art',
    accentColor: '#2563EB',
    aspect: '4/5',
    dimensions: '1080 × 1350 px Product Packaging',
    tools: ['Adobe Photoshop', 'Illustrator', 'Lightroom'],
    description: 'Cool refreshing packaging design for Frost gourmet desserts. Features floating ice cream pops, splash dynamics, and royal blue confectionery packaging.',
    keyFeatures: [
      'High-impact commercial food photography compositing with splash FX',
      'Royal navy and sky blue color psychology evoking premium chill',
      'Die-cut packaging layout tailored for retail freezer displays'
    ],
    languages: ['English'],
    row: 2,
    type: 'custom'
  },
  {
    id: 'nikah-ceremony-save-date',
    title: 'Nikah Ceremony — Save The Date',
    subtitle: 'Royal Floral Wedding Invitation & Keepsake Poster',
    client: 'Siraj & Fidha Royal Wedding',
    year: '2026',
    category: 'Event Branding & Invitation',
    mediaType: 'image',
    imageUrl: '/showcase/savethedatepost.jpg',
    githubUrl: 'https://github.com/typixelofficial/portfolio',
    badge: 'Wedding Series',
    accentColor: '#9F1239',
    aspect: '4/5',
    dimensions: '1080 × 1350 px Fine Art Print',
    tools: ['Adobe Photoshop', 'Illustrator', 'InDesign'],
    description: 'An elegant bespoke wedding invitation poster adorned with crimson garden roses, romantic arch geometry, and timeless serif calligraphy.',
    keyFeatures: [
      'Intricate floral botanical border arrangement with depth shading',
      'Refined editorial script typography with custom couple monogram',
      'Print-ready high-DPI vector framing suited for physical and digital delivery'
    ],
    languages: ['English'],
    row: 2,
    type: 'custom'
  },
  {
    id: 'skillovia-growth-mark',
    title: 'Skillovia — Growth Arrow Mark',
    subtitle: 'Minimalist Vector Emblem & Geometry for EdTech Learning',
    client: 'Skillovia Learning Platforms',
    year: '2026',
    category: 'Logo Design & Identity',
    mediaType: 'image',
    imageUrl: '/showcase/Skillovia.jpg',
    githubUrl: 'https://github.com/typixelofficial/portfolio',
    badge: 'Identity System',
    accentColor: '#EA580C',
    aspect: '16/9',
    dimensions: '1080 × 1350 px Brand Lockup',
    tools: ['Adobe Illustrator', 'Photoshop', 'Figma'],
    description: 'Definitive visual identity system for Skillovia. Built on progressive bar charts and upward trajectory vectors to represent continuous education and career growth.',
    keyFeatures: [
      'Geometric bar chart and upward momentum emblem ratio specifications',
      'Primary vibrant orange and clean white lettermark harmony',
      'High-contrast scalability from favicon to billboard signage'
    ],
    languages: ['English'],
    row: 2,
    type: 'custom'
  },
  {
    id: 'vishu-chamayam-poster',
    title: 'Vishu Chamayam — Festive Greeting',
    subtitle: 'Traditional Cultural Krishna Illustration & Festival Art',
    client: 'Chamayam Heritage Arts',
    year: '2026',
    category: 'Cultural Poster & Digital Art',
    mediaType: 'image',
    imageUrl: '/showcase/vishuchamayam.jpg',
    githubUrl: 'https://github.com/typixelofficial/portfolio',
    badge: 'Festive Special',
    accentColor: '#0284C7',
    aspect: '4/5',
    dimensions: '1080 × 1350 px Art Illustration',
    tools: ['Adobe Photoshop', 'Illustrator', 'Digital Painting'],
    description: 'Charming festive Vishu celebration poster celebrating Kerala cultural heritage with cheerful Krishna illustration, traditional Kani decor, and twilight garden ambiance.',
    keyFeatures: [
      'Expressive character digital painting with traditional Kerala festive ornaments',
      'Enchanting night garden atmosphere with golden glow accents',
      'Distinctive custom Malayalam calligraphy title lockup'
    ],
    languages: ['Malayalam', 'English'],
    row: 2,
    type: 'custom'
  },
  {
    id: 'yenza-brand-identity',
    title: 'Yenza — Modern Brand Identity',
    subtitle: 'Contemporary Brand Architecture & Geometric Logotype',
    client: 'Yenza Design Studio',
    year: '2026',
    category: 'Brand Identity & Logo',
    mediaType: 'image',
    imageUrl: '/showcase/Yenza.jpg',
    githubUrl: 'https://github.com/typixelofficial/portfolio',
    badge: 'Logomark',
    accentColor: '#451A03',
    aspect: '16/9',
    dimensions: 'Vector Master Lockup (SVG & EPS)',
    tools: ['Adobe Illustrator', 'Figma'],
    description: 'Sophisticated contemporary logotype for Yenza, featuring a bold circular ligature monogram paired with clean modern letter spacing on warm mocha ground.',
    keyFeatures: [
      'Bold circular target monogram embodying focus and precision',
      'Minimalist dark chocolate and cream palette',
      'Engineered for maximum legibility on digital platforms and physical packaging'
    ],
    languages: ['English'],
    row: 2,
    type: 'custom'
  }
];

const STORAGE_KEY_ROW_1 = 'typixel_portfolio_showcase_r1_v6';
const STORAGE_KEY_ROW_2 = 'typixel_portfolio_showcase_r2_v6';

/**
 * Normalizes any relative or loose image path to always resolve properly
 */
export const normalizeShowcaseImagePath = (url?: string): string => {
  if (!url || !url.trim()) return '';
  const clean = url.trim();
  // Already absolute or data url
  if (clean.startsWith('http://') || clean.startsWith('https://') || clean.startsWith('data:')) {
    return clean;
  }
  // If it's a known showcase name or path like showcase/xxx
  if (clean.startsWith('showcase/')) {
    return `/${clean}`;
  }
  if (!clean.startsWith('/')) {
    return `/${clean}`;
  }
  return clean;
};

export const getStoredProjectsRow1 = (): ShowcaseItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_ROW_1);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Filter out any stale items referencing missing Works folders
        const hasBrokenWorks = parsed.some((p: ShowcaseItem) => p.imageUrl?.includes('/Works/'));
        if (!hasBrokenWorks) {
          return parsed;
        }
      }
    }
  } catch (err) {
    console.error('Failed to read Row 1 projects from storage:', err);
  }
  // Save new default items into storage
  saveProjectsToStorage(SHOWCASE_ROW_1, SHOWCASE_ROW_2);
  return SHOWCASE_ROW_1;
};

export const getStoredProjectsRow2 = (): ShowcaseItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_ROW_2);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const hasBrokenWorks = parsed.some((p: ShowcaseItem) => p.imageUrl?.includes('/Works/'));
        if (!hasBrokenWorks) {
          return parsed;
        }
      }
    }
  } catch (err) {
    console.error('Failed to read Row 2 projects from storage:', err);
  }
  return SHOWCASE_ROW_2;
};

export const saveProjectsToStorage = (row1: ShowcaseItem[], row2: ShowcaseItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_ROW_1, JSON.stringify(row1));
    localStorage.setItem(STORAGE_KEY_ROW_2, JSON.stringify(row2));
  } catch (err) {
    console.error('Failed to save projects to storage:', err);
  }
};

export type LinkType = 'instagram' | 'github' | 'figma' | 'behance' | 'dribbble' | 'web' | 'video';

export const getLinkInfo = (url?: string): { label: string; type: LinkType } => {
  if (!url || !url.trim()) return { label: 'Open Project', type: 'web' };
  const lower = url.toLowerCase();
  if (lower.endsWith('.mp4')) {
    return { label: 'Watch Full Video', type: 'video' };
  }
  if (lower.includes('instagram.com')) {
    return { label: 'View on Instagram', type: 'instagram' };
  }
  if (lower.includes('github.com')) {
    return { label: 'View on GitHub', type: 'github' };
  }
  if (lower.includes('figma.com')) {
    return { label: 'View on Figma', type: 'figma' };
  }
  if (lower.includes('behance.net')) {
    return { label: 'View on Behance', type: 'behance' };
  }
  if (lower.includes('dribbble.com')) {
    return { label: 'View on Dribbble', type: 'dribbble' };
  }
  return { label: 'Open Project Link', type: 'web' };
};
