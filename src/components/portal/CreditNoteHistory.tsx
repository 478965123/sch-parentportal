import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowDownCircle, Calendar, User, Filter, Receipt, CheckCircle2, Clock, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { mockStudents } from "@/data/mockData";

export interface CreditNoteHistoryItem {
  id: string;
  student_id: number;
  studentName: string;
  amount: number;
  description: string;
  issued_at: string;
  type: 'used' | 'refund' | 'overpayment' | 'cancellation';
  status: 'active' | 'used' | 'expired';
  academicYear: string;
  usedAmount?: number;
  appliedToInvoice?: string;
  appliedAt?: string;
}

interface CreditNoteHistoryProps {
  creditNotes: CreditNoteHistoryItem[];
}

export const CreditNoteHistory = ({ creditNotes }: CreditNoteHistoryProps) => {
  const { language, formatCurrency, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedCreditType, setSelectedCreditType] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 5;

  const years = [...new Set(creditNotes.map(cn => cn.academicYear))].sort((a, b) => b.localeCompare(a));
  const students = mockStudents;

  const filteredCreditNotes = creditNotes.filter(cn => {
    const matchesSearch = searchQuery === '' ||
      cn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cn.appliedToInvoice || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear = selectedYear === 'all' || cn.academicYear === selectedYear;
    const matchesStatus = selectedStatus === 'all' || (selectedStatus === 'active' && cn.status === 'active') || (selectedStatus === 'applied' && cn.status === 'used');
    const matchesType = selectedCreditType === 'all' || cn.type === selectedCreditType;
    const matchesStudent = selectedStudent === 'all' || cn.student_id.toString() === selectedStudent;
    return matchesSearch && matchesYear && matchesStatus && matchesType && matchesStudent;
  });

  const resetPage = () => setCurrentPage(1);

  const totalPages = Math.max(1, Math.ceil(filteredCreditNotes.length / PAGE_SIZE));
  const pagedCreditNotes = filteredCreditNotes.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const availableCredit = filteredCreditNotes
    .filter(cn => cn.status === 'active')
    .reduce((sum, cn) => sum + (cn.amount - (cn.usedAmount || 0)), 0);

  const fontClass = language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'th' ? 'th-TH' : language === 'zh' ? 'zh-CN' : 'en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'used': return language === 'th' ? 'ใช้งาน' : 'Used';
      case 'refund': return t('creditNote.typeRefund');
      case 'overpayment': return t('creditNote.typeOverpayment');
      case 'cancellation': return t('creditNote.typeCancellation');
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'used': return 'bg-gray-500/10 text-gray-600 border-gray-500/30';
      case 'refund': return 'bg-blue-500/10 text-blue-600 border-blue-500/30';
      case 'overpayment': return 'bg-orange-500/10 text-orange-600 border-orange-500/30';
      case 'cancellation': return 'bg-red-500/10 text-red-600 border-red-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const remaining = (cn: CreditNoteHistoryItem) => cn.amount - (cn.usedAmount || 0);

  const activeNotes = filteredCreditNotes.filter(cn => cn.status === 'active');
  const appliedNotes = filteredCreditNotes.filter(cn => cn.status === 'used');

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <CardTitle className={`text-sm font-medium ${fontClass}`}>
              {t('creditNote.filters')}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('creditNote.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); resetPage(); }}
              className={`pl-10 ${fontClass}`}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Select value={selectedYear} onValueChange={(v) => { setSelectedYear(v); resetPage(); }}>
              <SelectTrigger className={fontClass}>
                <SelectValue placeholder={t('creditNote.academicYear')} />
              </SelectTrigger>
              <SelectContent className="bg-background border">
                <SelectItem value="all">{t('creditNote.allYears')}</SelectItem>
                {years.map(year => <SelectItem key={year} value={year}>{year}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={(v) => { setSelectedStatus(v); resetPage(); }}>
              <SelectTrigger className={fontClass}>
                <SelectValue placeholder={language === 'th' ? 'สถานะ' : 'Status'} />
              </SelectTrigger>
              <SelectContent className="bg-background border">
                <SelectItem value="all">{language === 'th' ? 'สถานะทั้งหมด' : 'All Status'}</SelectItem>
                <SelectItem value="active">{t('creditNote.active')}</SelectItem>
                <SelectItem value="applied">{t('creditNote.used')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCreditType} onValueChange={(v) => { setSelectedCreditType(v); resetPage(); }}>
              <SelectTrigger className={fontClass}>
                <SelectValue placeholder={t('creditNote.type')} />
              </SelectTrigger>
              <SelectContent className="bg-background border">
                <SelectItem value="all">{language === 'th' ? 'ประเภททั้งหมด' : 'All Types'}</SelectItem>
                <SelectItem value="used">{language === 'th' ? 'ใช้งาน' : 'Used'}</SelectItem>
                <SelectItem value="refund">{t('creditNote.typeRefund')}</SelectItem>
                <SelectItem value="overpayment">{t('creditNote.typeOverpayment')}</SelectItem>
                <SelectItem value="cancellation">{t('creditNote.typeCancellation')}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStudent} onValueChange={(v) => { setSelectedStudent(v); resetPage(); }}>
              <SelectTrigger className={fontClass}>
                <SelectValue placeholder={t('portal.allStudents')} />
              </SelectTrigger>
              <SelectContent className="bg-background border">
                <SelectItem value="all">{t('portal.allStudents')}</SelectItem>
                {students.map(s => (
                  <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Available Credit Summary */}
      <Card className="border-emerald-500/30 bg-emerald-500/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-emerald-500/20">
                <ArrowDownCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className={`text-sm text-muted-foreground ${fontClass}`}>
                  {t('creditNote.availableCredit')}
                </p>
                <p className={`text-2xl font-bold text-emerald-600 ${fontClass}`}>
                  {formatCurrency(availableCredit)}
                </p>
              </div>
            </div>
            <p className={`text-sm text-muted-foreground ${fontClass}`}>
              {filteredCreditNotes.filter(cn => cn.status === 'active').length} {language === 'th' ? 'ใบที่ใช้ได้' : 'active notes'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Credit Note List - Grouped by Status */}
      {filteredCreditNotes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <ArrowDownCircle className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-30" />
            <p className={`text-muted-foreground ${fontClass}`}>{t('creditNote.noResults')}</p>
          </CardContent>
        </Card>
      ) : (
        <Accordion type="multiple" defaultValue={["active", "applied"]} className="w-full space-y-2">
          {/* Active Section — no type badge */}
          {activeNotes.length > 0 && (
            <AccordionItem value="active" className="border rounded-lg">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center justify-between w-full pr-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <span className={fontClass}>{t('creditNote.active')}</span>
                    <Badge variant="secondary" className="text-xs">{activeNotes.length}</Badge>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
                    {formatCurrency(activeNotes.reduce((sum, cn) => sum + (cn.amount - (cn.usedAmount || 0)), 0))}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-3">
                  {activeNotes.map((cn) => (
                    <CreditNoteCard key={cn.id} cn={cn} fontClass={fontClass} language={language} formatCurrency={formatCurrency} formatDate={formatDate} getTypeLabel={getTypeLabel} getTypeColor={getTypeColor} remaining={remaining} t={t} showTypeBadge={false} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Applied Section — with type badge */}
          {appliedNotes.length > 0 && (
            <AccordionItem value="applied" className="border rounded-lg">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center justify-between w-full pr-2">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <span className={fontClass}>{t('creditNote.used')}</span>
                    <Badge variant="secondary" className="text-xs">{appliedNotes.length}</Badge>
                  </div>
                  <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30">
                    {formatCurrency(appliedNotes.reduce((sum, cn) => sum + cn.amount, 0))}
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-3">
                  {appliedNotes.map((cn) => (
                    <CreditNoteCard key={cn.id} cn={cn} fontClass={fontClass} language={language} formatCurrency={formatCurrency} formatDate={formatDate} getTypeLabel={getTypeLabel} getTypeColor={getTypeColor} remaining={remaining} t={t} showTypeBadge={true} />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      )}
    </div>
  );
};

const CreditNoteCard = ({ cn, fontClass, language, formatCurrency, formatDate, getTypeLabel, getTypeColor, remaining, t, showTypeBadge = true }: {
  cn: CreditNoteHistoryItem;
  fontClass: string;
  language: string;
  formatCurrency: (n: number) => string;
  formatDate: (s: string) => string;
  getTypeLabel: (t: string) => string;
  getTypeColor: (t: string) => string;
  remaining: (cn: CreditNoteHistoryItem) => number;
  t: (key: string) => string;
  showTypeBadge?: boolean;
}) => (
  <Card className={`overflow-hidden border ${cn.status === 'active' ? 'border-emerald-500/20' : 'border-border'}`}>
    <div className={`px-4 py-2 flex items-center justify-between ${cn.status === 'active' ? 'bg-emerald-500/5' : 'bg-muted/40'}`}>
      <div className="flex items-center gap-2">
        <span className={`font-mono text-sm font-semibold ${cn.status === 'active' ? 'text-emerald-700' : 'text-muted-foreground'}`}>
          {cn.id}
        </span>
        {showTypeBadge && (
          <Badge className={`text-xs ${getTypeColor(cn.type)}`}>
            {getTypeLabel(cn.type)}
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <User className="h-3 w-3" />
        <span className={fontClass}>{cn.studentName}</span>
      </div>
    </div>
    <CardContent className="p-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex-1 space-y-1">
          <p className={`font-medium ${fontClass}`}>{cn.description}</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span className={fontClass}>
              {language === 'th' ? 'ออกเมื่อ' : 'Issued'}: {formatDate(cn.issued_at)}
            </span>
          </div>
          {cn.status === 'used' && cn.appliedToInvoice && (
            <div className="flex items-center gap-1.5 mt-2 text-xs bg-amber-500/5 border border-amber-500/20 rounded-md px-2.5 py-1.5 w-fit">
              <Receipt className="h-3 w-3 text-amber-600 flex-shrink-0" />
              <span className={`text-amber-700 ${fontClass}`}>
                {language === 'th' ? 'หักจากใบแจ้งหนี้' : 'Applied to invoice'}:&nbsp;
              </span>
              <span className="font-mono font-semibold text-amber-700">{cn.appliedToInvoice}</span>
              {cn.appliedAt && (
                <span className={`text-amber-600/70 ${fontClass}`}>· {formatDate(cn.appliedAt)}</span>
              )}
            </div>
          )}
        </div>
        <div className="sm:text-right flex-shrink-0 space-y-1 min-w-[160px]">
          <div className="flex sm:justify-end items-center gap-2">
            <span className={`text-xs text-muted-foreground ${fontClass}`}>
              {language === 'th' ? 'ยอดเต็ม' : 'Original'}
            </span>
            <span className={`font-semibold text-foreground ${fontClass}`}>
              {formatCurrency(cn.amount)}
            </span>
          </div>
          {(cn.usedAmount || 0) > 0 && (
            <div className="flex sm:justify-end items-center gap-2">
              <span className={`text-xs text-muted-foreground ${fontClass}`}>
                {language === 'th' ? 'หักแล้ว' : 'Applied'}
              </span>
              <span className={`font-medium text-amber-600 ${fontClass}`}>
                -{formatCurrency(cn.usedAmount!)}
              </span>
            </div>
          )}
          <div className={`border-t pt-1 flex sm:justify-end items-center gap-2 ${(cn.usedAmount || 0) > 0 ? '' : 'hidden'}`}>
            <span className={`text-xs font-medium ${fontClass}`}>
              {language === 'th' ? 'คงเหลือ' : 'Balance'}
            </span>
            <span className={`font-bold text-lg ${remaining(cn) > 0 ? 'text-emerald-600' : 'text-muted-foreground'} ${fontClass}`}>
              {formatCurrency(remaining(cn))}
            </span>
          </div>
          {cn.status === 'active' && (cn.usedAmount || 0) === 0 && (
            <p className={`font-bold text-xl text-emerald-600 ${fontClass}`}>
              {formatCurrency(cn.amount)}
            </p>
          )}
        </div>
      </div>
    </CardContent>
  </Card>
);
