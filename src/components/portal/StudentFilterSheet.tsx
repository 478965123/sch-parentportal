import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Users } from "lucide-react";
import { mockStudents } from "@/data/mockData";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
interface StudentFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStudent?: typeof mockStudents[0] | null;
  onStudentChange: (student: typeof mockStudents[0] | null) => void;
  showAllOption?: boolean;
}
const getInitials = (name: string) => {
  return name.split(' ').map(word => word[0]).join('').toUpperCase();
};
export const StudentFilterSheet = ({
  open,
  onOpenChange,
  selectedStudent,
  onStudentChange,
  showAllOption = true
}: StudentFilterSheetProps) => {
  const {
    language,
    t
  } = useLanguage();
  const fontClass = language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato';
  return <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[70vh] rounded-t-2xl">
        <SheetHeader className="pb-4">
          <SheetTitle className={cn("text-center", fontClass)}>
            {language === 'th' ? 'เลือกนักเรียน' : 'Select Student'}
          </SheetTitle>
        </SheetHeader>
        
        <div className="space-y-2 overflow-y-auto max-h-[calc(70vh-100px)] pb-6">
          {/* All Students Option */}
          {showAllOption}

          {/* Individual Students */}
          {mockStudents.map((student, index) => <Button key={student.id} variant="ghost" className={cn("w-full justify-start h-auto py-3 px-4 animate-fade-in-up touch-active", selectedStudent?.id === student.id && "bg-primary/10 border border-primary/20")} style={{
          animationDelay: `${(index + 1) * 50}ms`
        }} onClick={() => onStudentChange(student)}>
              <div className="flex items-center gap-3 w-full">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {student.avatar || getInitials(student.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start flex-1 min-w-0">
                  <span className={cn("font-medium truncate w-full text-left", fontClass)}>
                    {student.name}
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={cn("text-sm text-muted-foreground", fontClass)}>
                      {student.class}
                    </span>
                    <Badge variant="outline" className="text-xs h-5">
                      {student.campus}
                    </Badge>
                    {!student.isSISB && <Badge variant="secondary" className="text-xs h-5">
                        {language === 'th' ? 'ภายนอก' : 'External'}
                      </Badge>}
                  </div>
                </div>
                {selectedStudent?.id === student.id && <Check className="h-5 w-5 text-primary animate-scale-bounce flex-shrink-0" />}
              </div>
            </Button>)}
        </div>
      </SheetContent>
    </Sheet>;
};