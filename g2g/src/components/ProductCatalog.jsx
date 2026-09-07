import React, { useState } from 'react';
import { MOCK_GAMES, MOCK_SELLERS, MOCK_REVIEWS } from '../MockData';

export default function ProductCatalog({
  currentView,
  selectedCategory,
  setSelectedCategory,
  selectedGame,
  setSelectedGame,
  selectedItem,
  setSelectedItem,
  selectedSeller,
  setSelectedSeller,
  detailQuantity,
  setDetailQuantity,
  activeDetailTab,
  setActiveDetailTab,
  brandSearchQuery,
  setBrandSearchQuery,
  activeBrandTab,
  setActiveBrandTab,
  catalogSearchQuery,
  setCatalogSearchQuery,
  catalogRegionFilter,
  setCatalogRegionFilter,
  catalogSortOption,
  setCatalogSortOption,
  pushRoute,
  navigateToCatalog,
  navigateToDetail,
  triggerToast,
  handleBuyNow,
  handleAddToCart,
  openChatWithPartner,
  handleSelectProduct,
  // Product Reviews Props
  productReviews = {},
  handleAddReview,
  currentUser,
  setActiveModal,
  // Mobile Top-up Props
  topupPhone,
  setTopupPhone,
  topupOperator,
  setTopupOperator,
  topupAmount,
  setTopupAmount,
  handleDepositToWallet,
  userWalletBalance = 0,
  sellerListings = [],
}) {
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');

  const getItemCategory = (item) => {
    if (item.category) return item.category;
    const name = item.name.toLowerCase();
    if (name.includes('code') || name.includes('thẻ') || name.includes('gift') || name.includes('card') || name.includes('sò') || name.includes('mã')) return 'cards';
    if (name.includes('acc') || name.includes('tài khoản') || name.includes('rank') || name.includes('nick')) return 'accounts';
    if (name.includes('cày') || name.includes('boosting') || name.includes('lên rank')) return 'boosting';
    if (name.includes('coaching') || name.includes('dạy') || name.includes('hướng dẫn')) return 'coaching';
    if (name.includes('gamepal') || name.includes('bạn chơi') || name.includes('chơi cùng')) return 'gamepal';
    if (name.includes('vật phẩm') || name.includes('skin') || name.includes('gold') || name.includes('items') || name.includes('gói nạp gold') || name.includes('orb')) return 'items';
    
    // Check fallback category from the game database
    if (item.gameId) {
      const matchedGame = MOCK_GAMES.find((g) => g.id === item.gameId);
      if (matchedGame && matchedGame.category) return matchedGame.category;
    }
    if (selectedGame && selectedGame.category) return selectedGame.category;
    return 'coins';
  };

  const getCategoryOffersCount = (categoryKey) => {
    if (!selectedGame) return 0;

    const sellerItemsForGame = sellerListings.filter(
      (sl) => sl.gameId === selectedGame.id
    ).map((sl) => ({
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
    }));

    const allGameItems = [
      ...sellerItemsForGame,
      ...selectedGame.items.filter(item => !sellerItemsForGame.some(sl => sl.id === item.id))
    ];

    return allGameItems
      .filter(item => getItemCategory(item) === categoryKey)
      .reduce((sum, item) => sum + (item.offers || 1), 0);
  };

  return (
    <>
      {/* Category Catalog Page View (New Category listings navigation router) */}
      {currentView === 'category-catalog' && (
        <section className="category-catalog-section">
          <div className="container">
            {/* Breadcrumbs */}
            <div className="breadcrumbs">
              <span onClick={() => pushRoute('home')}>Trang chủ</span>
              <span className="separator">&gt;</span>
              <span>Danh mục sản phẩm</span>
              <span className="separator">&gt;</span>
              <span className="active">
                {selectedCategory === 'all'
                  ? 'Tất cả sản phẩm'
                  : selectedCategory === 'coins'
                    ? 'Tiền tệ Game (Coins)'
                    : selectedCategory === 'accounts'
                      ? 'Tài khoản VIP'
                      : selectedCategory === 'cards'
                        ? 'Thẻ game / Gift Card'
                        : selectedCategory === 'boosting'
                          ? 'Cày thuê (Boosting)'
                          : selectedCategory === 'coaching'
                            ? 'Game Coaching (Beta)'
                            : selectedCategory === 'gamepal'
                              ? 'GamePal (Beta)'
                              : selectedCategory === 'items'
                                ? 'Vật phẩm game'
                                : selectedCategory === 'skin'
                                  ? 'Trang phục / Skins'
                                  : selectedCategory === 'topup'
                                    ? 'Nạp tiền điện thoại'
                                    : selectedCategory === 'software'
                                      ? 'Phần mềm & Ứng dụng'
                                      : selectedCategory === 'payment'
                                        ? 'Thẻ thanh toán'
                                        : 'Sản phẩm khác'}
              </span>
            </div>

            {/* Title Banner */}
            <div className="category-directory-banner">
              <div className="category-header-icon-box">
                {selectedCategory === 'all' && '🌐'}
                {selectedCategory === 'coins' && '🪙'}
                {selectedCategory === 'accounts' && '👤'}
                {selectedCategory === 'cards' && '💳'}
                {selectedCategory === 'boosting' && '⚡'}
                {selectedCategory === 'coaching' && '🎓'}
                {selectedCategory === 'gamepal' && '👥'}
                {selectedCategory === 'items' && '📦'}
                {selectedCategory === 'skin' && '🛡️'}
                {selectedCategory === 'topup' && '📱'}
                {selectedCategory === 'software' && '💻'}
                {selectedCategory === 'payment' && '💳'}
              </div>
              <h1 className="category-directory-title">
                {selectedCategory === 'all' && 'Trò chơi & Thương hiệu'}
                {selectedCategory === 'coins' && 'Tiền tệ game (Coins)'}
                {selectedCategory === 'accounts' && 'Tài khoản game VIP'}
                {selectedCategory === 'cards' && 'Thẻ game & Quà tặng'}
                {selectedCategory === 'boosting' && 'Cày thuê (Boosting)'}
                {selectedCategory === 'coaching' && 'Game Coaching (Beta)'}
                {selectedCategory === 'gamepal' && 'GamePal (Beta)'}
                {selectedCategory === 'items' && 'Vật phẩm game'}
                {selectedCategory === 'skin' && 'Trang phục & Skins'}
                {selectedCategory === 'topup' && 'Nạp tiền điện thoại'}
                {selectedCategory === 'software' && 'Phần mềm & Ứng dụng'}
                {selectedCategory === 'payment' && 'Thẻ thanh toán'}
              </h1>
            </div>

            {selectedCategory === 'topup' ? (
              <div className="mobile-topup-container">
                <div className="mobile-topup-card">
                  <div className="topup-card-header">
                    <h3>⚡ Nạp Tiền Vào Ví Tài Khoản</h3>
                    <p>Nạp số dư ví người mua để thanh toán trực tiếp các đơn hàng trên G2G Clone.</p>
                  </div>

                  {/* Current balance display */}
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(251,191,36,0.1) 0%, rgba(30,30,35,0.8) 100%)',
                    border: '1px solid rgba(251,191,36,0.25)',
                    borderRadius: '12px',
                    padding: '16px 20px',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '24px' }}>💰</span>
                      <div>
                        <div style={{ color: '#9ea2a9', fontSize: '12px', fontWeight: 500, marginBottom: '2px' }}>Số dư ví hiện tại</div>
                        <div style={{ color: userWalletBalance > 0 ? '#fbbf24' : '#9ea2a9', fontWeight: 800, fontSize: '20px' }}>
                          {userWalletBalance.toLocaleString('vi-VN')}₫
                        </div>
                      </div>
                    </div>
                    <div style={{
                      background: 'rgba(251,191,36,0.12)', color: '#fbbf24',
                      border: '1px solid rgba(251,191,36,0.3)',
                      borderRadius: '8px', padding: '6px 12px',
                      fontSize: '12px', fontWeight: 600
                    }}>Ví G2G</div>
                  </div>
                  
                  <div className="topup-form-group">
                    <label>Tài khoản nhận tiền:</label>
                    <input 
                      type="text" 
                      className="topup-input"
                      value={currentUser ? `${currentUser.name} (ID: ${currentUser.id || '1004154462'})` : 'Vui lòng đăng nhập'}
                      disabled
                      style={{ opacity: 0.7, cursor: 'not-allowed' }}
                    />
                  </div>

                  <div className="topup-form-group">
                    <label>Chọn phương thức nạp:</label>
                    <div className="operator-grid">
                      {[
                        { id: 'momo', label: 'VÍ MOMO' },
                        { id: 'zalopay', label: 'ZALOPAY' },
                        { id: 'banking', label: 'NGÂN HÀNG' },
                        { id: 'visa', label: 'VISA/CARD' }
                      ].map((op) => (
                        <div 
                          key={op.id}
                          className={`operator-pill ${topupOperator === op.id ? 'active' : ''}`}
                          onClick={() => setTopupOperator(op.id)}
                        >
                          <span className="operator-logo" style={{ fontSize: '11px' }}>{op.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="topup-form-group">
                    <label>Chọn số tiền nạp (VND):</label>
                    <div className="amount-grid">
                      {[50000, 100000, 200000, 500000, 1000000, 2000000].map((amt) => (
                        <div 
                          key={amt}
                          className={`amount-pill ${topupAmount === amt ? 'active' : ''}`}
                          onClick={() => setTopupAmount(amt)}
                        >
                          <span>{amt.toLocaleString('vi-VN')}₫</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="topup-summary-row justify-between">
                    <span>Tổng tiền nạp thực tế:</span>
                    <strong className="topup-final-price">
                      {topupAmount.toLocaleString('vi-VN')}đ
                    </strong>
                  </div>

                  <button 
                    className="btn btn-primary topup-submit-btn"
                    onClick={() => {
                      if (!currentUser) {
                        triggerToast('Bạn cần đăng nhập để nạp tiền!');
                        setActiveModal('login');
                        return;
                      }
                      handleDepositToWallet(topupAmount);
                    }}
                  >
                    🚀 Xác Nhận Nạp Tiền
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Search & Tabs bar matching G2G layout */}
                <div className="brand-search-tab-bar">
                  <div className="brand-search-input-wrapper">
                    <svg
                      className="search-icon-mini"
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <path d="M21 21l-4.35-4.35"></path>
                    </svg>
                    <input
                      type="text"
                      placeholder="Tìm kiếm thương hiệu..."
                      className="brand-search-input-field"
                      value={brandSearchQuery}
                      onChange={(e) => setBrandSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="brand-tabs-list">
                    <span
                      className={`brand-tab-item ${activeBrandTab === 'all' ? 'active' : ''}`}
                      onClick={() => setActiveBrandTab('all')}
                    >
                      Tất cả
                    </span>
                    <span
                      className={`brand-tab-item ${activeBrandTab === 'coins' ? 'active' : ''}`}
                      onClick={() => setActiveBrandTab('coins')}
                    >
                      Coins game
                    </span>
                    <span
                      className={`brand-tab-item ${activeBrandTab === 'accounts' ? 'active' : ''}`}
                      onClick={() => setActiveBrandTab('accounts')}
                    >
                      Tài khoản VIP
                    </span>
                    <span
                      className={`brand-tab-item ${activeBrandTab === 'cards' ? 'active' : ''}`}
                      onClick={() => setActiveBrandTab('cards')}
                    >
                      Thẻ game
                    </span>
                    <span
                      className={`brand-tab-item ${activeBrandTab === 'boosting' ? 'active' : ''}`}
                      onClick={() => setActiveBrandTab('boosting')}
                    >
                      Cày thuê
                    </span>
                  </div>
                </div>

                {/* Filtering games list — merging sellerListings items */}
                {(() => {
                  // Build enriched games list: inject sellerListings items into matching games
                  const gamesWithSellerItems = MOCK_GAMES.map((game) => {
                    const extraItems = sellerListings
                      .filter((sl) => sl.gameId === game.id)
                      .map((sl) => ({
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
                      }));
                    return {
                      ...game,
                      items: [...extraItems, ...game.items.filter(item => !extraItems.some(ei => ei.id === item.id))],
                    };
                  });

                  const filteredGames = gamesWithSellerItems.filter((game) => {
                    const hasMatchingItemCategory = game.items && game.items.some(item => {
                      const itemCat = item.category || 'coins';
                      return itemCat === selectedCategory;
                    });

                    const matchesMainCategory =
                      selectedCategory === 'all' || 
                      game.category === selectedCategory ||
                      hasMatchingItemCategory;

                    const matchesSearch = game.name
                      .toLowerCase()
                      .includes(brandSearchQuery.toLowerCase());

                    const hasSubTabItemCategory = game.items && game.items.some(item => {
                      const itemCat = item.category || 'coins';
                      return itemCat === activeBrandTab;
                    });
                    const matchesSubTab = 
                      activeBrandTab === 'all' || 
                      game.category === activeBrandTab ||
                      hasSubTabItemCategory;

                    return matchesMainCategory && matchesSearch && matchesSubTab;
                  });

                  const trendingGames = filteredGames.slice(0, 8);
                  const allGames = filteredGames;

                  if (filteredGames.length === 0) {
                    return (
                      <div className="empty-catalog-results">
                        <span className="empty-icon">📂</span>
                        <h4>Không tìm thấy thương hiệu nào!</h4>
                        <p>
                          Vui lòng nhập lại tên game hoặc thương hiệu khác trong thanh tìm kiếm bên trên.
                        </p>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setBrandSearchQuery('');
                            setActiveBrandTab('all');
                          }}
                        >
                          Đặt lại bộ lọc
                        </button>
                      </div>
                    );
                  }

                  return (
                    <>
                      {/* Xu hướng (Trending) Blocks Grid */}
                      <div className="directory-section-container">
                        <h3 className="directory-section-title">Xu Hướng</h3>
                        <div className="brand-trending-grid">
                          {trendingGames.map((game) => {
                            const totalOffers = game.items.reduce(
                              (sum, item) => sum + item.offers,
                              0
                            );
                            return (
                              <div
                                key={game.id}
                                className="brand-trending-block"
                                onClick={() => navigateToCatalog(game)}
                              >
                                <div className="brand-stripe-edge"></div>
                                <div className="brand-block-content">
                                  <h4 className="brand-block-title">{game.name}</h4>
                                  <span className="brand-offers-pill">{totalOffers} ưu đãi</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Tất cả thương hiệu (All Brands) Grid */}
                      <div className="directory-section-container" style={{ marginTop: '40px' }}>
                        <h3 className="directory-section-title">
                          Tất cả thương hiệu cho{' '}
                          {selectedCategory === 'all'
                            ? 'Trò chơi'
                            : selectedCategory === 'coins'
                              ? 'Tiền tệ Game (Coins)'
                              : selectedCategory === 'accounts'
                                ? 'Tài khoản VIP'
                                : selectedCategory === 'cards'
                                  ? 'Thẻ game / Gift Card'
                                  : selectedCategory === 'boosting'
                                    ? 'Cày thuê (Boosting)'
                                    : selectedCategory === 'coaching'
                                      ? 'Game Coaching'
                                      : selectedCategory === 'gamepal'
                                        ? 'GamePal'
                                        : selectedCategory === 'items'
                                          ? 'Vật phẩm game'
                                          : selectedCategory === 'skin'
                                            ? 'Trang phục & Skins'
                                            : selectedCategory === 'software'
                                              ? 'Phần mềm & Ứng dụng'
                                              : selectedCategory === 'payment'
                                                ? 'Thẻ thanh toán'
                                                : 'Sản phẩm khác'}
                        </h3>
                        <div className="brand-all-grid">
                          {allGames.map((game) => {
                            const totalOffers = game.items.reduce(
                              (sum, item) => sum + item.offers,
                              0
                            );
                            return (
                              <div
                                key={game.id}
                                className="brand-all-block"
                                onClick={() => navigateToCatalog(game)}
                              >
                                <span className="brand-all-name">{game.name}</span>
                                <span className="brand-all-offers">{totalOffers} ưu đãi</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </>
            )}
          </div>
        </section>
      )}

      {/* Catalog / Games Page View */}
      {currentView === 'catalog' && selectedGame && (
        <section className="catalog-section">
          <div className="container">
            {/* Breadcrumbs */}
            <div className="breadcrumbs">
              <span onClick={() => pushRoute('home')}>Trang chủ</span>
              <span className="separator">&gt;</span>
              <span>Thị trường game</span>
              <span className="separator">&gt;</span>
              <span className="active">{selectedGame.name}</span>
            </div>

            {/* Title Banner & Hero */}
            <div className="catalog-hero-row justify-between">
              <h1 className="catalog-hero-title">
                {selectedGame.name}{' '}
                {selectedCategory === 'coins'
                  ? 'Coins'
                  : selectedCategory === 'boosting'
                    ? 'Boosting'
                    : selectedCategory === 'accounts'
                      ? 'Accounts'
                      : 'Gift Cards'}
              </h1>
              <button
                className="btn btn-secondary share-btn-box"
                onClick={() => triggerToast('Đường liên kết chia sẻ đã được sao chép vào bộ nhớ tạm!')}
              >
                <span>🔗 Chia sẻ</span>
              </button>
            </div>

            {/* Circular Service Switcher Grid */}
            <div className="catalog-service-switcher-wrapper">
              <div
                className={`service-switcher-circle ${selectedCategory === 'coins' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('coins')}
              >
                <div className="service-circle-icon">🪙</div>
                <span className="service-circle-name">Xu Game</span>
                <span className="service-circle-count">({getCategoryOffersCount('coins').toLocaleString()})</span>
              </div>
              <div
                className={`service-switcher-circle ${selectedCategory === 'boosting' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('boosting')}
              >
                <div className="service-circle-icon">🔥</div>
                <span className="service-circle-name">Cày thuê</span>
                <span className="service-circle-count">({getCategoryOffersCount('boosting').toLocaleString()})</span>
              </div>
              <div
                className={`service-switcher-circle ${selectedCategory === 'cards' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('cards')}
              >
                <div className="service-circle-icon">💳</div>
                <span className="service-circle-name">Mã kích hoạt</span>
                <span className="service-circle-count">({getCategoryOffersCount('cards').toLocaleString()})</span>
              </div>
              <div
                className={`service-switcher-circle ${selectedCategory === 'coaching' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('coaching')}
              >
                <div className="service-circle-icon">🎮</div>
                <span className="service-circle-name">Coaching</span>
                <span className="service-circle-count">({getCategoryOffersCount('coaching').toLocaleString()})</span>
              </div>
              <div
                className={`service-switcher-circle ${selectedCategory === 'gamepal' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('gamepal')}
              >
                <div className="service-circle-icon">👥</div>
                <span className="service-circle-name">GamePal</span>
                <span className="service-circle-count">({getCategoryOffersCount('gamepal').toLocaleString()})</span>
              </div>
              <div
                className={`service-switcher-circle ${selectedCategory === 'items' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('items')}
              >
                <div className="service-circle-icon">📦</div>
                <span className="service-circle-name">Vật phẩm</span>
                <span className="service-circle-count">({getCategoryOffersCount('items').toLocaleString()})</span>
              </div>
              <div
                className={`service-switcher-circle ${selectedCategory === 'accounts' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('accounts')}
              >
                <div className="service-circle-icon">👤</div>
                <span className="service-circle-name">Tài khoản</span>
                <span className="service-circle-count">({getCategoryOffersCount('accounts').toLocaleString()})</span>
              </div>
            </div>

            {/* Local Search & Region filter */}
            <div className="local-catalog-filters-bar">
              <div className="local-search-input-wrapper">
                <svg
                  className="search-icon-mini"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="M21 21l-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  placeholder="Nhập để lọc"
                  className="local-search-input-field"
                  value={catalogSearchQuery}
                  onChange={(e) => setCatalogSearchQuery(e.target.value)}
                />
              </div>
              <div className="local-region-select-wrapper">
                <select
                  className="local-region-dropdown"
                  value={catalogRegionFilter}
                  onChange={(e) => setCatalogRegionFilter(e.target.value)}
                >
                  <option value="all">Khu vực (Tất cả)</option>
                  <option value="Vietnam">Vietnam</option>
                  <option value="Global">Global</option>
                </select>
              </div>
            </div>

            {/* Popular orange tags */}
            <div className="popular-tags-row">
              <span className="popular-tags-label">Tìm kiếm phổ biến:</span>
              <span className="popular-tag-chip" onClick={() => setCatalogSearchQuery('game time')}>
                game time
              </span>
              <span
                className="popular-tag-chip"
                onClick={() => setCatalogSearchQuery(selectedGame.name.toLowerCase())}
              >
                {selectedGame.name.toLowerCase()}
              </span>
              <span className="popular-tag-chip" onClick={() => setCatalogSearchQuery('midnight')}>
                midnight
              </span>
              <span className="popular-tag-chip" onClick={() => setCatalogSearchQuery('time')}>
                time
              </span>
              <span className="popular-tag-chip" onClick={() => setCatalogSearchQuery('gold')}>
                gold
              </span>
            </div>

            {/* Packages Lists & Sorting */}
            {(() => {
              // Merge sellerListings for this game into items for buyer view
              const sellerItemsForGame = sellerListings.filter(
                (sl) => sl.gameId === selectedGame.id
              ).map((sl) => ({
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
              }));

              const allItems = [
                ...sellerItemsForGame,
                ...selectedGame.items.filter(item => !sellerItemsForGame.some(sl => sl.id === item.id)),
              ];

              const filteredCatalogItems = allItems.filter((item) => {
                const itemCategory = getItemCategory(item);
                const matchesCategory = !selectedCategory || selectedCategory === 'all' || itemCategory === selectedCategory;

                const matchesSearch = item.name
                  .toLowerCase()
                  .includes(catalogSearchQuery.toLowerCase());
                const matchesRegion =
                  catalogRegionFilter === 'all' ||
                  item.region.toLowerCase() === catalogRegionFilter.toLowerCase();
                return matchesCategory && matchesSearch && matchesRegion;
              });

              const sortedCatalogItems = [...filteredCatalogItems].sort((a, b) => {
                if (catalogSortOption === 'cheapest') {
                  return a.price - b.price;
                }
                return b.offers - a.offers;
              });

              return (
                <>
                  <div className="catalog-results-header justify-between">
                    <span className="results-count-label">
                      Khoảng {sortedCatalogItems.length} kết quả
                    </span>
                    <div className="sort-radio-group">
                      <span className="sort-label">Sắp xếp theo:</span>
                      <label className="sort-radio-label">
                        <input
                          type="radio"
                          name="catalogSort"
                          value="recommended"
                          checked={catalogSortOption === 'recommended'}
                          onChange={() => setCatalogSortOption('recommended')}
                        />
                        <span className="radio-custom"></span>
                        <span>Được đề xuất</span>
                      </label>
                      <label className="sort-radio-label">
                        <input
                          type="radio"
                          name="catalogSort"
                          value="cheapest"
                          checked={catalogSortOption === 'cheapest'}
                          onChange={() => setCatalogSortOption('cheapest')}
                        />
                        <span className="radio-custom"></span>
                        <span>Giá thấp nhất</span>
                      </label>
                    </div>
                  </div>

                  {sortedCatalogItems.length > 0 ? (
                    <div className="catalog-packages-grid">
                      {sortedCatalogItems.map((item) => (
                        <div
                          key={item.id}
                          className="catalog-package-card"
                          onClick={() => {
                            if (item.isSellerListing) {
                              navigateToDetail(selectedGame, item, {
                                name: item.sellerName || 'Người Bán',
                                rating: '5.0',
                                reviews: 1,
                                successRate: '100%',
                                multiplier: 1
                              });
                            } else {
                              navigateToDetail(selectedGame, item);
                            }
                          }}
                          style={item.isSellerListing ? { border: '1px solid rgba(251,191,36,0.35)', boxShadow: '0 0 0 1px rgba(251,191,36,0.1) inset' } : {}}
                        >
                          <div className="package-region-row">
                            <span className="package-region-flag">
                              {item.region === 'Vietnam'
                                ? '🇻🇳'
                                : item.region === 'Global'
                                  ? '🌐'
                                  : '🇺🇸'}
                            </span>
                            <span className="package-region-name">{item.region}</span>
                            {item.isSellerListing && (
                              <span style={{
                                marginLeft: 'auto',
                                background: 'rgba(251,191,36,0.15)',
                                color: '#fbbf24',
                                border: '1px solid rgba(251,191,36,0.3)',
                                borderRadius: '4px',
                                padding: '1px 6px',
                                fontSize: '10px',
                                fontWeight: 700,
                              }}>🆕 Mới</span>
                            )}
                          </div>
                          <h4 className="package-card-title">{item.name}</h4>
                          {item.isSellerListing && item.sellerName && (
                            <div style={{ fontSize: '11px', color: '#9ea2a9', marginBottom: '4px' }}>
                              👤 {item.sellerName}
                            </div>
                          )}
                          <div className="package-card-footer justify-between">
                            <span className="package-offers-badge">{item.offers} ưu đãi</span>
                            <span className="package-price-text">
                              từ {item.price.toLocaleString('vi-VN')}₫
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-catalog-results">
                      <span className="empty-icon">📂</span>
                      <h4>Không tìm thấy kết quả phù hợp!</h4>
                      <p>Vui lòng nhập lại tên gói nạp hoặc từ khóa lọc khác.</p>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setCatalogSearchQuery('');
                          setCatalogRegionFilter('all');
                        }}
                      >
                        Đặt lại bộ lọc
                      </button>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </section>
      )}

      {/* Product offer details page */}
      {currentView === 'product-detail' && selectedGame && selectedItem && (
        <section className="product-detail-section">
          <div className="container">
            {/* Breadcrumbs */}
            <div className="breadcrumbs">
              <span onClick={() => pushRoute('home')}>Trang chủ</span>
              <span className="separator">&gt;</span>
              <span onClick={() => navigateToCatalog(selectedGame)}>{selectedGame.name}</span>
              <span className="separator">&gt;</span>
              <span className="active">{selectedItem.name}</span>
            </div>

            <div className="product-detail-grid">
              {/* Left Column: Denominations Pickers & Desc */}
              <div className="product-left-col">
                {/* Selected Item Card Header */}
                <div className="selected-item-display">
                  <div className="item-gradient-banner" style={{ background: selectedGame.color }}>
                    <span className="item-logo-text">{selectedGame.textIcon}</span>
                  </div>
                  <div className="item-display-info">
                    <span className="badge badge-success">{selectedItem.badge}</span>
                    <h1 className="item-display-title">{selectedItem.name}</h1>
                    <div className="item-meta-tags">
                      <span>
                        Khu vực: <strong>{selectedItem.region}</strong>
                      </span>
                      <span className="bullet">•</span>
                      <span>
                        Hình thức: <strong>Tự động gửi/Bàn giao ngay</strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Switch Denomination Section */}
                <div className="denom-selector-container">
                  <h4 className="container-title">Chọn các mệnh giá / gói dịch vụ khác</h4>
                  <div className="denom-pill-grid">
                    {(() => {
                      const sellerItemsForGame = sellerListings.filter(
                        (sl) => sl.gameId === selectedGame.id
                      ).map((sl) => ({
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
                      }));
                      const allGameItems = [
                        ...sellerItemsForGame,
                        ...selectedGame.items.filter(item => !sellerItemsForGame.some(sl => sl.id === item.id))
                      ];
                      return allGameItems.map((item) => (
                        <div
                          key={item.id}
                          className={`denom-pill ${selectedItem.id === item.id ? 'active' : ''}`}
                          onClick={() => {
                            if (item.isSellerListing) {
                              navigateToDetail(selectedGame, item, {
                                name: item.sellerName || 'Người Bán',
                                rating: '5.0',
                                reviews: 1,
                                successRate: '100%',
                                multiplier: 1
                              });
                            } else {
                              navigateToDetail(selectedGame, item);
                            }
                          }}
                        >
                          <div className="pill-name">{item.name}</div>
                          <div className="pill-price">{item.price.toLocaleString('vi-VN')}₫</div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                {/* Product Details Tabs (Description & Customer Reviews) */}
                <div className="detail-tabs-wrapper">
                  <div className="detail-tabs-header">
                    <span
                      className={`tab-item-link ${activeDetailTab === 'description' ? 'active' : ''
                        }`}
                      onClick={() => setActiveDetailTab('description')}
                    >
                      Mô tả sản phẩm
                    </span>
                    <span
                      className={`tab-item-link ${activeDetailTab === 'reviews' ? 'active' : ''}`}
                      onClick={() => setActiveDetailTab('reviews')}
                    >
                      Đánh giá người mua (5★)
                    </span>
                  </div>

                  <div className="detail-tab-pane">
                    {activeDetailTab === 'description' ? (
                      <div className="desc-content">
                        <p>
                          Chào mừng bạn đến với đại lý phân phối chính thức của chúng tôi trên G2G
                          Marketplace. Dưới đây là các thông tin quan trọng bạn cần nắm rõ:
                        </p>
                        <ul>
                          <li>
                            <strong>Bàn giao tự động:</strong> Sản phẩm được gửi trực tiếp qua hệ
                            thống tin nhắn hoặc email liên kết của bạn ngay sau khi hoàn tất thanh
                            toán.
                          </li>
                          <li>
                            <strong>Bảo hành GamerProtect:</strong> Bảo hiểm hoàn trả 100% số tiền
                            nếu mã thẻ có lỗi hoặc tài khoản có vấn đề tranh chấp do lỗi từ người
                            bán trong vòng 7 ngày.
                          </li>
                          <li>
                            <strong>Lưu ý:</strong> Vui lòng không tiết lộ thông tin mã nạp, mã OTP
                            hoặc thông tin mật khẩu tài khoản cho bất kỳ ai khác ngoại trừ biểu mẫu
                            giao dịch chính thức.
                          </li>
                        </ul>
                      </div>
                                        ) : (() => {
                      const reviews = productReviews[selectedItem.id] || [];
                      const averageScore = reviews.length > 0
                        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                        : '5.0';
                      const positiveRate = reviews.length > 0
                        ? ((reviews.filter(r => r.rating >= 4).length / reviews.length) * 100).toFixed(1)
                        : '100';

                      return (
                        <div className="reviews-tab-pane">
                          {/* Score Summary */}
                          <div className="reviews-summary-score justify-between">
                            <div>
                              <div className="score-value">{averageScore} / 5</div>
                              <div className="stars-row">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <span key={i} className="star-icon" style={{ color: i < Math.round(averageScore) ? '#f0a000' : '#4a4d52' }}>★</span>
                                ))}
                              </div>
                              <span className="reviews-count-label">
                                Phản hồi tích cực đạt {positiveRate}% ({reviews.length} đánh giá)
                              </span>
                            </div>
                            <div className="reviews-recommend">
                              🚀 <strong>Đánh giá thực tế:</strong> {reviews.length > 0 ? `99% người mua đề xuất sản phẩm này dựa trên ${reviews.length} đánh giá thật từ khách hàng.` : 'Sản phẩm chưa có đánh giá. Hãy là người đầu tiên mua và nhận xét!'}
                            </div>
                          </div>

                          {/* Write a review form (Only if logged in) */}
                          <div className="write-review-card">
                            <h4 className="write-review-title">Viết đánh giá của bạn</h4>
                            {currentUser ? (
                              <form onSubmit={(e) => {
                                e.preventDefault();
                                if (!newComment.trim()) return;
                                handleAddReview(selectedItem.id, newRating, newComment);
                                setNewComment('');
                                setNewRating(5);
                              }} className="review-form">
                                <div className="rating-select-row">
                                  <span>Chọn số sao:</span>
                                  <div className="rating-stars-input">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <span
                                        key={star}
                                        className="star-clickable-icon"
                                        style={{ color: star <= newRating ? '#f0a000' : '#72767d', cursor: 'pointer', fontSize: '20px', marginRight: '4px' }}
                                        onClick={() => setNewRating(star)}
                                      >
                                        ★
                                      </span>
                                    ))}
                                  </div>
                                </div>
                                <div className="review-textarea-group">
                                  <textarea
                                    className="review-form-textarea"
                                    rows="3"
                                    placeholder="Chia sẻ trải nghiệm mua hàng của bạn tại đây..."
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    required
                                  ></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: '10px', alignSelf: 'flex-start' }}>
                                  Gửi đánh giá
                                </button>
                              </form>
                            ) : (
                              <div className="review-login-prompt">
                                🔒 Bạn cần <span className="login-link-inline" onClick={() => setActiveModal('login')} style={{ color: 'var(--brand-red)', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}>Đăng nhập</span> để gửi đánh giá sản phẩm.
                              </div>
                            )}
                          </div>

                          {/* Reviews List */}
                          <div className="buyer-reviews-list">
                            {reviews.length === 0 ? (
                              <div style={{ textAlign: 'center', padding: '30px 0', color: '#72767d', fontSize: '13.5px' }}>
                                Chưa có đánh giá nào cho gói sản phẩm này.
                              </div>
                            ) : (
                              reviews.map((rev) => (
                                <div key={rev.id} className="review-item">
                                  <div className="review-item-header justify-between">
                                    <div className="buyer-profile">
                                      <span className="avatar-letter">
                                        {rev.user.slice(0, 2).toUpperCase()}
                                      </span>
                                      <div>
                                        <span className="buyer-name">{rev.user}</span>
                                        <div className="buyer-rating-stars">
                                          {Array.from({ length: 5 }).map((_, i) => (
                                            <span key={i} className="star-icon" style={{ color: i < rev.rating ? '#f0a000' : '#4a4d52' }}>
                                              ★
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                    <span className="review-date">{rev.date}</span>
                                  </div>
                                  <p className="review-comment">{rev.comment}</p>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Right Column: Console purchase card */}
              <div className="product-right-col">
                <div className="purchase-console-card">
                  {/* Seller Short Card */}
                  <div className="seller-box-summary">
                    <div className="seller-box-avatar">
                      {selectedSeller.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="seller-box-info">
                      <div className="seller-box-name">
                        {selectedSeller.name}
                        <span className="online-dot active" title="Online"></span>
                      </div>
                      <div className="seller-box-rating">
                        <span className="star-icon">★</span>
                        <strong>{selectedSeller.rating}</strong>
                        <span className="reviews-count">
                          ({selectedSeller.reviews.toLocaleString()} reviews)
                        </span>
                      </div>
                      <div className="seller-badges">
                        <span className="badge-level">LV.99</span>
                        <span className="badge-rate">{selectedSeller.successRate} thành công</span>
                      </div>
                    </div>
                  </div>

                  <div className="console-divider"></div>

                  {/* Price & Quantity inputs */}
                  <div className="console-price-row">
                    <span className="console-price-label">Đơn giá:</span>
                    <span className="console-price-value">
                      {Math.floor(selectedItem.price * selectedSeller.multiplier).toLocaleString(
                        'vi-VN'
                      )}
                      ₫
                    </span>
                  </div>

                  <div className="console-qty-row">
                    <span className="console-qty-label">Số lượng mua:</span>
                    <div className="qty-picker">
                      <button
                        className="qty-btn"
                        onClick={() => setDetailQuantity((prev) => Math.max(1, prev - 1))}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        className="qty-input"
                        value={detailQuantity}
                        onChange={(e) =>
                          setDetailQuantity(Math.max(1, parseInt(e.target.value) || 1))
                        }
                      />
                      <button
                        className="qty-btn"
                        onClick={() => setDetailQuantity((prev) => prev + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="console-divider"></div>

                  <div className="console-total-row">
                    <span>Tổng chi phí:</span>
                    <span className="total-value">
                      {(
                        Math.floor(selectedItem.price * selectedSeller.multiplier) * detailQuantity
                      ).toLocaleString('vi-VN')}
                      ₫
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div className="console-actions">
                    <button
                      className="btn btn-primary"
                      style={{ flex: 1, borderRadius: '8px', padding: '14px' }}
                      onClick={() =>
                        handleBuyNow(selectedItem, selectedGame, selectedSeller, detailQuantity)
                      }
                    >
                      Mua Ngay
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={{ borderRadius: '8px', padding: '14px' }}
                      onClick={() =>
                        handleAddToCart(selectedItem, selectedGame, selectedSeller, detailQuantity)
                      }
                      title="Thêm vào giỏ hàng"
                    >
                      <svg
                        width="20"
                        height="20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z"></path>
                        <path d="M3 6h18M16 10a4 4 0 0 1-8 0"></path>
                      </svg>
                    </button>
                  </div>

                  {/* Chat with seller directly */}
                  <button
                    className="btn btn-outline"
                    style={{
                      width: '100%',
                      marginTop: '12px',
                      borderRadius: '8px',
                      padding: '10px',
                      fontSize: '13px',
                    }}
                    onClick={() => openChatWithPartner(selectedSeller.name, selectedGame.name)}
                  >
                    Chat với người bán
                  </button>
                </div>

                {/* Trust check list */}
                <div className="gamerprotect-widget">
                  <div className="gp-widget-header">
                    <span className="gp-shield-icon">🛡️</span>
                    <strong>Bảo vệ giao dịch GamerProtect</strong>
                  </div>
                  <ul className="gp-widget-list">
                    <li>Hệ thống ký quỹ giữ tiền an toàn cho đến khi xác nhận đã nhận sản phẩm sạch.</li>
                    <li>Trọng tài hỗ trợ giải quyết tranh chấp 24/7 trực quan.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
