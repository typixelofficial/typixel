import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Plus,
  Trash2,
  Layers,
  CheckCircle,
  LogOut,
  Mail,
  Save,
  Wrench,
  BookOpen,
  Pencil,
  Globe,
  MapPin,
  Target,
  Users,
  Compass,
  Copy,
  Check,
  Download,
  Upload,
  Database,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';
import {
  ShowcaseItem,
  SHOWCASE_PRESET_IMAGES,
  normalizeShowcaseImagePath,
  saveProjectsToStorage,
  isVideoMediaUrl
} from '../data/showcaseData.ts';
import { ContactConfig, saveContactConfigToStorage } from '../data/contactConfig.ts';
import { ExperiencedTool, DEFAULT_TOOLS, saveToolsToStorage } from '../data/toolsData.ts';
import { BlogPost, DEFAULT_BLOG_POSTS, saveBlogPostsToStorage } from '../data/blogData.ts';
import {
  SeoStrategyData,
  getStoredSeoStrategy,
  saveSeoStrategyToStorage
} from '../data/seoStrategyConfig.ts';
import { AppLogo } from './AppLogo.tsx';
import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { auth, googleProvider, isAuthorizedAdminEmail } from '../firebase.ts';
import {
  ensureAdminRecordAndSeed,
  upsertShowcaseItemToCloud,
  deleteShowcaseItemFromCloud,
  saveShowcaseOrderToCloud,
  upsertToolToCloud,
  deleteToolFromCloud,
  upsertBlogPostToCloud,
  deleteBlogPostFromCloud,
  saveSiteSettingsToCloud
} from '../services/portfolioSyncService.ts';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  row1Projects: ShowcaseItem[];
  row2Projects: ShowcaseItem[];
  onProjectsUpdated: (row1: ShowcaseItem[], row2: ShowcaseItem[]) => void;
  contactConfig: ContactConfig;
  onContactConfigUpdated: (config: ContactConfig) => void;
  tools?: ExperiencedTool[];
  onToolsUpdated?: (tools: ExperiencedTool[]) => void;
  blogPosts?: BlogPost[];
  onBlogPostsUpdated?: (posts: BlogPost[]) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  row1Projects,
  row2Projects,
  onProjectsUpdated,
  contactConfig,
  onContactConfigUpdated,
  tools = DEFAULT_TOOLS,
  onToolsUpdated,
  blogPosts = DEFAULT_BLOG_POSTS,
  onBlogPostsUpdated
}) => {
  const [authUser, setAuthUser] = useState<User | null>(() => auth.currentUser);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);
  const [hasSeededCloud, setHasSeededCloud] = useState<boolean>(false);

  const isAuthenticated = Boolean(authUser && isAuthorizedAdminEmail(authUser.email));

  const [loginError, setLoginError] = useState('');

  // Admin Dashboard Tabs & Toast (includes SEO Control & Backup)
  type AdminTab = 'seocontrol' | 'add' | 'manage' | 'tools' | 'blog' | 'settings' | 'backup';
  const [activeTab, setActiveTab] = useState<AdminTab>('seocontrol');
  const [successToast, setSuccessToast] = useState('');
  const [cloudErrorToast, setCloudErrorToast] = useState('');

  // Subscribe to Firebase Google Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setAuthUser(user);
      if (user && !isAuthorizedAdminEmail(user.email)) {
        setLoginError(
          `Signed in as ${user.email || 'unknown account'}, which is not authorized for typixel admincontrol. Please sign in with hashimtypixel@gmail.com.`
        );
      } else {
        setLoginError('');
      }
    });
    return () => unsub();
  }, []);

  // Ensure Firestore collections are seeded when authorized Admin enters Control Room
  useEffect(() => {
    if (isOpen && isAuthenticated && !hasSeededCloud) {
      setHasSeededCloud(true);
      ensureAdminRecordAndSeed(
        row1Projects,
        row2Projects,
        tools,
        blogPosts,
        contactConfig,
        getStoredSeoStrategy()
      ).catch((err) => {
        console.error('Initial cloud seed notice:', err);
      });
    }
  }, [isOpen, isAuthenticated, hasSeededCloud]);

  // SEO Publishing Strategy & Metadata state
  const [seoStrategy, setSeoStrategy] = useState<SeoStrategyData>(() => getStoredSeoStrategy());
  const [copiedSeoField, setCopiedSeoField] = useState<string | null>(null);
  const [backupRestoreError, setBackupRestoreError] = useState('');

  // Form state for adding new project (Only fields showing on website)
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newCategory, setNewCategory] = useState('Event Branding & Poster');
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [newBadge, setNewBadge] = useState('');
  const [newRow, setNewRow] = useState<1 | 2>(1);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newVideoPosterUrl, setNewVideoPosterUrl] = useState('');
  const [newUploadError, setNewUploadError] = useState('');
  const [projectMediaMode, setProjectMediaMode] = useState<'preset' | 'upload' | 'link'>('preset');

  // Form state for editing existing showcase project
  const [editingProject, setEditingProject] = useState<ShowcaseItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editCategory, setEditCategory] = useState('Event Branding & Poster');
  const [editCustomCategory, setEditCustomCategory] = useState('');
  const [editBadge, setEditBadge] = useState('');
  const [editRow, setEditRow] = useState<1 | 2>(1);
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editVideoPosterUrl, setEditVideoPosterUrl] = useState('');
  const [editUploadError, setEditUploadError] = useState('');
  const [editMediaMode, setEditMediaMode] = useState<'preset' | 'upload' | 'link'>('link');

  // Form state for adding/editing Experienced Tools
  const [newToolName, setNewToolName] = useState('');
  const [newToolCategory, setNewToolCategory] = useState<'Graphic & Vector' | 'Video & Motion' | 'Web & Code' | 'Product & UI'>('Graphic & Vector');
  const [newToolLevel, setNewToolLevel] = useState('Mastery');
  const [newToolProficiency, setNewToolProficiency] = useState(95);
  const [newToolYears, setNewToolYears] = useState('3+ Years');
  const [newToolBadge, setNewToolBadge] = useState('');
  const [newToolDescription, setNewToolDescription] = useState('');
  const [newToolIconUrl, setNewToolIconUrl] = useState('');
  const [toolIconMode, setToolIconMode] = useState<'upload' | 'link'>('upload');

  // Form state for adding/editing Blog Posts
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogCategory, setNewBlogCategory] = useState<'Graphic Design' | 'Video & Motion' | 'UI/UX & Figma' | 'Design & Code' | 'Branding'>('Graphic Design');
  const [newBlogReadTime, setNewBlogReadTime] = useState('5 min read');
  const [newBlogExcerpt, setNewBlogExcerpt] = useState('');
  const [newBlogContent, setNewBlogContent] = useState('');
  const [newBlogTags, setNewBlogTags] = useState('Graphic Design, Adobe Photoshop, Typography');
  const [newBlogKeywords, setNewBlogKeywords] = useState('graphic design trends 2026, photoshop manipulation, viral reels');

  // EmailJS & Contact Settings Form
  const [settingsEmail, setSettingsEmail] = useState(contactConfig.email);
  const [settingsWhatsApp, setSettingsWhatsApp] = useState(contactConfig.whatsappNumber);
  const [emailJsServiceId, setEmailJsServiceId] = useState(() => localStorage.getItem('kawsar_emailjs_service_id') || 'service_portfolio');
  const [emailJsTemplateId, setEmailJsTemplateId] = useState(() => localStorage.getItem('kawsar_emailjs_template_id') || 'template_inquiry');
  const [emailJsPublicKey, setEmailJsPublicKey] = useState(() => localStorage.getItem('kawsar_emailjs_public_key') || '');

  useEffect(() => {
    setSettingsEmail(contactConfig.email);
    setSettingsWhatsApp(contactConfig.whatsappNumber);
  }, [contactConfig.email, contactConfig.whatsappNumber]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setCloudErrorToast('');
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(''), 3500);
  };

  const showError = (msg: string) => {
    setCloudErrorToast(msg);
    setTimeout(() => setCloudErrorToast(''), 5500);
  };

  const handleGoogleSignIn = async () => {
    setIsAuthLoading(true);
    setLoginError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (!isAuthorizedAdminEmail(result.user.email)) {
        setLoginError(
          `Signed in as ${result.user.email || 'unknown account'}, which is not authorized. Please sign in with hashimtypixel@gmail.com.`
        );
      }
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user') {
        setLoginError('Google sign-in popup was closed. Please try again.');
      } else {
        setLoginError(err?.message || 'Google sign-in failed. Please try again.');
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setHasSeededCloud(false);
    } catch {}
  };

  // --- Project Add / Edit / Delete ---
  // Adaptive Compressor: guarantees images fit comfortably under Firestore's 1MB document ceiling
  const compressImageFile = (
    file: File,
    callback: (compressedDataUrl: string) => void,
    onSizeError: (msg: string) => void
  ) => {
    const isVideoFile = file.type.startsWith('video/') || /\.(mp4|webm|mov|m4v)$/i.test(file.name);
    if (isVideoFile) {
      if (file.size > 600 * 1024) {
        onSizeError(
          `Video "${file.name}" is ${(file.size / (1024 * 1024)).toFixed(1)} MB. For global visitor playback, upload videos to GitHub/Cloudinary and paste the direct .mp4 URL in the "URL / Path" tab (direct file uploads support videos up to 600 KB).`
        );
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => callback(e.target?.result as string);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1250;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          let compressed = canvas.toDataURL('image/jpeg', 0.8);
          if (compressed.length > 650000) {
            compressed = canvas.toDataURL('image/jpeg', 0.65);
          }
          if (compressed.length > 650000) {
            compressed = canvas.toDataURL('image/jpeg', 0.48);
          }
          if (compressed.length > 850000) {
            onSizeError('Compressed image is still too large for cloud sync. Please choose a smaller image or paste an image URL.');
            return;
          }
          callback(compressed);
        } else {
          callback(rawUrl);
        }
      };
      img.onerror = () => callback(rawUrl);
      img.src = rawUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleProjectFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (isEdit) setEditUploadError('');
    else setNewUploadError('');

    compressImageFile(
      file,
      (dataUrl) => {
        if (isEdit) {
          setEditImageUrl(dataUrl);
        } else {
          setNewImageUrl(dataUrl);
        }
      },
      (errMsg) => {
        if (isEdit) setEditUploadError(errMsg);
        else setNewUploadError(errMsg);
      }
    );
  };

  const handleSelectPreset = (preset: typeof SHOWCASE_PRESET_IMAGES[0], isEdit = false) => {
    if (isEdit) {
      setEditImageUrl(preset.path);
      if (!editTitle || editTitle === 'New Project') setEditTitle(preset.defaultTitle);
      if (!editSubtitle) setEditSubtitle(preset.defaultSubtitle);
      setEditCategory(preset.defaultCategory);
      setEditBadge(preset.defaultBadge);
      setEditRow(preset.row);
    } else {
      setNewImageUrl(preset.path);
      setNewTitle(preset.defaultTitle);
      setNewSubtitle(preset.defaultSubtitle);
      setNewCategory(preset.defaultCategory);
      setNewBadge(preset.defaultBadge);
      setNewRow(preset.row);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const resolvedCategory =
      newCategory === 'Other'
        ? (customCategoryName.trim() || 'Custom Project')
        : newCategory;

    const mediaUrl = normalizeShowcaseImagePath(newImageUrl.trim());
    const posterUrl = normalizeShowcaseImagePath(newVideoPosterUrl.trim());
    const isVideo = isVideoMediaUrl(mediaUrl);

    const newItem: ShowcaseItem = {
      id: `proj-${Date.now()}`,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || '',
      client: '',
      category: resolvedCategory,
      year: '2026',
      githubUrl: '',
      badge: newBadge.trim() || (isVideo ? 'Video Reel' : 'Poster Art'),
      accentColor: isVideo ? '#8B5CF6' : '#171717',
      aspect: isVideo ? '9/16' : '4/5',
      dimensions: isVideo ? '1080 × 1920 px (Reel)' : '1080 × 1350 px',
      tools: [],
      description: '',
      keyFeatures: [],
      languages: [],
      imageUrl: isVideo ? (posterUrl || undefined) : (mediaUrl || undefined),
      mediaType: isVideo ? 'video' : 'image',
      videoUrl: isVideo ? mediaUrl : undefined,
      duration: isVideo ? '0:20' : undefined,
      type: isVideo ? 'video' : 'custom',
      row: newRow
    };

    let updatedRow1 = [...row1Projects];
    let updatedRow2 = [...row2Projects];

    if (newRow === 1) {
      updatedRow1 = [newItem, ...updatedRow1];
    } else {
      updatedRow2 = [newItem, ...updatedRow2];
    }

    setIsCloudSyncing(true);
    try {
      await saveShowcaseOrderToCloud(updatedRow1, updatedRow2);
      saveProjectsToStorage(updatedRow1, updatedRow2);
      onProjectsUpdated(updatedRow1, updatedRow2);

      setNewTitle('');
      setNewSubtitle('');
      setNewBadge('');
      setNewImageUrl('');
      setNewVideoPosterUrl('');
      setNewUploadError('');
      setCustomCategoryName('');

      showToast(`"${newItem.title}" published live to Row ${newRow} for all visitors!`);
    } catch (err: any) {
      showError(err?.message || 'Failed to save project to cloud database.');
    } finally {
      setIsCloudSyncing(false);
    }
  };

  const handleStartEditProject = (item: ShowcaseItem & { assignedRow: number }) => {
    setEditingProject(item);
    setEditTitle(item.title);
    setEditSubtitle(item.subtitle || '');
    setEditBadge(item.badge || '');
    setEditUploadError('');

    const standardCategories = [
      'Event Branding & Poster',
      'Commercial Poster Design',
      'Festive & Cultural Poster',
      'Visual Identity & Branding',
      'Logo Design & Identity',
      'Product & Packaging Mockup',
      'Event Branding & Invitation',
      'Cultural Poster & Digital Art',
      'Brand Identity & Logo',
      'Spiritual Typography & Poster',
      'Matchday Sports Poster',
      'Editorial Typography',
      'Digital Artwork & Manipulation',
      'Social Media Campaign',
      'Motion Graphics & Video',
      'Motion Video & Wedding',
      'Motion Graphic Poster'
    ];

    if (standardCategories.includes(item.category)) {
      setEditCategory(item.category);
      setEditCustomCategory('');
    } else {
      setEditCategory('Other');
      setEditCustomCategory(item.category);
    }

    setEditRow(item.assignedRow as 1 | 2);
    const isVid = isVideoMediaUrl(item.videoUrl || item.imageUrl, item.mediaType);
    setEditImageUrl(isVid ? (item.videoUrl || item.imageUrl || '') : (item.imageUrl || ''));
    setEditVideoPosterUrl(isVid && item.imageUrl && !isVideoMediaUrl(item.imageUrl) ? item.imageUrl : '');
    setEditMediaMode('link');
  };

  const handleSaveEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    const resolvedCategory =
      editCategory === 'Other'
        ? (editCustomCategory.trim() || 'Custom Project')
        : editCategory;

    const mediaUrl = normalizeShowcaseImagePath(editImageUrl.trim());
    const posterUrl = normalizeShowcaseImagePath(editVideoPosterUrl.trim());
    const isVideo = isVideoMediaUrl(mediaUrl);

    const updatedItem: ShowcaseItem = {
      ...editingProject,
      title: editTitle.trim() || editingProject.title,
      subtitle: editSubtitle.trim() ?? editingProject.subtitle,
      category: resolvedCategory,
      badge: editBadge.trim() || editingProject.badge || (isVideo ? 'Video Reel' : 'Poster Art'),
      imageUrl: isVideo ? (posterUrl || undefined) : (mediaUrl || undefined),
      mediaType: isVideo ? 'video' : 'image',
      videoUrl: isVideo ? mediaUrl : undefined,
      row: editRow
    };

    let updatedRow1 = row1Projects.filter((p) => p.id !== editingProject.id);
    let updatedRow2 = row2Projects.filter((p) => p.id !== editingProject.id);

    if (editRow === 1) {
      const idx = row1Projects.findIndex((p) => p.id === editingProject.id);
      if (idx !== -1) {
        updatedRow1.splice(idx, 0, updatedItem);
      } else {
        updatedRow1 = [updatedItem, ...updatedRow1];
      }
    } else {
      const idx = row2Projects.findIndex((p) => p.id === editingProject.id);
      if (idx !== -1) {
        updatedRow2.splice(idx, 0, updatedItem);
      } else {
        updatedRow2 = [updatedItem, ...updatedRow2];
      }
    }

    setIsCloudSyncing(true);
    try {
      const targetList = editRow === 1 ? updatedRow1 : updatedRow2;
      const sortIdx = targetList.findIndex((p) => p.id === updatedItem.id);
      await upsertShowcaseItemToCloud(updatedItem, editRow, sortIdx >= 0 ? sortIdx : 0);
      saveProjectsToStorage(updatedRow1, updatedRow2);
      onProjectsUpdated(updatedRow1, updatedRow2);

      setEditingProject(null);
      showToast(`"${updatedItem.title}" saved globally for all visitors!`);
    } catch (err: any) {
      showError(err?.message || 'Failed to update showcase item in cloud.');
    } finally {
      setIsCloudSyncing(false);
    }
  };

  const handleToggleProjectRow = async (item: ShowcaseItem, currentRow: number) => {
    const targetRow = (currentRow === 1 ? 2 : 1) as 1 | 2;
    const updatedItem = { ...item, row: targetRow };
    let updatedRow1 = row1Projects.filter((p) => p.id !== item.id);
    let updatedRow2 = row2Projects.filter((p) => p.id !== item.id);
    if (targetRow === 1) {
      updatedRow1 = [updatedItem, ...updatedRow1];
    } else {
      updatedRow2 = [updatedItem, ...updatedRow2];
    }

    setIsCloudSyncing(true);
    try {
      await saveShowcaseOrderToCloud(updatedRow1, updatedRow2);
      saveProjectsToStorage(updatedRow1, updatedRow2);
      onProjectsUpdated(updatedRow1, updatedRow2);
      showToast(`Moved "${item.title}" to Row ${targetRow} globally!`);
    } catch (err: any) {
      showError(err?.message || 'Failed to move project row.');
    } finally {
      setIsCloudSyncing(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    const updatedRow1 = row1Projects.filter((p) => p.id !== id);
    const updatedRow2 = row2Projects.filter((p) => p.id !== id);

    setIsCloudSyncing(true);
    try {
      await deleteShowcaseItemFromCloud(id);
      saveProjectsToStorage(updatedRow1, updatedRow2);
      onProjectsUpdated(updatedRow1, updatedRow2);
      showToast('Project deleted globally.');
    } catch (err: any) {
      showError(err?.message || 'Failed to delete project from cloud.');
    } finally {
      setIsCloudSyncing(false);
    }
  };

  // --- Experienced Tools Add / Delete ---
  const handleAddTool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newToolName.trim()) return;

    const newTool: ExperiencedTool = {
      id: `tool-${Date.now()}`,
      name: newToolName.trim(),
      category: newToolCategory,
      level: newToolLevel,
      proficiencyPercent: newToolProficiency,
      years: newToolYears.trim() || '3+ Years',
      badge: newToolBadge.trim() || newToolName.slice(0, 2).toUpperCase(),
      color: '#171717',
      bgColor: '#171717',
      description: newToolDescription.trim() || 'Creative production and workflow mastery.',
      iconUrl: newToolIconUrl.trim() || undefined
    };

    const updated = [...tools, newTool];
    setIsCloudSyncing(true);
    try {
      await upsertToolToCloud(newTool, updated.length - 1);
      saveToolsToStorage(updated);
      if (onToolsUpdated) onToolsUpdated(updated);

      setNewToolName('');
      setNewToolBadge('');
      setNewToolDescription('');
      setNewToolIconUrl('');
      showToast(`Software "${newTool.name}" published globally.`);
    } catch (err: any) {
      showError(err?.message || 'Failed to save tool to cloud.');
    } finally {
      setIsCloudSyncing(false);
    }
  };

  const handleDeleteTool = async (id: string) => {
    const updated = tools.filter((t) => t.id !== id);
    setIsCloudSyncing(true);
    try {
      await deleteToolFromCloud(id);
      saveToolsToStorage(updated);
      if (onToolsUpdated) onToolsUpdated(updated);
      showToast('Software removed globally.');
    } catch (err: any) {
      showError(err?.message || 'Failed to remove tool from cloud.');
    } finally {
      setIsCloudSyncing(false);
    }
  };

  // --- Blog Posts Add / Delete ---
  const handleAddBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogTitle.trim()) return;

    const slug = newBlogTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newPost: BlogPost = {
      id: `blog-${Date.now()}`,
      slug: slug || `article-${Date.now()}`,
      title: newBlogTitle.trim(),
      excerpt: newBlogExcerpt.trim() || 'In-depth industry tutorial and workflow breakdown.',
      content: newBlogContent.trim() || '## Overview\n\nFull article breakdown and high-impact design strategies.',
      category: newBlogCategory,
      readTime: newBlogReadTime || '5 min read',
      publishedDate: '2026',
      tags: newBlogTags.split(',').map((t) => t.trim()).filter(Boolean),
      seoKeywords: newBlogKeywords.split(',').map((k) => k.trim()).filter(Boolean),
      author: {
        name: 'Typixel',
        role: 'Creative Design Studio & Marketing Agency',
        avatar: '/logos/typixel.jpg'
      },
      views: 120
    };

    const updated = [newPost, ...blogPosts];
    setIsCloudSyncing(true);
    try {
      await upsertBlogPostToCloud(newPost, 0);
      saveBlogPostsToStorage(updated);
      if (onBlogPostsUpdated) onBlogPostsUpdated(updated);

      setNewBlogTitle('');
      setNewBlogExcerpt('');
      setNewBlogContent('');
      showToast(`Article "${newPost.title}" published globally!`);
    } catch (err: any) {
      showError(err?.message || 'Failed to publish blog article to cloud.');
    } finally {
      setIsCloudSyncing(false);
    }
  };

  const handleDeleteBlogPost = async (id: string) => {
    const updated = blogPosts.filter((p) => p.id !== id);
    setIsCloudSyncing(true);
    try {
      await deleteBlogPostFromCloud(id);
      saveBlogPostsToStorage(updated);
      if (onBlogPostsUpdated) onBlogPostsUpdated(updated);
      showToast('Article removed globally.');
    } catch (err: any) {
      showError(err?.message || 'Failed to delete article from cloud.');
    } finally {
      setIsCloudSyncing(false);
    }
  };

  // --- Contact & EmailJS Settings ---
  const handleSaveContactSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedConfig: ContactConfig = {
      email: settingsEmail.trim(),
      whatsappNumber: settingsWhatsApp.trim().replace(/[^0-9]/g, '')
    };

    setIsCloudSyncing(true);
    try {
      await saveSiteSettingsToCloud(updatedConfig, seoStrategy);
      saveContactConfigToStorage(updatedConfig.email, updatedConfig.whatsappNumber);
      onContactConfigUpdated(updatedConfig);

      localStorage.setItem('kawsar_emailjs_service_id', emailJsServiceId.trim());
      localStorage.setItem('kawsar_emailjs_template_id', emailJsTemplateId.trim());
      localStorage.setItem('kawsar_emailjs_public_key', emailJsPublicKey.trim());

      showToast('Contact channels & settings published globally!');
    } catch (err: any) {
      showError(err?.message || 'Failed to save settings to cloud.');
    } finally {
      setIsCloudSyncing(false);
    }
  };

  // --- SEO Strategy & Metadata Handlers ---
  const handleCopySeoText = async (text: string, fieldId: string) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      }
      setCopiedSeoField(fieldId);
      setTimeout(() => setCopiedSeoField(null), 2000);
    } catch {
      setCopiedSeoField(fieldId);
      setTimeout(() => setCopiedSeoField(null), 2000);
    }
  };

  const handleSaveSeoStrategy = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCloudSyncing(true);
    try {
      await saveSiteSettingsToCloud(
        { email: settingsEmail.trim(), whatsappNumber: settingsWhatsApp.trim() },
        seoStrategy
      );
      saveSeoStrategyToStorage(seoStrategy);
      if (seoStrategy.seoTitle) {
        document.title = seoStrategy.seoTitle;
      }
      const metaDescTag = document.querySelector('meta[name="description"]');
      if (metaDescTag && seoStrategy.metaDescription) {
        metaDescTag.setAttribute('content', seoStrategy.metaDescription);
      }
      showToast('SEO Strategy & Metadata saved globally!');
    } catch (err: any) {
      showError(err?.message || 'Failed to save SEO strategy to cloud.');
    } finally {
      setIsCloudSyncing(false);
    }
  };

  // --- admincontrol Backup & Restore Handlers ---
  const handleExportBackup = () => {
    const backupData = {
      backupName: 'admincontrol',
      version: '2026.1',
      exportedAt: new Date().toISOString(),
      showcaseRow1: row1Projects,
      showcaseRow2: row2Projects,
      tools,
      blogPosts,
      seoStrategy,
      contactConfig: {
        email: settingsEmail,
        whatsappNumber: settingsWhatsApp
      }
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `typixel_admincontrol_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Full system backup downloaded (admincontrol backup)!');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const data = JSON.parse(text);

        if (!data || typeof data !== 'object') {
          throw new Error('Invalid JSON structure');
        }

        setIsCloudSyncing(true);
        if (Array.isArray(data.showcaseRow1) && Array.isArray(data.showcaseRow2)) {
          await saveShowcaseOrderToCloud(data.showcaseRow1, data.showcaseRow2);
          saveProjectsToStorage(data.showcaseRow1, data.showcaseRow2);
          onProjectsUpdated(data.showcaseRow1, data.showcaseRow2);
        }

        if (Array.isArray(data.tools) && onToolsUpdated) {
          for (let i = 0; i < data.tools.length; i++) {
            await upsertToolToCloud(data.tools[i], i);
          }
          saveToolsToStorage(data.tools);
          onToolsUpdated(data.tools);
        }

        if (Array.isArray(data.blogPosts) && onBlogPostsUpdated) {
          for (let i = 0; i < data.blogPosts.length; i++) {
            await upsertBlogPostToCloud(data.blogPosts[i], i);
          }
          saveBlogPostsToStorage(data.blogPosts);
          onBlogPostsUpdated(data.blogPosts);
        }

        const nextContact = data.contactConfig || contactConfig;
        const nextSeo = data.seoStrategy || seoStrategy;
        await saveSiteSettingsToCloud(nextContact, nextSeo);

        if (data.seoStrategy) {
          saveSeoStrategyToStorage(data.seoStrategy);
          setSeoStrategy(data.seoStrategy);
        }

        if (data.contactConfig) {
          saveContactConfigToStorage(data.contactConfig.email, data.contactConfig.whatsappNumber);
          onContactConfigUpdated(data.contactConfig);
          setSettingsEmail(data.contactConfig.email);
          setSettingsWhatsApp(data.contactConfig.whatsappNumber);
        }

        setBackupRestoreError('');
        showToast('Backup successfully restored & synced globally!');
      } catch (err) {
        console.error('Backup import error:', err);
        setBackupRestoreError('Failed to parse or sync backup JSON. Please check file format.');
      } finally {
        setIsCloudSyncing(false);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  if (!isOpen) return null;

  return (
    <div className="min-h-screen w-full bg-[#EAE8E3] text-neutral-900 flex flex-col selection:bg-neutral-900 selection:text-white">
      {/* Top Header Bar for Separate Admin Page */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200/90 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center shadow-xs">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold text-neutral-900 leading-tight">
                Typixel Admin Control
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 font-semibold border border-neutral-200">
                admincontrol
              </span>
              {isAuthenticated && (
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  <span className={`w-1.5 h-1.5 rounded-full ${isCloudSyncing ? 'bg-amber-500' : 'bg-emerald-500'} animate-pulse`} />
                  {isCloudSyncing ? 'Syncing to Cloud...' : 'Cloud Synced (Live for Everyone)'}
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500">
              {isAuthenticated
                ? `Signed in as ${authUser?.email || 'Admin'} — Changes update live for all visitors`
                : 'Google Admin Sign-In required to publish showcase updates globally'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated && (
            <>
              <button
                onClick={handleExportBackup}
                className="hidden md:inline-flex items-center gap-1.5 text-xs text-neutral-800 hover:text-black bg-[#F5F4F0] hover:bg-[#EAE8E2] border border-neutral-200/80 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                title="Download admincontrol Backup JSON"
              >
                <Download className="w-3.5 h-3.5 text-neutral-700" />
                <span>Backup</span>
              </button>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-xs text-neutral-800 hover:text-black bg-[#F5F4F0] hover:bg-[#EAE8E2] border border-neutral-200/80 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-neutral-700" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </>
          )}

          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300/80 px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
            title="Return to Public Portfolio Website"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Portfolio</span>
            <span className="sm:hidden">Exit</span>
          </button>
        </div>
      </header>

      {/* Success Toast */}
      {successToast && (
        <div className="bg-neutral-900 text-white px-6 py-2.5 flex items-center justify-center gap-2 text-xs font-medium shadow-md sticky top-[61px] z-30">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Error Toast */}
      {cloudErrorToast && (
        <div className="bg-rose-700 text-white px-6 py-2.5 flex items-center justify-center gap-2 text-xs font-medium shadow-md sticky top-[61px] z-30">
          <span>{cloudErrorToast}</span>
        </div>
      )}

      {/* Auth Barrier if not logged in via authorized Google account */}
      {!isAuthenticated ? (
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="bg-white rounded-[28px] sm:rounded-3xl max-w-md w-full p-8 sm:p-10 shadow-xl border border-neutral-200/90 text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-neutral-900 flex items-center justify-center text-white mb-4 mx-auto shadow-md">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <div className="flex items-center justify-center gap-2 mb-1">
              <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
                Typixel Admin Control
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 font-semibold border border-neutral-200">
                admincontrol
              </span>
            </div>

            <p className="text-xs sm:text-[13px] text-neutral-500 mb-6 leading-relaxed">
              Sign in with your authorized Typixel Google account (<span className="font-mono text-neutral-700">hashimtypixel@gmail.com</span>) so showcase images, videos, and site changes sync globally for all visitors.
            </p>

            {loginError && (
              <div className="p-3 mb-4 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-200 text-left font-medium">
                {loginError}
              </div>
            )}

            <button
              type="button"
              disabled={isAuthLoading}
              onClick={handleGoogleSignIn}
              className="w-full bg-neutral-900 hover:bg-black disabled:opacity-60 text-white text-xs font-semibold py-3 px-4 rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2.5"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.45 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.91 6.16-4.91z" />
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              </svg>
              <span>{isAuthLoading ? 'Signing in...' : authUser ? 'Switch Google Account' : 'Continue with Google'}</span>
            </button>

            {authUser && !isAuthorizedAdminEmail(authUser.email) && (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full mt-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold py-2 rounded-xl cursor-pointer"
              >
                Sign out ({authUser.email})
              </button>
            )}

            <div className="mt-6 pt-4 border-t border-neutral-100">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Portfolio Website</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Logged In Full Page Dashboard */
        <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 flex flex-col gap-6">
          {/* Overview Banner Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-neutral-200/90 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
                  Control Room &amp; Content Manager
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Live
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
                Manage showcase posters, software marquee tools, SEO keyword strategy, and system backups.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveTab('backup')}
                className="inline-flex items-center gap-1.5 text-xs font-medium bg-[#F5F4F0] hover:bg-[#EAE8E2] border border-neutral-200 text-neutral-800 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
              >
                <Database className="w-3.5 h-3.5 text-neutral-700" />
                <span>Backup ({row1Projects.length + row2Projects.length} Projects)</span>
              </button>
              <button
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-neutral-900 hover:bg-black text-white px-3.5 py-1.5 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>View Live Website</span>
              </button>
            </div>
          </div>

          {/* Main Tabbed Workspace in Card */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-neutral-200/90 shadow-sm overflow-hidden flex flex-col">
            {/* Tab Navigation */}
            <div className="px-6 sm:px-8 pt-3 pb-2 flex items-center gap-2 border-b border-neutral-100 bg-white overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab('seocontrol')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                  activeTab === 'seocontrol'
                    ? 'bg-neutral-900 text-white shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <Target className="w-3.5 h-3.5 text-emerald-500" />
                <span>SEO Strategy Control</span>
              </button>

              <button
                onClick={() => setActiveTab('add')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                  activeTab === 'add' ? 'bg-neutral-900 text-white shadow-2xs' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>

              <button
                onClick={() => setActiveTab('manage')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                  activeTab === 'manage' ? 'bg-neutral-900 text-white shadow-2xs' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Showcase ({row1Projects.length + row2Projects.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('tools')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                  activeTab === 'tools' ? 'bg-neutral-900 text-white shadow-2xs' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Experienced Tools ({tools.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('blog')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                  activeTab === 'blog' ? 'bg-neutral-900 text-white shadow-2xs' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Blog &amp; SEO ({blogPosts.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                  activeTab === 'settings' ? 'bg-neutral-900 text-white shadow-2xs' : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact &amp; EmailJS</span>
              </button>

              <button
                onClick={() => setActiveTab('backup')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                  activeTab === 'backup'
                    ? 'bg-neutral-900 text-white shadow-2xs'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-purple-500" />
                <span>admincontrol Backup</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1">
              {/* TAB: SEO STRATEGY & METADATA CONTROL */}
              {activeTab === 'seocontrol' && (
                <div className="space-y-6 max-w-4xl">
                  {/* Top Header Card matching the removed banner */}
                  <div className="bg-[#FAF9F6] border border-neutral-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/60">
                      <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full mb-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                          <span>SEO Publishing Strategy — 2026 Live Architecture</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-neutral-900">
                          Organic Visibility &amp; Lead Generation Architecture
                        </h3>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          Configure live search targets for Kerala, Malappuram &amp; national enquiries.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-700 bg-white px-3 py-1.5 rounded-xl border border-neutral-200 shadow-2xs">
                          <Globe className="w-3.5 h-3.5 text-neutral-800" />
                          <span>{seoStrategy.domain}</span>
                        </div>
                      </div>
                    </div>

                    {/* 4 Strategic Pillars Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
                      {/* Primary Target */}
                      <div className="bg-white p-3.5 rounded-xl border border-neutral-200/80">
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                            <Target className="w-3 h-3 text-neutral-700" />
                            <span>Primary Target</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopySeoText(seoStrategy.primaryTarget, 'strat-target')}
                            className="p-1 hover:bg-neutral-100 rounded text-neutral-500 cursor-pointer"
                            title="Copy target"
                          >
                            {copiedSeoField === 'strat-target' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <p className="text-xs font-semibold text-neutral-800 leading-snug">
                          {seoStrategy.primaryTarget}
                        </p>
                      </div>

                      {/* Location Focus */}
                      <div className="bg-white p-3.5 rounded-xl border border-neutral-200/80">
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                            <MapPin className="w-3 h-3 text-rose-600" />
                            <span>Location Focus</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopySeoText(seoStrategy.locationFocus, 'strat-loc')}
                            className="p-1 hover:bg-neutral-100 rounded text-neutral-500 cursor-pointer"
                            title="Copy location"
                          >
                            {copiedSeoField === 'strat-loc' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <p className="text-xs font-semibold text-neutral-800 leading-snug">
                          {seoStrategy.locationFocus}
                        </p>
                      </div>

                      {/* Audience */}
                      <div className="bg-white p-3.5 rounded-xl border border-neutral-200/80">
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                            <Users className="w-3 h-3 text-blue-600" />
                            <span>Audience</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopySeoText(seoStrategy.audience, 'strat-aud')}
                            className="p-1 hover:bg-neutral-100 rounded text-neutral-500 cursor-pointer"
                            title="Copy audience"
                          >
                            {copiedSeoField === 'strat-aud' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <p className="text-xs font-semibold text-neutral-800 leading-snug">
                          {seoStrategy.audience}
                        </p>
                      </div>

                      {/* Goal */}
                      <div className="bg-white p-3.5 rounded-xl border border-neutral-200/80">
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                            <Compass className="w-3 h-3 text-purple-600" />
                            <span>Goal</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopySeoText(seoStrategy.goal, 'strat-goal')}
                            className="p-1 hover:bg-neutral-100 rounded text-neutral-500 cursor-pointer"
                            title="Copy goal"
                          >
                            {copiedSeoField === 'strat-goal' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <p className="text-xs font-semibold text-neutral-800 leading-snug">
                          {seoStrategy.goal}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Editable SEO Settings & Metadata Form */}
                  <form onSubmit={handleSaveSeoStrategy} className="space-y-4 bg-white border border-neutral-200 rounded-2xl p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-100">
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900">1. Verified SEO Settings &amp; Metadata Control</h4>
                        <p className="text-xs text-neutral-500">Edit or copy live values used for search engine indexing and social cards.</p>
                      </div>
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs transition-colors self-start sm:self-auto"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Save SEO Settings</span>
                      </button>
                    </div>

                    {/* Blog Title / H1 */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                          BLOG TITLE / H1
                        </label>
                        <button
                          type="button"
                          onClick={() => handleCopySeoText(seoStrategy.blogTitle, 'field-blog-title')}
                          className="inline-flex items-center gap-1 text-[11px] text-neutral-600 hover:text-black font-semibold cursor-pointer"
                        >
                          {copiedSeoField === 'field-blog-title' ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Blog Title</span>
                            </>
                          )}
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={seoStrategy.blogTitle}
                        onChange={(e) => setSeoStrategy({ ...seoStrategy, blogTitle: e.target.value })}
                        className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 font-medium"
                      />
                    </div>

                    {/* SEO Title & URL Slug */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                            SEO TITLE (Browser &amp; SERP)
                          </label>
                          <button
                            type="button"
                            onClick={() => handleCopySeoText(seoStrategy.seoTitle, 'field-seo-title')}
                            className="inline-flex items-center gap-1 text-[11px] text-neutral-600 hover:text-black font-semibold cursor-pointer"
                          >
                            {copiedSeoField === 'field-seo-title' ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy SEO Title</span>
                              </>
                            )}
                          </button>
                        </div>
                        <input
                          type="text"
                          required
                          value={seoStrategy.seoTitle}
                          onChange={(e) => setSeoStrategy({ ...seoStrategy, seoTitle: e.target.value })}
                          className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                            URL SLUG
                          </label>
                          <button
                            type="button"
                            onClick={() => handleCopySeoText(seoStrategy.urlSlug, 'field-url-slug')}
                            className="inline-flex items-center gap-1 text-[11px] text-neutral-600 hover:text-black font-semibold cursor-pointer"
                          >
                            {copiedSeoField === 'field-url-slug' ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-600" />
                                <span className="text-emerald-700">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Slug</span>
                              </>
                            )}
                          </button>
                        </div>
                        <input
                          type="text"
                          required
                          value={seoStrategy.urlSlug}
                          onChange={(e) => setSeoStrategy({ ...seoStrategy, urlSlug: e.target.value })}
                          className="w-full text-xs font-mono bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
                        />
                      </div>
                    </div>

                    {/* Meta Description */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                          META DESCRIPTION (Search snippets &amp; social previews)
                        </label>
                        <button
                          type="button"
                          onClick={() => handleCopySeoText(seoStrategy.metaDescription, 'field-meta-desc')}
                          className="inline-flex items-center gap-1 text-[11px] text-neutral-600 hover:text-black font-semibold cursor-pointer"
                        >
                          {copiedSeoField === 'field-meta-desc' ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Meta Description</span>
                            </>
                          )}
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        required
                        value={seoStrategy.metaDescription}
                        onChange={(e) => setSeoStrategy({ ...seoStrategy, metaDescription: e.target.value })}
                        className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 resize-none"
                      />
                    </div>

                    {/* Strategic Pillars Editable Fields */}
                    <div className="pt-3 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                          Primary Target Category
                        </label>
                        <input
                          type="text"
                          value={seoStrategy.primaryTarget}
                          onChange={(e) => setSeoStrategy({ ...seoStrategy, primaryTarget: e.target.value })}
                          className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                          Location Focus (Regions)
                        </label>
                        <input
                          type="text"
                          value={seoStrategy.locationFocus}
                          onChange={(e) => setSeoStrategy({ ...seoStrategy, locationFocus: e.target.value })}
                          className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                          Audience Target
                        </label>
                        <input
                          type="text"
                          value={seoStrategy.audience}
                          onChange={(e) => setSeoStrategy({ ...seoStrategy, audience: e.target.value })}
                          className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                          Core Growth Goal
                        </label>
                        <input
                          type="text"
                          value={seoStrategy.goal}
                          onChange={(e) => setSeoStrategy({ ...seoStrategy, goal: e.target.value })}
                          className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900"
                        />
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 1: ADD NEW SHOWCASE PROJECT */}
              {activeTab === 'add' && (
                <div className="space-y-6 max-w-4xl">
                  {/* Preset Quick Select Banner */}
                  <div className="bg-[#FAF9F6] border border-neutral-200/90 rounded-2xl p-5 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <span>10 Preset Showcase Artworks</span>
                        </h4>
                        <p className="text-xs text-neutral-500">
                          Click any asset below to auto-fill its artwork, title, category, and marquee row.
                        </p>
                      </div>
                      <span className="text-[11px] font-mono text-neutral-500 bg-white border border-neutral-200 px-2.5 py-0.5 rounded-full self-start sm:self-auto">
                        1-Click Fill
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {SHOWCASE_PRESET_IMAGES.map((preset) => {
                        const isSelected = newImageUrl === preset.path;
                        return (
                          <button
                            key={preset.filename}
                            type="button"
                            onClick={() => handleSelectPreset(preset, false)}
                            className={`group p-2 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'bg-neutral-900 text-white border-neutral-900 shadow-md ring-2 ring-neutral-900/20'
                                : 'bg-white hover:bg-neutral-50 border-neutral-200 text-neutral-800 hover:border-neutral-400'
                            }`}
                          >
                            <div className="w-full aspect-[4/5] rounded-lg overflow-hidden bg-neutral-900 mb-1.5 relative border border-black/5">
                              <img
                                src={preset.path}
                                alt={preset.name}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={(e) => {
                                  // Fallback in case of load glitch
                                  (e.target as HTMLElement).style.opacity = '0.7';
                                }}
                              />
                              <span className={`absolute top-1 right-1 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded shadow-xs ${
                                isSelected ? 'bg-emerald-500 text-white' : 'bg-black/70 text-white'
                              }`}>
                                R{preset.row}
                              </span>
                            </div>
                            <span className="text-[11px] font-bold truncate block">{preset.name}</span>
                            <span className={`text-[9px] truncate block ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                              {preset.defaultCategory}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Add Form */}
                  <form onSubmit={handleAddProject} className="bg-white rounded-2xl border border-neutral-200/90 p-5 sm:p-6 space-y-5 shadow-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                      <div>
                        <h4 className="text-base font-bold text-neutral-900">Add Project Details</h4>
                        <p className="text-xs text-neutral-500">
                          Configure title, category, media artwork, and marquee row for the continuous showcase.
                        </p>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700">
                        Row {newRow} Showcase
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                          Project Title *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Skillovia — Growth Arrow Mark"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                          Subtitle / Tagline
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Minimalist Vector Emblem & Geometry"
                          value={newSubtitle}
                          onChange={(e) => setNewSubtitle(e.target.value)}
                          className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                          Category / Project Type
                        </label>
                        <select
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
                        >
                          <option value="Event Branding & Poster">Event Branding &amp; Poster</option>
                          <option value="Commercial Poster Design">Commercial Poster Design</option>
                          <option value="Festive & Cultural Poster">Festive &amp; Cultural Poster</option>
                          <option value="Visual Identity & Branding">Visual Identity &amp; Branding</option>
                          <option value="Logo Design & Identity">Logo Design &amp; Identity</option>
                          <option value="Product & Packaging Mockup">Product &amp; Packaging Mockup</option>
                          <option value="Event Branding & Invitation">Event Branding &amp; Invitation</option>
                          <option value="Cultural Poster & Digital Art">Cultural Poster &amp; Digital Art</option>
                          <option value="Brand Identity & Logo">Brand Identity &amp; Logo</option>
                          <option value="Spiritual Typography & Poster">Spiritual Typography &amp; Poster</option>
                          <option value="Social Media Campaign">Social Media Campaign</option>
                          <option value="Motion Graphic Poster">Motion Graphic Poster</option>
                          <option value="Other">Other (Custom Type)...</option>
                        </select>
                      </div>

                      {newCategory === 'Other' && (
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                            Custom Type Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 3D Architectural Visualization"
                            value={customCategoryName}
                            onChange={(e) => setCustomCategoryName(e.target.value)}
                            className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                          Top-Right Badge / Tag
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Festival Campaign, Brand Monogram"
                          value={newBadge}
                          onChange={(e) => setNewBadge(e.target.value)}
                          className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                          Showcase Marquee Row
                        </label>
                        <select
                          value={newRow}
                          onChange={(e) => setNewRow(Number(e.target.value) as 1 | 2)}
                          className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
                        >
                          <option value={1}>Row 1 (Slides Left)</option>
                          <option value={2}>Row 2 (Slides Right)</option>
                        </select>
                      </div>
                    </div>

                    {/* Artwork Image or Video */}
                    <div className="pt-2 border-t border-neutral-100 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-700">
                          Cover Image / Artwork Source
                        </label>
                        <div className="flex items-center gap-1.5 text-[11px] bg-neutral-100 p-1 rounded-xl">
                          <button
                            type="button"
                            onClick={() => setProjectMediaMode('preset')}
                            className={`px-3 py-1 rounded-lg cursor-pointer transition-colors font-medium ${
                              projectMediaMode === 'preset'
                                ? 'bg-white text-neutral-900 font-bold shadow-xs'
                                : 'text-neutral-600 hover:text-neutral-900'
                            }`}
                          >
                            ⭐ Showcase Assets (10)
                          </button>
                          <button
                            type="button"
                            onClick={() => setProjectMediaMode('upload')}
                            className={`px-3 py-1 rounded-lg cursor-pointer transition-colors font-medium ${
                              projectMediaMode === 'upload'
                                ? 'bg-white text-neutral-900 font-bold shadow-xs'
                                : 'text-neutral-600 hover:text-neutral-900'
                            }`}
                          >
                            📁 Upload File
                          </button>
                          <button
                            type="button"
                            onClick={() => setProjectMediaMode('link')}
                            className={`px-3 py-1 rounded-lg cursor-pointer transition-colors font-medium ${
                              projectMediaMode === 'link'
                                ? 'bg-white text-neutral-900 font-bold shadow-xs'
                                : 'text-neutral-600 hover:text-neutral-900'
                            }`}
                          >
                            🔗 URL / Path
                          </button>
                        </div>
                      </div>

                      {projectMediaMode === 'preset' && (
                        <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                          <p className="text-xs text-neutral-600 mb-2 font-medium">
                            Current Selected Asset Path:
                          </p>
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              value={newImageUrl}
                              onChange={(e) => {
                                setNewImageUrl(e.target.value);
                                setNewUploadError('');
                              }}
                              placeholder="/showcase/Chamayam.jpg"
                              className="flex-1 text-xs bg-white border border-neutral-300 rounded-xl px-3 py-2 text-neutral-900 font-mono"
                            />
                            {newImageUrl && (
                              <div className="w-12 h-14 rounded-lg overflow-hidden border border-neutral-300 shrink-0 bg-neutral-900 shadow-xs">
                                {isVideoMediaUrl(newImageUrl) ? (
                                  <video
                                    src={normalizeShowcaseImagePath(newImageUrl)}
                                    muted
                                    autoPlay
                                    loop
                                    playsInline
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <img src={normalizeShowcaseImagePath(newImageUrl)} alt="Preview" className="w-full h-full object-cover" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {projectMediaMode === 'upload' && (
                        <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                          <div className="flex items-center gap-3">
                            <input
                              type="file"
                              accept="image/*,video/mp4,video/webm,video/quicktime"
                              onChange={(e) => handleProjectFileUpload(e, false)}
                              className="w-full text-xs text-neutral-600 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-neutral-900 file:text-white hover:file:bg-black file:cursor-pointer bg-white border border-neutral-200 rounded-xl p-1"
                            />
                            {newImageUrl && (
                              <div className="w-12 h-14 rounded-lg overflow-hidden border border-neutral-300 shrink-0 bg-neutral-900 shadow-xs">
                                {isVideoMediaUrl(newImageUrl) ? (
                                  <video
                                    src={newImageUrl}
                                    muted
                                    autoPlay
                                    loop
                                    playsInline
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <img src={newImageUrl} alt="Uploaded Preview" className="w-full h-full object-cover" />
                                )}
                              </div>
                            )}
                          </div>
                          {newUploadError && (
                            <p className="text-[11px] text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-2.5 py-1.5 font-medium">
                              {newUploadError}
                            </p>
                          )}
                          <p className="text-[11px] text-neutral-500">
                            ✓ Images auto-compress &amp; sync live to all visitors. For large HD videos (&gt;600 KB), paste an external .mp4 URL in the URL tab.
                          </p>
                        </div>
                      )}

                      {projectMediaMode === 'link' && (
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="https://... (.jpg, .png, .webp, .mp4 or GitHub raw link)"
                            value={newImageUrl}
                            onChange={(e) => {
                              setNewImageUrl(e.target.value);
                              setNewUploadError('');
                            }}
                            className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 font-mono"
                          />
                          <div className="flex flex-wrap gap-1.5 text-[10px] text-neutral-500">
                            <span>Quick presets:</span>
                            {SHOWCASE_PRESET_IMAGES.slice(0, 5).map((p) => (
                              <button
                                key={p.filename}
                                type="button"
                                onClick={() => setNewImageUrl(p.path)}
                                className="underline hover:text-neutral-900 cursor-pointer"
                              >
                                {p.filename}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {isVideoMediaUrl(newImageUrl) && (
                        <div className="pt-2">
                          <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                            Optional Video Poster / Cover Image URL
                          </label>
                          <input
                            type="text"
                            placeholder="https://... (optional poster image while video loads)"
                            value={newVideoPosterUrl}
                            onChange={(e) => setNewVideoPosterUrl(e.target.value)}
                            className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-neutral-900 font-mono"
                          />
                        </div>
                      )}
                    </div>

                    {/* Card Live Preview Banner */}
                    {newTitle && (
                      <div className="pt-3 border-t border-neutral-100 flex items-center gap-4 bg-[#FAF9F6] p-3 rounded-xl border border-neutral-200">
                        <div className="w-14 h-18 rounded-lg overflow-hidden bg-neutral-900 shrink-0 border border-neutral-300 shadow-xs relative">
                          {newImageUrl ? (
                            isVideoMediaUrl(newImageUrl) ? (
                              <video
                                src={normalizeShowcaseImagePath(newImageUrl)}
                                poster={newVideoPosterUrl ? normalizeShowcaseImagePath(newVideoPosterUrl) : undefined}
                                muted
                                autoPlay
                                loop
                                playsInline
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <img src={normalizeShowcaseImagePath(newImageUrl)} alt="Card preview" className="w-full h-full object-cover" />
                            )
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/50 text-[10px] font-mono">
                              No Art
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-neutral-200 text-neutral-700 font-bold">
                            Live Marquee Preview — Row {newRow}
                          </span>
                          <h5 className="text-sm font-bold text-neutral-900 truncate mt-0.5">{newTitle}</h5>
                          <p className="text-xs text-neutral-500 truncate">{newSubtitle || 'Typixel Creative Showcase'}</p>
                          <span className="text-[10px] text-neutral-400 font-mono block mt-0.5">{newCategory}</span>
                        </div>
                      </div>
                    )}

                    <div className="pt-2 flex items-center justify-end">
                      <button
                        type="submit"
                        disabled={isCloudSyncing}
                        className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-black disabled:opacity-60 text-white px-7 py-3 rounded-full text-xs font-semibold shadow-md transition-all cursor-pointer hover:scale-102"
                      >
                        <Plus className="w-4 h-4" />
                        <span>{isCloudSyncing ? 'Publishing to Cloud...' : 'Add Project to Showcase'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: MANAGE SHOWCASE PROJECTS */}
              {activeTab === 'manage' && (
                <div className="space-y-6">
                  {/* Top Bar with Add Button and Item Count (NO reset to default) */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#FAF9F6] rounded-2xl border border-neutral-200/90">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-neutral-900">
                          Showcase Artworks ({row1Projects.length + row2Projects.length} Unlimited Items Active)
                        </h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                          Unlimited Rows
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Row 1 ({row1Projects.length} items) slides Left • Row 2 ({row2Projects.length} items) slides Right. Supports unlimited items in each row.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveTab('add')}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-black px-4 py-2 rounded-xl shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Item</span>
                    </button>
                  </div>

                  {/* Showcase Cards Grid with Visual Image Thumbnails */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                    {[...row1Projects.map((p) => ({ ...p, assignedRow: 1 })), ...row2Projects.map((p) => ({ ...p, assignedRow: 2 }))].map((item) => {
                      const isVid = isVideoMediaUrl(item.videoUrl || item.imageUrl, item.mediaType);
                      const displayVideo = isVid ? normalizeShowcaseImagePath(item.videoUrl || item.imageUrl || '') : '';
                      const displayImg = item.imageUrl && !isVideoMediaUrl(item.imageUrl) ? normalizeShowcaseImagePath(item.imageUrl) : '';
                      return (
                        <div
                          key={item.id}
                          className="bg-[#FAF9F6] p-4 rounded-2xl border border-neutral-200 hover:border-neutral-400 transition-all flex gap-3.5 items-start justify-between shadow-2xs"
                        >
                          {/* Visual Thumbnail */}
                          <div className="w-16 h-20 rounded-xl overflow-hidden bg-neutral-900 shrink-0 border border-neutral-300 relative shadow-xs">
                            {isVid && displayVideo ? (
                              <video
                                src={displayVideo}
                                poster={displayImg || undefined}
                                muted
                                autoPlay
                                loop
                                playsInline
                                className="w-full h-full object-cover"
                              />
                            ) : displayImg ? (
                              <img
                                src={displayImg}
                                alt={item.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white/50 text-[10px] font-mono">
                                No Art
                              </div>
                            )}
                            {isVid && (
                              <span className="absolute top-1 left-1 text-[7px] font-mono font-bold px-1 py-0.5 rounded bg-purple-600 text-white">
                                VID
                              </span>
                            )}
                            <span className="absolute bottom-1 right-1 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/80 text-white">
                              R{item.assignedRow}
                            </span>
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-500 mb-1">
                              <span className="bg-white px-2 py-0.5 rounded border border-neutral-200 text-neutral-800 font-bold">
                                Row {item.assignedRow}
                              </span>
                              {item.badge && (
                                <span className="bg-white px-2 py-0.5 rounded border border-neutral-200 text-neutral-700 font-medium truncate">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <h4 className="text-sm font-bold text-neutral-900 truncate leading-snug">{item.title}</h4>
                            <p className="text-xs text-neutral-500 line-clamp-1 mt-0.5">{item.subtitle || item.client}</p>
                            <span className="text-[11px] text-neutral-400 font-mono mt-1 block truncate">{item.category}</span>

                            {/* Controls */}
                            <div className="mt-3 pt-2 border-t border-neutral-200 flex items-center justify-between gap-2">
                              <button
                                type="button"
                                onClick={() => handleToggleProjectRow(item, item.assignedRow)}
                                className="text-[11px] font-medium text-neutral-600 hover:text-neutral-900 bg-white hover:bg-neutral-100 border border-neutral-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                                title={`Move to Row ${item.assignedRow === 1 ? 2 : 1}`}
                              >
                                Move to Row {item.assignedRow === 1 ? '2 ➔' : '1 ➔'}
                              </button>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleStartEditProject(item)}
                                  className="p-1.5 hover:bg-white text-neutral-700 hover:text-black rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors border border-transparent hover:border-neutral-200"
                                  title="Edit project"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProject(item.id)}
                                  className="p-1.5 hover:bg-red-50 text-neutral-400 hover:text-red-600 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors"
                                  title="Delete project"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: EXPERIENCED TOOLS & APPS */}
              {activeTab === 'tools' && (
                <div className="space-y-6">
                  <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-neutral-200">
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900">12 Experienced Software &amp; Tools</h4>
                      <p className="text-xs text-neutral-500">
                        Photoshop, Illustrator, InDesign, Premiere Pro, After Effects, DaVinci, Canva, CapCut, HTML, CSS, JS, Figma.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleAddTool} className="p-5 bg-white rounded-2xl border border-neutral-200 space-y-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Add New Software / Tool</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-600 mb-1">Software Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Cinema 4D, Blender, XD..."
                          value={newToolName}
                          onChange={(e) => setNewToolName(e.target.value)}
                          className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-600 mb-1">Category</label>
                        <select
                          value={newToolCategory}
                          onChange={(e) => setNewToolCategory(e.target.value as any)}
                          className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900"
                        >
                          <option value="Graphic & Vector">Graphic &amp; Vector</option>
                          <option value="Video & Motion">Video &amp; Motion</option>
                          <option value="Product & UI">Product &amp; UI</option>
                          <option value="Web & Code">Web &amp; Code</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-600 mb-1">Short Badge (e.g. C4D, BL)</label>
                        <input
                          type="text"
                          maxLength={5}
                          placeholder="e.g. C4D"
                          value={newToolBadge}
                          onChange={(e) => setNewToolBadge(e.target.value)}
                          className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 font-mono"
                        />
                      </div>
                    </div>

                    {/* Icon PNG Upload or Image Link */}
                    <div className="pt-2 border-t border-neutral-100">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold text-neutral-600">
                          App Icon (PNG Upload or Image Link)
                        </label>
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <button
                            type="button"
                            onClick={() => setToolIconMode('upload')}
                            className={`px-2.5 py-0.5 rounded-md cursor-pointer transition-colors ${
                              toolIconMode === 'upload'
                                ? 'bg-neutral-900 text-white font-semibold'
                                : 'text-neutral-500 hover:text-neutral-900 bg-neutral-100'
                            }`}
                          >
                            Upload PNG
                          </button>
                          <span className="text-neutral-300">/</span>
                          <button
                            type="button"
                            onClick={() => setToolIconMode('link')}
                            className={`px-2.5 py-0.5 rounded-md cursor-pointer transition-colors ${
                              toolIconMode === 'link'
                                ? 'bg-neutral-900 text-white font-semibold'
                                : 'text-neutral-500 hover:text-neutral-900 bg-neutral-100'
                            }`}
                          >
                            Image Link (URL)
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {toolIconMode === 'upload' ? (
                          <div className="flex-1">
                            <input
                              type="file"
                              accept="image/png,image/svg+xml,image/jpeg,image/webp"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = () => {
                                    if (typeof reader.result === 'string') {
                                      setNewToolIconUrl(reader.result);
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                              className="w-full text-xs text-neutral-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-neutral-100 file:text-neutral-800 hover:file:bg-neutral-200 cursor-pointer"
                            />
                            <p className="text-[10px] text-neutral-400 mt-1">
                              Choose any transparent PNG, SVG, or icon image file from your device.
                            </p>
                          </div>
                        ) : (
                          <div className="flex-1">
                            <input
                              type="text"
                              placeholder="e.g. https://cdn.worldvectorlogo.com/logos/blender-2.svg or /icon.png"
                              value={newToolIconUrl}
                              onChange={(e) => setNewToolIconUrl(e.target.value)}
                              className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 placeholder:text-neutral-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                            />
                            <p className="text-[10px] text-neutral-400 mt-1">
                              Paste an online image link (PNG, SVG, or JPG).
                            </p>
                          </div>
                        )}

                        {/* Live Icon Preview if set */}
                        {newToolIconUrl && (
                          <div className="flex items-center gap-2 bg-neutral-50 p-1.5 rounded-xl border border-neutral-200 shrink-0">
                            <AppLogo
                              name={newToolName || 'New'}
                              badge={newToolBadge || 'App'}
                              iconUrl={newToolIconUrl}
                              size={38}
                            />
                            <button
                              type="button"
                              onClick={() => setNewToolIconUrl('')}
                              className="text-[10px] text-red-500 hover:text-red-700 underline pr-1 cursor-pointer font-medium"
                            >
                              Clear
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 bg-neutral-900 hover:bg-black text-white px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Tool to Moving Marquee</span>
                      </button>
                    </div>
                  </form>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {tools.map((t) => (
                      <div key={t.id} className="p-3.5 bg-[#FAF9F6] rounded-xl border border-neutral-200 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <AppLogo name={t.name} badge={t.badge} iconUrl={t.iconUrl} size={38} />
                          <div>
                            <div className="text-xs font-bold text-neutral-900">{t.name}</div>
                            <div className="text-[10px] text-neutral-500 font-mono">{t.category}</div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteTool(t.id)}
                          className="p-1.5 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 rounded-lg transition-colors cursor-pointer"
                          title="Remove tool"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: BLOG & TRENDING SEO ARTICLES */}
              {activeTab === 'blog' && (
                <div className="space-y-6">
                  <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-neutral-200">
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900">Ranked SEO Articles for Google Search Console</h4>
                      <p className="text-xs text-neutral-500">
                        Targeting keywords: Graphic Design Trends, Adobe Photoshop, Figma UI, Premiere Pro, and Front-End.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleAddBlogPost} className="p-5 bg-white rounded-2xl border border-neutral-200 space-y-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Publish New Article</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold text-neutral-600 mb-1">Article Headline *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 10 High-Converting Poster Design Secrets for 2026"
                          value={newBlogTitle}
                          onChange={(e) => setNewBlogTitle(e.target.value)}
                          className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-600 mb-1">Category</label>
                        <select
                          value={newBlogCategory}
                          onChange={(e) => setNewBlogCategory(e.target.value as any)}
                          className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900"
                        >
                          <option value="Graphic Design">Graphic Design</option>
                          <option value="UI/UX & Figma">UI/UX &amp; Figma</option>
                          <option value="Video & Motion">Video &amp; Motion</option>
                          <option value="Design & Code">Design &amp; Code</option>
                          <option value="Branding">Branding</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-600 mb-1">Meta Excerpt / Summary</label>
                      <input
                        type="text"
                        placeholder="1-2 sentences summarizing the article for Google Search snippet..."
                        value={newBlogExcerpt}
                        onChange={(e) => setNewBlogExcerpt(e.target.value)}
                        className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-600 mb-1">Tags (Comma-separated)</label>
                        <input
                          type="text"
                          value={newBlogTags}
                          onChange={(e) => setNewBlogTags(e.target.value)}
                          className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-neutral-600 mb-1">SEO Keywords (Comma-separated)</label>
                        <input
                          type="text"
                          value={newBlogKeywords}
                          onChange={(e) => setNewBlogKeywords(e.target.value)}
                          className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-600 mb-1">Article Content (Markdown supported)</label>
                      <textarea
                        rows={4}
                        placeholder="## Main Section\n\nDetailed breakdown of typography, color grading, or software pipeline..."
                        value={newBlogContent}
                        onChange={(e) => setNewBlogContent(e.target.value)}
                        className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 resize-none font-mono"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-1.5 bg-neutral-900 hover:bg-black text-white px-5 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Publish Article</span>
                      </button>
                    </div>
                  </form>

                  <div className="space-y-3">
                    {blogPosts.map((post) => (
                      <div key={post.id} className="p-4 bg-[#FAF9F6] rounded-xl border border-neutral-200 flex items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400 mb-1">
                            <span className="bg-white px-2 py-0.5 rounded border border-neutral-200 text-neutral-700 font-sans">{post.category}</span>
                            <span>{post.publishedDate}</span>
                            <span>&bull;</span>
                            <span>{post.readTime}</span>
                          </div>
                          <h5 className="text-sm font-bold text-neutral-900">{post.title}</h5>
                          <p className="text-xs text-neutral-500 line-clamp-1">{post.excerpt}</p>
                        </div>

                        <button
                          onClick={() => handleDeleteBlogPost(post.id)}
                          className="p-1.5 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 rounded-lg transition-colors cursor-pointer shrink-0"
                          title="Delete article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: CONTACT & EMAILJS CONFIGURATION */}
              {activeTab === 'settings' && (
                <form onSubmit={handleSaveContactSettings} className="space-y-5 max-w-xl">
                  <div className="p-4 bg-[#FAF9F6] rounded-2xl border border-neutral-200 mb-4">
                    <h4 className="text-sm font-bold text-neutral-900 mb-1">EmailJS &amp; Direct Communication</h4>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      Configure your direct email, WhatsApp phone number, and optional custom EmailJS credentials. All contact inquiries send directly through these channels.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Designer Direct Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={settingsEmail}
                      onChange={(e) => setSettingsEmail(e.target.value)}
                      className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900"
                    />
                    <span className="text-[11px] text-neutral-400 mt-1 block">
                      Updating here updates the email across the entire portfolio (Header, Contact card, and forms).
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      WhatsApp Number (with country code) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 919061559799"
                      value={settingsWhatsApp}
                      onChange={(e) => setSettingsWhatsApp(e.target.value)}
                      className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 font-mono"
                    />
                  </div>

                  <div className="pt-2 border-t border-neutral-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-500">EmailJS Service Keys</h5>
                      <span className="text-[11px] text-neutral-400">Used for auto-forwarding inquiries to your inbox</span>
                    </div>

                    {/* Step-by-step Setup Helper Box */}
                    <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs space-y-2 text-neutral-600">
                      <div className="font-semibold text-neutral-900 flex items-center gap-1.5">
                        <span>Setup Guide (3 Steps on emailjs.com):</span>
                      </div>
                      <ol className="list-decimal pl-4 space-y-1 text-[11px] leading-relaxed">
                        <li>
                          <strong>Email Services:</strong> Click <em>Add New Service</em> &rarr; choose <em>Gmail</em> (or your provider), connect it, then copy your <strong>Service ID</strong> below.
                        </li>
                        <li>
                          <strong>Email Templates:</strong> Click <em>Create New Template</em>. In the template body, use variables: <code className="bg-neutral-200/70 px-1 py-0.5 rounded text-neutral-800 font-mono">{"{{from_name}}"}</code>, <code className="bg-neutral-200/70 px-1 py-0.5 rounded text-neutral-800 font-mono">{"{{reply_to}}"}</code>, <code className="bg-neutral-200/70 px-1 py-0.5 rounded text-neutral-800 font-mono">{"{{project_type}}"}</code>, <code className="bg-neutral-200/70 px-1 py-0.5 rounded text-neutral-800 font-mono">{"{{message}}"}</code>. Set <em>To Email</em> to your email, save, and copy your <strong>Template ID</strong>.
                        </li>
                        <li>
                          <strong>Public Key:</strong> In EmailJS go to <em>Account &rarr; API Keys</em> and copy your <strong>Public Key</strong>.
                        </li>
                      </ol>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-600 mb-1">EmailJS Service ID</label>
                      <input
                        type="text"
                        placeholder="service_xxxxxxx"
                        value={emailJsServiceId}
                        onChange={(e) => setEmailJsServiceId(e.target.value)}
                        className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-neutral-900 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-600 mb-1">EmailJS Template ID</label>
                      <input
                        type="text"
                        placeholder="template_xxxxxxx"
                        value={emailJsTemplateId}
                        onChange={(e) => setEmailJsTemplateId(e.target.value)}
                        className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-neutral-900 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-neutral-600 mb-1">EmailJS Public Key</label>
                      <input
                        type="text"
                        placeholder="your_emailjs_public_key"
                        value={emailJsPublicKey}
                        onChange={(e) => setEmailJsPublicKey(e.target.value)}
                        className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-neutral-900 font-mono"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-black text-white px-6 py-2.5 rounded-full text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Settings</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB: ADMINCONTROL BACKUP & SYSTEM RESTORE */}
              {activeTab === 'backup' && (
                <div className="space-y-6 max-w-3xl">
                  <div className="bg-[#FAF9F6] border border-neutral-200 rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                        <Database className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-neutral-900">admincontrol System Backup &amp; Archive</h4>
                        <p className="text-xs text-neutral-500">
                          Export complete portfolio state, showcase items, tools, SEO architecture, and contact configs to JSON.
                        </p>
                      </div>
                    </div>

                    {backupRestoreError && (
                      <div className="mt-3 p-3 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-200 font-medium">
                        {backupRestoreError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                      {/* Export card */}
                      <div className="bg-white p-5 rounded-2xl border border-neutral-200 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-neutral-900 font-bold text-sm mb-1.5">
                            <Download className="w-4 h-4 text-emerald-600" />
                            <span>Export Full Backup</span>
                          </div>
                          <p className="text-xs text-neutral-500 leading-relaxed mb-4">
                            Creates a downloadable JSON archive of all projects, tools, blog articles, SEO settings, and contact credentials.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleExportBackup}
                          className="w-full inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-black text-white text-xs font-semibold py-2.5 rounded-xl transition-colors cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download typixel_admincontrol_backup.json</span>
                        </button>
                      </div>

                      {/* Import card */}
                      <div className="bg-white p-5 rounded-2xl border border-neutral-200 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-neutral-900 font-bold text-sm mb-1.5">
                            <Upload className="w-4 h-4 text-blue-600" />
                            <span>Restore from Backup</span>
                          </div>
                          <p className="text-xs text-neutral-500 leading-relaxed mb-4">
                            Upload a previously exported <code className="text-neutral-700 font-mono font-semibold">admincontrol</code> JSON backup file to restore your portfolio instantly.
                          </p>
                        </div>
                        <label className="w-full inline-flex items-center justify-center gap-2 bg-[#F5F4F0] hover:bg-[#EAE8E2] text-neutral-800 text-xs font-semibold py-2.5 rounded-xl border border-neutral-300/80 transition-colors cursor-pointer text-center">
                          <Upload className="w-3.5 h-3.5 text-neutral-700" />
                          <span>Select JSON Backup File</span>
                          <input
                            type="file"
                            accept=".json,application/json"
                            onChange={handleImportBackup}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>

                    {/* Stats summary */}
                    <div className="mt-6 pt-5 border-t border-neutral-200/70 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div className="bg-white p-3 rounded-xl border border-neutral-100">
                        <span className="block text-lg font-bold text-neutral-900 font-mono">
                          {row1Projects.length + row2Projects.length}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-neutral-400">Showcase Items</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-neutral-100">
                        <span className="block text-lg font-bold text-neutral-900 font-mono">
                          {tools.length}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-neutral-400">Software Tools</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-neutral-100">
                        <span className="block text-lg font-bold text-neutral-900 font-mono">
                          {blogPosts.length}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-neutral-400">SEO Articles</span>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-neutral-100">
                        <span className="block text-lg font-bold text-emerald-600 font-mono">
                          Active
                        </span>
                        <span className="text-[10px] uppercase font-bold text-neutral-400">admincontrol</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Footer Note */}
          <footer className="text-center py-4 text-xs text-neutral-500 flex items-center justify-center gap-2">
            <span>Typixel admincontrol</span>
            <span>•</span>
            <span>All changes are live in real-time</span>
            <span>•</span>
            <button onClick={onClose} className="hover:text-neutral-900 underline cursor-pointer">
              Return to Portfolio
            </button>
          </footer>
        </div>
      )}

      {/* ================= EDIT SHOWCASE MODAL ================= */}
        {editingProject && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div
              className="bg-white rounded-[24px] sm:rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-neutral-200 text-neutral-900"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-2">
                  <Pencil className="w-4 h-4 text-neutral-700" />
                  <h4 className="text-base font-bold text-neutral-900">Edit Showcase Poster</h4>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveEditProject} className="p-6 overflow-y-auto space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Subtitle / Tagline
                    </label>
                    <input
                      type="text"
                      value={editSubtitle}
                      onChange={(e) => setEditSubtitle(e.target.value)}
                      className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Category
                    </label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none"
                    >
                      <option value="Event Branding & Poster">Event Branding &amp; Poster</option>
                      <option value="Matchday Sports Poster">Matchday Sports Poster</option>
                      <option value="Editorial Typography">Editorial Typography</option>
                      <option value="Digital Artwork & Manipulation">Digital Artwork &amp; Manipulation</option>
                      <option value="Product & Packaging Mockup">Product &amp; Packaging Mockup</option>
                      <option value="Social Media Campaign">Social Media Campaign</option>
                      <option value="Visual Identity & Logo">Visual Identity &amp; Logo</option>
                      <option value="Logo Design & Identity">Logo Design &amp; Identity</option>
                      <option value="Motion Graphic Poster">Motion Graphic Poster</option>
                      <option value="Other">Other (Custom)...</option>
                    </select>
                  </div>

                  {editCategory === 'Other' && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                        Custom Type Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={editCustomCategory}
                        onChange={(e) => setEditCustomCategory(e.target.value)}
                        className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Top-Right Badge / Tag
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Logo Lockup, Artboard Series"
                      value={editBadge}
                      onChange={(e) => setEditBadge(e.target.value)}
                      className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Marquee Row
                    </label>
                    <select
                      value={editRow}
                      onChange={(e) => setEditRow(Number(e.target.value) as 1 | 2)}
                      className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none"
                    >
                      <option value={1}>Row 1 (Slides Left)</option>
                      <option value={2}>Row 2 (Slides Right)</option>
                    </select>
                  </div>
                </div>

                {/* Media Artwork */}
                <div className="pt-2 border-t border-neutral-100 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
                      Cover Image / Artwork
                    </label>
                    <div className="flex items-center gap-1.5 text-[11px] bg-neutral-100 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setEditMediaMode('preset')}
                        className={`px-2.5 py-0.5 rounded-lg cursor-pointer transition-colors ${
                          editMediaMode === 'preset'
                            ? 'bg-white text-neutral-900 font-bold shadow-xs'
                            : 'text-neutral-500 hover:text-neutral-900'
                        }`}
                      >
                        ⭐ Preset Assets
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditMediaMode('upload')}
                        className={`px-2.5 py-0.5 rounded-lg cursor-pointer transition-colors ${
                          editMediaMode === 'upload'
                            ? 'bg-white text-neutral-900 font-bold shadow-xs'
                            : 'text-neutral-500 hover:text-neutral-900'
                        }`}
                      >
                        📁 Upload File
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditMediaMode('link')}
                        className={`px-2.5 py-0.5 rounded-lg cursor-pointer transition-colors ${
                          editMediaMode === 'link'
                            ? 'bg-white text-neutral-900 font-bold shadow-xs'
                            : 'text-neutral-500 hover:text-neutral-900'
                        }`}
                      >
                        🔗 Image / Video Link
                      </button>
                    </div>
                  </div>

                  {editMediaMode === 'preset' && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-5 gap-2">
                        {SHOWCASE_PRESET_IMAGES.map((preset) => (
                          <button
                            key={preset.filename}
                            type="button"
                            onClick={() => handleSelectPreset(preset, true)}
                            className={`p-1 rounded-lg border text-left cursor-pointer transition-all ${
                              editImageUrl === preset.path
                                ? 'border-neutral-900 bg-neutral-900 text-white ring-2 ring-neutral-900/20'
                                : 'border-neutral-200 bg-neutral-50 hover:bg-white text-neutral-800'
                            }`}
                          >
                            <div className="w-full aspect-[4/5] rounded overflow-hidden bg-neutral-900 mb-1">
                              <img src={preset.path} alt={preset.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-[10px] font-bold truncate block">{preset.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {editMediaMode === 'upload' && (
                    <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 space-y-2">
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          accept="image/*,video/mp4,video/webm,video/quicktime"
                          onChange={(e) => handleProjectFileUpload(e, true)}
                          className="w-full text-xs text-neutral-600 file:mr-3 file:py-2 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-neutral-900 file:text-white hover:file:bg-black file:cursor-pointer bg-white border border-neutral-200 rounded-xl p-1"
                        />
                        {editImageUrl && (
                          <div className="w-12 h-14 rounded-lg overflow-hidden border border-neutral-200 shrink-0 bg-neutral-900 shadow-xs">
                            {isVideoMediaUrl(editImageUrl) ? (
                              <video
                                src={normalizeShowcaseImagePath(editImageUrl)}
                                muted
                                autoPlay
                                loop
                                playsInline
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <img src={normalizeShowcaseImagePath(editImageUrl)} alt="Preview" className="w-full h-full object-cover" />
                            )}
                          </div>
                        )}
                      </div>
                      {editUploadError && (
                        <p className="text-[11px] text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-2.5 py-1.5 font-medium">
                          {editUploadError}
                        </p>
                      )}
                      <p className="text-[11px] text-neutral-500">
                        ✓ Images auto-compress &amp; publish live to all visitors. For HD videos (&gt;600 KB), use the Image / Video Link tab.
                      </p>
                    </div>
                  )}

                  {editMediaMode === 'link' && (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="https://... (.jpg, .png, .webp, .mp4 or GitHub raw link)"
                        value={editImageUrl}
                        onChange={(e) => {
                          setEditImageUrl(e.target.value);
                          setEditUploadError('');
                        }}
                        className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none font-mono"
                      />
                      {editImageUrl && (
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-12 rounded-lg overflow-hidden border border-neutral-200 shrink-0 bg-neutral-900 shadow-xs">
                            {isVideoMediaUrl(editImageUrl) ? (
                              <video
                                src={normalizeShowcaseImagePath(editImageUrl)}
                                poster={editVideoPosterUrl ? normalizeShowcaseImagePath(editVideoPosterUrl) : undefined}
                                muted
                                autoPlay
                                loop
                                playsInline
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <img src={normalizeShowcaseImagePath(editImageUrl)} alt="Preview" className="w-full h-full object-cover" />
                            )}
                          </div>
                          <span className="text-[11px] text-neutral-500 font-mono truncate">{normalizeShowcaseImagePath(editImageUrl)}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {isVideoMediaUrl(editImageUrl) && (
                    <div className="pt-1">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                        Optional Video Poster / Cover Image URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://... (optional poster image while video loads)"
                        value={editVideoPosterUrl}
                        onChange={(e) => setEditVideoPosterUrl(e.target.value)}
                        className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-neutral-900 font-mono"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-full transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCloudSyncing}
                    className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold bg-neutral-900 hover:bg-black disabled:opacity-60 text-white rounded-full transition-all cursor-pointer shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isCloudSyncing ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </div>
  );
};

export const AdminPage = AdminPanel;