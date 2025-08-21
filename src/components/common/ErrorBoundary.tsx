import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // eslint-disable-next-line no-console
    console.error('App crashed:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
          <div className="max-w-lg w-full bg-white border border-red-200 rounded-xl p-6 shadow-sm">
            <h1 className="text-xl font-semibold text-red-700">Something went wrong</h1>
            <p className="text-sm text-gray-600 mt-2">An unexpected error occurred. Please try reloading the page.</p>
            {this.state.error && (
              <pre className="mt-4 p-3 bg-red-50 text-red-700 text-xs rounded overflow-auto">
                {this.state.error.message}
              </pre>
            )}
            <button onClick={this.handleReload} className="mt-4 inline-flex px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
