import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#040506] text-white">
          <div className="max-w-md w-full p-8 rounded-2xl bg-zinc-900/80 border border-white/10 backdrop-blur-xl text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl font-bold">
              !
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              حدث خطأ غير متوقع / Something went wrong
            </h2>
            <p className="text-sm text-zinc-400">
              {this.state.error?.message || 'Please refresh the page to restore display.'}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                إعادة تحميل الصفحة / Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
