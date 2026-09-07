import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Supabase Cloud Database Configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://ttnnuneucydeqqhtskxa.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_xq84zz2t1bVgHwLxk3XOpQ_e5sIbEVB';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('✅ Đã kết nối Supabase Cloud Database:', SUPABASE_URL);

// 1. Đăng ký tài khoản (POST /register) - Lưu trực tiếp vào bảng 'users'
app.post('/register', async (req, res) => {
  try {
    const { name, mail, password, role } = req.body;

    if (!name || !mail || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ họ tên, email và mật khẩu!' });
    }

    const normalizedMail = mail.trim().toLowerCase();

    // Kiểm tra xem email đã tồn tại trong database chưa
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('id')
      .ilike('mail', normalizedMail);

    if (checkError) {
      console.error('Lỗi kiểm tra email trên Supabase:', checkError);
      return res.status(500).json({ message: 'Lỗi truy vấn cơ sở dữ liệu.' });
    }

    if (existingUsers && existingUsers.length > 0) {
      return res.status(400).json({ message: 'Email này đã được đăng ký từ trước!' });
    }

    // Mã hóa mật khẩu với bcrypt
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUserPayload = {
      name: name.trim(),
      mail: normalizedMail,
      password: hashedPassword,
      role: role || 'regular',
      balance: 0
    };

    // Thêm bản ghi mới vào bảng 'users' trên Database Supabase
    const { data, error: insertError } = await supabase
      .from('users')
      .insert([newUserPayload])
      .select();

    if (insertError) {
      console.error('Lỗi thêm người dùng vào Supabase:', insertError);
      return res.status(500).json({ message: insertError.message || 'Lỗi lưu trữ dữ liệu vào database.' });
    }

    const createdUser = data ? data[0] : newUserPayload;
    console.log(`👤 Đã tạo người dùng mới thành công trên Database: ${normalizedMail}`);

    res.status(201).json({
      message: 'Đăng ký tài khoản thành công!',
      user: {
        id: createdUser.id,
        name: createdUser.name,
        mail: createdUser.mail,
        role: createdUser.role
      }
    });
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi hệ thống khi đăng ký.' });
  }
});

// 2. Đăng nhập tài khoản (POST /login) - Lấy trực tiếp từ bảng 'users'
app.post('/login', async (req, res) => {
  try {
    const { mail, password } = req.body;

    if (!mail || !password) {
      return res.status(400).json({ message: 'Vui lòng cung cấp email và mật khẩu!' });
    }

    const normalizedMail = mail.trim().toLowerCase();

    // Truy vấn tài khoản từ bảng 'users' trên Supabase
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .ilike('mail', normalizedMail);

    if (error) {
      console.error('Lỗi truy vấn Supabase:', error);
      return res.status(500).json({ message: error.message || 'Lỗi truy vấn cơ sở dữ liệu.' });
    }

    if (!users || users.length === 0) {
      return res.status(401).json({ message: 'Tài khoản này chưa tồn tại trong hệ thống!' });
    }

    const user = users[0];

    // So khớp mật khẩu: kiểm tra hash bcrypt ($2b$...) hoặc mật khẩu thường
    let passwordMatch = false;
    if (user.password && (user.password.startsWith('$2a$') || user.password.startsWith('$2b$') || user.password.startsWith('$2y$'))) {
      try {
        passwordMatch = bcrypt.compareSync(password, user.password);
      } catch {
        passwordMatch = false;
      }
    } else {
      passwordMatch = (user.password === password);
    }

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Mật khẩu không chính xác!' });
    }

    // Tạo access token phiên đăng nhập
    const accessToken = `session-token-${user.id}-${Date.now()}`;
    console.log(`🔑 Người dùng đăng nhập thành công từ Database: ${normalizedMail} (Vai trò: ${user.role})`);

    res.status(200).json({
      message: user.role === 'admin' ? 'Đăng nhập thành công với quyền Quản trị viên!' : 'Đăng nhập thành công!',
      access_token: accessToken,
      user: {
        id: user.id,
        mail: user.mail,
        name: user.name,
        role: user.role || 'regular',
        balance: user.balance || 0,
        sellerStatus: user.sellerStatus || user.seller_status || (user.role === 'seller' ? 'approved' : 'none'),
        sellerRejectReason: user.sellerRejectReason || user.seller_reject_reason || ''
      }
    });
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi hệ thống khi đăng nhập.' });
  }
});

