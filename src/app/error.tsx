"use client";

import React, { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("StadiumOS App Runtime Error:", error);
  }, [error]);

  return (
    <div className="flex h-[80vh] items-center justify-center p-4">
      <GlassCard className="max-w-md w-full p-6 text-center space-y-4 border-rose-500/20" glow>
        <div className="mx-auto w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-400">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-lg font-bold text-white">Ops Link Disrupted</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            StadiumOS AI experienced an unexpected telemetry interface exception. Match analytics feed has been logged.
          </p>
        </div>
        {error.digest && (
          <div className="text-[10px] text-zinc-500 font-mono bg-black/45 py-1 px-2 rounded select-all">
            Digest: {error.digest}
          </div>
        )}
        <button
          onClick={() => reset()}
          className="mx-auto flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reconnect Feed
        </button>
      </GlassCard>
    </div>
  );
}
