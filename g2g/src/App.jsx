import { useState, useEffect } from "react";
import "./App.css";
import LoginModal from "./login.jsx";
import RegisterSeller from "./RegisterSeller.jsx";
import SellerProduct from "./SellerProduct.jsx";

const USER_STORAGE_KEY = "shop-online-user";
const TOKEN_STORAGE_KEY = "shop-online-token";

const readStoredUser = () => {
  if (typeof window === "undefined" || !window.localStorage) {
    return null;
  }

  try {
    const storedUser = window.localStorage.getItem(USER_STORAGE_KEY);
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    return parsedUser
      ? { ...parsedUser, role: parsedUser.role || "user" }
      : null;
  } catch {
    return null;
  }
};
// Mock Games Database with Sub-products/Denominations
const MOCK_GAMES = [
  {
    id: "roblox",
    name: "Roblox Robux (Global)",
    category: "coins",
    badge: "Fast Delivery",
    textIcon: "R$",
    color: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
    description:
      "Nạp Robux giá rẻ, tự động, hỗ trợ tài khoản Global bảo mật 100% với bảo hiểm GamerProtect.",
    items: [
      {
        id: "roblox-80",
        name: "80 Robux",
        price: 22000,
        badge: "Auto Send",
        region: "Global",
        offers: 14,
      },
      {
        id: "roblox-400",
        name: "400 Robux",
        price: 95000,
        badge: "Auto Send",
        region: "Global",
        offers: 25,
      },
      {
        id: "roblox-800",
        name: "800 Robux",
        price: 190000,
        badge: "Instant Send",
        region: "Global",
        offers: 32,
      },
      {
        id: "roblox-1700",
        name: "1700 Robux",
        price: 380000,
        badge: "Instant Send",
        region: "Global",
        offers: 18,
      },
      {
        id: "roblox-4500",
        name: "4500 Robux",
        price: 990000,
        badge: "Secure Delivery",
        region: "Global",
        offers: 12,
      },
    ],
  },
  {
    id: "garena-shells",
    name: "Garena Shells (Sò Garena)",
    category: "cards",
    badge: "Auto Delivery",
    textIcon: "Gar",
    color: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
    description:
      "Sò Garena Việt Nam dùng để nạp các game Liên Quân Mobile, Free Fire, FC Online giá rẻ nhất.",
    items: [
      {
        id: "gar-20",
        name: "20 Sò Garena",
        price: 9500,
        badge: "Auto Send",
        region: "Vietnam",
        offers: 8,
      },
      {
        id: "gar-50",
        name: "50 Sò Garena",
        price: 24000,
        badge: "Auto Send",
        region: "Vietnam",
        offers: 16,
      },
      {
        id: "gar-100",
        name: "100 Sò Garena",
        price: 48000,
        badge: "Auto Send",
        region: "Vietnam",
        offers: 28,
      },
      {
        id: "gar-200",
        name: "200 Sò Garena",
        price: 95000,
        badge: "Auto Send",
        region: "Vietnam",
        offers: 34,
      },
      {
        id: "gar-500",
        name: "500 Sò Garena",
        price: 238000,
        badge: "Auto Send",
        region: "Vietnam",
        offers: 22,
      },
    ],
  },
  {
    id: "zing-card",
    name: "Zing Card VNG",
    category: "cards",
    badge: "-5% Discount",
    textIcon: "Zing",
    color: "linear-gradient(135deg, #ea580c 0%, #c2410c 100%)",
    description:
      "Thẻ Zing nạp game VNG: Võ Lâm Truyền Kỳ, Kiếm Thế, PUBG Mobile, Boom M giá rẻ chiết khấu cao.",
    items: [
      {
        id: "zing-20",
        name: "Thẻ Zing 20K",
        price: 19000,
        badge: "Discount 5%",
        region: "Vietnam",
        offers: 5,
      },
      {
        id: "zing-50",
        name: "Thẻ Zing 50K",
        price: 47500,
        badge: "Discount 5%",
        region: "Vietnam",
        offers: 12,
      },
      {
        id: "zing-100",
        name: "Thẻ Zing 100K",
        price: 95000,
        badge: "Discount 5%",
        region: "Vietnam",
        offers: 19,
      },
      {
        id: "zing-200",
        name: "Thẻ Zing 200K",
        price: 190000,
        badge: "Discount 5%",
        region: "Vietnam",
        offers: 24,
      },
      {
        id: "zing-500",
        name: "Thẻ Zing 500K",
        price: 475000,
        badge: "Discount 5%",
        region: "Vietnam",
        offers: 15,
      },
    ],
  },
  {
    id: "valorant-points",
    name: "Valorant Points (VP)",
    category: "coins",
    badge: "Instant Delivery",
    textIcon: "VP",
    color: "linear-gradient(135deg, #7f1d1d 0%, #111827 100%)",
    description:
      "Nạp VP mua skin súng Valorant giá rẻ. Nhận mã code hoặc nạp trực tiếp qua tài khoản RIOT.",
    items: [
      {
        id: "vp-475",
        name: "475 Valorant Points",
        price: 95000,
        badge: "Auto Send",
        region: "Global",
        offers: 6,
      },
      {
        id: "vp-1000",
        name: "1000 Valorant Points",
        price: 190000,
        badge: "Auto Send",
        region: "Global",
        offers: 15,
      },
      {
        id: "vp-2050",
        name: "2050 Valorant Points",
        price: 380000,
        badge: "Auto Send",
        region: "Global",
        offers: 22,
      },
      {
        id: "vp-3750",
        name: "3750 Valorant Points",
        price: 690000,
        badge: "Instant Deliver",
        region: "Global",
        offers: 18,
      },
      {
        id: "vp-5350",
        name: "5350 Valorant Points",
        price: 980000,
        badge: "Instant Deliver",
        region: "Global",
        offers: 10,
      },
    ],
  },
  {
    id: "steam-wallet",
    name: "Steam Wallet Code (Global)",
    category: "cards",
    badge: "Auto Send",
    textIcon: "Steam",
    color: "linear-gradient(135deg, #475569 0%, #1e293b 100%)",
    description:
      "Mã code nạp Steam Wallet mua game, vật phẩm Market bảo mật tốt nhất.",
    items: [
      {
        id: "steam-5",
        name: "Steam Wallet Code 5$",
        price: 125000,
        badge: "Auto Send",
        region: "Global",
        offers: 12,
      },
      {
        id: "steam-10",
        name: "Steam Wallet Code 10$",
        price: 248000,
        badge: "Auto Send",
        region: "Global",
        offers: 19,
      },
      {
        id: "steam-20",
        name: "Steam Wallet Code 20$",
        price: 490000,
        badge: "Auto Send",
        region: "Global",
        offers: 14,
      },
      {
        id: "steam-50",
        name: "Steam Wallet Code 50$",
        price: 1220000,
        badge: "Auto Send",
        region: "Global",
        offers: 8,
      },
    ],
  },
  {
    id: "lien-quan-mobile",
    name: "Liên Quân Mobile - Tài Khoản VIP",
    category: "accounts",
    badge: "Acc Trắng TT",
    textIcon: "LQ",
    color: "linear-gradient(135deg, #1e1b4b 0%, #311042 100%)",
    description:
      "Tài khoản Liên Quân Mobile giá tốt, rank cao thủ, nhiều skin đẹp, đầy đủ ngọc.",
    items: [
      {
        id: "lq-white",
        name: "Tài Khoản Trắng Thông Tin",
        price: 50000,
        badge: "Clean Acc",
        region: "Vietnam",
        offers: 42,
      },
      {
        id: "lq-caothu",
        name: "Tài Khoản Cao Thủ 50 Skin",
        price: 150000,
        badge: "Full Ngọc",
        region: "Vietnam",
        offers: 85,
      },
      {
        id: "lq-chientuong",
        name: "Tài Khoản Chiến Tướng Full Tướng",
        price: 450000,
        badge: "VIP Skin",
        region: "Vietnam",
        offers: 30,
      },
      {
        id: "lq-thachdau",
        name: "Tài Khoản VIP Thách Đấu Skin SSS",
        price: 2500000,
        badge: "Super Rich",
        region: "Vietnam",
        offers: 5,
      },
    ],
  },
  {
    id: "lol-boosting",
    name: "League of Legends - Cày Thuê",
    category: "boosting",
    badge: "Pro Boosters",
    textIcon: "LoL",
    color: "linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)",
    description:
      "Cày thuê LMHT uy tín bởi tuyển thủ thách đấu. Đảm bảo bảo mật tài khoản 100%.",
    items: [
      {
        id: "lol-iron-gold",
        name: "Cày Thuê Sắt lên Vàng",
        price: 100000,
        badge: "Pro Boost",
        region: "Vietnam",
        offers: 15,
      },
      {
        id: "lol-gold-diamond",
        name: "Cày Thuê Vàng lên Kim Cương",
        price: 350000,
        badge: "Pro Boost",
        region: "Vietnam",
        offers: 24,
      },
      {
        id: "lol-master-challenger",
        name: "Cày Thuê Cao Thủ lên Thách Đấu",
        price: 1200000,
        badge: "Top Player",
        region: "Vietnam",
        offers: 8,
      },
    ],
  },
  {
    id: "genshin-impact",
    name: "Genshin Impact - Acc Đẹp",
    category: "accounts",
    badge: "Safe Guarantee",
    textIcon: "GI",
    color: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
    description:
      "Tài khoản Genshin Impact AR cao, sở hữu các nhân vật 5 sao giới hạn và vũ khí trấn cực xịn.",
    items: [
      {
        id: "gi-ar40",
        name: "Acc AR 40 Có 2 Tướng 5 Sao",
        price: 80000,
        badge: "Starter Acc",
        region: "Asia",
        offers: 25,
      },
      {
        id: "gi-ar50",
        name: "Acc AR 50 Có Raiden Shogun + Trấn",
        price: 250000,
        badge: "Hot Pick",
        region: "Asia",
        offers: 40,
      },
      {
        id: "gi-ar55",
        name: "Acc AR 55 Giá Rẻ Hơn 10 Tướng 5 Sao",
        price: 650000,
        badge: "Secure 100%",
        region: "Asia",
        offers: 18,
      },
      {
        id: "gi-whale",
        name: "Acc Whale AR 60 Cung Mệnh C6R5",
        price: 8500000,
        badge: "Whale Acc",
        region: "Asia",
        offers: 3,
      },
    ],
  },
  {
    id: "counter-strike-2",
    name: "Counter-Strike 2 - Skins & Hòm",
    category: "items",
    badge: "Hot Skins",
    textIcon: "CS2",
    color: "linear-gradient(135deg, #ea580c 0%, #7c2d12 100%)",
    description:
      "Skins súng, dao, găng tay CS2 cực hot. Giao dịch trực tiếp qua Steam Trade Offer an toàn 100%.",
    items: [
      {
        id: "cs-knife",
        name: "Karambit | Doppler (Factory New)",
        price: 15500000,
        badge: "Rare Knife",
        region: "Global",
        offers: 5,
      },
      {
        id: "cs-gloves",
        name: "Sport Gloves | Pandora's Box (Field-Tested)",
        price: 28500000,
        badge: "Rare Gloves",
        region: "Global",
        offers: 3,
      },
      {
        id: "cs-ak",
        name: "AK-47 | Case Hardened (Minimal Wear)",
        price: 4200000,
        badge: "Popular",
        region: "Global",
        offers: 18,
      },
      {
        id: "cs-case",
        name: "Kilowatt Case x50 Hòm CS2",
        price: 230000,
        badge: "Instant Send",
        region: "Global",
        offers: 35,
      },
    ],
  },
  {
    id: "cs2-skin-cases",
    name: "CS2 Weapon Skins Marketplace",
    category: "skin",
    badge: "Instant Trade",
    textIcon: "Skin",
    color: "linear-gradient(135deg, #a21caf 0%, #4c0519 100%)",
    description:
      "Nơi mua bán skin súng, dao CS2 trực tiếp giá tốt nhất, chiết khấu lên đến 30% so với Steam.",
    items: [
      {
        id: "skin-m4a1",
        name: "M4A1-S | Printstream (Field-Tested)",
        price: 1250000,
        badge: "Hot Skin",
        region: "Global",
        offers: 14,
      },
      {
        id: "skin-awp",
        name: "AWP | Asiimov (Well-Worn)",
        price: 2100000,
        badge: "Classic Skin",
        region: "Global",
        offers: 8,
      },
      {
        id: "skin-usp",
        name: "USP-S | Kill Confirmed (Minimal Wear)",
        price: 890000,
        badge: "Auto Trade",
        region: "Global",
        offers: 16,
      },
    ],
  },
  {
    id: "software-keys",
    name: "Bản Quyền Phần Mềm & Key",
    category: "software",
    badge: "100% Genuine",
    textIcon: "Key",
    color: "linear-gradient(135deg, #1e3a8a 0%, #172554 100%)",
    description:
      "Key bản quyền chính hãng Windows 11 Pro, Office 365, diệt virus Kaspersky kích hoạt online.",
    items: [
      {
        id: "soft-win11",
        name: "Key Windows 11 Pro Retail Lifetime",
        price: 180000,
        badge: "Key Auto",
        region: "Global",
        offers: 25,
      },
      {
        id: "soft-office",
        name: "Key Office 2021 Professional Plus",
        price: 250000,
        badge: "Key Auto",
        region: "Global",
        offers: 19,
      },
      {
        id: "soft-kaspersky",
        name: "Kaspersky Premium 1 Năm 1 Thiết Bị",
        price: 150000,
        badge: "Instant Code",
        region: "Vietnam",
        offers: 12,
      },
    ],
  },
  {
    id: "payment-cards",
    name: "Thẻ Trả Trước Visa & Mastercard",
    category: "payment-cards",
    badge: "Secure Pay",
    textIcon: "Card",
    color: "linear-gradient(135deg, #0f766e 0%, #115e59 100%)",
    description:
      "Thẻ ảo Visa, Mastercard trả trước dùng để thanh toán quốc tế, mua quảng cáo, đăng ký Netflix.",
    items: [
      {
        id: "pay-visa5",
        name: "Thẻ Ảo Visa Prepaid 5$",
        price: 145000,
        badge: "Instant Card",
        region: "Global",
        offers: 8,
      },
      {
        id: "pay-visa10",
        name: "Thẻ Ảo Visa Prepaid 10$",
        price: 285000,
        badge: "Instant Card",
        region: "Global",
        offers: 12,
      },
      {
        id: "pay-master20",
        name: "Thẻ Ảo Mastercard Prepaid 20$",
        price: 560000,
        badge: "Instant Card",
        region: "Global",
        offers: 6,
      },
    ],
  },
];

// Mock GamePal Partners List
const GAMEPAL_PARTNERS = [
  {
    id: 1,
    name: "SkyBlade_Radiant",
    rating: "4.9",
    reviews: "1.2k+",
    game: "Valorant",
    earnings: "3.500.000₫ - 8.000.000₫ / tuần",
    avatarText: "SB",
    online: true,
  },
  {
    id: 2,
    name: "GenshinProHelper",
    rating: "5.0",
    reviews: "342",
    game: "Genshin Impact",
    earnings: "2.000.000₫ - 4.500.000₫ / tuần",
    avatarText: "GP",
    online: true,
  },
  {
    id: 3,
    name: "Katarina_Master",
    rating: "4.8",
    reviews: "820",
    game: "League of Legends",
    earnings: "4.000.000₫ - 9.000.000₫ / tuần",
    avatarText: "KM",
    online: true,
  },
  {
    id: 4,
    name: "RobloxRichBoy",
    rating: "4.9",
    reviews: "155",
    game: "Roblox Trading",
    earnings: "1.500.000₫ - 3.200.000₫ / tuần",
    avatarText: "RR",
    online: true,
  },
];

// Mock Coaching Partners List
const COACHING_PARTNERS = [
  {
    id: "c1",
    name: "uhKelsie",
    avatarText: "K",
    tiktok: true,
    online: false,
    bgColor: "#ec4899",
    avatarImage:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: "c2",
    name: "BoostRoom",
    avatarText: "BR",
    tiktok: false,
    online: false,
    bgColor: "#ea580c",
    avatarImage:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: "c3",
    name: "SPlusSquad",
    avatarText: "SP",
    tiktok: false,
    online: true,
    bgColor: "#06b6d4",
    avatarImage:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: "c4",
    name: "AlexDota2",
    avatarText: "A",
    tiktok: false,
    online: false,
    bgColor: "#2563eb",
    avatarImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: "c5",
    name: "Bieganzafro",
    avatarText: "B",
    tiktok: false,
    online: false,
    bgColor: "#10b981",
    avatarImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: "c6",
    name: "HLEB24",
    avatarText: "H",
    tiktok: true,
    online: false,
    bgColor: "#7c3aed",
    avatarImage:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150",
  },
];

// Mock GamePal Avatars List
const GAMEPAL_AVATARS = [
  {
    id: "g1",
    name: "Zyra",
    avatarText: "Z",
    online: true,
    bgColor: "#ec4899",
    avatarImage:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: "g2",
    name: "Yuki Chan",
    avatarText: "Y",
    online: true,
    bgColor: "#8b5cf6",
    avatarImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: "g3",
    name: "Mèo Meo",
    avatarText: "M",
    online: true,
    bgColor: "#f43f5e",
    avatarImage:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: "g4",
    name: "Pandaa",
    avatarText: "P",
    online: true,
    bgColor: "#10b981",
    avatarImage:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: "g5",
    name: "Cáo Tuyết",
    avatarText: "C",
    online: false,
    bgColor: "#06b6d4",
    avatarImage:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=150",
  },
  {
    id: "g6",
    name: "Linh Nhi",
    avatarText: "LN",
    online: true,
    bgColor: "#e11d48",
    avatarImage:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
  },
];

