import { Activity } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-line/40 bg-void/60 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-muted">
          <Activity size={14} className="text-cyan/50" />
          <span className="font-display text-xs font-medium tracking-wide">
            PneumoVision <span className="text-cyan/50">AI</span>
          </span>
        </div>
        <p className="text-[11px] text-muted/60 text-center max-w-lg leading-relaxed">
          AI-assisted screening tool. Not a certified medical device — all results require
          confirmation by a licensed clinician.
        </p>
        <p className="text-[11px] text-muted/40 font-mono">v2.0</p>
      </div>
    </footer>
  );
}
