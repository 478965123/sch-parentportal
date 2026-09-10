import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, LogOut, DollarSign, Clock, Ticket, Receipt, ShoppingCart, Calendar, Settings, User, X, ArrowRight } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";
import schooneyLogo from "@/assets/schooney-logo.png";
import { ParentAccountSelector } from "./ParentAccountSelector";
import { AccountSettingsDialog } from "./AccountSettingsDialog";
import { useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { CountdownTimer } from "./CountdownTimer";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CartItem {
  id: string;
  name: string;
  price: number;
  type: string;
  studentName?: string;
  studentId?: string;
}

interface PortalHeaderProps {
  onLogout?: () => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  cartItemCount?: number;
  cartItems?: CartItem[];
  onGoToCart?: () => void;
  onRemoveItem?: (itemId: string, studentId?: string) => void;
  showCountdown?: boolean;
  onCountdownExpired?: () => void;
  onCancelCountdown?: () => void;
  additionalCourses?: number;
  unpaidInvoicesCount?: number;
}

export const PortalHeader = ({
  onLogout,
  activeTab = "dashboard",
  onTabChange,
  cartItemCount = 0,
  cartItems = [],
  onGoToCart,
  onRemoveItem,
  showCountdown = false,
  onCountdownExpired,
  onCancelCountdown,
  additionalCourses = 0,
  unpaidInvoicesCount = 0
}: PortalHeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const cartHoverTimeout = useRef<ReturnType<typeof setTimeout>>();
  const { t, language, formatCurrency } = useLanguage();

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const fontClass = language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato';

  const cartLabels = {
    cart: language === 'th' ? 'ตะกร้า' : language === 'zh' ? '购物车' : 'Cart',
    empty: language === 'th' ? 'ตะกร้าว่างเปล่า' : language === 'zh' ? '购物车是空的' : 'Cart is empty',
    checkout: language === 'th' ? 'ดำเนินการชำระเงิน' : language === 'zh' ? '去结账' : 'Proceed to Payment',
    total: language === 'th' ? 'รวมทั้งหมด' : language === 'zh' ? '总计' : 'Total',
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const days = ['day.sunday', 'day.monday', 'day.tuesday', 'day.wednesday', 'day.thursday', 'day.friday', 'day.saturday'];
    const months = ['month.january', 'month.february', 'month.march', 'month.april', 'month.may', 'month.june', 'month.july', 'month.august', 'month.september', 'month.october', 'month.november', 'month.december'];
    const dayName = t(days[date.getDay()]);
    const monthName = t(months[date.getMonth()]);
    if (language === 'en') {
      return `${dayName}, ${date.getDate()} ${monthName} ${date.getFullYear()}`;
    } else if (language === 'th') {
      return `${dayName}ที่ ${date.getDate()} ${monthName} ${date.getFullYear() + 543}`;
    } else if (language === 'zh') {
      return `${date.getFullYear()}年${monthName}${date.getDate()}日 ${dayName}`;
    }
    return dateString;
  };
  const today = new Date();
  const formattedToday = formatDate(today.toISOString().split('T')[0]);
  return <>
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <img src={schooneyLogo} alt="Schooney" className="h-7 sm:h-8 w-auto" />
            <div>
              <h1 className={`text-lg font-bold text-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>Payment Portal</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-4">
            <ParentAccountSelector onLogout={onLogout} />

            {/* Cart Button + Popup */}
            <div
              className="relative"
              onMouseEnter={() => { clearTimeout(cartHoverTimeout.current); setCartOpen(true); }}
              onMouseLeave={() => { cartHoverTimeout.current = setTimeout(() => setCartOpen(false), 300); }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="relative h-9 w-9 p-0"
                onClick={() => setCartOpen(prev => !prev)}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px] font-bold"
                  >
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </Badge>
                )}
              </Button>

              {cartOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-background border border-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <div className={`flex items-center gap-2 font-semibold text-sm ${fontClass}`}>
                      <ShoppingCart className="h-4 w-4 text-primary" />
                      {cartLabels.cart}
                      {cartItemCount > 0 && (
                        <Badge variant="secondary" className="h-5 px-1.5 text-xs">{cartItemCount}</Badge>
                      )}
                    </div>
                    <button
                      onClick={() => setCartOpen(false)}
                      className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Items */}
                  {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                      <ShoppingCart className="h-10 w-10 mb-2 opacity-20" />
                      <p className={`text-sm ${fontClass}`}>{cartLabels.empty}</p>
                    </div>
                  ) : (
                    <>
                      <ScrollArea className="max-h-60">
                        <div className="px-4 py-2">
                          {cartItems.map((item) => (
                            <div
                              key={`${item.id}-${item.studentId}`}
                              className="flex items-start justify-between py-2.5 border-b border-border/40 last:border-0"
                            >
                              <div className="flex-1 min-w-0 pr-2">
                                <p className={`text-sm font-medium truncate ${fontClass}`}>{item.name}</p>
                                {item.studentName && (
                                  <p className={`text-xs text-muted-foreground ${fontClass}`}>{item.studentName}</p>
                                )}
                                <p className={`text-sm font-semibold text-primary mt-0.5 ${fontClass}`}>
                                  {formatCurrency(item.price)}
                                </p>
                              </div>
                              {onRemoveItem && (
                                <button
                                  onClick={() => onRemoveItem(item.id, item.studentId)}
                                  className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors shrink-0 mt-0.5"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </ScrollArea>

                      {/* Footer: Total + Button */}
                      <div className="px-4 py-3 border-t border-border bg-muted/30 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm text-muted-foreground ${fontClass}`}>{cartLabels.total}</span>
                          <span className={`text-base font-bold text-primary ${fontClass}`}>
                            {formatCurrency(cartTotal)}
                          </span>
                        </div>
                        <Button
                          onClick={() => { setCartOpen(false); onGoToCart?.(); }}
                          className={`w-full h-9 text-sm ${fontClass}`}
                          size="sm"
                        >
                          <ArrowRight className="h-4 w-4 mr-1.5" />
                          {cartLabels.checkout}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            <LanguageSelector />
          </div>

          {/* Mobile: Cart + Menu Button */}
          <div className="lg:hidden flex items-center gap-1">
            <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0" onClick={onGoToCart}>
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px] font-bold"
                >
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </Badge>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-sm">
          <div className="px-2 py-4 space-y-4">

            {/* User Info */}
            <div className="px-2 flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="text-sm font-semibold bg-primary/10 text-primary">JS</AvatarFallback>
              </Avatar>
              <div>
                <p className={`font-semibold text-sm ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>John Smith</p>
                <p className="text-xs text-muted-foreground">john.smith@email.com</p>
              </div>
            </div>
            <Separator />

            {/* Navigation Menu */}
            <div className="px-2">
              <h4 className={`font-medium mb-3 text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('nav.home')}</h4>
              <div className="space-y-1">
                <button onClick={() => { onTabChange?.("dashboard"); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${activeTab === "dashboard" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"} ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  <GraduationCap className="h-4 w-4" />
                  Dashboard
                </button>
                <button onClick={() => { onTabChange?.("tuition"); setIsMobileMenuOpen(false); }} className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${activeTab === "tuition" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"} ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-4 w-4" />
                    Tuition
                  </div>
                  {unpaidInvoicesCount > 0 && (
                    <Badge variant="destructive" className="h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {unpaidInvoicesCount}
                    </Badge>
                  )}
                </button>
                <button onClick={() => { onTabChange?.("afterschool"); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${activeTab === "afterschool" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"} ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  <Clock className="h-4 w-4" />
                  ECA & EAS
                </button>
                <button onClick={() => { onTabChange?.("summer"); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${activeTab === "summer" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"} ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  <Ticket className="h-4 w-4" />
                  {language === 'th' ? 'ทริปและกิจกรรม' : language === 'zh' ? '旅行和活动' : 'Trip & Activity'}
                </button>

                {/* Event with Sub-items */}
                <div className="space-y-1">
                  <button onClick={() => { onTabChange?.("event"); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${activeTab === "event" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"} ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                    <Calendar className="h-4 w-4" />
                    Event
                  </button>
                </div>

                <button onClick={() => { onTabChange?.("transaction"); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${activeTab === "transaction" ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"} ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  <Receipt className="h-4 w-4" />
                  {language === 'th' ? 'ประวัติธุรกรรม' : 'Transaction History'}
                </button>
              </div>
            </div>

            <div className="flex items-center px-2 pt-3 border-t border-border">
              <LanguageSelector />
            </div>

            {/* Account Actions */}
            <div className="px-2 pt-3 border-t border-border space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => { setSettingsOpen(true); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-center gap-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
              >
                <Settings className="h-4 w-4" />
                {language === 'th' ? 'ตั้งค่าบัญชี' : language === 'zh' ? '账户设置' : 'Account Settings'}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => { onLogout?.(); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center justify-center gap-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
              >
                <LogOut className="h-4 w-4" />
                {t('nav.logout')}
              </Button>
            </div>
          </div>
        </div>}
      </div>
    </header>

    <AccountSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />

    {/* Welcome Section */}
    <div className="bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h2 className={`text-xl font-semibold text-primary ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {t('portal.welcome')}, John Smith
              </h2>
              <p className={`text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {t('portal.today')}: {formattedToday}
              </p>
            </div>

            {/* Countdown Timer */}
            {showCountdown && onCountdownExpired && onCancelCountdown && <CountdownTimer onTimeExpired={onCountdownExpired} onCancel={onCancelCountdown} additionalCourses={additionalCourses} />}
          </div>
        </div>
      </div>
    </div>
  </>;
};