'use client';

import { motion } from 'motion/react';

interface FloatingStatProps {
  label: string;
  value: string;
  delay?: number;
  className?: string;
}

export default function FloatingStat({ label, value, delay = 0, className = '' }: FloatingStatProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`glass-panel px-4 py-2.5 rounded-xl flex flex-col items-center gap-0.5 ${className}`}
    >
      <motion.span
        className="text-lg font-display font-bold text-cyan text-glow-cyan"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay }}
      >
        {value}
      </motion.span>
      <span className="text-[10px] font-mono text-muted uppercase tracking-widest">{label}</span>
    </motion.div>
  );
}
