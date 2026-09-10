import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Call optional error callback
    this.props.onError?.(error, errorInfo);

    // TODO: Send error to logging service (e.g., Sentry, LogRocket)
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <CardTitle className="text-xl">Something went wrong</CardTitle>
                  <CardDescription>
                    We're sorry, but something unexpected happened
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="p-4 bg-destructive/10 rounded-lg space-y-2">
                  <p className="text-sm font-semibold text-destructive">
                    Error: {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="text-xs text-muted-foreground">
                      <summary className="cursor-pointer hover:text-foreground">
                        Component Stack
                      </summary>
                      <pre className="mt-2 overflow-auto p-2 bg-muted rounded">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={this.handleReset} className="flex-1 gap-2">
                  <RefreshCcw className="h-4 w-4" />
                  Try Again
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex-1 gap-2"
                >
                  <Home className="h-4 w-4" />
                  Go Home
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                If the problem persists, please contact support.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Functional component wrapper for specific use cases
interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  title?: string;
  description?: string;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  title = 'Something went wrong',
  description = 'An error occurred while loading this section',
}) => {
  return (
    <div className="flex items-center justify-center p-8">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-full">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription className="text-sm">{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {process.env.NODE_ENV === 'development' && (
            <div className="p-3 bg-destructive/10 rounded text-sm text-destructive">
              {error.toString()}
            </div>
          )}
          <Button onClick={resetError} className="w-full gap-2" variant="outline">
            <RefreshCcw className="h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
