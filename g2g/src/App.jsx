import React, { useState, useEffect } from 'react';
import { getProductById, fetchAndMapProducts } from "./API/ProductApi";
import './App.css';
import {
  MOCK_GAMES,
  MOCK_SELLERS,
  MOCK_REVIEWS,
  GAMEPAL_PARTNERS,
  COACHING_PARTNERS,
  GAMEPAL_AVATARS,
  TRENDING_BLOCKS,
  FLASH_SALE_ITEMS
} from './MockData';

import Header from './components/Header';
import Footer from './components/Footer';
import Promobanners from './components/Promobanners';
import HomeViews from './components/HomeViews';
import ProductCatalog from './components/ProductCatalog';
import Checkout from './components/Checkout';
import Orders from './components/Orders';
import ChatDrawer from './components/ChatDrawer';
import Modals from './components/Modals';
import SellerLanding from './components/SellerLanding';

function App() {
  const [forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    async function loadApiProducts() {
      const apiGames = await fetchAndMapProducts();
      if (apiGames && apiGames.length > 0) {
        // Clear static list and replace with dynamic API data
        MOCK_GAMES.length = 0;
        apiGames.forEach(game => MOCK_GAMES.push(game));
        
        // Reset category filter selections
        setFilterSelectedGames(MOCK_GAMES.map(g => g.id));
        
        // Trigger UI re-render
        setForceUpdate(prev => prev + 1);
      }
    }
    loadApiProducts();
  }, []);
  const [theme, setTheme] = useState('dark');
  const [currentView, setCurrentView] = useState('home'); // 'home', 'catalog', 'category-catalog', 'product-detail', 'checkout', 'orders'
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Navigation Selection States
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(MOCK_SELLERS[0]);
  const [detailQuantity, setDetailQuantity] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all'); // 'all', 'coins', 'accounts', 'cards', 'boosting'
  const [activeDetailTab, setActiveDetailTab] = useState('description'); // 'description', 'reviews'

  // Sidebar Filtering States (Category Catalog View)
  const [filterMinPrice, setFilterMinPrice] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState('');
  const [filterSelectedGames, setFilterSelectedGames] = useState(MOCK_GAMES.map(g => g.id));
  const [sortOrder, setSortOrder] = useState('cheapest'); // 'cheapest', 'expensive', 'orders'

  // Filtering & Search
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [brandSearchQuery, setBrandSearchQuery] = useState('');
  const [activeBrandTab, setActiveBrandTab] = useState('all'); // 'all', 'recharge', 'activation' link
  const [catalogSearchQuery, setCatalogSearchQuery] = useState('');
  const [catalogRegionFilter, setCatalogRegionFilter] = useState('all'); // 'all', 'Vietnam', 'Global', 'Asia'
  const [catalogSortOption, setCatalogSortOption] = useState('recommended'); // 'recommended', 'cheapest'

  // Shopping Cart State
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Checkouts & Order Tracking
  const [activePaymentTab, setActivePaymentTab] = useState('momo');
  const [checkoutProcessing, setCheckoutProcessing] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [orders, setOrders] = useState([

    {
      id: 'G2G-583019',
      date: '01/07/2026',
      gameName: 'Roblox Robux (Global)',
      itemName: 'Roblox Robux 800 Robux',
      price: 190000,
      qty: 1,
      sellerName: 'GameKongs',
      status: 'completed',
      paymentMethod: 'Ví MoMo'
    },
    {
      id: 'G2G-194058',
      date: '28/06/2026',
      gameName: 'Liên Quân Mobile - Tài Khoản VIP',
      itemName: 'Tài Khoản Cao Thủ 50 Skin',
      price: 150000,
      qty: 1,
      sellerName: 'FastDeliver_Store',
      status: 'completed',
      paymentMethod: 'Chuyển khoản NH'
    }
  ]);
  const handleSelectProduct = async (productId) => {
    setIsTransitioning(true);

    try {
      // 1. Gọi API lấy dữ liệu thật (đã được map định dạng chuẩn game)
      const formattedItem = await getProductById(productId);

      // 2. Thiết lập selectedItem và selectedGame tương ứng
      setSelectedItem(formattedItem);
      
      const gameObj = MOCK_GAMES.find(g => g.id === formattedItem.gameId) || MOCK_GAMES[0];
      setSelectedGame(gameObj);

      setCurrentView('product-detail');
    } catch (error) {
      console.error("Lỗi:", error);
      triggerToast("Không thể tải thông tin sản phẩm");
    } finally {
      setIsTransitioning(false);
    }
  };

  // Product Reviews State & Submission Handler
  const [productReviews, setProductReviews] = useState(() => {
    const saved = localStorage.getItem('g2g_product_reviews');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      'roblox-1': [
        { id: 1, user: 'HoangVu', rating: 5, comment: 'Giao hàng siêu nhanh, chỉ mất 1 phút là có Robux rồi!', date: '05/07/2026' },
        { id: 2, user: 'AnhGamer', rating: 5, comment: 'Sản phẩm uy tín, shop hỗ trợ nhiệt tình lắm.', date: '04/07/2026' }
      ],
      'roblox-2': [
        { id: 3, user: 'GamerVip', rating: 4, comment: 'Hàng chất lượng, giá rẻ hơn các chỗ khác.', date: '03/07/2026' }
      ]
    };
  });

  const handleAddReview = (productId, rating, comment) => {
    if (!currentUser) {
      triggerToast('Vui lòng đăng nhập để viết đánh giá!');
      return;
    }
    const newReview = {
      id: Date.now(),
      user: currentUser.name,
      rating: Number(rating),
      comment: comment.trim(),
      date: new Date().toLocaleDateString('vi-VN')
    };

    setProductReviews(prev => {
      const currentList = prev[productId] || [];
      const updated = {
        ...prev,
        [productId]: [newReview, ...currentList]
      };
      localStorage.setItem('g2g_product_reviews', JSON.stringify(updated));
      return updated;
    });

    triggerToast('Cảm ơn bạn đã gửi đánh giá sản phẩm!');
  };
  // Card inputs
  const [cardNo, setCardNo] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Mobile Top-up & Directory Filtering States
  const [topupPhone, setTopupPhone] = useState('');
  const [topupOperator, setTopupOperator] = useState('viettel');
  const [topupAmount, setTopupAmount] = useState(100000);
  const [coachingSearchQuery, setCoachingSearchQuery] = useState('');
  const [coachingGameFilter, setCoachingGameFilter] = useState('all');
  const [gamepalSearchQuery, setGamepalSearchQuery] = useState('');
  const [gamepalGameFilter, setGamepalGameFilter] = useState('all');

  // Modals & General UX
  const [activeModal, setActiveModal] = useState(null);
  const [showInsufficientFundsModal, setShowInsufficientFundsModal] = useState(false);
  const [insufficientFundsData, setInsufficientFundsData] = useState({ required: 0, current: 0 });
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('currentUser');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Buyer wallet balance state (initialized from localStorage, defaults to 0₫)
  const [userWalletBalance, setUserWalletBalance] = useState(() => {
    const saved = localStorage.getItem('g2g_user_wallet_balance');
    return saved ? Number(saved) : 0;
  });

  const handleDepositToWallet = (amount) => {
    if (!currentUser) {
      triggerToast('Vui lòng đăng nhập để nạp tiền vào ví tài khoản!');
      setActiveModal('login');
      return;
    }
    setUserWalletBalance(prev => {
      const updated = prev + amount;
      localStorage.setItem('g2g_user_wallet_balance', String(updated));
      return updated;
    });
    triggerToast(`Nạp tiền thành công! Đã cộng ${amount.toLocaleString('vi-VN')}₫ vào tài khoản.`);
  };

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [sellerGame, setSellerGame] = useState('Valorant');
  const [sellerExperience, setSellerExperience] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Seller States & Data (Starts empty for a newly registered seller)
  const [sellerWalletBalance, setSellerWalletBalance] = useState(() => {
    const saved = localStorage.getItem('g2g_seller_wallet_balance');
    return saved ? Number(saved) : 0;
  });
  const [sellerWalletTransactions, setSellerWalletTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('g2g_seller_wallet_transactions');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [sellerListings, setSellerListings] = useState(() => {
    try {
      const saved = localStorage.getItem('g2g_seller_listings');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  }); // Persisted seller listings
  const [sellerOrders, setSellerOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('g2g_seller_orders');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [sellerTab, setSellerTab] = useState('overview'); // 'overview', 'add-listing', 'listings', 'orders', 'wallet'

  useEffect(() => {
    localStorage.setItem('g2g_seller_wallet_balance', String(sellerWalletBalance));
  }, [sellerWalletBalance]);

  useEffect(() => {
    localStorage.setItem('g2g_seller_wallet_transactions', JSON.stringify(sellerWalletTransactions));
  }, [sellerWalletTransactions]);

  useEffect(() => {
    localStorage.setItem('g2g_seller_orders', JSON.stringify(sellerOrders));
  }, [sellerOrders]);

  // Chat System State
  const [showChatDrawer, setShowChatDrawer] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);
  const [chatInputText, setChatInputText] = useState('');
  const [chats, setChats] = useState([
    {
      id: 1,
      partnerName: 'SkyBlade_Radiant',
      avatarText: 'SB',
      game: 'Valorant',
      online: true,
      messages: [
        { sender: 'partner', text: 'Xin chào! Mình có sẵn acc Valorant VIP. Bạn cần rank gì ạ?' },
      ]
    },
    {
      id: 2,
      partnerName: 'GenshinProHelper',
      avatarText: 'GP',
      game: 'Genshin Impact',
      online: true,
      messages: [
        { sender: 'partner', text: 'Chào bạn! Mình có thể cày thuê up rank và làm nhiệm vụ Genshin nhé.' }
      ]
    },
    {
      id: 3,
      partnerName: 'Chăm Sóc Khách Hàng G2G',
      avatarText: 'G2',
      game: 'Hỗ trợ kỹ thuật',
      online: true,
      messages: [
        { sender: 'partner', text: 'Chào bạn, cám ơn đã liên hệ! Tất cả code Robux và Sò Garena bên mình đều là tự động gửi, nhận ngay trong 3 phút.' }
      ]
    }
  ]);

  // Flash Sale Timer ticking down
  const [timeLeft, setTimeLeft] = useState(10740); // 2 hours, 59 mins, 00 secs by default
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 10800));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return {
      hours: hrs.toString().padStart(2, '0'),
      minutes: mins.toString().padStart(2, '0'),
      seconds: secs.toString().padStart(2, '0')
    };
  };

  const formattedClock = formatTime(timeLeft);

  // Sync theme changes with body element
  useEffect(() => {
    const body = document.body;
    if (theme === 'light') {
      body.classList.add('light-theme');
    } else {
      body.classList.remove('light-theme');
    }
  }, [theme]);

  // Order Delivery Status transitioning animations
  useEffect(() => {
    const pendingOrders = orders.filter(o => o.status === 'pending');
    if (pendingOrders.length > 0) {
      const timer1 = setTimeout(() => {
        setOrders(prev => prev.map(o => {
          if (o.status === 'pending') {
            triggerToast(`Đơn hàng ${o.id} đang được người bán chuẩn bị bàn giao!`);
            return { ...o, status: 'delivering' };
          }
          return o;
        }));
      }, 6000);
      return () => clearTimeout(timer1);
    }
  }, [orders]);

  useEffect(() => {
    const deliveringOrders = orders.filter(o => o.status === 'delivering');
    if (deliveringOrders.length > 0) {
      const timer2 = setTimeout(() => {
        setOrders(prev => prev.map(o => {
          if (o.status === 'delivering') {
            triggerToast(`Đơn hàng ${o.id} đã hoàn tất và bàn giao tự động thành công!`);
            return { ...o, status: 'completed' };
          }
          return o;
        }));
      }, 10000);
      return () => clearTimeout(timer2);
    }
  }, [orders]);

  // Toast Alerts
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Navigations routing functions
  const pushRoute = (view, params = {}, replace = false) => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    setTimeout(() => {
      let path = '/';
      if (view === 'category-catalog') {
        const cat = params.category || 'all';
        path = `/trending/${cat}`;
      } else if (view === 'catalog') {
        const gameId = params.gameId || (params.game && params.game.id);
        path = `/catalog/${gameId}`;
      } else if (view === 'product-detail') {
        const gameId = params.gameId || (params.game && params.game.id);
        const itemId = params.itemId || (params.item && params.item.id);
        path = `/product/${gameId}/${itemId}`;
      } else if (view === 'checkout') {
        path = '/checkout';
      } else if (view === 'orders') {
        path = '/orders';
      } else if (view === 'seller-landing') {
        path = '/seller';
      }

      if (replace) {
        window.history.replaceState(null, '', path);
      } else {
        window.history.pushState(null, '', path);
      }

      setCurrentView(view);

      if (view === 'category-catalog') {
        const cat = params.category || 'all';
        setSelectedCategory(cat);
        setFilterMinPrice('');
        setFilterMaxPrice('');
        setFilterSelectedGames(MOCK_GAMES.map(g => g.id));
        setSortOrder('cheapest');
        setBrandSearchQuery('');
        setActiveBrandTab('all');
      } else if (view === 'catalog') {
        const game = params.game || MOCK_GAMES.find(g => g.id === params.gameId);
        if (game) {
          setSelectedGame(game);
          if (game.items && game.items.length > 0) {
            setSelectedItem(game.items[0]);
          }
          setDetailQuantity(1);
        }
        setSearchQuery('');
        setSearchFocused(false);
        setCatalogSearchQuery('');
        setCatalogRegionFilter('all');
        setCatalogSortOption('recommended');
      } else if (view === 'product-detail') {
        const game = params.game || MOCK_GAMES.find(g => g.id === params.gameId);
        // Use params.item directly (works for both MOCK items and sellerListings items)
        const item = params.item || (game && game.items.find(i => i.id === params.itemId));
        const seller = params.seller || MOCK_SELLERS[0];
        if (game) setSelectedGame(game);
        if (item) setSelectedItem(item);
        setSelectedSeller(seller);
        setDetailQuantity(1);
        setActiveDetailTab('description');
        setSearchQuery('');
        setSearchFocused(false);
      }
      window.scrollTo({ top: 0 });
      setIsTransitioning(false);
    }, 300);
  };

  const parseLocationAndRoute = (replace = false) => {
    const path = window.location.pathname;
    if (path.startsWith('/trending/')) {
      const cat = path.replace('/trending/', '');
      pushRoute('category-catalog', { category: cat }, replace);
      return;
    }
    if (path.startsWith('/catalog/')) {
      const gameId = path.replace('/catalog/', '');
      const game = MOCK_GAMES.find(g => g.id === gameId);
      if (game) {
        pushRoute('catalog', { game }, replace);
      } else {
        pushRoute('home', {}, true);
      }
      return;
    }
    if (path.startsWith('/product/')) {
      const parts = path.split('/');
      if (parts.length >= 4) {
        const gameId = parts[2];
        const itemId = parts[3];
        const game = MOCK_GAMES.find(g => g.id === gameId);

        // First look in MOCK_GAMES items
        let item = game ? game.items.find(i => i.id === itemId) : null;

        // Fallback: look in persisted sellerListings
        if (!item) {
          try {
            const savedListings = JSON.parse(localStorage.getItem('g2g_seller_listings') || '[]');
            const sl = savedListings.find(l => l.id === itemId);
            if (sl) {
              item = {
                id: sl.id,
                name: sl.name,
                price: sl.price,
                badge: sl.badge || 'Người Bán Mới',
                region: sl.region || 'Global',
                offers: 1,
                category: sl.category,
                stock: sl.stock,
                sellerName: sl.sellerName || 'Người Bán',
                isSellerListing: true,
              };
            }
          } catch (e) { /* ignore */ }
        }

        if (game && item) {
          pushRoute('product-detail', { game, item }, replace);
        } else {
          pushRoute('home', {}, true);
        }
      } else {
        pushRoute('home', {}, true);
      }
      return;
    }
    if (path === '/checkout') {
      pushRoute('checkout', {}, replace);
      return;
    }
    if (path === '/orders') {
      pushRoute('orders', {}, replace);
      return;
    }
    if (path === '/seller') {
      pushRoute('seller-landing', {}, replace);
      return;
    }
    pushRoute('home', {}, true);
  };

  // Route parser & popstate listener on mount
  useEffect(() => {
    parseLocationAndRoute(true);

    const handlePopState = () => {
      const path = window.location.pathname;
      setIsTransitioning(true);
      setTimeout(() => {
        if (path.startsWith('/trending/')) {
          const cat = path.replace('/trending/', '');
          setCurrentView('category-catalog');
          setSelectedCategory(cat);
        } else if (path.startsWith('/catalog/')) {
          const gameId = path.replace('/catalog/', '');
          const game = MOCK_GAMES.find(g => g.id === gameId);
          if (game) {
            setCurrentView('catalog');
            setSelectedGame(game);
            if (game.items && game.items.length > 0) setSelectedItem(game.items[0]);
          }
        } else if (path.startsWith('/product/')) {
          const parts = path.split('/');
          if (parts.length >= 4) {
            const gameId = parts[2];
            const itemId = parts[3];
            const game = MOCK_GAMES.find(g => g.id === gameId);
            let item = game ? game.items.find(i => i.id === itemId) : null;
            if (!item) {
              try {
                const savedListings = JSON.parse(localStorage.getItem('g2g_seller_listings') || '[]');
                const sl = savedListings.find(l => l.id === itemId);
                if (sl) item = { id: sl.id, name: sl.name, price: sl.price, badge: sl.badge || 'Người Bán Mới', region: sl.region || 'Global', offers: 1, category: sl.category, stock: sl.stock, sellerName: sl.sellerName, isSellerListing: true };
              } catch (e) { /* ignore */ }
            }
            if (game && item) {
              setCurrentView('product-detail');
              setSelectedGame(game);
              setSelectedItem(item);
            }
          }
        } else if (path === '/checkout') {
          setCurrentView('checkout');
        } else if (path === '/orders') {
          setCurrentView('orders');
        } else if (path === '/seller') {
          setCurrentView('seller-landing');
        } else {
          setCurrentView('home');
        }
        setIsTransitioning(false);
      }, 300);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToCatalog = (game) => {
    pushRoute('catalog', { game });
  };

  const handleTrendingCardClick = (card) => {
    let foundGame = MOCK_GAMES.find(g => g.id === card.gameId);
    if (!foundGame) {
      foundGame = {
        id: card.gameId,
        name: card.name,
        category: activeCategory === 'all' ? 'coins' : activeCategory,
        color: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
        textIcon: card.name.substring(0, 3).toUpperCase(),
        description: `Thị trường giao dịch ${card.name} an toàn, giao dịch nhanh chóng với nhiều ưu đãi hấp dẫn.`,
        items: [
          { id: `${card.gameId}-item-1`, name: `Gói nạp Gold ${card.name} 10M`, price: 150000, badge: 'Giao hàng nhanh', region: 'Global', offers: 15, category: 'coins' },
          { id: `${card.gameId}-item-2`, name: `Gói nạp Gold ${card.name} 50M`, price: 680000, badge: 'Được bảo hiểm', region: 'Global', offers: 28, category: 'coins' },
          { id: `${card.gameId}-item-3`, name: `Acc ${card.name} Cấp Cao VIP`, price: 1200000, badge: 'Hot Deal', region: 'Global', offers: 8, category: 'accounts' },
          { id: `${card.gameId}-item-4`, name: `Dịch vụ Coaching Hướng dẫn Build đồ ${card.name}`, price: 120000, badge: 'HLV Pro', region: 'Global', offers: 6, category: 'coaching' },
          { id: `${card.gameId}-item-5`, name: `Cày thuê cấp tốc Lv.1 - Lv.100 ${card.name}`, price: 450000, badge: 'Giao nhanh', region: 'Global', offers: 11, category: 'boosting' },
          { id: `${card.gameId}-item-6`, name: `Mã kích hoạt Key Giftcard ${card.name}`, price: 95000, badge: 'Auto Send', region: 'Global', offers: 4, category: 'cards' },
          { id: `${card.gameId}-item-7`, name: `Bạn chơi cùng (GamePal) kéo ải ${card.name}`, price: 80000, badge: 'Online 24/7', region: 'Global', offers: 7, category: 'gamepal' },
          { id: `${card.gameId}-item-8`, name: `Vật phẩm quý hiếm - Divine Orb ${card.name}`, price: 250000, badge: 'Giá rẻ nhất', region: 'Global', offers: 9, category: 'items' },
        ]
      };
      MOCK_GAMES.push(foundGame);
    }
    navigateToCatalog(foundGame);
  };

  const navigateToCategory = (cat) => {
    pushRoute('category-catalog', { category: cat });
  };

  const navigateToDetail = (game, item, seller = MOCK_SELLERS[0]) => {
    pushRoute('product-detail', { game, item, seller });
  };

  // Add Item to Shopping Cart
  const handleAddToCart = (item, game = {}, seller = {}, quantity = 1) => {
    // 1. Force Login Check
    if (!currentUser) {
      triggerToast('Vui lòng đăng nhập để tiếp tục mua sắm!');
      setActiveModal('login');
      return;
    }

    const sellerName = seller.name || item.sellerName || 'Hệ thống';
    const isSelfPurchase = currentUser && item.sellerName && item.sellerName === currentUser.name;
    // 2. Prevent buying own items
    if (isSelfPurchase) {
      triggerToast('Bạn không thể mua sản phẩm của chính mình đăng bán!');
      return;
    }

    // 3. Stock Check
    if (item.stock !== undefined && quantity > item.stock) {
      triggerToast(`Không đủ số lượng sản phẩm trong kho! Chỉ còn ${item.stock} sản phẩm.`);
      return;
    }

    const multiplier = seller.multiplier !== undefined ? seller.multiplier : 1;
    const unitPrice = Math.floor((item.price || item.unitPrice || 0) * multiplier);
    
    const existingIndex = cart.findIndex(c => c.itemId === item.id && c.sellerName === sellerName);

    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].qty += quantity;
      setCart(updatedCart);
    } else {
      const newCartItem = {
        cartId: item.cartId || (Date.now() + Math.random().toString(36).substr(2, 5)),
        itemId: item.id,
        itemName: item.name || item.itemName,
        gameId: game.id || item.id,
        gameName: game.name || 'Dịch vụ trực tuyến',
        price: unitPrice,
        qty: quantity,
        sellerName: sellerName,
        textIcon: game.textIcon || item.textIcon || '⚙️',
        color: game.color || item.color || 'var(--dark-box)',
        badge: item.badge || 'Official'
      };
      setCart(prev => [...prev, newCartItem]);
    }
    triggerToast(`Đã thêm ${quantity} x "${item.name || item.itemName}" vào giỏ hàng!`);
    setIsCartOpen(true);
  };

  // Cart Management
  const updateCartQty = (cartId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQty = item.qty + delta;
        return { ...item, qty: newQty > 0 ? newQty : 1 };
      }
      return item;
    }));
  };

  const removeCartItem = (cartId) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
    triggerToast('Đã xóa sản phẩm khỏi giỏ hàng.');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.qty), 0);
  };

  // Buy Now
  const handleBuyNow = (item, game = {}, seller = {}, quantity = 1) => {
    // 1. Force Login Check
    if (!currentUser) {
      triggerToast('Vui lòng đăng nhập để mua hàng!');
      setActiveModal('login');
      return;
    }

    const sellerName = seller.name || item.sellerName || 'Hệ thống';
    const isSelfPurchase = currentUser && item.sellerName && item.sellerName === currentUser.name;
    // 2. Prevent buying own items
    if (isSelfPurchase) {
      triggerToast('Bạn không thể mua sản phẩm của chính mình đăng bán!');
      return;
    }

    // 3. Stock Check
    if (item.stock !== undefined && quantity > item.stock) {
      triggerToast(`Không đủ số lượng sản phẩm trong kho! Chỉ còn ${item.stock} sản phẩm.`);
      return;
    }

    const multiplier = seller.multiplier !== undefined ? seller.multiplier : 1;
    const unitPrice = Math.floor((item.price || item.unitPrice || 0) * multiplier);
    
    const newCartItem = {
      cartId: item.cartId || (Date.now() + Math.random().toString(36).substr(2, 5)),
      itemId: item.id,
      itemName: item.name || item.itemName,
      gameId: game.id || item.id,
      gameName: game.name || 'Dịch vụ trực tuyến',
      price: unitPrice,
      qty: quantity,
      sellerName: sellerName,
      textIcon: game.textIcon || item.textIcon || '⚙️',
      color: game.color || item.color || 'var(--dark-box)',
      badge: item.badge || 'Official'
    };
    setCart([newCartItem]);
    pushRoute('checkout');
  };

  // Perform checkout action
  const handleConfirmPayment = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const gatewayFee = activePaymentTab === 'momo' ? 15000 :
                       activePaymentTab === 'zalopay' ? 12000 :
                       activePaymentTab === 'banking' ? 10000 : 25000;
    const totalCost = getCartTotal() + gatewayFee;
    if (userWalletBalance < totalCost) {
      setInsufficientFundsData({ required: totalCost, current: userWalletBalance });
      setShowInsufficientFundsModal(true);
      return;
    }

    setCheckoutProcessing(true);
    setTimeout(() => {
      setCheckoutProcessing(false);
      setCheckoutSuccess(true);

      setUserWalletBalance(prev => {
        const updated = prev - totalCost;
        localStorage.setItem('g2g_user_wallet_balance', String(updated));
        return updated;
      });

      // Deduct stock in MOCK_GAMES
      cart.forEach(cartItem => {
        const game = MOCK_GAMES.find(g => g.id === cartItem.gameId);
        if (game) {
          const product = game.items.find(i => i.id === cartItem.itemId);
          if (product) {
            product.stock = Math.max(0, (product.stock || 0) - cartItem.qty);
          }
        }
      });
      setForceUpdate(prev => prev + 1);

      const newOrders = cart.map(item => ({
        id: `G2G-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('vi-VN'),
        gameName: item.gameName,
        itemName: item.itemName,
        price: item.price,
        qty: item.qty,
        sellerName: item.sellerName,
        status: 'pending',
        paymentMethod: activePaymentTab === 'momo' ? 'Ví MoMo' :
          activePaymentTab === 'zalopay' ? 'Ví ZaloPay' :
            activePaymentTab === 'banking' ? 'Chuyển khoản NH' : 'Thẻ Quốc Thế'
      }));

      setOrders(prev => [...newOrders, ...prev]);

      setTimeout(() => {
        setCheckoutSuccess(false);
        setCart([]);
        pushRoute('orders');
        triggerToast('Giao dịch hoàn tất! Đơn hàng đang được chuẩn bị bàn giao.');
      }, 2000);

    }, 2000);
  };

  // Simulated live seller chat replies
  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInputText.trim() || activeChatId === null) return;

    const userMsg = { sender: 'user', text: chatInputText };
    const targetChat = chats.find(c => c.id === activeChatId);

    setChats(prev => prev.map(c => {
      if (c.id === activeChatId) {
        return { ...c, messages: [...c.messages, userMsg] };
      }
      return c;
    }));

    const userText = chatInputText.toLowerCase();
    setChatInputText('');

    setTimeout(() => {
      let replyText = `Chào bạn! Mình là hỗ trợ viên của ${targetChat.partnerName}. Có vấn đề gì về đơn hàng cần mình hỗ trợ không?`;
      if (userText.includes('đơn') || userText.includes('nạp') || userText.includes('mua') || userText.includes('giao')) {
        replyText = `Cảm ơn bạn! Hệ thống nạp tự động của ${targetChat.partnerName} đang xử lý đơn hàng ${targetChat.game}. Vui lòng kiểm tra mục Đơn hàng sau ít phút nhé!`;
      } else if (userText.includes('rẻ') || userText.includes('giá') || userText.includes('khấu') || userText.includes('sale')) {
        replyText = `Dạ hiện tại bên mình đang chiết khấu trực tiếp rẻ nhất sàn rồi đó ạ, ngoài ra bạn còn được hưởng bảo hiểm hoàn tiền GamerProtect nhé.`;
      } else if (userText.includes('alo') || userText.includes('hi') || userText.includes('shop')) {
        replyText = `Dạ chào bạn! Shop vẫn luôn có nhân viên online trực hỗ trợ 24/7. Bạn cần hỏi về dịch vụ nào cứ nhắn cho mình nhé.`;
      }

      const partnerMsg = { sender: 'partner', text: replyText };
      setChats(prev => prev.map(c => {
        if (c.id === activeChatId) {
          return { ...c, messages: [...c.messages, partnerMsg] };
        }
        return c;
      }));
    }, 1500);
  };

  // Open Chat directly with a specific partner
  const openChatWithPartner = (partnerName, game) => {
    let existingIndex = chats.findIndex(c => c.partnerName === partnerName);
    let chatId = 0;
    if (existingIndex > -1) {
      chatId = chats[existingIndex].id;
    } else {
      chatId = chats.length + 1;
      const newThread = {
        id: chatId,
        partnerName: partnerName,
        avatarText: partnerName.slice(0, 2).toUpperCase(),
        game: game,
        online: true,
        messages: [{ sender: 'partner', text: `Chào bạn! Mình hỗ trợ dịch vụ game ${game}. Bạn cần gì cứ nhắn nhé.` }]
      };
      setChats(prev => [...prev, newThread]);
    }
    setActiveChatId(chatId);
    setShowChatDrawer(true);
  };

  // Form Handlers (Integrated with Backend API)
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      triggerToast('Vui lòng nhập tài khoản và mật khẩu!');
      return;
    }

    const normalizedMail = loginEmail.replace(/[\s-]/g, "").trim();
    try {
      const res = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mail: normalizedMail, password: loginPassword }),
      });

      const data = await res.json().catch(() => ({ message: "Không thể phân tích phản hồi từ máy chủ." }));

      if (!res.ok) {
        triggerToast(data.message || 'Đăng nhập thất bại!');
        return;
      }

      triggerToast('Đăng nhập thành công!');
      const userObj = {
        token: data.access_token,
        id: data.user.id,
        mail: data.user.mail,
        name: data.user.name,
        role: data.user.role,
        isSeller: data.user.role === 'seller' || data.user.role === 'business'
      };

      setCurrentUser(userObj);
      localStorage.setItem('currentUser', JSON.stringify(userObj));
      setActiveModal(null);
      setLoginEmail('');
      setLoginPassword('');
    } catch (err) {
      console.error("Backend connection failed. Using offline fallback:", err);
      const isEmail = normalizedMail.includes('@');
      const isPhone = /^\+?\d{8,15}$/.test(normalizedMail);
      if ((isEmail || isPhone) && loginPassword.length >= 6) {
        const isSellerUser = normalizedMail === 'seller@gmail.com' || normalizedMail === 'admin@gmail.com';
        const userObj = {
          token: "mock-offline-token",
          id: "1004154462",
          mail: normalizedMail,
          name: normalizedMail.split('@')[0] || "User",
          role: isSellerUser ? 'seller' : 'regular',
          isSeller: isSellerUser
        };
        setCurrentUser(userObj);
        localStorage.setItem('currentUser', JSON.stringify(userObj));
        triggerToast('Đăng nhập thành công (Chế độ Ngoại tuyến)!');
        setActiveModal(null);
        setLoginEmail('');
        setLoginPassword('');
      } else {
        triggerToast('Không thể kết nối đến backend! (Định dạng offline cần mật khẩu từ 6 ký tự)');
      }
    }
  };

  const handleSignupSubmit = async (e, customData = null) => {
    if (e && e.preventDefault) e.preventDefault();

    const name = customData ? customData.name : signupUsername;
    const email = customData ? customData.mail : signupEmail;
    const password = customData ? customData.password : signupPassword;
    const role = customData?.role || 'regular';
    const company_name = customData?.company_name || null;
    const tax_id = customData?.tax_id || null;

    if (!name || !email || !password) {
      triggerToast('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const normalizedMail = email.replace(/[\s-]/g, "").trim();
    try {
      const res = await fetch("http://127.0.0.1:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          mail: normalizedMail,
          password,
          role,
          company_name,
          tax_id
        }),
      });

      const data = await res.json().catch(() => ({ message: "Không thể phân tích phản hồi từ máy chủ." }));

      if (!res.ok) {
        triggerToast(data.message || 'Đăng ký thất bại!');
        return;
      }

      triggerToast('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
      
      setSignupUsername('');
      setSignupEmail('');
      setSignupPassword('');
      setActiveModal(null);
    } catch (err) {
      console.error("Backend connection failed. Using offline signup fallback:", err);
      triggerToast('Đăng ký thành công (Chế độ Ngoại tuyến)! Vui lòng đăng nhập.');

      setSignupUsername('');
      setSignupEmail('');
      setSignupPassword('');
      setActiveModal(null);
    }
  };

  const handleSellerSubmit = async (e) => {
    e.preventDefault();
    if (!sellerExperience) {
      triggerToast('Vui lòng nhập mô tả kinh nghiệm bán hàng!');
      return;
    }

    if (currentUser) {
      try {
        const res = await fetch("http://127.0.0.1:5000/upgrade-seller", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mail: currentUser.mail }),
        });

        const data = await res.json().catch(() => ({ message: "Không thể phân tích phản hồi từ máy chủ." }));

        if (!res.ok) {
          triggerToast(data.message || 'Nâng cấp người bán thất bại!');
          return;
        }

        const updatedUser = { 
          ...currentUser, 
          isSeller: true, 
          role: 'seller' 
        };
        setCurrentUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        triggerToast(`Đăng ký bán game ${sellerGame} thành công! Tài khoản của bạn đã được nâng cấp lên Người Bán.`);
        setSellerTab('overview');
        pushRoute('seller-landing');
      } catch (err) {
         console.error("Backend connection failed. Upgrading locally:", err);
         const updatedUser = { 
           ...currentUser, 
           isSeller: true, 
           role: 'seller' 
         };
         setCurrentUser(updatedUser);
         localStorage.setItem('currentUser', JSON.stringify(updatedUser));
         triggerToast(`Đăng ký bán game ${sellerGame} thành công (Chế độ Ngoại tuyến)!`);
         setSellerTab('overview');
         pushRoute('seller-landing');
      }
    } else {
      triggerToast(`Đăng ký bán game ${sellerGame} thành công! Vui lòng đăng nhập để bắt đầu bán.`);
    }

    setActiveModal(null);
    setSellerExperience('');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    triggerToast('Đăng xuất thành công!');
  };

  return (
    <div className="g2g-clone-app">
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="toast-alert">
          <div className="toast-indicator"></div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Navbar Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchFocused={searchFocused}
        setSearchFocused={setSearchFocused}
        navigateToCatalog={navigateToCatalog}
        pushRoute={pushRoute}
        setActiveModal={setActiveModal}
        setIsCartOpen={setIsCartOpen}
        setShowChatDrawer={setShowChatDrawer}
        chats={chats}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
        theme={theme}
        toggleTheme={toggleTheme}
        cart={cart}
        currentUser={currentUser}
        handleLogout={handleLogout}
        selectedCategory={selectedCategory}
        currentView={currentView}
        navigateToCategory={navigateToCategory}
        sellerTab={sellerTab}
        setSellerTab={setSellerTab}
        triggerToast={triggerToast}
        userWalletBalance={userWalletBalance}
      />

      {/* Main Content Router */}
      <main className={`main-content ${isTransitioning ? 'view-leaving' : ''}`}>
        {currentView === 'seller-landing' && (
          <SellerLanding
            currentUser={currentUser}
            setActiveModal={setActiveModal}
            pushRoute={pushRoute}
            triggerToast={triggerToast}
            sellerWalletBalance={sellerWalletBalance}
            setSellerWalletBalance={setSellerWalletBalance}
            sellerWalletTransactions={sellerWalletTransactions}
            setSellerWalletTransactions={setSellerWalletTransactions}
            sellerListings={sellerListings}
            setSellerListings={setSellerListings}
            sellerOrders={sellerOrders}
            setSellerOrders={setSellerOrders}
            sellerTab={sellerTab}
            setSellerTab={setSellerTab}
          />
        )}

        {currentView === 'home' && (
          <>
            <HomeViews
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setSearchFocused={setSearchFocused}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              navigateToCategory={navigateToCategory}
              navigateToCatalog={navigateToCatalog}
              navigateToDetail={navigateToDetail}
              triggerToast={triggerToast}
              formattedClock={formattedClock}
              openChatWithPartner={openChatWithPartner}
              handleTrendingCardClick={handleTrendingCardClick}
            />
            <Promobanners triggerToast={triggerToast} pushRoute={pushRoute} setActiveModal={setActiveModal} />
          </>
        )}

        <ProductCatalog
          currentView={currentView}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedGame={selectedGame}
          setSelectedGame={setSelectedGame}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          selectedSeller={selectedSeller}
          setSelectedSeller={setSelectedSeller}
          detailQuantity={detailQuantity}
          setDetailQuantity={setDetailQuantity}
          activeDetailTab={activeDetailTab}
          setActiveDetailTab={setActiveDetailTab}
          brandSearchQuery={brandSearchQuery}
          setBrandSearchQuery={setBrandSearchQuery}
          activeBrandTab={activeBrandTab}
          setActiveBrandTab={setActiveBrandTab}
          catalogSearchQuery={catalogSearchQuery}
          setCatalogSearchQuery={setCatalogSearchQuery}
          catalogRegionFilter={catalogRegionFilter}
          setCatalogRegionFilter={setCatalogRegionFilter}
          catalogSortOption={catalogSortOption}
          setCatalogSortOption={setCatalogSortOption}
          pushRoute={pushRoute}
          navigateToCatalog={navigateToCatalog}
          navigateToDetail={navigateToDetail}
          triggerToast={triggerToast}
          handleBuyNow={handleBuyNow}
          handleAddToCart={handleAddToCart}
          openChatWithPartner={openChatWithPartner}
          handleSelectProduct={handleSelectProduct}
          productReviews={productReviews}
          handleAddReview={handleAddReview}
          currentUser={currentUser}
          setActiveModal={setActiveModal}
          topupPhone={topupPhone}
          setTopupPhone={setTopupPhone}
          topupOperator={topupOperator}
          setTopupOperator={setTopupOperator}
          topupAmount={topupAmount}
          setTopupAmount={setTopupAmount}
          handleDepositToWallet={handleDepositToWallet}
          userWalletBalance={userWalletBalance}
          sellerListings={sellerListings}
        />

        <Checkout
          currentView={currentView}
          cart={cart}
          getCartTotal={getCartTotal}
          activePaymentTab={activePaymentTab}
          setActivePaymentTab={setActivePaymentTab}
          cardNo={cardNo}
          setCardNo={setCardNo}
          cardExp={cardExp}
          setCardExp={setCardExp}
          cardCvv={cardCvv}
          setCardCvv={setCardCvv}
          checkoutProcessing={checkoutProcessing}
          handleConfirmPayment={handleConfirmPayment}
          triggerToast={triggerToast}
          userWalletBalance={userWalletBalance}
        />

        <Orders
          currentView={currentView}
          orders={orders}
          triggerToast={triggerToast}
          openChatWithPartner={openChatWithPartner}
          pushRoute={pushRoute}
          currentUser={currentUser}
          setActiveModal={setActiveModal}
          userWalletBalance={userWalletBalance}
          handleDepositToWallet={handleDepositToWallet}
          sellerOrders={sellerOrders}
          setSellerOrders={setSellerOrders}
          sellerWalletBalance={sellerWalletBalance}
          setSellerWalletBalance={setSellerWalletBalance}
          sellerWalletTransactions={sellerWalletTransactions}
          setSellerWalletTransactions={setSellerWalletTransactions}
        />
      </main>

      {/* Global Footer Section */}
      <Footer
        theme={theme}
        toggleTheme={toggleTheme}
        triggerToast={triggerToast}
      />

      {/* Shopping Cart Sliding Drawer */}
      <div className={`cart-drawer-overlay ${isCartOpen ? 'open' : ''}`} onClick={() => setIsCartOpen(false)}>
        <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
          <div className="cart-drawer-header">
            <h4>Giỏ hàng của bạn ({cart.reduce((sum, i) => sum + i.qty, 0)})</h4>
            <span className="close-cart-btn" onClick={() => setIsCartOpen(false)}>×</span>
          </div>

          <div className="cart-drawer-body">
            {cart.length > 0 ? (
              <div className="cart-items-list-vertical">
                {cart.map(item => (
                  <div key={item.cartId} className="cart-item-card-vertical">
                    <span className="item-icon-mini" style={{ background: item.color }}>{item.textIcon}</span>
                    <div className="item-details-mini">
                      <div className="item-title-mini">{item.itemName}</div>
                      <div className="item-seller-mini">Shop: {item.sellerName}</div>
                      <div className="item-price-mini">Đơn giá: {item.price.toLocaleString('vi-VN')}₫</div>
                      <div className="item-qty-row-mini">
                        <div className="mini-qty-picker">
                          <button className="mini-qty-btn" onClick={() => updateCartQty(item.cartId, -1)}>-</button>
                          <span className="mini-qty-val">{item.qty}</span>
                          <button className="mini-qty-btn" onClick={() => updateCartQty(item.cartId, 1)}>+</button>
                        </div>
                        <span className="remove-item-link" onClick={() => removeCartItem(item.cartId)}>Xóa</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-cart-drawer">
                <span className="cart-empty-icon">🛒</span>
                <p>Giỏ hàng đang trống.</p>
                <button className="btn btn-primary btn-sm" onClick={() => setIsCartOpen(false)}>Tiếp tục mua sắm</button>
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="cart-drawer-footer">
              <div className="cart-subtotal-row justify-between">
                <span>Tổng tiền hàng:</span>
                <strong className="subtotal-val">{getCartTotal().toLocaleString('vi-VN')}₫</strong>
              </div>
              <button
                className="btn btn-primary checkout-btn"
                onClick={() => {
                  if (!currentUser) {
                    triggerToast('Vui lòng đăng nhập để thanh toán!');
                    setActiveModal('login');
                  } else {
                    setIsCartOpen(false);
                    pushRoute('checkout');
                  }
                }}
              >
                Tiến hành thanh toán
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Transition Verification Screens */}
      {checkoutProcessing && (
        <div className="transaction-verification-overlay">
          <div className="verification-box">
            <div className="g2g-spinner"></div>
            <h3>GamerProtect đang xử lý...</h3>
            <p>Vui lòng không tắt trình duyệt hoặc tải lại trang trong khi hệ thống xác thực dòng tiền thanh toán an toàn.</p>
          </div>
        </div>
      )}

      {checkoutSuccess && (
        <div className="transaction-verification-overlay success">
          <div className="verification-box bounceIn">
            <div className="success-checkmark">
              <div className="check-icon">
                <span className="icon-line line-tip"></span>
                <span className="icon-line line-long"></span>
                <div className="icon-circle"></div>
                <div className="icon-fix"></div>
              </div>
            </div>
            <h3>Thanh toán giao dịch thành công!</h3>
            <p>Mã hóa SSL 256-bit bảo mật. Đơn hàng của bạn đã được gửi cho người bán tiến hành giao hàng ngay.</p>
          </div>
        </div>
      )}

      <ChatDrawer
        showChatDrawer={showChatDrawer}
        setShowChatDrawer={setShowChatDrawer}
        chats={chats}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
        chatInputText={chatInputText}
        setChatInputText={setChatInputText}
        handleSendChatMessage={handleSendChatMessage}
      />

      {/* Insufficient Funds Modal */}
      {showInsufficientFundsModal && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
            zIndex: 999999, display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'g2gFadeIn 0.2s ease-out', fontFamily: "'Outfit','Inter',sans-serif"
          }}
          onClick={() => setShowInsufficientFundsModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(145deg, #1f2125 0%, #17181c 100%)',
              border: '1px solid #2d2f34', borderRadius: '20px',
              padding: '40px 36px', maxWidth: '420px', width: '90%',
              boxShadow: '0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,51,51,0.15)',
              animation: 'g2gSlideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)', textAlign: 'center'
            }}
          >
            {/* Icon */}
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff3333 0%, #cc0000 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(255,51,51,0.4)'
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>

            <h3 style={{ color: '#fff', fontSize: '22px', fontWeight: 700, margin: '0 0 8px' }}>
              Số Dư Không Đủ
            </h3>
            <p style={{ color: '#9ea2a9', fontSize: '14px', lineHeight: 1.6, margin: '0 0 28px' }}>
              Số dư trong ví tài khoản của bạn chưa đủ để hoàn tất đơn hàng này.
            </p>

            {/* Balance info */}
            <div style={{
              background: '#131416', border: '1px solid #2d2f34', borderRadius: '12px',
              padding: '20px', marginBottom: '24px', textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#9ea2a9', fontSize: '13px' }}>💰 Số dư hiện tại:</span>
                <span style={{ color: insufficientFundsData.current > 0 ? '#fbbf24' : '#9ea2a9', fontWeight: 700, fontSize: '15px' }}>
                  {insufficientFundsData.current.toLocaleString('vi-VN')}₫
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: '#9ea2a9', fontSize: '13px' }}>🛒 Tổng đơn hàng:</span>
                <span style={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>
                  {insufficientFundsData.required.toLocaleString('vi-VN')}₫
                </span>
              </div>
              <div style={{ borderTop: '1px solid #2d2f34', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#9ea2a9', fontSize: '13px' }}>⚠️ Cần nạp thêm:</span>
                <span style={{ color: '#ff3333', fontWeight: 800, fontSize: '16px' }}>
                  {(insufficientFundsData.required - insufficientFundsData.current).toLocaleString('vi-VN')}₫
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowInsufficientFundsModal(false)}
                style={{
                  flex: 1, padding: '13px', background: 'transparent',
                  border: '1px solid #2d2f34', borderRadius: '10px',
                  color: '#fff', fontSize: '14px', fontWeight: 600,
                  cursor: 'pointer', transition: 'background 0.2s'
                }}
                onMouseEnter={e => e.target.style.background = '#2b2d31'}
                onMouseLeave={e => e.target.style.background = 'transparent'}
              >
                Để sau
              </button>
              <button
                onClick={() => {
                  setShowInsufficientFundsModal(false);
                  pushRoute('category-catalog', { category: 'topup' });
                }}
                style={{
                  flex: 1, padding: '13px',
                  background: 'linear-gradient(135deg, #ff3333 0%, #cc0000 100%)',
                  border: 'none', borderRadius: '10px',
                  color: '#fff', fontSize: '14px', fontWeight: 700,
                  cursor: 'pointer', boxShadow: '0 4px 16px rgba(255,51,51,0.4)',
                  transition: 'transform 0.1s, box-shadow 0.2s'
                }}
                onMouseEnter={e => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 6px 20px rgba(255,51,51,0.5)'; }}
                onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 16px rgba(255,51,51,0.4)'; }}
              >
                💳 Nạp Tiền Ngay
              </button>
            </div>
          </div>
        </div>
      )}

      <Modals
        activeModal={activeModal}
        setActiveModal={setActiveModal}
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        signupUsername={signupUsername}
        setSignupUsername={setSignupUsername}
        signupEmail={signupEmail}
        setSignupEmail={setSignupEmail}
        signupPassword={signupPassword}
        setSignupPassword={setSignupPassword}
        sellerGame={sellerGame}
        setSellerGame={setSellerGame}
        sellerExperience={sellerExperience}
        setSellerExperience={setSellerExperience}
        handleLoginSubmit={handleLoginSubmit}
        handleSignupSubmit={handleSignupSubmit}
        handleSellerSubmit={handleSellerSubmit}
        triggerToast={triggerToast}
      />
    </div>
  );
}

export default App;
