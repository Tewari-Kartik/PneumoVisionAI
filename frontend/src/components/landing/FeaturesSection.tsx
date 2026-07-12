'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';
import { useGSAP } from '@gsap/react';
import HudPanel from '@/components/ui/HudPanel';
import { Crosshair, Timer, FileText, Shield, TrendingUp, Layers } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Crosshair,
    title: 'Grad-CAM Localization',
    description:
      'See exactly where the model focused. Our heatmap overlay highlights regions of concern for radiologist verification.',
    stat: '98.2%',
    statLabel: 'Sensitivity',
  },
  {
    icon: Timer,
    title: 'Sub-10s Inference',
    description:
      'ResNet50 backbone delivers rapid screening results. From upload to diagnosis in under ten seconds on standard hardware.',
    stat: '<10s',
    statLabel: 'Avg. Time',
  },
  {
    icon: FileText,
    title: 'PDF Case Reports',
    description:
      'Generate comprehensive diagnostic reports with patient metadata, probability scores, and annotated imagery — ready for clinical records.',
    stat: '1-Click',
    statLabel: 'Export',
  },
  {
    icon: Shield,
    title: 'HIPAA-Aware Pipeline',
    description:
      'Images are processed locally and never stored on external servers. Full patient privacy with client-side processing architecture.',
    stat: '100%',
    statLabel: 'Local',
  },
  {
    icon: TrendingUp,
    title: 'Continuous Learning',
    description:
      'Model weights are regularly updated with new training data to maintain cutting-edge diagnostic performance across demographics.',
    stat: 'v2.1',
    statLabel: 'Latest',
  },
  {
    icon: Layers,
    title: 'Multi-View Compare',
    description:
      'Side-by-side comparison of multiple scans with synchronized heatmap overlays. Track patient progress over time.',
    stat: '∞',
    statLabel: 'Scans',
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!cardsRef.current) return;
      const cards = cardsRef.current.querySelectorAll('.feature-card');

      gsap.fromTo(
        cards,
        { y: 60, opacity: 0, filter: 'blur(6px)' },
        {
          y: 0,
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section id="features" ref={sectionRef} className="relative py-24 lg:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan/[0.02] to-transparent pointer-events-none" />

      {/* Floating particles */}
      {[
        { top: '25%', left: '15%', delay: '0s', dur: '4.5s' },
        { top: '55%', left: '82%', delay: '0.8s', dur: '5s' },
        { top: '38%', left: '50%', delay: '1.6s', dur: '4s' },
        { top: '72%', left: '30%', delay: '2.4s', dur: '5.5s' },
        { top: '45%', left: '75%', delay: '3.2s', dur: '4.8s' },
      ].map((p, i) => (
        <div
          key={i}
          className="floating-particle"
          style={{ top: p.top, left: p.left, animationDelay: p.delay, animationDuration: p.dur }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 lg:mb-20">
          <span className="inline-block text-cyan text-xs font-mono tracking-[0.3em] uppercase mb-4">
            Capabilities
          </span>
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-bright">
            Clinical-Grade Intelligence
          </h2>
          <div className="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-cyan/60 to-transparent" />
          <p className="mt-4 text-muted max-w-2xl mx-auto">
            Enterprise-grade diagnostic capabilities powered by state-of-the-art deep learning architecture.
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="feature-card">
                <HudPanel className="h-full p-8 group hover:border-cyan/20 transition-colors duration-500 tilt-card relative overflow-hidden">
                  {/* Gradient hover glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  
                  <div className="relative flex flex-col gap-5">
                    <div className="flex items-start justify-between">
                      <div className="relative w-14 h-14 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full bg-cyan/10 group-hover:bg-cyan/15 transition-colors duration-500" />
                        <div className="absolute inset-0 rounded-full border border-cyan/20 group-hover:border-cyan/40 group-hover:animate-border-glow transition-colors duration-500" />
                        <Icon className="w-6 h-6 text-cyan relative z-10" strokeWidth={1.5} />
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-display font-bold text-cyan text-glow-cyan">{feature.stat}</span>
                        <p className="text-[10px] font-mono text-muted uppercase tracking-widest">{feature.statLabel}</p>
                      </div>
                    </div>

                    <h3 className="font-display text-lg font-semibold text-bright">
                      {feature.title}
                    </h3>

                    <p className="text-muted text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </HudPanel>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
