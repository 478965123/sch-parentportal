import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Download, ArrowLeft, Calendar, CreditCard, ShoppingBag, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { PaymentProgressBar } from "./PaymentProgressBar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { generateReceiptPDF } from "@/utils/pdfGenerator";

interface ActivityPaymentSuccessProps {
  studentName: string;
  paymentData: {
    receiptId: string;
    amount: number;
    paymentDate: string;
    paymentMethod: string;
    items: Array<{
      id: string;
      name: string;
      price: number;
      type: 'course' | 'summer' | 'trip';
      date?: string;
      location?: string;
    }>;
    type: string;
    itemType?: 'activities' | 'trips';
  };
  onBackToMain: () => void;
  onBackToCart?: () => void;
}

export const ActivityPaymentSuccess = ({ studentName, paymentData, onBackToMain, onBackToCart }: ActivityPaymentSuccessProps) => {
  const { t, language, formatCurrency } = useLanguage();

  const formatDate = (dateString: string) => {
    const locale = language === 'th' ? 'th-TH' : language === 'zh' ? 'zh-CN' : 'en-GB';
    return new Date(dateString).toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleDownloadReceipt = () => {
    try {
      // Map payment method to the format expected by PDF generator
      const paymentMethodMap: Record<string, 'credit_card' | 'bank_transfer' | 'credit_note' | 'cash'> = {
        'Credit Card': 'credit_card',
        'Local Credit Card': 'credit_card',
        'International Credit Card': 'credit_card',
        'Bank Transfer': 'bank_transfer',
        'Credit Note': 'credit_note',
        'Refund / Credit Balance': 'credit_note',
        'Cash': 'cash',
        'PromptPay': 'bank_transfer',
        'WeChat Pay': 'bank_transfer',
        'Alipay': 'bank_transfer',
        'Payment Link': 'bank_transfer',
        'Direct Debit': 'bank_transfer',
      };

      // Create receipt object for PDF generation
      const receiptData = {
        id: paymentData.receiptId,
        invoice_id: `INV-${paymentData.receiptId.split('-')[1]}`,
        amount: paymentData.amount,
        payment_method: paymentMethodMap[paymentData.paymentMethod] || 'bank_transfer',
        paid_at: paymentData.paymentDate,
        receipt_url: '',
        status: 'completed' as const,
        description: paymentData.items.map(item => item.name).join(', '),
        reference_number: paymentData.receiptId,
      };

      // Generate PDF
      generateReceiptPDF(receiptData, language);

      toast({
        title: language === 'th' ? 'ดาวน์โหลดสำเร็จ' : language === 'zh' ? '下载成功' : 'Download Successful',
        description: language === 'th' ? 'ดาวน์โหลดใบเสร็จ PDF เรียบร้อยแล้ว' : language === 'zh' ? '收据 PDF 已下载' : 'Receipt PDF has been downloaded successfully',
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: language === 'th' ? 'เกิดข้อผิดพลาด' : language === 'zh' ? '错误' : 'Error',
        description: language === 'th' ? 'ไม่สามารถดาวน์โหลดใบเสร็จได้ กรุณาลองใหม่อีกครั้ง' : language === 'zh' ? '无法下载收据，请重试' : 'Unable to download receipt. Please try again',
        variant: 'destructive',
      });
    }
  };

  const getActivityTypeText = () => {
    // Check if it's a trip payment
    if (paymentData.itemType === 'trips' || paymentData.items.some(item => item.type === 'trip')) {
      return language === 'th' ? "ทัศนศึกษา" :
             language === 'zh' ? "旅行" : "Field Trips";
    }
    
    const courseCount = paymentData.items.filter(item => item.type === 'course').length;
    const summerCount = paymentData.items.filter(item => item.type === 'summer').length;
    
    if (courseCount > 0 && summerCount > 0) {
      return language === 'th' ? "กิจกรรมหลังเลิกเรียนและกิจกรรมช่วงปิดเทอม" :
             language === 'zh' ? "课后活动和夏令营活动" : "After School and Summer Activities";
    } else if (courseCount > 0) {
      return language === 'th' ? "กิจกรรมหลังเลิกเรียน" :
             language === 'zh' ? "课后活动" : "After School Activities";
    } else {
      return language === 'th' ? "กิจกรรมช่วงปิดเทอม" :
             language === 'zh' ? "夏令营活动" : "Summer Activities";
    }
  };

  const getRegisteredTitle = () => {
    if (paymentData.itemType === 'trips' || paymentData.items.some(item => item.type === 'trip')) {
      return language === 'th' ? 'ทัศนศึกษาที่ลงทะเบียน' : language === 'zh' ? '已注册的旅行' : 'Registered Trips';
    }
    return language === 'th' ? 'กิจกรรมที่ลงทะเบียน' : language === 'zh' ? '已注册活动' : 'Registered Activities';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink 
                onClick={onBackToMain}
                className={`cursor-pointer ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
              >
                {language === 'th' ? 'แดชบอร์ด' : language === 'zh' ? '仪表板' : 'Dashboard'}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink 
                onClick={onBackToCart || onBackToMain}
                className={`cursor-pointer ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
              >
                {language === 'th' ? 'ตะกร้า' : language === 'zh' ? '购物车' : 'Cart'}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
                {language === 'th' ? 'สำเร็จ' : language === 'zh' ? '完成' : 'Complete'}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="max-w-2xl mx-auto space-y-6">
          <PaymentProgressBar currentStep={3} />
      
      {/* Success Header */}
      <Card className="text-center">
        <CardContent className="pt-8 pb-6">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-finance-green/20 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-finance-green" />
            </div>
          </div>
          <h1 className={`text-2xl font-bold mb-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            {language === 'th' ? 'ชำระเงินสำเร็จ!' : language === 'zh' ? '支付成功！' : 'Payment Complete!'}
          </h1>
          <p className={`text-lg mb-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            {language === 'th' ? 'ขอบคุณสำหรับการชำระเงิน' : language === 'zh' ? '感谢您的付款' : 'Thank you for your payment'}
          </p>
          <p className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            {language === 'th' ? 'การลงทะเบียนเสร็จสิ้น' : language === 'zh' ? '注册完成' : 'Registration Complete'} {studentName} - {getActivityTypeText()}
          </p>
        </CardContent>
      </Card>

      {/* Registered Activities/Trips */}
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            <ShoppingBag className="h-5 w-5" />
            {getRegisteredTitle()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {paymentData.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <div className="flex-1">
                <h4 className={`font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{item.name}</h4>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant="outline" className={`text-xs ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                    {item.type === 'trip' ? 
                      (language === 'th' ? 'ทัศนศึกษา' : language === 'zh' ? '旅行' : 'Trip') :
                      item.type === 'course' ? 
                        (language === 'th' ? 'หลังเลิกเรียน' : language === 'zh' ? '课后活动' : 'After School') : 
                        (language === 'th' ? 'ช่วงปิดเทอม' : language === 'zh' ? '夏令营' : 'Summer')}
                  </Badge>
                  {item.type === 'trip' && item.date && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{item.date}</span>
                    </div>
                  )}
                  {item.type === 'trip' && item.location && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{item.location}</span>
                    </div>
                  )}
                </div>
              </div>
              <span className={`font-bold ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{formatCurrency(item.price)}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Payment Details */}
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            <CreditCard className="h-5 w-5" />
            {language === 'th' ? 'รายละเอียดการชำระเงิน' : language === 'zh' ? '支付详情' : 'Payment Details'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex justify-between items-center py-2 border-b border-muted">
              <span className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {language === 'th' ? 'หมายเลขใบเสร็จ:' : language === 'zh' ? '收据号码:' : 'Receipt Number:'}
              </span>
              <Badge variant="outline" className={`font-mono ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {paymentData.receiptId}
              </Badge>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-muted">
              <span className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {language === 'th' ? 'จำนวนเงิน:' : language === 'zh' ? '支付金额:' : 'Payment Amount:'}
              </span>
              <span className={`text-xl font-bold text-primary ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {formatCurrency(paymentData.amount)}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-muted">
              <span className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {language === 'th' ? 'วันที่ชำระเงิน:' : language === 'zh' ? '支付日期:' : 'Payment Date:'}
              </span>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{formatDate(paymentData.paymentDate)}</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {language === 'th' ? 'วิธีชำระเงิน:' : language === 'zh' ? '支付方式:' : 'Payment Method:'}
              </span>
              <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>{paymentData.paymentMethod}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button 
          variant="outline" 
          onClick={handleDownloadReceipt}
          className={`flex-1 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
        >
          <Download className="h-4 w-4 mr-2" />
          {language === 'th' ? 'ดาวน์โหลด PDF' : language === 'zh' ? '下载 PDF' : 'Download PDF'}
        </Button>
        
        <Button 
          onClick={onBackToMain}
          className={`flex-1 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {language === 'th' ? 'กลับหน้าหลัก' : language === 'zh' ? '返回主页' : 'Back to Main'}
        </Button>
      </div>
      
      {/* Additional Info */}
      <Card className="bg-muted/50">
        <CardContent className="pt-4">
          <p className={`text-sm text-muted-foreground text-center ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            {language === 'th' ? 'ใบเสร็จรับเงินและการยืนยันได้ส่งไปยังอีเมลของคุณแล้ว' : 
             language === 'zh' ? '收据和确认信息已发送到您的邮箱' : 
             'Receipt and confirmation have been sent to your email'}
          </p>
        </CardContent>
      </Card>
        </div>
      </div>
    </div>
  );
};