// 3. Lấy toàn bộ danh sách người dùng (GET /users) - Ghép dữ liệu từ bảng users và seller_requests
app.get('/users', async (req, res) => {
  try {
    const { data: users, error: uErr } = await supabase
      .from('users')
      .select('*')
      .order('id', { ascending: true });

    if (uErr) {
      console.error('Lỗi trích xuất người dùng từ Supabase:', uErr);
      return res.status(500).json({ message: uErr.message || 'Không thể lấy dữ liệu từ cơ sở dữ liệu.' });
    }

    // Lấy thêm danh sách các yêu cầu xét duyệt người bán từ bảng seller_requests
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

    // Chuẩn hóa dữ liệu kết hợp cho Admin Dashboard
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

    res.status(200).json(formattedUsers);
  } catch (error) {
    console.error('Lỗi khi lấy danh sách người dùng:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi hệ thống khi lấy dữ liệu.' });
  }
});

// 4. Admin phê duyệt người bán (POST /admin/approve-seller)
app.post('/admin/approve-seller', async (req, res) => {
  try {
    const { id, mail } = req.body;

    let targetId = id;
    if (!targetId && mail) {
      const { data: users } = await supabase.from('users').select('id').ilike('mail', mail.trim());
      if (users && users.length > 0) targetId = users[0].id;
    }

    if (!targetId) {
      return res.status(400).json({ message: 'Không tìm thấy ID người dùng để phê duyệt!' });
    }

    // 1. Cập nhật role = 'seller' trong bảng users
    const { data, error } = await supabase
      .from('users')
      .update({ role: 'seller' })
      .eq('id', targetId)
      .select();

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    // 2. Cập nhật status = 'approved' trong bảng seller_requests
    try {
      await supabase
        .from('seller_requests')
        .update({ status: 'approved', approved_at: new Date().toISOString() })
        .eq('user_id', targetId);
    } catch (e) {
      console.warn('Cập nhật seller_requests warning:', e.message);
    }

    console.log(`✅ Phê duyệt người bán thành công: User ID ${targetId}`);
    res.status(200).json({ message: 'Đã phê duyệt người bán thành công!', user: data ? data[0] : null });
  } catch (error) {
    console.error('Lỗi khi phê duyệt người bán:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi hệ thống khi phê duyệt.' });
  }
});

// 5. Admin từ chối làm người bán (POST /admin/reject-seller)
app.post('/admin/reject-seller', async (req, res) => {
  try {
    const { id, mail, reason } = req.body;

    let targetId = id;
    if (!targetId && mail) {
      const { data: users } = await supabase.from('users').select('id').ilike('mail', mail.trim());
      if (users && users.length > 0) targetId = users[0].id;
    }

    if (!targetId) {
      return res.status(400).json({ message: 'Không tìm thấy ID người dùng để từ chối!' });
    }

    // 1. Cập nhật status = 'rejected' trong bảng seller_requests
    try {
      await supabase
        .from('seller_requests')
        .update({
          status: 'rejected',
          note: reason ? `Lý do từ chối: ${reason}` : 'Từ chối bởi Admin'
        })
        .eq('user_id', targetId);
    } catch (e) {
      console.warn('seller_requests table warning:', e.message);
    }

    // 2. Đảm bảo vai trò trong bảng users là regular
    await supabase.from('users').update({ role: 'regular' }).eq('id', targetId);

    res.status(200).json({ message: 'Đã từ chối yêu cầu làm người bán!' });
  } catch (error) {
    console.error('Lỗi khi từ chối người bán:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi hệ thống khi từ chối.' });
  }
});

