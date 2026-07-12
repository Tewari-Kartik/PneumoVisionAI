"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Activity, Menu, X, LogOut, User } from "lucide-react";
import { checkHealth } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import StatusIndicator from "@/components/ui/StatusIndicator";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/workspace", label: "Workspace" },
  { href: "/history", label: "Case History" },
  { href: "/compare", label: "Compare" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [serverStatus, setServerStatus] = useState<"online" | "offline" | "checking">("checking");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    checkHealth().then((h) => setServerStatus(h.status === "ok" ? "online" : "offline"));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-void/80 backdrop-blur-xl border-b border-line/50 shadow-[0_4px_30px_rgba(0,0,0,0.3)]"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-cyan/10 border border-cyan/30 flex items-center justify-center group-hover:bg-cyan/20 group-hover:border-cyan/50 transition-all">
            <Activity size={16} className="text-cyan" />
          </div>
          <span className="font-display font-bold text-base tracking-tight">
            Pneumo<span className="text-cyan">Vision</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? "text-cyan"
                    : "text-muted hover:text-bright hover:bg-white/[0.03]"
                }`}
              >
                {link.label}
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-cyan rounded-full shadow-[0_0_8px_rgba(0,240,255,0.5)]"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right Side: Status + Auth + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <StatusIndicator status={serverStatus} />
          </div>

          {/* Auth Button / Avatar */}
          {isAuthenticated && user ? (
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan to-teal flex items-center justify-center text-void font-display font-bold text-sm hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-shadow"
              >
                {user.avatarInitial}
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-11 w-56 rounded-xl bg-ink border border-line/70 shadow-2xl overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-line/50">
                      <p className="text-sm font-medium text-bright truncate">{user.name}</p>
                      <p className="text-xs text-muted truncate">{user.email}</p>
                    </div>
                    <div className="p-1.5">
                      <Link
                        href="/workspace"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted hover:text-bright hover:bg-white/[0.04] transition-all"
                      >
                        <User size={14} />
                        Workspace
                      </Link>
                      <button
                        onClick={() => { logout(); setProfileOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-signal-red/80 hover:text-signal-red hover:bg-signal-red/5 transition-all"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/auth"
              className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan/10 border border-cyan/30 text-cyan text-xs font-mono tracking-wider hover:bg-cyan/20 hover:border-cyan/50 transition-all"
            >
              Sign In
            </Link>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-muted hover:text-bright p-1 focus-ring rounded"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-void/95 backdrop-blur-xl border-b border-line px-6 py-4 space-y-1"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${
                pathname === link.href
                  ? "text-cyan bg-cyan/10"
                  : "text-muted hover:text-bright hover:bg-white/[0.03]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <Link
              href="/auth"
              className="block px-4 py-2.5 rounded-lg text-sm font-medium text-cyan bg-cyan/10"
            >
              Sign In / Sign Up
            </Link>
          )}
          <div className="pt-2 px-4">
            <StatusIndicator status={serverStatus} />
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
