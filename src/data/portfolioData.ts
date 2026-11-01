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
    title: 'Stage Motion & Live Choir LED Visuals',
    category: 'Motion & Video',
    client: 'Star Arts Cultural Fest',
    year: '2026',
    description: 'Dynamic live event stage visuals and high-energy motion backdrop engineered for synchronized audio-visual stage performances with rhythmic lighting and ambient glow.',
    tags: ['Motion Graphics', 'Premiere Pro', 'After Effects', 'Stage LED'],
    gradient: 'from-purple-950 via-neutral-900 to-black',
    accent: '#8B5CF6',
    mediaType: 'video',
    videoUrl: '/Works/videos/typixelofficial_1760175085_3740939313467748252_75216449649.mp4',
    imageUrl: '/Works/videos/thumb_1.jpg',
    deliverables: ['Stage LED Video Visuals (Full HD)', 'Live Choreography Sync', 'Social Teaser Reel Cut', 'Color Grading in Premiere Pro'],
    stats: 'Featured on live stage for 5,000+ audience'
  },
  {
    id: 'political-social-reel-shot',
    title: 'Press Conference & Viral Campaign Reel',
    category: 'Motion & Video',
    client: 'UDF Kerala Media Cell',
    year: '2026',
    description: 'Fast-paced viral political interview cut with audio restoration, brand banner integration, and rhythmic micro-cuts for rapid social dissemination.',
    tags: ['Reels & Shorts', 'CapCut Pro', 'Premiere Pro', 'Viral Edit'],
    gradient: 'from-sky-950 via-neutral-900 to-black',
    accent: '#0284C7',
    mediaType: 'video',
    videoUrl: '/Works/videos/typixelofficial_1779419557_3902376391340334772_75216449649.mp4',
    imageUrl: '/Works/videos/thumb_2.jpg',
    deliverables: ['9:16 Vertical Reel Master', 'Dialogue Enhancement', 'Multi-Mic Audio Balancing', 'Sub-second Hook Pacing'],
    stats: 'Over 100k+ organic views on social channels'
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
    imageUrl: '/Works/logo/Skillovia/typixelofficial_1768234247_3808547364596727519_75216449649.jpg',
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
    imageUrl: '/Works/posters/Special Day/chamayamtextiles_1771066986_3832307252041197359_3022106367.jpg',
    deliverables: ['Large-Format Hoarding', 'Social Feed Posters', 'Product Highlights'],
    stats: 'Over 200k+ customer reach in festive season'
  },
  {
    id: 'finscale',
    title: 'Frost & Vistora — Digital Product Systems',
    category: 'UX/UI',
    client: 'Frost Dessert & Vistora Edu',
    year: '2025',
    description: 'Modern mobile ordering interfaces and student learning dashboards designed with micro-interactions, responsive design tokens, and smooth user checkout flows.',
    tags: ['UI/UX', 'Mobile App', 'Design System', 'Figma'],
    gradient: 'from-zinc-900 to-zinc-800',
    accent: '#3B82F6',
    deliverables: ['Mobile App Design & UI', 'Interactive Figma Prototype', 'Design Tokens & Component Library'],
    stats: '+42% higher 30-day retention rate'
  },
  {
    id: 'almadad-heritage-shot',
    title: 'Al Madad & Sacred Calligraphy Art',
    category: 'Branding',
    client: 'Heritage Cultural Center',
    year: '2026',
    description: 'Bespoke spiritual Arabic calligraphic identity artwork rendered with traditional Thuluth and modern fluid strokes for cultural installations and festive prints.',
    tags: ['Arabic Calligraphy', 'Poster Art', 'Illustrator', 'Heritage'],
    gradient: 'from-emerald-950 via-stone-900 to-black',
    accent: '#10B981',
    mediaType: 'image',
    imageUrl: '/Works/logo/almadad.jpg',
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
