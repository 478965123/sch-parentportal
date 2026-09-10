import { useState, useEffect } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Trash2, X } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ScrollArea } from "@/components/ui/scroll-area";
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

interface MobileCartDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems: CartItem[];
  onRemoveItem: (itemId: string, studentId?: string) => void;
  onCheckout: () => void;
  onClearAll?: () => void;
  activeCartType?: 'tuition' | 'course' | 'trip' | 'exam' | 'all';
}

export const MobileCartDrawer = ({
  isOpen,
  onOpenChange,
  cartItems,
  onRemoveItem,
  onCheckout,
  onClearAll,
  activeCartType = 'all',
}: MobileCartDrawerProps) => {
  const { language, formatCurrency } = useLanguage();
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());
  const [isClearing, setIsClearing] = useState(false);
  
  const fontClass = language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato';

  // Filter items based on active cart type
  const filteredItems = activeCartType === 'all' 
    ? cartItems 
    : cartItems.filter(item => {
        if (activeCartType === 'tuition') return item.type === 'tuition';
        if (activeCartType === 'course') return item.type === 'course' || item.type === 'activity';
        if (activeCartType === 'trip') return item.category === 'trip';
        if (activeCartType === 'exam') return item.type === 'exam';
        return true;
      });

  const total = filteredItems.reduce((sum, item) => sum + item.price, 0);

  // Group items by type for display
  const groupedItems = filteredItems.reduce((acc, item) => {
    const key = item.type || 'other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, CartItem[]>);

  const getTypeLabel = (type: string) => {
    const labels: Record<string, { en: string; th: string; zh: string }> = {
      tuition: { en: 'Tuition', th: 'ค่าเล่าเรียน', zh: '学费' },
      course: { en: 'ECA & EAS', th: 'ECA & EAS', zh: 'ECA & EAS' },
      activity: { en: 'Activities', th: 'กิจกรรม', zh: '活动' },
      exam: { en: 'Exams', th: 'ข้อสอบ', zh: '考试' },
      event: { en: 'Events', th: 'กิจกรรมพิเศษ', zh: '活动' },
    };
    const label = labels[type] || { en: type, th: type, zh: type };
    return language === 'th' ? label.th : language === 'zh' ? label.zh : label.en;
  };

  const handleRemoveItem = (itemId: string, studentId?: string) => {
    const key = `${itemId}-${studentId}`;
    setRemovingItems(prev => new Set(prev).add(key));
    setTimeout(() => {
      onRemoveItem(itemId, studentId);
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }, 200);
  };

  const handleClearAll = () => {
    setIsClearing(true);
    setTimeout(() => {
      onClearAll?.();
      setIsClearing(false);
    }, 300);
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <DrawerTitle className={`flex items-center gap-2 ${fontClass}`}>
              <ShoppingCart className="h-5 w-5 text-primary" />
              {language === 'th' ? 'ตะกร้าของคุณ' : language === 'zh' ? '您的购物车' : 'Your Cart'}
              {filteredItems.length > 0 && (
                <Badge variant="secondary" className="animate-count-up">
                  {filteredItems.length}
                </Badge>
              )}
            </DrawerTitle>
            {filteredItems.length > 0 && onClearAll && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClearAll}
                className={cn(
                  "text-destructive hover:text-destructive hover:bg-destructive/10 touch-active",
                  isClearing && "opacity-50 pointer-events-none"
                )}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                <span className={`text-xs ${fontClass}`}>
                  {language === 'th' ? 'ล้างทั้งหมด' : 'Clear All'}
                </span>
              </Button>
            )}
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 px-4 py-3 max-h-[50vh]">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground animate-fade-in-up">
              <ShoppingCart className="h-12 w-12 mb-3 opacity-30" />
              <p className={fontClass}>
                {language === 'th' ? 'ตะกร้าว่างเปล่า' : language === 'zh' ? '购物车是空的' : 'Your cart is empty'}
              </p>
            </div>
          ) : (
            <div className={cn("space-y-4", isClearing && "animate-fade-out-down")}>
              {Object.entries(groupedItems).map(([type, items], groupIndex) => (
                <div key={type} className="space-y-2">
                  <h4 className={`text-xs font-semibold text-muted-foreground uppercase tracking-wide ${fontClass}`}>
                    {getTypeLabel(type)}
                  </h4>
                  {items.map((item, itemIndex) => {
                    const itemKey = `${item.id}-${item.studentId}`;
                    const isRemoving = removingItems.has(itemKey);
                    const staggerDelay = (groupIndex * items.length + itemIndex) * 50;
                    
                    return (
                      <div 
                        key={itemKey}
                        className={cn(
                          "flex items-start justify-between p-3 bg-muted/50 rounded-lg",
                          "animate-stagger-in touch-active",
                          isRemoving && "animate-fade-out-down opacity-0 -translate-x-4"
                        )}
                        style={{ 
                          animationDelay: `${staggerDelay}ms`,
                          transition: isRemoving ? 'all 0.2s ease-out' : undefined
                        }}
                      >
                        <div className="flex-1 min-w-0 pr-2">
                          <p className={`font-medium text-sm truncate ${fontClass}`}>{item.name}</p>
                          {item.studentName && (
                            <p className={`text-xs text-muted-foreground ${fontClass}`}>{item.studentName}</p>
                          )}
                          <p className={`text-sm font-semibold text-primary mt-1 ${fontClass}`}>
                            {formatCurrency(item.price)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id, item.studentId)}
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10 touch-active"
                          disabled={isRemoving}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {filteredItems.length > 0 && (
          <DrawerFooter className="border-t border-border pt-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`text-sm text-muted-foreground ${fontClass}`}>
                  {language === 'th' ? 'รวมทั้งหมด' : language === 'zh' ? '总计' : 'Total'}
                </span>
                <span className={`text-lg font-bold text-primary animate-count-up ${fontClass}`}>
                  {formatCurrency(total)}
                </span>
              </div>
              <Button 
                onClick={() => {
                  onCheckout();
                  onOpenChange(false);
                }}
                className="w-full touch-active"
                size="lg"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                <span className={fontClass}>
                  {language === 'th' ? 'ดำเนินการชำระเงิน' : language === 'zh' ? '去结账' : 'Proceed to Checkout'}
                </span>
              </Button>
            </div>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};
