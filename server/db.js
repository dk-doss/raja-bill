import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DEFAULT_CATEGORIES = [
  { id: 'cat-groceries', name: 'Groceries & Staples', slug: 'groceries', icon: '🌾', sortOrder: 1 },
  { id: 'cat-snacks', name: 'Snacks & Biscuits', slug: 'snacks', icon: '🍿', sortOrder: 2 },
  { id: 'cat-beverages', name: 'Beverages & Drinks', slug: 'beverages', icon: '☕', sortOrder: 3 },
  { id: 'cat-household', name: 'Household & Cleaning', slug: 'household', icon: '🧼', sortOrder: 4 },
  { id: 'cat-personal', name: 'Personal Care', slug: 'personal-care', icon: '🧴', sortOrder: 5 },
  { id: 'cat-dairy', name: 'Dairy & Bread', slug: 'dairy-bread', icon: '🥛', sortOrder: 6 },
  { id: 'cat-stationery', name: 'Stationery & Pooja', slug: 'stationery-pooja', icon: '📝', sortOrder: 7 }
];

const DEFAULT_PRODUCTS = [
  // Groceries & Staples
  {
    id: 'prod-101',
    name: 'Aashirvaad Superior MP Atta',
    brand: 'Aashirvaad',
    categoryId: 'cat-groceries',
    packSize: '5 kg',
    price: 320,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80',
    isActive: true,
    description: '100% pure whole wheat flour processed from the finest grains for soft rotis.'
  },
  {
    id: 'prod-102',
    name: 'India Gate Basmati Rice Feast Rozzana',
    brand: 'India Gate',
    categoryId: 'cat-groceries',
    packSize: '5 kg',
    price: 480,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?auto=format&fit=crop&w=500&q=80',
    isActive: true,
    description: 'Aromatic long grain basmati rice, aged to perfection for everyday meals.'
  },
  {
    id: 'prod-103',
    name: 'Tata Salt Vacuum Evaporated Iodised',
    brand: 'Tata Salt',
    categoryId: 'cat-groceries',
    packSize: '1 kg',
    price: 28,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?auto=format&fit=crop&w=500&q=80',
    isActive: true,
    description: 'Desh Ka Namak. Pure vacuum-evaporated iodised salt.'
  },
  {
    id: 'prod-104',
    name: 'Fortune Sunlite Refined Sunflower Oil',
    brand: 'Fortune',
    categoryId: 'cat-groceries',
    packSize: '1 L Pouch',
    price: 145,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=500&q=80',
    isActive: true,
    description: 'Light and healthy sunflower oil rich in Vitamin E.'
  },
  {
    id: 'prod-105',
    name: 'Tata Sampann Unpolished Toor Dal',
    brand: 'Tata Sampann',
    categoryId: 'cat-groceries',
    packSize: '1 kg',
    price: 175,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80',
    isActive: true,
    description: 'Unpolished protein-rich pigeon peas with wholesome natural taste.'
  },
  {
    id: 'prod-106',
    name: 'Madhur Pure & Hygienic Sugar',
    brand: 'Madhur',
    categoryId: 'cat-groceries',
    packSize: '1 kg',
    price: 52,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1622484216805-4f4942ec4cfb?auto=format&fit=crop&w=500&q=80',
    isActive: true,
    description: 'Sulphur-free sparkling white crystal sugar.'
  },
  {
    id: 'prod-107',
    name: 'Everest Turmeric Powder (Haldi)',
    brand: 'Everest',
    categoryId: 'cat-groceries',
    packSize: '200 g',
    price: 62,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=500&q=80',
    isActive: true,
    description: 'Pure ground turmeric with natural golden colour and rich aroma.'
  },
  {
    id: 'prod-108',
    name: 'Tata Sampann Red Chilli Powder',
    brand: 'Tata Sampann',
    categoryId: 'cat-groceries',
    packSize: '200 g',
    price: 78,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=500&q=80',
    isActive: true,
    description: 'Rich red colour with balanced pungency sourced from Guntur farms.'
  },

  // Snacks & Biscuits
  {
    id: 'prod-201',
    name: 'Maggi 2-Minute Instant Noodles',
    brand: 'Maggi',
    categoryId: 'cat-snacks',
    packSize: 'Pack of 4 (280 g)',
    price: 56,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=500&q=80',
    isActive: true,
    description: 'Classic favorite masala noodles made with choicest quality spices.'
  },
  {
    id: 'prod-202',
    name: 'Parle-G Original Gluco Biscuits',
    brand: 'Parle-G',
    categoryId: 'cat-snacks',
    packSize: '800 g Family Pack',
    price: 75,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=500&q=80',
    isActive: true,
    description: 'The iconic glucose biscuit filled with goodness of wheat and milk.'
  },
  {
    id: 'prod-203',
    name: 'Britannia Good Day Butter Cookies',
    brand: 'Britannia',
    categoryId: 'cat-snacks',
    packSize: '600 g',
    price: 110,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=500&q=80',
    isActive: true,
    description: 'Rich buttery cookies with a cheerful smile design on every bite.'
  },
  {
    id: 'prod-204',
    name: "Lay's India's Magic Masala Chips",
    brand: "Lay's",
    categoryId: 'cat-snacks',
    packSize: '50 g',
    price: 20,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=500&q=80',
    isActive: true,
    description: 'Crispy ridged potato chips seasoned with aromatic Indian spices.'
  },
  {
    id: 'prod-205',
    name: 'Kurkure Masala Munch',
    brand: 'Kurkure',
    categoryId: 'cat-snacks',
    packSize: '90 g',
    price: 20,
    stock: 40,
    image: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=500&q=80',
    isActive: true,
    description: 'Tedha hai par mera hai! Crunchy spiced corn puff twisties.'
  },
  {
    id: 'prod-206',
    name: "Haldiram's Nagpur Bhujia Sev",
    brand: "Haldiram's",
    categoryId: 'cat-snacks',
    packSize: '400 g',
    price: 130,
    stock: 22,
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=500&q=80',
    isActive: true,
    description: 'Crispy moth bean and chickpea flour spicy vermicelli.'
  },

  // Beverages & Drinks
  {
    id: 'prod-301',
    name: 'Tata Tea Gold Premium Black Tea',
    brand: 'Tata Tea',
    categoryId: 'cat-beverages',
    packSize: '500 g',
    price: 290,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=500&q=80',
    isActive: true,
    description: 'Finest blend of rich Assam tea leaves with gently rolled long leaves for exquisite aroma.'
  },
  {
    id: 'prod-302',
    name: 'Bru Instant Coffee Granules',
    brand: 'Bru',
    categoryId: 'cat-beverages',
    packSize: '100 g Glass Jar',
    price: 185,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=500&q=80',
    isActive: true,
    description: 'Carefully roasted blend of robusta and arabica coffee beans with chicory.'
  },
  {
    id: 'prod-303',
    name: 'Frooti Fresh Mango Drink',
    brand: 'Frooti',
    categoryId: 'cat-beverages',
    packSize: '1.2 L Bottle',
    price: 70,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=500&q=80',
    isActive: true,
    description: 'Refreshing real mango pulp fruit juice drink.'
  },
  {
    id: 'prod-304',
    name: 'Thums Up Charged Strong Cola',
    brand: 'Thums Up',
    categoryId: 'cat-beverages',
    packSize: '750 ml Pet Bottle',
    price: 45,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=80',
    isActive: true,
    description: 'Taste the Thunder! Intense spicy cola beverage.'
  },
  {
    id: 'prod-305',
    name: 'Horlicks Classic Malt Health Drink',
    brand: 'Horlicks',
    categoryId: 'cat-beverages',
    packSize: '500 g Refill Pack',
    price: 265,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=500&q=80',
    isActive: true,
    description: 'Nutritional malt milk drink packed with 23 vital nutrients.'
  },

  // Household & Cleaning
  {
    id: 'prod-401',
    name: 'Surf Excel Quick Wash Detergent Powder',
    brand: 'Surf Excel',
    categoryId: 'cat-household',
    packSize: '1 kg',
    price: 155,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=500&q=80',
    isActive: true,
    description: 'Removes tough stains in half the time while keeping whites brilliant.'
  },
  {
    id: 'prod-402',
    name: 'Vim Dishwash Bar with Pure Lemon',
    brand: 'Vim',
    categoryId: 'cat-household',
    packSize: '300 g with Tub',
    price: 35,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1585837575652-267c041d77d4?auto=format&fit=crop&w=500&q=80',
    isActive: true,
    description: 'Cuts through grease quickly with 100 lemons power.'
  },
  {
    id: 'prod-403',
    name: 'Harpic Power Plus Disinfectant Toilet Cleaner',
    brand: 'Harpic',
    categoryId: 'cat-household',
    packSize: '500 ml Original',
    price: 98,
    stock: 20,
    image: 'https://images.unsplash.com/photo-1584813470613-5b1c1cad3d69?auto=format&fit=crop&w=500&q=80',
    isActive: true,
    description: 'Kills 99.9% germs and dissolves hard limescale stains.'
  },
  {
    id: 'prod-404',
    name: 'Rin Detergent Bar with Brightness Booster',
    brand: 'Rin',
    categoryId: 'cat-household',
    packSize: '250 g (Pack of 4)',
    price: 72,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=500&q=80',
    isActive: true,
    description: 'Chamatkarik safedi for clothes and collars.'
  },

  // Personal Care
  {
    id: 'prod-501',
    name: 'Dettol Original Bathing Soap Bar',
    brand: 'Dettol',
    categoryId: 'cat-personal',
    packSize: '125 g (Pack of 4)',
    price: 180,
    stock: 28,
    image: 'https://images.unsplash.com/photo-1607006314187-54cf0cefe5f8?auto=format&fit=crop&w=500&q=80',
    isActive: true,
    description: 'Trusted 100% germ protection with pine fragrance.'
  },
  {
    id: 'prod-502',
    name: 'Colgate Strong Teeth Anticavity Toothpaste',
    brand: 'Colgate',
    categoryId: 'cat-personal',
    packSize: '300 g Saver Pack',
    price: 160,
    stock: 35,
    image: 'https://images.unsplash.com/photo-1559567249-663c0a520bf2?auto=format&fit=crop&w=500&q=80',
    isActive: true,
    description: 'Amino Shakti formula adds natural calcium for 2x stronger teeth.'
  },
  {
    id: 'prod-503',
    name: 'Parachute 100% Pure Coconut Hair Oil',
    brand: 'Parachute',
    categoryId: 'cat-personal',
    packSize: '500 ml Easy Pour',
    price: 195,
    stock: 22,
    image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=500&q=80',
    isActive: true,
    description: 'Deep conditioning edible grade coconut oil for strong and shiny hair.'
  },

  // Dairy & Bread
  {
    id: 'prod-601',
    name: 'Amul Pasteurised Salted Butter',
    brand: 'Amul',
    categoryId: 'cat-dairy',
    packSize: '500 g Block',
    price: 275,
    stock: 18,
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=500&q=80',
    isActive: true,
    description: 'Utterly Butterly Delicious! Pure churned fresh dairy butter.'
  },
  {
    id: 'prod-602',
    name: 'Amul Taaza Homogenised Toned Milk',
    brand: 'Amul',
    categoryId: 'cat-dairy',
    packSize: '1 L Tetra Pack',
    price: 74,
    stock: 24,
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=500&q=80',
    isActive: true,
    description: 'Long life UHT toned milk. No boiling required.'
  },
  {
    id: 'prod-603',
    name: 'Modern Fresh Sandwich White Bread',
    brand: 'Modern',
    categoryId: 'cat-dairy',
    packSize: '400 g Loaf',
    price: 45,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=500&q=80',
    isActive: true,
    description: 'Soft, oven-fresh sandwich bread enriched with essential vitamins.'
  },
  {
    id: 'prod-604',
    name: 'Amul Malai Fresh Paneer',
    brand: 'Amul',
    categoryId: 'cat-dairy',
    packSize: '200 g Pack',
    price: 90,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=500&q=80',
    isActive: true,
    description: 'Soft, creamy, melt-in-mouth diced cottage cheese block.'
  },

  // Stationery & Pooja
  {
    id: 'prod-701',
    name: 'Cycle Pure Agarbathies (Lia Jasmine & Flora)',
    brand: 'Cycle',
    categoryId: 'cat-stationery',
    packSize: 'Pack of 2 (120 Sticks)',
    price: 65,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=500&q=80',
    isActive: true,
    description: 'Divine long lasting incense sticks for daily morning pooja and meditation.'
  },
  {
    id: 'prod-702',
    name: 'Classmate Long Ruled Notebook',
    brand: 'Classmate',
    categoryId: 'cat-stationery',
    packSize: '172 Pages (A4)',
    price: 65,
    stock: 30,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80',
    isActive: true,
    description: 'Elemental chlorine-free paper notebook with sturdy binding.'
  }
];

