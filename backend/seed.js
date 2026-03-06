const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('./models/Product');
const User = require('./models/User');

const products = [
  {
    name: 'iPhone 15 Pro Max 256GB',
    description: 'The most powerful iPhone ever with A17 Pro chip, titanium design, and a 48MP main camera.',
    price: 134900,
    originalPrice: 159900,
    discount: 16,
    category: 'Mobiles',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500'
    ],
    stock: 50,
    rating: 4.8,
    numReviews: 1240,
    isFeatured: true,
    seller: 'Apple India Authorized',
    specifications: [
      { key: 'Processor', value: 'A17 Pro' },
      { key: 'RAM', value: '8GB' },
      { key: 'Storage', value: '256GB' },
      { key: 'Display', value: '6.7 inch Super Retina XDR' },
      { key: 'Battery', value: '4422 mAh' }
    ],
    tags: ['apple', 'iphone', 'smartphone', '5g']
  },
  {
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Galaxy AI is here. Experience the power of Samsung Galaxy S24 Ultra with built-in S Pen.',
    price: 129999,
    originalPrice: 149999,
    discount: 13,
    category: 'Mobiles',
    brand: 'Samsung',
    images: [
      'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500'
    ],
    stock: 35,
    rating: 4.7,
    numReviews: 890,
    isFeatured: true,
    seller: 'Samsung India Official',
    specifications: [
      { key: 'Processor', value: 'Snapdragon 8 Gen 3' },
      { key: 'RAM', value: '12GB' },
      { key: 'Storage', value: '256GB' },
      { key: 'Camera', value: '200MP' }
    ],
    tags: ['samsung', 'galaxy', 's24', 'android', '5g']
  },
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    description: 'Industry-leading noise canceling with two processors and eight microphones.',
    price: 24990,
    originalPrice: 34990,
    discount: 29,
    category: 'Electronics',
    brand: 'Sony',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'
    ],
    stock: 80,
    rating: 4.9,
    numReviews: 3420,
    isFeatured: true,
    seller: 'Sony India',
    specifications: [
      { key: 'Type', value: 'Over-ear' },
      { key: 'Battery', value: '30 hours' },
      { key: 'Noise Canceling', value: 'Yes' },
      { key: 'Connectivity', value: 'Bluetooth 5.2' }
    ],
    tags: ['headphones', 'wireless', 'noise canceling', 'sony']
  },
  {
    name: 'MacBook Air M3 13-inch',
    description: 'Supercharged by M3, MacBook Air is more capable than ever. With up to 18 hours of battery life.',
    price: 114900,
    originalPrice: 124900,
    discount: 8,
    category: 'Electronics',
    brand: 'Apple',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'
    ],
    stock: 25,
    rating: 4.9,
    numReviews: 567,
    isFeatured: true,
    seller: 'Apple India Authorized',
    specifications: [
      { key: 'Chip', value: 'Apple M3' },
      { key: 'RAM', value: '16GB' },
      { key: 'Storage', value: '512GB SSD' },
      { key: 'Display', value: '13.6 inch Liquid Retina' }
    ],
    tags: ['macbook', 'laptop', 'apple', 'm3']
  },
  {
    name: 'Nike Air Max 270 Running Shoes',
    description: 'Breathable, comfortable running shoes with Max Air unit for all-day cushioning.',
    price: 8995,
    originalPrice: 12995,
    discount: 31,
    category: 'Sports',
    brand: 'Nike',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'
    ],
    stock: 120,
    rating: 4.5,
    numReviews: 2100,
    isFeatured: false,
    seller: 'Nike India Official',
    tags: ['nike', 'shoes', 'running', 'sports']
  },
  {
    name: 'Levi\'s 511 Slim Fit Jeans',
    description: 'Classic slim fit jeans with stretch technology for comfort and style.',
    price: 2299,
    originalPrice: 3999,
    discount: 43,
    category: 'Fashion',
    brand: 'Levi\'s',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'
    ],
    stock: 200,
    rating: 4.3,
    numReviews: 4500,
    seller: 'Levi\'s Authorized Store',
    tags: ['jeans', 'fashion', 'levis', 'denim']
  },
  {
    name: 'Instant Pot Duo 7-in-1 Pressure Cooker',
    description: 'The world\'s best multi-cooker. Replaces 7 kitchen appliances in one.',
    price: 6999,
    originalPrice: 9999,
    discount: 30,
    category: 'Appliances',
    brand: 'Instant Pot',
    images: [
      'https://images.unsplash.com/photo-1585515320310-259814833e62?w=500'
    ],
    stock: 60,
    rating: 4.6,
    numReviews: 8900,
    isFeatured: true,
    seller: 'Kitchen Essentials',
    tags: ['pressure cooker', 'kitchen', 'appliances', 'cooking']
  },
  {
    name: 'boAt Airdopes 141 TWS Earbuds',
    description: 'True wireless stereo earbuds with 42 hours total playback and IPX4 water resistance.',
    price: 999,
    originalPrice: 2990,
    discount: 67,
    category: 'Electronics',
    brand: 'boAt',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500'
    ],
    stock: 500,
    rating: 4.1,
    numReviews: 15000,
    isFeatured: false,
    seller: 'boAt Lifestyle',
    tags: ['earbuds', 'tws', 'wireless', 'boat']
  },
  {
    name: 'LG 55" 4K OLED Smart TV',
    description: 'Self-lit OLED pixels deliver perfect blacks, brilliant colors and stunning picture quality.',
    price: 89999,
    originalPrice: 139999,
    discount: 36,
    category: 'Electronics',
    brand: 'LG',
    images: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500'
    ],
    stock: 15,
    rating: 4.7,
    numReviews: 678,
    isFeatured: true,
    seller: 'LG India Official',
    tags: ['tv', 'oled', '4k', 'smart tv', 'lg']
  },
  {
    name: 'The Psychology of Money',
    description: 'Timeless lessons on wealth, greed, and happiness by Morgan Housel.',
    price: 299,
    originalPrice: 499,
    discount: 40,
    category: 'Books',
    brand: 'Jaico Publishing',
    images: [
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500'
    ],
    stock: 300,
    rating: 4.8,
    numReviews: 12000,
    seller: 'FlitCart Books',
    tags: ['books', 'finance', 'self-help', 'money']
  },
  {
    name: 'Dyson V15 Detect Cordless Vacuum',
    description: 'Laser detects microscopic dust. Intelligently adapts suction to deep clean every floor type.',
    price: 49900,
    originalPrice: 59900,
    discount: 17,
    category: 'Appliances',
    brand: 'Dyson',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500'
    ],
    stock: 20,
    rating: 4.6,
    numReviews: 340,
    isFeatured: false,
    seller: 'Dyson India',
    tags: ['vacuum', 'dyson', 'cordless', 'cleaning']
  },
  {
    name: 'Himalaya Neem Face Wash 150ml',
    description: 'Purifying neem face wash with natural ingredients for clear, healthy skin.',
    price: 120,
    originalPrice: 150,
    discount: 20,
    category: 'Beauty',
    brand: 'Himalaya',
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500'
    ],
    stock: 1000,
    rating: 4.4,
    numReviews: 25000,
    seller: 'Himalaya Wellness',
    tags: ['face wash', 'skincare', 'beauty', 'himalaya']
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/flitcart');
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`✅ Seeded ${products.length} products`);

    // Create admin user
    await User.deleteMany({ email: 'admin@flitcart.com' });
    await User.create({
      name: 'Admin User',
      email: 'admin@flitcart.com',
      password: 'admin123',
      role: 'admin'
    });
    console.log('✅ Admin user: admin@flitcart.com / admin123');

    mongoose.disconnect();
    console.log('Done!');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
