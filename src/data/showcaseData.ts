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
  type?:
    | 'fifa'
    | 'pupa'
    | 'uroos'
    | 'firstfly'
    | 'didyouknow'
    | 'tiara'
    | 'ramadan'
    | 'sahityotsav'
    | 'wedding'
    | 'fintech'
    | 'admission'
    | 'specialbakes'
    | 'custom'
    | 'video';
}

export const SHOWCASE_ROW_1: ShowcaseItem[] = [
  {
    id: 'stage-motion-reel',
    title: 'Stage Motion & Cultural Night',
    subtitle: 'Live Event LED Screen Graphics & Dynamic Video Edit',
    client: 'Star Cultural Arts Fest',
    year: '2026',
    category: 'Motion & Video Showcase',
    mediaType: 'video',
    videoUrl: '/Works/videos/typixelofficial_1760175085_3740939313467748252_75216449649.mp4',
    imageUrl: '/Works/videos/thumb_1.jpg',
    duration: '0:28',
    fileSize: '5.1 MB',
    githubUrl: 'https://github.com/typixelofficial/portfolio/tree/main/Works/videos',
    badge: 'Autoplay Reel',
    accentColor: '#8B5CF6',
    aspect: '9/16',
    dimensions: '1080 × 1920 px (Full HD Reel)',
    tools: ['Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve'],
    description: 'A cinematic high-tempo motion edit and synchronized stage visual backdrop crafted for live stage choir performances. Includes rhythmic lighting cuts, ambient stage glow, and custom brand watermark framing.',
    keyFeatures: [
      'Synchronized audio beat cuts with live traditional daff performance',
      'High-contrast backdrop grading tuned for large-format stage LED walls',
      'Cinematic color curves in Premiere Pro and DaVinci Resolve',
      'Optimized 9:16 vertical crop for Instagram Reels and WhatsApp status'
    ],
    languages: ['Malayalam', 'English'],
    type: 'video'
  },
  {
    id: 'skillovia-brand-system',
    title: 'Skillovia — Visual Identity System',
    subtitle: 'EdTech Brand Architecture & Graphic Standards',
    client: 'Skillovia Learning Platforms',
    year: '2026',
    category: 'Visual Identity & Branding',
    mediaType: 'image',
    imageUrl: '/Works/logo/Skillovia/typixelofficial_1768234247_3808547364596727519_75216449649.jpg',
    githubUrl: 'https://github.com/typixelofficial/portfolio/tree/main/Works/logo/Skillovia',
    badge: 'Identity System',
    accentColor: '#F97316',
    aspect: '4/5',
    dimensions: '1080 × 1350 px Brand Lockup',
    tools: ['Adobe Illustrator', 'Photoshop', 'Figma'],
    description: 'Definitive visual identity system for Skillovia. Built on progressive bar charts and upward trajectory vectors to represent continuous education, skill mastery, and academic growth.',
    keyFeatures: [
      'Geometric bar chart and upward momentum emblem ratio specifications',
      'Primary vibrant orange & electric azure color harmony palette',
      'Clean modern wordmark with custom kerning for high readability'
    ],
    languages: ['English'],
    type: 'custom'
  },
  {
    id: 'al-madad-typography',
    title: 'Al Madad — Sacred Typography',
    subtitle: 'Calligraphic Spiritual Identity & Poster Design',
    client: 'Al Madad Cultural Heritage',
    year: '2026',
    category: 'Arabic Calligraphy & Identity',
    mediaType: 'image',
    imageUrl: '/Works/logo/almadad.jpg',
    githubUrl: 'https://github.com/typixelofficial/portfolio/blob/main/Works/logo/almadad.jpg',
    badge: 'Typography',
    accentColor: '#10B981',
    aspect: '4/5',
    dimensions: '1080 × 1350 px & High-Res Print',
    tools: ['Adobe Illustrator', 'Photoshop', 'Calligraphy Suite'],
    description: 'Bespoke Arabic calligraphic identity artwork rendered with traditional Thuluth and modern fluid strokes. Built to convey reverence, spiritual depth, and timeless cultural heritage.',
    keyFeatures: [
      'Authentic handcrafted Arabic letterforms with balanced diacritics',
      'Deep emerald green gradient backdrop with subtle gold leaf framing',
      'Versatile vector lockup suitable for both monumental signage and social media'
    ],
    languages: ['Arabic', 'English'],
    type: 'custom'
  },
  {
    id: 'political-social-reel',
    title: 'Press Conference & Campaign Reel',
    subtitle: 'Broadcast-Grade Media Cut & Dynamic Subtitles',
    client: 'UDF Kerala Media Cell',
    year: '2026',
    category: 'Motion & Video Showcase',
    mediaType: 'video',
    videoUrl: '/Works/videos/typixelofficial_1779419557_3902376391340334772_75216449649.mp4',
    imageUrl: '/Works/videos/thumb_2.jpg',
    duration: '0:24',
    fileSize: '1.6 MB',
    githubUrl: 'https://github.com/typixelofficial/portfolio/tree/main/Works/videos',
    badge: 'Autoplay Reel',
    accentColor: '#0284C7',
    aspect: '9/16',
    dimensions: '720 × 1280 px Vertical HD',
    tools: ['Adobe Premiere Pro', 'CapCut Pro', 'DaVinci Resolve'],
    description: 'High-impact political press release video engineered for rapid viral engagement across news feeds. Incorporates speech clarity enhancement, brand banner framing, and fast-paced editing.',
    keyFeatures: [
      'Dialogue leveling and noise cancellation for multi-mic press setting',
      'Multi-channel brand logo watermark backdrop integration',
      'Instant-hook opening frame designed for 3-second retention',
      'High-speed viral compression for instant social distribution'
    ],
    languages: ['Malayalam'],
    type: 'video'
  },
  {
    id: 'walkie-talkie-logo-card',
    title: 'Walkie Talkie — Wordmark & Device Mark',
    subtitle: 'Vector Logo Design & Speech Bubble Architecture',
    client: 'Walkie Talkie Mobile App',
    year: '2026',
    category: 'Logo Design & Identity',
    mediaType: 'image',
    imageUrl: '/Works/logo/walkie.talkie_official_1778135510_3891605176151291363_22170503343.jpg',
    githubUrl: 'https://github.com/typixelofficial/portfolio/blob/main/Works/logo/walkie.talkie_official_1778135510_3891605176151291363_22170503343.jpg',
    badge: 'Logo System',
    accentColor: '#E11D48',
    aspect: '1/1',
    dimensions: 'Vector Master Lockup (SVG & EPS)',
    tools: ['Adobe Illustrator', 'Photoshop'],
    description: 'The primary emblem lockup for Walkie Talkie, fusing the classic handheld radio silhouette with modern slanted sans-serif typography on a solid crimson background.',
    keyFeatures: [
      'Interlocking device badge intersecting custom display typography',
      'Bold energetic angular underline acting as speech bubble tail',
      'Scalable from 16px favicon to giant outdoor hoarding'
    ],
    languages: ['English'],
    type: 'custom'
  },
  {
    id: 'chamayam-textiles-festive',
    title: 'Chamayam — Festive Elegance',
    subtitle: 'Textiles & Apparel Commercial Advertising Campaign',
    client: 'Chamayam Textiles',
    year: '2026',
    category: 'Commercial Poster Design',
    mediaType: 'image',
    imageUrl: '/Works/posters/Special Day/chamayamtextiles_1771066986_3832307252041197359_3022106367.jpg',
    githubUrl: 'https://github.com/typixelofficial/portfolio/blob/main/Works/posters/Special%20Day/chamayamtextiles_1771066986_3832307252041197359_3022106367.jpg',
    badge: 'Textiles Campaign',
    accentColor: '#D97706',
    aspect: '4/5',
    dimensions: '1080 × 1350 px Social Promotion',
    tools: ['Adobe Photoshop', 'Illustrator', 'Lightroom'],
    description: 'Promotional retail campaign for Chamayam Textiles showcasing premium traditional fabrics, celebratory apparel discounts, and seasonal festival offers with rich golden highlights.',
    keyFeatures: [
      'Jewelry and silk texture accentuation in Photoshop',
      'Promotional discount ribbon lockup and festival greetings',
      'High-contrast retail store branding and showroom location markers'
    ],
    languages: ['Malayalam', 'English'],
    type: 'custom'
  },
  {
    id: 'typixel-rebrand-new',
    title: 'Typixel Studio — Visual Rebrand 2.0',
    subtitle: 'Geometry, Grid Systems & Design Engineering Identity',
    client: 'Typixel Official Studio',
    year: '2026',
    category: 'Brand Identity & Guidelines',
    mediaType: 'image',
    imageUrl: '/Works/branding/typixel/new/1.jpg',
    githubUrl: 'https://github.com/typixelofficial/portfolio/tree/main/Works/branding/typixel/new',
    badge: 'Agency Rebrand',
    accentColor: '#059669',
    aspect: '4/5',
    dimensions: 'Brand Guide Presentation Suite',
    tools: ['Adobe Illustrator', 'Figma', 'Photoshop'],
    description: 'The updated brand identity system for Typixel Studio. Built around pixel precision, geometric typographic balance, and versatile dark-mode architectural aesthetics.',
    keyFeatures: [
      'Precision grid geometry balancing typography and icon mark',
      'Minimalist monochrome aesthetic paired with electric neon accents',
      'Complete social avatar, cover banner, and merchandise blueprint'
    ],
    languages: ['English'],
    type: 'custom'
  },
  {
    id: 'ramadan-kareem-poster',
    title: 'Ramadan Mubarak — Calligraphic Series',
    subtitle: 'Festive Greeting & Architectural Islamic Poster',
    client: 'Creative Cultural Commission',
    year: '2026',
    category: 'Festive & Cultural Poster',
    mediaType: 'image',
    imageUrl: '/Works/posters/Special Day/typixelofficial_1749392800_3650493854868000131_75216449649.jpg',
    githubUrl: 'https://github.com/typixelofficial/portfolio/blob/main/Works/posters/Special%20Day/typixelofficial_1749392800_3650493854868000131_75216449649.jpg',
    badge: 'Special Day',
    accentColor: '#047857',
    aspect: '4/5',
    dimensions: '1080 × 1350 px High Resolution',
    tools: ['Adobe Photoshop', 'Illustrator'],
    description: 'A serene spiritual greeting poster designed for Ramadan. Merges traditional arch motifs with golden crescent illumination, modern typographic lockups, and tranquil twilight gradients.',
    keyFeatures: [
      'Intricate Islamic geometric window filigree vector design',
      'Warm ambient lantern glow and photorealistic specular lighting',
      'Bilingual Arabic-English celebratory blessing typography'
    ],
    languages: ['Malayalam', 'English', 'Arabic'],
    type: 'custom'
  }
];

