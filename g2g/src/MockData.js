// Mock Games Database with Sub-products/Denominations
export const MOCK_GAMES = [
  {
    id: 'roblox',
    name: 'Roblox Robux (Global)',
    category: 'coins',
    badge: 'Fast Delivery',
    textIcon: 'R$',
    color: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
    description: 'Nạp Robux giá rẻ, tự động, hỗ trợ tài khoản Global bảo mật 100% với bảo hiểm GamerProtect.',
    items: [
      { id: 'roblox-80', name: '80 Robux', price: 22000, badge: 'Auto Send', region: 'Global', offers: 14 },
      { id: 'roblox-400', name: '400 Robux', price: 95000, badge: 'Auto Send', region: 'Global', offers: 25 },
      { id: 'roblox-800', name: '800 Robux', price: 190000, badge: 'Instant Send', region: 'Global', offers: 32 },
      { id: 'roblox-1700', name: '1700 Robux', price: 380000, badge: 'Instant Send', region: 'Global', offers: 18 },
      { id: 'roblox-4500', name: '4500 Robux', price: 990000, badge: 'Secure Delivery', region: 'Global', offers: 12 },
    ]
  },
  {
    id: 'garena-shells',
    name: 'Garena Shells (Sò Garena)',
    category: 'cards',
    badge: 'Auto Delivery',
    textIcon: 'Gar',
    color: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
    description: 'Sò Garena Việt Nam dùng để nạp các game Liên Quân Mobile, Free Fire, FC Online giá rẻ nhất.',
    items: [
      { id: 'gar-20', name: '20 Sò Garena', price: 9500, badge: 'Auto Send', region: 'Vietnam', offers: 8 },
      { id: 'gar-50', name: '50 Sò Garena', price: 24000, badge: 'Auto Send', region: 'Vietnam', offers: 16 },
      { id: 'gar-100', name: '100 Sò Garena', price: 48000, badge: 'Auto Send', region: 'Vietnam', offers: 28 },
      { id: 'gar-200', name: '200 Sò Garena', price: 95000, badge: 'Auto Send', region: 'Vietnam', offers: 34 },
      { id: 'gar-500', name: '500 Sò Garena', price: 238000, badge: 'Auto Send', region: 'Vietnam', offers: 22 },
    ]
  },
  {
    id: 'zing-card',
    name: 'Zing Card VNG',
    category: 'cards',
    badge: '-5% Discount',
    textIcon: 'Zing',
    color: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
    description: 'Thẻ Zing nạp game VNG: Võ Lâm Truyền Kỳ, Kiếm Thế, PUBG Mobile, Boom M giá rẻ chiết khấu cao.',
    items: [
      { id: 'zing-20', name: 'Thẻ Zing 20K', price: 19000, badge: 'Discount 5%', region: 'Vietnam', offers: 5 },
      { id: 'zing-50', name: 'Thẻ Zing 50K', price: 47500, badge: 'Discount 5%', region: 'Vietnam', offers: 12 },
      { id: 'zing-100', name: 'Thẻ Zing 100K', price: 95000, badge: 'Discount 5%', region: 'Vietnam', offers: 19 },
      { id: 'zing-200', name: 'Thẻ Zing 200K', price: 190000, badge: 'Discount 5%', region: 'Vietnam', offers: 24 },
      { id: 'zing-500', name: 'Thẻ Zing 500K', price: 475000, badge: 'Discount 5%', region: 'Vietnam', offers: 15 },
    ]
  },
  {
    id: 'valorant-points',
    name: 'Valorant Points (VP)',
    category: 'coins',
    badge: 'Instant Delivery',
    textIcon: 'VP',
    color: 'linear-gradient(135deg, #7f1d1d 0%, #111827 100%)',
    description: 'Nạp VP mua skin súng Valorant giá rẻ. Nhận mã code hoặc nạp trực tiếp qua tài khoản RIOT.',
    items: [
      { id: 'vp-475', name: '475 Valorant Points', price: 95000, badge: 'Auto Send', region: 'Global', offers: 6 },
      { id: 'vp-1000', name: '1000 Valorant Points', price: 190000, badge: 'Auto Send', region: 'Global', offers: 15 },
      { id: 'vp-2050', name: '2050 Valorant Points', price: 380000, badge: 'Auto Send', region: 'Global', offers: 22 },
      { id: 'vp-3750', name: '3750 Valorant Points', price: 690000, badge: 'Instant Deliver', region: 'Global', offers: 18 },
      { id: 'vp-5350', name: '5350 Valorant Points', price: 980000, badge: 'Instant Deliver', region: 'Global', offers: 10 },
    ]
  },
  {
    id: 'steam-wallet',
    name: 'Steam Wallet Code (Global)',
    category: 'cards',
    badge: 'Auto Send',
    textIcon: 'Steam',
    color: 'linear-gradient(135deg, #475569 0%, #1e293b 100%)',
    description: 'Mã code nạp Steam Wallet mua game, vật phẩm Market bảo mật tốt nhất.',
    items: [
      { id: 'steam-5', name: 'Steam Wallet Code 5$', price: 125000, badge: 'Auto Send', region: 'Global', offers: 12 },
      { id: 'steam-10', name: 'Steam Wallet Code 10$', price: 248000, badge: 'Auto Send', region: 'Global', offers: 19 },
      { id: 'steam-20', name: 'Steam Wallet Code 20$', price: 490000, badge: 'Auto Send', region: 'Global', offers: 14 },
      { id: 'steam-50', name: 'Steam Wallet Code 50$', price: 1220000, badge: 'Auto Send', region: 'Global', offers: 8 },
    ]
  },
  {
    id: 'lien-quan-mobile',
    name: 'Liên Quân Mobile - Tài Khoản VIP',
    category: 'accounts',
    badge: 'Acc Trắng TT',
    textIcon: 'LQ',
    color: 'linear-gradient(135deg, #1e1b4b 0%, #311042 100%)',
    description: 'Tài khoản Liên Quân Mobile giá tốt, rank cao thủ, nhiều skin đẹp, đầy đủ ngọc.',
    items: [
      { id: 'lq-white', name: 'Tài Khoản Trắng Thông Tin', price: 50000, badge: 'Clean Acc', region: 'Vietnam', offers: 42 },
      { id: 'lq-caothu', name: 'Tài Khoản Cao Thủ 50 Skin', price: 150000, badge: 'Full Ngọc', region: 'Vietnam', offers: 85 },
      { id: 'lq-chientuong', name: 'Tài Khoản Chiến Tướng Full Tướng', price: 450000, badge: 'VIP Skin', region: 'Vietnam', offers: 30 },
      { id: 'lq-thachdau', name: 'Tài Khoản VIP Thách Đấu Skin SSS', price: 2500000, badge: 'Super Rich', region: 'Vietnam', offers: 5 },
    ]
  },
  {
    id: 'lol-boosting',
    name: 'League of Legends - Cày Thuê',
    category: 'boosting',
    badge: 'Pro Boosters',
    textIcon: 'LoL',
    color: 'linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)',
    description: 'Cày thuê LMHT uy tín bởi tuyển thủ thách đấu. Đảm bảo bảo mật tài khoản 100%.',
    items: [
      { id: 'lol-iron-gold', name: 'Cày Thuê Sắt lên Vàng', price: 100000, badge: 'Pro Boost', region: 'Vietnam', offers: 15 },
      { id: 'lol-gold-diamond', name: 'Cày Thuê Vàng lên Kim Cương', price: 350000, badge: 'Pro Boost', region: 'Vietnam', offers: 24 },
      { id: 'lol-master-challenger', name: 'Cày Thuê Cao Thủ lên Thách Đấu', price: 1200000, badge: 'Top Player', region: 'Vietnam', offers: 8 },
    ]
  },
  {
    id: 'genshin-impact',
    name: 'Genshin Impact - Acc Đẹp',
    category: 'accounts',
    badge: 'Safe Guarantee',
    textIcon: 'GI',
    color: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    description: 'Tài khoản Genshin Impact AR cao, sở hữu các nhân vật 5 sao giới hạn và vũ khí trấn cực xịn.',
    items: [
      { id: 'gi-ar40', name: 'Acc AR 40 Có 2 Tướng 5 Sao', price: 80000, badge: 'Starter Acc', region: 'Asia', offers: 25 },
      { id: 'gi-ar50', name: 'Acc AR 50 Có Raiden Shogun + Trấn', price: 250000, badge: 'Hot Pick', region: 'Asia', offers: 40 },
      { id: 'gi-ar55', name: 'Acc AR 55 Giá Rẻ Hơn 10 Tướng 5 Sao', price: 650000, badge: 'Secure 100%', region: 'Asia', offers: 18 },
      { id: 'gi-whale', name: 'Acc Whale AR 60 Cung Mệnh C6R5', price: 8500000, badge: 'Whale Acc', region: 'Asia', offers: 3 },
    ]
  },
  {
    id: 'counter-strike-2',
    name: 'Counter-Strike 2 - Skins & Hòm',
    category: 'items',
    badge: 'Hot Skins',
    textIcon: 'CS2',
    color: 'linear-gradient(135deg, #ea580c 0%, #7c2d12 100%)',
    description: 'Skins súng, dao, găng tay CS2 cực hot. Giao dịch trực tiếp qua Steam Trade Offer an toàn 100%.',
    items: [
      { id: 'cs-knife', name: 'Karambit | Doppler (Factory New)', price: 15500000, badge: 'Rare Knife', region: 'Global', offers: 5 },
      { id: 'cs-gloves', name: 'Sport Gloves | Pandora\'s Box (Field-Tested)', price: 28500000, badge: 'Rare Gloves', region: 'Global', offers: 3 },
      { id: 'cs-ak', name: 'AK-47 | Case Hardened (Minimal Wear)', price: 4200000, badge: 'Popular', region: 'Global', offers: 18 },
      { id: 'cs-case', name: 'Kilowatt Case x50 Hòm CS2', price: 230000, badge: 'Instant Send', region: 'Global', offers: 35 },
    ]
  },
  {
    id: 'cs2-skin-cases',
    name: 'CS2 Weapon Skins Marketplace',
    category: 'skin',
    badge: 'Instant Trade',
    textIcon: 'Skin',
    color: 'linear-gradient(135deg, #a21caf 0%, #4c0519 100%)',
    description: 'Nơi mua bán skin súng, dao CS2 trực tiếp giá tốt nhất, chiết khấu lên đến 30% so với Steam.',
    items: [
      { id: 'skin-m4a1', name: 'M4A1-S | Printstream (Field-Tested)', price: 1250000, badge: 'Hot Skin', region: 'Global', offers: 14 },
      { id: 'skin-awp', name: 'AWP | Asiimov (Well-Worn)', price: 2100000, badge: 'Classic Skin', region: 'Global', offers: 8 },
      { id: 'skin-usp', name: 'USP-S | Kill Confirmed (Minimal Wear)', price: 890000, badge: 'Auto Trade', region: 'Global', offers: 16 }
    ]
  },
  {
    id: 'software-keys',
    name: 'Bản Quyền Phần Mềm & Key',
    category: 'software',
    badge: '100% Genuine',
    textIcon: 'Key',
    color: 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)',
    description: 'Key bản quyền chính hãng Windows 11 Pro, Office 365, diệt virus Kaspersky kích hoạt online.',
    items: [
      { id: 'soft-win11', name: 'Key Windows 11 Pro Retail Lifetime', price: 180000, badge: 'Key Auto', region: 'Global', offers: 25 },
      { id: 'soft-office', name: 'Key Office 2021 Professional Plus', price: 250000, badge: 'Key Auto', region: 'Global', offers: 19 },
      { id: 'soft-kaspersky', name: 'Kaspersky Premium 1 Năm 1 Thiết Bị', price: 150000, badge: 'Instant Code', region: 'Vietnam', offers: 12 }
    ]
  },
  {
    id: 'payment-cards',
    name: 'Thẻ Trả Trước Visa & Mastercard',
    category: 'payment-cards',
    badge: 'Secure Pay',
    textIcon: 'Card',
    color: 'linear-gradient(135deg, #0f766e 0%, #115e59 100%)',
    description: 'Thẻ ảo Visa, Mastercard trả trước dùng để thanh toán quốc tế, mua quảng cáo, đăng ký Netflix.',
    items: [
      { id: 'pay-visa5', name: 'Thẻ Ảo Visa Prepaid 5$', price: 145000, badge: 'Instant Card', region: 'Global', offers: 8 },
      { id: 'pay-visa10', name: 'Thẻ Ảo Visa Prepaid 10$', price: 285000, badge: 'Instant Card', region: 'Global', offers: 12 },
      { id: 'pay-master20', name: 'Thẻ Ảo Mastercard Prepaid 20$', price: 560000, badge: 'Instant Card', region: 'Global', offers: 6 }
    ]
  }
];

