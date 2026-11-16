import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase.ts';
import {
  ShowcaseItem,
  SHOWCASE_ROW_1,
  SHOWCASE_ROW_2,
  normalizeShowcaseImagePath,
  saveProjectsToStorage,
  isVideoMediaUrl
} from '../data/showcaseData.ts';
import {
  ExperiencedTool,
  DEFAULT_TOOLS,
  saveToolsToStorage
} from '../data/toolsData.ts';
import {
  BlogPost,
  DEFAULT_BLOG_POSTS,
  saveBlogPostsToStorage
} from '../data/blogData.ts';
import {
  ContactConfig,
  DEFAULT_CONTACT_CONFIG,
  saveContactConfigToStorage
} from '../data/contactConfig.ts';
import {
  SeoStrategyData,
  DEFAULT_SEO_STRATEGY,
  saveSeoStrategyToStorage
} from '../data/seoStrategyConfig.ts';

const sanitizeId = (rawId: string): string => {
  const cleaned = rawId.replace(/[^a-zA-Z0-9_\-]/g, '-').slice(0, 120);
  return cleaned || `item-${Date.now()}`;
};

const clipStr = (val: unknown, maxLen: number): string => {
  if (typeof val !== 'string') return '';
  return val.trim().slice(0, maxLen);
};

const clipList = (arr: unknown, maxItems: number, maxItemLen = 120): string[] => {
  if (!Array.isArray(arr)) return [];
  return arr
    .filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
    .slice(0, maxItems)
    .map((v) => v.trim().slice(0, maxItemLen));
};

// Build canonical Firestore payload matching firestore.rules & firebase-blueprint.json strictly
const toShowcaseDoc = (item: ShowcaseItem, row: 1 | 2, sortOrder: number, uid: string) => {
  const id = sanitizeId(item.id || `proj-${Date.now()}`);
  const normImg = normalizeShowcaseImagePath(item.imageUrl || '');
  const normVid = normalizeShowcaseImagePath(item.videoUrl || '');
  const detectedVideo = item.mediaType === 'video' || isVideoMediaUrl(normVid) || isVideoMediaUrl(normImg);
  const finalVideoUrl = detectedVideo ? (normVid || (isVideoMediaUrl(normImg) ? normImg : '')) : '';
  const finalImageUrl = detectedVideo && isVideoMediaUrl(normImg) ? '' : normImg;

  return {
    id,
    title: clipStr(item.title || 'Untitled Project', 200) || 'Untitled Project',
    subtitle: clipStr(item.subtitle || '', 400),
    client: clipStr(item.client || '', 150),
    year: clipStr(item.year || '2026', 20),
    category: clipStr(item.category || 'Creative Design', 120) || 'Creative Design',
    githubUrl: clipStr(item.githubUrl || '', 500),
    badge: clipStr(item.badge || '', 80),
    accentColor: clipStr(item.accentColor || '#171717', 40),
    aspect: clipStr(item.aspect || (detectedVideo ? '9/16' : '4/5'), 30),
    dimensions: clipStr(item.dimensions || '', 120),
    mediaType: detectedVideo ? 'video' : 'image',
    imageUrl: clipStr(finalImageUrl, 900000),
    videoUrl: clipStr(finalVideoUrl, 900000),
    duration: clipStr(item.duration || '', 20),
    row: row === 2 ? 2 : 1,
    sortOrder: Math.max(0, Math.min(100000, Math.floor(sortOrder))),
    type: clipStr(item.type || 'custom', 40),
    isPublished: true,
    updatedByUid: uid,
    updatedAt: serverTimestamp()
  };
};

