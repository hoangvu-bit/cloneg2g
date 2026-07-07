import React from 'react';
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
}) {
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
                  : 'Cày thuê (Boosting)'}
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
              </div>
              <h1 className="category-directory-title">
                {selectedCategory === 'all' && 'Trò chơi & Thương hiệu'}
                {selectedCategory === 'coins' && 'Tiền tệ game (Coins)'}
                {selectedCategory === 'accounts' && 'Tài khoản game VIP'}
                {selectedCategory === 'cards' && 'Thẻ game & Quà tặng'}
                {selectedCategory === 'boosting' && 'Cày thuê (Boosting)'}
              </h1>
            </div>

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

            {/* Filtering games list */}
            {(() => {
              const filteredGames = MOCK_GAMES.filter((game) => {
                const matchesMainCategory =
                  selectedCategory === 'all' || game.category === selectedCategory;
                const matchesSearch = game.name
                  .toLowerCase()
                  .includes(brandSearchQuery.toLowerCase());
                const matchesSubTab = activeBrandTab === 'all' || game.category === activeBrandTab;
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
                        : 'Cày thuê (Boosting)'}
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
                <span className="service-circle-count">(51,041)</span>
              </div>
              <div
                className={`service-switcher-circle ${selectedCategory === 'boosting' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('boosting')}
              >
                <div className="service-circle-icon">🔥</div>
                <span className="service-circle-name">Cày thuê</span>
                <span className="service-circle-count">(36,528)</span>
              </div>
              <div
                className={`service-switcher-circle ${selectedCategory === 'cards' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('cards')}
              >
                <div className="service-circle-icon">💳</div>
                <span className="service-circle-name">Mã kích hoạt</span>
                <span className="service-circle-count">(28)</span>
              </div>
              <div
                className={`service-switcher-circle ${selectedCategory === 'coaching' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('coaching')}
              >
                <div className="service-circle-icon">🎮</div>
                <span className="service-circle-name">Coaching</span>
                <span className="service-circle-count">(16)</span>
              </div>
              <div
                className={`service-switcher-circle ${selectedCategory === 'gamepal' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('gamepal')}
              >
                <div className="service-circle-icon">👥</div>
                <span className="service-circle-name">GamePal</span>
                <span className="service-circle-count">(10)</span>
              </div>
              <div
                className={`service-switcher-circle ${selectedCategory === 'items' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('items')}
              >
                <div className="service-circle-icon">📦</div>
                <span className="service-circle-name">Vật phẩm</span>
                <span className="service-circle-count">(16,746)</span>
              </div>
              <div
                className={`service-switcher-circle ${selectedCategory === 'accounts' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('accounts')}
              >
                <div className="service-circle-icon">👤</div>
                <span className="service-circle-name">Tài khoản</span>
                <span className="service-circle-count">(2,272)</span>
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
              const filteredCatalogItems = selectedGame.items.filter((item) => {
                const matchesSearch = item.name
                  .toLowerCase()
                  .includes(catalogSearchQuery.toLowerCase());
                const matchesRegion =
                  catalogRegionFilter === 'all' ||
                  item.region.toLowerCase() === catalogRegionFilter.toLowerCase();
                return matchesSearch && matchesRegion;
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
                          onClick={() => navigateToDetail(selectedGame, item)}
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
                          </div>
                          <h4 className="package-card-title">{item.name}</h4>
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
                    {selectedGame.items.map((item) => (
                      <div
                        key={item.id}
                        className={`denom-pill ${selectedItem.id === item.id ? 'active' : ''}`}
                        onClick={() => navigateToDetail(selectedGame, item, selectedSeller)}
                      >
                        <div className="pill-name">{item.name}</div>
                        <div className="pill-price">{item.price.toLocaleString('vi-VN')}₫</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Product Details Tabs (Description & Customer Reviews) */}
                <div className="detail-tabs-wrapper">
                  <div className="detail-tabs-header">
                    <span
                      className={`tab-item-link ${
                        activeDetailTab === 'description' ? 'active' : ''
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
                    ) : (
                      <div className="reviews-tab-pane">
                        <div className="reviews-summary-score justify-between">
                          <div>
                            <div className="score-value">4.9 / 5</div>
                            <div className="stars-row">
                              <span className="star-icon">★</span>
                              <span className="star-icon">★</span>
                              <span className="star-icon">★</span>
                              <span className="star-icon">★</span>
                              <span className="star-icon">★</span>
                            </div>
                            <span className="reviews-count-label">
                              Phản hồi tích cực đạt 99.8% từ khách hàng
                            </span>
                          </div>
                          <div className="reviews-recommend">
                            🚀 <strong>Khuyên dùng:</strong> 99% khách hàng rất hài lòng về tốc độ
                            bàn giao của người bán này.
                          </div>
                        </div>

                        <div className="buyer-reviews-list">
                          {MOCK_REVIEWS.map((rev) => (
                            <div key={rev.id} className="review-item">
                              <div className="review-item-header justify-between">
                                <div className="buyer-profile">
                                  <span className="avatar-letter">
                                    {rev.user.slice(0, 2).toUpperCase()}
                                  </span>
                                  <div>
                                    <span className="buyer-name">{rev.user}</span>
                                    <div className="buyer-rating-stars">
                                      {Array.from({ length: rev.rating }).map((_, i) => (
                                        <span key={i} className="star-icon">
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
                          ))}
                        </div>
                      </div>
                    )}
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

            {/* Bottom compare other sellers table */}
            <div className="sellers-compare-box">
              <h3 className="section-title">So sánh giá và ưu đãi từ các người bán khác</h3>
              <div className="compare-table-wrapper">
                <table className="compare-table">
                  <thead>
                    <tr>
                      <th>Người bán</th>
                      <th>Tỷ lệ thành công</th>
                      <th>Tốc độ giao hàng</th>
                      <th>Kho hàng</th>
                      <th>Đơn giá</th>
                      <th style={{ textAlign: 'right' }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_SELLERS.map((seller) => (
                      <tr
                        key={seller.id}
                        className={selectedSeller.id === seller.id ? 'active-row' : ''}
                      >
                        <td>
                          <div className="compare-seller-info">
                            <span className="compare-seller-avatar">
                              {seller.name.slice(0, 2).toUpperCase()}
                            </span>
                            <div>
                              <div
                                className="compare-seller-name"
                                onClick={() => setSelectedSeller(seller)}
                              >
                                {seller.name}
                              </div>
                              <div className="compare-seller-rating">
                                <span className="star-icon">★</span>
                                <span>{seller.rating}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="text-success">{seller.successRate}</span>
                        </td>
                        <td>
                          <span>{seller.speed}</span>
                        </td>
                        <td>
                          <span>{seller.stock} sản phẩm</span>
                        </td>
                        <td>
                          <span className="compare-price-val">
                            {Math.floor(selectedItem.price * seller.multiplier).toLocaleString(
                              'vi-VN'
                            )}
                            ₫
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              className="btn btn-secondary btn-sm"
                              style={{ borderRadius: '6px' }}
                              onClick={() => handleAddToCart(selectedItem, selectedGame, seller, 1)}
                            >
                              + Giỏ
                            </button>
                            <button
                              className="btn btn-primary btn-sm"
                              style={{ borderRadius: '6px', background: 'var(--brand-red)' }}
                              onClick={() => handleBuyNow(selectedItem, selectedGame, seller, 1)}
                            >
                              Mua
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
