import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowRight, Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface LoginFormProps {
  onSubmitEmail: (email: string, password: string) => void;
  onSignUp: () => void;
  onForgotPassword: () => void;
}

export const LoginForm = ({ onSubmitEmail, onSignUp, onForgotPassword }: LoginFormProps) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useLanguage();

  const loginSchema = z.object({
    email: z.string().email(t('auth.errors.emailInvalid')),
    password: z.string().min(1, t('auth.errors.passwordRequired')),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<{ email: string; password: string }>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    setLoading(true);

    // Mock sending OTP delay
    setTimeout(() => {
      setLoading(false);
      onSubmitEmail(data.email, data.password);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            {t('auth.email')}
          </Label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/60" />
            <Input
              id="email"
              type="email"
              placeholder={t('auth.emailPlaceholder')}
              {...register("email")}
              className={`h-12 pl-11 text-[15px] rounded-lg border-gray-300
                focus:ring-2 focus:ring-primary/20 focus:border-primary
                transition-all duration-200
                ${errors.email ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : ""}`}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-foreground">
            {t('auth.password')}
          </Label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/60" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("password")}
              className={`h-12 pl-11 pr-12 text-[15px] rounded-lg border-gray-300
                focus:ring-2 focus:ring-primary/20 focus:border-primary
                transition-all duration-200
                ${errors.password ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" : ""}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-500 flex items-center gap-1 mt-1">
              {errors.password.message}
            </p>
          )}
          <div className="text-right">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-primary hover:text-primary/80 font-medium underline underline-offset-4 transition-colors"
            >
              {t('auth.forgotPassword')}?
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-[15px] font-semibold rounded-lg
            bg-blue-500 hover:bg-blue-600
            transition-colors duration-200
            active:scale-[0.98]
            group"
          disabled={isSubmitting || loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {t('auth.sendingOTP')}
            </>
          ) : (
            <>
              {t('auth.continue')}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
            </>
          )}
        </Button>
      </form>

      <div className="text-center text-sm pt-2">
        <span className="text-muted-foreground">{t('auth.noAccount')} </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSignUp}
          className="text-primary hover:text-primary/80 hover:bg-primary/5 p-0 h-auto font-semibold underline underline-offset-4"
        >
          {t('auth.signUpHere')}
        </Button>
      </div>
    </div>
  );
};
