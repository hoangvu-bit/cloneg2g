import React, { useState, useEffect } from 'react';
import './App.css';

// Mock Data for Game/Service Listings
const GAME_LISTINGS = [
  { id: 1, name: 'Roblox Robux (Global)', category: 'coins', price: 'Chỉ từ 45.000₫', offers: '342 tin bán', badge: 'Fast Delivery', color: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', textIcon: 'R$' },
  { id: 2, name: 'Liên Quân Mobile - Tài Khoản Rank Cao Thủ', category: 'accounts', price: 'Chỉ từ 150.000₫', offers: '1,200 tin bán', badge: 'Acc VIP', color: 'linear-gradient(135deg, #1e1b4b 0%, #311042 100%)', textIcon: 'LQ' },
  { id: 3, name: 'Zing Card - Thẻ Game Zing VNG', category: 'cards', price: '95.000₫ / 100K', offers: '88 tin bán', badge: '-5% Discount', color: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)', textIcon: 'Zing' },
  { id: 4, name: 'Valorant - Tài Khoản Cực Nhiều Skin VIP', category: 'accounts', price: 'Chỉ từ 250.000₫', offers: '620 tin bán', badge: 'Trusted Seller', color: 'linear-gradient(135deg, #991b1b 0%, #111827 100%)', textIcon: 'Val' },
  { id: 5, name: 'Garena Shells - Sò Garena Việt Nam', category: 'cards', price: '190.000₫ / 200 Sò', offers: '115 tin bán', badge: 'Instant Deliver', color: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', textIcon: 'Gar' },
  { id: 6, name: 'WoW Gold Dragonflight (US/EU)', category: 'coins', price: 'Chỉ từ 12.000₫ / 1K', offers: '1,530 tin bán', badge: 'Cheapest Price', color: 'linear-gradient(135deg, #fbbf24 0%, #b45309 100%)', textIcon: 'WoW' },
  { id: 7, name: 'Valorant Rank Boosting - Cày Thuê Bất Kỳ Hạng', category: 'boosting', price: 'Chỉ từ 20.000₫ / Sao', offers: '210 tin bán', badge: 'Pro Boosters', color: 'linear-gradient(135deg, #0d9488 0%, #0f766e 100%)', textIcon: 'BST' },
  { id: 8, name: 'Steam Wallet Code 10$ (Global)', category: 'cards', price: '245.000₫', offers: '98 tin bán', badge: 'Auto Send', color: 'linear-gradient(135deg, #475569 0%, #1e293b 100%)', textIcon: 'Steam' },
  { id: 9, name: 'League of Legends - Cày Thuê Thách Đấu', category: 'boosting', price: 'Chỉ từ 35.000₫ / Trận', offers: '150 tin bán', badge: 'LoL Master', color: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)', textIcon: 'LoL' },
  { id: 10, name: 'Huấn luyện chuyên nghiệp - Valorant Coached by Radiant', category: 'coaching', price: '120.000₫ / Giờ', offers: '35 tin bán', badge: 'Radiant Coach', color: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)', textIcon: 'COA' },
  { id: 11, name: 'Genshin Impact - Acc AR 55 Giá Rẻ', category: 'accounts', price: 'Chỉ từ 300.000₫', offers: '422 tin bán', badge: 'Secure 100%', color: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)', textIcon: 'GI' },
  { id: 12, name: 'CS2 Skins - Butterfly Knife Doppler FN', category: 'skins', price: 'Chỉ từ 14.500.000₫', offers: '12 tin bán', badge: 'Rare Item', color: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', textIcon: 'CS2' },
];

// Mock Data for GamePal Partners
const GAMEPAL_PARTNERS = [
  { id: 1, name: 'SkyBlade_Radiant', rating: '4.9', reviews: '1.2k+', game: 'Valorant', earnings: '3.500.000₫ - 8.000.000₫ / tuần', avatarText: 'SB', online: true },
  { id: 2, name: 'GenshinProHelper', rating: '5.0', reviews: '342', game: 'Genshin Impact', earnings: '2.000.000₫ - 4.500.000₫ / tuần', avatarText: 'GP', online: true },
  { id: 3, name: 'Katarina_Master', rating: '4.8', reviews: '820', game: 'League of Legends', earnings: '4.000.000₫ - 9.000.000₫ / tuần', avatarText: 'KM', online: true },
  { id: 4, name: 'RobloxRichBoy', rating: '4.9', reviews: '155', game: 'Roblox Trading', earnings: '1.500.000₫ - 3.200.000₫ / tuần', avatarText: 'RR', online: true },
];

function App() {
  const [theme, setTheme] = useState('dark');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null); // 'login', 'signup', 'seller', null
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [sellerGame, setSellerGame] = useState('Valorant');
  const [sellerExperience, setSellerExperience] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Sync theme changes with document body
  useEffect(() => {
    const body = document.body;
    if (theme === 'light') {
      body.classList.add('light-theme');
    } else {
      body.classList.remove('light-theme');
    }
  }, [theme]);

  // Show Toast Alert
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  // Form Handlers
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      triggerToast('Vui lòng điền đầy đủ email và mật khẩu!');
      return;
    }
    triggerToast(`Đăng nhập thành công với tài khoản: ${loginEmail}`);
    setActiveModal(null);
    setLoginEmail('');
    setLoginPassword('');
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!signupUsername || !signupEmail || !signupPassword) {
      triggerToast('Vui lòng điền đầy đủ các thông tin đăng ký!');
      return;
    }
    triggerToast(`Đăng ký tài khoản ${signupUsername} thành công!`);
    setActiveModal(null);
    setSignupUsername('');
    setSignupEmail('');
    setSignupPassword('');
  };

  const handleSellerSubmit = (e) => {
    e.preventDefault();
    if (!sellerExperience) {
      triggerToast('Vui lòng cung cấp kinh nghiệm giao dịch của bạn!');
      return;
    }
    triggerToast(`Đăng ký ứng tuyển Người bán game ${sellerGame} thành công! Chúng tôi sẽ phản hồi trong 24 giờ.`);
    setActiveModal(null);
    setSellerExperience('');
  };

  // Filtering Game Listings
  const filteredListings = GAME_LISTINGS.filter(item => {
    // Category Filter (grid)
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    // Tab Filter
    const matchesTab = activeTab === 'all' || item.category === activeTab;
    // Search Query Filter
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesTab && matchesSearch;
  });

  return (
    <>
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#10b981',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          zIndex: 10000,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          fontWeight: 600,
          animation: 'slideUp 0.3s ease-out'
        }}>
          {toastMessage}
        </div>
      )}

      {/* Global Navbar */}
      <header className="header">
        <div className="container navbar">
          <div className="logo-container">
            <span className="logo-g2g">G2G</span>
            <span>CLONE</span>
            <span className="logo-dot">.</span>
          </div>

          <div className="nav-search-bar">
            <input 
              type="text" 
              placeholder="Tìm kiếm tài khoản, coins, skins..." 
              className="nav-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="nav-search-btn">
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.35-4.35"></path>
              </svg>
            </button>
          </div>

          <div className="nav-actions">
            <button className="seller-link btn btn-text" onClick={() => setActiveModal('seller')}>
              Trở thành người bán
              <span className="badge badge-success" style={{ marginLeft: '4px' }}>Free</span>
            </button>

            <button className="theme-toggle-btn" onClick={toggleTheme} title="Đổi giao diện">
              {theme === 'dark' ? (
                // Sun Icon
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="5"></circle>
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
                </svg>
              ) : (
                // Moon Icon
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>

            <button className="btn btn-secondary btn-sm" onClick={() => setActiveModal('login')}>
              Đăng nhập
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => setActiveModal('signup')}>
              Đăng ký
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner Section */}
      <section className="hero-section">
        <div className="hero-grid-pattern"></div>
        <div className="hero-glow"></div>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <h1 className="hero-title">
            Nơi game thủ <span>giao dịch tự tin</span>
          </h1>
          <p className="hero-subtitle">
            Mua và bán Tài khoản game, Coins, Boosting, Skins, Thẻ nạp an toàn 100% với bảo hiểm GamerProtect. Mức phí rẻ nhất, tốc độ nhanh nhất.
          </p>

          <div className="hero-search-wrapper">
            <div className="hero-search-bar">
              <input 
                type="text" 
                placeholder="Nhập tên game bạn muốn mua dịch vụ (Ví dụ: Valorant, Robux...)" 
                className="hero-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="hero-search-btn">Tìm Kiếm</button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Shortcuts Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Khám Phá Danh Mục</h2>
          <div className="categories-grid">
            <div 
              className={`category-card ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => { setActiveCategory('all'); setActiveTab('all'); }}
            >
              <div className="category-icon">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </div>
              <span className="category-name">Tất cả dịch vụ</span>
            </div>

            <div 
              className={`category-card ${activeCategory === 'coins' ? 'active' : ''}`}
              onClick={() => { setActiveCategory('coins'); setActiveTab('coins'); }}
            >
              <div className="category-icon">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="8" cy="8" r="6"></circle>
                  <circle cx="16" cy="16" r="6"></circle>
                </svg>
              </div>
              <span className="category-name">Coins / Tiền game</span>
            </div>

            <div 
              className={`category-card ${activeCategory === 'accounts' ? 'active' : ''}`}
              onClick={() => { setActiveCategory('accounts'); setActiveTab('accounts'); }}
            >
              <div className="category-icon">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <span className="category-name">Tài khoản VIP</span>
            </div>

            <div 
              className={`category-card ${activeCategory === 'items' ? 'active' : ''}`}
              onClick={() => { setActiveCategory('items'); setActiveTab('items'); }}
            >
              <div className="category-icon">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                </svg>
              </div>
              <span className="category-name">Vật phẩm / Items</span>
            </div>

            <div 
              className={`category-card ${activeCategory === 'boosting' ? 'active' : ''}`}
              onClick={() => { setActiveCategory('boosting'); setActiveTab('boosting'); }}
            >
              <div className="category-icon">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                </svg>
              </div>
              <span className="category-name">Cày thuê / Boosting</span>
            </div>

            <div 
              className={`category-card ${activeCategory === 'cards' ? 'active' : ''}`}
              onClick={() => { setActiveCategory('cards'); setActiveTab('cards'); }}
            >
              <div className="category-icon">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M2 10h20"></path>
                </svg>
              </div>
              <span className="category-name">Thẻ game / Gift Card</span>
            </div>

            <div 
              className={`category-card ${activeCategory === 'coaching' ? 'active' : ''}`}
              onClick={() => { setActiveCategory('coaching'); setActiveTab('coaching'); }}
            >
              <div className="category-icon">
                <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9z"></path>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
              </div>
              <span className="category-name">Huấn luyện viên</span>
            </div>
          </div>
        </div>
      </section>

      {/* Ambassador / GamePal Section */}
      <section className="gamepal-section">
        <div className="container">
          <div className="justify-between" style={{ marginBottom: '24px' }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Đại Sứ GamePal &amp; Coaching</h2>
            <button className="btn btn-secondary btn-sm" onClick={() => triggerToast('Đang tải danh sách huấn luyện viên mới...')}>
              Xem tất cả đại sứ
            </button>
          </div>
          
          <div className="gamepal-grid">
            {GAMEPAL_PARTNERS.map(partner => (
              <div key={partner.id} className="partner-card">
                <div className="partner-header">
                  <div className="avatar-container">
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #ff3b30 0%, #ec4899 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifycontent: 'center',
                      color: 'white',
                      fontWeight: '800',
                      fontSize: '18px',
                      border: '2px solid var(--border-color)'
                    }}>
                      {partner.avatarText}
                    </div>
                    {partner.online && <span className="online-status"></span>}
                  </div>
                  <div className="partner-info">
                    <h4>{partner.name}</h4>
                    <div className="partner-rating">
                      <span className="star-icon">★</span>
                      <span>{partner.rating}</span>
                      <span style={{ color: 'var(--text-muted)' }}>({partner.reviews})</span>
                    </div>
                  </div>
                </div>

                <div className="partner-tags">
                  <span className="partner-tag">{partner.game}</span>
                  <span className="partner-tag">Đảm bảo an toàn</span>
                  <span className="partner-tag">Mic / Chat tốt</span>
                </div>

                <div className="partner-earnings">
                  Thu nhập: {partner.earnings}
                </div>

                <div className="partner-action">
                  <button className="btn btn-outline btn-sm" style={{ width: '100%' }} onClick={() => triggerToast(`Đã gửi yêu cầu chat đến đại sứ ${partner.name}!`)}>
                    Liên hệ ngay
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending & Filterable Listings Grid */}
      <section className="trending-section">
        <div className="container">
          <h2 className="section-title">Sản Phẩm &amp; Dịch Vụ Đang Hot</h2>

          <div className="trending-header-filters">
            <div className="tabs-container">
              <div 
                className={`tab-link ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => { setActiveTab('all'); setActiveCategory('all'); }}
              >
                Tất cả sản phẩm
              </div>
              <div 
                className={`tab-link ${activeTab === 'coins' ? 'active' : ''}`}
                onClick={() => { setActiveTab('coins'); setActiveCategory('coins'); }}
              >
                Tiền tệ Game (Coins)
              </div>
              <div 
                className={`tab-link ${activeTab === 'accounts' ? 'active' : ''}`}
                onClick={() => { setActiveTab('accounts'); setActiveCategory('accounts'); }}
              >
                Tài khoản VIP (Accounts)
              </div>
              <div 
                className={`tab-link ${activeTab === 'cards' ? 'active' : ''}`}
                onClick={() => { setActiveTab('cards'); setActiveCategory('cards'); }}
              >
                Thẻ Game (Gift Cards)
              </div>
              <div 
                className={`tab-link ${activeTab === 'boosting' ? 'active' : ''}`}
                onClick={() => { setActiveTab('boosting'); setActiveCategory('boosting'); }}
              >
                Cày thuê (Boosting)
              </div>
            </div>

            <input 
              type="text" 
              placeholder="Lọc kết quả theo tên game..." 
              className="search-filter-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {filteredListings.length > 0 ? (
            <div className="trending-grid">
              {filteredListings.map(item => (
                <div key={item.id} className="game-card">
                  <div className="game-image-wrapper" style={{ background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '36px', fontWeight: '800', color: 'rgba(255,255,255,0.7)', letterSpacing: '2px' }}>
                      {item.textIcon}
                    </div>
                    <span className="game-card-badge">{item.badge}</span>
                  </div>
                  
                  <div className="game-info">
                    <div>
                      <h3 className="game-name">{item.name}</h3>
                      <div className="game-meta">{item.offers}</div>
                    </div>
                    
                    <div className="game-price-cta">
                      <div>
                        <div className="game-price-label">Giá bán rẻ nhất</div>
                        <div className="game-price-value">{item.price}</div>
                      </div>
                      <button className="btn btn-primary btn-sm" style={{ padding: '8px 16px' }} onClick={() => triggerToast(`Đã thêm dịch vụ "${item.name}" vào giỏ hàng!`)}>
                        Mua Ngay
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', border: '1px dashed var(--border-color)', borderRadius: '16px' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '15px' }}>
                Không tìm thấy sản phẩm hoặc game nào phù hợp với tìm kiếm của bạn.
              </p>
              <button className="btn btn-secondary btn-sm" onClick={() => { setSearchQuery(''); setActiveTab('all'); setActiveCategory('all'); }}>
                Đặt lại bộ lọc
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Affiliate Promotional Banners */}
      <section className="promos-section">
        <div className="container">
          <div className="promo-grid">
            <div className="promo-card">
              <div className="promo-glow"></div>
              <div>
                <h3 className="promo-title">Chương Trình Đối Tác &amp; Affiliate</h3>
                <p className="promo-description">
                  Chia sẻ link bán hàng G2G và kiếm hoa hồng lên tới 5% trên mỗi giao dịch thành công. Rút tiền mặt nhanh chóng.
                </p>
                <div className="promo-steps">
                  <div className="promo-step">
                    <span className="step-num">1</span>
                    <span>Tạo tài khoản và lấy link affiliate cá nhân</span>
                  </div>
                  <div className="promo-step">
                    <span className="step-num">2</span>
                    <span>Chia sẻ link trên mạng xã hội, diễn đàn game</span>
                  </div>
                  <div className="promo-step">
                    <span className="step-num">3</span>
                    <span>Nhận tiền hoa hồng thụ động không giới hạn</span>
                  </div>
                </div>
              </div>
              <button className="btn btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => triggerToast('Chương trình Affiliate đang chuẩn bị khởi chạy! Bạn sẽ nhận được thông báo sớm nhất.')}>
                Bắt đầu kiếm tiền
              </button>
            </div>

            <div className="promo-card" style={{ background: 'linear-gradient(135deg, rgba(255, 59, 48, 0.08) 0%, rgba(245, 158, 11, 0.05) 100%)' }}>
              <div className="promo-glow" style={{ background: 'radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)' }}></div>
              <div>
                <h3 className="promo-title" style={{ color: 'var(--gold)' }}>Bảo Hiểm GamerProtect</h3>
                <p className="promo-description" style={{ color: 'var(--text-primary)' }}>
                  An toàn giao dịch tuyệt đối cho cả người mua và người bán. Hệ thống tự động xác minh và bảo vệ dòng tiền.
                </p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓</span> Bảo hiểm hoàn tiền 100% khi xảy ra sự cố tài khoản.
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓</span> Trọng tài G2G hỗ trợ tranh chấp 24/7.
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>✓</span> Hệ thống ký quỹ tiền gửi an toàn tuyệt đối.
                  </li>
                </ul>
              </div>
              <button className="btn btn-secondary" style={{ alignSelf: 'flex-start' }} onClick={() => triggerToast('Chi tiết bảo hiểm GamerProtect đã được gửi qua email!')}>
                Tìm hiểu thêm
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Core Features Section */}
      <section className="trust-section">
        <div className="container">
          <h2 className="trust-title">Tại Sao Nên Chọn <span>G2G Marketplace</span>?</h2>
          <p className="trust-subtitle">
            Hàng triệu game thủ trên toàn cầu đã lựa chọn và giao dịch hàng ngày trên nền tảng của chúng tôi.
          </p>

          <div className="trust-grid">
            <div className="trust-card">
              <div className="trust-icon-wrapper">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h4 className="trust-card-title">Giao Dịch Bảo Mật</h4>
              <p className="trust-card-desc">
                Thông tin cá nhân và dữ liệu thanh toán luôn được mã hóa ở mức độ cao nhất bằng chuẩn SSL 256-bit.
              </p>
            </div>

            <div className="trust-card">
              <div className="trust-icon-wrapper">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 6v6l4 2"></path>
                </svg>
              </div>
              <h4 className="trust-card-title">Hỗ Trợ 24/7</h4>
              <p className="trust-card-desc">
                Đội ngũ chăm sóc khách hàng đa ngôn ngữ luôn túc trực bất cứ lúc nào để giải quyết khiếu nại của bạn.
              </p>
            </div>

            <div className="trust-card">
              <div className="trust-icon-wrapper">
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                  <path d="M12 17h.01M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2z"></path>
                </svg>
              </div>
              <h4 className="trust-card-title">Giao Hàng Siêu Tốc</h4>
              <p className="trust-card-desc">
                Hơn 90% giao dịch tiền game và thẻ nạp được xử lý và bàn giao thành công trong vòng chưa đầy 5 phút.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Main */}
      <footer className="footer-main">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <h3>G2G CLONE</h3>
              <p>
                G2G Clone là nền tảng demo giao dịch sản phẩm trò chơi điện tử trực tuyến an toàn hàng đầu. Mua bán game tài khoản, coins, skins nhanh chóng và giá tốt nhất thị trường.
              </p>
              <div className="footer-socials">
                <a href="https://facebook.com" className="social-link" target="_blank" rel="noreferrer">Fb</a>
                <a href="https://twitter.com" className="social-link" target="_blank" rel="noreferrer">Tw</a>
                <a href="https://discord.gg" className="social-link" target="_blank" rel="noreferrer">Dc</a>
                <a href="https://youtube.com" className="social-link" target="_blank" rel="noreferrer">Yt</a>
              </div>
            </div>

            <div className="footer-col">
              <h5>G2G</h5>
              <ul>
                <li><a href="#about" onClick={(e) => { e.preventDefault(); triggerToast('Trang giới thiệu G2G'); }}>Về chúng tôi</a></li>
                <li><a href="#press" onClick={(e) => { e.preventDefault(); triggerToast('Trang báo chí truyền thông'); }}>Báo chí</a></li>
                <li><a href="#careers" onClick={(e) => { e.preventDefault(); triggerToast('Cơ hội việc làm tại G2G'); }}>Tuyển dụng</a></li>
                <li><a href="#blog" onClick={(e) => { e.preventDefault(); triggerToast('Blog tin tức game'); }}>G2G Blog</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h5>Hỗ Trợ</h5>
              <ul>
                <li><a href="#help" onClick={(e) => { e.preventDefault(); triggerToast('Trung tâm trợ giúp game thủ'); }}>Trung tâm hỗ trợ</a></li>
                <li><a href="#protect" onClick={(e) => { e.preventDefault(); triggerToast('Chi tiết bảo hiểm GamerProtect'); }}>GamerProtect</a></li>
                <li><a href="#refund" onClick={(e) => { e.preventDefault(); triggerToast('Chính sách hoàn tiền chi tiết'); }}>Chính sách hoàn tiền</a></li>
                <li><a href="#contact" onClick={(e) => { e.preventDefault(); triggerToast('Trang liên hệ CSKH G2G'); }}>Liên hệ chúng tôi</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h5>Người Bán</h5>
              <ul>
                <li><a href="#rules" onClick={(e) => { e.preventDefault(); triggerToast('Quy định bán hàng tại G2G'); }}>Quy tắc người bán</a></li>
                <li><a href="#fees" onClick={(e) => { e.preventDefault(); triggerToast('Bảng phí giao dịch chi tiết'); }}>Biểu phí giao dịch</a></li>
                <li><a href="#withdraw" onClick={(e) => { e.preventDefault(); triggerToast('Các phương thức rút tiền doanh thu'); }}>Các cổng rút tiền</a></li>
                <li><a href="#become" onClick={(e) => { e.preventDefault(); setActiveModal('seller'); }}>Đăng ký người bán</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h5>Pháp Lý</h5>
              <ul>
                <li><a href="#terms" onClick={(e) => { e.preventDefault(); triggerToast('Điều khoản dịch vụ của G2G'); }}>Điều khoản dịch vụ</a></li>
                <li><a href="#privacy" onClick={(e) => { e.preventDefault(); triggerToast('Chính sách bảo mật thông tin'); }}>Chính sách bảo mật</a></li>
                <li><a href="#coookies" onClick={(e) => { e.preventDefault(); triggerToast('Quy tắc lưu trữ cookie'); }}>Cookie Policy</a></li>
                <li><a href="#copyright" onClick={(e) => { e.preventDefault(); triggerToast('Bản quyền sở hữu trí tuệ'); }}>Tuyên bố bản quyền</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-payments-wrapper">
            <h6 className="payments-title">Đối tác thanh toán được hỗ trợ</h6>
            <div className="payments-grid">
              <span className="payment-card-logo">PayPal</span>
              <span className="payment-card-logo">VISA</span>
              <span className="payment-card-logo">Mastercard</span>
              <span className="payment-card-logo">Neteller</span>
              <span className="payment-card-logo">Skrill</span>
              <span className="payment-card-logo">Google Pay</span>
              <span className="payment-card-logo">Apple Pay</span>
              <span className="payment-card-logo">MoMo Pay</span>
              <span className="payment-card-logo">ZaloPay</span>
              <span className="payment-card-logo">Chuyển khoản NH</span>
            </div>
          </div>

          <div className="footer-bottom">
            <div>© 2026 G2G CLONE. Developed for educational replication. All rights reserved.</div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <span>Tiếng Việt / VND</span>
              <span>Bảo mật SSL Mã hóa 256-bit</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {activeModal === 'login' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="modal-close" onClick={() => setActiveModal(null)}>×</span>
            <h3 style={{ marginBottom: '24px', fontSize: '22px', fontWeight: 800 }}>Đăng Nhập G2G</h3>
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label>Email hoặc Tên đăng nhập</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="name@example.com" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group" style={{ marginBottom: '8px' }}>
                <label>Mật khẩu</label>
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="••••••••" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required 
                />
              </div>
              <div style={{ textAlign: 'right', marginBottom: '24px' }}>
                <a href="#forgot" style={{ fontSize: '12px', color: 'var(--brand-red)' }} onClick={(e) => { e.preventDefault(); triggerToast('Mã đặt lại mật khẩu đã được gửi đến hòm thư của bạn!'); }}>Quên mật khẩu?</a>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>Đăng Nhập</button>
            </form>
            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              Chưa có tài khoản? <span style={{ color: 'var(--brand-red)', cursor: 'pointer', fontWeight: 600 }} onClick={() => setActiveModal('signup')}>Đăng ký ngay</span>
            </div>
          </div>
        </div>
      )}

      {/* Sign Up Modal */}
      {activeModal === 'signup' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="modal-close" onClick={() => setActiveModal(null)}>×</span>
            <h3 style={{ marginBottom: '24px', fontSize: '22px', fontWeight: 800 }}>Tạo Tài Khoản Mới</h3>
            <form onSubmit={handleSignupSubmit}>
              <div className="form-group">
                <label>Tên hiển thị</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Ví dụ: gamer_pro102" 
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Địa chỉ Email</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="name@example.com" 
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Mật khẩu (Tối thiểu 6 ký tự)</label>
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="••••••••" 
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  minLength="6"
                  required 
                />
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', alignItems: 'flex-start' }}>
                <input type="checkbox" id="termsAgree" required style={{ marginTop: '3px' }} />
                <label htmlFor="termsAgree" style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4, cursor: 'pointer' }}>
                  Tôi đồng ý với các điều khoản hoạt động và cam kết bảo vệ thông tin của G2G Marketplace.
                </label>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>Đăng Ký Tài Khoản</button>
            </form>
            <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>
              Đã có tài khoản? <span style={{ color: 'var(--brand-red)', cursor: 'pointer', fontWeight: 600 }} onClick={() => setActiveModal('login')}>Đăng nhập</span>
            </div>
          </div>
        </div>
      )}

      {/* Become a Seller Modal */}
      {activeModal === 'seller' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="modal-close" onClick={() => setActiveModal(null)}>×</span>
            <h3 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: 800 }}>Đăng Ký Người Bán Game</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.5 }}>
              Kiếm thêm thu nhập từ việc bán xu game, tài khoản dư hoặc cày thuê game. Quá trình xét duyệt miễn phí và nhanh chóng!
            </p>
            <form onSubmit={handleSellerSubmit}>
              <div className="form-group">
                <label>Trò chơi muốn giao dịch chính</label>
                <select 
                  className="form-control"
                  value={sellerGame}
                  onChange={(e) => setSellerGame(e.target.value)}
                >
                  <option value="Valorant">Valorant</option>
                  <option value="Roblox">Roblox</option>
                  <option value="League of Legends">League of Legends</option>
                  <option value="Genshin Impact">Genshin Impact</option>
                  <option value="Game Coins (Chung)">Coins game khác</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Mô tả ngắn kinh nghiệm &amp; sản phẩm bán</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  placeholder="Ví dụ: Tôi có nguồn Robux sạch dồi dào, hoặc Tôi có đội cày thuê Liên Quân uy tín đạt Thách Đấu..."
                  value={sellerExperience}
                  onChange={(e) => setSellerExperience(e.target.value)}
                  style={{ resize: 'vertical' }}
                  required
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', alignItems: 'flex-start' }}>
                <input type="checkbox" id="sellerAgree" required style={{ marginTop: '3px' }} />
                <label htmlFor="sellerAgree" style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4, cursor: 'pointer' }}>
                  Tôi cam kết cung cấp sản phẩm sạch, không vi phạm pháp luật và tuân thủ tuyệt đối quy định giao dịch của G2G.
                </label>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>Gửi Hồ Sơ Xét Duyệt</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
