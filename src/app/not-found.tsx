import React from "react";
import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";

export default function NotFound() {
  return (
    <div className="flex h-[80vh] items-center justify-center p-4">
      <GlassCard className="max-w-md w-full p-6 text-center space-y-4 border-white/5" glow>
        <div className="mx-auto w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-purple-400">
          <Compass className="w-6 h-6 animate-spin" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-lg font-bold text-white">Route Off-Pitch</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The requested operations coordinate or page does not exist in the StadiumOS AI registry.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="mx-auto flex items-center gap-1.5 bg-purple-600 hover:bg-purple-500 active:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition w-fit cursor-pointer"
        >
          Return to Mission Control <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </GlassCard>
    </div>
  );
}
