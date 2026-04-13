import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", background: "#fee2e2", color: "#991b1b", fontFamily: "monospace", minHeight: "100vh" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "16px" }}>🔥 React Application Crashed 🔥</h1>
          <h3 style={{ fontSize: "18px", fontWeight: "bold" }}>Error Message:</h3>
          <p style={{ fontSize: "16px", background: "#f87171", color: "white", padding: "10px", borderRadius: "5px" }}>
            {this.state.error?.toString()}
          </p>
          <div style={{ marginTop: "20px" }}>
            <strong style={{ fontSize: "16px" }}>Component Stack:</strong>
            <pre style={{ background: "#fef2f2", padding: "15px", overflowX: "auto", marginTop: "10px", border: "1px solid #fca5a5" }}>
              {this.state.errorInfo?.componentStack}
            </pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
