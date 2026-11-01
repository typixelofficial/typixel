import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Plus,
  Trash2,
  RotateCcw,
  Layers,
  CheckCircle,
  Eye,
  EyeOff,
  LogOut,
  KeyRound,
  Mail,
  Save,
  Wrench,
  BookOpen,
  Pencil
} from 'lucide-react';
import {
  ShowcaseItem,
  saveProjectsToStorage,
  resetProjectsToDefault,
  SHOWCASE_ROW_1,
  SHOWCASE_ROW_2
} from '../data/showcaseData.ts';
import { ContactConfig, saveContactConfigToStorage } from '../data/contactConfig.ts';
import { ExperiencedTool, DEFAULT_TOOLS, saveToolsToStorage, resetToolsToDefault } from '../data/toolsData.ts';
import { BlogPost, DEFAULT_BLOG_POSTS, saveBlogPostsToStorage, resetBlogPostsToDefault } from '../data/blogData.ts';
import { AppLogo } from './AppLogo.tsx';

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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Always require login when opening the admin panel: never jump directly to interface
  useEffect(() => {
    if (isOpen) {
      setIsAuthenticated(false);
      setUsername('');
      setPassword('');
      setLoginError('');
      setAuthView('login');
      try {
        localStorage.removeItem('kawsar_admin_auth');
      } catch {}
    }
  }, [isOpen]);

  // Auth & Password states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [authView, setAuthView] = useState<'login' | 'forgot'>('login');

  // Forgot Password state
  const [recoveryInput, setRecoveryInput] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [forgotError, setForgotError] = useState('');

  // Change Password Modal inside Admin
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [changeNewPassword, setChangeNewPassword] = useState('');
  const [changeConfirmPassword, setChangeConfirmPassword] = useState('');
  const [showChangeNewPassword, setShowChangeNewPassword] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState('');

  // Admin Dashboard Tabs & Toast
  type AdminTab = 'add' | 'manage' | 'tools' | 'blog' | 'settings';
  const [activeTab, setActiveTab] = useState<AdminTab>('add');
  const [successToast, setSuccessToast] = useState('');

  // Form state for adding new project
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newCategory, setNewCategory] = useState('Event Branding & Poster');
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [newYear, setNewYear] = useState('2026');
  const [newRow, setNewRow] = useState<1 | 2>(1);
  const [newMediaType, setNewMediaType] = useState<'image' | 'video'>('image');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newDimensions, setNewDimensions] = useState('1080 × 1350 px (Digital Poster)');
  const [newTools, setNewTools] = useState('Adobe Illustrator, Photoshop');
  const [newLanguages, setNewLanguages] = useState('English, Malayalam');
  const [newDescription, setNewDescription] = useState('');
  const [newKeyFeatures, setNewKeyFeatures] = useState('Custom typography, High-contrast visual structure, Multi-format rollout');

  // Form state for editing existing showcase project
  const [editingProject, setEditingProject] = useState<ShowcaseItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editClient, setEditClient] = useState('');
  const [editCategory, setEditCategory] = useState('Event Branding & Poster');
  const [editCustomCategory, setEditCustomCategory] = useState('');
  const [editYear, setEditYear] = useState('2026');
  const [editRow, setEditRow] = useState<1 | 2>(1);
  const [editMediaType, setEditMediaType] = useState<'image' | 'video'>('image');
  const [editVideoUrl, setEditVideoUrl] = useState('');
  const [editDuration, setEditDuration] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editDimensions, setEditDimensions] = useState('');
  const [editTools, setEditTools] = useState('');
  const [editLanguages, setEditLanguages] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editKeyFeatures, setEditKeyFeatures] = useState('');

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

  if (!isOpen) return null;

  const getStoredPassword = (): string => {
    return localStorage.getItem('kawsar_admin_custom_pwd') || 'admin123';
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPwd = getStoredPassword();

    const validUser =
      username.trim().toLowerCase() === 'admin' ||
      username.trim().toLowerCase() === 'typixel' ||
      username.trim().toLowerCase() === 'typixwl' ||
      username.trim().toLowerCase() === 'kawsar';
    const validPwd =
      password === storedPwd ||
      (password === 'design2026' && (username.trim().toLowerCase() === 'typixel' || username.trim().toLowerCase() === 'typixwl' || username.trim().toLowerCase() === 'kawsar'));

    if (validUser && validPwd) {
      setIsAuthenticated(true);
      localStorage.setItem('kawsar_admin_auth', 'true');
      setLoginError('');
      setUsername('');
      setPassword('');
    } else {
      setLoginError('Invalid credentials. Please verify username and password.');
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanRecovery = recoveryInput.trim().toLowerCase();

    if (
      cleanRecovery === 'typixelofficial@gmail.com' ||
      cleanRecovery === 'hashimtypixel@gmail.com' ||
      cleanRecovery === 'kawsarv.design@gmail.com' ||
      cleanRecovery === contactConfig.email.toLowerCase() ||
      cleanRecovery === 'admin' ||
      cleanRecovery === 'typixel' ||
      cleanRecovery === 'typixwl' ||
      cleanRecovery === 'kawsar' ||
      cleanRecovery === '2026'
    ) {
      if (forgotNewPassword.length < 4) {
        setForgotError('New password must be at least 4 characters long.');
        return;
      }
      localStorage.setItem('kawsar_admin_custom_pwd', forgotNewPassword);
      setSuccessToast('Password successfully reset! You can now log in.');
      setAuthView('login');
      setPassword(forgotNewPassword);
      setForgotError('');
      setRecoveryInput('');
      setForgotNewPassword('');
    } else {
      setForgotError('Recovery identifier does not match your registered email or admin username.');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const currentStored = getStoredPassword();

    if (currentPasswordInput !== currentStored) {
      setChangePasswordError('Current password is incorrect.');
      return;
    }

    if (changeNewPassword.length < 4) {
      setChangePasswordError('New password must be at least 4 characters long.');
      return;
    }

    if (changeNewPassword !== changeConfirmPassword) {
      setChangePasswordError('New passwords do not match.');
      return;
    }

    localStorage.setItem('kawsar_admin_custom_pwd', changeNewPassword);
    setIsChangePasswordOpen(false);
    setCurrentPasswordInput('');
    setChangeNewPassword('');
    setChangeConfirmPassword('');
    setChangePasswordError('');
    setSuccessToast('Admin password changed successfully!');
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('kawsar_admin_auth');
  };

  // --- Project Add / Edit / Delete ---
  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const resolvedCategory =
      newCategory === 'Other'
        ? (customCategoryName.trim() || 'Custom Project')
        : newCategory;

    const newItem: ShowcaseItem = {
      id: `proj-${Date.now()}`,
      title: newTitle.trim(),
      subtitle: newSubtitle.trim() || 'Visual Branding & Creative Poster Art',
      client: newClient.trim() || 'Studio Commission',
      category: resolvedCategory,
      year: newYear.trim() || '2026',
      githubUrl: 'https://github.com/typixelofficial/portfolio',
      badge: newMediaType === 'video' ? 'Autoplay Reel' : 'New Work',
      accentColor: newMediaType === 'video' ? '#8B5CF6' : '#171717',
      aspect: newMediaType === 'video' ? '9/16' : '4/5',
      dimensions: newDimensions.trim() || (newMediaType === 'video' ? '1080 × 1920 px (Reel)' : '1080 × 1350 px (Digital)'),
      tools: newTools.split(',').map((t) => t.trim()).filter(Boolean),
      description:
        newDescription.trim() ||
        'Custom creative work from GitHub repository designed with high-impact typography and distinctive art direction.',
      keyFeatures: newKeyFeatures.split(',').map((f) => f.trim()).filter(Boolean),
      languages: newLanguages.split(',').map((l) => l.trim()).filter(Boolean),
      imageUrl: newImageUrl.trim() || undefined,
      mediaType: newMediaType,
      videoUrl: newVideoUrl.trim() || undefined,
      duration: newDuration.trim() || undefined,
      type: newMediaType === 'video' ? 'video' : 'custom',
      row: newRow
    };

    let updatedRow1 = [...row1Projects];
    let updatedRow2 = [...row2Projects];

    if (newRow === 1) {
      updatedRow1 = [newItem, ...updatedRow1];
    } else {
      updatedRow2 = [newItem, ...updatedRow2];
    }

    saveProjectsToStorage(updatedRow1, updatedRow2);
    onProjectsUpdated(updatedRow1, updatedRow2);

    setNewTitle('');
    setNewSubtitle('');
    setNewClient('');
    setNewImageUrl('');
    setNewVideoUrl('');
    setNewDuration('');
    setNewDescription('');
    setCustomCategoryName('');

    setSuccessToast(`Project "${newItem.title}" added to Row ${newRow}!`);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleStartEditProject = (item: ShowcaseItem & { assignedRow: number }) => {
    setEditingProject(item);
    setEditTitle(item.title);
    setEditSubtitle(item.subtitle);
    setEditClient(item.client);

    const standardCategories = [
      'Event Branding & Poster',
      'Matchday Sports Poster',
      'Editorial Typography',
      'Digital Artwork & Manipulation',
      'Product & Packaging Mockup',
      'Social Media Campaign',
      'Visual Identity & Logo',
      'Motion Graphic Poster'
    ];

    if (standardCategories.includes(item.category)) {
      setEditCategory(item.category);
      setEditCustomCategory('');
    } else {
      setEditCategory('Other');
      setEditCustomCategory(item.category);
    }

    setEditYear(item.year);
    setEditRow(item.assignedRow as 1 | 2);
    setEditMediaType(item.mediaType || (item.videoUrl ? 'video' : 'image'));
    setEditVideoUrl(item.videoUrl || '');
    setEditDuration(item.duration || '');
    setEditImageUrl(item.imageUrl || '');
    setEditDimensions(item.dimensions);
    setEditTools(item.tools.join(', '));
    setEditLanguages(item.languages.join(', '));
    setEditDescription(item.description);
    setEditKeyFeatures(item.keyFeatures.join(', '));
  };

  const handleSaveEditProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    const resolvedCategory =
      editCategory === 'Other'
        ? (editCustomCategory.trim() || 'Custom Project')
        : editCategory;

    const updatedItem: ShowcaseItem = {
      ...editingProject,
      title: editTitle.trim() || editingProject.title,
      subtitle: editSubtitle.trim() || editingProject.subtitle,
      client: editClient.trim() || editingProject.client,
      category: resolvedCategory,
      year: editYear.trim() || editingProject.year,
      dimensions: editDimensions.trim() || editingProject.dimensions,
      tools: editTools.split(',').map((t) => t.trim()).filter(Boolean),
      languages: editLanguages.split(',').map((l) => l.trim()).filter(Boolean),
      description: editDescription.trim() || editingProject.description,
      keyFeatures: editKeyFeatures.split(',').map((f) => f.trim()).filter(Boolean),
      imageUrl: editImageUrl.trim() || undefined,
      mediaType: editMediaType,
      videoUrl: editVideoUrl.trim() || undefined,
      duration: editDuration.trim() || undefined,
      row: editRow
    };

    // Remove old item from both rows
    let updatedRow1 = row1Projects.filter((p) => p.id !== editingProject.id);
    let updatedRow2 = row2Projects.filter((p) => p.id !== editingProject.id);

    // Place into target row
    if (editRow === 1) {
      updatedRow1 = [updatedItem, ...updatedRow1];
    } else {
      updatedRow2 = [updatedItem, ...updatedRow2];
    }

    saveProjectsToStorage(updatedRow1, updatedRow2);
    onProjectsUpdated(updatedRow1, updatedRow2);

    setEditingProject(null);
    setSuccessToast(`Project "${updatedItem.title}" updated successfully!`);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleDeleteProject = (id: string) => {
    const updatedRow1 = row1Projects.filter((p) => p.id !== id);
    const updatedRow2 = row2Projects.filter((p) => p.id !== id);
    saveProjectsToStorage(updatedRow1, updatedRow2);
    onProjectsUpdated(updatedRow1, updatedRow2);
    setSuccessToast('Project deleted successfully.');
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleResetProjectsToDefault = () => {
    if (confirm('Reset showcase items to original 12 posters?')) {
      resetProjectsToDefault();
      onProjectsUpdated(SHOWCASE_ROW_1, SHOWCASE_ROW_2);
      setSuccessToast('Showcase reset to 12 original projects.');
      setTimeout(() => setSuccessToast(''), 3000);
    }
  };

  // --- Experienced Tools Add / Delete ---
  const handleAddTool = (e: React.FormEvent) => {
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
    saveToolsToStorage(updated);
    if (onToolsUpdated) onToolsUpdated(updated);

    setNewToolName('');
    setNewToolBadge('');
    setNewToolDescription('');
    setNewToolIconUrl('');
    setSuccessToast(`Software "${newTool.name}" added successfully.`);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleDeleteTool = (id: string) => {
    const updated = tools.filter((t) => t.id !== id);
    saveToolsToStorage(updated);
    if (onToolsUpdated) onToolsUpdated(updated);
    setSuccessToast('Software removed.');
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleResetTools = () => {
    if (confirm('Reset to 12 standard core software tools?')) {
      const reset = resetToolsToDefault();
      if (onToolsUpdated) onToolsUpdated(reset);
      setSuccessToast('Reset to 12 default tools.');
      setTimeout(() => setSuccessToast(''), 3000);
    }
  };

  // --- Blog Posts Add / Delete ---
  const handleAddBlogPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogTitle.trim()) return;

    const slug = newBlogTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newPost: BlogPost = {
      id: `blog-${Date.now()}`,
      slug,
      title: newBlogTitle.trim(),
      excerpt: newBlogExcerpt.trim() || 'In-depth industry tutorial and workflow breakdown.',
      content: newBlogContent.trim() || '## Overview\n\nFull article breakdown and high-impact design strategies.',
      category: newBlogCategory,
      readTime: newBlogReadTime || '5 min read',
      publishedDate: 'Feb 2026',
      tags: newBlogTags.split(',').map((t) => t.trim()).filter(Boolean),
      seoKeywords: newBlogKeywords.split(',').map((k) => k.trim()).filter(Boolean),
      author: {
        name: 'Kawsar Ahmed',
        role: 'Brand & Digital Product Designer',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80'
      },
      views: 120
    };

    const updated = [newPost, ...blogPosts];
    saveBlogPostsToStorage(updated);
    if (onBlogPostsUpdated) onBlogPostsUpdated(updated);

    setNewBlogTitle('');
    setNewBlogExcerpt('');
    setNewBlogContent('');
    setSuccessToast(`Article "${newPost.title}" published!`);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleDeleteBlogPost = (id: string) => {
    const updated = blogPosts.filter((p) => p.id !== id);
    saveBlogPostsToStorage(updated);
    if (onBlogPostsUpdated) onBlogPostsUpdated(updated);
    setSuccessToast('Article removed.');
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleResetBlog = () => {
    if (confirm('Reset articles to default SEO ranking guides?')) {
      const reset = resetBlogPostsToDefault();
      if (onBlogPostsUpdated) onBlogPostsUpdated(reset);
      setSuccessToast('Reset to default SEO articles.');
      setTimeout(() => setSuccessToast(''), 3000);
    }
  };

  // --- Contact & EmailJS Settings ---
  const handleSaveContactSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedConfig: ContactConfig = {
      email: settingsEmail.trim(),
      whatsappNumber: settingsWhatsApp.trim()
    };
    saveContactConfigToStorage(updatedConfig.email, updatedConfig.whatsappNumber);
    onContactConfigUpdated(updatedConfig);

    localStorage.setItem('kawsar_emailjs_service_id', emailJsServiceId.trim());
    localStorage.setItem('kawsar_emailjs_template_id', emailJsTemplateId.trim());
    localStorage.setItem('kawsar_emailjs_public_key', emailJsPublicKey.trim());

    setSuccessToast('Contact channels & EmailJS settings saved.');
    setTimeout(() => setSuccessToast(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-[28px] sm:rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-neutral-200 text-neutral-900 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="px-6 sm:px-8 py-5 border-b border-neutral-100 flex items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center shadow-xs">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-neutral-900 leading-tight">
                Admin Control Room
              </h3>
              <p className="text-xs text-neutral-500">
                Showcase Posters, Software Tools, Blog &amp; Contact
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                <button
                  onClick={() => setIsChangePasswordOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-800 hover:text-black bg-[#F5F4F0] hover:bg-[#EAE8E2] border border-neutral-200/80 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5 text-neutral-700" />
                  <span className="hidden sm:inline">Password</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-800 hover:text-black bg-[#F5F4F0] hover:bg-[#EAE8E2] border border-neutral-200/80 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-neutral-700" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="bg-neutral-900 text-white px-6 py-2.5 flex items-center gap-2 text-xs font-medium">
            <CheckCircle className="w-4 h-4 text-white shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Auth Barrier if not logged in */}
        {!isAuthenticated ? (
          <div className="p-8 sm:p-12 flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full text-center">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-800 mb-4 border border-neutral-200">
              <Lock className="w-6 h-6" />
            </div>

            <h4 className="text-xl font-bold text-neutral-900 mb-1">
              Admin Access
            </h4>
            <p className="text-xs text-neutral-500 mb-6">
              Enter your admin credentials to manage portfolio items and settings.
            </p>

            {authView === 'login' ? (
              <form onSubmit={handleLogin} className="w-full space-y-4">
                {loginError && (
                  <div className="p-3 bg-neutral-100 text-neutral-800 text-xs rounded-xl border border-neutral-300 text-left font-medium">
                    {loginError}
                  </div>
                )}

                <div className="text-left space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="admin or typixel"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 pr-10 text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-neutral-900 hover:bg-black text-white text-xs font-semibold py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer mt-2"
                >
                  Log In
                </button>

                <div className="pt-2 text-xs text-neutral-400 text-center">
                  <button
                    type="button"
                    onClick={() => setAuthView('forgot')}
                    className="hover:text-neutral-700 underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleForgotPassword} className="w-full space-y-4 text-left">
                <h4 className="text-lg font-bold text-neutral-900">Reset Admin Password</h4>
                <p className="text-xs text-neutral-500">
                  Enter your registered portfolio email ({contactConfig.email}) or admin username.
                </p>

                {forgotError && (
                  <div className="p-3 bg-neutral-100 text-neutral-800 text-xs rounded-xl border border-neutral-300">
                    {forgotError}
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    Recovery Email or Username
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={contactConfig.email}
                    value={recoveryInput}
                    onChange={(e) => setRecoveryInput(e.target.value)}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showForgotNewPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter at least 4 characters"
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 pr-10 text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowForgotNewPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                    >
                      {showForgotNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setAuthView('login')}
                    className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold py-2.5 rounded-xl cursor-pointer"
                  >
                    Back to Login
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-neutral-900 hover:bg-black text-white text-xs font-semibold py-2.5 rounded-xl cursor-pointer"
                  >
                    Reset &amp; Login
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* Logged In Dashboard with 5 Tabs */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Tab Navigation */}
            <div className="px-6 sm:px-8 pt-3 pb-2 flex items-center gap-2 border-b border-neutral-100 bg-white overflow-x-auto scrollbar-none">
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
            </div>

            {/* Tab Body */}
            <div className="p-6 sm:p-8 overflow-y-auto flex-1">
              {/* TAB 1: ADD NEW SHOWCASE PROJECT */}
              {activeTab === 'add' && (
                <form onSubmit={handleAddProject} className="space-y-5 max-w-3xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. AFC Champions Cup Final"
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
                        placeholder="e.g. Official Matchday Event Poster"
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
                        <option value="Matchday Sports Poster">Matchday Sports Poster</option>
                        <option value="Editorial Typography">Editorial Typography</option>
                        <option value="Digital Artwork & Manipulation">Digital Artwork &amp; Manipulation</option>
                        <option value="Product & Packaging Mockup">Product &amp; Packaging Mockup</option>
                        <option value="Social Media Campaign">Social Media Campaign</option>
                        <option value="Visual Identity & Logo">Visual Identity &amp; Logo</option>
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
                        Client / Commission
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. AFC Football Confederation"
                        value={newClient}
                        onChange={(e) => setNewClient(e.target.value)}
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                        Media Format Type
                      </label>
                      <select
                        value={newMediaType}
                        onChange={(e) => setNewMediaType(e.target.value as 'image' | 'video')}
                        className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 font-semibold"
                      >
                        <option value="image">🎨 Static Image / Poster</option>
                        <option value="video">🎬 Motion Video (.mp4 Reel)</option>
                      </select>
                    </div>

                    {newMediaType === 'video' ? (
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                          Video Duration (e.g. 0:28)
                        </label>
                        <input
                          type="text"
                          placeholder="0:28"
                          value={newDuration}
                          onChange={(e) => setNewDuration(e.target.value)}
                          className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                          Cover Thumbnail Image URL
                        </label>
                        <input
                          type="text"
                          placeholder="/Works/posters/... or URL"
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none"
                        />
                      </div>
                    )}
                  </div>

                  {newMediaType === 'video' && (
                    <div className="space-y-2 bg-purple-50/70 p-3.5 rounded-xl border border-purple-200/70">
                      <label className="block text-xs font-bold uppercase tracking-wider text-purple-900">
                        Video File URL (.mp4) *
                      </label>
                      <input
                        type="text"
                        placeholder="/Works/videos/... or external mp4 URL"
                        value={newVideoUrl}
                        onChange={(e) => setNewVideoUrl(e.target.value)}
                        className="w-full text-xs bg-white border border-purple-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:outline-none"
                      />
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-neutral-600">
                        <span className="font-semibold text-purple-800">GitHub Presets:</span>
                        <button
                          type="button"
                          onClick={() => {
                            setNewVideoUrl('/Works/videos/typixelofficial_1760175085_3740939313467748252_75216449649.mp4');
                            setNewImageUrl('/Works/videos/thumb_1.jpg');
                            setNewDuration('0:28');
                          }}
                          className="px-2 py-0.5 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded font-mono"
                        >
                          Stage Reel (0:28)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setNewVideoUrl('/Works/videos/typixelofficial_1779419557_3902376391340334772_75216449649.mp4');
                            setNewImageUrl('/Works/videos/thumb_2.jpg');
                            setNewDuration('0:24');
                          }}
                          className="px-2 py-0.5 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded font-mono"
                        >
                          Press Cut (0:24)
                        </button>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Creative Concept &amp; Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe the typography choices, inspiration, grid structure, and visual treatment..."
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-black text-white px-6 py-2.5 rounded-full text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add to Showcase</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: MANAGE SHOWCASE PROJECTS */}
              {activeTab === 'manage' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-neutral-500">
                      View, edit, delete, or reset all current items in Row 1 &amp; Row 2.
                    </p>
                    <button
                      onClick={handleResetProjectsToDefault}
                      className="inline-flex items-center gap-1.5 text-xs text-neutral-700 hover:text-black bg-[#F5F4F0] hover:bg-[#EAE8E2] border border-neutral-200/80 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-neutral-700" />
                      <span>Reset to 12 Originals</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...row1Projects.map((p) => ({ ...p, assignedRow: 1 })), ...row2Projects.map((p) => ({ ...p, assignedRow: 2 }))].map((item) => (
                      <div key={item.id} className="bg-[#FAF9F6] p-4 rounded-2xl border border-neutral-200 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400 mb-1.5">
                            <span className="bg-white px-2 py-0.5 rounded border border-neutral-200 text-neutral-700">
                              Row {item.assignedRow}
                            </span>
                            <span>{item.year}</span>
                          </div>
                          <h4 className="text-sm font-bold text-neutral-900">{item.title}</h4>
                          <p className="text-xs text-neutral-500 line-clamp-1">{item.subtitle}</p>
                          <span className="text-[11px] text-neutral-400 font-mono mt-2 block">{item.category}</span>
                        </div>

                        <div className="mt-4 pt-3 border-t border-neutral-200 flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleStartEditProject(item)}
                            className="p-1.5 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors"
                            title="Edit project"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProject(item.id)}
                            className="p-1.5 hover:bg-red-50 text-neutral-400 hover:text-red-600 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors"
                            title="Delete project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: EXPERIENCED TOOLS & APPS */}
              {activeTab === 'tools' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#FAF9F6] rounded-2xl border border-neutral-200">
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900">12 Experienced Software &amp; Tools</h4>
                      <p className="text-xs text-neutral-500">
                        Photoshop, Illustrator, InDesign, Premiere Pro, After Effects, DaVinci, Canva, CapCut, HTML, CSS, JS, Figma.
                      </p>
                    </div>
                    <button
                      onClick={handleResetTools}
                      className="inline-flex items-center gap-1.5 text-xs text-neutral-700 hover:text-black bg-white border border-neutral-200 px-3 py-1.5 rounded-xl cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-neutral-700" />
                      <span>Reset to 12 Core Tools</span>
                    </button>
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
                  <div className="flex items-center justify-between p-4 bg-[#FAF9F6] rounded-2xl border border-neutral-200">
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900">Ranked SEO Articles for Google Search Console</h4>
                      <p className="text-xs text-neutral-500">
                        Targeting keywords: Graphic Design Trends, Adobe Photoshop, Figma UI, Premiere Pro, and Front-End.
                      </p>
                    </div>
                    <button
                      onClick={handleResetBlog}
                      className="inline-flex items-center gap-1.5 text-xs text-neutral-700 hover:text-black bg-white border border-neutral-200 px-3 py-1.5 rounded-xl cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-neutral-700" />
                      <span>Reset Default Articles</span>
                    </button>
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
            </div>
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
                      Client
                    </label>
                    <input
                      type="text"
                      value={editClient}
                      onChange={(e) => setEditClient(e.target.value)}
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Year
                    </label>
                    <input
                      type="text"
                      value={editYear}
                      onChange={(e) => setEditYear(e.target.value)}
                      className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Format / Dimensions
                    </label>
                    <input
                      type="text"
                      value={editDimensions}
                      onChange={(e) => setEditDimensions(e.target.value)}
                      className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                      Media Format Type
                    </label>
                    <select
                      value={editMediaType}
                      onChange={(e) => setEditMediaType(e.target.value as 'image' | 'video')}
                      className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none font-semibold"
                    >
                      <option value="image">🎨 Static Image / Poster</option>
                      <option value="video">🎬 Motion Video (.mp4 Reel)</option>
                    </select>
                  </div>

                  {editMediaType === 'video' ? (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                        Video Duration (e.g. 0:28)
                      </label>
                      <input
                        type="text"
                        placeholder="0:28"
                        value={editDuration}
                        onChange={(e) => setEditDuration(e.target.value)}
                        className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                        Cover Thumbnail Image URL
                      </label>
                      <input
                        type="text"
                        value={editImageUrl}
                        onChange={(e) => setEditImageUrl(e.target.value)}
                        placeholder="/Works/... or image URL"
                        className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {editMediaType === 'video' && (
                  <div className="space-y-1.5 bg-purple-50 p-3 rounded-xl border border-purple-200">
                    <label className="block text-xs font-bold uppercase tracking-wider text-purple-900">
                      Video File URL (.mp4)
                    </label>
                    <input
                      type="text"
                      value={editVideoUrl}
                      onChange={(e) => setEditVideoUrl(e.target.value)}
                      placeholder="/Works/videos/... or mp4 URL"
                      className="w-full text-xs bg-white border border-purple-200 rounded-xl px-3.5 py-2 text-neutral-900 focus:outline-none"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                    Tools &amp; Software (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editTools}
                    onChange={(e) => setEditTools(e.target.value)}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                    Design Highlights (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={editKeyFeatures}
                    onChange={(e) => setEditKeyFeatures(e.target.value)}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-1">
                    Creative Concept &amp; Description
                  </label>
                  <textarea
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none resize-none"
                  />
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
                    className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold bg-neutral-900 hover:bg-black text-white rounded-full transition-all cursor-pointer shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Change Password Modal */}
        {isChangePasswordOpen && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-neutral-200">
              <h4 className="text-base font-bold text-neutral-900 mb-3">Change Admin Password</h4>

              {changePasswordError && (
                <div className="p-2.5 bg-neutral-100 text-neutral-800 text-xs rounded-lg mb-3 border border-neutral-300 font-medium">
                  {changePasswordError}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPasswordInput}
                    onChange={(e) => setCurrentPasswordInput(e.target.value)}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 mb-1">New Password</label>
                  <input
                    type={showChangeNewPassword ? 'text' : 'password'}
                    required
                    value={changeNewPassword}
                    onChange={(e) => setChangeNewPassword(e.target.value)}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 mb-1">Confirm New Password</label>
                  <input
                    type={showChangeNewPassword ? 'text' : 'password'}
                    required
                    value={changeConfirmPassword}
                    onChange={(e) => setChangeConfirmPassword(e.target.value)}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsChangePasswordOpen(false)}
                    className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold py-2 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-neutral-900 hover:bg-black text-white text-xs font-semibold py-2 rounded-xl cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};