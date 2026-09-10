import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronUp, ChevronDown, AlertTriangle, ShoppingCart, X, Clock, MapPin, Users, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";

export interface CalendarCourse {
  id: string;
  name: string;
  day: string;
  startTime: string;
  endTime: string;
  location: string;
  isInCart?: boolean;
  isMandatory?: boolean;
  studentName?: string;
  studentColor?: string;
  // Extended fields for details
  originalCourseId?: string;
  description?: string;
  price?: number;
  duration?: string;
  vendor?: string;
  capacity?: number;
  enrolled?: number;
  studentId?: string;
}

interface StudentInfo {
  id: string;
  name: string;
  avatar: string;
}

interface WeeklyCalendarViewProps {
  courses: CalendarCourse[];
  mandatoryCourses?: CalendarCourse[];
  students?: StudentInfo[];
  onAddToCart?: (courseId: string, studentId?: string) => void;
  onRemoveFromCart?: (courseId: string, studentId?: string) => void;
  isMobile?: boolean;
  onClose?: () => void;
}

// Helper function to check if two time ranges overlap
const timeOverlaps = (start1: string, end1: string, start2: string, end2: string): boolean => {
  const toMinutes = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };
  const s1 = toMinutes(start1), e1 = toMinutes(end1);
  const s2 = toMinutes(start2), e2 = toMinutes(end2);
  return s1 < e2 && s2 < e1;
};

