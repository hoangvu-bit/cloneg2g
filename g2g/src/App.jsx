import React, { useState, useEffect } from 'react';
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
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('currentUser');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [sellerGame, setSellerGame] = useState('Valorant');
  const [sellerExperience, setSellerExperience] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Seller States & Data (Starts empty for a newly registered seller)
  const [sellerWalletBalance, setSellerWalletBalance] = useState(0); // Starts at 0 ₫
  const [sellerWalletTransactions, setSellerWalletTransactions] = useState([]); // Empty transaction history
  const [sellerListings, setSellerListings] = useState([]); // No listings initially
  const [sellerOrders, setSellerOrders] = useState([]); // No orders initially
  const [sellerTab, setSellerTab] = useState('overview'); // 'overview', 'add-listing', 'listings', 'orders', 'wallet'

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
        const item = params.item || (game && game.items.find(i => i.id === params.itemId)) || (game && game.items[0]);
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
        const item = game ? game.items.find(i => i.id === itemId) : null;
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
            const item = game ? game.items.find(i => i.id === itemId) : null;
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
          { id: `${card.gameId}-item-1`, name: `Gói nạp Gold ${card.name} 10M`, price: 150000, badge: 'Giao hàng nhanh', region: 'Global', offers: 15 },
          { id: `${card.gameId}-item-2`, name: `Gói nạp Gold ${card.name} 50M`, price: 680000, badge: 'Được bảo hiểm', region: 'Global', offers: 28 },
          { id: `${card.gameId}-item-3`, name: `Acc ${card.name} Cấp Cao VIP`, price: 1200000, badge: 'Hot Deal', region: 'Global', offers: 8 }
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
  const handleAddToCart = (item, game, seller, quantity) => {
    const unitPrice = Math.floor(item.price * seller.multiplier);
    const existingIndex = cart.findIndex(c => c.itemId === item.id && c.sellerName === seller.name);

    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].qty += quantity;
      setCart(updatedCart);
    } else {
      const newCartItem = {
        cartId: Date.now() + Math.random().toString(36).substr(2, 5),
        itemId: item.id,
        itemName: item.name,
        gameId: game.id,
        gameName: game.name,
        price: unitPrice,
        qty: quantity,
        sellerName: seller.name,
        textIcon: game.textIcon,
        color: game.color,
        badge: item.badge
      };
      setCart(prev => [...prev, newCartItem]);
    }
    triggerToast(`Đã thêm ${quantity} x "${item.name}" từ ${seller.name} vào giỏ hàng!`);
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
  const handleBuyNow = (item, game, seller, quantity) => {
    const unitPrice = Math.floor(item.price * seller.multiplier);
    const newCartItem = {
      cartId: Date.now() + Math.random().toString(36).substr(2, 5),
      itemId: item.id,
      itemName: item.name,
      gameId: game.id,
      gameName: game.name,
      price: unitPrice,
      qty: quantity,
      sellerName: seller.name,
      textIcon: game.textIcon,
      color: game.color,
      badge: item.badge
    };
    setCart([newCartItem]);
    pushRoute('checkout');
  };

  // Perform checkout action
  const handleConfirmPayment = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setCheckoutProcessing(true);
    setTimeout(() => {
      setCheckoutProcessing(false);
      setCheckoutSuccess(true);
      
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

  // Form Handlers (Bypassed Backend for UI Testing)
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      triggerToast('Vui lòng nhập tài khoản và mật khẩu!');
      return;
    }

    const normalizedMail = loginEmail.replace(/[\s-]/g, "").trim();
    triggerToast('Đăng nhập thành công (Bypass Backend)!');
    
    // Create mock user object
    const userObj = {
      token: "mock-token-12345",
      id: "1004154462",
      mail: normalizedMail,
      name: normalizedMail.includes('@') ? normalizedMail.split('@')[0] : normalizedMail,
      isSeller: false
    };

    // Keep vu1234 username if they typed it
    if (userObj.name === '0912345678') {
      userObj.name = 'vu1234';
    }

    setCurrentUser(userObj);
    localStorage.setItem('currentUser', JSON.stringify(userObj));
    setActiveModal(null);
    setLoginEmail('');
    setLoginPassword('');
  };

  const handleSignupSubmit = (e, customData = null) => {
    if (e && e.preventDefault) e.preventDefault();
    
    const name = customData ? customData.name : signupUsername;
    const email = customData ? customData.mail : signupEmail;
    const password = customData ? customData.password : signupPassword;

    if (!name || !email || !password) {
      triggerToast('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const normalizedMail = email.replace(/[\s-]/g, "").trim();
    triggerToast('Đăng ký tài khoản thành công!');
    
    // Automatically log in the user after signup
    const userObj = {
      token: "mock-token-12345",
      id: "1004154462",
      mail: normalizedMail,
      name: name,
      isSeller: false
    };
    
    setCurrentUser(userObj);
    localStorage.setItem('currentUser', JSON.stringify(userObj));

    setSignupUsername('');
    setSignupEmail('');
    setSignupPassword('');
    setActiveModal(null);
  };

  const handleSellerSubmit = (e) => {
    e.preventDefault();
    if (!sellerExperience) {
      triggerToast('Vui lòng nhập mô tả kinh nghiệm bán hàng!');
      return;
    }
    
    if (currentUser) {
      const updatedUser = { ...currentUser, isSeller: true, role: 'seller' };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      triggerToast(`Đăng ký bán game ${sellerGame} thành công! Tài khoản của bạn đã được nâng cấp lên Người Bán.`);
      setSellerTab('overview');
      pushRoute('seller-landing');
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
            <Promobanners triggerToast={triggerToast} />
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
        />

        <Orders
          currentView={currentView}
          orders={orders}
          triggerToast={triggerToast}
          openChatWithPartner={openChatWithPartner}
          pushRoute={pushRoute}
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
                onClick={() => { setIsCartOpen(false); pushRoute('checkout'); }}
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
