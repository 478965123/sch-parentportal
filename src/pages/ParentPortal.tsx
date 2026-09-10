import { useState, useMemo, useEffect, useRef } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { PortalHeader } from "@/components/portal/PortalHeader";
import { SummaryBox } from "@/components/portal/SummaryBox";
import { InvoiceCard } from "@/components/portal/InvoiceCard";
import { TuitionCartSidebar } from "@/components/portal/TuitionCartSidebar";
import { TripCartItem } from "@/components/portal/TripCartSidebar";
import { ReceiptList } from "@/components/portal/ReceiptList";
import { StudentFilter } from "@/components/portal/StudentFilter";
import { CountdownTimer } from "@/components/portal/CountdownTimer";
import { MobileBottomNav } from "@/components/portal/MobileBottomNav";
import { MobileCartDrawer } from "@/components/portal/MobileCartDrawer";
import { MobileFilterSection } from "@/components/portal/MobileFilterSection";
import { MobileCardSkeleton, FilterSkeleton } from "@/components/portal/MobileCardSkeleton";
import { MobileSummaryCarousel, MobileSummaryCarouselSkeleton } from "@/components/portal/MobileSummaryCarousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  User,
  DollarSign,
  CreditCard,
  GraduationCap,
  Receipt,
  AlertCircle,
  ChevronDown,
  Search,
  FileText,
  Ticket,
  Bus,
  PartyPopper,
  ShoppingCart,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { mockStudents, getMockDataForStudent, mockInvoices, mockECAInvoices, mockTripInvoices, mockExamInvoices, mockSchoolBusInvoices, mockCreditNotes, mockReceipts, mandatoryCourses, mockEventActivitiesData, mockCreditNoteHistory, mockUpcomingDeadlines } from "@/data/mockData";
import { generateReceiptPDF } from "@/utils/pdfGenerator";
import { CreditNoteHistory } from "@/components/portal/CreditNoteHistory";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface ParentPortalProps {
  onLogout: () => void;
  onGoToCart: () => void;
  onGoToCheckout: (data: any) => void;
  onGoToTripCart: (items: TripCartItem[]) => void;
  cartItems: any[];
  onAddToCart: (item: any) => boolean;
  onRemoveFromCart: (itemId: string, studentId?: string) => void;
  isInCart: (itemId: string, studentId?: string) => boolean;
  showCountdown?: boolean;
  onCountdownExpired?: () => void;
  onCancelCountdown?: () => void;
  paidInvoiceIds?: string[];
}

