"use client";

import Link from "next/link";
import type { ReactNode } from "react";

interface GlowButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: "primary" | "outline";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}

export default function GlowButton({
  children,
  onClick,
  href,
  variant = "primary",
  className = "",
  disabled = false,
  type = "button",
}: GlowButtonProps) {
  const base =
    "relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-display font-semibold text-sm tracking-wide transition-all duration-300 focus-ring";

  const variants = {
    primary:
      "bg-gradient-to-r from-cyan to-teal text-void hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:scale-100",
    outline:
      "border border-cyan/40 text-cyan hover:bg-cyan/10 hover:border-cyan/70 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed",
  };

  const cls = `${base} ${variants[variant]} ${className}`;

  if (href && !disabled) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}
