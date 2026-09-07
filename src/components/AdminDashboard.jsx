import React, { useState, useEffect } from 'react';
import adminApi from '../API/adminApi';
import productApi, { GAME_MAP } from '../API/ProductApi';

export default function AdminDashboard({ currentUser, triggerToast }) {
  const [users, setUsers] = useState([]);
  const [globalListings, setGlobalListings] = useState([]);
  const [activeTab, setActiveTab] = useState('requests'); // 'users' | 'requests' | 'products'
  const [rejectMail, setRejectMail] = useState(null);
  const [rejectReasonText, setRejectReasonText] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch users via adminApi from Supabase Database
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getUsers();
      setUsers(response.data || []);
    } catch (err) {
      console.error("Fetch users failed:", err);
      triggerToast('Lỗi kết nối khi tải danh sách người dùng!', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch all seller listings directly from Database
  const fetchListings = async () => {
    try {
      const response = await productApi.getAll();
      const raw = response.data;
      const list = Array.isArray(raw) ? raw : (raw?.products || []);
      const mapped = list.map(p => {
        const gameMeta = GAME_MAP[p.game_id] || { name: 'Roblox Robux' };
        return {
          id: p.id,
          gameName: gameMeta.name || `Game #${p.game_id}`,
          name: p.product_name,
          sellerName: p.seller_name || `Người bán #${p.seller_id}`,
          sellerId: p.seller_id,
          price: p.price,
          stock: p.stock_quantity,
          server: p.server,
          badge: p.badge
        };
      });
      setGlobalListings(mapped);
    } catch (e) {
      console.error("Error loading products from database:", e);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchListings();
  }, []);

  // Approve Request
  const handleApprove = async (id, mail) => {
    try {
      const response = await adminApi.approveSeller({ id, mail });
      triggerToast(response.data?.message || `Đã phê duyệt người bán thành công: ${mail}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      triggerToast(err.response?.data?.message || err.message || 'Phê duyệt thất bại!', 'error');
    }
  };

  // Open Reject Dialog
  const openRejectDialog = (id, mail) => {
    setRejectMail({ id, mail });
    setRejectReasonText('');
  };

  // Submit Rejection
  const handleRejectSubmit = async () => {
    if (!rejectReasonText.trim()) {
      triggerToast('Vui lòng nhập lý do từ chối!', 'error');
      return;
    }
    const targetId = typeof rejectMail === 'object' ? rejectMail?.id : null;
    const targetMail = typeof rejectMail === 'object' ? rejectMail?.mail : rejectMail;
    try {
      const response = await adminApi.rejectSeller({ id: targetId, mail: targetMail, reason: rejectReasonText.trim() });
      triggerToast(response.data?.message || `Đã từ chối yêu cầu người bán của: ${targetMail}`);
      setRejectMail(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
      triggerToast(err.response?.data?.message || err.message || 'Thao tác thất bại!', 'error');
    }
  };

  // Direct Role Update by ID (không bị nhầm lẫn giữa các email giống nhau)
  const handleRoleUpdate = async (id, mail, role) => {
    try {
      const response = await adminApi.updateRole({ id, mail, role });
      triggerToast(response.data?.message || `Đã chuyển vai trò tài khoản thành ${role === 'seller' ? 'Người bán' : role === 'admin' ? 'Admin' : 'Thành viên'}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
      triggerToast(err.response?.data?.message || err.message || 'Cập nhật thất bại!', 'error');
    }
  };

  // Delete product (Global listing management directly on Database)
  const handleDeleteProduct = async (id) => {
    try {
      await productApi.delete(id);
      triggerToast('Đã gỡ bỏ sản phẩm thành công khỏi Database!');
      fetchListings();
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error(err);
      triggerToast('Gỡ sản phẩm thất bại: ' + (err.response?.data?.message || err.message), 'error');
    }
  };

  const pendingRequests = users.filter(u => u.sellerStatus === 'pending');
  // Lọc chỉ hiển thị các thành viên/người bán thông thường, không hiện tài khoản admin trong danh sách này
  const memberUsers = users.filter(u => u.role !== 'admin');

  return (
    <div className="admin-dashboard-container" style={{
      maxWidth: '1200px', margin: '40px auto', padding: '0 24px',
      fontFamily: "'Outfit', 'Inter', sans-serif", color: '#ffffff'
    }}>
      <style>{`
        .admin-header-card {
          background: linear-gradient(135deg, #1e1b4b 0%, #311042 100%);
          border: 1px solid #2d2f34;
          border-radius: 16px;
          padding: 32px;
          margin-bottom: 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        }
        .admin-header-title {
          font-size: 28px;
          font-weight: 800;
          margin: 0 0 8px;
          background: linear-gradient(90deg, #ff3333 0%, #ff8888 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .admin-stats-row {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }
        .admin-stat-card {
          flex: 1;
          min-width: 220px;
          background: #17181c;
          border: 1px solid #2d2f34;
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          transition: transform 0.2s;
        }
        .admin-stat-card:hover {
          transform: translateY(-2px);
          border-color: #ff3333;
        }
        .admin-stat-val {
          font-size: 32px;
          font-weight: 800;
          color: #ff3333;
          margin-bottom: 4px;
        }
        .admin-stat-label {
          color: #9ea2a9;
          font-size: 13px;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 1px;
        }
        .admin-tabs-row {
          display: flex;
          border-bottom: 2px solid #2d2f34;
          margin-bottom: 24px;
          gap: 16px;
        }
        .admin-tab-btn {
          background: transparent;
          border: none;
          color: #9ea2a9;
          font-size: 16px;
          font-weight: 700;
          padding: 12px 16px;
          cursor: pointer;
          position: relative;
          transition: color 0.2s;
        }
        .admin-tab-btn:hover {
          color: #ffffff;
        }
        .admin-tab-btn.active {
          color: #ffffff;
        }
        .admin-tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background-color: #ff3333;
        }
        .admin-table {
          width: 100%;
          border-collapse: collapse;
          background-color: #17181c;
          border: 1px solid #2d2f34;
          border-radius: 12px;
          overflow: hidden;
        }
        .admin-table th {
          background-color: #1f2125;
          text-align: left;
          padding: 16px 20px;
          font-size: 14px;
          font-weight: 700;
          color: #9ea2a9;
          border-bottom: 1px solid #2d2f34;
        }
        .admin-table td {
          padding: 16px 20px;
          font-size: 14px;
          border-bottom: 1px solid #2d2f34;
          color: #e2e8f0;
        }
        .admin-table tbody tr:hover {
          background-color: #1f2125;
        }
        .role-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
        }
        .role-badge.admin {
          background: rgba(255, 51, 51, 0.15);
          color: #ff3333;
          border: 1px solid rgba(255, 51, 51, 0.3);
        }
        .role-badge.seller {
          background: rgba(251, 191, 36, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(251, 191, 36, 0.3);
        }
        .role-badge.regular {
          background: rgba(158, 162, 169, 0.15);
          color: #9ea2a9;
          border: 1px solid rgba(158, 162, 169, 0.3);
        }
        .status-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 700;
        }
        .status-badge.pending {
          background-color: #fbbf24;
          color: #121315;
        }
        .status-badge.approved {
          background-color: #10b981;
          color: #ffffff;
        }
        .status-badge.rejected {
          background-color: #ef4444;
          color: #ffffff;
        }
        .admin-btn {
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }
        .admin-btn.approve {
          background-color: #10b981;
          color: #ffffff;
        }
        .admin-btn.approve:hover {
          background-color: #059669;
        }
        .admin-btn.reject {
          background-color: #ef4444;
          color: #ffffff;
          margin-left: 8px;
        }
        .admin-btn.reject:hover {
          background-color: #dc2626;
        }
        .admin-role-select {
          background-color: #131416;
          border: 1px solid #2d2f34;
          color: #ffffff;
          padding: 6px 10px;
          border-radius: 6px;
          outline: none;
          cursor: pointer;
        }
        .reject-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.85);
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .reject-modal-box {
          background: #17181c;
          border: 1px solid #2d2f34;
          border-radius: 12px;
          padding: 28px;
          width: 90%;
          max-width: 450px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.6);
        }
        .reject-modal-title {
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 16px;
        }
        .reject-modal-textarea {
          width: 100%;
          height: 100px;
          background-color: #131416;
          border: 1px solid #2d2f34;
          border-radius: 6px;
          color: #ffffff;
          padding: 12px;
          outline: none;
          resize: none;
          margin-bottom: 20px;
          font-family: inherit;
        }
        .reject-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
      `}</style>

      {/* Header Info */}
      <div className="admin-header-card">
        <h2 className="admin-header-title">Trang Quản Trị Hệ Thống (G2G Admin)</h2>
        <p style={{ color: '#9ea2a9', fontSize: '15px', margin: 0 }}>
          Xin chào, <strong>{currentUser.name}</strong>. Tại đây bạn có thể quản lý người dùng, phân quyền và xét duyệt các yêu cầu đăng ký mở gian hàng (Seller).
        </p>
      </div>

      {/* Quick Stats */}
      <div className="admin-stats-row">
        <div className="admin-stat-card">
          <div className="admin-stat-val">{memberUsers.length}</div>
          <div className="admin-stat-label">Tổng thành viên</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-val">{users.filter(u => u.role === 'seller').length}</div>
          <div className="admin-stat-label">Người bán hàng (Seller)</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-val" style={{ color: pendingRequests.length > 0 ? '#fbbf24' : '#ff3333' }}>
            {pendingRequests.length}
          </div>
          <div className="admin-stat-label">Yêu cầu chờ duyệt</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-val" style={{ color: '#10b981' }}>{globalListings.length}</div>
          <div className="admin-stat-label">Sản phẩm trên sàn</div>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="admin-tabs-row">
        <button
          className={`admin-tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Yêu cầu xét duyệt ({pendingRequests.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Quản lý thành viên ({memberUsers.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => { setActiveTab('products'); fetchListings(); }}
        >
          Quản lý sản phẩm ({globalListings.length})
        </button>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <p style={{ color: '#9ea2a9' }}>Đang tải dữ liệu từ máy chủ...</p>
        </div>
      ) : activeTab === 'requests' ? (
        /* Tab 1: Seller Requests */
        <div>
          {pendingRequests.length === 0 ? (
            <div style={{
              background: '#17181c', border: '1px solid #2d2f34',
              borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#9ea2a9'
            }}>
              🎉 Không có yêu cầu đăng ký người bán nào đang chờ xét duyệt.
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tên người dùng</th>
                  <th>Email</th>
                  <th>Game đăng ký</th>
                  <th>Kinh nghiệm mô tả</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {pendingRequests.map(req => (
                  <tr key={req.id || req.requestId || req.mail}>
                    <td style={{ fontWeight: 600 }}>{req.name}</td>
                    <td>{req.mail}</td>
                    <td><span style={{ color: '#fbbf24', fontWeight: 600 }}>{req.sellerRequestGame || 'Gian hàng game'}</span></td>
                    <td style={{ maxWidth: '300px', whiteSpace: 'normal', fontSize: '13px', color: '#cbd5e1' }}>
                      {req.sellerRequestExperience || 'Không có mô tả.'}
                    </td>
                    <td>
                      <button className="admin-btn approve" onClick={() => handleApprove(req.id, req.mail)}>Duyệt</button>
                      <button className="admin-btn reject" onClick={() => openRejectDialog(req.id, req.mail)}>Từ chối</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : activeTab === 'users' ? (
        /* Tab 2: User Management */
        <div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Tên người dùng</th>
                <th>Email</th>
                <th>Vai trò hiện tại</th>
                <th>Trạng thái đăng ký</th>
                <th>Đổi vai trò nhanh</th>
              </tr>
            </thead>
            <tbody>
              {memberUsers.map(u => (
                <tr key={u.id || u.mail}>
                  <td style={{ fontWeight: 600 }}>{u.name}</td>
                  <td>{u.mail}</td>
                  <td>
                    <span className={`role-badge ${u.role}`}>
                      {u.role === 'admin' ? 'Admin' : u.role === 'seller' ? 'Seller' : 'Thành viên'}
                    </span>
                  </td>
                  <td>
                    {u.sellerStatus === 'pending' && <span className="status-badge pending">Chờ duyệt</span>}
                    {u.sellerStatus === 'approved' && <span className="status-badge approved">Đã duyệt</span>}
                    {u.sellerStatus === 'rejected' && (
                      <span className="status-badge rejected" title={`Lý do: ${u.sellerRejectReason}`}>
                         Bị từ chối
                      </span>
                    )}
                    {(!u.sellerStatus || u.sellerStatus === 'none') && <span style={{ color: '#5d6168' }}>Không đăng ký</span>}
                  </td>
                  <td>
                    <select
                      className="admin-role-select"
                      value={u.role}
                      onChange={(e) => handleRoleUpdate(u.id, u.mail, e.target.value)}
                    >
                      <option value="regular">Thành viên (Regular)</option>
                      <option value="seller">Người bán (Seller)</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* Tab 3: Global Product Management */
        <div>
          {globalListings.length === 0 ? (
            <div style={{
              background: '#17181c', border: '1px solid #2d2f34',
              borderRadius: '12px', padding: '40px', textAlign: 'center', color: '#9ea2a9'
            }}>
              📦 Không có sản phẩm nào đang được đăng bán trên sàn.
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Tên Game</th>
                  <th>Tên sản phẩm</th>
                  <th>Người bán</th>
                  <th>Đơn giá</th>
                  <th>Kho hàng</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {globalListings.map(item => (
                  <tr key={item.id}>
                    <td><span style={{ color: '#ff3333', fontWeight: 700 }}>{item.gameName}</span></td>
                    <td style={{ fontWeight: 600 }}>{item.name}</td>
                    <td>{item.sellerName}</td>
                    <td style={{ color: '#10b981', fontWeight: 700 }}>{item.price.toLocaleString('vi-VN')}₫</td>
                    <td>{item.stock} gói</td>
                    <td>
                      <button 
                        className="admin-btn reject" 
                        style={{ margin: 0 }}
                        onClick={() => handleDeleteProduct(item.id)}
                      >
                        Gỡ bỏ sản phẩm
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Reject Reason Modal Dialog */}
      {rejectMail && (
        <div className="reject-modal-overlay">
          <div className="reject-modal-box">
            <h4 className="reject-modal-title">Lý do từ chối yêu cầu lên người bán</h4>
            <p style={{ fontSize: '13px', color: '#9ea2a9', margin: '0 0 12px' }}>
              Nhập lý do từ chối cho tài khoản: <strong>{typeof rejectMail === 'object' ? rejectMail?.mail : rejectMail}</strong>. Người dùng sẽ nhận được phản hồi này.
            </p>
            <textarea
              className="reject-modal-textarea"
              placeholder="Ví dụ: Bạn chưa mô tả kinh nghiệm cụ thể hoặc thiếu hồ sơ xác minh..."
              value={rejectReasonText}
              onChange={(e) => setRejectReasonText(e.target.value)}
            />
            <div className="reject-modal-actions">
              <button
                className="admin-btn"
                style={{ backgroundColor: '#2d2f34', color: '#ffffff' }}
                onClick={() => setRejectMail(null)}
              >
                Hủy bỏ
              </button>
              <button
                className="admin-btn approve"
                onClick={handleRejectSubmit}
              >
                Gửi từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
