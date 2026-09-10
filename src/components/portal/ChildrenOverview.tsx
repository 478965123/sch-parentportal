import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, AlertTriangle, Calendar, DollarSign, Clock, Sun, GraduationCap, Bus } from "lucide-react";
import { mockStudents, mockInvoices, mockECAInvoices, mockTripInvoices, mockExamInvoices, mockSchoolBusInvoices, getMockDataForStudent } from "@/data/mockData";
import { useLanguage } from "@/contexts/LanguageContext";

export const ChildrenOverview = () => {
  const [open, setOpen] = useState(false);
  const { t, language, formatCurrency } = useLanguage();

  // Get all overdue invoices across all types - matching system tabs
  const getOverdueInvoices = () => {
    const allInvoices = [
      ...mockInvoices.map(inv => ({ ...inv, type: language === 'th' ? 'ค่าเทอม' : language === 'zh' ? '学费' : 'Tuition', icon: DollarSign, color: 'text-blue-600' })),
      ...mockECAInvoices.map(inv => ({ ...inv, type: 'ECA', icon: Clock, color: 'text-purple-600' })),
      ...mockTripInvoices.map(inv => ({ ...inv, type: language === 'th' ? 'ทริปและกิจกรรม' : language === 'zh' ? '旅行和活动' : 'Trip & Activity', icon: Sun, color: 'text-orange-600' })),
      ...mockExamInvoices.map(inv => ({ ...inv, type: language === 'th' ? 'สอบ' : language === 'zh' ? '考试' : 'Exam', icon: GraduationCap, color: 'text-green-600' })),
      ...mockSchoolBusInvoices.map(inv => ({ ...inv, type: language === 'th' ? 'รถรับส่ง' : language === 'zh' ? '校车' : 'School Bus', icon: Bus, color: 'text-indigo-600' }))
    ];

    const overdue = allInvoices.filter(inv => inv.status === 'overdue');
    return overdue.map(inv => {
      const student = mockStudents.find(s => s.id === inv.student_id);
      return { ...inv, studentName: student?.name, studentAvatar: student?.avatar };
    });
  };

  // Get upcoming due invoices (within 7 days) - matching system tabs
  const getUpcomingDue = () => {
    const today = new Date();
    const sevenDaysLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const allInvoices = [
      ...mockInvoices.map(inv => ({ ...inv, type: language === 'th' ? 'ค่าเทอม' : language === 'zh' ? '学费' : 'Tuition', icon: DollarSign, color: 'text-blue-600' })),
      ...mockECAInvoices.map(inv => ({ ...inv, type: 'ECA', icon: Clock, color: 'text-purple-600' })),
      ...mockTripInvoices.map(inv => ({ ...inv, type: language === 'th' ? 'ทริปและกิจกรรม' : language === 'zh' ? '旅行和活动' : 'Trip & Activity', icon: Sun, color: 'text-orange-600' })),
      ...mockExamInvoices.map(inv => ({ ...inv, type: language === 'th' ? 'สอบ' : language === 'zh' ? '考试' : 'Exam', icon: GraduationCap, color: 'text-green-600' })),
      ...mockSchoolBusInvoices.map(inv => ({ ...inv, type: language === 'th' ? 'รถรับส่ง' : language === 'zh' ? '校车' : 'School Bus', icon: Bus, color: 'text-indigo-600' }))
    ];

    const upcoming = allInvoices.filter(inv => {
      if (inv.status !== 'pending') return false;
      const dueDate = new Date(inv.due_date);
      return dueDate >= today && dueDate <= sevenDaysLater;
    });

    return upcoming.map(inv => {
      const student = mockStudents.find(s => s.id === inv.student_id);
      const daysUntilDue = Math.ceil((new Date(inv.due_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return { ...inv, studentName: student?.name, studentAvatar: student?.avatar, daysUntilDue };
    });
  };

  // Get upcoming activities (mock data - in real app would come from enrolled activities)
  const getUpcomingActivities = () => {
    const activities = [];

    mockStudents.forEach(student => {
      const studentData = getMockDataForStudent(student.id);

      // Add enrolled courses (ECA)
      studentData.courses.slice(0, 2).forEach(course => {
        activities.push({
          id: course.id,
          name: course.name,
          type: 'ECA',
          icon: Clock,
          schedule: course.schedule,
          studentName: student.name,
          studentAvatar: student.avatar
        });
      });
    });

    return activities.slice(0, 5); // Limit to 5 items
  };

  const overdueInvoices = getOverdueInvoices();
  const upcomingDue = getUpcomingDue();
  const upcomingActivities = getUpcomingActivities();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={`gap-2 relative ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
          <Bell className="h-4 w-4" />
          {language === 'th' ? 'ภาพรวมสำคัญ' : language === 'zh' ? '重要概览' : 'Important Overview'}
          {overdueInvoices.length > 0 && (
            <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              {overdueInvoices.length > 9 ? '9+' : overdueInvoices.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
            <Bell className="h-5 w-5" />
            {language === 'th' ? 'ภาพรวมสำคัญ' : language === 'zh' ? '重要概览' : 'Important Overview'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 1. Overdue Invoices */}
          <Card className="border-2 border-destructive/20">
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 text-destructive ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                <AlertTriangle className="h-5 w-5" />
                {language === 'th' ? '🚨 รายการค้างชำระ' : language === 'zh' ? '🚨 逾期付款' : '🚨 Overdue Payments'}
                {overdueInvoices.length > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {overdueInvoices.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {overdueInvoices.length === 0 ? (
                <div className={`text-center py-8 text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  ✅ {language === 'th' ? 'ไม่มีรายการค้างชำระ' : language === 'zh' ? '没有逾期付款' : 'No overdue payments'}
                </div>
              ) : (
                <div className="space-y-3">
                  {overdueInvoices.map((invoice) => {
                    const Icon = invoice.icon;
                    const daysPastDue = Math.ceil((new Date().getTime() - new Date(invoice.due_date).getTime()) / (1000 * 60 * 60 * 24));
                    return (
                      <div key={`${invoice.type}-${invoice.id}`} className="flex items-center justify-between p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-destructive" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                {invoice.studentAvatar} {invoice.studentName}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {invoice.type}
                              </Badge>
                            </div>
                            <p className={`font-medium text-sm ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                              {invoice.description}
                            </p>
                            <p className={`text-xs text-destructive ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                              {language === 'th' ? `เกินกำหนด ${daysPastDue} วัน` : language === 'zh' ? `逾期 ${daysPastDue} 天` : `${daysPastDue} days overdue`}
                            </p>
                          </div>
                        </div>
                        <div className={`text-right ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                          <p className="font-bold text-destructive">{formatCurrency(invoice.amount_due)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 2. Upcoming Due (within 7 days) */}
          <Card className="border-2 border-warning-orange/20">
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 text-warning-orange ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                <Bell className="h-5 w-5" />
                {language === 'th' ? '🔔 การแจ้งเตือนสำคัญ' : language === 'zh' ? '🔔 重要通知' : '🔔 Important Notifications'}
                {upcomingDue.length > 0 && (
                  <Badge className="ml-2 bg-warning-orange/20 text-warning-orange">
                    {upcomingDue.length}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingDue.length === 0 ? (
                <div className={`text-center py-8 text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  ✅ {language === 'th' ? 'ไม่มีรายการที่ใกล้ครบกำหนด' : language === 'zh' ? '没有即将到期的付款' : 'No upcoming payments'}
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingDue.map((invoice) => {
                    const Icon = invoice.icon;
                    return (
                      <div key={`${invoice.type}-${invoice.id}`} className="flex items-center justify-between p-4 bg-warning-orange/5 rounded-lg border border-warning-orange/20">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 rounded-full bg-warning-orange/10 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-warning-orange" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                {invoice.studentAvatar} {invoice.studentName}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {invoice.type}
                              </Badge>
                            </div>
                            <p className={`font-medium text-sm ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                              {invoice.description}
                            </p>
                            <p className={`text-xs text-warning-orange ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                              {language === 'th' ? `ครบกำหนดใน ${invoice.daysUntilDue} วัน` : language === 'zh' ? `${invoice.daysUntilDue} 天后到期` : `Due in ${invoice.daysUntilDue} days`}
                            </p>
                          </div>
                        </div>
                        <div className={`text-right ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                          <p className="font-bold text-warning-orange">{formatCurrency(invoice.amount_due)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 3. Upcoming Activities */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                <Calendar className="h-5 w-5" />
                {language === 'th' ? '📅 กิจกรรมที่กำลังจะมาถึง' : language === 'zh' ? '📅 即将到来的活动' : '📅 Upcoming Activities'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingActivities.length === 0 ? (
                <div className={`text-center py-8 text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                  {language === 'th' ? 'ไม่มีกิจกรรมที่กำลังจะมาถึง' : language === 'zh' ? '没有即将到来的活动' : 'No upcoming activities'}
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingActivities.map((activity) => {
                    const Icon = activity.icon;
                    return (
                      <div key={activity.id} className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                              {activity.studentAvatar} {activity.studentName}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {activity.type}
                            </Badge>
                          </div>
                          <p className={`font-medium text-sm ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                            {activity.name}
                          </p>
                          <p className={`text-xs text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                            {activity.schedule}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};