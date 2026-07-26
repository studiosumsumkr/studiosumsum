import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export interface ErrorBoundaryProps {
  children?: ReactNode;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  declare props: ErrorBoundaryProps;
  declare state: ErrorBoundaryState;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in component tree:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md bg-neutral-900 border border-neutral-800 p-8 shadow-2xl space-y-5">
            <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-sm font-display font-black uppercase tracking-[0.2em] text-white">
                일시적인 오류가 발생했습니다
              </h2>
              <p className="text-xs text-neutral-400 leading-relaxed">
                안전하게 데이터를 보호하기 위해 화면을 복구하고 있습니다. 아래 버튼을 눌러 다시 시도해 주세요.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-black/50 p-3 text-[10px] font-mono text-rose-400 border border-neutral-800 rounded text-left overflow-x-auto max-h-28">
                {this.state.error.toString()}
              </div>
            )}

            <button
              onClick={this.handleReload}
              className="w-full py-3 bg-white text-black hover:bg-neutral-200 text-[10px] font-display font-extrabold uppercase tracking-widest flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>페이지 새로고침 (Reload Page)</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
