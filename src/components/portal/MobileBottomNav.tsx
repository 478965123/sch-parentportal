import { useState, useEffect } from "react";
import { GraduationCap, DollarSign, Clock, Sun, Calendar, Bus, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface MobileBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  cartItemCount?: number;
  isSISBStudent?: boolean;
  unpaidInvoicesCount?: number;
}

export const MobileBottomNav = ({
  activeTab,
  onTabChange,
  cartItemCount = 0,
  isSISBStudent = true,
  unpaidInvoicesCount = 0,
}: MobileBottomNavProps) => {
  const { language } = useLanguage();
  const [prevCartCount, setPrevCartCount] = useState(cartItemCount);
  const [badgeAnimating, setBadgeAnimating] = useState(false);
  const [tappedTab, setTappedTab] = useState<string | null>(null);

  const fontClass = language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato';

  // Animate badge when cart count changes
  useEffect(() => {
    if (cartItemCount !== prevCartCount) {
      setBadgeAnimating(true);
      const timer = setTimeout(() => setBadgeAnimating(false), 300);
      setPrevCartCount(cartItemCount);
      return () => clearTimeout(timer);
    }
  }, [cartItemCount, prevCartCount]);

  const navItems = [
    { id: 'dashboard', icon: GraduationCap, label: 'Dashboard', labelTh: 'หน้าหลัก', labelZh: '仪表盘' },
    { id: 'tuition', icon: DollarSign, label: 'Tuition', labelTh: 'ค่าเล่าเรียน', labelZh: '学费' },
    { id: 'afterschool', icon: Clock, label: 'ECA', labelTh: 'ECA', labelZh: 'ECA' },
    { id: 'summer', icon: Sun, label: 'Trip & Activity', labelTh: 'ทริปและกิจกรรม', labelZh: '旅行และกิจกรรม' },
    { id: 'event', icon: Calendar, label: 'Exam', labelTh: 'สอบ', labelZh: '考试' },
    { id: 'schoolbus', icon: Bus, label: 'School Bus', labelTh: 'รถรับส่ง', labelZh: '校车' },
    { id: 'transaction', icon: Receipt, label: 'History', labelTh: 'ประวัติ', labelZh: '历史' },
  ];

  const filteredItems = navItems;

  const getLabel = (item: typeof navItems[0]) => {
    if (language === 'th') return item.labelTh;
    if (language === 'zh') return item.labelZh;
    return item.label;
  };

  const handleTabClick = (tabId: string) => {
    setTappedTab(tabId);
    setTimeout(() => setTappedTab(null), 150);
    onTabChange(tabId);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg safe-area-bottom animate-slide-in-bottom overflow-visible">
      <div className="flex items-center justify-around px-1 py-2 overflow-visible">
        {filteredItems.map((item, index) => {
          const isActive = activeTab === item.id;
          const isTapped = tappedTab === item.id;
          const Icon = item.icon;
          const showBadge = (item.id === 'afterschool' && cartItemCount > 0) || (item.id === 'tuition' && unpaidInvoicesCount > 0);
          const badgeValue = item.id === 'afterschool' ? cartItemCount : unpaidInvoicesCount;

          return (
            <div key={item.id} className="relative flex-1 min-w-0 overflow-visible">
              <button
                onClick={() => handleTabClick(item.id)}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 px-2 py-1.5 rounded-lg min-w-0 w-full",
                  "transition-all duration-200 touch-active",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                  isTapped && "animate-tap-bounce"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative">
                  <Icon className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    isActive && "text-primary",
                    isTapped && "scale-90"
                  )} />
                  {showBadge && (
                    <Badge
                      variant="destructive"
                      className={cn(
                        "absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-[10px]",
                        badgeAnimating && "animate-scale-bounce"
                      )}
                    >
                      {badgeValue > 9 ? '9+' : badgeValue}
                    </Badge>
                  )}
                </div>
                <span className={cn(
                  "text-[10px] truncate max-w-full transition-all duration-200",
                  fontClass,
                  isActive && "font-medium"
                )}>
                  {getLabel(item)}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary rounded-full animate-slide-indicator" />
                )}
              </button>
            </div>
          );
        })}
      </div>
    </nav>
  );
};
