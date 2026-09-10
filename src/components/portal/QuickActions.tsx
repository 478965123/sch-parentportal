import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CreditCard,
  GraduationCap,
  Calendar,
  Receipt,
  Zap
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface QuickAction {
  id: string;
  icon: React.ElementType;
  label: string;
  labelTh: string;
  labelZh: string;
  description: string;
  descriptionTh: string;
  descriptionZh: string;
  color: string;
  bgColor: string;
  onClick: () => void;
}

interface QuickActionsProps {
  onPayNow: () => void;
  onRegisterActivities: () => void;
  onViewEvents: () => void;
  onViewReceipts: () => void;
  hasPendingPayments?: boolean;
  isMobile?: boolean;
}

export const QuickActions = ({
  onPayNow,
  onRegisterActivities,
  onViewEvents,
  onViewReceipts,
  hasPendingPayments = true,
  isMobile = false,
}: QuickActionsProps) => {
  const { language } = useLanguage();
  
  const fontClass = language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato';

  const actions: QuickAction[] = [
    {
      id: 'pay-now',
      icon: CreditCard,
      label: 'Pay Now',
      labelTh: 'ชำระเงิน',
      labelZh: '立即支付',
      description: 'Complete pending payments',
      descriptionTh: 'ชำระค่าใช้จ่ายค้างชำระ',
      descriptionZh: '完成待付款',
      color: 'text-finance-green',
      bgColor: 'bg-finance-green/10 hover:bg-finance-green/20',
      onClick: onPayNow,
    },
    {
      id: 'register-eca',
      icon: GraduationCap,
      label: 'Register ECA',
      labelTh: 'ลงทะเบียน ECA',
      labelZh: '注册课外活动',
      description: 'After-school activities',
      descriptionTh: 'กิจกรรมหลังเลิกเรียน',
      descriptionZh: '课后活动',
      color: 'text-education-blue',
      bgColor: 'bg-education-blue/10 hover:bg-education-blue/20',
      onClick: onRegisterActivities,
    },
    {
      id: 'view-events',
      icon: Calendar,
      label: 'Events',
      labelTh: 'กิจกรรม',
      labelZh: '活动',
      description: 'Exams & field trips',
      descriptionTh: 'สอบและทัศนศึกษา',
      descriptionZh: '考试和实地考察',
      color: 'text-info-cyan',
      bgColor: 'bg-info-cyan/10 hover:bg-info-cyan/20',
      onClick: onViewEvents,
    },
    {
      id: 'view-receipts',
      icon: Receipt,
      label: 'Receipts',
      labelTh: 'ใบเสร็จ',
      labelZh: '收据',
      description: 'Transaction history',
      descriptionTh: 'ประวัติการทำรายการ',
      descriptionZh: '交易历史',
      color: 'text-primary',
      bgColor: 'bg-primary/10 hover:bg-primary/20',
      onClick: onViewReceipts,
    },
  ];

  const getLabel = (action: QuickAction) => {
    if (language === 'th') return action.labelTh;
    if (language === 'zh') return action.labelZh;
    return action.label;
  };

  const getDescription = (action: QuickAction) => {
    if (language === 'th') return action.descriptionTh;
    if (language === 'zh') return action.descriptionZh;
    return action.description;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className={cn("flex items-center gap-2 text-base", fontClass)}>
          <Zap className="h-5 w-5 text-warning-orange" />
          {language === 'th' ? 'การดำเนินการด่วน' : language === 'zh' ? '快速操作' : 'Quick Actions'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        {isMobile ? (
          // Mobile: Horizontal scrollable with larger touch targets
          <div className="overflow-x-auto -mx-4 px-4 pb-2">
            <div className="flex gap-3 min-w-max">
              {actions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={action.onClick}
                    className={cn(
                      "flex flex-col items-center justify-center gap-2 p-4 rounded-xl min-w-[100px]",
                      "transition-all duration-200 touch-active",
                      action.bgColor,
                      "animate-stagger-in opacity-0"
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className={cn(
                      "p-2.5 rounded-full bg-background/80",
                      action.id === 'pay-now' && hasPendingPayments && "animate-pulse-soft"
                    )}>
                      <Icon className={cn("h-5 w-5", action.color)} />
                    </div>
                    <span className={cn("text-xs font-medium text-center", fontClass)}>
                      {getLabel(action)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          // Desktop: Grid layout with descriptions
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  variant="ghost"
                  onClick={action.onClick}
                  className={cn(
                    "h-auto flex flex-col items-center gap-2 py-4 px-3",
                    action.bgColor,
                    "animate-fade-in-up"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className={cn(
                    "p-2 rounded-lg bg-background/50",
                    action.id === 'pay-now' && hasPendingPayments && "animate-pulse-soft"
                  )}>
                    <Icon className={cn("h-5 w-5", action.color)} />
                  </div>
                  <div className="text-center">
                    <p className={cn("text-sm font-medium", fontClass)}>
                      {getLabel(action)}
                    </p>
                    <p className={cn("text-[10px] text-muted-foreground mt-0.5", fontClass)}>
                      {getDescription(action)}
                    </p>
                  </div>
                </Button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Compact version for mobile bottom section
export const QuickActionsMini = ({
  onPayNow,
  onRegisterActivities,
  hasPendingPayments = true,
}: {
  onPayNow: () => void;
  onRegisterActivities: () => void;
  hasPendingPayments?: boolean;
}) => {
  const { language } = useLanguage();
  const fontClass = language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato';

  return (
    <div className="flex gap-3">
      <Button
        onClick={onPayNow}
        className={cn(
          "flex-1 h-12 bg-finance-green hover:bg-finance-green/90 text-white",
          hasPendingPayments && "animate-pulse-soft"
        )}
      >
        <CreditCard className="h-4 w-4 mr-2" />
        <span className={fontClass}>
          {language === 'th' ? 'ชำระเงิน' : 'Pay Now'}
        </span>
      </Button>
      <Button
        onClick={onRegisterActivities}
        variant="outline"
        className="flex-1 h-12 border-education-blue text-education-blue hover:bg-education-blue/10"
      >
        <GraduationCap className="h-4 w-4 mr-2" />
        <span className={fontClass}>
          {language === 'th' ? 'ลงทะเบียน' : 'Register'}
        </span>
      </Button>
    </div>
  );
};
