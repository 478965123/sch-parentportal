import { AlertCircle, XCircle, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  variant?: "default" | "destructive";
  className?: string;
}

export const ErrorMessage = ({
  title = "Error",
  message,
  onRetry,
  variant = "destructive",
  className
}: ErrorMessageProps) => {
  return (
    <Alert variant={variant} className={cn("", className)}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex items-center justify-between gap-4">
        <span className="flex-1">{message}</span>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="shrink-0 gap-2"
          >
            <RefreshCcw className="h-3 w-3" />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState = ({
  title = "Something went wrong",
  message,
  onRetry,
  className
}: ErrorStateProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
        <XCircle className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RefreshCcw className="h-4 w-4" />
          Try Again
        </Button>
      )}
    </div>
  );
};
