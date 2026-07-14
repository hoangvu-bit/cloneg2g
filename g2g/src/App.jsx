/* eslint-disable no-irregular-whitespace, no-unused-vars, react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import "./App.css";
import LoginModal from "./login.jsx";
import RegisterSeller from "./RegisterSeller.jsx";
import SellerProduct from "./SellerProduct.jsx";
import { fetchCurrentUser } from "./auth.js";

const USER_STORAGE_KEY = "shop-online-user";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";
const VALID_USER_ROLES = new Set(["user", "seller", "admin"]);

const getCookie = (name) => {
  if (typeof document === "undefined") {
    return "";
  }
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${name}=`))
      ?.split("=")[1] || ""
  );
};

const createClientId = (prefix = "id") =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const createPaymentCode = (prefix, min, range) =>
  `${prefix}${Math.floor(min + Math.random() * range)}`;

const normalizeUserRole = (role) => {
  const normalized = `${role || "user"}`.trim().toLowerCase();
  if (["regular", "customer", "member"].includes(normalized)) {
    return "user";
  }
  return VALID_USER_ROLES.has(normalized) ? normalized : "user";
};

const readStoredUser = () => {
  if (typeof window === "undefined" || !window.localStorage) {
    return null;
  }

  try {
    const storedUser = window.localStorage.getItem(USER_STORAGE_KEY);
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    return parsedUser
      ? { ...parsedUser, role: normalizeUserRole(parsedUser.role) }
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
      "Náº¡p Robux giÃ¡ ráº», tá»± Ä‘á»™ng, há»— trá»£ tÃ i khoáº£n Global báº£o máº­t 100% vá»›i báº£o hiá»ƒm GamerProtect.",
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
    name: "Garena Shells (SÃ² Garena)",
    category: "cards",
    badge: "Auto Delivery",
    textIcon: "Gar",
    color: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
    description:
      "SÃ² Garena Viá»‡t Nam dÃ¹ng Ä‘á»ƒ náº¡p cÃ¡c game LiÃªn QuÃ¢n Mobile, Free Fire, FC Online giÃ¡ ráº» nháº¥t.",
    items: [
      {
        id: "gar-20",
        name: "20 SÃ² Garena",
        price: 9500,
        badge: "Auto Send",
        region: "Vietnam",
        offers: 8,
      },
      {
        id: "gar-50",
        name: "50 SÃ² Garena",
        price: 24000,
        badge: "Auto Send",
        region: "Vietnam",
        offers: 16,
      },
      {
        id: "gar-100",
        name: "100 SÃ² Garena",
        price: 48000,
        badge: "Auto Send",
        region: "Vietnam",
        offers: 28,
      },
      {
        id: "gar-200",
        name: "200 SÃ² Garena",
        price: 95000,
        badge: "Auto Send",
        region: "Vietnam",
        offers: 34,
      },
      {
        id: "gar-500",
        name: "500 SÃ² Garena",
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
      "Tháº» Zing náº¡p game VNG: VÃµ LÃ¢m Truyá»n Ká»³, Kiáº¿m Tháº¿, PUBG Mobile, Boom M giÃ¡ ráº» chiáº¿t kháº¥u cao.",
    items: [
      {
        id: "zing-20",
        name: "Tháº» Zing 20K",
        price: 19000,
        badge: "Discount 5%",
        region: "Vietnam",
        offers: 5,
      },
      {
        id: "zing-50",
        name: "Tháº» Zing 50K",
        price: 47500,
        badge: "Discount 5%",
        region: "Vietnam",
        offers: 12,
      },
      {
        id: "zing-100",
        name: "Tháº» Zing 100K",
        price: 95000,
        badge: "Discount 5%",
        region: "Vietnam",
        offers: 19,
      },
      {
        id: "zing-200",
        name: "Tháº» Zing 200K",
        price: 190000,
        badge: "Discount 5%",
        region: "Vietnam",
        offers: 24,
      },
      {
        id: "zing-500",
        name: "Tháº» Zing 500K",
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
      "Náº¡p VP mua skin sÃºng Valorant giÃ¡ ráº». Nháº­n mÃ£ code hoáº·c náº¡p trá»±c tiáº¿p qua tÃ i khoáº£n RIOT.",
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
      "MÃ£ code náº¡p Steam Wallet mua game, váº­t pháº©m Market báº£o máº­t tá»‘t nháº¥t.",
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
    name: "LiÃªn QuÃ¢n Mobile - TÃ i Khoáº£n VIP",
    category: "accounts",
    badge: "Acc Tráº¯ng TT",
    textIcon: "LQ",
    color: "linear-gradient(135deg, #1e1b4b 0%, #311042 100%)",
    description:
      "TÃ i khoáº£n LiÃªn QuÃ¢n Mobile giÃ¡ tá»‘t, rank cao thá»§, nhiá»u skin Ä‘áº¹p, Ä‘áº§y Ä‘á»§ ngá»c.",
    items: [
      {
        id: "lq-white",
        name: "TÃ i Khoáº£n Tráº¯ng ThÃ´ng Tin",
        price: 50000,
        badge: "Clean Acc",
        region: "Vietnam",
        offers: 42,
      },
      {
        id: "lq-caothu",
        name: "TÃ i Khoáº£n Cao Thá»§ 50 Skin",
        price: 150000,
        badge: "Full Ngá»c",
        region: "Vietnam",
        offers: 85,
      },
      {
        id: "lq-chientuong",
        name: "TÃ i Khoáº£n Chiáº¿n TÆ°á»›ng Full TÆ°á»›ng",
        price: 450000,
        badge: "VIP Skin",
        region: "Vietnam",
        offers: 30,
      },
      {
        id: "lq-thachdau",
        name: "TÃ i Khoáº£n VIP ThÃ¡ch Äáº¥u Skin SSS",
        price: 2500000,
        badge: "Super Rich",
        region: "Vietnam",
        offers: 5,
      },
    ],
  },
  {
    id: "lol-boosting",
    name: "League of Legends - CÃ y ThuÃª",
    category: "boosting",
    badge: "Pro Boosters",
    textIcon: "LoL",
    color: "linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)",
    description:
      "CÃ y thuÃª LMHT uy tÃ­n bá»Ÿi tuyá»ƒn thá»§ thÃ¡ch Ä‘áº¥u. Äáº£m báº£o báº£o máº­t tÃ i khoáº£n 100%.",
    items: [
      {
        id: "lol-iron-gold",
        name: "CÃ y ThuÃª Sáº¯t lÃªn VÃ ng",
        price: 100000,
        badge: "Pro Boost",
        region: "Vietnam",
        offers: 15,
      },
      {
        id: "lol-gold-diamond",
        name: "CÃ y ThuÃª VÃ ng lÃªn Kim CÆ°Æ¡ng",
        price: 350000,
        badge: "Pro Boost",
        region: "Vietnam",
        offers: 24,
      },
      {
        id: "lol-master-challenger",
        name: "CÃ y ThuÃª Cao Thá»§ lÃªn ThÃ¡ch Äáº¥u",
        price: 1200000,
        badge: "Top Player",
        region: "Vietnam",
        offers: 8,
      },
    ],
  },
  {
    id: "genshin-impact",
    name: "Genshin Impact - Acc Äáº¹p",
    category: "accounts",
    badge: "Safe Guarantee",
    textIcon: "GI",
    color: "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
    description:
      "TÃ i khoáº£n Genshin Impact AR cao, sá»Ÿ há»¯u cÃ¡c nhÃ¢n váº­t 5 sao giá»›i háº¡n vÃ  vÅ© khÃ­ tráº¥n cá»±c xá»‹n.",
    items: [
      {
        id: "gi-ar40",
        name: "Acc AR 40 CÃ³ 2 TÆ°á»›ng 5 Sao",
        price: 80000,
        badge: "Starter Acc",
        region: "Asia",
        offers: 25,
      },
      {
        id: "gi-ar50",
        name: "Acc AR 50 CÃ³ Raiden Shogun + Tráº¥n",
        price: 250000,
        badge: "Hot Pick",
        region: "Asia",
        offers: 40,
      },
      {
        id: "gi-ar55",
        name: "Acc AR 55 GiÃ¡ Ráº» HÆ¡n 10 TÆ°á»›ng 5 Sao",
        price: 650000,
        badge: "Secure 100%",
        region: "Asia",
        offers: 18,
      },
      {
        id: "gi-whale",
        name: "Acc Whale AR 60 Cung Má»‡nh C6R5",
        price: 8500000,
        badge: "Whale Acc",
        region: "Asia",
        offers: 3,
      },
    ],
  },
  {
    id: "counter-strike-2",
    name: "Counter-Strike 2 - Skins & HÃ²m",
    category: "items",
    badge: "Hot Skins",
    textIcon: "CS2",
    color: "linear-gradient(135deg, #ea580c 0%, #7c2d12 100%)",
    description:
      "Skins sÃºng, dao, gÄƒng tay CS2 cá»±c hot. Giao dá»‹ch trá»±c tiáº¿p qua Steam Trade Offer an toÃ n 100%.",
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
        name: "Kilowatt Case x50 HÃ²m CS2",
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
      "NÆ¡i mua bÃ¡n skin sÃºng, dao CS2 trá»±c tiáº¿p giÃ¡ tá»‘t nháº¥t, chiáº¿t kháº¥u lÃªn Ä‘áº¿n 30% so vá»›i Steam.",
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
    name: "Báº£n Quyá»n Pháº§n Má»m & Key",
    category: "software",
    badge: "100% Genuine",
    textIcon: "Key",
    color: "linear-gradient(135deg, #1e3a8a 0%, #172554 100%)",
    description:
      "Key báº£n quyá»n chÃ­nh hÃ£ng Windows 11 Pro, Office 365, diá»‡t virus Kaspersky kÃ­ch hoáº¡t online.",
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
        name: "Kaspersky Premium 1 NÄƒm 1 Thiáº¿t Bá»‹",
        price: 150000,
        badge: "Instant Code",
        region: "Vietnam",
        offers: 12,
      },
    ],
  },
  {
    id: "payment-cards",
    name: "Tháº» Tráº£ TrÆ°á»›c Visa & Mastercard",
    category: "payment-cards",
    badge: "Secure Pay",
    textIcon: "Card",
    color: "linear-gradient(135deg, #0f766e 0%, #115e59 100%)",
    description:
      "Tháº» áº£o Visa, Mastercard tráº£ trÆ°á»›c dÃ¹ng Ä‘á»ƒ thanh toÃ¡n quá»‘c táº¿, mua quáº£ng cÃ¡o, Ä‘Äƒng kÃ½ Netflix.",
    items: [
      {
        id: "pay-visa5",
        name: "Tháº» áº¢o Visa Prepaid 5$",
        price: 145000,
        badge: "Instant Card",
        region: "Global",
        offers: 8,
      },
      {
        id: "pay-visa10",
        name: "Tháº» áº¢o Visa Prepaid 10$",
        price: 285000,
        badge: "Instant Card",
        region: "Global",
        offers: 12,
      },
      {
        id: "pay-master20",
        name: "Tháº» áº¢o Mastercard Prepaid 20$",
        price: 560000,
        badge: "Instant Card",
        region: "Global",
        offers: 6,
      },
    ],
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

// Mock GamePal Partners List
const MOCK_SELLERS = [
  {
    id: "sel-1",
    name: "GameKongs",
    rating: 4.9,
    reviews: 12430,
    successRate: "99.8%",
    speed: "3 phÃºt",
    stock: 80,
    multiplier: 0.98,
  },
  {
    id: "sel-2",
    name: "FastDeliver_Store",
    rating: 4.8,
    reviews: 8520,
    successRate: "98.5%",
    speed: "5 phÃºt",
    stock: 120,
    multiplier: 1.0,
  },
  {
    id: "sel-3",
    name: "GamerProtect_VIP",
    rating: 5.0,
    reviews: 3410,
    successRate: "100%",
    speed: "2 phÃºt",
    stock: 50,
    multiplier: 1.02,
  },
  {
    id: "sel-4",
    name: "Cheapest_GameCard",
    rating: 4.6,
    reviews: 20150,
    successRate: "96.2%",
    speed: "12 phÃºt",
    stock: 350,
    multiplier: 0.95,
  },
  {
    id: "sel-5",
    name: "ProSells_Global",
    rating: 4.7,
    reviews: 530,
    successRate: "97.1%",
    speed: "8 phÃºt",
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
    name: "Garena Shells 200 SÃ²",
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
      "Giao hÃ ng siÃªu nhanh, chá»‰ máº¥t chÆ°a Ä‘áº§y 1 phÃºt Ä‘Ã£ nháº­n Ä‘Æ°á»£c mÃ£ náº¡p. Äá»™ tin cáº­y tuyá»‡t Ä‘á»‘i!",
    date: "01/07/2026",
  },
  {
    id: 2,
    user: "AnhKhoa_Gamer",
    rating: 5,
    comment:
      "Giao dá»‹ch qua báº£o hiá»ƒm GamerProtect an tÃ¢m cá»±c ká»³, giÃ¡ láº¡i ráº» hÆ¡n cÃ¡c shop khÃ¡c.",
    date: "30/06/2026",
  },
  {
    id: 3,
    user: "ThanhHang_lq",
    rating: 5,
    comment:
      "ÄÃ£ mua acc LiÃªn QuÃ¢n vÃ  náº¡p nhiá»u láº§n á»Ÿ Ä‘Ã¢y, chÄƒm sÃ³c khÃ¡ch hÃ ng há»— trá»£ ráº¥t nhiá»‡t tÃ¬nh.",
    date: "28/06/2026",
  },
  {
    id: 4,
    user: "ProGamer_VN",
    rating: 4,
    comment:
      "Sáº£n pháº©m sáº¡ch, náº¡p tá»± Ä‘á»™ng thuáº­n tiá»‡n. HÆ¡i lÃ¢u má»™t tÃ­ vÃ o giá» cao Ä‘iá»ƒm nhÆ°ng cháº¥p nháº­n Ä‘Æ°á»£c.",
    date: "25/06/2026",
  },
];

function App() {
  const [theme, setTheme] = useState("dark");
  const [currentView, setCurrentView] = useState("home"); // 'home', 'catalog', 'category-catalog', 'product-detail', 'checkout', 'orders', 'register-seller', 'seller-product'
  const [paymentCodes] = useState(() => ({
    momo: createPaymentCode("G2G-", 10000, 90000),
    zalopay: createPaymentCode("G2G-ZALO-", 10000, 90000),
    banking: createPaymentCode("G2G BANKING ", 100000, 900000),
  }));

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
      paymentMethod: "VÃ­ MoMo",
    },
    {
      id: "G2G-194058",
      date: "28/06/2026",
      gameName: "LiÃªn QuÃ¢n Mobile - TÃ i Khoáº£n VIP",
      itemName: "TÃ i Khoáº£n Cao Thá»§ 50 Skin",
      price: 150000,
      qty: 1,
      sellerName: "FastDeliver_Store",
      status: "completed",
      paymentMethod: "Chuyá»ƒn khoáº£n NH",
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
  const [currentUser, setCurrentUser] = useState(null);
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
          text: "Xin chÃ o! MÃ¬nh cÃ³ sáºµn acc Valorant VIP. Báº¡n cáº§n rank gÃ¬ áº¡?",
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
          text: "ChÃ o báº¡n! MÃ¬nh cÃ³ thá»ƒ cÃ y thuÃª up rank vÃ  lÃ m nhiá»‡m vá»¥ Genshin nhÃ©.",
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
          text: "ChÃ o báº¡n, cÃ¡m Æ¡n Ä‘Ã£ liÃªn há»‡! Táº¥t cáº£ code Robux vÃ  SÃ² Garena bÃªn mÃ¬nh Ä‘á»u lÃ  tá»± Ä‘á»™ng gá»­i, nháº­n ngay trong 3 phÃºt.",
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
    let cancelled = false;

    fetchCurrentUser()
      .then((user) => {
        if (cancelled) {
          return;
        }
        setCurrentUser(user);
      })
      .catch(() => {
        if (typeof window !== "undefined" && window.localStorage) {
          window.localStorage.removeItem(USER_STORAGE_KEY);
        }
        if (!cancelled) {
          setCurrentUser(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser({ ...user, role: normalizeUserRole(user.role) });
    setShowLogin(false);
  };

  const handleSellerRegistrationComplete = (updatedUser) => {
    if (!updatedUser) {
      return;
    }

    setCurrentUser({ ...updatedUser, role: normalizeUserRole(updatedUser.role) });
    pushRoute("seller-product");
    triggerToast("ÄÄƒng kÃ½ trá»Ÿ thÃ nh ngÆ°á»i bÃ¡n thÃ nh cÃ´ng.");
  };

  const handleLogout = async () => {
    const confirmed = window.confirm("Báº¡n cÃ³ muá»‘n Ä‘Äƒng xuáº¥t khÃ´ng?");

    if (!confirmed) {
      return;
    }

    await fetch(`${API_BASE_URL}/logout`, {
      method: "POST",
      credentials: "include",
      headers: {
        "X-CSRF-Token": decodeURIComponent(getCookie("csrf_token")),
      },
    }).catch(() => null);

    window.localStorage.removeItem(USER_STORAGE_KEY);
    setCurrentUser(null);
    triggerToast("Báº¡n Ä‘Ã£ Ä‘Äƒng xuáº¥t thÃ nh cÃ´ng.");
  };

  const handleSellerEntryClick = () => {
    if (!currentUser) {
      triggerToast("Vui lÃ²ng Ä‘Äƒng nháº­p trÆ°á»›c khi Ä‘Äƒng kÃ½ trá»Ÿ thÃ nh ngÆ°á»i bÃ¡n.");
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
      ? "ÄÄƒng bÃ¡n sáº£n pháº©m"
      : "Trá»Ÿ thÃ nh ngÆ°á»i bÃ¡n";

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
                `ÄÆ¡n hÃ ng ${o.id} Ä‘ang Ä‘Æ°á»£c ngÆ°á»i bÃ¡n chuáº©n bá»‹ bÃ n giao!`,
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
                `ÄÆ¡n hÃ ng ${o.id} Ä‘Ã£ hoÃ n táº¥t vÃ  bÃ n giao tá»± Ä‘á»™ng thÃ nh cÃ´ng!`,
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
        description: `Thá»‹ trÆ°á»ng giao dá»‹ch ${card.name} an toÃ n, giao dá»‹ch nhanh chÃ³ng vá»›i nhiá»u Æ°u Ä‘Ã£i háº¥p dáº«n.`,
        items: [
          {
            id: `${card.gameId}-item-1`,
            name: `GÃ³i náº¡p Gold ${card.name} 10M`,
            price: 150000,
            badge: "Giao hÃ ng nhanh",
            region: "Global",
            offers: 15,
          },
          {
            id: `${card.gameId}-item-2`,
            name: `GÃ³i náº¡p Gold ${card.name} 50M`,
            price: 680000,
            badge: "ÄÆ°á»£c báº£o hiá»ƒm",
            region: "Global",
            offers: 28,
          },
          {
            id: `${card.gameId}-item-3`,
            name: `Acc ${card.name} Cáº¥p Cao VIP`,
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
        cartId: createClientId("cart"),
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
      `ÄÃ£ thÃªm ${quantity} x "${item.name}" tá»« ${seller.name} vÃ o giá» hÃ ng!`,
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
    triggerToast("ÄÃ£ xÃ³a sáº£n pháº©m khá»i giá» hÃ ng.");
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.qty, 0);
  };

  // Buy Now
  const handleBuyNow = (item, game, seller, quantity) => {
    const unitPrice = Math.floor(item.price * seller.multiplier);
    const newCartItem = {
      cartId: createClientId("cart"),
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
        id: createPaymentCode("G2G-", 100000, 900000),
        date: new Date().toLocaleDateString("vi-VN"),
        gameName: item.gameName,
        itemName: item.itemName,
        price: item.price,
        qty: item.qty,
        sellerName: item.sellerName,
        status: "pending",
        paymentMethod:
          activePaymentTab === "momo"
            ? "VÃ­ MoMo"
            : activePaymentTab === "zalopay"
              ? "VÃ­ ZaloPay"
              : activePaymentTab === "banking"
                ? "Chuyá»ƒn khoáº£n NH"
                : "Tháº» Quá»‘c Tháº¿",
      }));

      setOrders((prev) => [...newOrders, ...prev]);

      setTimeout(() => {
        setCheckoutSuccess(false);
        setCart([]);
        pushRoute("orders");
        triggerToast(
          "Giao dá»‹ch hoÃ n táº¥t! ÄÆ¡n hÃ ng Ä‘ang Ä‘Æ°á»£c chuáº©n bá»‹ bÃ n giao.",
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
      let replyText = `ChÃ o báº¡n! MÃ¬nh lÃ  há»— trá»£ viÃªn cá»§a ${targetChat.partnerName}. CÃ³ váº¥n Ä‘á» gÃ¬ vá» Ä‘Æ¡n hÃ ng cáº§n mÃ¬nh há»— trá»£ khÃ´ng?`;
      if (
        userText.includes("Ä‘Æ¡n") ||
        userText.includes("náº¡p") ||
        userText.includes("mua") ||
        userText.includes("giao")
      ) {
        replyText = `Cáº£m Æ¡n báº¡n! Há»‡ thá»‘ng náº¡p tá»± Ä‘á»™ng cá»§a ${targetChat.partnerName} Ä‘ang xá»­ lÃ½ Ä‘Æ¡n hÃ ng ${targetChat.game}. Vui lÃ²ng kiá»ƒm tra má»¥c ÄÆ¡n hÃ ng sau Ã­t phÃºt nhÃ©!`;
      } else if (
        userText.includes("ráº»") ||
        userText.includes("giÃ¡") ||
        userText.includes("kháº¥u") ||
        userText.includes("sale")
      ) {
        replyText = `Dáº¡ hiá»‡n táº¡i bÃªn mÃ¬nh Ä‘ang chiáº¿t kháº¥u trá»±c tiáº¿p ráº» nháº¥t sÃ n rá»“i Ä‘Ã³ áº¡, ngoÃ i ra báº¡n cÃ²n Ä‘Æ°á»£c hÆ°á»Ÿng báº£o hiá»ƒm hoÃ n tiá»n GamerProtect nhÃ©.`;
      } else if (
        userText.includes("alo") ||
        userText.includes("hi") ||
        userText.includes("shop")
      ) {
        replyText = `Dáº¡ chÃ o báº¡n! Shop váº«n luÃ´n cÃ³ nhÃ¢n viÃªn online trá»±c há»— trá»£ 24/7. Báº¡n cáº§n há»i vá» dá»‹ch vá»¥ nÃ o cá»© nháº¯n cho mÃ¬nh nhÃ©.`;
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
    let chatId;
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
            text: `ChÃ o báº¡n! MÃ¬nh há»— trá»£ dá»‹ch vá»¥ game ${game}. Báº¡n cáº§n gÃ¬ cá»© nháº¯n nhÃ©.`,
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
      triggerToast("Vui lÃ²ng nháº­p mÃ´ táº£ kinh nghiá»‡m bÃ¡n hÃ ng!");
      return;
    }
    triggerToast(
      `Gá»­i yÃªu cáº§u Ä‘Äƒng kÃ½ bÃ¡n game ${sellerGame} thÃ nh cÃ´ng! Há»“ sÆ¡ Ä‘ang Ä‘Æ°á»£c duyá»‡t.`,
    );
    setActiveModal(null);
    setSellerExperience("");
  };

  // Toggle dynamic game list check/uncheck in sidebar filter
  // Search autocomplete suggestion results
  const filteredSuggestions = searchQuery
    ? MOCK_GAMES.filter((g) =>
        g.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : [];

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
                placeholder="TÃ¬m kiáº¿m game, tháº» quÃ  táº·ng, coins..."
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
                  Ã—
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
                            Æ¯u Ä‘Ã£i
                          </span>
                          <span
                            className="chip"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateToCatalog(game);
                            }}
                          >
                            Náº¡p tháº»
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-suggestion">
                      KhÃ´ng tÃ¬m tháº¥y game nÃ o phÃ¹ há»£p vá»›i "{searchQuery}"
                    </div>
                  )
                ) : (
                  <div className="default-suggestions">
                    <div className="suggestion-title">Xu HÆ°á»›ng TÃ¬m Kiáº¿m</div>
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
              title="Giá» HÃ ng"
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
              title="Tin nháº¯n"
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
              title="Äá»•i giao diá»‡n"
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
              ÄÆ¡n HÃ ng
            </button>
            {currentUser ? (
              <div className="user-account-display">
                <span className="user-account-name">
                  {currentUser.displayName || currentUser.name || "NgÆ°á»i dÃ¹ng"}
                </span>
                <button
                  type="button"
                  className="logout-icon-button"
                  onClick={handleLogout}
                  title="ÄÄƒng xuáº¥t"
                  aria-label="ÄÄƒng xuáº¥t"
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
                ÄÄƒng nháº­p
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
            ðŸŒ Táº¥t cáº£ danh má»¥c
          </span>
          <span
            className={`sub-nav-item ${selectedCategory === "coins" && currentView === "category-catalog" ? "active" : ""}`}
            onClick={() => navigateToCategory("coins")}
          >
            ðŸª™ Tiá»n tá»‡ (Coins)
          </span>
          <span
            className={`sub-nav-item ${selectedCategory === "accounts" && currentView === "category-catalog" ? "active" : ""}`}
            onClick={() => navigateToCategory("accounts")}
          >
            ðŸ‘¤ TÃ i khoáº£n VIP
          </span>
          <span
            className={`sub-nav-item ${selectedCategory === "cards" && currentView === "category-catalog" ? "active" : ""}`}
            onClick={() => navigateToCategory("cards")}
          >
            ðŸ’³ Tháº» Game / Gift Card
          </span>
          <span
            className={`sub-nav-item ${selectedCategory === "boosting" && currentView === "category-catalog" ? "active" : ""}`}
            onClick={() => navigateToCategory("boosting")}
          >
            âš¡ CÃ y thuÃª (Boosting)
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
                    NÆ¡i game thá»§ <span>giao dá»‹ch tá»± tin</span>
                  </h1>
                  <p className="hero-subtitle">
                    Mua. BÃ¡n. NÃ¢ng cáº¥p. Thá»‹ trÆ°á»ng trÃ² chÆ¡i táº¥t cáº£ trong má»™t vá»›i
                    báº£o vá»‡ tÃ­ch há»£p.
                  </p>

                  <div className="hero-search-wrapper">
                    <div className="hero-search-bar">
                      <input
                        type="text"
                        placeholder="TÃ¬m kiáº¿m trong G2G"
                        className="hero-search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                      />
                      <button
                        className="hero-search-btn-circle"
                        aria-label="TÃ¬m kiáº¿m"
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
                        <span className="badge-icon">ðŸ›¡ï¸</span> GamerProtect
                      </span>
                      <span className="trust-badge-item">
                        <span className="badge-icon">âœ”ï¸</span> HÆ¡n 35 triá»‡u giao
                        dá»‹ch thÃ nh cÃ´ng
                      </span>
                      <span className="trust-badge-item">
                        <span className="badge-icon">ðŸ’¬</span> Há»— trá»£ 24/7
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
                  TuyÃªn bá»‘ tá»« chá»‘i trÃ¡ch nhiá»‡m: ChÃºng tÃ´i lÃ  má»™t thá»‹ trÆ°á»ng Ä‘á»™c
                  láº­p vÃ  khÃ´ng liÃªn káº¿t vÃ /hoáº·c Ä‘Æ°á»£c phÃª duyá»‡t bá»Ÿi báº¥t ká»³ nhÃ 
                  phÃ¡t triá»ƒn hoáº·c studio trÃ² chÆ¡i nÃ o.
                </p>
              </div>
            </section>

            {/* Select categories G2G grid shortcut (NOW ABOVE DEALS SECTION) */}
            <section
              className="categories-section"
              style={{ paddingTop: "32px", paddingBottom: "32px" }}
            >
              <div className="container">
                <h2 className="g2g-category-heading">Chá»n danh má»¥c</h2>

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
                    <span className="category-large-name">Tháº» quÃ  táº·ng</span>
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
                    <span className="category-large-name">TrÃ² chÆ¡i</span>
                  </div>

                  <div
                    className="g2g-category-large-card"
                    onClick={() =>
                      triggerToast("Dá»‹ch vá»¥ Game Coaching sáº½ Ä‘Æ°á»£c ra máº¯t sá»›m!")
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
                        "KhÃ¡m phÃ¡ cÃ¡c Ä‘áº¡i sá»© GamePal á»Ÿ má»¥c bÃªn dÆ°á»›i!",
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
                    <div className="category-horiz-icon">ðŸª™</div>
                    <span className="category-horiz-name">Xu Game</span>
                  </div>

                  <div
                    className="g2g-category-horizontal-card"
                    onClick={() =>
                      triggerToast(
                        "Dá»‹ch vá»¥ náº¡p Váº­t pháº©m Ä‘ang chuáº©n bá»‹ cáº­p nháº­t!",
                      )
                    }
                  >
                    <div className="category-horiz-icon">ðŸ“¦</div>
                    <span className="category-horiz-name">Váº­t pháº©m</span>
                  </div>

                  <div
                    className="g2g-category-horizontal-card"
                    onClick={() => navigateToCategory("accounts")}
                  >
                    <div className="category-horiz-icon">ðŸ‘¤</div>
                    <span className="category-horiz-name">TÃ i khoáº£n Game</span>
                  </div>

                  <div
                    className="g2g-category-horizontal-card"
                    onClick={() => navigateToCategory("boosting")}
                  >
                    <div className="category-horiz-icon">ðŸ”¥</div>
                    <span className="category-horiz-name">CÃ y thuÃª</span>
                  </div>

                  {/* Row 3: Smaller Horizontal Cards */}
                  <div
                    className="g2g-category-horizontal-card"
                    onClick={() =>
                      triggerToast("Thá»‹ trÆ°á»ng trang phá»¥c/Skin Ä‘ang báº£o trÃ¬!")
                    }
                  >
                    <div className="category-horiz-icon">ðŸ›¡ï¸</div>
                    <span className="category-horiz-name">Skin</span>
                  </div>

                  <div
                    className="g2g-category-horizontal-card"
                    onClick={() =>
                      triggerToast(
                        "Dá»‹ch vá»¥ Náº¡p tiá»n Ä‘iá»‡n thoáº¡i Ä‘ang liÃªn káº¿t nhÃ  máº¡ng!",
                      )
                    }
                  >
                    <div className="category-horiz-icon">ðŸ“±</div>
                    <span className="category-horiz-name">
                      Náº¡p tiá»n Ä‘iá»‡n thoáº¡i
                    </span>
                  </div>

                  <div
                    className="g2g-category-horizontal-card"
                    onClick={() =>
                      triggerToast(
                        "Thá»‹ trÆ°á»ng báº£n quyá»n pháº§n má»m Ä‘ang liÃªn káº¿t!",
                      )
                    }
                  >
                    <div className="category-horiz-icon">ðŸ’»</div>
                    <span className="category-horiz-name">
                      Pháº§n má»m &amp; á»¨ng dá»¥ng
                    </span>
                  </div>

                  <div
                    className="g2g-category-horizontal-card"
                    onClick={() =>
                      triggerToast(
                        "CÃ¡c gÃ³i náº¡p tháº» thanh toÃ¡n visa/mastercard Ä‘ang cáº­p nháº­t!",
                      )
                    }
                  >
                    <div className="category-horiz-icon">ðŸ’³</div>
                    <span className="category-horiz-name">Tháº» thanh toÃ¡n</span>
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
                      âš¡ DEAL CHá»šP NHOÃNG (FLASH SALE)
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
                    Thá»i gian cÃ³ háº¡n - Sá»‘ lÆ°á»£ng cÃ³ háº¡n
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
                              {item.originalPrice.toLocaleString("vi-VN")}â‚«
                            </span>
                            <span className="sale-price">
                              {item.salePrice.toLocaleString("vi-VN")}â‚«
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
                                ÄÃ£ bÃ¡n: <strong>{percentSold}%</strong>
                              </span>
                              <span>
                                CÃ²n láº¡i:{" "}
                                <strong style={{ color: "var(--brand-red)" }}>
                                  {item.stockLeft} tháº»
                                </strong>
                              </span>
                            </div>
                          </div>

                          <button
                            className="btn btn-primary btn-sm flash-buy-btn"
                            style={{ width: "100%" }}
                          >
                            Giáº­t Deal Ngay
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* TrÃ² chÆ¡i hay, CÃ´ng ty tuyá»‡t vá»i Title Banner */}
            <div
              className="container"
              style={{ marginTop: "48px", marginBottom: "-24px" }}
            >
              <div className="coaching-gamepal-main-heading">
                TrÃ² chÆ¡i hay, CÃ´ng ty tuyá»‡t vá»i
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
                        Muá»‘n trá»Ÿ nÃªn giá»i hÆ¡n? Äáº·t huáº¥n luyá»‡n viÃªn chuyÃªn gia Ä‘á»ƒ
                        phÃ¢n tÃ­ch lá»‘i chÆ¡i cá»§a báº¡n vÃ  má»Ÿ khÃ³a tiá»m nÄƒng thá»±c sá»±
                        cá»§a báº¡n.
                      </p>
                    </div>
                    <span
                      className="explore-all-link"
                      onClick={() =>
                        triggerToast(
                          "Dá»‹ch vá»¥ Game Coaching sáº½ ra máº¯t danh sÃ¡ch Ä‘áº§y Ä‘á»§ huáº¥n luyá»‡n viÃªn sá»›m!",
                        )
                      }
                    >
                      KhÃ¡m phÃ¡ táº¥t cáº£ <span className="arrow">&gt;</span>
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
                        Chá»‰ muá»‘n cÃ³ thá»i gian vui váº»? Há»£p tÃ¡c vá»›i GamePal Ä‘Ã£
                        Ä‘Æ°á»£c xÃ¡c minh Ä‘á»ƒ cÃ³ tráº£i nghiá»‡m chÆ¡i game tuyá»‡t vá»i,
                        khÃ´ng Ã¡p lá»±c.
                      </p>
                    </div>
                    <span
                      className="explore-all-link"
                      onClick={() =>
                        triggerToast(
                          "Dá»‹ch vá»¥ GamePal sáº½ má»Ÿ rá»™ng danh sÃ¡ch Ä‘áº¡i sá»© sá»›m!",
                        )
                      }
                    >
                      KhÃ¡m phÃ¡ táº¥t cáº£ <span className="arrow">&gt;</span>
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

            {/* Top Trending tabbed Games Grid (Redesigned "Xem Xu hÆ°á»›ng") */}
            <section className="trending-section">
              <div className="container">
                <h2 className="g2g-trending-main-title">Xem Xu hÆ°á»›ng</h2>

                <div className="g2g-trending-tabs-wrapper">
                  <div className="g2g-trending-tabs-container">
                    <span
                      className={`g2g-trending-tab-link ${activeCategory === "cards" ? "active" : ""}`}
                      onClick={() => setActiveCategory("cards")}
                    >
                      Tháº» quÃ  táº·ng
                    </span>
                    <span
                      className={`g2g-trending-tab-link ${activeCategory === "all" ? "active" : ""}`}
                      onClick={() => setActiveCategory("all")}
                    >
                      TrÃ² chÆ¡i
                    </span>
                    <span
                      className="g2g-trending-tab-link"
                      onClick={() =>
                        triggerToast(
                          "HÃ£y cuá»™n lÃªn phÃ­a trÃªn Ä‘á»ƒ xem dá»‹ch vá»¥ Game Coaching!",
                        )
                      }
                    >
                      Game Coaching
                    </span>
                    <span
                      className="g2g-trending-tab-link"
                      onClick={() =>
                        triggerToast(
                          "HÃ£y cuá»™n lÃªn phÃ­a trÃªn Ä‘á»ƒ xem dá»‹ch vá»¥ GamePal!",
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
                          "Thá»‹ trÆ°á»ng Váº­t pháº©m Ä‘ang cáº­p nháº­t xu hÆ°á»›ng!",
                        )
                      }
                    >
                      Váº­t pháº©m
                    </span>
                    <span
                      className={`g2g-trending-tab-link ${activeCategory === "accounts" ? "active" : ""}`}
                      onClick={() => setActiveCategory("accounts")}
                    >
                      TÃ i khoáº£n Game
                    </span>
                    <span
                      className={`g2g-trending-tab-link ${activeCategory === "boosting" ? "active" : ""}`}
                      onClick={() => setActiveCategory("boosting")}
                    >
                      CÃ y thuÃª
                    </span>
                    <span
                      className="g2g-trending-tab-link"
                      onClick={() =>
                        triggerToast(
                          "Thá»‹ trÆ°á»ng Trang phá»¥c/Skin Ä‘ang cáº­p nháº­t xu hÆ°á»›ng!",
                        )
                      }
                    >
                      Skin
                    </span>
                    <span
                      className="g2g-trending-tab-link"
                      onClick={() =>
                        triggerToast(
                          "Giao dá»‹ch náº¡p tiá»n Ä‘iá»‡n thoáº¡i Ä‘ang liÃªn káº¿t Ä‘áº¡i lÃ½!",
                        )
                      }
                    >
                      Náº¡p tiá»n Ä‘iá»‡n thoáº¡i
                    </span>
                    <span
                      className="g2g-trending-tab-link"
                      onClick={() =>
                        triggerToast("Pháº§n má»m báº£n quyá»n Ä‘ang liÃªn káº¿t Ä‘áº¡i lÃ½!")
                      }
                    >
                      Pháº§n má»m &amp; á»¨ng dá»¥ng
                    </span>
                  </div>

                  {/* Arrow Indicator */}
                  <span
                    className="g2g-trending-tab-arrow"
                    onClick={() =>
                      triggerToast(
                        "Cuá»™n ngang hoáº·c kÃ©o Ä‘á»ƒ xem thÃªm danh má»¥c xu hÆ°á»›ng!",
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
                    Xem táº¥t cáº£
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
                        ChÆ°Æ¡ng TrÃ¬nh Äá»‘i TÃ¡c &amp; Affiliate
                      </h3>
                      <p className="promo-description">
                        Chia sáº» liÃªn káº¿t G2G cá»§a báº¡n vÃ  kiáº¿m tá»›i 5% hoa há»“ng
                        trÃªn má»—i giao dá»‹ch thÃ nh cÃ´ng. RÃºt tiá»n nhanh chÃ³ng vÃ 
                        trá»±c quan.
                      </p>
                      <div className="promo-steps">
                        <div className="promo-step">
                          <span className="step-num">1</span>
                          <span>ÄÄƒng kÃ½ tham gia láº¥y link giá»›i thiá»‡u</span>
                        </div>
                        <div className="promo-step">
                          <span className="step-num">2</span>
                          <span>Chia sáº» link trÃªn máº¡ng xÃ£ há»™i, diá»…n Ä‘Ã n</span>
                        </div>
                        <div className="promo-step">
                          <span className="step-num">3</span>
                          <span>Nháº­n tiá»n hoa há»“ng tá»± Ä‘á»™ng vá» vÃ­ G2G</span>
                        </div>
                      </div>
                    </div>
                    <button
                      className="btn btn-primary"
                      style={{ alignSelf: "flex-start" }}
                      onClick={() =>
                        triggerToast(
                          "Há»‡ thá»‘ng Ä‘á»‘i tÃ¡c Ä‘ang chuáº©n bá»‹ ra máº¯t vÃ o thÃ¡ng tá»›i!",
                        )
                      }
                    >
                      Báº¯t Ä‘áº§u kiáº¿m tiá»n
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
                        Báº£o Hiá»ƒm GamerProtect
                      </h3>
                      <p className="promo-description">
                        Giao dá»‹ch Ä‘Æ°á»£c báº£o vá»‡ 100% báº±ng cÆ¡ cháº¿ kÃ½ quá»¹ vÃ  báº£o vá»‡
                        tÃ i khoáº£n cho cáº£ ngÆ°á»i mua vÃ  ngÆ°á»i bÃ¡n.
                      </p>
                      <ul className="protection-list">
                        <li>
                          <span>âœ“</span> Cam káº¿t hoÃ n tiá»n 100% khi xáº£y ra sá»± cá»‘
                          tÃ i khoáº£n.
                        </li>
                        <li>
                          <span>âœ“</span> Giáº£i quyáº¿t tranh cháº¥p cÃ´ng báº±ng 24/7.
                        </li>
                        <li>
                          <span>âœ“</span> Báº£o vá»‡ thÃ´ng tin thanh toÃ¡n tuyá»‡t Ä‘á»‘i
                          qua cá»•ng SSL.
                        </li>
                      </ul>
                    </div>
                    <button
                      className="btn btn-secondary"
                      style={{ alignSelf: "flex-start" }}
                      onClick={() =>
                        triggerToast(
                          "Báº£o hiá»ƒm GamerProtect Ä‘Æ°á»£c Ã¡p dá»¥ng máº·c Ä‘á»‹nh cho má»i giao dá»‹ch!",
                        )
                      }
                    >
                      TÃ¬m hiá»ƒu thÃªm
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
                <span onClick={() => pushRoute("home")}>Trang chá»§</span>
                <span className="separator">&gt;</span>
                <span className="active">Game Coaching</span>
              </div>

              <div className="directory-hero-banner">
                <div className="directory-hero-overlay"></div>
                <div className="directory-hero-content">
                  <h1>Huáº¥n Luyá»‡n ViÃªn ChuyÃªn Nghiá»‡p</h1>
                  <p>
                    Äáº·t huáº¥n luyá»‡n viÃªn Ä‘áº³ng cáº¥p Ä‘á»ƒ phÃ¢n tÃ­ch lá»‘i chÆ¡i, nÃ¢ng táº§m
                    trÃ¬nh Ä‘á»™ vÃ  leo háº¡ng tháº§n tá»‘c!
                  </p>
                </div>
              </div>

              {/* Filters row */}
              <div className="directory-filters-bar">
                <div className="search-box-wrapper">
                  <input
                    type="text"
                    placeholder="TÃ¬m tÃªn huáº¥n luyá»‡n viÃªn..."
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
                    <option value="all">Táº¥t cáº£ game</option>
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
                              : "LMHT ThÃ¡ch Äáº¥u"}
                        </span>
                        <div className="coach-rating-stars">
                          â­ 4.9 (140+ Ä‘Ã¡nh giÃ¡)
                        </div>
                      </div>
                    </div>

                    <div className="coach-desc-body">
                      ChuyÃªn phÃ¢n tÃ­ch lá»‘i chÆ¡i macro, sá»­a tÆ° duy di chuyá»ƒn,
                      hÆ°á»›ng dáº«n quáº£n lÃ½ lÃ­nh vÃ  tá»‘i Æ°u hÃ³a bá»ƒ tÆ°á»›ng leo rank
                      hiá»‡u quáº£.
                    </div>

                    <div className="coach-card-footer justify-between">
                      <div>
                        <span className="coach-price-label">GiÃ¡ má»—i giá»</span>
                        <div className="coach-price-value">
                          {coach.id === "c1" ? "180.000â‚«" : "150.000â‚«"}
                        </div>
                      </div>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() =>
                          openChatWithPartner(coach.name, "Coaching")
                        }
                      >
                        ðŸ’¬ Äáº·t Lá»‹ch &amp; Chat
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
                <span onClick={() => pushRoute("home")}>Trang chá»§</span>
                <span className="separator">&gt;</span>
                <span className="active">GamePal Companion</span>
              </div>

              <div className="directory-hero-banner gamepal-hero-bg">
                <div className="directory-hero-overlay"></div>
                <div className="directory-hero-content">
                  <h1>Äá»“ng HÃ nh CÃ¹ng Báº¡n GamePal</h1>
                  <p>
                    Tráº£i nghiá»‡m chÆ¡i game vui váº», khÃ´ng Ã¡p lá»±c! TÃ¬m báº¡n Ä‘á»“ng
                    hÃ nh nÃ³i chuyá»‡n dá»… thÆ°Æ¡ng, chÆ¡i game giá»i.
                  </p>
                </div>
              </div>

              {/* Filters row */}
              <div className="directory-filters-bar">
                <div className="search-box-wrapper">
                  <input
                    type="text"
                    placeholder="TÃ¬m tÃªn báº¡n Ä‘á»“ng hÃ nh..."
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
                    <option value="all">Táº¥t cáº£ game</option>
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
                            ? "Valorant â€¢ Mic On"
                            : pal.id === "g2" || pal.id === "g6"
                              ? "LMHT â€¢ Vui Váº»"
                              : "Genshin â€¢ Co-op"}
                        </span>
                        <div className="coach-rating-stars">
                          â­ 5.0 (80+ review)
                        </div>
                      </div>
                    </div>

                    <div className="coach-desc-body">
                      CÃ³ mic nÃ³i chuyá»‡n dá»… nghe, ká»¹ nÄƒng cÃ¡ nhÃ¢n khÃ¡ tá»‘t, sáºµn
                      sÃ ng gÃ¡nh táº¡, táº¥u hÃ i giÃºp báº¡n cÃ³ tráº£i nghiá»‡m chÆ¡i game
                      thÆ° giÃ£n nháº¥t!
                    </div>

                    <div className="coach-card-footer justify-between">
                      <div>
                        <span className="coach-price-label">GiÃ¡ má»—i giá»</span>
                        <div className="coach-price-value">80.000â‚«</div>
                      </div>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => openChatWithPartner(pal.name, "GamePal")}
                      >
                        ðŸ’¬ Chat Ngay
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
                <span onClick={() => pushRoute("home")}>Trang chá»§</span>
                <span className="separator">&gt;</span>
                <span className="active">Náº¡p tiá»n Ä‘iá»‡n thoáº¡i</span>
              </div>

              <div className="topup-layout-grid">
                {/* Form Column */}
                <div className="topup-form-container">
                  <h2 className="topup-form-title">Náº¡p Äiá»‡n Thoáº¡i Tá»± Äá»™ng</h2>
                  <p className="topup-form-subtitle">
                    Äiá»n sá»‘ Ä‘iá»‡n thoáº¡i, chá»n nhÃ  máº¡ng vÃ  má»‡nh giÃ¡ Ä‘á»ƒ náº¡p chiáº¿t
                    kháº¥u ráº» nháº¥t thá»‹ trÆ°á»ng.
                  </p>

                  <div className="form-group" style={{ marginTop: "24px" }}>
                    <label className="topup-input-label">
                      Sá»‘ Ä‘iá»‡n thoáº¡i nháº­n tiá»n
                    </label>
                    <input
                      type="tel"
                      placeholder="Nháº­p sá»‘ Ä‘iá»‡n thoáº¡i (vÃ­ dá»¥: 0987654321)"
                      className="topup-tel-input"
                      value={topupPhone}
                      onChange={(e) =>
                        setTopupPhone(e.target.value.replace(/[^0-9]/g, ""))
                      }
                    />
                  </div>

                  {/* Operator selectors */}
                  <div className="form-group">
                    <label className="topup-input-label">Chá»n nhÃ  máº¡ng</label>
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
                      Chá»n má»‡nh giÃ¡ náº¡p
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
                              {val.toLocaleString("vi-VN")}â‚«
                            </div>
                            <div className="denom-selling-price">
                              GiÃ¡ bÃ¡n:{" "}
                              {Math.floor(
                                val *
                                  (topupOperator === "viettel"
                                    ? 0.96
                                    : topupOperator === "mobifone"
                                      ? 0.97
                                      : 0.965),
                              ).toLocaleString("vi-VN")}
                              â‚«
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
                          "Vui lÃ²ng nháº­p Ä‘Ãºng Ä‘á»‹nh dáº¡ng sá»‘ Ä‘iá»‡n thoáº¡i 10 sá»‘!",
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
                        itemName: `Náº¡p tiá»n ${topupOperator.toUpperCase()} - SÄT: ${topupPhone}`,
                        price: finalPrice,
                        qty: 1,
                        color:
                          "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                        textIcon: "ðŸ“±",
                        sellerName: "G2G AutoTopup",
                        gameName: "Náº¡p Äiá»‡n Thoáº¡i",
                      };
                      setCart((prev) => [...prev, topupItem]);
                      setIsCartOpen(true);
                      triggerToast(
                        "ÄÃ£ thÃªm hÃ³a Ä‘Æ¡n náº¡p Ä‘iá»‡n thoáº¡i vÃ o Giá» hÃ ng!",
                      );
                    }}
                  >
                    ðŸš€ Náº¡p Ngay (Thanh toÃ¡n qua giá» hÃ ng)
                  </button>
                </div>

                {/* Guidelines Column */}
                <div className="topup-guide-container">
                  <div className="guide-card-overlay"></div>
                  <div className="guide-card-content">
                    <h3 className="guide-card-title">ðŸ›¡ï¸ Giao Dá»‹ch An ToÃ n</h3>
                    <ul className="guide-steps-list">
                      <li>
                        <strong>Giao hÃ ng tá»± Ä‘á»™ng:</strong> Há»‡ thá»‘ng tá»± Ä‘á»™ng báº¯n
                        tiá»n trá»±c tiáº¿p vÃ o tÃ i khoáº£n thuÃª bao tráº£ trÆ°á»›c/tráº£ sau
                        trong 5 phÃºt.
                      </li>
                      <li>
                        <strong>GamerProtect báº£o vá»‡:</strong> Cam káº¿t hoÃ n tiá»n
                        100% náº¿u xáº£y ra lá»—i há»‡ thá»‘ng hoáº·c khÃ´ng nháº­n Ä‘Æ°á»£c tiá»n
                        náº¡p.
                      </li>
                      <li>
                        <strong>Há»— trá»£ trá»±c tuyáº¿n:</strong> Äá»™i ngÅ© chÄƒm sÃ³c
                        khÃ¡ch hÃ ng há»— trá»£ giáº£i quyáº¿t tháº¯c máº¯c vá» sá»‘ thuÃª bao
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
                <span onClick={() => pushRoute("home")}>Trang chá»§</span>
                <span className="separator">&gt;</span>
                <span>Danh má»¥c sáº£n pháº©m</span>
                <span className="separator">&gt;</span>
                <span className="active">
                  {selectedCategory === "all"
                    ? "Táº¥t cáº£ sáº£n pháº©m"
                    : selectedCategory === "coins"
                      ? "Tiá»n tá»‡ Game (Coins)"
                      : selectedCategory === "accounts"
                        ? "TÃ i khoáº£n VIP"
                        : selectedCategory === "cards"
                          ? "Tháº» game / Gift Card"
                          : "CÃ y thuÃª (Boosting)"}
                </span>
              </div>

              {/* Title Banner */}
              <div className="category-directory-banner">
                <div className="category-header-icon-box">
                  {selectedCategory === "all" && "ðŸŒ"}
                  {selectedCategory === "coins" && "ðŸª™"}
                  {selectedCategory === "accounts" && "ðŸ‘¤"}
                  {selectedCategory === "cards" && "ðŸ’³"}
                  {selectedCategory === "boosting" && "âš¡"}
                </div>
                <h1 className="category-directory-title">
                  {selectedCategory === "all" && "TrÃ² chÆ¡i & ThÆ°Æ¡ng hiá»‡u"}
                  {selectedCategory === "coins" && "Tiá»n tá»‡ game (Coins)"}
                  {selectedCategory === "accounts" && "TÃ i khoáº£n game VIP"}
                  {selectedCategory === "cards" && "Tháº» game & QuÃ  táº·ng"}
                  {selectedCategory === "boosting" && "CÃ y thuÃª (Boosting)"}
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
                    placeholder="TÃ¬m kiáº¿m thÆ°Æ¡ng hiá»‡u..."
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
                    Táº¥t cáº£
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
                    TÃ i khoáº£n VIP
                  </span>
                  <span
                    className={`brand-tab-item ${activeBrandTab === "cards" ? "active" : ""}`}
                    onClick={() => setActiveBrandTab("cards")}
                  >
                    Tháº» game
                  </span>
                  <span
                    className={`brand-tab-item ${activeBrandTab === "boosting" ? "active" : ""}`}
                    onClick={() => setActiveBrandTab("boosting")}
                  >
                    CÃ y thuÃª
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
                      <span className="empty-icon">ðŸ“‚</span>
                      <h4>KhÃ´ng tÃ¬m tháº¥y thÆ°Æ¡ng hiá»‡u nÃ o!</h4>
                      <p>
                        Vui lÃ²ng nháº­p láº¡i tÃªn game hoáº·c thÆ°Æ¡ng hiá»‡u khÃ¡c trong
                        thanh tÃ¬m kiáº¿m bÃªn trÃªn.
                      </p>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setBrandSearchQuery("");
                          setActiveBrandTab("all");
                        }}
                      >
                        Äáº·t láº¡i bá»™ lá»c
                      </button>
                    </div>
                  );
                }

                return (
                  <>
                    {/* Xu hÆ°á»›ng (Trending) Blocks Grid */}
                    <div className="directory-section-container">
                      <h3 className="directory-section-title">Xu HÆ°á»›ng</h3>
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
                                  {totalOffers} Æ°u Ä‘Ã£i
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Táº¥t cáº£ thÆ°Æ¡ng hiá»‡u (All Brands) Grid */}
                    <div
                      className="directory-section-container"
                      style={{ marginTop: "40px" }}
                    >
                      <h3 className="directory-section-title">
                        Táº¥t cáº£ thÆ°Æ¡ng hiá»‡u cho{" "}
                        {selectedCategory === "all"
                          ? "TrÃ² chÆ¡i"
                          : selectedCategory === "coins"
                            ? "Tiá»n tá»‡ Game (Coins)"
                            : selectedCategory === "accounts"
                              ? "TÃ i khoáº£n VIP"
                              : selectedCategory === "cards"
                                ? "Tháº» game / Gift Card"
                                : "CÃ y thuÃª (Boosting)"}
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
                                {totalOffers} Æ°u Ä‘Ã£i
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
                <span onClick={() => pushRoute("home")}>Trang chá»§</span>
                <span className="separator">&gt;</span>
                <span>Thá»‹ trÆ°á»ng game</span>
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
                      "ÄÆ°á»ng liÃªn káº¿t chia sáº» Ä‘Ã£ Ä‘Æ°á»£c sao chÃ©p vÃ o bá»™ nhá»› táº¡m!",
                    )
                  }
                >
                  <span>ðŸ”— Chia sáº»</span>
                </button>
              </div>

              {/* Circular Service Switcher Grid */}
              <div className="catalog-service-switcher-wrapper">
                <div
                  className={`service-switcher-circle ${selectedCategory === "coins" ? "active" : ""}`}
                  onClick={() => setSelectedCategory("coins")}
                >
                  <div className="service-circle-icon">ðŸª™</div>
                  <span className="service-circle-name">Xu Game</span>
                  <span className="service-circle-count">(51,041)</span>
                </div>
                <div
                  className={`service-switcher-circle ${selectedCategory === "boosting" ? "active" : ""}`}
                  onClick={() => setSelectedCategory("boosting")}
                >
                  <div className="service-circle-icon">ðŸ”¥</div>
                  <span className="service-circle-name">CÃ y thuÃª</span>
                  <span className="service-circle-count">(36,528)</span>
                </div>
                <div
                  className={`service-switcher-circle ${selectedCategory === "cards" ? "active" : ""}`}
                  onClick={() => setSelectedCategory("cards")}
                >
                  <div className="service-circle-icon">ðŸ’³</div>
                  <span className="service-circle-name">MÃ£ kÃ­ch hoáº¡t</span>
                  <span className="service-circle-count">(28)</span>
                </div>
                <div
                  className={`service-switcher-circle ${selectedCategory === "coaching" ? "active" : ""}`}
                  onClick={() => setSelectedCategory("coaching")}
                >
                  <div className="service-circle-icon">ðŸŽ®</div>
                  <span className="service-circle-name">Coaching</span>
                  <span className="service-circle-count">(16)</span>
                </div>
                <div
                  className={`service-switcher-circle ${selectedCategory === "gamepal" ? "active" : ""}`}
                  onClick={() => setSelectedCategory("gamepal")}
                >
                  <div className="service-circle-icon">ðŸ‘¥</div>
                  <span className="service-circle-name">GamePal</span>
                  <span className="service-circle-count">(10)</span>
                </div>
                <div
                  className={`service-switcher-circle ${selectedCategory === "items" ? "active" : ""}`}
                  onClick={() => setSelectedCategory("items")}
                >
                  <div className="service-circle-icon">ðŸ“¦</div>
                  <span className="service-circle-name">Váº­t pháº©m</span>
                  <span className="service-circle-count">(16,746)</span>
                </div>
                <div
                  className={`service-switcher-circle ${selectedCategory === "accounts" ? "active" : ""}`}
                  onClick={() => setSelectedCategory("accounts")}
                >
                  <div className="service-circle-icon">ðŸ‘¤</div>
                  <span className="service-circle-name">TÃ i khoáº£n</span>
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
                    placeholder="Nháº­p Ä‘á»ƒ lá»c"
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
                    <option value="all">Khu vá»±c (Táº¥t cáº£)</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="Global">Global</option>
                  </select>
                </div>
              </div>

              {/* Popular orange tags */}
              <div className="popular-tags-row">
                <span className="popular-tags-label">TÃ¬m kiáº¿m phá»• biáº¿n:</span>
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
                        Khoáº£ng {sortedCatalogItems.length} káº¿t quáº£
                      </span>
                      <div className="sort-radio-group">
                        <span className="sort-label">Sáº¯p xáº¿p theo:</span>
                        <label className="sort-radio-label">
                          <input
                            type="radio"
                            name="catalogSort"
                            value="recommended"
                            checked={catalogSortOption === "recommended"}
                            onChange={() => setCatalogSortOption("recommended")}
                          />
                          <span className="radio-custom"></span>
                          <span>ÄÆ°á»£c Ä‘á» xuáº¥t</span>
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
                          <span>GiÃ¡ tháº¥p nháº¥t</span>
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
                                  ? "ðŸ‡»ðŸ‡³"
                                  : item.region === "Global"
                                    ? "ðŸŒ"
                                    : "ðŸ‡ºðŸ‡¸"}
                              </span>
                              <span className="package-region-name">
                                {item.region}
                              </span>
                            </div>
                            <h4 className="package-card-title">{item.name}</h4>
                            <div className="package-card-footer justify-between">
                              <span className="package-offers-badge">
                                {item.offers} Æ°u Ä‘Ã£i
                              </span>
                              <span className="package-price-text">
                                tá»« {item.price.toLocaleString("vi-VN")}â‚«
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-catalog-results">
                        <span className="empty-icon">ðŸ“‚</span>
                        <h4>KhÃ´ng tÃ¬m tháº¥y káº¿t quáº£ phÃ¹ há»£p!</h4>
                        <p>
                          Vui lÃ²ng nháº­p láº¡i tÃªn gÃ³i náº¡p hoáº·c tá»« khÃ³a lá»c khÃ¡c.
                        </p>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setCatalogSearchQuery("");
                            setCatalogRegionFilter("all");
                          }}
                        >
                          Äáº·t láº¡i bá»™ lá»c
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
                <span onClick={() => pushRoute("home")}>Trang chá»§</span>
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
                          Khu vá»±c: <strong>{selectedItem.region}</strong>
                        </span>
                        <span className="bullet">â€¢</span>
                        <span>
                          HÃ¬nh thá»©c: <strong>Tá»± Ä‘á»™ng gá»­i/BÃ n giao ngay</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Switch Denomination Section */}
                  <div className="denom-selector-container">
                    <h4 className="container-title">
                      Chá»n cÃ¡c má»‡nh giÃ¡ / gÃ³i dá»‹ch vá»¥ khÃ¡c
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
                            {item.price.toLocaleString("vi-VN")}â‚«
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
                        MÃ´ táº£ sáº£n pháº©m
                      </span>
                      <span
                        className={`tab-item-link ${activeDetailTab === "reviews" ? "active" : ""}`}
                        onClick={() => setActiveDetailTab("reviews")}
                      >
                        ÄÃ¡nh giÃ¡ ngÆ°á»i mua (5â˜…)
                      </span>
                    </div>

                    <div className="detail-tab-pane">
                      {activeDetailTab === "description" ? (
                        <div className="desc-content">
                          <p>
                            ChÃ o má»«ng báº¡n Ä‘áº¿n vá»›i Ä‘áº¡i lÃ½ phÃ¢n phá»‘i chÃ­nh thá»©c
                            cá»§a chÃºng tÃ´i trÃªn G2G Marketplace. DÆ°á»›i Ä‘Ã¢y lÃ  cÃ¡c
                            thÃ´ng tin quan trá»ng báº¡n cáº§n náº¯m rÃµ:
                          </p>
                          <ul>
                            <li>
                              <strong>BÃ n giao tá»± Ä‘á»™ng:</strong> Sáº£n pháº©m Ä‘Æ°á»£c
                              gá»­i trá»±c tiáº¿p qua há»‡ thá»‘ng tin nháº¯n hoáº·c email
                              liÃªn káº¿t cá»§a báº¡n ngay sau khi hoÃ n táº¥t thanh toÃ¡n.
                            </li>
                            <li>
                              <strong>Báº£o hÃ nh GamerProtect:</strong> Báº£o hiá»ƒm
                              hoÃ n tráº£ 100% sá»‘ tiá»n náº¿u mÃ£ tháº» cÃ³ lá»—i hoáº·c tÃ i
                              khoáº£n cÃ³ váº¥n Ä‘á» tranh cháº¥p do lá»—i tá»« ngÆ°á»i bÃ¡n
                              trong vÃ²ng 7 ngÃ y.
                            </li>
                            <li>
                              <strong>LÆ°u Ã½:</strong> Vui lÃ²ng khÃ´ng tiáº¿t lá»™
                              thÃ´ng tin mÃ£ náº¡p, mÃ£ OTP hoáº·c thÃ´ng tin máº­t kháº©u
                              tÃ i khoáº£n cho báº¥t ká»³ ai khÃ¡c ngoáº¡i trá»« biá»ƒu máº«u
                              giao dá»‹ch chÃ­nh thá»©c.
                            </li>
                          </ul>
                        </div>
                      ) : (
                        <div className="reviews-tab-pane">
                          <div className="reviews-summary-score justify-between">
                            <div>
                              <div className="score-value">4.9 / 5</div>
                              <div className="stars-row">
                                <span className="star-icon">â˜…</span>
                                <span className="star-icon">â˜…</span>
                                <span className="star-icon">â˜…</span>
                                <span className="star-icon">â˜…</span>
                                <span className="star-icon">â˜…</span>
                              </div>
                              <span className="reviews-count-label">
                                Pháº£n há»“i tÃ­ch cá»±c Ä‘áº¡t 99.8% tá»« khÃ¡ch hÃ ng
                              </span>
                            </div>
                            <div className="reviews-recommend">
                              ðŸš€ <strong>KhuyÃªn dÃ¹ng:</strong> 99% khÃ¡ch hÃ ng
                              ráº¥t hÃ i lÃ²ng vá» tá»‘c Ä‘á»™ bÃ n giao cá»§a ngÆ°á»i bÃ¡n nÃ y.
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
                                              â˜…
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
                          <span className="star-icon">â˜…</span>
                          <strong>{selectedSeller.rating}</strong>
                          <span className="reviews-count">
                            ({selectedSeller.reviews.toLocaleString()} reviews)
                          </span>
                        </div>
                        <div className="seller-badges">
                          <span className="badge-level">LV.99</span>
                          <span className="badge-rate">
                            {selectedSeller.successRate} thÃ nh cÃ´ng
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="console-divider"></div>

                    {/* Price & Quantity inputs */}
                    <div className="console-price-row">
                      <span className="console-price-label">ÄÆ¡n giÃ¡:</span>
                      <span className="console-price-value">
                        {Math.floor(
                          selectedItem.price * selectedSeller.multiplier,
                        ).toLocaleString("vi-VN")}
                        â‚«
                      </span>
                    </div>

                    <div className="console-qty-row">
                      <span className="console-qty-label">Sá»‘ lÆ°á»£ng mua:</span>
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
                      <span>Tá»•ng chi phÃ­:</span>
                      <span className="total-value">
                        {(
                          Math.floor(
                            selectedItem.price * selectedSeller.multiplier,
                          ) * detailQuantity
                        ).toLocaleString("vi-VN")}
                        â‚«
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
                        title="ThÃªm vÃ o giá» hÃ ng"
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
                      Chat vá»›i ngÆ°á»i bÃ¡n
                    </button>
                  </div>

                  {/* Trust check list */}
                  <div className="gamerprotect-widget">
                    <div className="gp-widget-header">
                      <span className="gp-shield-icon">ðŸ›¡ï¸</span>
                      <strong>Báº£o vá»‡ giao dá»‹ch GamerProtect</strong>
                    </div>
                    <ul className="gp-widget-list">
                      <li>
                        Há»‡ thá»‘ng kÃ½ quá»¹ giá»¯ tiá»n an toÃ n cho Ä‘áº¿n khi xÃ¡c nháº­n Ä‘Ã£
                        nháº­n sáº£n pháº©m sáº¡ch.
                      </li>
                      <li>
                        Trá»ng tÃ i há»— trá»£ giáº£i quyáº¿t tranh cháº¥p 24/7 trá»±c quan.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bottom compare other sellers table */}
              <div className="sellers-compare-box">
                <h3 className="section-title">
                  So sÃ¡nh giÃ¡ vÃ  Æ°u Ä‘Ã£i tá»« cÃ¡c ngÆ°á»i bÃ¡n khÃ¡c
                </h3>
                <div className="compare-table-wrapper">
                  <table className="compare-table">
                    <thead>
                      <tr>
                        <th>NgÆ°á»i bÃ¡n</th>
                        <th>Tá»· lá»‡ thÃ nh cÃ´ng</th>
                        <th>Tá»‘c Ä‘á»™ giao hÃ ng</th>
                        <th>Kho hÃ ng</th>
                        <th>ÄÆ¡n giÃ¡</th>
                        <th style={{ textAlign: "right" }}>HÃ nh Ä‘á»™ng</th>
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
                                  <span className="star-icon">â˜…</span>
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
                            <span>{seller.stock} sáº£n pháº©m</span>
                          </td>
                          <td>
                            <span className="compare-price-val">
                              {Math.floor(
                                selectedItem.price * seller.multiplier,
                              ).toLocaleString("vi-VN")}
                              â‚«
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
                                + Giá»
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
              <h2 className="section-title">Thanh ToÃ¡n Giao Dá»‹ch G2G</h2>

              <div className="checkout-grid">
                {/* Left Column: Payments Selector & details */}
                <div className="checkout-left-col">
                  <div className="checkout-card">
                    <h3 className="card-title">
                      1. Chá»n phÆ°Æ¡ng thá»©c thanh toÃ¡n
                    </h3>

                    <div className="payment-tabs-layout">
                      <div className="payment-tabs-sidebar">
                        <div
                          className={`payment-tab-button ${activePaymentTab === "momo" ? "active" : ""}`}
                          onClick={() => setActivePaymentTab("momo")}
                        >
                          <span className="payment-icon">ðŸ“±</span>
                          <span>VÃ­ Ä‘iá»‡n tá»­ MoMo</span>
                        </div>
                        <div
                          className={`payment-tab-button ${activePaymentTab === "zalopay" ? "active" : ""}`}
                          onClick={() => setActivePaymentTab("zalopay")}
                        >
                          <span className="payment-icon">ðŸ’¸</span>
                          <span>VÃ­ Ä‘iá»‡n tá»­ ZaloPay</span>
                        </div>
                        <div
                          className={`payment-tab-button ${activePaymentTab === "banking" ? "active" : ""}`}
                          onClick={() => setActivePaymentTab("banking")}
                        >
                          <span className="payment-icon">ðŸ¦</span>
                          <span>Chuyá»ƒn khoáº£n NH Auto</span>
                        </div>
                        <div
                          className={`payment-tab-button ${activePaymentTab === "card" ? "active" : ""}`}
                          onClick={() => setActivePaymentTab("card")}
                        >
                          <span className="payment-icon">ðŸ’³</span>
                          <span>Tháº» Visa / Mastercard</span>
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
                                Tá»•ng tiá»n:{" "}
                                {(getCartTotal() + 15000).toLocaleString(
                                  "vi-VN",
                                )}
                                â‚«
                              </div>
                            </div>
                            <div className="qr-instructions">
                              <h5>QuÃ©t MÃ£ QR MoMo</h5>
                              <ol>
                                <li>
                                  Má»Ÿ á»©ng dá»¥ng MoMo trÃªn Ä‘iá»‡n thoáº¡i di Ä‘á»™ng cá»§a
                                  báº¡n.
                                </li>
                                <li>
                                  Chá»n tÃ­nh nÄƒng <strong>QuÃ©t mÃ£</strong> vÃ 
                                  quÃ©t mÃ£ QR á»Ÿ bÃªn cáº¡nh.
                                </li>
                                <li>
                                  Nháº­p Ä‘Ãºng mÃ£ ná»™i dung thanh toÃ¡n:{" "}
                                  <strong>
                                    {paymentCodes.momo}
                                  </strong>
                                </li>
                                <li>
                                  Nháº¥n nÃºt{" "}
                                  <strong>XÃ¡c nháº­n Ä‘Ã£ chuyá»ƒn tiá»n</strong> bÃªn
                                  dÆ°á»›i sau khi hoÃ n thÃ nh.
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
                                Tá»•ng tiá»n:{" "}
                                {(getCartTotal() + 12000).toLocaleString(
                                  "vi-VN",
                                )}
                                â‚«
                              </div>
                            </div>
                            <div className="qr-instructions">
                              <h5>QuÃ©t MÃ£ QR ZaloPay</h5>
                              <ol>
                                <li>
                                  Má»Ÿ á»©ng dá»¥ng ZaloPay hoáº·c Zalo trÃªn Ä‘iá»‡n thoáº¡i.
                                </li>
                                <li>QuÃ©t mÃ£ QR Ä‘á»ƒ chuyá»ƒn khoáº£n nhanh.</li>
                                <li>
                                  Ná»™i dung chuyá»ƒn khoáº£n máº·c Ä‘á»‹nh:{" "}
                                  <strong>
                                    {paymentCodes.zalopay}
                                  </strong>
                                </li>
                              </ol>
                            </div>
                          </div>
                        )}

                        {activePaymentTab === "banking" && (
                          <div className="banking-instructions">
                            <h5>ThÃ´ng tin tÃ i khoáº£n ngÃ¢n hÃ ng nháº­n</h5>
                            <div className="banking-details-grid">
                              <div className="banking-field">
                                <span className="label">NgÃ¢n hÃ ng:</span>
                                <span className="value">
                                  MB Bank (NgÃ¢n hÃ ng QuÃ¢n Äá»™i)
                                </span>
                              </div>
                              <div className="banking-field">
                                <span className="label">Sá»‘ tÃ i khoáº£n:</span>
                                <span className="value copy-value">
                                  999920268888{" "}
                                  <span
                                    className="copy-icon"
                                    onClick={() =>
                                      triggerToast("ÄÃ£ copy sá»‘ tÃ i khoáº£n!")
                                    }
                                  >
                                    ðŸ“‹
                                  </span>
                                </span>
                              </div>
                              <div className="banking-field">
                                <span className="label">Chá»§ tÃ i khoáº£n:</span>
                                <span className="value">
                                  CONG TY CONG NGHE G2G CLONE
                                </span>
                              </div>
                              <div className="banking-field">
                                <span className="label">Sá»‘ tiá»n:</span>
                                <span className="value">
                                  {(getCartTotal() + 10000).toLocaleString(
                                    "vi-VN",
                                  )}
                                  â‚«
                                </span>
                              </div>
                              <div
                                className="banking-field"
                                style={{ gridColumn: "span 2" }}
                              >
                                <span className="label">
                                  Ná»™i dung chuyá»ƒn tiá»n:
                                </span>
                                <span
                                  className="value copy-value"
                                  style={{
                                    color: "var(--brand-red)",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {paymentCodes.banking}
                                  <span
                                    className="copy-icon"
                                    onClick={() =>
                                      triggerToast("ÄÃ£ copy ná»™i dung!")
                                    }
                                  >
                                    ðŸ“‹
                                  </span>
                                </span>
                              </div>
                            </div>
                            <div className="note-alert">
                              âš ï¸ Há»‡ thá»‘ng tá»± Ä‘á»™ng cá»™ng tiá»n trong vÃ²ng 10 giÃ¢y
                              sau khi nháº­n Ä‘Æ°á»£c chuyá»ƒn khoáº£n ngÃ¢n hÃ ng chÃ­nh xÃ¡c
                              ná»™i dung.
                            </div>
                          </div>
                        )}

                        {activePaymentTab === "card" && (
                          <div className="card-form-container">
                            <h5>Nháº­p thÃ´ng tin tháº» quá»‘c táº¿</h5>
                            <div className="card-form-grid">
                              <div
                                className="form-group"
                                style={{ gridColumn: "span 2" }}
                              >
                                <label>Sá»‘ tháº» tÃ­n dá»¥ng / Ghi ná»£</label>
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
                                <label>NgÃ y háº¿t háº¡n</label>
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
                                <label>MÃ£ CVV / CVC</label>
                                <input
                                  type="password"
                                  className="form-control"
                                  placeholder="â€¢â€¢â€¢"
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
                    <h3 className="card-title">2. TÃ³m táº¯t Ä‘Æ¡n hÃ ng</h3>

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
                                NgÆ°á»i bÃ¡n: {item.sellerName}
                              </div>
                              <div className="checkout-item-qty">
                                Sá»‘ lÆ°á»£ng: {item.qty}
                              </div>
                            </div>
                          </div>
                          <span className="checkout-item-price">
                            {(item.price * item.qty).toLocaleString("vi-VN")}â‚«
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="checkout-totals">
                      <div className="total-row-sub">
                        <span>GiÃ¡ trá»‹ sáº£n pháº©m:</span>
                        <span>{getCartTotal().toLocaleString("vi-VN")}â‚«</span>
                      </div>
                      <div className="total-row-sub">
                        <span>PhÃ­ cá»•ng thanh toÃ¡n / Báº£o hiá»ƒm:</span>
                        <span>
                          {activePaymentTab === "momo"
                            ? "15.000â‚«"
                            : activePaymentTab === "zalopay"
                              ? "12.000â‚«"
                              : activePaymentTab === "banking"
                                ? "10.000â‚«"
                                : "25.000â‚«"}
                        </span>
                      </div>
                      <div className="checkout-divider"></div>
                      <div className="total-row-main">
                        <span>Tá»•ng cá»™ng:</span>
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
                          â‚«
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
                          TÃ´i xÃ¡c nháº­n cÃ¡c thÃ´ng tin mua sáº£n pháº©m trÃªn lÃ  chÃ­nh
                          xÃ¡c vÃ  Ä‘á»“ng Ã½ vá»›i Ä‘iá»u khoáº£n thanh toÃ¡n.
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
                          ? "Äang giao dá»‹ch..."
                          : "XÃ¡c nháº­n Ä‘Ã£ thanh toÃ¡n"}
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
                Quáº£n LÃ½ Giao Dá»‹ch &amp; ÄÆ¡n HÃ ng
              </h2>

              <div className="dashboard-layout">
                {/* Tabs selection */}
                <div className="dashboard-tabs">
                  <span className="tab-item active">
                    Lá»‹ch sá»­ Ä‘Æ¡n mua ({orders.length})
                  </span>
                  <span
                    className="tab-item"
                    onClick={() =>
                      triggerToast(
                        "Lá»‹ch sá»­ Ä‘Æ¡n bÃ¡n chá»‰ dÃ nh cho tÃ i khoáº£n Ä‘Ã£ xÃ©t duyá»‡t lÃ  NgÆ°á»i bÃ¡n.",
                      )
                    }
                  >
                    Lá»‹ch sá»­ Ä‘Æ¡n bÃ¡n
                  </span>
                  <span
                    className="tab-item"
                    onClick={() =>
                      triggerToast("Há»“ sÆ¡ cÃ¡ nhÃ¢n vÃ  CÃ i Ä‘áº·t báº£o máº­t.")
                    }
                  >
                    CÃ i Ä‘áº·t tÃ i khoáº£n
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
                              MÃ£ Ä‘Æ¡n: <strong>#{order.id}</strong>
                            </span>
                            <span className="order-date">
                              NgÃ y mua: {order.date}
                            </span>
                          </div>

                          <span
                            className={`order-status-badge ${order.status}`}
                          >
                            {order.status === "pending" && "â³ Chá» giao hÃ ng"}
                            {order.status === "delivering" &&
                              "ðŸ“¦ Äang giao hÃ ng"}
                            {order.status === "completed" && "âœ“ ÄÃ£ hoÃ n thÃ nh"}
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
                                NgÆ°á»i bÃ¡n: <strong>{order.sellerName}</strong>
                              </div>
                              <div className="order-item-qty">
                                Sá»‘ lÆ°á»£ng: {order.qty} | Cá»•ng thanh toÃ¡n:{" "}
                                {order.paymentMethod}
                              </div>
                            </div>
                          </div>

                          <div className="order-log-price">
                            <div className="price-label">Tá»•ng thanh toÃ¡n</div>
                            <div className="price-val">
                              {(order.price * order.qty).toLocaleString(
                                "vi-VN",
                              )}
                              â‚«
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
                            ðŸ’¬ TrÃ² chuyá»‡n vá»›i ngÆ°á»i bÃ¡n
                          </button>
                          {order.status === "completed" ? (
                            <button
                              className="btn btn-outline btn-sm"
                              style={{
                                borderColor: "var(--success)",
                                color: "var(--success)",
                              }}
                              onClick={() =>
                                triggerToast("Cáº£m Æ¡n báº¡n Ä‘Ã£ pháº£n há»“i tá»‘t!")
                              }
                            >
                              ÄÃ¡nh giÃ¡ 5â˜…
                            </button>
                          ) : (
                            <button
                              className="btn btn-primary btn-sm"
                              style={{ background: "#0284c7" }}
                              onClick={() =>
                                triggerToast(
                                  `ÄÆ¡n hÃ ng #${order.id} Ä‘ang Ä‘Æ°á»£c há»‘i thÃºc giao nhanh!`,
                                )
                              }
                            >
                              Há»‘i thÃºc giao hÃ ng
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-orders-view">
                      <p>Báº¡n chÆ°a thá»±c hiá»‡n giao dá»‹ch nÃ o.</p>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => pushRoute("home")}
                      >
                        KhÃ¡m phÃ¡ chá»£ game ngay
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
                G2G Clone lÃ  ná»n táº£ng mÃ´ phá»ng chá»£ giao dá»‹ch trÃ² chÆ¡i Ä‘iá»‡n tá»­
                trá»±c tuyáº¿n an toÃ n hÃ ng Ä‘áº§u. GiÃºp cÃ¡c game thá»§ káº¿t ná»‘i mua bÃ¡n
                tiá»n tá»‡, tÃ i khoáº£n game, tháº» game náº¡p tá»± Ä‘á»™ng nhanh chÃ³ng nháº¥t.
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
                      triggerToast("Trang giá»›i thiá»‡u G2G");
                    }}
                  >
                    Vá» chÃºng tÃ´i
                  </a>
                </li>
                <li>
                  <a
                    href="#careers"
                    onClick={(e) => {
                      e.preventDefault();
                      triggerToast("CÆ¡ há»™i viá»‡c lÃ m táº¡i G2G");
                    }}
                  >
                    Tuyá»ƒn dá»¥ng
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
              <h5>Há»— Trá»£</h5>
              <ul>
                <li>
                  <a
                    href="#help"
                    onClick={(e) => {
                      e.preventDefault();
                      triggerToast("Trung tÃ¢m trá»£ giÃºp");
                    }}
                  >
                    Trung tÃ¢m há»— trá»£
                  </a>
                </li>
                <li>
                  <a
                    href="#protect"
                    onClick={(e) => {
                      e.preventDefault();
                      triggerToast("Chi tiáº¿t báº£o hiá»ƒm GamerProtect");
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
                      triggerToast("ChÃ­nh sÃ¡ch hoÃ n tiá»n");
                    }}
                  >
                    ChÃ­nh sÃ¡ch hoÃ n tiá»n
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h5>NgÆ°á»i BÃ¡n</h5>
              <ul>
                <li>
                  <a
                    href="#rules"
                    onClick={(e) => {
                      e.preventDefault();
                      triggerToast("Quy Ä‘á»‹nh bÃ¡n hÃ ng");
                    }}
                  >
                    Quy táº¯c ngÆ°á»i bÃ¡n
                  </a>
                </li>
                <li>
                  <a
                    href="#fees"
                    onClick={(e) => {
                      e.preventDefault();
                      triggerToast("Báº£ng phÃ­ giao dá»‹ch chi tiáº¿t");
                    }}
                  >
                    Biá»ƒu phÃ­ giao dá»‹ch
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
              <h5>PhÃ¡p LÃ½</h5>
              <ul>
                <li>
                  <a
                    href="#terms"
                    onClick={(e) => {
                      e.preventDefault();
                      triggerToast("Äiá»u khoáº£n dá»‹ch vá»¥");
                    }}
                  >
                    Äiá»u khoáº£n dá»‹ch vá»¥
                  </a>
                </li>
                <li>
                  <a
                    href="#privacy"
                    onClick={(e) => {
                      e.preventDefault();
                      triggerToast("ChÃ­nh sÃ¡ch báº£o máº­t");
                    }}
                  >
                    ChÃ­nh sÃ¡ch báº£o máº­t
                  </a>
                </li>
                <li>
                  <a
                    href="#cookies"
                    onClick={(e) => {
                      e.preventDefault();
                      triggerToast("Quy táº¯c cookie");
                    }}
                  >
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-payments-wrapper">
            <h6 className="payments-title">Äá»‘i tÃ¡c thanh toÃ¡n Ä‘Æ°á»£c há»— trá»£</h6>
            <div className="payments-grid">
              <span className="payment-card-logo">PayPal</span>
              <span className="payment-card-logo">VISA</span>
              <span className="payment-card-logo">Mastercard</span>
              <span className="payment-card-logo">Google Pay</span>
              <span className="payment-card-logo">Apple Pay</span>
              <span className="payment-card-logo">MoMo Pay</span>
              <span className="payment-card-logo">ZaloPay</span>
              <span className="payment-card-logo">Chuyá»ƒn khoáº£n NH</span>
            </div>
          </div>

          <div className="footer-bottom">
            <div>
              Â© 2026 G2G CLONE. Developed for educational replication. All
              rights reserved.
            </div>
            <div style={{ display: "flex", gap: "20px" }}>
              <span>Tiáº¿ng Viá»‡t / VND</span>
              <span>Báº£o máº­t SSL MÃ£ hÃ³a 256-bit</span>
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
              Giá» hÃ ng cá»§a báº¡n ({cart.reduce((sum, i) => sum + i.qty, 0)})
            </h4>
            <span
              className="close-cart-btn"
              onClick={() => setIsCartOpen(false)}
            >
              Ã—
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
                          NgÆ°á»i bÃ¡n: {item.sellerName}
                        </div>
                      </div>
                      <span
                        className="cart-item-vertical-remove"
                        onClick={() => removeCartItem(item.cartId)}
                      >
                        ðŸ—‘ï¸
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
                        {(item.price * item.qty).toLocaleString("vi-VN")}â‚«
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-cart-drawer">
                <span className="empty-cart-icon">ðŸ›’</span>
                <p>Giá» hÃ ng trá»‘ng.</p>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setIsCartOpen(false);
                    pushRoute("home");
                  }}
                >
                  Tiáº¿p tá»¥c mua hÃ ng
                </button>
              </div>
            )}
          </div>

          {cart.length > 0 && (
            <div className="cart-drawer-footer">
              <div className="cart-drawer-subtotal">
                <span>Tá»•ng chi phÃ­ sáº£n pháº©m:</span>
                <span className="price">
                  {getCartTotal().toLocaleString("vi-VN")}â‚«
                </span>
              </div>
              <button
                className="btn btn-primary checkout-btn"
                onClick={() => {
                  setIsCartOpen(false);
                  pushRoute("checkout");
                }}
              >
                Tiáº¿n hÃ nh thanh toÃ¡n
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
            <h3>GamerProtect Ä‘ang xá»­ lÃ½...</h3>
            <p>
              Vui lÃ²ng khÃ´ng táº¯t trÃ¬nh duyá»‡t hoáº·c táº£i láº¡i trang trong khi há»‡
              thá»‘ng xÃ¡c thá»±c dÃ²ng tiá»n thanh toÃ¡n an toÃ n.
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
            <h3>Thanh toÃ¡n giao dá»‹ch thÃ nh cÃ´ng!</h3>
            <p>
              MÃ£ hÃ³a SSL 256-bit báº£o máº­t. ÄÆ¡n hÃ ng cá»§a báº¡n Ä‘Ã£ Ä‘Æ°á»£c gá»­i cho ngÆ°á»i
              bÃ¡n tiáº¿n hÃ nh giao hÃ ng ngay.
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
                    : "ChÄƒm SÃ³c KhÃ¡ch HÃ ng"}
                </span>
                <div className="chat-partner-sub">
                  Há»— trá»£:{" "}
                  {activeChatId
                    ? chats.find((c) => c.id === activeChatId)?.game
                    : "Chá»£ G2G"}
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
                      placeholder="Nháº­p tin nháº¯n chat táº¡i Ä‘Ã¢y..."
                      className="chat-input-field"
                      value={chatInputText}
                      onChange={(e) => setChatInputText(e.target.value)}
                    />
                    <button type="submit" className="chat-send-btn">
                      Gá»­i
                    </button>
                  </form>
                </>
              ) : (
                <div className="chat-no-active">
                  Chá»n má»™t cuá»™c trÃ² chuyá»‡n Ä‘á»ƒ báº¯t Ä‘áº§u trao Ä‘á»•i chi tiáº¿t sáº£n
                  pháº©m.
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
            <span className="register-seller-kicker">Khu vá»±c ngÆ°á»i bÃ¡n</span>
            <h1
              style={{
                margin: "10px 0 12px",
                fontFamily: "var(--font-heading)",
              }}
            >
              Chá»‰ seller má»›i Ä‘Æ°á»£c Ä‘Äƒng sáº£n pháº©m
            </h1>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
              {currentUser
                ? "TÃ i khoáº£n hiá»‡n táº¡i chÆ°a cÃ³ role seller. HÃ£y Ä‘Äƒng kÃ½ seller trÆ°á»›c khi Ä‘Äƒng sáº£n pháº©m."
                : "Báº¡n cáº§n Ä‘Äƒng nháº­p trÆ°á»›c khi vÃ o trang Ä‘Äƒng sáº£n pháº©m."}
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
                  ÄÄƒng kÃ½ seller
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowLogin(true)}
                >
                  ÄÄƒng nháº­p
                </button>
              )}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => pushRoute("home")}
              >
                Vá» trang chá»§
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
              Ã—
            </span>
            <h3
              style={{
                marginBottom: "16px",
                fontSize: "20px",
                fontWeight: 800,
              }}
            >
              ÄÄƒng KÃ½ NgÆ°á»i BÃ¡n Game
            </h3>
            <p
              style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                marginBottom: "20px",
                lineHeight: 1.5,
              }}
            >
              Kiáº¿m thÃªm thu nháº­p tá»« viá»‡c bÃ¡n xu game, tÃ i khoáº£n dÆ° hoáº·c cÃ y thuÃª
              game. QuÃ¡ trÃ¬nh xÃ©t duyá»‡t miá»…n phÃ­ vÃ  nhanh chÃ³ng!
            </p>
            <form onSubmit={handleSellerSubmit}>
              <div className="form-group">
                <label>TrÃ² chÆ¡i muá»‘n giao dá»‹ch chÃ­nh</label>
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
                <label>MÃ´ táº£ ngáº¯n kinh nghiá»‡m &amp; sáº£n pháº©m bÃ¡n</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="VÃ­ dá»¥: TÃ´i cÃ³ nguá»“n Robux sáº¡ch dá»“i dÃ o, hoáº·c cÃ³ Ä‘á»™i cÃ y thuÃª LiÃªn QuÃ¢n uy tÃ­n..."
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
                  TÃ´i cam káº¿t cung cáº¥p sáº£n pháº©m sáº¡ch vÃ  tuÃ¢n thá»§ quy Ä‘á»‹nh giao
                  dá»‹ch cá»§a G2G.
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: "100%", padding: "12px" }}
              >
                Gá»­i Há»“ SÆ¡ XÃ©t Duyá»‡t
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
