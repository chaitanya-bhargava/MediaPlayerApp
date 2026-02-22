import { Component } from "react";
import { Button } from "./ui/button";
import { AlertCircle } from "lucide-react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
          <AlertCircle className="h-16 w-16 text-destructive/60" />
          <h2 className="mt-4 text-2xl font-bold">Something went wrong</h2>
          <p className="mt-2 max-w-md text-muted-foreground">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <Button
            className="mt-6"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
