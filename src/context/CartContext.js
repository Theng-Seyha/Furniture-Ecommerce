import { createContext, useContext, useEffect, useState } from 'react';
import { ALL_PRODUCTS } from '../data/furnitureData';

const CartContext = createContext(undefined);

const CART_STORAGE_KEY = 'fur_furniture_cart_v2';
const WISHLIST_STORAGE_KEY = 'fur_furniture_wishlist_v1';
const THEME_STORAGE_KEY = 'fur_furniture_theme';
const ORDERS_STORAGE_KEY = 'fur_furniture_orders_v1';
const RECENT_ORDER_KEY = 'fur_recent_order';
const RECENTLY_VIEWED_KEY = 'fur_recently_viewed_v1';
const ASSEMBLY_FEE_PER_ITEM = 40;
const FREE_SHIPPING_THRESHOLD = 500;

export const CartProvider = ({ children }) => {
  // 1. Persistent Cart
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY) || localStorage.getItem('anti_furniture_cart_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        const map = new Map();
        parsed.forEach(item => {
          const key = `${item.product?.id || item.id}-${item.selectedColor || 'Standard'}`;
          if (map.has(key)) {
            const existing = map.get(key);
            existing.quantity = (existing.quantity || 1) + (item.quantity || 1);
          } else {
            map.set(key, { ...item });
          }
        });
        return Array.from(map.values());
      }
    } catch (e) {
      console.error('Failed to load cart from localStorage:', e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage:', e);
    }
  }, [cart]);

  // 2. Persistent Wishlist / Saved Items
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY) || localStorage.getItem('anti_furniture_wishlist_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        const map = new Map();
        parsed.forEach(p => {
          const pId = p?.product?.id || p?.id;
          if (pId) map.set(pId, p);
        });
        return Array.from(map.values());
      }
    } catch (e) {
      console.error('Failed to load wishlist from localStorage:', e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage:', e);
    }
  }, [wishlist]);

  // 2b. Persistent My Orders (Archived from checkout completions)
  const [savedOrders, setSavedOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
      const oldSaved = localStorage.getItem('anti_furniture_orders_v1');
      if (oldSaved) return JSON.parse(oldSaved);

      // Check if there was an order saved in single recent key
      const singleRecent = localStorage.getItem(RECENT_ORDER_KEY) || localStorage.getItem('anti_recent_order');
      if (singleRecent) {
        return [JSON.parse(singleRecent)];
      }
    } catch (e) {
      console.error('Failed to load orders from localStorage:', e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(savedOrders));
    } catch (e) {
      console.error('Failed to save orders to localStorage:', e);
    }
  }, [savedOrders]);

  const recordNewOrder = (orderData) => {
    setSavedOrders((prev) => {
      const existing = prev.filter((o) => o.orderId !== orderData.orderId);
      const updated = [orderData, ...existing];
      try {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
        localStorage.setItem(RECENT_ORDER_KEY, JSON.stringify(orderData));
      } catch (err) {
        console.warn('Storage error:', err);
      }
      return updated;
    });
  };

  const deleteOrder = (orderId) => {
    setSavedOrders((prev) => prev.filter((o) => o.orderId !== orderId));
    showToast(`Order ${orderId} removed from history`);
  };

  const clearAllOrders = () => {
    setSavedOrders([]);
    try {
      localStorage.removeItem(ORDERS_STORAGE_KEY);
      localStorage.removeItem(RECENT_ORDER_KEY);
    } catch (err) {
      console.warn('Storage clear error:', err);
    }
    showToast('Order history cleared');
  };

  // 2c. Persistent Recently Viewed Pieces (last 8 viewed)
  const [recentlyViewedIds, setRecentlyViewedIds] = useState(() => {
    try {
      const saved = localStorage.getItem(RECENTLY_VIEWED_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load recently viewed from localStorage:', e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(recentlyViewedIds));
    } catch (e) {
      console.error('Failed to save recently viewed:', e);
    }
  }, [recentlyViewedIds]);

  const recordRecentlyViewed = (productId) => {
    if (!productId) return;
    setRecentlyViewedIds((prev) => {
      const filtered = prev.filter((id) => id !== productId);
      return [productId, ...filtered].slice(0, 8);
    });
  };

  const clearRecentlyViewed = () => {
    setRecentlyViewedIds([]);
    try {
      localStorage.removeItem(RECENTLY_VIEWED_KEY);
    } catch (err) {
      console.warn('Storage clear error:', err);
    }
  };

  const recentlyViewedProducts = recentlyViewedIds
    .map((id) => ALL_PRODUCTS.find((p) => p.id === id))
    .filter(Boolean);

  // 3. Dark / Light Mode with system preference detection
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme !== null) {
        return savedTheme === 'dark';
      }
      return (
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
      );
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Helper to resolve product across all legacy ID patterns, numeric IDs, and slugs
  const resolveProduct = (productIdOrSlug) => {
    if (!productIdOrSlug) return null;
    const cleanId = String(productIdOrSlug).trim().toLowerCase();

    // 1. Direct ID match
    let match = ALL_PRODUCTS.find((p) => p.id.toLowerCase() === cleanId);
    if (match) return match;

    // 2. With 'fur-' prefix
    match = ALL_PRODUCTS.find((p) => p.id.toLowerCase() === `fur-${cleanId}`);
    if (match) return match;

    // 3. Stripping legacy 'anti-' or 'fur-' prefixes
    const strippedTarget = cleanId.replace(/^(fur|anti)-/, '');
    match = ALL_PRODUCTS.find((p) => p.id.replace(/^(fur|anti)-/, '') === strippedTarget);
    if (match) return match;

    // 4. Numeric ending match (e.g., '1' matches 'fur-kanso-sofa-1')
    match = ALL_PRODUCTS.find((p) => p.id.endsWith(`-${cleanId}`));
    if (match) return match;

    // 5. Slug match by product name (e.g., 'kanso-modular-three-seater')
    match = ALL_PRODUCTS.find(
      (p) => p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === cleanId
    );
    if (match) return match;

    return null;
  };

  // 4. Universal View Routing (Supports direct paths, query params, hashes, and backward-compatible URLs)
  const parseRoute = () => {
    if (typeof window === 'undefined') {
      return { view: 'home', productId: null, sectionId: null };
    }

    try {
      // Check query string parameters first (e.g. ?product=fur-kanso-sofa-1 or ?view=shop)
      const searchParams = new URLSearchParams(window.location.search || '');
      const queryProduct = searchParams.get('product') || searchParams.get('p') || searchParams.get('id');
      const queryView = searchParams.get('view') || searchParams.get('page');
      const querySection = searchParams.get('section');

      if (queryProduct) {
        return { view: 'product-detail', productId: decodeURIComponent(queryProduct).trim(), sectionId: null };
      }
      if (queryView) {
        const v = queryView.toLowerCase().trim();
        if (v === 'shop' || v === 'catalog' || v === 'featured-products') return { view: 'shop', productId: null, sectionId: null };
        if (v === 'contact' || v === 'showroom') return { view: 'contact', productId: null, sectionId: null };
        if (v === 'tracking' || v === 'order-tracking' || v === 'orders') return { view: 'tracking', productId: null, sectionId: null };
      }

      // Parse hash (strip leading '#', '#!', '#/', etc.)
      const rawHash = (window.location.hash || '').replace(/^#[!/]+/, '').replace(/^#/, '').trim();
      // Parse pathname (strip leading/trailing slashes)
      const rawPath = (window.location.pathname || '').replace(/^\/+/, '').replace(/\/+$/, '').trim();

      // Clean out any query suffix from hash
      const cleanHash = rawHash.split('?')[0].split('&')[0];
      const cleanPath = rawPath.split('?')[0].split('&')[0];

      // Prefer hash if present, fallback to pathname for clean and old URL support
      const target = (cleanHash || cleanPath || '').trim();

      if (!target || target === 'index.html' || target === 'home') {
        return { view: 'home', productId: null, sectionId: querySection || null };
      }

      // Check product routes: product/..., products/..., item/..., items/...
      const productPrefixMatch = target.match(/^(?:product|products|item|items)\/(.+)$/i);
      if (productPrefixMatch && productPrefixMatch[1]) {
        const pid = decodeURIComponent(productPrefixMatch[1]).trim();
        return { view: 'product-detail', productId: pid, sectionId: null };
      }

      // Check shop/catalog routes
      if (['shop', 'catalog', 'featured-products', 'store', 'collection', 'products'].includes(target.toLowerCase())) {
        return { view: 'shop', productId: null, sectionId: null };
      }

      // Check contact routes
      if (['contact', 'showroom', 'support', 'help'].includes(target.toLowerCase())) {
        return { view: 'contact', productId: null, sectionId: null };
      }

      // Check tracking routes
      if (['tracking', 'order-tracking', 'track', 'orders', 'my-orders'].includes(target.toLowerCase())) {
        return { view: 'tracking', productId: null, sectionId: null };
      }

      // Check home section targets
      if (['signature-collection', 'signature', 'why-fur', 'about', 'customer-reviews', 'reviews', 'blog', 'stories'].includes(target.toLowerCase())) {
        const sectionMap = {
          'signature': 'signature-collection',
          'signature-collection': 'signature-collection',
          'why-fur': 'why-fur',
          'about': 'why-fur',
          'customer-reviews': 'customer-reviews',
          'reviews': 'customer-reviews',
          'stories': 'customer-reviews',
          'blog': 'blog'
        };
        return { view: 'home', productId: null, sectionId: sectionMap[target.toLowerCase()] || target };
      }

      // Direct product ID without prefix (e.g. /fur-kanso-sofa-1)
      const directProduct = resolveProduct(target);
      if (directProduct) {
        return { view: 'product-detail', productId: directProduct.id, sectionId: null };
      }

      return { view: 'home', productId: null, sectionId: null };
    } catch {
      return { view: 'home', productId: null, sectionId: null };
    }
  };

  const initialRoute = parseRoute();
  const [currentView, setCurrentView] = useState(initialRoute.view);
  const [selectedProductId, setSelectedProductId] = useState(initialRoute.productId);

  useEffect(() => {
    const handleRouteChange = () => {
      const route = parseRoute();
      
      setCurrentView(route.view);
      setSelectedProductId(route.productId);
      
      if (route.view === 'home' && route.sectionId) {
        setTimeout(() => {
          const el = document.getElementById(route.sectionId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      } else if (route.view !== 'home' || (!window.location.hash && !window.location.pathname.replace(/^\/+/, ''))) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  const navigateToProduct = (productId) => {
    setSelectedProductId(productId);
    recordRecentlyViewed(productId);
    setCurrentView('product-detail');
    window.location.hash = `product/${productId}`;
    // scrollTo(0) is handled by handleHashChange
  };

  const navigateTo = (view, sectionId = null) => {
    if (view === 'home') {
      const isAlreadyHome = currentView === 'home';
      if (!isAlreadyHome) {
        setCurrentView('home');
        setSelectedProductId(null);
      }
      
      window.history.replaceState(null, '', window.location.pathname);

      if (sectionId) {
        const scrollToTarget = () => {
          const el = document.getElementById(sectionId);
          if (el) {
            const navHeader = document.querySelector('header');
            const headerHeight = navHeader ? navHeader.getBoundingClientRect().height : 70;
            const elementPosition = el.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - (headerHeight + 12);
            window.scrollTo({
              top: Math.max(0, offsetPosition),
              behavior: 'smooth',
            });
            return true;
          }
          return false;
        };

        if (isAlreadyHome) {
          // Immediately scroll if already on home
          scrollToTarget();
        } else {
          // When switching from other views, AnimatePresence takes ~200-300ms to mount home.
          // Polling every 30ms ensures it scrolls on the very FIRST click the millisecond DOM mounts!
          let attempts = 0;
          const intervalId = setInterval(() => {
            attempts++;
            if (scrollToTarget() || attempts >= 25) {
              clearInterval(intervalId);
            }
          }, 30);
        }
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      setCurrentView(view);
      setSelectedProductId(null);
      // Safe hash update without triggering browser native element jump away from top header
      if (typeof window !== 'undefined') {
        try {
          window.history.replaceState(null, '', `#${view}`);
        } catch {
          window.location.hash = view;
        }
        window.scrollTo({ top: 0, behavior: 'instant' });
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }, 30);
      }
    }
  };

  const currentProduct = selectedProductId
    ? resolveProduct(selectedProductId)
    : null;

  // 5. Drawer and Modal Visibility States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [isTrackOrderModalOpen, setIsTrackOrderModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Automatically record when product is opened in quick view
  useEffect(() => {
    if (quickViewProduct && quickViewProduct.id) {
      recordRecentlyViewed(quickViewProduct.id);
    }
  }, [quickViewProduct]);
  const [isTelegramModalOpen, setIsTelegramModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  /**
   * Global helper for Telegram API feedback
   */
  const notifyTelegramResult = (success, actionLabel = 'Order') => {
    if (success) {
      showToast(`🎉 ${actionLabel} transmitted successfully to workshop bot.`);
    } else {
      showToast(`⚠️ ${actionLabel} relay failed. Please message @FurnitureOnlineSellingbot directly.`);
    }
  };

  // Cart Operations
  const addToCart = (product, quantity = 1, selectedColor, includeAssembly = false, selectedImage = null) => {
    const color =
      selectedColor || (product.colors && product.colors[0]?.name) || 'Standard';
    const chosenImage = selectedImage || product.image;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === color &&
          (item.selectedImage || item.product.image) === chosenImage
      );

      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + quantity,
          includeAssembly: includeAssembly || newCart[existingIndex].includeAssembly,
        };
        return newCart;
      } else {
        return [
          ...prevCart,
          {
            product,
            quantity,
            selectedColor: color,
            includeAssembly,
            selectedImage: chosenImage,
          },
        ];
      }
    });

    showToast(`Added "${product.name}" (${color}) to your cart.`);
  };

  const removeFromCart = (productId, selectedColor) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            item.product.id === productId &&
            (!selectedColor || item.selectedColor === selectedColor)
          )
      )
    );
  };

  const updateQuantity = (productId, quantity, selectedColor) => {
    if (quantity <= 0) {
      removeFromCart(productId, selectedColor);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) => {
        if (
          item.product.id === productId &&
          (!selectedColor || item.selectedColor === selectedColor)
        ) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const toggleItemAssembly = (productId, selectedColor) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (
          item.product.id === productId &&
          (!selectedColor || item.selectedColor === selectedColor)
        ) {
          return { ...item, includeAssembly: !item.includeAssembly };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist Operations
  const isWishlisted = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const toggleWishlist = (product) => {
    if (isWishlisted(product.id)) {
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      showToast(`Removed "${product.name}" from saved pieces.`);
    } else {
      setWishlist((prev) => [...prev, product]);
      showToast(`Saved "${product.name}" to your wishlist.`);
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearWishlist = () => {
    setWishlist([]);
    showToast('Wishlist cleared');
  };

  // Promo Codes
  const applyPromoCode = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'FUR25' || clean === 'SUMMER25' || clean === 'ANTI25') {
      setPromoCode(clean);
      setDiscountPercent(0.25);
      return { success: true, message: '🎉 Summer Special Deal applied! 25% discount activated.' };
    } else if (clean === 'STUDIO15') {
      setPromoCode(clean);
      setDiscountPercent(0.15);
      return { success: true, message: '15% Studio Friend discount applied.' };
    } else if (clean === 'WELCOME10') {
      setPromoCode(clean);
      setDiscountPercent(0.1);
      return { success: true, message: '10% Welcome Homeowner discount applied.' };
    }
    return { success: false, message: 'Invalid promo code. Try "SUMMER25" for 25% off!' };
  };

  // Calculations
  const totalItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const assemblyTotal = cart.reduce(
    (acc, item) => acc + (item.includeAssembly ? ASSEMBLY_FEE_PER_ITEM * item.quantity : 0),
    0
  );
  const discount = Math.round(subtotal * discountPercent);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : 45;
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const total = Math.max(0, subtotal + assemblyTotal - discount + (subtotal > 0 ? shipping : 0));

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleItemAssembly,
        clearCart,
        totalItemsCount,
        subtotal,
        assemblyTotal,
        discount,
        promoCode,
        applyPromoCode,
        shipping,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        amountNeededForFreeShipping,
        total,
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        wishlist,
        wishlistCount: wishlist.length,
        isWishlisted,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        // Saved Orders & History
        savedOrders,
        savedOrdersCount: savedOrders.length,
        isOrdersModalOpen,
        setIsOrdersModalOpen,
        isTrackOrderModalOpen,
        setIsTrackOrderModalOpen,
        recordNewOrder,
        deleteOrder,
        clearAllOrders,
        isSearchOpen,
        setIsSearchOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        quickViewProduct,
        setQuickViewProduct,
        recentlyViewedProducts,
        clearRecentlyViewed,
        recordRecentlyViewed,
        isTelegramModalOpen,
        setIsTelegramModalOpen,
        selectedCategory,
        setSelectedCategory,
        isDarkMode,
        toggleDarkMode,
        toastMessage,
        showToast,
        notifyTelegramResult,
        currentView,
        selectedProductId,
        currentProduct,
        navigateToProduct,
        navigateTo,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
