import React, { useState } from 'react';
import { MOCK_GAMES } from '../MockData';

export default function SellerLanding({
  currentUser,
  setCurrentUser,
  setActiveModal,
  pushRoute,
  triggerToast,
  sellerWalletBalance,
  setSellerWalletBalance,
  sellerWalletTransactions,
  setSellerWalletTransactions,
  sellerListings,
  setSellerListings,
  sellerOrders,
  setSellerOrders,
  sellerTab,
  setSellerTab,
}) {
  // Sync user profile status on mount to capture Admin decisions dynamically
  React.useEffect(() => {
    if (currentUser) {
      fetch('http://127.0.0.1:5000/users')
        .then(res => res.json())
        .then(data => {
          const latestUser = data.find(u => u.mail === currentUser.mail);
          if (latestUser) {
            const isSeller = latestUser.role === 'seller' || latestUser.role === 'business';
            if (
              currentUser.role !== latestUser.role ||
              currentUser.sellerStatus !== latestUser.sellerStatus ||
              currentUser.sellerRejectReason !== latestUser.sellerRejectReason
            ) {
              const updatedUser = {
                ...currentUser,
                role: latestUser.role,
                isSeller,
                sellerStatus: latestUser.sellerStatus || 'none',
                sellerRejectReason: latestUser.sellerRejectReason || ''
              };
              setCurrentUser(updatedUser);
              localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            }
          }
        })
        .catch(err => console.error("Error syncing profile:", err));
    }
  }, []);

  // If user is not a seller, show landing page with registration banner
  const handleRegisterClick = () => {
    if (currentUser) {
      setActiveModal('seller');
    } else {
      setActiveModal('login');
    }
  };

  // Add Listing Form States
  const [addGameId, setAddGameId] = useState(MOCK_GAMES[0]?.id || 'roblox');
  const [addCategory, setAddCategory] = useState(MOCK_GAMES[0]?.category || 'coins');
  const [addRegion, setAddRegion] = useState('Global');
  const [addItemName, setAddItemName] = useState('');
  const [addPrice, setAddPrice] = useState('');
  const [addStock, setAddStock] = useState('');
  const [addBadge, setAddBadge] = useState('Auto Send');
  const [addDescription, setAddDescription] = useState('');

  // Editing Listing States
  const [editingId, setEditingId] = useState(null);
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');

  // Withdrawal Form States
  const [withdrawMethod, setWithdrawMethod] = useState('momo');
  const [withdrawAccount, setWithdrawAccount] = useState('');
  const [withdrawName, setWithdrawName] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  // Interactive Chart States
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const myListings = sellerListings.filter(item => item.sellerName === currentUser?.name);
  const myOrders = sellerOrders.filter(order => order.sellerName === currentUser?.name);

  // Generate 7 days of dates dynamically and map real completed sales from sellerWalletTransactions
  const getDailySales = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
      dates.push({ date: dateStr, sales: 0, orders: 0 });
    }

    sellerWalletTransactions.forEach(tx => {
      if (tx.type === 'order_payment') {
        const parts = tx.date.split('/');
        if (parts.length >= 2) {
          const txDayMonth = `${parts[0]}/${parts[1]}`;
          const match = dates.find(d => d.date === txDayMonth);
          if (match) {
            match.sales += tx.amount;
            match.orders += 1;
          }
        }
      }
    });

    return dates;
  };

  const chartData = getDailySales();
  const maxSales = Math.max(...chartData.map(d => d.sales), 100000); // 100k VND minimum scale to avoid division by zero

  // Format numbers
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  // Handle adding a listing
  const handleAddListingSubmit = (e) => {
    e.preventDefault();
    if (!addItemName.trim() || !addPrice || !addStock) {
      if (triggerToast) triggerToast('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    const selectedGame = MOCK_GAMES.find(g => g.id === addGameId);
    const priceNum = Number(addPrice);
    const stockNum = Number(addStock);

    const newListing = {
      id: `custom-item-${Date.now()}`,
      gameId: addGameId,
      gameName: selectedGame ? selectedGame.name : 'Unknown Game',
      name: addItemName.trim(),
      price: priceNum,
      stock: stockNum,
      region: addRegion,
      category: addCategory,
      badge: addBadge,
      sellerName: currentUser ? currentUser.name : 'Người Bán'
    };

    // Add to seller listings state AND save to localStorage
    const updatedListings = [newListing, ...sellerListings];
    setSellerListings(updatedListings);
    try {
      localStorage.setItem('g2g_seller_listings', JSON.stringify(updatedListings));
    } catch (e) { console.error(e); }

    if (triggerToast) triggerToast(`Đã đăng bán "${addItemName}" thành công và cập nhật vào cửa hàng!`);

    // Clear Form
    setAddItemName('');
    setAddPrice('');
    setAddStock('');
    setAddDescription('');
    setAddCategory('coins');

    // Switch to listings tab
    setSellerTab('listings');
  };

  // Handle deleting listing
  const handleDeleteListing = (id) => {
    const updatedListings = sellerListings.filter(item => item.id !== id);
    setSellerListings(updatedListings);
    try {
      localStorage.setItem('g2g_seller_listings', JSON.stringify(updatedListings));
    } catch (e) { console.error(e); }

    if (triggerToast) triggerToast('Đã xóa sản phẩm khỏi danh sách đăng bán.');
  };

  // Handle editing listing
  const startEditing = (item) => {
    setEditingId(item.id);
    setEditPrice(item.price);
    setEditStock(item.stock);
  };

  const saveEditListing = (id) => {
    const updatedPrice = Number(editPrice);
    const updatedStock = Number(editStock);

    setSellerListings(sellerListings.map(item => {
      if (item.id === id) {
        return { ...item, price: updatedPrice, stock: updatedStock };
      }
      return item;
    }));

    setEditingId(null);
    if (triggerToast) triggerToast('Cập nhật giá và kho hàng thành công!');
  };

  // Handle order delivery
  const handleDeliverOrder = (order) => {
    setSellerOrders(sellerOrders.map(o => {
      if (o.id === order.id) {
        return { ...o, status: 'completed' };
      }
      return o;
    }));

    const totalAmount = order.price * order.qty;
    const appFee = totalAmount * 0.10;
    const netEarnings = totalAmount - appFee;

    // Credit seller wallet
    setSellerWalletBalance(prev => {
      const updated = prev + netEarnings;
      localStorage.setItem(`g2g_seller_wallet_balance_${currentUser.name}`, String(updated));
      return updated;
    });

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

    const updatedTxs = [newTx, ...sellerWalletTransactions];
    setSellerWalletTransactions(updatedTxs);
    localStorage.setItem(`g2g_seller_wallet_transactions_${currentUser.name}`, JSON.stringify(updatedTxs));

    if (triggerToast) {
      triggerToast(`Đã giao hàng! Cộng +${netEarnings.toLocaleString('vi-VN')}₫ (Đã trừ 10% phí: -${appFee.toLocaleString('vi-VN')}₫ chuyển Admin G2G).`);
    }
  };

  // Handle withdrawal submission
  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    const amountNum = Number(withdrawAmount);

    if (!withdrawAccount || !withdrawName || !withdrawAmount) {
      if (triggerToast) triggerToast('Vui lòng nhập đầy đủ thông tin rút tiền!');
      return;
    }

    if (amountNum <= 0) {
      if (triggerToast) triggerToast('Số tiền rút không hợp lệ!');
      return;
    }

    if (amountNum > sellerWalletBalance) {
      if (triggerToast) triggerToast('Số dư ví không đủ để thực hiện giao dịch!');
      return;
    }

    // Deduct balance
    setSellerWalletBalance(prev => prev - amountNum);

    // Add transaction log
    const methodText = withdrawMethod === 'momo' ? 'Ví MoMo' :
      withdrawMethod === 'zalopay' ? 'Ví ZaloPay' : 'Tài khoản Ngân hàng';
    const newTx = {
      id: `T-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('vi-VN'),
      type: 'withdraw',
      description: `Rút tiền về ${methodText} (${withdrawAccount})`,
      amount: -amountNum
    };
    setSellerWalletTransactions([newTx, ...sellerWalletTransactions]);

    if (triggerToast) triggerToast(`Yêu cầu rút tiền ${formatCurrency(amountNum)} đã được xử lý thành công!`);

    // Clear inputs
    setWithdrawAmount('');
    setWithdrawAccount('');
    setWithdrawName('');
  };

  // Show normal landing page if user is not logged in or not a registered seller
  if (!currentUser || !currentUser.isSeller) {
    return (
      <div className="seller-landing-container">
        <style>{`
          .seller-landing-container {
            background-color: #121315;
            color: #ffffff;
            min-height: 80vh;
            display: flex;
            align-items: center;
            position: relative;
            overflow: hidden;
            font-family: 'Outfit', 'Inter', -apple-system, sans-serif;
            padding: 60px 0;
            width: 100%;
            box-sizing: border-box;
          }
          .seller-landing-bg-gradient {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: radial-gradient(circle at 80% 50%, #850c0c 0%, #300404 50%, #121315 100%);
            z-index: 1;
          }
          .seller-landing-bg-shape {
            position: absolute;
            width: 600px;
            height: 600px;
            background: radial-gradient(circle, rgba(230, 22, 45, 0.15) 0%, rgba(0,0,0,0) 70%);
            right: 5%;
            top: 5%;
            z-index: 1;
            border-radius: 50%;
            filter: blur(50px);
          }
          .seller-landing-dots {
            position: absolute;
            right: 4%;
            top: 15%;
            width: 120px;
            height: 160px;
            background-image: radial-gradient(#e6162d 1.5px, transparent 1.5px);
            background-size: 16px 16px;
            opacity: 0.25;
            z-index: 1;
          }
          .seller-landing-content {
            position: relative;
            z-index: 2;
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 24px;
            box-sizing: border-box;
          }
          .seller-landing-banner {
            display: grid;
            grid-template-columns: 1.2fr 1fr;
            gap: 48px;
            align-items: center;
          }
          .seller-landing-left {
            position: relative;
            z-index: 3;
            animation: g2gFadeInLeft 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .seller-landing-title {
            font-size: 48px;
            font-weight: 800;
            line-height: 1.1;
            color: #ffffff;
            margin-top: 0;
            margin-bottom: 24px;
            letter-spacing: -1.5px;
            text-transform: uppercase;
          }
          .seller-landing-subtitle {
            font-size: 16px;
            color: #d1d5db;
            line-height: 1.6;
            margin-bottom: 36px;
            max-width: 500px;
          }
          .seller-landing-btn-register {
            display: inline-block;
            background-color: #ff3333;
            color: #ffffff;
            padding: 16px 40px;
            font-size: 16px;
            font-weight: 700;
            border-radius: 8px;
            border: none;
            cursor: pointer;
            box-shadow: 0 6px 20px rgba(255, 51, 51, 0.4);
            transition: all 0.25s ease;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .seller-landing-btn-register:hover {
            background-color: #e02b2b;
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(255, 51, 51, 0.6);
          }
          .seller-landing-right {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 3;
            animation: g2gFadeInRight 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .seller-landing-hero-img-wrapper {
            position: relative;
            width: 100%;
            max-width: 480px;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);
            border: 1px solid rgba(255, 255, 255, 0.08);
            background-color: rgba(27, 28, 30, 0.3);
            backdrop-filter: blur(12px);
          }
          .seller-landing-hero-img {
            width: 100%;
            height: auto;
            display: block;
            object-fit: cover;
          }
          @keyframes g2gFadeInLeft {
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes g2gFadeInRight {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @media (max-width: 991px) {
            .seller-landing-banner {
              grid-template-columns: 1fr;
              text-align: center;
              gap: 40px;
            }
            .seller-landing-title { font-size: 38px; }
            .seller-landing-subtitle { margin-left: auto; margin-right: auto; }
            .seller-landing-hero-img-wrapper { margin-left: auto; margin-right: auto; }
          }
        `}</style>

        <div className="seller-landing-bg-gradient"></div>
        <div className="seller-landing-bg-shape"></div>
        <div className="seller-landing-dots"></div>

        <div className="seller-landing-content">
          <div className="seller-landing-banner">
            <div className="seller-landing-left">
              <h1 className="seller-landing-title">
                VƯƠN RA TOÀN<br />CẦU<br />BÁN HÀNG THÔNG<br />MINH HƠN
              </h1>
              <p className="seller-landing-subtitle">
                Tiếp cận hàng triệu người dùng trên toàn thế giới mà không tốn chi phí đăng ký làm người bán.
              </p>
              {currentUser && currentUser.sellerStatus === 'pending' ? (
                <div style={{
                  background: 'rgba(251, 191, 36, 0.1)',
                  border: '1.5px solid #fbbf24',
                  borderRadius: '10px',
                  padding: '20px',
                  color: '#fbbf24',
                  maxWidth: '500px',
                  fontWeight: 600,
                  fontSize: '14.5px',
                  lineHeight: '1.5',
                  boxShadow: '0 8px 24px rgba(251, 191, 36, 0.15)'
                }}>
                  ⏳ Yêu cầu lên người bán của bạn đang chờ Admin duyệt. Vui lòng quay lại sau!
                </div>
              ) : currentUser && currentUser.sellerStatus === 'rejected' ? (
                <div style={{ maxWidth: '500px' }}>
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1.5px solid #ef4444',
                    borderRadius: '10px',
                    padding: '20px',
                    color: '#ff8888',
                    fontWeight: 600,
                    fontSize: '14.5px',
                    lineHeight: '1.5',
                    marginBottom: '16px',
                    boxShadow: '0 8px 24px rgba(239, 68, 68, 0.15)'
                  }}>
                    ❌ Yêu cầu lên người bán trước đây của bạn đã bị từ chối do:
                    <div style={{ color: '#ffffff', marginTop: '8px', padding: '10px', background: '#17181c', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '13.5px', fontWeight: 'normal' }}>
                      {currentUser.sellerRejectReason || 'Không đủ điều kiện xét duyệt.'}
                    </div>
                  </div>
                  <button className="seller-landing-btn-register" onClick={handleRegisterClick}>
                    Gửi lại yêu cầu xét duyệt mới
                  </button>
                </div>
              ) : (
                <button className="seller-landing-btn-register" onClick={handleRegisterClick}>
                  Đăng ký ngay
                </button>
              )}
            </div>

            <div className="seller-landing-right">
              <div className="seller-landing-hero-img-wrapper">
                <svg viewBox="0 0 500 350" fill="none" style={{ background: '#1c1d22', display: 'block', width: '100%' }}>
                  <rect x="20" y="20" width="460" height="310" rx="12" fill="#131417" />
                  {/* Header bar of fake window */}
                  <rect x="20" y="20" width="460" height="40" rx="12" fill="#1b1c21" />
                  <circle cx="45" cy="40" r="5" fill="#ff5f56" />
                  <circle cx="60" cy="40" r="5" fill="#ffbd2e" />
                  <circle cx="75" cy="40" r="5" fill="#27c93f" />
                  <text x="250" y="45" fill="#7d7e82" fontSize="12" textAnchor="middle" fontFamily="sans-serif">Sales Analytics Dashboard</text>

                  {/* Card mockup */}
                  <rect x="40" y="80" width="160" height="90" rx="8" fill="#1c1e24" />
                  <text x="55" y="105" fill="#7d7e82" fontSize="11" fontFamily="sans-serif">Tổng doanh thu</text>
                  <text x="55" y="135" fill="#ffffff" fontSize="18" fontWeight="bold" fontFamily="sans-serif">4.85M VND</text>

                  <rect x="215" y="80" width="105" height="90" rx="8" fill="#1c1e24" />
                  <text x="230" y="105" fill="#7d7e82" fontSize="11" fontFamily="sans-serif">Đơn hàng</text>
                  <text x="230" y="135" fill="#34c759" fontSize="20" fontWeight="bold" fontFamily="sans-serif">14</text>

                  <rect x="335" y="80" width="125" height="90" rx="8" fill="#1c1e24" />
                  <text x="350" y="105" fill="#7d7e82" fontSize="11" fontFamily="sans-serif">Tỷ lệ giao hàng</text>
                  <text x="350" y="135" fill="#5856d6" fontSize="20" fontWeight="bold" fontFamily="sans-serif">99.2%</text>

                  {/* Line graph mockup */}
                  <rect x="40" y="190" width="420" height="110" rx="8" fill="#1c1e24" />
                  <path d="M 60 270 Q 140 220 220 250 T 380 210 L 440 240" fill="none" stroke="#ff3333" strokeWidth="3" />
                  <circle cx="220" cy="250" r="4" fill="#ffffff" stroke="#ff3333" strokeWidth="2" />
                  <circle cx="380" cy="210" r="4" fill="#ffffff" stroke="#ff3333" strokeWidth="2" />
                  <text x="220" y="235" fill="#ffffff" fontSize="10" bg="black" textAnchor="middle" fontFamily="sans-serif" fontWeight="bold">Peak Day</text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Seller Dashboard
  return (
    <div className="seller-dashboard-wrapper">
      <style>{`
        .seller-dashboard-wrapper {
          background-color: #131417;
          color: #ffffff;
          min-height: 85vh;
          font-family: 'Outfit', 'Inter', sans-serif;
          box-sizing: border-box;
          width: 100%;
        }
        
        .seller-dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 30px 24px;
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 30px;
        }

        /* Sidebar Navigation */
        .seller-dashboard-sidebar {
          background-color: #1a1c21;
          border-radius: 12px;
          padding: 20px 12px;
          height: fit-content;
          border: 1px solid rgba(255,255,255,0.04);
        }

        .seller-sidebar-title {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #72767d;
          font-weight: 700;
          margin-bottom: 16px;
          padding-left: 12px;
        }

        .seller-sidebar-menu {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .seller-sidebar-item {
          padding: 12px 14px;
          border-radius: 8px;
          font-size: 13.5px;
          font-weight: 600;
          color: #dbdee1;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .seller-sidebar-item:hover {
          background-color: #2e3035;
          color: #ffffff;
        }

        .seller-sidebar-item.active {
          background-color: #ff3333;
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(255, 51, 51, 0.25);
        }

        /* Dashboard Content Area */
        .seller-dashboard-content {
          min-height: 500px;
        }

        /* Card Widgets */
        .seller-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 24px;
        }

        .seller-stat-card {
          background-color: #1a1c21;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid rgba(255,255,255,0.04);
          position: relative;
          overflow: hidden;
        }

        .seller-stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .seller-stat-label {
          font-size: 13px;
          color: #9ea2a9;
          font-weight: 500;
        }

        .seller-stat-value {
          font-size: 22px;
          font-weight: 800;
          color: #ffffff;
        }

        .seller-stat-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background-color: rgba(255, 255, 255, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ff3333;
        }

        /* Chart card styling */
        .seller-chart-card {
          background-color: #1a1c21;
          border-radius: 12px;
          padding: 24px;
          border: 1px solid rgba(255,255,255,0.04);
          margin-bottom: 24px;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .chart-title {
          font-size: 16px;
          font-weight: 700;
        }

        .chart-period-badge {
          padding: 5px 10px;
          background-color: #2b2d31;
          border-radius: 6px;
          font-size: 11px;
          color: #9ea2a9;
          font-weight: 600;
        }

        .svg-chart-container {
          position: relative;
          width: 100%;
          height: 180px;
        }

        .svg-chart-graph {
          width: 100%;
          height: 100%;
        }

        .chart-tooltip {
          position: absolute;
          background: #111214;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 6px;
          padding: 8px 12px;
          pointer-events: none;
          font-size: 11.5px;
          z-index: 10;
          box-shadow: 0 4px 16px rgba(0,0,0,0.5);
          transform: translate(-50%, -100%);
          margin-top: -10px;
        }

        .chart-tooltip-date {
          color: #72767d;
          margin-bottom: 3px;
        }

        .chart-tooltip-val {
          color: #ff3333;
          font-weight: 700;
        }

        /* Tables style */
        .seller-table-card {
          background-color: #1a1c21;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid rgba(255,255,255,0.04);
        }

        .table-card-title {
          font-size: 16px;
          font-weight: 700;
          margin-top: 0;
          margin-bottom: 20px;
        }

        .seller-data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .seller-data-table th {
          padding: 12px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          color: #72767d;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .seller-data-table td {
          padding: 14px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          font-size: 13.5px;
          color: #dbdee1;
        }

        .seller-data-table tr:last-child td {
          border-bottom: none;
        }

        /* Status colors */
        .status-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .status-badge.pending {
          background-color: rgba(240, 160, 0, 0.15);
          color: #f0a000;
        }

        .status-badge.completed {
          background-color: rgba(35, 165, 90, 0.15);
          color: #23a55a;
        }

        /* Forms style */
        .seller-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .seller-form-group {
          margin-bottom: 18px;
        }

        .seller-form-group.full-width {
          grid-column: 1 / -1;
        }

        .seller-input-label {
          display: block;
          color: #9ea2a9;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .seller-form-input {
          width: 100%;
          background-color: #121316;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 6px;
          color: #ffffff;
          padding: 12px 14px;
          font-size: 13.5px;
          box-sizing: border-box;
          font-family: inherit;
        }

        .seller-form-input:focus {
          outline: none;
          border-color: #ff3333;
        }

        .seller-btn-primary {
          background-color: #ff3333;
          color: #ffffff;
          border: none;
          border-radius: 6px;
          padding: 12px 24px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: background-color 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .seller-btn-primary:hover {
          background-color: #e02b2b;
        }

        .seller-btn-outline {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.12);
          color: #dbdee1;
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .seller-btn-outline:hover {
          background-color: #2b2d31;
          color: #ffffff;
          border-color: #ffffff;
        }

        .seller-btn-danger {
          background: transparent;
          border: 1px solid #ff3b30;
          color: #ff3b30;
          border-radius: 6px;
          padding: 8px 12px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .seller-btn-danger:hover {
          background-color: rgba(255, 59, 48, 0.1);
        }

        /* Wallet view styles */
        .wallet-layout {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 24px;
        }

        .wallet-header-card {
          background: linear-gradient(135deg, #1d1836 0%, #110d21 100%);
          border-radius: 12px;
          padding: 24px;
          border: 1px solid rgba(91, 33, 182, 0.15);
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          grid-column: 1 / -1;
        }

        .wallet-balance-title {
          font-size: 13px;
          color: #b39ddb;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .wallet-balance-amount {
          font-size: 32px;
          font-weight: 900;
          color: #ffffff;
          text-shadow: 0 2px 10px rgba(91, 33, 182, 0.3);
        }

        .tx-amount {
          font-weight: 700;
          font-size: 13.5px;
        }
        
        .tx-amount.positive {
          color: #23a55a;
        }
        
        .tx-amount.negative {
          color: #ff3b30;
        }

        .inline-edit-group {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .inline-edit-input {
          background-color: #121316;
          border: 1px solid rgba(255,255,255,0.12);
          color: #ffffff;
          border-radius: 4px;
          padding: 6px 10px;
          font-size: 12.5px;
          width: 80px;
        }

        @media (max-width: 991px) {
          .seller-dashboard-container {
            grid-template-columns: 1fr;
          }
          .seller-form-grid, .wallet-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="seller-dashboard-container">
        {/* Sidebar Navigation */}
        <aside className="seller-dashboard-sidebar">
          <div className="seller-sidebar-title">Bán hàng</div>
          <ul className="seller-sidebar-menu">
            <li
              className={`seller-sidebar-item ${sellerTab === 'overview' ? 'active' : ''}`}
              onClick={() => setSellerTab('overview')}
            >
              📊 Tổng quan
            </li>
            <li
              className={`seller-sidebar-item ${sellerTab === 'add-listing' ? 'active' : ''}`}
              onClick={() => setSellerTab('add-listing')}
            >
              ➕ Đăng bán sản phẩm
            </li>
            <li
              className={`seller-sidebar-item ${sellerTab === 'listings' ? 'active' : ''}`}
              onClick={() => setSellerTab('listings')}
            >
              📦 Quản lý sản phẩm
            </li>
            <li
              className={`seller-sidebar-item ${sellerTab === 'orders' ? 'active' : ''}`}
              onClick={() => setSellerTab('orders')}
            >
              📥 Đơn hàng bán
            </li>
            <li
              className={`seller-sidebar-item ${sellerTab === 'wallet' ? 'active' : ''}`}
              onClick={() => setSellerTab('wallet')}
            >
              💳 Ví &amp; Doanh thu
            </li>
          </ul>
        </aside>

        {/* Main Content Areas based on tabs */}
        <section className="seller-dashboard-content">
          {/* TAB 1: OVERVIEW */}
          {sellerTab === 'overview' && (
            <div>
              {/* Summary stats widgets */}
              <div className="seller-stats-grid">
                <div className="seller-stat-card">
                  <div className="seller-stat-header">
                    <span className="seller-stat-label">Số dư khả dụng</span>
                    <div className="seller-stat-icon">💰</div>
                  </div>
                  <div className="seller-stat-value">{formatCurrency(sellerWalletBalance)}</div>
                </div>

                <div className="seller-stat-card">
                  <div className="seller-stat-header">
                    <span className="seller-stat-label">Chờ giao hàng</span>
                    <div className="seller-stat-icon">📥</div>
                  </div>
                  <div className="seller-stat-value">
                    {myOrders.filter(o => o.status === 'pending').length} đơn hàng
                  </div>
                </div>

                <div className="seller-stat-card">
                  <div className="seller-stat-header">
                    <span className="seller-stat-label">Sản phẩm đang bán</span>
                    <div className="seller-stat-icon">📦</div>
                  </div>
                  <div className="seller-stat-value">{myListings.length} sản phẩm</div>
                </div>

                <div className="seller-stat-card">
                  <div className="seller-stat-header">
                    <span className="seller-stat-label">Tỷ lệ hoàn thành</span>
                    <div className="seller-stat-icon">📈</div>
                  </div>
                  <div className="seller-stat-value" style={{ color: '#23a55a' }}>99.2%</div>
                </div>
              </div>

              {/* Revenue Chart Section */}
              <div className="seller-chart-card">
                <div className="chart-header">
                  <span className="chart-title">Thống kê doanh thu (Sales analytics)</span>
                  <span className="chart-period-badge">7 ngày qua</span>
                </div>

                <div className="svg-chart-container">
                  <svg className="svg-chart-graph" viewBox="0 0 500 150">
                    {/* SVG Definitions */}
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ff3333" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#ff3333" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Dotted Grid lines */}
                    <line x1="10" y1="20" x2="490" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
                    <line x1="10" y1="65" x2="490" y2="65" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />
                    <line x1="10" y1="110" x2="490" y2="110" stroke="rgba(255,255,255,0.05)" strokeDasharray="3,3" />

                    {/* Chart Paths */}
                    {/* Generates curve dynamically based on points */}
                    {/* Width is 480 (from 10 to 490), divided by 6 gaps = 80 per step */}
                    {/* Height scale: max value mapped to y=20, 0 mapped to y=120 */}
                    <path
                      d={`M 10 ${120 - (chartData[0].sales / maxSales) * 100} 
                          L 90 ${120 - (chartData[1].sales / maxSales) * 100} 
                          L 170 ${120 - (chartData[2].sales / maxSales) * 100} 
                          L 250 ${120 - (chartData[3].sales / maxSales) * 100} 
                          L 330 ${120 - (chartData[4].sales / maxSales) * 100} 
                          L 410 ${120 - (chartData[5].sales / maxSales) * 100} 
                          L 490 ${120 - (chartData[6].sales / maxSales) * 100}`}
                      fill="none"
                      stroke="#ff3333"
                      strokeWidth="2.5"
                    />

                    {/* Fill Area below line */}
                    <path
                      d={`M 10 ${120 - (chartData[0].sales / maxSales) * 100} 
                          L 90 ${120 - (chartData[1].sales / maxSales) * 100} 
                          L 170 ${120 - (chartData[2].sales / maxSales) * 100} 
                          L 250 ${120 - (chartData[3].sales / maxSales) * 100} 
                          L 330 ${120 - (chartData[4].sales / maxSales) * 100} 
                          L 410 ${120 - (chartData[5].sales / maxSales) * 100} 
                          L 490 ${120 - (chartData[6].sales / maxSales) * 100}
                          L 490 130 L 10 130 Z`}
                      fill="url(#chartGradient)"
                    />

                    {/* Node points and interactivity */}
                    {chartData.map((d, index) => {
                      const cx = 10 + index * 80;
                      const cy = 120 - (d.sales / maxSales) * 100;
                      return (
                        <g key={index}>
                          <circle
                            cx={cx}
                            cy={cy}
                            r={hoveredPoint && hoveredPoint.index === index ? "6" : "4"}
                            fill="#ffffff"
                            stroke="#ff3333"
                            strokeWidth={hoveredPoint && hoveredPoint.index === index ? "3" : "2"}
                            onMouseEnter={() => setHoveredPoint({ ...d, index, x: cx, y: cy })}
                            onMouseLeave={() => setHoveredPoint(null)}
                            style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                          />
                          <text
                            x={cx}
                            y="145"
                            fill="#72767d"
                            fontSize="10"
                            textAnchor="middle"
                            fontFamily="inherit"
                          >
                            {d.date}
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  {/* Interactive Chart Tooltip */}
                  {hoveredPoint && (
                    <div
                      className="chart-tooltip"
                      style={{
                        left: `${(hoveredPoint.x / 500) * 100}%`,
                        top: `${(hoveredPoint.y / 150) * 100}%`
                      }}
                    >
                      <div className="chart-tooltip-date">Ngày {hoveredPoint.date}</div>
                      <div className="chart-tooltip-val">{formatCurrency(hoveredPoint.sales)}</div>
                      <div style={{ fontSize: '10px', color: '#9ea2a9', marginTop: '2px' }}>
                        {hoveredPoint.orders} đơn hàng
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Best selling list */}
              <div className="seller-table-card">
                <h3 className="table-card-title">Sản phẩm bán chạy nhất</h3>
                <table className="seller-data-table">
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>Game</th>
                      <th>Giá bán</th>
                      <th>Đã bán</th>
                      <th>Doanh thu</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>800 Robux (Giao hàng tự động)</td>
                      <td>Roblox Robux (Global)</td>
                      <td>185,000 ₫</td>
                      <td>14 sản phẩm</td>
                      <td style={{ color: '#23a55a', fontWeight: 'bold' }}>2,590,000 ₫</td>
                    </tr>
                    <tr>
                      <td>1000 VP Code Nạp Ngay</td>
                      <td>Valorant Points (VP)</td>
                      <td>180,000 ₫</td>
                      <td>6 sản phẩm</td>
                      <td style={{ color: '#23a55a', fontWeight: 'bold' }}>1,080,000 ₫</td>
                    </tr>
                    <tr>
                      <td>Acc Cao Thủ 45 Skin Trắng TT</td>
                      <td>Liên Quân Mobile - Tài Khoản VIP</td>
                      <td>140,000 ₫</td>
                      <td>1 sản phẩm</td>
                      <td style={{ color: '#23a55a', fontWeight: 'bold' }}>140,000 ₫</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: ADD LISTING FORM */}
          {sellerTab === 'add-listing' && (
            <div className="seller-table-card">
              <h3 className="table-card-title">Đăng bán sản phẩm mới</h3>
              <form onSubmit={handleAddListingSubmit}>
                <div className="seller-form-grid">
                  <div className="seller-form-group">
                    <label className="seller-input-label">Chọn Trò chơi</label>
                    <select
                      className="seller-form-input"
                      value={addGameId}
                      onChange={(e) => {
                        const newGameId = e.target.value;
                        setAddGameId(newGameId);
                        const selectedGameObj = MOCK_GAMES.find(g => g.id === newGameId);
                        if (selectedGameObj && selectedGameObj.category) {
                          setAddCategory(selectedGameObj.category);
                        }
                      }}
                    >
                      {MOCK_GAMES.map(g => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="seller-form-group">
                    <label className="seller-input-label">Danh mục sản phẩm</label>
                    <select
                      className="seller-form-input"
                      value={addCategory}
                      onChange={(e) => setAddCategory(e.target.value)}
                    >
                      <option value="coins">Tiền tệ (Coins)</option>
                      <option value="accounts">Tài khoản VIP</option>
                      <option value="cards">Thẻ quà tặng / Thẻ nạp</option>
                      <option value="boosting">Cày thuê (Boosting)</option>
                      <option value="items">Vật phẩm (Items)</option>
                    </select>
                  </div>

                  <div className="seller-form-group">
                    <label className="seller-input-label">Máy chủ / Khu vực</label>
                    <input
                      type="text"
                      className="seller-form-input"
                      placeholder="Ví dụ: Global, Vietnam, Asia..."
                      value={addRegion}
                      onChange={(e) => setAddRegion(e.target.value)}
                      required
                    />
                  </div>

                  <div className="seller-form-group">
                    <label className="seller-input-label">Nhãn nổi bật (Badge)</label>
                    <select
                      className="seller-form-input"
                      value={addBadge}
                      onChange={(e) => setAddBadge(e.target.value)}
                    >
                      <option value="Auto Send">Giao tự động (Auto Send)</option>
                      <option value="Instant Deliver">Giao ngay lập tức (Instant)</option>
                      <option value="Best Price">Giá rẻ nhất (Best Price)</option>
                      <option value="Secure Account">Acc an toàn (Secure)</option>
                    </select>
                  </div>

                  <div className="seller-form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="seller-input-label">Tên sản phẩm / Gói nạp</label>
                    <input
                      type="text"
                      className="seller-form-input"
                      placeholder="Ví dụ: Gói nạp 1000 Kim Cương Garena Free Fire..."
                      value={addItemName}
                      onChange={(e) => setAddItemName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="seller-form-group">
                    <label className="seller-input-label">Đơn giá bán (VND)</label>
                    <input
                      type="number"
                      className="seller-form-input"
                      placeholder="Ví dụ: 150000"
                      value={addPrice}
                      onChange={(e) => setAddPrice(e.target.value)}
                      min="1000"
                      required
                    />
                  </div>

                  <div className="seller-form-group">
                    <label className="seller-input-label">Số lượng kho có sẵn</label>
                    <input
                      type="number"
                      className="seller-form-input"
                      placeholder="Ví dụ: 100 (Acc VIP thì nhập 1)"
                      value={addStock}
                      onChange={(e) => setAddStock(e.target.value)}
                      min="1"
                      required
                    />
                  </div>

                  <div className="seller-form-group full-width">
                    <label className="seller-input-label">Mô tả sản phẩm</label>
                    <textarea
                      className="seller-form-input"
                      rows="4"
                      placeholder="Nhập thông tin nạp thẻ, tài khoản hoặc liên hệ giao hàng chi tiết..."
                      value={addDescription}
                      onChange={(e) => setAddDescription(e.target.value)}
                      style={{ resize: 'vertical' }}
                    ></textarea>
                  </div>
                </div>

                <button type="submit" className="seller-btn-primary" style={{ marginTop: '10px' }}>
                  <span>🚀</span> Đăng bán công khai
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: MANAGE LISTINGS */}
          {sellerTab === 'listings' && (
            <div className="seller-table-card">
              <h3 className="table-card-title">Quản lý sản phẩm đang bán</h3>
              {myListings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#72767d' }}>
                  Bạn chưa có sản phẩm nào đăng bán. Hãy nhấn tab "Đăng bán sản phẩm" để đăng bán.
                </div>
              ) : (
                <table className="seller-data-table">
                  <thead>
                    <tr>
                      <th>Trò chơi</th>
                      <th>Tên sản phẩm</th>
                      <th>Khu vực</th>
                      <th style={{ width: '120px' }}>Đơn giá (VND)</th>
                      <th style={{ width: '100px' }}>Kho hàng</th>
                      <th style={{ width: '160px', textAlign: 'right' }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myListings.map((item) => (
                      <tr key={item.id}>
                        <td style={{ fontWeight: 'bold' }}>{item.gameName}</td>
                        <td>{item.name}</td>
                        <td><span className="status-badge" style={{ background: '#2f3136', color: '#dbdee1' }}>{item.region}</span></td>
                        <td>
                          {editingId === item.id ? (
                            <input
                              type="number"
                              className="inline-edit-input"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                            />
                          ) : (
                            formatCurrency(item.price)
                          )}
                        </td>
                        <td>
                          {editingId === item.id ? (
                            <input
                              type="number"
                              className="inline-edit-input"
                              value={editStock}
                              onChange={(e) => setEditStock(e.target.value)}
                            />
                          ) : (
                            `${item.stock} gói`
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {editingId === item.id ? (
                            <div className="inline-edit-group" style={{ justifyContent: 'flex-end' }}>
                              <button
                                className="seller-btn-outline"
                                style={{ borderColor: '#23a55a', color: '#23a55a' }}
                                onClick={() => saveEditListing(item.id)}
                              >
                                Lưu
                              </button>
                              <button className="seller-btn-danger" onClick={() => setEditingId(null)}>Hủy</button>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                              <button className="seller-btn-outline" onClick={() => startEditing(item)}>Sửa</button>
                              <button className="seller-btn-danger" onClick={() => handleDeleteListing(item.id)}>Xóa</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* TAB 4: SALES ORDERS */}
          {sellerTab === 'orders' && (
            <div className="seller-table-card">
              <h3 className="table-card-title">Đơn hàng của khách hàng</h3>
              {myOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: '#72767d' }}>
                  Hiện tại bạn chưa nhận được đơn hàng mua nào.
                </div>
              ) : (
                <table className="seller-data-table">
                  <thead>
                    <tr>
                      <th>Mã đơn</th>
                      <th>Ngày</th>
                      <th>Game / Sản phẩm</th>
                      <th>Người mua</th>
                      <th>Tổng tiền</th>
                      <th>Trạng thái</th>
                      <th style={{ textAlign: 'right' }}>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myOrders.map((order) => (
                      <tr key={order.id}>
                        <td style={{ color: '#ff3333', fontWeight: 'bold' }}>{order.id}</td>
                        <td>{order.date}</td>
                        <td>
                          <div><strong>{order.gameName}</strong></div>
                          <div style={{ fontSize: '11px', color: '#9ea2a9' }}>{order.itemName} (x{order.qty})</div>
                        </td>
                        <td>{order.buyerName}</td>
                        <td style={{ fontWeight: 'bold' }}>{formatCurrency(order.price * order.qty)}</td>
                        <td>
                          <span className={`status-badge ${order.status}`}>
                            {order.status === 'pending' ? 'Chờ giao hàng' : 'Đã hoàn thành'}
                          </span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {order.status === 'pending' ? (
                            <button
                              className="seller-btn-primary"
                              style={{ padding: '6px 12px', fontSize: '12px', float: 'right' }}
                              onClick={() => handleDeliverOrder(order)}
                            >
                              🚀 Giao hàng ngay
                            </button>
                          ) : (
                            <span style={{ color: '#72767d', fontSize: '12px' }}>Đã thanh toán ví</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* TAB 5: WALLET & TRANSACTION HISTORY */}
          {sellerTab === 'wallet' && (
            <div className="wallet-layout">
              {/* Wallet large widget */}
              <div className="wallet-header-card">
                <div>
                  <div className="wallet-balance-title">Số dư tài khoản ví người bán</div>
                  <div className="wallet-balance-amount">{formatCurrency(sellerWalletBalance)}</div>
                </div>
                <div style={{ fontSize: '32px' }}>💳</div>
              </div>

              {/* Request Withdrawal Form */}
              <div className="seller-table-card">
                <h3 className="table-card-title">Yêu cầu rút tiền</h3>
                <form onSubmit={handleWithdrawSubmit}>
                  <div className="seller-form-group">
                    <label className="seller-input-label">Phương thức nhận tiền</label>
                    <select
                      className="seller-form-input"
                      value={withdrawMethod}
                      onChange={(e) => setWithdrawMethod(e.target.value)}
                    >
                      <option value="momo">Ví MoMo</option>
                      <option value="zalopay">Ví ZaloPay</option>
                      <option value="bank">Chuyển khoản Ngân hàng (Vietcombank)</option>
                    </select>
                  </div>

                  <div className="seller-form-group">
                    <label className="seller-input-label">Số tài khoản / Số điện thoại ví</label>
                    <input
                      type="text"
                      className="seller-form-input"
                      placeholder="Ví dụ: 0987654321 hoặc 1029384756..."
                      value={withdrawAccount}
                      onChange={(e) => setWithdrawAccount(e.target.value)}
                      required
                    />
                  </div>

                  <div className="seller-form-group">
                    <label className="seller-input-label">Tên chủ tài khoản (Không dấu)</label>
                    <input
                      type="text"
                      className="seller-form-input"
                      placeholder="Ví dụ: NGUYEN VAN A"
                      value={withdrawName}
                      onChange={(e) => setWithdrawName(e.target.value.toUpperCase())}
                      required
                    />
                  </div>

                  <div className="seller-form-group">
                    <label className="seller-input-label">Số tiền rút (VND)</label>
                    <input
                      type="number"
                      className="seller-form-input"
                      placeholder="Tối thiểu 50,000 ₫"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      min="50000"
                      required
                    />
                  </div>

                  <button type="submit" className="seller-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                    Yêu cầu chuyển tiền
                  </button>
                </form>
              </div>

              {/* Transaction History log */}
              <div className="seller-table-card">
                <h3 className="table-card-title">Lịch sử giao dịch</h3>
                {sellerWalletTransactions.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#72767d' }}>
                    Chưa ghi nhận giao dịch nào.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {sellerWalletTransactions.map((tx) => (
                      <div 
                        key={tx.id}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingBottom: '12px',
                          borderBottom: '1px solid rgba(255,255,255,0.04)'
                        }}
                      >
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 'bold' }}>{tx.description}</div>
                      <div style={{ fontSize: '11px', color: '#72767d', marginTop: '3px' }}>Mã GD: {tx.id} | {tx.date}</div>
                    </div>
                    <div className={`tx-amount ${tx.amount > 0 ? 'positive' : 'negative'}`}>
                      {tx.amount > 0 ? `+${formatCurrency(tx.amount)}` : formatCurrency(tx.amount)}
                    </div>
                  </div>
                ))}
              </div>
                )}
            </div>
            </div>
          )}
    </section>
      </div >
    </div >
  );
}