const DEFAULT_STORE_INFO = {
  name: 'RAJA STORE',
  tagline: 'Order from home • Collect at your convenience',
  phone: '+91 98765 43210',
  whatsapp: '+919876543210',
  address: 'Shop #4, Main Bazaar Road, Near Town Clock Tower',
  pickupTimings: '8:00 AM – 9:30 PM (Open All 7 Days)',
  prepEstimate: '10–20 mins',
  isOpen: true,
  announcement: 'Fresh stock arrived! Place your order and pick up ready-packed groceries.'
};

const DEFAULT_ORDERS = [
  {
    id: 'ord-1001',
    orderNumber: 1001,
    orderDisplayNumber: '#1001',
    customerName: 'Ramesh Kumar',
    phone: '9840123456',
    note: 'Please pack in sturdy cloth bags if possible.',
    items: [
      {
        productId: 'prod-101',
        name: 'Aashirvaad Superior MP Atta',
        brand: 'Aashirvaad',
        packSize: '5 kg',
        price: 320,
        quantity: 1,
        subtotal: 320
      },
      {
        productId: 'prod-201',
        name: 'Maggi 2-Minute Instant Noodles',
        brand: 'Maggi',
        packSize: 'Pack of 4 (280 g)',
        price: 56,
        quantity: 2,
        subtotal: 112
      },
      {
        productId: 'prod-601',
        name: 'Amul Pasteurised Salted Butter',
        brand: 'Amul',
        packSize: '500 g Block',
        price: 275,
        quantity: 1,
        subtotal: 275
      }
    ],
    totalAmount: 707,
    status: 'READY FOR COLLECTION',
    statusHistory: [
      { status: 'ORDER RECEIVED', timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), note: 'Order placed by customer' },
      { status: 'ACCEPTED', timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(), note: 'Order accepted by store staff' },
      { status: 'PREPARING', timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(), note: 'Items gathered & packed' },
      { status: 'READY FOR COLLECTION', timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), note: 'Order bag placed on pickup counter' }
    ],
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  },
  {
    id: 'ord-1002',
    orderNumber: 1002,
    orderDisplayNumber: '#1002',
    customerName: 'Priya Sundaram',
    phone: '9876543210',
    note: 'Will pick up on my way back from office around 6:30 PM.',
    items: [
      {
        productId: 'prod-104',
        name: 'Fortune Sunlite Refined Sunflower Oil',
        brand: 'Fortune',
        packSize: '1 L Pouch',
        price: 145,
        quantity: 2,
        subtotal: 290
      },
      {
        productId: 'prod-301',
        name: 'Tata Tea Gold Premium Black Tea',
        brand: 'Tata Tea',
        packSize: '500 g',
        price: 290,
        quantity: 1,
        subtotal: 290
      },
      {
        productId: 'prod-401',
        name: 'Surf Excel Quick Wash Detergent Powder',
        brand: 'Surf Excel',
        packSize: '1 kg',
        price: 155,
        quantity: 1,
        subtotal: 155
      }
    ],
    totalAmount: 735,
    status: 'PREPARING',
    statusHistory: [
      { status: 'ORDER RECEIVED', timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(), note: 'Order placed by customer' },
      { status: 'ACCEPTED', timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), note: 'Order accepted' },
      { status: 'PREPARING', timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), note: 'Packing in progress' }
    ],
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  },
  {
    id: 'ord-1003',
    orderNumber: 1003,
    orderDisplayNumber: '#1003',
    customerName: 'Anand Verma',
    phone: '9123456789',
    note: '',
    items: [
      {
        productId: 'prod-204',
        name: "Lay's India's Magic Masala Chips",
        brand: "Lay's",
        packSize: '50 g',
        price: 20,
        quantity: 3,
        subtotal: 60
      },
      {
        productId: 'prod-304',
        name: 'Thums Up Charged Strong Cola',
        brand: 'Thums Up',
        packSize: '750 ml Pet Bottle',
        price: 45,
        quantity: 2,
        subtotal: 90
      }
    ],
    totalAmount: 150,
    status: 'ORDER RECEIVED',
    statusHistory: [
      { status: 'ORDER RECEIVED', timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(), note: 'New order received' }
    ],
    createdAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 1000).toISOString()
  }
];

