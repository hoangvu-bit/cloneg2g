import React from 'react';

export default function Promobanners({ triggerToast, pushRoute, setActiveModal }) {
  const handleButtonClick = (actionName) => {
    if (triggerToast) {
      triggerToast(`Tính năng ${actionName} đang được xử lý!`);
    }
  };

  return (
    <section className="new-promos-section">
      <div className="container new-promos-container">
        
        {/* Banner 1: G2G Affiliate */}
        <div className="affiliate-banner-new">
          <div className="affiliate-banner-mascot">
            <img src="/lion_mascot.png" alt="Lion Mascot" className="mascot-img" />
          </div>
          <div className="affiliate-banner-content">
            <div className="affiliate-banner-logo">
              <span className="logo-box">G2G</span>
              <span className="logo-sub">Liên kết</span>
            </div>
            <h3 className="affiliate-banner-title">Kiếm 20% Hoa hồng trong 3 Bước</h3>
            <p className="affiliate-banner-desc">
              Đăng ký, chia sẻ liên kết của bạn và kiếm 20% trên mỗi giao dịch mà người giới thiệu của bạn thực hiện. Mãi mãi.
            </p>
            <p className="affiliate-banner-footnote">
              *Bỏ qua eKYC đầy đủ khi đăng ký Đối tác. Áp dụng điều khoản và điều kiện.
            </p>
          </div>
          <div className="affiliate-banner-action">
            <button 
              className="btn-orange" 
              onClick={() => {
                if (pushRoute) {
                  pushRoute('seller-landing');
                } else if (setActiveModal) {
                  setActiveModal('seller');
                }
              }}
            >
              Bắt Đầu Kiếm Tiền
            </button>
          </div>
        </div>

        {/* Banner 2: GamerProtect */}
        <div className="gamerprotect-banner-new">
          <div className="gamerprotect-banner-left">
            <h3 className="gamerprotect-banner-title">Trade Securely with GamerProtect</h3>
            <p className="gamerprotect-banner-desc">
              Skip the scams and trade safely. We verify sellers and guarantee every purchase.
            </p>
            
            <div className="gamerprotect-features-grid">
              <div className="gp-feature-item">
                <span className="gp-icon">🔒</span>
                <div>
                  <h4 className="gp-feature-title">Dual Security</h4>
                  <p className="gp-feature-desc">Escrow for buyers and seller protection.</p>
                </div>
              </div>
              <div className="gp-feature-item">
                <span className="gp-icon">🛡️</span>
                <div>
                  <h4 className="gp-feature-title">Vetted Community</h4>
                  <p className="gp-feature-desc">Monitored trades and verified sellers.</p>
                </div>
              </div>
              <div className="gp-feature-item">
                <span className="gp-icon">💬</span>
                <div>
                  <h4 className="gp-feature-title">Trusted Support</h4>
                  <p className="gp-feature-desc">24/7 global assistance and positive Google reviews.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="gamerprotect-banner-right">
            <img src="/gamerprotect_shield.png" alt="GamerProtect Shield" className="shield-img" />
            <button 
              className="btn-orange gp-btn" 
              onClick={() => {
                if (setActiveModal) {
                  setActiveModal('gamerprotect');
                } else {
                  handleButtonClick('Tìm hiểu GamerProtect');
                }
              }}
            >
              Tìm Hiểu Thêm
            </button>
          </div>
        </div>

        {/* Payment Partners Logos */}
        <div className="payment-partners-section">
          <div className="payment-logos-row">
            <div className="payment-logo-box">NETELLER</div>
            <div className="payment-logo-box">Skrill</div>
            <div className="payment-logo-box">PayPal</div>
            <div className="payment-logo-box">CVS</div>
            <div className="payment-logo-box">DOLLAR GENERAL</div>
            <div 
              className="payment-logo-more" 
              style={{ cursor: 'pointer' }}
              onClick={() => setActiveModal && setActiveModal('payment_methods')}
            >
              + 200 nữa ❯
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
