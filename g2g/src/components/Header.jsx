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
}) {
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
            <button
              className="seller-link btn btn-text"
              onClick={() => setActiveModal('seller')}
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
            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  className="user-name-display"
                  style={{ color: 'var(--brand-red)', fontWeight: 'bold', fontSize: '14px' }}
                >
                  👤 {currentUser.name}
                </span>
                <button className="btn btn-primary btn-sm" onClick={handleLogout}>
                  Đăng xuất
                </button>
              </div>
            ) : (
              <button className="btn btn-primary btn-sm" onClick={() => setActiveModal('login')}>
                Đăng nhập
              </button>
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
