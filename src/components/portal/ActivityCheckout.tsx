import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  CreditCard,
  QrCode,
  MessageCircle,
  Wallet,
  Link2,
  Landmark,
  Trash2,
  CheckCircle
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PaymentProcessing } from "./PaymentProcessing";
import { PaymentProgressBar } from "./PaymentProgressBar";

interface CreditNote {
  id: number;
  student_id: number;
  balance: number;
  items: { title: string; amount: number; }[];
}

interface ActivityCheckoutProps {
  items: Array<{
    id: string;
    name: string;
    price: number;
    type: 'course' | 'summer' | 'trip';
    date?: string;
    location?: string;
  }>;
  itemType?: 'activities' | 'trips';
  creditBalance: number;
  selectedCreditNotes?: CreditNote[];
  totalCreditApplied?: number;
  onPaymentSuccess: (paymentData: any) => void;
  onCancel: () => void;
  onRemoveItem?: (itemId: string) => void;
}

const paymentMethods = [
  { id: 'credit_card_th', name: 'บัตรเครดิตในประเทศ', icon: CreditCard, fee: 1.5, currency: '%' },
  { id: 'credit_card_intl', name: 'บัตรเครดิตต่างประเทศ', icon: CreditCard, fee: 2.2, currency: '%' },
  { id: 'promptpay', name: 'พร้อมเพย์', icon: QrCode, fee: 0, currency: '฿' },
  { id: 'wechat', name: 'วีแชทเพย์', icon: MessageCircle, fee: 1.8, currency: '%' },
  { id: 'alipay', name: 'อาลีเพย์', icon: Wallet, fee: 1.8, currency: '%' },
  { id: 'payment_link', name: 'ลิงก์ชำระเงิน', icon: Link2, fee: 15, currency: '฿' },
  { id: 'direct_debit', name: 'หักบัญชีอัตโนมัติ', icon: Landmark, fee: 10, currency: '฿' },
];

