export interface ProjectShot {
  id: string;
  title: string;
  category: 'Motion & Video' | 'UX/UI' | 'Mobile App' | 'Branding' | 'Web';
  client: string;
  year: string;
  description: string;
  tags: string[];
  gradient: string;
  accent: string;
  deliverables: string[];
  stats?: string;
  aspectRatio?: string;
  mediaType?: 'video' | 'image';
  videoUrl?: string;
  imageUrl?: string;
}

export const PORTFOLIO_SHOTS: ProjectShot[] = [
  {
    id: 'stage-motion-reel-shot',
    title: 'NEIC — Motion Graphics & Brand Video Reel',
    category: 'Motion & Video',
    client: 'NEIC Media',
    year: '2026',
    description: 'Dynamic motion graphics backdrop engineered with rhythmic pacing, kinetic typography, and punchy transitions.',
    tags: ['Motion Graphics', 'Premiere Pro', 'After Effects', 'Kinetic Typography'],
    gradient: 'from-purple-950 via-neutral-900 to-black',
    accent: '#8B5CF6',
    mediaType: 'video',
    videoUrl: '/showcase/neic.mp4',
    imageUrl: '/showcase/flow.png',
    deliverables: ['Vertical Reel Master (Full HD)', 'Kinetic Typography Lockups', 'Social Teaser Reel Cut', 'Color Grading in Premiere Pro'],
    stats: '100% responsive motion graphics'
  },
  {
    id: 'savethedate-video-reel-shot',
    title: 'Save The Date — Wedding Motion Invitation',
    category: 'Motion & Video',
    client: 'Royal Wedding Series',
    year: '2026',
    description: 'Cinematic animated floral invitation combining blooming crimson rose visual dynamics, golden monogram reveals, and romantic audio-visual timing.',
    tags: ['Wedding Reel', 'After Effects', 'Premiere Pro', 'Floral Animation'],
    gradient: 'from-rose-950 via-neutral-900 to-black',
    accent: '#E11D48',
    mediaType: 'video',
    videoUrl: '/showcase/savethedatevideo_.mp4',
    imageUrl: '/showcase/savethedatepost.jpg',
    deliverables: ['9:16 Vertical Reel Master', 'Botanical Animation Rig', 'Calligraphic Monogram Reveal', 'High-DPI Master Export'],
    stats: 'Featured keepsake animation'
  },
  {
    id: 'skillovia-visual-identity',
    title: 'Skillovia — Geometric Learning Identity',
    category: 'Branding',
    client: 'Skillovia Learning Platforms',
    year: '2026',
    description: 'Corporate emblem and vector identity system representing upward learning momentum with vibrant orange and azure duality.',
    tags: ['Logo Design', 'Vector System', 'Brand Identity', 'Illustrator'],
    gradient: 'from-amber-950 via-stone-900 to-neutral-900',
    accent: '#F97316',
    mediaType: 'image',
    imageUrl: '/showcase/Skillovia.jpg',
    deliverables: ['Vector Master Emblems', 'Typography Hierarchy', 'Print & Digital Collateral'],
    stats: 'Official corporate brand standards adopted'
  },
  {
    id: 'chamayam-textiles-shot',
    title: 'Chamayam — Festive Retail Advertising',
    category: 'Branding',
    client: 'Chamayam Textiles',
    year: '2026',
    description: 'High-impact retail promotional poster celebrating premium traditional silk wear and festival apparel collections.',
    tags: ['Poster Design', 'Commercial Ad', 'Photoshop', 'Retail'],
    gradient: 'from-orange-950 via-neutral-900 to-black',
    accent: '#D97706',
    mediaType: 'image',
    imageUrl: '/showcase/Chamayam.jpg',
    deliverables: ['Large-Format Hoarding', 'Social Feed Posters', 'Product Highlights'],
    stats: 'Over 200k+ customer reach in festive season'
  },
  {
    id: 'classycoat-finishes-shot',
    title: 'Classy Coat — Premium Texture Art',
    category: 'Branding',
    client: 'Classy Coat Architectural Finishes',
    year: '2026',
    description: 'Minimalist high-end commercial editorial poster highlighting architectural interior wall finishes and neutral earth tones.',
    tags: ['Commercial Poster', 'Interior Design', 'Photoshop'],
    gradient: 'from-stone-900 to-neutral-800',
    accent: '#78716C',
    mediaType: 'image',
    imageUrl: '/showcase/classycoat.jpg',
    deliverables: ['Brand Hoarding Poster', 'Architectural Catalogues', 'Social Feed Creative'],
    stats: 'Featured across Kerala design exhibits'
  },
  {
    id: 'frost-dessert-shot',
    title: 'Frost — Gourmet Dessert Branding',
    category: 'Branding',
    client: 'Frost Patisserie & Bakes',
    year: '2026',
    description: 'Cool refreshing packaging design for Frost gourmet desserts with splash dynamics and royal confectionery packaging.',
    tags: ['Packaging Design', 'Photoshop', 'Product Mockup'],
    gradient: 'from-blue-950 to-neutral-900',
    accent: '#2563EB',
    mediaType: 'image',
    imageUrl: '/showcase/frost.jpg',
    deliverables: ['Product Box Mockup', 'Retail Display Graphics', 'Digital Advertising Banner'],
    stats: '+35% retail packaging shelf recognition'
  },
  {
    id: 'swahwa-heritage-shot',
    title: 'Swahwa — Sacred Calligraphy Art',
    category: 'Branding',
    client: 'Heritage Cultural Center',
    year: '2026',
    description: 'Bespoke spiritual Arabic calligraphic identity artwork rendered with traditional Thuluth and modern fluid strokes for cultural installations and festive prints.',
    tags: ['Arabic Calligraphy', 'Poster Art', 'Illustrator', 'Heritage'],
    gradient: 'from-emerald-950 via-stone-900 to-black',
    accent: '#10B981',
    mediaType: 'image',
    imageUrl: '/showcase/eidswahwa.jpg',
    deliverables: ['Vector Calligraphic Master', 'Large Format Exhibition Print', 'Social Media Blessing Suite'],
    stats: 'Exhibited in heritage galleries'
  }
];

