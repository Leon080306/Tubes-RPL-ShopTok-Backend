'use strict';

const { v4: uuidv4 } = require('uuid');

// ─── Pre-generate all IDs ───────────────────────────────────────────────────
const userIds = Array.from({ length: 5 }, () => uuidv4());
const addressIds = Array.from({ length: 5 }, () => uuidv4());
const shopIds = Array.from({ length: 2 }, () => uuidv4());
const categoryIds = Array.from({ length: 8 }, () => uuidv4());
const voucherIds = Array.from({ length: 3 }, () => uuidv4());
const productIds = Array.from({ length: 10 }, () => uuidv4());
const variantIds = Array.from({ length: 20 }, () => uuidv4());
const orderIds = Array.from({ length: 10 }, () => uuidv4());
const chatIds = Array.from({ length: 5 }, () => uuidv4());
const notifIds = Array.from({ length: 5 }, () => uuidv4());

const now = new Date();
const ts = { createdAt: now, updatedAt: now };

// Bcrypt hash of "password123" (cost 10)
const PASSWORD = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

module.exports = {
  async up(queryInterface) {

    // ── 1. Users (address_id null initially — circular dep with Addresses) ──
    await queryInterface.bulkInsert('Users', [
      {
        user_id: userIds[0], first_name: 'Admin', last_name: 'User',
        email: 'admin@example.com', password: PASSWORD,
        phone_number: '081200000000', role: 'admin', status: 'active',
        profile_pic: null, address_id: null, ...ts,
      },
      {
        user_id: userIds[1], first_name: 'Budi', last_name: 'Santoso',
        email: 'budi@example.com', password: PASSWORD,
        phone_number: '081211111111', role: 'seller', status: 'active',
        profile_pic: 'budi.png', address_id: null, ...ts,
      },
      {
        user_id: userIds[2], first_name: 'Siti', last_name: 'Rahayu',
        email: 'siti@example.com', password: PASSWORD,
        phone_number: '081222222222', role: 'seller', status: 'active',
        profile_pic: 'siti.png', address_id: null, ...ts,
      },
      {
        user_id: userIds[3], first_name: 'Andi', last_name: 'Wijaya',
        email: 'andi@example.com', password: PASSWORD,
        phone_number: '081233333333', role: 'customer', status: 'active',
        profile_pic: null, address_id: null, ...ts,
      },
      {
        user_id: userIds[4], first_name: 'Dewi', last_name: 'Kusuma',
        email: 'dewi@example.com', password: PASSWORD,
        phone_number: '081244444444', role: 'customer', status: 'active',
        profile_pic: null, address_id: null, ...ts,
      },
    ]);

    // ── 2. Categories (parents first, then children) ─────────────────────────
    await queryInterface.bulkInsert('Categories', [
      // Parents
      { category_id: categoryIds[0], parent_id: null, name: 'Electronics', icon: 'electronics.png', ...ts },
      { category_id: categoryIds[1], parent_id: null, name: 'Fashion', icon: 'fashion.png', ...ts },
      { category_id: categoryIds[2], parent_id: null, name: 'Home & Living', icon: 'home.png', ...ts },
      { category_id: categoryIds[3], parent_id: null, name: 'Sports', icon: 'sports.png', ...ts },
      // Children
      { category_id: categoryIds[4], parent_id: categoryIds[0], name: 'Smartphones', icon: 'smartphones.png', ...ts },
      { category_id: categoryIds[5], parent_id: categoryIds[0], name: 'Laptops', icon: 'laptops.png', ...ts },
      { category_id: categoryIds[6], parent_id: categoryIds[1], name: "Men's Clothing", icon: 'mens.png', ...ts },
      { category_id: categoryIds[7], parent_id: categoryIds[1], name: "Women's Clothing", icon: 'womens.png', ...ts },
    ]);

    // ── 3. Vouchers ──────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('Vouchers', [
      { voucher_id: voucherIds[0], name: 'WELCOME10', banner: 'welcome10.png', expiry_date: new Date('2025-12-31'), discount_value: 10000.00, ...ts },
      { voucher_id: voucherIds[1], name: 'SAVE20', banner: 'save20.png', expiry_date: new Date('2025-09-30'), discount_value: 20000.00, ...ts },
      { voucher_id: voucherIds[2], name: 'FLASH50', banner: 'flash50.png', expiry_date: new Date('2025-06-30'), discount_value: 50000.00, ...ts },
    ]);

    // ── 4. Shops ─────────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('Shops', [
      {
        shop_id: shopIds[0], owner_id: userIds[1],
        name: 'Toko Elektronik Budi',
        description: 'Terpercaya untuk kebutuhan elektronik Anda.',
        profile_pic: 'shop1_logo.png', banner: 'shop1_banner.png',
        is_approved: true, status: 'active', ...ts,
      },
      {
        shop_id: shopIds[1], owner_id: userIds[2],
        name: 'Fashion by Siti',
        description: 'Tren fashion terkini untuk pria dan wanita.',
        profile_pic: 'shop2_logo.png', banner: 'shop2_banner.png',
        is_approved: true, status: 'active', ...ts,
      },
    ]);

    // ── 5. Addresses ─────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('Addresses', [
      { address_id: addressIds[0], user_id: userIds[0], full_name: 'Admin User', address: 'Jl. Gatot Subroto No. 1', province: 'DKI Jakarta', city: 'Jakarta Selatan', sub_district: 'Kuningan', phone_number: '081200000000', ...ts },
      { address_id: addressIds[1], user_id: userIds[1], full_name: 'Budi Santoso', address: 'Jl. Sudirman No. 10', province: 'DKI Jakarta', city: 'Jakarta Pusat', sub_district: 'Menteng', phone_number: '081211111111', ...ts },
      { address_id: addressIds[2], user_id: userIds[2], full_name: 'Siti Rahayu', address: 'Jl. Diponegoro No. 5', province: 'Jawa Barat', city: 'Bandung', sub_district: 'Coblong', phone_number: '081222222222', ...ts },
      { address_id: addressIds[3], user_id: userIds[3], full_name: 'Andi Wijaya', address: 'Jl. Malioboro No. 3', province: 'DI Yogyakarta', city: 'Yogyakarta', sub_district: 'Gedongtengen', phone_number: '081233333333', ...ts },
      { address_id: addressIds[4], user_id: userIds[4], full_name: 'Dewi Kusuma', address: 'Jl. Thamrin No. 7', province: 'DKI Jakarta', city: 'Jakarta Selatan', sub_district: 'Setiabudi', phone_number: '081244444444', ...ts },
    ]);

    // ── 6. Back-fill Users.address_id ────────────────────────────────────────
    const userAddressMap = [
      [userIds[0], addressIds[0]],
      [userIds[1], addressIds[1]],
      [userIds[2], addressIds[2]],
      [userIds[3], addressIds[3]],
      [userIds[4], addressIds[4]],
    ];
    for (const [uid, aid] of userAddressMap) {
      await queryInterface.bulkUpdate('Users', { address_id: aid }, { user_id: uid });
    }

    // ── 7. Products ──────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('Products', [
      { product_id: productIds[0], shop_id: shopIds[0], category_id: categoryIds[4], name: 'iPhone 15 Pro', description: 'Smartphone flagship terbaru dari Apple dengan chip A17 Pro.', view_count: 1500, ...ts },
      { product_id: productIds[1], shop_id: shopIds[0], category_id: categoryIds[4], name: 'Samsung Galaxy S24', description: 'Android flagship dengan kamera 200MP dan layar Dynamic AMOLED.', view_count: 1200, ...ts },
      { product_id: productIds[2], shop_id: shopIds[0], category_id: categoryIds[5], name: 'MacBook Pro M3', description: 'Laptop profesional dengan chip M3 dari Apple.', view_count: 900, ...ts },
      { product_id: productIds[3], shop_id: shopIds[0], category_id: categoryIds[5], name: 'ASUS ROG Zephyrus', description: 'Laptop gaming bertenaga tinggi dengan GPU RTX 4080.', view_count: 750, ...ts },
      { product_id: productIds[4], shop_id: shopIds[0], category_id: categoryIds[0], name: 'Sony WH-1000XM5', description: 'Headphone nirkabel dengan noise cancelling terbaik di kelasnya.', view_count: 600, ...ts },
      { product_id: productIds[5], shop_id: shopIds[1], category_id: categoryIds[6], name: 'Kemeja Batik Pria', description: 'Kemeja batik motif parang dengan bahan katun premium.', view_count: 400, ...ts },
      { product_id: productIds[6], shop_id: shopIds[1], category_id: categoryIds[6], name: 'Celana Chino Slim', description: 'Celana chino pria slim fit tersedia berbagai warna.', view_count: 350, ...ts },
      { product_id: productIds[7], shop_id: shopIds[1], category_id: categoryIds[7], name: 'Dress Floral Elegan', description: 'Dress wanita motif floral cocok untuk acara formal maupun kasual.', view_count: 500, ...ts },
      { product_id: productIds[8], shop_id: shopIds[1], category_id: categoryIds[7], name: 'Blouse Korea Style', description: 'Blouse wanita bergaya Korea dengan bahan sifon lembut.', view_count: 450, ...ts },
      { product_id: productIds[9], shop_id: shopIds[1], category_id: categoryIds[7], name: 'Rok Midi Wanita', description: 'Rok midi stylish cocok untuk outfit sehari-hari maupun semi-formal.', view_count: 300, ...ts },
    ]);

    // ── 8. ProductVariants (2 per product) ───────────────────────────────────
    await queryInterface.bulkInsert('ProductVariants', [
      // productIds[0] iPhone 15 Pro
      { variant_id: variantIds[0], product_id: productIds[0], name: 'Natural Titanium 256GB', picture: 'iphone15_natural.png', stock: 50, price: 19999000.00, ...ts },
      { variant_id: variantIds[1], product_id: productIds[0], name: 'Black Titanium 512GB', picture: 'iphone15_black.png', stock: 30, price: 23999000.00, ...ts },
      // productIds[1] Samsung Galaxy S24
      { variant_id: variantIds[2], product_id: productIds[1], name: 'Phantom Black 256GB', picture: 'galaxy_black.png', stock: 40, price: 14999000.00, ...ts },
      { variant_id: variantIds[3], product_id: productIds[1], name: 'Marble Gray 512GB', picture: 'galaxy_gray.png', stock: 25, price: 17999000.00, ...ts },
      // productIds[2] MacBook Pro M3
      { variant_id: variantIds[4], product_id: productIds[2], name: 'Space Gray 16GB/512GB', picture: 'macbook_gray.png', stock: 20, price: 29999000.00, ...ts },
      { variant_id: variantIds[5], product_id: productIds[2], name: 'Silver 32GB/1TB', picture: 'macbook_silver.png', stock: 15, price: 39999000.00, ...ts },
      // productIds[3] ASUS ROG Zephyrus
      { variant_id: variantIds[6], product_id: productIds[3], name: 'Eclipse Gray 16GB RAM', picture: 'rog_gray_16.png', stock: 18, price: 24999000.00, ...ts },
      { variant_id: variantIds[7], product_id: productIds[3], name: 'Eclipse Gray 32GB RAM', picture: 'rog_gray_32.png', stock: 12, price: 31999000.00, ...ts },
      // productIds[4] Sony WH-1000XM5
      { variant_id: variantIds[8], product_id: productIds[4], name: 'Black', picture: 'sony_black.png', stock: 60, price: 4999000.00, ...ts },
      { variant_id: variantIds[9], product_id: productIds[4], name: 'Silver', picture: 'sony_silver.png', stock: 45, price: 4999000.00, ...ts },
      // productIds[5] Kemeja Batik
      { variant_id: variantIds[10], product_id: productIds[5], name: 'Motif Parang - M', picture: 'batik_m.png', stock: 30, price: 189000.00, ...ts },
      { variant_id: variantIds[11], product_id: productIds[5], name: 'Motif Parang - L', picture: 'batik_l.png', stock: 25, price: 189000.00, ...ts },
      // productIds[6] Celana Chino
      { variant_id: variantIds[12], product_id: productIds[6], name: 'Khaki - 30', picture: 'chino_khaki.png', stock: 40, price: 229000.00, ...ts },
      { variant_id: variantIds[13], product_id: productIds[6], name: 'Navy - 32', picture: 'chino_navy.png', stock: 35, price: 229000.00, ...ts },
      // productIds[7] Dress Floral
      { variant_id: variantIds[14], product_id: productIds[7], name: 'Pink Floral - S', picture: 'dress_pink_s.png', stock: 20, price: 349000.00, ...ts },
      { variant_id: variantIds[15], product_id: productIds[7], name: 'Blue Floral - M', picture: 'dress_blue_m.png', stock: 18, price: 349000.00, ...ts },
      // productIds[8] Blouse Korea
      { variant_id: variantIds[16], product_id: productIds[8], name: 'White - S', picture: 'blouse_white.png', stock: 25, price: 199000.00, ...ts },
      { variant_id: variantIds[17], product_id: productIds[8], name: 'Cream - M', picture: 'blouse_cream.png', stock: 22, price: 199000.00, ...ts },
      // productIds[9] Rok Midi
      { variant_id: variantIds[18], product_id: productIds[9], name: 'Black - S', picture: 'skirt_black_s.png', stock: 30, price: 279000.00, ...ts },
      { variant_id: variantIds[19], product_id: productIds[9], name: 'Brown - M', picture: 'skirt_brown_m.png', stock: 28, price: 279000.00, ...ts },
    ]);

    // ── 9. CartItems ─────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('CartItems', [
      { user_id: userIds[3], variant_id: variantIds[0], quantity: 1, is_selected: true, ...ts },
      { user_id: userIds[3], variant_id: variantIds[8], quantity: 1, is_selected: false, ...ts },
      { user_id: userIds[3], variant_id: variantIds[12], quantity: 2, is_selected: true, ...ts },
      { user_id: userIds[4], variant_id: variantIds[14], quantity: 1, is_selected: true, ...ts },
      { user_id: userIds[4], variant_id: variantIds[16], quantity: 2, is_selected: true, ...ts },
      { user_id: userIds[4], variant_id: variantIds[18], quantity: 1, is_selected: false, ...ts },
    ]);

    // ── 10. Orders ───────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('Orders', [
      { order_id: orderIds[0], customer_id: userIds[3], shop_id: shopIds[0], address_id: addressIds[3], status: 'completed', amount_paid: 19999000.00, ...ts },
      { order_id: orderIds[1], customer_id: userIds[3], shop_id: shopIds[0], address_id: addressIds[3], status: 'completed', amount_paid: 4999000.00, ...ts },
      { order_id: orderIds[2], customer_id: userIds[3], shop_id: shopIds[0], address_id: addressIds[3], status: 'pending', amount_paid: 14999000.00, ...ts },
      { order_id: orderIds[3], customer_id: userIds[3], shop_id: shopIds[0], address_id: addressIds[3], status: 'cancelled', amount_paid: 29999000.00, ...ts },
      { order_id: orderIds[4], customer_id: userIds[3], shop_id: shopIds[1], address_id: addressIds[3], status: 'completed', amount_paid: 418000.00, ...ts },
      { order_id: orderIds[5], customer_id: userIds[3], shop_id: shopIds[1], address_id: addressIds[3], status: 'pending', amount_paid: 229000.00, ...ts },
      { order_id: orderIds[6], customer_id: userIds[4], shop_id: shopIds[0], address_id: addressIds[4], status: 'completed', amount_paid: 23999000.00, ...ts },
      { order_id: orderIds[7], customer_id: userIds[4], shop_id: shopIds[0], address_id: addressIds[4], status: 'pending', amount_paid: 24999000.00, ...ts },
      { order_id: orderIds[8], customer_id: userIds[4], shop_id: shopIds[1], address_id: addressIds[4], status: 'completed', amount_paid: 548000.00, ...ts },
      { order_id: orderIds[9], customer_id: userIds[4], shop_id: shopIds[1], address_id: addressIds[4], status: 'pending', amount_paid: 279000.00, ...ts },
    ]);

    // ── 11. OrderItems ───────────────────────────────────────────────────────
    await queryInterface.bulkInsert('OrderItems', [
      { order_id: orderIds[0], variant_id: variantIds[0], quantity: 1, ...ts },
      { order_id: orderIds[1], variant_id: variantIds[8], quantity: 1, ...ts },
      { order_id: orderIds[2], variant_id: variantIds[2], quantity: 1, ...ts },
      { order_id: orderIds[3], variant_id: variantIds[4], quantity: 1, ...ts },
      { order_id: orderIds[4], variant_id: variantIds[10], quantity: 1, ...ts },
      { order_id: orderIds[4], variant_id: variantIds[12], quantity: 1, ...ts },
      { order_id: orderIds[5], variant_id: variantIds[13], quantity: 1, ...ts },
      { order_id: orderIds[6], variant_id: variantIds[1], quantity: 1, ...ts },
      { order_id: orderIds[7], variant_id: variantIds[6], quantity: 1, ...ts },
      { order_id: orderIds[8], variant_id: variantIds[14], quantity: 1, ...ts },
      { order_id: orderIds[8], variant_id: variantIds[16], quantity: 1, ...ts },
      { order_id: orderIds[9], variant_id: variantIds[18], quantity: 1, ...ts },
    ]);

    // ── 12. VouchersUsed ─────────────────────────────────────────────────────
    await queryInterface.bulkInsert('VouchersUsed', [
      { voucher_id: voucherIds[0], order_id: orderIds[0], ...ts },
      { voucher_id: voucherIds[1], order_id: orderIds[4], ...ts },
      { voucher_id: voucherIds[2], order_id: orderIds[6], ...ts },
    ]);

    // ── 13. Likes (updatedAt: false — only createdAt) ────────────────────────
    await queryInterface.bulkInsert('Likes', [
      { user_id: userIds[3], product_id: productIds[0], createdAt: now },
      { user_id: userIds[3], product_id: productIds[2], createdAt: now },
      { user_id: userIds[3], product_id: productIds[4], createdAt: now },
      { user_id: userIds[4], product_id: productIds[7], createdAt: now },
      { user_id: userIds[4], product_id: productIds[8], createdAt: now },
    ]);

    // ── 14. Wishlists (updatedAt: false — only createdAt) ────────────────────
    await queryInterface.bulkInsert('Wishlists', [
      { user_id: userIds[3], product_id: productIds[1], createdAt: now },
      { user_id: userIds[3], product_id: productIds[3], createdAt: now },
      { user_id: userIds[4], product_id: productIds[5], createdAt: now },
      { user_id: userIds[4], product_id: productIds[6], createdAt: now },
      { user_id: userIds[4], product_id: productIds[9], createdAt: now },
    ]);

    // ── 15. Ratings ──────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('Ratings', [
      { user_id: userIds[3], product_id: productIds[0], value: 4.5, title: 'Mantap!', description: 'Kualitas kamera luar biasa, sangat puas.', picture: null, ...ts },
      { user_id: userIds[3], product_id: productIds[2], value: 5.0, title: 'Laptop terbaik', description: 'Chip M3 sangat kencang, cocok untuk editing video.', picture: null, ...ts },
      { user_id: userIds[3], product_id: productIds[4], value: 4.0, title: 'Noise cancel oke', description: 'Sangat membantu saat WFH, suara jernih.', picture: null, ...ts },
      { user_id: userIds[4], product_id: productIds[7], value: 5.0, title: 'Cantik banget!', description: 'Sesuai foto, bahannya adem dan nyaman.', picture: 'rate_1.png', ...ts },
      { user_id: userIds[4], product_id: productIds[8], value: 4.5, title: 'Recommended seller', description: 'Pengiriman cepat, blouse rapih dan sesuai ukuran.', picture: 'rate_2.png', ...ts },
    ]);

    // ── 16. Chats ────────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('Chats', [
      { chat_id: chatIds[0], user_id: userIds[3], shop_id: shopIds[0], message: 'Halo, iPhone 15 Pro masih ready stok?', ...ts },
      { chat_id: chatIds[1], user_id: userIds[3], shop_id: shopIds[0], message: 'Garansi berapa tahun kak?', ...ts },
      { chat_id: chatIds[2], user_id: userIds[4], shop_id: shopIds[1], message: 'Dress floralnya ada ukuran XL tidak?', ...ts },
      { chat_id: chatIds[3], user_id: userIds[4], shop_id: shopIds[1], message: 'Kalau beli 3 pcs bisa dapat diskon?', ...ts },
      { chat_id: chatIds[4], user_id: userIds[3], shop_id: shopIds[1], message: 'Kemeja batik motif lainnya ada tidak selain parang?', ...ts },
    ]);

    // ── 17. Notifications ────────────────────────────────────────────────────
    await queryInterface.bulkInsert('Notifications', [
      { notification_id: notifIds[0], user_id: userIds[3], subject: 'Pesanan Dikonfirmasi', message: 'Pesanan Anda telah dikonfirmasi dan sedang diproses.', ...ts },
      { notification_id: notifIds[1], user_id: userIds[3], subject: 'Pesanan Selesai', message: 'Pesanan Anda telah berhasil diterima. Terima kasih!', ...ts },
      { notification_id: notifIds[2], user_id: userIds[4], subject: 'Pesanan Dikonfirmasi', message: 'Pesanan Anda telah dikonfirmasi dan sedang diproses.', ...ts },
      { notification_id: notifIds[3], user_id: userIds[4], subject: 'Promo Hari Ini!', message: 'Gunakan kode FLASH50 untuk diskon Rp50.000 hari ini saja!', ...ts },
      { notification_id: notifIds[4], user_id: userIds[3], subject: 'Selamat Datang!', message: 'Akun Anda berhasil dibuat. Mulai belanja sekarang!', ...ts },
    ]);
  },

  async down(queryInterface) {
    // Delete in strict reverse-dependency order
    await queryInterface.bulkDelete('Notifications', null, {});
    await queryInterface.bulkDelete('Chats', null, {});
    await queryInterface.bulkDelete('Ratings', null, {});
    await queryInterface.bulkDelete('Wishlists', null, {});
    await queryInterface.bulkDelete('Likes', null, {});
    await queryInterface.bulkDelete('VouchersUsed', null, {});
    await queryInterface.bulkDelete('OrderItems', null, {});
    await queryInterface.bulkDelete('Orders', null, {});
    await queryInterface.bulkDelete('CartItems', null, {});
    await queryInterface.bulkDelete('ProductVariants', null, {});
    await queryInterface.bulkDelete('Products', null, {});
    await queryInterface.bulkDelete('Vouchers', null, {});
    await queryInterface.bulkDelete('Shops', null, {});
    // Clear address_id FK before deleting Addresses (circular dep)
    await queryInterface.bulkUpdate('Users', { address_id: null }, {});
    await queryInterface.bulkDelete('Addresses', null, {});
    await queryInterface.bulkDelete('Categories', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  },
};