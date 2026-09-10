import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, DollarSign, AlertCircle, Check, X, Bus, ShoppingCart } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export interface Trip {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  paymentDeadline: string;
  details: string;
  organizer: string;
  status: 'pending' | 'accepted' | 'declined' | 'paid';
}

interface TripCardProps {
  trip: Trip;
  onAccept: (tripId: string) => void;
  onDecline: (tripId: string) => void;
  onCancel: (tripId: string) => void;
  onChangeDecision: (tripId: string) => void;
}

export const TripCard = ({ 
  trip, 
  onAccept, 
  onDecline, 
  onCancel,
  onChangeDecision 
}: TripCardProps) => {
  const { t, language, formatCurrency } = useLanguage();
  
  // Check if deadline has passed
  const isDeadlinePassed = new Date(trip.paymentDeadline) < new Date();
  const isDeclined = trip.status === 'declined';
  const isAccepted = trip.status === 'accepted';
  const isPaid = trip.status === 'paid';
  const isPending = trip.status === 'pending';

  const formatDeadline = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'th' ? 'th-TH' : language === 'zh' ? 'zh-CN' : 'en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Card className={`relative overflow-hidden transition-all ${
      isDeclined ? 'opacity-60 bg-muted/50' : ''
    } ${isPaid ? 'border-green-500/50 bg-green-50/30' : ''}`}>
      {/* Status Badge */}
      {isDeclined && (
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-muted text-muted-foreground">
            {t('trip.notAttending')}
          </Badge>
        </div>
      )}
      {isPaid && (
        <div className="absolute top-3 right-3">
          <Badge className="bg-green-500 text-white">
            {t('trip.paid')}
          </Badge>
        </div>
      )}
      {isAccepted && !isPaid && (
        <div className="absolute top-3 right-3">
          <Badge className="bg-primary text-primary-foreground">
            {t('trip.accepted')}
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Bus className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0 pr-16">
            <CardTitle className={`text-lg leading-tight ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
              {trip.name}
            </CardTitle>
            <p className={`text-sm text-muted-foreground mt-1 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
              {trip.description}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Trip Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
              {trip.date}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
              {trip.time}
            </span>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
              {trip.location}
            </span>
          </div>
        </div>

        {/* Payment Deadline */}
        <div className={`flex items-center gap-2 p-2 rounded-md ${
          isDeadlinePassed ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning-foreground'
        }`}>
          <AlertCircle className="h-4 w-4" />
          <span className={`text-sm font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            {t('trip.paymentDeadline')}: {formatDeadline(trip.paymentDeadline)}
            {isDeadlinePassed && ` (${t('trip.deadlinePassed')})`}
          </span>
        </div>

        {/* Trip Details Bullet Points */}
        <div className="p-3 bg-muted/50 rounded-lg">
          <p className={`text-sm font-medium mb-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            {t('trip.tripDetails')}:
          </p>
          <div className={`text-sm text-muted-foreground whitespace-pre-line ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            {trip.details}
          </div>
        </div>

        {/* Price and Organizer */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            <span className={`text-lg font-bold text-primary ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
              {formatCurrency(trip.price)}
            </span>
          </div>
          <span className={`text-xs text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            {trip.organizer}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="pt-2">
          {isPending && !isDeadlinePassed && (
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={() => onAccept(trip.id)}
                className="gap-2"
              >
                <Check className="h-4 w-4" />
                {t('trip.acceptTrip')}
              </Button>
              <Button 
                variant="outline"
                onClick={() => onDecline(trip.id)}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                {t('trip.declineTrip')}
              </Button>
            </div>
          )}

          {isAccepted && !isPaid && !isDeadlinePassed && (
            <div className="flex flex-col gap-2">
              {/* Added to Cart indicator */}
              <div className="flex items-center gap-2 p-2 bg-green-100 dark:bg-green-900/30 rounded-md">
                <ShoppingCart className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className={`text-sm text-green-700 dark:text-green-300 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {language === 'th' ? 'เพิ่มในตะกร้าทัศนศึกษาแล้ว' : 'Added to Trip Cart'}
                </span>
              </div>
              
              {/* Cancel Button */}
              <Button 
                variant="outline"
                onClick={() => onCancel(trip.id)}
                className="w-full gap-2 text-destructive border-destructive/50 hover:bg-destructive/10"
              >
                <X className="h-4 w-4" />
                {language === 'th' ? 'ยกเลิก' : 'Cancel'}
              </Button>
            </div>
          )}

          {isDeclined && !isDeadlinePassed && (
            <Button 
              variant="outline"
              onClick={() => onChangeDecision(trip.id)}
              className="w-full gap-2"
            >
              {t('trip.changeDecision')}
            </Button>
          )}

          {isDeadlinePassed && !isPaid && (
            <div className="text-center py-2">
              <p className={`text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {t('trip.deadlinePassed')}
              </p>
            </div>
          )}

          {isPaid && (
            <div className="text-center py-2">
              <p className={`text-sm text-green-600 font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                ✓ {t('trip.paymentConfirmed')}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
