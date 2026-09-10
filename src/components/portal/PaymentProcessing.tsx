import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CreditCard,
  QrCode,
  Building2,
  MessageCircle,
  Wallet,
  Link2,
  Landmark,
  LoaderCircle,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Clock,
  Upload,
  X
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PaymentProcessingProps {
  paymentMethod: {
    id: string;
    name: string;
    icon: any;
    fee: number;
    currency: string;
  };
  amount: number;
  onPaymentComplete: (success: boolean, paymentData?: any) => void;
  onCancel: () => void;
}

const paymentMethodIcons = {
  credit_card_th: CreditCard,
  credit_card_intl: CreditCard,
  promptpay: QrCode,
  wechat: MessageCircle,
  alipay: Wallet,
  bank_counter: Building2,
  payment_link: Link2,
  direct_debit: Landmark
};

export const PaymentProcessing = ({
  paymentMethod,
  amount,
  onPaymentComplete,
  onCancel
}: PaymentProcessingProps) => {
  const [step, setStep] = useState<'confirm' | 'processing' | 'success' | 'failed'>('confirm');
  const [countdown, setCountdown] = useState(10); // 10 seconds max
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [slipDialogOpen, setSlipDialogOpen] = useState(false);
  const [slipStage, setSlipStage] = useState<'select' | 'uploading' | 'done'>('select');
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipPreview, setSlipPreview] = useState('');
  const { language, formatCurrency, t } = useLanguage();

  const IconComponent = paymentMethodIcons[paymentMethod.id as keyof typeof paymentMethodIcons] || CreditCard;
  const requiresSlipUpload = ['promptpay', 'wechat', 'alipay'].includes(paymentMethod.id);

  const getPaymentMethodDisplayName = () =>
    language === 'th' ? paymentMethod.name :
    language === 'zh' ? (paymentMethod.id === 'credit_card_th' ? '本地信用卡' :
                         paymentMethod.id === 'credit_card_intl' ? '国际信用卡' :
                         paymentMethod.id === 'promptpay' ? 'PromptPay' :
                         paymentMethod.id === 'wechat' ? '微信支付' :
                         paymentMethod.id === 'alipay' ? '支付宝' :
                         paymentMethod.id === 'bank_counter' ? '银行账户' :
                         paymentMethod.id === 'payment_link' ? '支付链接' :
                         paymentMethod.id === 'direct_debit' ? '银行代扣' : paymentMethod.name) :
    (paymentMethod.id === 'credit_card_th' ? 'Local Credit Card' :
     paymentMethod.id === 'credit_card_intl' ? 'International Credit Card' :
     paymentMethod.id === 'promptpay' ? 'PromptPay' :
     paymentMethod.id === 'wechat' ? 'WeChat Pay' :
     paymentMethod.id === 'alipay' ? 'Alipay' :
     paymentMethod.id === 'bank_counter' ? 'Bank Account' :
     paymentMethod.id === 'payment_link' ? 'Payment Link' :
     paymentMethod.id === 'direct_debit' ? 'Direct Debit' : paymentMethod.name);

  useEffect(() => {
    if (step === 'processing') {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            // Simulate payment processing with potential failure
            // In production, this would be an actual API call
            processPayment();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [step, amount, onPaymentComplete, paymentMethod.name, t]);

  const processPayment = async () => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // TODO: Replace with actual payment gateway API call
      // const response = await paymentGatewayAPI.processPayment({
      //   amount,
      //   paymentMethod: paymentMethod.id,
      //   currency: paymentMethod.currency
      // });

      // Simulate 10% chance of failure for testing error handling
      // Remove this in production
      const shouldFail = Math.random() < 0.1 && retryCount < 2;

      if (shouldFail) {
        throw new Error(language === 'th' ? 'การเชื่อมต่อหมดเวลา' :
                       language === 'zh' ? '连接超时' : 'Connection timeout');
      }

      // Payment successful
      setStep('success');
      const paymentData = {
        receiptId: `RCP-${Date.now()}`,
        amount: amount,
        paymentDate: new Date().toISOString(),
        paymentMethod: getPaymentMethodDisplayName(),
        type: 'activities'
      };
      onPaymentComplete(true, paymentData);
    } catch (err) {
      console.error('Payment processing error:', err);
      const errorMessage = err instanceof Error ? err.message :
        (language === 'th' ? 'เกิดข้อผิดพลาดในการชำระเงิน' :
         language === 'zh' ? '支付处理出错' : 'Payment processing error');
      setError(errorMessage);
      setStep('failed');
    }
  };

  const handleConfirmPayment = () => {
    if (amount <= 0) {
      setError(language === 'th' ? 'จำนวนเงินไม่ถูกต้อง' :
              language === 'zh' ? '金额无效' : 'Invalid amount');
      return;
    }
    setError(null);
    if (requiresSlipUpload) {
      setSlipStage('select');
      setSlipDialogOpen(true);
      return;
    }
    setStep('processing');
    setCountdown(10);
  };

  const handleSlipFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSlipFile(file);
      setSlipPreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveSlip = () => {
    setSlipFile(null);
    setSlipPreview('');
  };

  const handleSlipDialogOpenChange = (open: boolean) => {
    if (slipStage === 'uploading') return; // don't allow closing mid-upload
    setSlipDialogOpen(open);
    if (!open) {
      setSlipStage('select');
      setSlipFile(null);
      setSlipPreview('');
    }
  };

  const handleUploadSlip = async () => {
    if (!slipFile) return;
    setSlipStage('uploading');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSlipStage('done');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSlipDialogOpen(false);
    setSlipStage('select');
    setSlipFile(null);
    setSlipPreview('');
    setStep('success');
    const paymentData = {
      receiptId: `RCP-${Date.now()}`,
      amount: amount,
      paymentDate: new Date().toISOString(),
      paymentMethod: getPaymentMethodDisplayName(),
      type: 'activities'
    };
    onPaymentComplete(true, paymentData);
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
    setStep('confirm');
    setCountdown(10);
  };

  const formatTime = (seconds: number) => {
    return `${seconds.toString().padStart(2, '0')}`;
  };

  const renderPaymentMethodFlow = () => {
    switch (paymentMethod.id) {
      case 'credit_card_th':
      case 'credit_card_intl':
        return (
          <div className="space-y-4">
            {step === 'confirm' && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <CreditCard className="h-8 w-8 text-primary" />
                </div>
                <p className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {language === 'th' ? 'กำลังเปลี่ยนเส้นทางไปยังระบบชำระเงิน...' : 
                   language === 'zh' ? '正在重定向到支付系统...' : 'Redirecting to payment system...'}
                </p>
              </div>
            )}
            {step === 'processing' && (
              <div className="text-center space-y-4">
                <LoaderCircle className="h-12 w-12 animate-spin text-primary mx-auto" />
                <p className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {language === 'th' ? 'กำลังดำเนินการ...' : 
                   language === 'zh' ? '处理中...' : 'Processing...'}
                </p>
                 <p className={`text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                   {formatTime(countdown)} {language === 'th' ? 'วินาที' : language === 'zh' ? '秒' : 'seconds'}
                 </p>
              </div>
            )}
          </div>
        );

      case 'promptpay':
      case 'wechat':
      case 'alipay':
        return (
          <div className="space-y-4">
            {step === 'confirm' && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <IconComponent className="h-8 w-8 text-primary" />
                </div>
                <p className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {language === 'th' ? 'กรุณาสแกน QR Code เพื่อชำระเงิน' : 
                   language === 'zh' ? '请扫描二维码进行支付' : 'Please scan QR code to pay'}
                </p>
              </div>
            )}
            {step === 'processing' && (
              <div className="text-center space-y-4">
                <div className="w-32 h-32 bg-muted border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center mx-auto">
                  <QrCode className="h-16 w-16 text-muted-foreground" />
                </div>
                <p className={`font-bold ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {language === 'th' ? 'สแกน QR Code' : 
                   language === 'zh' ? '扫描二维码' : 'Scan QR Code'}
                </p>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                   <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                     {formatTime(countdown)} {language === 'th' ? 'วินาที' : language === 'zh' ? '秒' : 'seconds'}
                   </span>
                </div>
                <div className="flex justify-center">
                  <LoaderCircle className="h-6 w-6 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>
        );

      case 'bank_counter':
        return (
          <div className="space-y-4">
            {step === 'confirm' && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <p className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                    {language === 'th' ? 'หมายเลขบัญชี' : language === 'zh' ? '账号' : 'Account Number'}: 123-456-7890
                  </p>
                  <p className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                    {language === 'th' ? 'ชื่อบัญชี' : language === 'zh' ? '账户名称' : 'Account Name'}: SISB School
                  </p>
                  <p className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                    {language === 'th' ? 'ธนาคาร' : language === 'zh' ? '银行' : 'Bank'}: {language === 'th' ? 'กสิกรไทย' : language === 'zh' ? '泰国开泰银行' : 'Kasikorn Bank'}
                  </p>
                </div>
              </div>
            )}
            {step === 'processing' && (
              <div className="text-center space-y-4">
                <LoaderCircle className="h-12 w-12 animate-spin text-primary mx-auto" />
                <p className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {language === 'th' ? 'กำลังตรวจสอบการชำระเงิน...' : 
                   language === 'zh' ? '正在检查付款...' : 'Checking payment...'}
                </p>
                 <p className={`text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                   {formatTime(countdown)} {language === 'th' ? 'วินาที' : language === 'zh' ? '秒' : 'seconds'}
                 </p>
              </div>
            )}
          </div>
        );

      case 'payment_link':
        return (
          <div className="space-y-4">
            {step === 'confirm' && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Link2 className="h-8 w-8 text-primary" />
                </div>
                <p className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {language === 'th' ? 'ระบบจะส่งลิงก์ชำระเงินไปยังอีเมลและมือถือของท่าน' :
                   language === 'zh' ? '系统将把支付链接发送到您的邮箱和手机' : 'A payment link will be sent to your email and mobile'}
                </p>
              </div>
            )}
            {step === 'processing' && (
              <div className="text-center space-y-4">
                <LoaderCircle className="h-12 w-12 animate-spin text-primary mx-auto" />
                <p className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {language === 'th' ? 'รอการชำระเงินผ่านลิงก์...' :
                   language === 'zh' ? '等待通过链接付款...' : 'Waiting for payment via link...'}
                </p>
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                    {formatTime(countdown)} {language === 'th' ? 'วินาที' : language === 'zh' ? '秒' : 'seconds'}
                  </span>
                </div>
              </div>
            )}
          </div>
        );

      case 'direct_debit':
        return (
          <div className="space-y-4">
            {step === 'confirm' && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <Landmark className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <p className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                    {language === 'th' ? 'ระบบจะหักเงินจากบัญชีที่ผูกไว้' :
                     language === 'zh' ? '系统将从已绑定的账户中扣款' : 'The amount will be debited from your linked account'}
                  </p>
                  <p className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                    {language === 'th' ? 'บัญชีที่ผูกไว้' : language === 'zh' ? '已绑定账户' : 'Linked Account'}: xxx-x-x7890
                  </p>
                </div>
              </div>
            )}
            {step === 'processing' && (
              <div className="text-center space-y-4">
                <LoaderCircle className="h-12 w-12 animate-spin text-primary mx-auto" />
                <p className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {language === 'th' ? 'กำลังหักบัญชี...' :
                   language === 'zh' ? '正在扣款...' : 'Debiting account...'}
                </p>
                <p className={`text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {formatTime(countdown)} {language === 'th' ? 'วินาที' : language === 'zh' ? '秒' : 'seconds'}
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (step === 'success') {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="w-16 h-16 bg-finance-green/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="h-8 w-8 text-finance-green" />
          </div>
          <h3 className={`text-xl font-bold ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            {language === 'th' ? 'ชำระเงินสำเร็จ!' : language === 'zh' ? '支付成功！' : 'Payment Successful!'}
          </h3>
          <p className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            {language === 'th' ? 'กำลังสร้างใบเสร็จรับเงิน...' : language === 'zh' ? '正在生成收据...' : 'Generating receipt...'}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (step === 'failed') {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto">
            <XCircle className="h-8 w-8 text-destructive" />
          </div>
          <h3 className={`text-xl font-bold ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            {language === 'th' ? 'ชำระเงินไม่สำเร็จ' : language === 'zh' ? '支付失败' : 'Payment Failed'}
          </h3>
          <div className="p-3 bg-destructive/10 rounded-lg">
            <p className={`text-sm text-destructive ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
              {error || (language === 'th' ? 'หมดเวลาการชำระเงิน กรุณาลองใหม่อีกครั้ง' :
                        language === 'zh' ? '支付超时，请重试' : 'Payment timeout, please try again')}
            </p>
          </div>
          {retryCount > 0 && (
            <p className={`text-xs text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
              {language === 'th' ? `ความพยายามครั้งที่: ${retryCount}` :
               language === 'zh' ? `尝试次数: ${retryCount}` : `Retry attempt: ${retryCount}`}
            </p>
          )}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onCancel} className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {language === 'th' ? 'กลับ' : language === 'zh' ? '返回' : 'Back'}
            </Button>
            <Button onClick={handleRetry} className="flex-1" disabled={retryCount >= 3}>
              {language === 'th' ? 'ลองใหม่' : language === 'zh' ? '重试' : 'Try Again'}
            </Button>
          </div>
          {retryCount >= 3 && (
            <p className={`text-xs text-destructive ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
              {language === 'th' ? 'หากยังมีปัญหา กรุณาติดต่อฝ่ายสนับสนุน' :
               language === 'zh' ? '如仍有问题，请联系客服' : 'If the problem persists, please contact support'}
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <>
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className={`text-center ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
          {getPaymentMethodDisplayName()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {renderPaymentMethodFlow()}
        
        <Separator />
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
              {language === 'th' ? 'จำนวนเงิน:' : language === 'zh' ? '金额:' : 'Amount:'}
            </span>
            <span className={`font-bold text-lg ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
              {formatCurrency(amount)}
            </span>
          </div>
        </div>

        {step === 'confirm' && (
          <>
            {error && (
              <div className="p-3 bg-destructive/10 rounded-lg">
                <p className={`text-sm text-destructive ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {error}
                </p>
              </div>
            )}
            <div className="flex gap-3">
              <Button variant="outline" onClick={onCancel} className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {language === 'th' ? 'กลับ' : language === 'zh' ? '返回' : 'Back'}
              </Button>
              <Button onClick={handleConfirmPayment} className="flex-1" disabled={amount <= 0}>
                {language === 'th' ? 'ยืนยันการชำระเงิน' : language === 'zh' ? '确认支付' : 'Confirm Payment'}
              </Button>
            </div>
          </>
        )}

        {step === 'processing' && (
          <Button variant="outline" onClick={onCancel} className="w-full">
            {language === 'th' ? 'ยกเลิก' : language === 'zh' ? '取消' : 'Cancel'}
          </Button>
        )}
      </CardContent>
    </Card>

    <Dialog open={slipDialogOpen} onOpenChange={handleSlipDialogOpenChange}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => slipStage === 'uploading' && e.preventDefault()} onEscapeKeyDown={(e) => slipStage === 'uploading' && e.preventDefault()}>
        {slipStage === 'select' && (
          <>
            <DialogHeader>
              <DialogTitle className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {language === 'th' ? 'อัปโหลดสลิปการชำระเงิน' : language === 'zh' ? '上传付款凭证' : 'Upload Payment Slip'}
              </DialogTitle>
              <DialogDescription className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {language === 'th' ? 'กรุณาแนบสลิปยืนยันการโอนเงิน 1 ไฟล์' : language === 'zh' ? '请上传1份转账凭证' : 'Please attach 1 file as proof of payment'}
              </DialogDescription>
            </DialogHeader>

            {slipPreview ? (
              <div className="relative w-full h-48 mx-auto">
                <img src={slipPreview} alt="Slip preview" className="w-full h-full object-contain rounded-lg border" />
                <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6" onClick={handleRemoveSlip}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 border-muted-foreground/25">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className={`text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                    {language === 'th' ? 'คลิกเพื่ออัปโหลดสลิป' : language === 'zh' ? '点击上传凭证' : 'Click to upload slip'}
                  </p>
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleSlipFileChange} />
              </label>
            )}

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => handleSlipDialogOpenChange(false)}>
                {language === 'th' ? 'ยกเลิก' : language === 'zh' ? '取消' : 'Cancel'}
              </Button>
              <Button onClick={handleUploadSlip} disabled={!slipFile}>
                {language === 'th' ? 'อัปโหลด' : language === 'zh' ? '上传' : 'Upload'}
              </Button>
            </DialogFooter>
          </>
        )}

        {slipStage === 'uploading' && (
          <div className="py-8 text-center space-y-4">
            <LoaderCircle className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
              {language === 'th' ? 'กำลังอัปโหลดสลิป...' : language === 'zh' ? '正在上传凭证...' : 'Uploading slip...'}
            </p>
          </div>
        )}

        {slipStage === 'done' && (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 bg-finance-green/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8 text-finance-green" />
            </div>
            <p className={`font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
              {language === 'th' ? 'อัปโหลดสำเร็จ' : language === 'zh' ? '上传成功' : 'Upload complete'}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
    </>
  );
};