class Database {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    if (!fs.existsSync(DB_FILE)) {
      this.resetToDefaults();
    } else {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        // Ensure required collections exist
        if (!this.data.categories) this.data.categories = DEFAULT_CATEGORIES;
        if (!this.data.products) this.data.products = DEFAULT_PRODUCTS;
        if (!this.data.storeInfo) this.data.storeInfo = DEFAULT_STORE_INFO;
        if (!this.data.orders) this.data.orders = DEFAULT_ORDERS;
        if (!this.data.nextOrderNumber) this.data.nextOrderNumber = 1004;
        if (!this.data.auth) this.data.auth = { username: 'admin', password: 'raja123' };
      } catch (err) {
        console.error('Error reading store.json, resetting to defaults:', err);
        this.resetToDefaults();
      }
    }
  }

  persist() {
    try {
      const tempPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, DB_FILE);
    } catch (err) {
      console.error('Error persisting database:', err);
    }
  }

  resetToDefaults() {
    this.data = {
      storeInfo: { ...DEFAULT_STORE_INFO },
      categories: JSON.parse(JSON.stringify(DEFAULT_CATEGORIES)),
      products: JSON.parse(JSON.stringify(DEFAULT_PRODUCTS)),
      orders: JSON.parse(JSON.stringify(DEFAULT_ORDERS)),
      nextOrderNumber: 1004,
      auth: {
        username: 'admin',
        password: 'raja123'
      }
    };
    this.persist();
  }

  // --- STORE INFO ---
  getStoreInfo() {
    return { ...this.data.storeInfo };
  }

  updateStoreInfo(updates) {
    this.data.storeInfo = {
      ...this.data.storeInfo,
      ...updates
    };
    this.persist();
    return this.data.storeInfo;
  }

  // --- AUTH ---
  validateAuth(username, password) {
    if (!this.data.auth) return false;
    return this.data.auth.username === username && this.data.auth.password === password;
  }

  // --- CATEGORIES ---
  getCategories() {
    return [...this.data.categories].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
  }

  getCategoryById(id) {
    return this.data.categories.find(c => c.id === id);
  }

  addCategory({ name, icon, sortOrder }) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = `cat-${Date.now()}`;
    const category = {
      id,
      name: name.trim(),
      slug,
      icon: icon || '📦',
      sortOrder: Number(sortOrder) || (this.data.categories.length + 1)
    };
    this.data.categories.push(category);
    this.persist();
    return category;
  }

  updateCategory(id, updates) {
    const idx = this.data.categories.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.data.categories[idx] = {
      ...this.data.categories[idx],
      ...updates
    };
    this.persist();
    return this.data.categories[idx];
  }

  deleteCategory(id) {
    const idx = this.data.categories.findIndex(c => c.id === id);
    if (idx === -1) return false;
    this.data.categories.splice(idx, 1);
    this.persist();
    return true;
  }

  // --- PRODUCTS ---
  getProducts({ categoryId, search, inStockOnly = false } = {}) {
    let list = this.data.products.filter(p => p.isActive !== false);

    if (categoryId && categoryId !== 'all') {
      list = list.filter(p => p.categoryId === categoryId);
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(p => {
        const cat = this.getCategoryById(p.categoryId);
        const catName = cat ? cat.name.toLowerCase() : '';
        return (
          p.name.toLowerCase().includes(q) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          catName.includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
        );
      });
    }

    if (inStockOnly) {
      list = list.filter(p => p.stock > 0);
    }

    return list;
  }

  getAllProductsAdmin() {
    return [...this.data.products];
  }

  getProductById(id) {
    return this.data.products.find(p => p.id === id);
  }

  addProduct(productData) {
    const id = `prod-${Date.now()}`;
    const newProduct = {
      id,
      name: productData.name.trim(),
      brand: productData.brand ? productData.brand.trim() : '',
      categoryId: productData.categoryId,
      packSize: productData.packSize ? productData.packSize.trim() : '1 unit',
      price: Number(productData.price) || 0,
      stock: Math.max(0, parseInt(productData.stock, 10) || 0),
      image: productData.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80',
      isActive: productData.isActive !== false,
      description: productData.description ? productData.description.trim() : '',
      createdAt: new Date().toISOString()
    };
    this.data.products.unshift(newProduct);
    this.persist();
    return newProduct;
  }

  updateProduct(id, updates) {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.products[idx] = {
      ...this.data.products[idx],
      ...updates,
      price: updates.price !== undefined ? Number(updates.price) : this.data.products[idx].price,
      stock: updates.stock !== undefined ? Math.max(0, parseInt(updates.stock, 10) || 0) : this.data.products[idx].stock,
      updatedAt: new Date().toISOString()
    };
    this.persist();
    return this.data.products[idx];
  }

  updateProductStock(id, newStock) {
    const product = this.getProductById(id);
    if (!product) return null;
    product.stock = Math.max(0, parseInt(newStock, 10) || 0);
    product.updatedAt = new Date().toISOString();
    this.persist();
    return product;
  }

  deleteProduct(id) {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return false;
    this.data.products.splice(idx, 1);
    this.persist();
    return true;
  }

  // --- ORDERS ---
  getOrders({ status, search, limit = 100 } = {}) {
    let list = [...this.data.orders];

    if (status && status !== 'ALL') {
      list = list.filter(o => o.status === status);
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(o => 
        o.orderDisplayNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.includes(q)
      );
    }

    // Sort by latest first
    list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list.slice(0, limit);
  }

  getOrderByIdOrNumber(identifier) {
    if (!identifier) return null;
    const clean = String(identifier).replace(/^#/, '').trim().toLowerCase();
    return this.data.orders.find(o => 
      o.id.toLowerCase() === clean ||
      String(o.orderNumber) === clean ||
      o.orderDisplayNumber.toLowerCase() === `#${clean}` ||
      o.phone === clean
    );
  }

  getOrdersByPhone(phone) {
    if (!phone) return [];
    const cleanPhone = phone.trim().replace(/\D/g, '');
    return this.data.orders
      .filter(o => o.phone.replace(/\D/g, '').includes(cleanPhone))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  createOrder({ customerName, phone, note = '', items = [] }) {
    // 1. Validation
    if (!customerName || !customerName.trim()) {
      throw new Error('Customer name is required');
    }
    if (!phone || !phone.trim() || phone.trim().length < 6) {
      throw new Error('Valid phone number is required');
    }
    if (!items || items.length === 0) {
      throw new Error('Cart is empty. Add at least one product.');
    }

    // 2. Validate items and verify stock
    const processedItems = [];
    let grandTotal = 0;

    for (const item of items) {
      const product = this.getProductById(item.productId);
      if (!product) {
        throw new Error(`Product not found (ID: ${item.productId})`);
      }
      const qty = parseInt(item.quantity, 10);
      if (isNaN(qty) || qty <= 0) {
        throw new Error(`Invalid quantity for ${product.name}`);
      }
      if (qty > product.stock) {
        throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock}, requested: ${qty}`);
      }

      const itemSubtotal = product.price * qty;
      grandTotal += itemSubtotal;

      processedItems.push({
        productId: product.id,
        name: product.name,
        brand: product.brand || '',
        packSize: product.packSize || '',
        price: product.price,
        quantity: qty,
        subtotal: itemSubtotal,
        image: product.image
      });
    }

    // 3. Atomically deduct stock
    for (const item of processedItems) {
      const product = this.getProductById(item.productId);
      product.stock -= item.quantity;
      if (product.stock < 0) product.stock = 0;
    }

    // 4. Generate Order Number
    const orderNum = this.data.nextOrderNumber || 1001;
    this.data.nextOrderNumber = orderNum + 1;
    const nowIso = new Date().toISOString();

    const newOrder = {
      id: `ord-${orderNum}`,
      orderNumber: orderNum,
      orderDisplayNumber: `#${orderNum}`,
      customerName: customerName.trim(),
      phone: phone.trim(),
      note: (note || '').trim(),
      items: processedItems,
      totalAmount: grandTotal,
      status: 'ORDER RECEIVED',
      statusHistory: [
        {
          status: 'ORDER RECEIVED',
          timestamp: nowIso,
          note: 'Order placed by customer'
        }
      ],
      createdAt: nowIso,
      updatedAt: nowIso
    };

    this.data.orders.unshift(newOrder);
    this.persist();
    return newOrder;
  }

  updateOrderStatus(orderId, newStatus, note = '', cancelReason = '') {
    const validStatuses = [
      'ORDER RECEIVED',
      'ACCEPTED',
      'PREPARING',
      'READY FOR COLLECTION',
      'COLLECTED',
      'CANCELLED'
    ];

    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Invalid status: ${newStatus}`);
    }

    const order = this.data.orders.find(o => o.id === orderId || String(o.orderNumber) === String(orderId));
    if (!order) {
      throw new Error('Order not found');
    }

    const previousStatus = order.status;
    if (previousStatus === newStatus) {
      return order;
    }

    // If changing to CANCELLED and was not previously cancelled, restore stock
    if (newStatus === 'CANCELLED' && previousStatus !== 'CANCELLED') {
      for (const item of order.items) {
        const prod = this.getProductById(item.productId);
        if (prod) {
          prod.stock += item.quantity;
        }
      }
      order.cancelReason = cancelReason || note || 'Cancelled by store staff';
    }

    // If recovering from CANCELLED to an active status, deduct stock again if available
    if (previousStatus === 'CANCELLED' && newStatus !== 'CANCELLED') {
      for (const item of order.items) {
        const prod = this.getProductById(item.productId);
        if (prod) {
          prod.stock = Math.max(0, prod.stock - item.quantity);
        }
      }
      delete order.cancelReason;
    }

    const nowIso = new Date().toISOString();
    order.status = newStatus;
    order.updatedAt = nowIso;
    if (!order.statusHistory) order.statusHistory = [];
    order.statusHistory.push({
      status: newStatus,
      timestamp: nowIso,
      note: note || `Status updated to ${newStatus}`
    });

    this.persist();
    return order;
  }

  getOrderStats() {
    const today = new Date().toISOString().slice(0, 10);
    const orders = this.data.orders;
    
    const todayOrders = orders.filter(o => o.createdAt.slice(0, 10) === today);
    const collectedToday = todayOrders.filter(o => o.status === 'COLLECTED');
    const todayRevenue = collectedToday.reduce((sum, o) => sum + o.totalAmount, 0);

    const receivedCount = orders.filter(o => o.status === 'ORDER RECEIVED').length;
    const acceptedCount = orders.filter(o => o.status === 'ACCEPTED').length;
    const preparingCount = orders.filter(o => o.status === 'PREPARING').length;
    const readyCount = orders.filter(o => o.status === 'READY FOR COLLECTION').length;
    const collectedCount = orders.filter(o => o.status === 'COLLECTED').length;
    const cancelledCount = orders.filter(o => o.status === 'CANCELLED').length;

    return {
      totalOrders: orders.length,
      todayOrdersCount: todayOrders.length,
      todayRevenue,
      pendingAction: receivedCount,
      received: receivedCount,
      accepted: acceptedCount,
      preparing: preparingCount,
      readyForCollection: readyCount,
      collected: collectedCount,
      cancelled: cancelledCount,
      activeOrdersCount: receivedCount + acceptedCount + preparingCount + readyCount
    };
  }
}

export const db = new Database();
export default db;
