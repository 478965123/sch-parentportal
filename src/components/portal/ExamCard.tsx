import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, MapPin, Users } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ExamRegistrationDialog } from "./ExamRegistrationDialog";

interface Exam {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  capacity: number;
  enrolled: number;
  examPrice: number;
  deliveryPrice: number;
  vendor: string;
  examType?: 'hsk' | 'ipsle' | 'general';
  subjects?: Array<{ id: string; labelEn: string; labelZh: string }>;
  timetable?: {
    oral: Array<{ date: string; subjects: string[] }>;
    written: Array<{ date: string; subjects: string[] }>;
  };
}

interface ExamCardProps {
  exam: Exam;
  onAddToCart?: (examId: string, registrationData: any) => void;
  onRemoveFromCart?: (examId: string) => void;
  isInCart?: boolean;
}

export const ExamCard = ({ exam, onAddToCart, onRemoveFromCart, isInCart }: ExamCardProps) => {
  const spotsLeft = exam.capacity - exam.enrolled;
  const isFullyBooked = spotsLeft <= 0;
  const isLowCapacity = spotsLeft <= 3 && spotsLeft > 0;
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);

  const { language, formatCurrency, t } = useLanguage();

  const getAvailabilityColor = () => {
    if (isFullyBooked) return 'bg-destructive/20 text-destructive';
    if (isLowCapacity) return 'bg-warning-orange/20 text-warning-orange';
    return 'bg-finance-green/20 text-finance-green';
  };

  const getAvailabilityText = () => {
    if (isFullyBooked) return t('portal.fullyBooked');
    if (isLowCapacity) return `${spotsLeft} ${t('portal.spotsLeft')}`;
    return `${spotsLeft} ${t('portal.spotsAvailable')}`;
  };

  const handleRegister = () => {
    setShowRegistrationDialog(true);
  };

  const handleRegistrationConfirm = (registrationData: any) => {
    onAddToCart?.(exam.id, registrationData);
  };

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className={`font-semibold text-base leading-tight flex-1 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
              {exam.name}
            </h3>
            <div className="text-right">
              <span className={`text-xl font-bold text-blue-600 whitespace-nowrap ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {formatCurrency(exam.examPrice)}
              </span>
              <p className={`text-xs text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {t('exam.examOnly')}
              </p>
            </div>
          </div>
          
          <p className={`text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            {exam.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            <Badge className={getAvailabilityColor()}>
              <span className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
                {getAvailabilityText()}
              </span>
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3 text-sm">
          <div className={`flex items-center gap-2 text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            <Calendar className="h-4 w-4" />
            <span>{exam.date}</span>
          </div>
          
          <div className={`flex items-center gap-2 text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            <Clock className="h-4 w-4" />
            <span>{exam.time}</span>
          </div>
          
          <div className={`flex items-center gap-2 text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            <Users className="h-4 w-4" />
            <span>{t('portal.vendor')}: {exam.vendor}</span>
          </div>
          
          <div className={`flex items-center gap-2 text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            <MapPin className="h-4 w-4" />
            <span>{exam.location}</span>
          </div>
        </div>

        <div className="p-3 bg-muted/50 rounded-lg">
          <p className={`text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            {t('exam.deliveryOption')}: <span className="font-medium text-foreground">+{formatCurrency(exam.deliveryPrice)}</span>
          </p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('portal.capacity')}:</span>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-muted rounded-full h-2 w-20">
              <div 
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${(exam.enrolled / exam.capacity) * 100}%` }}
              />
            </div>
            <span className={`font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{exam.enrolled}/{exam.capacity}</span>
          </div>
        </div>

        <div className="pt-2">
          {isFullyBooked ? (
            <Button variant="outline" className={`w-full ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`} disabled>
              {t('portal.fullyBooked')}
            </Button>
          ) : isInCart ? (
            <Button 
              variant="outline" 
              className={`w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
              onClick={() => onRemoveFromCart?.(exam.id)}
            >
              {t('portal.removeFromCart')}
            </Button>
          ) : (
            <Button 
              className={`w-full ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
              onClick={handleRegister}
            >
              {t('exam.register')}
            </Button>
          )}
        </div>
      </CardContent>

      <ExamRegistrationDialog
        open={showRegistrationDialog}
        onOpenChange={setShowRegistrationDialog}
        exam={exam}
        onConfirm={handleRegistrationConfirm}
      />
    </Card>
  );
};
