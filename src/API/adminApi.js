import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ttnnuneucydeqqhtskxa.supabase.co";
const SUPABASE_KEY = "sb_publishable_xq84zz2t1bVgHwLxk3XOpQ_e5sIbEVB";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const adminApi = {
  getUsers: async () => {
    try {
      const { data: users, error: uErr } = await supabase
        .from('users')
        .select('*')
        .order('id', { ascending: true });

      if (uErr) throw uErr;

      let requests = [];
      try {
        const { data: reqs } = await supabase
          .from('seller_requests')
          .select('*')
          .order('id', { ascending: false });
        if (reqs) requests = reqs;
      } catch (e) {
        console.warn('Lỗi đọc seller_requests:', e);
      }

      const formattedUsers = (users || []).map(u => {
        const userReq = requests.find(r => r.user_id === u.id);
        return {
          ...u,
          sellerStatus: userReq ? userReq.status : (u.role === 'seller' ? 'approved' : 'none'),
          sellerRejectReason: userReq && userReq.status === 'rejected' ? userReq.note : '',
          sellerRequestGame: userReq ? userReq.shop_name : '',
          sellerRequestExperience: userReq ? userReq.note : '',
          requestId: userReq ? userReq.id : null
        };
      });

      return { data: formattedUsers };
    } catch (err) {
      console.error("adminApi.getUsers error:", err);
      throw err;
    }
  },

  approveSeller: async ({ id, mail }) => {
    try {
      let targetId = id;
      if (!targetId && mail) {
        const { data: users } = await supabase.from('users').select('id').ilike('mail', mail.trim());
        if (users && users.length > 0) targetId = users[0].id;
      }

      const { data, error } = await supabase
        .from('users')
        .update({ role: 'seller' })
        .eq('id', targetId)
        .select();

      if (error) throw error;

      await supabase
        .from('seller_requests')
        .update({ status: 'approved', approved_at: new Date().toISOString() })
        .eq('user_id', targetId);

      return { data: { message: 'Đã phê duyệt người bán thành công!', user: data?.[0] } };
    } catch (err) {
      console.error("adminApi.approveSeller error:", err);
      throw err;
    }
  },

  rejectSeller: async ({ id, mail, reason }) => {
    try {
      let targetId = id;
      if (!targetId && mail) {
        const { data: users } = await supabase.from('users').select('id').ilike('mail', mail.trim());
        if (users && users.length > 0) targetId = users[0].id;
      }

      await supabase
        .from('seller_requests')
        .update({ status: 'rejected', note: reason })
        .eq('user_id', targetId);

      return { data: { message: 'Đã từ chối yêu cầu người bán thành công!' } };
    } catch (err) {
      console.error("adminApi.rejectSeller error:", err);
      throw err;
    }
  },

  updateRole: async ({ id, mail, role }) => {
    try {
      let targetId = id;
      if (!targetId && mail) {
        const { data: users } = await supabase.from('users').select('id').ilike('mail', mail.trim());
        if (users && users.length > 0) targetId = users[0].id;
      }

      const { data, error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', targetId)
        .select();

      if (error) throw error;

      return { data: { message: 'Đã cập nhật vai trò thành công!', user: data?.[0] } };
    } catch (err) {
      console.error("adminApi.updateRole error:", err);
      throw err;
    }
  },

  // Credit 10% commission fee to Admin balance in Supabase & localStorage
  creditAdminFee: async (feeAmount, orderDetails = {}) => {
    try {
      const amountNum = Number(feeAmount) || 0;
      if (amountNum <= 0) return { data: { message: 'Phí sàn không hợp lệ' } };

      // 1. Query all admin accounts from Supabase
      const { data: admins, error: fetchErr } = await supabase
        .from('users')
        .select('id, balance, name, mail, role')
        .eq('role', 'admin');

      if (fetchErr) {
        console.warn('Lỗi lấy tài khoản Admin từ Supabase:', fetchErr);
      }

      let targetAdmins = admins && admins.length > 0 ? admins : [{ id: 2, name: 'admin', balance: 0, role: 'admin' }];
      let primaryNewBalance = 0;

      for (const admin of targetAdmins) {
        const currentBal = Number(admin.balance) || 0;
        const newBalance = currentBal + amountNum;
        primaryNewBalance = newBalance;

        // Cập nhật database Supabase
        if (admin.id) {
          try {
            await supabase
              .from('users')
              .update({ balance: newBalance })
              .eq('id', admin.id);
            console.log(`✅ [Supabase] Đã cộng +${amountNum}₫ vào ví Admin ID ${admin.id} (${admin.name}). Số dư mới: ${newBalance}₫`);
          } catch (e) {
            console.warn(`Lỗi cập nhật balance Admin ${admin.id}:`, e);
          }
        }

        // Cập nhật tất cả các key localStorage của Admin
        try {
          const adminKeys = [
            `g2g_user_wallet_balance_user_${admin.id}`,
            `g2g_user_wallet_balance_${admin.name}`,
            'g2g_user_wallet_balance_admin',
            'g2g_user_wallet_balance_Admin',
            'g2g_user_wallet_balance_Admin G2G',
            'g2g_user_wallet_balance_user_1',
            'g2g_admin_wallet_balance'
          ];
          adminKeys.forEach(k => {
            localStorage.setItem(k, String(newBalance));
          });

          // Lưu Transaction Log cho Admin
          const adminTx = {
            id: `T-${Math.floor(100000 + Math.random() * 900000)}`,
            date: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            type: 'fee_commission',
            desc: `Nhận 10% phí sàn từ đơn hàng "${orderDetails.itemName || 'Sản phẩm'}" (Shop: ${orderDetails.sellerName || 'Người bán'}, Người mua: ${orderDetails.buyerName || 'Người mua'})`,
            amount: amountNum,
            orderId: orderDetails.orderId || null
          };

          const txKeys = [
            `g2g_user_wallet_tx_user_${admin.id}`,
            `g2g_user_wallet_tx_${admin.name}`,
            'g2g_user_wallet_tx_admin',
            'g2g_user_wallet_tx_Admin G2G',
            'g2g_admin_wallet_transactions'
          ];

          txKeys.forEach(tk => {
            try {
              const existing = JSON.parse(localStorage.getItem(tk) || '[]');
              localStorage.setItem(tk, JSON.stringify([adminTx, ...existing]));
            } catch (e) {}
          });

          // Lưu Thông báo cho Admin
          const formattedDate = new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
          const adminNotify = {
            id: Date.now() + Math.random(),
            title: "👑 Hoa hồng sàn mới (+10%)",
            message: `Đơn hàng "${orderDetails.itemName || 'Sản phẩm'}" (Tổng: ${(orderDetails.totalAmount || (amountNum * 10)).toLocaleString('vi-VN')}₫) từ người bán ${orderDetails.sellerName || 'Shop'} đã được thanh toán bởi ${orderDetails.buyerName || 'khách hàng'}. Bạn đã nhận được +${amountNum.toLocaleString('vi-VN')}₫ phí sàn vào ví Admin.`,
            date: formattedDate,
            unread: true,
            amount: amountNum,
            type: 'fee_commission'
          };

          const notifyKeys = [
            `g2g_notifications_${admin.name}`,
            `g2g_notifications_user_${admin.id}`,
            'g2g_notifications_admin',
            'g2g_notifications_Admin',
            'g2g_notifications_Admin G2G',
            'g2g_admin_notifications'
          ];

          notifyKeys.forEach(nk => {
            try {
              const existing = JSON.parse(localStorage.getItem(nk) || '[]');
              localStorage.setItem(nk, JSON.stringify([adminNotify, ...existing]));
            } catch (e) {}
          });
        } catch (localErr) {
          console.error("Lỗi đồng bộ localStorage admin:", localErr);
        }
      }

      // Phát sự kiện toàn cục để cập nhật real-time chuông thông báo và số dư trên các tab
      try {
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('g2g_admin_notification', { detail: { feeAmount: amountNum, orderDetails } }));
        window.dispatchEvent(new CustomEvent('g2g_admin_balance_updated', { detail: { feeAmount: amountNum, newBalance: primaryNewBalance } }));
      } catch (e) {}

      return {
        data: {
          message: 'Đã cộng phí sàn 10% vào ví Admin thành công!',
          balance: primaryNewBalance,
          feeAmount: amountNum,
          admins: targetAdmins
        }
      };
    } catch (err) {
      console.error("adminApi.creditAdminFee error:", err);
      return { data: { message: 'Lỗi xử lý creditAdminFee: ' + err.message } };
    }
  },

  // Get admin balance
  getAdminBalance: async () => {
    try {
      const { data: admins, error } = await supabase
        .from('users')
        .select('id, balance, name, mail')
        .eq('role', 'admin')
        .limit(1);

      if (error) throw error;
      return { data: admins?.[0] || { balance: 0, name: 'admin', id: 2 } };
    } catch (err) {
      console.error("adminApi.getAdminBalance error:", err);
      // Fallback localStorage
      const localBal = Number(localStorage.getItem('g2g_user_wallet_balance_admin') || localStorage.getItem('g2g_user_wallet_balance_user_2') || '0');
      return { data: { balance: localBal, name: 'admin', id: 2 } };
    }
  },

  // Get all orders for admin overview
  getAdminOrders: async () => {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;

      // Lấy danh sách users để map tên
      let users = [];
      try {
        const { data: uList } = await supabase.from('users').select('id, name, mail');
        if (uList) users = uList;
      } catch (e) {}

      const formattedOrders = (orders || []).map(o => {
        const buyer = users.find(u => u.id === o.user_id);
        const seller = users.find(u => u.id === o.seller_id);
        const total = Number(o.total_price) || 0;
        const fee = total * 0.10;
        return {
          ...o,
          buyerName: buyer ? buyer.name : (o.user_id ? `Thành viên #${o.user_id}` : 'Khách vãng lai'),
          sellerName: seller ? seller.name : (o.seller_id ? `Shop #${o.seller_id}` : 'Top Seller'),
          feeAmount: fee,
          sellerNet: total - fee
        };
      });

      // Calculate 10% fee stats
      const totalRevenue = formattedOrders.reduce((sum, o) => sum + (Number(o.total_price) || 0), 0);
      const totalFee = totalRevenue * 0.10;

      return {
        data: {
          orders: formattedOrders,
          totalOrders: formattedOrders.length,
          totalRevenue,
          totalFee
        }
      };
    } catch (err) {
      console.error("adminApi.getAdminOrders error:", err);
      return { data: { orders: [], totalOrders: 0, totalRevenue: 0, totalFee: 0 } };
    }
  },
};

export default adminApi;
