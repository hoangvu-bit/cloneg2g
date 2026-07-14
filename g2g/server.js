import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dns from 'dns';

// Fix for querySrv ECONNREFUSED when resolving SRV records using local ISP DNS
dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Atlas connection string from screenshot
const mongoURI = 'mongodb+srv://hoangglannn1999_db_user:hoangthithanhlan12121999@loginproject.wzwv55n.mongodb.net/LoginProject?appName=LoginProject';

mongoose.connect(mongoURI)
  .then(() => {
    console.log('✅ Kết nối MongoDB Atlas thành công!');
    seedAdmin();
  })
  .catch((err) => console.error('❌ Lỗi kết nối MongoDB Atlas:', err));

// User Schema & Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mail: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'regular' },
  company_name: { type: String, default: null },
  tax_id: { type: String, default: null },
  // Seller Request fields
  sellerStatus: { type: String, default: 'none' }, // 'none', 'pending', 'approved', 'rejected'
  sellerRequestGame: { type: String, default: '' },
  sellerRequestExperience: { type: String, default: '' },
  sellerRejectReason: { type: String, default: '' }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Admin Seeding Logic
const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ mail: 'admin@gmail.com' });
    if (!adminExists) {
      const adminUser = new User({
        name: 'Admin G2G',
        mail: 'admin@gmail.com',
        password: 'admin123',
        role: 'admin',
        sellerStatus: 'none'
      });
      await adminUser.save();
      console.log('👑 Đã khởi tạo tài khoản Admin mặc định (admin@gmail.com / admin123)');
    }
  } catch (err) {
    console.error('❌ Lỗi khi khởi tạo tài khoản Admin:', err);
  }
};

// API Endpoints

// 1. Đăng ký tài khoản (POST /register)
app.post('/register', async (req, res) => {
  try {
    const { name, mail, password, role, company_name, tax_id } = req.body;

    if (!name || !mail || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin bắt buộc (tên, email, mật khẩu)!' });
    }

    // Kiểm tra xem email đã tồn tại hay chưa
    const existingUser = await User.findOne({ mail });
    if (existingUser) {
      return res.status(400).json({ message: 'Email này đã được đăng ký từ trước!' });
    }

    // Tạo người dùng mới
    const newUser = new User({
      name,
      mail,
      password, // Lưu mật khẩu text để phù hợp với offline fallback
      role: role || 'regular',
      company_name,
      tax_id
    });

    await newUser.save();
    console.log(`👤 Đã tạo người dùng mới thành công: ${mail}`);
    res.status(201).json({ message: 'Đăng ký tài khoản thành công!' });
  } catch (error) {
    console.error('Lỗi khi đăng ký:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi hệ thống khi đăng ký.' });
  }
});

// 2. Đăng nhập tài khoản (POST /login)
app.post('/login', async (req, res) => {
  try {
    const { mail, password } = req.body;

    if (!mail || !password) {
      return res.status(400).json({ message: 'Vui lòng cung cấp email và mật khẩu!' });
    }

    // Tìm người dùng theo email
    const user = await User.findOne({ mail });
    if (!user) {
      return res.status(401).json({ message: 'Tài khoản này chưa tồn tại, hãy đăng ký!' });
    }

    // Kiểm tra mật khẩu
    if (user.password !== password) {
      return res.status(401).json({ message: 'Mật khẩu không chính xác!' });
    }

    // Tạo access token giả lập
    const accessToken = `online-session-token-${user._id}-${Date.now()}`;

    console.log(`🔑 Người dùng đăng nhập thành công: ${mail}`);
    res.status(200).json({
      access_token: accessToken,
      user: {
        id: user._id,
        mail: user.mail,
        name: user.name,
        role: user.role,
        sellerStatus: user.sellerStatus || 'none',
        sellerRejectReason: user.sellerRejectReason || ''
      }
    });
  } catch (error) {
    console.error('Lỗi khi đăng nhập:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi hệ thống khi đăng nhập.' });
  }
});

