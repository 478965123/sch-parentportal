import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { LogoBadge } from "@/components/LogoBadge";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { nationalities } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { PaymentProcessing } from "@/components/portal/PaymentProcessing";
import {
  ArrowLeft,
  Upload,
  X,
  Check,
  ChevronDown,
  CreditCard,
  QrCode,
  MessageCircle,
  Wallet,
  Link2,
  Landmark,
  CheckCircle2,
  GraduationCap,
  UserRound,
} from "lucide-react";

interface NewStudentRegistrationProps {
  onBack: () => void;
}

const DEPOSIT_AMOUNT = 20000;

const grades = [
  'Nursery', 'Reception', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5',
  'Year 6', 'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13'
];

const paymentMethods = [
  { id: 'credit_card_th', name: 'Local Credit Card', icon: CreditCard, fee: 1.5, currency: '%' },
  { id: 'credit_card_intl', name: 'International Credit Card', icon: CreditCard, fee: 2.2, currency: '%' },
  { id: 'promptpay', name: 'PromptPay', icon: QrCode, fee: 0, currency: '฿' },
  { id: 'wechat', name: 'WeChat Pay', icon: MessageCircle, fee: 1.8, currency: '%' },
  { id: 'alipay', name: 'Alipay', icon: Wallet, fee: 1.8, currency: '%' },
  { id: 'payment_link', name: 'Payment Link', icon: Link2, fee: 15, currency: '฿' },
  { id: 'direct_debit', name: 'Direct Debit', icon: Landmark, fee: 10, currency: '฿' },
];

const steps = [
  { number: 1, en: 'Registration', th: 'ลงทะเบียน' },
  { number: 2, en: 'Payment', th: 'ชำระเงิน' },
  { number: 3, en: 'Success', th: 'สำเร็จ' },
];