// Mock GamePal Partners List
export const GAMEPAL_PARTNERS = [
  { id: 1, name: 'SkyBlade_Radiant', rating: '4.9', reviews: '1.2k+', game: 'Valorant', earnings: '3.500.000₫ - 8.000.000₫ / tuần', avatarText: 'SB', online: true },
  { id: 2, name: 'GenshinProHelper', rating: '5.0', reviews: '342', game: 'Genshin Impact', earnings: '2.000.000₫ - 4.500.000₫ / tuần', avatarText: 'GP', online: true },
  { id: 3, name: 'Katarina_Master', rating: '4.8', reviews: '820', game: 'League of Legends', earnings: '4.000.000₫ - 9.000.000₫ / tuần', avatarText: 'KM', online: true },
  { id: 4, name: 'RobloxRichBoy', rating: '4.9', reviews: '155', game: 'Roblox Trading', earnings: '1.500.000₫ - 3.200.000₫ / tuần', avatarText: 'RR', online: true },
];

// Mock Coaching Partners List
export const COACHING_PARTNERS = [
  { id: 'c1', name: 'uhKelsie', avatarText: 'K', tiktok: true, online: false, bgColor: '#ec4899', avatarImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150' },
  { id: 'c2', name: 'BoostRoom', avatarText: 'BR', tiktok: false, online: false, bgColor: '#ea580c', avatarImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150' },
  { id: 'c3', name: 'SPlusSquad', avatarText: 'SP', tiktok: false, online: true, bgColor: '#06b6d4', avatarImage: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150' },
  { id: 'c4', name: 'AlexDota2', avatarText: 'A', tiktok: false, online: false, bgColor: '#2563eb', avatarImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
  { id: 'c5', name: 'Bieganzafro', avatarText: 'B', tiktok: false, online: false, bgColor: '#10b981', avatarImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
  { id: 'c6', name: 'HLEB24', avatarText: 'H', tiktok: true, online: false, bgColor: '#7c3aed', avatarImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150' }
];

// Mock GamePal Avatars List
export const GAMEPAL_AVATARS = [
  { id: 'g1', name: 'Zyra', avatarText: 'Z', online: true, bgColor: '#ec4899', avatarImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
  { id: 'g2', name: 'Yuki Chan', avatarText: 'Y', online: true, bgColor: '#8b5cf6', avatarImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150' },
  { id: 'g3', name: 'Mèo Meo', avatarText: 'M', online: true, bgColor: '#f43f5e', avatarImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150' },
  { id: 'g4', name: 'Pandaa', avatarText: 'P', online: true, bgColor: '#10b981', avatarImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150' },
  { id: 'g5', name: 'Cáo Tuyết', avatarText: 'C', online: false, bgColor: '#06b6d4', avatarImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150' },
  { id: 'g6', name: 'Linh Nhi', avatarText: 'LN', online: true, bgColor: '#e11d48', avatarImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150' }
];

// Mock G2G Trending Games Data
export const TRENDING_BLOCKS = {
  coins: [
    { name: 'Path of Exile 2', offers: '2.092 ưu đãi', gameId: 'path-of-exile-2' },
    { name: 'Albion Online', offers: '204 ưu đãi', gameId: 'albion-online' },
    { name: 'WOW Classic Era / Seasonal / TBC Anniversary', offers: '5.347 ưu đãi', gameId: 'wow-classic' },
    { name: 'Aion 2', offers: '2.280 ưu đãi', gameId: 'aion-2' },
    { name: 'Blade & Soul NEO', offers: '336 ưu đãi', gameId: 'blade-soul-neo' },
    { name: 'World Of Warcraft', offers: '51.041 ưu đãi', gameId: 'world-of-warcraft' },
    { name: 'Lost Ark', offers: '714 ưu đãi', gameId: 'lost-ark' },
    { name: 'Toram Online', offers: '28 ưu đãi', gameId: 'toram-online' }
  ],
  cards: [
    { name: 'Zing Card VNG', offers: '19 ưu đãi', gameId: 'zing-card' },
    { name: 'Roblox Gift Card', offers: '32 ưu đãi', gameId: 'roblox' },
    { name: 'Steam Wallet Card', offers: '19 ưu đãi', gameId: 'steam-wallet' },
    { name: 'Garena Shells Card', offers: '34 ưu đãi', gameId: 'garena-shells' },
    { name: 'PlayStation Network Card', offers: '281 ưu đãi', gameId: 'psn-card' },
    { name: 'Xbox Live Gift Card', offers: '143 ưu đãi', gameId: 'xbox-card' },
    { name: 'Google Play Gift Card', offers: '98 ưu đãi', gameId: 'google-play' },
    { name: 'iTunes Gift Card', offers: '76 ưu đãi', gameId: 'itunes' }
  ],
  accounts: [
    { name: 'Genshin Impact Accounts', offers: '1.240 ưu đãi', gameId: 'genshin-impact' },
    { name: 'Liên Quân Mobile Accounts', offers: '85 ưu đãi', gameId: 'lien-quan-mobile' },
    { name: 'Valorant Accounts', offers: '321 ưu đãi', gameId: 'valorant-points' },
    { name: 'League of Legends Accounts', offers: '412 ưu đãi', gameId: 'league-of-legends' },
    { name: 'Roblox VIP Accounts', offers: '189 ưu đãi', gameId: 'roblox' },
    { name: 'Clash of Clans Accounts', offers: '254 ưu đãi', gameId: 'clash-of-clans' },
    { name: 'PUBG Mobile Accounts', offers: '345 ưu đãi', gameId: 'pubg-mobile' },
    { name: 'Free Fire Accounts', offers: '298 ưu đãi', gameId: 'free-fire' }
  ],
  boosting: [
    { name: 'Valorant Rank Boosting', offers: '84 ưu đãi', gameId: 'valorant-points' },
    { name: 'League of Legends Boosting', offers: '156 ưu đãi', gameId: 'league-of-legends' },
    { name: 'Genshin Impact Service', offers: '76 ưu đãi', gameId: 'genshin-impact' },
    { name: 'Liên Quân Mobile Boosting', offers: '32 ưu đãi', gameId: 'lien-quan-mobile' },
    { name: 'World of Warcraft Powerleveling', offers: '512 ưu đãi', gameId: 'world-of-warcraft' },
    { name: 'Lost Ark Raid Carries', offers: '189 ưu đãi', gameId: 'lost-ark' },
    { name: 'Albion Online Silver Farm', offers: '34 ưu đãi', gameId: 'albion-online' },
    { name: 'Diablo 4 Boosting', offers: '230 ưu đãi', gameId: 'diablo-4' }
  ]
};

// Mock Sellers Pool
export const MOCK_SELLERS = [
  { id: 'sel-1', name: 'GameKongs', rating: 4.9, reviews: 12430, successRate: '99.8%', speed: '3 phút', stock: 80, multiplier: 0.98 },
  { id: 'sel-2', name: 'FastDeliver_Store', rating: 4.8, reviews: 8520, successRate: '98.5%', speed: '5 phút', stock: 120, multiplier: 1.0 },
  { id: 'sel-3', name: 'GamerProtect_VIP', rating: 5.0, reviews: 3410, successRate: '100%', speed: '2 phút', stock: 50, multiplier: 1.02 },
  { id: 'sel-4', name: 'Cheapest_GameCard', rating: 4.6, reviews: 20150, successRate: '96.2%', speed: '12 phút', stock: 350, multiplier: 0.95 },
  { id: 'sel-5', name: 'ProSells_Global', rating: 4.7, reviews: 530, successRate: '97.1%', speed: '8 phút', stock: 30, multiplier: 1.05 }
];

// Mock Flash Sale Items
export const FLASH_SALE_ITEMS = [
  { id: 'fs-1', gameId: 'garena-shells', itemId: 'gar-200', name: 'Garena Shells 200 Sò', originalPrice: 95000, salePrice: 75000, stockLeft: 4, totalStock: 25, badge: '-21% OFF', color: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)', textIcon: 'Gar' },
  { id: 'fs-2', gameId: 'roblox', itemId: 'roblox-800', name: '800 Robux (Global)', originalPrice: 190000, salePrice: 155000, stockLeft: 3, totalStock: 30, badge: '-18% OFF', color: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', textIcon: 'R$' },
  { id: 'fs-3', gameId: 'steam-wallet', itemId: 'steam-10', name: 'Steam Wallet Code 10$', originalPrice: 248000, salePrice: 210000, stockLeft: 12, totalStock: 20, badge: '-15% OFF', color: 'linear-gradient(135deg, #475569 0%, #1e293b 100%)', textIcon: 'Steam' }
];

// Mock Customer Reviews
export const MOCK_REVIEWS = [
  { id: 1, user: 'HoangLong_99', rating: 5, comment: 'Giao hàng siêu nhanh, chỉ mất chưa đầy 1 phút đã nhận được mã nạp. Độ tin cậy tuyệt đối!', date: '01/07/2026' },
  { id: 2, user: 'AnhKhoa_Gamer', rating: 5, comment: 'Giao dịch qua bảo hiểm GamerProtect an tâm cực kỳ, giá lại rẻ hơn các shop khác.', date: '30/06/2026' },
  { id: 3, user: 'ThanhHang_lq', rating: 5, comment: 'Đã mua acc Liên Quân và nạp nhiều lần ở đây, chăm sóc khách hàng hỗ trợ rất nhiệt tình.', date: '28/06/2026' },
  { id: 4, user: 'ProGamer_VN', rating: 4, comment: 'Sản phẩm sạch, nạp tự động thuận tiện. Hơi lâu một tí vào giờ cao điểm nhưng chấp nhận được.', date: '25/06/2026' }
];
