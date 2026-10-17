import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_PRODUCTS } from '../data/products';
import { CATEGORIES } from '../data/categories';
import { INITIAL_ORDERS } from '../data/orders';

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  // Products state with local storage fallback
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('dns_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Failed to load products from storage", e);
    }
    return INITIAL_PRODUCTS;
  });

  // Orders state
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('dns_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Failed to load orders from storage", e);
    }
    return INITIAL_ORDERS;
  });

  // Saved Addresses state
  const [savedAddresses, setSavedAddresses] = useState(() => {
    try {
      const saved = localStorage.getItem('dns_addresses');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'addr-1',
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
    ];
  });

  const [selectedAddressId, setSelectedAddressId] = useState(() => {
    const defaultAddr = savedAddresses.find(a => a.isDefault);
    return defaultAddr ? defaultAddr.id : savedAddresses[0]?.id || null;
  });

  // WhatsApp Store Phone (editable by admin)
  const [storeWhatsAppPhone, setStoreWhatsAppPhone] = useState(() => {
    return localStorage.getItem('dns_store_whatsapp') || '919876543210';
  });

  // Cart state: [ { product, quantity } ]
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('dns_cart');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      { product: INITIAL_PRODUCTS[0], quantity: 1 },
      { product: INITIAL_PRODUCTS[2], quantity: 2 }
    ];
  });

  // Wishlist state: Array of product IDs
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('dns_wishlist');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [INITIAL_PRODUCTS[1].id, INITIAL_PRODUCTS[5].id];
  });

  // Navigation & View state
  const [activeView, setActiveView] = useState('home'); // home, products, pdp, cart, checkout, order-success, order-tracking, orders, wishlist, admin
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('popularity'); // popularity, price-asc, price-desc, discount, rating
  const [inStockOnly, setInStockOnly] = useState(false);

  // Delivery Location
  const [deliveryLocation, setDeliveryLocation] = useState({
    city: "Bhubaneswar",
    pincode: "751024",
    area: "Patia / Infocity",
    eta: "12 mins"
  });

  // Customer User Session
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('dns_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  // Visitor & Login Tracking
  const [visitCount, setVisitCount] = useState(() => {
    try {
      const saved = localStorage.getItem('dns_visit_count');
      const count = saved ? parseInt(saved, 10) : 0;
      const nextCount = count + 1;
      localStorage.setItem('dns_visit_count', String(nextCount));
      return nextCount;
    } catch (e) {
      return 1;
    }
  });

  const [lastVisitTime, setLastVisitTime] = useState(() => {
    try {
      const prev = localStorage.getItem('dns_last_visit_time');
      localStorage.setItem('dns_last_visit_time', new Date().toISOString());
      return prev || null;
    } catch (e) {
      return null;
    }
  });

  const [loginCount, setLoginCount] = useState(() => {
    try {
      const saved = localStorage.getItem('dns_login_count');
      return saved ? parseInt(saved, 10) : (localStorage.getItem('dns_user') ? 1 : 0);
    } catch (e) {
      return 0;
    }
  });

  const recordLogin = () => {
    setLoginCount(prev => {
      const next = prev + 1;
      localStorage.setItem('dns_login_count', String(next));
      return next;
    });
    fetch('/api/stats/login', { method: 'POST' }).catch(() => {});
  };

  // Sync visit to backend once on mount
  useEffect(() => {
    fetch('/api/stats/visit', { method: 'POST' }).catch(() => {});
  }, []);

  // Calculate dynamic loyalty tier based on visits and logins
  const loyaltyTier = (() => {
    if (visitCount >= 10 || loginCount >= 8) {
      return {
        name: "Diamond Elite VIP",
        badge: "💎 Diamond VIP",
        visits: visitCount,
        logins: loginCount,
        perk: "10-Min Priority Dispatch & Zero Delivery Fee",
        color: "text-purple-600 bg-purple-50 border-purple-200",
        badgeBg: "from-purple-600 to-indigo-600"
      };
    }
    if (visitCount >= 5 || loginCount >= 4) {
      return {
        name: "Gold VIP Patron",
        badge: "👑 Gold VIP",
        visits: visitCount,
        logins: loginCount,
        perk: "5% Weekly Cashback & Instant WhatsApp Priority",
        color: "text-amber-600 bg-amber-50 border-amber-200",
        badgeBg: "from-amber-500 to-amber-600"
      };
    }
    if (visitCount >= 2 || loginCount >= 1) {
      return {
        name: "Frequent Shopper",
        badge: "🛒 Frequent Shopper",
        visits: visitCount,
        logins: loginCount,
        perk: "Fast 12-Min Delivery & Free Express Dispatch",
        color: "text-brand-600 bg-brand-50 border-brand-200",
        badgeBg: "from-brand-500 to-fresh-500"
      };
    }
    return {
      name: "New Explorer",
      badge: "🌟 New Explorer",
      visits: visitCount,
      logins: loginCount,
      perk: "Welcome Gift Voucher on First Order",
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      badgeBg: "from-emerald-500 to-teal-600"
    };
  })();

  const formatTimeAgo = (isoString) => {
    if (!isoString) return 'First time visit';
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return 'Just moments ago';
      if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return 'Recently';
    }
  };

  // Toast Notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToast({ message, type, id });
    setTimeout(() => {
      setToast(prev => (prev?.id === id ? null : prev));
    }, 3000);
  };

  // Sync products
  useEffect(() => {
    try {
      localStorage.setItem('dns_products', JSON.stringify(products));
    } catch (e) {
      console.error("Storage error", e);
    }
  }, [products]);

  // Sync orders
  useEffect(() => {
    try {
      localStorage.setItem('dns_orders', JSON.stringify(orders));
    } catch (e) {
      console.error("Storage error", e);
    }
  }, [orders]);

  // Sync addresses
  useEffect(() => {
    try {
      localStorage.setItem('dns_addresses', JSON.stringify(savedAddresses));
    } catch (e) {
      console.error(e);
    }
  }, [savedAddresses]);

  // Sync WhatsApp Phone
  useEffect(() => {
    try {
      localStorage.setItem('dns_store_whatsapp', storeWhatsAppPhone);
    } catch (e) {
      console.error(e);
    }
  }, [storeWhatsAppPhone]);

  // Sync cart
  useEffect(() => {
    try {
      localStorage.setItem('dns_cart', JSON.stringify(cart));
    } catch (e) {
      console.error("Storage error", e);
    }
  }, [cart]);

  // Sync wishlist
  useEffect(() => {
    try {
      localStorage.setItem('dns_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error("Storage error", e);
    }
  }, [wishlist]);

  // Address CRUD operations
  const addAddress = (newAddr) => {
    const address = {
      ...newAddr,
      id: `addr-${Date.now()}`,
      isDefault: savedAddresses.length === 0 ? true : Boolean(newAddr.isDefault)
    };

    setSavedAddresses(prev => {
      if (address.isDefault) {
        return [address, ...prev.map(a => ({ ...a, isDefault: false }))];
      }
      return [address, ...prev];
    });

    setSelectedAddressId(address.id);
    showToast("Delivery address saved successfully!", "success");
    return address;
  };

  const updateAddress = (id, updatedFields) => {
    setSavedAddresses(prev =>
      prev.map(addr => {
        if (addr.id === id) {
          return { ...addr, ...updatedFields };
        }
        if (updatedFields.isDefault) {
          return { ...addr, isDefault: false };
        }
        return addr;
      })
    );
    showToast("Address updated!", "success");
  };

  const deleteAddress = (id) => {
    setSavedAddresses(prev => {
      const filtered = prev.filter(a => a.id !== id);
      if (selectedAddressId === id && filtered.length > 0) {
        setSelectedAddressId(filtered[0].id);
      }
      return filtered;
    });
    showToast("Address removed", "info");
  };

  const selectedAddress = savedAddresses.find(a => a.id === selectedAddressId) || savedAddresses[0] || null;

  // Cart operations
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${product.name.slice(0, 24)}... to basket!`);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast("Item removed from basket", "info");
  };

  const clearCart = () => {
    setCart([]);
  };

  const getItemQuantityInCart = (productId) => {
    const item = cart.find(i => i.product.id === productId);
    return item ? item.quantity : 0;
  };

  // Cart totals calculation
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartMrpTotal = cart.reduce((sum, item) => sum + (item.product.mrp * item.quantity), 0);
  const cartSavings = cartMrpTotal - cartSubtotal;
  const deliveryFee = cartSubtotal > 499 || cartSubtotal === 0 ? 0 : 25;
  const cartTotal = cartSubtotal > 0 ? cartSubtotal + deliveryFee : 0;
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist operations
  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast("Removed from Wishlist", "info");
        return prev.filter(id => id !== productId);
      } else {
        showToast("Added to Wishlist ❤️", "success");
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  // Product CRUD (Admin)
  const addProduct = (newProduct) => {
    const product = {
      ...newProduct,
      id: `custom-${Date.now()}`,
      rating: newProduct.rating || 4.5,
      reviewsCount: newProduct.reviewsCount || 1,
      isBestSeller: Boolean(newProduct.isBestSeller)
    };
    setProducts(prev => [product, ...prev]);
    showToast("Product added to catalog!", "success");
    return product;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updatedFields } : p))
    );
    setCart(prev =>
      prev.map(item =>
        item.product.id === id ? { ...item, product: { ...item.product, ...updatedFields } } : item
      )
    );
    showToast("Product updated successfully!", "success");
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setCart(prev => prev.filter(item => item.product.id !== id));
    setWishlist(prev => prev.filter(itemId => itemId !== id));
    showToast("Product removed from catalog", "info");
  };

  const resetProductsToDefault = () => {
    setProducts(INITIAL_PRODUCTS);
    localStorage.setItem('dns_products', JSON.stringify(INITIAL_PRODUCTS));
    showToast("Catalog reset to default 15 categories!", "success");
  };

  // WhatsApp Order Formatting
  const generateWhatsAppMessage = (order) => {
    const itemsText = order.items
      ?.map((item, index) => `${index + 1}. *${item.name}* (${item.unit || '1 pc'}) × ${item.quantity} = ₹${item.price * item.quantity}`)
      .join('\n');

    return `🛍️ *NEW ORDER - DAILY NEEDS STORE*
---------------------------------------
📦 *Order ID:* ${order.id}
📅 *Date:* ${new Date(order.createdAt).toLocaleString('en-IN')}
🔑 *Delivery OTP:* ${order.deliveryOtp || '4829'}

👤 *CUSTOMER DETAILS:*
• *Name:* ${order.customer.name}
• *Phone:* ${order.customer.phone}
• *Address:* ${order.customer.address}, ${order.customer.city} - ${order.customer.pincode}

🛒 *ORDERED ITEMS:*
${itemsText}

💰 *PAYMENT BREAKDOWN:*
• Items Subtotal: ₹${order.subtotal}
• Delivery Fee: ${order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}
• Total Savings: ₹${order.discount || 0}
---------------------------------------
⭐ *TOTAL AMOUNT:* ₹${order.total}
💳 *Payment Mode:* ${order.paymentMethod}
⚡ *Delivery Slot:* ${order.deliverySlot}

📍 *Status:* ${order.status}
Please confirm packing and dispatch! Thank you.`;
  };

  const openWhatsAppForOrder = (order, targetPhone = null) => {
    const phone = targetPhone || storeWhatsAppPhone;
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const message = generateWhatsAppMessage(order);
    const encodedMessage = encodeURIComponent(message);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    window.open(waUrl, '_blank');
  };

  // Order operations
  const createOrder = (orderData, sendToWhatsApp = false) => {
    const newOrder = {
      ...orderData,
      id: `DNS-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      status: 'Confirmed',
      deliveryOtp: `${Math.floor(1000 + Math.random() * 9000)}`
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setActiveTrackingOrder(newOrder);
    setActiveView('order-success');
    showToast("Order placed successfully! 🚀", "success");

    if (sendToWhatsApp) {
      setTimeout(() => {
        openWhatsAppForOrder(newOrder);
      }, 500);
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    if (activeTrackingOrder && activeTrackingOrder.id === orderId) {
      setActiveTrackingOrder(prev => ({ ...prev, status: newStatus }));
    }
    showToast(`Order status updated to: ${newStatus}`, "info");
  };

  const deleteOrder = (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    showToast("Order removed", "info");
  };

  const viewProductDetails = (product) => {
    setSelectedProduct(product);
    setActiveView('pdp');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtered products list
  const filteredProducts = products.filter(product => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchCategory = product.category.toLowerCase().includes(q);
      const matchDesc = product.description?.toLowerCase().includes(q);
      if (!matchName && !matchCategory && !matchDesc) return false;
    }

    if (selectedCategory !== 'All' && product.category !== selectedCategory) {
      return false;
    }

    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }

    if (product.rating < minRating) {
      return false;
    }

    if (inStockOnly && product.stock <= 0) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'discount') {
      const discA = ((a.mrp - a.price) / a.mrp);
      const discB = ((b.mrp - b.price) / b.mrp);
      return discB - discA;
    }
    if (sortBy === 'rating') return b.rating - a.rating;
    if (a.isBestSeller && !b.isBestSeller) return -1;
    if (!a.isBestSeller && b.isBestSeller) return 1;
    return b.reviewsCount - a.reviewsCount;
  });

  return (
    <StoreContext.Provider
      value={{
        products,
        categories: CATEGORIES,
        orders,
        cart,
        wishlist,
        activeView,
        setActiveView,
        selectedProduct,
        setSelectedProduct,
        activeTrackingOrder,
        setActiveTrackingOrder,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        priceRange,
        setPriceRange,
        minRating,
        setMinRating,
        sortBy,
        setSortBy,
        inStockOnly,
        setInStockOnly,
        deliveryLocation,
        setDeliveryLocation,
        user,
        setUser,
        toast,
        showToast,
        // Visitor & Login Tracking
        visitCount,
        loginCount,
        lastVisitTime,
        recordLogin,
        loyaltyTier,
        formatTimeAgo,
        // Addresses
        savedAddresses,
        selectedAddressId,
        setSelectedAddressId,
        selectedAddress,
        addAddress,
        updateAddress,
        deleteAddress,
        // WhatsApp Store Integration
        storeWhatsAppPhone,
        setStoreWhatsAppPhone,
        openWhatsAppForOrder,
        generateWhatsAppMessage,
        // Cart
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getItemQuantityInCart,
        cartSubtotal,
        cartMrpTotal,
        cartSavings,
        deliveryFee,
        cartTotal,
        cartItemsCount,
        // Wishlist
        toggleWishlist,
        isInWishlist,
        // Admin Product CRUD
        addProduct,
        updateProduct,
        deleteProduct,
        resetProductsToDefault,
        // Admin Order Management
        createOrder,
        updateOrderStatus,
        deleteOrder,
        // Views
        viewProductDetails,
        filteredProducts
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