// 6. Admin đổi vai trò của người dùng (POST /admin/update-role) - Cập nhật chính xác theo ID
app.post('/admin/update-role', async (req, res) => {
  try {
    const { id, mail, role } = req.body;

    if (!id && !mail) {
      return res.status(400).json({ message: 'Vui lòng cung cấp ID hoặc email người dùng!' });
    }

    let query = supabase.from('users').update({ role });
    if (id) {
      query = query.eq('id', id);
    } else {
      query = query.eq('mail', mail);
    }

    const { data, error } = await query.select();

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    console.log(`🔄 Cập nhật vai trò thành công cho ID ${id || mail} -> ${role}`);
    res.status(200).json({ message: 'Đã cập nhật vai trò người dùng thành công!', user: data ? data[0] : null });
  } catch (error) {
    console.error('Lỗi khi cập nhật vai trò:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi hệ thống khi cập nhật vai trò.' });
  }
});

// 7. Yêu cầu nâng cấp tài khoản bán game (POST /upgrade-seller) - Lưu đúng vào bảng seller_requests
app.post('/upgrade-seller', async (req, res) => {
  try {
    const { mail, game, experience } = req.body;

    if (!mail) {
      return res.status(400).json({ message: 'Không tìm thấy thông tin email để nâng cấp!' });
    }

    const normalizedMail = mail.trim().toLowerCase();

    // 1. Tìm user trong bảng users
    const { data: users, error: findErr } = await supabase
      .from('users')
      .select('*')
      .ilike('mail', normalizedMail);

    if (findErr || !users || users.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy tài khoản người dùng!' });
    }

    const targetUser = users[0];

    // 2. Thêm hoặc cập nhật vào bảng seller_requests đúng schema (user_id, shop_name, note, status)
    const { data: existingReqs } = await supabase
      .from('seller_requests')
      .select('id')
      .eq('user_id', targetUser.id)
      .eq('status', 'pending');

    if (existingReqs && existingReqs.length > 0) {
      await supabase
        .from('seller_requests')
        .update({
          shop_name: game || 'Gian hàng game',
          note: experience || 'Yêu cầu mở gian hàng bán game',
          created_at: new Date().toISOString()
        })
        .eq('id', existingReqs[0].id);
    } else {
      const { error: insErr } = await supabase
        .from('seller_requests')
        .insert([{
          user_id: targetUser.id,
          shop_name: game || 'Gian hàng game',
          address: 'Chưa cập nhật',
          phone: '0912345678',
          id_card_front_url: 'https://example.com/cccd-front.jpg',
          id_card_back_url: 'https://example.com/cccd-back.jpg',
          note: experience || 'Yêu cầu mở gian hàng bán game',
          status: 'pending',
          created_at: new Date().toISOString()
        }]);

      if (insErr) {
        console.error('Lỗi ghi vào bảng seller_requests:', insErr);
        return res.status(500).json({ message: insErr.message });
      }
    }

    console.log(`📝 Đã ghi nhận yêu cầu làm người bán thành công: ${normalizedMail} (ID: ${targetUser.id})`);
    res.status(200).json({
      message: 'Đã gửi yêu cầu đăng ký làm người bán thành công! Vui lòng chờ Admin xét duyệt.',
      user: {
        ...targetUser,
        sellerStatus: 'pending',
        sellerRejectReason: ''
      }
    });
  } catch (error) {
    console.error('Lỗi khi gửi yêu cầu nâng cấp người bán:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi hệ thống khi nâng cấp.' });
  }
});

