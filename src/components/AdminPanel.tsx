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
  Copy,
  Check,
  Download,
  Upload,
  Database,
  ArrowLeft,
  Eye,
  EyeOff,
  KeyRound,
  RefreshCw,
  ArrowUpRight,
  Search,
  ChevronDown,
  ChevronUp,
  ArrowLeftRight
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
import {
  onIdTokenChanged,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
  User
} from 'firebase/auth';
import {
  auth,
  isAuthorizedAdminEmail,
  resolveAdminLoginIdentifier
} from '../firebase.ts';
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

const SHOWCASE_CATEGORIES = [
  'Event Branding & Poster',
  'Commercial Poster Design',
  'Festive & Cultural Poster',
  'Festive & Social Media',
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
  const [authRefreshTick, setAuthRefreshTick] = useState(0);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);
  const [hasSeededCloud, setHasSeededCloud] = useState<boolean>(false);

  // Username & Password Login states
  const [usernameInput, setUsernameInput] = useState('typixel');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginInfo, setLoginInfo] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showProviderSetupGuide, setShowProviderSetupGuide] = useState(false);

  // Change / Forgot Password Modal states (inside Admin Page)
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [changeNewPassword, setChangeNewPassword] = useState('');
  const [changeConfirmPassword, setChangeConfirmPassword] = useState('');
  const [showChangePasswordText, setShowChangePasswordText] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState('');
  const [changePasswordInfo, setChangePasswordInfo] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSendingResetFromAdmin, setIsSendingResetFromAdmin] = useState(false);

  void authRefreshTick;
  const isAuthorizedAccount = Boolean(authUser && isAuthorizedAdminEmail(authUser.email));
  const needsEmailVerification = Boolean(authUser && isAuthorizedAccount && !authUser.emailVerified);
  const isAuthenticated = Boolean(authUser && isAuthorizedAccount && authUser.emailVerified);

  // Unified Minimal Navigation Tabs
  type AdminTab = 'showcase' | 'tools' | 'seo' | 'settings' | 'backup';
  const [activeTab, setActiveTab] = useState<AdminTab>('showcase');
  const [successToast, setSuccessToast] = useState('');
  const [cloudErrorToast, setCloudErrorToast] = useState('');

  // Minimal Workspace UI Toggles & Filters
  const [showAddShowcaseForm, setShowAddShowcaseForm] = useState(false);
  const [showcaseRowFilter, setShowcaseRowFilter] = useState<'all' | 1 | 2>('all');
  const [showcaseSearch, setShowcaseSearch] = useState('');
  const [showAddToolForm, setShowAddToolForm] = useState(false);
  const [showAddArticleForm, setShowAddArticleForm] = useState(false);
  const [showEmailJsAdvanced, setShowEmailJsAdvanced] = useState(false);

  // Subscribe to Firebase Auth & ID token refreshes
  useEffect(() => {
    const unsub = onIdTokenChanged(auth, (user) => {
      setAuthUser(user);
      if (user && !isAuthorizedAdminEmail(user.email)) {
        setLoginError(
          `Signed in as ${user.email || 'unknown account'}, which is not authorized for Typixel Studio.`
        );
      } else {
        setLoginError('');
      }
    });
    return () => unsub();
  }, []);

  // Ensure Firestore collections are seeded when authorized Admin enters Studio
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

  // Form state for adding new project
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newCategory, setNewCategory] = useState('Event Branding & Poster');
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [newBadge, setNewBadge] = useState('');
  const [newRow, setNewRow] = useState<1 | 2>(1);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newVideoPosterUrl, setNewVideoPosterUrl] = useState('');
  const [newMediaKind, setNewMediaKind] = useState<'auto' | 'image' | 'video'>('auto');
  const [newUploadError, setNewUploadError] = useState('');
  const [projectMediaMode, setProjectMediaMode] = useState<'preset' | 'upload' | 'link'>('preset');

  // Form state for editing existing showcase project
  const [editingProject, setEditingProject] = useState<(ShowcaseItem & { assignedRow?: number }) | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editCategory, setEditCategory] = useState('Event Branding & Poster');
  const [editCustomCategory, setEditCustomCategory] = useState('');
  const [editBadge, setEditBadge] = useState('');
  const [editRow, setEditRow] = useState<1 | 2>(1);
  const [editImageUrl, setEditImageUrl] = useState('');
  const [editVideoPosterUrl, setEditVideoPosterUrl] = useState('');
  const [editMediaKind, setEditMediaKind] = useState<'auto' | 'image' | 'video'>('auto');
  const [editUploadError, setEditUploadError] = useState('');
  const [editMediaMode, setEditMediaMode] = useState<'preset' | 'upload' | 'link'>('link');

  // Form state for adding Experienced Tools
  const [newToolName, setNewToolName] = useState('');
  const [newToolCategory, setNewToolCategory] = useState<'Graphic & Vector' | 'Video & Motion' | 'Web & Code' | 'Product & UI'>('Graphic & Vector');
  const [newToolLevel] = useState('Mastery');
  const [newToolProficiency] = useState(95);
  const [newToolYears] = useState('3+ Years');
  const [newToolBadge, setNewToolBadge] = useState('');
  const [newToolDescription, setNewToolDescription] = useState('');
  const [newToolIconUrl, setNewToolIconUrl] = useState('');
  const [toolIconMode, setToolIconMode] = useState<'upload' | 'link'>('upload');

  // Form state for adding Blog Posts
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogCategory, setNewBlogCategory] = useState<'Graphic Design' | 'Video & Motion' | 'UI/UX & Figma' | 'Design & Code' | 'Branding'>('Graphic Design');
  const [newBlogReadTime] = useState('5 min read');
  const [newBlogExcerpt, setNewBlogExcerpt] = useState('');
  const [newBlogContent, setNewBlogContent] = useState('');
  const [newBlogTags, setNewBlogTags] = useState('Graphic Design, Adobe Photoshop, Typography');
  const [newBlogKeywords, setNewBlogKeywords] = useState('graphic design trends 2026, photoshop manipulation, viral reels');

  // Contact & EmailJS Settings Form
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

  const handleUsernamePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginInfo('');
    setShowProviderSetupGuide(false);

    const resolvedEmail = resolveAdminLoginIdentifier(usernameInput);
    if (!resolvedEmail || !isAuthorizedAdminEmail(resolvedEmail)) {
      setLoginError(
        'Invalid admin username or email. Use "typixel" (or "hashimtypixel@gmail.com").'
      );
      return;
    }

    if (passwordInput.length < 6) {
      setLoginError('Password must be at least 6 characters.');
      return;
    }

    setIsAuthLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, resolvedEmail, passwordInput);
      if (!cred.user.emailVerified) {
        setLoginInfo(
          `Signed in as ${resolvedEmail}. Please verify your email inbox link so global cloud publishing is authorized.`
        );
      }
      setPasswordInput('');
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/operation-not-allowed') {
        setShowProviderSetupGuide(true);
        setLoginError(
          'Email/Password login is not enabled yet in Firebase Authentication.'
        );
      } else if (code === 'auth/user-not-found' || code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
        setLoginError(
          `Incorrect username or password for ${resolvedEmail}. Check your password or click "Forgot password?" below.`
        );
      } else if (code === 'auth/too-many-requests') {
        setLoginError('Too many attempts. Please wait a minute and try again.');
      } else {
        setLoginError(err?.message || 'Sign in failed. Please try again.');
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setLoginError('');
    setLoginInfo('');
    const resolvedEmail = resolveAdminLoginIdentifier(usernameInput || 'typixel');
    if (!isAuthorizedAdminEmail(resolvedEmail)) {
      setLoginError('Enter your admin username ("typixel") or email first.');
      return;
    }
    setIsAuthLoading(true);
    try {
      await sendPasswordResetEmail(auth, resolvedEmail);
      setLoginInfo(`Password reset link sent to ${resolvedEmail}. Check your inbox or spam folder.`);
    } catch (err: any) {
      if (err?.code === 'auth/operation-not-allowed') {
        setShowProviderSetupGuide(true);
        setLoginError('Enable Email/Password in Firebase Console first before resetting password.');
      } else {
        setLoginError(err?.message || 'Could not send reset email.');
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleSendResetFromAdmin = async () => {
    const targetEmail = auth.currentUser?.email || 'hashimtypixel@gmail.com';
    setChangePasswordError('');
    setChangePasswordInfo('');
    setIsSendingResetFromAdmin(true);
    try {
      await sendPasswordResetEmail(auth, targetEmail);
      const msg = `Password reset link sent to ${targetEmail}. Check your inbox or spam folder.`;
      setChangePasswordInfo(msg);
      showToast(msg);
    } catch (err: any) {
      const errMsg = err?.message || 'Could not send password reset email.';
      setChangePasswordError(errMsg);
      showError(errMsg);
    } finally {
      setIsSendingResetFromAdmin(false);
    }
  };

  const handleResendVerification = async () => {
    if (!auth.currentUser) return;
    setIsAuthLoading(true);
    setLoginError('');
    try {
      await sendEmailVerification(auth.currentUser);
      setLoginInfo(`Verification link re-sent to ${auth.currentUser.email}. Check your inbox and spam folder.`);
    } catch (err: any) {
      setLoginError(err?.message || 'Could not resend verification email right now.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleRefreshVerification = async () => {
    if (!auth.currentUser) return;
    setIsAuthLoading(true);
    setLoginError('');
    try {
      await auth.currentUser.reload();
      await auth.currentUser.getIdToken(true);
      setAuthUser(auth.currentUser);
      setAuthRefreshTick((t) => t + 1);
      if (!auth.currentUser.emailVerified) {
        setLoginError(
          `Email ${auth.currentUser.email} is still not verified yet. Please open the verification link in your email inbox first.`
        );
      }
    } catch (err: any) {
      setLoginError(err?.message || 'Could not refresh verification status.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordError('');
    if (changeNewPassword.length < 6) {
      setChangePasswordError('New password must be at least 6 characters.');
      return;
    }
    if (changeNewPassword !== changeConfirmPassword) {
      setChangePasswordError('New passwords do not match.');
      return;
    }
    const user = auth.currentUser;
    if (!user || !user.email) {
      setChangePasswordError('Please sign in again before changing your password.');
      return;
    }

    setIsChangingPassword(true);
    try {
      const hasPasswordProvider = user.providerData.some((p) => p.providerId === 'password');
      if (hasPasswordProvider && currentPasswordInput) {
        const cred = EmailAuthProvider.credential(user.email, currentPasswordInput);
        await reauthenticateWithCredential(user, cred);
      }
      await updatePassword(user, changeNewPassword);
      setIsChangePasswordOpen(false);
      setCurrentPasswordInput('');
      setChangeNewPassword('');
      setChangeConfirmPassword('');
      showToast('Admin password updated successfully.');
    } catch (err: any) {
      if (err?.code === 'auth/wrong-password' || err?.code === 'auth/invalid-credential') {
        setChangePasswordError('Current password is incorrect.');
      } else if (err?.code === 'auth/requires-recent-login') {
        setChangePasswordError('For security, please sign out and sign back in, then update your password.');
      } else {
        setChangePasswordError(err?.message || 'Failed to update password.');
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setHasSeededCloud(false);
      setLoginInfo('');
      setLoginError('');
    } catch {}
  };

  // --- Project Add / Edit / Delete ---
  const compressImageFile = (
    file: File,
    callback: (compressedDataUrl: string) => void,
    onSizeError: (msg: string) => void
  ) => {
    const isVideoFile = file.type.startsWith('video/') || /\.(mp4|webm|mov|m4v)$/i.test(file.name);
    if (isVideoFile) {
      if (file.size > 600 * 1024) {
        onSizeError(
          `Video "${file.name}" is ${(file.size / (1024 * 1024)).toFixed(1)} MB. Direct uploads support videos up to 600 KB; paste a direct .mp4 URL in Link mode for larger HD videos.`
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
    const isVideo =
      newMediaKind === 'video'
        ? true
        : newMediaKind === 'image'
          ? false
          : isVideoMediaUrl(mediaUrl);

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
      setNewMediaKind('auto');
      setNewUploadError('');
      setCustomCategoryName('');
      setShowAddShowcaseForm(false);

      showToast(`"${newItem.title}" published live to Row ${newRow}.`);
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

    if (SHOWCASE_CATEGORIES.includes(item.category)) {
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
    setEditMediaKind(item.mediaType === 'video' ? 'video' : item.mediaType === 'image' ? 'image' : 'auto');
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
    const isVideo =
      editMediaKind === 'video'
        ? true
        : editMediaKind === 'image'
          ? false
          : isVideoMediaUrl(mediaUrl);

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
      showToast(`"${updatedItem.title}" saved globally.`);
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
      showToast(`Moved "${item.title}" to Row ${targetRow}.`);
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
      showToast('Showcase item deleted.');
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
      setShowAddToolForm(false);
      showToast(`Software "${newTool.name}" published.`);
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
      showToast('Software removed.');
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
      setShowAddArticleForm(false);
      showToast(`Article "${newPost.title}" published.`);
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
      showToast('Article removed.');
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

      showToast('Contact settings saved globally.');
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
      showToast('SEO metadata saved globally.');
    } catch (err: any) {
      showError(err?.message || 'Failed to save SEO strategy to cloud.');
    } finally {
      setIsCloudSyncing(false);
    }
  };

  // --- Backup & Restore Handlers ---
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
    a.download = `typixel_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast('Backup file downloaded.');
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
        showToast('Backup restored and synced globally.');
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

  // Filtered Showcase List
  const allProjects = [
    ...row1Projects.map((p) => ({ ...p, assignedRow: 1 as const })),
    ...row2Projects.map((p) => ({ ...p, assignedRow: 2 as const }))
  ];
  const filteredProjects = allProjects.filter((item) => {
    if (showcaseRowFilter !== 'all' && item.assignedRow !== showcaseRowFilter) return false;
    if (showcaseSearch.trim()) {
      const q = showcaseSearch.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.subtitle || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const navItems: { id: AdminTab; label: string; count?: number; icon: React.ReactNode }[] = [
    { id: 'showcase', label: 'Showcase', count: allProjects.length, icon: <Layers className="w-4 h-4" /> },
    { id: 'tools', label: 'Tools', count: tools.length, icon: <Wrench className="w-4 h-4" /> },
    { id: 'seo', label: 'Blog & SEO', count: blogPosts.length, icon: <BookOpen className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Mail className="w-4 h-4" /> },
    { id: 'backup', label: 'Backup', icon: <Database className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen w-full bg-[#F5F4F0] text-neutral-900 flex flex-col selection:bg-neutral-900 selection:text-white">
      {/* Minimal 3-Zone Top Bar */}
      <header className="sticky top-0 z-40 h-14 bg-white/95 backdrop-blur-md border-b border-neutral-200/80 px-4 sm:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src="/logos/typixel.jpg"
            alt="Typixel"
            className="w-7 h-7 rounded-lg object-cover bg-neutral-900 shrink-0"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('raw.githubusercontent.com')) {
                target.src = 'https://raw.githubusercontent.com/typixelofficial/typixel/main/logos/typixel.jpg';
              }
            }}
          />
          <span className="text-sm font-semibold tracking-tight text-neutral-900 whitespace-nowrap shrink-0">
            Typixel Studio
          </span>
          {isAuthenticated && isCloudSyncing && (
            <span className="text-xs text-neutral-500 whitespace-nowrap hidden sm:inline">
              · Saving changes...
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {isAuthenticated && (
            <>
              <span className="hidden md:inline text-xs text-neutral-500 truncate max-w-[200px]">
                {authUser?.email}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 px-3 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </>
          )}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-neutral-900 hover:bg-black text-white px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>View Site</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Clean Toast Notifications */}
      {successToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-neutral-900 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-150">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {cloudErrorToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-rose-700 text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-150">
          <span>{cloudErrorToast}</span>
        </div>
      )}

      {/* Auth Gate vs Minimal Workspace */}
      {!isAuthenticated ? (
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="bg-white rounded-2xl max-w-sm w-full p-7 sm:p-8 border border-neutral-200/90 shadow-sm">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-11 h-11 rounded-xl bg-neutral-900 text-white flex items-center justify-center mb-3.5">
                <Lock className="w-5 h-5" />
              </div>
              <h1 className="text-lg font-semibold text-neutral-900 tracking-tight">
                Admin Sign In
              </h1>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Sign in to manage Typixel showcase media, tools, articles, and site settings.
              </p>
            </div>

            {needsEmailVerification ? (
              <div className="space-y-4">
                <p className="text-xs text-neutral-600 text-center leading-relaxed">
                  Signed in as <span className="font-medium text-neutral-900">{authUser?.email}</span>. Open the verification link sent to your inbox to enable live cloud edits.
                </p>

                {loginInfo && (
                  <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 font-medium">
                    {loginInfo}
                  </div>
                )}

                {loginError && (
                  <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-200 font-medium">
                    {loginError}
                  </div>
                )}

                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    disabled={isAuthLoading}
                    onClick={handleRefreshVerification}
                    className="w-full bg-neutral-900 hover:bg-black disabled:opacity-60 text-white text-xs font-medium py-2.5 px-4 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isAuthLoading ? 'animate-spin' : ''}`} />
                    <span>I&apos;ve Verified — Continue</span>
                  </button>

                  <button
                    type="button"
                    disabled={isAuthLoading}
                    onClick={handleResendVerification}
                    className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-medium py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
                  >
                    Resend Verification Email
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-xs text-neutral-500 hover:text-neutral-900 py-1.5 cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <>
                {loginInfo && (
                  <div className="p-3 mb-4 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 font-medium">
                    {loginInfo}
                  </div>
                )}

                {loginError && (
                  <div className="p-3 mb-4 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-200 font-medium space-y-2">
                    <p>{loginError}</p>
                    {showProviderSetupGuide && (
                      <ol className="list-decimal pl-4 pt-1.5 border-t border-rose-200/80 text-[11px] text-rose-900 space-y-1">
                        <li>Open Firebase Console → Authentication → Sign-in method</li>
                        <li>Add provider <strong>Email/Password</strong> → Enable → Save</li>
                        <li>Under <strong>Users</strong>, ensure <strong>hashimtypixel@gmail.com</strong> has a password set</li>
                      </ol>
                    )}
                  </div>
                )}

                <form onSubmit={handleUsernamePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                      Username or Email
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="username"
                      placeholder="typixel"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      className="w-full text-sm bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900 transition-colors"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-medium text-neutral-700">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        disabled={isAuthLoading}
                        className="text-xs text-neutral-500 hover:text-neutral-900 hover:underline cursor-pointer disabled:opacity-60"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={6}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full text-sm bg-neutral-50 border border-neutral-200 rounded-xl pl-3.5 pr-10 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isAuthLoading}
                    className="w-full bg-neutral-900 hover:bg-black disabled:opacity-60 text-white text-xs font-medium py-3 px-4 rounded-xl transition-colors cursor-pointer"
                  >
                    {isAuthLoading ? 'Signing in...' : 'Sign In'}
                  </button>
                </form>

                {authUser && !isAuthorizedAdminEmail(authUser.email) && (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full mt-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium py-2 rounded-xl cursor-pointer"
                  >
                    Sign out ({authUser.email})
                  </button>
                )}
              </>
            )}

            <div className="mt-6 pt-4 border-t border-neutral-100 text-center">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Portfolio</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Minimal Sidebar + Content Workspace */
        <div className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar Navigation (Horizontal bar on mobile, clean fixed column on desktop) */}
          <aside className="lg:w-52 shrink-0">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0 lg:sticky lg:top-20">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-neutral-900 text-white'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/80'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.label}</span>
                    </span>
                    {typeof item.count === 'number' && (
                      <span
                        className={`text-[11px] font-mono tabular-nums ${
                          isActive ? 'text-neutral-300' : 'text-neutral-400'
                        }`}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Quick Password / Forgot Password shortcut in sidebar on desktop */}
              <div className="hidden lg:block pt-4 mt-3 border-t border-neutral-200/80 space-y-1">
                <button
                  type="button"
                  onClick={() => {
                    setChangePasswordError('');
                    setChangePasswordInfo('');
                    setIsChangePasswordOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-white/80 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Password &amp; Reset</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* Main Content Surface */}
          <main className="flex-1 min-w-0 bg-white rounded-2xl border border-neutral-200/80 p-5 sm:p-7">
            {/* ==================== TAB: SHOWCASE (MANAGE + ADD) ==================== */}
            {activeTab === 'showcase' && (
              <div className="space-y-6">
                {/* Clean Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-100">
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-900 tracking-tight">
                      Showcase Gallery
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5 tabular-nums">
                      {allProjects.length} artworks · Row 1 ({row1Projects.length}) · Row 2 ({row2Projects.length})
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddShowcaseForm(!showAddShowcaseForm)}
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-auto ${
                      showAddShowcaseForm
                        ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                        : 'bg-neutral-900 hover:bg-black text-white'
                    }`}
                  >
                    {showAddShowcaseForm ? (
                      <>
                        <X className="w-3.5 h-3.5" />
                        <span>Close Composer</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Artwork</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Collapsible Add Project Composer */}
                {showAddShowcaseForm && (
                  <form onSubmit={handleAddProject} className="pb-6 border-b border-neutral-200 space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-1">
                          Project Title *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Skillovia — Brand Identity"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-1">
                          Tagline
                        </label>
                        <input
                          type="text"
                          placeholder="Short description"
                          value={newSubtitle}
                          onChange={(e) => setNewSubtitle(e.target.value)}
                          className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-1">
                          Category
                        </label>
                        <select
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
                        >
                          {SHOWCASE_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                          <option value="Other">Other...</option>
                        </select>
                      </div>

                      {newCategory === 'Other' && (
                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">
                            Custom Category *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Custom category name"
                            value={customCategoryName}
                            onChange={(e) => setCustomCategoryName(e.target.value)}
                            className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-1">
                          Label / Badge
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Campaign, Video Reel"
                          value={newBadge}
                          onChange={(e) => setNewBadge(e.target.value)}
                          className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-1">
                          Marquee Row
                        </label>
                        <select
                          value={newRow}
                          onChange={(e) => setNewRow(Number(e.target.value) as 1 | 2)}
                          className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
                        >
                          <option value={1}>Row 1 (Slides Left)</option>
                          <option value={2}>Row 2 (Slides Right)</option>
                        </select>
                      </div>
                    </div>

                    {/* Media Picker */}
                    <div className="space-y-3 pt-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <label className="text-xs font-medium text-neutral-700">
                          Image or Video Media
                        </label>
                        <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg text-xs self-start">
                          {(['preset', 'upload', 'link'] as const).map((mode) => (
                            <button
                              key={mode}
                              type="button"
                              onClick={() => setProjectMediaMode(mode)}
                              className={`px-3 py-1 rounded-md cursor-pointer transition-colors whitespace-nowrap ${
                                projectMediaMode === mode
                                  ? 'bg-white text-neutral-900 font-medium shadow-2xs'
                                  : 'text-neutral-600 hover:text-neutral-900'
                              }`}
                            >
                              {mode === 'preset' ? `Presets (${SHOWCASE_PRESET_IMAGES.length})` : mode === 'upload' ? 'Upload File' : 'URL / Link'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {projectMediaMode === 'preset' && (
                        <div className="space-y-3">
                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                            {SHOWCASE_PRESET_IMAGES.map((preset) => {
                              const isSelected = newImageUrl === preset.path;
                              const isPresetVid = isVideoMediaUrl(preset.path);
                              return (
                                <button
                                  key={preset.filename}
                                  type="button"
                                  onClick={() => handleSelectPreset(preset, false)}
                                  className={`group p-1.5 rounded-xl border text-left transition-all cursor-pointer ${
                                    isSelected
                                      ? 'border-neutral-900 ring-2 ring-neutral-900/15 bg-neutral-50'
                                      : 'border-neutral-200 hover:border-neutral-400 bg-white'
                                  }`}
                                >
                                  <div className="w-full aspect-[4/5] rounded-lg overflow-hidden bg-neutral-900 mb-1">
                                    {isPresetVid ? (
                                      <video
                                        src={preset.path}
                                        muted
                                        autoPlay
                                        loop
                                        playsInline
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <img
                                        src={preset.path}
                                        alt={preset.name}
                                        className="w-full h-full object-cover"
                                      />
                                    )}
                                  </div>
                                  <span className="text-[11px] font-medium text-neutral-800 truncate block">
                                    {preset.name}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {projectMediaMode === 'upload' && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <input
                              type="file"
                              accept="image/*,video/mp4,video/webm,video/quicktime"
                              onChange={(e) => handleProjectFileUpload(e, false)}
                              className="w-full text-xs text-neutral-600 file:mr-3 file:py-2 file:px-3.5 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-neutral-900 file:text-white hover:file:bg-black file:cursor-pointer bg-neutral-50 border border-neutral-200 rounded-xl p-1"
                            />
                            {newImageUrl && (
                              <div className="w-11 h-14 rounded-lg overflow-hidden border border-neutral-200 shrink-0 bg-neutral-900">
                                {(newMediaKind === 'video' || (newMediaKind === 'auto' && isVideoMediaUrl(newImageUrl))) ? (
                                  <video src={newImageUrl} muted autoPlay loop playsInline className="w-full h-full object-cover" />
                                ) : (
                                  <img src={newImageUrl} alt="Preview" className="w-full h-full object-cover" />
                                )}
                              </div>
                            )}
                          </div>
                          {newUploadError && (
                            <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                              {newUploadError}
                            </p>
                          )}
                        </div>
                      )}

                      {projectMediaMode === 'link' && (
                        <div className="flex items-center gap-3">
                          <input
                            type="text"
                            placeholder="https://... (.jpg, .png, .webp, .mp4)"
                            value={newImageUrl}
                            onChange={(e) => {
                              setNewImageUrl(e.target.value);
                              setNewUploadError('');
                            }}
                            className="flex-1 text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900 font-mono"
                          />
                          {newImageUrl && (
                            <div className="w-11 h-14 rounded-lg overflow-hidden border border-neutral-200 shrink-0 bg-neutral-900">
                              {(newMediaKind === 'video' || (newMediaKind === 'auto' && isVideoMediaUrl(newImageUrl))) ? (
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
                                <img src={normalizeShowcaseImagePath(newImageUrl)} alt="Preview" className="w-full h-full object-cover" />
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-neutral-500">Type:</span>
                          {(['auto', 'image', 'video'] as const).map((kind) => (
                            <button
                              key={kind}
                              type="button"
                              onClick={() => setNewMediaKind(kind)}
                              className={`px-2.5 py-1 rounded-lg border cursor-pointer transition-colors ${
                                newMediaKind === kind
                                  ? 'bg-neutral-900 text-white border-neutral-900 font-medium'
                                  : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                              }`}
                            >
                              {kind === 'auto' ? 'Auto' : kind === 'image' ? 'Image' : 'Video'}
                            </button>
                          ))}
                        </div>

                        {(newMediaKind === 'video' || (newMediaKind === 'auto' && isVideoMediaUrl(newImageUrl))) && (
                          <input
                            type="text"
                            placeholder="Optional video poster image URL"
                            value={newVideoPosterUrl}
                            onChange={(e) => setNewVideoPosterUrl(e.target.value)}
                            className="flex-1 min-w-[200px] text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1.5 text-neutral-900 font-mono"
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddShowcaseForm(false)}
                        className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 rounded-xl hover:bg-neutral-100 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isCloudSyncing}
                        className="inline-flex items-center gap-1.5 bg-neutral-900 hover:bg-black disabled:opacity-60 text-white px-5 py-2 rounded-xl text-xs font-medium cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isCloudSyncing ? 'Publishing...' : 'Publish to Showcase'}</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Filter & Search Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-xl text-xs self-start">
                    {([
                      { id: 'all', label: `All (${allProjects.length})` },
                      { id: 1, label: `Row 1 (${row1Projects.length})` },
                      { id: 2, label: `Row 2 (${row2Projects.length})` }
                    ] as const).map((tab) => (
                      <button
                        key={String(tab.id)}
                        type="button"
                        onClick={() => setShowcaseRowFilter(tab.id)}
                        className={`px-3 py-1.5 rounded-lg cursor-pointer transition-colors whitespace-nowrap tabular-nums ${
                          showcaseRowFilter === tab.id
                            ? 'bg-white text-neutral-900 font-medium shadow-2xs'
                            : 'text-neutral-600 hover:text-neutral-900'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Filter artworks..."
                      value={showcaseSearch}
                      onChange={(e) => setShowcaseSearch(e.target.value)}
                      className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl pl-8 pr-3 py-2 text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                {/* Minimal Showcase Gallery Grid */}
                {filteredProjects.length === 0 ? (
                  <div className="py-12 text-center border border-dashed border-neutral-200 rounded-2xl">
                    <p className="text-sm font-medium text-neutral-700">No showcase artworks match your filter</p>
                    <p className="text-xs text-neutral-500 mt-1">Try clearing your search or add a new image or video.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredProjects.map((item) => {
                      const isVid = isVideoMediaUrl(item.videoUrl || item.imageUrl, item.mediaType);
                      const displayVideo = isVid ? normalizeShowcaseImagePath(item.videoUrl || item.imageUrl || '') : '';
                      const displayImg = item.imageUrl && !isVideoMediaUrl(item.imageUrl) ? normalizeShowcaseImagePath(item.imageUrl) : '';
                      return (
                        <div
                          key={item.id}
                          className="group rounded-2xl border border-neutral-200/90 overflow-hidden bg-white hover:border-neutral-400 transition-colors flex flex-col"
                        >
                          {/* Artwork Preview */}
                          <div className="w-full aspect-[4/3] bg-neutral-900 relative overflow-hidden">
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
                                  (e.target as HTMLElement).style.opacity = '0.35';
                                }}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-white/50 text-xs font-mono">
                                No Media
                              </div>
                            )}
                          </div>

                          {/* Card Info + Clean Actions */}
                          <div className="p-3.5 flex-1 flex flex-col justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 mb-1 tabular-nums">
                                <span>Row {item.assignedRow}</span>
                                <span aria-hidden="true">·</span>
                                <span>{isVid ? 'Video' : 'Image'}</span>
                                <span aria-hidden="true">·</span>
                                <span className="truncate">{item.category}</span>
                              </div>
                              <h3 className="text-sm font-medium text-neutral-900 truncate">
                                {item.title}
                              </h3>
                              {item.subtitle && (
                                <p className="text-xs text-neutral-500 truncate mt-0.5">
                                  {item.subtitle}
                                </p>
                              )}
                            </div>

                            <div className="pt-2.5 border-t border-neutral-100 flex items-center justify-between gap-2">
                              <button
                                type="button"
                                onClick={() => handleToggleProjectRow(item, item.assignedRow)}
                                className="inline-flex items-center gap-1 text-xs text-neutral-600 hover:text-neutral-900 cursor-pointer whitespace-nowrap"
                                title={`Move to Row ${item.assignedRow === 1 ? 2 : 1}`}
                              >
                                <ArrowLeftRight className="w-3 h-3" />
                                <span>Row {item.assignedRow === 1 ? '2' : '1'}</span>
                              </button>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleStartEditProject(item)}
                                  className="px-2.5 py-1 text-xs font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                                >
                                  <Pencil className="w-3 h-3" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProject(item.id)}
                                  className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="Delete artwork"
                                  aria-label="Delete artwork"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ==================== TAB: EXPERIENCED TOOLS ==================== */}
            {activeTab === 'tools' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-100">
                  <div>
                    <h2 className="text-lg font-semibold text-neutral-900 tracking-tight">
                      Software &amp; Tools
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5 tabular-nums">
                      {tools.length} items displayed in the experienced apps marquee.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddToolForm(!showAddToolForm)}
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap self-start sm:self-auto ${
                      showAddToolForm
                        ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                        : 'bg-neutral-900 hover:bg-black text-white'
                    }`}
                  >
                    {showAddToolForm ? (
                      <>
                        <X className="w-3.5 h-3.5" />
                        <span>Close</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Tool</span>
                      </>
                    )}
                  </button>
                </div>

                {showAddToolForm && (
                  <form onSubmit={handleAddTool} className="pb-6 border-b border-neutral-200 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-1">Software Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Blender, Cinema 4D"
                          value={newToolName}
                          onChange={(e) => setNewToolName(e.target.value)}
                          className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-1">Category</label>
                        <select
                          value={newToolCategory}
                          onChange={(e) => setNewToolCategory(e.target.value as any)}
                          className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
                        >
                          <option value="Graphic & Vector">Graphic &amp; Vector</option>
                          <option value="Video & Motion">Video &amp; Motion</option>
                          <option value="Product & UI">Product &amp; UI</option>
                          <option value="Web & Code">Web &amp; Code</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-1">Short Code</label>
                        <input
                          type="text"
                          maxLength={5}
                          placeholder="e.g. BL"
                          value={newToolBadge}
                          onChange={(e) => setNewToolBadge(e.target.value)}
                          className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 font-mono focus:bg-white focus:outline-none focus:border-neutral-900"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-neutral-700">Icon (Upload PNG/SVG or Link)</label>
                        <div className="flex items-center gap-1 p-0.5 bg-neutral-100 rounded-lg text-xs">
                          <button
                            type="button"
                            onClick={() => setToolIconMode('upload')}
                            className={`px-2.5 py-1 rounded-md cursor-pointer ${
                              toolIconMode === 'upload' ? 'bg-white text-neutral-900 font-medium shadow-2xs' : 'text-neutral-600'
                            }`}
                          >
                            Upload
                          </button>
                          <button
                            type="button"
                            onClick={() => setToolIconMode('link')}
                            className={`px-2.5 py-1 rounded-md cursor-pointer ${
                              toolIconMode === 'link' ? 'bg-white text-neutral-900 font-medium shadow-2xs' : 'text-neutral-600'
                            }`}
                          >
                            URL
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {toolIconMode === 'upload' ? (
                          <input
                            type="file"
                            accept="image/png,image/svg+xml,image/jpeg,image/webp"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                  if (typeof reader.result === 'string') setNewToolIconUrl(reader.result);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="flex-1 text-xs text-neutral-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-neutral-900 file:text-white cursor-pointer bg-neutral-50 border border-neutral-200 rounded-xl p-1"
                          />
                        ) : (
                          <input
                            type="text"
                            placeholder="https://.../icon.svg"
                            value={newToolIconUrl}
                            onChange={(e) => setNewToolIconUrl(e.target.value)}
                            className="flex-1 text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 font-mono"
                          />
                        )}
                        {newToolIconUrl && (
                          <div className="flex items-center gap-2 shrink-0">
                            <AppLogo name={newToolName || 'New'} badge={newToolBadge || 'App'} iconUrl={newToolIconUrl} size={36} />
                            <button
                              type="button"
                              onClick={() => setNewToolIconUrl('')}
                              className="text-xs text-rose-600 hover:underline cursor-pointer"
                            >
                              Clear
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddToolForm(false)}
                        className="px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isCloudSyncing}
                        className="inline-flex items-center gap-1.5 bg-neutral-900 hover:bg-black text-white px-5 py-2 rounded-xl text-xs font-medium cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Tool</span>
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {tools.map((t) => (
                    <div
                      key={t.id}
                      className="p-3.5 rounded-xl border border-neutral-200/80 flex items-center justify-between gap-3 hover:border-neutral-300 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <AppLogo name={t.name} badge={t.badge} iconUrl={t.iconUrl} size={36} />
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-neutral-900 truncate">{t.name}</div>
                          <div className="text-[11px] text-neutral-500 truncate">{t.category}</div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteTool(t.id)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                        title="Remove tool"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================== TAB: BLOG & SEO ==================== */}
            {activeTab === 'seo' && (
              <div className="space-y-8">
                {/* Section 1: Site SEO Metadata */}
                <form onSubmit={handleSaveSeoStrategy} className="space-y-4 pb-8 border-b border-neutral-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-neutral-900 tracking-tight">
                        SEO Metadata &amp; Strategy
                      </h2>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        Configure search titles, URL slug, and regional targeting for {seoStrategy.domain}.
                      </p>
                    </div>
                    <button
                      type="submit"
                      disabled={isCloudSyncing}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-medium cursor-pointer self-start sm:self-auto"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save SEO</span>
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-neutral-700">Blog Headline / H1</label>
                      <button
                        type="button"
                        onClick={() => handleCopySeoText(seoStrategy.blogTitle, 'field-blog-title')}
                        className="inline-flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-900 cursor-pointer"
                      >
                        {copiedSeoField === 'field-blog-title' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedSeoField === 'field-blog-title' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={seoStrategy.blogTitle}
                      onChange={(e) => setSeoStrategy({ ...seoStrategy, blogTitle: e.target.value })}
                      className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-medium text-neutral-700">SEO Browser Title</label>
                        <button
                          type="button"
                          onClick={() => handleCopySeoText(seoStrategy.seoTitle, 'field-seo-title')}
                          className="inline-flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-900 cursor-pointer"
                        >
                          {copiedSeoField === 'field-seo-title' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedSeoField === 'field-seo-title' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={seoStrategy.seoTitle}
                        onChange={(e) => setSeoStrategy({ ...seoStrategy, seoTitle: e.target.value })}
                        className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-medium text-neutral-700">URL Slug</label>
                        <button
                          type="button"
                          onClick={() => handleCopySeoText(seoStrategy.urlSlug, 'field-url-slug')}
                          className="inline-flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-900 cursor-pointer"
                        >
                          {copiedSeoField === 'field-url-slug' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedSeoField === 'field-url-slug' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={seoStrategy.urlSlug}
                        onChange={(e) => setSeoStrategy({ ...seoStrategy, urlSlug: e.target.value })}
                        className="w-full text-xs font-mono bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-neutral-700">Meta Description</label>
                      <button
                        type="button"
                        onClick={() => handleCopySeoText(seoStrategy.metaDescription, 'field-meta-desc')}
                        className="inline-flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-900 cursor-pointer"
                      >
                        {copiedSeoField === 'field-meta-desc' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedSeoField === 'field-meta-desc' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      required
                      value={seoStrategy.metaDescription}
                      onChange={(e) => setSeoStrategy({ ...seoStrategy, metaDescription: e.target.value })}
                      className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-500 mb-1">Primary Target</label>
                      <input
                        type="text"
                        value={seoStrategy.primaryTarget}
                        onChange={(e) => setSeoStrategy({ ...seoStrategy, primaryTarget: e.target.value })}
                        className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-500 mb-1">Location Focus</label>
                      <input
                        type="text"
                        value={seoStrategy.locationFocus}
                        onChange={(e) => setSeoStrategy({ ...seoStrategy, locationFocus: e.target.value })}
                        className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-500 mb-1">Audience</label>
                      <input
                        type="text"
                        value={seoStrategy.audience}
                        onChange={(e) => setSeoStrategy({ ...seoStrategy, audience: e.target.value })}
                        className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-neutral-500 mb-1">Goal</label>
                      <input
                        type="text"
                        value={seoStrategy.goal}
                        onChange={(e) => setSeoStrategy({ ...seoStrategy, goal: e.target.value })}
                        className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900"
                      />
                    </div>
                  </div>
                </form>

                {/* Section 2: Published Articles */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-neutral-900">
                        SEO Articles
                      </h3>
                      <p className="text-xs text-neutral-500 tabular-nums">
                        {blogPosts.length} published articles
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddArticleForm(!showAddArticleForm)}
                      className={`inline-flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-xl transition-colors cursor-pointer ${
                        showAddArticleForm
                          ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                          : 'bg-neutral-900 hover:bg-black text-white'
                      }`}
                    >
                      {showAddArticleForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{showAddArticleForm ? 'Close' : 'New Article'}</span>
                    </button>
                  </div>

                  {showAddArticleForm && (
                    <form onSubmit={handleAddBlogPost} className="p-4 bg-neutral-50/70 rounded-2xl border border-neutral-200 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-medium text-neutral-700 mb-1">Headline *</label>
                          <input
                            type="text"
                            required
                            placeholder="Article title..."
                            value={newBlogTitle}
                            onChange={(e) => setNewBlogTitle(e.target.value)}
                            className="w-full text-xs bg-white border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">Category</label>
                          <select
                            value={newBlogCategory}
                            onChange={(e) => setNewBlogCategory(e.target.value as any)}
                            className="w-full text-xs bg-white border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900"
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
                        <label className="block text-xs font-medium text-neutral-700 mb-1">Excerpt</label>
                        <input
                          type="text"
                          placeholder="Short summary..."
                          value={newBlogExcerpt}
                          onChange={(e) => setNewBlogExcerpt(e.target.value)}
                          className="w-full text-xs bg-white border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">Tags</label>
                          <input
                            type="text"
                            value={newBlogTags}
                            onChange={(e) => setNewBlogTags(e.target.value)}
                            className="w-full text-xs bg-white border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-neutral-700 mb-1">SEO Keywords</label>
                          <input
                            type="text"
                            value={newBlogKeywords}
                            onChange={(e) => setNewBlogKeywords(e.target.value)}
                            className="w-full text-xs bg-white border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-neutral-700 mb-1">Content (Markdown)</label>
                        <textarea
                          rows={4}
                          placeholder="## Overview..."
                          value={newBlogContent}
                          onChange={(e) => setNewBlogContent(e.target.value)}
                          className="w-full text-xs bg-white border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900 resize-none font-mono"
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAddArticleForm(false)}
                          className="px-4 py-2 text-xs font-medium text-neutral-600 hover:bg-neutral-200/70 rounded-xl cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isCloudSyncing}
                          className="inline-flex items-center gap-1.5 bg-neutral-900 hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-medium cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Publish Article</span>
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="divide-y divide-neutral-100 border border-neutral-200/80 rounded-2xl overflow-hidden">
                    {blogPosts.map((post) => (
                      <div key={post.id} className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-50/70 transition-colors">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 text-[11px] text-neutral-500 mb-0.5 tabular-nums">
                            <span>{post.category}</span>
                            <span aria-hidden="true">·</span>
                            <span>{post.publishedDate}</span>
                            <span aria-hidden="true">·</span>
                            <span>{post.readTime}</span>
                          </div>
                          <h4 className="text-sm font-medium text-neutral-900 truncate">{post.title}</h4>
                          <p className="text-xs text-neutral-500 truncate">{post.excerpt}</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteBlogPost(post.id)}
                          className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                          title="Delete article"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ==================== TAB: CONTACT, EMAILJS & ADMIN SECURITY ==================== */}
            {activeTab === 'settings' && (
              <div className="space-y-8 max-w-2xl">
                {/* Contact Channels */}
                <form onSubmit={handleSaveContactSettings} className="space-y-4">
                  <div className="pb-4 border-b border-neutral-100">
                    <h2 className="text-lg font-semibold text-neutral-900 tracking-tight">
                      Contact &amp; Account Settings
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Update your public email, WhatsApp inquiry number, and admin password controls.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">
                        Public Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={settingsEmail}
                        onChange={(e) => setSettingsEmail(e.target.value)}
                        className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-700 mb-1">
                        WhatsApp Number *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 919061559799"
                        value={settingsWhatsApp}
                        onChange={(e) => setSettingsWhatsApp(e.target.value)}
                        className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 font-mono focus:bg-white focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                  </div>

                  {/* Collapsible Optional EmailJS Settings */}
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setShowEmailJsAdvanced(!showEmailJsAdvanced)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 cursor-pointer"
                    >
                      {showEmailJsAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      <span>EmailJS Configuration (Optional)</span>
                    </button>

                    {showEmailJsAdvanced && (
                      <div className="mt-3 p-4 bg-neutral-50/70 border border-neutral-200 rounded-xl space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-[11px] font-medium text-neutral-600 mb-1">Service ID</label>
                            <input
                              type="text"
                              value={emailJsServiceId}
                              onChange={(e) => setEmailJsServiceId(e.target.value)}
                              className="w-full text-xs bg-white border border-neutral-200 rounded-lg px-3 py-2 text-neutral-900 font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-neutral-600 mb-1">Template ID</label>
                            <input
                              type="text"
                              value={emailJsTemplateId}
                              onChange={(e) => setEmailJsTemplateId(e.target.value)}
                              className="w-full text-xs bg-white border border-neutral-200 rounded-lg px-3 py-2 text-neutral-900 font-mono"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-neutral-600 mb-1">Public Key</label>
                            <input
                              type="text"
                              value={emailJsPublicKey}
                              onChange={(e) => setEmailJsPublicKey(e.target.value)}
                              className="w-full text-xs bg-white border border-neutral-200 rounded-lg px-3 py-2 text-neutral-900 font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isCloudSyncing}
                      className="inline-flex items-center gap-1.5 bg-neutral-900 hover:bg-black text-white px-5 py-2 rounded-xl text-xs font-medium cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Contact Settings</span>
                    </button>
                  </div>
                </form>

                {/* Admin Account Password & Forgot Password Section */}
                <div className="pt-6 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900">
                      Admin Password &amp; Recovery
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Signed in as <span className="font-mono text-neutral-700">{authUser?.email}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={handleSendResetFromAdmin}
                      disabled={isSendingResetFromAdmin}
                      className="px-3.5 py-2 text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl transition-colors cursor-pointer disabled:opacity-60 whitespace-nowrap"
                    >
                      {isSendingResetFromAdmin ? 'Sending...' : 'Forgot Password'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setChangePasswordError('');
                        setChangePasswordInfo('');
                        setIsChangePasswordOpen(true);
                      }}
                      className="px-3.5 py-2 text-xs font-medium bg-neutral-900 hover:bg-black text-white rounded-xl transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== TAB: BACKUP & RESTORE ==================== */}
            {activeTab === 'backup' && (
              <div className="space-y-6 max-w-2xl">
                <div className="pb-4 border-b border-neutral-100">
                  <h2 className="text-lg font-semibold text-neutral-900 tracking-tight">
                    Backup &amp; Restore
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Export or restore your full portfolio configuration as a JSON file.
                  </p>
                </div>

                {backupRestoreError && (
                  <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-200 font-medium">
                    {backupRestoreError}
                  </div>
                )}

                {/* Clean Tabular Summary Strip */}
                <div className="grid grid-cols-3 gap-3 text-center border border-neutral-200/80 rounded-2xl p-4">
                  <div>
                    <span className="block text-xl font-semibold text-neutral-900 font-mono tabular-nums">
                      {allProjects.length}
                    </span>
                    <span className="text-xs text-neutral-500">Artworks</span>
                  </div>
                  <div className="border-x border-neutral-100">
                    <span className="block text-xl font-semibold text-neutral-900 font-mono tabular-nums">
                      {tools.length}
                    </span>
                    <span className="text-xs text-neutral-500">Tools</span>
                  </div>
                  <div>
                    <span className="block text-xl font-semibold text-neutral-900 font-mono tabular-nums">
                      {blogPosts.length}
                    </span>
                    <span className="text-xs text-neutral-500">Articles</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl border border-neutral-200 flex flex-col justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 mb-1">Export Portfolio JSON</h3>
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        Download all showcase items, tools, blog posts, SEO metadata, and contact settings.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleExportBackup}
                      className="w-full inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-black text-white text-xs font-medium py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Backup</span>
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl border border-neutral-200 flex flex-col justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-neutral-900 mb-1">Restore from JSON</h3>
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        Upload a previously exported backup file to restore and sync everything globally.
                      </p>
                    </div>
                    <label className="w-full inline-flex items-center justify-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-medium py-2.5 px-4 rounded-xl transition-colors cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Select Backup File</span>
                      <input
                        type="file"
                        accept=".json,application/json"
                        onChange={handleImportBackup}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* ================= EDIT SHOWCASE MODAL ================= */}
      {editingProject && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs">
          <div
            className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-xl border border-neutral-200 text-neutral-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
              <h3 className="text-base font-semibold text-neutral-900">Edit Showcase Item</h3>
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="w-8 h-8 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProject} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={editSubtitle}
                    onChange={(e) => setEditSubtitle(e.target.value)}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Category
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
                  >
                    {SHOWCASE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="Other">Other...</option>
                  </select>
                </div>

                {editCategory === 'Other' && (
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 mb-1">
                      Custom Category *
                    </label>
                    <input
                      type="text"
                      required
                      value={editCustomCategory}
                      onChange={(e) => setEditCustomCategory(e.target.value)}
                      className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Label / Badge
                  </label>
                  <input
                    type="text"
                    value={editBadge}
                    onChange={(e) => setEditBadge(e.target.value)}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Marquee Row
                  </label>
                  <select
                    value={editRow}
                    onChange={(e) => setEditRow(Number(e.target.value) as 1 | 2)}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900"
                  >
                    <option value={1}>Row 1 (Slides Left)</option>
                    <option value={2}>Row 2 (Slides Right)</option>
                  </select>
                </div>
              </div>

              {/* Media Source */}
              <div className="pt-3 border-t border-neutral-100 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-medium text-neutral-700">
                    Image or Video Media
                  </label>
                  <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg text-xs self-start">
                    {(['link', 'upload', 'preset'] as const).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setEditMediaMode(mode)}
                        className={`px-3 py-1 rounded-md cursor-pointer transition-colors ${
                          editMediaMode === mode
                            ? 'bg-white text-neutral-900 font-medium shadow-2xs'
                            : 'text-neutral-600 hover:text-neutral-900'
                        }`}
                      >
                        {mode === 'link' ? 'URL / Link' : mode === 'upload' ? 'Upload' : 'Presets'}
                      </button>
                    ))}
                  </div>
                </div>

                {editMediaMode === 'preset' && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {SHOWCASE_PRESET_IMAGES.map((preset) => {
                      const isPresetVid = isVideoMediaUrl(preset.path);
                      const isSelected = normalizeShowcaseImagePath(editImageUrl) === preset.path;
                      return (
                        <button
                          key={preset.filename}
                          type="button"
                          onClick={() => handleSelectPreset(preset, true)}
                          className={`p-1 rounded-lg border text-left cursor-pointer transition-all ${
                            isSelected ? 'border-neutral-900 ring-2 ring-neutral-900/15' : 'border-neutral-200 hover:border-neutral-400'
                          }`}
                        >
                          <div className="w-full aspect-square rounded-md overflow-hidden bg-neutral-900">
                            {isPresetVid ? (
                              <video src={preset.path} muted autoPlay loop playsInline className="w-full h-full object-cover" />
                            ) : (
                              <img src={preset.path} alt={preset.name} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <span className="text-[10px] font-medium block truncate mt-1">{preset.name}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {editMediaMode === 'upload' && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*,video/mp4,video/webm,video/quicktime"
                        onChange={(e) => handleProjectFileUpload(e, true)}
                        className="w-full text-xs text-neutral-600 file:mr-3 file:py-2 file:px-3.5 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-neutral-900 file:text-white cursor-pointer bg-neutral-50 border border-neutral-200 rounded-xl p-1"
                      />
                      {editImageUrl && (
                        <div className="w-11 h-14 rounded-lg overflow-hidden border border-neutral-200 shrink-0 bg-neutral-900">
                          {(editMediaKind === 'video' || (editMediaKind === 'auto' && isVideoMediaUrl(editImageUrl))) ? (
                            <video src={normalizeShowcaseImagePath(editImageUrl)} muted autoPlay loop playsInline className="w-full h-full object-cover" />
                          ) : (
                            <img src={normalizeShowcaseImagePath(editImageUrl)} alt="Preview" className="w-full h-full object-cover" />
                          )}
                        </div>
                      )}
                    </div>
                    {editUploadError && (
                      <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
                        {editUploadError}
                      </p>
                    )}
                  </div>
                )}

                {editMediaMode === 'link' && (
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="https://... (.jpg, .png, .webp, .mp4)"
                      value={editImageUrl}
                      onChange={(e) => {
                        setEditImageUrl(e.target.value);
                        setEditUploadError('');
                      }}
                      className="flex-1 text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2.5 text-neutral-900 focus:bg-white focus:outline-none focus:border-neutral-900 font-mono"
                    />
                    {editImageUrl && (
                      <div className="w-11 h-14 rounded-lg overflow-hidden border border-neutral-200 shrink-0 bg-neutral-900">
                        {(editMediaKind === 'video' || (editMediaKind === 'auto' && isVideoMediaUrl(editImageUrl))) ? (
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
                    )}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-neutral-500">Type:</span>
                    {(['auto', 'image', 'video'] as const).map((kind) => (
                      <button
                        key={kind}
                        type="button"
                        onClick={() => setEditMediaKind(kind)}
                        className={`px-2.5 py-1 rounded-lg border cursor-pointer transition-colors ${
                          editMediaKind === kind
                            ? 'bg-neutral-900 text-white border-neutral-900 font-medium'
                            : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        {kind === 'auto' ? 'Auto' : kind === 'image' ? 'Image' : 'Video'}
                      </button>
                    ))}
                  </div>

                  {(editMediaKind === 'video' || (editMediaKind === 'auto' && isVideoMediaUrl(editImageUrl))) && (
                    <input
                      type="text"
                      placeholder="Optional video poster image URL"
                      value={editVideoPosterUrl}
                      onChange={(e) => setEditVideoPosterUrl(e.target.value)}
                      className="flex-1 min-w-[200px] text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1.5 text-neutral-900 font-mono"
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setEditingProject(null)}
                  className="px-4 py-2 text-xs font-medium text-neutral-600 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCloudSyncing}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-medium bg-neutral-900 hover:bg-black disabled:opacity-60 text-white rounded-xl transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isCloudSyncing ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= CHANGE / FORGOT PASSWORD MODAL ================= */}
      {isChangePasswordOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-neutral-900">Password &amp; Recovery</h3>
              <button
                type="button"
                onClick={() => setIsChangePasswordOpen(false)}
                className="w-7 h-7 rounded-lg hover:bg-neutral-100 text-neutral-500 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {changePasswordInfo && (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs rounded-xl mb-3 border border-emerald-200 font-medium">
                {changePasswordInfo}
              </div>
            )}

            {changePasswordError && (
              <div className="p-2.5 bg-rose-50 text-rose-800 text-xs rounded-xl mb-3 border border-rose-200 font-medium">
                {changePasswordError}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-neutral-700">Current Password</label>
                  <button
                    type="button"
                    onClick={handleSendResetFromAdmin}
                    disabled={isSendingResetFromAdmin}
                    className="text-xs text-neutral-500 hover:text-neutral-900 hover:underline cursor-pointer disabled:opacity-60"
                  >
                    {isSendingResetFromAdmin ? 'Sending reset...' : 'Forgot password?'}
                  </button>
                </div>
                <input
                  type={showChangePasswordText ? 'text' : 'password'}
                  required
                  value={currentPasswordInput}
                  onChange={(e) => setCurrentPasswordInput(e.target.value)}
                  className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">New Password (min. 6 chars)</label>
                <input
                  type={showChangePasswordText ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={changeNewPassword}
                  onChange={(e) => setChangeNewPassword(e.target.value)}
                  className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">Confirm New Password</label>
                <input
                  type={showChangePasswordText ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={changeConfirmPassword}
                  onChange={(e) => setChangeConfirmPassword(e.target.value)}
                  className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-neutral-900"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-neutral-600 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={showChangePasswordText}
                  onChange={(e) => setShowChangePasswordText(e.target.checked)}
                />
                <span>Show passwords</span>
              </label>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(false)}
                  className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium py-2 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="flex-1 bg-neutral-900 hover:bg-black disabled:opacity-60 text-white text-xs font-medium py-2 rounded-xl cursor-pointer"
                >
                  {isChangingPassword ? 'Updating...' : 'Save Password'}
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