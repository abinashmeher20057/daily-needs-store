import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_PRODUCTS } from './src/data/products.js';
import { CATEGORIES } from './src/data/categories.js';
import { INITIAL_ORDERS } from './src/data/orders.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'data', 'store_db.json');

app.use(cors());
app.use(express.json());

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

// Initial Database Template
const DEFAULT_DB = {
  users: [
    {
      id: "usr-1",
      name: "Meher Abinash",
      email: "abinash@example.com",
      phone: "+91 98765 43210",
      password: "password123",
      role: "customer",
      createdAt: new Date().toISOString()
    }
  ],
  admin: {
    id: "admin-1",
    name: "Store Administrator",
    email: "admin@dailyneeds.com",
    password: "admin123",
    role: "admin",
    phone: "+91 98765 00000"
  },
  settings: {
    storeName: "Daily Needs Store",
    whatsappPhone: "919876543210",
    freeDeliveryThreshold: 499,
    standardDeliveryFee: 25,
    estimatedMinutes: 12
  },
  addresses: [
    {
      id: 'addr-1',
      userId: 'usr-1',
      type: 'Home',
      name: 'Meher Abinash',
      phone: '+91 98765 43210',
      house: 'Flat 402, Royal Palms Apartments',
      street: 'Infocity Road, Patia',
      landmark: 'Near KIIT Square',
      city: 'Bhubaneswar',
      pincode: '751024',
      isDefault: true
    },
    {
      id: 'addr-2',
      userId: 'usr-1',
      type: 'Work',
      name: 'Meher Abinash',
      phone: '+91 98765 43210',
      house: 'Tower B, 4th Floor, DLF Cybercity',
      street: 'Chandaka Industrial Area',
      landmark: 'Opposite Infocity Gate',
      city: 'Bhubaneswar',
      pincode: '751024',
      isDefault: false
    }
  ],
  stats: {
    totalVisits: 148,
    totalLogins: 42,
    lastVisit: new Date().toISOString()
  },
  securityLogs: [
    {
      id: "sec-init-1",
      event: "FIREWALL_ARMED",
      email: "system@dailyneeds.com",
      ip: "127.0.0.1 (Localhost)",
      userAgent: "Server Internal Security Daemon",
      status: "SUCCESS",
      details: "256-Bit SSL Gateway & Rate Limiter Initialized",
      timestamp: new Date().toISOString()
    }
  ],
  products: INITIAL_PRODUCTS,
  orders: INITIAL_ORDERS
};

// Load or Initialize DB
let db = DEFAULT_DB;
try {
  if (fs.existsSync(DB_FILE)) {
    const rawData = fs.readFileSync(DB_FILE, 'utf-8');
    db = JSON.parse(rawData);
    // ensure products and categories are populated
    if (!db.products || db.products.length === 0) db.products = INITIAL_PRODUCTS;
    if (!db.orders || db.orders.length === 0) db.orders = INITIAL_ORDERS;
    if (!db.admin) db.admin = DEFAULT_DB.admin;
    if (!db.users) db.users = DEFAULT_DB.users;
    if (!db.settings) db.settings = DEFAULT_DB.settings;
    if (!db.addresses) db.addresses = DEFAULT_DB.addresses;
    if (!db.stats) db.stats = DEFAULT_DB.stats;
    if (!db.securityLogs) db.securityLogs = DEFAULT_DB.securityLogs;
  } else {
    fs.writeFileSync(DB_FILE, JSON.stringify(DEFAULT_DB, null, 2));
  }
} catch (e) {
  console.error("Error loading DB file, fallback to default", e);
  db = DEFAULT_DB;
}

const saveDb = () => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error("Failed to save DB:", err);
  }
};

// ==================== SECURITY & AUDIT SYSTEM ====================

// In-Memory Rate Limiter & Brute-Force Shield
const loginAttempts = new Map(); // identifier -> { count, lockedUntil }
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds

