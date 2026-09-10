import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";
import { Mail, ArrowLeft, ShieldCheck, Loader2, RefreshCw } from "lucide-react";

interface OTPVerificationProps {
  email: string;
  onVerify: () => void;
  onBackToEmail: () => void;
}

export const OTPVerification = ({ email, onVerify, onBackToEmail }: OTPVerificationProps) => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({
        title: t('auth.errors.otpInvalid'),
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    
    // Mock verification delay
    setTimeout(() => {
      setIsVerifying(false);
      onVerify();
    }, 1500);
  };

  const handleResendOTP = () => {
    setCanResend(false);
    setCountdown(60);
    setOtp("");
    
    toast({
      title: t('auth.otpResent'),
      description: t('auth.otpResentMessage'),
    });
  };

  return (
    <div className="space-y-6">
      {/* Email Sent Icon & Info */}
      <div className="space-y-4 text-center animate-fade-in lg:animate-none">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            {t('auth.otpSentTo')}
          </p>
          <p className="font-semibold text-foreground">{email}</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* OTP Input */}
        <div className="space-y-3 animate-fade-in lg:animate-none" style={{ animationDelay: '0.1s' }}>
          <Label htmlFor="otp" className="text-center block text-sm font-medium text-foreground">
            {t('auth.enterOTP')}
          </Label>
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
              className="gap-2 lg:gap-3"
            >
              <InputOTPGroup className="gap-2 lg:gap-3">
                <InputOTPSlot 
                  index={0} 
                  className="w-11 h-12 lg:w-12 lg:h-14 text-lg font-semibold rounded-xl border-border/60 
                    bg-background/50 lg:bg-background
                    focus:ring-2 focus:ring-primary/20 focus:border-primary
                    transition-all duration-200"
                />
                <InputOTPSlot 
                  index={1} 
                  className="w-11 h-12 lg:w-12 lg:h-14 text-lg font-semibold rounded-xl border-border/60 
                    bg-background/50 lg:bg-background
                    focus:ring-2 focus:ring-primary/20 focus:border-primary
                    transition-all duration-200"
                />
                <InputOTPSlot 
                  index={2} 
                  className="w-11 h-12 lg:w-12 lg:h-14 text-lg font-semibold rounded-xl border-border/60 
                    bg-background/50 lg:bg-background
                    focus:ring-2 focus:ring-primary/20 focus:border-primary
                    transition-all duration-200"
                />
                <InputOTPSlot 
                  index={3} 
                  className="w-11 h-12 lg:w-12 lg:h-14 text-lg font-semibold rounded-xl border-border/60 
                    bg-background/50 lg:bg-background
                    focus:ring-2 focus:ring-primary/20 focus:border-primary
                    transition-all duration-200"
                />
                <InputOTPSlot 
                  index={4} 
                  className="w-11 h-12 lg:w-12 lg:h-14 text-lg font-semibold rounded-xl border-border/60 
                    bg-background/50 lg:bg-background
                    focus:ring-2 focus:ring-primary/20 focus:border-primary
                    transition-all duration-200"
                />
                <InputOTPSlot 
                  index={5} 
                  className="w-11 h-12 lg:w-12 lg:h-14 text-lg font-semibold rounded-xl border-border/60 
                    bg-background/50 lg:bg-background
                    focus:ring-2 focus:ring-primary/20 focus:border-primary
                    transition-all duration-200"
                />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>

        {/* Verify Button */}
        <div className="animate-fade-in lg:animate-none" style={{ animationDelay: '0.2s' }}>
          <Button
            onClick={handleVerify}
            className="w-full h-12 text-base font-semibold rounded-xl
              bg-gradient-to-r from-primary to-primary/85
              hover:from-primary/95 hover:to-primary/80
              shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30
              transition-all duration-300
              active:scale-[0.98]
              group"
            disabled={isVerifying || otp.length !== 6}
          >
            {isVerifying ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {t('auth.verifying')}
              </>
            ) : (
              <>
                <ShieldCheck className="mr-2 h-5 w-5" />
                {t('auth.verify')}
              </>
            )}
          </Button>
        </div>

        {/* Resend Section */}
        <div className="text-center space-y-2 animate-fade-in lg:animate-none" style={{ animationDelay: '0.3s' }}>
          <p className="text-sm text-muted-foreground">
            {t('auth.didntReceiveOTP')}
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResendOTP}
            disabled={!canResend}
            className="text-primary hover:text-primary/80 hover:bg-primary/5 font-semibold group"
          >
            {canResend ? (
              <>
                <RefreshCw className="mr-1.5 h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                {t('auth.resendOTP')}
              </>
            ) : (
              <span className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-bold">
                  {countdown}
                </span>
                <span>{t('auth.resendOTPIn').replace(' ', '')}</span>
              </span>
            )}
          </Button>
        </div>

        {/* Back Button */}
        <div className="animate-fade-in lg:animate-none" style={{ animationDelay: '0.4s' }}>
          <Button
            variant="outline"
            onClick={onBackToEmail}
            className="w-full h-11 rounded-xl border-border/60 hover:bg-muted/50 
              transition-all duration-200 active:scale-[0.98] group"
          >
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
            {t('auth.changeEmail')}
          </Button>
        </div>
      </div>
    </div>
  );
};
