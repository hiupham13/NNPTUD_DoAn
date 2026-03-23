require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Models
const Role = require('../schemas/roles');
const User = require('../schemas/users');
const Category = require('../schemas/categories');
const Collection = require('../schemas/collections');
const Product = require('../schemas/products');
const Inventory = require('../schemas/inventories');
const Coupon = require('../schemas/coupons');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Drop database to clear everything including stale indexes
    await mongoose.connection.dropDatabase();
    console.log('🗑️  Dropped database (clean slate)');

    // === 1. ROLES ===
    const roles = await Role.insertMany([
      { name: 'admin', description: 'Quản trị hệ thống' },
      { name: 'customer', description: 'Khách hàng' },
    ]);
    const adminRole = roles.find((r) => r.name === 'admin');
    const customerRole = roles.find((r) => r.name === 'customer');
    console.log(`✅ Seeded ${roles.length} roles`);

    // === 2. USERS ===
    const users = await User.create([
      {
        username: 'admin',
        email: 'admin@luxurywatch.vn',
        password: 'admin123',
        fullName: 'Admin Luxury Watch',
        role: adminRole._id,
      },
      {
        username: 'customer',
        email: 'customer@gmail.com',
        password: '123456',
        fullName: 'Nguyễn Văn Khách',
        phone: '0901234567',
        address: {
          street: '123 Nguyễn Huệ',
          ward: 'Phường Bến Nghé',
          district: 'Quận 1',
          city: 'TP. Hồ Chí Minh',
        },
        role: customerRole._id,
      },
    ]);
    console.log(`✅ Seeded ${users.length} users`);

    // === 3. CATEGORIES (Brands) ===
    const categories = await Category.create([
      { name: 'Rolex', description: 'Thương hiệu đồng hồ xa xỉ Thụy Sĩ', image: 'https://picsum.photos/seed/rolex/400/400' },
      { name: 'Omega', description: 'Đồng hồ Thụy Sĩ cao cấp', image: 'https://picsum.photos/seed/omega/400/400' },
      { name: 'Casio', description: 'Đồng hồ Nhật Bản đa năng', image: 'https://picsum.photos/seed/casio/400/400' },
      { name: 'Seiko', description: 'Đồng hồ Nhật Bản chính xác', image: 'https://picsum.photos/seed/seiko/400/400' },
      { name: 'Citizen', description: 'Đồng hồ Nhật Bản Eco-Drive', image: 'https://picsum.photos/seed/citizen/400/400' },
      { name: 'Tissot', description: 'Đồng hồ Thụy Sĩ tầm trung cao cấp', image: 'https://picsum.photos/seed/tissot/400/400' },
      { name: 'Longines', description: 'Đồng hồ Thụy Sĩ thanh lịch', image: 'https://picsum.photos/seed/longines/400/400' },
      { name: 'TAG Heuer', description: 'Đồng hồ Thụy Sĩ thể thao sang trọng', image: 'https://picsum.photos/seed/tagheuer/400/400' },
    ]);
    const catMap = {};
    categories.forEach((c) => (catMap[c.name] = c._id));
    console.log(`✅ Seeded ${categories.length} categories (brands)`);

    // === 4. COLLECTIONS ===
    const collections = await Collection.create([
      { name: 'Classic Gold', description: 'Bộ sưu tập vàng cổ điển', image: 'https://picsum.photos/seed/classic/600/400' },
      { name: 'Sport Series', description: 'Dòng thể thao năng động', image: 'https://picsum.photos/seed/sport/600/400' },
      { name: 'Dress Collection', description: 'Đồng hồ lịch lãm', image: 'https://picsum.photos/seed/dress/600/400' },
      { name: "Diver's Edition", description: 'Dòng lặn chuyên nghiệp', image: 'https://picsum.photos/seed/diver/600/400' },
    ]);
    const colMap = {};
    collections.forEach((c) => (colMap[c.name] = c._id));
    console.log(`✅ Seeded ${collections.length} collections`);

    // === 5. PRODUCTS (15 watches) ===
    const productsData = [
      {
        name: 'Rolex Submariner Date 41mm',
        description: 'Đồng hồ lặn huyền thoại với bộ máy Calibre 3235 tự động, chống nước 300m. Vỏ Oystersteel 41mm, mặt số đen, bezel xoay một chiều Cerachrom.',
        price: 250000000, category: catMap['Rolex'], collectionRef: colMap["Diver's Edition"],
        movement: 'automatic', gender: 'male', caseMaterial: 'Oystersteel', caseSize: '41mm',
        strapMaterial: 'Oystersteel Bracelet', waterResistance: '300m',
        features: ['Chronometer', 'Date', 'Luminous'],
        images: ['https://picsum.photos/seed/sub1/800/800', 'https://picsum.photos/seed/sub2/800/800'],
      },
      {
        name: 'Rolex Datejust 36mm',
        description: 'Biểu tượng của sự thanh lịch với Calibre 3235, mặt số champagne, dây đeo Jubilee. Hoàn hảo cho mọi dịp.',
        price: 180000000, category: catMap['Rolex'], collectionRef: colMap['Classic Gold'],
        movement: 'automatic', gender: 'unisex', caseMaterial: 'Oystersteel & Yellow Gold', caseSize: '36mm',
        strapMaterial: 'Jubilee Bracelet', waterResistance: '100m',
        features: ['Chronometer', 'Date', 'Fluted Bezel'],
        images: ['https://picsum.photos/seed/dj1/800/800', 'https://picsum.photos/seed/dj2/800/800'],
      },
      {
        name: 'Omega Seamaster Planet Ocean 600M',
        description: 'Đồng hồ lặn chuyên nghiệp với Master Chronometer Co-Axial 8900, chống nước 600m, bezel ceramic cam-đen.',
        price: 120000000, category: catMap['Omega'], collectionRef: colMap['Sport Series'],
        movement: 'automatic', gender: 'male', caseMaterial: 'Stainless Steel', caseSize: '43.5mm',
        strapMaterial: 'Rubber Strap', waterResistance: '600m',
        features: ['Chronometer', 'Date', 'Helium Escape Valve'],
        images: ['https://picsum.photos/seed/po1/800/800', 'https://picsum.photos/seed/po2/800/800'],
      },
      {
        name: 'Omega Speedmaster Moonwatch Professional',
        description: 'Đồng hồ đầu tiên lên Mặt Trăng. Calibre 3861 lên dây cót thủ công, mặt đen Hesalite, chronograph huyền thoại.',
        price: 150000000, category: catMap['Omega'], collectionRef: colMap['Classic Gold'],
        movement: 'mechanical', gender: 'male', caseMaterial: 'Stainless Steel', caseSize: '42mm',
        strapMaterial: 'Leather Strap', waterResistance: '50m',
        features: ['Chronograph', 'Tachymeter', 'Manual Winding'],
        images: ['https://picsum.photos/seed/sp1/800/800', 'https://picsum.photos/seed/sp2/800/800'],
      },
      {
        name: 'Casio G-Shock GA-2100-1A',
        description: 'CasiOak — thiết kế bát giác iconic, siêu bền, chống va đập. World time, stopwatch, LED backlight.',
        price: 5500000, category: catMap['Casio'], collectionRef: colMap['Sport Series'],
        movement: 'quartz', gender: 'male', caseMaterial: 'Carbon Core Guard', caseSize: '45.4mm',
        strapMaterial: 'Resin', waterResistance: '200m',
        features: ['World Time', 'Stopwatch', 'LED Light', 'Shock Resistant'],
        images: ['https://picsum.photos/seed/gshock1/800/800', 'https://picsum.photos/seed/gshock2/800/800'],
      },
      {
        name: 'Casio Edifice EFR-S108D',
        description: 'Đồng hồ lịch lãm mỏng nhẹ với mặt sapphire, nhẹ và bền, phù hợp kinh doanh và hàng ngày.',
        price: 8200000, category: catMap['Casio'], collectionRef: colMap['Dress Collection'],
        movement: 'quartz', gender: 'male', caseMaterial: 'Stainless Steel', caseSize: '41mm',
        strapMaterial: 'Stainless Steel Bracelet', waterResistance: '100m',
        features: ['Sapphire Crystal', 'Date', 'Slim Design'],
        images: ['https://picsum.photos/seed/edifice1/800/800', 'https://picsum.photos/seed/edifice2/800/800'],
      },
      {
        name: 'Seiko Presage SRPD37',
        description: 'Cocktail Time series — mặt số gradient xanh đá quý, bộ máy 4R35 automatic Nhật Bản.',
        price: 12000000, category: catMap['Seiko'], collectionRef: colMap['Dress Collection'],
        movement: 'automatic', gender: 'male', caseMaterial: 'Stainless Steel', caseSize: '40.5mm',
        strapMaterial: 'Leather Strap', waterResistance: '50m',
        features: ['See-through Caseback', 'Date', 'Hardlex Crystal'],
        images: ['https://picsum.photos/seed/presage1/800/800', 'https://picsum.photos/seed/presage2/800/800'],
      },
      {
        name: 'Seiko Prospex SPB143',
        description: 'Đồng hồ lặn 200m với bộ máy 6R35 automatic, bezel xoay một chiều, thiết kế Captain Willard 1970.',
        price: 25000000, category: catMap['Seiko'], collectionRef: colMap["Diver's Edition"],
        movement: 'automatic', gender: 'male', caseMaterial: 'Stainless Steel', caseSize: '42.7mm',
        strapMaterial: 'Silicone Strap', waterResistance: '200m',
        features: ['Lumibrite', 'Date', 'Screw-down Crown'],
        images: ['https://picsum.photos/seed/prospex1/800/800', 'https://picsum.photos/seed/prospex2/800/800'],
      },
      {
        name: 'Citizen Eco-Drive BN0150-28E',
        description: 'Promaster Diver Eco-Drive — chạy bằng năng lượng ánh sáng, không cần pin, chống nước 200m.',
        price: 7500000, category: catMap['Citizen'], collectionRef: colMap["Diver's Edition"],
        movement: 'eco-drive', gender: 'male', caseMaterial: 'Stainless Steel', caseSize: '44mm',
        strapMaterial: 'Polyurethane', waterResistance: '200m',
        features: ['Eco-Drive', 'Date', 'Luminous', 'ISO 6425 Certified'],
        images: ['https://picsum.photos/seed/citizen1/800/800', 'https://picsum.photos/seed/citizen2/800/800'],
      },
      {
        name: 'Tissot PRX Powermatic 80',
        description: 'Phục hồi thiết kế 1970s với Powermatic 80 automatic, lưu trữ năng lượng 80 giờ, mặt xanh waffle.',
        price: 18000000, category: catMap['Tissot'], collectionRef: colMap['Classic Gold'],
        movement: 'automatic', gender: 'male', caseMaterial: 'Stainless Steel', caseSize: '40mm',
        strapMaterial: 'Stainless Steel Bracelet', waterResistance: '100m',
        features: ['80hr Power Reserve', 'Date', 'Sapphire Crystal'],
        images: ['https://picsum.photos/seed/prx1/800/800', 'https://picsum.photos/seed/prx2/800/800'],
      },
      {
        name: 'Tissot Le Locle Powermatic 80',
        description: 'Đồng hồ cổ điển thanh lịch với Powermatic 80, mặt trắng Roman, dây da nâu Italy.',
        price: 15000000, category: catMap['Tissot'], collectionRef: colMap['Dress Collection'],
        movement: 'automatic', gender: 'male', caseMaterial: 'Stainless Steel', caseSize: '39.3mm',
        strapMaterial: 'Italian Leather', waterResistance: '30m',
        features: ['80hr Power Reserve', 'Date', 'See-through Caseback'],
        images: ['https://picsum.photos/seed/lelocle1/800/800', 'https://picsum.photos/seed/lelocle2/800/800'],
      },
      {
        name: 'Longines HydroConquest 41mm',
        description: 'Đồng hồ lặn sporty với bộ máy L888 automatic, ceramic bezel xanh, chống nước 300m.',
        price: 28000000, category: catMap['Longines'], collectionRef: colMap['Sport Series'],
        movement: 'automatic', gender: 'male', caseMaterial: 'Stainless Steel', caseSize: '41mm',
        strapMaterial: 'Stainless Steel Bracelet', waterResistance: '300m',
        features: ['Ceramic Bezel', 'Date', 'Screw-down Crown'],
        images: ['https://picsum.photos/seed/hydro1/800/800', 'https://picsum.photos/seed/hydro2/800/800'],
      },
      {
        name: 'TAG Heuer Carrera Chronograph',
        description: 'Biểu tượng đua xe với Calibre Heuer 02 automatic chronograph, 80 giờ power reserve.',
        price: 85000000, category: catMap['TAG Heuer'], collectionRef: colMap['Sport Series'],
        movement: 'automatic', gender: 'male', caseMaterial: 'Stainless Steel', caseSize: '44mm',
        strapMaterial: 'Stainless Steel Bracelet', waterResistance: '100m',
        features: ['Chronograph', 'Date', '80hr Power Reserve', 'Sapphire Crystal'],
        images: ['https://picsum.photos/seed/carrera1/800/800', 'https://picsum.photos/seed/carrera2/800/800'],
      },
      {
        name: 'Omega Constellation 29mm',
        description: 'Đồng hồ nữ sang trọng với Calibre 8700 Master Chronometer, bezel gắn móng vuốt, mặt xà cừ.',
        price: 95000000, category: catMap['Omega'], collectionRef: colMap['Classic Gold'],
        movement: 'quartz', gender: 'female', caseMaterial: 'Stainless Steel & Sedna Gold', caseSize: '29mm',
        strapMaterial: 'Stainless Steel Bracelet', waterResistance: '100m',
        features: ['Mother of Pearl Dial', 'Diamond Indexes', 'Claws Design'],
        images: ['https://picsum.photos/seed/const1/800/800', 'https://picsum.photos/seed/const2/800/800'],
      },
      {
        name: 'Casio Baby-G BGD-565',
        description: 'Đồng hồ nữ nhỏ gọn, chống va đập, chống nước 200m. Màu pastel thời trang.',
        price: 3200000, category: catMap['Casio'], collectionRef: colMap['Sport Series'],
        movement: 'quartz', gender: 'female', caseMaterial: 'Resin', caseSize: '37mm',
        strapMaterial: 'Resin', waterResistance: '200m',
        features: ['World Time', 'Stopwatch', 'LED Light', 'Alarm'],
        images: ['https://picsum.photos/seed/babyg1/800/800', 'https://picsum.photos/seed/babyg2/800/800'],
      },
    ];

    const products = await Product.create(productsData);
    console.log(`✅ Seeded ${products.length} products (watches)`);

    // === 6. INVENTORIES ===
    const inventories = products.map((p) => ({
      product: p._id,
      stock: Math.floor(Math.random() * 18) + 3, // 3-20
      reserved: 0,
      soldCount: 0,
    }));
    await Inventory.insertMany(inventories);
    console.log(`✅ Seeded ${inventories.length} inventories`);

    // === 7. COUPONS ===
    const threeMonthsLater = new Date();
    threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

    const coupons = await Coupon.create([
      {
        code: 'WELCOME10',
        discountType: 'percentage',
        discountValue: 10,
        maxDiscount: 500000,
        minOrderAmount: 1000000,
        maxUses: 100,
        expiresAt: threeMonthsLater,
      },
      {
        code: 'SAVE50K',
        discountType: 'fixed',
        discountValue: 50000,
        minOrderAmount: 500000,
        maxUses: 200,
        expiresAt: threeMonthsLater,
      },
      {
        code: 'VIP20',
        discountType: 'percentage',
        discountValue: 20,
        maxDiscount: 2000000,
        minOrderAmount: 5000000,
        maxUses: 50,
        expiresAt: threeMonthsLater,
      },
    ]);
    console.log(`✅ Seeded ${coupons.length} coupons`);

    // Summary
    console.log('\n═══════════════════════════════════');
    console.log('🎉 SEED HOÀN THÀNH!');
    console.log('═══════════════════════════════════');
    console.log(`  Roles:       ${roles.length}`);
    console.log(`  Users:       ${users.length}`);
    console.log(`  Categories:  ${categories.length}`);
    console.log(`  Collections: ${collections.length}`);
    console.log(`  Products:    ${products.length}`);
    console.log(`  Inventories: ${inventories.length}`);
    console.log(`  Coupons:     ${coupons.length}`);
    console.log('═══════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();
