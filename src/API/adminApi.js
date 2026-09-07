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

  // Credit 10% commission fee to Admin balance in Supabase
  creditAdminFee: async (feeAmount) => {
    try {
      // Find the admin account
      const { data: admins, error: fetchErr } = await supabase
        .from('users')
        .select('id, balance')
        .eq('role', 'admin')
        .limit(1);

      if (fetchErr) throw fetchErr;
      if (!admins || admins.length === 0) return { data: { message: 'Không tìm thấy tài khoản Admin' } };

      const admin = admins[0];
      const newBalance = (Number(admin.balance) || 0) + Number(feeAmount);

      const { data: updated, error: updateErr } = await supabase
        .from('users')
        .update({ balance: newBalance })
        .eq('id', admin.id)
        .select();

      if (updateErr) throw updateErr;

      return { data: { message: 'Đã cộng phí sàn 10% vào ví Admin', balance: newBalance, adminId: admin.id } };
    } catch (err) {
      console.error("adminApi.creditAdminFee error:", err);
      throw err;
    }
  },

  // Get admin balance
  getAdminBalance: async () => {
    try {
      const { data: admins, error } = await supabase
        .from('users')
        .select('id, balance, name')
        .eq('role', 'admin')
        .limit(1);

      if (error) throw error;
      return { data: admins?.[0] || { balance: 0 } };
    } catch (err) {
      console.error("adminApi.getAdminBalance error:", err);
      throw err;
    }
  },

  // Get all orders for admin overview
  getAdminOrders: async () => {
    try {
      const { data: orders, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate 10% fee stats
      const totalRevenue = (orders || []).reduce((sum, o) => sum + (Number(o.total_price) || 0), 0);
      const totalFee = totalRevenue * 0.10;

      return {
        data: {
          orders: orders || [],
          totalOrders: (orders || []).length,
          totalRevenue,
          totalFee
        }
      };
    } catch (err) {
      console.error("adminApi.getAdminOrders error:", err);
      throw err;
    }
  },
};

export default adminApi;
