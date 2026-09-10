import { LanguageSelector } from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { LogoBadge } from "@/components/LogoBadge";
import { Button } from "@/components/ui/button";
import { LogIn, UserPlus } from "lucide-react";
import loginWallpaper from "@/assets/login-wallpaper.png";

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
        className="hidden lg:block lg:w-[65%] fixed h-screen left-0 top-0 bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${loginWallpaper})`, backgroundColor: "#f7f9fd" }}
      >
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center z-10 max-w-lg px-4">
          <p className="text-xs text-gray-400">© 2024 Schooney Educational System</p>
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
          <div className="relative w-full login-card-glow" style={{ maxWidth: 400 }}>
          <div
            className="relative bg-white rounded-2xl"
            style={{
              boxShadow:
                "0 0 0 5px rgba(255,255,255,0.9), 0 0 0 6px rgba(255,255,255,0.5), 0 12px 44px rgba(99,102,241,0.28), 0 0 70px rgba(56,189,248,0.25)",
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
