export interface ExperiencedTool {
  id: string;
  name: string;
  category: 'Graphic & Vector' | 'Video & Motion' | 'Web & Code' | 'Product & UI' | 'Creative Productivity';
  level: string; // e.g. 'Mastery (99%)', 'Advanced (95%)', 'Expert (92%)'
  proficiencyPercent: number; // 0-100
  years: string; // e.g. '3+ Years'
  badge: string; // Short code e.g. 'Ps', 'Ai', 'Id', 'Pr', 'Ae', 'Dv', 'Cv', 'Cc', 'HTML', 'CSS', 'JS', 'Fg'
  color: string; // Brand accent hex
  bgColor: string; // Soft background hex
  description: string;
  iconUrl?: string; // Custom PNG, SVG, or image link
}

const TOOLS_STORAGE_KEY = 'typixel_experienced_tools_v4';

// Reordered so HTML and CSS are separated and never adjacent
export const DEFAULT_TOOLS: ExperiencedTool[] = [
  {
    id: 'tool-photoshop',
    name: 'Adobe Photoshop',
    category: 'Graphic & Vector',
    level: 'Mastery',
    proficiencyPercent: 98,
    years: '3+ Years',
    badge: 'Ps',
    color: '#31A8FF',
    bgColor: '#001E36',
    description: 'High-end photo manipulation, raster graphics, poster composition, color correction & digital artwork.'
  },
  {
    id: 'tool-html',
    name: 'HTML',
    category: 'Web & Code',
    level: 'Advanced',
    proficiencyPercent: 94,
    years: '3+ Years',
    badge: 'HTML',
    color: '#E34F26',
    bgColor: '#3E1005',
    description: 'Semantic markup, accessibility (a11y), clean DOM structure, structured data & SEO metadata schemas.'
  },
  {
    id: 'tool-illustrator',
    name: 'Adobe Illustrator',
    category: 'Graphic & Vector',
    level: 'Mastery',
    proficiencyPercent: 96,
    years: '3+ Years',
    badge: 'Ai',
    color: '#FF9A00',
    bgColor: '#330000',
    description: 'Vector brand marks, typography systems, geometric layouts, iconography, packaging & print collateral.'
  },
  {
    id: 'tool-davinci',
    name: 'DaVinci Resolve',
    category: 'Video & Motion',
    level: 'Proficient',
    proficiencyPercent: 88,
    years: '2+ Years',
    badge: 'Dv',
    color: '#E04E39',
    bgColor: '#1E1B2E',
    description: 'Cinematic color grading, node-based color science, Fairlight audio sweetening & studio deliverables.'
  },
  {
    id: 'tool-indesign',
    name: 'Adobe InDesign',
    category: 'Graphic & Vector',
    level: 'Advanced',
    proficiencyPercent: 92,
    years: '3+ Years',
    badge: 'Id',
    color: '#FF3366',
    bgColor: '#49021F',
    description: 'Editorial layouts, corporate pitch decks, multi-page brochures, magazine spreads & publication design.'
  },
  {
    id: 'tool-css',
    name: 'CSS',
    category: 'Web & Code',
    level: 'Mastery',
    proficiencyPercent: 95,
    years: '3+ Years',
    badge: 'CSS',
    color: '#1572B6',
    bgColor: '#042742',
    description: 'Modern CSS3, responsive Flexbox/Grid, Tailwind CSS architecture, fluid typography & keyframe animations.'
  },
  {
    id: 'tool-premiere',
    name: 'Adobe Premiere Pro',
    category: 'Video & Motion',
    level: 'Advanced',
    proficiencyPercent: 94,
    years: '3+ Years',
    badge: 'Pr',
    color: '#EA77FF',
    bgColor: '#00005B',
    description: 'Commercial video editing, dynamic cuts, audio synchronization, timeline pacing & social media reels.'
  },
  {
    id: 'tool-figma',
    name: 'Figma',
    category: 'Product & UI',
    level: 'Mastery',
    proficiencyPercent: 98,
    years: '3+ Years',
    badge: 'Fg',
    color: '#F24E1E',
    bgColor: '#1E1E1E',
    description: 'Design systems, auto-layout architectures, high-fidelity UI prototypes, component tokens & dev handoff.'
  },
  {
    id: 'tool-canva',
    name: 'Canva',
    category: 'Creative Productivity',
    level: 'Mastery',
    proficiencyPercent: 99,
    years: '3+ Years',
    badge: 'Cv',
    color: '#00C4CC',
    bgColor: '#0B2027',
    description: 'Rapid marketing collateral, client-editable brand templates, presentations & high-velocity social cards.'
  },
  {
    id: 'tool-js',
    name: 'JavaScript',
    category: 'Web & Code',
    level: 'Advanced',
    proficiencyPercent: 89,
    years: '3+ Years',
    badge: 'JS',
    color: '#F7DF1E',
    bgColor: '#323330',
    description: 'ES6+ interactivity, dynamic animations, DOM manipulation, client-side logic & interactive web apps.'
  },
  {
    id: 'tool-aftereffects',
    name: 'Adobe After Effects',
    category: 'Video & Motion',
    level: 'Advanced',
    proficiencyPercent: 90,
    years: '3+ Years',
    badge: 'Ae',
    color: '#9999FF',
    bgColor: '#00005B',
    description: 'Motion design, animated typography, logo stings, visual effects, poster animations & micro-interactions.'
  },
  {
    id: 'tool-capcut',
    name: 'CapCut',
    category: 'Video & Motion',
    level: 'Mastery',
    proficiencyPercent: 95,
    years: '3+ Years',
    badge: 'Cc',
    color: '#00E5FF',
    bgColor: '#111827',
    description: 'High-engagement viral TikTok/Reels edits, trendy transitions, automated captions & mobile format mastery.'
  }
];

export const getStoredTools = (): ExperiencedTool[] => {
  try {
    const raw = localStorage.getItem(TOOLS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Enforce that HTML and CSS are never directly adjacent
        const htmlIdx = parsed.findIndex(t => t.name.toLowerCase().includes('html'));
        const cssIdx = parsed.findIndex(t => t.name.toLowerCase().includes('css'));
        if (htmlIdx !== -1 && cssIdx !== -1 && Math.abs(htmlIdx - cssIdx) <= 1) {
          const withoutCss = parsed.filter((_, i) => i !== cssIdx);
          const insertIdx = (htmlIdx + Math.floor(withoutCss.length / 2)) % withoutCss.length;
          withoutCss.splice(insertIdx, 0, parsed[cssIdx]);
          saveToolsToStorage(withoutCss);
          return withoutCss;
        }
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to load experienced tools from storage:', err);
  }
  return DEFAULT_TOOLS;
};

export const saveToolsToStorage = (tools: ExperiencedTool[]): void => {
  try {
    localStorage.setItem(TOOLS_STORAGE_KEY, JSON.stringify(tools));
  } catch (err) {
    console.error('Failed to save experienced tools to storage:', err);
  }
};

export const resetToolsToDefault = (): ExperiencedTool[] => {
  saveToolsToStorage(DEFAULT_TOOLS);
  return DEFAULT_TOOLS;
};
