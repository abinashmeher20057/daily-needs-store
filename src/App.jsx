import React, { useState, useEffect } from 'react';
import { useStore } from './context/StoreContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Toast } from './components/common/Toast';
import { LoadingScreen } from './components/common/LoadingScreen';
import { CartDrawer } from './components/customer/CartDrawer';
import { HomePage } from './components/customer/HomePage';
import { ProductListingView } from './components/customer/ProductListingView';
import { ProductDetailPage } from './components/customer/ProductDetailPage';
import { CheckoutView } from './components/customer/CheckoutView';
import { OrderSuccessView } from './components/customer/OrderSuccessView';
import { OrderTrackingView } from './components/customer/OrderTrackingView';
import { OrdersHistoryView } from './components/customer/OrdersHistoryView';
import { WishlistView } from './components/customer/WishlistView';
import { AdminPortal } from './components/admin/AdminPortal';
import { AuthGatewayPortal } from './components/auth/AuthGatewayPortal';

export function App() {
  const { activeView, setActiveView, user, setUser, showToast, recordLogin } = useStore();

  // Loading Screen State (Runs on initial launch for 2.4 seconds with skip option)
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  // Authentication State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('dns_admin_token'));
  });

  const [isGuestMode, setIsGuestMode] = useState(() => {
    return localStorage.getItem('dns_guest_mode') === 'true';
  });

  // Determines whether the user has access to view the main website
  const isAuthenticatedUser = Boolean(user && user.email) || isGuestMode || isAdminAuthenticated;

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  // Handle Customer Login Success from Gateway
  const handleCustomerLoginSuccess = (userData, token) => {
    setUser(userData);
    localStorage.setItem('dns_user', JSON.stringify(userData));
    localStorage.setItem('dns_token', token);
    localStorage.removeItem('dns_guest_mode');
    setIsGuestMode(false);
    recordLogin();
    setActiveView('home');
  };

  // Handle Admin Login Success from Gateway
  const handleAdminLoginSuccess = (adminData, token) => {
    setIsAdminAuthenticated(true);
    localStorage.setItem('dns_admin_token', token);
    localStorage.removeItem('dns_guest_mode');
    setIsGuestMode(false);
    recordLogin();
    setActiveView('admin');
  };

  // Handle Continue as Guest
  const handleContinueAsGuest = () => {
    setIsGuestMode(true);
    localStorage.setItem('dns_guest_mode', 'true');
    showToast("Browsing Daily Needs Store as Guest 🛒", "info");
    setActiveView('home');
  };

  // Handle Admin Logout
  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem('dns_admin_token');
    showToast("Signed out of Admin Console", "info");
    setActiveView('home');
  };

  return (
    <>
      {/* 🚀 High-End Loading Screen (Initial Launch & Preloading) */}
      {showLoadingScreen && (
        <LoadingScreen 
          duration={2000} 
          onFinished={() => setShowLoadingScreen(false)} 
        />
      )}

      {/* 1. If not authenticated and not in guest mode -> Show the Structured Security Gateway */}
      {!isAuthenticatedUser ? (
        <div className="min-h-screen bg-[#030712]">
          <AuthGatewayPortal
            initialTab="customer-login"
            onCustomerLogin={handleCustomerLoginSuccess}
            onAdminLogin={handleAdminLoginSuccess}
            onContinueAsGuest={handleContinueAsGuest}
          />
          <Toast />
        </div>
      ) : activeView === 'admin' ? (
        /* 2. Admin Portal View */
        !isAdminAuthenticated ? (
          <div className="min-h-screen bg-[#030712]">
            <AuthGatewayPortal
              initialTab="admin-login"
              onCustomerLogin={handleCustomerLoginSuccess}
              onAdminLogin={handleAdminLoginSuccess}
              onContinueAsGuest={handleContinueAsGuest}
            />
            <Toast />
          </div>
        ) : (
          <div className="min-h-screen bg-slate-900">
            <AdminPortal onAdminLogout={handleAdminLogout} />
            <Toast />
          </div>
        )
      ) : (
        /* 3. Main Customer Website (Once Logged In or in Guest Mode) */
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-brand-500 selection:text-white">
          {/* Flipkart Speed & Blinkit Style Header */}
          <Header />

          {/* Main View Router */}
          <main className="flex-1">
            {activeView === 'home' && <HomePage />}
            {activeView === 'products' && <ProductListingView />}
            {activeView === 'pdp' && <ProductDetailPage />}
            {activeView === 'checkout' && <CheckoutView />}
            {activeView === 'order-success' && <OrderSuccessView />}
            {activeView === 'order-tracking' && <OrderTrackingView />}
            {activeView === 'orders' && <OrdersHistoryView />}
            {activeView === 'wishlist' && <WishlistView />}
          </main>

          {/* Global Slide-out Drawer Cart */}
          <CartDrawer />

          {/* Toast Notification Container */}
          <Toast />

          {/* Premium Footer */}
          <Footer />
        </div>
      )}
    </>
  );
}

export default App;
