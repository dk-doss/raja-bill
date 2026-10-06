import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { db } from './db.js';
import { askAIAgent } from './aiAgent.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Uploads directory
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `prod-${uniqueSuffix}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB max
});

// Server-Sent Events (SSE) Clients
let sseClients = [];

function broadcastEvent(eventType, payload) {
  const data = JSON.stringify({ type: eventType, data: payload, timestamp: new Date().toISOString() });
  sseClients.forEach(client => {
    try {
      client.res.write(`data: ${data}\n\n`);
    } catch (err) {
      console.error('SSE client write error:', err);
    }
  });
}

// SSE endpoint
app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const clientId = Date.now() + Math.random().toString(36).substring(2);
  const clientObj = { id: clientId, res };
  sseClients.push(clientObj);

  // Send initial ping
  res.write(`data: ${JSON.stringify({ type: 'connected', clientId })}\n\n`);

  req.on('close', () => {
    sseClients = sseClients.filter(c => c.id !== clientId);
  });
});

// Heartbeat to keep SSE alive
setInterval(() => {
  sseClients.forEach(client => {
    try {
      client.res.write(': heartbeat\n\n');
    } catch (e) {}
  });
}, 25000);

// --- STORE INFO API ---
app.get('/api/store/info', (req, res) => {
  try {
    const info = db.getStoreInfo();
    res.json({ success: true, data: info });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/store/info', (req, res) => {
  try {
    const updated = db.updateStoreInfo(req.body);
    broadcastEvent('store_info_updated', updated);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- AUTH API ---
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password required' });
  }

  const isValid = db.validateAuth(username.trim(), password.trim());
  if (isValid) {
    // Generate a simple session token
    const token = 'raja-session-' + Date.now();
    return res.json({
      success: true,
      token,
      user: { username: 'admin', role: 'owner', storeName: 'RAJA STORE' }
    });
  } else {
    return res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
});

// --- CATEGORIES API ---
app.get('/api/categories', (req, res) => {
  try {
    const categories = db.getCategories();
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/categories', (req, res) => {
  try {
    const { name, icon, sortOrder } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }
    const cat = db.addCategory({ name, icon, sortOrder });
    broadcastEvent('category_added', cat);
    res.status(201).json({ success: true, data: cat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/categories/:id', (req, res) => {
  try {
    const updated = db.updateCategory(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    broadcastEvent('category_updated', updated);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/categories/:id', (req, res) => {
  try {
    const ok = db.deleteCategory(req.params.id);
    if (!ok) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    broadcastEvent('category_deleted', { id: req.params.id });
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// --- PRODUCTS API ---
app.get('/api/products', (req, res) => {
  try {
    const { categoryId, search, inStockOnly, admin } = req.query;
    if (admin === 'true') {
      const all = db.getAllProductsAdmin();
      return res.json({ success: true, data: all });
    }
    const products = db.getProducts({
      categoryId,
      search,
      inStockOnly: inStockOnly === 'true'
    });
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/products/:id', (req, res) => {
  try {
    const product = db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/products', (req, res) => {
  try {
    const { name, categoryId, price, stock, packSize, brand, image, description } = req.body;
    if (!name || !price || !categoryId) {
      return res.status(400).json({ success: false, message: 'Name, Category, and Price are required' });
    }
    const created = db.addProduct(req.body);
    broadcastEvent('product_added', created);
    res.status(201).json({ success: true, data: created });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/products/:id', (req, res) => {
  try {
    const updated = db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    broadcastEvent('product_updated', updated);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.patch('/api/products/:id/stock', (req, res) => {
  try {
    const { stock } = req.body;
    if (stock === undefined) {
      return res.status(400).json({ success: false, message: 'Stock value required' });
    }
    const updated = db.updateProductStock(req.params.id, stock);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    broadcastEvent('product_updated', updated);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/products/:id', (req, res) => {
  try {
    const ok = db.deleteProduct(req.params.id);
    if (!ok) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    broadcastEvent('product_deleted', { id: req.params.id });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// File upload
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, url: fileUrl });
});

// --- ORDERS API ---
app.get('/api/orders', (req, res) => {
  try {
    const { status, search, limit } = req.query;
    const orders = db.getOrders({ status, search, limit: limit ? Number(limit) : 100 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/orders/stats', (req, res) => {
  try {
    const stats = db.getOrderStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/orders/by-phone/:phone', (req, res) => {
  try {
    const orders = db.getOrdersByPhone(req.params.phone);
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/orders/:identifier', (req, res) => {
  try {
    const order = db.getOrderByIdOrNumber(req.params.identifier);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/orders', (req, res) => {
  try {
    const { customerName, phone, note, items } = req.body;
    const newOrder = db.createOrder({ customerName, phone, note, items });
    
    // Broadcast to Store App dashboard
    broadcastEvent('new_order', newOrder);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      data: newOrder
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.patch('/api/orders/:id/status', (req, res) => {
  try {
    const { status, note, cancelReason } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required' });
    }
    const updated = db.updateOrderStatus(req.params.id, status, note, cancelReason);
    
    // Broadcast to both Customer App and Store App
    broadcastEvent('order_status_updated', updated);

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// --- AI ASSISTANT AGENT API ---
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, lang, role } = req.body;
    const result = await askAIAgent({ message, lang, role });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin Reset Data API
app.post('/api/admin/reset', (req, res) => {
  try {
    db.resetToDefaults();
    broadcastEvent('database_reset', {});
    res.json({ success: true, message: 'Database reset to default demo data successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Serve frontend in production
const CLIENT_DIST = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(CLIENT_DIST)) {
  app.use(express.static(CLIENT_DIST));
  app.use((req, res, next) => {
    // If request does not start with /api and is GET, serve index.html
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(CLIENT_DIST, 'index.html'));
    }
    next();
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🛍️  RAJA STORE Server running on http://localhost:${PORT}`);
  console.log(`📦  Customer App & Store App ready`);
  console.log(`===============================================`);
});
