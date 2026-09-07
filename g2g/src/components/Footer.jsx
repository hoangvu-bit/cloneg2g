import React from 'react';

export default function Footer({ theme, toggleTheme, triggerToast }) {
  const handleLinkClick = (e, name) => {
    e.preventDefault();
    if (triggerToast) triggerToast(`Đang chuyển hướng tới trang ${name}`);
  };

  return (
    <footer className="footer-g2g-new">
      <div className="container footer-g2g-container">
        <div className="footer-g2g-content-left">
          <p className="footer-g2g-intro">
            G2G là một thị trường trực tuyến toàn diện cho tất cả mọi thứ liên quan đến game. 
            Chúng tôi cam kết đối mới vì lợi ích của cộng đồng chơi game.
          </p>
          <div className="footer-g2g-links-copyright">
            <span className="copyright-year">© 2026 G2G.com</span>
            <span className="separator">•</span>
            <a href="#about" onClick={(e) => handleLinkClick(e, 'About Us')}>About Us</a>
            <span className="separator">•</span>
            <a href="#terms" onClick={(e) => handleLinkClick(e, 'Điều khoản Dịch vụ')}>Điều khoản Dịch vụ</a>
            <span className="separator">•</span>
            <a href="#legal" onClick={(e) => handleLinkClick(e, 'Pháp lý')}>Pháp lý</a>
            <span className="separator">•</span>
            <a href="#privacy" onClick={(e) => handleLinkClick(e, 'Chính sách bảo mật')}>Chính sách bảo mật</a>
            <span className="separator">•</span>
            <a href="#help" onClick={(e) => handleLinkClick(e, 'Help Center')}>Help Center</a>
            <span className="separator">•</span>
            <span className="night-mode-toggle-inline" onClick={toggleTheme}>
              {theme === 'dark' ? '🌙 Night mode ON' : '☀️ Night mode OFF'}
            </span>
          </div>
        </div>

        <div className="footer-g2g-content-right">
          <div className="social-circles">
            <a href="#ig" className="social-circle-btn" onClick={(e) => e.preventDefault()} title="Instagram">
              <i className="social-icon">ig</i>
            </a>
            <a href="#fb" className="social-circle-btn" onClick={(e) => e.preventDefault()} title="Facebook">
              <i className="social-icon">fb</i>
            </a>
            <a href="#li" className="social-circle-btn" onClick={(e) => e.preventDefault()} title="LinkedIn">
              <i className="social-icon">in</i>
            </a>
            <a href="#x" className="social-circle-btn" onClick={(e) => e.preventDefault()} title="X">
              <i className="social-icon">𝕏</i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
