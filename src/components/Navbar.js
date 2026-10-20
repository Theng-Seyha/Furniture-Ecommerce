import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag,
  Sun,
  Moon,
  Menu,
  X,
  Send,
  Search,
  Heart,
  Sparkles,
  Home,
  Grid,
  PackageCheck,
  Clock,
  BookOpen,
  Layers,
  Star,
  MessageSquare,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { TELEGRAM_CONFIG } from '../services/telegramService';
import { MobilePWAInstallItem } from './PWAControls';

/**
 * Senior / Staff Software Engineering Navigation Architecture
 * - Full-screen responsive grid across mobile, tablet (768px+), and desktop breakpoints (1024px, 1280px, 1440px+)
 * - Dynamic Hover Radius Morphing: smoothly transforms border-radius from rounded-xl to rounded-2xl with spring physics
 * - Pointer-Safe Floating Motion Glider: layoutId powered gliding frosted pill that smoothly follows cursor without touch stickiness
 * - Multi-Phase Smooth Scroll: accounts for sticky header offset and mobile menu collapse with 1-click execution
 * - Instant Hover Reset on Click: prevents stuck hover radii or frozen highlights on single clicks
 * - Ergonomic Mobile Bottom Thumb Dock with active spring transitions
 */
export const Navbar = ({ onNavigate }) => {
  const {
    currentView,
    totalItemsCount,
    setIsCartOpen,
    wishlistCount,
    setIsWishlistOpen,
    savedOrdersCount,
    setIsOrdersModalOpen,
    isTrackOrderModalOpen,
    setIsTrackOrderModalOpen,
    setIsSearchOpen,
    isDarkMode,
    toggleDarkMode,
    setIsTelegramModalOpen,
    showToast,
  } = useCart();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showTicker, setShowTicker] = useState(true);
  const [activeNavId, setActiveNavId] = useState('');
  const [hoveredNavId, setHoveredNavId] = useState(null);
  const [isManualNav, setIsManualNav] = useState(false);
  const manualNavTimeoutRef = useRef(null);

  // Track window scroll for subtle elevation styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (manualNavTimeoutRef.current) {
        clearTimeout(manualNavTimeoutRef.current);
      }
    };
  }, []);

  // Synchronize active nav item with route changes and hash
  useEffect(() => {
    const syncActiveNav = () => {
      if (isManualNav) return;
      const hash = window.location.hash.replace('#', '');
      
      if (currentView === 'shop') {
        setActiveNavId('featured-products');
      } else if (currentView === 'contact') {
        setActiveNavId('contact');
      } else if (currentView === 'tracking') {
        setActiveNavId('order-tracking');
      } else if (currentView === 'product-detail') {
        setActiveNavId('');
      } else if (currentView === 'home') {
        if (hash && ['signature-collection', 'why-fur', 'customer-reviews', 'blog'].includes(hash)) {
          setActiveNavId(hash);
        }
      }
    };

    syncActiveNav();
    window.addEventListener('hashchange', syncActiveNav);
    return () => window.removeEventListener('hashchange', syncActiveNav);
  }, [currentView, isManualNav]);

  // Deterministic, high-performance scroll spy for home sections
  // Accurately tracks active section using dual reading-zone and visibility checks.
  // Guarantees that when at Journal (#blog), active state NEVER jumps to Reviews (#customer-reviews)
  // and when at Reviews (#customer-reviews), active state NEVER falsely flips to Journal (#blog).
  useEffect(() => {
    if (currentView !== 'home') return;

    let ticking = false;

    const handleScrollSpy = () => {
      if (isManualNav) return;

      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // 1. Extreme top of page check: If near top (Hero or Categories), clear active section
      if (scrollY < 180) {
        setActiveNavId('');
        return;
      }

      // 2. Extreme bottom of page check: If scrolled to footer/newsletter area, Journal is active
      if (scrollY + windowHeight >= docHeight - 80) {
        setActiveNavId('blog');
        return;
      }

      const blogEl = document.getElementById('blog');
      const reviewsEl = document.getElementById('customer-reviews');
      const craftEl = document.getElementById('why-fur');
      const sigEl = document.getElementById('signature-collection');

      const sections = [
        { id: 'blog', el: blogEl },
        { id: 'customer-reviews', el: reviewsEl },
        { id: 'why-fur', el: craftEl },
        { id: 'signature-collection', el: sigEl },
      ];

      // 3. Focal Reading Line check: A section is active when its content occupies the primary focal reading zone (70px - 160px from top)
      const focalLine = 150;
      for (const section of sections) {
        if (section.el) {
          const rect = section.el.getBoundingClientRect();
          // Active when the focal line is within the section's top and bottom boundaries
          if (rect.top <= focalLine && rect.bottom > focalLine) {
            setActiveNavId(section.id);
            return;
          }
        }
      }

      // 4. Fallback: Identify which section has the greatest visible height in viewport
      let bestId = '';
      let maxVisible = 0;
      for (const section of sections) {
        if (section.el) {
          const rect = section.el.getBoundingClientRect();
          const visibleTop = Math.max(0, rect.top);
          const visibleBottom = Math.min(windowHeight, rect.bottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);
          if (visibleHeight > maxVisible) {
            maxVisible = visibleHeight;
            bestId = section.id;
          }
        }
      }

      if (bestId && maxVisible > 100) {
        setActiveNavId(bestId);
      }
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScrollSpy();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial check
    handleScrollSpy();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [currentView, isManualNav]);

  // Primary navigation links - All 7 links are concise, clean, and balanced with informative descriptors
  const navLinks = [
    { id: 'featured-products', label: 'Shop', desc: 'Full Catalog & Pieces', view: 'shop', primary: true, icon: Grid },
    { id: 'signature-collection', label: 'Signature', desc: 'Heirloom Artifacts', view: 'home', primary: true, icon: Sparkles },
    { id: 'why-fur', label: 'Craft', desc: 'Solid Wood Standards', view: 'home', primary: true, icon: Layers },
    { id: 'customer-reviews', label: 'Reviews', desc: 'Buyer Notes & Ratings', view: 'home', primary: true, icon: Star },
    { id: 'order-tracking', label: 'Tracking', desc: 'Live Production Logs', view: 'tracking', primary: true, icon: Clock },
    { id: 'blog', label: 'Journal', desc: 'Wood Notes & Bench Logs', view: 'home', primary: true, icon: BookOpen },
    { id: 'contact', label: 'Contact', desc: 'Workshop & Support', view: 'contact', primary: true, icon: MessageSquare },
  ];

  // Only activate hover glider on pointer devices capable of true hover (desktop/laptop mouse)
  const handleMouseEnter = (id) => {
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      setHoveredNavId(id);
    }
  };

  // Single-pass precise smooth scrolling with sticky header offset
  const smoothScrollToElement = (id) => {
    const el = document.getElementById(id);
    if (!el) return false;

    // Fixed closed sticky header height is ~64-70px
    const headerHeight = 70;
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - (headerHeight + 14);

    window.scrollTo({
      top: Math.max(0, offsetPosition),
      behavior: 'smooth',
    });
    return true;
  };

  const handleLinkClick = (id) => {
    // 1. Immediately close mobile menu if open
    setMobileMenuOpen(false);
    // 2. CRUCIAL: Immediately clear hover glider state on click so hover radius never stays frozen
    setHoveredNavId(null);
    // 3. Temporarily pause scroll spy to give smooth scroll priority
    setIsManualNav(true);
    if (manualNavTimeoutRef.current) clearTimeout(manualNavTimeoutRef.current);
    manualNavTimeoutRef.current = setTimeout(() => setIsManualNav(false), 1800);

    if (id === 'home') {
      setActiveNavId('');
      if (currentView === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        onNavigate('home');
      }
      return;
    }

    // 4. Immediately lock active state to clicked button ON 1ST CLICK (no double click required)
    setActiveNavId(id);

    const targetLink = navLinks.find((l) => l.id === id);

    // 5. If already on home and targeting home section, smooth scroll instantly on single click
    if (currentView === 'home' && targetLink && targetLink.view === 'home') {
      smoothScrollToElement(id);
      return;
    }

    // 6. Navigating from another view (e.g. shop, contact, tracking) to section or page
    onNavigate(id);
  };

  const getIsActive = (link) => {
    if (currentView === 'shop') return link.id === 'featured-products';
    if (currentView === 'contact') return link.id === 'contact';
    if (currentView === 'tracking') return link.id === 'order-tracking';
    if (currentView === 'product-detail') return false;
    return activeNavId === link.id;
  };

  return (
    <>
      {/* 1. Micro Announcement Ticker */}
      {showTicker && (
        <div className="bg-[#24211E] text-[#EDE8E1] text-[11px] font-medium py-1.5 px-4 border-b border-stone-800/80 transition-colors duration-300 overflow-hidden">
          <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-hidden">
            <div className="flex items-center gap-2 truncate">
              <span className="inline-flex items-center gap-1.5 text-amber-300 font-medium text-[11px] shrink-0">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Handcrafted in Phnom Penh
              </span>
              <span className="text-stone-500 shrink-0">•</span>
              <span className="text-stone-200 truncate">
                Direct courier dispatch within <b className="text-white font-semibold">24–48 hours</b>
              </span>
              <span className="hidden xl:inline text-stone-500 shrink-0">•</span>
              <span className="hidden xl:inline text-stone-300 truncate">
                Complimentary white-glove assembly on orders over $500
              </span>
            </div>

            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={() => setShowTicker(false)}
              className="text-stone-400 hover:text-white p-1 rounded-lg hover:rounded-xl navbar-radius-morph hover:bg-stone-800/80 shrink-0 hidden sm:inline-flex items-center justify-center cursor-pointer"
              aria-label="Dismiss announcement"
            >
              <X className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>
      )}

      {/* 2. Floating Island Header - Modern Professional Architectural Top Bar (Zero Blur, 100% Crisp) */}
      <header
        className={`sticky top-0 z-50 w-full overflow-x-clip transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF8F5] dark:bg-[#121110] shadow-xs border-b border-stone-200/80 dark:border-stone-800/80 py-2 sm:py-2.5'
            : 'bg-[#FAF8F5] dark:bg-[#121110] py-2 sm:py-3'
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 md:px-3 lg:px-8 flex items-center justify-between gap-1 md:gap-1.5 lg:gap-3">
          
          {/* Left: Brand Logo with Hover Radius Morphing & Spring Physics */}
          <motion.button
            type="button"
            whileHover={{ y: -0.5, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={(e) => {
              handleLinkClick('home');
              e.currentTarget.blur();
            }}
            className="navbar-radius-morph navbar-glow-hover relative overflow-hidden flex items-center gap-1.5 md:gap-2 cursor-pointer group select-none shrink-0 p-1 md:p-1.5 -ml-1 md:-ml-1.5 rounded-xl hover:rounded-2xl hover:bg-stone-200/50 dark:hover:bg-stone-800/50"
            title="Fur Home"
          >
            <div className="flex items-center shrink-0">
              <span className="text-xl sm:text-2xl md:text-2xl lg:text-3xl font-serif font-bold tracking-tight text-stone-900 dark:text-stone-100 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors duration-300">
                Fur
              </span>
              <div className="flex items-center ml-1 md:ml-1.5 gap-1 md:gap-1.5">
                <span className="block w-1.5 h-1.5 rounded-full bg-amber-700 dark:bg-amber-500 group-hover:scale-125 transition-transform duration-300" />
                <img 
                  src="/cambodia.jpg" 
                  alt="Cambodia" 
                  className="w-4 h-2.5 sm:w-4.5 sm:h-3 md:w-4.5 md:h-3 lg:w-5 lg:h-3.5 rounded-xs object-cover select-none shadow-2xs border border-stone-200/40 dark:border-stone-800/40 group-hover:shadow-xs transition-shadow duration-300"
                />
              </div>
            </div>
          </motion.button>

          {/* Center: Desktop & Tablet Navigation with Dynamic Radius & Fluid Motion Glider (Crisp Solid Canvas) */}
          <nav
            onMouseLeave={() => setHoveredNavId(null)}
            className="hidden md:flex items-center gap-0.5 lg:gap-1 bg-stone-100 dark:bg-stone-900 p-1 lg:p-1.5 rounded-xl lg:rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shrink-0 shadow-2xs transition-all duration-300 relative select-none"
          >
            {navLinks.map((link) => {
              const isActive = getIsActive(link);
              const isHovered = hoveredNavId === link.id;

              return (
                <button
                  key={link.id}
                  type="button"
                  data-active={isActive}
                  onMouseEnter={() => handleMouseEnter(link.id)}
                  onMouseLeave={() => {
                    if (hoveredNavId === link.id) setHoveredNavId(null);
                  }}
                  onClick={() => { 
                    setHoveredNavId(null);
                    handleLinkClick(link.id); 
                  }}
                  className={`relative overflow-hidden px-1.5 md:px-2 lg:px-3 xl:px-3.5 py-1 md:py-1 lg:py-1.5 rounded-lg md:rounded-xl hover:rounded-xl navbar-radius-morph text-[10px] md:text-[10.5px] lg:text-xs font-semibold tracking-wider uppercase cursor-pointer whitespace-nowrap select-none shrink-0 inline-block active:scale-95 transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-700/50 ${
                    isActive 
                      ? 'text-white dark:text-stone-900 font-bold' 
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-stone-100'
                  }`}
                >
                  {/* Motion Glider: Floating frosted highlight follows mouse between links with dynamic morphing */}
                  {isHovered && !isActive && (
                    <motion.div
                      layoutId="navbar-hover-glider"
                      className="absolute inset-0 bg-stone-200/75 dark:bg-stone-800/80 rounded-lg md:rounded-xl transition-[border-radius] duration-300 border border-stone-300/40 dark:border-stone-700/40 shadow-xs pointer-events-none"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      style={{ willChange: 'transform, border-radius' }}
                    />
                  )}

                  {/* Active Route Indicator: Crisp elevated pill with morphing radius */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 bg-stone-900 dark:bg-stone-100 rounded-lg md:rounded-xl shadow-xs pointer-events-none"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      style={{ willChange: 'transform, border-radius' }}
                    />
                  )}

                  <span className="relative z-10 transition-colors duration-200">
                    {link.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right: Clean, Streamlined Action Controls (Compact, Responsive, Fits Tablet with Zero Overflow) */}
          <div className="flex items-center gap-1 md:gap-1 lg:gap-1.5 shrink-0">
            {/* Search Spotlight Trigger */}
            <motion.button
              whileHover={{ y: -1, scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={(e) => {
                setIsSearchOpen(true);
                e.currentTarget.blur();
              }}
              aria-label="Search catalog"
              title="Search catalog (Cmd+K)"
              className="navbar-radius-morph navbar-glow-hover relative overflow-hidden p-1.5 md:p-1.5 lg:p-2 rounded-lg md:rounded-xl hover:rounded-xl text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 bg-stone-100/80 hover:bg-stone-200/80 dark:bg-stone-900/70 dark:hover:bg-stone-800/80 border border-stone-200/80 dark:border-stone-800/80 hover:border-amber-700/30 dark:hover:border-amber-500/30 cursor-pointer"
              id="search-spotlight-btn"
            >
              <Search className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400 transition-colors group-hover:text-amber-700" />
            </motion.button>

            {/* Theme Toggle Button with Micro-Rotation */}
            <motion.button
              whileHover={{ y: -1, scale: 1.06, rotate: isDarkMode ? 15 : -15 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={(e) => {
                toggleDarkMode();
                if (showToast) {
                  showToast(!isDarkMode ? 'Dark theme enabled' : 'Light theme enabled');
                }
                e.currentTarget.blur();
              }}
              aria-label="Toggle theme appearance"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="navbar-radius-morph navbar-glow-hover relative overflow-hidden p-1.5 md:p-1.5 lg:p-2 rounded-lg md:rounded-xl hover:rounded-xl text-stone-700 dark:text-stone-200 bg-stone-100/80 hover:bg-stone-200/80 dark:bg-stone-900/70 dark:hover:bg-stone-800/80 border border-stone-200/80 dark:border-stone-800/80 hover:border-amber-700/30 dark:hover:border-amber-500/30 cursor-pointer"
              id="theme-toggle-btn"
            >
              <motion.div
                key={isDarkMode ? 'dark' : 'light'}
                initial={{ rotate: -90, opacity: 0, scale: 0.85 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                {isDarkMode ? (
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-stone-700" />
                )}
              </motion.div>
            </motion.button>

            {/* Wishlist / Saved Items Button */}
            <motion.button
              whileHover={{ y: -1, scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={(e) => {
                setIsWishlistOpen(true);
                e.currentTarget.blur();
              }}
              aria-label="Open saved wishlist"
              title="Saved pieces"
              className="navbar-radius-morph navbar-glow-hover relative p-1.5 md:p-1.5 lg:p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:text-rose-600 dark:hover:text-rose-400 bg-stone-100/80 hover:bg-rose-50/70 dark:bg-stone-900/70 dark:hover:bg-stone-800/80 border border-stone-200/80 dark:border-stone-800/80 hover:border-rose-300 dark:hover:border-rose-900/60 cursor-pointer group active:scale-95 transition-all"
              id="wishlist-toggle-btn"
            >
              <Heart className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110 group-hover:text-rose-600 dark:group-hover:text-rose-400" />
              {wishlistCount > 0 && (
                <span
                  key={`wishlist-badge-${wishlistCount}`}
                  className="absolute -top-1.5 -right-1.5 min-w-[19px] h-[19px] px-1 bg-rose-600 text-white text-[10.5px] font-black leading-none rounded-full flex items-center justify-center shadow-xs border-2 border-white dark:border-[#121110] tabular-nums z-20 pointer-events-none select-none"
                >
                  {wishlistCount > 99 ? '99+' : wishlistCount}
                </span>
              )}
            </motion.button>

            {/* My Orders Button */}
            <motion.button
              whileHover={{ y: -1, scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={(e) => {
                setIsOrdersModalOpen(true);
                e.currentTarget.blur();
              }}
              aria-label="View My Orders"
              title="View previously submitted orders"
              className="navbar-radius-morph navbar-glow-hover relative p-1.5 md:p-1.5 lg:p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:text-amber-800 dark:hover:text-amber-400 bg-stone-100/80 hover:bg-amber-50/70 dark:bg-stone-900/70 dark:hover:bg-stone-800/80 border border-stone-200/80 dark:border-stone-800/80 hover:border-amber-300 dark:hover:border-amber-800/60 cursor-pointer group active:scale-95 transition-all"
              id="my-orders-btn"
            >
              <PackageCheck className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110 group-hover:text-amber-800 dark:group-hover:text-amber-400" />
              {savedOrdersCount > 0 && (
                <span
                  key={`orders-badge-${savedOrdersCount}`}
                  className="absolute -top-1.5 -right-1.5 min-w-[19px] h-[19px] px-1 bg-amber-700 text-white text-[10.5px] font-black leading-none rounded-full flex items-center justify-center shadow-xs border-2 border-white dark:border-[#121110] tabular-nums z-20 pointer-events-none select-none"
                >
                  {savedOrdersCount > 99 ? '99+' : savedOrdersCount}
                </span>
              )}
            </motion.button>

            {/* Telegram Direct Trigger - Hidden on Tablets (< xl), Visible on Desktop (xl+) */}
            <motion.button
              type="button"
              whileHover={{ y: -1, scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={(e) => {
                setIsTelegramModalOpen(true);
                e.currentTarget.blur();
              }}
              aria-label="Connect via Telegram Bot"
              title="Direct Workshop Telegram Bot"
              className="navbar-radius-morph navbar-glow-hover relative hidden xl:inline-flex items-center p-1.5 lg:p-2 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800/60 hover:bg-sky-100 dark:hover:bg-sky-900/50 hover:border-sky-300 cursor-pointer group active:scale-95 transition-all"
              id="telegram-header-btn"
            >
              <Send className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.button>


            {/* Add to Cart / Shopping Bag Button (Icon-only on tablet & mobile to keep header clean with zero horizontal scroll) */}
            <motion.button
              whileHover={{ y: -1, scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={(e) => {
                setIsCartOpen(true);
                e.currentTarget.blur();
              }}
              aria-label="Open Cart"
              title="Open Shopping Cart"
              className="navbar-radius-morph navbar-glow-hover relative inline-flex items-center gap-1.5 p-1.5 md:p-1.5 lg:p-2 xl:px-2.5 xl:py-1.5 rounded-lg md:rounded-xl text-stone-700 dark:text-stone-200 hover:text-amber-800 dark:hover:text-amber-400 bg-stone-100/80 hover:bg-amber-50/70 dark:bg-stone-900/70 dark:hover:bg-stone-800/80 border border-stone-200/80 dark:border-stone-800/80 hover:border-amber-300 dark:hover:border-amber-800/60 cursor-pointer shrink-0 active:scale-95 transition-all shadow-2xs"
              id="cart-toggle-btn"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 transition-transform duration-300 group-hover:-rotate-6" />
              <span className="hidden xl:inline text-[11px] font-bold tracking-wider uppercase select-none">
                Cart
              </span>
              {totalItemsCount > 0 && (
                <span className="min-w-[17px] h-[17px] px-1 bg-amber-700 text-white text-[9px] sm:text-[10px] font-black leading-none rounded-full flex items-center justify-center shadow-2xs tabular-nums select-none border-1.5 border-white dark:border-[#121110]">
                  {totalItemsCount > 99 ? '99+' : totalItemsCount}
                </span>
              )}
            </motion.button>

            {/* Mobile Menu Button with Dynamic Radius (Shown on mobile phones < md) */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={(e) => {
                setMobileMenuOpen(!mobileMenuOpen);
                e.currentTarget.blur();
              }}
              className="navbar-radius-morph relative md:hidden p-2 rounded-xl text-stone-700 dark:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 cursor-pointer active:scale-95 transition-all"
              id="mobile-menu-toggle-btn"
              aria-label="Toggle navigation menu"
            >
              <motion.div
                key={mobileMenuOpen ? 'open' : 'closed'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Drop Down List Menu with Fluid Floating Animation & Crisp Solid Canvas (Zero Blur) */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Dimmed Backdrop to close on tap-outside (Clean, crisp subtle scrim without heavy dark blur) */}
              <motion.div
                key="mobile-nav-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                onClick={() => setMobileMenuOpen(false)}
                className="md:hidden fixed inset-0 top-[52px] sm:top-[60px] bg-black/20 z-40"
              />

              {/* Floating Drop Down Panel: 100% Solid, razor-sharp, attractive styling without murky blur */}
              <motion.div
                key="mobile-nav-dropdown"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="md:hidden absolute top-full left-0 right-0 w-full bg-[#FAF8F5] dark:bg-[#141211] border-b-2 border-stone-300 dark:border-stone-800 px-3.5 sm:px-6 py-3.5 shadow-2xl max-h-[calc(100vh-76px)] overflow-y-auto z-50 divide-y divide-stone-200 dark:divide-stone-800"
              >
                {/* Clean Top Studio Indicator */}
                <div className="flex items-center justify-between pb-3 select-none">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-stone-700 dark:text-stone-300">
                      Studio Navigation
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-amber-800 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-950/70 px-2 py-0.5 rounded-full border border-amber-300/60 dark:border-amber-800/60">
                    Phnom Penh • 24–48h Dispatch
                  </span>
                </div>

                {/* Primary Nav Links - Clean, Crisp Cards with 1-Click Instant Execution (Clean like Signature, No Dark Blur/Black Fill) */}
                <div className="flex flex-col space-y-1.5 py-3">
                  {navLinks.map((link) => {
                    const isActive = getIsActive(link);
                    const Icon = link.icon;
                    return (
                      <motion.button
                        key={link.id}
                        type="button"
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          handleLinkClick(link.id);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 rounded-xl cursor-pointer flex items-center justify-between select-none transition-all duration-150 border ${
                          isActive
                            ? 'bg-white dark:bg-stone-900 text-stone-950 dark:text-stone-100 border-stone-400 dark:border-stone-600 ring-2 ring-amber-700/25 dark:ring-amber-500/25 shadow-xs'
                            : 'bg-white dark:bg-stone-900/60 text-stone-800 dark:text-stone-200 border-stone-200/90 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 active:bg-stone-200/90 dark:active:bg-stone-700/90'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-1.5 rounded-lg shrink-0 ${
                            isActive
                              ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300/70 dark:border-amber-800/70'
                              : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                          }`}>
                            {Icon && <Icon className="w-4 h-4" />}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs sm:text-sm font-bold tracking-tight">
                              {link.label}
                            </span>
                            {link.desc && (
                              <span className={`text-[10px] leading-tight ${
                                isActive ? 'text-stone-600 dark:text-stone-400 font-medium' : 'text-stone-500 dark:text-stone-400'
                              }`}>
                                {link.desc}
                              </span>
                            )}
                          </div>
                        </div>

                        {isActive && (
                          <div className="flex items-center gap-1.5 bg-amber-100/90 dark:bg-amber-950/90 border border-amber-300/80 dark:border-amber-800/80 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-700 dark:bg-amber-400 shrink-0" />
                            <span className="text-[9.5px] uppercase tracking-wider font-extrabold text-amber-900 dark:text-amber-300">
                              Active
                            </span>
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Secondary Quick Action Cards */}
                <div className="pt-3 flex flex-col gap-2">
                  {/* PWA Install Button for Mobile Drawer */}
                  <MobilePWAInstallItem />

                  {/* Track Order (Mobile & Tablet) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      setIsTrackOrderModalOpen(true);
                      e.currentTarget.blur();
                    }}
                    className="flex items-center gap-2.5 w-full py-2.5 px-3.5 rounded-xl bg-amber-100/80 dark:bg-amber-950/50 text-amber-950 dark:text-amber-200 text-xs font-bold cursor-pointer border border-amber-300/80 dark:border-amber-800/80 active:bg-amber-200/90 shadow-2xs active:scale-98 transition-all"
                    id="mobile-track-order-btn"
                  >
                    <Clock className="w-4 h-4 text-amber-800 dark:text-amber-400 shrink-0" />
                    <span className="truncate">Quick Track Workshop Status</span>
                  </button>

                  {/* View My Orders (Mobile & Tablet) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      setIsOrdersModalOpen(true);
                      e.currentTarget.blur();
                    }}
                    className="flex items-center justify-between w-full py-2.5 px-3.5 rounded-xl bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 text-xs font-semibold cursor-pointer border border-stone-200 dark:border-stone-800 active:bg-stone-100 dark:active:bg-stone-800 transition-all"
                    id="mobile-my-orders-btn"
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <PackageCheck className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
                      <span>View My Orders</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 font-bold border border-amber-300/60 dark:border-amber-800/60">
                      {savedOrdersCount}
                    </span>
                  </button>

                  {/* Mobile & Tablet Theme Toggle */}
                  <button
                    type="button"
                    onClick={(e) => {
                      toggleDarkMode();
                      e.currentTarget.blur();
                    }}
                    className="flex items-center justify-between w-full py-2.5 px-3.5 rounded-xl bg-white dark:bg-stone-900 text-stone-800 dark:text-stone-200 text-xs font-semibold cursor-pointer border border-stone-200 dark:border-stone-800 active:bg-stone-100 dark:active:bg-stone-800 transition-all"
                    id="mobile-theme-toggle-btn"
                  >
                    <span className="flex items-center gap-2.5">
                      {isDarkMode ? (
                        <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                      ) : (
                        <Moon className="w-4 h-4 text-stone-600 shrink-0" />
                      )}
                      <span>Theme Appearance</span>
                    </span>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-bold border border-stone-300/80 dark:border-stone-700/80">
                      {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                    </span>
                  </button>

                  {/* Mobile & Tablet Telegram Order Status & Support Link */}
                  <button
                    type="button"
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      setIsTelegramModalOpen(true);
                      e.currentTarget.blur();
                    }}
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs active:bg-sky-700 cursor-pointer shadow-sm active:scale-98 transition-all"
                    id="mobile-telegram-status-btn"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Chat With Master Artisan on Telegram</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>

      {/* 3. Ergonomic Mobile Bottom Thumb Dock (Sticky Mobile Navigation - hidden when mobile dropdown is open to prevent awkward overlap) */}
      {!mobileMenuOpen && (
        <div className="md:hidden fixed bottom-3 left-3 right-3 z-40 bg-[#FAF8F5] dark:bg-[#181614] rounded-2xl border border-stone-300 dark:border-stone-700 shadow-xl px-2 py-1.5 flex items-center justify-around select-none">
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={(e) => {
              handleLinkClick('home');
              e.currentTarget.blur();
            }}
            className={`relative flex flex-col items-center gap-1 px-3.5 py-1.5 rounded-xl cursor-pointer select-none transition-all duration-200 ${
              currentView === 'home'
                ? 'bg-amber-100/90 dark:bg-amber-950/70 text-amber-950 dark:text-amber-200 font-bold border border-amber-300/80 dark:border-amber-800/80 shadow-2xs'
                : 'text-stone-500 dark:text-stone-400 active:bg-stone-200/60 dark:active:bg-stone-800/60'
            }`}
            aria-label="Go to Home"
          >
            <Home className="w-4 h-4" />
            <span className="text-[10px]">Home</span>
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={(e) => {
              handleLinkClick('featured-products');
              e.currentTarget.blur();
            }}
            className={`relative flex flex-col items-center gap-1 px-3.5 py-1.5 rounded-xl cursor-pointer select-none transition-all duration-200 ${
              currentView === 'shop' || activeNavId === 'featured-products'
                ? 'bg-amber-100/90 dark:bg-amber-950/70 text-amber-950 dark:text-amber-200 font-bold border border-amber-300/80 dark:border-amber-800/80 shadow-2xs'
                : 'text-stone-500 dark:text-stone-400 active:bg-stone-200/60 dark:active:bg-stone-800/60'
            }`}
            aria-label="Browse Catalog"
          >
            <Grid className="w-4 h-4" />
            <span className="text-[10px]">Catalog</span>
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={(e) => {
              setIsSearchOpen(true);
              e.currentTarget.blur();
            }}
            className="relative flex flex-col items-center gap-1 px-3.5 py-1.5 rounded-xl text-stone-500 dark:text-stone-400 active:bg-stone-200/60 dark:active:bg-stone-800/60 cursor-pointer select-none transition-all duration-200"
            aria-label="Search Products"
          >
            <Search className="w-4 h-4" />
            <span className="text-[10px]">Search</span>
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={(e) => {
              setIsWishlistOpen(true);
              e.currentTarget.blur();
            }}
            className="relative flex flex-col items-center gap-1 px-3.5 py-1.5 rounded-xl text-stone-500 dark:text-stone-400 active:bg-stone-200/60 dark:active:bg-stone-800/60 cursor-pointer select-none transition-all duration-200"
            aria-label="View Saved Items"
          >
            <Heart className="w-4 h-4" />
            <span className="text-[10px]">Saved</span>
            {wishlistCount > 0 && (
              <span
                key={`mobile-wishlist-badge-${wishlistCount}`}
                className="absolute -top-1 right-2 min-w-[19px] h-[19px] px-1 rounded-full bg-rose-600 text-white text-[10.5px] font-black flex items-center justify-center tabular-nums leading-none border-2 border-white dark:border-stone-900 shadow-xs pointer-events-none z-20 select-none"
              >
                {wishlistCount > 99 ? '99+' : wishlistCount}
              </span>
            )}
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={(e) => {
              setIsCartOpen(true);
              e.currentTarget.blur();
            }}
            className="relative flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl text-stone-900 dark:text-stone-100 active:bg-stone-200/60 dark:active:bg-stone-800/60 cursor-pointer font-semibold select-none transition-all duration-200"
            aria-label="View Shopping Cart"
          >
            <div className="relative flex items-center justify-center">
              <ShoppingBag className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" />
              {totalItemsCount > 0 && (
                <span
                  key={`mobile-cart-badge-${totalItemsCount}`}
                  className="absolute -top-1 -right-2.5 min-w-[15px] h-[15px] px-0.5 bg-amber-700 text-white text-[8.5px] font-black flex items-center justify-center tabular-nums leading-none border-1.5 border-white dark:border-stone-900 shadow-xs pointer-events-none z-20 select-none rounded-full"
                >
                  {totalItemsCount > 99 ? '99+' : totalItemsCount}
                </span>
              )}
            </div>
            <span className="text-[9.5px]">Cart</span>
          </motion.button>
        </div>
      )}
    </>
  );
};
