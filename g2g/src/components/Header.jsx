import React from 'react';
import { MOCK_GAMES } from '../MockData';

export default function Header({
  searchQuery,
  setSearchQuery,
  searchFocused,
  setSearchFocused,
  navigateToCatalog,
  pushRoute,
  setActiveModal,
  setIsCartOpen,
  setShowChatDrawer,
  chats,
  activeChatId,
  setActiveChatId,
  theme,
  toggleTheme,
  cart,
  currentUser,
  handleLogout,
  selectedCategory,
  currentView,
  navigateToCategory,
  sellerTab,
  setSellerTab,
  triggerToast,
  userWalletBalance = 0,
}) {
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const [expandedSubmenu, setExpandedSubmenu] = React.useState(null); // 'selling' | 'settings' | null
  const dropdownRef = React.useRef(null);

  const [notifications, setNotifications] = React.useState([]);
  const [isNotificationOpen, setIsNotificationOpen] = React.useState(false);
  const notificationDropdownRef = React.useRef(null);

  const loadNotifications = () => {
    if (currentUser) {
      const key = `g2g_notifications_${currentUser.name}`;
      try {
        const saved = localStorage.getItem(key);
        setNotifications(saved ? JSON.parse(saved) : []);
      } catch (e) {
        setNotifications([]);
      }
    } else {
      setNotifications([]);
    }
  };

  React.useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 3000);
    return () => clearInterval(interval);
  }, [currentUser]);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const firstLetter = currentUser && currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'V';
  const accountId = currentUser ? (currentUser.id || '1004154462') : '1004154462';

  const filteredSuggestions = searchQuery
    ? MOCK_GAMES.filter((g) =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      {/* Global Navbar Header */}
      <header className="header">
        <div className="container navbar">
          <div className="logo-container" onClick={() => pushRoute('home')}>
            <span className="logo-g2g">G2G</span>
            <span className="logo-text">CLONE</span>
            <span className="logo-dot">.</span>
          </div>

          {/* Autocomplete Search Bar */}
          <div className="nav-search-bar-wrapper">
            <div className="nav-search-bar">
              <input
                type="text"
                placeholder="Tìm kiếm game, thẻ quà tặng, coins..."
                className="nav-search-input"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 250)}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <span className="clear-search-btn" onClick={() => setSearchQuery('')}>
                  ×
                </span>
              )}
              <button className="nav-search-btn">
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="M21 21l-4.35-4.35"></path>
                </svg>
              </button>
            </div>

            {/* Live Autocomplete Suggestions Box */}
            {searchFocused && (
              <div className="search-suggestions-dropdown">
                {searchQuery ? (
                  filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map((game) => (
                      <div
                        key={game.id}
                        className="suggestion-item"
                        onClick={() => navigateToCatalog(game)}
                      >
                        <div className="suggestion-game-info">
                          <span
                            className="suggestion-icon"
                            style={{ background: game.color }}
                          >
                            {game.textIcon}
                          </span>
                          <div>
                            <div className="suggestion-game-name">{game.name}</div>
                            <div className="suggestion-game-desc">{game.description}</div>
                          </div>
                        </div>
                        <div className="suggestion-chips">
                          <span
                            className="chip"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateToCatalog(game);
                            }}
                          >
                            Ưu đãi
                          </span>
                          <span
                            className="chip"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateToCatalog(game);
                            }}
                          >
                            Nạp thẻ
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-suggestion">
                      Không tìm thấy game nào phù hợp với "{searchQuery}"
                    </div>
                  )
                ) : (
                  <div className="default-suggestions">
                    <div className="suggestion-title">Xu Hướng Tìm Kiếm</div>
                    <div className="trending-chips-grid">
                      {MOCK_GAMES.slice(0, 4).map((g) => (
                        <div
                          key={g.id}
                          className="trending-chip"
                          onClick={() => navigateToCatalog(g)}
                        >
                          <span className="dot"></span> {g.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="nav-actions">
            {currentUser ? (
              <div className="header-logged-in-container" ref={dropdownRef}>
                {/* VN language pill */}
                <div className="vn-badge-pill">
                  <span className="vn-flag-icon">
                    <svg viewBox="0 0 24 16" width="16" height="12" style={{ verticalAlign: 'middle', borderRadius: '2px', display: 'inline-block' }}>
                      <rect width="24" height="16" fill="#da251d" />
                      <polygon points="12,4 13.2,8.1 17.5,8.1 14,10.6 15.3,14.7 12,12.2 8.7,14.7 10,10.6 6.5,8.1 10.8,8.1" fill="#ffff00" />
                    </svg>
                  </span>
                  <span className="vn-text">VN</span>
                </div>

                {/* Wallet Balance Badge */}
                <div
                  className="user-wallet-pill-badge"
                  onClick={() => pushRoute('category-catalog', { category: 'topup' })}
                  title="Nhấn để nạp tiền vào ví"
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: userWalletBalance > 0
                      ? 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(5,150,105,0.08) 100%)'
                      : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${userWalletBalance > 0 ? 'rgba(16,185,129,0.35)' : 'rgba(255,255,255,0.1)'}`,
                    padding: '6px 14px',
                    borderRadius: '20px',
                    color: userWalletBalance > 0 ? '#10b981' : '#9ea2a9',
                    fontSize: '13px',
                    fontWeight: 700,
                    transition: 'all 0.3s ease',
                    marginRight: '6px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span style={{ fontSize: '14px' }}>💰</span>
                  <span>{userWalletBalance.toLocaleString('vi-VN')}₫</span>
                </div>

                {currentUser && currentUser.role === 'admin' && (
                  <button 
                    className="btn btn-primary btn-sm" 
                    style={{ background: 'linear-gradient(135deg, #ff3333 0%, #cc0000 100%)', border: 'none', marginRight: '10px', height: '36px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}
                    onClick={() => pushRoute('admin-dashboard')}
                  >
                    👑 Quản Trị
                  </button>
                )}

                {/* Mua sắm ngay button */}
                <button className="buy-now-header-btn" onClick={() => pushRoute('home')}>
                  Mua sắm ngay
                </button>

                {/* Chat Trigger */}
                <button
                  className="header-icon-circle-btn"
                  onClick={() => {
                    setShowChatDrawer(true);
                    if (chats.length > 0 && activeChatId === null) setActiveChatId(chats[0].id);
                  }}
                  title="Tin nhắn"
                >
                  <svg
                    width="18"
                    height="18"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
                  </svg>
                </button>

                {/* Notification Bell Trigger */}
                <div style={{ position: 'relative' }} ref={notificationDropdownRef}>
                  <button 
                    className="header-icon-circle-btn" 
                    title="Thông báo"
                    onClick={() => {
                      setIsNotificationOpen(!isNotificationOpen);
                      if (currentUser && notifications.some(n => n.unread)) {
                        const updated = notifications.map(n => ({ ...n, unread: false }));
                        setNotifications(updated);
                        localStorage.setItem(`g2g_notifications_${currentUser.name}`, JSON.stringify(updated));
                      }
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z" />
                    </svg>
                    {currentUser && notifications.some(n => n.unread) && (
                      <span className="notification-badge" style={{
                        position: 'absolute', top: '2px', right: '2px',
                        backgroundColor: '#ff3333', color: '#ffffff',
                        borderRadius: '50%', width: '8px', height: '8px',
                        display: 'block'
                      }}></span>
                    )}
                  </button>
                  
                  {isNotificationOpen && (
                    <div className="notifications-dropdown-menu" style={{
                      position: 'absolute', top: '48px', right: '0',
                      width: '320px', backgroundColor: '#17181c',
                      border: '1px solid #2d2f34', borderRadius: '8px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.5)', zIndex: 1000,
                      padding: '12px 0', fontFamily: 'inherit'
                    }}>
                      <div style={{
                        padding: '0 16px 8px', borderBottom: '1px solid #2d2f34',
                        fontWeight: 'bold', display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', fontSize: '13px', color: '#ffffff'
                      }}>
                        <span>Thông báo của bạn</span>
                        {currentUser && notifications.length > 0 && (
                          <span 
                            style={{ fontSize: '11px', color: '#ff3333', cursor: 'pointer' }}
                            onClick={() => {
                              localStorage.setItem(`g2g_notifications_${currentUser.name}`, JSON.stringify([]));
                              setNotifications([]);
                            }}
                          >
                            Xóa tất cả
                          </span>
                        )}
                      </div>
                      <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                        {!currentUser ? (
                          <div style={{ padding: '20px', textAlign: 'center', color: '#72767d', fontSize: '12px' }}>
                            Vui lòng đăng nhập để xem thông báo.
                          </div>
                        ) : notifications.length === 0 ? (
                          <div style={{ padding: '20px', textAlign: 'center', color: '#72767d', fontSize: '12px' }}>
                            Không có thông báo nào.
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div 
                              key={n.id} 
                              style={{
                                padding: '12px 16px', borderBottom: '1px solid #1f2125',
                                backgroundColor: n.unread ? 'rgba(255, 51, 51, 0.05)' : 'transparent',
                                textAlign: 'left'
                              }}
                            >
                              <div style={{ fontWeight: 'bold', fontSize: '12.5px', color: '#ffffff', marginBottom: '4px' }}>
                                {n.title}
                              </div>
                              <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4' }}>
                                {n.message}
                              </div>
                              <div style={{ fontSize: '10px', color: '#72767d', marginTop: '6px' }}>
                                {n.date}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Avatar Button */}
                <div 
                  className="user-profile-avatar-wrapper"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <div className="user-profile-avatar">
                    {firstLetter}
                  </div>
                  <span className="online-status-dot"></span>
                </div>

                {/* G2G User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="g2g-user-dropdown-menu">
                    {/* User Profile Summary */}
                    <div className="dropdown-user-info-section">
                      <div className="dropdown-user-avatar-large">
                        {firstLetter}
                        <span className="online-status-dot-large"></span>
                      </div>
                      <div className="dropdown-user-details">
                        <div className="dropdown-username">{currentUser.name}</div>
                        <div className="dropdown-user-level">Cấp độ 1</div>
                        <div className="dropdown-user-id">ID Tài khoản {accountId}</div>
                      </div>
                    </div>

                    {/* Balance & Points Info */}
                    <div className="dropdown-balances-section">
                      <div className="dropdown-balance-row">
                        <span className="balance-label">G2G Store Credit</span>
                        <div className="balance-value-container">
                          <span className="sc-icon-badge">SC</span>
                          <span className="balance-value">0.00</span>
                        </div>
                      </div>
                      <div className="dropdown-balance-row">
                        <span className="balance-label">G2G Points</span>
                        <div className="balance-value-container">
                          <span className="g-icon-badge">G</span>
                          <span className="balance-value">0</span>
                        </div>
                      </div>
                      <div className="dropdown-balance-row">
                        <span className="balance-label">Số dư tài khoản (VND)</span>
                        <div className="balance-value-container">
                          <span className="balance-value" style={{ color: '#10b981', fontWeight: 'bold' }}>
                            {userWalletBalance.toLocaleString('vi-VN')} ₫
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Referral CTA Button */}
                    <div className="dropdown-referral-container">
                      <button className="dropdown-referral-btn">
                        <svg
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          style={{ marginRight: '8px', verticalAlign: 'middle' }}
                        >
                          <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                        Mời bạn bè & bắt đầu kiếm tiền!
                      </button>
                    </div>

                    {/* Menu Items List */}
                    <ul className="dropdown-menu-list">
                      {currentUser && currentUser.role === 'admin' && (
                        <li 
                          className="dropdown-menu-item" 
                          style={{ borderBottom: '1px solid rgba(255, 51, 51, 0.2)', backgroundColor: 'rgba(255, 51, 51, 0.05)' }} 
                          onClick={() => { setIsUserMenuOpen(false); pushRoute('admin-dashboard'); }}
                        >
                          <span style={{ color: '#ff3333', fontWeight: 'bold' }}>👑 Trang Quản Trị (Admin)</span>
                        </li>
                      )}
                      <li className="dropdown-menu-item" onClick={() => { setIsUserMenuOpen(false); pushRoute('orders'); }}>
                        <span>Tổng quan</span>
                      </li>
                      <li className="dropdown-menu-item" onClick={() => { setIsUserMenuOpen(false); pushRoute('orders'); }}>
                        <span>Đơn hàng mua</span>
                      </li>
                      
                      {/* Selling Submenu Toggler */}
                      <li 
                        className={`dropdown-menu-item has-submenu ${expandedSubmenu === 'selling' ? 'expanded' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedSubmenu(expandedSubmenu === 'selling' ? null : 'selling');
                        }}
                      >
                        <span>Selling</span>
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ transform: expandedSubmenu === 'selling' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                          <path d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </li>
                      
                      {expandedSubmenu === 'selling' && (
                        <div className="dropdown-submenu-container">
                          <div className="dropdown-submenu-item" onClick={() => { setIsUserMenuOpen(false); setSellerTab('overview'); pushRoute('seller-landing'); }}>
                            Tổng quan người bán
                          </div>
                          <div className="dropdown-submenu-item" onClick={() => { setIsUserMenuOpen(false); setSellerTab('add-listing'); pushRoute('seller-landing'); }}>
                            Đăng bán sản phẩm
                          </div>
                          <div className="dropdown-submenu-item" onClick={() => { setIsUserMenuOpen(false); setSellerTab('listings'); pushRoute('seller-landing'); }}>
                            Quản lý sản phẩm
                          </div>
                          <div className="dropdown-submenu-item" onClick={() => { setIsUserMenuOpen(false); setSellerTab('orders'); pushRoute('seller-landing'); }}>
                            Đơn hàng bán
                          </div>
                          <div className="dropdown-submenu-item" onClick={() => { setIsUserMenuOpen(false); setSellerTab('wallet'); pushRoute('seller-landing'); }}>
                            Ví &amp; Doanh thu
                          </div>
                        </div>
                      )}

                      <li className="dropdown-menu-item" onClick={() => { setIsUserMenuOpen(false); pushRoute('seller-landing'); }}>
                        <span>G2G Affiliate Program</span>
                      </li>
                      
                      {/* Settings Submenu Toggler */}
                      <li 
                        className={`dropdown-menu-item has-submenu ${expandedSubmenu === 'settings' ? 'expanded' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedSubmenu(expandedSubmenu === 'settings' ? null : 'settings');
                        }}
                      >
                        <span>Cài đặt</span>
                        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ transform: expandedSubmenu === 'settings' ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                          <path d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </li>
                      
                      {expandedSubmenu === 'settings' && (
                        <div className="dropdown-submenu-container">
                          <div className="dropdown-submenu-item" onClick={() => { setIsUserMenuOpen(false); if (triggerToast) triggerToast('Tính năng Thông tin cá nhân đang phát triển!'); }}>
                            Thông tin cá nhân
                          </div>
                          <div className="dropdown-submenu-item" onClick={() => { setIsUserMenuOpen(false); if (triggerToast) triggerToast('Tính năng Bảo mật tài khoản đang phát triển!'); }}>
                            Bảo mật tài khoản
                          </div>
                          <div className="dropdown-submenu-item" onClick={() => { setIsUserMenuOpen(false); if (triggerToast) triggerToast('Tính năng Cài đặt thanh toán đang phát triển!'); }}>
                            Cài đặt thanh toán
                          </div>
                        </div>
                      )}

                      <li className="dropdown-menu-item logout-item" onClick={() => { setIsUserMenuOpen(false); handleLogout(); }}>
                        <span>Đăng xuất</span>
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  className="seller-link btn btn-text"
                  onClick={() => pushRoute('seller-landing')}
                >
                  Trở thành người bán
                  <span className="badge badge-success" style={{ marginLeft: '6px' }}>
                    Free
                  </span>
                </button>

                {/* Shopping Cart Trigger */}
                <button
                  className="cart-trigger-btn"
                  onClick={() => setIsCartOpen(true)}
                  title="Giỏ Hàng"
                >
                  <svg
                    width="22"
                    height="22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z"></path>
                    <path d="M3 6h18M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                  {cart.length > 0 && (
                    <span className="cart-count-badge">
                      {cart.reduce((sum, i) => sum + i.qty, 0)}
                    </span>
                  )}
                </button>

                {/* Chat Trigger */}
                <button
                  className="chat-trigger-btn"
                  onClick={() => {
                    setShowChatDrawer(true);
                    if (chats.length > 0 && activeChatId === null) setActiveChatId(chats[0].id);
                  }}
                  title="Tin nhắn"
                >
                  <svg
                    width="22"
                    height="22"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </button>

                <button className="theme-toggle-btn" onClick={toggleTheme} title="Đổi giao diện">
                  {theme === 'dark' ? (
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="5"></circle>
                      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                  )}
                </button>

                <button className="btn btn-secondary btn-sm" onClick={() => pushRoute('orders')}>
                  Đơn Hàng
                </button>

                <button className="btn btn-primary btn-sm" onClick={() => setActiveModal('login')}>
                  Đăng nhập
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Sub-Navbar Horizontal Category Selector (Standard e-commerce bar) */}
      <nav className="sub-navbar">
        <div className="container sub-navbar-container">
          <span
            className={`sub-nav-item ${
              selectedCategory === 'all' && currentView === 'category-catalog' ? 'active' : ''
            }`}
            onClick={() => navigateToCategory('all')}
          >
            🌐 Tất cả danh mục
          </span>
          <span
            className={`sub-nav-item ${
              selectedCategory === 'coins' && currentView === 'category-catalog' ? 'active' : ''
            }`}
            onClick={() => navigateToCategory('coins')}
          >
            🪙 Tiền tệ (Coins)
          </span>
          <span
            className={`sub-nav-item ${
              selectedCategory === 'accounts' && currentView === 'category-catalog' ? 'active' : ''
            }`}
            onClick={() => navigateToCategory('accounts')}
          >
            👤 Tài khoản VIP
          </span>
          <span
            className={`sub-nav-item ${
              selectedCategory === 'cards' && currentView === 'category-catalog' ? 'active' : ''
            }`}
            onClick={() => navigateToCategory('cards')}
          >
            💳 Thẻ Game / Gift Card
          </span>
          <span
            className={`sub-nav-item ${
              selectedCategory === 'boosting' && currentView === 'category-catalog' ? 'active' : ''
            }`}
            onClick={() => navigateToCategory('boosting')}
          >
            ⚡ Cày thuê (Boosting)
          </span>
        </div>
      </nav>
    </>
  );
}
