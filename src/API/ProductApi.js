import axiosClient from "./axiosClient";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ttnnuneucydeqqhtskxa.supabase.co";
const SUPABASE_KEY = "sb_publishable_xq84zz2t1bVgHwLxk3XOpQ_e5sIbEVB";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const GAME_MAP = {
  1: { id: 'roblox', name: 'Roblox Robux (Global)', category: 'coins', textIcon: 'R$', color: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', badge: 'Fast Delivery', description: 'Nạp Robux giá rẻ, tự động, hỗ trợ tài khoản Global bảo mật 100% với bảo hiểm GamerProtect.' },
  2: { id: 'garena-shells', name: 'Garena Shells (Sò Garena)', category: 'cards', textIcon: 'Gar', color: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', badge: 'Auto Delivery', description: 'Sò Garena Việt Nam dùng để nạp các game Liên Quân Mobile, Free Fire, FC Online giá rẻ nhất.' },
  3: { id: 'zing-card', name: 'Zing Card VNG', category: 'cards', textIcon: 'Zing', color: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)', badge: '-5% Discount', description: 'Thẻ Zing nạp game VNG: Võ Lâm Truyền Kỳ, Kiếm Thế, PUBG Mobile, Boom M giá rẻ chiết khấu cao.' },
  4: { id: 'valorant-points', name: 'Valorant Points (VP)', category: 'coins', textIcon: 'VP', color: 'linear-gradient(135deg, #7f1d1d 0%, #111827 100%)', badge: 'Instant Delivery', description: 'Nạp VP mua skin súng Valorant giá rẻ. Nhận mã code hoặc nạp trực tiếp qua tài khoản RIOT.' },
  5: { id: 'steam-wallet', name: 'Steam Wallet Code (Global)', category: 'cards', textIcon: 'Steam', color: 'linear-gradient(135deg, #475569 0%, #1e293b 100%)', badge: 'Auto Send', description: 'Mã code nạp Steam Wallet mua game, vật phẩm Market bảo mật tốt nhất.' },
  6: { id: 'lien-quan-mobile', name: 'Liên Quân Mobile - Tài Khoản VIP', category: 'accounts', textIcon: 'LQ', color: 'linear-gradient(135deg, #1e1b4b 0%, #311042 100%)', badge: 'Acc Trắng TT', description: 'Tài khoản Liên Quân Mobile giá tốt, rank cao thủ, nhiều skin đẹp, đầy đủ ngọc.' },
  7: { id: 'lol-boosting', name: 'League of Legends - Cày Thuê', category: 'boosting', textIcon: 'LoL', color: 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)', badge: 'Professional', description: 'Dịch vụ cày thuê rank LMHT uy tín, tốc độ cao, bảo mật tài khoản.' },
};

export const GAME_SLUG_TO_ID = {
  'roblox': 1,
  'garena-shells': 2,
  'zing-card': 3,
  'valorant-points': 4,
  'steam-wallet': 5,
  'lien-quan-mobile': 6,
  'lol-boosting': 7
};

export const CATEGORY_SLUG_TO_ID = {
  'coins': 1,
  'cards': 2,
  'accounts': 3,
  'boosting': 4,
  'items': 5
};

export const CATEGORY_ID_TO_SLUG = {
  1: 'coins',
  2: 'cards',
  3: 'accounts',
  4: 'boosting',
  5: 'items'
};

const productApi = {
  getAll: async () => {
    try {
      return await axiosClient.get("/products");
    } catch (err) {
      console.warn("Render /products failed, falling back directly to Supabase products table:", err.message);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });
      if (error) throw err;
      return { data: { products: data || [] } };
    }
  },

  getById: async (id) => {
    try {
      return await axiosClient.get(`/products/${id}`);
    } catch (err) {
      const numericId = typeof id === 'string' ? id.replace(/\D/g, '') : id;
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', numericId || id)
        .single();
      if (error || !data) throw err;
      return { data: { product: data } };
    }
  },

  create: async (data) => {
    const cleanPrice = typeof data.price === 'string'
      ? parseInt(data.price.replace(/[^0-9]/g, ''), 10)
      : Math.round(Number(data.price));
    const cleanStock = typeof data.stock_quantity === 'string'
      ? parseInt(data.stock_quantity.replace(/[^0-9]/g, ''), 10)
      : Math.round(Number(data.stock_quantity));

    const gId = GAME_SLUG_TO_ID[data.game_id] || parseInt(data.game_id, 10) || 1;
    const cId = CATEGORY_SLUG_TO_ID[data.category_id] || parseInt(data.category_id, 10) || 1;

    const payload = {
      seller_id: data.seller_id ? parseInt(data.seller_id, 10) || 1 : 1,
      product_name: String(data.product_name || '').trim(),
      price: cleanPrice && cleanPrice > 0 ? cleanPrice : 10000,
      stock_quantity: cleanStock && cleanStock > 0 ? cleanStock : 1,
      description: data.description || '',
      game_id: gId,
      category_id: cId,
      server: data.server || 'Vietnam',
      badge: data.badge || 'Người Bán Mới'
    };

    try {
      return await axiosClient.post("/products", payload);
    } catch (apiError) {
      console.warn("Lỗi lưu API Render, tự động đồng bộ trực tiếp Supabase:", apiError.response?.data || apiError.message);
      
      const { data: inserted, error: sbError } = await supabase
        .from('products')
        .insert([{
          ...payload,
          status: 'active'
        }])
        .select();

      if (sbError) {
        throw new Error(sbError.message || "Lỗi lưu vào Database");
      }

      return {
        data: {
          message: 'Đăng sản phẩm thành công',
          product: inserted?.[0] || { ...payload, id: Date.now() }
        }
      };
    }
  },

  update: (id, data) => {
    return axiosClient.put(`/products/${id}`, data);
  },

  delete: async (id) => {
    try {
      return await axiosClient.delete(`/products/${id}`);
    } catch (err) {
      const { data, error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) throw err;
      return { data: { message: 'Đã xóa sản phẩm thành công' } };
    }
  },
};