// Mock G2G Trending Games Data
const TRENDING_BLOCKS = {
  coins: [
    {
      name: "Path of Exile 2",
      offers: "2.092 ưu đãi",
      gameId: "path-of-exile-2",
    },
    { name: "Albion Online", offers: "204 ưu đãi", gameId: "albion-online" },
    {
      name: "WOW Classic Era / Seasonal / TBC Anniversary",
      offers: "5.347 ưu đãi",
      gameId: "wow-classic",
    },
    { name: "Aion 2", offers: "2.280 ưu đãi", gameId: "aion-2" },
    {
      name: "Blade & Soul NEO",
      offers: "336 ưu đãi",
      gameId: "blade-soul-neo",
    },
    {
      name: "World Of Warcraft",
      offers: "51.041 ưu đãi",
      gameId: "world-of-warcraft",
    },
    { name: "Lost Ark", offers: "714 ưu đãi", gameId: "lost-ark" },
    { name: "Toram Online", offers: "28 ưu đãi", gameId: "toram-online" },
  ],
  cards: [
    { name: "Zing Card VNG", offers: "19 ưu đãi", gameId: "zing-card" },
    { name: "Roblox Gift Card", offers: "32 ưu đãi", gameId: "roblox" },
    { name: "Steam Wallet Card", offers: "19 ưu đãi", gameId: "steam-wallet" },
    {
      name: "Garena Shells Card",
      offers: "34 ưu đãi",
      gameId: "garena-shells",
    },
    {
      name: "PlayStation Network Card",
      offers: "281 ưu đãi",
      gameId: "psn-card",
    },
    { name: "Xbox Live Gift Card", offers: "143 ưu đãi", gameId: "xbox-card" },
    {
      name: "Google Play Gift Card",
      offers: "98 ưu đãi",
      gameId: "google-play",
    },
    { name: "iTunes Gift Card", offers: "76 ưu đãi", gameId: "itunes" },
  ],
  accounts: [
    {
      name: "Genshin Impact Accounts",
      offers: "1.240 ưu đãi",
      gameId: "genshin-impact",
    },
    {
      name: "Liên Quân Mobile Accounts",
      offers: "85 ưu đãi",
      gameId: "lien-quan-mobile",
    },
    {
      name: "Valorant Accounts",
      offers: "321 ưu đãi",
      gameId: "valorant-points",
    },
    {
      name: "League of Legends Accounts",
      offers: "412 ưu đãi",
      gameId: "league-of-legends",
    },
    { name: "Roblox VIP Accounts", offers: "189 ưu đãi", gameId: "roblox" },
    {
      name: "Clash of Clans Accounts",
      offers: "254 ưu đãi",
      gameId: "clash-of-clans",
    },
    {
      name: "PUBG Mobile Accounts",
      offers: "345 ưu đãi",
      gameId: "pubg-mobile",
    },
    { name: "Free Fire Accounts", offers: "298 ưu đãi", gameId: "free-fire" },
  ],
  boosting: [
    {
      name: "Valorant Rank Boosting",
      offers: "84 ưu đãi",
      gameId: "valorant-points",
    },
    {
      name: "League of Legends Boosting",
      offers: "156 ưu đãi",
      gameId: "league-of-legends",
    },
    {
      name: "Genshin Impact Service",
      offers: "76 ưu đãi",
      gameId: "genshin-impact",
    },
    {
      name: "Liên Quân Mobile Boosting",
      offers: "32 ưu đãi",
      gameId: "lien-quan-mobile",
    },
    {
      name: "World of Warcraft Powerleveling",
      offers: "512 ưu đãi",
      gameId: "world-of-warcraft",
    },
    { name: "Lost Ark Raid Carries", offers: "189 ưu đãi", gameId: "lost-ark" },
    {
      name: "Albion Online Silver Farm",
      offers: "34 ưu đãi",
      gameId: "albion-online",
    },
    { name: "Diablo 4 Boosting", offers: "230 ưu đãi", gameId: "diablo-4" },
  ],
};

// Mock Sellers Pool
const MOCK_SELLERS = [
  {
    id: "sel-1",
    name: "GameKongs",
    rating: 4.9,
    reviews: 12430,
    successRate: "99.8%",
    speed: "3 phút",
    stock: 80,
    multiplier: 0.98,
  },
  {
    id: "sel-2",
    name: "FastDeliver_Store",
    rating: 4.8,
    reviews: 8520,
    successRate: "98.5%",
    speed: "5 phút",
    stock: 120,
    multiplier: 1.0,
  },
  {
    id: "sel-3",
    name: "GamerProtect_VIP",
    rating: 5.0,
    reviews: 3410,
    successRate: "100%",
    speed: "2 phút",
    stock: 50,
    multiplier: 1.02,
  },
  {
    id: "sel-4",
    name: "Cheapest_GameCard",
    rating: 4.6,
    reviews: 20150,
    successRate: "96.2%",
    speed: "12 phút",
    stock: 350,
    multiplier: 0.95,
  },
  {
    id: "sel-5",
    name: "ProSells_Global",
    rating: 4.7,
    reviews: 530,
    successRate: "97.1%",
    speed: "8 phút",
    stock: 30,
    multiplier: 1.05,
  },
];

// Mock Flash Sale Items
const FLASH_SALE_ITEMS = [
  {
    id: "fs-1",
    gameId: "garena-shells",
    itemId: "gar-200",
    name: "Garena Shells 200 Sò",
    originalPrice: 95000,
    salePrice: 75000,
    stockLeft: 4,
    totalStock: 25,
    badge: "-21% OFF",
    color: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
    textIcon: "Gar",
  },
  {
    id: "fs-2",
    gameId: "roblox",
    itemId: "roblox-800",
    name: "800 Robux (Global)",
    originalPrice: 190000,
    salePrice: 155000,
    stockLeft: 3,
    totalStock: 30,
    badge: "-18% OFF",
    color: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
    textIcon: "R$",
  },
  {
    id: "fs-3",
    gameId: "steam-wallet",
    itemId: "steam-10",
    name: "Steam Wallet Code 10$",
    originalPrice: 248000,
    salePrice: 210000,
    stockLeft: 12,
    totalStock: 20,
    badge: "-15% OFF",
    color: "linear-gradient(135deg, #475569 0%, #1e293b 100%)",
    textIcon: "Steam",
  },
];

// Mock Customer Reviews
const MOCK_REVIEWS = [
  {
    id: 1,
    user: "HoangLong_99",
    rating: 5,
    comment:
      "Giao hàng siêu nhanh, chỉ mất chưa đầy 1 phút đã nhận được mã nạp. Độ tin cậy tuyệt đối!",
    date: "01/07/2026",
  },
  {
    id: 2,
    user: "AnhKhoa_Gamer",
    rating: 5,
    comment:
      "Giao dịch qua bảo hiểm GamerProtect an tâm cực kỳ, giá lại rẻ hơn các shop khác.",
    date: "30/06/2026",
  },
  {
    id: 3,
    user: "ThanhHang_lq",
    rating: 5,
    comment:
      "Đã mua acc Liên Quân và nạp nhiều lần ở đây, chăm sóc khách hàng hỗ trợ rất nhiệt tình.",
    date: "28/06/2026",
  },
  {
    id: 4,
    user: "ProGamer_VN",
    rating: 4,
    comment:
      "Sản phẩm sạch, nạp tự động thuận tiện. Hơi lâu một tí vào giờ cao điểm nhưng chấp nhận được.",
    date: "25/06/2026",
  },
];

