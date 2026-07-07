import React from 'react';

export default function Orders({
  currentView,
  orders,
  triggerToast,
  openChatWithPartner,
  pushRoute,
}) {
  if (currentView !== 'orders') return null;

  return (
    <section className="dashboard-section">
      <div className="container">
        <h2 className="section-title">Quản Lý Giao Dịch &amp; Đơn Hàng</h2>

        <div className="dashboard-layout">
          {/* Tabs selection */}
          <div className="dashboard-tabs">
            <span className="tab-item active">Lịch sử đơn mua ({orders.length})</span>
            <span
              className="tab-item"
              onClick={() =>
                triggerToast(
                  'Lịch sử đơn bán chỉ dành cho tài khoản đã xét duyệt là Người bán.'
                )
              }
            >
              Lịch sử đơn bán
            </span>
            <span className="tab-item" onClick={() => triggerToast('Hồ sơ cá nhân và Cài đặt bảo mật.')}>
              Cài đặt tài khoản
            </span>
          </div>

          {/* Orders tracking grid list */}
          <div className="orders-list-wrapper">
            {orders.length > 0 ? (
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
                <p>Bạn chưa thực hiện giao dịch nào.</p>
                <button className="btn btn-primary btn-sm" onClick={() => pushRoute('home')}>
                  Khám phá chợ game ngay
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
