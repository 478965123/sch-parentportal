import { useState } from "react";
import { PaymentFlow } from "@/components/portal/PaymentFlow";
import { ActivityCheckout } from "@/components/portal/ActivityCheckout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

interface CartItem {
  id: string;
  name: string;
  price: number;
  type: 'course' | 'summer' | 'trip';
  date?: string;
  location?: string;
}

interface CreditNote {
  id: number;
  student_id: number;
  balance: number;
  items: { title: string; amount: number; }[];
}

interface CheckoutPageProps {
  type: 'tuition' | 'activities' | 'trips';
  invoice?: {
    id: string;
    type: 'Yearly' | 'Termly' | 'Monthly';
    amount_due: number;
    due_date: string;
    status: 'pending' | 'overdue' | 'paid' | 'partial';
    description: string;
    term?: string;
  };
  items?: CartItem[];
  creditBalance: number;
  selectedCreditNotes?: CreditNote[];
  totalCreditApplied?: number;
  onPaymentSuccess: (paymentData: any) => void;
  onCancel: () => void;
  onRemoveItem?: (itemId: string) => void;
}

export const CheckoutPage = ({
  type,
  invoice,
  items = [],
  creditBalance,
  selectedCreditNotes = [],
  totalCreditApplied = 0,
  onPaymentSuccess,
  onCancel,
  onRemoveItem
}: CheckoutPageProps) => {
  const { t, language } = useLanguage();

  const getBreadcrumbPath = () => {
    if (type === 'tuition') {
      return t('portal.tuitionFees');
    }
    if (type === 'trips') {
      return language === 'th' ? 'ตะกร้าทัศนศึกษา' : 'Trip Cart';
    }
    return t('portal.cart');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink 
                onClick={onCancel}
                className={`cursor-pointer ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
              >
                {t('portal.dashboard')}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {(type === 'activities' || type === 'trips') && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink 
                    onClick={onCancel}
                    className={`cursor-pointer ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
                  >
                    {getBreadcrumbPath()}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
                {t('portal.checkout')}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {type === 'tuition' && invoice ? (
          <PaymentFlow
            invoice={invoice}
            creditBalance={creditBalance}
            onPaymentSuccess={onPaymentSuccess}
            onCancel={onCancel}
          />
        ) : (
          <ActivityCheckout
            items={items}
            itemType={type === 'trips' ? 'trips' : 'activities'}
            creditBalance={creditBalance}
            selectedCreditNotes={selectedCreditNotes}
            totalCreditApplied={totalCreditApplied}
            onPaymentSuccess={onPaymentSuccess}
            onCancel={onCancel}
            onRemoveItem={onRemoveItem}
          />
        )}
      </div>
    </div>
  );
};