export const ActivityCheckout = ({
  items,
  itemType = 'activities',
  creditBalance,
  selectedCreditNotes = [],
  totalCreditApplied = 0,
  onPaymentSuccess,
  onCancel,
  onRemoveItem
}: ActivityCheckoutProps) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<typeof paymentMethods[0] | null>(null);
  const [showPaymentProcessing, setShowPaymentProcessing] = useState(false);
  const { language, formatCurrency, t } = useLanguage();

  // Calculate amounts
  const subtotalAmount = items.reduce((sum, item) => sum + item.price, 0);
  // Use credit applied from previous page (CartView)
  const creditApplied = totalCreditApplied;
  const amountAfterCredit = subtotalAmount - creditApplied;
  
  const paymentFee = selectedPaymentMethod
    ? (selectedPaymentMethod.currency === '%'
      ? amountAfterCredit * (selectedPaymentMethod.fee / 100)
      : selectedPaymentMethod.fee)
    : 0;
  
  const totalAmount = amountAfterCredit + paymentFee;

  const handlePayment = () => {
    setShowPaymentProcessing(true);
  };

  const handlePaymentComplete = (success: boolean, paymentData?: any) => {
    if (success && paymentData) {
      const completePaymentData = {
        ...paymentData,
        items: items,
        itemType: itemType,
        subtotalAmount,
        creditApplied,
        paymentFee,
        studentName: language === 'th' ? "นักเรียน" : 
                     language === 'zh' ? "学生" : 
                     "Student"
      };
      onPaymentSuccess(completePaymentData);
    }
  };

  const handleBackFromPayment = () => {
    setShowPaymentProcessing(false);
  };

  if (showPaymentProcessing) {
    return (
      <div className="max-w-4xl mx-auto">
        <PaymentProgressBar currentStep={2} onStepClick={(step) => { if (step === 1) onCancel(); }} />
        <PaymentProcessing
          paymentMethod={selectedPaymentMethod}
          amount={totalAmount}
          onPaymentComplete={handlePaymentComplete}
          onCancel={handleBackFromPayment}
        />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className={`text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('portal.cartEmpty')}</p>
          <Button onClick={onCancel} className={`mt-4 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            {t('portal.backToActivities')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PaymentProgressBar currentStep={2} onStepClick={(step) => { if (step === 1) onCancel(); }} />
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column - Payment Method Selection Only */}
        <div className="lg:col-span-3 space-y-8">
          {/* Payment Method Selection */}
          <div className="space-y-4">
            <h2 className={`text-2xl font-bold ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
              {t('processing.selectPayment')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      {language === 'th' ? method.name :
                       language === 'zh' ? (method.id === 'credit_card_th' ? '本地信用卡' :
                                          method.id === 'credit_card_intl' ? '国际信用卡' :
                                          method.id === 'promptpay' ? 'PromptPay' :
                                          method.id === 'wechat' ? '微信支付' :
                                          method.id === 'alipay' ? '支付宝' :
                                          method.id === 'payment_link' ? '支付链接' :
                                          method.id === 'direct_debit' ? '银行代扣' :
                                          method.id === 'bank_counter' ? '银行账户' : method.name) :
                       (method.id === 'credit_card_th' ? 'Local Credit Card' :
                        method.id === 'credit_card_intl' ? 'International Credit Card' :
                        method.id === 'promptpay' ? 'PromptPay' :
                        method.id === 'wechat' ? 'WeChat Pay' :
                        method.id === 'alipay' ? 'Alipay' :
                        method.id === 'payment_link' ? 'Payment Link' :
                        method.id === 'direct_debit' ? 'Direct Debit' :
                        method.id === 'bank_counter' ? 'Bank Account' : method.name)}
                    </span>
                    {method.fee !== 0 && (
                      <div className={`text-xs text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {method.currency === '%' ? `+${method.fee}%` : `+${formatCurrency(method.fee)}`}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Credit Notes - Display only */}
          {selectedCreditNotes.length > 0 && itemType === 'activities' && (
            <div className="space-y-4">
              <h2 className={`text-2xl font-bold ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {language === 'th' ? 'ใบลดหนี้ที่เลือก' : language === 'zh' ? '已选择的贷记单' : 'Selected Credit Notes'}
              </h2>
              <div className="space-y-3">
                {selectedCreditNotes.map((note) => (
                  <div key={note.id} className="p-4 bg-primary/5 border-2 border-primary rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="h-4 w-4 text-primary" />
                          <span className={`text-sm font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                            {language === 'th' ? 'ใบลดหนี้' : 'Credit Note'} #{note.id}
                          </span>
                        </div>
                      </div>
                      <div className={`text-right ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        <div className="text-lg font-bold text-primary">
                          -{formatCurrency(note.balance)}
                        </div>
                      </div>
                    </div>

                    {note.items.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-primary/20 space-y-1">
                        {note.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                              {item.title}
                            </span>
                            <span className={`font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                              {formatCurrency(item.amount)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Payment Summary */}
        <div className="lg:col-span-2">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('portal.paymentSummary')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                    {language === 'th' ? `เลือก ${items.length} รายการ` : language === 'zh' ? `已选 ${items.length} 项` : `${items.length} items selected`}
                  </span>
                  <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{formatCurrency(subtotalAmount)}</span>
                </div>
                
                {creditApplied > 0 && (
                  <div className="flex justify-between text-finance-green">
                    <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('portal.creditNoteApplied')}</span>
                    <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>-{formatCurrency(creditApplied)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-start gap-4">
                  <div className={`flex flex-col ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                    <span>{language === 'th' ? 'ค่าดำเนินการ' : language === 'zh' ? '手续费' : 'Operation fee'}</span>
                    <span className="text-xs text-muted-foreground">
                      ({selectedPaymentMethod ? (language === 'th' ? selectedPaymentMethod.name :
                        language === 'zh' ? (selectedPaymentMethod.id === 'credit_card_th' ? '本地信用卡' :
                                             selectedPaymentMethod.id === 'credit_card_intl' ? '国际信用卡' :
                                             selectedPaymentMethod.id === 'promptpay' ? 'PromptPay' :
                                             selectedPaymentMethod.id === 'wechat' ? '微信支付' :
                                             selectedPaymentMethod.id === 'alipay' ? '支付宝' :
                                             selectedPaymentMethod.id === 'payment_link' ? '支付链接' :
                                             selectedPaymentMethod.id === 'direct_debit' ? '银行代扣' : selectedPaymentMethod.name) :
                        (selectedPaymentMethod.id === 'credit_card_th' ? 'Local Credit Card' :
                         selectedPaymentMethod.id === 'credit_card_intl' ? 'International Credit Card' :
                         selectedPaymentMethod.id === 'promptpay' ? 'PromptPay' :
                         selectedPaymentMethod.id === 'wechat' ? 'WeChat Pay' :
                         selectedPaymentMethod.id === 'alipay' ? 'Alipay' :
                         selectedPaymentMethod.id === 'payment_link' ? 'Payment Link' :
                         selectedPaymentMethod.id === 'direct_debit' ? 'Direct Debit' : selectedPaymentMethod.name)) : '-'})
                    </span>
                  </div>
                  <span className={`shrink-0 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{formatCurrency(paymentFee)}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{t('portal.totalAmount')}</span>
                  <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-4">
                {amountAfterCredit <= 0 && (
                  <div className={`text-sm text-destructive text-center bg-destructive/10 p-2 rounded ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                    {language === 'th' ? 'ยอดเครดิตครอบคลุมค่าใช้จ่ายทั้งหมดแล้ว ไม่สามารถชำระได้' : 'Credit covers the full amount. Payment is not required.'}
                  </div>
                )}
                <Button onClick={handlePayment} size="lg" disabled={!selectedPaymentMethod || amountAfterCredit <= 0} className={`w-full ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
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
    </div>
  );
};