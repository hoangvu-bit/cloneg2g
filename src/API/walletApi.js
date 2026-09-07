import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ttnnuneucydeqqhtskxa.supabase.co";
const SUPABASE_KEY = "sb_publishable_xq84zz2t1bVgHwLxk3XOpQ_e5sIbEVB";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const walletApi = {
  updateBalance: async (userId, newBalance) => {
    try {
      const { data: updated, error } = await supabase
        .from('users')
        .update({ balance: newBalance })
        .eq('id', userId)
        .select();

      if (error) throw error;
      return { data: { balance: newBalance, user: updated?.[0] } };
    } catch (err) {
      console.error("walletApi.updateBalance error:", err);
      throw err;
    }
  },

  deposit: async (userId, amount) => {
    try {
      const numAmount = parseInt(String(amount).replace(/[^0-9]/g, ''), 10) || 0;
      const { data: user, error: fetchErr } = await supabase
        .from('users')
        .select('balance')
        .eq('id', userId)
        .single();

      if (fetchErr) throw fetchErr;

      const currentBalance = user?.balance || 0;
      const newBalance = currentBalance + numAmount;

      const { data: updated, error: updateErr } = await supabase
        .from('users')
        .update({ balance: newBalance })
        .eq('id', userId)
        .select();

      if (updateErr) throw updateErr;

      return {
        data: {
          message: 'Nạp tiền vào ví thành công',
          balance: newBalance,
          user: updated?.[0]
        }
      };
    } catch (err) {
      console.error("walletApi.deposit error:", err);
      throw err;
    }
  },

  getBalance: async (userId) => {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('balance')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return { data: { balance: user?.balance || 0 } };
    } catch (err) {
      console.error("walletApi.getBalance error:", err);
      throw err;
    }
  },
};

export default walletApi;
