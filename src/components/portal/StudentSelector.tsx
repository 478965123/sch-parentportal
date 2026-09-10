import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const getInitials = (name: string) => {
  return name.split(' ').map(word => word[0]).join('').toUpperCase();
};

interface Student {
  id: number;
  name: string;
  class: string;
  year: string;
  campus?: string;
  isSISB?: boolean;
}

interface StudentSelectorProps {
  students: Student[];
  initialStudentId?: number;
  onStudentChange?: (student: Student) => void;
}

export const StudentSelector = ({
  students,
  initialStudentId,
  onStudentChange
}: StudentSelectorProps) => {
  const [selectedStudent, setSelectedStudent] = useState<Student>(
    students.find(s => s.id === initialStudentId) || students[0]
  );
  const { t, language } = useLanguage();

  // Update selected student if initialStudentId changes
  useEffect(() => {
    if (initialStudentId) {
      const student = students.find(s => s.id === initialStudentId);
      if (student) {
        setSelectedStudent(student);
      }
    }
  }, [initialStudentId, students]);

  const handleStudentChange = (student: Student) => {
    setSelectedStudent(student);

    // Trigger the callback to update parent component
    // This will update all portal data (invoices, courses, trips, etc.)
    // based on the selected student's ID
    onStudentChange?.(student);
  };

  // If no students, show placeholder
  if (!students || students.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
        <div className={`text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
          {language === 'th' ? 'ไม่พบข้อมูลนักเรียน' : language === 'zh' ? '找不到学生数据' : 'No students found'}
        </div>
      </div>
    );
  }

  // If only one student, show simple display
  if (students.length === 1) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
            {getInitials(selectedStudent.name)}
          </AvatarFallback>
        </Avatar>
        <div className={`text-sm ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
          <div className="font-medium">{selectedStudent.name}</div>
          <div className="text-muted-foreground text-xs">{selectedStudent.class}</div>
        </div>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={`gap-2 justify-start min-w-[200px] h-auto p-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
              {getInitials(selectedStudent.name)}
            </AvatarFallback>
          </Avatar>
          <div className="text-left flex-1">
            <div className="font-medium text-sm">{selectedStudent.name}</div>
            <div className="text-muted-foreground text-xs">{selectedStudent.class}</div>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 bg-background/95 backdrop-blur-sm border">
        {students.map((student) => (
          <DropdownMenuItem
            key={student.id}
            onClick={() => handleStudentChange(student)}
            className={`gap-2 cursor-pointer p-3 ${
              selectedStudent.id === student.id ? 'bg-accent' : ''
            } ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
                {getInitials(student.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-medium text-sm">{student.name}</div>
              <div className="text-muted-foreground text-xs">
                {student.class} • {student.year}
              </div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export type { Student };