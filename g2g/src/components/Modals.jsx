import React from 'react';

export default function Modals({
  activeModal,
  setActiveModal,
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  signupUsername,
  setSignupUsername,
  signupEmail,
  setSignupEmail,
  signupPassword,
  setSignupPassword,
  sellerGame,
  setSellerGame,
  sellerExperience,
  setSellerExperience,
  handleLoginSubmit,
  handleSignupSubmit,
  handleSellerSubmit,
  triggerToast,
}) {
  if (!activeModal) return null;

  return (
    <>
      {/* Login Modal */}
      {activeModal === 'login' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="modal-close" onClick={() => setActiveModal(null)}>×</span>
            <h3 style={{ marginBottom: '24px', fontSize: '22px', fontWeight: 800 }}>Đăng Nhập G2G</h3>
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label>Email hoặc Số điện thoại</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Nhập email hoặc số điện thoại..." 
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
                <a href="#forgot" style={{ fontSize: '12px', color: 'var(--brand-red)' }} onClick={(e) => { e.preventDefault(); triggerToast('Mã khôi phục đã gửi!'); }}>Quên mật khẩu?</a>
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
                <label>Email hoặc Số điện thoại</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Nhập email hoặc số điện thoại..." 
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="form-group">
                <label>Mật khẩu (Tối thiểu 8 ký tự, gồm chữ hoa, số và ký tự đặc biệt)</label>
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="••••••••" 
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  minLength="8"
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
                </select>
              </div>
              
              <div className="form-group">
                <label>Mô tả ngắn kinh nghiệm &amp; sản phẩm bán</label>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  placeholder="Ví dụ: Tôi có nguồn Robux sạch dồi dào, hoặc có đội cày thuê Liên Quân uy tín..."
                  value={sellerExperience}
                  onChange={(e) => setSellerExperience(e.target.value)}
                  style={{ resize: 'vertical' }}
                  required
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', alignItems: 'flex-start' }}>
                <input type="checkbox" id="sellerAgree" required style={{ marginTop: '3px' }} />
                <label htmlFor="sellerAgree" style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4, cursor: 'pointer' }}>
                  Tôi cam kết cung cấp sản phẩm sạch và tuân thủ quy định giao dịch của G2G.
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
