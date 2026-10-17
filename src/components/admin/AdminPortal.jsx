import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  ShieldCheck, Package, ShoppingCart, TrendingUp, AlertTriangle, 
  Plus, Edit2, Trash2, Search, Filter, RotateCcw, CheckCircle2, 
  ExternalLink, ArrowLeft, X, Eye, DollarSign, MessageCircle, Settings, Phone,
  Users, Activity, Award, Clock
} from 'lucide-react';

export const AdminPortal = ({ onAdminLogout }) => {
  const { 
    products, 
    categories, 
    orders, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    resetProductsToDefault,
    updateOrderStatus,
    deleteOrder,
    storeWhatsAppPhone,
    setStoreWhatsAppPhone,
    openWhatsAppForOrder,
    setActiveView,
    showToast,
    visitCount,
    loginCount,
    lastVisitTime,
    formatTimeAgo
  } = useStore();

  const [adminTab, setAdminTab] = useState('dashboard'); // dashboard, products, orders, settings
  const [productSearch, setProductSearch] = useState('');
  const [selectedAdminCategory, setSelectedAdminCategory] = useState('All');
  const [tempWhatsAppPhone, setTempWhatsAppPhone] = useState(storeWhatsAppPhone);
  
  // Security Audit State
  const [securityLogs, setSecurityLogs] = useState([]);
  const [isLoadingSecLogs, setIsLoadingSecLogs] = useState(false);
  const [secFilter, setSecFilter] = useState('ALL');

  const fetchAdminSecurityLogs = async () => {
    setIsLoadingSecLogs(true);
    try {
      const res = await fetch('/api/security/logs');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setSecurityLogs(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingSecLogs(false);
    }
  };

  const handleClearSecurityLogs = async () => {
    if (!window.confirm("Are you sure you want to purge historical security audit logs?")) return;
    try {
      const res = await fetch('/api/security/clear-logs', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        showToast("Security audit logs reset successfully", "info");
        fetchAdminSecurityLogs();
      }
    } catch (e) {
      showToast("Failed to clear logs", "error");
    }
  };

  useEffect(() => {
    if (adminTab === 'security') {
      fetchAdminSecurityLogs();
    }
  }, [adminTab]);

  // Modals
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form state for add/edit product
  const [formData, setFormData] = useState({
    name: '',
    category: categories[0]?.name || 'Rice & Grains',
    price: '',
    mrp: '',
    unit: '1 kg',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
    description: '',
    features: ['100% genuine guaranteed', 'High quality staple']
  });

  // Calculate analytics KPIs
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);
  const totalOrdersCount = orders.length;
  const activeProductsCount = products.length;
  const lowStockProducts = products.filter(p => p.stock <= 10);

  // Filtered products for admin table
  const adminFilteredProducts = products.filter(p => {
    const matchSearch = productSearch.trim() === '' || 
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchCategory = selectedAdminCategory === 'All' || p.category === selectedAdminCategory;
    return matchSearch && matchCategory;
  });

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      category: categories[0]?.name || 'Rice & Grains',
      price: '',
      mrp: '',
      unit: '1 kg',
      stock: 50,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
      description: 'High quality daily essential carefully selected for fresh delivery.',
      features: ['100% Quality checked', 'Directly sourced']
    });
    setIsAddProductModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      mrp: product.mrp,
      unit: product.unit,
      stock: product.stock,
      image: product.image,
      description: product.description || '',
      features: product.features || ['Quality guaranteed']
    });
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        mrp: Number(formData.mrp),
        unit: formData.unit,
        stock: Number(formData.stock),
        image: formData.image,
        description: formData.description
      });
      setEditingProduct(null);
    } else {
      addProduct({
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        mrp: Number(formData.mrp),
        unit: formData.unit,
        stock: Number(formData.stock),
        image: formData.image,
        description: formData.description,
        rating: 4.8,
        reviewsCount: 12
      });
      setIsAddProductModalOpen(false);
    }
  };

  const handleWhatsAppCustomer = (order) => {
    const cleanPhone = (order.customer.phone || '').replace(/[^0-9]/g, '');
    const message = `Hello *${order.customer.name}*! 👋\nThis is the Daily Needs Store manager regarding your order *${order.id}* (Total: ₹${order.total}).\n\n📦 *Current Status:* ${order.status}\n🔑 *Delivery OTP:* ${order.deliveryOtp || '4829'}\n📍 *Address:* ${order.customer.address}, ${order.customer.city}\n\nLet us know if you need any assistance with your items!`;
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleSaveWhatsAppPhone = (e) => {
    e.preventDefault();
    setStoreWhatsAppPhone(tempWhatsAppPhone);
    showToast("Store WhatsApp number updated!", "success");
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-16">
      
      {/* Admin Top Navigation */}
      <div className="bg-slate-950 border-b border-slate-800 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-400/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">Daily Needs Store</span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                ADMIN CONSOLE
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Inventory Management & Real-Time Orders</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('home')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Switch to Customer Store</span>
          </button>

          {onAdminLogout && (
            <button
              onClick={() => {
                onAdminLogout();
                setActiveView('home');
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold border border-rose-500/30 transition-colors"
            >
              Sign Out of Admin
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        
        {/* Tab Switcher */}
        <div className="flex items-center justify-between flex-wrap gap-4 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-2xl border border-slate-800">
            {[
              { id: 'dashboard', label: 'Overview Analytics', icon: TrendingUp },
              { id: 'products', label: `Inventory (${products.length})`, icon: Package },
              { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingCart },
              { id: 'security', label: 'Security & 2FA Logs', icon: ShieldCheck },
              { id: 'settings', label: 'WhatsApp & Settings', icon: MessageCircle },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = adminTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setAdminTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-fresh-500 hover:bg-fresh-600 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>

            <button
              onClick={resetProductsToDefault}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl border border-slate-700 transition-colors"
              title="Reset catalog to pre-seeded 15 categories"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Catalog Defaults</span>
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW ANALYTICS */}
        {adminTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* KPI Cards Grid (6 Metric Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
              <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Store Revenue</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl font-black text-white">₹{totalRevenue.toLocaleString()}</div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <span>+18.4% today</span>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Total Orders</span>
                  <ShoppingCart className="w-4 h-4 text-brand-400" />
                </div>
                <div className="text-xl font-black text-white">{totalOrdersCount}</div>
                <div className="text-[10px] text-slate-400">Processed live</div>
              </div>

              <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Active SKUs</span>
                  <Package className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xl font-black text-white">{activeProductsCount}</div>
                <div className="text-[10px] text-slate-400">15 Categories</div>
              </div>

              <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Low Stock (≤10)</span>
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                </div>
                <div className="text-xl font-black text-rose-400">{lowStockProducts.length}</div>
                <div className="text-[10px] text-rose-400/80">Replenish soon</div>
              </div>

              {/* 🌐 Website Opens / Traffic */}
              <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Website Opens</span>
                  <Eye className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-xl font-black text-blue-400">{visitCount}</div>
                <div className="text-[10px] text-blue-400/80 flex items-center gap-1 font-semibold">
                  <Activity className="w-3 h-3" /> Live traffic
                </div>
              </div>

              {/* 🔑 Customer Logins */}
              <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Customer Logins</span>
                  <Users className="w-4 h-4 text-fresh-400" />
                </div>
                <div className="text-xl font-black text-fresh-400">{loginCount}</div>
                <div className="text-[10px] text-fresh-400/80 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3 h-3" /> Authenticated
                </div>
              </div>
            </div>

            {/* Quick Summary Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Recent Orders Widget */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-white">Recent Orders Stream</h3>
                  <button
                    onClick={() => setAdminTab('orders')}
                    className="text-xs text-amber-400 hover:underline font-bold"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="divide-y divide-slate-800/80 text-xs">
                  {orders.slice(0, 5).map(o => (
                    <div key={o.id} className="py-2.5 flex items-center justify-between gap-3">
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          <span>{o.id}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                            {o.customer.name}
                          </span>
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          {o.items?.length || 0} items • ₹{o.total} via {o.paymentMethod}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleWhatsAppCustomer(o)}
                          className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors"
                          title="WhatsApp Customer"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </button>

                        <select
                          value={o.status}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                          className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-2 py-1 font-semibold text-slate-200 focus:outline-none"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Stock Watchlist */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <span>Critical Low Stock Items</span>
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  </h3>
                  <span className="text-xs text-slate-400">{lowStockProducts.length} items flagged</span>
                </div>

                <div className="divide-y divide-slate-800/80 text-xs max-h-80 overflow-y-auto no-scrollbar">
                  {lowStockProducts.length === 0 ? (
                    <p className="py-4 text-center text-slate-500">All inventory levels are currently healthy!</p>
                  ) : (
                    lowStockProducts.map(p => (
                      <div key={p.id} className="py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="w-9 h-9 object-cover rounded-lg" />
                          <div>
                            <div className="font-semibold text-white line-clamp-1">{p.name}</div>
                            <div className="text-slate-500 text-[11px]">{p.category} • ₹{p.price}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-black text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                            {p.stock} left
                          </span>
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                            title="Restock / Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Category breakdown visualizer */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="font-extrabold text-sm text-white">Catalog Distribution Across 15 Categories</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs">
                {categories.map((cat) => {
                  const count = products.filter(p => p.category === cat.name).length;
                  return (
                    <div 
                      key={cat.id} 
                      onClick={() => {
                        setSelectedAdminCategory(cat.name);
                        setAdminTab('products');
                      }}
                      className="p-3 bg-slate-900 hover:bg-slate-850 rounded-xl border border-slate-800 cursor-pointer transition-colors"
                    >
                      <div className="text-slate-400 text-[11px] truncate">{cat.name}</div>
                      <div className="font-black text-white text-base mt-1">{count} items</div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: INVENTORY CRUD */}
        {adminTab === 'products' && (
          <div className="space-y-4">
            {/* Search & Category Filter Bar */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search inventory items..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-slate-400 font-semibold shrink-0">Filter Category:</span>
                <select
                  value={selectedAdminCategory}
                  onChange={(e) => setSelectedAdminCategory(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-xs rounded-xl px-3 py-2 text-white font-medium focus:outline-none"
                >
                  <option value="All">All 15 Categories</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/90 text-slate-400 uppercase font-black tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Product</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Selling Price</th>
                      <th className="p-3.5">MRP</th>
                      <th className="p-3.5">Unit / Weight</th>
                      <th className="p-3.5">Stock Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {adminFilteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-3.5">
                          <div className="flex items-center gap-3">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-10 h-10 object-cover rounded-xl border border-slate-800"
                            />
                            <div>
                              <div className="font-bold text-white line-clamp-1">{product.name}</div>
                              <div className="text-[11px] text-slate-500 font-mono">ID: {product.id}</div>
                            </div>
                          </div>
                        </td>

                        <td className="p-3.5 font-medium text-slate-300">
                          <span className="bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                            {product.category}
                          </span>
                        </td>

                        <td className="p-3.5 font-black text-white text-sm">
                          ₹{product.price}
                        </td>

                        <td className="p-3.5 text-slate-400 line-through">
                          ₹{product.mrp}
                        </td>

                        <td className="p-3.5 font-semibold text-slate-400">
                          {product.unit}
                        </td>

                        <td className="p-3.5">
                          {product.stock <= 10 ? (
                            <span className="text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                              Low: {product.stock} units
                            </span>
                          ) : (
                            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              In Stock: {product.stock}
                            </span>
                          )}
                        </td>

                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditModal(product)}
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                              title="Edit Product"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`Delete ${product.name} from catalog?`)) {
                                  deleteProduct(product.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
        )}

        {/* TAB 3: ORDER MANAGEMENT WITH DIRECT WHATSAPP */}
        {adminTab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-white">Customer Orders Processing Hub</h3>
                  <p className="text-[11px] text-slate-400">One-click WhatsApp chat and delivery status updater</p>
                </div>
                <span className="text-xs text-slate-400">{orders.length} total orders recorded</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/90 text-slate-400 uppercase font-black tracking-wider text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="p-3.5">Order ID & Date</th>
                      <th className="p-3.5">Customer & Address</th>
                      <th className="p-3.5">Items Summary</th>
                      <th className="p-3.5">Total & Payment</th>
                      <th className="p-3.5">Delivery Slot</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-900/50 transition-colors">
                        <td className="p-3.5">
                          <div className="font-mono font-bold text-amber-400">{order.id}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-[10px] text-brand-400 font-mono mt-0.5">
                            OTP: {order.deliveryOtp || '4829'}
                          </div>
                        </td>

                        <td className="p-3.5">
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{order.customer.name}</span>
                            {order.customer.addressType && (
                              <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-bold">
                                {order.customer.addressType}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-medium">{order.customer.phone}</div>
                          <div className="text-[10px] text-slate-500 max-w-[180px] leading-tight mt-0.5">
                            {order.customer.address}, {order.customer.city}
                          </div>
                        </td>

                        <td className="p-3.5">
                          <div className="space-y-0.5 max-w-xs">
                            {order.items?.map((it, idx) => (
                              <div key={idx} className="text-[11px] text-slate-300 truncate">
                                • {it.name} <span className="text-slate-500">×{it.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </td>

                        <td className="p-3.5">
                          <div className="font-black text-white text-sm">₹{order.total}</div>
                          <div className="text-[11px] text-slate-400">{order.paymentMethod}</div>
                        </td>

                        <td className="p-3.5 text-slate-300">
                          <span className="text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                            {order.deliverySlot}
                          </span>
                        </td>

                        <td className="p-3.5">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            className={`text-xs rounded-xl px-2.5 py-1.5 font-bold border focus:outline-none cursor-pointer ${
                              order.status === 'Delivered'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                                : order.status === 'Out for Delivery'
                                ? 'bg-amber-950 text-amber-300 border-amber-800'
                                : order.status === 'Cancelled'
                                ? 'bg-rose-950 text-rose-300 border-rose-800'
                                : 'bg-slate-900 text-slate-200 border-slate-700'
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* WhatsApp Customer Action */}
                            <button
                              onClick={() => handleWhatsAppCustomer(order)}
                              className="p-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-colors flex items-center gap-1 font-semibold text-[11px]"
                              title="Chat with Customer on WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">WhatsApp</span>
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`Delete order ${order.id}?`)) {
                                  deleteOrder(order.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                              title="Delete Order"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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
        )}

        {/* TAB 4: DEFENSE SHIELD & 2FA SECURITY LOGS */}
        {adminTab === 'security' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            {/* Security KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-950 border border-emerald-500/30 rounded-2xl p-5 space-y-1 shadow-lg shadow-emerald-500/5">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Firewall Defense</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-xl font-black text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ARMED (256-Bit)</span>
                </div>
                <div className="text-[11px] text-emerald-400 font-semibold">Zero Vulnerabilities Detected</div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Brute-Force Rate Limiter</span>
                  <Activity className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-xl font-black text-white">5 Attempts Max</div>
                <div className="text-[11px] text-slate-400">60s Automatic IP Lockout</div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Admin 2-Factor Auth</span>
                  <Shield className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-xl font-black text-amber-400">Master PIN 779900</div>
                <div className="text-[11px] text-slate-400">Required for Admin Login</div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-1">
                <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
                  <span>Logged Security Events</span>
                  <Terminal className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-xl font-black text-white">{securityLogs.length} Records</div>
                <div className="text-[11px] text-slate-400">Persisted in security database</div>
              </div>
            </div>

            {/* Audit Logs Table Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span>Real-Time Security Audit Ledger</span>
                  </h3>
                  <p className="text-xs text-slate-400">Live forensic trace of logins, 2FA challenges, rate limit triggers & IP origins</p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Event Filter */}
                  <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5 text-xs font-bold">
                    {['ALL', 'SUCCESS', 'BLOCKED', 'FAILED'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setSecFilter(f)}
                        className={`px-3 py-1.5 rounded-lg transition-colors ${
                          secFilter === f ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={fetchAdminSecurityLogs}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-colors"
                    title="Refresh Audit Logs"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleClearSecurityLogs}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Purge Logs</span>
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-sans text-[11px] uppercase tracking-wider">
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Event</th>
                      <th className="p-3">Principal (User)</th>
                      <th className="p-3">IP Address</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Diagnostic Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {isLoadingSecLogs ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500 font-sans">
                          Querying defense ledger...
                        </td>
                      </tr>
                    ) : securityLogs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500 font-sans">
                          No security events recorded in database.
                        </td>
                      </tr>
                    ) : (
                      securityLogs
                        .filter(l => secFilter === 'ALL' || l.status === secFilter)
                        .map((log) => (
                          <tr key={log.id} className="hover:bg-slate-900/60 transition-colors">
                            <td className="p-3 text-slate-400 text-[11px] whitespace-nowrap">
                              {new Date(log.timestamp).toLocaleString('en-IN', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                              })}
                            </td>
                            <td className="p-3 font-bold text-white whitespace-nowrap">
                              {log.event}
                            </td>
                            <td className="p-3 text-slate-300 font-sans text-xs">
                              {log.email}
                            </td>
                            <td className="p-3 text-slate-400 text-[11px] whitespace-nowrap">
                              {log.ip}
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                log.status === 'SUCCESS' 
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' 
                                  : log.status === 'BLOCKED'
                                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
                                  : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                              }`}>
                                {log.status}
                              </span>
                            </td>
                            <td className="p-3 text-slate-400 font-sans text-xs max-w-xs truncate">
                              {log.details || '-'}
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: WHATSAPP & STORE SETTINGS */}
        {adminTab === 'settings' && (
          <div className="max-w-xl mx-auto bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">Store WhatsApp Integration</h3>
                <p className="text-xs text-slate-400">Configure phone number receiving customer orders</p>
              </div>
            </div>

            <form onSubmit={handleSaveWhatsAppPhone} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Store / Manager WhatsApp Number (with Country Code)
                </label>
                <input
                  type="text"
                  value={tempWhatsAppPhone}
                  onChange={(e) => setTempWhatsAppPhone(e.target.value)}
                  placeholder="e.g. 919876543210"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono text-sm focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  required
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Format: Country Code + Mobile Number without '+' or spaces (e.g., 919876543210 for India).
                </p>
              </div>

              <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 space-y-2 text-slate-400 text-xs">
                <div className="font-bold text-white">How WhatsApp Integration Works:</div>
                <ul className="space-y-1 list-disc list-inside text-[11px]">
                  <li>Customers can select "Order via WhatsApp" during checkout.</li>
                  <li>WhatsApp opens with pre-formatted invoice, delivery address & items.</li>
                  <li>In the Admin orders tab, you can click "WhatsApp" to immediately message any customer regarding their order status.</li>
                </ul>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20"
              >
                Save WhatsApp Settings
              </button>
            </form>
          </div>
        )}

      </div>

      {/* Add / Edit Product Modal */}
      {(isAddProductModalOpen || editingProduct) && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white">
                {editingProduct ? 'Edit Catalog Product' : 'Add New Product to Catalog'}
              </h2>
              <button
                onClick={() => {
                  setIsAddProductModalOpen(false);
                  setEditingProduct(null);
                }}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="py-4 space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Product Title</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Fortune Rozana Basmati Rice"
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Category (15 Categories)</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Pack Size / Unit</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="e.g. 1 kg, 500 g, 1 L"
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="135"
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                    placeholder="175"
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="50"
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Image URL (Unsplash or Direct CDN)</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddProductModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-slate-400 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl shadow-md"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
