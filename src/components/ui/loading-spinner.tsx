import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export const LoadingSpinner = ({ size = "md", className, text }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <LoaderCircle className={cn("animate-spin text-primary", sizeClasses[size])} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
};

interface LoadingOverlayProps {
  text?: string;
  transparent?: boolean;
}

export const LoadingOverlay = ({ text, transparent = false }: LoadingOverlayProps) => {
  return (
    <div className={cn(
      "absolute inset-0 flex items-center justify-center z-50",
      transparent ? "bg-background/50" : "bg-background/80 backdrop-blur-sm"
    )}>
      <LoadingSpinner size="lg" text={text} />
    </div>
  );
};
