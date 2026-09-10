import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingCart, X, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface CartItem {
  id: string;
  name: string;
  price: number;
  type: string;
  studentName?: string;
  studentId?: string;
  category?: string;
}

interface StickyCartIconProps {
  itemCount: number;
  cartItems: CartItem[];
  onCheckout: () => void;
  onRemoveItem?: (itemId: string, studentId?: string) => void;
  formatCurrency?: (amount: number) => string;
  language?: string;
  cartBounce?: boolean;
}

export const StickyCartIcon = ({
  itemCount,
  cartItems,
  onCheckout,
  onRemoveItem,
  formatCurrency = (n) => `฿${n.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
  language = 'en',
  cartBounce = false,
}: StickyCartIconProps) => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const isEmpty = itemCount === 0;
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);
  const fontClass = language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato';
  const bottomPosition = isMobile ? "bottom-20" : "bottom-6";

  const labels = {
    cart: language === 'th' ? 'ตะกร้า' : language === 'zh' ? '购物车' : 'Cart',
    empty: language === 'th' ? 'ตะกร้าว่างเปล่า' : language === 'zh' ? '购物车是空的' : 'Cart is empty',
    checkout: language === 'th' ? 'ดำเนินการชำระเงิน' : language === 'zh' ? '去结账' : 'Proceed to Checkout',
    total: language === 'th' ? 'รวมทั้งหมด' : language === 'zh' ? '总计' : 'Total',
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      clearTimeout(hoverTimeoutRef.current);
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      hoverTimeoutRef.current = setTimeout(() => setIsOpen(false), 300);
    }
  };

  const handleCheckout = () => {
    setIsOpen(false);
    onCheckout();
  };

  useEffect(() => {
    return () => clearTimeout(hoverTimeoutRef.current);
  }, []);

  return (
    <div
      className={`fixed ${bottomPosition} right-4 z-50 flex flex-col items-end gap-2`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Popup Preview */}
      {isOpen && (
        <div
          className={cn(
            "bg-background border border-border rounded-xl shadow-2xl w-80 overflow-hidden",
            "animate-in slide-in-from-bottom-3 fade-in duration-200"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className={`flex items-center gap-2 font-semibold text-sm ${fontClass}`}>
              <ShoppingCart className="h-4 w-4 text-primary" />
              {labels.cart}
              {itemCount > 0 && (
                <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                  {itemCount}
                </Badge>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-muted transition-colors text-muted-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Content */}
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <ShoppingCart className="h-10 w-10 mb-2 opacity-20" />
              <p className={`text-sm ${fontClass}`}>{labels.empty}</p>
            </div>
          ) : (
            <>
              <ScrollArea className="max-h-60">
                <div className="px-4 py-2 space-y-0.5">
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

              {/* Footer */}
              <div className="px-4 py-3 border-t border-border bg-muted/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className={`text-sm text-muted-foreground ${fontClass}`}>{labels.total}</span>
                  <span className={`text-base font-bold text-primary ${fontClass}`}>
                    {formatCurrency(total)}
                  </span>
                </div>
                <Button
                  onClick={handleCheckout}
                  className={`w-full h-9 text-sm ${fontClass}`}
                  size="sm"
                >
                  <ArrowRight className="h-4 w-4 mr-1.5" />
                  {labels.checkout}
                </Button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Cart Button */}
      <Button
        onClick={() => setIsOpen((prev) => !prev)}
        size="lg"
        className={cn(
          "relative rounded-full h-14 w-14 md:h-16 md:w-16 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 animate-scale-in",
          isEmpty
            ? "bg-muted text-muted-foreground opacity-70 hover:opacity-100 hover:bg-primary hover:text-primary-foreground"
            : "bg-primary hover:bg-primary/90",
          !isEmpty && !isOpen && "animate-pulse hover:animate-none",
          cartBounce && "animate-bounce"
        )}
      >
        <ShoppingCart className={cn("h-6 w-6 md:h-7 md:w-7", cartBounce && "animate-ping")} />
        {itemCount > 0 && (
          <Badge
            variant="destructive"
            className={cn(
              "absolute -top-2 -right-2 h-6 w-6 md:h-7 md:w-7 flex items-center justify-center p-0 text-xs md:text-sm font-bold",
              cartBounce && "animate-bounce"
            )}
          >
            {itemCount > 99 ? '99+' : itemCount}
          </Badge>
        )}
      </Button>
    </div>
  );
};
