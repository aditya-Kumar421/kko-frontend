import { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Application rendering failed:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-secondary-950 p-6 text-center text-white">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="mt-2 text-secondary-300">
            Reload the page to try again.
          </p>
          <button
            type="button"
            className="mt-6 rounded-lg bg-primary-600 px-4 py-2 hover:bg-primary-700"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
