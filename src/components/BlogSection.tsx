import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Clock,
  Calendar,
  Eye,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Share2,
  X,
  Check,
  Tag,
  Send
} from 'lucide-react';
import { BlogPost } from '../data/blogData.ts';

interface BlogSectionProps {
  posts: BlogPost[];
  onOpenArticleInquiry?: (articleTitle: string) => void;
  onOpenAdmin?: () => void;
  onBackToPortfolio?: () => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({
  posts,
  onOpenArticleInquiry,
  onOpenAdmin,
  onBackToPortfolio
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [readingPost, setReadingPost] = useState<BlogPost | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  const categories = [
    'All',
    'Graphic Design',
    'UI/UX & Figma',
    'Video & Motion',
    'Design & Code'
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      activeCategory === 'All' || post.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCategory;

    const matchesQuery =
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.tags.some((t) => t.toLowerCase().includes(query)) ||
      post.seoKeywords.some((k) => k.toLowerCase().includes(query));

    return matchesCategory && matchesQuery;
  });

  const featuredPost = posts.find((p) => p.featured) || posts[0];

  const handleShare = async (post: BlogPost) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#blog-${post.slug}`;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2200);
      }
    } catch {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2200);
    }
  };

  return (
    <section id="blog-section" className="w-full my-6 sm:my-8 bg-white rounded-[32px] sm:rounded-[40px] p-6 sm:p-10 md:p-12 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.04)] border border-white relative overflow-hidden transition-all duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-neutral-100">
        <div>
          {onBackToPortfolio && (
            <button
              onClick={onBackToPortfolio}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#F3F2EE] hover:bg-[#EAE8E2] text-neutral-800 rounded-full text-xs font-semibold border border-neutral-300/60 transition-colors cursor-pointer mb-3.5 active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-neutral-700" />
              <span>Back to Portfolio</span>
            </button>
          )}

          <div className="inline-flex items-center gap-2 bg-[#F3F2EE] px-3 py-1 rounded-full text-xs font-semibold text-neutral-700 mb-3 border border-neutral-200/60 ml-0">
            <BookOpen className="w-3.5 h-3.5 text-neutral-800" />
            <span>Design &amp; Engineering Journal</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-[38px] font-bold text-neutral-900 leading-[1.18] tracking-[-0.03em]">
            Insights, Tutorials &amp; SEO Trends
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 mt-2 max-w-xl font-normal leading-relaxed">
            Ranked guides on Adobe Creative Suite workflows, Figma component systems, motion graphics, and full-stack front-end design.
          </p>
        </div>

        {/* Search Bar (New Post removed as requested) */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search trending keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-[#F8F7F4] border border-neutral-200/80 rounded-full pl-9 pr-4 py-2 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-6 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all shrink-0 cursor-pointer ${
              activeCategory === cat
                ? 'bg-neutral-900 text-white shadow-2xs'
                : 'bg-[#F5F4F0] text-neutral-600 hover:text-neutral-900 hover:bg-[#EDEBE5]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Article Card (when no specific search active) */}
      {!searchQuery && activeCategory === 'All' && featuredPost && (
        <div
          onClick={() => setReadingPost(featuredPost)}
          className="mt-6 p-6 sm:p-8 bg-gradient-to-br from-[#1E1E1E] to-[#2B2B28] rounded-3xl text-white shadow-lg cursor-pointer hover:shadow-xl transition-all group"
        >
          <div className="flex items-center gap-2 text-xs text-neutral-300 font-mono mb-3">
            <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-0.5 rounded-full font-semibold">
              Trending Spotlight
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {featuredPost.readTime}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> {featuredPost.views.toLocaleString()} reads
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-3 group-hover:text-amber-200 transition-colors">
            {featuredPost.title}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-300 line-clamp-2 max-w-2xl leading-relaxed mb-6">
            {featuredPost.excerpt}
          </p>

          <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full overflow-hidden bg-neutral-700">
                <img
                  src={featuredPost.author.avatar}
                  alt={featuredPost.author.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xs font-semibold text-neutral-200">{featuredPost.author.name}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 group-hover:translate-x-1 transition-transform">
              <span>Read Full Article</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      )}

      {/* Grid of Blog Posts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            onClick={() => setReadingPost(post)}
            className="group bg-[#FAF9F6] hover:bg-white rounded-2xl p-5 border border-neutral-200/70 hover:border-neutral-300 hover:shadow-[0_12px_30px_-8px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between cursor-pointer"
          >
            <div>
              {/* Top metadata */}
              <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-neutral-400 mb-2.5">
                <span className="bg-white text-neutral-700 px-2.5 py-0.5 rounded-full border border-neutral-200/80 font-medium font-sans">
                  {post.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {post.readTime}
                </span>
              </div>

              {/* Title & Excerpt */}
              <h4 className="text-base font-bold text-neutral-900 group-hover:text-black tracking-tight leading-snug line-clamp-2 mb-2">
                {post.title}
              </h4>
              <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed mb-4">
                {post.excerpt}
              </p>
            </div>

            {/* Bottom tags & read link */}
            <div className="pt-3 border-t border-neutral-200/60 flex items-center justify-between text-xs">
              <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {post.publishedDate}
              </span>
              <span className="font-semibold text-neutral-800 group-hover:text-black inline-flex items-center gap-1">
                <span>Read</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </article>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12 bg-[#FAF9F6] rounded-2xl border border-dashed border-neutral-300 mt-6">
          <BookOpen className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-neutral-800">No articles matched your search</p>
          <p className="text-xs text-neutral-500 mt-1">Try keywords like "Photoshop", "Figma", "Premiere", or "Typography"</p>
        </div>
      )}

      {/* Reader Modal View */}
      {readingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white rounded-[28px] sm:rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl border border-neutral-200 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-neutral-100 flex items-center justify-between bg-white/95 backdrop-blur-xs sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <span className="bg-[#F5F4F0] text-neutral-700 text-xs px-3 py-1 rounded-full font-semibold border border-neutral-200/70">
                  {readingPost.category}
                </span>
                <span className="text-xs text-neutral-400 hidden sm:inline">&bull;</span>
                <span className="text-xs text-neutral-500 hidden sm:inline">{readingPost.readTime}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleShare(readingPost)}
                  className="p-2 hover:bg-neutral-100 rounded-full text-neutral-600 transition-colors cursor-pointer flex items-center gap-1 text-xs"
                  title="Copy share link"
                >
                  {copiedShare ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold text-[11px]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      <span className="hidden sm:inline text-[11px]">Share</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setReadingPost(null)}
                  className="p-2 hover:bg-neutral-100 rounded-full text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
                  title="Close Article"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 md:p-10 overflow-y-auto space-y-6 text-neutral-800">
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-neutral-900 leading-tight">
                  {readingPost.title}
                </h1>

                {/* Author row */}
                <div className="flex items-center justify-between flex-wrap gap-4 mt-4 pt-4 border-t border-neutral-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={readingPost.author.avatar}
                      alt={readingPost.author.name}
                      className="w-10 h-10 rounded-full object-cover border border-neutral-200"
                    />
                    <div>
                      <div className="text-xs font-bold text-neutral-900">{readingPost.author.name}</div>
                      <div className="text-[11px] text-neutral-500">{readingPost.author.role}</div>
                    </div>
                  </div>

                  <div className="text-right text-xs text-neutral-400">
                    <div>Published on {readingPost.publishedDate}</div>
                    <div className="text-[11px] font-mono">{readingPost.views.toLocaleString()} Views</div>
                  </div>
                </div>
              </div>

              {/* Lead excerpt */}
              <div className="bg-[#FAF9F6] p-4 sm:p-5 rounded-2xl border-l-4 border-neutral-900 text-xs sm:text-sm text-neutral-700 italic leading-relaxed">
                {readingPost.excerpt}
              </div>

              {/* Formatted Article Body */}
              <div className="prose prose-neutral max-w-none text-xs sm:text-sm leading-relaxed space-y-4">
                {readingPost.content.split('\n\n').map((paragraph, index) => {
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={index} className="text-lg sm:text-xl font-bold text-neutral-900 pt-4 pb-1 border-b border-neutral-100">
                        {paragraph.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h3 key={index} className="text-sm sm:text-base font-bold text-neutral-900 pt-3">
                        {paragraph.replace('### ', '')}
                      </h3>
                    );
                  }
                  if (paragraph.startsWith('> ')) {
                    return (
                      <blockquote key={index} className="border-l-2 border-neutral-400 pl-4 py-1 italic text-neutral-600 bg-[#F5F4F0] rounded-r-lg my-3">
                        {paragraph.replace('> ', '')}
                      </blockquote>
                    );
                  }
                  if (paragraph.startsWith('* ') || paragraph.startsWith('1. ')) {
                    return (
                      <div key={index} className="pl-4 space-y-1.5 my-2">
                        {paragraph.split('\n').map((line, lIdx) => (
                          <div key={lIdx} className="text-neutral-700 flex items-start gap-2">
                            <span className="font-bold text-neutral-900">&bull;</span>
                            <span>{line.replace(/^(\*|\d+\.)\s+/, '')}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return (
                    <p key={index} className="text-neutral-700 leading-relaxed">
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* SEO Trending Keywords Cloud */}
              <div className="pt-6 border-t border-neutral-100">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Ranked Keywords &amp; Topics</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {readingPost.seoKeywords.map((keyword, i) => (
                    <span
                      key={i}
                      className="bg-[#F5F4F0] text-neutral-700 text-[11px] font-mono px-3 py-1 rounded-full border border-neutral-200/80"
                    >
                      #{keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Inquire / Work Together Action Card */}
              <div className="p-5 sm:p-6 bg-[#F8F7F4] rounded-2xl border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-neutral-900">Need creative design or engineering?</h4>
                  <p className="text-xs text-neutral-500 mt-0.5">Let's discuss branding, poster campaigns, or design systems.</p>
                </div>
                <button
                  onClick={() => {
                    const title = readingPost.title;
                    setReadingPost(null);
                    if (onOpenArticleInquiry) {
                      onOpenArticleInquiry(`Regarding Article: ${title}`);
                    }
                  }}
                  className="inline-flex items-center gap-2 bg-neutral-900 hover:bg-black text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-xs transition-all cursor-pointer whitespace-nowrap"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Work With Kawsar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
