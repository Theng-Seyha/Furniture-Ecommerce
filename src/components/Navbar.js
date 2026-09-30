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
  }, [currentView]);

  // Deterministic, high-performance scroll spy for home sections
  // Guarantees that when at Journal (#blog), active state NEVER jumps to Reviews (#customer-reviews)
  useEffect(() => {
    if (currentView !== 'home') return;

    let ticking = false;

    const handleScrollSpy = () => {
      if (isManualNav) return;

      const triggerLine = 140; // Pixels from top of viewport, comfortably below 70px header
      const blogEl = document.getElementById('blog');
      const reviewsEl = document.getElementById('customer-reviews');
      const craftEl = document.getElementById('why-fur');
      const sigEl = document.getElementById('signature-collection');

      // 1. Journal check (checked first from bottom to top):
      // If user has reached or scrolled past the Journal section, Journal stays active
      if (blogEl && blogEl.getBoundingClientRect().top <= triggerLine) {
        setActiveNavId('blog');
        return;
      }

      // 2. Customer Reviews check:
      if (reviewsEl && reviewsEl.getBoundingClientRect().top <= triggerLine) {
        setActiveNavId('customer-reviews');
        return;
      }

      // 3. Craftsmanship check:
      if (craftEl && craftEl.getBoundingClientRect().top <= triggerLine) {
        setActiveNavId('why-fur');
        return;
      }

      // 4. Signature Collection check:
      if (sigEl && sigEl.getBoundingClientRect().top <= triggerLine) {
        setActiveNavId('signature-collection');
        return;
      }

      // 5. Above all sections (in Hero or Categories)
      setActiveNavId('');
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
    // Run initial check to sync state
    handleScrollSpy();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [currentView, isManualNav]);

  // Primary navigation links - All 7 links are concise, clean, and balanced
  const navLinks = [
    { id: 'featured-products', label: 'Shop', view: 'shop', primary: true, icon: Grid },
    { id: 'signature-collection', label: 'Signature', view: 'home', primary: true, icon: Sparkles },
    { id: 'why-fur', label: 'Craft', view: 'home', primary: true, icon: Layers },
    { id: 'customer-reviews', label: 'Reviews', view: 'home', primary: true, icon: Star },
    { id: 'order-tracking', label: 'Tracking', view: 'tracking', primary: true, icon: Clock },
    { id: 'blog', label: 'Journal', view: 'home', primary: true, icon: BookOpen },
    { id: 'contact', label: 'Contact', view: 'contact', primary: true, icon: MessageSquare },
  ];

  // Only activate hover glider on pointer devices capable of true hover (desktop/laptop mouse)
  const handleMouseEnter = (id) => {
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      setHoveredNavId(id);
    }
  };

  // Robust multi-phase smooth scrolling with sticky header offset and drawer closing compensation
  const smoothScrollToElement = (id) => {
    const doScroll = () => {
      const el = document.getElementById(id);
      if (!el) return false;
      const navHeader = document.querySelector('header');
      const headerHeight = navHeader ? navHeader.getBoundingClientRect().height : 70;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - (headerHeight + 12);
      
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth',
      });
      return true;
    };

    // Phase 1: Immediate scroll initiation for instant feedback on 1st click
    doScroll();
    // Phase 2: Refine as drawer collapse progresses
    setTimeout(doScroll, 80);
    // Phase 3: Final lock-in after drawer animation completes
    setTimeout(doScroll, 320);
  };

  const handleLinkClick = (id) => {
    // 1. Immediately close mobile menu if open
    setMobileMenuOpen(false);
    // 2. CRUCIAL: Immediately clear hover glider state on click so hover radius never stays frozen
    setHoveredNavId(null);
    setIsManualNav(true);

    if (id === 'home') {
      setActiveNavId('');
      if (currentView === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        onNavigate('home');
      }
      if (manualNavTimeoutRef.current) clearTimeout(manualNavTimeoutRef.current);
      manualNavTimeoutRef.current = setTimeout(() => setIsManualNav(false), 2500);
      return;
    }

    setActiveNavId(id);

    const targetLink = navLinks.find((l) => l.id === id);

    if (currentView === 'home' && targetLink && targetLink.view === 'home') {
      smoothScrollToElement(id);
      if (manualNavTimeoutRef.current) clearTimeout(manualNavTimeoutRef.current);
      manualNavTimeoutRef.current = setTimeout(() => setIsManualNav(false), 2500);
      return;
    }

    // Navigating from another view (e.g. shop, contact, tracking) to section or page
    onNavigate(id);
    if (manualNavTimeoutRef.current) clearTimeout(manualNavTimeoutRef.current);
    manualNavTimeoutRef.current = setTimeout(() => setIsManualNav(false), 2500);
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

      {/* 2. Floating Island Header - Modern Professional Architectural Top Bar */}
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF8F5]/90 dark:bg-[#121110]/90 backdrop-blur-md shadow-xs border-b border-stone-200/60 dark:border-stone-800/60 py-2 sm:py-2.5'
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

          {/* Center: Desktop & Tablet Navigation with Dynamic Radius & Fluid Motion Glider */}
          <nav
            onMouseLeave={() => setHoveredNavId(null)}
            className="hidden md:flex items-center bg-stone-100/90 dark:bg-stone-900/80 p-1 lg:p-1.5 rounded-xl lg:rounded-2xl border border-stone-200/80 dark:border-stone-800/80 shrink-0 shadow-2xs backdrop-blur-md transition-all duration-300 relative select-none"
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
                  onClick={(e) => { 
                    setHoveredNavId(null);
                    handleLinkClick(link.id); 
                    e.currentTarget.blur(); 
                  }}
                  className={`relative overflow-hidden px-1.5 md:px-2 lg:px-3 xl:px-3.5 py-1 md:py-1 lg:py-1.5 rounded-lg md:rounded-xl hover:rounded-xl navbar-radius-morph text-[10px] md:text-[10.5px] lg:text-xs font-semibold tracking-wider uppercase cursor-pointer whitespace-nowrap select-none shrink-0 inline-block active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-amber-700/50 ${
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
              className="navbar-radius-morph navbar-glow-hover relative overflow-hidden p-1.5 md:p-1.5 lg:p-2 rounded-lg md:rounded-xl hover:rounded-xl text-stone-600 dark:text-stone-300 hover:text-rose-600 dark:hover:text-rose-400 bg-stone-100/80 hover:bg-rose-50/70 dark:bg-stone-900/70 dark:hover:bg-stone-800/80 border border-stone-200/80 dark:border-stone-800/80 hover:border-rose-300 dark:hover:border-rose-900/60 cursor-pointer group"
              id="wishlist-toggle-btn"
            >
              <Heart className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110 group-hover:text-rose-600 dark:group-hover:text-rose-400" />
              {wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-3.5 h-3.5 md:w-4 md:h-4 flex items-center justify-center bg-rose-600 text-white text-[9px] md:text-[10px] font-bold rounded-full shadow-2xs tabular-nums border border-white dark:border-stone-900"
                >
                  {wishlistCount}
                </motion.span>
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
              className="navbar-radius-morph navbar-glow-hover relative overflow-hidden p-1.5 md:p-1.5 lg:p-2 rounded-lg md:rounded-xl hover:rounded-xl text-stone-600 dark:text-stone-300 hover:text-amber-800 dark:hover:text-amber-400 bg-stone-100/80 hover:bg-amber-50/70 dark:bg-stone-900/70 dark:hover:bg-stone-800/80 border border-stone-200/80 dark:border-stone-800/80 hover:border-amber-300 dark:hover:border-amber-800/60 cursor-pointer group"
              id="my-orders-btn"
            >
              <PackageCheck className="w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110 group-hover:text-amber-800 dark:group-hover:text-amber-400" />
              {savedOrdersCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-3.5 h-3.5 md:w-4 md:h-4 flex items-center justify-center bg-amber-700 text-white text-[9px] md:text-[10px] font-bold rounded-full shadow-2xs tabular-nums border border-white dark:border-stone-900"
                >
                  {savedOrdersCount}
                </motion.span>
              )}
            </motion.button>

            {/* Telegram Direct Trigger - Hidden on Tablets (< lg), Visible on Desktop (lg+) */}
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
              className="navbar-radius-morph navbar-glow-hover relative overflow-hidden hidden lg:inline-flex items-center p-1.5 lg:p-2 rounded-lg lg:rounded-xl hover:rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800/60 hover:bg-sky-100 dark:hover:bg-sky-900/50 hover:border-sky-300 cursor-pointer group"
              id="telegram-header-btn"
            >
              <Send className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.button>

            {/* Tablet-Only Add to Cart Icon Button (Replaces Telegram on Tablets for maximum responsiveness & clean layout) */}
            <motion.button
              whileHover={{ y: -1, scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={(e) => {
                setIsCartOpen(true);
                e.currentTarget.blur();
              }}
              aria-label="Open Shopping Cart"
              title="Shopping Cart / Add to Cart"
              className="navbar-radius-morph navbar-glow-hover relative overflow-hidden hidden md:inline-flex lg:hidden items-center p-1.5 rounded-lg hover:rounded-xl text-stone-700 dark:text-stone-200 hover:text-amber-800 dark:hover:text-amber-400 bg-stone-100/80 hover:bg-amber-50/70 dark:bg-stone-900/70 dark:hover:bg-stone-800/80 border border-stone-200/80 dark:border-stone-800/80 hover:border-amber-300 dark:hover:border-amber-800/60 cursor-pointer group shrink-0"
              id="tablet-cart-btn"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 transition-transform duration-300 group-hover:-rotate-6" />
              {totalItemsCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-3.5 h-3.5 flex items-center justify-center bg-amber-700 text-white text-[9px] font-bold rounded-full shadow-2xs tabular-nums border border-white dark:border-stone-900"
                >
                  {totalItemsCount}
                </motion.span>
              )}
            </motion.button>

            {/* Add to Cart / Shopping Bag Button (Shown on Mobile & Desktop lg+) */}
            <motion.button
              whileHover={{ y: -1.5, scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={(e) => {
                setIsCartOpen(true);
                e.currentTarget.blur();
              }}
              aria-label="Open Cart"
              title="Open Shopping Cart"
              className="navbar-radius-morph relative overflow-hidden px-2.5 lg:px-3 py-1.5 rounded-lg md:rounded-xl hover:rounded-xl text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-950 hover:bg-stone-800 dark:hover:bg-white border border-stone-900 dark:border-stone-100 cursor-pointer flex md:hidden lg:flex items-center gap-1.5 shadow-xs group shrink-0"
              id="cart-toggle-btn"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400 dark:text-amber-600 shrink-0 transition-transform duration-300 group-hover:-rotate-6" />
              <span className="text-[11px] md:text-xs font-bold tabular-nums">
                {totalItemsCount}
              </span>
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
              className="navbar-radius-morph relative overflow-hidden md:hidden p-1.5 sm:p-2 rounded-xl hover:rounded-2xl text-stone-700 dark:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/80 cursor-pointer"
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

        {/* Mobile & Tablet Drawer Menu with Radius-Morphing Links */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden bg-[#FAF8F5] dark:bg-[#141211] border-b border-stone-200 dark:border-stone-800 px-6 py-5 shadow-lg max-h-[calc(100vh-80px)] overflow-y-auto"
            >
              <div className="flex flex-col space-y-2">
                {navLinks.map((link) => {
                  const isActive = getIsActive(link);
                  const Icon = link.icon;
                  return (
                    <motion.button
                      key={link.id}
                      type="button"
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      onClick={(e) => {
                        handleLinkClick(link.id);
                        e.currentTarget.blur();
                      }}
                      className={`navbar-radius-morph relative overflow-hidden w-full text-left text-sm font-medium px-4 py-2.5 rounded-xl hover:rounded-2xl cursor-pointer flex items-center justify-between select-none ${
                        isActive
                          ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold shadow-xs'
                          : 'text-stone-700 dark:text-stone-200 hover:text-stone-950 dark:hover:text-white hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {Icon && (
                          <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive 
                              ? 'text-amber-400 dark:text-amber-600' 
                              : 'text-stone-500 dark:text-stone-400'
                          }`} />
                        )}
                        <span>{link.label}</span>
                      </div>
                      {isActive && (
                        <motion.span 
                          layoutId="mobile-drawer-dot" 
                          className="w-2 h-2 rounded-full bg-amber-400 dark:bg-amber-600 shadow-xs" 
                        />
                      )}
                    </motion.button>
                  );
                })}

                <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex flex-col gap-2.5">
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
                    className="navbar-radius-morph relative overflow-hidden flex items-center gap-2 w-full py-2.5 px-4 rounded-xl hover:rounded-2xl bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 text-xs font-bold cursor-pointer hover:bg-amber-100 dark:hover:bg-amber-900/40 shadow-xs active:scale-95"
                    id="mobile-track-order-btn"
                  >
                    <Clock className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                    <span>Quick Track Workshop Status</span>
                  </button>

                  {/* View My Orders (Mobile & Tablet) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      setMobileMenuOpen(false);
                      setIsOrdersModalOpen(true);
                      e.currentTarget.blur();
                    }}
                    className="navbar-radius-morph relative overflow-hidden flex items-center justify-between w-full py-2.5 px-4 rounded-xl hover:rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-medium cursor-pointer hover:bg-stone-200/80 dark:hover:bg-stone-700/80"
                    id="mobile-my-orders-btn"
                  >
                    <span className="flex items-center gap-2">
                      <PackageCheck className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                      <span>View My Orders</span>
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold">
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
                    className="navbar-radius-morph relative overflow-hidden flex items-center justify-between w-full py-2.5 px-4 rounded-xl hover:rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-medium cursor-pointer hover:bg-stone-200/80 dark:hover:bg-stone-700/80"
                    id="mobile-theme-toggle-btn"
                  >
                    <span className="flex items-center gap-2">
                      {isDarkMode ? (
                        <Sun className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Moon className="w-4 h-4 text-stone-600" />
                      )}
                      <span>Theme Appearance</span>
                    </span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-stone-200 dark:bg-stone-700 font-semibold">
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
                    className="navbar-radius-morph relative overflow-hidden flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl hover:rounded-2xl bg-sky-600 text-white font-medium text-xs hover:bg-sky-700 cursor-pointer shadow-xs active:scale-98"
                    id="mobile-telegram-status-btn"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Get Order Status via Telegram</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 3. Ergonomic Mobile Bottom Thumb Dock (Sticky Mobile Navigation with Dynamic Radius) */}
      <div className="md:hidden fixed bottom-3 left-3 right-3 z-40 bg-[#FAF8F5]/90 dark:bg-[#181614]/90 backdrop-blur-md rounded-2xl border border-stone-300/80 dark:border-stone-700/80 shadow-xl px-2 py-1.5 flex items-center justify-around select-none">
        <motion.button
          type="button"
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          onClick={(e) => {
            handleLinkClick('home');
            e.currentTarget.blur();
          }}
          className={`navbar-radius-morph relative overflow-hidden flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl hover:rounded-2xl cursor-pointer ${
            currentView === 'home' && (!activeNavId || activeNavId === '')
              ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold shadow-2xs'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800/50'
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
          className={`navbar-radius-morph relative overflow-hidden flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl hover:rounded-2xl cursor-pointer ${
            currentView === 'shop' || activeNavId === 'featured-products'
              ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold shadow-2xs'
              : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
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
          className="navbar-radius-morph relative overflow-hidden flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl hover:rounded-2xl text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 cursor-pointer"
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
          className="navbar-radius-morph relative overflow-hidden flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl hover:rounded-2xl text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 cursor-pointer"
          aria-label="View Saved Items"
        >
          <Heart className="w-4 h-4" />
          <span className="text-[10px]">Saved</span>
          {wishlistCount > 0 && (
            <span className="absolute -top-0.5 right-1 w-3.5 h-3.5 rounded-full bg-rose-600 text-white text-[8px] font-bold flex items-center justify-center tabular-nums">
              {wishlistCount}
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
          className="navbar-radius-morph relative overflow-hidden flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl hover:rounded-2xl text-stone-900 dark:text-stone-100 cursor-pointer font-semibold"
          aria-label="View Shopping Cart"
        >
          <ShoppingBag className="w-4 h-4 text-amber-800 dark:text-amber-400" />
          <span className="text-[10px]">Cart</span>
          {totalItemsCount > 0 && (
            <span className="absolute -top-0.5 right-1 w-3.5 h-3.5 rounded-full bg-amber-700 text-white text-[8px] font-bold flex items-center justify-center tabular-nums">
              {totalItemsCount}
            </span>
          )}
        </motion.button>
      </div>
    </>
  );
};