export const ParentPortal = ({
  onLogout,
  onGoToCart,
  onGoToCheckout,
  onGoToTripCart,
  cartItems,
  onAddToCart,
  onRemoveFromCart,
  isInCart,
  showCountdown = false,
  onCountdownExpired,
  onCancelCountdown,
  paidInvoiceIds = []
}: ParentPortalProps) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tuition' | 'afterschool' | 'summer' | 'event' | 'schoolbus' | 'transaction'>('dashboard');
  const [transactionSubTab, setTransactionSubTab] = useState<'receipts' | 'creditNote'>('receipts');
  const [eventSubTab, setEventSubTab] = useState<'exam' | 'trip' | 'carnival'>('exam');
  const [selectedStudent, setSelectedStudent] = useState<string>(mockStudents[0]?.id.toString() || '1');
  const paymentPeriod: 'Termly' = 'Termly';
  const [showDeadlines, setShowDeadlines] = useState(false);
  const [showOverdueDialog, setShowOverdueDialog] = useState(false);

  // Search states for each tab
  const [searchAfterSchool, setSearchAfterSchool] = useState('');
  const [searchEvent, setSearchEvent] = useState('');
  const [searchExam, setSearchExam] = useState('');
  const [searchTrip, setSearchTrip] = useState('');
  const [filterDay, setFilterDay] = useState<string>("all");

  // Trip status management
  const [tripStatuses, setTripStatuses] = useState<Record<string, 'pending' | 'accepted' | 'declined' | 'paid'>>({});
  const [selectedDeadlineItems, setSelectedDeadlineItems] = useState<Set<string>>(new Set());

  // Trip cart items
  const [tripCartItems, setTripCartItems] = useState<TripCartItem[]>([]);

  // Mobile cart drawer state
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cartBounce, setCartBounce] = useState(false);
  const prevCartCountRef = useRef(cartItems.length);
  const isMobile = useIsMobile();

  // Reset upcoming deadlines when leaving dashboard tab
  useEffect(() => {
    if (activeTab !== 'dashboard') {
      setShowDeadlines(false);
    }
  }, [activeTab]);

  // Bounce animation when items are added to cart
  useEffect(() => {
    if (cartItems.length > prevCartCountRef.current) {
      setCartBounce(true);
      const timer = setTimeout(() => setCartBounce(false), 600);
      return () => clearTimeout(timer);
    }
    prevCartCountRef.current = cartItems.length;
  }, [cartItems.length]);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const { t, language, formatCurrency } = useLanguage();

  // Get current student info to determine if they're SISB or non-SISB
  const currentStudentInfo = mockStudents.find(s => s.id.toString() === selectedStudent) || mockStudents[0];
  const isSISBStudent = currentStudentInfo?.isSISB ?? true;

  // Count course items in cart (excluding tuition)
  const courseItemsCount = cartItems.filter(item => item.type === 'course' || item.type === 'activity' || item.type === 'event' || item.type === 'exam').length;

  // Initialize invoices state from mock data to allow status updates (Simulating a database)
  const [allInvoicesState, setAllInvoicesState] = useState(() => [
    ...mockInvoices,
    ...mockECAInvoices,
    ...mockTripInvoices,
    ...mockExamInvoices,
    ...mockSchoolBusInvoices
  ].map(inv => paidInvoiceIds.includes(inv.id) ? { ...inv, status: 'paid' as const } : inv));

  // Source of truth for all components
  const allInvoices = allInvoicesState;
  const allCreditNotes = mockCreditNotes;
  const allReceipts = mockReceipts;

  // Calculate statistics filtered by selected student
  const stats = {
    outstandingInvoices: allInvoices.filter(inv => (inv.status === 'pending' || inv.status === 'partial') && inv.student_id.toString() === selectedStudent).length,
    paidThisTerm: allInvoices.filter(inv => inv.status === 'paid' && inv.student_id.toString() === selectedStudent).length,
    creditBalance: allCreditNotes.filter(cn => cn.student_id.toString() === selectedStudent).reduce((sum, cn) => sum + cn.balance, 0),
    availableCourses: 15,
  };

  const creditNoteBreakdown = (() => {
    const cn = allCreditNotes.find(c => c.student_id.toString() === selectedStudent);
    if (!cn || !cn.items || cn.items.length === 0) return undefined;
    const overpaymentTotal = cn.items.filter(i => i.title.toLowerCase().includes('overpayment')).reduce((s, i) => s + i.amount, 0);
    const creditNoteTotal = cn.items.filter(i => !i.title.toLowerCase().includes('overpayment')).reduce((s, i) => s + i.amount, 0);
    const rows: { label: string; amount: string }[] = [];
    if (creditNoteTotal > 0) rows.push({ label: language === 'th' ? 'เงินคืน / เครดิตคงเหลือ' : 'Refund / Credit Balance', amount: formatCurrency(creditNoteTotal) });
    if (overpaymentTotal > 0) rows.push({ label: 'Overpayment', amount: formatCurrency(overpaymentTotal) });
    return rows.length > 0 ? rows : undefined;
  })();

  const outstandingInvoices = allInvoices.filter(inv =>
    (inv.status === 'pending' || inv.status === 'partial') &&
    inv.student_id.toString() === selectedStudent &&
    !cartItems.some(item => item.id === inv.id && item.studentId === inv.student_id.toString())
  );

  const outstandingAmount = outstandingInvoices.reduce((sum, inv) => sum + inv.amount_due, 0);

  const paidThisTerm = allReceipts
    .filter(rec => rec.status === 'completed' && rec.student_id.toString() === selectedStudent)
    .reduce((sum, rec) => sum + rec.amount, 0);

  const overdueInvoices = allInvoices.filter(inv =>
    inv.status === 'overdue' &&
    inv.student_id.toString() === selectedStudent &&
    !cartItems.some(item => item.id === inv.id && item.studentId === inv.student_id.toString())
  );

  const overdueCount = overdueInvoices.length;
  const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + inv.amount_due, 0);

  // Calculate individual unpaid counts for notification badges
  const categoryUnpaidCounts = useMemo(() => {
    const isUnpaidItem = (inv: any) =>
      (['pending', 'overdue', 'partial'].includes(inv.status) || (inv.status === 'pending' && new Date(inv.due_date) < new Date())) &&
      inv.student_id.toString() === selectedStudent &&
      !cartItems.some(item => item.id === inv.id && item.studentId === inv.student_id.toString());

    // Tuition: Show ALL items (Aggregated View)
    const tuition = allInvoices.filter(isUnpaidItem).length;

    const eca = allInvoices.filter(inv => isUnpaidItem(inv) && inv.id.startsWith('ECA-')).length;
    const trip = allInvoices.filter(inv => isUnpaidItem(inv) && inv.id.startsWith('TRIP-')).length;
    const exam = allInvoices.filter(inv => isUnpaidItem(inv) && inv.id.startsWith('EXAM-')).length;
    const schoolbus = allInvoices.filter(inv => isUnpaidItem(inv) && inv.id.startsWith('BUS-')).length;

    return {
      tuition,
      eca,
      trip,
      exam,
      schoolbus,
    };
  }, [selectedStudent, allInvoices, cartItems]);

  const unpaidInvoicesCount = allInvoices.filter(inv =>
    (['pending', 'overdue', 'partial'].includes(inv.status) || (inv.status === 'pending' && new Date(inv.due_date) < new Date())) &&
    inv.student_id.toString() === selectedStudent &&
    !cartItems.some(item => item.id === inv.id && item.studentId === inv.student_id.toString())
  ).length;

  // Helper function to group invoices by payment status and sort by due date (newest to oldest)
  const groupInvoicesByPaymentStatus = (invoices: any[]) => {
    const sortByDateDesc = (a: any, b: any) => new Date(b.due_date).getTime() - new Date(a.due_date).getTime();
    const sortOverdueFirst = (a: any, b: any) => {
      if (a.status === 'overdue' && b.status !== 'overdue') return -1;
      if (a.status !== 'overdue' && b.status === 'overdue') return 1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    };

    // Filter out items already in cart for the 'unpaid' view
    const unpaid = invoices
      .filter(inv =>
        (['pending', 'overdue', 'partial'].includes(inv.status) || (inv.status === 'pending' && new Date(inv.due_date) < new Date())) &&
        !cartItems.some(item => item.id === inv.id && item.studentId === inv.student_id.toString())
      )
      .sort(sortOverdueFirst);

    const paid = invoices
      .filter(inv => inv.status === 'paid')
      .sort(sortByDateDesc);

    const unpaidTotal = unpaid.reduce((sum, inv) => sum + inv.amount_due, 0);
    const paidTotal = paid.reduce((sum, inv) => sum + inv.amount_due, 0);
    return { unpaid, paid, unpaidTotal, paidTotal };
  };

  const handleAddToCart = (itemId: string, type: 'course' | 'activity' | 'event' | 'exam' | 'tuition' | 'eca' | 'trip' | 'schoolbus', studentId?: string) => {
    let item: any;
    let studentInfo: { studentId?: string; studentName?: string } = {};

    if (type === 'tuition') {
      const invoice = mockInvoices.find(inv => inv.id === itemId);
      if (!invoice) return;

      // Find student info for tuition
      const student = mockStudents.find(s => s.id === invoice.student_id);
      if (student) {
        studentInfo = { studentId: student.id.toString(), studentName: student.name };
      }

      item = {
        id: itemId,
        name: invoice.description,
        price: invoice.amount_due,
        type,
        ...studentInfo
      };
    } else if (type === 'eca') {
      const invoice = mockECAInvoices.find(inv => inv.id === itemId);
      if (!invoice) return;

      const student = mockStudents.find(s => s.id === invoice.student_id);
      if (student) {
        studentInfo = { studentId: student.id.toString(), studentName: student.name };
      }

      item = {
        id: itemId,
        name: invoice.description,
        price: invoice.amount_due,
        type,
        ...studentInfo
      };
    } else if (type === 'trip') {
      const invoice = mockTripInvoices.find(inv => inv.id === itemId);
      if (!invoice) return;

      const student = mockStudents.find(s => s.id === invoice.student_id);
      if (student) {
        studentInfo = { studentId: student.id.toString(), studentName: student.name };
      }

      item = {
        id: itemId,
        name: invoice.description,
        price: invoice.amount_due,
        type,
        ...studentInfo
      };
    } else if (type === 'schoolbus') {
      const invoice = mockSchoolBusInvoices.find(inv => inv.id === itemId);
      if (!invoice) return;

      const student = mockStudents.find(s => s.id === invoice.student_id);
      if (student) {
        studentInfo = { studentId: student.id.toString(), studentName: student.name };
      }

      item = {
        id: itemId,
        name: invoice.description,
        price: invoice.amount_due,
        type,
        ...studentInfo
      };
    } else if (type === 'exam') {
      const invoice = mockExamInvoices.find(inv => inv.id === itemId);
      if (!invoice) return;

      const student = mockStudents.find(s => s.id === invoice.student_id);
      if (student) {
        studentInfo = { studentId: student.id.toString(), studentName: student.name };
      }

      item = {
        id: itemId,
        name: invoice.description,
        price: invoice.amount_due,
        type,
        ...studentInfo
      };
    } else {
      const studentData = getMockDataForStudent(parseInt(studentId || selectedStudent));

      // Check if it's from courses (after-school) or events
      let course = studentData.courses.find((c: any) => c.id === itemId);
      let category = 'after-school';

      if (!course) {
        course = studentData.eventActivities.find((c: any) => c.id === itemId);
        category = 'event';
      }

      if (!course) return;

      // Find student info for courses
      const currentStudent = mockStudents.find(s => s.id.toString() === studentId);
      if (currentStudent) {
        studentInfo = { studentId: currentStudent.id.toString(), studentName: currentStudent.name };
      }

      item = {
        id: itemId,
        name: course.name,
        price: course.price,
        type,
        category,
        ...studentInfo
      };
    }

    const success = onAddToCart(item);
    if (success) {
      toast({
        title: `${item.name} ${t('portal.addedToCart')}`,
        description: `${item.studentName || ''} - ${type === 'exam' ? t('exam.registered') : t('portal.courseSelected')}`,
        duration: 2000,
      });
    }
  };

  const handleStudentChange = (student: typeof mockStudents[0]) => {
    setSelectedStudent(student.id.toString());
  };

  const handleRemoveFromCart = (itemId: string, studentId?: string) => {
    onRemoveFromCart(itemId, studentId);
  };

  const handleClearAllCart = (type: 'course' | 'activity' | 'event' | 'exam') => {
    const itemsToClear = cartItems.filter(item => item.type === type);
    itemsToClear.forEach(item => {
      onRemoveFromCart(item.id, item.studentId);
    });
    toast({
      title: language === 'th' ? 'ล้างรายการสำเร็จ' : 'Cart Cleared',
      description: language === 'th' ? 'ลบรายการทั้งหมดออกจากตะกร้าแล้ว' : 'All items removed from cart',
    });
  };

  const handleGoToCart = () => {
    if (cartItems.length === 0) return;
    onGoToCart();
  };

  const handleDownloadReceipt = (receiptId: string) => {
    try {
      const receipt = allReceipts.find(r => r.id === receiptId);
      if (!receipt) {
        toast({
          title: language === 'th' ? 'ไม่พบใบเสร็จ' : 'Receipt Not Found',
          description: language === 'th' ? 'ไม่พบใบเสร็จที่ต้องการดาวน์โหลด' : 'The requested receipt could not be found',
          variant: 'destructive',
        });
        return;
      }

      if (receipt.status !== 'completed') {
        toast({
          title: language === 'th' ? 'ไม่สามารถดาวน์โหลดได้' : 'Cannot Download',
          description: language === 'th' ? 'สามารถดาวน์โหลดได้เฉพาะใบเสร็จที่ชำระเงินสำเร็จแล้วเท่านั้น' : 'Only completed receipts can be downloaded',
          variant: 'destructive',
        });
        return;
      }

      generateReceiptPDF(receipt, language);

      toast({
        title: language === 'th' ? 'ดาวน์โหลดสำเร็จ' : language === 'zh' ? '下载成功' : 'Download Successful',
        description: language === 'th' ? 'ดาวน์โหลดใบเสร็จ PDF เรียบร้อยแล้ว' : language === 'zh' ? '收据 PDF 已下载' : 'Receipt PDF has been downloaded successfully',
      });
    } catch (error) {
      console.error('Error downloading receipt:', error);
      toast({
        title: language === 'th' ? 'เกิดข้อผิดพลาด' : language === 'zh' ? '错误' : 'Error',
        description: language === 'th' ? 'ไม่สามารถดาวน์โหลดใบเสร็จได้ กรุณาลองใหม่อีกครั้ง' : language === 'zh' ? '无法下载收据，请重试' : 'Unable to download receipt. Please try again',
        variant: 'destructive',
      });
    }
  };

  // Filter functions for search
  const filterCourses = (courses: any[], searchQuery: string) => {
    if (!searchQuery.trim()) return courses;
    const query = searchQuery.toLowerCase();
    return courses.filter(course =>
      course.name.toLowerCase().includes(query) ||
      course.description?.toLowerCase().includes(query) ||
      course.vendor?.toLowerCase().includes(query)
    );
  };

  // Convert courses to calendar format
  const calendarCourses = useMemo(() => {
    const allCourses: any[] = [];

    mockStudents.forEach(student => {
      const studentData = getMockDataForStudent(student.id);

      [...studentData.courses, ...studentData.eventActivities].forEach(course => {
        // Parse schedule to extract days and times
        const scheduleMatch = course.schedule.match(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun).*?(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);

        if (scheduleMatch) {
          const days = course.schedule.match(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/g) || [];
          const startHour = scheduleMatch[2];
          const startMin = scheduleMatch[3];
          const endHour = scheduleMatch[4];
          const endMin = scheduleMatch[5];

          days.forEach(day => {
            allCourses.push({
              id: `${course.id}-${day}`,
              originalCourseId: course.id,
              name: course.name,
              day: day,
              startTime: `${startHour.padStart(2, '0')}:${startMin}`,
              endTime: `${endHour.padStart(2, '0')}:${endMin}`,
              location: course.location,
              isInCart: isInCart(course.id, student.id.toString()),
              studentName: student.name,
              studentId: student.id.toString(),
              // Extended fields
              description: course.description,
              price: course.price,
              duration: course.duration,
              vendor: course.vendor,
              capacity: course.capacity,
              enrolled: course.enrolled,
            });
          });
        }
      });
    });

    return allCourses;
  }, [cartItems, isInCart]);

  // Convert mandatory courses to calendar format
  const calendarMandatoryCourses = useMemo(() => {
    const allMandatory: any[] = [];

    mandatoryCourses.forEach(course => {
      if (!course.schedule) return;

      const scheduleMatch = course.schedule.match(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun).*?(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);

      if (scheduleMatch) {
        const days = course.schedule.match(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/g) || [];
        const startHour = scheduleMatch[2];
        const startMin = scheduleMatch[3];
        const endHour = scheduleMatch[4];
        const endMin = scheduleMatch[5];

        days.forEach(day => {
          allMandatory.push({
            id: `${course.id}-${day}`,
            originalCourseId: course.id,
            name: course.name,
            day: day,
            startTime: `${startHour.padStart(2, '0')}:${startMin}`,
            endTime: `${endHour.padStart(2, '0')}:${endMin}`,
            location: course.location,
            isMandatory: true,
            studentName: course.studentName,
            studentId: course.studentId,
            description: course.description,
            price: course.price,
          });
        });
      }
    });

    return allMandatory;
  }, []);

  // Students list for calendar filter
  const calendarStudents = useMemo(() => {
    return mockStudents.map(s => ({
      id: s.id.toString(),
      name: s.name,
      avatar: s.avatar
    }));
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      <PortalHeader
        onLogout={onLogout}
        activeTab={activeTab}
        onTabChange={(tab: string) => setActiveTab(tab as 'dashboard' | 'tuition' | 'afterschool' | 'summer' | 'event' | 'schoolbus' | 'transaction')}
        cartItemCount={cartItems.length}
        cartItems={cartItems}
        onGoToCart={handleGoToCart}
        onRemoveItem={handleRemoveFromCart}
        showCountdown={showCountdown}
        onCountdownExpired={onCountdownExpired}
        onCancelCountdown={onCancelCountdown}
        additionalCourses={courseItemsCount}
        unpaidInvoicesCount={unpaidInvoicesCount}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Campus Overview Banner with Student Switcher */}
        <div className="mb-6 p-3 sm:p-4 bg-gradient-to-r from-primary/10 to-education-blue/5 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <User className="h-6 w-6 text-primary flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className={`text-lg sm:text-xl font-bold truncate ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                    John Smith
                  </h2>
                </div>

                {/* Student Switcher Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-auto p-0 hover:bg-transparent">
                      <div className="flex items-center gap-2">
                        <p className={`text-muted-foreground text-sm ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                          {language === 'th' ? 'ผู้ปกครอง: ' : language === 'zh' ? '家长：' : 'Parent: '}John Smith
                        </p>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[280px]">
                    <DropdownMenuLabel className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
                      {language === 'th' ? 'เลือกนักเรียน' : language === 'zh' ? '选择学生' : 'Select Student'}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {mockStudents.map((student, index) => {
                      const isSelected = student.id.toString() === selectedStudent;
                      return (
                        <DropdownMenuItem
                          key={student.id}
                          onSelect={() => handleStudentChange(student)}
                          className={`cursor-pointer ${isSelected ? 'bg-primary/10 border-l-2 border-primary' : 'hover:bg-accent'}`}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className={`font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                  {index + 1}. {student.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  {student.class}
                                </Badge>
                              </div>
                            </div>
                            {isSelected && (
                              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                            )}
                          </div>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>


        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'dashboard' | 'tuition' | 'afterschool' | 'summer' | 'event' | 'schoolbus' | 'transaction')} className="space-y-6">
          {/* Desktop Navigation - Tabs */}
          <TabsList className="hidden md:grid w-full gap-1 grid-cols-7">
            <TabsTrigger value="dashboard" className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
              <span className="hidden md:inline">{t('portal.dashboard')}</span>
            </TabsTrigger>
            <TabsTrigger value="tuition" className={cn(
              "relative",
              language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'
            )}>
              <span className="hidden md:inline">{t('portal.tuition')}</span>
              {unpaidInvoicesCount > 0 && (
                <Badge variant="destructive" className="ml-1 h-5 w-5 flex items-center justify-center p-0 text-xs shrink-0">
                  {unpaidInvoicesCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="afterschool" className={cn("relative", language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato')}>
              <span className="hidden md:inline">ECA</span>
              {categoryUnpaidCounts.eca > 0 && (
                <Badge variant="destructive" className="ml-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]">
                  {categoryUnpaidCounts.eca}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="summer" className={cn("relative", language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato')}>

              <span className="hidden md:inline">{language === 'th' ? 'ทริปและกิจกรรม' : language === 'zh' ? '旅行和活动' : 'Trip & Activity'}</span>
              {categoryUnpaidCounts.trip > 0 && (
                <Badge variant="destructive" className="ml-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]">
                  {categoryUnpaidCounts.trip}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="event" className={cn("relative", language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato')}>

              <span className="hidden md:inline">{language === 'th' ? 'สอบ' : language === 'zh' ? '考试' : 'Exam'}</span>
              {categoryUnpaidCounts.exam > 0 && (
                <Badge variant="destructive" className="ml-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]">
                  {categoryUnpaidCounts.exam}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="schoolbus" className={cn("relative", language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato')}>

              <span className="hidden md:inline">{language === 'th' ? 'รถรับส่ง' : language === 'zh' ? '校车' : 'School Bus'}</span>
              {categoryUnpaidCounts.schoolbus > 0 && (
                <Badge variant="destructive" className="ml-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]">
                  {categoryUnpaidCounts.schoolbus}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="transaction" className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>

              <span className="hidden md:inline">{t('portal.transactionHistory')}</span>
            </TabsTrigger>
          </TabsList>

          {/* Mobile Horizontal Scrollable Tabs */}
          <div className="md:hidden overflow-x-auto pb-2 -mx-4 px-4">
            <div className="flex gap-2 min-w-max">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'dashboard'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  } ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('tuition')}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                  activeTab === 'tuition'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                <span className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
                  {t('portal.tuition')}
                </span>
                {unpaidInvoicesCount > 0 && (
                  <Badge variant="destructive" className="ml-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]">
                    {unpaidInvoicesCount}
                  </Badge>
                )}
              </button>
              <button
                onClick={() => setActiveTab('afterschool')}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                  activeTab === 'afterschool'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80',
                  language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'
                )}
              >
                ECA
                {categoryUnpaidCounts.eca > 0 && (
                  <Badge variant="destructive" className="ml-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]">
                    {categoryUnpaidCounts.eca}
                  </Badge>
                )}
              </button>
              <button
                onClick={() => setActiveTab('summer')}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                  activeTab === 'summer'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80',
                  language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'
                )}
              >
                {language === 'th' ? 'ทริปและกิจกรรม' : language === 'zh' ? '旅行和活动' : 'Trip & Activity'}
                {categoryUnpaidCounts.trip > 0 && (
                  <Badge variant="destructive" className="ml-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]">
                    {categoryUnpaidCounts.trip}
                  </Badge>
                )}
              </button>
              <button
                onClick={() => setActiveTab('event')}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                  activeTab === 'event'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80',
                  language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'
                )}
              >
                {language === 'th' ? 'สอบ' : language === 'zh' ? '考试' : 'Exam'}
                {categoryUnpaidCounts.exam > 0 && (
                  <Badge variant="destructive" className="ml-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]">
                    {categoryUnpaidCounts.exam}
                  </Badge>
                )}
              </button>
              <button
                onClick={() => setActiveTab('schoolbus')}
                className={cn(
                  "relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                  activeTab === 'schoolbus'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80',
                  language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'
                )}
              >
                {language === 'th' ? 'รถรับส่ง' : language === 'zh' ? '校车' : 'School Bus'}
                {categoryUnpaidCounts.schoolbus > 0 && (
                  <Badge variant="destructive" className="ml-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]">
                    {categoryUnpaidCounts.schoolbus}
                  </Badge>
                )}
              </button>
              <button
                onClick={() => setActiveTab('transaction')}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeTab === 'transaction'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  } ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
              >
                {language === 'th' ? 'ประวัติ' : 'History'}
              </button>
            </div>
          </div>

          {/* Dashboard Tab - Combined data for all students with student tags */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Summary Stats - Mobile Swipeable Carousel or Desktop Grid */}
            {isMobile ? (
              isLoading ? (
                <MobileSummaryCarouselSkeleton />
              ) : (
                <MobileSummaryCarousel
                  cards={[
                    {
                      id: 'total-due',
                      title: language === 'th' ? 'รวมยอดใบแจ้งหนี้' : 'Total Invoiced',
                      value: formatCurrency(outstandingAmount),
                      subtitle: `${outstandingInvoices.length} ${language === 'th' ? 'ใบแจ้งหนี้' : language === 'zh' ? '张发票' : 'invoices'}`,
                      icon: DollarSign,
                      color: overdueCount > 0 ? 'destructive' : 'warning',
                      onClick: () => setShowDeadlines(prev => !prev),
                    },
                    {
                      id: 'overdue',
                      title: language === 'th' ? 'เกินกำหนดชำระ' : 'Overdue',
                      value: formatCurrency(overdueAmount),
                      subtitle: `${overdueCount} ${language === 'th' ? 'รายการ' : 'invoices'}`,
                      icon: AlertCircle,
                      color: 'destructive',
                      onClick: () => setShowOverdueDialog(true),
                    },
                    {
                      id: 'credit-note',
                      title: language === 'th' ? 'เงินคืน / เครดิตคงเหลือ' : 'Refund / Credit Balance',
                      value: formatCurrency(stats.creditBalance),
                      subtitle: '',
                      icon: Ticket,
                      color: 'info',
                      onClick: () => { setActiveTab('transaction'); setTransactionSubTab('creditNote'); },
                      breakdown: creditNoteBreakdown,
                    },
                    {
                      id: 'receipts',
                      title: language === 'th' ? 'ใบเสร็จรับเงิน' : 'View Receipts',
                      value: allReceipts.filter(r => r.student_id.toString() === selectedStudent).length.toString(),
                      subtitle: '',
                      icon: Receipt,
                      color: 'success',
                      onClick: () => { setActiveTab('transaction'); setTransactionSubTab('receipts'); }
                    }
                  ]}
                />
              )
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <SummaryBox
                  title={language === 'th' ? 'รวมยอดใบแจ้งหนี้' : language === 'zh' ? '总发票金额' : 'Total Invoiced'}
                  value={formatCurrency(outstandingAmount)}
                  subtitle={`${outstandingInvoices.length} ${language === 'th' ? 'ใบแจ้งหนี้' : language === 'zh' ? '张发票' : 'invoices'}`}
                  icon={FileText}
                  color="warning"
                  onClick={() => setShowDeadlines(prev => !prev)}
                />

                <SummaryBox
                  title={language === 'th' ? 'เกินกำหนดชำระ' : 'Overdue'}
                  value={formatCurrency(overdueAmount)}
                  subtitle={`${overdueCount} ${language === 'th' ? 'รายการ' : 'invoices'}`}
                  icon={AlertCircle}
                  color="destructive"
                  onClick={() => setShowOverdueDialog(true)}
                />

                <SummaryBox
                  title={language === 'th' ? 'เงินคืน / เครดิตคงเหลือ' : 'Refund / Credit Balance'}
                  value={formatCurrency(stats.creditBalance)}
                  subtitle=""
                  icon={Ticket}
                  color="info"
                  onClick={() => { setActiveTab('transaction'); setTransactionSubTab('creditNote'); }}
                  breakdown={creditNoteBreakdown}
                />

                <SummaryBox
                  title={language === 'th' ? 'ใบเสร็จรับเงิน' : 'View Receipts'}
                  value={allReceipts.filter(r => r.student_id.toString() === selectedStudent).length.toString()}
                  subtitle=""
                  icon={Receipt}
                  color="success"
                  onClick={() => { setActiveTab('transaction'); setTransactionSubTab('receipts'); }}
                />
              </div>
            )}

            {/* Upcoming Deadlines - Grouped by Type */}
            {showDeadlines && <Card>
              <Accordion type="single" collapsible defaultValue="deadlines">
                <AccordionItem value="deadlines" className="border-0">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline">
                    <div className="flex flex-col items-start gap-1">
                      <div className={`flex items-center gap-2 text-lg font-semibold ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        <AlertCircle className="h-5 w-5" />
                        {mockStudents.find(s => s.id.toString() === selectedStudent)?.name || t('portal.upcomingDeadlines')}
                      </div>
                      <span className={`text-sm text-muted-foreground font-normal ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {t('portal.importantDates')}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6">
                {(() => {
                  const getTypeIcon = (type: string) => {
                    switch (type) {
                      case 'tuition': return DollarSign;
                      case 'eca': return Clock;
                      case 'trip': return Bus;
                      case 'exam': return FileText;
                      case 'schoolbus': return Bus;
                      default: return Calendar;
                    }
                  };
                  const getTypeBadgeColor = (type: string) => {
                    switch (type) {
                      case 'tuition': return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300';
                      case 'eca': return 'bg-blue-500/20 text-blue-700 dark:text-blue-300';
                      case 'trip': return 'bg-green-500/20 text-green-700 dark:text-green-300';
                      case 'exam': return 'bg-purple-500/20 text-purple-700 dark:text-purple-300';
                      case 'schoolbus': return 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300';
                      default: return 'bg-muted text-muted-foreground';
                    }
                  };
                  const getTypeLabel = (type: string) => {
                    switch (type) {
                      case 'tuition': return language === 'th' ? 'ค่าเทอม' : language === 'zh' ? '学费' : 'Tuition';
                      case 'eca': return 'ECA';
                      case 'trip': return language === 'th' ? 'ทริป' : language === 'zh' ? '旅行' : 'Trip';
                      case 'exam': return language === 'th' ? 'สอบ' : language === 'zh' ? '考试' : 'Exam';
                      case 'schoolbus': return language === 'th' ? 'รถรับส่ง' : language === 'zh' ? '校车' : 'School Bus';
                      default: return type;
                    }
                  };
                  const handleDeadlineClick = (type: string) => {
                    switch (type) {
                      case 'tuition': setActiveTab('tuition'); break;
                      case 'eca': setActiveTab('afterschool'); break;
                      case 'trip': setActiveTab('summer'); break;
                      case 'exam': setActiveTab('event'); break;
                      case 'schoolbus': setActiveTab('schoolbus'); break;
                      default: break;
                    }
                  };

                  // Get real data from allInvoices source and map to deadline format
                  const realInvoicesForStudent = allInvoices.filter(inv =>
                    (inv.status === 'pending' || inv.status === 'partial') &&
                    inv.student_id.toString() === selectedStudent
                  );

                  const mappedDeadlines = realInvoicesForStudent.map(inv => {
                    // Determine category type based on ID prefix
                    let category = 'tuition';
                    if (inv.id.startsWith('ECA-')) category = 'eca';
                    else if (inv.id.startsWith('TRIP-')) category = 'trip';
                    else if (inv.id.startsWith('EXAM-')) category = 'exam';
                    else if (inv.id.startsWith('BUS-')) category = 'schoolbus';

                    const student = mockStudents.find(s => s.id === inv.student_id);

                    return {
                      id: inv.id,
                      title: inv.description,
                      dueDate: inv.due_date,
                      amount: inv.amount_due,
                      status: inv.status,
                      type: category,
                      studentId: inv.student_id,
                      studentName: student?.name || ''
                    };
                  });

                  const sortOldestFirst = (a: any, b: any) => {
                    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                  };

                  // Group by Tab perspective (Tuition shows all, others show specific)
                  const groupedDeadlines: Record<string, any[]> = {
                    tuition: mappedDeadlines.filter(d => d.type === 'tuition').sort(sortOldestFirst),
                    eca: mappedDeadlines.filter(d => d.type === 'eca').sort(sortOldestFirst),
                    trip: mappedDeadlines.filter(d => d.type === 'trip').sort(sortOldestFirst),
                    exam: mappedDeadlines.filter(d => d.type === 'exam').sort(sortOldestFirst),
                    schoolbus: mappedDeadlines.filter(d => d.type === 'schoolbus').sort(sortOldestFirst),
                  };

                  // Define type order: types with overdue items first, then by original order
                  const typeOrder = ['tuition', 'eca', 'trip', 'exam', 'schoolbus'];
                  const sortedTypes = typeOrder
                    .filter(type => groupedDeadlines[type]?.length > 0)
                    .sort((a, b) => {
                      const aHasOverdue = groupedDeadlines[a]?.some(d => d.status === 'overdue') ? 0 : 1;
                      const bHasOverdue = groupedDeadlines[b]?.some(d => d.status === 'overdue') ? 0 : 1;
                      return aHasOverdue - bHasOverdue;
                    });

                  if (mappedDeadlines.length === 0) {
                    return (
                      <div className="text-center py-8 text-muted-foreground">
                        <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
                          {language === 'th' ? 'ไม่มีรายการค้างชำระ' : 'No pending invoices'}
                        </p>
                      </div>
                    );
                  }

                  const allDeadlinesSorted = mappedDeadlines.slice().sort(sortOldestFirst);

                  const selectableDeadlines = allDeadlinesSorted.filter(d => !isInCart(d.id, d.studentId?.toString()));
                  const allSelected = selectableDeadlines.length > 0 && selectableDeadlines.every(d => selectedDeadlineItems.has(d.id));
                  const fontClass = language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato';

                  return (
                    <div className="space-y-4">
                    {selectableDeadlines.length > 0 && (
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={allSelected}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedDeadlineItems(new Set(selectableDeadlines.map(d => d.id)));
                              } else {
                                setSelectedDeadlineItems(new Set());
                              }
                            }}
                          />
                          <span className={`text-sm ${fontClass}`}>
                            {selectedDeadlineItems.size}/{selectableDeadlines.length} {language === 'th' ? 'รายการที่เลือก' : language === 'zh' ? '项已选' : 'items selected'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          {selectedDeadlineItems.size > 0 && (
                            <button
                              onClick={() => setSelectedDeadlineItems(new Set())}
                              className={`flex items-center gap-1 text-sm text-destructive hover:underline ${fontClass}`}
                            >
                              <span>×</span>
                              {language === 'th' ? 'ล้างทั้งหมด' : language === 'zh' ? '清除全部' : 'Clear All'}
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedDeadlineItems(new Set(selectableDeadlines.map(d => d.id)))}
                            className={`text-sm text-primary hover:underline font-medium ${fontClass}`}
                          >
                            {language === 'th' ? 'เลือกทั้งหมด' : language === 'zh' ? '全选' : 'Select All'}
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      {allDeadlinesSorted.map((deadline, index) => {
                        const alreadyInCart = isInCart(deadline.id, deadline.studentId?.toString());
                        const isSelected = selectedDeadlineItems.has(deadline.id);
                        const statusConfig = {
                          overdue: { label: 'Overdue', className: 'bg-red-100 text-red-700 border-red-200' },
                          partial: { label: 'Partial', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
                          pending: { label: 'Unpaid', className: 'bg-gray-100 text-gray-600 border-gray-200' },
                          paid: { label: 'Paid', className: 'bg-green-100 text-green-700 border-green-200' },
                        }[deadline.status] || { label: 'Unpaid', className: 'bg-gray-100 text-gray-600 border-gray-200' };
                        const fontClass = language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato';

                        return (
                          <div
                            key={deadline.id}
                            className={cn(
                              "flex items-start gap-3 p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted/70 transition-colors",
                              alreadyInCart && "opacity-50",
                              isMobile && "animate-stagger-in opacity-0"
                            )}
                            style={isMobile ? { animationDelay: `${index * 60}ms` } : undefined}
                            onClick={(e) => {
                              if (alreadyInCart) return;
                              setSelectedDeadlineItems(prev => {
                                const next = new Set(prev);
                                if (next.has(deadline.id)) next.delete(deadline.id);
                                else next.add(deadline.id);
                                return next;
                              });
                            }}
                          >
                            <Checkbox
                              checked={alreadyInCart || isSelected}
                              disabled={alreadyInCart}
                              onCheckedChange={() => {}}
                              className="shrink-0 mt-1"
                            />
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex items-center justify-between gap-2">
                                <p className={`font-semibold text-sm ${fontClass}`}>
                                  {deadline.title}
                                </p>
                                <div className="flex items-center gap-2 shrink-0">
                                  <Badge className={`text-xs border ${statusConfig.className}`}>
                                    {statusConfig.label}
                                  </Badge>
                                  <Badge variant="outline" className="shrink-0">
                                    {formatCurrency(deadline.amount)}
                                  </Badge>
                                </div>
                              </div>
                              <p className={`text-xs text-muted-foreground ${fontClass}`}>
                                Student: {deadline.studentName}
                              </p>
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Calendar className="h-3.5 w-3.5" />
                                <span className={fontClass}>
                                  {t('portal.due')}: {new Date(deadline.dueDate).toLocaleDateString(language === 'th' ? 'th-TH' : language === 'zh' ? 'zh-CN' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                                {deadline.status === 'overdue' && (
                                  <AlertTriangle className="h-3.5 w-3.5 text-red-500" />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {selectedDeadlineItems.size > 0 && (
                      <div className="mt-4 flex justify-end">
                        <Button
                          onClick={() => {
                            mappedDeadlines
                              .filter(d => selectedDeadlineItems.has(d.id))
                              .forEach(d => {
                                handleAddToCart(d.id, d.type as any, d.studentId?.toString());
                              });
                            setSelectedDeadlineItems(new Set());
                          }}
                          className="gap-2"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          {language === 'th' ? 'เพิ่มลงตะกร้า' : language === 'zh' ? '加入购物车' : 'Add to Cart'} ({selectedDeadlineItems.size})
                        </Button>
                      </div>
                    )}
                    </div>
                  );
                })()}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>}
          </TabsContent>

          {/* Tuition Tab - Split into 70% invoice list and 30% cart */}
          <TabsContent value="tuition" className="space-y-0">
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
              {/* Left 70% - Invoice List */}
              <div className="lg:col-span-7 space-y-4">
                {(() => {
                  const tuitionInvoices = allInvoices.filter(invoice =>
                    invoice.student_id.toString() === selectedStudent
                  );
                  const { unpaid, paid, unpaidTotal, paidTotal } = groupInvoicesByPaymentStatus(tuitionInvoices);

                  return (
                    <Accordion type="multiple" defaultValue={["unpaid"]} className="w-full space-y-2">
                      {/* Unpaid Section */}
                      <AccordionItem value="unpaid" className="border rounded-lg">
                        <AccordionTrigger className="px-4 hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-2">
                            <div className="flex items-center gap-3">
                              <AlertCircle className="h-5 w-5 text-warning-orange" />
                              <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                {t('invoice.unpaidInvoices')}
                              </span>
                              <Badge variant="secondary">{unpaid.length}</Badge>
                            </div>
                            <Badge className="bg-warning-orange/20 text-warning-orange hover:bg-warning-orange/30">
                              {formatCurrency(unpaidTotal)}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-4">
                            {unpaid.filter(invoice => !isInCart(invoice.id, invoice.student_id?.toString())).length > 0 ? (
                              unpaid.filter(invoice => !isInCart(invoice.id, invoice.student_id?.toString())).map(invoice => {
                                const student = mockStudents.find(s => s.id === invoice.student_id);
                                const creditNote = allCreditNotes.find(cn => cn.student_id === invoice.student_id);
                                return (
                                  <div key={invoice.id} className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                        {student?.name} - {student?.class}
                                      </Badge>
                                    </div>
                                    <InvoiceCard
                                      invoice={invoice}
                                      creditBalance={creditNote?.balance || 0}
                                      onAddToCart={(invoiceId) => {
                                        const type = invoiceId.startsWith('ECA-') ? 'eca' :
                                          invoiceId.startsWith('TRIP-') ? 'trip' :
                                            invoiceId.startsWith('EXAM-') ? 'exam' :
                                              invoiceId.startsWith('BUS-') ? 'schoolbus' : 'tuition';
                                        handleAddToCart(invoiceId, type);
                                      }}
                                      studentName={student?.name}
                                    />
                                  </div>
                                );
                              })
                            ) : (
                              <div className="text-center py-8">
                                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                                <p className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                  {t('invoice.noUnpaidInvoices')}
                                </p>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Paid Section */}
                      <AccordionItem value="paid" className="border rounded-lg">
                        <AccordionTrigger className="px-4 hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-2">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                {t('invoice.paidInvoices')}
                              </span>
                              <Badge variant="secondary">{paid.length}</Badge>
                            </div>
                            <Badge className="bg-green-500/20 text-green-600 hover:bg-green-500/30">
                              {formatCurrency(paidTotal)}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-4">
                            {paid.length > 0 ? (
                              paid.map(invoice => {
                                const student = mockStudents.find(s => s.id === invoice.student_id);
                                const creditNote = allCreditNotes.find(cn => cn.student_id === invoice.student_id);
                                return (
                                  <div key={invoice.id} className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                        {student?.name} - {student?.class}
                                      </Badge>
                                    </div>
                                    <InvoiceCard
                                      invoice={invoice}
                                      creditBalance={creditNote?.balance || 0}
                                      onAddToCart={(invoiceId) => {
                                        const type = invoiceId.startsWith('ECA-') ? 'eca' :
                                          invoiceId.startsWith('TRIP-') ? 'trip' :
                                            invoiceId.startsWith('EXAM-') ? 'exam' :
                                              invoiceId.startsWith('BUS-') ? 'schoolbus' : 'tuition';
                                        handleAddToCart(invoiceId, type);
                                      }}
                                      studentName={student?.name}
                                    />
                                  </div>
                                );
                              })
                            ) : (
                              <p className={`text-center text-muted-foreground py-4 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                {t('invoice.noPaidInvoices')}
                              </p>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  );
                })()}
              </div>

              {/* Right 30% - Tuition Cart Sidebar - Hidden on Mobile */}
              <div className="hidden lg:block lg:col-span-3">
                <TuitionCartSidebar
                  items={cartItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    studentName: item.studentName,
                    studentId: item.studentId
                  }))}
                  onRemoveItem={handleRemoveFromCart}
                  onCheckout={handleGoToCart}
                />
              </div>
            </div>
          </TabsContent>

          {/* After School Tab - ECA Invoices */}
          <TabsContent value="afterschool" className="space-y-0">
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
              {/* Left 70% - Invoice List */}
              <div className="lg:col-span-7 space-y-4">
                {(() => {
                  const ecaInvoices = allInvoices.filter(invoice =>
                    invoice.id.startsWith('ECA-') &&
                    invoice.student_id.toString() === selectedStudent
                  );
                  const { unpaid, paid, unpaidTotal, paidTotal } = groupInvoicesByPaymentStatus(ecaInvoices);

                  return (
                    <Accordion type="multiple" defaultValue={["unpaid"]} className="w-full space-y-2">
                      {/* Unpaid Section */}
                      <AccordionItem value="unpaid" className="border rounded-lg">
                        <AccordionTrigger className="px-4 hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-2">
                            <div className="flex items-center gap-3">
                              <AlertCircle className="h-5 w-5 text-warning-orange" />
                              <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                {t('invoice.unpaidInvoices')}
                              </span>
                              <Badge variant="secondary">{unpaid.length}</Badge>
                            </div>
                            <Badge className="bg-warning-orange/20 text-warning-orange hover:bg-warning-orange/30">
                              {formatCurrency(unpaidTotal)}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-4">
                            {unpaid.filter(invoice => !isInCart(invoice.id, invoice.student_id?.toString())).length > 0 ? (
                              unpaid.filter(invoice => !isInCart(invoice.id, invoice.student_id?.toString())).map(invoice => {
                                const student = mockStudents.find(s => s.id === invoice.student_id);
                                const creditNote = allCreditNotes.find(cn => cn.student_id === invoice.student_id);
                                return (
                                  <div key={invoice.id} className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                        {student?.name} - {student?.class}
                                      </Badge>
                                    </div>
                                    <InvoiceCard
                                      invoice={invoice}
                                      creditBalance={creditNote?.balance || 0}
                                      onAddToCart={(invoiceId) => handleAddToCart(invoiceId, 'eca')}
                                      studentName={student?.name}
                                    />
                                  </div>
                                );
                              })
                            ) : (
                              <div className="text-center py-8">
                                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                                <p className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                  {t('invoice.noUnpaidInvoices')}
                                </p>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Paid Section */}
                      <AccordionItem value="paid" className="border rounded-lg">
                        <AccordionTrigger className="px-4 hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-2">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                {t('invoice.paidInvoices')}
                              </span>
                              <Badge variant="secondary">{paid.length}</Badge>
                            </div>
                            <Badge className="bg-green-500/20 text-green-600 hover:bg-green-500/30">
                              {formatCurrency(paidTotal)}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-4">
                            {paid.length > 0 ? (
                              paid.map(invoice => {
                                const student = mockStudents.find(s => s.id === invoice.student_id);
                                const creditNote = allCreditNotes.find(cn => cn.student_id === invoice.student_id);
                                return (
                                  <div key={invoice.id} className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                        {student?.name} - {student?.class}
                                      </Badge>
                                    </div>
                                    <InvoiceCard
                                      invoice={invoice}
                                      creditBalance={creditNote?.balance || 0}
                                      onAddToCart={(invoiceId) => handleAddToCart(invoiceId, 'eca')}
                                      studentName={student?.name}
                                    />
                                  </div>
                                );
                              })
                            ) : (
                              <p className={`text-center text-muted-foreground py-4 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                {t('invoice.noPaidInvoices')}
                              </p>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  );
                })()}
              </div>

              {/* Right 30% - Cart Sidebar */}
              <div className="hidden lg:block lg:col-span-3">
                <TuitionCartSidebar
                  items={cartItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    studentName: item.studentName,
                    studentId: item.studentId
                  }))}
                  onRemoveItem={handleRemoveFromCart}
                  onCheckout={handleGoToCart}
                />
              </div>
            </div>
          </TabsContent>

          {/* Summer Activities Tab - Trip & Activity Invoices */}
          <TabsContent value="summer" className="space-y-0">
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
              {/* Left 70% - Invoice List */}
              <div className="lg:col-span-7 space-y-4">
                {(() => {
                  const tripInvoices = allInvoices.filter(invoice =>
                    invoice.id.startsWith('TRIP-') &&
                    invoice.student_id.toString() === selectedStudent
                  );
                  const { unpaid, paid, unpaidTotal, paidTotal } = groupInvoicesByPaymentStatus(tripInvoices);

                  return (
                    <Accordion type="multiple" defaultValue={["unpaid"]} className="w-full space-y-2">
                      {/* Unpaid Section */}
                      <AccordionItem value="unpaid" className="border rounded-lg">
                        <AccordionTrigger className="px-4 hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-2">
                            <div className="flex items-center gap-3">
                              <AlertCircle className="h-5 w-5 text-warning-orange" />
                              <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                {t('invoice.unpaidInvoices')}
                              </span>
                              <Badge variant="secondary">{unpaid.length}</Badge>
                            </div>
                            <Badge className="bg-warning-orange/20 text-warning-orange hover:bg-warning-orange/30">
                              {formatCurrency(unpaidTotal)}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-4">
                            {unpaid.filter(invoice => !isInCart(invoice.id, invoice.student_id?.toString())).length > 0 ? (
                              unpaid.filter(invoice => !isInCart(invoice.id, invoice.student_id?.toString())).map(invoice => {
                                const student = mockStudents.find(s => s.id === invoice.student_id);
                                const creditNote = allCreditNotes.find(cn => cn.student_id === invoice.student_id);
                                return (
                                  <div key={invoice.id} className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                        {student?.name} - {student?.class}
                                      </Badge>
                                    </div>
                                    <InvoiceCard
                                      invoice={invoice}
                                      creditBalance={creditNote?.balance || 0}
                                      onAddToCart={(invoiceId) => handleAddToCart(invoiceId, 'trip')}
                                      studentName={student?.name}
                                    />
                                  </div>
                                );
                              })
                            ) : (
                              <div className="text-center py-8">
                                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                                <p className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                  {t('invoice.noUnpaidInvoices')}
                                </p>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Paid Section */}
                      <AccordionItem value="paid" className="border rounded-lg">
                        <AccordionTrigger className="px-4 hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-2">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                {t('invoice.paidInvoices')}
                              </span>
                              <Badge variant="secondary">{paid.length}</Badge>
                            </div>
                            <Badge className="bg-green-500/20 text-green-600 hover:bg-green-500/30">
                              {formatCurrency(paidTotal)}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-4">
                            {paid.length > 0 ? (
                              paid.map(invoice => {
                                const student = mockStudents.find(s => s.id === invoice.student_id);
                                const creditNote = allCreditNotes.find(cn => cn.student_id === invoice.student_id);
                                return (
                                  <div key={invoice.id} className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                        {student?.name} - {student?.class}
                                      </Badge>
                                    </div>
                                    <InvoiceCard
                                      invoice={invoice}
                                      creditBalance={creditNote?.balance || 0}
                                      onAddToCart={(invoiceId) => handleAddToCart(invoiceId, 'trip')}
                                      studentName={student?.name}
                                    />
                                  </div>
                                );
                              })
                            ) : (
                              <p className={`text-center text-muted-foreground py-4 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                {t('invoice.noPaidInvoices')}
                              </p>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  );
                })()}
              </div>

              {/* Right 30% - Cart Sidebar */}
              <div className="hidden lg:block lg:col-span-3">
                <TuitionCartSidebar
                  items={cartItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    studentName: item.studentName,
                    studentId: item.studentId
                  }))}
                  onRemoveItem={handleRemoveFromCart}
                  onCheckout={handleGoToCart}
                />
              </div>
            </div>
          </TabsContent>

          {/* Exam Tab - Exam Invoices */}
          <TabsContent value="event" className="space-y-0">
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
              {/* Left 70% - Invoice List */}
              <div className="lg:col-span-7 space-y-4">
                {(() => {
                  const examInvoices = allInvoices.filter(invoice =>
                    invoice.id.startsWith('EXAM-') &&
                    invoice.student_id.toString() === selectedStudent
                  );
                  const { unpaid, paid, unpaidTotal, paidTotal } = groupInvoicesByPaymentStatus(examInvoices);

                  return (
                    <Accordion type="multiple" defaultValue={["unpaid"]} className="w-full space-y-2">
                      {/* Unpaid Section */}
                      <AccordionItem value="unpaid" className="border rounded-lg">
                        <AccordionTrigger className="px-4 hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-2">
                            <div className="flex items-center gap-3">
                              <AlertCircle className="h-5 w-5 text-warning-orange" />
                              <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                {t('invoice.unpaidInvoices')}
                              </span>
                              <Badge variant="secondary">{unpaid.length}</Badge>
                            </div>
                            <Badge className="bg-warning-orange/20 text-warning-orange hover:bg-warning-orange/30">
                              {formatCurrency(unpaidTotal)}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-4">
                            {unpaid.filter(invoice => !isInCart(invoice.id, invoice.student_id?.toString())).length > 0 ? (
                              unpaid.filter(invoice => !isInCart(invoice.id, invoice.student_id?.toString())).map(invoice => {
                                const student = mockStudents.find(s => s.id === invoice.student_id);
                                const creditNote = allCreditNotes.find(cn => cn.student_id === invoice.student_id);
                                return (
                                  <div key={invoice.id} className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                        {student?.name} - {student?.class}
                                      </Badge>
                                    </div>
                                    <InvoiceCard
                                      invoice={invoice}
                                      creditBalance={creditNote?.balance || 0}
                                      onAddToCart={(invoiceId) => handleAddToCart(invoiceId, 'exam')}
                                      studentName={student?.name}
                                    />
                                  </div>
                                );
                              })
                            ) : (
                              <div className="text-center py-8">
                                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                                <p className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                  {t('invoice.noUnpaidInvoices')}
                                </p>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Paid Section */}
                      <AccordionItem value="paid" className="border rounded-lg">
                        <AccordionTrigger className="px-4 hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-2">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                {t('invoice.paidInvoices')}
                              </span>
                              <Badge variant="secondary">{paid.length}</Badge>
                            </div>
                            <Badge className="bg-green-500/20 text-green-600 hover:bg-green-500/30">
                              {formatCurrency(paidTotal)}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-4">
                            {paid.length > 0 ? (
                              paid.map(invoice => {
                                const student = mockStudents.find(s => s.id === invoice.student_id);
                                const creditNote = allCreditNotes.find(cn => cn.student_id === invoice.student_id);
                                return (
                                  <div key={invoice.id} className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                        {student?.name} - {student?.class}
                                      </Badge>
                                    </div>
                                    <InvoiceCard
                                      invoice={invoice}
                                      creditBalance={creditNote?.balance || 0}
                                      onAddToCart={(invoiceId) => handleAddToCart(invoiceId, 'exam')}
                                      studentName={student?.name}
                                    />
                                  </div>
                                );
                              })
                            ) : (
                              <p className={`text-center text-muted-foreground py-4 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                {t('invoice.noPaidInvoices')}
                              </p>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  );
                })()}
              </div>

              {/* Right 30% - Cart Sidebar */}
              <div className="hidden lg:block lg:col-span-3">
                <TuitionCartSidebar
                  items={cartItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    studentName: item.studentName,
                    studentId: item.studentId
                  }))}
                  onRemoveItem={handleRemoveFromCart}
                  onCheckout={handleGoToCart}
                />
              </div>
            </div>
          </TabsContent>

          {/* School Bus Tab - School Bus Invoices */}
          <TabsContent value="schoolbus" className="space-y-0">
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
              {/* Left 70% - Invoice List */}
              <div className="lg:col-span-7 space-y-4">
                {(() => {
                  const schoolBusInvoices = allInvoices.filter(invoice =>
                    invoice.id.startsWith('BUS-') &&
                    invoice.student_id.toString() === selectedStudent
                  );
                  const { unpaid, paid, unpaidTotal, paidTotal } = groupInvoicesByPaymentStatus(schoolBusInvoices);

                  return (
                    <Accordion type="multiple" defaultValue={["unpaid"]} className="w-full space-y-2">
                      {/* Unpaid Section */}
                      <AccordionItem value="unpaid" className="border rounded-lg">
                        <AccordionTrigger className="px-4 hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-2">
                            <div className="flex items-center gap-3">
                              <AlertCircle className="h-5 w-5 text-warning-orange" />
                              <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                {t('invoice.unpaidInvoices')}
                              </span>
                              <Badge variant="secondary">{unpaid.length}</Badge>
                            </div>
                            <Badge className="bg-warning-orange/20 text-warning-orange hover:bg-warning-orange/30">
                              {formatCurrency(unpaidTotal)}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-4">
                            {unpaid.filter(invoice => !isInCart(invoice.id, invoice.student_id?.toString())).length > 0 ? (
                              unpaid.filter(invoice => !isInCart(invoice.id, invoice.student_id?.toString())).map(invoice => {
                                const student = mockStudents.find(s => s.id === invoice.student_id);
                                const creditNote = allCreditNotes.find(cn => cn.student_id === invoice.student_id);
                                return (
                                  <div key={invoice.id} className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                        {student?.name} - {student?.class}
                                      </Badge>
                                    </div>
                                    <InvoiceCard
                                      invoice={invoice}
                                      creditBalance={creditNote?.balance || 0}
                                      onAddToCart={(invoiceId) => handleAddToCart(invoiceId, 'schoolbus')}
                                      studentName={student?.name}
                                    />
                                  </div>
                                );
                              })
                            ) : (
                              <div className="text-center py-8">
                                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                                <p className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                  {t('invoice.noUnpaidInvoices')}
                                </p>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      {/* Paid Section */}
                      <AccordionItem value="paid" className="border rounded-lg">
                        <AccordionTrigger className="px-4 hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-2">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="h-5 w-5 text-green-500" />
                              <span className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                {t('invoice.paidInvoices')}
                              </span>
                              <Badge variant="secondary">{paid.length}</Badge>
                            </div>
                            <Badge className="bg-green-500/20 text-green-600 hover:bg-green-500/30">
                              {formatCurrency(paidTotal)}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-4">
                            {paid.length > 0 ? (
                              paid.map(invoice => {
                                const student = mockStudents.find(s => s.id === invoice.student_id);
                                const creditNote = allCreditNotes.find(cn => cn.student_id === invoice.student_id);
                                return (
                                  <div key={invoice.id} className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className={`${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                        {student?.name} - {student?.class}
                                      </Badge>
                                    </div>
                                    <InvoiceCard
                                      invoice={invoice}
                                      creditBalance={creditNote?.balance || 0}
                                      onAddToCart={(invoiceId) => handleAddToCart(invoiceId, 'schoolbus')}
                                      studentName={student?.name}
                                    />
                                  </div>
                                );
                              })
                            ) : (
                              <p className={`text-center text-muted-foreground py-4 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                {t('invoice.noPaidInvoices')}
                              </p>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  );
                })()}
              </div>

              {/* Right 30% - Cart Sidebar */}
              <div className="hidden lg:block lg:col-span-3">
                <TuitionCartSidebar
                  items={cartItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    studentName: item.studentName,
                    studentId: item.studentId
                  }))}
                  onRemoveItem={handleRemoveFromCart}
                  onCheckout={handleGoToCart}
                />
              </div>
            </div>
          </TabsContent>

          {/* Transaction History Tab - with submenu for Receipts and Credit Note */}
          <TabsContent value="transaction" className="space-y-6">
            {/* Submenu Tabs */}
            <div className="flex gap-1 border-b">
              <button
                onClick={() => setTransactionSubTab('receipts')}
                className={`px-4 py-2 text-sm font-medium transition-colors relative ${transactionSubTab === 'receipts'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
                  } ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
              >
                {t('portal.receipts')}
                {transactionSubTab === 'receipts' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
              <button
                onClick={() => setTransactionSubTab('creditNote')}
                className={`px-4 py-2 text-sm font-medium transition-colors relative ${transactionSubTab === 'creditNote'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
                  } ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
              >
                {t('creditNote.title')}
                {transactionSubTab === 'creditNote' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            </div>

            {/* Receipts Sub-tab */}
            {transactionSubTab === 'receipts' && (
              <ReceiptList
                receipts={allReceipts}
                onDownload={handleDownloadReceipt}
              />
            )}

            {/* Credit Note Sub-tab */}
            {transactionSubTab === 'creditNote' && (
              <CreditNoteHistory creditNotes={mockCreditNoteHistory} />
            )}
          </TabsContent>
        </Tabs>
      </main>

      <MobileBottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as 'dashboard' | 'tuition' | 'afterschool' | 'summer' | 'event' | 'schoolbus' | 'transaction')}
        cartItemCount={cartItems.length}
        isSISBStudent={isSISBStudent}
        unpaidInvoicesCount={unpaidInvoicesCount}
      />

      {/* Mobile Cart Drawer */}
      <MobileCartDrawer
        isOpen={mobileCartOpen}
        onOpenChange={setMobileCartOpen}
        cartItems={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleGoToCart}
        onClearAll={() => {
          cartItems.forEach(item => handleRemoveFromCart(item.id, item.studentId));
        }}
      />

      {/* Overdue Invoices Dialog */}
      <Dialog open={showOverdueDialog} onOpenChange={setShowOverdueDialog}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className={`flex items-center gap-2 text-destructive ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
              <AlertCircle className="h-5 w-5" />
              {language === 'th' ? 'รายการเกินกำหนดชำระ' : language === 'zh' ? '逾期发票' : 'Overdue Invoices'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            {overdueInvoices.length === 0 ? (
              <p className={`text-center text-muted-foreground py-6 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {language === 'th' ? 'ไม่มีรายการเกินกำหนด' : 'No overdue invoices'}
              </p>
            ) : (
              overdueInvoices.map((inv) => {
                const student = mockStudents.find(s => s.id === inv.student_id);
                return (
                  <div key={inv.id} className="flex items-start justify-between p-3 bg-destructive/5 border border-destructive/20 rounded-lg gap-3">
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {inv.description}
                      </p>
                      <p className={`text-xs text-muted-foreground mt-0.5 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {student?.name} • {language === 'th' ? 'ครบกำหนด' : 'Due'}: {new Date(inv.due_date).toLocaleDateString(language === 'th' ? 'th-TH' : language === 'zh' ? 'zh-CN' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`font-bold text-destructive text-sm ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {formatCurrency(inv.amount_due)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            {overdueInvoices.length > 0 && (
              <div className={`flex justify-between items-center pt-2 border-t font-semibold ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                <span>{language === 'th' ? 'รวมทั้งหมด' : 'Total'}</span>
                <span className="text-destructive">{formatCurrency(overdueAmount)}</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};
