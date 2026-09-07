import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ttnnuneucydeqqhtskxa.supabase.co";
const SUPABASE_KEY = "sb_publishable_xq84zz2t1bVgHwLxk3XOpQ_e5sIbEVB";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const orderApi = {
  createOrder: async (orderData) => {
    try {
      const uId = parseInt(orderData.user_id || orderData.buyerId || 1, 10);
      const sId = parseInt(orderData.seller_id || orderData.sellerId || 1, 10);
      const price = parseInt(String(orderData.total_price || orderData.total || orderData.price || 0).replace(/[^0-9]/g, ''), 10) || 0;

      const payload = {
        user_id: uId,
        seller_id: sId,
        total_price: price,
        status: orderData.status || 'paid'
      };

      const { data, error } = await supabase
        .from('orders')
        .insert([payload])
        .select();

      if (error) throw error;

      return {
        data: {
          message: 'Tạo đơn hàng thành công',
          order: data?.[0] || { ...payload, id: Date.now() }
        }
      };
    } catch (err) {
      console.error("orderApi.createOrder error:", err);
      throw err;
    }
  },

  getUserOrders: async (userId) => {
    try {
      if (!userId) return { data: [] };
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('id', { ascending: false });

      if (error) throw error;
      return { data: data || [] };
    } catch (err) {
      console.error("orderApi.getUserOrders error:", err);
      return { data: [] };
    }
  },

  getSellerOrders: async (sellerId) => {
    try {
      if (!sellerId) return { data: [] };
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('seller_id', sellerId)
        .order('id', { ascending: false });

      if (error) throw error;
      return { data: data || [] };
    } catch (err) {
      console.error("orderApi.getSellerOrders error:", err);
      return { data: [] };
    }
  },

  updateStatus: async (orderId, status) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select();

      if (error) throw error;
      return { data: { message: 'Cập nhật trạng thái đơn hàng thành công', order: data?.[0] } };
    } catch (err) {
      console.error("orderApi.updateStatus error:", err);
      throw err;
    }
  },
};

export default orderApi;