export interface ServiceDetail {
  id: string;
  title: string;
  tagline: string;
  fullDescription: string;
  deliverables: string[];
  tools: string[];
}

export const SERVICES_DATA: ServiceDetail[] = [
  {
    id: 'motion-video',
    title: 'Motion & Video Editing',
    tagline: 'High-energy reels, stage LED graphics, and viral short-form video cuts.',
    fullDescription: 'From high-tempo live concert LED screen visuals to viral Instagram Reels and political campaign cuts. Combining Premiere Pro, After Effects, DaVinci Resolve, and CapCut with tight sound design and cinematic grading.',
    deliverables: ['Live Event Stage LED Visuals', 'Instagram Reels & YouTube Shorts', 'Motion Graphic Intros & Outros', 'Sound Design & Dialogue Balancing', 'Cinematic Color Grading'],
    tools: ['Adobe Premiere Pro', 'After Effects', 'DaVinci Resolve', 'CapCut Pro']
  },
  {
    id: 'brand-identity',
    title: 'Brand Identity & Visual Systems',
    tagline: 'Definitive corporate identity systems, logo geometry, and visual standards.',
    fullDescription: 'Comprehensive corporate visual identities that protect and scale your presence. Full specifications for logo construction, clear-space rules, typography pairings, color systems, and marketing collateral.',
    deliverables: ['Vector Logo Design & Emblems', 'Comprehensive Brand Systems', 'Color Palette & Typography Hierarchies', 'Corporate Stationery & Livery', 'Social Media Brand Kits'],
    tools: ['Adobe Illustrator', 'Photoshop', 'Figma']
  },
  {
    id: 'creative-posters',
    title: 'Creative Posters & Advertising',
    tagline: 'High-impact commercial posters, festive greetings, and cultural campaigns.',
    fullDescription: 'Standout advertising posters for retail brands, textile giants, sports events, and cultural festivals. Designed with striking typography in Malayalam, English, and Arabic.',
    deliverables: ['Commercial Retail Advertising', 'Festive & Special Day Posters', 'Arabic & Malayalam Typography', 'Print-Ready Flex & Billboards', 'Optimized Social Media Formats'],
    tools: ['Adobe Photoshop', 'Illustrator', 'Lightroom']
  },
  {
    id: 'ui-ux-design',
    title: 'UI/UX & Web Development',
    tagline: 'Transforming ideas into exceptional mobile app and web experiences.',
    fullDescription: 'End-to-end digital product design for web and mobile with intuitive UX flows, responsive component architectures, and clean front-end code with React and Tailwind CSS.',
    deliverables: ['Mobile App UI/UX Design', 'Interactive Figma Prototypes', 'Responsive Web Applications', 'Front-End Implementation in React', 'Performance & SEO Optimization'],
    tools: ['Figma', 'React', 'TypeScript', 'Tailwind CSS']
  }
];
