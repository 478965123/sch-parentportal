import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import { nationalities } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Upload, X, Calendar, Clock, Check, ChevronDown, Globe, BookOpen } from "lucide-react";

interface Exam {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  examPrice: number;
  deliveryPrice: number;
  examType?: 'hsk' | 'ipsle' | 'general';
  subjects?: Array<{ id: string; labelEn: string; labelZh: string }>;
  timetable?: {
    oral: Array<{ date: string; subjects: string[] }>;
    written: Array<{ date: string; subjects: string[] }>;
  };
}

interface ExamRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exam: Exam;
  onConfirm: (registrationData: any) => void;
}

const hskLevels = ['1', '2', '3', '4', '5', '6'];
const documentTypes = [
  { value: 'thai_id', labelEn: 'Thai ID Card', labelTh: 'บัตรประชาชนไทย', labelZh: '泰国身份证' },
  { value: 'passport', labelEn: 'Passport', labelTh: 'หนังสือเดินทาง', labelZh: '护照' }
];

export const ExamRegistrationDialog = ({
  open, 
  onOpenChange, 
  exam, 
  onConfirm 
}: ExamRegistrationDialogProps) => {
  const { language, formatCurrency, t } = useLanguage();
  
  const isHSK = exam.examType === 'hsk';
  const isIPSLE = exam.examType === 'ipsle';
  
  const [formData, setFormData] = useState({
    // HSK specific fields
    hskLevel: '',
    realName: '',
    chineseName: '',
    motherLanguage: '',
    yearsOfLearning: '',
    // Common fields (reused)
    nationality: '',
    documentType: '',
    idPassport: '',
    gender: '' as 'male' | 'female' | '',
    photo: null as File | null,
    photoPreview: '',
    examOption: 'examOnly' as 'examOnly' | 'examWithDelivery',
    // iPSLE specific fields
    selectedSubjects: [] as string[]
  });
  
  const [nationalityOpen, setNationalityOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // HSK specific validation
    if (isHSK) {
      if (!formData.hskLevel) {
        newErrors.hskLevel = language === 'th' ? 'กรุณาเลือกระดับ HSK' : language === 'zh' ? '请选择HSK级别' : 'HSK Level is required';
      }
      if (!formData.realName.trim()) {
        newErrors.realName = language === 'th' ? 'กรุณากรอกชื่อจริง' : language === 'zh' ? '请输入真实姓名' : 'Real name is required';
      }
      if (!formData.motherLanguage.trim()) {
        newErrors.motherLanguage = language === 'th' ? 'กรุณากรอกภาษาแม่' : language === 'zh' ? '请输入母语' : 'Mother language is required';
      }
      if (!formData.yearsOfLearning.trim()) {
        newErrors.yearsOfLearning = language === 'th' ? 'กรุณากรอกจำนวนปีที่เรียน' : language === 'zh' ? '请输入学习年数' : 'Years of learning is required';
      }
    }
    
    // iPSLE specific validation
    if (isIPSLE) {
      if (formData.selectedSubjects.length === 0) {
        newErrors.subjects = language === 'th' ? 'กรุณาเลือกอย่างน้อย 1 วิชา' : language === 'zh' ? '请至少选择1门科目' : 'Please select at least 1 subject';
      }
      if (formData.selectedSubjects.length > 4) {
        newErrors.subjects = language === 'th' ? 'เลือกได้สูงสุด 4 วิชา' : language === 'zh' ? '最多选择4门科目' : 'Maximum 4 subjects allowed';
      }
    }
    
    // Common validation for all exam types
    if (!formData.nationality) {
      newErrors.nationality = language === 'th' ? 'กรุณาเลือกสัญชาติ' : language === 'zh' ? '请选择国籍' : 'Nationality is required';
    }
    if (!formData.documentType) {
      newErrors.documentType = language === 'th' ? 'กรุณาเลือกประเภทเอกสาร' : language === 'zh' ? '请选择证件类型' : 'Document type is required';
    }
    if (!formData.idPassport.trim()) {
      newErrors.idPassport = language === 'th' ? 'กรุณากรอกเลข ID/Passport' : language === 'zh' ? '请输入ID/护照号码' : 'ID/Passport number is required';
    }
    if (!formData.gender) {
      newErrors.gender = language === 'th' ? 'กรุณาเลือกเพศ' : language === 'zh' ? '请选择性别' : 'Gender is required';
    }
    if (!formData.photo) {
      newErrors.photo = t('exam.errors.photoRequired');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        photo: file,
        photoPreview: URL.createObjectURL(file)
      }));
      setErrors(prev => ({ ...prev, photo: '' }));
    }
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({
      ...prev,
      photo: null,
      photoPreview: ''
    }));
  };

  const calculateTotal = () => {
    if (isIPSLE) {
      // iPSLE price based on subjects selected (can be per-subject or flat fee)
      return exam.examPrice;
    }
    return formData.examOption === 'examWithDelivery' 
      ? exam.examPrice + exam.deliveryPrice 
      : exam.examPrice;
  };

  const resetForm = () => {
    setFormData({
      hskLevel: '',
      realName: '',
      chineseName: '',
      motherLanguage: '',
      yearsOfLearning: '',
      nationality: '',
      documentType: '',
      idPassport: '',
      gender: '',
      photo: null,
      photoPreview: '',
      examOption: 'examOnly',
      selectedSubjects: []
    });
    setErrors({});
  };

  const handleSubjectToggle = (subjectId: string) => {
    setFormData(prev => {
      const isSelected = prev.selectedSubjects.includes(subjectId);
      if (isSelected) {
        return { ...prev, selectedSubjects: prev.selectedSubjects.filter(s => s !== subjectId) };
      } else if (prev.selectedSubjects.length < 4) {
        return { ...prev, selectedSubjects: [...prev.selectedSubjects, subjectId] };
      }
      return prev;
    });
    setErrors(prev => ({ ...prev, subjects: '' }));
  };

  const handleConfirm = () => {
    if (!validateForm()) return;
    
    const registrationData: any = {
      nationality: formData.nationality,
      documentType: formData.documentType,
      idPassport: formData.idPassport,
      gender: formData.gender,
      photo: formData.photo,
      totalPrice: calculateTotal()
    };

    if (isHSK) {
      registrationData.hskLevel = formData.hskLevel;
      registrationData.realName = formData.realName;
      registrationData.chineseName = formData.chineseName;
      registrationData.motherLanguage = formData.motherLanguage;
      registrationData.yearsOfLearning = formData.yearsOfLearning;
      registrationData.examOption = formData.examOption;
    }

    if (isIPSLE) {
      registrationData.selectedSubjects = formData.selectedSubjects;
    }
    
    onConfirm(registrationData);
    resetForm();
    onOpenChange(false);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const fontClass = language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato';

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className={fontClass}>
            {t('exam.registration')}
          </DialogTitle>
          <DialogDescription className={fontClass}>
            {exam.name}
          </DialogDescription>
        </DialogHeader>

        {/* Exam Info */}
        <div className="p-3 bg-muted/50 rounded-lg space-y-2">
          <div className={`flex items-center gap-2 text-sm ${fontClass}`}>
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{exam.date}</span>
          </div>
          <div className={`flex items-center gap-2 text-sm ${fontClass}`}>
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{exam.time}</span>
          </div>
        </div>

        <div className="space-y-4">

          {/* ====== HSK SPECIFIC FIELDS ====== */}
          {isHSK && (
            <>
              {/* HSK Level */}
              <div className="space-y-2">
                <Label className={fontClass}>
                  {language === 'th' ? 'ระดับ HSK' : language === 'zh' ? 'HSK级别' : 'HSK Level'} <span className="text-destructive">*</span>
                </Label>
                <Select 
                  value={formData.hskLevel} 
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, hskLevel: value }));
                    setErrors(prev => ({ ...prev, hskLevel: '' }));
                  }}
                >
                  <SelectTrigger className={cn(fontClass, errors.hskLevel && 'border-destructive')}>
                    <SelectValue placeholder={language === 'th' ? 'เลือกระดับ HSK...' : language === 'zh' ? '选择HSK级别...' : 'Select HSK Level...'} />
                  </SelectTrigger>
                  <SelectContent>
                    {hskLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        HSK {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.hskLevel && <p className="text-sm text-destructive">{errors.hskLevel}</p>}
              </div>

              {/* Real Name */}
              <div className="space-y-2">
                <Label className={fontClass}>
                  {language === 'th' ? 'ชื่อจริง (ตาม ID)' : language === 'zh' ? '真实姓名 (按证件)' : 'Real Name (as per ID)'} <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={formData.realName}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, realName: e.target.value }));
                    setErrors(prev => ({ ...prev, realName: '' }));
                  }}
                  placeholder={language === 'th' ? 'กรอกชื่อจริง' : language === 'zh' ? '输入真实姓名' : 'Enter real name'}
                  className={errors.realName ? 'border-destructive' : ''}
                />
                {errors.realName && <p className="text-sm text-destructive">{errors.realName}</p>}
              </div>

              {/* Chinese Name (Optional) */}
              <div className="space-y-2">
                <Label className={fontClass}>
                  {language === 'th' ? 'ชื่อภาษาจีน (ถ้ามี)' : language === 'zh' ? '中文名 (如有)' : 'Chinese Name (if any)'}
                </Label>
                <Input
                  value={formData.chineseName}
                  onChange={(e) => setFormData(prev => ({ ...prev, chineseName: e.target.value }))}
                  placeholder={language === 'th' ? 'กรอกชื่อภาษาจีน' : language === 'zh' ? '输入中文名' : 'Enter Chinese name'}
                />
              </div>
            </>
          )}

          {/* ====== iPSLE SPECIFIC FIELDS ====== */}
          {isIPSLE && (
            <>
              {/* Subject Selection */}
              <div className="space-y-3">
                <Label className={fontClass}>
                  <BookOpen className="h-4 w-4 inline mr-2" />
                  {language === 'th' 
                    ? 'เลือกวิชาที่ต้องการสมัคร (อย่างน้อย 1, สูงสุด 4 วิชา)' 
                    : language === 'zh' 
                    ? '请选择报名科目 (至少1门，最多4门)' 
                    : 'Select subjects to register (Min 1, Max 4)'} <span className="text-destructive">*</span>
                </Label>
                <p className="text-xs text-muted-foreground">
                  {language === 'zh' 
                    ? '请在下面注明您希望为孩子报名的科目。*至少一门科目，最多四门科目' 
                    : 'Please indicate the subjects that you are interested to register your child for below.'}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {exam.subjects?.map((subject) => {
                    const isSelected = formData.selectedSubjects.includes(subject.id);
                    const isDisabled = formData.selectedSubjects.length >= 4 && !isSelected;
                    
                    return (
                      <label 
                        key={subject.id}
                        className={cn(
                          "flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors",
                          isSelected && "border-primary bg-primary/5",
                          isDisabled && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <Checkbox 
                          checked={isSelected}
                          onCheckedChange={() => !isDisabled && handleSubjectToggle(subject.id)}
                          disabled={isDisabled}
                        />
                        <span className={`flex-1 ${fontClass}`}>
                          {subject.labelEn} <span className="text-muted-foreground">{subject.labelZh}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === 'th' 
                    ? `เลือกแล้ว: ${formData.selectedSubjects.length}/4 วิชา` 
                    : language === 'zh' 
                    ? `已选择: ${formData.selectedSubjects.length}/4 门科目` 
                    : `Selected: ${formData.selectedSubjects.length}/4 subjects`}
                </p>
                {errors.subjects && <p className="text-sm text-destructive">{errors.subjects}</p>}
              </div>

              {/* Timetable Display */}
              {exam.timetable && (
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <h4 className={`font-semibold ${fontClass}`}>
                    {language === 'th' ? 'ตารางสอบ' : language === 'zh' ? '考试时间表' : 'Examination Timetable'}
                  </h4>
                  
                  {/* Oral Examinations */}
                  <div className="space-y-2">
                    <h5 className={`text-sm font-medium text-primary ${fontClass}`}>
                      {language === 'th' ? 'สอบพูดและฟัง' : language === 'zh' ? '口语和听力' : 'Oral & Listening Comprehension'}
                    </h5>
                    {exam.timetable.oral.map((day, idx) => (
                      <div key={idx} className="text-sm pl-4 border-l-2 border-primary/30">
                        <span className="font-medium">{day.date}</span>
                        <p className="text-muted-foreground">{day.subjects.join(', ')}</p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Written Examinations */}
                  <div className="space-y-2">
                    <h5 className={`text-sm font-medium text-primary ${fontClass}`}>
                      {language === 'th' ? 'สอบข้อเขียน' : language === 'zh' ? '笔试' : 'Written Examinations'}
                    </h5>
                    {exam.timetable.written.map((day, idx) => (
                      <div key={idx} className="text-sm pl-4 border-l-2 border-primary/30">
                        <span className="font-medium">{day.date}</span>
                        <p className="text-muted-foreground">{day.subjects.join(', ')}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ====== COMMON FIELDS (All Exam Types) ====== */}
          
          {/* Nationality */}
          <div className="space-y-2">
            <Label className={fontClass}>
              <Globe className="h-4 w-4 inline mr-2" />
              {language === 'th' ? 'สัญชาติ' : language === 'zh' ? '国籍' : 'Nationality'} <span className="text-destructive">*</span>
            </Label>
            <Popover open={nationalityOpen} onOpenChange={setNationalityOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={nationalityOpen}
                  className={cn("w-full justify-between", fontClass, errors.nationality && 'border-destructive')}
                >
                  {formData.nationality || (language === 'th' ? 'เลือกสัญชาติ...' : language === 'zh' ? '选择国籍...' : 'Select nationality...')}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 z-50" align="start">
                <Command>
                  <CommandInput placeholder={language === 'th' ? 'ค้นหาสัญชาติ...' : language === 'zh' ? '搜索国籍...' : 'Search nationality...'} />
                  <CommandList>
                    <CommandEmpty>{language === 'th' ? 'ไม่พบสัญชาติ' : language === 'zh' ? '未找到国籍' : 'No nationality found.'}</CommandEmpty>
                    <CommandGroup>
                      {nationalities.map((nat) => (
                        <CommandItem
                          key={nat}
                          value={nat}
                          onSelect={(currentValue) => {
                            setFormData(prev => ({ ...prev, nationality: currentValue === formData.nationality ? "" : currentValue }));
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

          {/* Document Type */}
          <div className="space-y-2">
            <Label className={fontClass}>
              {language === 'th' ? 'ประเภทเอกสาร' : language === 'zh' ? '证件类型' : 'Document Type'} <span className="text-destructive">*</span>
            </Label>
            <Select 
              value={formData.documentType} 
              onValueChange={(value) => {
                setFormData(prev => ({ ...prev, documentType: value }));
                setErrors(prev => ({ ...prev, documentType: '' }));
              }}
            >
              <SelectTrigger className={cn(fontClass, errors.documentType && 'border-destructive')}>
                <SelectValue placeholder={language === 'th' ? 'เลือกประเภทเอกสาร...' : language === 'zh' ? '选择证件类型...' : 'Select document type...'} />
              </SelectTrigger>
              <SelectContent>
                {documentTypes.map((doc) => (
                  <SelectItem key={doc.value} value={doc.value}>
                    {language === 'th' ? doc.labelTh : language === 'zh' ? doc.labelZh : doc.labelEn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.documentType && <p className="text-sm text-destructive">{errors.documentType}</p>}
          </div>

          {/* ID/Passport Number */}
          <div className="space-y-2">
            <Label className={fontClass}>
              {language === 'th' ? 'เลข ID/Passport' : language === 'zh' ? 'ID/护照号码' : 'ID/Passport Number'} <span className="text-destructive">*</span>
            </Label>
            <Input
              value={formData.idPassport}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, idPassport: e.target.value }));
                setErrors(prev => ({ ...prev, idPassport: '' }));
              }}
              placeholder={language === 'th' ? 'กรอกเลข ID/Passport' : language === 'zh' ? '输入ID/护照号码' : 'Enter ID/Passport number'}
              className={errors.idPassport ? 'border-destructive' : ''}
            />
            {errors.idPassport && <p className="text-sm text-destructive">{errors.idPassport}</p>}
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label className={fontClass}>
              {language === 'th' ? 'เพศ' : language === 'zh' ? '性别' : 'Gender'} <span className="text-destructive">*</span>
            </Label>
            <Select 
              value={formData.gender} 
              onValueChange={(value: 'male' | 'female') => {
                setFormData(prev => ({ ...prev, gender: value }));
                setErrors(prev => ({ ...prev, gender: '' }));
              }}
            >
              <SelectTrigger className={cn(fontClass, errors.gender && 'border-destructive')}>
                <SelectValue placeholder={language === 'th' ? 'เลือกเพศ...' : language === 'zh' ? '选择性别...' : 'Select gender...'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">{language === 'th' ? 'ชาย' : language === 'zh' ? '男' : 'Male'}</SelectItem>
                <SelectItem value="female">{language === 'th' ? 'หญิง' : language === 'zh' ? '女' : 'Female'}</SelectItem>
              </SelectContent>
            </Select>
            {errors.gender && <p className="text-sm text-destructive">{errors.gender}</p>}
          </div>

          {/* HSK specific: Mother Language & Years of Learning */}
          {isHSK && (
            <>
              {/* Mother Language */}
              <div className="space-y-2">
                <Label className={fontClass}>
                  {language === 'th' ? 'ภาษาแม่' : language === 'zh' ? '母语' : 'Mother Language'} <span className="text-destructive">*</span>
                </Label>
                <Input
                  value={formData.motherLanguage}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, motherLanguage: e.target.value }));
                    setErrors(prev => ({ ...prev, motherLanguage: '' }));
                  }}
                  placeholder={language === 'th' ? 'กรอกภาษาแม่' : language === 'zh' ? '输入母语' : 'Enter mother language'}
                  className={errors.motherLanguage ? 'border-destructive' : ''}
                />
                {errors.motherLanguage && <p className="text-sm text-destructive">{errors.motherLanguage}</p>}
              </div>

              {/* Years of Chinese Learning */}
              <div className="space-y-2">
                <Label className={fontClass}>
                  {language === 'th' ? 'จำนวนปีที่เรียนภาษาจีน' : language === 'zh' ? '学习中文年数' : 'Years of Chinese Learning'} <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.yearsOfLearning}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, yearsOfLearning: e.target.value }));
                    setErrors(prev => ({ ...prev, yearsOfLearning: '' }));
                  }}
                  placeholder={language === 'th' ? 'กรอกจำนวนปี' : language === 'zh' ? '输入年数' : 'Enter years'}
                  className={errors.yearsOfLearning ? 'border-destructive' : ''}
                />
                {errors.yearsOfLearning && <p className="text-sm text-destructive">{errors.yearsOfLearning}</p>}
              </div>
            </>
          )}

          {/* ID/Passport Photo Upload */}
          <div className="space-y-2">
            <Label className={fontClass}>
              {language === 'th' ? 'รูปถ่าย ID/Passport' : language === 'zh' ? 'ID/护照照片' : 'ID/Passport Photo'} <span className="text-destructive">*</span>
            </Label>
            {formData.photoPreview ? (
              <div className="relative w-32 h-32">
                <img
                  src={formData.photoPreview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg border"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={handleRemovePhoto}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 ${errors.photo ? 'border-destructive' : 'border-muted-foreground/25'}`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className={`text-sm text-muted-foreground ${fontClass}`}>
                    {t('exam.clickToUpload')}
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
              </label>
            )}
            {errors.photo && <p className="text-sm text-destructive">{errors.photo}</p>}
          </div>

          {/* Exam Option - Only show if deliveryPrice > 0 (HSK has delivery option) */}
          {exam.deliveryPrice > 0 && (
            <div className="space-y-3">
              <Label className={fontClass}>
                {t('exam.selectOption')}
              </Label>
              <RadioGroup
                value={formData.examOption}
                onValueChange={(value: 'examOnly' | 'examWithDelivery') => {
                  setFormData(prev => ({ ...prev, examOption: value }));
                }}
                className="space-y-3"
              >
                <div className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50 ${formData.examOption === 'examOnly' ? 'border-primary bg-primary/5' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="examOnly" id="examOnly" />
                    <Label htmlFor="examOnly" className={`cursor-pointer ${fontClass}`}>
                      {t('exam.examOnly')}
                    </Label>
                  </div>
                  <span className={`font-semibold ${fontClass}`}>
                    {formatCurrency(exam.examPrice)}
                  </span>
                </div>
                
                <div className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-muted/50 ${formData.examOption === 'examWithDelivery' ? 'border-primary bg-primary/5' : ''}`}>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="examWithDelivery" id="examWithDelivery" />
                    <Label htmlFor="examWithDelivery" className={`cursor-pointer ${fontClass}`}>
                      {t('exam.examWithDelivery')}
                    </Label>
                  </div>
                  <span className={`font-semibold ${fontClass}`}>
                    {formatCurrency(exam.examPrice + exam.deliveryPrice)}
                  </span>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Total */}
          <div className="p-4 bg-primary/10 rounded-lg">
            <div className="flex justify-between items-center">
              <span className={`font-medium ${fontClass}`}>
                {t('portal.total')}
              </span>
              <span className={`text-xl font-bold text-primary ${fontClass}`}>
                {formatCurrency(calculateTotal())}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleConfirm}>
            {t('portal.addToCart')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};