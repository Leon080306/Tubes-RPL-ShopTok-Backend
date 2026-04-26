'use strict';

const { v4: uuidv4 } = require('uuid');

// ─── Pre-generate all IDs ────────────────────────────────────────────────────
const userIds = Array.from({ length: 7 }, () => uuidv4());
const addressIds = Array.from({ length: 7 }, () => uuidv4());
const shopIds = Array.from({ length: 4 }, () => uuidv4());
const categoryIds = Array.from({ length: 10 }, () => uuidv4());
const voucherIds = Array.from({ length: 4 }, () => uuidv4());
const productIds = Array.from({ length: 16 }, () => uuidv4());
const variantIds = Array.from({ length: 36 }, () => uuidv4());
const orderIds = Array.from({ length: 14 }, () => uuidv4());
const chatIds = Array.from({ length: 10 }, () => uuidv4());
const notifIds = Array.from({ length: 8 }, () => uuidv4());

const now = new Date();
const ts = { createdAt: now, updatedAt: now };

// bcrypt hash of "password123" (cost 10)
const PASSWORD = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

module.exports = {
  async up(queryInterface) {

    // ── 1. Users ─────────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('Users', [
      {
        user_id: userIds[0], first_name: 'Super', last_name: 'Admin',
        email: 'superadmin@shoptok.com', password: PASSWORD,
        phone_number: '081300000000', role: 'admin', status: 'active',
        profile_pic: null, address_id: null, reset_token: null, reset_token_expiry: null, ...ts,
      },
      {
        user_id: userIds[1], first_name: 'Agres', last_name: 'Pratama',
        email: 'agres@shoptok.com', password: PASSWORD,
        phone_number: '081311111111', role: 'seller', status: 'active',
        profile_pic: null, address_id: null, reset_token: null, reset_token_expiry: null, ...ts,
      },
      {
        user_id: userIds[2], first_name: 'Nadia', last_name: 'Permata',
        email: 'nadia@shoptok.com', password: PASSWORD,
        phone_number: '081322222222', role: 'seller', status: 'active',
        profile_pic: null, address_id: null, reset_token: null, reset_token_expiry: null, ...ts,
      },
      {
        user_id: userIds[3], first_name: 'Rizky', last_name: 'Hidayat',
        email: 'rizky@shoptok.com', password: PASSWORD,
        phone_number: '081333333333', role: 'seller', status: 'active',
        profile_pic: null, address_id: null, reset_token: null, reset_token_expiry: null, ...ts,
      },
      {
        user_id: userIds[4], first_name: 'Farah', last_name: 'Aulia',
        email: 'farah@shoptok.com', password: PASSWORD,
        phone_number: '081344444444', role: 'seller', status: 'active',
        profile_pic: null, address_id: null, reset_token: null, reset_token_expiry: null, ...ts,
      },
      {
        user_id: userIds[5], first_name: 'Bagas', last_name: 'Wicaksono',
        email: 'bagas@shoptok.com', password: PASSWORD,
        phone_number: '081355555555', role: 'customer', status: 'active',
        profile_pic: null, address_id: null, reset_token: null, reset_token_expiry: null, ...ts,
      },
      {
        user_id: userIds[6], first_name: 'Cantika', last_name: 'Sari',
        email: 'cantika@shoptok.com', password: PASSWORD,
        phone_number: '081366666666', role: 'customer', status: 'active',
        profile_pic: null, address_id: null, reset_token: null, reset_token_expiry: null, ...ts,
      },
    ]);

    // ── 2. Categories ────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('Categories', [
      // Parents
      { category_id: categoryIds[0], parent_id: null, name: 'Electronics', icon: 'electronics.png', ...ts },
      { category_id: categoryIds[1], parent_id: null, name: 'Fashion', icon: 'fashion.png', ...ts },
      { category_id: categoryIds[2], parent_id: null, name: 'Food & Drink', icon: 'food.png', ...ts },
      { category_id: categoryIds[3], parent_id: null, name: 'Beauty', icon: 'beauty.png', ...ts },
      // Children of Electronics
      { category_id: categoryIds[4], parent_id: categoryIds[0], name: 'Audio', icon: 'audio.png', ...ts },
      { category_id: categoryIds[5], parent_id: categoryIds[0], name: 'Gadgets', icon: 'gadgets.png', ...ts },
      // Children of Fashion
      { category_id: categoryIds[6], parent_id: categoryIds[1], name: 'Sneakers', icon: 'sneakers.png', ...ts },
      { category_id: categoryIds[7], parent_id: categoryIds[1], name: 'Bags', icon: 'bags.png', ...ts },
      // Children of Food
      { category_id: categoryIds[8], parent_id: categoryIds[2], name: 'Snacks', icon: 'snacks.png', ...ts },
      // Children of Beauty
      { category_id: categoryIds[9], parent_id: categoryIds[3], name: 'Skincare', icon: 'skincare.png', ...ts },
    ]);

    // ── 3. Vouchers ──────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('Vouchers', [
      { voucher_id: voucherIds[0], name: 'NEWUSER25', banner: 'newuser.png', expiry_date: new Date('2026-12-31'), discount_value: 25000.00, ...ts },
      { voucher_id: voucherIds[1], name: 'MIDYEAR50', banner: 'midyear.png', expiry_date: new Date('2026-06-30'), discount_value: 50000.00, ...ts },
      { voucher_id: voucherIds[2], name: 'FLASH100', banner: 'flash100.png', expiry_date: new Date('2026-03-31'), discount_value: 100000.00, ...ts },
      { voucher_id: voucherIds[3], name: 'LOYAL15', banner: 'loyal15.png', expiry_date: new Date('2026-12-31'), discount_value: 15000.00, ...ts },
    ]);

    // ── 4. Shops ─────────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('Shops', [
      {
        shop_id: shopIds[0], owner_id: userIds[1],
        name: 'Toko Agres', description: 'Perlengkapan audio & gadget berkualitas.',
        profile_pic: null, banner: null, is_approved: true, status: 'active', ...ts,
      },
      {
        shop_id: shopIds[1], owner_id: userIds[2],
        name: 'Nadia Sneakers', description: 'Sepatu sneakers lokal & import terlengkap.',
        profile_pic: null, banner: null, is_approved: true, status: 'active', ...ts,
      },
      {
        shop_id: shopIds[2], owner_id: userIds[3],
        name: 'Rizky Snacks', description: 'Camilan enak dan sehat dikirim ke seluruh Indonesia.',
        profile_pic: null, banner: null, is_approved: true, status: 'active', ...ts,
      },
      {
        shop_id: shopIds[3], owner_id: userIds[4],
        name: 'Farah Beauty', description: 'Produk skincare lokal pilihan untuk kulit sehat.',
        profile_pic: null, banner: null, is_approved: true, status: 'active', ...ts,
      },
    ]);

    // ── 5. Addresses ─────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('Addresses', [
      { address_id: addressIds[0], user_id: userIds[0], full_name: 'Super Admin', address: 'Jl. Merdeka No. 1', province: 'DKI Jakarta', city: 'Jakarta Pusat', sub_district: 'Gambir', phone_number: '081300000000', ...ts },
      { address_id: addressIds[1], user_id: userIds[1], full_name: 'Agres Pratama', address: 'Jl. Kenanga No. 12', province: 'Jawa Barat', city: 'Bekasi', sub_district: 'Bekasi Timur', phone_number: '081311111111', ...ts },
      { address_id: addressIds[2], user_id: userIds[2], full_name: 'Nadia Permata', address: 'Jl. Melati No. 7', province: 'Jawa Tengah', city: 'Semarang', sub_district: 'Banyumanik', phone_number: '081322222222', ...ts },
      { address_id: addressIds[3], user_id: userIds[3], full_name: 'Rizky Hidayat', address: 'Jl. Anggrek No. 22', province: 'Jawa Timur', city: 'Surabaya', sub_district: 'Gubeng', phone_number: '081333333333', ...ts },
      { address_id: addressIds[4], user_id: userIds[4], full_name: 'Farah Aulia', address: 'Jl. Dahlia No. 5', province: 'DI Yogyakarta', city: 'Yogyakarta', sub_district: 'Sleman', phone_number: '081344444444', ...ts },
      { address_id: addressIds[5], user_id: userIds[5], full_name: 'Bagas Wicaksono', address: 'Jl. Raya Bogor No. 88', province: 'Jawa Barat', city: 'Bogor', sub_district: 'Bogor Utara', phone_number: '081355555555', ...ts },
      { address_id: addressIds[6], user_id: userIds[6], full_name: 'Cantika Sari', address: 'Jl. Pahlawan No. 15', province: 'Bali', city: 'Denpasar', sub_district: 'Denpasar Selatan', phone_number: '081366666666', ...ts },
    ]);

    // ── 6. Back-fill Users.address_id ────────────────────────────────────────
    for (let i = 0; i < 7; i++) {
      await queryInterface.bulkUpdate('Users', { address_id: addressIds[i] }, { user_id: userIds[i] });
    }

    // ── 7. Products ──────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('Products', [
      // Toko Agres — Audio & Gadgets
      { product_id: productIds[0], shop_id: shopIds[0], category_id: categoryIds[4], name: 'JBL Flip 6', description: 'Speaker portabel tahan air dengan bass yang kuat.', view_count: 820, ...ts },
      { product_id: productIds[1], shop_id: shopIds[0], category_id: categoryIds[4], name: 'Earbuds TWS ProMax', description: 'True wireless earbuds dengan ANC dan baterai 30 jam.', view_count: 640, ...ts },
      { product_id: productIds[2], shop_id: shopIds[0], category_id: categoryIds[5], name: 'Smartwatch Xtreme', description: 'Smartwatch dengan monitoring kesehatan lengkap.', view_count: 510, ...ts },
      { product_id: productIds[3], shop_id: shopIds[0], category_id: categoryIds[5], name: 'Power Bank 20000mAh', description: 'Power bank fast charging 65W untuk semua perangkat.', view_count: 390, ...ts },
      // Nadia Sneakers
      { product_id: productIds[4], shop_id: shopIds[1], category_id: categoryIds[6], name: 'Sneakers Panda Edition', description: 'Sneakers kanvas hitam putih ikonik edisi panda.', view_count: 970, ...ts },
      { product_id: productIds[5], shop_id: shopIds[1], category_id: categoryIds[6], name: 'Running Shoes AirTech', description: 'Sepatu lari ringan dengan sol anti-slip.', view_count: 750, ...ts },
      { product_id: productIds[6], shop_id: shopIds[1], category_id: categoryIds[7], name: 'Tote Bag Canvas', description: 'Tas kanvas serbaguna cocok untuk kuliah dan kerja.', view_count: 580, ...ts },
      { product_id: productIds[7], shop_id: shopIds[1], category_id: categoryIds[7], name: 'Sling Bag Mini', description: 'Tas selempang mini dengan bahan kulit sintetis premium.', view_count: 430, ...ts },
      // Rizky Snacks
      { product_id: productIds[8], shop_id: shopIds[2], category_id: categoryIds[8], name: 'Keripik Tempe Pedas', description: 'Keripik tempe renyah dengan bumbu pedas khas Jawa.', view_count: 1100, ...ts },
      { product_id: productIds[9], shop_id: shopIds[2], category_id: categoryIds[8], name: 'Brownies Fudgy', description: 'Brownies coklat premium lembut dan fudgy homemade.', view_count: 860, ...ts },
      { product_id: productIds[10], shop_id: shopIds[2], category_id: categoryIds[8], name: 'Granola Oat Honey', description: 'Granola sehat campuran oat dan madu, bebas pengawet.', view_count: 620, ...ts },
      { product_id: productIds[11], shop_id: shopIds[2], category_id: categoryIds[8], name: 'Choco Crispy Bar', description: 'Bar coklat renyah dengan isian caramel dan hazelnut.', view_count: 490, ...ts },
      // Farah Beauty
      { product_id: productIds[12], shop_id: shopIds[3], category_id: categoryIds[9], name: 'Serum Vitamin C Glow', description: 'Serum vitamin C brightening untuk kulit cerah bercahaya.', view_count: 1300, ...ts },
      { product_id: productIds[13], shop_id: shopIds[3], category_id: categoryIds[9], name: 'Moisturizer Aloe Vera', description: 'Pelembab ringan dengan ekstrak lidah buaya, cocok semua jenis kulit.', view_count: 980, ...ts },
      { product_id: productIds[14], shop_id: shopIds[3], category_id: categoryIds[9], name: 'Sunscreen SPF 50 PA+++', description: 'Tabir surya ringan tidak lengket, cocok untuk daily use.', view_count: 1150, ...ts },
      { product_id: productIds[15], shop_id: shopIds[3], category_id: categoryIds[9], name: 'Toner Niacinamide 10%', description: 'Toner niacinamide untuk mengecilkan pori dan mencerahkan.', view_count: 870, ...ts },
    ]);

    // ── 8. ProductVariants ───────────────────────────────────────────────────
    await queryInterface.bulkInsert('ProductVariants', [
      // JBL Flip 6
      { variant_id: variantIds[0], product_id: productIds[0], name: 'Black', picture: 'jbl_black.png', stock: 40, price: 1299000.00, ...ts },
      { variant_id: variantIds[1], product_id: productIds[0], name: 'Blue', picture: 'jbl_blue.png', stock: 30, price: 1299000.00, ...ts },
      { variant_id: variantIds[2], product_id: productIds[0], name: 'Red', picture: 'jbl_red.png', stock: 25, price: 1349000.00, ...ts },
      // Earbuds TWS ProMax
      { variant_id: variantIds[3], product_id: productIds[1], name: 'Pearl White', picture: 'tws_white.png', stock: 50, price: 599000.00, ...ts },
      { variant_id: variantIds[4], product_id: productIds[1], name: 'Midnight Black', picture: 'tws_black.png', stock: 45, price: 599000.00, ...ts },
      // Smartwatch Xtreme
      { variant_id: variantIds[5], product_id: productIds[2], name: 'Black Strap', picture: 'watch_black.png', stock: 35, price: 899000.00, ...ts },
      { variant_id: variantIds[6], product_id: productIds[2], name: 'Brown Leather', picture: 'watch_brown.png', stock: 20, price: 949000.00, ...ts },
      // Power Bank
      { variant_id: variantIds[7], product_id: productIds[3], name: 'White', picture: 'pb_white.png', stock: 60, price: 449000.00, ...ts },
      { variant_id: variantIds[8], product_id: productIds[3], name: 'Black', picture: 'pb_black.png', stock: 55, price: 449000.00, ...ts },
      // Sneakers Panda
      { variant_id: variantIds[9], product_id: productIds[4], name: 'Size 39', picture: 'panda_39.png', stock: 20, price: 379000.00, ...ts },
      { variant_id: variantIds[10], product_id: productIds[4], name: 'Size 40', picture: 'panda_40.png', stock: 25, price: 379000.00, ...ts },
      { variant_id: variantIds[11], product_id: productIds[4], name: 'Size 42', picture: 'panda_42.png', stock: 15, price: 379000.00, ...ts },
      // Running Shoes
      { variant_id: variantIds[12], product_id: productIds[5], name: 'Navy - 40', picture: 'run_navy_40.png', stock: 18, price: 459000.00, ...ts },
      { variant_id: variantIds[13], product_id: productIds[5], name: 'Green - 41', picture: 'run_green_41.png', stock: 14, price: 459000.00, ...ts },
      // Tote Bag
      { variant_id: variantIds[14], product_id: productIds[6], name: 'Natural', picture: 'tote_natural.png', stock: 40, price: 129000.00, ...ts },
      { variant_id: variantIds[15], product_id: productIds[6], name: 'Black', picture: 'tote_black.png', stock: 35, price: 129000.00, ...ts },
      // Sling Bag
      { variant_id: variantIds[16], product_id: productIds[7], name: 'Brown', picture: 'sling_brown.png', stock: 22, price: 199000.00, ...ts },
      { variant_id: variantIds[17], product_id: productIds[7], name: 'Black', picture: 'sling_black.png', stock: 20, price: 199000.00, ...ts },
      // Keripik Tempe
      { variant_id: variantIds[18], product_id: productIds[8], name: 'Pedas Level 1', picture: 'tempe_l1.png', stock: 100, price: 25000.00, ...ts },
      { variant_id: variantIds[19], product_id: productIds[8], name: 'Pedas Level 3', picture: 'tempe_l3.png', stock: 80, price: 25000.00, ...ts },
      // Brownies
      { variant_id: variantIds[20], product_id: productIds[9], name: 'Original', picture: 'brownies_orig.png', stock: 60, price: 45000.00, ...ts },
      { variant_id: variantIds[21], product_id: productIds[9], name: 'Cheese', picture: 'brownies_cheese.png', stock: 50, price: 49000.00, ...ts },
      // Granola
      { variant_id: variantIds[22], product_id: productIds[10], name: '250gr', picture: 'granola_250.png', stock: 70, price: 39000.00, ...ts },
      { variant_id: variantIds[23], product_id: productIds[10], name: '500gr', picture: 'granola_500.png', stock: 55, price: 69000.00, ...ts },
      // Choco Crispy Bar
      { variant_id: variantIds[24], product_id: productIds[11], name: 'Dark Choco', picture: 'choco_dark.png', stock: 90, price: 19000.00, ...ts },
      { variant_id: variantIds[25], product_id: productIds[11], name: 'Milk Choco', picture: 'choco_milk.png', stock: 85, price: 19000.00, ...ts },
      // Serum Vitamin C
      { variant_id: variantIds[26], product_id: productIds[12], name: '20ml', picture: 'serum_20.png', stock: 80, price: 129000.00, ...ts },
      { variant_id: variantIds[27], product_id: productIds[12], name: '50ml', picture: 'serum_50.png', stock: 60, price: 229000.00, ...ts },
      // Moisturizer
      { variant_id: variantIds[28], product_id: productIds[13], name: 'For Oily Skin', picture: 'moist_oily.png', stock: 65, price: 99000.00, ...ts },
      { variant_id: variantIds[29], product_id: productIds[13], name: 'For Dry Skin', picture: 'moist_dry.png', stock: 60, price: 99000.00, ...ts },
      // Sunscreen
      { variant_id: variantIds[30], product_id: productIds[14], name: '30ml Travel', picture: 'sun_30.png', stock: 90, price: 79000.00, ...ts },
      { variant_id: variantIds[31], product_id: productIds[14], name: '60ml Regular', picture: 'sun_60.png', stock: 75, price: 129000.00, ...ts },
      // Toner
      { variant_id: variantIds[32], product_id: productIds[15], name: '100ml', picture: 'toner_100.png', stock: 85, price: 89000.00, ...ts },
      { variant_id: variantIds[33], product_id: productIds[15], name: '200ml', picture: 'toner_200.png', stock: 70, price: 149000.00, ...ts },
    ]);

    // ── 9. CartItems ─────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('CartItems', [
      // Bagas
      { user_id: userIds[5], variant_id: variantIds[0], quantity: 1, is_selected: true, ...ts },
      { user_id: userIds[5], variant_id: variantIds[3], quantity: 1, is_selected: true, ...ts },
      { user_id: userIds[5], variant_id: variantIds[9], quantity: 2, is_selected: false, ...ts },
      { user_id: userIds[5], variant_id: variantIds[22], quantity: 1, is_selected: true, ...ts },
      // Cantika
      { user_id: userIds[6], variant_id: variantIds[26], quantity: 2, is_selected: true, ...ts },
      { user_id: userIds[6], variant_id: variantIds[30], quantity: 1, is_selected: true, ...ts },
      { user_id: userIds[6], variant_id: variantIds[14], quantity: 1, is_selected: false, ...ts },
      { user_id: userIds[6], variant_id: variantIds[20], quantity: 3, is_selected: true, ...ts },
    ]);

    // ── 10. Orders ───────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('Orders', [
      // Bagas orders
      { order_id: orderIds[0], customer_id: userIds[5], shop_id: shopIds[0], address_id: addressIds[5], status: 'completed', amount_paid: 1299000.00, ...ts },
      { order_id: orderIds[1], customer_id: userIds[5], shop_id: shopIds[0], address_id: addressIds[5], status: 'completed', amount_paid: 599000.00, ...ts },
      { order_id: orderIds[2], customer_id: userIds[5], shop_id: shopIds[1], address_id: addressIds[5], status: 'pending', amount_paid: 379000.00, ...ts },
      { order_id: orderIds[3], customer_id: userIds[5], shop_id: shopIds[1], address_id: addressIds[5], status: 'cancelled', amount_paid: 459000.00, ...ts },
      { order_id: orderIds[4], customer_id: userIds[5], shop_id: shopIds[2], address_id: addressIds[5], status: 'completed', amount_paid: 89000.00, ...ts },
      { order_id: orderIds[5], customer_id: userIds[5], shop_id: shopIds[2], address_id: addressIds[5], status: 'pending', amount_paid: 45000.00, ...ts },
      { order_id: orderIds[6], customer_id: userIds[5], shop_id: shopIds[3], address_id: addressIds[5], status: 'completed', amount_paid: 229000.00, ...ts },
      // Cantika orders
      { order_id: orderIds[7], customer_id: userIds[6], shop_id: shopIds[3], address_id: addressIds[6], status: 'completed', amount_paid: 129000.00, ...ts },
      { order_id: orderIds[8], customer_id: userIds[6], shop_id: shopIds[3], address_id: addressIds[6], status: 'completed', amount_paid: 99000.00, ...ts },
      { order_id: orderIds[9], customer_id: userIds[6], shop_id: shopIds[3], address_id: addressIds[6], status: 'pending', amount_paid: 89000.00, ...ts },
      { order_id: orderIds[10], customer_id: userIds[6], shop_id: shopIds[1], address_id: addressIds[6], status: 'completed', amount_paid: 129000.00, ...ts },
      { order_id: orderIds[11], customer_id: userIds[6], shop_id: shopIds[1], address_id: addressIds[6], status: 'pending', amount_paid: 199000.00, ...ts },
      { order_id: orderIds[12], customer_id: userIds[6], shop_id: shopIds[2], address_id: addressIds[6], status: 'completed', amount_paid: 114000.00, ...ts },
      { order_id: orderIds[13], customer_id: userIds[6], shop_id: shopIds[0], address_id: addressIds[6], status: 'completed', amount_paid: 899000.00, ...ts },
    ]);

    // ── 11. OrderItems ───────────────────────────────────────────────────────
    await queryInterface.bulkInsert('OrderItems', [
      { order_id: orderIds[0], variant_id: variantIds[0], quantity: 1, ...ts },
      { order_id: orderIds[1], variant_id: variantIds[3], quantity: 1, ...ts },
      { order_id: orderIds[2], variant_id: variantIds[9], quantity: 1, ...ts },
      { order_id: orderIds[3], variant_id: variantIds[12], quantity: 1, ...ts },
      { order_id: orderIds[4], variant_id: variantIds[18], quantity: 2, ...ts },
      { order_id: orderIds[4], variant_id: variantIds[24], quantity: 2, ...ts },
      { order_id: orderIds[5], variant_id: variantIds[20], quantity: 1, ...ts },
      { order_id: orderIds[6], variant_id: variantIds[26], quantity: 1, ...ts },
      { order_id: orderIds[6], variant_id: variantIds[30], quantity: 1, ...ts },
      { order_id: orderIds[7], variant_id: variantIds[27], quantity: 1, ...ts },
      { order_id: orderIds[8], variant_id: variantIds[28], quantity: 1, ...ts },
      { order_id: orderIds[9], variant_id: variantIds[32], quantity: 1, ...ts },
      { order_id: orderIds[10], variant_id: variantIds[14], quantity: 1, ...ts },
      { order_id: orderIds[11], variant_id: variantIds[16], quantity: 1, ...ts },
      { order_id: orderIds[12], variant_id: variantIds[21], quantity: 1, ...ts },
      { order_id: orderIds[12], variant_id: variantIds[25], quantity: 3, ...ts },
      { order_id: orderIds[13], variant_id: variantIds[5], quantity: 1, ...ts },
    ]);

    // ── 12. VouchersUsed ─────────────────────────────────────────────────────
    await queryInterface.bulkInsert('VouchersUsed', [
      { voucher_id: voucherIds[0], order_id: orderIds[0], ...ts },
      { voucher_id: voucherIds[1], order_id: orderIds[4], ...ts },
      { voucher_id: voucherIds[2], order_id: orderIds[7], ...ts },
      { voucher_id: voucherIds[3], order_id: orderIds[12], ...ts },
    ]);

    // ── 13. Likes ─────────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('Likes', [
      { user_id: userIds[5], product_id: productIds[0], createdAt: now },
      { user_id: userIds[5], product_id: productIds[4], createdAt: now },
      { user_id: userIds[5], product_id: productIds[8], createdAt: now },
      { user_id: userIds[6], product_id: productIds[12], createdAt: now },
      { user_id: userIds[6], product_id: productIds[14], createdAt: now },
      { user_id: userIds[6], product_id: productIds[6], createdAt: now },
    ]);

    // ── 14. Wishlists ────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('Wishlists', [
      { user_id: userIds[5], product_id: productIds[2], createdAt: now },
      { user_id: userIds[5], product_id: productIds[9], createdAt: now },
      { user_id: userIds[5], product_id: productIds[13], createdAt: now },
      { user_id: userIds[6], product_id: productIds[1], createdAt: now },
      { user_id: userIds[6], product_id: productIds[5], createdAt: now },
      { user_id: userIds[6], product_id: productIds[15], createdAt: now },
    ]);

    // ── 15. Ratings ──────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('Ratings', [
      { user_id: userIds[5], product_id: productIds[0], value: 5.0, title: 'Suaranya mantap!', description: 'Bass kenceng, cocok buat outdoor. Recommended banget.', picture: null, ...ts },
      { user_id: userIds[5], product_id: productIds[1], value: 4.5, title: 'ANC-nya keren', description: 'Noise cancelling-nya efektif banget, puas pake ini.', picture: null, ...ts },
      { user_id: userIds[5], product_id: productIds[8], value: 5.0, title: 'Ketagihan!', description: 'Gurih dan pedasnya pas, kemasan rapi, cepat sampai.', picture: null, ...ts },
      { user_id: userIds[5], product_id: productIds[12], value: 4.0, title: 'Glowing beneran', description: 'Setelah 2 minggu pake muka jadi lebih cerah, suka!', picture: null, ...ts },
      { user_id: userIds[6], product_id: productIds[12], value: 5.0, title: 'HG serum aku!', description: 'Teksturnya ringan, ga bikin gerah, kulit cerah natural.', picture: null, ...ts },
      { user_id: userIds[6], product_id: productIds[14], value: 4.5, title: 'Sunscreen terbaik', description: 'Ga ada white cast, ga lengket, cocok buat kulit berminyak.', picture: null, ...ts },
      { user_id: userIds[6], product_id: productIds[6], value: 4.0, title: 'Tasnya bagus', description: 'Bahan oke, jahitannya rapi, muat banyak barang.', picture: null, ...ts },
      { user_id: userIds[6], product_id: productIds[9], value: 5.0, title: 'Enak banget!', description: 'Brownies paling fudgy yang pernah aku coba. Wajib beli lagi!', picture: null, ...ts },
    ]);

    // ── 16. Chats ─────────────────────────────────────────────────────────────
    await queryInterface.bulkInsert('Chats', [
      { chat_id: chatIds[0], user_id: userIds[5], shop_id: shopIds[0], sender_role: 'customer', message: 'Halo kak, JBL Flip 6 warna merah masih ready?', ...ts },
      { chat_id: chatIds[1], user_id: userIds[5], shop_id: shopIds[0], sender_role: 'seller', message: 'Masih ready kak, mau pesan berapa unit?', ...ts },
      { chat_id: chatIds[2], user_id: userIds[5], shop_id: shopIds[2], sender_role: 'customer', message: 'Granola bisa custom rasa ga kak?', ...ts },
      { chat_id: chatIds[3], user_id: userIds[5], shop_id: shopIds[2], sender_role: 'seller', message: 'Untuk saat ini belum bisa custom kak, tapi ada 3 varian tersedia.', ...ts },
      { chat_id: chatIds[4], user_id: userIds[6], shop_id: shopIds[3], sender_role: 'customer', message: 'Kak serum vitamin C-nya cocok ga buat kulit sensitif?', ...ts },
      { chat_id: chatIds[5], user_id: userIds[6], shop_id: shopIds[3], sender_role: 'seller', message: 'Bisa kak, formulanya sudah dermatologist tested dan hypoallergenic.', ...ts },
      { chat_id: chatIds[6], user_id: userIds[6], shop_id: shopIds[1], sender_role: 'customer', message: 'Sneakers panda ada size 41 ga kak?', ...ts },
      { chat_id: chatIds[7], user_id: userIds[6], shop_id: shopIds[1], sender_role: 'seller', message: 'Maaf kak, size 41 sedang kosong, ETA 2 minggu lagi.', ...ts },
      { chat_id: chatIds[8], user_id: userIds[5], shop_id: shopIds[1], sender_role: 'customer', message: 'Tote bag natural bisa dapat diskon beli 2?', ...ts },
      { chat_id: chatIds[9], user_id: userIds[5], shop_id: shopIds[1], sender_role: 'seller', message: 'Bisa kak! Beli 2 diskon 10%, hubungi kami untuk kode promo.', ...ts },
    ]);

    // ── 17. Notifications ────────────────────────────────────────────────────
    await queryInterface.bulkInsert('Notifications', [
      { notification_id: notifIds[0], user_id: userIds[5], subject: 'Pesanan Dikonfirmasi', message: 'Pesanan #001 Anda telah dikonfirmasi oleh penjual.', ...ts },
      { notification_id: notifIds[1], user_id: userIds[5], subject: 'Pesanan Selesai', message: 'Pesanan JBL Flip 6 telah berhasil diterima. Terima kasih!', ...ts },
      { notification_id: notifIds[2], user_id: userIds[5], subject: 'Promo Flash!', message: 'Gunakan kode FLASH100 untuk diskon Rp100.000 hari ini saja!', ...ts },
      { notification_id: notifIds[3], user_id: userIds[5], subject: 'Selamat Datang!', message: 'Akun Anda berhasil dibuat. Mulai belanja sekarang di ShopTok!', ...ts },
      { notification_id: notifIds[4], user_id: userIds[6], subject: 'Pesanan Dikonfirmasi', message: 'Pesanan Serum Vitamin C Anda sedang diproses oleh penjual.', ...ts },
      { notification_id: notifIds[5], user_id: userIds[6], subject: 'Pesanan Selesai', message: 'Sunscreen SPF 50 telah diterima. Jangan lupa beri ulasan ya!', ...ts },
      { notification_id: notifIds[6], user_id: userIds[6], subject: 'Voucher Baru!', message: 'Voucher LOYAL15 sudah tersedia di akun kamu. Segera gunakan!', ...ts },
      { notification_id: notifIds[7], user_id: userIds[6], subject: 'Selamat Datang!', message: 'Hai Cantika, selamat bergabung di ShopTok. Belanja yuk!', ...ts },
    ]);
  },

  async down(queryInterface) {
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
    await queryInterface.bulkUpdate('Users', { address_id: null }, {});
    await queryInterface.bulkDelete('Addresses', null, {});
    await queryInterface.bulkDelete('Categories', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  },
};