const fromShowcaseDoc = (data: Record<string, any>): ShowcaseItem & { sortOrder: number } => {
  return {
    id: String(data.id || ''),
    title: String(data.title || ''),
    subtitle: String(data.subtitle || ''),
    client: String(data.client || ''),
    year: String(data.year || '2026'),
    category: String(data.category || ''),
    githubUrl: String(data.githubUrl || ''),
    badge: data.badge ? String(data.badge) : undefined,
    accentColor: String(data.accentColor || '#171717'),
    aspect: String(data.aspect || '4/5'),
    dimensions: String(data.dimensions || ''),
    tools: [],
    description: '',
    keyFeatures: [],
    languages: [],
    mediaType: data.mediaType === 'video' ? 'video' : 'image',
    imageUrl: data.imageUrl ? String(data.imageUrl) : undefined,
    videoUrl: data.videoUrl ? String(data.videoUrl) : undefined,
    duration: data.duration ? String(data.duration) : undefined,
    row: data.row === 2 ? 2 : 1,
    type: data.type ? String(data.type) : 'custom',
    sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : 0
  };
};

const toToolDoc = (tool: ExperiencedTool, sortOrder: number, uid: string) => {
  const id = sanitizeId(tool.id || `tool-${Date.now()}`);
  return {
    id,
    name: clipStr(tool.name || 'Tool', 120) || 'Tool',
    category: clipStr(tool.category || 'Graphic & Vector', 80) || 'Graphic & Vector',
    level: clipStr(tool.level || 'Advanced', 40) || 'Advanced',
    proficiencyPercent: Math.max(0, Math.min(100, Number(tool.proficiencyPercent) || 90)),
    years: clipStr(tool.years || '3+ Years', 40) || '3+ Years',
    badge: clipStr(tool.badge || tool.name?.slice(0, 2) || 'TL', 20) || 'TL',
    color: clipStr(tool.color || '#171717', 30) || '#171717',
    bgColor: clipStr(tool.bgColor || '#171717', 30) || '#171717',
    description: clipStr(tool.description || '', 500),
    iconUrl: clipStr(tool.iconUrl || '', 500000),
    sortOrder: Math.max(0, Math.min(100000, Math.floor(sortOrder))),
    isPublished: true,
    updatedByUid: uid,
    updatedAt: serverTimestamp()
  };
};

const fromToolDoc = (data: Record<string, any>): ExperiencedTool & { sortOrder: number } => ({
  id: String(data.id || ''),
  name: String(data.name || ''),
  category: (data.category || 'Graphic & Vector') as ExperiencedTool['category'],
  level: String(data.level || 'Advanced'),
  proficiencyPercent: Number(data.proficiencyPercent ?? 90),
  years: String(data.years || '3+ Years'),
  badge: String(data.badge || ''),
  color: String(data.color || '#171717'),
  bgColor: String(data.bgColor || '#171717'),
  description: String(data.description || ''),
  iconUrl: data.iconUrl ? String(data.iconUrl) : undefined,
  sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : 0
});

const toBlogDoc = (post: BlogPost, sortOrder: number, uid: string) => {
  const id = sanitizeId(post.id || `blog-${Date.now()}`);
  return {
    id,
    slug: clipStr(post.slug || id, 200) || id,
    title: clipStr(post.title || 'Untitled Article', 250) || 'Untitled Article',
    seoTitle: clipStr(post.seoTitle || post.title || '', 200),
    excerpt: clipStr(post.excerpt || '', 1000),
    content: clipStr(post.content || '## Overview', 50000) || '## Overview',
    category: clipStr(post.category || 'Graphic Design', 80) || 'Graphic Design',
    readTime: clipStr(post.readTime || '5 min read', 40) || '5 min read',
    publishedDate: clipStr(post.publishedDate || '2026', 60) || '2026',
    authorName: clipStr(post.author?.name || 'Typixel', 120) || 'Typixel',
    authorRole: clipStr(post.author?.role || 'Creative Design Studio', 120) || 'Creative Design Studio',
    authorAvatar: clipStr(post.author?.avatar || '/logos/typixel.jpg', 1000),
    tags: clipList(post.tags, 20),
    seoKeywords: clipList(post.seoKeywords, 30),
    views: Math.max(0, Math.min(100000000, Math.floor(Number(post.views) || 0))),
    featured: Boolean(post.featured),
    sortOrder: Math.max(0, Math.min(100000, Math.floor(sortOrder))),
    isPublished: true,
    updatedByUid: uid,
    updatedAt: serverTimestamp()
  };
};

