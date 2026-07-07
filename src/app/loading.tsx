import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col h-[80vh] items-center justify-center space-y-4">
      <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[10px] font-bold text-purple-400 tracking-wider animate-pulse uppercase">Syncing Live Telemetry...</p>
    </div>
  );
}
