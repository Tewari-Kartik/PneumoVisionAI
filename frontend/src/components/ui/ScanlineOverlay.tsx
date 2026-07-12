"use client";

interface ScanlineOverlayProps {
  active: boolean;
}

export default function ScanlineOverlay({ active }: ScanlineOverlayProps) {
  if (!active) return null;
  return <div className="scanline-sweep" />;
}