const fromBlogDoc = (data: Record<string, any>): BlogPost & { sortOrder: number } => ({
  id: String(data.id || ''),
  slug: String(data.slug || ''),
  title: String(data.title || ''),
  seoTitle: data.seoTitle ? String(data.seoTitle) : undefined,
  excerpt: String(data.excerpt || ''),
  content: String(data.content || ''),
  category: (data.category || 'Graphic Design') as BlogPost['category'],
  readTime: String(data.readTime || '5 min read'),
  publishedDate: String(data.publishedDate || '2026'),
  author: {
    name: String(data.authorName || 'Typixel'),
    role: String(data.authorRole || 'Creative Design Studio'),
    avatar: String(data.authorAvatar || '/logos/typixel.jpg')
  },
  tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
  seoKeywords: Array.isArray(data.seoKeywords) ? data.seoKeywords.map(String) : [],
  views: Number(data.views ?? 0),
  featured: Boolean(data.featured),
  sortOrder: typeof data.sortOrder === 'number' ? data.sortOrder : 0
});

const toSiteSettingsDoc = (contact: ContactConfig, seo: SeoStrategyData, uid: string) => ({
  contactEmail: clipStr(contact.email || DEFAULT_CONTACT_CONFIG.email, 150) || DEFAULT_CONTACT_CONFIG.email,
  whatsappNumber: clipStr((contact.whatsappNumber || DEFAULT_CONTACT_CONFIG.whatsappNumber).replace(/[^0-9]/g, ''), 30) || DEFAULT_CONTACT_CONFIG.whatsappNumber,
  primaryTarget: clipStr(seo.primaryTarget, 200),
  locationFocus: clipStr(seo.locationFocus, 200),
  audience: clipStr(seo.audience, 200),
  goal: clipStr(seo.goal, 200),
  domain: clipStr(seo.domain, 150),
  blogTitle: clipStr(seo.blogTitle, 250),
  seoTitle: clipStr(seo.seoTitle, 200),
  urlSlug: clipStr(seo.urlSlug, 200),
  metaDescription: clipStr(seo.metaDescription, 500),
  keywords: clipList(seo.keywords, 50),
  isPublished: true,
  updatedByUid: uid,
  updatedAt: serverTimestamp()
});

// ================= REAL-TIME SUBSCRIPTIONS FOR ALL VISITORS =================

export const subscribeShowcaseItems = (
  onData: (row1: ShowcaseItem[], row2: ShowcaseItem[]) => void
) => {
  const path = 'showcaseItems';
  const q = query(collection(db, path), where('isPublished', '==', true));
  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) {
        // Cloud not seeded yet; keep defaults visible
        return;
      }
      const all = snapshot.docs
        .map((d) => fromShowcaseDoc(d.data()))
        .sort((a, b) => a.sortOrder - b.sortOrder);

      const r1 = all.filter((i) => i.row !== 2);
      const r2 = all.filter((i) => i.row === 2);
      saveProjectsToStorage(r1, r2);
      onData(r1, r2);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
};

export const subscribeTools = (onData: (tools: ExperiencedTool[]) => void) => {
  const path = 'tools';
  const q = query(collection(db, path), where('isPublished', '==', true));
  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) return;
      const list = snapshot.docs
        .map((d) => fromToolDoc(d.data()))
        .sort((a, b) => a.sortOrder - b.sortOrder);
      saveToolsToStorage(list);
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
};