// 3. Yêu cầu nâng cấp tài khoản bán game (POST /upgrade-seller)
app.post('/upgrade-seller', async (req, res) => {
  try {
    const { mail, game, experience } = req.body;

    if (!mail) {
      return res.status(400).json({ message: 'Không tìm thấy thông tin email để nâng cấp!' });
    }

    const user = await User.findOne({ mail });
    if (!user) {
      return res.status(404).json({ message: 'Tài khoản không tồn tại!' });
    }

    // Cập nhật trạng thái chờ xét duyệt (pending) thay vì nâng cấp thẳng
    user.sellerStatus = 'pending';
    user.sellerRequestGame = game || '';
    user.sellerRequestExperience = experience || '';
    user.sellerRejectReason = '';
    await user.save();

    console.log(`📩 Nhận yêu cầu lên người bán từ: ${mail} (Game: ${game})`);
    res.status(200).json({
      message: 'Gửi yêu cầu xét duyệt thành công! Vui lòng chờ admin phê duyệt.',
      user: {
        id: user._id,
        mail: user.mail,
        name: user.name,
        role: user.role,
        sellerStatus: user.sellerStatus,
        sellerRejectReason: user.sellerRejectReason
      }
    });
  } catch (error) {
    console.error('Lỗi nâng cấp người bán:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi hệ thống khi nâng cấp người bán.' });
  }
});

// 4. Lấy danh sách toàn bộ người dùng (GET /users)
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Ẩn mật khẩu để bảo mật
    res.status(200).json(users);
  } catch (error) {
    console.error('Lỗi lấy danh sách người dùng:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi hệ thống khi lấy danh sách người dùng.' });
  }
});

// 5. Admin phê duyệt làm người bán (POST /admin/approve-seller)
app.post('/admin/approve-seller', async (req, res) => {
  try {
    const { mail } = req.body;
    const user = await User.findOne({ mail });
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại!' });
    }
    user.role = 'seller';
    user.sellerStatus = 'approved';
    user.sellerRejectReason = '';
    await user.save();
    console.log(`✅ Phê duyệt người bán thành công: ${mail}`);
    res.status(200).json({ message: 'Đã phê duyệt người bán thành công!', user });
  } catch (error) {
    console.error('Lỗi khi phê duyệt người bán:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi hệ thống khi phê duyệt.' });
  }
});

// 6. Admin từ chối làm người bán (POST /admin/reject-seller)
app.post('/admin/reject-seller', async (req, res) => {
  try {
    const { mail, reason } = req.body;
    const user = await User.findOne({ mail });
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại!' });
    }
    user.sellerStatus = 'rejected';
    user.sellerRejectReason = reason || 'Không đủ điều kiện xét duyệt.';
    await user.save();
    console.log(`❌ Từ chối yêu cầu người bán của: ${mail}. Lý do: ${reason}`);
    res.status(200).json({ message: 'Đã từ chối yêu cầu làm người bán!', user });
  } catch (error) {
    console.error('Lỗi khi từ chối người bán:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi hệ thống khi từ chối.' });
  }
});

// 7. Admin trực tiếp đổi vai trò của người dùng (POST /admin/update-role)
app.post('/admin/update-role', async (req, res) => {
  try {
    const { mail, role } = req.body;
    const user = await User.findOne({ mail });
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tồn tại!' });
    }
    user.role = role;
    if (role === 'seller') {
      user.sellerStatus = 'approved';
    } else if (role === 'regular') {
      user.sellerStatus = 'none';
    }
    await user.save();
    console.log(`🔄 Cập nhật vai trò thành công: ${mail} -> ${role}`);
    res.status(200).json({ message: 'Đã cập nhật vai trò người dùng thành công!', user });
  } catch (error) {
    console.error('Lỗi khi cập nhật vai trò:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi hệ thống khi cập nhật vai trò.' });
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Máy chủ backend đang chạy tại: http://127.0.0.1:${PORT}`);
});