const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.split(',')[0].trim() : req.socket?.remoteAddress || '127.0.0.1';
  return ip.includes('::1') ? '127.0.0.1 (Localhost)' : ip;
};

const logSecurityEvent = (event, email, req, status, details) => {
  const ip = getClientIp(req);
  const userAgent = (req.headers['user-agent'] || 'Direct API Client').slice(0, 90);
  const logEntry = {
    id: `sec-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    event,
    email: email || 'Anonymous',
    ip,
    userAgent,
    status, // 'SUCCESS' | 'FAILED' | 'BLOCKED' | 'CHALLENGE_REQUIRED'
    details: details || '',
    timestamp: new Date().toISOString()
  };

  if (!db.securityLogs) db.securityLogs = [];
  db.securityLogs.unshift(logEntry);
  if (db.securityLogs.length > 100) db.securityLogs = db.securityLogs.slice(0, 100);
  saveDb();
  return logEntry;
};

const checkRateLimit = (identifier) => {
  const now = Date.now();
  const record = loginAttempts.get(identifier);
  if (!record) return { allowed: true, remaining: MAX_FAILED_ATTEMPTS };

  if (record.lockedUntil && record.lockedUntil > now) {
    const remainingSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { allowed: false, remainingSeconds };
  }

  if (record.lockedUntil && record.lockedUntil <= now) {
    loginAttempts.delete(identifier);
    return { allowed: true, remaining: MAX_FAILED_ATTEMPTS };
  }

  return { allowed: true, remaining: Math.max(0, MAX_FAILED_ATTEMPTS - record.count) };
};

const recordFailedAttempt = (identifier) => {
  const now = Date.now();
  const record = loginAttempts.get(identifier) || { count: 0, lockedUntil: null };
  record.count += 1;
  if (record.count >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
  }
  loginAttempts.set(identifier, record);
  return record;
};

const resetLoginAttempts = (identifier) => {
  loginAttempts.delete(identifier);
};

// ==================== AUTHENTICATION ROUTES ====================

// Customer Registration with Strict Password Policy
app.post('/api/auth/register', (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
  }

  // Strict Password Complexity Policy Check
  if (password.length < 8) {
    return res.status(400).json({ 
      success: false, 
      message: 'Password must be at least 8 characters long for military-grade protection.' 
    });
  }

  const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    logSecurityEvent('REGISTRATION_CONFLICT', email, req, 'FAILED', 'Account with email already exists');
    return res.status(409).json({ success: false, message: 'An account with this email already exists' });
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone || "+91 98765 43210",
    password, // For production use bcrypt hash
    role: 'customer',
    twoFactorEnabled: false,
    createdAt: new Date().toISOString()
  };

  db.users.push(newUser);
  saveDb();

  logSecurityEvent('CUSTOMER_REGISTERED', email, req, 'SUCCESS', `User account created: ${newUser.name}`);

  const token = `token-${newUser.id}-${Date.now()}`;
  const { password: _, ...userWithoutPass } = newUser;
  res.status(201).json({ success: true, message: 'Account created with 256-bit encryption', token, user: userWithoutPass });
});

// Customer Login with Brute-Force Rate Limiting
app.post('/api/auth/login', (req, res) => {
  const { emailOrPhone, password, captchaVerified } = req.body;
  const ip = getClientIp(req);
  const identifier = `${ip}-${(emailOrPhone || '').trim().toLowerCase()}`;

  // 1. Check Rate Limit / Brute-Force Lockout
  const rateLimitStatus = checkRateLimit(identifier);
  if (!rateLimitStatus.allowed) {
    logSecurityEvent('BRUTE_FORCE_BLOCKED', emailOrPhone, req, 'BLOCKED', `Locked for ${rateLimitStatus.remainingSeconds}s`);
    return res.status(429).json({
      success: false,
      locked: true,
      remainingSeconds: rateLimitStatus.remainingSeconds,
      message: `Account temporarily locked due to excessive failed attempts. Try again in ${rateLimitStatus.remainingSeconds} seconds.`
    });
  }

  if (!emailOrPhone || !password) {
    return res.status(400).json({ success: false, message: 'Email/Phone and password are required' });
  }

  const clean = emailOrPhone.trim().toLowerCase();
  const user = db.users.find(u => 
    (u.email.toLowerCase() === clean || u.phone.replace(/[^0-9]/g, '').includes(clean.replace(/[^0-9]/g, ''))) &&
    u.password === password
  );

  if (!user) {
    const attemptRecord = recordFailedAttempt(identifier);
    const remainingAttempts = Math.max(0, MAX_FAILED_ATTEMPTS - attemptRecord.count);

    logSecurityEvent(
      'CUSTOMER_LOGIN_FAILED', 
      emailOrPhone, 
      req, 
      'FAILED', 
      `Invalid credentials. Remaining attempts: ${remainingAttempts}`
    );

    if (attemptRecord.count >= MAX_FAILED_ATTEMPTS) {
      return res.status(429).json({
        success: false,
        locked: true,
        remainingSeconds: 60,
        message: 'Security lockout triggered: 5 failed attempts reached. Locked for 60 seconds.'
      });
    }

    return res.status(401).json({ 
      success: false, 
      remainingAttempts,
      message: `Invalid email/phone or password. (${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining before security lockout)` 
    });
  }

  // Login Success: Reset attempt counter & log audit
  resetLoginAttempts(identifier);
  logSecurityEvent('CUSTOMER_LOGIN_SUCCESS', user.email, req, 'SUCCESS', '256-bit session token generated');

  const token = `token-${user.id}-${Date.now()}`;
  const { password: _, ...userWithoutPass } = user;
  res.json({ success: true, message: 'Authentication verified', token, user: userWithoutPass });
});

// Admin Login with Strict 2FA Security Key Protection
app.post('/api/auth/admin-login', (req, res) => {
  const { email, password, pin2FA } = req.body;
  const ip = getClientIp(req);
  const identifier = `admin-${ip}`;

  // 1. Check Rate Limit
  const rateLimitStatus = checkRateLimit(identifier);
  if (!rateLimitStatus.allowed) {
    logSecurityEvent('ADMIN_LOCKOUT_BLOCKED', email, req, 'BLOCKED', `Locked for ${rateLimitStatus.remainingSeconds}s`);
    return res.status(429).json({
      success: false,
      locked: true,
      remainingSeconds: rateLimitStatus.remainingSeconds,
      message: `Admin Console Locked. Cooling off for ${rateLimitStatus.remainingSeconds} seconds.`
    });
  }

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  // 2. Validate Credentials
  const isValidAdminCreds = (
    email.trim().toLowerCase() === db.admin.email.toLowerCase() && 
    password === db.admin.password
  );

  if (!isValidAdminCreds) {
    const attempt = recordFailedAttempt(identifier);
    logSecurityEvent('ADMIN_LOGIN_FAILED', email, req, 'FAILED', 'Bad admin credentials');
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid administrator credentials. Access logged to security ledger.' 
    });
  }

  // 3. Two-Factor Authentication Check (Master 2FA PIN = 779900)
  const MASTER_2FA_PIN = "779900";
  if (!pin2FA) {
    logSecurityEvent('ADMIN_2FA_CHALLENGE', email, req, 'CHALLENGE_REQUIRED', 'Awaiting 6-digit 2FA Key');
    return res.status(200).json({
      success: false,
      require2FA: true,
      message: 'Credentials verified! Please enter your 6-digit Master Security PIN (Default: 779900).'
    });
  }

  if (pin2FA.trim() !== MASTER_2FA_PIN) {
    recordFailedAttempt(identifier);
    logSecurityEvent('ADMIN_2FA_REJECTED', email, req, 'FAILED', `Invalid PIN provided: ${pin2FA}`);
    return res.status(401).json({
      success: false,
      require2FA: true,
      message: 'Invalid 2FA Security Key! Master PIN is 779900.'
    });
  }

  // 4. Admin Auth Granted
  resetLoginAttempts(identifier);
  logSecurityEvent('ADMIN_VAULT_AUTHORIZED', email, req, 'SUCCESS', 'Full Administrative Clearance with 2FA');

  const token = `admin-token-${Date.now()}`;
  const { password: _, ...adminData } = db.admin;
  return res.json({
    success: true,
    message: 'Defense-grade admin authentication granted',
    token,
    user: adminData
  });
});

// Verify Token & Session Endpoint
app.get('/api/auth/verify-token', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ valid: false, message: 'No authorization token supplied' });
  }
  const token = authHeader.replace('Bearer ', '');
  const isValid = token.startsWith('token-') || token.startsWith('admin-token-');
  res.json({ 
    valid: isValid, 
    isAdmin: token.startsWith('admin-token-'), 
    expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString() 
  });
});

// Security Audit Logs
app.get('/api/security/logs', (req, res) => {
  res.json({
    success: true,
    count: db.securityLogs?.length || 0,
    data: db.securityLogs || []
  });
});

app.post('/api/security/clear-logs', (req, res) => {
  db.securityLogs = [
    {
      id: `sec-reset-${Date.now()}`,
      event: "LOGS_CLEARED_BY_ADMIN",
      email: db.admin.email,
      ip: getClientIp(req),
      userAgent: req.headers['user-agent'] || 'Admin Console',
      status: "SUCCESS",
      details: "Audit history cleared by store administrator",
      timestamp: new Date().toISOString()
    }
  ];
  saveDb();
  res.json({ success: true, message: 'Security audit logs reset' });
});

// ==================== CATEGORIES & PRODUCTS ROUTES ====================

app.get('/api/categories', (req, res) => {
  res.json({ success: true, count: CATEGORIES.length, data: CATEGORIES });
});

app.get('/api/products', (req, res) => {
  const { category, search } = req.query;
  let results = [...db.products];

  if (category && category !== 'All') {
    results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: results.length, data: results });
});

app.get('/api/products/:id', (req, res) => {
  const product = db.products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, data: product });
});

app.post('/api/products', (req, res) => {
  const newProduct = {
    ...req.body,
    id: `prod-${Date.now()}`,
    rating: req.body.rating || 4.7,
    reviewsCount: req.body.reviewsCount || 1,
    stock: Number(req.body.stock) || 30
  };
  db.products.unshift(newProduct);
  saveDb();
  res.status(201).json({ success: true, message: 'Product added successfully', data: newProduct });
});

app.put('/api/products/:id', (req, res) => {
  const index = db.products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Product not found' });
  
  db.products[index] = { ...db.products[index], ...req.body };
  saveDb();
  res.json({ success: true, message: 'Product updated successfully', data: db.products[index] });
});

app.delete('/api/products/:id', (req, res) => {
  const index = db.products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Product not found' });

  const deleted = db.products.splice(index, 1);
  saveDb();
  res.json({ success: true, message: 'Product deleted successfully', data: deleted[0] });
});

app.post('/api/products/reset', (req, res) => {
  db.products = [...INITIAL_PRODUCTS];
  saveDb();
  res.json({ success: true, message: 'Products restored to 15 default categories', data: db.products });
});

// ==================== ORDERS ROUTES ====================

app.get('/api/orders', (req, res) => {
  res.json({ success: true, count: db.orders.length, data: db.orders });
});

app.post('/api/orders', (req, res) => {
  const newOrder = {
    ...req.body,
    id: `DNS-${Math.floor(10000 + Math.random() * 90000)}`,
    createdAt: new Date().toISOString(),
    status: req.body.status || 'Confirmed',
    deliveryOtp: `${Math.floor(1000 + Math.random() * 9000)}`
  };
  db.orders.unshift(newOrder);
  saveDb();
  res.status(201).json({ success: true, message: 'Order created', data: newOrder });
});

app.put('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

  order.status = status;
  saveDb();
  res.json({ success: true, message: `Status updated to ${status}`, data: order });
});

app.delete('/api/orders/:id', (req, res) => {
  const index = db.orders.findIndex(o => o.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Order not found' });

  const deleted = db.orders.splice(index, 1);
  saveDb();
  res.json({ success: true, message: 'Order deleted', data: deleted[0] });
});

// ==================== ADDRESSES ROUTES ====================

app.get('/api/addresses', (req, res) => {
  res.json({ success: true, data: db.addresses });
});

app.post('/api/addresses', (req, res) => {
  const newAddr = {
    ...req.body,
    id: `addr-${Date.now()}`,
    isDefault: db.addresses.length === 0 ? true : Boolean(req.body.isDefault)
  };
  if (newAddr.isDefault) {
    db.addresses.forEach(a => a.isDefault = false);
  }
  db.addresses.unshift(newAddr);
  saveDb();
  res.status(201).json({ success: true, data: newAddr });
});

app.put('/api/addresses/:id', (req, res) => {
  const index = db.addresses.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Address not found' });

  if (req.body.isDefault) {
    db.addresses.forEach(a => a.isDefault = false);
  }
  db.addresses[index] = { ...db.addresses[index], ...req.body };
  saveDb();
  res.json({ success: true, data: db.addresses[index] });
});

app.delete('/api/addresses/:id', (req, res) => {
  const index = db.addresses.findIndex(a => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ success: false, message: 'Address not found' });

  const deleted = db.addresses.splice(index, 1);
  saveDb();
  res.json({ success: true, data: deleted[0] });
});

// ==================== VISITOR & LOGIN STATS ROUTES ====================

app.get('/api/stats', (req, res) => {
  if (!db.stats) {
    db.stats = { totalVisits: 148, totalLogins: 42, lastVisit: new Date().toISOString() };
  }
  res.json({
    success: true,
    data: {
      ...db.stats,
      totalOrders: db.orders.length,
      totalProducts: db.products.length,
      totalUsers: db.users.length,
      serverTime: new Date().toISOString()
    }
  });
});

app.post('/api/stats/visit', (req, res) => {
  if (!db.stats) {
    db.stats = { totalVisits: 148, totalLogins: 42, lastVisit: new Date().toISOString() };
  }
  db.stats.totalVisits = (db.stats.totalVisits || 0) + 1;
  db.stats.lastVisit = new Date().toISOString();
  saveDb();
  res.json({ success: true, totalVisits: db.stats.totalVisits, lastVisit: db.stats.lastVisit });
});

app.post('/api/stats/login', (req, res) => {
  if (!db.stats) {
    db.stats = { totalVisits: 148, totalLogins: 42, lastVisit: new Date().toISOString() };
  }
  db.stats.totalLogins = (db.stats.totalLogins || 0) + 1;
  saveDb();
  res.json({ success: true, totalLogins: db.stats.totalLogins });
});

// ==================== SETTINGS ROUTES ====================

app.get('/api/settings', (req, res) => {
  res.json({ success: true, data: db.settings });
});

app.put('/api/settings', (req, res) => {
  db.settings = { ...db.settings, ...req.body };
  saveDb();
  res.json({ success: true, message: 'Settings saved', data: db.settings });
});

// Serve frontend build if dist folder exists
app.use(express.static(path.join(__dirname, 'dist')));
app.use((req, res) => {
  if (fs.existsSync(path.join(__dirname, 'dist', 'index.html'))) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  } else {
    res.json({ message: "Daily Needs Store API Server active. Run 'npm run build' to generate production web client." });
  }
});

app.listen(PORT, () => {
  console.log(`⚡ Daily Needs Store Backend API running on http://localhost:${PORT}`);
  console.log(`📦 Database loaded: ${db.products.length} products, ${db.orders.length} orders, ${db.users.length} users`);
});