// --- 8. QUẢN LÝ SẢN PHẨM (PRODUCTS) ---
// GET /products - Lấy tất cả sản phẩm từ Supabase kèm thông tin người bán
app.get('/products', async (req, res) => {
  try {
    const { data: products, error: pErr } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (pErr) {
      return res.status(500).json({ message: pErr.message });
    }

    const { data: users } = await supabase.from('users').select('id, name, mail');
    const userMap = {};
    (users || []).forEach(u => { userMap[u.id] = u; });

    const formatted = (products || []).map(p => ({
      ...p,
      seller_name: userMap[p.seller_id]?.name || 'Hệ thống G2G',
      seller_mail: userMap[p.seller_id]?.mail || 'admin@gmail.com'
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error('Lỗi khi lấy sản phẩm:', err);
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy danh sách sản phẩm.' });
  }
});

// GET /products/:id - Lấy chi tiết 1 sản phẩm
app.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm!' });
    }

    const { data: user } = await supabase.from('users').select('id, name, mail').eq('id', data.seller_id).single();

    res.status(200).json({
      ...data,
      seller_name: user?.name || 'Hệ thống G2G',
      seller_mail: user?.mail || 'admin@gmail.com'
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy sản phẩm.' });
  }
});

// POST /products - Thêm sản phẩm / Đăng bán mới (cho Người bán)
app.post('/products', async (req, res) => {
  try {
    const {
      seller_id,
      product_name,
      price,
      stock_quantity = 1,
      description = '',
      game_id = 1,
      category_id = 1,
      server = 'Vietnam',
      badge = 'Người Bán Mới',
      image_url = null
    } = req.body;

    if (!seller_id || !product_name || price === undefined) {
      return res.status(400).json({ message: 'Vui lòng cung cấp đầy đủ thông tin sản phẩm và người bán!' });
    }

    const { data, error } = await supabase
      .from('products')
      .insert([{
        seller_id: Number(seller_id),
        product_name: product_name.trim(),
        price: Number(price),
        stock_quantity: Number(stock_quantity),
        description: description.trim(),
        game_id: Number(game_id) || 1,
        category_id: Number(category_id) || 1,
        server: server || 'Vietnam',
        badge: badge || 'Người Bán Mới',
        image_url: image_url || null,
        status: 'active'
      }])
      .select();

    if (error) {
      console.error('Lỗi thêm sản phẩm:', error);
      return res.status(500).json({ message: error.message });
    }

    res.status(201).json({ message: 'Đăng bán sản phẩm thành công!', product: data[0] });
  } catch (err) {
    console.error('Lỗi tạo sản phẩm:', err);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi đăng sản phẩm.' });
  }
});

// PUT /products/:id - Cập nhật sản phẩm
app.put('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select();

    if (error) return res.status(500).json({ message: error.message });
    res.status(200).json({ message: 'Cập nhật sản phẩm thành công!', product: data[0] });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật sản phẩm.' });
  }
});

// DELETE /products/:id - Xóa sản phẩm
app.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) return res.status(500).json({ message: error.message });
    res.status(200).json({ message: 'Đã xóa sản phẩm thành công!' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi xóa sản phẩm.' });
  }
});

