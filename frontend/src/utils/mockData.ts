import type { Product, User, Order, Review } from '../types';

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Wireless Bluetooth Headphones',
    description: 'High quality wireless headphones with noise cancellation and 20-hour battery life.',
    price: 79.99,
    category: 'Electronics',
    image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    stock_quantity: 50,
  },
  {
    id: 'p2',
    name: 'Smart Fitness Watch',
    description: 'Track your steps, heart rate, and sleep with our latest smart fitness watch.',
    price: 149.99,
    category: 'Electronics',
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    stock_quantity: 30,
  },
  {
    id: 'p3',
    name: 'Organic Cotton T-Shirt',
    description: 'Soft, breathable organic cotton t-shirt for everyday wear.',
    price: 29.99,
    category: 'Fashion',
    image_url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop',
    stock_quantity: 100,
  },
  {
    id: 'p4',
    name: 'Modern Desk Lamp',
    description: 'Minimalist brass desk lamp with adjustable arm and warm LED light.',
    price: 45.99,
    category: 'Home & Living',
    image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop',
    stock_quantity: 20,
  },
  {
    id: 'p5',
    name: 'Running Shoes Pro',
    description: 'Lightweight professional running shoes for maximum comfort and speed.',
    price: 119.99,
    category: 'Sports',
    image_url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    stock_quantity: 40,
  },
  {
    id: 'p6',
    name: 'Leather Crossbody Bag',
    description: 'Premium genuine leather bag with adjustable strap and interior pockets.',
    price: 89.99,
    category: 'Fashion',
    image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=300&fit=crop',
    stock_quantity: 15,
  },
  {
    id: 'p7',
    name: 'Portable Bluetooth Speaker',
    description: 'Waterproof portable speaker with deep bass and 12-hour playtime.',
    price: 59.99,
    category: 'Electronics',
    image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop',
    stock_quantity: 60,
  },
  {
    id: 'p8',
    name: 'Ceramic Plant Pot Set',
    description: 'Set of 3 minimalist ceramic plant pots in varying sizes with drainage holes.',
    price: 34.99,
    category: 'Home & Living',
    image_url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=300&fit=crop',
    stock_quantity: 25,
  },
  {
    id: 'p9',
    name: 'Yoga Mat Premium',
    description: 'Non-slip premium yoga mat with alignment lines',
    price: 39.99,
    category: 'Sports',
    image_url: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=400&h=300&fit=crop',
    stock_quantity: 55,
  },
  {
    id: 'p10',
    name: 'Stainless Steel Water Bottle',
    description: 'Insulated water bottle keeps drinks cold for 24h or hot for 12h.',
    price: 24.99,
    category: 'Sports',
    image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop',
    stock_quantity: 80,
  },
  {
    id: 'p11',
    name: 'Wireless Charging Pad',
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices.',
    price: 35.99,
    category: 'Electronics',
    image_url: 'https://images.unsplash.com/photo-1615526675159-e248c3021d3f?w=400&h=300&fit=crop',
    stock_quantity: 45,
  },
  {
    id: 'p12',
    name: 'Linen Throw Pillow Set',
    description: 'Set of 2 soft natural linen throw pillows with inserts included.',
    price: 49.99,
    category: 'Home & Living',
    image_url: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&h=300&fit=crop',
    stock_quantity: 35,
  },
  { id: 'p13', name: 'Classic Denim Jacket', description: 'Timeless denim jacket for all seasons', price: 69.99, category: 'Fashion', image_url: 'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&h=300&fit=crop', stock_quantity: 40 },
  { id: 'p14', name: 'Floral Summer Dress', description: 'Light and breezy floral dress for summer', price: 49.99, category: 'Fashion', image_url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=300&fit=crop', stock_quantity: 35 },
  { id: 'p15', name: 'Slim Fit Chino Pants', description: 'Comfortable slim fit chinos for everyday wear', price: 44.99, category: 'Fashion', image_url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=300&fit=crop', stock_quantity: 50 },
  { id: 'p16', name: 'Wool Blend Scarf', description: 'Soft wool blend scarf for cold weather', price: 24.99, category: 'Fashion', image_url: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=300&fit=crop', stock_quantity: 60 },
  { id: 'p17', name: 'Canvas Sneakers', description: 'Classic canvas sneakers in white', price: 54.99, category: 'Fashion', image_url: 'https://images.unsplash.com/photo-1465453869711-7e174808ace9?w=400&h=300&fit=crop', stock_quantity: 45 },
  { id: 'p18', name: 'Aviator Sunglasses', description: 'UV400 protection aviator sunglasses', price: 34.99, category: 'Fashion', image_url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=300&fit=crop', stock_quantity: 55 },
  { id: 'p19', name: 'Scented Soy Candle Set', description: 'Set of 3 hand-poured soy wax candles', price: 39.99, category: 'Home & Living', image_url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=400&h=300&fit=crop', stock_quantity: 40 },
  { id: 'p20', name: 'Bamboo Cutting Board', description: 'Eco-friendly bamboo cutting board set', price: 29.99, category: 'Home & Living', image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', stock_quantity: 35 },
  { id: 'p21', name: 'Wall Art Print Set', description: 'Set of 3 minimalist wall art prints', price: 44.99, category: 'Home & Living', image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&h=300&fit=crop', stock_quantity: 25 },
  { id: 'p22', name: 'Cotton Knit Throw Blanket', description: 'Cozy cotton knit blanket for the sofa', price: 59.99, category: 'Home & Living', image_url: 'https://images.unsplash.com/photo-1580301762395-21ce84d00bc6?w=400&h=300&fit=crop', stock_quantity: 30 },
  { id: 'p23', name: 'Marble Serving Board', description: 'Elegant marble and wood serving board for entertaining', price: 54.99, category: 'Home & Living', image_url: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=400&h=300&fit=crop', stock_quantity: 20 },
  { id: 'p24', name: 'Adjustable Dumbbell Set', description: 'Space-saving adjustable dumbbells 5-25kg', price: 149.99, category: 'Sports', image_url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop', stock_quantity: 20 },
  { id: 'p25', name: 'Cycling Helmet', description: 'Lightweight aerodynamic cycling helmet with ventilation', price: 79.99, category: 'Sports', image_url: 'https://images.unsplash.com/photo-1582996269871-dad1e4adbbc7?w=400&h=300&fit=crop', stock_quantity: 25 },
  { id: 'p26', name: 'Swimming Goggles Pro', description: 'Anti-fog UV protection swimming goggles', price: 19.99, category: 'Sports', image_url: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=300&fit=crop', stock_quantity: 60 },
  { id: 'p27', name: 'Jump Rope Speed Cable', description: 'Professional speed jump rope with bearings', price: 14.99, category: 'Sports', image_url: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&h=300&fit=crop', stock_quantity: 80 },
  { id: 'p28', name: 'Foam Roller Massage', description: 'High density foam roller for muscle recovery', price: 29.99, category: 'Sports', image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', stock_quantity: 45 },
  { id: 'p29', name: 'Smart Home Speaker', description: 'Voice controlled smart speaker with AI assistant', price: 99.99, category: 'Electronics', image_url: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400&h=300&fit=crop', stock_quantity: 30 },
  { id: 'p30', name: 'USB-C Hub 7-in-1', description: '7 port USB-C hub with HDMI and card reader', price: 49.99, category: 'Electronics', image_url: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&h=300&fit=crop', stock_quantity: 45 },
  { id: 'p31', name: 'Mechanical Keyboard', description: 'Compact RGB mechanical gaming keyboard', price: 89.99, category: 'Electronics', image_url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop', stock_quantity: 25 },
  { id: 'p32', name: 'Laptop Stand Aluminium', description: 'Adjustable aluminium laptop stand for desk', price: 39.99, category: 'Electronics', image_url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop', stock_quantity: 40 }
];

export const mockUsers: User[] = [
  {
    id: 'u1',
    email: 'customer@shopease.com',
    full_name: 'John Customer',
    role: 'customer'
  },
  {
    id: 'u2',
    email: 'admin@shopease.com',
    full_name: 'Jane Admin',
    role: 'admin'
  }
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-1001',
    user_id: 'u1',
    status: 'delivered',
    total_amount: 154.98,
    shipping_address: { city: 'New York', country: 'USA' },
    created_at: '2026-03-25T10:30:00Z'
  },
  {
    id: 'ORD-1002',
    user_id: 'u1',
    status: 'pending',
    total_amount: 89.99,
    shipping_address: { city: 'New York', country: 'USA' },
    created_at: '2026-04-01T14:20:00Z'
  },
  {
    id: 'ORD-1003',
    user_id: 'u2',
    status: 'shipped',
    total_amount: 239.98,
    shipping_address: { city: 'London', country: 'UK' },
    created_at: '2026-03-28T09:15:00Z'
  },
  {
    id: 'ORD-1004',
    user_id: 'u3',
    status: 'processing',
    total_amount: 45.99,
    shipping_address: { city: 'Toronto', country: 'Canada' },
    created_at: '2026-04-02T16:45:00Z'
  },
  {
    id: 'ORD-1005',
    user_id: 'u4',
    status: 'cancelled',
    total_amount: 119.99,
    shipping_address: { city: 'Sydney', country: 'Australia' },
    created_at: '2026-03-20T11:10:00Z'
  },
  {
    id: 'ORD-1006',
    user_id: 'u5',
    status: 'delivered',
    total_amount: 29.99,
    shipping_address: { city: 'Berlin', country: 'Germany' },
    created_at: '2026-03-15T08:30:00Z'
  }
];

export const mockReviews: Review[] = [
  {
    id: 'r1',
    product_id: 'p1',
    user_name: 'Sarah Smith',
    rating: 5,
    comment: 'These are amazing! The noise cancellation is perfect for my daily commute.',
    created_at: '2026-03-10T10:00:00Z'
  },
  {
    id: 'r2',
    product_id: 'p1',
    user_name: 'Mark Johnson',
    rating: 4,
    comment: 'Great sound quality but a little tight on the ears after a few hours.',
    created_at: '2026-03-15T14:30:00Z'
  },
  {
    id: 'r3',
    product_id: 'p1',
    user_name: 'Emily Davis',
    rating: 5,
    comment: 'Battery life is incredible. Worth every penny!',
    created_at: '2026-03-20T09:15:00Z'
  }
];
