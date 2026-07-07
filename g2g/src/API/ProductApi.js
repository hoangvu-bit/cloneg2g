export async function getProductById(id) {
    if (typeof id === 'string' && (id.startsWith('custom-item-') || id.includes('custom-item-'))) {
        try {
            const savedListings = JSON.parse(localStorage.getItem('g2g_seller_listings') || '[]');
            const cleanId = id.includes('-') ? id.substring(id.indexOf('custom-item-')) : id;
            const sl = savedListings.find(l => l.id === cleanId);
            if (sl) {
                return {
                    id: sl.id,
                    name: sl.name,
                    price: sl.price,
                    badge: sl.badge || 'Người Bán Mới',
                    region: sl.region || 'Global',
                    offers: 1,
                    stock: sl.stock || 10,
                    description: sl.description || '',
                    image: '',
                    gameId: sl.gameId,
                    gameName: sl.gameName || 'Game',
                    category: sl.category
                };
            }
        } catch (e) {
            console.error("getProductById fallback error:", e);
        }
    }

    let dummyId = id;
    if (typeof id === 'string' && id.includes('-')) {
        const parts = id.split('-');
        const lastPart = parts[parts.length - 1];
        if (!isNaN(lastPart)) {
            dummyId = lastPart;
        }
    }

    const res = await fetch(`https://dummyjson.com/products/${dummyId}`);

    if (!res.ok) {
        throw new Error("Không lấy được sản phẩm");
    }

    const p = await res.json();

    // Determine game context
    let gameId = 'roblox';
    let gameName = 'Roblox Robux (Global)';
    let primaryCategory = 'coins';
    let textIcon = 'R$';

    if (p.category === 'beauty') {
        gameId = 'roblox';
        gameName = 'Roblox Robux (Global)';
        primaryCategory = 'coins';
        textIcon = 'R$';
    } else if (p.category === 'fragrances') {
        gameId = 'garena-shells';
        gameName = 'Garena Shells (Sò Garena)';
        primaryCategory = 'cards';
        textIcon = 'Gar';
    } else if (p.category === 'furniture') {
        gameId = 'zing-card';
        gameName = 'Zing Card VNG';
        primaryCategory = 'cards';
        textIcon = 'Zing';
    } else if (p.category === 'groceries') {
        gameId = 'valorant-points';
        gameName = 'Valorant Points (VP)';
        primaryCategory = 'coins';
        textIcon = 'VP';
    } else if (p.category === 'home-decoration') {
        gameId = 'steam-wallet';
        gameName = 'Steam Wallet Code (Global)';
        primaryCategory = 'cards';
        textIcon = 'Steam';
    } else if (p.category === 'laptops') {
        gameId = 'lien-quan-mobile';
        gameName = 'Liên Quân Mobile - Tài Khoản VIP';
        primaryCategory = 'accounts';
        textIcon = 'LQ';
    } else if (p.category === 'smartphones') {
        gameId = 'lol-boosting';
        gameName = 'League of Legends - Cày Thuê';
        primaryCategory = 'boosting';
        textIcon = 'LoL';
    }

    // Determine category based on product ID to match the cycling in fetchAndMapProducts
    const categoriesCycle = ['coins', 'boosting', 'cards', 'coaching', 'gamepal', 'items', 'accounts'];
    const itemCategory = categoriesCycle[p.id % categoriesCycle.length];

    let customName = p.title;
    if (itemCategory === 'coins') {
      customName = `${Math.floor(p.price * 10)} ${textIcon} Package`;
    } else if (itemCategory === 'boosting') {
      customName = `Cày Thuê Rank Cao Cấp - Game ${gameName}`;
    } else if (itemCategory === 'cards') {
      customName = `Thẻ Nạp / Key Code Game ${gameName}`;
    } else if (itemCategory === 'coaching') {
      customName = `Dịch Vụ Coaching Pro 1-on-1 - Game ${gameName}`;
    } else if (itemCategory === 'gamepal') {
      customName = `Bạn chơi cùng (GamePal) - Game ${gameName}`;
    } else if (itemCategory === 'items') {
      customName = `Vật phẩm Game VIP (${p.title})`;
    } else if (itemCategory === 'accounts') {
      customName = `Tài Khoản ${gameName} VIP - Rank ${p.rating > 4.5 ? 'Thách Đấu' : 'Cao Thủ'}`;
    }

    return {
      id: `${gameId}-${p.id}`,
      name: customName,
      price: Math.floor(p.price * 15000),
      badge: p.discountPercentage > 10 ? `Giảm ${Math.floor(p.discountPercentage)}%` : 'Giao nhanh',
      region: p.id % 2 === 0 ? 'Vietnam' : 'Global',
      offers: Math.floor(p.stock / 2) || 5,
      stock: p.stock || 10,
      description: p.description,
      image: p.thumbnail,
      gameId: gameId,
      gameName: gameName,
      category: itemCategory
    };
}

