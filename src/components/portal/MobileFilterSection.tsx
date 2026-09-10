import { useState } from "react";
import { Search, ChevronDown, ChevronUp, X, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StudentFilterSheet } from "./StudentFilterSheet";
import { mockStudents } from "@/data/mockData";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
interface MobileFilterSectionProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  selectedStudent?: typeof mockStudents[0] | null;
  onStudentChange?: (student: typeof mockStudents[0]) => void;
  dayFilter?: string;
  onDayFilterChange?: (day: string) => void;
  showDayFilter?: boolean;
  showStudentFilter?: boolean;
  searchPlaceholder?: string;
}
export const MobileFilterSection = ({
  searchValue,
  onSearchChange,
  selectedStudent,
  onStudentChange,
  dayFilter = "all",
  onDayFilterChange,
  showDayFilter = false,
  showStudentFilter = true,
  searchPlaceholder,
}: MobileFilterSectionProps) => {
  const [studentSheetOpen, setStudentSheetOpen] = useState(false);
  const {
    t,
    language
  } = useLanguage();
  const fontClass = language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato';

  // Count active filters
  const activeFiltersCount = [selectedStudent ? 1 : 0, dayFilter !== "all" ? 1 : 0].reduce((a, b) => a + b, 0);
  const dayOptions = [{
    value: "all",
    label: language === 'th' ? 'ทุกวัน' : 'All Days'
  }, {
    value: "Mon",
    label: language === 'th' ? 'จันทร์' : 'Monday'
  }, {
    value: "Tue",
    label: language === 'th' ? 'อังคาร' : 'Tuesday'
  }, {
    value: "Wed",
    label: language === 'th' ? 'พุธ' : 'Wednesday'
  }, {
    value: "Thu",
    label: language === 'th' ? 'พฤหัสบดี' : 'Thursday'
  }, {
    value: "Fri",
    label: language === 'th' ? 'ศุกร์' : 'Friday'
  }, {
    value: "Sat",
    label: language === 'th' ? 'เสาร์' : 'Saturday'
  }, {
    value: "Sun",
    label: language === 'th' ? 'อาทิตย์' : 'Sunday'
  }];
  const clearFilters = () => {
    if (onStudentChange) onStudentChange(null as any);
    if (onDayFilterChange) onDayFilterChange("all");
  };
  return <div className="space-y-3 animate-fade-in-up">
    {/* Full Width Search Bar */}
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input placeholder={searchPlaceholder || (language === 'th' ? 'ค้นหา...' : 'Search...')} value={searchValue} onChange={e => onSearchChange(e.target.value)} className={cn("pl-10 pr-4 h-11 w-full bg-background border-border", "focus:ring-2 focus:ring-primary/20 transition-all duration-200", fontClass)} />
      {searchValue && <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0" onClick={() => onSearchChange("")}>
        <X className="h-4 w-4" />
      </Button>}
    </div>

    {/* Quick Filters Row - Student (ซ้าย) | Day (ขวา) */}
    {(showStudentFilter || showDayFilter) && <div className="flex gap-2 items-center">
      {/* Student Filter - ด้านซ้าย */}
      {showStudentFilter && <Button variant="outline" className={cn("flex-1 justify-between h-10 min-w-0", selectedStudent && "border-primary/50 bg-primary/5")} onClick={() => setStudentSheetOpen(true)}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base shrink-0">{selectedStudent?.avatar || '👥'}</span>
          <span className={cn("truncate text-sm", fontClass)}>
            {selectedStudent?.name || (language === 'th' ? 'ทั้งหมด' : 'All')}
          </span>
        </div>
        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
      </Button>}

      {/* Day Filter - ด้านขวา */}
      {showDayFilter && <Select value={dayFilter} onValueChange={onDayFilterChange}>
        <SelectTrigger className={cn("flex-1 h-10 min-w-0", dayFilter !== "all" && "border-primary/50 bg-primary/5")}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-background border">
          {dayOptions.map(option => <SelectItem key={option.value} value={option.value}>
            <span className={fontClass}>{option.label}</span>
          </SelectItem>)}
        </SelectContent>
      </Select>}

      {/* Clear Filters Button */}
      {activeFiltersCount > 0}
    </div>}

    {/* Student Filter Sheet */}
    <StudentFilterSheet open={studentSheetOpen} onOpenChange={setStudentSheetOpen} selectedStudent={selectedStudent} onStudentChange={student => {
      onStudentChange?.(student);
      setStudentSheetOpen(false);
    }} />
  </div>;
};