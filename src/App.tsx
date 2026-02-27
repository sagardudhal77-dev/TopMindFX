import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./pages/Dashboard";
import { LiveTrades } from "./pages/LiveTrades";
import { Analysis } from "./pages/Analysis";
import { Guidance } from "./pages/Guidance";
import { Settings } from "./pages/Settings";

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "live-trades":
        return <LiveTrades />;
      case "analysis":
        return <Analysis />;
      case "guidance":
        return <Guidance />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[var(--background)] text-[var(--foreground)] overflow-hidden font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mx-auto max-w-6xl">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
