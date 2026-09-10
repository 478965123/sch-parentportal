import { useRef, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DollarSign, Ticket, Receipt, AlertCircle, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SummaryCardData {
  id: string;
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ElementType;
  color: 'primary' | 'warning' | 'info' | 'success' | 'destructive';
  badge?: string | number;
  onClick?: () => void;
  breakdown?: { label: string; amount: string }[];
}

interface MobileSummaryCarouselProps {
  cards: SummaryCardData[];
}

const colorVariants = {
  primary: {
    bg: "bg-primary/10",
    icon: "text-primary",
    border: "border-primary/20",
    value: "text-primary"
  },
  warning: {
    bg: "bg-warning-orange/10",
    icon: "text-warning-orange",
    border: "border-warning-orange/20",
    value: "text-warning-orange"
  },
  info: {
    bg: "bg-info-cyan/10",
    icon: "text-info-cyan",
    border: "border-info-cyan/20",
    value: "text-info-cyan"
  },
  success: {
    bg: "bg-finance-green/10",
    icon: "text-finance-green",
    border: "border-finance-green/20",
    value: "text-finance-green"
  },
  destructive: {
    bg: "bg-destructive/10",
    icon: "text-destructive",
    border: "border-destructive/20",
    value: "text-destructive"
  }
};

export const MobileSummaryCarousel = ({ cards }: MobileSummaryCarouselProps) => {
  const { language } = useLanguage();
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const fontClass = language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato';

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="space-y-3">
      {/* Carousel Container */}
      <div className="overflow-hidden -mx-4 px-4" ref={emblaRef}>
        <div className="flex gap-3">
          {cards.map((card, index) => {
            const Icon = card.icon;
            const colors = colorVariants[card.color];
            
            return (
              <div 
                key={card.id}
                className={cn(
                  "flex-shrink-0 w-[75vw] max-w-[280px]",
                  "animate-stagger-in opacity-0"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card 
                  className={cn(
                    "h-full border-2 transition-all duration-200 touch-active",
                    colors.border,
                    card.onClick && "cursor-pointer hover:shadow-md active:scale-[0.98]"
                  )}
                  onClick={card.onClick}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className={cn("p-2.5 rounded-xl", colors.bg)}>
                        <Icon className={cn("h-5 w-5", colors.icon)} />
                      </div>
                      {card.badge !== undefined && (
                        <Badge 
                          variant="secondary" 
                          className={cn("text-xs animate-scale-bounce", colors.bg, colors.icon)}
                        >
                          {card.badge}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <p className={cn("text-xs text-muted-foreground uppercase tracking-wide", fontClass)}>
                        {card.title}
                      </p>
                      <p className={cn("text-2xl font-bold", colors.value, fontClass)}>
                        {card.value}
                      </p>
                      <p className={cn("text-xs text-muted-foreground", fontClass)}>
                        {card.subtitle}
                      </p>
                      {card.breakdown && card.breakdown.length > 0 && (
                        <div className="mt-2 space-y-0.5 border-t border-border pt-2">
                          {card.breakdown.map((item, i) => (
                            <div key={i} className={cn("flex justify-between text-xs text-muted-foreground", fontClass)}>
                              <span>{item.label}</span>
                              <span>{item.amount}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {card.onClick && (
                      <div className="flex items-center justify-end mt-3 pt-2 border-t border-border">
                        <span className={cn("text-xs text-muted-foreground mr-1", fontClass)}>
                          {language === 'th' ? 'ดูรายละเอียด' : 'View Details'}
                        </span>
                        <ChevronRight className="h-3 w-3 text-muted-foreground" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-1.5">
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              index === selectedIndex 
                ? "w-6 bg-primary" 
                : "w-1.5 bg-muted-foreground/30"
            )}
            onClick={() => emblaApi?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

// Skeleton for loading state
export const MobileSummaryCarouselSkeleton = () => {
  return (
    <div className="space-y-3">
      <div className="flex gap-3 overflow-hidden -mx-4 px-4">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className="flex-shrink-0 w-[75vw] max-w-[280px] animate-pulse"
          >
            <Card className="h-full border-2 border-muted">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-muted" />
                  <div className="h-5 w-12 rounded-full bg-muted" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-muted rounded" />
                  <div className="h-8 w-32 bg-muted rounded" />
                  <div className="h-3 w-24 bg-muted rounded" />
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-1.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
        ))}
      </div>
    </div>
  );
};
