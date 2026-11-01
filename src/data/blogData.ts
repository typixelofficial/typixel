export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Graphic Design' | 'Video & Motion' | 'UI/UX & Figma' | 'Design & Code' | 'Branding';
  readTime: string;
  publishedDate: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  tags: string[];
  seoKeywords: string[];
  views: number;
  featured?: boolean;
}

const BLOG_STORAGE_KEY = 'kawsar_portfolio_blog_posts_v1';

export const DEFAULT_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'graphic-design-trends-2026-minimalist-typography-bold-layouts',
    title: 'Top Graphic Design Trends for 2026: Bold Typography, Neo-Brutalism & Kinetic Visuals',
    excerpt: 'An in-depth analysis of high-performing visual design trends driving brand recognition, editorial posters, and digital campaigns in 2025 and 2026.',
    category: 'Graphic Design',
    readTime: '6 min read',
    publishedDate: 'Oct 14, 2025',
    author: {
      name: 'Typixel',
      role: 'Lead Visual & Product Designer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    tags: ['Graphic Design', 'Poster Design', 'Typography', 'Trends 2026', 'Visual Identity'],
    seoKeywords: [
      'graphic design trends 2026',
      'minimalist typography poster design',
      'brand identity design trends',
      'high converting graphic design',
      'modern poster layout inspiration',
      'freelance graphic designer portfolio'
    ],
    views: 1840,
    featured: true,
    content: `## The Evolution of Visual Design in 2026

Modern brand identity and poster composition have entered an era of refined boldness. After years of generic corporate minimalism, visual designers and brands are rediscovering the emotional power of expressive typography, asymmetric grids, and tactile textures.

### 1. High-Contrast Monospaced and Sans-Serif Hybrids
Leading international design studios are blending crisp grotesque sans-serifs with geometric monospaced accents. This aesthetic bridges technological precision with editorial elegance.

* **Hierarchy Mastery:** Anchor the viewer's eye with an oversized 80pt+ focal headline before cascading into structured 12pt metadata blocks.
* **Negative Space as Tension:** Clean whitespace isn't empty space—it directs the viewer's gaze directly toward key calls to action.

### 2. Physical Print Texture in Pure Digital Canvases
Even when projects live 100% online on Instagram, Behance, and Webflow, incorporating subtle grain, offset ink bleed, and paper tooth creates an organic warmth that synthetic AI generations lack.

### 3. Kinetic Layouts: Designing for Motion First
Posters are no longer static one-sheets. In tools like Adobe After Effects and Premiere Pro, static poster compositions are broken down into layered SVG/Photoshop assets and animated into hypnotic 9:16 vertical reels.

> "Good design is obvious. Great design is transparent and unforgettable." — Joe Sparano

### Actionable Takeaway for Designers
Audit your current portfolio pieces. Add micro-details like coordinates, catalog numbering, and custom bilingual type lockups (such as English with Arabic or Malayalam) to give your posters an international, high-value signature.`
  },
  {
    id: 'post-2',
    slug: 'figma-design-systems-auto-layout-component-tokens',
    title: 'Building Scalable UI Design Systems in Figma: Auto-Layout 5.0 and Component Architecture',
    excerpt: 'How to structure design tokens, fluid layouts, and atomic components in Figma so developers can build pixel-perfect interfaces in record time.',
    category: 'UI/UX & Figma',
    readTime: '8 min read',
    publishedDate: 'Sep 28, 2025',
    author: {
      name: 'Typixel',
      role: 'Product Designer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    tags: ['Figma', 'UI/UX', 'Design Systems', 'Auto Layout', 'Dev Handoff'],
    seoKeywords: [
      'figma design system best practices',
      'figma auto layout tutorial 2026',
      'ui ux component architecture',
      'figma tokens to tailwind css',
      'product designer portfolio figma'
    ],
    views: 2450,
    featured: false,
    content: `## Why Atomic Design Systems Supercharge Product Velocity

A design system is not just a UI kit; it is the single source of truth between product thinking and engineering execution. When structured properly in Figma, your component library reduces redundant design cycles by up to 60%.

### Core Foundations of Scalable Figma Systems:
1. **Semantic Color Variables:** Never hardcode hex values like \`#171717\` directly into buttons. Instead, map \`background/surface-primary\`, \`text/body-muted\`, and \`border/subtle\`.
2. **True Fluid Typography:** Implement modular type scales (Minor Third or Major Second) that automatically adjust across mobile (375px), tablet (768px), and desktop (1440px) breakpoints.
3. **Auto-Layout Without Nesting Overkill:** Combine horizontal and vertical auto-layout frames with \`Fill Container\` and \`Hug Contents\` to maintain fluid responsiveness.

### Closing the Gap with Front-End Code
Because I design with a working knowledge of HTML, CSS Grid, and Tailwind CSS, every frame in my Figma files matches flexbox and CSS box model behaviors. This eliminates developer friction during sprints.`
  },
  {
    id: 'post-3',
    slug: 'adobe-photoshop-illustrator-indesign-complete-workflow',
    title: 'Photoshop vs Illustrator vs InDesign: The Definitive Adobe Creative Cloud Workflow',
    excerpt: 'Stop using Photoshop for everything. Discover the exact tool matrix for vector branding, raster manipulation, and multi-page editorial publications.',
    category: 'Graphic Design',
    readTime: '5 min read',
    publishedDate: 'Sep 12, 2025',
    author: {
      name: 'Typixel',
      role: 'Lead Visual Designer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    tags: ['Photoshop', 'Illustrator', 'InDesign', 'Adobe Suite', 'Print Production'],
    seoKeywords: [
      'photoshop vs illustrator vs indesign',
      'adobe creative suite graphic design workflow',
      'vector logo design illustrator tips',
      'indesign editorial layout standards',
      'professional print prepress guide'
    ],
    views: 3120,
    featured: false,
    content: `## Picking the Right Adobe Tool for the Job

Many emerging graphic designers default to Adobe Photoshop for all their tasks. While Photoshop is unmatched for raster pixel manipulation, using it for vector logos or 32-page catalogs leads to bloated file sizes and loss of fidelity.

### 1. Adobe Illustrator (Ai): The Vector Sovereign
* **When to use:** Logos, vector icons, custom Arabic/Malayalam calligraphy vectorization, scalable branding assets, packaging die-lines.
* **Why:** Infinite scalability with zero resolution loss. Clean SVG exports for web and mobile.

### 2. Adobe Photoshop (Ps): The Raster Master
* **When to use:** Poster visual effects, photo compositing, color grading, frequency separation retouching, mockups.
* **Why:** Deep layer blending modes, smart filters, adjustment curves, and precision mask controls.

### 3. Adobe InDesign (Id): The Publishing Powerhouse
* **When to use:** Multi-page brochures, annual reports, pitch decks, magazine issues, high-volume book formatting.
* **Why:** Master pages, automated page numbering, paragraph styles, optical margin alignment, and pre-flight print verification.`
  },
  {
    id: 'post-4',
    slug: 'premiere-pro-after-effects-davinci-video-editing-guide',
    title: 'Premiere Pro, After Effects & DaVinci Resolve: Producing High-Retention Video Content',
    excerpt: 'Mastering the motion design pipeline: from timeline rough cuts to 3D camera tracking, typography animations, and cinema-grade color grading.',
    category: 'Video & Motion',
    readTime: '7 min read',
    publishedDate: 'Aug 30, 2025',
    author: {
      name: 'Typixel',
      role: 'Motion & Visual Designer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    tags: ['Premiere Pro', 'After Effects', 'DaVinci Resolve', 'CapCut', 'Video Editing'],
    seoKeywords: [
      'premiere pro video editing workflow 2026',
      'after effects motion graphics typography',
      'davinci resolve color grading lut workflow',
      'viral reels video editing capcut tips',
      'freelance video editor portfolio'
    ],
    views: 2890,
    featured: false,
    content: `## The Modern Triad of Video Production

Today's audiences demand cinematic visual polish even on 30-second mobile reels. The secret to fast turnarounds without sacrificing production value lies in a coordinated 3-tool pipeline:

1. **Premiere Pro:** Assembly cut, story pacing, beat-matching, and audio dialogue clean-up.
2. **After Effects:** Custom motion graphics, tracking markers, animated lower-thirds, and kinetic typography.
3. **DaVinci Resolve:** World-class color science, ACES color management, shot matching, and skin tone isolation.

### Why CapCut and Canva Fit Into Professional Pipelines
While high-end cinema tools deliver maximum fidelity, tools like CapCut and Canva allow creators to rapidly prototype viral formats, auto-generate animated captions, and produce client-ready social cards in minutes.`
  },
  {
    id: 'post-5',
    slug: 'bridging-design-and-code-html-css-javascript-for-designers',
    title: 'Why Hybrid Designers Win: Bridging Figma UI with Semantic HTML, CSS & JavaScript',
    excerpt: 'How learning foundational front-end web development makes you 10x more effective as a visual and digital product designer.',
    category: 'Design & Code',
    readTime: '6 min read',
    publishedDate: 'Aug 15, 2025',
    author: {
      name: 'Typixel',
      role: 'Design Engineer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    tags: ['HTML', 'CSS', 'JavaScript', 'Tailwind CSS', 'Design Engineering'],
    seoKeywords: [
      'html css javascript for ui designers',
      'design engineer portfolio tips',
      'figma to clean tailwind css code',
      'full stack creative developer skills',
      'modern frontend web design 2026'
    ],
    views: 3410,
    featured: false,
    content: `## The Era of the Design Engineer

The boundary between "the person who makes the mockup" and "the person who ships the code" is disappearing. When a designer understands CSS Flexbox, Grid, container queries, and DOM rendering, the entire team ships faster, cleaner digital products.

### Real Benefits of Knowing Code:
* **Realistic Constraints:** You design states that are actually performant and responsive instead of impossible static screens.
* **Micro-Interactions that Work:** Instead of vague prototyping handoffs, you understand easing curves, transition durations, and state transitions.
* **SEO & Accessibility Awareness:** Semantic HTML5 (\`<main>\`, \`<article>\`, \`<section>\`, \`<header>\`) ensures that your visual work is discoverable by search engines and screen readers alike.`
  }
];

export const getStoredBlogPosts = (): BlogPost[] => {
  try {
    const raw = localStorage.getItem(BLOG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to read blog posts from storage:', err);
  }
  return DEFAULT_BLOG_POSTS;
};

export const saveBlogPostsToStorage = (posts: BlogPost[]): void => {
  try {
    localStorage.setItem(BLOG_STORAGE_KEY, JSON.stringify(posts));
  } catch (err) {
    console.error('Failed to save blog posts to storage:', err);
  }
};

export const resetBlogPostsToDefault = (): BlogPost[] => {
  saveBlogPostsToStorage(DEFAULT_BLOG_POSTS);
  return DEFAULT_BLOG_POSTS;
};
