'use client';

import { motion } from 'motion/react';
import GlowButton from '@/components/ui/GlowButton';
import AnimatedCounter from '@/components/ui/AnimatedCounter';

function WaveformRule() {
  return (
    <div className="flex items-center justify-center gap-0.5 mb-8">
      {Array.from({ length: 60 }).map((_, i) => {
        const height = Math.sin((i / 60) * Math.PI) * 24 + 4;
        return (
          <motion.div
            key={i}
            className="w-[2px] rounded-full bg-gradient-to-t from-cyan/20 to-cyan/60"
            initial={{ height: 2, opacity: 0 }}
            whileInView={{ height, opacity: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: i * 0.015,
              ease: 'easeOut',
            }}
          />
        );
      })}
    </div>
  );
}

const trustStats = [
  { value: 97.3, suffix: '%', label: 'Accuracy', decimals: 1 },
  { value: 50, suffix: 'K+', label: 'Scans Processed', decimals: 0 },
  { value: 10, suffix: 's', prefix: '<', label: 'Avg. Inference', decimals: 0 },
  { value: 99.9, suffix: '%', label: 'Uptime', decimals: 1 },
];

export default function CTASection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-void via-abyss to-void" />

      {/* Multiple ambient glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-cyan/[0.04] blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-teal/[0.03] blur-[80px] pointer-events-none" />

      {/* Floating particles */}
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="floating-particle"
          style={{
            top: `${10 + Math.random() * 80}%`,
            left: `${5 + Math.random() * 90}%`,
            animationDelay: `${i * 0.4}s`,
            animationDuration: `${3 + Math.random() * 3}s`,
          }}
        />
      ))}

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-line to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-line to-transparent" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 text-center">
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

          {/* Trust Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {trustStats.map((stat) => (
              <div key={stat.label} className="glass-panel rounded-xl px-4 py-5">
                <AnimatedCounter
                  target={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  decimals={stat.decimals}
                  className="text-2xl font-display font-bold text-cyan text-glow-cyan"
                />
                <p className="text-[10px] font-mono text-muted uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          <div className="mt-10 flex items-center justify-center gap-6 text-xs font-mono text-muted">
            <span>Free to use</span>
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
