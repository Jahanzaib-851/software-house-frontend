"use client";
import React from "react";

class DebugErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorInfo: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Ye console mein batayega ke masla kis line par hai
    console.error("🚨 GLOBAL_CRASH_DETECTED:", error);
    this.setState({ errorInfo: error.toString() });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-10 m-5 border-4 border-dashed border-red-500 bg-red-50 rounded-3xl">
          <h1 className="text-2xl font-black text-red-600 uppercase tracking-tighter">
            System Component Failure
          </h1>
          <p className="mt-4 text-sm font-mono text-red-700 bg-white p-4 rounded-xl border border-red-200">
            {this.state.errorInfo}
          </p>
          <div className="mt-6">
            <p className="text-xs font-bold text-red-500 uppercase">Possible Causes:</p>
            <ul className="list-disc ml-5 text-[10px] text-red-400 font-bold mt-2">
              <li>Undefined Icon (e.g., FiSend is missing in react-icons/fi)</li>
              <li>Incorrect Import/Export (Check default vs named imports)</li>
              <li>Missing Component in specific directory</li>
            </ul>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2 bg-red-600 text-white font-black text-[10px] rounded-full uppercase"
          >
            Force Reboot System
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default DebugErrorBoundary;