export const NewStudentRegistration = ({ onBack }: NewStudentRegistrationProps) => {
  const { language, formatCurrency } = useLanguage();
  const fontClass = language === 'th' ? 'font-sukhumvit' : 'font-lato';

  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<typeof paymentMethods[0] | null>(null);
  const [showPaymentProcessing, setShowPaymentProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [nationalityOpen, setNationalityOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    studentFirstName: '',
    studentLastName: '',
    studentDob: '',
    gradeApplying: '',
    nationality: '',
    gender: '' as 'male' | 'female' | '',
    parentName: '',
    parentRelationship: '' as 'father' | 'mother' | 'guardian' | '',
    parentPhone: '',
    parentEmail: '',
    document: null as File | null,
    documentPreview: '',
  });

  const currentStepNumber = step === 'form' ? 1 : step === 'payment' ? 2 : 3;

  const paymentFee = selectedPaymentMethod
    ? (selectedPaymentMethod.currency === '%'
      ? DEPOSIT_AMOUNT * (selectedPaymentMethod.fee / 100)
      : selectedPaymentMethod.fee)
    : 0;
  const totalAmount = DEPOSIT_AMOUNT + paymentFee;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.studentFirstName.trim()) {
      newErrors.studentFirstName = language === 'th' ? 'กรุณากรอกชื่อนักเรียน' : 'Student first name is required';
    }
    if (!formData.studentLastName.trim()) {
      newErrors.studentLastName = language === 'th' ? 'กรุณากรอกนามสกุลนักเรียน' : 'Student last name is required';
    }
    if (!formData.studentDob) {
      newErrors.studentDob = language === 'th' ? 'กรุณาเลือกวันเกิด' : 'Date of birth is required';
    }
    if (!formData.gradeApplying) {
      newErrors.gradeApplying = language === 'th' ? 'กรุณาเลือกระดับชั้นที่สมัคร' : 'Grade applying for is required';
    }
    if (!formData.nationality) {
      newErrors.nationality = language === 'th' ? 'กรุณาเลือกสัญชาติ' : 'Nationality is required';
    }
    if (!formData.gender) {
      newErrors.gender = language === 'th' ? 'กรุณาเลือกเพศ' : 'Gender is required';
    }
    if (!formData.parentName.trim()) {
      newErrors.parentName = language === 'th' ? 'กรุณากรอกชื่อผู้ปกครอง' : 'Parent name is required';
    }
    if (!formData.parentRelationship) {
      newErrors.parentRelationship = language === 'th' ? 'กรุณาเลือกความสัมพันธ์' : 'Relationship is required';
    }
    if (!formData.parentPhone.trim()) {
      newErrors.parentPhone = language === 'th' ? 'กรุณากรอกเบอร์โทรศัพท์' : 'Phone number is required';
    }
    if (!formData.parentEmail.trim()) {
      newErrors.parentEmail = language === 'th' ? 'กรุณากรอกอีเมล' : 'Email is required';
    }
    if (!formData.document) {
      newErrors.document = language === 'th' ? 'กรุณาแนบเอกสาร' : 'Document is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDocumentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, document: file, documentPreview: URL.createObjectURL(file) }));
      setErrors(prev => ({ ...prev, document: '' }));
    }
  };

  const handleRemoveDocument = () => {
    setFormData(prev => ({ ...prev, document: null, documentPreview: '' }));
  };

  const handleContinueToPayment = () => {
    if (!validateForm()) return;
    setStep('payment');
  };

  const handlePay = () => {
    setShowPaymentProcessing(true);
  };

  const handlePaymentComplete = (success: boolean, paymentData?: any) => {
    if (success && paymentData) {
      setPaymentResult(paymentData);
      setStep('success');
    }
  };

  const handleBackFromPayment = () => {
    setShowPaymentProcessing(false);
  };

  const studentFullName = `${formData.studentFirstName} ${formData.studentLastName}`.trim();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {step !== 'success' && !(step === 'payment' && showPaymentProcessing) ? (
            <Button variant="ghost" onClick={step === 'form' ? onBack : () => setStep('form')} className={fontClass}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {language === 'th' ? 'กลับ' : 'Back'}
            </Button>
          ) : <div />}
          <LanguageSelector />
        </div>

        <div className="flex flex-col items-center mb-8">
          <LogoBadge imgClassName="h-10 w-auto mb-4" />
          <h1 className={`text-2xl font-bold text-center ${fontClass}`}>
            {language === 'th' ? 'ลงทะเบียนนักเรียนใหม่' : 'New Student Registration'}
          </h1>
          <p className={`text-muted-foreground text-center mt-1 ${fontClass}`}>
            {language === 'th' ? 'ลงทะเบียนนักเรียนและชำระค่ามัดจำแรกเข้า' : 'Register your child and pay the entrance deposit'}
          </p>
        </div>

        {/* Stepper */}
        <div className="max-w-md mx-auto mb-10">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    s.number <= currentStepNumber ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {s.number}
                  </div>
                  <span className={`mt-2 text-xs text-center ${fontClass} ${s.number <= currentStepNumber ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                    {language === 'th' ? s.th : s.en}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-4 mt-[-20px]">
                    <div className={`h-full rounded ${s.number < currentStepNumber ? 'bg-primary' : 'bg-muted'}`} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step: Registration Form */}
        {step === 'form' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Student Info */}
              <Card>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 text-lg ${fontClass}`}>
                    <GraduationCap className="h-5 w-5 text-primary" />
                    {language === 'th' ? 'ข้อมูลนักเรียน' : 'Student Information'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className={fontClass}>
                        {language === 'th' ? 'ชื่อจริง' : 'First Name'} <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        value={formData.studentFirstName}
                        onChange={(e) => { setFormData(prev => ({ ...prev, studentFirstName: e.target.value })); setErrors(prev => ({ ...prev, studentFirstName: '' })); }}
                        className={errors.studentFirstName ? 'border-destructive' : ''}
                      />
                      {errors.studentFirstName && <p className="text-sm text-destructive">{errors.studentFirstName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className={fontClass}>
                        {language === 'th' ? 'นามสกุล' : 'Last Name'} <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        value={formData.studentLastName}
                        onChange={(e) => { setFormData(prev => ({ ...prev, studentLastName: e.target.value })); setErrors(prev => ({ ...prev, studentLastName: '' })); }}
                        className={errors.studentLastName ? 'border-destructive' : ''}
                      />
                      {errors.studentLastName && <p className="text-sm text-destructive">{errors.studentLastName}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className={fontClass}>
                        {language === 'th' ? 'วันเกิด' : 'Date of Birth'} <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        type="date"
                        value={formData.studentDob}
                        onChange={(e) => { setFormData(prev => ({ ...prev, studentDob: e.target.value })); setErrors(prev => ({ ...prev, studentDob: '' })); }}
                        className={errors.studentDob ? 'border-destructive' : ''}
                      />
                      {errors.studentDob && <p className="text-sm text-destructive">{errors.studentDob}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className={fontClass}>
                        {language === 'th' ? 'เพศ' : 'Gender'} <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.gender}
                        onValueChange={(value: 'male' | 'female') => { setFormData(prev => ({ ...prev, gender: value })); setErrors(prev => ({ ...prev, gender: '' })); }}
                      >
                        <SelectTrigger className={cn(fontClass, errors.gender && 'border-destructive')}>
                          <SelectValue placeholder={language === 'th' ? 'เลือกเพศ...' : 'Select gender...'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">{language === 'th' ? 'ชาย' : 'Male'}</SelectItem>
                          <SelectItem value="female">{language === 'th' ? 'หญิง' : 'Female'}</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className={fontClass}>
                        {language === 'th' ? 'ระดับชั้นที่สมัคร' : 'Grade Applying For'} <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.gradeApplying}
                        onValueChange={(value) => { setFormData(prev => ({ ...prev, gradeApplying: value })); setErrors(prev => ({ ...prev, gradeApplying: '' })); }}
                      >
                        <SelectTrigger className={cn(fontClass, errors.gradeApplying && 'border-destructive')}>
                          <SelectValue placeholder={language === 'th' ? 'เลือกระดับชั้น...' : 'Select grade...'} />
                        </SelectTrigger>
                        <SelectContent>
                          {grades.map((grade) => (
                            <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.gradeApplying && <p className="text-sm text-destructive">{errors.gradeApplying}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className={fontClass}>
                        {language === 'th' ? 'สัญชาติ' : 'Nationality'} <span className="text-destructive">*</span>
                      </Label>
                      <Popover open={nationalityOpen} onOpenChange={setNationalityOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={nationalityOpen}
                            className={cn("w-full justify-between", fontClass, errors.nationality && 'border-destructive')}
                          >
                            {formData.nationality || (language === 'th' ? 'เลือกสัญชาติ...' : 'Select nationality...')}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0 z-50" align="start">
                          <Command>
                            <CommandInput placeholder={language === 'th' ? 'ค้นหาสัญชาติ...' : 'Search nationality...'} />
                            <CommandList>
                              <CommandEmpty>{language === 'th' ? 'ไม่พบสัญชาติ' : 'No nationality found.'}</CommandEmpty>
                              <CommandGroup>
                                {nationalities.map((nat) => (
                                  <CommandItem
                                    key={nat}
                                    value={nat}
                                    onSelect={(currentValue) => {
                                      setFormData(prev => ({ ...prev, nationality: currentValue === prev.nationality ? "" : currentValue }));
                                      setNationalityOpen(false);
                                      setErrors(prev => ({ ...prev, nationality: '' }));
                                    }}
                                  >
                                    <Check className={cn("mr-2 h-4 w-4", formData.nationality === nat ? "opacity-100" : "opacity-0")} />
                                    {nat}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {errors.nationality && <p className="text-sm text-destructive">{errors.nationality}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Parent Info */}
              <Card>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 text-lg ${fontClass}`}>
                    <UserRound className="h-5 w-5 text-primary" />
                    {language === 'th' ? 'ข้อมูลผู้ปกครอง' : 'Parent / Guardian Information'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className={fontClass}>
                        {language === 'th' ? 'ชื่อ-นามสกุลผู้ปกครอง' : 'Parent Full Name'} <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        value={formData.parentName}
                        onChange={(e) => { setFormData(prev => ({ ...prev, parentName: e.target.value })); setErrors(prev => ({ ...prev, parentName: '' })); }}
                        className={errors.parentName ? 'border-destructive' : ''}
                      />
                      {errors.parentName && <p className="text-sm text-destructive">{errors.parentName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className={fontClass}>
                        {language === 'th' ? 'ความสัมพันธ์' : 'Relationship'} <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.parentRelationship}
                        onValueChange={(value: 'father' | 'mother' | 'guardian') => { setFormData(prev => ({ ...prev, parentRelationship: value })); setErrors(prev => ({ ...prev, parentRelationship: '' })); }}
                      >
                        <SelectTrigger className={cn(fontClass, errors.parentRelationship && 'border-destructive')}>
                          <SelectValue placeholder={language === 'th' ? 'เลือกความสัมพันธ์...' : 'Select relationship...'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="father">{language === 'th' ? 'บิดา' : 'Father'}</SelectItem>
                          <SelectItem value="mother">{language === 'th' ? 'มารดา' : 'Mother'}</SelectItem>
                          <SelectItem value="guardian">{language === 'th' ? 'ผู้ปกครองตามกฎหมาย' : 'Legal Guardian'}</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.parentRelationship && <p className="text-sm text-destructive">{errors.parentRelationship}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className={fontClass}>
                        {language === 'th' ? 'เบอร์โทรศัพท์' : 'Phone Number'} <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        type="tel"
                        value={formData.parentPhone}
                        onChange={(e) => { setFormData(prev => ({ ...prev, parentPhone: e.target.value })); setErrors(prev => ({ ...prev, parentPhone: '' })); }}
                        className={errors.parentPhone ? 'border-destructive' : ''}
                      />
                      {errors.parentPhone && <p className="text-sm text-destructive">{errors.parentPhone}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className={fontClass}>
                        {language === 'th' ? 'อีเมล' : 'Email'} <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        type="email"
                        value={formData.parentEmail}
                        onChange={(e) => { setFormData(prev => ({ ...prev, parentEmail: e.target.value })); setErrors(prev => ({ ...prev, parentEmail: '' })); }}
                        className={errors.parentEmail ? 'border-destructive' : ''}
                      />
                      {errors.parentEmail && <p className="text-sm text-destructive">{errors.parentEmail}</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Document Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className={`text-lg ${fontClass}`}>
                    {language === 'th' ? 'เอกสารประกอบ' : 'Supporting Document'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Label className={fontClass}>
                    {language === 'th' ? 'สูติบัตร / พาสปอร์ตนักเรียน' : "Student's Birth Certificate / Passport"} <span className="text-destructive">*</span>
                  </Label>
                  {formData.documentPreview ? (
                    <div className="relative w-32 h-32">
                      <img src={formData.documentPreview} alt="Document preview" className="w-full h-full object-cover rounded-lg border" />
                      <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6" onClick={handleRemoveDocument}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 ${errors.document ? 'border-destructive' : 'border-muted-foreground/25'}`}>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                        <p className={`text-sm text-muted-foreground ${fontClass}`}>
                          {language === 'th' ? 'คลิกเพื่ออัปโหลดเอกสาร' : 'Click to upload document'}
                        </p>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={handleDocumentChange} />
                    </label>
                  )}
                  {errors.document && <p className="text-sm text-destructive">{errors.document}</p>}
                </CardContent>
              </Card>
            </div>

            {/* Deposit Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className={fontClass}>
                    {language === 'th' ? 'สรุปค่ามัดจำ' : 'Deposit Summary'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className={fontClass}>
                      {language === 'th' ? 'ค่ามัดจำแรกเข้า' : 'Entrance Deposit'}
                    </span>
                    <span className={fontClass}>{formatCurrency(DEPOSIT_AMOUNT)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span className={fontClass}>{language === 'th' ? 'ยอดรวม' : 'Total'}</span>
                    <span className={fontClass}>{formatCurrency(DEPOSIT_AMOUNT)}</span>
                  </div>
                  <p className={`text-xs text-muted-foreground ${fontClass}`}>
                    {language === 'th'
                      ? 'ค่ามัดจำนี้จะถูกนำไปหักลบกับค่าเทอมแรกของนักเรียน และไม่สามารถขอคืนได้หากยกเลิกการลงทะเบียน'
                      : 'This deposit will be applied toward the first term fee and is non-refundable if registration is cancelled.'}
                  </p>
                  <Button onClick={handleContinueToPayment} size="lg" className={`w-full ${fontClass}`}>
                    {language === 'th' ? 'ดำเนินการชำระเงิน' : 'Continue to Payment'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Step: Payment */}
        {step === 'payment' && !showPaymentProcessing && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <h2 className={`text-xl font-bold ${fontClass}`}>
                {language === 'th' ? 'เลือกวิธีชำระเงิน' : 'Select Payment Method'}
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
                      <span className={`font-medium ${fontClass}`}>
                        {language === 'th'
                          ? (method.id === 'credit_card_th' ? 'บัตรเครดิตในประเทศ' :
                             method.id === 'credit_card_intl' ? 'บัตรเครดิตต่างประเทศ' :
                             method.id === 'promptpay' ? 'พร้อมเพย์' :
                             method.id === 'wechat' ? 'วีแชทเพย์' :
                             method.id === 'alipay' ? 'อาลีเพย์' :
                             method.id === 'payment_link' ? 'ลิงก์ชำระเงิน' :
                             method.id === 'direct_debit' ? 'หักบัญชีอัตโนมัติ' : method.name)
                          : method.name}
                      </span>
                      {method.fee !== 0 && (
                        <div className={`text-xs text-muted-foreground ${fontClass}`}>
                          {method.currency === '%' ? `+${method.fee}%` : `+${formatCurrency(method.fee)}`}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className={fontClass}>{language === 'th' ? 'สรุปการชำระเงิน' : 'Payment Summary'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className={fontClass}>{language === 'th' ? 'ค่ามัดจำแรกเข้า' : 'Entrance Deposit'}</span>
                    <span className={fontClass}>{formatCurrency(DEPOSIT_AMOUNT)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={fontClass}>{language === 'th' ? 'ค่าธรรมเนียม' : 'Fee'}</span>
                    <span className={fontClass}>{formatCurrency(paymentFee)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span className={fontClass}>{language === 'th' ? 'ยอดรวม' : 'Total'}</span>
                    <span className={fontClass}>{formatCurrency(totalAmount)}</span>
                  </div>
                  <Button onClick={handlePay} size="lg" disabled={!selectedPaymentMethod} className={`w-full ${fontClass}`}>
                    {selectedPaymentMethod
                      ? `${language === 'th' ? 'ชำระเงิน' : 'Pay'} ${formatCurrency(totalAmount)}`
                      : (language === 'th' ? 'กรุณาเลือกช่องทางชำระ' : 'Select payment method')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {step === 'payment' && showPaymentProcessing && selectedPaymentMethod && (
          <PaymentProcessing
            paymentMethod={selectedPaymentMethod}
            amount={totalAmount}
            onPaymentComplete={handlePaymentComplete}
            onCancel={handleBackFromPayment}
          />
        )}

        {/* Step: Success */}
        {step === 'success' && paymentResult && (
          <Card className="max-w-lg mx-auto">
            <CardContent className="pt-8 pb-6 text-center space-y-4">
              <div className="w-16 h-16 bg-finance-green/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8 text-finance-green" />
              </div>
              <h2 className={`text-2xl font-bold ${fontClass}`}>
                {language === 'th' ? 'ลงทะเบียนสำเร็จ!' : 'Registration Submitted!'}
              </h2>
              <p className={`text-muted-foreground ${fontClass}`}>
                {language === 'th'
                  ? `การลงทะเบียนของ ${studentFullName} และการชำระค่ามัดจำเสร็จสมบูรณ์แล้ว`
                  : `${studentFullName}'s registration and deposit payment are complete.`}
              </p>

              <div className="text-left bg-muted/50 rounded-lg p-4 space-y-2 mt-4">
                <div className="flex justify-between text-sm">
                  <span className={`text-muted-foreground ${fontClass}`}>{language === 'th' ? 'หมายเลขอ้างอิง' : 'Reference No.'}</span>
                  <span className="font-mono font-medium">{paymentResult.receiptId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={`text-muted-foreground ${fontClass}`}>{language === 'th' ? 'ระดับชั้น' : 'Grade Applying For'}</span>
                  <span className={fontClass}>{formData.gradeApplying}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={`text-muted-foreground ${fontClass}`}>{language === 'th' ? 'จำนวนเงิน' : 'Amount Paid'}</span>
                  <span className={fontClass}>{formatCurrency(paymentResult.amount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className={`text-muted-foreground ${fontClass}`}>{language === 'th' ? 'วิธีชำระเงิน' : 'Payment Method'}</span>
                  <span className={fontClass}>{paymentResult.paymentMethod}</span>
                </div>
              </div>

              <p className={`text-sm text-muted-foreground ${fontClass}`}>
                {language === 'th'
                  ? 'ทางโรงเรียนจะติดต่อกลับผ่านอีเมลที่ท่านให้ไว้เพื่อดำเนินการขั้นตอนถัดไป'
                  : 'The school admissions team will contact you by email with the next steps.'}
              </p>

              <Button onClick={onBack} size="lg" className={`w-full ${fontClass}`}>
                {language === 'th' ? 'กลับหน้าเข้าสู่ระบบ' : 'Back to Login'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
