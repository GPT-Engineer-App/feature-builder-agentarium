import React from 'react';
import { toast } from "sonner";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    let errorMessage = 'An unexpected error occurred';
    if (error && typeof error === 'object') {
      errorMessage = error.message || errorMessage;
      if (error.stack) {
        console.error('Error stack:', error.stack);
      }
    }
    // Check if error has a 'frame' property before accessing it
    if (error && error.frame) {
      console.error('Error frame:', error.frame);
    }
    toast.error(errorMessage);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-red-100">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-800 mb-4">Oops! Something went wrong.</h1>
            <p className="text-red-600 mb-4">We're sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
