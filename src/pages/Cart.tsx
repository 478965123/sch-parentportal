import { useState } from "react";
import { CartView } from "@/components/portal/CartView";
import { ActivityCheckout } from "@/components/portal/ActivityCheckout";

interface CartItem {
  id: string;
  name: string;
  price: number;
  type: 'course' | 'activity';
  studentName?: string;
}

interface CreditNote {
  id: number;
  student_id: number;
  balance: number;
  items: { title: string; amount: number; }[];
}

interface CartPageProps {
  items: CartItem[];
  creditNotes: CreditNote[];
  onRemoveItem: (itemId: string) => void;
  onPaymentSuccess: (paymentData: any) => void;
  onBackToPortal: () => void;
}

export const CartPage = ({ items, creditNotes, onRemoveItem, onPaymentSuccess, onBackToPortal }: CartPageProps) => {
  const [paymentStep, setPaymentStep] = useState<'cart' | 'payment'>('cart');
  const [checkoutItems, setCheckoutItems] = useState<CartItem[]>([]);
  const [selectedCreditNotes, setSelectedCreditNotes] = useState<CreditNote[]>([]);
  const [totalCreditApplied, setTotalCreditApplied] = useState(0);

  const handleProceedToPayment = (selected: CartItem[], creditNotes: CreditNote[], creditApplied: number) => {
    setCheckoutItems(selected);
    setSelectedCreditNotes(creditNotes);
    setTotalCreditApplied(creditApplied);
    setPaymentStep('payment');
  };

  if (paymentStep === 'payment') {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <ActivityCheckout
            items={checkoutItems as any}
            itemType="activities"
            creditBalance={totalCreditApplied}
            selectedCreditNotes={selectedCreditNotes}
            totalCreditApplied={totalCreditApplied}
            onPaymentSuccess={onPaymentSuccess}
            onCancel={() => setPaymentStep('cart')}
            onRemoveItem={(id) => {
              onRemoveItem(id);
              setCheckoutItems(prev => prev.filter(item => item.id !== id));
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <CartView
      items={items}
      creditNotes={creditNotes}
      onRemoveItem={onRemoveItem}
      onCheckout={handleProceedToPayment}
      onBack={onBackToPortal}
    />
  );
};