function App() {
  const [theme, setTheme] = useState("dark");
  const [currentView, setCurrentView] = useState("home"); // 'home', 'catalog', 'category-catalog', 'product-detail', 'checkout', 'orders', 'register-seller', 'seller-product'

  // Navigation Selection States
  const [selectedGame, setSelectedGame] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedSeller, setSelectedSeller] = useState(MOCK_SELLERS[0]);
  const [detailQuantity, setDetailQuantity] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all"); // 'all', 'coins', 'accounts', 'cards', 'boosting'
  const [activeDetailTab, setActiveDetailTab] = useState("description"); // 'description', 'reviews'

  // Sidebar Filtering States (Category Catalog View)
  const [filterMinPrice, setFilterMinPrice] = useState("");
  const [filterMaxPrice, setFilterMaxPrice] = useState("");
  const [filterSelectedGames, setFilterSelectedGames] = useState(
    MOCK_GAMES.map((g) => g.id),
  );
  const [sortOrder, setSortOrder] = useState("cheapest"); // 'cheapest', 'expensive', 'offers'

  // Filtering & Search
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [brandSearchQuery, setBrandSearchQuery] = useState("");
  const [activeBrandTab, setActiveBrandTab] = useState("all"); // 'all', 'recharge', 'activation' link
  const [catalogSearchQuery, setCatalogSearchQuery] = useState("");
  const [catalogRegionFilter, setCatalogRegionFilter] = useState("all"); // 'all', 'Vietnam', 'Global', 'Asia'
  const [catalogSortOption, setCatalogSortOption] = useState("recommended"); // 'recommended', 'cheapest'

  // Shopping Cart State
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Checkouts & Order Tracking
  const [activePaymentTab, setActivePaymentTab] = useState("momo");
  const [checkoutProcessing, setCheckoutProcessing] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [orders, setOrders] = useState([
    {
      id: "G2G-583019",
      date: "01/07/2026",
      gameName: "Roblox Robux (Global)",
      itemName: "Roblox Robux 800 Robux",
      price: 190000,
      qty: 1,
      sellerName: "GameKongs",
      status: "completed",
      paymentMethod: "Ví MoMo",
    },
    {
      id: "G2G-194058",
      date: "28/06/2026",
      gameName: "Liên Quân Mobile - Tài Khoản VIP",
      itemName: "Tài Khoản Cao Thủ 50 Skin",
      price: 150000,
      qty: 1,
      sellerName: "FastDeliver_Store",
      status: "completed",
      paymentMethod: "Chuyển khoản NH",
    },
  ]);

  // Card inputs
  const [cardNo, setCardNo] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  // Mobile Top-up & Directory Filtering States
  const [topupPhone, setTopupPhone] = useState("");
  const [topupOperator, setTopupOperator] = useState("viettel");
  const [topupAmount, setTopupAmount] = useState(100000);
  const [coachingSearchQuery, setCoachingSearchQuery] = useState("");
  const [coachingGameFilter, setCoachingGameFilter] = useState("all");
  const [gamepalSearchQuery, setGamepalSearchQuery] = useState("");
  const [gamepalGameFilter, setGamepalGameFilter] = useState("all");

  // Modals & General UX
  const [activeModal, setActiveModal] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => readStoredUser());
  const [sellerGame, setSellerGame] = useState("Valorant");
  const [sellerExperience, setSellerExperience] = useState("");
  const [toastMessage, setToastMessage] = useState(null);

  // Chat System State
  const [showChatDrawer, setShowChatDrawer] = useState(false);
  const [activeChatId, setActiveChatId] = useState(null);
  const [chatInputText, setChatInputText] = useState("");
  const [chats, setChats] = useState([
    {
      id: 1,
      partnerName: "SkyBlade_Radiant",
      avatarText: "SB",
      game: "Valorant",
      online: true,
      messages: [
        {
          sender: "partner",
          text: "Xin chào! Mình có sẵn acc Valorant VIP. Bạn cần rank gì ạ?",
        },
      ],
    },
    {
      id: 2,
      partnerName: "GenshinProHelper",
      avatarText: "GP",
      game: "Genshin Impact",
      online: true,
      messages: [
        {
          sender: "partner",
          text: "Chào bạn! Mình có thể cày thuê up rank và làm nhiệm vụ Genshin nhé.",
        },
      ],
    },
    {
      id: 3,
      partnerName: "GameKongs",
      avatarText: "GK",
      game: "Roblox / Garena",
      online: true,
      messages: [
        {
          sender: "partner",
          text: "Chào bạn, cám ơn đã liên hệ! Tất cả code Robux và Sò Garena bên mình đều là tự động gửi, nhận ngay trong 3 phút.",
        },
      ],
    },
  ]);

  // Flash Sale Timer ticking down
  const [timeLeft, setTimeLeft] = useState(10740); // 2 hours, 59 mins, 00 secs by default
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 10800));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return {
      hours: hrs.toString().padStart(2, "0"),
      minutes: mins.toString().padStart(2, "0"),
      seconds: secs.toString().padStart(2, "0"),
    };
  };

  const formattedClock = formatTime(timeLeft);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === USER_STORAGE_KEY) {
        setCurrentUser(event.newValue ? JSON.parse(event.newValue) : null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser({ ...user, role: user.role || "user" });
    setShowLogin(false);
  };

  const handleSellerRegistrationComplete = (updatedUser) => {
    if (!updatedUser) {
      return;
    }

    setCurrentUser(updatedUser);
    pushRoute("seller-product");
    triggerToast("Đăng ký trở thành người bán thành công.");
  };

  const handleLogout = () => {
    const confirmed = window.confirm("Bạn có muốn đăng xuất không?");

    if (!confirmed) {
      return;
    }

    window.localStorage.removeItem(USER_STORAGE_KEY);
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    setCurrentUser(null);
    triggerToast("Bạn đã đăng xuất thành công.");
  };

  const handleSellerEntryClick = () => {
    if (!currentUser) {
      triggerToast("Vui lòng đăng nhập trước khi đăng ký trở thành người bán.");
      setShowLogin(true);
      return;
    }

    if (currentUser.role === "seller") {
      pushRoute("seller-product");
      return;
    }

    pushRoute("register-seller");
  };

  const sellerEntryLabel =
    currentUser?.role === "seller"
      ? "Đăng bán sản phẩm"
      : "Trở thành người bán";

  // Sync theme changes with body element
  useEffect(() => {
    const body = document.body;
    if (theme === "light") {
      body.classList.add("light-theme");
    } else {
      body.classList.remove("light-theme");
    }
  }, [theme]);

  // Order Delivery Status transitioning animations
  useEffect(() => {
    const pendingOrders = orders.filter((o) => o.status === "pending");
    if (pendingOrders.length > 0) {
      const timer1 = setTimeout(() => {
        setOrders((prev) =>
          prev.map((o) => {
            if (o.status === "pending") {
              triggerToast(
                `Đơn hàng ${o.id} đang được người bán chuẩn bị bàn giao!`,
              );
              return { ...o, status: "delivering" };
            }
            return o;
          }),
        );
      }, 6000);
      return () => clearTimeout(timer1);
    }
  }, [orders]);

  useEffect(() => {
    const deliveringOrders = orders.filter((o) => o.status === "delivering");
    if (deliveringOrders.length > 0) {
      const timer2 = setTimeout(() => {
        setOrders((prev) =>
          prev.map((o) => {
            if (o.status === "delivering") {
              triggerToast(
                `Đơn hàng ${o.id} đã hoàn tất và bàn giao tự động thành công!`,
              );
              return { ...o, status: "completed" };
            }
            return o;
          }),
        );
      }, 10000);
      return () => clearTimeout(timer2);
    }
  }, [orders]);

  // Toast Alerts
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Navigations routing functions
  // Navigations routing functions
  const pushRoute = (view, params = {}, replace = false) => {
    let path = "/";
    if (view === "category-catalog") {
      const cat = params.category || "all";
      path = `/trending/${cat}`;
    } else if (view === "catalog") {
      const gameId = params.gameId || (params.game && params.game.id);
      path = `/catalog/${gameId}`;
    } else if (view === "product-detail") {
      const gameId = params.gameId || (params.game && params.game.id);
      const itemId = params.itemId || (params.item && params.item.id);
      path = `/product/${gameId}/${itemId}`;
    } else if (view === "checkout") {
      path = "/checkout";
    } else if (view === "orders") {
      path = "/orders";
    } else if (view === "coaching-directory") {
      path = "/coaching";
    } else if (view === "gamepal-directory") {
      path = "/gamepal";
    } else if (view === "mobile-topup") {
      path = "/mobile-topup";
    } else if (view === "seller-product") {
      path = "/seller-product";
    }

    if (replace) {
      window.history.replaceState(null, "", path);
    } else {
      window.history.pushState(null, "", path);
    }

    setCurrentView(view);

    if (view === "category-catalog") {
      const cat = params.category || "all";
      setSelectedCategory(cat);
      setFilterMinPrice("");
      setFilterMaxPrice("");
      setFilterSelectedGames(MOCK_GAMES.map((g) => g.id));
      setSortOrder("cheapest");
      setBrandSearchQuery("");
      setActiveBrandTab("all");
    } else if (view === "catalog") {
      const game =
        params.game || MOCK_GAMES.find((g) => g.id === params.gameId);
      if (game) {
        setSelectedGame(game);
        if (game.items && game.items.length > 0) {
          setSelectedItem(game.items[0]);
        }
        setDetailQuantity(1);
      }
      setSearchQuery("");
      setSearchFocused(false);
      setCatalogSearchQuery("");
      setCatalogRegionFilter("all");
      setCatalogSortOption("recommended");
    } else if (view === "product-detail") {
      const game =
        params.game || MOCK_GAMES.find((g) => g.id === params.gameId);
      const item =
        params.item ||
        (game && game.items.find((i) => i.id === params.itemId)) ||
        (game && game.items[0]);
      const seller = params.seller || MOCK_SELLERS[0];
      if (game) setSelectedGame(game);
      if (item) setSelectedItem(item);
      setSelectedSeller(seller);
      setDetailQuantity(1);
      setActiveDetailTab("description");
      setSearchQuery("");
      setSearchFocused(false);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const parseLocationAndRoute = (replace = false) => {
    const path = window.location.pathname;
    if (path.startsWith("/trending/")) {
      const cat = path.replace("/trending/", "");
      pushRoute("category-catalog", { category: cat }, replace);
      return;
    }
    if (path.startsWith("/catalog/")) {
      const gameId = path.replace("/catalog/", "");
      const game = MOCK_GAMES.find((g) => g.id === gameId);
      if (game) {
        pushRoute("catalog", { game }, replace);
      } else {
        pushRoute("home", {}, true);
      }
      return;
    }
    if (path.startsWith("/product/")) {
      const parts = path.split("/");
      if (parts.length >= 4) {
        const gameId = parts[2];
        const itemId = parts[3];
        const game = MOCK_GAMES.find((g) => g.id === gameId);
        const item = game ? game.items.find((i) => i.id === itemId) : null;
        if (game && item) {
          pushRoute("product-detail", { game, item }, replace);
        } else {
          pushRoute("home", {}, true);
        }
      } else {
        pushRoute("home", {}, true);
      }
      return;
    }
    if (path === "/checkout") {
      pushRoute("checkout", {}, replace);
      return;
    }
    if (path === "/orders") {
      pushRoute("orders", {}, replace);
      return;
    }
    if (path === "/coaching") {
      pushRoute("coaching-directory", {}, replace);
      return;
    }
    if (path === "/gamepal") {
      pushRoute("gamepal-directory", {}, replace);
      return;
    }
    if (path === "/mobile-topup") {
      pushRoute("mobile-topup", {}, replace);
      return;
    }
    if (path === "/seller-product") {
      pushRoute("seller-product", {}, replace);
      return;
    }
    if (path === "/register-seller") {
      pushRoute("register-seller", {}, replace);
      return;
    }
    pushRoute("home", {}, true);
  };

  // Route parser & popstate listener on mount
  useEffect(() => {
    parseLocationAndRoute(true);

    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith("/trending/")) {
        const cat = path.replace("/trending/", "");
        setCurrentView("category-catalog");
        setSelectedCategory(cat);
      } else if (path.startsWith("/catalog/")) {
        const gameId = path.replace("/catalog/", "");
        const game = MOCK_GAMES.find((g) => g.id === gameId);
        if (game) {
          setCurrentView("catalog");
          setSelectedGame(game);
          if (game.items && game.items.length > 0)
            setSelectedItem(game.items[0]);
        }
      } else if (path.startsWith("/product/")) {
        const parts = path.split("/");
        if (parts.length >= 4) {
          const gameId = parts[2];
          const itemId = parts[3];
          const game = MOCK_GAMES.find((g) => g.id === gameId);
          const item = game ? game.items.find((i) => i.id === itemId) : null;
          if (game && item) {
            setCurrentView("product-detail");
            setSelectedGame(game);
            setSelectedItem(item);
          }
        }
      } else if (path === "/checkout") {
        setCurrentView("checkout");
      } else if (path === "/orders") {
        setCurrentView("orders");
      } else if (path === "/coaching") {
        setCurrentView("coaching-directory");
      } else if (path === "/gamepal") {
        setCurrentView("gamepal-directory");
      } else if (path === "/mobile-topup") {
        setCurrentView("mobile-topup");
      } else if (path === "/seller-product") {
        setCurrentView("seller-product");
      } else if (path === "/register-seller") {
        setCurrentView("register-seller");
      } else {
        setCurrentView("home");
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateToCatalog = (game) => {
    pushRoute("catalog", { game });
  };

  const handleTrendingCardClick = (card) => {
    // Find game in MOCK_GAMES
    let foundGame = MOCK_GAMES.find((g) => g.id === card.gameId);
    if (!foundGame) {
      // Create a temporary mock game structure to keep catalog functional!
      foundGame = {
        id: card.gameId,
        name: card.name,
        category: activeCategory === "all" ? "coins" : activeCategory,
        color: "linear-gradient(135deg, #d97706 0%, #b45309 100%)",
        textIcon: card.name.substring(0, 3).toUpperCase(),
        description: `Thị trường giao dịch ${card.name} an toàn, giao dịch nhanh chóng với nhiều ưu đãi hấp dẫn.`,
        items: [
          {
            id: `${card.gameId}-item-1`,
            name: `Gói nạp Gold ${card.name} 10M`,
            price: 150000,
            badge: "Giao hàng nhanh",
            region: "Global",
            offers: 15,
          },
          {
            id: `${card.gameId}-item-2`,
            name: `Gói nạp Gold ${card.name} 50M`,
            price: 680000,
            badge: "Được bảo hiểm",
            region: "Global",
            offers: 28,
          },
          {
            id: `${card.gameId}-item-3`,
            name: `Acc ${card.name} Cấp Cao VIP`,
            price: 1200000,
            badge: "Hot Deal",
            region: "Global",
            offers: 8,
          },
        ],
      };
      // Add to MOCK_GAMES array dynamically to allow deep linking!
      MOCK_GAMES.push(foundGame);
    }
    navigateToCatalog(foundGame);
  };

  const navigateToCategory = (cat) => {
    if (cat === "coaching") {
      pushRoute("coaching-directory");
    } else if (cat === "gamepal") {
      pushRoute("gamepal-directory");
    } else if (cat === "phone") {
      pushRoute("mobile-topup");
    } else {
      pushRoute("category-catalog", { category: cat });
    }
  };

  const navigateToDetail = (game, item, seller = MOCK_SELLERS[0]) => {
    pushRoute("product-detail", { game, item, seller });
  };

  // Add Item to Shopping Cart
  const handleAddToCart = (item, game, seller, quantity) => {
    const unitPrice = Math.floor(item.price * seller.multiplier);
    const existingIndex = cart.findIndex(
      (c) => c.itemId === item.id && c.sellerName === seller.name,
    );

    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].qty += quantity;
      setCart(updatedCart);
    } else {
      const newCartItem = {
        cartId: Date.now() + Math.random().toString(36).substr(2, 5),
        itemId: item.id,
        itemName: item.name,
        gameId: game.id,
        gameName: game.name,
        price: unitPrice,
        qty: quantity,
        sellerName: seller.name,
        textIcon: game.textIcon,
        color: game.color,
        badge: item.badge,
      };
      setCart((prev) => [...prev, newCartItem]);
    }
    triggerToast(
      `Đã thêm ${quantity} x "${item.name}" từ ${seller.name} vào giỏ hàng!`,
    );
    setIsCartOpen(true);
  };

  // Cart Management
  const updateCartQty = (cartId, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.cartId === cartId) {
          const newQty = item.qty + delta;
          return { ...item, qty: newQty > 0 ? newQty : 1 };
        }
        return item;
      }),
    );
  };

  const removeCartItem = (cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
    triggerToast("Đã xóa sản phẩm khỏi giỏ hàng.");
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.qty, 0);
  };

  // Buy Now
  const handleBuyNow = (item, game, seller, quantity) => {
    const unitPrice = Math.floor(item.price * seller.multiplier);
    const newCartItem = {
      cartId: Date.now() + Math.random().toString(36).substr(2, 5),
      itemId: item.id,
      itemName: item.name,
      gameId: game.id,
      gameName: game.name,
      price: unitPrice,
      qty: quantity,
      sellerName: seller.name,
      textIcon: game.textIcon,
      color: game.color,
      badge: item.badge,
    };
    setCart([newCartItem]);
    pushRoute("checkout");
  };

  // Perform checkout action
  const handleConfirmPayment = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setCheckoutProcessing(true);
    setTimeout(() => {
      setCheckoutProcessing(false);
      setCheckoutSuccess(true);

      const newOrders = cart.map((item) => ({
        id: `G2G-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString("vi-VN"),
        gameName: item.gameName,
        itemName: item.itemName,
        price: item.price,
        qty: item.qty,
        sellerName: item.sellerName,
        status: "pending",
        paymentMethod:
          activePaymentTab === "momo"
            ? "Ví MoMo"
            : activePaymentTab === "zalopay"
              ? "Ví ZaloPay"
              : activePaymentTab === "banking"
                ? "Chuyển khoản NH"
                : "Thẻ Quốc Thế",
      }));

      setOrders((prev) => [...newOrders, ...prev]);

      setTimeout(() => {
        setCheckoutSuccess(false);
        setCart([]);
        pushRoute("orders");
        triggerToast(
          "Giao dịch hoàn tất! Đơn hàng đang được chuẩn bị bàn giao.",
        );
      }, 2000);
    }, 2000);
  };

  // Simulated live seller chat replies
  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInputText.trim() || activeChatId === null) return;

    const userMsg = { sender: "user", text: chatInputText };
    const targetChat = chats.find((c) => c.id === activeChatId);

    setChats((prev) =>
      prev.map((c) => {
        if (c.id === activeChatId) {
          return { ...c, messages: [...c.messages, userMsg] };
        }
        return c;
      }),
    );

    const userText = chatInputText.toLowerCase();
    setChatInputText("");

    setTimeout(() => {
      let replyText = `Chào bạn! Mình là hỗ trợ viên của ${targetChat.partnerName}. Có vấn đề gì về đơn hàng cần mình hỗ trợ không?`;
      if (
        userText.includes("đơn") ||
        userText.includes("nạp") ||
        userText.includes("mua") ||
        userText.includes("giao")
      ) {
        replyText = `Cảm ơn bạn! Hệ thống nạp tự động của ${targetChat.partnerName} đang xử lý đơn hàng ${targetChat.game}. Vui lòng kiểm tra mục Đơn hàng sau ít phút nhé!`;
      } else if (
        userText.includes("rẻ") ||
        userText.includes("giá") ||
        userText.includes("khấu") ||
        userText.includes("sale")
      ) {
        replyText = `Dạ hiện tại bên mình đang chiết khấu trực tiếp rẻ nhất sàn rồi đó ạ, ngoài ra bạn còn được hưởng bảo hiểm hoàn tiền GamerProtect nhé.`;
      } else if (
        userText.includes("alo") ||
        userText.includes("hi") ||
        userText.includes("shop")
      ) {
        replyText = `Dạ chào bạn! Shop vẫn luôn có nhân viên online trực hỗ trợ 24/7. Bạn cần hỏi về dịch vụ nào cứ nhắn cho mình nhé.`;
      }

      const partnerMsg = { sender: "partner", text: replyText };
      setChats((prev) =>
        prev.map((c) => {
          if (c.id === activeChatId) {
            return { ...c, messages: [...c.messages, partnerMsg] };
          }
          return c;
        }),
      );
    }, 1500);
  };

  // Open Chat directly with a specific partner
  const openChatWithPartner = (partnerName, game) => {
    let existingIndex = chats.findIndex((c) => c.partnerName === partnerName);
    let chatId = 0;
    if (existingIndex > -1) {
      chatId = chats[existingIndex].id;
    } else {
      chatId = chats.length + 1;
      const newThread = {
        id: chatId,
        partnerName: partnerName,
        avatarText: partnerName.slice(0, 2).toUpperCase(),
        game: game,
        online: true,
        messages: [
          {
            sender: "partner",
            text: `Chào bạn! Mình hỗ trợ dịch vụ game ${game}. Bạn cần gì cứ nhắn nhé.`,
          },
        ],
      };
      setChats((prev) => [...prev, newThread]);
    }
    setActiveChatId(chatId);
    setShowChatDrawer(true);
  };

  const handleSellerSubmit = (e) => {
    e.preventDefault();
    if (!sellerExperience) {
      triggerToast("Vui lòng nhập mô tả kinh nghiệm bán hàng!");
      return;
    }
    triggerToast(
      `Gửi yêu cầu đăng ký bán game ${sellerGame} thành công! Hồ sơ đang được duyệt.`,
    );
    setActiveModal(null);
    setSellerExperience("");
  };

  // Toggle dynamic game list check/uncheck in sidebar filter
  const toggleGameFilter = (gameId) => {
    setFilterSelectedGames((prev) =>
      prev.includes(gameId)
        ? prev.filter((id) => id !== gameId)
        : [...prev, gameId],
    );
  };

  // Clear all sidebar filters in category catalog
  const clearFilters = () => {
    setFilterMinPrice("");
    setFilterMaxPrice("");
    setFilterSelectedGames(MOCK_GAMES.map((g) => g.id));
    setSortOrder("cheapest");
  };

  // Search autocomplete suggestion results
  const filteredSuggestions = searchQuery
    ? MOCK_GAMES.filter((g) =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

  // Home filter options (Original categories shortcut)
  const homeCategoryFilteredGames = MOCK_GAMES.filter((g) => {
    const matchesCategory =
      activeCategory === "all" || g.category === activeCategory;
    const matchesTab = activeTab === "all" || g.category === activeTab;
    return matchesCategory && matchesTab;
  });

  // Flat database array compile of category items (Cross-game database collection)
  const flatCategoryItems = [];
  MOCK_GAMES.forEach((game) => {
    if (selectedCategory === "all" || game.category === selectedCategory) {
      game.items.forEach((item) => {
        flatCategoryItems.push({
          ...item,
          game: game,
        });
      });
    }
  });

  // Apply Sidebar Filter properties
  const filteredCategoryItems = flatCategoryItems.filter((item) => {
    const matchesGame = filterSelectedGames.includes(item.game.id);
    const itemPrice = Math.floor(item.price * MOCK_SELLERS[0].multiplier); // base display price
    const matchesMinPrice =
      filterMinPrice === "" || itemPrice >= parseInt(filterMinPrice);
    const matchesMaxPrice =
      filterMaxPrice === "" || itemPrice <= parseInt(filterMaxPrice);
    return matchesGame && matchesMinPrice && matchesMaxPrice;
  });

  // Apply Sort orders
  const sortedFilteredCategoryItems = [...filteredCategoryItems].sort(
    (a, b) => {
      const priceA = Math.floor(a.price * MOCK_SELLERS[0].multiplier);
      const priceB = Math.floor(b.price * MOCK_SELLERS[0].multiplier);
      if (sortOrder === "cheapest") return priceA - priceB;
      if (sortOrder === "expensive") return priceB - priceA;
      if (sortOrder === "offers") return b.offers - a.offers;
      return 0;
    },
  );

  return (
    <div className="g2g-clone-app">
      {/* Toast Alert Banner */}
      {toastMessage && (
        <div className="toast-alert">
          <div className="toast-indicator"></div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Navbar Header */}
      <header className="header">
        <div className="container navbar">
          <div className="logo-container" onClick={() => pushRoute("home")}>
            <span className="logo-g2g">G2G</span>
            <span className="logo-text">CLONE</span>
            <span className="logo-dot">.</span>
          </div>

          {/* Autocomplete Search Bar */}
          <div className="nav-search-bar-wrapper">
            <div className="nav-search-bar">
              <input
                type="text"
                placeholder="Tìm kiếm game, thẻ quà tặng, coins..."
                className="nav-search-input"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 250)}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <span
                  className="clear-search-btn"
                  onClick={() => setSearchQuery("")}
                >
                  ×
                </span>
              )}
              <button className="nav-search-btn">
                <svg
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="M21 21l-4.35-4.35"></path>
                </svg>
              </button>
            </div>
            {handleSellerEntryClick}
            {/* Live Autocomplete Suggestions Box */}
            {searchFocused && (
              <div className="search-suggestions-dropdown">
                {searchQuery ? (
                  filteredSuggestions.length > 0 ? (
                    filteredSuggestions.map((game) => (
                      <div
                        key={game.id}
                        className="suggestion-item"
                        onClick={() => navigateToCatalog(game)}
                      >
                        <div className="suggestion-game-info">
                          <span
                            className="suggestion-icon"
                            style={{ background: game.color }}
                          >
                            {game.textIcon}
                          </span>
                          <div>
                            <div className="suggestion-game-name">
                              {game.name}
                            </div>
                            <div className="suggestion-game-desc">
                              {game.description}
                            </div>
                          </div>
                        </div>
                        <div className="suggestion-chips">
                          <span
                            className="chip"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateToCatalog(game);
                            }}
                          >
                            Ưu đãi
                          </span>
                          <span
                            className="chip"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateToCatalog(game);
                            }}
                          >
                            Nạp thẻ
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-suggestion">
                      Không tìm thấy game nào phù hợp với "{searchQuery}"
                    </div>
                  )
                ) : (
                  <div className="default-suggestions">
                    <div className="suggestion-title">Xu Hướng Tìm Kiếm</div>
                    <div className="trending-chips-grid">
                      {MOCK_GAMES.slice(0, 4).map((g) => (
                        <div
                          key={g.id}
                          className="trending-chip"
                          onClick={() => navigateToCatalog(g)}
                        >
                          <span className="dot"></span> {g.name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="nav-actions">
            <button
              className="seller-link btn btn-text"
              onClick={handleSellerEntryClick}
            >
              {sellerEntryLabel}
              <span
                className="badge badge-success"
                style={{ marginLeft: "6px" }}
              >
                Free
              </span>
            </button>

            {/* Shopping Cart Trigger */}
            <button
              className="cart-trigger-btn"
              onClick={() => setIsCartOpen(true)}
              title="Giỏ Hàng"
            >
              <svg
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z"></path>
                <path d="M3 6h18M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              {cart.length > 0 && (
                <span className="cart-count-badge">
                  {cart.reduce((sum, i) => sum + i.qty, 0)}
                </span>
              )}
            </button>

            {/* Chat Trigger */}
            <button
              className="chat-trigger-btn"
              onClick={() => {
                setShowChatDrawer(true);
                if (chats.length > 0 && activeChatId === null)
                  setActiveChatId(chats[0].id);
              }}
              title="Tin nhắn"
            >
              <svg
                width="22"
                height="22"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>

            <button
              className="theme-toggle-btn"
              onClick={toggleTheme}
              title="Đổi giao diện"
            >
              {theme === "dark" ? (
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="5"></circle>
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
                </svg>
              ) : (
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              )}
            </button>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => pushRoute("orders")}
            >
              Đơn Hàng
            </button>
            {currentUser ? (
              <div className="user-account-display">
                <span className="user-account-name">
                  {currentUser.displayName || currentUser.name || "Người dùng"}
                </span>
                <button
                  type="button"
                  className="logout-icon-button"
                  onClick={handleLogout}
                  title="Đăng xuất"
                  aria-label="Đăng xuất"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 17l1 1a2 2 0 0 0 2 0l7-7"></path>
                    <path d="M21 12H9"></path>
                    <path d="M13 5l-3-3H4a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h6l3-3"></path>
                  </svg>
                </button>
              </div>
            ) : (
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowLogin(true)}
              >
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Sub-Navbar Horizontal Category Selector (Standard e-commerce bar) */}
      <nav className="sub-navbar">
        <div className="container sub-navbar-container">
          <span
            className={`sub-nav-item ${selectedCategory === "all" && currentView === "category-catalog" ? "active" : ""}`}
            onClick={() => navigateToCategory("all")}
          >
            🌐 Tất cả danh mục
          </span>
          <span
            className={`sub-nav-item ${selectedCategory === "coins" && currentView === "category-catalog" ? "active" : ""}`}
            onClick={() => navigateToCategory("coins")}
          >
            🪙 Tiền tệ (Coins)
          </span>
          <span
            className={`sub-nav-item ${selectedCategory === "accounts" && currentView === "category-catalog" ? "active" : ""}`}
            onClick={() => navigateToCategory("accounts")}
          >
            👤 Tài khoản VIP
          </span>
          <span
            className={`sub-nav-item ${selectedCategory === "cards" && currentView === "category-catalog" ? "active" : ""}`}
            onClick={() => navigateToCategory("cards")}
          >
            💳 Thẻ Game / Gift Card
          </span>
          <span
            className={`sub-nav-item ${selectedCategory === "boosting" && currentView === "category-catalog" ? "active" : ""}`}
            onClick={() => navigateToCategory("boosting")}
          >
            ⚡ Cày thuê (Boosting)
          </span>
        </div>
      </nav>

      {/* Main Content Router */}
      <main className="main-content">
        {currentView === "home" && (
          <>
            {/* Hero Section */}
            <section className="hero-section">
              <div className="hero-grid-pattern"></div>
              <div className="hero-glow"></div>
              <div
                className="container hero-container"
                style={{ position: "relative", zIndex: 2 }}
              >
                <div className="hero-left-content">
                  <h1 className="hero-title">
                    Nơi game thủ <span>giao dịch tự tin</span>
                  </h1>
                  <p className="hero-subtitle">
                    Mua. Bán. Nâng cấp. Thị trường trò chơi tất cả trong một với
                    bảo vệ tích hợp.
                  </p>

                  <div className="hero-search-wrapper">
                    <div className="hero-search-bar">
                      <input
                        type="text"
                        placeholder="Tìm kiếm trong G2G"
                        className="hero-search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                      />
                      <button
                        className="hero-search-btn-circle"
                        aria-label="Tìm kiếm"
                      >
                        <svg
                          width="20"
                          height="20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          viewBox="0 0 24 24"
                        >
                          <circle cx="11" cy="11" r="8"></circle>
                          <path d="M21 21l-4.35-4.35"></path>
                        </svg>
                      </button>
                    </div>

                    {/* Trust Badges */}
                    <div className="hero-trust-badges">
                      <span className="trust-badge-item">
                        <span className="badge-icon">🛡️</span> GamerProtect
                      </span>
                      <span className="trust-badge-item">
                        <span className="badge-icon">✔️</span> Hơn 35 triệu giao
                        dịch thành công
                      </span>
                      <span className="trust-badge-item">
                        <span className="badge-icon">💬</span> Hỗ trợ 24/7
                      </span>
                    </div>
                  </div>
                </div>

                <div className="hero-right-mascot">
                  <img
                    src="/src/assets/hero.png"
                    alt="G2G Mascot"
                    className="hero-mascot-img"
                  />
                </div>
              </div>

              {/* Disclaimer container bottom strip */}
              <div
                className="container"
                style={{ position: "relative", zIndex: 2 }}
              >
                <p className="g2g-disclaimer-text">
                  Tuyên bố từ chối trách nhiệm: Chúng tôi là một thị trường độc
                  lập và không liên kết và/hoặc được phê duyệt bởi bất kỳ nhà
                  phát triển hoặc studio trò chơi nào.
                </p>
              </div>
            </section>

            {/* Select categories G2G grid shortcut (NOW ABOVE DEALS SECTION) */}
            <section
              className="categories-section"
              style={{ paddingTop: "32px", paddingBottom: "32px" }}
            >
              <div className="container">
                <h2 className="g2g-category-heading">Chọn danh mục</h2>

                <div className="g2g-category-grid">
                  {/* Row 1: Large Vertical Cards */}
                  <div
                    className="g2g-category-large-card"
                    onClick={() => navigateToCategory("cards")}
                  >
                    <div className="category-large-icon">
                      <svg
                        width="44"
                        height="44"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                      >
                        <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                        <line x1="2" y1="10" x2="22" y2="10"></line>
                        <path d="M6 14h2M12 14h4"></path>
                      </svg>
                    </div>
                    <span className="category-large-name">Thẻ quà tặng</span>
                  </div>

                  <div
                    className="g2g-category-large-card"
                    onClick={() => navigateToCategory("all")}
                  >
                    <div className="category-large-icon">
                      <svg
                        width="44"
                        height="44"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                      >
                        <rect x="3" y="3" width="7" height="7" rx="1"></rect>
                        <circle cx="17.5" cy="6.5" r="3.5"></circle>
                        <polygon points="12,17 17.5,14 17.5,20"></polygon>
                        <rect x="3" y="14" width="7" height="7" rx="1"></rect>
                      </svg>
                    </div>
                    <span className="category-large-name">Trò chơi</span>
                  </div>

                  <div
                    className="g2g-category-large-card"
                    onClick={() =>
                      triggerToast("Dịch vụ Game Coaching sẽ được ra mắt sớm!")
                    }
                  >
                    <span className="category-beta-badge">Beta</span>
                    <div className="category-large-icon">
                      <svg
                        width="44"
                        height="44"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                      >
                        <rect x="2" y="6" width="20" height="12" rx="3"></rect>
                        <circle cx="6.5" cy="12" r="1.5"></circle>
                        <circle cx="9.5" cy="12" r="1.5"></circle>
                        <line x1="14" y1="12" x2="16" y2="12"></line>
                        <line x1="15" y1="11" x2="15" y2="13"></line>
                      </svg>
                    </div>
                    <span className="category-large-name">Game Coaching</span>
                  </div>

                  <div
                    className="g2g-category-large-card"
                    onClick={() =>
                      triggerToast(
                        "Khám phá các đại sứ GamePal ở mục bên dưới!",
                      )
                    }
                  >
                    <span className="category-beta-badge">Beta</span>
                    <div className="category-large-icon">
                      <svg
                        width="44"
                        height="44"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <span className="category-large-name">GamePal</span>
                  </div>

                  {/* Row 2: Smaller Horizontal Cards */}
                  <div
                    className="g2g-category-horizontal-card"
                    onClick={() => navigateToCategory("coins")}
                  >
                    <div className="category-horiz-icon">🪙</div>
                    <span className="category-horiz-name">Xu Game</span>
                  </div>

                  <div
                    className="g2g-category-horizontal-card"
                    onClick={() =>
                      triggerToast(
                        "Dịch vụ nạp Vật phẩm đang chuẩn bị cập nhật!",
                      )
                    }
                  >
                    <div className="category-horiz-icon">📦</div>
                    <span className="category-horiz-name">Vật phẩm</span>
                  </div>

                  <div
                    className="g2g-category-horizontal-card"
                    onClick={() => navigateToCategory("accounts")}
                  >
                    <div className="category-horiz-icon">👤</div>
                    <span className="category-horiz-name">Tài khoản Game</span>
                  </div>

                  <div
                    className="g2g-category-horizontal-card"
                    onClick={() => navigateToCategory("boosting")}
                  >
                    <div className="category-horiz-icon">🔥</div>
                    <span className="category-horiz-name">Cày thuê</span>
                  </div>

                  {/* Row 3: Smaller Horizontal Cards */}
                  <div
                    className="g2g-category-horizontal-card"
                    onClick={() =>
                      triggerToast("Thị trường trang phục/Skin đang bảo trì!")
                    }
                  >
                    <div className="category-horiz-icon">🛡️</div>
                    <span className="category-horiz-name">Skin</span>
                  </div>

                  <div
                    className="g2g-category-horizontal-card"
                    onClick={() =>
                      triggerToast(
                        "Dịch vụ Nạp tiền điện thoại đang liên kết nhà mạng!",
                      )
                    }
                  >
                    <div className="category-horiz-icon">📱</div>
                    <span className="category-horiz-name">
                      Nạp tiền điện thoại
                    </span>
                  </div>

                  <div
                    className="g2g-category-horizontal-card"
                    onClick={() =>
                      triggerToast(
                        "Thị trường bản quyền phần mềm đang liên kết!",
                      )
                    }
                  >
                    <div className="category-horiz-icon">💻</div>
                    <span className="category-horiz-name">
                      Phần mềm &amp; Ứng dụng
                    </span>
                  </div>

                  <div
                    className="g2g-category-horizontal-card"
                    onClick={() =>
                      triggerToast(
                        "Các gói nạp thẻ thanh toán visa/mastercard đang cập nhật!",
                      )
                    }
                  >
                    <div className="category-horiz-icon">💳</div>
                    <span className="category-horiz-name">Thẻ thanh toán</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Flash Sales Section (Ticking Urgency Widget - NOW BELOW CATEGORIES SECTION) */}
            <section className="flash-sale-section">
              <div className="container">
                <div className="flash-sale-header justify-between">
                  <div className="flex-center" style={{ gap: "16px" }}>
                    <h2 className="flash-sale-title">
                      ⚡ DEAL CHỚP NHOÁNG (FLASH SALE)
                    </h2>
                    <div className="countdown-timer-box">
                      <span className="time-digit">{formattedClock.hours}</span>
                      <span className="time-colon">:</span>
                      <span className="time-digit">
                        {formattedClock.minutes}
                      </span>
                      <span className="time-colon">:</span>
                      <span className="time-digit">
                        {formattedClock.seconds}
                      </span>
                    </div>
                  </div>
                  <span className="flash-sale-subtitle">
                    Thời gian có hạn - Số lượng có hạn
                  </span>
                </div>

                <div className="flash-sale-grid">
                  {FLASH_SALE_ITEMS.map((item) => {
                    const gameObj = MOCK_GAMES.find(
                      (g) => g.id === item.gameId,
                    );
                    const itemObj = gameObj?.items.find(
                      (i) => i.id === item.itemId,
                    );
                    const percentSold = Math.floor(
                      ((item.totalStock - item.stockLeft) / item.totalStock) *
                        100,
                    );

                    return (
                      <div
                        key={item.id}
                        className="flash-card"
                        onClick={() => navigateToDetail(gameObj, itemObj)}
                      >
                        <div className="flash-card-badge">{item.badge}</div>
                        <div
                          className="flash-image-wrapper"
                          style={{ background: item.color }}
                        >
                          <span className="flash-logo-text">
                            {item.textIcon}
                          </span>
                        </div>
                        <div className="flash-info">
                          <h4 className="flash-item-name">{item.name}</h4>
                          <div className="flash-price-row">
                            <span className="original-price">
                              {item.originalPrice.toLocaleString("vi-VN")}₫
                            </span>
                            <span className="sale-price">
                              {item.salePrice.toLocaleString("vi-VN")}₫
                            </span>
                          </div>

                          <div className="flash-stock-progress">
                            <div className="progress-bar-container">
                              <div
                                className="progress-bar-fill"
                                style={{ width: `${percentSold}%` }}
                              ></div>
                            </div>
                            <div className="progress-text-row justify-between">
                              <span>
                                Đã bán: <strong>{percentSold}%</strong>
                              </span>
                              <span>
                                Còn lại:{" "}
                                <strong style={{ color: "var(--brand-red)" }}>
                                  {item.stockLeft} thẻ
                                </strong>
                              </span>
                            </div>
                          </div>

                          <button
                            className="btn btn-primary btn-sm flash-buy-btn"
                            style={{ width: "100%" }}
                          >
                            Giật Deal Ngay
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Trò chơi hay, Công ty tuyệt vời Title Banner */}
            <div
              className="container"
              style={{ marginTop: "48px", marginBottom: "-24px" }}
            >
              <div className="coaching-gamepal-main-heading">
                Trò chơi hay, Công ty tuyệt vời
              </div>
            </div>

            {/* Redesigned Game Coaching & GamePal Section */}
            <section className="coaching-gamepal-banner-section">
              <div className="coaching-gamepal-banner-overlay"></div>

              <div
                className="container"
                style={{ position: "relative", zIndex: 2 }}
              >
                {/* Game Coaching Row */}
                <div className="coaching-row-wrapper">
                  <div className="coaching-header-row justify-between">
                    <div className="coaching-header-left">
                      <h3 className="coaching-section-title">
                        Game Coaching{" "}
                        <span className="beta-badge-small">Beta</span>
                      </h3>
                      <p className="coaching-section-subtitle">
                        Muốn trở nên giỏi hơn? Đặt huấn luyện viên chuyên gia để
                        phân tích lối chơi của bạn và mở khóa tiềm năng thực sự
                        của bạn.
                      </p>
                    </div>
                    <span
                      className="explore-all-link"
                      onClick={() =>
                        triggerToast(
                          "Dịch vụ Game Coaching sẽ ra mắt danh sách đầy đủ huấn luyện viên sớm!",
                        )
                      }
                    >
                      Khám phá tất cả <span className="arrow">&gt;</span>
                    </span>
                  </div>

                  <div className="coaching-circle-grid">
                    {COACHING_PARTNERS.map((coach) => (
                      <div
                        key={coach.id}
                        className="coaching-circle-item"
                        onClick={() =>
                          openChatWithPartner(coach.name, "Coaching")
                        }
                      >
                        <div className="coaching-avatar-wrapper">
                          <img
                            src={coach.avatarImage}
                            alt={coach.name}
                            className="coaching-avatar-img"
                          />
                          {coach.online && (
                            <span className="coaching-online-dot"></span>
                          )}
                        </div>
                        <span className="coaching-profile-name">
                          {coach.name}
                        </span>
                        {coach.tiktok && (
                          <div className="tiktok-icon-badge">
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.74-3.99-1.72-.08-.07-.17-.17-.25-.25v6.07c-.11 1.98-.82 3.99-2.22 5.39-1.4 1.4-3.4 2.11-5.38 2.22-1.98-.11-3.97-.82-5.37-2.22-1.4-1.4-2.11-3.39-2.22-5.38.11-1.98.82-3.97 2.22-5.37 1.4-1.4 3.39-2.11 5.38-2.22v4.03c-.99.11-1.99.52-2.69 1.22-.7.7-1.11 1.7-1.22 2.69.11.99.52 1.99 1.22 2.69.7.7 1.7 1.11 2.69 1.22.99-.11 1.99-.52 2.69-1.22.7-.7 1.11-1.7 1.22-2.69V0h-.03z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* GamePal Row */}
                <div
                  className="coaching-row-wrapper"
                  style={{ marginTop: "48px" }}
                >
                  <div className="coaching-header-row justify-between">
                    <div className="coaching-header-left">
                      <h3 className="coaching-section-title">
                        GamePal <span className="beta-badge-small">Beta</span>
                      </h3>
                      <p className="coaching-section-subtitle">
                        Chỉ muốn có thời gian vui vẻ? Hợp tác với GamePal đã
                        được xác minh để có trải nghiệm chơi game tuyệt vời,
                        không áp lực.
                      </p>
                    </div>
                    <span
                      className="explore-all-link"
                      onClick={() =>
                        triggerToast(
                          "Dịch vụ GamePal sẽ mở rộng danh sách đại sứ sớm!",
                        )
                      }
                    >
                      Khám phá tất cả <span className="arrow">&gt;</span>
                    </span>
                  </div>

                  <div className="coaching-circle-grid">
                    {GAMEPAL_AVATARS.map((pal) => (
                      <div
                        key={pal.id}
                        className="coaching-circle-item"
                        onClick={() =>
                          openChatWithPartner(pal.name, "GamePal Companion")
                        }
                      >
                        <div className="coaching-avatar-wrapper">
                          <img
                            src={pal.avatarImage}
                            alt={pal.name}
                            className="coaching-avatar-img"
                          />
                          {pal.online && (
                            <span className="coaching-online-dot"></span>
                          )}
                        </div>
                        <span className="coaching-profile-name">
                          {pal.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Top Trending tabbed Games Grid (Redesigned "Xem Xu hướng") */}
            <section className="trending-section">
              <div className="container">
                <h2 className="g2g-trending-main-title">Xem Xu hướng</h2>

                <div className="g2g-trending-tabs-wrapper">
                  <div className="g2g-trending-tabs-container">
                    <span
                      className={`g2g-trending-tab-link ${activeCategory === "cards" ? "active" : ""}`}
                      onClick={() => setActiveCategory("cards")}
                    >
                      Thẻ quà tặng
                    </span>
                    <span
                      className={`g2g-trending-tab-link ${activeCategory === "all" ? "active" : ""}`}
                      onClick={() => setActiveCategory("all")}
                    >
                      Trò chơi
                    </span>
                    <span
                      className="g2g-trending-tab-link"
                      onClick={() =>
                        triggerToast(
                          "Hãy cuộn lên phía trên để xem dịch vụ Game Coaching!",
                        )
                      }
                    >
                      Game Coaching
                    </span>
                    <span
                      className="g2g-trending-tab-link"
                      onClick={() =>
                        triggerToast(
                          "Hãy cuộn lên phía trên để xem dịch vụ GamePal!",
                        )
                      }
                    >
                      GamePal
                    </span>
                    <span
                      className={`g2g-trending-tab-link ${activeCategory === "coins" ? "active" : ""}`}
                      onClick={() => setActiveCategory("coins")}
                    >
                      Xu Game
                    </span>
                    <span
                      className="g2g-trending-tab-link"
                      onClick={() =>
                        triggerToast(
                          "Thị trường Vật phẩm đang cập nhật xu hướng!",
                        )
                      }
                    >
                      Vật phẩm
                    </span>
                    <span
                      className={`g2g-trending-tab-link ${activeCategory === "accounts" ? "active" : ""}`}
                      onClick={() => setActiveCategory("accounts")}
                    >
                      Tài khoản Game
                    </span>
                    <span
                      className={`g2g-trending-tab-link ${activeCategory === "boosting" ? "active" : ""}`}
                      onClick={() => setActiveCategory("boosting")}
                    >
                      Cày thuê
                    </span>
                    <span
                      className="g2g-trending-tab-link"
                      onClick={() =>
                        triggerToast(
                          "Thị trường Trang phục/Skin đang cập nhật xu hướng!",
                        )
                      }
                    >
                      Skin
                    </span>
                    <span
                      className="g2g-trending-tab-link"
                      onClick={() =>
                        triggerToast(
                          "Giao dịch nạp tiền điện thoại đang liên kết đại lý!",
                        )
                      }
                    >
                      Nạp tiền điện thoại
                    </span>
                    <span
                      className="g2g-trending-tab-link"
                      onClick={() =>
                        triggerToast("Phần mềm bản quyền đang liên kết đại lý!")
                      }
                    >
                      Phần mềm &amp; Ứng dụng
                    </span>
                  </div>

                  {/* Arrow Indicator */}
                  <span
                    className="g2g-trending-tab-arrow"
                    onClick={() =>
                      triggerToast(
                        "Cuộn ngang hoặc kéo để xem thêm danh mục xu hướng!",
                      )
                    }
                  >
                    &gt;
                  </span>
                </div>

                {(() => {
                  const items =
                    TRENDING_BLOCKS[activeCategory] || TRENDING_BLOCKS["coins"];
                  return (
                    <div className="g2g-trending-grid">
                      {items.map((item, index) => (
                        <div
                          key={index}
                          className="g2g-trending-gold-card"
                          onClick={() => handleTrendingCardClick(item)}
                        >
                          <h4 className="trending-gold-card-title">
                            {item.name}
                          </h4>
                          <div className="g2g-trending-offers-pill">
                            {item.offers}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* View All Button */}
                <div style={{ marginTop: "32px", textAlign: "center" }}>
                  <button
                    className="g2g-trending-view-all-btn"
                    onClick={() => setActiveCategory("all")}
                  >
                    Xem tất cả
                  </button>
                </div>
              </div>
            </section>

            {/* Affiliate Promotion Banner */}
            <section className="promos-section">
              <div className="container">
                <div className="promo-grid">
                  <div className="promo-card">
                    <div className="promo-glow"></div>
                    <div>
                      <h3 className="promo-title">
                        Chương Trình Đối Tác &amp; Affiliate
                      </h3>
                      <p className="promo-description">
                        Chia sẻ liên kết G2G của bạn và kiếm tới 5% hoa hồng
                        trên mỗi giao dịch thành công. Rút tiền nhanh chóng và
                        trực quan.
                      </p>
                      <div className="promo-steps">
                        <div className="promo-step">
                          <span className="step-num">1</span>
                          <span>Đăng ký tham gia lấy link giới thiệu</span>
                        </div>
                        <div className="promo-step">
                          <span className="step-num">2</span>
                          <span>Chia sẻ link trên mạng xã hội, diễn đàn</span>
                        </div>
                        <div className="promo-step">
                          <span className="step-num">3</span>
                          <span>Nhận tiền hoa hồng tự động về ví G2G</span>
                        </div>
                      </div>
                    </div>
                    <button
                      className="btn btn-primary"
                      style={{ alignSelf: "flex-start" }}
                      onClick={() =>
                        triggerToast(
                          "Hệ thống đối tác đang chuẩn bị ra mắt vào tháng tới!",
                        )
                      }
                    >
                      Bắt đầu kiếm tiền
                    </button>
                  </div>

                  <div
                    className="promo-card"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255, 78, 58, 0.08) 0%, rgba(245, 158, 11, 0.05) 100%)",
                    }}
                  >
                    <div
                      className="promo-glow"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%)",
                      }}
                    ></div>
                    <div>
                      <h3
                        className="promo-title"
                        style={{ color: "var(--gold)" }}
                      >
                        Bảo Hiểm GamerProtect
                      </h3>
                      <p className="promo-description">
                        Giao dịch được bảo vệ 100% bằng cơ chế ký quỹ và bảo vệ
                        tài khoản cho cả người mua và người bán.
                      </p>
                      <ul className="protection-list">
                        <li>
                          <span>✓</span> Cam kết hoàn tiền 100% khi xảy ra sự cố
                          tài khoản.
                        </li>
                        <li>
                          <span>✓</span> Giải quyết tranh chấp công bằng 24/7.
                        </li>
                        <li>
                          <span>✓</span> Bảo vệ thông tin thanh toán tuyệt đối
                          qua cổng SSL.
                        </li>
                      </ul>
                    </div>
                    <button
                      className="btn btn-secondary"
                      style={{ alignSelf: "flex-start" }}
                      onClick={() =>
                        triggerToast(
                          "Bảo hiểm GamerProtect được áp dụng mặc định cho mọi giao dịch!",
                        )
                      }
                    >
                      Tìm hiểu thêm
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Game Coaching Directory View */}
        {currentView === "coaching-directory" && (
          <section className="directory-page-section">
            <div className="container">
              <div className="breadcrumbs">
                <span onClick={() => pushRoute("home")}>Trang chủ</span>
                <span className="separator">&gt;</span>
                <span className="active">Game Coaching</span>
              </div>

              <div className="directory-hero-banner">
                <div className="directory-hero-overlay"></div>
                <div className="directory-hero-content">
                  <h1>Huấn Luyện Viên Chuyên Nghiệp</h1>
                  <p>
                    Đặt huấn luyện viên đẳng cấp để phân tích lối chơi, nâng tầm
                    trình độ và leo hạng thần tốc!
                  </p>
                </div>
              </div>

              {/* Filters row */}
              <div className="directory-filters-bar">
                <div className="search-box-wrapper">
                  <input
                    type="text"
                    placeholder="Tìm tên huấn luyện viên..."
                    className="dir-search-input"
                    value={coachingSearchQuery}
                    onChange={(e) => setCoachingSearchQuery(e.target.value)}
                  />
                </div>
                <div className="select-filter-wrapper">
                  <select
                    className="dir-select-filter"
                    value={coachingGameFilter}
                    onChange={(e) => setCoachingGameFilter(e.target.value)}
                  >
                    <option value="all">Tất cả game</option>
                    <option value="Valorant">Valorant</option>
                    <option value="Dota 2">Dota 2</option>
                    <option value="League of Legends">League of Legends</option>
                  </select>
                </div>
              </div>

              {/* Coaches List Grid */}
              <div className="coaches-grid-list">
                {COACHING_PARTNERS.filter((coach) => {
                  const matchesSearch = coach.name
                    .toLowerCase()
                    .includes(coachingSearchQuery.toLowerCase());
                  const matchesGame =
                    coachingGameFilter === "all" ||
                    (coachingGameFilter === "Valorant" &&
                      (coach.id === "c1" || coach.id === "c5")) ||
                    (coachingGameFilter === "Dota 2" &&
                      (coach.id === "c3" || coach.id === "c4")) ||
                    (coachingGameFilter === "League of Legends" &&
                      (coach.id === "c2" || coach.id === "c6"));
                  return matchesSearch && matchesGame;
                }).map((coach) => (
                  <div key={coach.id} className="coach-profile-card">
                    <div className="coach-card-header">
                      <div className="coach-avatar-container">
                        <img src={coach.avatarImage} alt={coach.name} />
                        {coach.online && (
                          <span className="online-indicator-dot"></span>
                        )}
                      </div>
                      <div className="coach-brief-info">
                        <h4>{coach.name}</h4>
                        <span className="coach-game-tag">
                          {coach.id === "c1" || coach.id === "c5"
                            ? "Valorant Pro Coach"
                            : coach.id === "c3" || coach.id === "c4"
                              ? "Dota 2 Immortals"
                              : "LMHT Thách Đấu"}
                        </span>
                        <div className="coach-rating-stars">
                          ⭐ 4.9 (140+ đánh giá)
                        </div>
                      </div>
                    </div>

                    <div className="coach-desc-body">
                      Chuyên phân tích lối chơi macro, sửa tư duy di chuyển,
                      hướng dẫn quản lý lính và tối ưu hóa bể tướng leo rank
                      hiệu quả.
                    </div>

                    <div className="coach-card-footer justify-between">
                      <div>
                        <span className="coach-price-label">Giá mỗi giờ</span>
                        <div className="coach-price-value">
                          {coach.id === "c1" ? "180.000₫" : "150.000₫"}
                        </div>
                      </div>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() =>
                          openChatWithPartner(coach.name, "Coaching")
                        }
                      >
                        💬 Đặt Lịch &amp; Chat
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* GamePal Companion Directory View */}
        {currentView === "gamepal-directory" && (
          <section className="directory-page-section">
            <div className="container">
              <div className="breadcrumbs">
                <span onClick={() => pushRoute("home")}>Trang chủ</span>
                <span className="separator">&gt;</span>
                <span className="active">GamePal Companion</span>
              </div>

              <div className="directory-hero-banner gamepal-hero-bg">
                <div className="directory-hero-overlay"></div>
                <div className="directory-hero-content">
                  <h1>Đồng Hành Cùng Bạn GamePal</h1>
                  <p>
                    Trải nghiệm chơi game vui vẻ, không áp lực! Tìm bạn đồng
                    hành nói chuyện dễ thương, chơi game giỏi.
                  </p>
                </div>
              </div>

              {/* Filters row */}
              <div className="directory-filters-bar">
                <div className="search-box-wrapper">
                  <input
                    type="text"
                    placeholder="Tìm tên bạn đồng hành..."
                    className="dir-search-input"
                    value={gamepalSearchQuery}
                    onChange={(e) => setGamepalSearchQuery(e.target.value)}
                  />
                </div>
                <div className="select-filter-wrapper">
                  <select
                    className="dir-select-filter"
                    value={gamepalGameFilter}
                    onChange={(e) => setGamepalGameFilter(e.target.value)}
                  >
                    <option value="all">Tất cả game</option>
                    <option value="Valorant">Valorant</option>
                    <option value="League of Legends">League of Legends</option>
                    <option value="Genshin Impact">Genshin Impact</option>
                  </select>
                </div>
              </div>

              {/* GamePals List Grid */}
              <div className="coaches-grid-list">
                {GAMEPAL_AVATARS.filter((pal) => {
                  const matchesSearch = pal.name
                    .toLowerCase()
                    .includes(gamepalSearchQuery.toLowerCase());
                  const matchesGame =
                    gamepalGameFilter === "all" ||
                    (gamepalGameFilter === "Valorant" &&
                      (pal.id === "g1" || pal.id === "g4")) ||
                    (gamepalGameFilter === "League of Legends" &&
                      (pal.id === "g2" || pal.id === "g6")) ||
                    (gamepalGameFilter === "Genshin Impact" &&
                      (pal.id === "g3" || pal.id === "g5"));
                  return matchesSearch && matchesGame;
                }).map((pal) => (
                  <div key={pal.id} className="coach-profile-card">
                    <div className="coach-card-header">
                      <div className="coach-avatar-container">
                        <img src={pal.avatarImage} alt={pal.name} />
                        {pal.online && (
                          <span className="online-indicator-dot"></span>
                        )}
                      </div>
                      <div className="coach-brief-info">
                        <h4>{pal.name}</h4>
                        <span className="coach-game-tag">
                          {pal.id === "g1" || pal.id === "g4"
                            ? "Valorant • Mic On"
                            : pal.id === "g2" || pal.id === "g6"
                              ? "LMHT • Vui Vẻ"
                              : "Genshin • Co-op"}
                        </span>
                        <div className="coach-rating-stars">
                          ⭐ 5.0 (80+ review)
                        </div>
                      </div>
                    </div>

                    <div className="coach-desc-body">
                      Có mic nói chuyện dễ nghe, kỹ năng cá nhân khá tốt, sẵn
                      sàng gánh tạ, tấu hài giúp bạn có trải nghiệm chơi game
                      thư giãn nhất!
                    </div>

                    <div className="coach-card-footer justify-between">
                      <div>
                        <span className="coach-price-label">Giá mỗi giờ</span>
                        <div className="coach-price-value">80.000₫</div>
                      </div>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => openChatWithPartner(pal.name, "GamePal")}
                      >
                        💬 Chat Ngay
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Mobile Top-up Page View */}
        {currentView === "mobile-topup" && (
          <section className="mobile-topup-page-section">
            <div className="container">
              <div className="breadcrumbs">
                <span onClick={() => pushRoute("home")}>Trang chủ</span>
                <span className="separator">&gt;</span>
                <span className="active">Nạp tiền điện thoại</span>
              </div>

              <div className="topup-layout-grid">
                {/* Form Column */}
                <div className="topup-form-container">
                  <h2 className="topup-form-title">Nạp Điện Thoại Tự Động</h2>
                  <p className="topup-form-subtitle">
                    Điền số điện thoại, chọn nhà mạng và mệnh giá để nạp chiết
                    khấu rẻ nhất thị trường.
                  </p>

                  <div className="form-group" style={{ marginTop: "24px" }}>
                    <label className="topup-input-label">
                      Số điện thoại nhận tiền
                    </label>
                    <input
                      type="tel"
                      placeholder="Nhập số điện thoại (ví dụ: 0987654321)"
                      className="topup-tel-input"
                      value={topupPhone}
                      onChange={(e) =>
                        setTopupPhone(e.target.value.replace(/[^0-9]/g, ""))
                      }
                    />
                  </div>

                  {/* Operator selectors */}
                  <div className="form-group">
                    <label className="topup-input-label">Chọn nhà mạng</label>
                    <div className="operator-selector-pills">
                      <div
                        className={`operator-pill ${topupOperator === "viettel" ? "active" : ""}`}
                        onClick={() => setTopupOperator("viettel")}
                      >
                        <span className="operator-name">Viettel</span>
                        <span className="operator-discount">-4%</span>
                      </div>
                      <div
                        className={`operator-pill ${topupOperator === "mobifone" ? "active" : ""}`}
                        onClick={() => setTopupOperator("mobifone")}
                      >
                        <span className="operator-name">Mobifone</span>
                        <span className="operator-discount">-3%</span>
                      </div>
                      <div
                        className={`operator-pill ${topupOperator === "vinaphone" ? "active" : ""}`}
                        onClick={() => setTopupOperator("vinaphone")}
                      >
                        <span className="operator-name">Vinaphone</span>
                        <span className="operator-discount">-3.5%</span>
                      </div>
                    </div>
                  </div>

                  {/* Denomination select grid */}
                  <div className="form-group">
                    <label className="topup-input-label">
                      Chọn mệnh giá nạp
                    </label>
                    <div className="topup-denoms-grid">
                      {[10000, 20000, 50000, 100000, 200000, 500000].map(
                        (val) => (
                          <div
                            key={val}
                            className={`denom-grid-pill ${topupAmount === val ? "active" : ""}`}
                            onClick={() => setTopupAmount(val)}
                          >
                            <div className="denom-face-value">
                              {val.toLocaleString("vi-VN")}₫
                            </div>
                            <div className="denom-selling-price">
                              Giá bán:{" "}
                              {Math.floor(
                                val *
                                  (topupOperator === "viettel"
                                    ? 0.96
                                    : topupOperator === "mobifone"
                                      ? 0.97
                                      : 0.965),
                              ).toLocaleString("vi-VN")}
                              ₫
                            </div>
                          </div>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Final pay action */}
                  <button
                    className="btn btn-primary topup-submit-btn"
                    onClick={() => {
                      if (!topupPhone || topupPhone.length < 10) {
                        triggerToast(
                          "Vui lòng nhập đúng định dạng số điện thoại 10 số!",
                        );
                        return;
                      }
                      const finalPrice = Math.floor(
                        topupAmount *
                          (topupOperator === "viettel"
                            ? 0.96
                            : topupOperator === "mobifone"
                              ? 0.97
                              : 0.965),
                      );
                      const topupItem = {
                        cartId: `topup-${topupOperator}-${topupAmount}-${Date.now()}`,
                        itemName: `Nạp tiền ${topupOperator.toUpperCase()} - SĐT: ${topupPhone}`,
                        price: finalPrice,
                        qty: 1,
                        color:
                          "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        textIcon: "📱",
                        sellerName: "G2G AutoTopup",
                        gameName: "Nạp Điện Thoại",
                      };
                      setCart((prev) => [...prev, topupItem]);
                      setIsCartOpen(true);
                      triggerToast(
                        "Đã thêm hóa đơn nạp điện thoại vào Giỏ hàng!",
                      );
                    }}
                  >
                    🚀 Nạp Ngay (Thanh toán qua giỏ hàng)
                  </button>
                </div>

                {/* Guidelines Column */}
                <div className="topup-guide-container">
                  <div className="guide-card-overlay"></div>
                  <div className="guide-card-content">
                    <h3 className="guide-card-title">🛡️ Giao Dịch An Toàn</h3>
                    <ul className="guide-steps-list">
                      <li>
                        <strong>Giao hàng tự động:</strong> Hệ thống tự động bắn
                        tiền trực tiếp vào tài khoản thuê bao trả trước/trả sau
                        trong 5 phút.
                      </li>
                      <li>
                        <strong>GamerProtect bảo vệ:</strong> Cam kết hoàn tiền
                        100% nếu xảy ra lỗi hệ thống hoặc không nhận được tiền
                        nạp.
                      </li>
                      <li>
                        <strong>Hỗ trợ trực tuyến:</strong> Đội ngũ chăm sóc
                        khách hàng hỗ trợ giải quyết thắc mắc về số thuê bao
                        24/7.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Category Catalog Page View (New Category listings navigation router) */}
        {currentView === "category-catalog" && (
          <section className="category-catalog-section">
            <div className="container">
              {/* Breadcrumbs */}
              <div className="breadcrumbs">
                <span onClick={() => pushRoute("home")}>Trang chủ</span>
                <span className="separator">&gt;</span>
                <span>Danh mục sản phẩm</span>
                <span className="separator">&gt;</span>
                <span className="active">
                  {selectedCategory === "all"
                    ? "Tất cả sản phẩm"
                    : selectedCategory === "coins"
                      ? "Tiền tệ Game (Coins)"
                      : selectedCategory === "accounts"
                        ? "Tài khoản VIP"
                        : selectedCategory === "cards"
                          ? "Thẻ game / Gift Card"
                          : "Cày thuê (Boosting)"}
                </span>
              </div>

              {/* Title Banner */}
              <div className="category-directory-banner">
                <div className="category-header-icon-box">
                  {selectedCategory === "all" && "🌐"}
                  {selectedCategory === "coins" && "🪙"}
                  {selectedCategory === "accounts" && "👤"}
                  {selectedCategory === "cards" && "💳"}
                  {selectedCategory === "boosting" && "⚡"}
                </div>
                <h1 className="category-directory-title">
                  {selectedCategory === "all" && "Trò chơi & Thương hiệu"}
                  {selectedCategory === "coins" && "Tiền tệ game (Coins)"}
                  {selectedCategory === "accounts" && "Tài khoản game VIP"}
                  {selectedCategory === "cards" && "Thẻ game & Quà tặng"}
                  {selectedCategory === "boosting" && "Cày thuê (Boosting)"}
                </h1>
              </div>

              {/* Search & Tabs bar matching G2G layout */}
              <div className="brand-search-tab-bar">
                <div className="brand-search-input-wrapper">
                  <svg
                    className="search-icon-mini"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="M21 21l-4.35-4.35"></path>
                  </svg>
                  <input
                    type="text"
                    placeholder="Tìm kiếm thương hiệu..."
                    className="brand-search-input-field"
                    value={brandSearchQuery}
                    onChange={(e) => setBrandSearchQuery(e.target.value)}
                  />
                </div>
                <div className="brand-tabs-list">
                  <span
                    className={`brand-tab-item ${activeBrandTab === "all" ? "active" : ""}`}
                    onClick={() => setActiveBrandTab("all")}
                  >
                    Tất cả
                  </span>
                  <span
                    className={`brand-tab-item ${activeBrandTab === "coins" ? "active" : ""}`}
                    onClick={() => setActiveBrandTab("coins")}
                  >
                    Coins game
                  </span>
                  <span
                    className={`brand-tab-item ${activeBrandTab === "accounts" ? "active" : ""}`}
                    onClick={() => setActiveBrandTab("accounts")}
                  >
                    Tài khoản VIP
                  </span>
                  <span
                    className={`brand-tab-item ${activeBrandTab === "cards" ? "active" : ""}`}
                    onClick={() => setActiveBrandTab("cards")}
                  >
                    Thẻ game
                  </span>
                  <span
                    className={`brand-tab-item ${activeBrandTab === "boosting" ? "active" : ""}`}
                    onClick={() => setActiveBrandTab("boosting")}
                  >
                    Cày thuê
                  </span>
                </div>
              </div>

              {/* Filtering games list */}
              {(() => {
                const filteredGames = MOCK_GAMES.filter((game) => {
                  const matchesMainCategory =
                    selectedCategory === "all" ||
                    game.category === selectedCategory;
                  const matchesSearch = game.name
                    .toLowerCase()
                    .includes(brandSearchQuery.toLowerCase());
                  const matchesSubTab =
                    activeBrandTab === "all" ||
                    game.category === activeBrandTab;
                  return matchesMainCategory && matchesSearch && matchesSubTab;
                });

                // Let's divide them into Trending (first 4-8) and All Brands
                const trendingGames = filteredGames.slice(0, 8);
                const allGames = filteredGames;

                if (filteredGames.length === 0) {
                  return (
                    <div className="empty-catalog-results">
                      <span className="empty-icon">📂</span>
                      <h4>Không tìm thấy thương hiệu nào!</h4>
                      <p>
                        Vui lòng nhập lại tên game hoặc thương hiệu khác trong
                        thanh tìm kiếm bên trên.
                      </p>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setBrandSearchQuery("");
                          setActiveBrandTab("all");
                        }}
                      >
                        Đặt lại bộ lọc
                      </button>
                    </div>
                  );
                }

                return (
                  <>
                    {/* Xu hướng (Trending) Blocks Grid */}
                    <div className="directory-section-container">
                      <h3 className="directory-section-title">Xu Hướng</h3>
                      <div className="brand-trending-grid">
                        {trendingGames.map((game) => {
                          const totalOffers = game.items.reduce(
                            (sum, item) => sum + item.offers,
                            0,
                          );
                          return (
                            <div
                              key={game.id}
                              className="brand-trending-block"
                              onClick={() => navigateToCatalog(game)}
                            >
                              <div className="brand-stripe-edge"></div>
                              <div className="brand-block-content">
                                <h4 className="brand-block-title">
                                  {game.name}
                                </h4>
                                <span className="brand-offers-pill">
                                  {totalOffers} ưu đãi
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Tất cả thương hiệu (All Brands) Grid */}
                    <div
                      className="directory-section-container"
                      style={{ marginTop: "40px" }}
                    >
                      <h3 className="directory-section-title">
                        Tất cả thương hiệu cho{" "}
                        {selectedCategory === "all"
                          ? "Trò chơi"
                          : selectedCategory === "coins"
                            ? "Tiền tệ Game (Coins)"
                            : selectedCategory === "accounts"
                              ? "Tài khoản VIP"
                              : selectedCategory === "cards"
                                ? "Thẻ game / Gift Card"
                                : "Cày thuê (Boosting)"}
                      </h3>
                      <div className="brand-all-grid">
                        {allGames.map((game) => {
                          const totalOffers = game.items.reduce(
                            (sum, item) => sum + item.offers,
                            0,
                          );
                          return (
                            <div
                              key={game.id}
                              className="brand-all-block"
                              onClick={() => navigateToCatalog(game)}
                            >
                              <span className="brand-all-name">
                                {game.name}
                              </span>
                              <span className="brand-all-offers">
                                {totalOffers} ưu đãi
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </section>
        )}

        {/* Catalog / Games Page View */}
        {currentView === "catalog" && selectedGame && (
          <section className="catalog-section">
            <div className="container">
              {/* Breadcrumbs */}
              <div className="breadcrumbs">
                <span onClick={() => pushRoute("home")}>Trang chủ</span>
                <span className="separator">&gt;</span>
                <span>Thị trường game</span>
                <span className="separator">&gt;</span>
                <span className="active">{selectedGame.name}</span>
              </div>

              {/* Title Banner & Hero */}
              <div className="catalog-hero-row justify-between">
                <h1 className="catalog-hero-title">
                  {selectedGame.name}{" "}
                  {selectedCategory === "coins"
                    ? "Coins"
                    : selectedCategory === "boosting"
                      ? "Boosting"
                      : selectedCategory === "accounts"
                        ? "Accounts"
                        : "Gift Cards"}
                </h1>
                <button
                  className="btn btn-secondary share-btn-box"
                  onClick={() =>
                    triggerToast(
                      "Đường liên kết chia sẻ đã được sao chép vào bộ nhớ tạm!",
                    )
                  }
                >
                  <span>🔗 Chia sẻ</span>
                </button>
              </div>

              {/* Circular Service Switcher Grid */}
              <div className="catalog-service-switcher-wrapper">
                <div
                  className={`service-switcher-circle ${selectedCategory === "coins" ? "active" : ""}`}
                  onClick={() => setSelectedCategory("coins")}
                >
                  <div className="service-circle-icon">🪙</div>
                  <span className="service-circle-name">Xu Game</span>
                  <span className="service-circle-count">(51,041)</span>
                </div>
                <div
                  className={`service-switcher-circle ${selectedCategory === "boosting" ? "active" : ""}`}
                  onClick={() => setSelectedCategory("boosting")}
                >
                  <div className="service-circle-icon">🔥</div>
                  <span className="service-circle-name">Cày thuê</span>
                  <span className="service-circle-count">(36,528)</span>
                </div>
                <div
                  className={`service-switcher-circle ${selectedCategory === "cards" ? "active" : ""}`}
                  onClick={() => setSelectedCategory("cards")}
                >
                  <div className="service-circle-icon">💳</div>
                  <span className="service-circle-name">Mã kích hoạt</span>
                  <span className="service-circle-count">(28)</span>
                </div>
                <div
                  className={`service-switcher-circle ${selectedCategory === "coaching" ? "active" : ""}`}
                  onClick={() => setSelectedCategory("coaching")}
                >
                  <div className="service-circle-icon">🎮</div>
                  <span className="service-circle-name">Coaching</span>
                  <span className="service-circle-count">(16)</span>
                </div>
                <div
                  className={`service-switcher-circle ${selectedCategory === "gamepal" ? "active" : ""}`}
                  onClick={() => setSelectedCategory("gamepal")}
                >
                  <div className="service-circle-icon">👥</div>
                  <span className="service-circle-name">GamePal</span>
                  <span className="service-circle-count">(10)</span>
                </div>
                <div
                  className={`service-switcher-circle ${selectedCategory === "items" ? "active" : ""}`}
                  onClick={() => setSelectedCategory("items")}
                >
                  <div className="service-circle-icon">📦</div>
                  <span className="service-circle-name">Vật phẩm</span>
                  <span className="service-circle-count">(16,746)</span>
                </div>
                <div
                  className={`service-switcher-circle ${selectedCategory === "accounts" ? "active" : ""}`}
                  onClick={() => setSelectedCategory("accounts")}
                >
                  <div className="service-circle-icon">👤</div>
                  <span className="service-circle-name">Tài khoản</span>
                  <span className="service-circle-count">(2,272)</span>
                </div>
              </div>

              {/* Local Search & Region filter */}
              <div className="local-catalog-filters-bar">
                <div className="local-search-input-wrapper">
                  <svg
                    className="search-icon-mini"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="M21 21l-4.35-4.35"></path>
                  </svg>
                  <input
                    type="text"
                    placeholder="Nhập để lọc"
                    className="local-search-input-field"
                    value={catalogSearchQuery}
                    onChange={(e) => setCatalogSearchQuery(e.target.value)}
                  />
                </div>
                <div className="local-region-select-wrapper">
                  <select
                    className="local-region-dropdown"
                    value={catalogRegionFilter}
                    onChange={(e) => setCatalogRegionFilter(e.target.value)}
                  >
                    <option value="all">Khu vực (Tất cả)</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="Global">Global</option>
                  </select>
                </div>
              </div>

              {/* Popular orange tags */}
              <div className="popular-tags-row">
                <span className="popular-tags-label">Tìm kiếm phổ biến:</span>
                <span
                  className="popular-tag-chip"
                  onClick={() => setCatalogSearchQuery("game time")}
                >
                  game time
                </span>
                <span
                  className="popular-tag-chip"
                  onClick={() =>
                    setCatalogSearchQuery(selectedGame.name.toLowerCase())
                  }
                >
                  {selectedGame.name.toLowerCase()}
                </span>
                <span
                  className="popular-tag-chip"
                  onClick={() => setCatalogSearchQuery("midnight")}
                >
                  midnight
                </span>
                <span
                  className="popular-tag-chip"
                  onClick={() => setCatalogSearchQuery("time")}
                >
                  time
                </span>
                <span
                  className="popular-tag-chip"
                  onClick={() => setCatalogSearchQuery("gold")}
                >
                  gold
                </span>
              </div>

              {/* Packages Lists & Sorting */}
              {(() => {
                const filteredCatalogItems = selectedGame.items.filter(
                  (item) => {
                    const matchesSearch = item.name
                      .toLowerCase()
                      .includes(catalogSearchQuery.toLowerCase());
                    const matchesRegion =
                      catalogRegionFilter === "all" ||
                      item.region.toLowerCase() ===
                        catalogRegionFilter.toLowerCase();
                    return matchesSearch && matchesRegion;
                  },
                );

                const sortedCatalogItems = [...filteredCatalogItems].sort(
                  (a, b) => {
                    if (catalogSortOption === "cheapest") {
                      return a.price - b.price;
                    }
                    return b.offers - a.offers;
                  },
                );

                return (
                  <>
                    <div className="catalog-results-header justify-between">
                      <span className="results-count-label">
                        Khoảng {sortedCatalogItems.length} kết quả
                      </span>
                      <div className="sort-radio-group">
                        <span className="sort-label">Sắp xếp theo:</span>
                        <label className="sort-radio-label">
                          <input
                            type="radio"
                            name="catalogSort"
                            value="recommended"
                            checked={catalogSortOption === "recommended"}
                            onChange={() => setCatalogSortOption("recommended")}
                          />
                          <span className="radio-custom"></span>
                          <span>Được đề xuất</span>
                        </label>
                        <label className="sort-radio-label">
                          <input
                            type="radio"
                            name="catalogSort"
                            value="cheapest"
                            checked={catalogSortOption === "cheapest"}
                            onChange={() => setCatalogSortOption("cheapest")}
                          />
                          <span className="radio-custom"></span>
                          <span>Giá thấp nhất</span>
                        </label>
                      </div>
                    </div>

                    {sortedCatalogItems.length > 0 ? (
                      <div className="catalog-packages-grid">
                        {sortedCatalogItems.map((item) => (
                          <div
                            key={item.id}
                            className="catalog-package-card"
                            onClick={() => navigateToDetail(selectedGame, item)}
                          >
                            <div className="package-region-row">
                              <span className="package-region-flag">
                                {item.region === "Vietnam"
                                  ? "🇻🇳"
                                  : item.region === "Global"
                                    ? "🌐"
                                    : "🇺🇸"}
                              </span>
                              <span className="package-region-name">
                                {item.region}
                              </span>
                            </div>
                            <h4 className="package-card-title">{item.name}</h4>
                            <div className="package-card-footer justify-between">
                              <span className="package-offers-badge">
                                {item.offers} ưu đãi
                              </span>
                              <span className="package-price-text">
                                từ {item.price.toLocaleString("vi-VN")}₫
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-catalog-results">
                        <span className="empty-icon">📂</span>
                        <h4>Không tìm thấy kết quả phù hợp!</h4>
                        <p>
                          Vui lòng nhập lại tên gói nạp hoặc từ khóa lọc khác.
                        </p>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setCatalogSearchQuery("");
                            setCatalogRegionFilter("all");
                          }}
                        >
                          Đặt lại bộ lọc
                        </button>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </section>
        )}

        {/* Product offer details page */}
        {currentView === "product-detail" && selectedGame && selectedItem && (
          <section className="product-detail-section">
            <div className="container">
              {/* Breadcrumbs */}
              <div className="breadcrumbs">
                <span onClick={() => pushRoute("home")}>Trang chủ</span>
                <span className="separator">&gt;</span>
                <span onClick={() => navigateToCatalog(selectedGame)}>
                  {selectedGame.name}
                </span>
                <span className="separator">&gt;</span>
                <span className="active">{selectedItem.name}</span>
              </div>

              <div className="product-detail-grid">
                {/* Left Column: Denominations Pickers & Desc */}
                <div className="product-left-col">
                  {/* Selected Item Card Header */}
                  <div className="selected-item-display">
                    <div
                      className="item-gradient-banner"
                      style={{ background: selectedGame.color }}
                    >
                      <span className="item-logo-text">
                        {selectedGame.textIcon}
                      </span>
                    </div>
                    <div className="item-display-info">
                      <span className="badge badge-success">
                        {selectedItem.badge}
                      </span>
                      <h1 className="item-display-title">
                        {selectedItem.name}
                      </h1>
                      <div className="item-meta-tags">
                        <span>
                          Khu vực: <strong>{selectedItem.region}</strong>
                        </span>
                        <span className="bullet">•</span>
                        <span>
                          Hình thức: <strong>Tự động gửi/Bàn giao ngay</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Switch Denomination Section */}
                  <div className="denom-selector-container">
                    <h4 className="container-title">
                      Chọn các mệnh giá / gói dịch vụ khác
                    </h4>
                    <div className="denom-pill-grid">
                      {selectedGame.items.map((item) => (
                        <div
                          key={item.id}
                          className={`denom-pill ${selectedItem.id === item.id ? "active" : ""}`}
                          onClick={() =>
                            navigateToDetail(selectedGame, item, selectedSeller)
                          }
                        >
                          <div className="pill-name">{item.name}</div>
                          <div className="pill-price">
                            {item.price.toLocaleString("vi-VN")}₫
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Product Details Tabs (Description & Customer Reviews) */}
                  <div className="detail-tabs-wrapper">
                    <div className="detail-tabs-header">
                      <span
                        className={`tab-item-link ${activeDetailTab === "description" ? "active" : ""}`}
                        onClick={() => setActiveDetailTab("description")}
                      >
                        Mô tả sản phẩm
                      </span>
                      <span
                        className={`tab-item-link ${activeDetailTab === "reviews" ? "active" : ""}`}
                        onClick={() => setActiveDetailTab("reviews")}
                      >
                        Đánh giá người mua (5★)
                      </span>
                    </div>

                    <div className="detail-tab-pane">
                      {activeDetailTab === "description" ? (
                        <div className="desc-content">
                          <p>
                            Chào mừng bạn đến với đại lý phân phối chính thức
                            của chúng tôi trên G2G Marketplace. Dưới đây là các
                            thông tin quan trọng bạn cần nắm rõ:
                          </p>
                          <ul>
                            <li>
                              <strong>Bàn giao tự động:</strong> Sản phẩm được
                              gửi trực tiếp qua hệ thống tin nhắn hoặc email
                              liên kết của bạn ngay sau khi hoàn tất thanh toán.
                            </li>
                            <li>
                              <strong>Bảo hành GamerProtect:</strong> Bảo hiểm
                              hoàn trả 100% số tiền nếu mã thẻ có lỗi hoặc tài
                              khoản có vấn đề tranh chấp do lỗi từ người bán
                              trong vòng 7 ngày.
                            </li>
                            <li>
                              <strong>Lưu ý:</strong> Vui lòng không tiết lộ
                              thông tin mã nạp, mã OTP hoặc thông tin mật khẩu
                              tài khoản cho bất kỳ ai khác ngoại trừ biểu mẫu
                              giao dịch chính thức.
                            </li>
                          </ul>
                        </div>
                      ) : (
                        <div className="reviews-tab-pane">
                          <div className="reviews-summary-score justify-between">
                            <div>
                              <div className="score-value">4.9 / 5</div>
                              <div className="stars-row">
                                <span className="star-icon">★</span>
                                <span className="star-icon">★</span>
                                <span className="star-icon">★</span>
                                <span className="star-icon">★</span>
                                <span className="star-icon">★</span>
                              </div>
                              <span className="reviews-count-label">
                                Phản hồi tích cực đạt 99.8% từ khách hàng
                              </span>
                            </div>
                            <div className="reviews-recommend">
                              🚀 <strong>Khuyên dùng:</strong> 99% khách hàng
                              rất hài lòng về tốc độ bàn giao của người bán này.
                            </div>
                          </div>

                          <div className="buyer-reviews-list">
                            {MOCK_REVIEWS.map((rev) => (
                              <div key={rev.id} className="review-item">
                                <div className="review-item-header justify-between">
                                  <div className="buyer-profile">
                                    <span className="avatar-letter">
                                      {rev.user.slice(0, 2).toUpperCase()}
                                    </span>
                                    <div>
                                      <span className="buyer-name">
                                        {rev.user}
                                      </span>
                                      <div className="buyer-rating-stars">
                                        {Array.from({ length: rev.rating }).map(
                                          (_, i) => (
                                            <span key={i} className="star-icon">
                                              ★
                                            </span>
                                          ),
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <span className="review-date">
                                    {rev.date}
                                  </span>
                                </div>
                                <p className="review-comment">{rev.comment}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column: Console purchase card */}
                <div className="product-right-col">
                  <div className="purchase-console-card">
                    {/* Seller Short Card */}
                    <div className="seller-box-summary">
                      <div className="seller-box-avatar">
                        {selectedSeller.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="seller-box-info">
                        <div className="seller-box-name">
                          {selectedSeller.name}
                          <span
                            className="online-dot active"
                            title="Online"
                          ></span>
                        </div>
                        <div className="seller-box-rating">
                          <span className="star-icon">★</span>
                          <strong>{selectedSeller.rating}</strong>
                          <span className="reviews-count">
                            ({selectedSeller.reviews.toLocaleString()} reviews)
                          </span>
                        </div>
                        <div className="seller-badges">
                          <span className="badge-level">LV.99</span>
                          <span className="badge-rate">
                            {selectedSeller.successRate} thành công
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="console-divider"></div>

                    {/* Price & Quantity inputs */}
                    <div className="console-price-row">
                      <span className="console-price-label">Đơn giá:</span>
                      <span className="console-price-value">
                        {Math.floor(
                          selectedItem.price * selectedSeller.multiplier,
                        ).toLocaleString("vi-VN")}
                        ₫
                      </span>
                    </div>

                    <div className="console-qty-row">
                      <span className="console-qty-label">Số lượng mua:</span>
                      <div className="qty-picker">
                        <button
                          className="qty-btn"
                          onClick={() =>
                            setDetailQuantity((prev) => Math.max(1, prev - 1))
                          }
                        >
                          -
                        </button>
                        <input
                          type="number"
                          className="qty-input"
                          value={detailQuantity}
                          onChange={(e) =>
                            setDetailQuantity(
                              Math.max(1, parseInt(e.target.value) || 1),
                            )
                          }
                        />
                        <button
                          className="qty-btn"
                          onClick={() => setDetailQuantity((prev) => prev + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="console-divider"></div>

                    <div className="console-total-row">
                      <span>Tổng chi phí:</span>
                      <span className="total-value">
                        {(
                          Math.floor(
                            selectedItem.price * selectedSeller.multiplier,
                          ) * detailQuantity
                        ).toLocaleString("vi-VN")}
                        ₫
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="console-actions">
                      <button
                        className="btn btn-primary"
                        style={{
                          flex: 1,
                          borderRadius: "8px",
                          padding: "14px",
                        }}
                        onClick={() =>
                          handleBuyNow(
                            selectedItem,
                            selectedGame,
                            selectedSeller,
                            detailQuantity,
                          )
                        }
                      >
                        Mua Ngay
                      </button>
                      <button
                        className="btn btn-secondary"
                        style={{ borderRadius: "8px", padding: "14px" }}
                        onClick={() =>
                          handleAddToCart(
                            selectedItem,
                            selectedGame,
                            selectedSeller,
                            detailQuantity,
                          )
                        }
                        title="Thêm vào giỏ hàng"
                      >
                        <svg
                          width="20"
                          height="20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4H6z"></path>
                          <path d="M3 6h18M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                      </button>
                    </div>

                    {/* Chat with seller directly */}
                    <button
                      className="btn btn-outline"
                      style={{
                        width: "100%",
                        marginTop: "12px",
                        borderRadius: "8px",
                        padding: "10px",
                        fontSize: "13px",
                      }}
                      onClick={() =>
                        openChatWithPartner(
                          selectedSeller.name,
                          selectedGame.name,
                        )
                      }
                    >
                      Chat với người bán
                    </button>
                  </div>

                  {/* Trust check list */}
                  <div className="gamerprotect-widget">
                    <div className="gp-widget-header">
                      <span className="gp-shield-icon">🛡️</span>
                      <strong>Bảo vệ giao dịch GamerProtect</strong>
                    </div>
                    <ul className="gp-widget-list">
                      <li>
                        Hệ thống ký quỹ giữ tiền an toàn cho đến khi xác nhận đã
                        nhận sản phẩm sạch.
                      </li>
                      <li>
                        Trọng tài hỗ trợ giải quyết tranh chấp 24/7 trực quan.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bottom compare other sellers table */}
              <div className="sellers-compare-box">
                <h3 className="section-title">
                  So sánh giá và ưu đãi từ các người bán khác
                </h3>
                <div className="compare-table-wrapper">
                  <table className="compare-table">
                    <thead>
                      <tr>
                        <th>Người bán</th>
                        <th>Tỷ lệ thành công</th>
                        <th>Tốc độ giao hàng</th>
                        <th>Kho hàng</th>
                        <th>Đơn giá</th>
                        <th style={{ textAlign: "right" }}>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_SELLERS.map((seller) => (
                        <tr
                          key={seller.id}
                          className={
                            selectedSeller.id === seller.id ? "active-row" : ""
                          }
                        >
                          <td>
                            <div className="compare-seller-info">
                              <span className="compare-seller-avatar">
                                {seller.name.slice(0, 2).toUpperCase()}
                              </span>
                              <div>
                                <div
                                  className="compare-seller-name"
                                  onClick={() => setSelectedSeller(seller)}
                                >
                                  {seller.name}
                                </div>
                                <div className="compare-seller-rating">
                                  <span className="star-icon">★</span>
                                  <span>{seller.rating}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="text-success">
                              {seller.successRate}
                            </span>
                          </td>
                          <td>
                            <span>{seller.speed}</span>
                          </td>
                          <td>
                            <span>{seller.stock} sản phẩm</span>
                          </td>
                          <td>
                            <span className="compare-price-val">
                              {Math.floor(
                                selectedItem.price * seller.multiplier,
                              ).toLocaleString("vi-VN")}
                              ₫
                            </span>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <div style={{ display: "inline-flex", gap: "6px" }}>
                              <button
                                className="btn btn-secondary btn-sm"
                                style={{ borderRadius: "6px" }}
                                onClick={() =>
                                  handleAddToCart(
                                    selectedItem,
                                    selectedGame,
                                    seller,
                                    1,
                                  )
                                }
                              >
                                + Giỏ
                              </button>
                              <button
                                className="btn btn-primary btn-sm"
                                style={{
                                  borderRadius: "6px",
                                  background: "var(--brand-red)",
                                }}
                                onClick={() =>
                                  handleBuyNow(
                                    selectedItem,
                                    selectedGame,
                                    seller,
                                    1,
                                  )
                                }
                              >
                                Mua
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Checkout Billing view */}
        {currentView === "checkout" && (
          <section className="checkout-section">
            <div className="container">
              <h2 className="section-title">Thanh Toán Giao Dịch G2G</h2>

              <div className="checkout-grid">
                {/* Left Column: Payments Selector & details */}
                <div className="checkout-left-col">
                  <div className="checkout-card">
                    <h3 className="card-title">
                      1. Chọn phương thức thanh toán
                    </h3>

                    <div className="payment-tabs-layout">
                      <div className="payment-tabs-sidebar">
                        <div
                          className={`payment-tab-button ${activePaymentTab === "momo" ? "active" : ""}`}
                          onClick={() => setActivePaymentTab("momo")}
                        >
                          <span className="payment-icon">📱</span>
                          <span>Ví điện tử MoMo</span>
                        </div>
                        <div
                          className={`payment-tab-button ${activePaymentTab === "zalopay" ? "active" : ""}`}
                          onClick={() => setActivePaymentTab("zalopay")}
                        >
                          <span className="payment-icon">💸</span>
                          <span>Ví điện tử ZaloPay</span>
                        </div>
                        <div
                          className={`payment-tab-button ${activePaymentTab === "banking" ? "active" : ""}`}
                          onClick={() => setActivePaymentTab("banking")}
                        >
                          <span className="payment-icon">🏦</span>
                          <span>Chuyển khoản NH Auto</span>
                        </div>
                        <div
                          className={`payment-tab-button ${activePaymentTab === "card" ? "active" : ""}`}
                          onClick={() => setActivePaymentTab("card")}
                        >
                          <span className="payment-icon">💳</span>
                          <span>Thẻ Visa / Mastercard</span>
                        </div>
                      </div>

                      <div className="payment-tab-content">
                        {activePaymentTab === "momo" && (
                          <div className="qr-payment-container">
                            <div className="qr-box">
                              {/* Virtual Momo QR code design */}
                              <div className="virtual-qr-code">
                                <div className="qr-corner top-left"></div>
                                <div className="qr-corner top-right"></div>
                                <div className="qr-corner bottom-left"></div>
                                <div className="qr-corner bottom-right"></div>
                                <div className="qr-logo-momo">MoMo</div>
                                <div className="qr-matrix-dots"></div>
                              </div>
                              <div className="qr-amount">
                                Tổng tiền:{" "}
                                {(getCartTotal() + 15000).toLocaleString(
                                  "vi-VN",
                                )}
                                ₫
                              </div>
                            </div>
                            <div className="qr-instructions">
                              <h5>Quét Mã QR MoMo</h5>
                              <ol>
                                <li>
                                  Mở ứng dụng MoMo trên điện thoại di động của
                                  bạn.
                                </li>
                                <li>
                                  Chọn tính năng <strong>Quét mã</strong> và
                                  quét mã QR ở bên cạnh.
                                </li>
                                <li>
                                  Nhập đúng mã nội dung thanh toán:{" "}
                                  <strong>
                                    G2G-
                                    {Math.floor(10000 + Math.random() * 90000)}
                                  </strong>
                                </li>
                                <li>
                                  Nhấn nút{" "}
                                  <strong>Xác nhận đã chuyển tiền</strong> bên
                                  dưới sau khi hoàn thành.
                                </li>
                              </ol>
                            </div>
                          </div>
                        )}

                        {activePaymentTab === "zalopay" && (
                          <div className="qr-payment-container">
                            <div className="qr-box">
                              <div
                                className="virtual-qr-code"
                                style={{ borderColor: "#0070e0" }}
                              >
                                <div
                                  className="qr-corner top-left"
                                  style={{ borderColor: "#0070e0" }}
                                ></div>
                                <div
                                  className="qr-corner top-right"
                                  style={{ borderColor: "#0070e0" }}
                                ></div>
                                <div
                                  className="qr-corner bottom-left"
                                  style={{ borderColor: "#0070e0" }}
                                ></div>
                                <div
                                  className="qr-corner bottom-right"
                                  style={{ borderColor: "#0070e0" }}
                                ></div>
                                <div
                                  className="qr-logo-momo"
                                  style={{ background: "#0070e0" }}
                                >
                                  Zalo
                                </div>
                                <div className="qr-matrix-dots"></div>
                              </div>
                              <div className="qr-amount">
                                Tổng tiền:{" "}
                                {(getCartTotal() + 12000).toLocaleString(
                                  "vi-VN",
                                )}
                                ₫
                              </div>
                            </div>
                            <div className="qr-instructions">
                              <h5>Quét Mã QR ZaloPay</h5>
                              <ol>
                                <li>
                                  Mở ứng dụng ZaloPay hoặc Zalo trên điện thoại.
                                </li>
                                <li>Quét mã QR để chuyển khoản nhanh.</li>
                                <li>
                                  Nội dung chuyển khoản mặc định:{" "}
                                  <strong>
                                    G2G-ZALO-
                                    {Math.floor(10000 + Math.random() * 90000)}
                                  </strong>
                                </li>
                              </ol>
                            </div>
                          </div>
                        )}

                        {activePaymentTab === "banking" && (
                          <div className="banking-instructions">
                            <h5>Thông tin tài khoản ngân hàng nhận</h5>
                            <div className="banking-details-grid">
                              <div className="banking-field">
                                <span className="label">Ngân hàng:</span>
                                <span className="value">
                                  MB Bank (Ngân hàng Quân Đội)
                                </span>
                              </div>
                              <div className="banking-field">
                                <span className="label">Số tài khoản:</span>
                                <span className="value copy-value">
                                  999920268888{" "}
                                  <span
                                    className="copy-icon"
                                    onClick={() =>
                                      triggerToast("Đã copy số tài khoản!")
                                    }
                                  >
                                    📋
                                  </span>
                                </span>
                              </div>
                              <div className="banking-field">
                                <span className="label">Chủ tài khoản:</span>
                                <span className="value">
                                  CONG TY CONG NGHE G2G CLONE
                                </span>
                              </div>
                              <div className="banking-field">
                                <span className="label">Số tiền:</span>
                                <span className="value">
                                  {(getCartTotal() + 10000).toLocaleString(
                                    "vi-VN",
                                  )}
                                  ₫
                                </span>
                              </div>
                              <div
                                className="banking-field"
                                style={{ gridColumn: "span 2" }}
                              >
                                <span className="label">
                                  Nội dung chuyển tiền:
                                </span>
                                <span
                                  className="value copy-value"
                                  style={{
                                    color: "var(--brand-red)",
                                    fontWeight: "bold",
                                  }}
                                >
                                  G2G BANKING{" "}
                                  {Math.floor(100000 + Math.random() * 900000)}
                                  <span
                                    className="copy-icon"
                                    onClick={() =>
                                      triggerToast("Đã copy nội dung!")
                                    }
                                  >
                                    📋
                                  </span>
                                </span>
                              </div>
                            </div>
                            <div className="note-alert">
                              ⚠️ Hệ thống tự động cộng tiền trong vòng 10 giây
                              sau khi nhận được chuyển khoản ngân hàng chính xác
                              nội dung.
                            </div>
                          </div>
                        )}

                        {activePaymentTab === "card" && (
                          <div className="card-form-container">
                            <h5>Nhập thông tin thẻ quốc tế</h5>
                            <div className="card-form-grid">
                              <div
                                className="form-group"
                                style={{ gridColumn: "span 2" }}
                              >
                                <label>Số thẻ tín dụng / Ghi nợ</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="4111 2222 3333 4444"
                                  value={cardNo}
                                  onChange={(e) =>
                                    setCardNo(
                                      e.target.value
                                        .replace(/\D/g, "")
                                        .substring(0, 16),
                                    )
                                  }
                                  required
                                />
                              </div>
                              <div className="form-group">
                                <label>Ngày hết hạn</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="MM/YY"
                                  value={cardExp}
                                  onChange={(e) =>
                                    setCardExp(e.target.value.substring(0, 5))
                                  }
                                  required
                                />
                              </div>
                              <div className="form-group">
                                <label>Mã CVV / CVC</label>
                                <input
                                  type="password"
                                  className="form-control"
                                  placeholder="•••"
                                  value={cardCvv}
                                  onChange={(e) =>
                                    setCardCvv(
                                      e.target.value
                                        .replace(/\D/g, "")
                                        .substring(0, 3),
                                    )
                                  }
                                  required
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Checkout Billing summary panel */}
                <div className="checkout-right-col">
                  <div className="checkout-card">
                    <h3 className="card-title">2. Tóm tắt đơn hàng</h3>

                    <div className="checkout-items-list">
                      {cart.map((item) => (
                        <div key={item.cartId} className="checkout-item-row">
                          <div className="checkout-item-details">
                            <span
                              className="checkout-item-icon"
                              style={{ background: item.color }}
                            >
                              {item.textIcon}
                            </span>
                            <div>
                              <div className="checkout-item-name">
                                {item.itemName}
                              </div>
                              <div className="checkout-item-seller">
                                Người bán: {item.sellerName}
                              </div>
                              <div className="checkout-item-qty">
                                Số lượng: {item.qty}
                              </div>
                            </div>
                          </div>
                          <span className="checkout-item-price">
                            {(item.price * item.qty).toLocaleString("vi-VN")}₫
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="checkout-totals">
                      <div className="total-row-sub">
                        <span>Giá trị sản phẩm:</span>
                        <span>{getCartTotal().toLocaleString("vi-VN")}₫</span>
                      </div>
                      <div className="total-row-sub">
                        <span>Phí cổng thanh toán / Bảo hiểm:</span>
                        <span>
                          {activePaymentTab === "momo"
                            ? "15.000₫"
                            : activePaymentTab === "zalopay"
                              ? "12.000₫"
                              : activePaymentTab === "banking"
                                ? "10.000₫"
                                : "25.000₫"}
                        </span>
                      </div>
                      <div className="checkout-divider"></div>
                      <div className="total-row-main">
                        <span>Tổng cộng:</span>
                        <span className="total-large">
                          {(
                            getCartTotal() +
                            (activePaymentTab === "momo"
                              ? 15000
                              : activePaymentTab === "zalopay"
                                ? 12000
                                : activePaymentTab === "banking"
                                  ? 10000
                                  : 25000)
                          ).toLocaleString("vi-VN")}
                          ₫
                        </span>
                      </div>
                    </div>

                    <form
                      onSubmit={handleConfirmPayment}
                      style={{ marginTop: "24px" }}
                    >
                      <div className="checkout-agreement">
                        <input type="checkbox" id="checkoutAgree" required />
                        <label htmlFor="checkoutAgree">
                          Tôi xác nhận các thông tin mua sản phẩm trên là chính
                          xác và đồng ý với điều khoản thanh toán.
                        </label>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{
                          width: "100%",
                          padding: "14px",
                          borderRadius: "8px",
                          fontSize: "15px",
                        }}
                        disabled={checkoutProcessing || cart.length === 0}
                      >
                        {checkoutProcessing
                          ? "Đang giao dịch..."
                          : "Xác nhận đã thanh toán"}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Orders Dashboard View */}
        {currentView === "orders" && (
          <section className="dashboard-section">
            <div className="container">
              <h2 className="section-title">
                Quản Lý Giao Dịch &amp; Đơn Hàng
              </h2>

              <div className="dashboard-layout">
                {/* Tabs selection */}
                <div className="dashboard-tabs">
                  <span className="tab-item active">
                    Lịch sử đơn mua ({orders.length})
                  </span>
                  <span
                    className="tab-item"
                    onClick={() =>
                      triggerToast(
                        "Lịch sử đơn bán chỉ dành cho tài khoản đã xét duyệt là Người bán.",
                      )
                    }
                  >
                    Lịch sử đơn bán
                  </span>
                  <span
                    className="tab-item"
                    onClick={() =>
                      triggerToast("Hồ sơ cá nhân và Cài đặt bảo mật.")
                    }
                  >
                    Cài đặt tài khoản
                  </span>
                </div>

                {/* Orders tracking grid list */}
                <div className="orders-list-wrapper">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <div key={order.id} className="order-log-card">
                        <div className="order-log-header">
                          <div className="order-log-meta">
                            <span className="order-id">
                              Mã đơn: <strong>#{order.id}</strong>
                            </span>
                            <span className="order-date">
                              Ngày mua: {order.date}
                            </span>
                          </div>

                          <span
                            className={`order-status-badge ${order.status}`}
                          >
                            {order.status === "pending" && "⏳ Chờ giao hàng"}
                            {order.status === "delivering" &&
                              "📦 Đang giao hàng"}
                            {order.status === "completed" && "✓ Đã hoàn thành"}
                          </span>
                        </div>

                        <div className="order-log-body">
                          <div className="order-log-details">
                            <div className="order-game-avatar">
                              {order.gameName.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="order-item-name">
                                {order.itemName}
                              </h4>
                              <div className="order-item-seller">
                                Người bán: <strong>{order.sellerName}</strong>
                              </div>
                              <div className="order-item-qty">
                                Số lượng: {order.qty} | Cổng thanh toán:{" "}
                                {order.paymentMethod}
                              </div>
                            </div>
                          </div>

                          <div className="order-log-price">
                            <div className="price-label">Tổng thanh toán</div>
                            <div className="price-val">
                              {(order.price * order.qty).toLocaleString(
                                "vi-VN",
                              )}
                              ₫
                            </div>
                          </div>
                        </div>

                        <div className="order-log-actions">
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() =>
                              openChatWithPartner(
                                order.sellerName,
                                order.gameName,
                              )
                            }
                          >
                            💬 Trò chuyện với người bán
                          </button>
                          {order.status === "completed" ? (
                            <button
                              className="btn btn-outline btn-sm"
                              style={{
                                borderColor: "var(--success)",
                                color: "var(--success)",
                              }}
                              onClick={() =>
                                triggerToast("Cảm ơn bạn đã phản hồi tốt!")
                              }
                            >
                              Đánh giá 5★
                            </button>
                          ) : (
                            <button
                              className="btn btn-primary btn-sm"
                              style={{ background: "#0284c7" }}
                              onClick={() =>
                                triggerToast(
                                  `Đơn hàng #${order.id} đang được hối thúc giao nhanh!`,
                                )
                              }
                            >
                              Hối thúc giao hàng
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-orders-view">
                      <p>Bạn chưa thực hiện giao dịch nào.</p>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => pushRoute("home")}
                      >
                        Khám phá chợ game ngay
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Global Footer Section */}
      <footer className="footer-main">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <h3>G2G CLONE</h3>
              <p>
                G2G Clone là nền tảng mô phỏng chợ giao dịch trò chơi điện tử
                trực tuyến an toàn hàng đầu. Giúp các game thủ kết nối mua bán
                tiền tệ, tài khoản game, thẻ game nạp tự động nhanh chóng nhất.
              </p>
              <div className="footer-socials">
                <a
                  href="#fb"
                  className="social-link"
                  onClick={(e) => e.preventDefault()}
                >
                  Fb
                </a>
                <a
                  href="#tw"
                  className="social-link"
                  onClick={(e) => e.preventDefault()}
                >
                  Tw
                </a>
                <a
                  href="#dc"
                  className="social-link"
                  onClick={(e) => e.preventDefault()}
                >
                  Dc
                </a>
                <a
                  href="#yt"
                  className="social-link"
                  onClick={(e) => e.preventDefault()}
                >
                  Yt
                </a>
              </div>
            </div>

            <div className="footer-col">
              <h5>G2G</h5>
              <ul>
                <li>
                  <a
                    href="#about"
                    onClick={(e) => {
                      e.preventDefault();
                      triggerToast("Trang giới thiệu G2G");
                    }}
                  >
                    Về chúng tôi
                  </a>
                </li>
                <li>
                  <a
                    href="#careers"
                    onClick={(e) => {
                      e.preventDefault();
                      triggerToast("Cơ hội việc làm tại G2G");
                    }}
                  >
                    Tuyển dụng
                  </a>
                </li>
                <li>
                  <a
                    href="#blog"
                    onClick={(e) => {
                      e.preventDefault();
                      triggerToast("G2G Blog");
                    }}
                  >
                    G2G Blog
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h5>Hỗ Trợ</h5>
              <ul>
                <li>
                  <a
                    href="#help"
                    onClick={(e) => {
                      e.preventDefault();
                      triggerToast("Trung tâm trợ giúp");
                    }}
                  >
                    Trung tâm hỗ trợ
                  </a>
                </li>
                <li>
                  <a
                    href="#protect"
                    onClick={(e) => {
                      e.preventDefault();
                      triggerToast("Chi tiết bảo hiểm GamerProtect");
                    }}
                  >
                    GamerProtect
                  </a>
                </li>
                <li>
                  <a
                    href="#refund"
                    onClick={(e) => {
                      e.preventDefault();
                      triggerToast("Chính sách hoàn tiền");
                    }}
                  >
                    Chính sách hoàn tiền
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h5>Người Bán</h5>
              <ul>
                <li>
                  <a
                    href="#rules"
                    onClick={(e) => {
                      e.preventDefault();
                      triggerToast("Quy định bán hàng");
                    }}
                  >
                    Quy tắc người bán
                  </a>
                </li>
                <li>
                  <a
                    href="#fees"
                    onClick={(e) => {
                      e.preventDefault();
                      triggerToast("Bảng phí giao dịch chi tiết");
                    }}
                  >
                    Biểu phí giao dịch
                  </a>
                </li>
                <li>
                  <a
                    href="#become"
                    onClick={(e) => {
                      e.preventDefault();
                      handleSellerEntryClick();
                    }}
                  >
                    {sellerEntryLabel}
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h5>Pháp Lý</h5>
              <ul>
                <li>
                  <a
                    href="#terms"
                    onClick={(e) => {
                      e.preventDefault();
                      triggerToast("Điều khoản dịch vụ");
                    }}
                  >
                    Điều khoản dịch vụ
                  </a>
                </li>
                <li>
                  <a
                    href="#privacy"
                    onClick={(e) => {
                      e.preventDefault();
                      triggerToast("Chính sách bảo mật");
                    }}
                  >
                    Chính sách bảo mật
                  </a>
                </li>
                <li>
                  <a
                    href="#cookies"
                    onClick={(e) => {
                      e.preventDefault();
                      triggerToast("Quy tắc cookie");
                    }}
                  >
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-payments-wrapper">
            <h6 className="payments-title">Đối tác thanh toán được hỗ trợ</h6>
            <div className="payments-grid">
              <span className="payment-card-logo">PayPal</span>
              <span className="payment-card-logo">VISA</span>
              <span className="payment-card-logo">Mastercard</span>
              <span className="payment-card-logo">Google Pay</span>
              <span className="payment-card-logo">Apple Pay</span>
              <span className="payment-card-logo">MoMo Pay</span>
              <span className="payment-card-logo">ZaloPay</span>
              <span className="payment-card-logo">Chuyển khoản NH</span>
            </div>
          </div>

          <div className="footer-bottom">
            <div>
              © 2026 G2G CLONE. Developed for educational replication. All
              rights reserved.
            </div>
            <div style={{ display: "flex", gap: "20px" }}>
              <span>Tiếng Việt / VND</span>
              <span>Bảo mật SSL Mã hóa 256-bit</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Shopping Cart Sliding Drawer */}
      <div
        className={`cart-drawer-overlay ${isCartOpen ? "open" : ""}`}
        onClick={() => setIsCartOpen(false)}
      >
        <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
          <div className="cart-drawer-header">
            <h4>
              Giỏ hàng của bạn ({cart.reduce((sum, i) => sum + i.qty, 0)})
            </h4>
            <span
              className="close-cart-btn"
              onClick={() => setIsCartOpen(false)}
            >
              ×
            </span>
          </div>

          <div className="cart-drawer-body">
            {cart.length > 0 ? (
              <div className="cart-items-list-vertical">
                {cart.map((item) => (
                  <div key={item.cartId} className="cart-item-card-vertical">
                    <div className="cart-item-vertical-top">
                      <span
                        className="cart-item-vertical-icon"
                        style={{ background: item.color }}
                      >
                        {item.textIcon}
                      </span>
                      <div style={{ flex: 1 }}>
                        <h5 className="cart-item-vertical-name">
                          {item.itemName}
                        </h5>
                        <div className="cart-item-vertical-seller">
                          Người bán: {item.sellerName}
                        </div>
                      </div>
                      <span
                        className="cart-item-vertical-remove"
                        onClick={() => removeCartItem(item.cartId)}
                      >
                        🗑️
                      </span>
                    </div>

                    <div className="cart-item-vertical-bottom">
                      <div className="qty-picker sm">
                        <button
                          className="qty-btn"
                          onClick={() => updateCartQty(item.cartId, -1)}
                        >
                          -
                        </button>
                        <span className="qty-display">{item.qty}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateCartQty(item.cartId, 1)}
                        >
                          +
                        </button>
                      </div>
                      <div className="cart-item-vertical-price">
                        {(item.price * item.qty).toLocaleString("vi-VN")}₫
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-cart-drawer">
                <span className="empty-cart-icon">🛒</span>
                <p>Giỏ hàng trống.</p>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setIsCartOpen(false);
                    pushRoute("home");
                  }}
                >
                  Tiếp tục mua hàng
                </button>
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="cart-drawer-footer">
              <div className="cart-drawer-subtotal">
                <span>Tổng chi phí sản phẩm:</span>
                <span className="price">
                  {getCartTotal().toLocaleString("vi-VN")}₫
                </span>
              </div>
              <button
                className="btn btn-primary checkout-btn"
                onClick={() => {
                  setIsCartOpen(false);
                  pushRoute("checkout");
                }}
              >
                Tiến hành thanh toán
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Checkout Transition Verification Screens */}
      {checkoutProcessing && (
        <div className="transaction-verification-overlay">
          <div className="verification-box">
            <div className="g2g-spinner"></div>
            <h3>GamerProtect đang xử lý...</h3>
            <p>
              Vui lòng không tắt trình duyệt hoặc tải lại trang trong khi hệ
              thống xác thực dòng tiền thanh toán an toàn.
            </p>
          </div>
        </div>
      )}

      {checkoutSuccess && (
        <div className="transaction-verification-overlay success">
          <div className="verification-box bounceIn">
            <div className="success-checkmark">
              <div className="check-icon">
                <span className="icon-line line-tip"></span>
                <span className="icon-line line-long"></span>
                <div className="icon-circle"></div>
                <div className="icon-fix"></div>
              </div>
            </div>
            <h3>Thanh toán giao dịch thành công!</h3>
            <p>
              Mã hóa SSL 256-bit bảo mật. Đơn hàng của bạn đã được gửi cho người
              bán tiến hành giao hàng ngay.
            </p>
          </div>
        </div>
      )}

      {/* Floating Chat System Panel */}
      {showChatDrawer && (
        <div className="chat-widget" onClick={(e) => e.stopPropagation()}>
          <div className="chat-widget-header">
            <div className="chat-partner-profile">
              <div className="avatar-fallback-mini">
                {activeChatId
                  ? chats.find((c) => c.id === activeChatId)?.avatarText
                  : "G2"}
              </div>
              <div>
                <span className="chat-partner-name">
                  {activeChatId
                    ? chats.find((c) => c.id === activeChatId)?.partnerName
                    : "Chăm Sóc Khách Hàng"}
                </span>
                <div className="chat-partner-sub">
                  Hỗ trợ:{" "}
                  {activeChatId
                    ? chats.find((c) => c.id === activeChatId)?.game
                    : "Chợ G2G"}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <span
                className="chat-minimize-btn"
                onClick={() => setShowChatDrawer(false)}
              >
                _
              </span>
            </div>
          </div>

          <div className="chat-widget-body">
            {/* Sidebar list of conversations */}
            <div className="chat-sidebar-threads">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`chat-thread-item ${activeChatId === chat.id ? "active" : ""}`}
                  onClick={() => setActiveChatId(chat.id)}
                >
                  <span className="thread-avatar">{chat.avatarText}</span>
                  <div className="thread-meta">
                    <div className="thread-name">{chat.partnerName}</div>
                    <div className="thread-last-msg">{chat.game}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Conversation Messages logs */}
            <div className="chat-active-conversation">
              {activeChatId ? (
                <>
                  <div className="chat-message-list">
                    {chats
                      .find((c) => c.id === activeChatId)
                      ?.messages.map((msg, index) => (
                        <div
                          key={index}
                          className={`chat-message-bubble ${msg.sender}`}
                        >
                          <div className="message-text">{msg.text}</div>
                        </div>
                      ))}
                  </div>

                  <form
                    onSubmit={handleSendChatMessage}
                    className="chat-input-bar"
                  >
                    <input
                      type="text"
                      placeholder="Nhập tin nhắn chat tại đây..."
                      className="chat-input-field"
                      value={chatInputText}
                      onChange={(e) => setChatInputText(e.target.value)}
                    />
                    <button type="submit" className="chat-send-btn">
                      Gửi
                    </button>
                  </form>
                </>
              ) : (
                <div className="chat-no-active">
                  Chọn một cuộc trò chuyện để bắt đầu trao đổi chi tiết sản
                  phẩm.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Login Modals */}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLogin={handleLoginSuccess}
        />
      )}

      {currentView === "register-seller" && currentUser && (
        <RegisterSeller
          user={currentUser}
          onBack={() => pushRoute("home")}
          onConfirm={handleSellerRegistrationComplete}
        />
      )}

      {currentView === "seller-product" && currentUser?.role === "seller" && (
        <SellerProduct user={currentUser} onBack={() => pushRoute("home")} />
      )}

      {currentView === "seller-product" && currentUser?.role !== "seller" && (
        <div className="container" style={{ padding: "72px 0 96px" }}>
          <div
            style={{
              maxWidth: "760px",
              margin: "0 auto",
              padding: "32px",
              borderRadius: "24px",
              border: "1px solid var(--border-color)",
              background: "var(--bg-secondary)",
              boxShadow: "var(--card-shadow)",
            }}
          >
            <span className="register-seller-kicker">Khu vực người bán</span>
            <h1
              style={{
                margin: "10px 0 12px",
                fontFamily: "var(--font-heading)",
              }}
            >
              Chỉ seller mới được đăng sản phẩm
            </h1>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {currentUser
                ? "Tài khoản hiện tại chưa có role seller. Hãy đăng ký seller trước khi đăng sản phẩm."
                : "Bạn cần đăng nhập trước khi vào trang đăng sản phẩm."}
            </p>
            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                marginTop: "24px",
              }}
            >
              {currentUser ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => pushRoute("register-seller")}
                >
                  Đăng ký seller
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowLogin(true)}
                >
                  Đăng nhập
                </button>
              )}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => pushRoute("home")}
              >
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Become a Seller Modal */}
      {activeModal === "seller" && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="modal-close" onClick={() => setActiveModal(null)}>
              ×
            </span>
            <h3
              style={{
                marginBottom: "16px",
                fontSize: "20px",
                fontWeight: 800,
              }}
            >
              Đăng Ký Người Bán Game
            </h3>
            <p
              style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                marginBottom: "20px",
                lineHeight: 1.5,
              }}
            >
              Kiếm thêm thu nhập từ việc bán xu game, tài khoản dư hoặc cày thuê
              game. Quá trình xét duyệt miễn phí và nhanh chóng!
            </p>
            <form onSubmit={handleSellerSubmit}>
              <div className="form-group">
                <label>Trò chơi muốn giao dịch chính</label>
                <select
                  className="form-control"
                  value={sellerGame}
                  onChange={(e) => setSellerGame(e.target.value)}
                >
                  <option value="Valorant">Valorant</option>
                  <option value="Roblox">Roblox</option>
                  <option value="League of Legends">League of Legends</option>
                  <option value="Genshin Impact">Genshin Impact</option>
                </select>
              </div>

              <div className="form-group">
                <label>Mô tả ngắn kinh nghiệm &amp; sản phẩm bán</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Ví dụ: Tôi có nguồn Robux sạch dồi dào, hoặc có đội cày thuê Liên Quân uy tín..."
                  value={sellerExperience}
                  onChange={(e) => setSellerExperience(e.target.value)}
                  style={{ resize: "vertical" }}
                  required
                ></textarea>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginBottom: "24px",
                  alignItems: "flex-start",
                }}
              >
                <input
                  type="checkbox"
                  id="sellerAgree"
                  required
                  style={{ marginTop: "3px" }}
                />
                <label
                  htmlFor="sellerAgree"
                  style={{
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.4,
                    cursor: "pointer",
                  }}
                >
                  Tôi cam kết cung cấp sản phẩm sạch và tuân thủ quy định giao
                  dịch của G2G.
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%", padding: "12px" }}
              >
                Gửi Hồ Sơ Xét Duyệt
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
