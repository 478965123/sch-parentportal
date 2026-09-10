import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { X, CheckCircle2, ArrowLeft, Ticket } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PaymentProgressBar } from "./PaymentProgressBar";

interface CartItem {
  id: string;
  name: string;
  price: number;
  type: 'course' | 'activity';
  studentName?: string;
}

interface CreditNote {
  id: number;
  student_id: number;
  balance: number;
  items: { title: string; amount: number; }[];
}

interface CartViewProps {
  items: CartItem[];
  creditNotes: CreditNote[];
  onRemoveItem: (itemId: string) => void;
  onCheckout: (selectedItems: CartItem[], selectedCreditNotes: CreditNote[], totalCreditApplied: number) => void;
  onBack: () => void;
}

export const CartView = ({ items, creditNotes, onRemoveItem, onCheckout, onBack }: CartViewProps) => {
  const { t, language, formatCurrency } = useLanguage();
  const [selectedItems, setSelectedItems] = useState<string[]>(items.map(item => item.id));
  const [useCreditNote, setUseCreditNote] = useState(true);
  const [selectedCreditNotes, setSelectedCreditNotes] = useState<number[]>([]);

  const handleSelectAll = () => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(item => item.id));
    }
  };

  const handleItemSelect = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const selectedCartItems = items.filter(item => selectedItems.includes(item.id));
  const subtotal = selectedCartItems.reduce((sum, item) => sum + item.price, 0);
  
  // Calculate total available credit
  const totalAvailableCredit = creditNotes.reduce((sum, note) => sum + note.balance, 0);

  // Calculate total credit applied from selected credit notes only
  const totalCreditApplied = useCreditNote
    ? selectedCreditNotes.reduce((sum, noteId) => {
        const note = creditNotes.find(n => n.id === noteId);
        return sum + (note?.balance || 0);
      }, 0)
    : 0;
  
  const finalTotal = Math.max(0, subtotal - totalCreditApplied);

  const handleUseCreditNoteToggle = (checked: boolean) => {
    setUseCreditNote(checked);
    if (!checked) {
      setSelectedCreditNotes([]);
    }
  };

  const toggleCreditNote = (noteId: number) => {
    setSelectedCreditNotes(prev =>
      prev.includes(noteId)
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    );
  };

  // Group items by student
  const groupedItems = items.reduce((groups, item) => {
    const studentName = item.studentName || 'Unknown Student';
    if (!groups[studentName]) {
      groups[studentName] = [];
    }
    groups[studentName].push(item);
    return groups;
  }, {} as Record<string, CartItem[]>);

  const handleCheckout = () => {
    if (selectedCartItems.length > 0) {
      // Get selected credit note objects
      const selectedCreditNoteObjects = creditNotes.filter(note =>
        selectedCreditNotes.includes(note.id)
      );
      onCheckout(selectedCartItems, selectedCreditNoteObjects, totalCreditApplied);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink 
                onClick={onBack}
                className={`cursor-pointer ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
              >
                {t('portal.dashboard')}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
                {t('portal.cart')}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Progress Bar */}
        <PaymentProgressBar currentStep={1} />

        {items.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className={`text-lg font-medium mb-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {t('portal.cartEmpty')}
              </h3>
              <p className={`text-muted-foreground mb-4 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                {t('portal.addItemsToCart')}
              </p>
              <Button onClick={onBack} variant="outline" className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('common.back')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Select All Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={selectedItems.length === items.length}
                    onCheckedChange={handleSelectAll}
                    id="select-all"
                  />
                  <label 
                    htmlFor="select-all"
                    className={`text-sm font-medium cursor-pointer ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
                  >
                    {selectedItems.length}/{items.length} {t('portal.itemsSelected')}
                  </label>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => items.forEach(item => onRemoveItem(item.id))}
                    className={`text-destructive hover:text-destructive ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
                  >
                    <X className="h-4 w-4 mr-1" />
                    {language === 'th' ? 'ล้างทั้งหมด' : 'Clear All'}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleSelectAll} className={language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}>
                    {t('portal.selectAll')}
                  </Button>
                </div>
              </div>

              {/* Items by Student */}
              {Object.entries(groupedItems).map(([studentName, studentItems]) => (
                <Card key={studentName}>
                  <CardHeader className="pb-3">
                    <CardTitle className={`text-base ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                      {studentName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {studentItems.map((item, index) => (
                        <div key={item.id}>
                          {index > 0 && <Separator className="my-4" />}
                          <div className="flex items-start space-x-4">
                            <Checkbox
                              checked={selectedItems.includes(item.id)}
                              onCheckedChange={() => handleItemSelect(item.id)}
                              className="mt-1"
                            />
                            
                            {/* Item Details */}
                            <div className="flex-1 min-w-0">
                              <h4 className={`font-medium text-sm mb-1 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                {item.name}
                              </h4>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary" className={`text-xs ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                  {item.type === 'course' ? t('portal.afterSchool') : t('portal.summerActivity')}
                                </Badge>
                              </div>
                              <div className={`text-lg font-bold text-primary ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                {formatCurrency(item.price)}
                              </div>
                            </div>
                            
                            {/* Remove Button */}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onRemoveItem(item.id)}
                              className="text-muted-foreground hover:text-destructive p-1 min-w-8 h-8"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {/* Credit Notes Card */}
              {creditNotes.filter(cn => cn.balance > 0).length > 0 && (
                <Card className="border-2 border-primary/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className={`text-base flex items-center gap-2 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        <Ticket className="h-5 w-5 text-primary" />
                        {language === 'th' ? 'ใบลดหนี้ (Credit Note)' : 'Credit Notes'}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Switch
                          id="use-credit"
                          checked={useCreditNote}
                          onCheckedChange={handleUseCreditNoteToggle}
                        />
                        <Label 
                          htmlFor="use-credit" 
                          className={`text-sm cursor-pointer ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
                        >
                          {language === 'th' ? 'ใช้ใบลดหนี้' : 'Use Credit'}
                        </Label>
                      </div>
                    </div>
                  </CardHeader>
                  {useCreditNote && (
                    <CardContent className="pt-0 space-y-3">
                      {/* Manual selection message */}
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className={`text-xs text-blue-700 font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                          {language === 'th'
                            ? 'เลือกใบลดหนี้ที่ต้องการใช้'
                            : 'Select credit notes to apply'}
                        </p>
                      </div>
                      
                      {creditNotes.filter(cn => cn.balance > 0).map((note) => (
                        <div
                          key={note.id}
                          className={`p-3 rounded-lg border-2 transition-all cursor-pointer ${
                            selectedCreditNotes.includes(note.id)
                              ? 'border-primary bg-primary/5'
                              : 'border-muted hover:border-primary/50'
                          }`}
                          onClick={() => toggleCreditNote(note.id)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Checkbox
                                  checked={selectedCreditNotes.includes(note.id)}
                                  onCheckedChange={() => toggleCreditNote(note.id)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <span className={`text-sm font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                  {language === 'th' ? 'ใบลดหนี้' : 'Credit Note'} #{note.id}
                                </span>
                              </div>
                            </div>
                            <div className={`text-right ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                              <div className="text-lg font-bold text-primary">
                                {formatCurrency(note.balance)}
                              </div>
                            </div>
                          </div>
                          
                          {note.items.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-muted space-y-1">
                              {note.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-xs">
                                  <span className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                    {item.title}
                                  </span>
                                  <span className={`font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                                    {formatCurrency(item.amount)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  )}
                </Card>
              )}
            </div>

            {/* Right Side - Summary */}
            <div className="space-y-6">
              {/* Price Details */}
              <Card>
                <CardHeader>
                  <CardTitle className={`text-lg ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                    {t('portal.priceDetails')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {selectedItems.length} {t('portal.items')} {language === 'th' ? 'ที่เลือก' : language === 'zh' ? '已选择' : 'selected'}
                      </span>
                      <span className={`font-medium ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {formatCurrency(subtotal)}
                      </span>
                    </div>
                    
                    {totalCreditApplied > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className={`text-muted-foreground ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                          {language === 'th' ? 'Credit note(s) applied' : 'Credit note(s) applied'}
                        </span>
                        <span className={`font-medium text-green-600 ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                          - {formatCurrency(totalCreditApplied)}
                        </span>
                      </div>
                    )}
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      <span className={`font-semibold ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {t('portal.totalAmount')}
                      </span>
                      <span className={`text-xl font-bold text-primary ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                        {formatCurrency(finalTotal)}
                      </span>
                    </div>
                  </div>
                  
                  {useCreditNote && finalTotal <= 0 && (
                    <div className={`text-sm text-destructive text-center bg-destructive/10 p-2 rounded ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}>
                      {language === 'th' ? 'ยอดเครดิตครอบคลุมค่าใช้จ่ายทั้งหมดแล้ว ไม่สามารถชำระได้' : 'Credit covers the full amount. Payment is not required.'}
                    </div>
                  )}
                  <Button
                    onClick={handleCheckout}
                    className={`w-full h-12 text-base ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
                    disabled={selectedItems.length === 0 || (useCreditNote && finalTotal <= 0)}
                  >
                    {t('portal.proceedToCheckout')}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={onBack} 
                    className={`w-full ${language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato'}`}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    {t('common.back')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};