export async function fetchAndMapProducts() {
    try {
        const res = await fetch('https://dummyjson.com/products?limit=100');
        if (!res.ok) throw new Error("Lấy dữ liệu API thất bại");
        const data = await res.json();
        
        const apiProducts = data.products || [];
        
        // Define G2G gaming categories to map API categories into
        const games = [
          {
            id: 'roblox',
            name: 'Roblox Robux (Global)',
            category: 'coins',
            badge: 'Fast Delivery',
            textIcon: 'R$',
            color: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
            description: 'Nạp Robux giá rẻ, tự động, hỗ trợ tài khoản Global bảo mật 100% với bảo hiểm GamerProtect.',
            apiCategory: 'beauty'
          },
          {
            id: 'garena-shells',
            name: 'Garena Shells (Sò Garena)',
            category: 'cards',
            badge: 'Auto Delivery',
            textIcon: 'Gar',
            color: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
            description: 'Sò Garena Việt Nam dùng để nạp các game Liên Quân Mobile, Free Fire, FC Online giá rẻ nhất.',
            apiCategory: 'fragrances'
          },
          {
            id: 'zing-card',
            name: 'Zing Card VNG',
            category: 'cards',
            badge: '-5% Discount',
            textIcon: 'Zing',
            color: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
            description: 'Thẻ Zing nạp game VNG: Võ Lâm Truyền Kỳ, Kiếm Thế, PUBG Mobile, Boom M giá rẻ chiết khấu cao.',
            apiCategory: 'furniture'
          },
          {
            id: 'valorant-points',
            name: 'Valorant Points (VP)',
            category: 'coins',
            badge: 'Instant Delivery',
            textIcon: 'VP',
            color: 'linear-gradient(135deg, #7f1d1d 0%, #111827 100%)',
            description: 'Nạp VP mua skin súng Valorant giá rẻ. Nhận mã code hoặc nạp trực tiếp qua tài khoản RIOT.',
            apiCategory: 'groceries'
          },
          {
            id: 'steam-wallet',
            name: 'Steam Wallet Code (Global)',
            category: 'cards',
            badge: 'Auto Send',
            textIcon: 'Steam',
            color: 'linear-gradient(135deg, #475569 0%, #1e293b 100%)',
            description: 'Mã code nạp Steam Wallet mua game, vật phẩm Market bảo mật tốt nhất.',
            apiCategory: 'home-decoration'
          },
          {
            id: 'lien-quan-mobile',
            name: 'Liên Quân Mobile - Tài Khoản VIP',
            category: 'accounts',
            badge: 'Acc Trắng TT',
            textIcon: 'LQ',
            color: 'linear-gradient(135deg, #1e1b4b 0%, #311042 100%)',
            description: 'Tài khoản Liên Quân Mobile giá tốt, rank cao thủ, nhiều skin đẹp, đầy đủ ngọc.',
            apiCategory: 'laptops'
          },
          {
            id: 'lol-boosting',
            name: 'League of Legends - Cày Thuê',
            category: 'boosting',
            badge: 'Professional',
            textIcon: 'LoL',
            color: 'linear-gradient(135deg, #1e3a8a 0%, #172554 100%)',
            description: 'Cày thuê Liên Minh Huyền Thoại Việt Nam, uy tín, bảo mật IP, hỗ trợ từ Đồng đoàn đến Thách đấu.',
            apiCategory: 'smartphones'
          }
        ];

        // Hydrate each game items dynamically from DummyJSON categories
        games.forEach(game => {
          let matching = apiProducts.filter(p => p.category === game.apiCategory);
          
          // Fallback if matching category doesn't return elements
          if (matching.length === 0) {
            matching = apiProducts.slice(0, 7);
          }

          game.items = matching.map((p, idx) => {
            // Cycle subcategories: coins, boosting, cards, coaching, gamepal, items, accounts
            const categoriesCycle = ['coins', 'boosting', 'cards', 'coaching', 'gamepal', 'items', 'accounts'];
            const itemCategory = categoriesCycle[idx % categoriesCycle.length];

            let customName = p.title;
            if (itemCategory === 'coins') {
              customName = `${Math.floor(p.price * 10)} ${game.textIcon} Package`;
            } else if (itemCategory === 'boosting') {
              customName = `Cày Thuê Rank Cao Cấp - Game ${game.name}`;
            } else if (itemCategory === 'cards') {
              customName = `Thẻ Nạp / Key Code Game ${game.name}`;
            } else if (itemCategory === 'coaching') {
              customName = `Dịch Vụ Coaching Pro 1-on-1 - Game ${game.name}`;
            } else if (itemCategory === 'gamepal') {
              customName = `Bạn chơi cùng (GamePal) - Game ${game.name}`;
            } else if (itemCategory === 'items') {
              customName = `Vật phẩm Game VIP (${p.title})`;
            } else if (itemCategory === 'accounts') {
              customName = `Tài Khoản ${game.name} VIP - Rank ${p.rating > 4.5 ? 'Thách Đấu' : 'Cao Thủ'}`;
            }

            return {
              id: `${game.id}-${p.id}`,
              name: customName,
              price: Math.floor(p.price * 15000), // Scale USD price to realistic VND price
              badge: p.discountPercentage > 10 ? `Giảm ${Math.floor(p.discountPercentage)}%` : 'Giao nhanh',
              region: p.id % 2 === 0 ? 'Vietnam' : 'Global',
              offers: Math.floor(p.stock / 2) || 5,
              stock: p.stock || 10,
              description: p.description,
              image: p.thumbnail,
              category: itemCategory
            };
          });
        });

        return games;
      } catch (error) {
        console.error("fetchAndMapProducts error:", error);
        return null;
      }
}