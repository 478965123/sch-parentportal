import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { X, Bus, AlertCircle, ChevronDown, Calendar, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockStudents } from "@/data/mockData";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

export interface TripCartItem {
  id: string;
  name: string;
  price: number;
  studentName?: string;
  studentId?: string;
  date: string;
  location: string;
}

interface TripCartSidebarProps {
  items: TripCartItem[];
  onRemoveItem: (tripId: string) => void;
  onCheckout: () => void;
  onClearAll?: () => void;
  campus: string;
}

export const TripCartSidebar = ({ items, onRemoveItem, onCheckout, onClearAll, campus }: TripCartSidebarProps) => {
  const { language, formatCurrency } = useLanguage();
  const [openStudents, setOpenStudents] = useState<Record<string, boolean>>({});
  
  const total = items.reduce((sum, item) => sum + item.price, 0);
  
  // Get unique students in cart
  const studentsInCart = Array.from(new Set(items.map(item => item.studentId).filter(Boolean)));
  const studentsList = studentsInCart.map(id => mockStudents.find(s => s.id.toString() === id?.toString())).filter(Boolean);
  
  // Group items by student
  const itemsByStudent = studentsList.map(student => ({
    student,
    items: items.filter(item => item.studentId === student?.id.toString()),
    total: items.filter(item => item.studentId === student?.id.toString()).reduce((sum, item) => sum + item.price, 0)
  }));
  
  const toggleStudent = (studentId: string) => {
    setOpenStudents(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  return (
    <div className="sticky top-6">
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className={`text-lg flex items-center gap-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            <Bus className="h-5 w-5" />
            {language === 'th' ? 'ตะกร้าทัศนศึกษา' : 'Trip Cart'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <Bus className="h-12 w-12 mx-auto text-muted-foreground mb-3 opacity-50" />
              <p className={`text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {language === 'th' ? 'ยังไม่มีทัศนศึกษาในตะกร้า' : 'No trips in cart'}
              </p>
              <p className={`text-xs text-muted-foreground mt-1 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {language === 'th' ? 'Accept ทัศนศึกษาเพื่อเพิ่มลงตะกร้า' : 'Accept trips to add them to cart'}
              </p>
            </div>
          ) : (
            <>
              {/* Campus and Students Info */}
              <div className="bg-primary/5 p-3 rounded-lg space-y-2">
                <div>
                  <p className={`text-xs text-muted-foreground mb-1 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                    Campus
                  </p>
                  <p className={`font-medium text-sm ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                    {campus}
                  </p>
                </div>
                
                {/* Students Color Legend */}
                {studentsList.length > 0 && (
                  <div>
                    <p className={`text-xs text-muted-foreground mb-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                      {language === 'th' ? 'นักเรียน' : 'Students'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {studentsList.map(student => (
                        <Badge 
                          key={student?.id} 
                          variant="outline" 
                          className={`text-xs border ${student?.color}`}
                        >
                          {student?.avatar} {student?.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Important Note */}
              <div className="bg-warning-orange/10 border border-warning-orange/20 p-3 rounded-lg flex gap-2">
                <AlertCircle className="h-4 w-4 text-warning-orange flex-shrink-0 mt-0.5" />
                <p className={`text-xs text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {language === 'th' 
                    ? 'ทัศนศึกษาแยกจากค่าเล่าเรียน และไม่สามารถชำระแยก Campus ได้' 
                    : 'Trips are separate from tuition and cannot be paid across campuses'}
                </p>
              </div>

              <Separator />

              {/* Cart Items Grouped by Student */}
              <div className="space-y-3 max-h-[350px] overflow-y-auto">
                {itemsByStudent.map(({ student, items: studentItems, total: studentTotal }) => {
                  const studentColor = student?.color || "bg-muted/30 border-muted text-foreground";
                  const isOpen = openStudents[student?.id.toString() || ''] ?? true;
                  
                  return (
                    <Collapsible
                      key={student?.id}
                      open={isOpen}
                      onOpenChange={() => toggleStudent(student?.id.toString() || '')}
                      className="space-y-2"
                    >
                      <CollapsibleTrigger asChild>
                        <button className={`w-full flex items-center justify-between p-3 rounded-lg border-2 hover:bg-opacity-20 transition-all ${studentColor}`}>
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{student?.avatar}</span>
                            <div className="text-left">
                              <p className={`font-semibold text-sm ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                {student?.name}
                              </p>
                              <p className={`text-xs text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                {studentItems.length} {language === 'th' ? 'รายการ' : 'trips'} • {formatCurrency(studentTotal)}
                              </p>
                            </div>
                          </div>
                          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
                        </button>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent className="space-y-2 pl-2">
                        {studentItems.map((item) => (
                          <div 
                            key={`${item.id}-${item.studentId}`} 
                            className={`flex items-start gap-3 p-3 rounded-lg border ${studentColor}`}
                          >
                            <div className="flex-1 min-w-0">
                              <h4 className={`font-medium text-sm mb-1 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                {item.name}
                              </h4>
                              
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                <Calendar className="h-3 w-3" />
                                <span>{item.date}</span>
                              </div>
                              
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                <MapPin className="h-3 w-3" />
                                <span className="truncate">{item.location}</span>
                              </div>
                              
                              <div className={`text-sm font-bold text-primary ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                {formatCurrency(item.price)}
                              </div>
                            </div>
                            
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onRemoveItem(item.id)}
                              className="text-muted-foreground hover:text-destructive p-1 h-8 w-8 flex-shrink-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </div>

              <Separator />

              {/* Total */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className={`text-sm text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                    {language === 'th' ? 'รายการ' : 'Trips'}: {items.length}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-primary/5 rounded-lg">
                  <span className={`font-semibold ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                    {language === 'th' ? 'ยอดรวม' : 'Total'}
                  </span>
                  <span className={`text-xl font-bold text-primary ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                {onClearAll && items.length > 0 && (
                  <Button 
                    onClick={onClearAll} 
                    variant="outline"
                    className={`w-full ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
                  >
                    <X className="h-4 w-4 mr-2" />
                    {language === 'th' ? 'ล้างรายการทั้งหมด' : 'Clear All'}
                  </Button>
                )}
                
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};