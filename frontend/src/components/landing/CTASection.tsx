'use client';

import { motion } from 'motion/react';
import GlowButton from '@/components/ui/GlowButton';

function WaveformRule() {
  return (
    <div className="flex items-center justify-center gap-0.5 mb-8">
      {Array.from({ length: 40 }).map((_, i) => {
        const height = Math.sin((i / 40) * Math.PI) * 20 + 4;
        return (
          <motion.div
            key={i}
            className="w-[2px] rounded-full bg-gradient-to-t from-cyan/20 to-cyan/60"
            initial={{ height: 2, opacity: 0 }}
            whileInView={{ height, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: i * 0.02,
              ease: 'easeOut',
            }}
          />
        );
      })}
    </div>
  );
}

export default function CTASection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-void via-abyss to-void" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan/[0.04] blur-[100px] pointer-events-none" />

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-line to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-line to-transparent" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <WaveformRule />

          <h2 className="font-display text-3xl lg:text-5xl font-bold text-bright mb-4">
            Ready to Screen?
          </h2>

          <p className="text-muted text-base lg:text-lg max-w-xl mx-auto leading-relaxed mb-10">
            Upload a chest radiograph and let our AI deliver an explainable
            diagnosis in seconds. No setup required — just drag, drop, and review.
          </p>

          <GlowButton href="/workspace" variant="primary" className="text-base px-8 py-3">
            Open Workspace →
          </GlowButton>

          <div className="mt-10 flex items-center justify-center gap-6 text-xs font-mono text-muted">
            <span>No account required</span>
            <div className="w-1 h-1 rounded-full bg-cyan/40" />
            <span>HIPAA-aware pipeline</span>
            <div className="w-1 h-1 rounded-full bg-cyan/40" />
            <span>Client-side processing</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
