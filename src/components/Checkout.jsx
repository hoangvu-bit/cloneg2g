import React from 'react';

export default function Checkout({
  currentView,
  cart,
  getCartTotal,
  activePaymentTab,
  setActivePaymentTab,
  cardNo,
  setCardNo,
  cardExp,
  setCardExp,
  cardCvv,
  setCardCvv,
  checkoutProcessing,
  handleConfirmPayment,
  triggerToast,
  userWalletBalance = 0,
}) {
  if (currentView !== 'checkout') return null;

  return (
    <section className="checkout-section">
      <div className="container">
        <h2 className="section-title">Thanh Toán Giao Dịch G2G</h2>

        <div className="checkout-grid">
          {/* Left Column: Payments Selector & details */}
          <div className="checkout-left-col">
            <div className="checkout-card">
              <h3 className="card-title">1. Chọn phương thức thanh toán</h3>

              <div className="payment-tabs-layout">
                <div className="payment-tabs-sidebar">
                  <div
                    className={`payment-tab-button ${activePaymentTab === 'momo' ? 'active' : ''}`}
                    onClick={() => setActivePaymentTab('momo')}
                  >
                    <span className="payment-icon">📱</span>
                    <span>Ví điện tử MoMo</span>
                  </div>
                  <div
                    className={`payment-tab-button ${
                      activePaymentTab === 'zalopay' ? 'active' : ''
                    }`}
                    onClick={() => setActivePaymentTab('zalopay')}
                  >
                    <span className="payment-icon">💸</span>
                    <span>Ví điện tử ZaloPay</span>
                  </div>
                  <div
                    className={`payment-tab-button ${
                      activePaymentTab === 'banking' ? 'active' : ''
                    }`}
                    onClick={() => setActivePaymentTab('banking')}
                  >
                    <span className="payment-icon">🏦</span>
                    <span>Chuyển khoản NH Auto</span>
                  </div>
                  <div
                    className={`payment-tab-button ${activePaymentTab === 'card' ? 'active' : ''}`}
                    onClick={() => setActivePaymentTab('card')}
                  >
                    <span className="payment-icon">💳</span>
                    <span>Thẻ Visa / Mastercard</span>
                  </div>
                </div>

                <div className="payment-tab-content">
                  {activePaymentTab === 'momo' && (
                    <div className="qr-payment-container">
                      <div className="qr-box">
                        {/* Virtual Momo QR code design */}
                        <div className="virtual-qr-code">
                          <div className="qr-corner top-left"></div>
                          <div className="qr-corner top-right"></div>
                          <div className="qr-corner bottom-left"></div>
                          <div className="qr-corner bottom-right"></div>
                          <div className="qr-logo-momo">MoMo</div>
                          <div className="qr-matrix-dots"></div>
                        </div>
                        <div className="qr-amount">
                          Tổng tiền: {(getCartTotal() + 15000).toLocaleString('vi-VN')}₫
                        </div>
                      </div>
                      <div className="qr-instructions">
                        <h5>Quét Mã QR MoMo</h5>
                        <ol>
                          <li>Mở ứng dụng MoMo trên điện thoại di động của bạn.</li>
                          <li>
                            Chọn tính năng <strong>Quét mã</strong> và quét mã QR ở bên cạnh.
                          </li>
                          <li>
                            Nhập đúng mã nội dung thanh toán:{' '}
                            <strong>G2G-{Math.floor(10000 + Math.random() * 90000)}</strong>
                          </li>
                          <li>
                            Nhấn nút <strong>Xác nhận đã chuyển tiền</strong> bên dưới sau khi hoàn
                            thành.
                          </li>
                        </ol>
                      </div>
                    </div>
                  )}

                  {activePaymentTab === 'zalopay' && (
                    <div className="qr-payment-container">
                      <div className="qr-box">
                        <div className="virtual-qr-code" style={{ borderColor: '#0070e0' }}>
                          <div
                            className="qr-corner top-left"
                            style={{ borderColor: '#0070e0' }}
                          ></div>
                          <div
                            className="qr-corner top-right"
                            style={{ borderColor: '#0070e0' }}
                          ></div>
                          <div
                            className="qr-corner bottom-left"
                            style={{ borderColor: '#0070e0' }}
                          ></div>
                          <div
                            className="qr-corner bottom-right"
                            style={{ borderColor: '#0070e0' }}
                          ></div>
                          <div className="qr-logo-momo" style={{ background: '#0070e0' }}>
                            Zalo
                          </div>
                          <div className="qr-matrix-dots"></div>
                        </div>
                        <div className="qr-amount">
                          Tổng tiền: {(getCartTotal() + 12000).toLocaleString('vi-VN')}₫
                        </div>
                      </div>
                      <div className="qr-instructions">
                        <h5>Quét Mã QR ZaloPay</h5>
                        <ol>
                          <li>Mở ứng dụng ZaloPay hoặc Zalo trên điện thoại.</li>
                          <li>Quét mã QR để chuyển khoản nhanh.</li>
                          <li>
                            Nội dung chuyển khoản mặc định:{' '}
                            <strong>
                              G2G-ZALO-{Math.floor(10000 + Math.random() * 90000)}
                            </strong>
                          </li>
                        </ol>
                      </div>
                    </div>
                  )}

                  {activePaymentTab === 'banking' && (
                    <div className="banking-instructions">
                      <h5>Thông tin tài khoản ngân hàng nhận</h5>
                      <div className="banking-details-grid">
                        <div className="banking-field">
                          <span className="label">Ngân hàng:</span>
                          <span className="value">MB Bank (Ngân hàng Quân Đội)</span>
                        </div>
                        <div className="banking-field">
                          <span className="label">Số tài khoản:</span>
                          <span className="value copy-value">
                            999920268888{' '}
                            <span
                              className="copy-icon"
                              onClick={() => triggerToast('Đã copy số tài khoản!')}
                            >
                              📋
                            </span>
                          </span>
                        </div>
                        <div className="banking-field">
                          <span className="label">Chủ tài khoản:</span>
                          <span className="value">CONG TY CONG NGHE G2G CLONE</span>
                        </div>
                        <div className="banking-field">
                          <span className="label">Số tiền:</span>
                          <span className="value">
                            {(getCartTotal() + 10000).toLocaleString('vi-VN')}₫
                          </span>
                        </div>
                        <div className="banking-field" style={{ gridColumn: 'span 2' }}>
                          <span className="label">Nội dung chuyển tiền:</span>
                          <span
                            className="value copy-value"
                            style={{ color: 'var(--brand-red)', fontWeight: 'bold' }}
                          >
                            G2G BANKING {Math.floor(100000 + Math.random() * 900000)}
                            <span
                              className="copy-icon"
                              onClick={() => triggerToast('Đã copy nội dung!')}
                            >
                              📋
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="note-alert">
                        ⚠️ Hệ thống tự động cộng tiền trong vòng 10 giây sau khi nhận được chuyển
                        khoản ngân hàng chính xác nội dung.
                      </div>
                    </div>
                  )}

                  {activePaymentTab === 'card' && (
                    <div className="card-form-container">
                      <h5>Nhập thông tin thẻ quốc tế</h5>
                      <div className="card-form-grid">
                        <div className="form-group" style={{ gridColumn: 'span 2' }}>
                          <label>Số thẻ tín dụng / Ghi nợ</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="4111 2222 3333 4444"
                            value={cardNo}
                            onChange={(e) =>
                              setCardNo(e.target.value.replace(/\D/g, '').substring(0, 16))
                            }
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Ngày hết hạn</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="MM/YY"
                            value={cardExp}
                            onChange={(e) => setCardExp(e.target.value.substring(0, 5))}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Mã CVV / CVC</label>
                          <input
                            type="password"
                            className="form-control"
                            placeholder="•••"
                            value={cardCvv}
                            onChange={(e) =>
                              setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 3))
                            }
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Checkout Billing summary panel */}
          <div className="checkout-right-col">
            <div className="checkout-card">
              <h3 className="card-title">2. Tóm tắt đơn hàng</h3>

              <div className="checkout-items-list">
                {cart.map((item) => (
                  <div key={item.cartId} className="checkout-item-row">
                    <div className="checkout-item-details">
                      <span className="checkout-item-icon" style={{ background: item.color }}>
                        {item.textIcon}
                      </span>
                      <div>
                        <div className="checkout-item-name">{item.itemName}</div>
                        <div className="checkout-item-seller">Người bán: {item.sellerName}</div>
                        <div className="checkout-item-qty">Số lượng: {item.qty}</div>
                      </div>
                    </div>
                    <span className="checkout-item-price">
                      {(item.price * item.qty).toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                ))}
              </div>

              <div className="checkout-totals">
                <div className="total-row-sub">
                  <span>Giá trị sản phẩm:</span>
                  <span>{getCartTotal().toLocaleString('vi-VN')}₫</span>
                </div>
                <div className="total-row-sub">
                  <span>Phí cổng thanh toán / Bảo hiểm:</span>
                  <span>
                    {activePaymentTab === 'momo'
                      ? '15.000₫'
                      : activePaymentTab === 'zalopay'
                      ? '12.000₫'
                      : activePaymentTab === 'banking'
                      ? '10.000₫'
                      : '25.000₫'}
                  </span>
                </div>
                <div className="checkout-divider"></div>
                <div className="total-row-main">
                  <span>Tổng cộng:</span>
                  <span className="total-large">
                    {(
                      getCartTotal() +
                      (activePaymentTab === 'momo'
                        ? 15000
                        : activePaymentTab === 'zalopay'
                        ? 12000
                        : activePaymentTab === 'banking'
                        ? 10000
                        : 25000)
                    ).toLocaleString('vi-VN')}
                    ₫
                  </span>
                </div>
              </div>

              {/* Wallet balance display */}
              {(() => {
                const gatewayFee = activePaymentTab === 'momo'
                  ? 15000
                  : activePaymentTab === 'zalopay'
                  ? 12000
                  : activePaymentTab === 'banking'
                  ? 10000
                  : 25000;
                const totalCost = getCartTotal() + gatewayFee;
                const isSufficient = userWalletBalance >= totalCost;

                return (
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(255,51,51,0.08) 0%, rgba(30,30,35,0.8) 100%)',
                    border: `1px solid ${isSufficient ? 'rgba(52,199,89,0.3)' : 'rgba(255,51,51,0.3)'}`,
                    borderRadius: '10px',
                    padding: '14px 16px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '18px' }}>💰</span>
                      <div>
                        <div style={{ color: 'var(--text-secondary, #9ea2a9)', fontSize: '11px', fontWeight: 500 }}>Số dư ví G2G</div>
                        <div style={{
                          color: isSufficient ? '#34c759' : '#ff3333',
                          fontWeight: 700, fontSize: '16px'
                        }}>
                          {(Number(userWalletBalance) || 0).toLocaleString('vi-VN')}₫
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      {isSufficient ? (
                        <span style={{
                          background: 'rgba(52,199,89,0.15)', color: '#34c759',
                          border: '1px solid rgba(52,199,89,0.3)',
                          borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: 600
                        }}>✓ Đủ số dư</span>
                      ) : (
                        <span style={{
                          background: 'rgba(255,51,51,0.12)', color: '#ff3333',
                          border: '1px solid rgba(255,51,51,0.3)',
                          borderRadius: '6px', padding: '4px 10px', fontSize: '12px', fontWeight: 600
                        }}>⚠ Thiếu {(totalCost - (Number(userWalletBalance) || 0)).toLocaleString('vi-VN')}₫</span>
                      )}
                    </div>
                  </div>
                );
              })()}

              <form onSubmit={handleConfirmPayment} style={{ marginTop: '0' }}>
                <div className="checkout-agreement">
                  <input type="checkbox" id="checkoutAgree" required />
                  <label htmlFor="checkoutAgree">
                    Tôi xác nhận các thông tin mua sản phẩm trên là chính xác và đồng ý với điều
                    khoản thanh toán.
                  </label>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', borderRadius: '8px', fontSize: '15px' }}
                  disabled={checkoutProcessing || cart.length === 0}
                >
                  {checkoutProcessing ? 'Đang giao dịch...' : 'Xác nhận đã thanh toán'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
