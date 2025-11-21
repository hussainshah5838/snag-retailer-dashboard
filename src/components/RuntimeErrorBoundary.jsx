import React from "react";

class RuntimeErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Log to console; can be replaced with telemetry integration

    console.error("RuntimeErrorBoundary caught:", error, info);
  }

  render() {
    const { error } = this.state;
    if (error) {
      const message = this.props.message || "An unexpected error occurred.";
      return (
        <div className="bg-white rounded-xl p-4 shadow-sm h-full">
          <h3 className="text-sm font-semibold mb-2">{message}</h3>
          <div className="text-sm text-muted">
            You can open the console for more details.
          </div>
        </div>
      );
    }

    return this.props.children ?? null;
  }
}

export default RuntimeErrorBoundary;
