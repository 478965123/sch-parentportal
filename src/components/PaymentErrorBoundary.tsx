import React from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Home, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PaymentErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

const PaymentErrorFallback: React.FC<PaymentErrorFallbackProps> = ({ error, resetError }) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/portal');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
      <Card className="max-w-lg w-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-full">
              <AlertCircle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-xl">Payment Error</CardTitle>
              <CardDescription>
                We encountered an error while processing your payment
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <p className="text-sm font-medium">What happened?</p>
            <p className="text-sm text-muted-foreground">
              An unexpected error occurred during the payment process. Your payment may
              not have been processed. Please check your transaction history or try again.
            </p>
          </div>

          {process.env.NODE_ENV === 'development' && (
            <div className="p-3 bg-destructive/10 rounded text-xs text-destructive font-mono">
              {error.toString()}
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm font-medium">What should you do?</p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>Check your transaction history to see if the payment was completed</li>
              <li>Try the payment again if it wasn't processed</li>
              <li>Contact support if you continue experiencing issues</li>
            </ul>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={resetError} className="flex-1 gap-2">
              <RefreshCcw className="h-4 w-4" />
              Try Again
            </Button>
            <Button
              onClick={handleGoBack}
              variant="outline"
              className="flex-1 gap-2"
            >
              <Home className="h-4 w-4" />
              Back to Portal
            </Button>
          </div>

          <div className="pt-2 border-t">
            <p className="text-xs text-muted-foreground text-center">
              Need help? Contact support at{' '}
              <a href="mailto:support@kingscollege.com" className="text-primary hover:underline">
                support@kingscollege.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface PaymentErrorBoundaryProps {
  children: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export const PaymentErrorBoundary: React.FC<PaymentErrorBoundaryProps> = ({
  children,
  onError,
}) => {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log payment errors with special attention
    console.error('Payment Error:', {
      error: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
    });

    // Call custom error handler
    onError?.(error, errorInfo);

    // TODO: Send to error tracking service with payment context
    // trackPaymentError(error, errorInfo);
  };

  return (
    <ErrorBoundary onError={handleError}>
      {children}
    </ErrorBoundary>
  );
};