export const WeeklyCalendarView = ({ 
  courses, 
  mandatoryCourses = [], 
  students = [],
  onAddToCart,
  onRemoveFromCart,
  isMobile = false,
  onClose
}: WeeklyCalendarViewProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CalendarCourse | null>(null);
  const [selectedStudentFilter, setSelectedStudentFilter] = useState<string>('all');
  const { language, formatCurrency } = useLanguage();

  // On mobile, always show expanded
  const showCalendar = isMobile || isExpanded;

  // Combine both course types
  const allCourses = [...mandatoryCourses, ...courses];

  // Filter courses by selected student
  const filteredCourses = useMemo(() => {
    if (selectedStudentFilter === 'all') return allCourses;
    return allCourses.filter(c => c.studentId === selectedStudentFilter || c.studentName === students.find(s => s.id === selectedStudentFilter)?.name);
  }, [allCourses, selectedStudentFilter, students]);

  // Detect conflicts - courses that overlap in time on the same day
  const conflictingCourseIds = useMemo(() => {
    const conflicts = new Set<string>();
    
    // Group courses by day
    const dayGroups: Record<string, CalendarCourse[]> = {};
    filteredCourses.forEach(course => {
      if (!dayGroups[course.day]) dayGroups[course.day] = [];
      dayGroups[course.day].push(course);
    });

    // Check for overlaps within each day
    Object.values(dayGroups).forEach(dayCourses => {
      for (let i = 0; i < dayCourses.length; i++) {
        for (let j = i + 1; j < dayCourses.length; j++) {
          const a = dayCourses[i];
          const b = dayCourses[j];
          
          if (timeOverlaps(a.startTime, a.endTime, b.startTime, b.endTime)) {
            conflicts.add(a.id);
            conflicts.add(b.id);
          }
        }
      }
    });

    return conflicts;
  }, [filteredCourses]);

  const days = [
    { key: 'Mon', label: language === 'th' ? 'จันทร์' : 'Monday', shortLabel: language === 'th' ? 'จ.' : 'Mon', date: '9' },
    { key: 'Tue', label: language === 'th' ? 'อังคาร' : 'Tuesday', shortLabel: language === 'th' ? 'อ.' : 'Tue', date: '10' },
    { key: 'Wed', label: language === 'th' ? 'พุธ' : 'Wednesday', shortLabel: language === 'th' ? 'พ.' : 'Wed', date: '11' },
    { key: 'Thu', label: language === 'th' ? 'พฤหัสบดี' : 'Thursday', shortLabel: language === 'th' ? 'พฤ.' : 'Thu', date: '12' },
    { key: 'Fri', label: language === 'th' ? 'ศุกร์' : 'Friday', shortLabel: language === 'th' ? 'ศ.' : 'Fri', date: '13' },
    { key: 'Sat', label: language === 'th' ? 'เสาร์' : 'Saturday', shortLabel: language === 'th' ? 'ส.' : 'Sat', date: '14' },
    { key: 'Sun', label: language === 'th' ? 'อาทิตย์' : 'Sunday', shortLabel: language === 'th' ? 'อา.' : 'Sun', date: '15' },
  ];

  const timeSlots = [
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  // Mobile-optimized slot height
  const slotHeight = isMobile ? 50 : 60;

  const getCoursePosition = (startTime: string) => {
    const hour = parseInt(startTime.split(':')[0]);
    const minutes = parseInt(startTime.split(':')[1]);
    return ((hour - 13) + minutes / 60) * slotHeight;
  };

  const getCourseHeight = (startTime: string, endTime: string) => {
    const start = parseInt(startTime.split(':')[0]) + parseInt(startTime.split(':')[1]) / 60;
    const end = parseInt(endTime.split(':')[0]) + parseInt(endTime.split(':')[1]) / 60;
    return (end - start) * slotHeight;
  };

  const getCoursesForDay = (dayKey: string) => {
    return filteredCourses.filter(course => course.day === dayKey);
  };

  const hasConflict = (courseId: string) => conflictingCourseIds.has(courseId);

  const handleCourseClick = (course: CalendarCourse) => {
    setSelectedCourse(course);
  };

  const handleAddToCartClick = () => {
    if (selectedCourse && onAddToCart) {
      const courseId = selectedCourse.originalCourseId || selectedCourse.id.split('-')[0];
      onAddToCart(courseId, selectedCourse.studentId);
      setSelectedCourse(null);
    }
  };

  const handleRemoveFromCartClick = () => {
    if (selectedCourse && onRemoveFromCart) {
      const courseId = selectedCourse.originalCourseId || selectedCourse.id.split('-')[0];
      onRemoveFromCart(courseId, selectedCourse.studentId);
      setSelectedCourse(null);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        className={isMobile ? "fixed inset-0 z-50 bg-background" : "fixed bottom-0 left-0 right-0 z-50"}
        initial={isMobile ? { x: "100%" } : { y: "100%" }}
        animate={isMobile ? { x: 0 } : { y: 0 }}
        exit={isMobile ? { x: "100%" } : { y: "100%" }}
        transition={{ 
          type: "spring", 
          damping: 25, 
          stiffness: 300,
          duration: 0.3 
        }}
      >
        {/* Toggle Button - Only on Desktop */}
        {!isMobile && (
          <div className="flex justify-center mb-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className={`rounded-t-lg rounded-b-none shadow-lg bg-education-blue hover:bg-education-blue/90 text-white ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
            >
              <Calendar className="h-4 w-4 mr-2" />
              {language === 'th' ? 'ปฏิทินรายสัปดาห์' : 'Weekly Schedule'}
              {isExpanded ? <ChevronDown className="ml-2 h-4 w-4" /> : <ChevronUp className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        )}

        {/* Mobile Header with Close Button */}
        {isMobile && (
          <motion.div 
            className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.2 }}
          >
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <h2 className={`font-semibold ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {language === 'th' ? 'ปฏิทินรายสัปดาห์' : 'Weekly Schedule'}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </motion.div>
        )}

        {/* Calendar View */}
        {showCalendar && (
          <motion.div
            initial={isMobile ? { opacity: 0, y: 20 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.25 }}
          >
            <Card className={isMobile 
              ? "rounded-none h-[calc(100vh-64px)] overflow-auto bg-background" 
              : "rounded-none rounded-t-lg shadow-2xl max-h-[70vh] overflow-auto bg-background/95 backdrop-blur-sm"
            }>
          <div className="p-4">
            {/* Header with Filter */}
            <div className="mb-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              {/* Student Filter */}
              {students.length > 0 && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <Select value={selectedStudentFilter} onValueChange={setSelectedStudentFilter}>
                    <SelectTrigger className="w-[180px] h-8 text-sm bg-background">
                      <SelectValue placeholder={language === 'th' ? 'นักเรียนทั้งหมด' : 'All Students'} />
                    </SelectTrigger>
                    <SelectContent className="bg-background">
                      <SelectItem value="all">
                        {language === 'th' ? 'นักเรียนทั้งหมด' : 'All Students'}
                      </SelectItem>
                      {students.map(student => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.avatar} {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Conflict Warning */}
              {conflictingCourseIds.size > 0 && (
                <div className="flex items-center gap-2 text-orange-600 text-xs bg-orange-50 px-3 py-1.5 rounded-full">
                  <AlertTriangle className="h-4 w-4" />
                  <span className={language === 'th' ? 'font-sukhumvit' : 'font-lato'}>
                    {language === 'th' 
                      ? `พบ ${conflictingCourseIds.size / 2} ตารางเรียนที่ซ้อนทับกัน` 
                      : `${conflictingCourseIds.size / 2} schedule conflict(s) detected`}
                  </span>
                </div>
              )}
            </div>

            {/* Legend - Compact on Mobile */}
            <div className={`mb-4 flex flex-wrap items-center justify-center text-xs ${isMobile ? 'gap-2' : 'gap-4'}`}>
              <div className="flex items-center gap-1.5">
                <div className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} bg-destructive/80 rounded`}></div>
                <span className={`${isMobile ? 'text-[10px]' : ''} ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {language === 'th' ? 'บังคับ' : 'Mandatory'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} bg-primary rounded`}></div>
                <span className={`${isMobile ? 'text-[10px]' : ''} ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {language === 'th' ? 'ในตะกร้า' : 'In Cart'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} bg-education-blue/80 rounded`}></div>
                <span className={`${isMobile ? 'text-[10px]' : ''} ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {language === 'th' ? 'ว่าง' : 'Available'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} border-2 border-orange-500 rounded flex items-center justify-center`}>
                  <AlertTriangle className={`${isMobile ? 'h-2 w-2' : 'h-2.5 w-2.5'} text-orange-500`} />
                </div>
                <span className={`${isMobile ? 'text-[10px]' : ''} ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {language === 'th' ? 'ซ้อนทับ' : 'Conflict'}
                </span>
              </div>
            </div>

            {/* Mobile Scroll Hint */}
            {isMobile && (
              <div className="mb-2 text-center text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                <span>👆</span>
                <span className={language === 'th' ? 'font-sukhumvit' : 'font-lato'}>
                  {language === 'th' ? 'เลื่อนซ้าย-ขวาเพื่อดูวันอื่น' : 'Swipe left/right to see more days'}
                </span>
              </div>
            )}

            {/* Horizontally Scrollable Calendar Grid for Mobile */}
            <div className={isMobile ? "overflow-x-auto -mx-4 px-2 pb-4" : ""}>
              <div className={`grid grid-cols-8 ${isMobile ? 'gap-0.5 min-w-[600px]' : 'gap-2'}`}>
                {/* Time Column */}
                <div className={`col-span-1 ${isMobile ? 'sticky left-0 z-10 bg-background' : ''}`}>
                  <div className={`${isMobile ? 'h-12' : 'h-10'} flex items-center justify-center font-medium text-xs bg-background`}>
                    {language === 'th' ? 'เวลา' : 'Time'}
                  </div>
                  {timeSlots.map((time) => (
                    <div 
                      key={time} 
                      className={`flex items-start justify-center text-xs text-muted-foreground border-t pt-1 bg-background`}
                      style={{ height: `${slotHeight}px` }}
                    >
                      {isMobile ? time.replace(':00', '') : time}
                    </div>
                  ))}
                </div>

                {/* Day Columns */}
                {days.map((day, dayIndex) => {
                  const dayCourses = getCoursesForDay(day.key);
                  const isAlternate = dayIndex % 2 === 1;
                  return (
                    <div key={day.key} className={`col-span-1 relative ${isMobile ? 'min-w-[70px]' : ''}`}>
                      {/* Day Header */}
                      <div className={`${isMobile ? 'h-12' : 'h-10'} flex flex-col items-center justify-center border-b-2 border-primary/20 ${isAlternate ? 'bg-education-blue/10' : 'bg-background'}`}>
                        <div className={`${isMobile ? 'text-xs' : 'text-sm'} font-semibold ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                          {isMobile ? day.shortLabel : day.label}
                        </div>
                        <div className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-muted-foreground`}>
                          {day.date}
                        </div>
                      </div>

                      {/* Time Grid */}
                      <div className={`relative ${isAlternate ? 'bg-education-blue/5' : 'bg-background'}`} style={{ height: `${timeSlots.length * slotHeight}px` }}>
                        {timeSlots.map((_, index) => (
                          <div
                            key={index}
                            className="absolute w-full border-t border-border/30"
                            style={{ top: `${index * slotHeight}px`, height: `${slotHeight}px` }}
                          />
                        ))}

                        {/* Course Blocks */}
                        {dayCourses.map((course) => {
                          const courseHasConflict = hasConflict(course.id);
                          return (
                            <div
                              key={course.id}
                              onClick={() => handleCourseClick(course)}
                              className={`absolute left-0.5 right-0.5 rounded-md shadow-md overflow-hidden cursor-pointer transition-all active:scale-[0.98] ${
                                course.isMandatory
                                  ? 'bg-destructive/90 text-white border border-destructive'
                                  : course.isInCart 
                                    ? 'bg-primary text-primary-foreground border border-primary' 
                                    : 'bg-education-blue/90 text-white border border-education-blue'
                              } ${courseHasConflict ? '!border-orange-500 ring-1 ring-orange-300' : ''}`}
                              style={{
                                top: `${getCoursePosition(course.startTime)}px`,
                                height: `${Math.max(getCourseHeight(course.startTime, course.endTime) - 2, 20)}px`,
                              }}
                            >
                              <div className={`${isMobile ? 'p-0.5' : 'p-1.5'} h-full flex flex-col relative`}>
                                {courseHasConflict && (
                                  <AlertTriangle className={`absolute top-0 right-0 ${isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'} text-orange-300 drop-shadow-sm`} />
                                )}
                                <div className={`${isMobile ? 'text-[8px] leading-tight line-clamp-2' : 'text-[9px] leading-tight line-clamp-2'} font-bold text-white drop-shadow-sm ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                  {course.name}
                                </div>
                                {!isMobile && course.studentName && (
                                  <span className="text-[8px] text-white/90 truncate drop-shadow-sm">({course.studentName})</span>
                                )}
                                {!isMobile && (
                                  <div className="text-[8px] text-white/80 truncate mt-auto drop-shadow-sm">
                                    📍 {course.location}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          </Card>
          </motion.div>
        )}

      {/* Course Detail Dialog */}
      <Dialog open={!!selectedCourse} onOpenChange={(open) => !open && setSelectedCourse(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className={`text-lg ${language === 'th' ? 'font-sukhumvit' : 'font-lato'}`}>
              {selectedCourse?.name}
            </DialogTitle>
            {selectedCourse?.description && (
              <DialogDescription className={language === 'th' ? 'font-sukhumvit' : 'font-lato'}>
                {selectedCourse.description}
              </DialogDescription>
            )}
          </DialogHeader>

          {selectedCourse && (
            <div className="space-y-4">
              {/* Conflict Warning */}
              {hasConflict(selectedCourse.id) && (
                <div className="bg-orange-50 border border-orange-200 text-orange-700 p-3 rounded-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                  <span className={`text-sm ${language === 'th' ? 'font-sukhumvit' : 'font-lato'}`}>
                    {language === 'th' 
                      ? 'ตารางเรียนนี้ซ้อนทับกับวิชาอื่น!' 
                      : 'This course overlaps with another!'}
                  </span>
                </div>
              )}

              {/* Course Details */}
              <div className="space-y-3">
                {/* Schedule & Location */}
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedCourse.day} {selectedCourse.startTime} - {selectedCourse.endTime}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedCourse.location}</span>
                </div>

                {/* Duration & Vendor */}
                {selectedCourse.duration && (
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedCourse.duration}</span>
                  </div>
                )}
                {selectedCourse.vendor && (
                  <div className="flex items-center gap-3 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedCourse.vendor}</span>
                  </div>
                )}

                {/* Capacity */}
                {selectedCourse.capacity && selectedCourse.enrolled !== undefined && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{language === 'th' ? 'ความจุ' : 'Capacity'}</span>
                      </div>
                      <span className={selectedCourse.enrolled >= selectedCourse.capacity ? 'text-destructive font-medium' : ''}>
                        {selectedCourse.enrolled}/{selectedCourse.capacity}
                      </span>
                    </div>
                    <Progress 
                      value={(selectedCourse.enrolled / selectedCourse.capacity) * 100} 
                      className="h-2"
                    />
                    {selectedCourse.enrolled >= selectedCourse.capacity && (
                      <p className="text-xs text-destructive">
                        {language === 'th' ? 'เต็มแล้ว' : 'Fully Booked'}
                      </p>
                    )}
                  </div>
                )}

                {/* Student */}
                {selectedCourse.studentName && (
                  <div className="flex items-center gap-3 text-sm bg-muted/50 p-2 rounded">
                    <span className="text-muted-foreground">{language === 'th' ? 'สำหรับ:' : 'For:'}</span>
                    <span className="font-medium">{selectedCourse.studentName}</span>
                  </div>
                )}

                {/* Price */}
                {selectedCourse.price !== undefined && (
                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className={`font-medium ${language === 'th' ? 'font-sukhumvit' : 'font-lato'}`}>
                      {language === 'th' ? 'ราคา' : 'Price'}
                    </span>
                    <span className="text-lg font-bold text-primary">
                      {formatCurrency(selectedCourse.price)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2 sm:gap-2">
            {selectedCourse?.isMandatory ? (
              <Badge variant="secondary" className="w-full justify-center py-2">
                🔒 {language === 'th' ? 'วิชาบังคับ - ไม่สามารถยกเลิกได้' : 'Mandatory - Cannot be removed'}
              </Badge>
            ) : selectedCourse?.isInCart ? (
              <Button 
                variant="destructive" 
                onClick={handleRemoveFromCartClick}
                className="w-full"
              >
                <X className="h-4 w-4 mr-2" />
                {language === 'th' ? 'นำออกจากตะกร้า' : 'Remove from Cart'}
              </Button>
            ) : (
              <Button 
                onClick={handleAddToCartClick}
                className="w-full"
                disabled={selectedCourse?.capacity !== undefined && selectedCourse?.enrolled !== undefined && selectedCourse.enrolled >= selectedCourse.capacity}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {language === 'th' ? 'เพิ่มลงตะกร้า' : 'Add to Cart'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </motion.div>
    </AnimatePresence>
  );
};
