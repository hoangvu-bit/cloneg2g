import React from 'react';
import { 
  MOCK_GAMES, 
  COACHING_PARTNERS, 
  GAMEPAL_AVATARS, 
  FLASH_SALE_ITEMS, 
  TRENDING_BLOCKS 
} from '../MockData';

export default function HomeViews({
  searchQuery,
  setSearchQuery,
  setSearchFocused,
  activeCategory,
  setActiveCategory,
  activeTab,
  setActiveTab,
  navigateToCategory,
  navigateToCatalog,
  navigateToDetail,
  triggerToast,
  formattedClock,
  openChatWithPartner,
  handleTrendingCardClick,
}) {
  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-grid-pattern"></div>
        <div className="hero-glow"></div>
        <div className="container hero-container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="hero-left-content">
            <h1 className="hero-title">
              Nơi game thủ <span>giao dịch tự tin</span>
            </h1>
            <p className="hero-subtitle">
              Mua. Bán. Nâng cấp. Thị trường trò chơi tất cả trong một với bảo vệ tích hợp.
            </p>

            <div className="hero-search-wrapper">
              <div className="hero-search-bar">
                <input
                  type="text"
                  placeholder="Tìm kiếm trong G2G"
                  className="hero-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                />
                <button className="hero-search-btn-circle" aria-label="Tìm kiếm">
                  <svg
                    width="20"
                    height="20"
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

              {/* Trust Badges */}
              <div className="hero-trust-badges">
                <span className="trust-badge-item">
                  <span className="badge-icon">🛡️</span> GamerProtect
                </span>
                <span className="trust-badge-item">
                  <span className="badge-icon">✔️</span> Hơn 35 triệu giao dịch thành công
                </span>
                <span className="trust-badge-item">
                  <span className="badge-icon">💬</span> Hỗ trợ 24/7
                </span>
              </div>
            </div>
          </div>

          <div className="hero-right-mascot">
            <img src="/src/assets/hero.png" alt="G2G Mascot" className="hero-mascot-img" />
          </div>
        </div>

        {/* Disclaimer container bottom strip */}
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <p className="g2g-disclaimer-text">
            Tuyên bố từ chối trách nhiệm: Chúng tôi là một thị trường độc lập và không liên kết và/hoặc được phê duyệt bởi bất kỳ nhà phát triển hoặc studio trò chơi nào.
          </p>
        </div>
      </section>

      {/* Select categories G2G grid shortcut */}
      <section className="categories-section" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
        <div className="container">
          <h2 className="g2g-category-heading">Chọn danh mục</h2>

          <div className="g2g-category-grid">
            {/* Row 1: Large Vertical Cards */}
            <div className="g2g-category-large-card" onClick={() => navigateToCategory('cards')}>
              <div className="category-large-icon">
                <svg
                  width="44"
                  height="44"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                  <line x1="2" y1="10" x2="22" y2="10"></line>
                  <path d="M6 14h2M12 14h4"></path>
                </svg>
              </div>
              <span className="category-large-name">Thẻ quà tặng</span>
            </div>

            <div className="g2g-category-large-card" onClick={() => navigateToCategory('all')}>
              <div className="category-large-icon">
                <svg
                  width="44"
                  height="44"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1"></rect>
                  <circle cx="17.5" cy="6.5" r="3.5"></circle>
                  <polygon points="12,17 17.5,14 17.5,20"></polygon>
                  <rect x="3" y="14" width="7" height="7" rx="1"></rect>
                </svg>
              </div>
              <span className="category-large-name">Trò chơi</span>
            </div>

            <div
              className="g2g-category-large-card"
              onClick={() => triggerToast('Dịch vụ Game Coaching sẽ được ra mắt sớm!')}
            >
              <span className="category-beta-badge">Beta</span>
              <div className="category-large-icon">
                <svg
                  width="44"
                  height="44"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <rect x="2" y="6" width="20" height="12" rx="3"></rect>
                  <circle cx="6.5" cy="12" r="1.5"></circle>
                  <circle cx="9.5" cy="12" r="1.5"></circle>
                  <line x1="14" y1="12" x2="16" y2="12"></line>
                  <line x1="15" y1="11" x2="15" y2="13"></line>
                </svg>
              </div>
              <span className="category-large-name">Game Coaching</span>
            </div>

            <div
              className="g2g-category-large-card"
              onClick={() => triggerToast('Khám phá các đại sứ GamePal ở mục bên dưới!')}
            >
              <span className="category-beta-badge">Beta</span>
              <div className="category-large-icon">
                <svg
                  width="44"
                  height="44"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <span className="category-large-name">GamePal</span>
            </div>

            {/* Row 2: Smaller Horizontal Cards */}
            <div className="g2g-category-horizontal-card" onClick={() => navigateToCategory('coins')}>
              <div className="category-horiz-icon">🪙</div>
              <span className="category-horiz-name">Xu Game</span>
            </div>

            <div
              className="g2g-category-horizontal-card"
              onClick={() => triggerToast('Dịch vụ nạp Vật phẩm đang chuẩn bị cập nhật!')}
            >
              <div className="category-horiz-icon">📦</div>
              <span className="category-horiz-name">Vật phẩm</span>
            </div>

            <div className="g2g-category-horizontal-card" onClick={() => navigateToCategory('accounts')}>
              <div className="category-horiz-icon">👤</div>
              <span className="category-horiz-name">Tài khoản Game</span>
            </div>

            <div className="g2g-category-horizontal-card" onClick={() => navigateToCategory('boosting')}>
              <div className="category-horiz-icon">🔥</div>
              <span className="category-horiz-name">Cày thuê</span>
            </div>

            {/* Row 3: Smaller Horizontal Cards */}
            <div
              className="g2g-category-horizontal-card"
              onClick={() => triggerToast('Thị trường trang phục/Skin đang bảo trì!')}
            >
              <div className="category-horiz-icon">🛡️</div>
              <span className="category-horiz-name">Skin</span>
            </div>

            <div
              className="g2g-category-horizontal-card"
              onClick={() => triggerToast('Dịch vụ Nạp tiền điện thoại đang liên kết nhà mạng!')}
            >
              <div className="category-horiz-icon">📱</div>
              <span className="category-horiz-name">Nạp tiền điện thoại</span>
            </div>

            <div
              className="g2g-category-horizontal-card"
              onClick={() => triggerToast('Thị trường bản quyền phần mềm đang liên kết!')}
            >
              <div className="category-horiz-icon">💻</div>
              <span className="category-horiz-name">Phần mềm &amp; Ứng dụng</span>
            </div>

            <div
              className="g2g-category-horizontal-card"
              onClick={() =>
                triggerToast('Các gói nạp thẻ thanh toán visa/mastercard đang cập nhật!')
              }
            >
              <div className="category-horiz-icon">💳</div>
              <span className="category-horiz-name">Thẻ thanh toán</span>
            </div>
          </div>
        </div>
      </section>

      {/* Flash Sales Section */}
      <section className="flash-sale-section">
        <div className="container">
          <div className="flash-sale-header justify-between">
            <div className="flex-center" style={{ gap: '16px' }}>
              <h2 className="flash-sale-title">⚡ DEAL CHỚP NHOÁNG (FLASH SALE)</h2>
              <div className="countdown-timer-box">
                <span className="time-digit">{formattedClock.hours}</span>
                <span className="time-colon">:</span>
                <span className="time-digit">{formattedClock.minutes}</span>
                <span className="time-colon">:</span>
                <span className="time-digit">{formattedClock.seconds}</span>
              </div>
            </div>
            <span className="flash-sale-subtitle">Thời gian có hạn - Số lượng có hạn</span>
          </div>

          <div className="flash-sale-grid">
            {FLASH_SALE_ITEMS.map((item) => {
              const gameObj = MOCK_GAMES.find((g) => g.id === item.gameId);
              const itemObj = gameObj?.items.find((i) => i.id === item.itemId);
              const percentSold = Math.floor(
                ((item.totalStock - item.stockLeft) / item.totalStock) * 100
              );

              return (
                <div
                  key={item.id}
                  className="flash-card"
                  onClick={() => navigateToDetail(gameObj, itemObj)}
                >
                  <div className="flash-card-badge">{item.badge}</div>
                  <div className="flash-image-wrapper" style={{ background: item.color }}>
                    <span className="flash-logo-text">{item.textIcon}</span>
                  </div>
                  <div className="flash-info">
                    <h4 className="flash-item-name">{item.name}</h4>
                    <div className="flash-price-row">
                      <span className="original-price">
                        {item.originalPrice.toLocaleString('vi-VN')}₫
                      </span>
                      <span className="sale-price">
                        {item.salePrice.toLocaleString('vi-VN')}₫
                      </span>
                    </div>

                    <div className="flash-stock-progress">
                      <div className="progress-bar-container">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${percentSold}%` }}
                        ></div>
                      </div>
                      <div className="progress-text-row justify-between">
                        <span>
                          Đã bán: <strong>{percentSold}%</strong>
                        </span>
                        <span>
                          Còn lại:{' '}
                          <strong style={{ color: 'var(--brand-red)' }}>
                            {item.stockLeft} thẻ
                          </strong>
                        </span>
                      </div>
                    </div>

                    <button
                      className="btn btn-primary btn-sm flash-buy-btn"
                      style={{ width: '100%' }}
                    >
                      Giật Deal Ngay
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trò chơi hay, Công ty tuyệt vời Title Banner */}
      <div className="container" style={{ marginTop: '48px', marginBottom: '-24px' }}>
        <div className="coaching-gamepal-main-heading">Trò chơi hay, Công ty tuyệt vời</div>
      </div>

      {/* Redesigned Game Coaching & GamePal Section */}
      <section className="coaching-gamepal-banner-section">
        <div className="coaching-gamepal-banner-overlay"></div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          {/* Game Coaching Row */}
          <div className="coaching-row-wrapper">
            <div className="coaching-header-row justify-between">
              <div className="coaching-header-left">
                <h3 className="coaching-section-title">
                  Game Coaching <span className="beta-badge-small">Beta</span>
                </h3>
                <p className="coaching-section-subtitle">
                  Muốn trở nên giỏi hơn? Đặt huấn luyện viên chuyên gia để phân tích lối chơi của bạn
                  và mở khóa tiềm năng thực sự của bạn.
                </p>
              </div>
              <span
                className="explore-all-link"
                onClick={() =>
                  triggerToast(
                    'Dịch vụ Game Coaching sẽ ra mắt danh sách đầy đủ huấn luyện viên sớm!'
                  )
                }
              >
                Khám phá tất cả <span className="arrow">&gt;</span>
              </span>
            </div>

            <div className="coaching-circle-grid">
              {COACHING_PARTNERS.map((coach) => (
                <div
                  key={coach.id}
                  className="coaching-circle-item"
                  onClick={() => openChatWithPartner(coach.name, 'Coaching')}
                >
                  <div className="coaching-avatar-wrapper">
                    <img
                      src={coach.avatarImage}
                      alt={coach.name}
                      className="coaching-avatar-img"
                    />
                    {coach.online && <span className="coaching-online-dot"></span>}
                  </div>
                  <span className="coaching-profile-name">{coach.name}</span>
                  {coach.tiktok && (
                    <div className="tiktok-icon-badge">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.99-1.72-.08-.07-.17-.17-.25-.25v6.07c-.11 1.98-.82 3.99-2.22 5.39-1.4 1.4-3.4 2.11-5.38 2.22-1.98-.11-3.97-.82-5.37-2.22-1.4-1.4-2.11-3.39-2.22-5.38.11-1.98.82-3.97 2.22-5.37 1.4-1.4 3.39-2.11 5.38-2.22v4.03c-.99.11-1.99.52-2.69 1.22-.7.7-1.11 1.7-1.22 2.69.11.99.52 1.99 1.22 2.69.7.7 1.7 1.11 2.69 1.22.99-.11 1.99-.52 2.69-1.22.7-.7 1.11-1.7 1.22-2.69V0h-.03z" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* GamePal Row */}
          <div className="coaching-row-wrapper" style={{ marginTop: '48px' }}>
            <div className="coaching-header-row justify-between">
              <div className="coaching-header-left">
                <h3 className="coaching-section-title">
                  GamePal <span className="beta-badge-small">Beta</span>
                </h3>
                <p className="coaching-section-subtitle">
                  Chỉ muốn có thời gian vui vẻ? Hợp tác với GamePal đã được xác minh để có trải
                  nghiệm chơi game tuyệt vời, không áp lực.
                </p>
              </div>
              <span
                className="explore-all-link"
                onClick={() => triggerToast('Dịch vụ GamePal sẽ mở rộng danh sách đại sứ sớm!')}
              >
                Khám phá tất cả <span className="arrow">&gt;</span>
              </span>
            </div>

            <div className="coaching-circle-grid">
              {GAMEPAL_AVATARS.map((pal) => (
                <div
                  key={pal.id}
                  className="coaching-circle-item"
                  onClick={() => openChatWithPartner(pal.name, 'GamePal Companion')}
                >
                  <div className="coaching-avatar-wrapper">
                    <img src={pal.avatarImage} alt={pal.name} className="coaching-avatar-img" />
                    {pal.online && <span className="coaching-online-dot"></span>}
                  </div>
                  <span className="coaching-profile-name">{pal.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Top Trending tabbed Games Grid */}
      <section className="trending-section">
        <div className="container">
          <h2 className="g2g-trending-main-title">Xem Xu hướng</h2>

          <div className="g2g-trending-tabs-wrapper">
            <div className="g2g-trending-tabs-container">
              <span
                className={`g2g-trending-tab-link ${activeCategory === 'cards' ? 'active' : ''}`}
                onClick={() => setActiveCategory('cards')}
              >
                Thẻ quà tặng
              </span>
              <span
                className={`g2g-trending-tab-link ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                Trò chơi
              </span>
              <span
                className="g2g-trending-tab-link"
                onClick={() => triggerToast('Hãy cuộn lên phía trên để xem dịch vụ Game Coaching!')}
              >
                Game Coaching
              </span>
              <span
                className="g2g-trending-tab-link"
                onClick={() => triggerToast('Hãy cuộn lên phía trên để xem dịch vụ GamePal!')}
              >
                GamePal
              </span>
              <span
                className={`g2g-trending-tab-link ${activeCategory === 'coins' ? 'active' : ''}`}
                onClick={() => setActiveCategory('coins')}
              >
                Xu Game
              </span>
              <span
                className="g2g-trending-tab-link"
                onClick={() => triggerToast('Thị trường Vật phẩm đang cập nhật xu hướng!')}
              >
                Vật phẩm
              </span>
              <span
                className={`g2g-trending-tab-link ${activeCategory === 'accounts' ? 'active' : ''}`}
                onClick={() => setActiveCategory('accounts')}
              >
                Tài khoản Game
              </span>
              <span
                className={`g2g-trending-tab-link ${activeCategory === 'boosting' ? 'active' : ''}`}
                onClick={() => setActiveCategory('boosting')}
              >
                Cày thuê
              </span>
              <span
                className="g2g-trending-tab-link"
                onClick={() => triggerToast('Thị trường Trang phục/Skin đang cập nhật xu hướng!')}
              >
                Skin
              </span>
              <span
                className="g2g-trending-tab-link"
                onClick={() => triggerToast('Giao dịch nạp tiền điện thoại đang liên kết đại lý!')}
              >
                Nạp tiền điện thoại
              </span>
              <span
                className="g2g-trending-tab-link"
                onClick={() => triggerToast('Phần mềm bản quyền đang liên kết đại lý!')}
              >
                Phần mềm &amp; Ứng dụng
              </span>
            </div>

            {/* Arrow Indicator */}
            <span
              className="g2g-trending-tab-arrow"
              onClick={() => triggerToast('Cuộn ngang hoặc kéo để xem thêm danh mục xu hướng!')}
            >
              &gt;
            </span>
          </div>

          {(() => {
            const items = TRENDING_BLOCKS[activeCategory] || TRENDING_BLOCKS['coins'];
            return (
              <div className="g2g-trending-grid">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="g2g-trending-gold-card"
                    onClick={() => handleTrendingCardClick(item)}
                  >
                    <h4 className="trending-gold-card-title">{item.name}</h4>
                    <div className="g2g-trending-offers-pill">{item.offers}</div>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* View All Button */}
          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            <button className="g2g-trending-view-all-btn" onClick={() => setActiveCategory('all')}>
              Xem tất cả
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
