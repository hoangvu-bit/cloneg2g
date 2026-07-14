import React, { useState } from 'react';

export default function Orders({
  currentView,
  orders,
  triggerToast,
  openChatWithPartner,
  pushRoute,
  currentUser,
  setActiveModal,
  userWalletBalance = 0,
  handleDepositToWallet,
  sellerOrders = [],
  setSellerOrders,
  sellerWalletBalance = 0,
  setSellerWalletBalance,
  sellerWalletTransactions = [],
  setSellerWalletTransactions,
}) {
  if (currentView !== 'orders') return null;

  // Local tabs state
  const [activeSubTab, setActiveSubTab] = useState('buy'); // 'buy', 'sell', 'settings'

  // Change Password form states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Quick Deposit state
  const [depositAmount, setDepositAmount] = useState('');

  // Local wallet transaction history to complement dynamic updates
  const [walletTransactions, setWalletTransactions] = useState([
    { id: 'T-981045', date: '01/07/2026', desc: 'Thanh toán đơn hàng #G2G-583019', amount: -190000, type: 'payment' },
    { id: 'T-920412', date: '28/06/2026', desc: 'Thanh toán đơn hàng #G2G-194058', amount: -150000, type: 'payment' },
    { id: 'T-852104', date: '25/06/2026', desc: 'Nạp tiền qua Chuyển khoản ngân hàng', amount: 500000, type: 'deposit' },
  ]);

  // Handle delivering order as seller
  const handleDeliverOrderLocal = (order) => {
    if (!setSellerOrders) return;

    setSellerOrders(prev => prev.map(o => {
      if (o.id === order.id) {
        return { ...o, status: 'completed' };
      }
      return o;
    }));

    const totalAmount = order.price * order.qty;
    const appFee = totalAmount * 0.10;
    const netEarnings = totalAmount - appFee;

    // Credit seller wallet
    if (setSellerWalletBalance) {
      setSellerWalletBalance(prev => {
        const updated = prev + netEarnings;
        localStorage.setItem(`g2g_seller_wallet_balance_${currentUser.name}`, String(updated));
        return updated;
      });
    }

    // Transfer fee to Admin's wallet (Admin G2G)
    const currentAdminBal = Number(localStorage.getItem('g2g_user_wallet_balance_Admin G2G') || '0');
    localStorage.setItem('g2g_user_wallet_balance_Admin G2G', String(currentAdminBal + appFee));

    const newTx = {
      id: `T-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('vi-VN'),
      type: 'order_payment',
      description: `Nhận tiền bán đơn hàng ${order.id} (Tổng: ${totalAmount.toLocaleString('vi-VN')}₫, Khấu trừ 10% phí app: -${appFee.toLocaleString('vi-VN')}₫ chuyển về Admin)`,
      amount: netEarnings
    };

    if (setSellerWalletTransactions) {
      setSellerWalletTransactions(prev => {
        const updatedTxs = [newTx, ...prev];
        localStorage.setItem(`g2g_seller_wallet_transactions_${currentUser.name}`, JSON.stringify(updatedTxs));
        return updatedTxs;
      });
    }

    triggerToast(`Giao hàng đơn #${order.id} thành công! +${netEarnings.toLocaleString('vi-VN')}₫ đã được cộng vào ví người bán (Chiết khấu 10% phí app: -${appFee.toLocaleString('vi-VN')}₫ chuyển Admin).`);
  };

  // Handle local Quick Deposit submit
  const handleQuickDepositSubmit = (e) => {
    e.preventDefault();
    const amountNum = Number(depositAmount);
    if (!depositAmount || isNaN(amountNum) || amountNum <= 0) {
      triggerToast('Vui lòng nhập số tiền nạp hợp lệ!');
      return;
    }
    if (handleDepositToWallet) {
      handleDepositToWallet(amountNum);
    }
    
    // Add to transaction log
    const newTx = {
      id: `T-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('vi-VN'),
      desc: 'Nạp tiền nhanh vào ví',
      amount: amountNum,
      type: 'deposit'
    };
    setWalletTransactions(prev => [newTx, ...prev]);
    setDepositAmount('');
  };

  // Handle password change
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      triggerToast('Vui lòng điền đầy đủ các trường mật khẩu!');
      return;
    }
    if (newPassword !== confirmPassword) {
      triggerToast('Mật khẩu mới và xác nhận mật khẩu không trùng khớp!');
      return;
    }
    triggerToast('Thay đổi mật khẩu tài khoản thành công!');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  // Helper values
  const firstLetter = currentUser && currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U';
  const g2gId = currentUser ? '1004154462' : 'Khách vãng lai';

  return (
    <section className="dashboard-section">
      <div className="container">
        <h2 className="section-title">Quản Lý Giao Dịch &amp; Đơn Hàng</h2>

        <div className="dashboard-layout">
          {/* Interactive Navigation Tabs */}
          <div className="dashboard-tabs">
            <span
              className={`tab-item ${activeSubTab === 'buy' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('buy')}
            >
              Lịch sử đơn mua ({orders.length})
            </span>
            <span
              className={`tab-item ${activeSubTab === 'sell' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('sell')}
            >
              Lịch sử đơn bán {currentUser?.isSeller ? `(${sellerOrders.length})` : ''}
            </span>
            <span
              className={`tab-item ${activeSubTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveSubTab('settings')}
            >
              Cài đặt tài khoản
            </span>
          </div>

          {/* Tab Contents */}
          <div className="orders-list-wrapper">
            
            {/* BUY TAB */}
            {activeSubTab === 'buy' && (
              orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order.id} className="order-log-card">
                    <div className="order-log-header">
                      <div className="order-log-meta">
                        <span className="order-id">
                          Mã đơn: <strong>#{order.id}</strong>
                        </span>
                        <span className="order-date">Ngày mua: {order.date}</span>
                      </div>

                      <span className={`order-status-badge ${order.status}`}>
                        {order.status === 'pending' && '⏳ Chờ giao hàng'}
                        {order.status === 'delivering' && '📦 Đang giao hàng'}
                        {order.status === 'completed' && '✓ Đã hoàn thành'}
                      </span>
                    </div>

                    <div className="order-log-body">
                      <div className="order-log-details">
                        <div className="order-game-avatar">
                          {order.gameName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="order-item-name">{order.itemName}</h4>
                          <div className="order-item-seller">
                            Người bán: <strong>{order.sellerName}</strong>
                          </div>
                          <div className="order-item-qty">
                            Số lượng: {order.qty} | Cổng thanh toán: {order.paymentMethod}
                          </div>
                        </div>
                      </div>

                      <div className="order-log-price">
                        <div className="price-label">Tổng thanh toán</div>
                        <div className="price-val">
                          {(order.price * order.qty).toLocaleString('vi-VN')}₫
                        </div>
                      </div>
                    </div>

                    <div className="order-log-actions">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => openChatWithPartner(order.sellerName, order.gameName)}
                      >
                        💬 Trò chuyện với người bán
                      </button>
                      {order.status === 'completed' ? (
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ borderColor: 'var(--success)', color: 'var(--success)' }}
                          onClick={() => triggerToast('Cảm ơn bạn đã phản hồi tốt!')}
                        >
                          Đánh giá 5★
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ background: '#0284c7' }}
                          onClick={() =>
                            triggerToast(
                              `Đơn hàng #${order.id} đang được hối thúc giao nhanh!`
                            )
                          }
                        >
                          Hối thúc giao hàng
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-orders-view">
                  <p>Bạn chưa thực hiện giao dịch mua nào.</p>
                  <button className="btn btn-primary btn-sm" onClick={() => pushRoute('home')}>
                    Khám phá chợ game ngay
                  </button>
                </div>
              )
            )}

            {/* SELL TAB */}
            {activeSubTab === 'sell' && (
              !currentUser ? (
                <div className="empty-orders-view">
                  <p>Vui lòng đăng nhập để kiểm tra lịch sử đơn bán của bạn.</p>
                  <button className="btn btn-primary btn-sm" onClick={() => setActiveModal('login')}>
                    Đăng Nhập Ngay
                  </button>
                </div>
              ) : !currentUser.isSeller ? (
                <div className="upgrade-seller-card-full">
                  <div className="upgrade-content">
                    <span className="upgrade-icon">💼</span>
                    <h3>Bạn chưa đăng ký tài khoản Người Bán</h3>
                    <p>Hãy nâng cấp tài khoản của bạn để có thể đăng bán tài khoản game, nạp tiền dịch vụ và kiếm tiền an toàn cùng G2G Clone.</p>
                    
                    <div className="seller-benefits-bullets">
                      <div className="benefit-bullet-item">
                        <span className="bullet-check">✓</span>
                        <div>
                          <strong>Phí chiết khấu cực ưu đãi:</strong> Chỉ từ 2% đến 5% cho mỗi đơn hàng giao dịch thành công.
                        </div>
                      </div>
                      <div className="benefit-bullet-item">
                        <span className="bullet-check">✓</span>
                        <div>
                          <strong>Rút tiền siêu tốc:</strong> Hỗ trợ rút tiền mặt 24/7 về Ví MoMo, ZaloPay hoặc chuyển khoản ngân hàng.
                        </div>
                      </div>
                      <div className="benefit-bullet-item">
                        <span className="bullet-check">✓</span>
                        <div>
                          <strong>Đảm bảo an toàn:</strong> Giao dịch thông qua dòng tiền bảo chứng của GamerProtect chống lừa đảo.
                        </div>
                      </div>
                    </div>

                    <button
                      className="btn btn-primary upgrade-btn-action"
                      onClick={() => setActiveModal('seller')}
                    >
                      🚀 Đăng Ký Trở Thành Người Bán Ngay
                    </button>
                  </div>
                </div>
              ) : sellerOrders.length > 0 ? (
                sellerOrders.map((order) => (
                  <div key={order.id} className="order-log-card order-log-card-sell">
                    <div className="order-log-header">
                      <div className="order-log-meta">
                        <span className="order-id">
                          Mã đơn: <strong>#{order.id}</strong>
                        </span>
                        <span className="order-date">Ngày đặt: {order.date}</span>
                      </div>

                      <span className={`order-status-badge ${order.status}`}>
                        {order.status === 'pending' && '⏳ Chờ giao hàng'}
                        {order.status === 'completed' && '✓ Giao thành công'}
                      </span>
                    </div>

                    <div className="order-log-body">
                      <div className="order-log-details">
                        <div className="order-game-avatar seller-avatar-design">
                          {order.gameName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="order-item-name">{order.itemName}</h4>
                          <div className="order-item-seller">
                            Khách mua hàng: <strong>{order.buyerName || 'GamerPro99'}</strong>
                          </div>
                          <div className="order-item-qty">
                            Số lượng: {order.qty} | Cổng thanh toán: Số dư ví G2G
                          </div>
                        </div>
                      </div>

                      <div className="order-log-price">
                        <div className="price-label" style={{ color: 'var(--success)' }}>Doanh thu dự kiến</div>
                        <div className="price-val" style={{ color: '#ffffff' }}>
                          {(order.price * order.qty).toLocaleString('vi-VN')}₫
                        </div>
                      </div>
                    </div>

                    <div className="order-log-actions">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => openChatWithPartner(order.buyerName || 'GamerPro99', order.gameName)}
                      >
                        💬 Nhắn tin cho người mua
                      </button>
                      
                      {order.status === 'pending' ? (
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none' }}
                          onClick={() => handleDeliverOrderLocal(order)}
                        >
                          📦 Xác nhận đã giao hàng
                        </button>
                      ) : (
                        <span className="deliver-success-tag">
                          ✓ Đã hoàn tất và nhận tiền
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-orders-view">
                  <p>Bạn chưa nhận được đơn đặt hàng nào từ người mua.</p>
                  <button className="btn btn-secondary btn-sm" onClick={() => pushRoute('seller-landing')}>
                    Vào trang quản lý tin đăng bán
                  </button>
                </div>
              )
            )}

            {/* SETTINGS TAB */}
            {activeSubTab === 'settings' && (
              !currentUser ? (
                <div className="empty-orders-view">
                  <p>Vui lòng đăng nhập để thay đổi cài đặt tài khoản của bạn.</p>
                  <button className="btn btn-primary btn-sm" onClick={() => setActiveModal('login')}>
                    Đăng Nhập Ngay
                  </button>
                </div>
              ) : (
                <div className="account-settings-grid">
                  {/* LEFT COLUMN: Profile Info & Security */}
                  <div className="settings-col">
                    
                    {/* User Profile Card */}
                    <div className="settings-card">
                      <h3 className="card-header-title">Hồ Sơ Cá Nhân</h3>
                      
                      <div className="profile-hero-section">
                        <div className="profile-large-avatar">
                          {firstLetter}
                        </div>
                        <div className="profile-hero-meta">
                          <h4>{currentUser.name}</h4>
                          <span className="profile-role-badge">
                            {currentUser.isSeller ? '💼 Nhà Bán Hàng G2G' : '👤 Người Mua'}
                          </span>
                          <div className="profile-id-sub">G2G ID: #{g2gId}</div>
                        </div>
                      </div>

                      <div className="profile-fields-list">
                        <div className="profile-field-row">
                          <span className="field-label">Địa chỉ Email:</span>
                          <span className="field-val">{currentUser.mail}</span>
                        </div>
                        <div className="profile-field-row">
                          <span className="field-label">Loại tài khoản:</span>
                          <span className="field-val">{currentUser.isSeller ? 'Doanh Nghiệp / Bán Hàng' : 'Cá Nhân'}</span>
                        </div>
                        <div className="profile-field-row">
                          <span className="field-label">Thành viên từ:</span>
                          <span className="field-val">10/05/2026</span>
                        </div>
                      </div>

                      {/* VIP Progress Tracker */}
                      <div className="vip-progress-container">
                        <div className="vip-progress-header">
                          <span className="vip-title">🏆 Tài Khoản VIP</span>
                          <span className="vip-level-name">Hạng Vàng (Gold)</span>
                        </div>
                        <div className="vip-progress-bar-wrapper">
                          <div className="vip-progress-bar-fill" style={{ width: '65%' }}></div>
                        </div>
                        <div className="vip-progress-footer">
                          <span>Chi tiêu: 13.000.000₫</span>
                          <span>Yêu cầu: 20.000.000₫</span>
                        </div>
                      </div>
                    </div>

                    {/* Change Password Card */}
                    <div className="settings-card">
                      <h3 className="card-header-title">Đổi Mật Khẩu Bảo Mật</h3>
                      
                      <form onSubmit={handleChangePassword} className="settings-password-form">
                        <div className="form-group">
                          <label>Mật khẩu hiện tại</label>
                          <input
                            type="password"
                            placeholder="••••••••"
                            className="form-control"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label>Mật khẩu mới</label>
                          <input
                            type="password"
                            placeholder="Mật khẩu mới (tối thiểu 6 ký tự)"
                            className="form-control"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label>Xác nhận mật khẩu mới</label>
                          <input
                            type="password"
                            placeholder="Nhập lại mật khẩu mới"
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </div>
                        <button type="submit" className="btn btn-primary btn-sm settings-submit-btn">
                          Cập Nhật Mật Khẩu
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: G2G Wallet & Transaction History */}
                  <div className="settings-col">
                    
                    {/* G2G Wallet Balance Card */}
                    <div className="settings-card wallet-card-background">
                      <h3 className="card-header-title" style={{ color: '#ffffff' }}>Ví Tài Khoản G2G</h3>
                      
                      <div className="wallet-balance-hero">
                        <span className="wallet-icon-coin">💰</span>
                        <div>
                          <div className="balance-label">Số dư hiện tại</div>
                          <div className="balance-value">{userWalletBalance.toLocaleString('vi-VN')}₫</div>
                        </div>
                      </div>

                      {/* Quick Deposit Form */}
                      <form onSubmit={handleQuickDepositSubmit} className="quick-deposit-form">
                        <label className="quick-deposit-label">Nạp Tiền Nhanh Vào Ví</label>
                        <div className="quick-deposit-input-group">
                          <input
                            type="number"
                            placeholder="Nhập số tiền nạp (VND)..."
                            className="form-control deposit-input"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                          />
                          <button type="submit" className="btn btn-primary deposit-btn">
                            Nạp Ngay
                          </button>
                        </div>
                        <div className="quick-amount-tags">
                          <span className="amount-tag" onClick={() => setDepositAmount('100000')}>100k</span>
                          <span className="amount-tag" onClick={() => setDepositAmount('200000')}>200k</span>
                          <span className="amount-tag" onClick={() => setDepositAmount('500000')}>500k</span>
                          <span className="amount-tag" onClick={() => setDepositAmount('1000000')}>1M</span>
                        </div>
                      </form>
                    </div>

                    {/* Transaction Logs */}
                    <div className="settings-card">
                      <h3 className="card-header-title">Lịch Sử Giao Dịch Gần Đây</h3>
                      
                      <div className="wallet-tx-history-list">
                        {walletTransactions.length > 0 ? (
                          walletTransactions.map((tx, idx) => (
                            <div key={tx.id || idx} className="tx-history-item">
                              <div className="tx-meta-info">
                                <span className={`tx-icon-pill ${tx.type}`}>
                                  {tx.type === 'deposit' ? '↓' : '↑'}
                                </span>
                                <div>
                                  <div className="tx-description">{tx.desc}</div>
                                  <span className="tx-date-time">{tx.date} • ID: #{tx.id}</span>
                                </div>
                              </div>
                              <div className={`tx-amount-value ${tx.type}`}>
                                {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString('vi-VN')}₫
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="empty-tx-history">Chưa có giao dịch ví nào được thực hiện.</div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              )
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