export const subscribeBlogPosts = (onData: (posts: BlogPost[]) => void) => {
  const path = 'blogPosts';
  const q = query(collection(db, path), where('isPublished', '==', true));
  return onSnapshot(
    q,
    (snapshot) => {
      if (snapshot.empty) return;
      const list = snapshot.docs
        .map((d) => fromBlogDoc(d.data()))
        .sort((a, b) => a.sortOrder - b.sortOrder);
      saveBlogPostsToStorage(list);
      onData(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  );
};

export const subscribePublicSiteSettings = (
  onData: (contact: ContactConfig, seo: SeoStrategyData) => void
) => {
  const path = 'siteConfig/public';
  return onSnapshot(
    doc(db, 'siteConfig', 'public'),
    (snap) => {
      if (!snap.exists()) return;
      const data = snap.data();
      const contact: ContactConfig = {
        email: String(data.contactEmail || DEFAULT_CONTACT_CONFIG.email),
        whatsappNumber: String(data.whatsappNumber || DEFAULT_CONTACT_CONFIG.whatsappNumber)
      };
      const seo: SeoStrategyData = {
        primaryTarget: String(data.primaryTarget || DEFAULT_SEO_STRATEGY.primaryTarget),
        locationFocus: String(data.locationFocus || DEFAULT_SEO_STRATEGY.locationFocus),
        audience: String(data.audience || DEFAULT_SEO_STRATEGY.audience),
        goal: String(data.goal || DEFAULT_SEO_STRATEGY.goal),
        domain: String(data.domain || DEFAULT_SEO_STRATEGY.domain),
        blogTitle: String(data.blogTitle || DEFAULT_SEO_STRATEGY.blogTitle),
        seoTitle: String(data.seoTitle || DEFAULT_SEO_STRATEGY.seoTitle),
        urlSlug: String(data.urlSlug || DEFAULT_SEO_STRATEGY.urlSlug),
        metaDescription: String(data.metaDescription || DEFAULT_SEO_STRATEGY.metaDescription),
        keywords: Array.isArray(data.keywords) ? data.keywords.map(String) : DEFAULT_SEO_STRATEGY.keywords
      };
      saveContactConfigToStorage(contact.email, contact.whatsappNumber);
      saveSeoStrategyToStorage(seo);
      onData(contact, seo);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
};

// ================= ADMIN CLOUD SYNC OPERATIONS =================

export const ensureAdminRecordAndSeed = async (
  currentRow1: ShowcaseItem[],
  currentRow2: ShowcaseItem[],
  currentTools: ExperiencedTool[],
  currentBlogPosts: BlogPost[],
  currentContact: ContactConfig,
  currentSeo: SeoStrategyData
): Promise<void> => {
  const user = auth.currentUser;
  if (!user) return;
  const uid = user.uid;

  // Ensure admin account record exists
  try {
    const adminRef = doc(db, 'admins', uid);
    const adminSnap = await getDoc(adminRef);
    if (!adminSnap.exists()) {
      await setDoc(adminRef, {
        uid,
        email: (user.email || '').toLowerCase(),
        role: 'admin',
        createdAt: serverTimestamp()
      });
    }
  } catch (error) {
    // Non-fatal if bootstrapped email rule already grants access
    console.warn('Admin record sync notice:', error);
  }

  // Check if showcaseItems has been seeded yet; if empty, seed defaults/local items once
  try {
    const showcaseSnap = await getDocs(query(collection(db, 'showcaseItems'), where('isPublished', '==', true)));
    if (showcaseSnap.empty) {
      const seedR1 = currentRow1.length > 0 ? currentRow1 : SHOWCASE_ROW_1;
      const seedR2 = currentRow2.length > 0 ? currentRow2 : SHOWCASE_ROW_2;
      const batch = writeBatch(db);
      seedR1.forEach((item, idx) => {
        const payload = toShowcaseDoc(item, 1, idx, uid);
        batch.set(doc(db, 'showcaseItems', payload.id), payload);
      });
      seedR2.forEach((item, idx) => {
        const payload = toShowcaseDoc(item, 2, idx, uid);
        batch.set(doc(db, 'showcaseItems', payload.id), payload);
      });
      await batch.commit();
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'showcaseItems');
  }

  // Seed tools if empty
  try {
    const toolsSnap = await getDocs(query(collection(db, 'tools'), where('isPublished', '==', true)));
    if (toolsSnap.empty) {
      const seedTools = currentTools.length > 0 ? currentTools : DEFAULT_TOOLS;
      const batch = writeBatch(db);
      seedTools.forEach((tool, idx) => {
        const payload = toToolDoc(tool, idx, uid);
        batch.set(doc(db, 'tools', payload.id), payload);
      });
      await batch.commit();
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'tools');
  }

  // Seed blogPosts if empty
  try {
    const blogSnap = await getDocs(query(collection(db, 'blogPosts'), where('isPublished', '==', true)));
    if (blogSnap.empty) {
      const seedPosts = currentBlogPosts.length > 0 ? currentBlogPosts : DEFAULT_BLOG_POSTS;
      const batch = writeBatch(db);
      seedPosts.forEach((post, idx) => {
        const payload = toBlogDoc(post, idx, uid);
        batch.set(doc(db, 'blogPosts', payload.id), payload);
      });
      await batch.commit();
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'blogPosts');
  }

  // Seed siteConfig/public if absent
  try {
    const cfgRef = doc(db, 'siteConfig', 'public');
    const cfgSnap = await getDoc(cfgRef);
    if (!cfgSnap.exists()) {
      await setDoc(cfgRef, toSiteSettingsDoc(currentContact, currentSeo, uid));
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'siteConfig/public');
  }
};

export const saveShowcaseOrderToCloud = async (row1: ShowcaseItem[], row2: ShowcaseItem[]): Promise<void> => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Admin authentication required to save changes globally.');

  try {
    const batch = writeBatch(db);
    row1.forEach((item, idx) => {
      const payload = toShowcaseDoc(item, 1, idx, uid);
      batch.set(doc(db, 'showcaseItems', payload.id), payload);
    });
    row2.forEach((item, idx) => {
      const payload = toShowcaseDoc(item, 2, idx, uid);
      batch.set(doc(db, 'showcaseItems', payload.id), payload);
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'showcaseItems');
  }
};

export const upsertShowcaseItemToCloud = async (
  item: ShowcaseItem,
  row: 1 | 2,
  sortOrder: number
): Promise<void> => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Admin authentication required to save changes globally.');

  const payload = toShowcaseDoc(item, row, sortOrder, uid);
  const path = `showcaseItems/${payload.id}`;
  try {
    await setDoc(doc(db, 'showcaseItems', payload.id), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const deleteShowcaseItemFromCloud = async (id: string): Promise<void> => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Admin authentication required to delete items globally.');
  const safeId = sanitizeId(id);
  const path = `showcaseItems/${safeId}`;
  try {
    await deleteDoc(doc(db, 'showcaseItems', safeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

export const upsertToolToCloud = async (tool: ExperiencedTool, sortOrder: number): Promise<void> => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Admin authentication required to save changes globally.');
  const payload = toToolDoc(tool, sortOrder, uid);
  try {
    await setDoc(doc(db, 'tools', payload.id), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `tools/${payload.id}`);
  }
};

export const deleteToolFromCloud = async (id: string): Promise<void> => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Admin authentication required to delete tools globally.');
  const safeId = sanitizeId(id);
  try {
    await deleteDoc(doc(db, 'tools', safeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `tools/${safeId}`);
  }
};

export const upsertBlogPostToCloud = async (post: BlogPost, sortOrder: number): Promise<void> => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Admin authentication required to publish blog posts globally.');
  const payload = toBlogDoc(post, sortOrder, uid);
  try {
    await setDoc(doc(db, 'blogPosts', payload.id), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `blogPosts/${payload.id}`);
  }
};

export const deleteBlogPostFromCloud = async (id: string): Promise<void> => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Admin authentication required to delete blog posts globally.');
  const safeId = sanitizeId(id);
  try {
    await deleteDoc(doc(db, 'blogPosts', safeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `blogPosts/${safeId}`);
  }
};

export const saveSiteSettingsToCloud = async (
  contact: ContactConfig,
  seo: SeoStrategyData
): Promise<void> => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Admin authentication required to update site settings globally.');
  const payload = toSiteSettingsDoc(contact, seo, uid);
  try {
    await setDoc(doc(db, 'siteConfig', 'public'), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'siteConfig/public');
  }
};
