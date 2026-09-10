import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Login } from "./pages/Login";
import { NewStudentRegistration } from "./pages/NewStudentRegistration";
import { ParentPortal } from "./pages/ParentPortal";
import { CartPage } from "./pages/Cart";
import { TripCartPage } from "./pages/TripCart";
import { CheckoutPage } from "./pages/Checkout";
import { ActivityPaymentSuccess } from "./components/portal/ActivityPaymentSuccess";
import { LanguageProvider } from "./contexts/LanguageContext";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { PaymentErrorBoundary } from "./components/PaymentErrorBoundary";
import { mockCreditNotes } from "./data/mockData";
import { TripCartItem } from "./components/portal/TripCartView";

const queryClient = new QueryClient();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [currentPage, setCurrentPage] = useState<'portal' | 'cart' | 'checkout' | 'success' | 'tripCart' | 'tripCheckout'>('portal');
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [paymentSuccessData, setPaymentSuccessData] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [tripCartItems, setTripCartItems] = useState<TripCartItem[]>([]);
  const [showCountdown, setShowCountdown] = useState(false);
  const [paidInvoiceIds, setPaidInvoiceIds] = useState<string[]>([]);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage('portal');
  };

  const handleGoToCart = () => {
    setCurrentPage('cart');
  };

  const handleAddToCart = (item: any) => {
    // Check if item already exists in cart
    const existingItem = cartItems.find(cartItem => 
      cartItem.id === item.id && 
      cartItem.studentId === item.studentId
    );
    
    if (!existingItem) {
      setCartItems(prev => [...prev, item]);
      
      // Start countdown timer if adding after school or summer items
      if (item.type === 'activity' || item.category === 'after-school' || item.category === 'summer') {
        setShowCountdown(true);
      }
      
      return true;
    }
    return false;
  };

  const handleRemoveFromCart = (itemId: string, studentId?: string) => {
    setCartItems(prev => {
      const newItems = prev.filter(item => 
        !(item.id === itemId && item.studentId === studentId)
      );
      
      // Hide countdown if no after school or summer items left
      const hasActivityItems = newItems.some(item => 
        item.type === 'activity' || item.category === 'after-school' || item.category === 'summer'
      );
      if (!hasActivityItems) {
        setShowCountdown(false);
      }
      
      return newItems;
    });
  };

  const isInCart = (itemId: string, studentId?: string) => {
    return cartItems.some(item => 
      item.id === itemId && 
      (studentId ? item.studentId === studentId : true)
    );
  };

  const handleGoToCheckout = (data: any) => {
    setCheckoutData(data);
    setCurrentPage('checkout');
  };

  const handleBackToPortal = () => {
    setCurrentPage('portal');
  };

  const handleBackToCart = () => {
    setCurrentPage('cart');
  };

  const handleBackToTripCart = () => {
    setCurrentPage('tripCart');
  };

  // Trip cart handlers
  const handleGoToTripCart = (items: TripCartItem[]) => {
    setTripCartItems(items);
    setCurrentPage('tripCart');
  };

  const handleTripCheckout = (items: TripCartItem[]) => {
    // Convert trip items to checkout format
    const checkoutItems = items.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      type: 'trip' as const,
      studentName: item.studentName,
      studentId: item.studentId,
      date: item.date,
      location: item.location
    }));
    setCheckoutData({ type: 'trips', items: checkoutItems });
    setCurrentPage('tripCheckout');
  };

  const handleRemoveTripFromCart = (tripId: string) => {
    setTripCartItems(prev => prev.filter(item => item.id !== tripId));
  };

  const handlePaymentSuccess = (paymentData: any) => {
    setPaymentSuccessData(paymentData);
    setCurrentPage('success');
    // Track paid invoice IDs so ParentPortal can mark them as paid on remount
    const paidIds = (checkoutData?.items || cartItems).map((item: any) => item.id);
    setPaidInvoiceIds(prev => [...new Set([...prev, ...paidIds])]);
    // Clear cart items after successful payment
    if (checkoutData?.type === 'trips') {
      setTripCartItems([]);
    } else {
      setCartItems([]);
    }
    // Hide countdown
    setShowCountdown(false);
  };

  const handleCountdownExpired = () => {
    // Remove all after school and summer items from cart
    setCartItems(prev => prev.filter(item => 
      !(item.type === 'activity' || item.category === 'after-school' || item.category === 'summer')
    ));
    setShowCountdown(false);
  };

  const handleCancelCountdown = () => {
    // Remove all after school and summer items from cart
    setCartItems(prev => prev.filter(item => 
      !(item.type === 'activity' || item.category === 'after-school' || item.category === 'summer')
    ));
    setShowCountdown(false);
  };

  const handleBackToDashboard = () => {
    setCurrentPage('portal');
    setPaymentSuccessData(null);
    setCheckoutData(null);
  };

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LanguageProvider>
            <Toaster />
            <Sonner />
            {!isLoggedIn ? (
              authView === 'register' ? (
                <NewStudentRegistration onBack={() => setAuthView('login')} />
              ) : (
                <Login onLogin={handleLogin} onRegister={() => setAuthView('register')} />
              )
            ) : currentPage === 'portal' ? (
              <ParentPortal
                onLogout={handleLogout}
                onGoToCart={handleGoToCart}
                onGoToCheckout={handleGoToCheckout}
                onGoToTripCart={handleGoToTripCart}
                cartItems={cartItems}
                onAddToCart={handleAddToCart}
                onRemoveFromCart={handleRemoveFromCart}
                isInCart={isInCart}
                showCountdown={showCountdown}
                onCountdownExpired={handleCountdownExpired}
                onCancelCountdown={handleCancelCountdown}
                paidInvoiceIds={paidInvoiceIds}
              />
            ) : currentPage === 'cart' ? (
              <CartPage
                items={cartItems}
                creditNotes={mockCreditNotes}
                onRemoveItem={(itemId: string) => {
                  const itemToRemove = cartItems.find(item => item.id === itemId);
                  if (itemToRemove) {
                    handleRemoveFromCart(itemId, itemToRemove.studentId);
                  }
                }}
                onPaymentSuccess={handlePaymentSuccess}
                onBackToPortal={handleBackToPortal}
              />
            ) : currentPage === 'tripCart' ? (
              <TripCartPage
                items={tripCartItems}
                onRemoveItem={handleRemoveTripFromCart}
                onCheckout={handleTripCheckout}
                onBackToPortal={handleBackToPortal}
              />
            ) : currentPage === 'checkout' || currentPage === 'tripCheckout' ? (
              <PaymentErrorBoundary>
                <CheckoutPage
                  type={checkoutData?.type || 'activities'}
                  invoice={checkoutData?.invoice}
                  items={checkoutData?.items || cartItems}
                  creditBalance={1500}
                  selectedCreditNotes={checkoutData?.selectedCreditNotes || []}
                  totalCreditApplied={checkoutData?.totalCreditApplied || 0}
                  onPaymentSuccess={handlePaymentSuccess}
                  onCancel={
                    checkoutData?.type === 'trips'
                      ? handleBackToTripCart
                      : checkoutData?.type === 'activities'
                        ? handleBackToCart
                        : handleBackToPortal
                  }
                  onRemoveItem={(itemId: string) => {
                    if (checkoutData?.type === 'trips') {
                      handleRemoveTripFromCart(itemId);
                    } else if (checkoutData?.type === 'activities') {
                      const itemToRemove = cartItems.find(item => item.id === itemId);
                      if (itemToRemove) {
                        handleRemoveFromCart(itemId, itemToRemove.studentId);
                      }
                    }
                  }}
                />
              </PaymentErrorBoundary>
            ) : currentPage === 'success' && paymentSuccessData ? (
              <ActivityPaymentSuccess
                studentName={paymentSuccessData.studentName || "นักเรียน"}
                paymentData={paymentSuccessData}
                onBackToMain={handleBackToDashboard}
              />
            ) : null}
          </LanguageProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
