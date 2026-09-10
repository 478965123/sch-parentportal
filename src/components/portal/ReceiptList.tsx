import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Download, Receipt, CreditCard, DollarSign, FileText, Calendar, Filter, Search, User, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface UsedCreditNote {
  id: string;
  amount: number;
  appliedTo: string;
  used_at: string;
}

interface Receipt {
  id: string;
  invoice_id: string;
  student_id: number;
  studentName: string;
  year: string;
  amount: number;
  payment_method: 'credit_card' | 'bank_transfer' | 'credit_note' | 'cash';
  paid_at: string;
  receipt_url: string;
  status: 'completed' | 'processing' | 'failed';
  description: string;
  reference_number: string;
  type?: 'tuition' | 'eca' | 'trip' | 'exam' | 'schoolbus';
  usedCreditNotes?: UsedCreditNote[];
}

interface ReceiptListProps {
  receipts: Receipt[];
  onDownload?: (receiptId: string) => void;
}

export const ReceiptList = ({ receipts, onDownload }: ReceiptListProps) => {
  const { language, formatCurrency, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<Date | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 5;

  const students = receipts
    .reduce<{ id: number; name: string }[]>((acc, r) => {
      if (!acc.some(s => s.id === r.student_id)) acc.push({ id: r.student_id, name: r.studentName });
      return acc;
    }, [])
    .sort((a, b) => a.name.localeCompare(b.name));

  const fontClass = language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato';

  const typeConfig: Record<string, { label: string; color: string }> = {
    tuition:   { label: language === 'th' ? 'ค่าเทอม' : 'Tuition',        color: 'bg-blue-500/10 text-blue-700 border-blue-200' },
    eca:       { label: 'ECA',                                              color: 'bg-purple-500/10 text-purple-700 border-purple-200' },
    trip:      { label: language === 'th' ? 'ทริปและกิจกรรม' : 'Trip & Activity', color: 'bg-green-500/10 text-green-700 border-green-200' },
    exam:      { label: language === 'th' ? 'สอบ' : 'Exam',               color: 'bg-pink-500/10 text-pink-700 border-pink-200' },
    schoolbus: { label: language === 'th' ? 'รถรับส่ง' : 'School Bus',    color: 'bg-slate-500/10 text-slate-700 border-slate-200' },
  };

  const paymentConfig = {
    credit_card:   { label: t('payment.creditCard'),   icon: CreditCard, color: 'bg-blue-500/10 text-blue-700 border-blue-200' },
    bank_transfer: { label: t('payment.bankTransfer'), icon: DollarSign, color: 'bg-emerald-500/10 text-emerald-700 border-emerald-200' },
    credit_note:   { label: t('payment.creditNote'),   icon: FileText,   color: 'bg-amber-500/10 text-amber-700 border-amber-200' },
    cash:          { label: t('payment.cash'),         icon: DollarSign, color: 'bg-gray-500/10 text-gray-700 border-gray-200' },
  };

  const resetPage = () => setCurrentPage(1);

  const filteredReceipts = receipts.filter(r => {
    const matchSearch = searchQuery === '' ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.reference_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.invoice_id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStudent = selectedStudent === 'all' || r.student_id.toString() === selectedStudent;
    const matchType = selectedType === 'all' || r.type === selectedType;
    const matchMonth = !selectedMonth ||
      (new Date(r.paid_at).getMonth() === selectedMonth.getMonth() &&
       new Date(r.paid_at).getFullYear() === selectedMonth.getFullYear());
    return matchSearch && matchStudent && matchType && matchMonth;
  });

  const totalPages = Math.max(1, Math.ceil(filteredReceipts.length / PAGE_SIZE));
  const pagedReceipts = filteredReceipts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const formatDate = (d: string) => new Date(d).toLocaleDateString(
    language === 'th' ? 'th-TH' : language === 'zh' ? 'zh-CN' : 'en-GB',
    { day: 'numeric', month: 'short', year: 'numeric' }
  );

  const totalCreditUsed = (r: Receipt) =>
    (r.usedCreditNotes || []).reduce((s, cn) => s + cn.amount, 0);

  const originalAmount = (r: Receipt) => r.amount + totalCreditUsed(r);

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
              placeholder={language === 'th' ? 'ค้นหาใบเสร็จ (ชื่อ, เลขอ้างอิง...)' : 'Search receipts (name, ref no...)'}
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); resetPage(); }}
              className={`pl-10 ${fontClass}`}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Month */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn("justify-start text-left font-normal", !selectedMonth && "text-muted-foreground", fontClass)}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {selectedMonth ? format(selectedMonth, "MMM yyyy") : t('receipt.pickMonth')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-background z-50" align="start">
                <CalendarComponent
                  mode="single"
                  selected={selectedMonth}
                  onSelect={(d) => { setSelectedMonth(d); resetPage(); }}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
                {selectedMonth && (
                  <div className="p-2 border-t">
                    <Button variant="ghost" size="sm" className="w-full" onClick={() => { setSelectedMonth(undefined); resetPage(); }}>
                      {t('receipt.clearMonth')}
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>

            {/* Student */}
            <Select value={selectedStudent} onValueChange={(v) => { setSelectedStudent(v); resetPage(); }}>
              <SelectTrigger className={fontClass}>
                <SelectValue placeholder={t('receipt.allStudents')} />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                <SelectItem value="all">{t('receipt.allStudents')}</SelectItem>
                {students.map(s => (
                  <SelectItem key={s.id} value={s.id.toString()}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Type */}
            <Select value={selectedType} onValueChange={(v) => { setSelectedType(v); resetPage(); }}>
              <SelectTrigger className={fontClass}>
                <SelectValue placeholder={t('receipt.allTypes')} />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                <SelectItem value="all">{t('receipt.allTypes')}</SelectItem>
                <SelectItem value="tuition">{language === 'th' ? 'ค่าเทอม' : 'Tuition'}</SelectItem>
                <SelectItem value="eca">ECA</SelectItem>
                <SelectItem value="trip">{language === 'th' ? 'ทริปและกิจกรรม' : 'Trip & Activity'}</SelectItem>

                <SelectItem value="exam">{language === 'th' ? 'สอบ' : 'Exam'}</SelectItem>
                <SelectItem value="schoolbus">{language === 'th' ? 'รถรับส่ง' : 'School Bus'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Count */}
      <div className={`text-sm text-muted-foreground ${fontClass}`}>
        {t('receipt.showing')} {filteredReceipts.length} {t('receipt.of')} {receipts.length}
      </div>

      {/* List */}
      {filteredReceipts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-30" />
            <p className={`text-muted-foreground ${fontClass}`}>{t('portal.noReceipts')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {pagedReceipts.map((receipt) => {
            const PaymentIcon = paymentConfig[receipt.payment_method].icon;
            const hasCreditNotes = (receipt.usedCreditNotes || []).length > 0;
            const creditTotal = totalCreditUsed(receipt);
            const origAmt = originalAmount(receipt);

            return (
              <Card key={receipt.id} className="overflow-hidden">
                {/* Header strip */}
                <div className="px-4 py-2 bg-muted/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-sm font-semibold text-muted-foreground`}>
                      {receipt.reference_number}
                    </span>
                    {receipt.invoice_id && (
                      <span className={`text-xs text-muted-foreground/70 ${fontClass}`}>
                        · {language === 'th' ? 'ใบแจ้งหนี้' : 'Invoice'}: <span className="font-mono">{receipt.invoice_id}</span>
                      </span>
                    )}
                    {receipt.type && (
                      <Badge className={`text-xs ${typeConfig[receipt.type]?.color}`}>
                        {typeConfig[receipt.type]?.label}
                      </Badge>
                    )}
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30 text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {language === 'th' ? 'ชำระแล้ว' : 'Paid'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span className={fontClass}>{receipt.studentName}</span>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    {/* Left: description + date + download */}
                    <div className="flex-1 space-y-2">
                      <p className={`font-semibold text-base ${fontClass}`}>{receipt.description}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span className={fontClass}>{formatDate(receipt.paid_at)}</span>
                      </div>

                      {/* Credit notes used */}
                      {hasCreditNotes && (
                        <div className="mt-3 space-y-1.5">
                          <p className={`text-xs font-medium text-muted-foreground ${fontClass}`}>
                            {language === 'th' ? 'เครดิตที่ใช้' : 'Refund / Credit applied'}
                          </p>
                          {receipt.usedCreditNotes!.map((cn) => (
                            <div key={cn.id} className="flex items-center gap-2 bg-amber-500/5 border border-amber-500/20 rounded-md px-2.5 py-1.5">
                              <FileText className="h-3 w-3 text-amber-600 flex-shrink-0" />
                              <span className={`font-mono text-xs font-semibold text-amber-700`}>{cn.id}</span>
                              <span className={`text-xs text-amber-600/70 ${fontClass}`}>
                                {language === 'th' ? 'หัก' : 'deducted'}
                              </span>
                              <span className={`text-xs font-bold text-amber-700 ml-auto ${fontClass}`}>
                                -{formatCurrency(cn.amount)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {receipt.status === 'completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className={`mt-2 gap-2 ${fontClass}`}
                          onClick={() => onDownload?.(receipt.id)}
                        >
                          <Download className="h-4 w-4" />
                          {t('portal.downloadReceipt')}
                        </Button>
                      )}
                    </div>

                    {/* Right: amount breakdown */}
                    <div className="sm:text-right flex-shrink-0 space-y-1 min-w-[170px]">
                      {hasCreditNotes && (
                        <>
                          <div className="flex sm:justify-end items-center gap-2">
                            <span className={`text-xs text-muted-foreground ${fontClass}`}>
                              {language === 'th' ? 'ยอดเต็ม' : 'Original'}
                            </span>
                            <span className={`text-sm text-muted-foreground ${fontClass}`}>
                              {formatCurrency(origAmt)}
                            </span>
                          </div>
                          <div className="flex sm:justify-end items-center gap-2">
                            <span className={`text-xs text-muted-foreground ${fontClass}`}>
                              {language === 'th' ? 'เครดิตที่ใช้' : 'Refund / Credit applied'}
                            </span>
                            <span className={`text-sm font-medium text-amber-600 ${fontClass}`}>
                              -{formatCurrency(creditTotal)}
                            </span>
                          </div>
                          <div className="border-t pt-1" />
                        </>
                      )}

                      <div className="flex sm:justify-end items-center gap-2">
                        <span className={`text-xs text-muted-foreground ${fontClass}`}>
                          {hasCreditNotes
                            ? (language === 'th' ? 'ชำระจริง' : 'Paid')
                            : (language === 'th' ? 'ยอดชำระ' : 'Amount paid')}
                        </span>
                        <span className={`font-bold text-xl text-foreground ${fontClass}`}>
                          {formatCurrency(receipt.amount)}
                        </span>
                      </div>

                      <div className="flex sm:justify-end mt-1">
                        <Badge className={`gap-1 text-xs ${paymentConfig[receipt.payment_method].color}`}>
                          <PaymentIcon className="h-3 w-3" />
                          <span className={fontClass}>{paymentConfig[receipt.payment_method].label}</span>
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                className={`gap-1.5 ${fontClass}`}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                {language === 'th' ? 'ก่อนหน้า' : 'Previous'}
              </Button>
              <span className={`text-sm text-muted-foreground ${fontClass}`}>
                {language === 'th'
                  ? `หน้า ${currentPage} / ${totalPages}`
                  : `Page ${currentPage} of ${totalPages}`}
              </span>
              <Button
                variant="outline"
                size="sm"
                className={`gap-1.5 ${fontClass}`}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                {language === 'th' ? 'ถัดไป' : 'Next'}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
