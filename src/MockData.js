// Dynamic Games Array - Items are populated directly from Supabase Database at runtime
export const MOCK_GAMES = [
  {
    id: 'roblox',
    name: 'Roblox Robux (Global)',
    category: 'coins',
    badge: 'Fast Delivery',
    textIcon: 'R$',
    color: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
    description: 'Nạp Robux giá rẻ, tự động, hỗ trợ tài khoản Global bảo mật 100% với bảo hiểm GamerProtect.',
    items: []
  },
  {
    id: 'garena-shells',
    name: 'Garena Shells (Sò Garena)',
    category: 'cards',
    badge: 'Auto Delivery',
    textIcon: 'Gar',
    color: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
    description: 'Sò Garena Việt Nam dùng để nạp các game Liên Quân Mobile, Free Fire, FC Online giá rẻ nhất.',
    items: []
  },
  {
    id: 'zing-card',
    name: 'Zing Card VNG',
    category: 'cards',
    badge: '-5% Discount',
    textIcon: 'Zing',
    color: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
    description: 'Thẻ Zing nạp game VNG: Võ Lâm Truyền Kỳ, Kiếm Thế, PUBG Mobile, Boom M giá rẻ chiết khấu cao.',
    items: []
  },
  {
    id: 'valorant-points',
    name: 'Valorant Points (VP)',
    category: 'coins',
    badge: 'Instant Delivery',
    textIcon: 'VP',
    color: 'linear-gradient(135deg, #7f1d1d 0%, #111827 100%)',
    description: 'Nạp VP mua skin súng Valorant giá rẻ. Nhận mã code hoặc nạp trực tiếp qua tài khoản RIOT.',
    items: []
  },
  {
    id: 'steam-wallet',
    name: 'Steam Wallet Code (Global)',
    category: 'cards',
    badge: 'Auto Send',
    textIcon: 'Steam',
    color: 'linear-gradient(135deg, #475569 0%, #1e293b 100%)',
    description: 'Mã code nạp Steam Wallet mua game, vật phẩm Market bảo mật tốt nhất.',
    items: []
  },
  {
    id: 'lien-quan-mobile',
    name: 'Liên Quân Mobile - Tài Khoản VIP',
    category: 'accounts',
    badge: 'Acc Trắng TT',
    textIcon: 'LQ',
    color: 'linear-gradient(135deg, #1e1b4b 0%, #311042 100%)',
    description: 'Tài khoản Liên Quân Mobile giá tốt, rank cao thủ, nhiều skin đẹp, đầy đủ ngọc.',
    items: []
  },
  {
    id: 'lol-boosting',
    name: 'League of Legends - Cày Thuê',
    category: 'boosting',
    badge: 'Pro Boosters',
    textIcon: 'LoL',
    color: 'linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)',
    description: 'Cày thuê LMHT uy tín bởi tuyển thủ thách đấu. Đảm bảo bảo mật tài khoản 100%.',
    items: []
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
  ],
  coaching: [
    { name: 'Dịch vụ Coaching Pro (Valorant)', offers: '6 ưu đãi', gameId: 'valorant-points' },
    { name: 'HLV Thách Đấu LMHT (League of Legends)', offers: '12 ưu đãi', gameId: 'lol-boosting' },
    { name: 'Huấn luyện viên Genshin Impact', offers: '5 ưu đãi', gameId: 'genshin-impact' },
    { name: 'Đội ngũ HLV PUBG', offers: '8 ưu đãi', gameId: 'pubg-mobile' }
  ],
  gamepal: [
    { name: 'Bạn chơi cùng Valorant', offers: '14 ưu đãi', gameId: 'valorant-points' },
    { name: 'Bạn chơi cùng Liên Quân Mobile', offers: '22 ưu đãi', gameId: 'lien-quan-mobile' },
    { name: 'Bạn chơi cùng LMHT', offers: '16 ưu đãi', gameId: 'lol-boosting' },
    { name: 'Bạn chơi cùng CS2', offers: '9 ưu đãi', gameId: 'counter-strike-2' }
  ],
  items: [
    { name: 'Karambit Doppler CS2', offers: '5 ưu đãi', gameId: 'counter-strike-2' },
    { name: 'Kilowatt Case CS2', offers: '35 ưu đãi', gameId: 'counter-strike-2' },
    { name: 'Acc Roblox Gold Pack', offers: '14 ưu đãi', gameId: 'roblox' },
    { name: 'Vật phẩm Divine Orb (PoE 2)', offers: '9 ưu đãi', gameId: 'path-of-exile-2' }
  ],
  skin: [
    { name: 'M4A1-S Printstream CS2', offers: '14 ưu đãi', gameId: 'cs2-skin-cases' },
    { name: 'AWP Asiimov CS2', offers: '8 ưu đãi', gameId: 'cs2-skin-cases' },
    { name: 'USP-S Kill Confirmed CS2', offers: '16 ưu đãi', gameId: 'cs2-skin-cases' },
    { name: 'Skin VIP Liên Quân Mobile', offers: '30 ưu đãi', gameId: 'lien-quan-mobile' }
  ],
  topup: [
    { name: 'Nạp tiền Viettel chiết khấu', offers: '12 ưu đãi', gameId: 'topup' },
    { name: 'Nạp tiền Vinaphone chiết khấu', offers: '8 ưu đãi', gameId: 'topup' },
    { name: 'Nạp tiền MobiFone chiết khấu', offers: '6 ưu đãi', gameId: 'topup' }
  ],
  software: [
    { name: 'Key Windows 11 Pro', offers: '25 ưu đãi', gameId: 'software-keys' },
    { name: 'Key Office 2021 Pro', offers: '19 ưu đãi', gameId: 'software-keys' },
    { name: 'Kaspersky Premium 1 năm', offers: '12 ưu đãi', gameId: 'software-keys' }
  ]
};

// Sellers, Reviews and Flash sales are populated directly from Database at runtime
export const MOCK_SELLERS = [];
export const MOCK_REVIEWS = [];
export const FLASH_SALE_ITEMS = [];
