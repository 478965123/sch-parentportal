import { useLanguage } from "@/contexts/LanguageContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Phone, Mail, Info } from "lucide-react";

interface AccountSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AccountSettingsDialog = ({ open, onOpenChange }: AccountSettingsDialogProps) => {
  const { language } = useLanguage();
  const fontClass = language === 'th' ? 'font-sukhumvit' : language === 'zh' ? 'font-noto-sc' : 'font-lato';

  const profile = {
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@email.com",
    phone: "+66 81 234 5678",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle className={`flex items-center gap-2 ${fontClass}`}>
            <User className="h-5 w-5" />
            {language === 'th' ? 'ตั้งค่าบัญชี' : language === 'zh' ? '账户设置' : 'Account Settings'}
          </DialogTitle>
        </DialogHeader>

        {/* Avatar + Name */}
        <div className="flex items-center gap-4 py-2">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
              {profile.firstName[0]}{profile.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className={`font-semibold text-base ${fontClass}`}>{profile.firstName} {profile.lastName}</p>
            <p className={`text-sm text-muted-foreground ${fontClass}`}>{profile.email}</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-4 pt-1">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className={fontClass}>{language === 'th' ? 'ชื่อ' : 'First Name'}</Label>
              <Input
                value={profile.firstName}
                disabled
                className={`${fontClass} bg-muted`}
              />
            </div>
            <div className="space-y-1.5">
              <Label className={fontClass}>{language === 'th' ? 'นามสกุล' : 'Last Name'}</Label>
              <Input
                value={profile.lastName}
                disabled
                className={`${fontClass} bg-muted`}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className={`flex items-center gap-1.5 ${fontClass}`}>
              <Mail className="h-3.5 w-3.5" />
              {language === 'th' ? 'อีเมล' : 'Email'}
            </Label>
            <Input
              type="email"
              value={profile.email}
              disabled
              className={`${fontClass} bg-muted`}
            />
          </div>

          <div className="space-y-1.5">
            <Label className={`flex items-center gap-1.5 ${fontClass}`}>
              <Phone className="h-3.5 w-3.5" />
              {language === 'th' ? 'เบอร์โทร' : 'Phone'}
            </Label>
            <Input
              type="tel"
              value={profile.phone}
              disabled
              className={`${fontClass} bg-muted`}
            />
          </div>

          {/* Admin contact notice */}
          <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <Info className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
            <p className={`text-sm text-amber-700 ${fontClass}`}>
              {language === 'th'
                ? 'หากต้องการแก้ไขข้อมูล กรุณาติดต่อแอดมิน'
                : language === 'zh'
                ? '如需修改信息，请联系管理员'
                : 'To edit your information, please contact the admin.'}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
