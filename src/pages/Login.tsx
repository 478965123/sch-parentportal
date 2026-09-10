import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { LogoBadge } from "@/components/LogoBadge";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";
import schoolBuilding from "@/assets/school-building-new.jpg";

interface LoginProps {
  onLogin: () => void;
  onRegister: () => void;
}

export const Login = ({ onLogin, onRegister }: LoginProps) => {
  const { t, getFontClass, language } = useLanguage();

  return (
    <div className="min-h-screen flex">
      {/* Left Side — 65% */}
      <div
        className="hidden lg:block lg:w-[65%] fixed h-screen left-0 top-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${schoolBuilding})` }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center text-white z-10 max-w-lg px-4">
          <h2 className="text-2xl font-bold mb-2">Parent Portal</h2>
          <p className="text-lg mb-2">Manage your child's education journey</p>
          <p className="text-xs opacity-70">© 2024 Schooney Educational System</p>
        </div>
      </div>

      {/* Right Side — 35% */}
      <div className={`w-full lg:w-[35%] lg:ml-[65%] flex flex-col min-h-screen bg-gray-50 ${getFontClass()}`}>

        {/* Language Selector */}
        <div className="flex justify-end px-6 pt-5">
          <LanguageSelector />
        </div>

        {/* Centered Card */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div
            className="w-full bg-white rounded-2xl"
            style={{
              maxWidth: 400,
              boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
              padding: "32px 40px",
            }}
          >
            {/* Logo */}
            <div className="flex justify-center mb-6 mt-6">
              <LogoBadge imgClassName="w-[260px] max-w-full h-auto" />
            </div>

            {/* Title */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {language === 'th' ? 'ยินดีต้อนรับ' : language === 'zh' ? '欢迎' : 'Welcome'}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {language === 'th' ? 'เข้าสู่ระบบผู้ปกครอง' : language === 'zh' ? '进入家长门户' : 'Parent Portal'}
              </p>
            </div>

            {/* SSO Login Button */}
            <Button
              onClick={onLogin}
              size="lg"
              className="w-full text-base py-6"
            >
              <LogIn className="h-5 w-5 mr-2" />
              {language === 'th' ? 'เข้าสู่ระบบ' : language === 'zh' ? '登录系统' : 'Enter Portal'}
            </Button>

            {/* New Student Registration Button */}
            <Button
              onClick={onRegister}
              variant="outline"
              size="lg"
              className="w-full text-base py-6 mt-3"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              {language === 'th' ? 'ลงทะเบียนนักเรียนใหม่' : language === 'zh' ? '新生注册' : 'New Student Registration'}
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 pb-6 space-y-0.5">
          <p>Secure authentication powered by your school</p>
          <p>© 2024 Schooney Educational System</p>
        </div>
      </div>
    </div>
  );
};