// --- 9. QUẢN LÝ ĐƠN HÀNG (ORDERS & ORDER_ITEMS) ---
// POST /orders - Tạo đơn hàng khi người mua thanh toán
app.post('/orders', async (req, res) => {
  try {
    const { user_id, seller_id, total_price, items } = req.body;

    if (!user_id || !total_price || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Thông tin đơn hàng không hợp lệ!' });
    }

    // 1. Tạo đơn hàng trong bảng orders
    const { data: orderData, error: oErr } = await supabase
      .from('orders')
      .insert([{
        user_id: Number(user_id),
        seller_id: Number(seller_id) || 1,
        total_price: Number(total_price),
        status: 'completed'
      }])
      .select();

    if (oErr) {
      console.error('Lỗi tạo đơn hàng:', oErr);
      return res.status(500).json({ message: oErr.message });
    }

    const createdOrder = orderData[0];

    // 2. Thêm các mục đơn hàng vào order_items
    const orderItemsPayload = items.map(it => ({
      order_id: createdOrder.id,
      product_id: Number(it.product_id) || 1,
      quantity: Number(it.quantity) || 1,
      unit_price: Number(it.unit_price) || 0,
      total_price: Number(it.total_price || (it.quantity * it.unit_price)) || 0
    }));

    const { error: oiErr } = await supabase
      .from('order_items')
      .insert(orderItemsPayload);

    if (oiErr) {
      console.error('Lỗi thêm order_items:', oiErr);
    }

    // 3. Cập nhật trừ kho hàng của các sản phẩm đã mua
    for (const it of items) {
      if (it.product_id) {
        try {
          const { data: pData } = await supabase.from('products').select('stock_quantity').eq('id', it.product_id).single();
          if (pData) {
            const newStock = Math.max(0, (pData.stock_quantity || 0) - (Number(it.quantity) || 1));
            await supabase.from('products').update({ stock_quantity: newStock }).eq('id', it.product_id);
          }
        } catch (e) {
          console.warn('Lỗi trừ kho sản phẩm:', e.message);
        }
      }
    }

    // 4. Cập nhật trừ số dư ví người mua
    try {
      const { data: buyerUser } = await supabase.from('users').select('balance').eq('id', user_id).single();
      if (buyerUser) {
        const newBuyerBal = Math.max(0, (buyerUser.balance || 0) - Number(total_price));
        await supabase.from('users').update({ balance: newBuyerBal }).eq('id', user_id);
      }
    } catch (e) {
      console.warn('Lỗi trừ số dư người mua:', e.message);
    }

    // 5. Cộng doanh thu cho người bán (khấu trừ 10% phí app cho Admin)
    const targetSellerId = Number(seller_id) || 1;
    const appFee = Math.floor(Number(total_price) * 0.10);
    const sellerNet = Number(total_price) - appFee;

    try {
      // Cộng cho seller
      const { data: sUser } = await supabase.from('users').select('balance').eq('id', targetSellerId).single();
      if (sUser) {
        await supabase.from('users').update({ balance: (sUser.balance || 0) + sellerNet }).eq('id', targetSellerId);
      }
      // Cộng 10% phí app cho Admin (ID 1)
      const { data: adminUser } = await supabase.from('users').select('balance').eq('id', 1).single();
      if (adminUser) {
        await supabase.from('users').update({ balance: (adminUser.balance || 0) + appFee }).eq('id', 1);
      }
    } catch (e) {
      console.warn('Lỗi cộng số dư người bán:', e.message);
    }

    console.log(`📦 Đã tạo đơn hàng #${createdOrder.id} trên Supabase cho người dùng ID ${user_id}`);
    res.status(201).json({
      message: 'Đặt hàng thành công!',
      order: createdOrder
    });
  } catch (err) {
    console.error('Lỗi khi đặt hàng:', err);
    res.status(500).json({ message: 'Đã xảy ra lỗi khi tạo đơn hàng.' });
  }
});

