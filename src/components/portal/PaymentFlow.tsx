import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  DollarSign,
  CreditCard,
  QrCode,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PaymentFlowProps {
  invoice: {
    id: string;
    type: 'Yearly' | 'Termly' | 'Monthly';
    amount_due: number;
    due_date: string;
    status: 'pending' | 'overdue' | 'paid' | 'partial';
    description: string;
    term?: string;
  };
  creditBalance: number;
  onPaymentSuccess: (paymentData: any) => void;
  onCancel: () => void;
}

const paymentMethods = [
  { id: 'credit_card', name: 'payment.creditCard', icon: CreditCard, fee: 1.3, currency: '%' },
  { id: 'promptpay', name: 'payment.promptPay', icon: QrCode, fee: 0, currency: '฿' },
];

export const PaymentFlow = ({ invoice, creditBalance, onPaymentSuccess, onCancel }: PaymentFlowProps) => {
  const [useCreditNote, setUseCreditNote] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<typeof paymentMethods[0] | null>(null);
  const { language, formatCurrency, t } = useLanguage();

  // Calculate amounts - Always use termly payment
  const baseAmount = invoice.amount_due;
  const creditApplied = useCreditNote ? Math.min(creditBalance, baseAmount) : 0;
  const subtotal = baseAmount - creditApplied;
  
  const paymentFee = selectedPaymentMethod
    ? (selectedPaymentMethod.currency === '%'
      ? subtotal * (selectedPaymentMethod.fee / 100)
      : selectedPaymentMethod.fee)
    : 0;
  
  const totalAmount = subtotal + paymentFee;


  const handlePayment = () => {
    const paymentData = {
      invoiceId: invoice.id,
      receiptId: `RCP-${Date.now()}`,
      amount: totalAmount,
      baseAmount,
      creditApplied,
      paymentFee,
      paymentMethod: selectedPaymentMethod ? t(selectedPaymentMethod.name) : '',
      paymentType: 'Termly',
      paymentDate: new Date().toISOString()
    };

    onPaymentSuccess(paymentData);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
      {/* Left Column - Payment Options */}
      <div className="lg:col-span-2 space-y-8">
        <Card className="border-none shadow-none bg-transparent p-0">
          <CardContent className="p-0 space-y-8">
            {/* Credit Note Application */}
            {creditBalance > 0 && (
              <div className="space-y-4">
                <h2 className={`text-2xl font-bold ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {t('portal.applyCreditNote')}
                </h2>
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Switch
                      id="credit-toggle"
                      checked={useCreditNote}
                      onCheckedChange={setUseCreditNote}
                    />
                    <div>
                      <Label htmlFor="credit-toggle" className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('portal.useCreditNote')}</Label>
                      <p className={`text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {t('portal.available')}: {formatCurrency(creditBalance)}
                      </p>
                    </div>
                  </div>
                  {useCreditNote && (
                    <Badge variant="outline" className={`bg-finance-green/20 text-finance-green ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                      -{formatCurrency(creditApplied)}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Payment Method Selection */}
            <div className="space-y-4">
              <h2 className={`text-2xl font-bold ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {t('portal.paymentMethod')}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`p-6 rounded-lg cursor-pointer transition-all text-center border-2 ${
                      selectedPaymentMethod?.id === method.id
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-muted/20 hover:border-muted/40 hover:bg-muted/10'
                    }`}
                    onClick={() => setSelectedPaymentMethod(method)}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <method.icon className="h-8 w-8" />
                      <span className={`font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {t(method.name)}
                      </span>
                      {method.fee !== 0 && (
                        <div className={`text-xs text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                          +{method.fee}{method.currency}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Payment Summary */}
      <div className="lg:col-span-1">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('portal.paymentSummary')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('portal.termly')} {t('portal.tuitionFee')}</span>
                <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{formatCurrency(baseAmount)}</span>
              </div>
              
              {creditApplied > 0 && (
                <div className="flex justify-between text-finance-green">
                  <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('portal.creditNoteApplied')}</span>
                  <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>-{formatCurrency(creditApplied)}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('portal.paymentFee')} ({selectedPaymentMethod ? t(selectedPaymentMethod.name) : '-'})</span>
                <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{formatCurrency(paymentFee)}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between text-lg font-bold">
                <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('portal.totalAmount')}</span>
                <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              {subtotal <= 0 && (
                <div className={`text-sm text-destructive text-center bg-destructive/10 p-2 rounded ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {language === 'th' ? 'ยอดเครดิตครอบคลุมค่าใช้จ่ายทั้งหมดแล้ว ไม่สามารถชำระได้' : 'Credit covers the full amount. Payment is not required.'}
                </div>
              )}
              <Button onClick={handlePayment} size="lg" disabled={!selectedPaymentMethod || subtotal <= 0} className={`w-full ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                <CreditCard className="h-4 w-4 mr-2" />
                {selectedPaymentMethod ? `${t('portal.pay')} ${formatCurrency(totalAmount)}` : (language === 'th' ? 'กรุณาเลือกช่องทางชำระ' : 'Select payment method')}
              </Button>
              <Button variant="outline" onClick={onCancel} className={`w-full ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {t('portal.cancel')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};