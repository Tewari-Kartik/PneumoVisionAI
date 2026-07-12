'use client';

import dynamic from 'next/dynamic';
import { motion } from 'motion/react';
import GlowButton from '@/components/ui/GlowButton';

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-cyan/30 border-t-cyan rounded-full animate-spin" />
    </div>
  ),
});

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40" />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <motion.div
            className="flex-1 flex flex-col gap-6 lg:gap-8 text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan/30 bg-cyan/5 text-cyan text-xs font-mono tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
                AI-Powered Diagnostics
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-bright"
            >
              Chest X-Ray Screening,
              <br />
              <span className="bg-gradient-to-r from-cyan via-teal to-neon-blue bg-clip-text text-transparent">
                Powered by Deep Learning
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-muted text-base lg:text-lg max-w-lg leading-relaxed mx-auto lg:mx-0"
            >
              ResNet50 classification with Grad-CAM localization. Upload a chest
              radiograph and receive an explainable AI diagnosis in seconds.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 justify-center lg:justify-start"
            >
              <GlowButton href="/workspace" variant="primary">
                Start Diagnosis →
              </GlowButton>
              <GlowButton 
                variant="outline" 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Demo
              </GlowButton>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex items-center gap-6 justify-center lg:justify-start pt-2"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-signal-green animate-pulse" />
                <span className="text-xs font-mono text-muted">Model Online</span>
              </div>
              <div className="h-3 w-px bg-line" />
              <span className="text-xs font-mono text-muted">ResNet50 v2.1</span>
              <div className="h-3 w-px bg-line" />
              <span className="text-xs font-mono text-muted">97.3% Accuracy</span>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex-1 w-full h-[400px] lg:h-[500px] relative overflow-hidden rounded-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
          >
            <div className="absolute inset-0 rounded-2xl border border-cyan/10 bg-gradient-to-br from-cyan/5 via-transparent to-teal/5 backdrop-blur-sm" />

            <div className="absolute -inset-px rounded-2xl overflow-hidden pointer-events-none">
              <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent" />
              <div className="absolute bottom-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-teal/30 to-transparent" />
            </div>

            <div className="absolute top-3 left-4 flex items-center gap-2 z-10">
              <div className="w-1.5 h-1.5 rounded-full bg-cyan/60" />
              <span className="text-[10px] font-mono text-cyan/50 tracking-wider">HOLOGRAPHIC RENDER</span>
            </div>

            <HeroScene />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