export default productApi;

// Lấy sản phẩm chi tiết theo ID từ Database Supabase
export async function getProductById(id) {
  try {
    const numericId = typeof id === 'string' ? id.replace(/\D/g, '') : id;
    const response = await productApi.getById(numericId || id);
    const p = response.data?.product || response.data;
    const gameMeta = GAME_MAP[p.game_id] || GAME_MAP[1];

    return {
      id: p.id,
      name: p.product_name,
      price: p.price,
      stock: p.stock_quantity,
      description: p.description,
      badge: p.badge || gameMeta.badge,
      region: p.server || 'Global',
      offers: 1,
      image: p.image_url || '',
      gameId: gameMeta.id,
      gameName: gameMeta.name,
      category: CATEGORY_ID_TO_SLUG[p.category_id] || gameMeta.category,
      sellerName: p.seller_name || 'Hệ thống G2G',
      sellerId: p.seller_id
    };
  } catch (error) {
    console.error("Lỗi getProductById:", error);
    throw error;
  }
}

// Lấy toàn bộ sản phẩm từ Supabase và gom nhóm thành danh sách game cho giao diện G2G
export async function fetchAndMapProducts() {
  try {
    const response = await productApi.getAll();
    const rawData = response.data;
    const products = Array.isArray(rawData) ? rawData : (rawData?.products || []);

    if (!products || products.length === 0) {
      return [];
    }

    // Nhóm sản phẩm theo game_id
    const grouped = {};
    Object.keys(GAME_MAP).forEach(key => {
      grouped[key] = {
        ...GAME_MAP[key],
        items: []
      };
    });

    products.forEach(p => {
      const gId = p.game_id || 1;
      if (!grouped[gId]) {
        grouped[gId] = {
          id: `custom-game-${gId}`,
          name: p.product_name || 'Game Khác',
          category: CATEGORY_ID_TO_SLUG[p.category_id] || 'items',
          badge: 'Verified',
          textIcon: 'G2G',
          color: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
          description: 'Sản phẩm từ người bán',
          items: []
        };
      }

      const itemCategory = CATEGORY_ID_TO_SLUG[p.category_id] || grouped[gId].category;

      grouped[gId].items.push({
        id: p.id,
        name: p.product_name,
        price: p.price,
        stock: p.stock_quantity,
        badge: p.badge || grouped[gId].badge,
        region: p.server || 'Vietnam',
        offers: Math.floor(5 + (p.id % 20)),
        description: p.description,
        image: p.image_url || '',
        sellerName: p.seller_name || 'Hệ thống G2G',
        sellerId: p.seller_id,
        gameId: grouped[gId].id,
        gameName: grouped[gId].name,
        category: itemCategory
      });
    });

    return Object.values(grouped).filter(g => g.items.length > 0);
  } catch (error) {
    console.error("Lỗi fetchAndMapProducts từ Supabase:", error);
    return [];
  }
}