export const SHOWCASE_ROW_2: ShowcaseItem[] = [
  {
    id: 'custom-poster-campaign-2',
    title: 'Urban Creative Poster Campaign',
    subtitle: 'High-Impact Typography & Visual Art Direction',
    client: 'Studio Commission',
    year: '2026',
    category: 'Commercial Poster Design',
    mediaType: 'image',
    imageUrl: '/Works/posters/Custom/typixelofficial_1764206977_3774764175248191285_75216449649.jpg',
    githubUrl: 'https://github.com/typixelofficial/portfolio/blob/main/Works/posters/Custom/typixelofficial_1764206977_3774764175248191285_75216449649.jpg',
    badge: 'Poster Series',
    accentColor: '#2563EB',
    aspect: '4/5',
    dimensions: '1080 × 1350 px Commercial Poster',
    tools: ['Adobe Photoshop', 'Illustrator'],
    description: 'Bespoke promotional poster created with custom typography, cinematic illumination, and high-energy color contrasts tailored for social media engagement.',
    keyFeatures: [
      'Dual-tone lighting and cinematic shadow depth',
      'Dynamic typography layout tailored for quick mobile readability',
      'Vector badges and verified event credentials'
    ],
    languages: ['Malayalam', 'English'],
    type: 'custom'
  },
  {
    id: 'custom-poster-typography',
    title: 'Creative Poster Showcase',
    subtitle: 'Expressive Typography & High-Contrast Art',
    client: 'Studio Commission',
    year: '2026',
    category: 'Commercial Poster Design',
    mediaType: 'image',
    imageUrl: '/Works/posters/Custom/typixelofficial_1750178003_3657080610304033354_75216449649.jpg',
    githubUrl: 'https://github.com/typixelofficial/portfolio/blob/main/Works/posters/Custom/typixelofficial_1750178003_3657080610304033354_75216449649.jpg',
    badge: 'Poster Art',
    accentColor: '#3B82F6',
    aspect: '4/5',
    dimensions: '1080 × 1350 px Social Promotion',
    tools: ['Adobe Photoshop', 'Illustrator'],
    description: 'Custom creative poster featuring expressive Malayalam typography and dramatic color palettes engineered to draw maximum eyeballs on social feeds.',
    keyFeatures: [
      'Custom brush stroke typography with textured overlay highlights',
      'Curated duotone balance maximizing digital screen contrast',
      'Bespoke layout structure emphasizing key event dates and badges'
    ],
    languages: ['Malayalam', 'English'],
    type: 'custom'
  },
  {
    id: 'skillovia-emblem-lockup',
    title: 'Skillovia — Growth Arrow Mark',
    subtitle: 'Minimalist Vector Emblem & Geometry',
    client: 'Skillovia Technologies',
    year: '2026',
    category: 'Logo Design & Identity',
    mediaType: 'image',
    imageUrl: '/Works/logo/Skillovia/typixelofficial_1768234247_3808547364529590285_75216449649.jpg',
    githubUrl: 'https://github.com/typixelofficial/portfolio/tree/main/Works/logo/Skillovia',
    badge: 'Logo Lockup',
    accentColor: '#F59E0B',
    aspect: '4/5',
    dimensions: 'Vector Master Brand Pack',
    tools: ['Adobe Illustrator', 'InDesign'],
    description: 'The emblem design for Skillovia showing the iconic stepped bars transitioning into an ascending arrow, symbolizing skill mastery, education, and upward trajectory.',
    keyFeatures: [
      'Golden ratio proportions applied across ascending bars',
      'Warm orange and electric blue corporate duality',
      'High-contrast readability across light and dark interfaces'
    ],
    languages: ['English'],
    type: 'custom'
  },
  {
    id: 'graphic-design-concept-art',
    title: 'Modern Graphic Design Masterclass',
    subtitle: 'Editorial Grid & Conceptual Graphic Layout',
    client: 'Typixel Creative Studio',
    year: '2026',
    category: 'Graphic Design & Artboard',
    mediaType: 'image',
    imageUrl: '/Works/posters/Graphic Designing/typixelofficial_1777168923_3883496860031728633_75216449649.jpg',
    githubUrl: 'https://github.com/typixelofficial/portfolio/blob/main/Works/posters/Graphic%20Designing/typixelofficial_1777168923_3883496860031728633_75216449649.jpg',
    badge: 'Artboard Series',
    accentColor: '#6366F1',
    aspect: '4/5',
    dimensions: 'A3 Print & High-Res Digital',
    tools: ['Adobe Illustrator', 'Photoshop'],
    description: 'Conceptual exploration of contemporary Swiss design principles infused with modern social typography. Balances strict alignment with expressive graphical flourishes.',
    keyFeatures: [
      'Multi-column asymmetric typography layout',
      'Fine micro-dot grid and alignment coordinate markers',
      'Vibrant contrasting focal points directing user eye flow'
    ],
    languages: ['English', 'Malayalam'],
    type: 'custom'
  },
  {
    id: 'textiles-retail-ad',
    title: 'Elegance & Style — Textiles Campaign',
    subtitle: 'Apparel Store Showcase & Seasonal Collection',
    client: 'Premier Textiles Store',
    year: '2026',
    category: 'Commercial Poster Design',
    mediaType: 'image',
    imageUrl: '/Works/posters/Textiles/typixelofficial_1758330738_3725470708102564687_75216449649.jpg',
    githubUrl: 'https://github.com/typixelofficial/portfolio/blob/main/Works/posters/Textiles/typixelofficial_1758330738_3725470708102564687_75216449649.jpg',
    badge: 'Textiles Ad',
    accentColor: '#EC4899',
    aspect: '4/5',
    dimensions: '1080 × 1350 px Social Promotion',
    tools: ['Adobe Photoshop', 'Illustrator'],
    description: 'Commercial retail poster celebrating fabric quality and festive wear collections. Highlights garment textures with subtle warm backlighting and elegant gold typography.',
    keyFeatures: [
      'High-dynamic-range fabric texture and fold enhancement',
      'Seasonal promotional offer badges and store location lockups',
      'Clean typography hierarchy ensuring immediate comprehension'
    ],
    languages: ['Malayalam', 'English'],
    type: 'custom'
  },
  {
    id: 'artboard-master-vector',
    title: 'Artboard 1 — Vector Masterpiece',
    subtitle: 'Scalable Vector Monogram & Brand Symbolism',
    client: 'Typixel Identity Lab',
    year: '2026',
    category: 'Logo Design & Identity',
    mediaType: 'image',
    imageUrl: '/Works/logo/Artboard 1.png',
    githubUrl: 'https://github.com/typixelofficial/portfolio/blob/main/Works/logo/Artboard%201.png',
    badge: 'Vector Symbol',
    accentColor: '#14B8A6',
    aspect: '1/1',
    dimensions: 'Master Vector EPS, SVG & High-Res PNG',
    tools: ['Adobe Illustrator'],
    description: 'Precision vector construction demonstrating optical geometry correction, uniform stroke weight, and balanced counter spaces for versatile identity systems.',
    keyFeatures: [
      'Sub-pixel aligned bezier curves for crisp rendering at any scale',
      'Universal application across print debossing, embroidery, and screen apps',
      'Tested across 16px favicon up to 40-foot outdoor displays'
    ],
    languages: ['English'],
    type: 'custom'
  },
  {
    id: 'special-day-national-day',
    title: 'Celebration of Freedom & Heritage',
    subtitle: 'National Event Tribute & Commemorative Art',
    client: 'Public Cultural Initiative',
    year: '2026',
    category: 'Festive & Cultural Poster',
    mediaType: 'image',
    imageUrl: '/Works/posters/Special Day/typixelofficial_1756615169_3711079475141270528_75216449649.jpg',
    githubUrl: 'https://github.com/typixelofficial/portfolio/blob/main/Works/posters/Special%20Day/typixelofficial_1756615169_3711079475141270528_75216449649.jpg',
    badge: 'National Day',
    accentColor: '#16A34A',
    aspect: '4/5',
    dimensions: '1080 × 1350 px High Resolution',
    tools: ['Adobe Photoshop', 'Illustrator'],
    description: 'A patriotic commemorative visual poster capturing national pride, historical milestones, and civic unity. Employs tricolor accents and inspiring typography.',
    keyFeatures: [
      'Dynamic flag ripple texture composite with volumetric sun rays',
      'Distinguished serif heading type paired with crisp date badges',
      'Optimized contrast for mobile screens and outdoor LED projections'
    ],
    languages: ['Malayalam', 'English'],
    type: 'custom'
  },
  {
    id: 'special-day-salute',
    title: 'Cultural Festival Greeting Art',
    subtitle: 'Community Event Branding & Social Banner',
    client: 'Event Committee',
    year: '2026',
    category: 'Festive & Cultural Poster',
    mediaType: 'image',
    imageUrl: '/Works/posters/Special Day/typixelofficial_1767243293_3800234641337181269_75216449649.jpg',
    githubUrl: 'https://github.com/typixelofficial/portfolio/blob/main/Works/posters/Special%20Day/typixelofficial_1767243293_3800234641337181269_75216449649.jpg',
    badge: 'Festival Banner',
    accentColor: '#8B5CF6',
    aspect: '4/5',
    dimensions: '1080 × 1350 px High-Res Digital',
    tools: ['Adobe Photoshop', 'Illustrator'],
    description: 'Vibrant cultural event announcement poster featuring ceremonial typography and warm celebratory atmosphere.',
    keyFeatures: [
      'Traditional festive ornaments with modern digital depth',
      'Clear scheduling hierarchy for immediate attendee comprehension',
      'Scalable artwork adapted for social feeds and print hoardings'
    ],
    languages: ['Malayalam', 'English'],
    type: 'custom'
  }
];

const STORAGE_KEY_ROW_1 = 'typixel_portfolio_showcase_r1_v4';
const STORAGE_KEY_ROW_2 = 'typixel_portfolio_showcase_r2_v4';

export const getStoredProjectsRow1 = (): ShowcaseItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_ROW_1);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error('Failed to read Row 1 projects from storage:', err);
  }
  return SHOWCASE_ROW_1;
};

export const getStoredProjectsRow2 = (): ShowcaseItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_ROW_2);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
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

export const resetProjectsToDefault = () => {
  try {
    localStorage.removeItem(STORAGE_KEY_ROW_1);
    localStorage.removeItem(STORAGE_KEY_ROW_2);
  } catch (err) {
    console.error('Failed to reset projects:', err);
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