// GET /orders - Lấy danh sách đơn hàng (theo user_id hoặc seller_id)
app.get('/orders', async (req, res) => {
  try {
    const { user_id, seller_id } = req.query;

    let query = supabase.from('orders').select('*').order('id', { ascending: false });
    if (user_id) {
      query = query.eq('user_id', Number(user_id));
    } else if (seller_id) {
      query = query.eq('seller_id', Number(seller_id));
    }

    const { data: orders, error: oErr } = await query;
    if (oErr) {
      return res.status(500).json({ message: oErr.message });
    }

    if (!orders || orders.length === 0) {
      return res.status(200).json([]);
    }

    // Lấy thông tin order_items
    const orderIds = orders.map(o => o.id);
    const { data: allItems } = await supabase
      .from('order_items')
      .select('*')
      .in('order_id', orderIds);

    // Lấy thông tin products
    const productIds = [...new Set((allItems || []).map(i => i.product_id))];
    const { data: prods } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds);
    const prodMap = {};
    (prods || []).forEach(p => { prodMap[p.id] = p; });

    // Lấy thông tin users
    const userIds = [...new Set([...orders.map(o => o.user_id), ...orders.map(o => o.seller_id)])];
    const { data: users } = await supabase.from('users').select('id, name, mail').in('id', userIds);
    const userMap = {};
    (users || []).forEach(u => { userMap[u.id] = u; });

    // Format dữ liệu đồng nhất với giao diện React
    const formattedOrders = orders.map(o => {
      const items = (allItems || []).filter(it => it.order_id === o.id);
      const firstItem = items[0];
      const prod = firstItem ? prodMap[firstItem.product_id] : null;

      const dateStr = new Date(o.created_at).toLocaleDateString('vi-VN');

      return {
        id: `G2G-${o.id}`,
        numeric_id: o.id,
        user_id: o.user_id,
        seller_id: o.seller_id,
        buyerName: userMap[o.user_id]?.name || 'GamerPro',
        buyerMail: userMap[o.user_id]?.mail || '',
        sellerName: userMap[o.seller_id]?.name || 'Hệ thống G2G',
        date: dateStr,
        gameName: prod ? (prod.product_name || 'Game Item') : 'Dịch vụ game trực tuyến',
        itemName: prod ? prod.product_name : 'Gói vật phẩm',
        price: o.total_price,
        qty: firstItem ? firstItem.quantity : 1,
        status: o.status || 'completed',
        paymentMethod: 'Số dư ví G2G',
        items: items.map(it => ({
          ...it,
          product_name: prodMap[it.product_id]?.product_name || 'Sản phẩm'
        }))
      };
    });

    res.status(200).json(formattedOrders);
  } catch (err) {
    console.error('Lỗi khi lấy danh sách đơn hàng:', err);
    res.status(500).json({ message: 'Lỗi máy chủ khi lấy đơn hàng.' });
  }
});

// PUT /orders/:id/status - Cập nhật trạng thái đơn hàng (giao hàng)
app.put('/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const numericId = id.toString().replace(/\D/g, '');

    const { data, error } = await supabase
      .from('orders')
      .update({ status: status || 'completed' })
      .eq('id', numericId)
      .select();

    if (error) return res.status(500).json({ message: error.message });
    res.status(200).json({ message: 'Cập nhật trạng thái đơn hàng thành công!', order: data[0] });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi cập nhật trạng thái đơn hàng.' });
  }
});

// --- 10. QUẢN LÝ SỐ DƯ VÍ (WALLET) ---
// POST /wallet/deposit - Nạp tiền vào ví
app.post('/wallet/deposit', async (req, res) => {
  try {
    const { user_id, amount } = req.body;
    const depositAmount = Number(amount);

    if (!user_id || isNaN(depositAmount) || depositAmount <= 0) {
      return res.status(400).json({ message: 'Số tiền nạp không hợp lệ!' });
    }

    const { data: user, error: findErr } = await supabase
      .from('users')
      .select('balance')
      .eq('id', Number(user_id))
      .single();

    if (findErr || !user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng!' });
    }

    const updatedBalance = (user.balance || 0) + depositAmount;

    const { error: updErr } = await supabase
      .from('users')
      .update({ balance: updatedBalance })
      .eq('id', Number(user_id));

    if (updErr) return res.status(500).json({ message: updErr.message });

    console.log(`💰 Đã nạp ${depositAmount.toLocaleString('vi-VN')}₫ vào tài khoản ID ${user_id}. Số dư mới: ${updatedBalance}`);
    res.status(200).json({
      message: 'Nạp tiền vào ví thành công!',
      balance: updatedBalance
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi nạp tiền vào ví.' });
  }
});

// GET /wallet/balance/:userId - Lấy số dư ví của user
app.get('/wallet/balance/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { data, error } = await supabase
      .from('users')
      .select('id, name, balance')
      .eq('id', Number(userId))
      .single();

    if (error || !data) return res.status(404).json({ message: 'Không tìm thấy tài khoản!' });
    res.status(200).json({ balance: data.balance || 0 });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi kiểm tra số dư.' });
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Máy chủ backend đang chạy tại: http://127.0.0.1:${PORT}`);
});
