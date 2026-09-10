import { TripCartView, TripCartItem } from "@/components/portal/TripCartView";

interface TripCartPageProps {
  items: TripCartItem[];
  onRemoveItem: (tripId: string) => void;
  onCheckout: (items: TripCartItem[]) => void;
  onBackToPortal: () => void;
}

export const TripCartPage = ({ 
  items, 
  onRemoveItem, 
  onCheckout, 
  onBackToPortal 
}: TripCartPageProps) => {
  return (
    <TripCartView
      items={items}
      onRemoveItem={onRemoveItem}
      onCheckout={onCheckout}
      onBack={onBackToPortal}
    />
  );
};
