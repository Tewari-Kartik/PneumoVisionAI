'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';
import { useGSAP } from '@gsap/react';
import HudPanel from '@/components/ui/HudPanel';
import { Crosshair, Timer, FileText } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: Crosshair,
    title: 'Grad-CAM Localization',
    description:
      'See exactly where the model focused. Our heatmap overlay highlights regions of concern for radiologist verification.',
  },
  {
    icon: Timer,
    title: 'Sub-10s Inference',
    description:
      'ResNet50 backbone delivers rapid screening results. From upload to diagnosis in under ten seconds on standard hardware.',
  },
  {
    icon: FileText,
    title: 'PDF Case Reports',
    description:
      'Generate comprehensive diagnostic reports with patient metadata, probability scores, and annotated imagery — ready for clinical records.',
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
          stagger: 0.15,
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

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 lg:mb-20">
          <span className="inline-block text-cyan text-xs font-mono tracking-[0.3em] uppercase mb-4">
            Capabilities
          </span>
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-bright">
            Clinical-Grade Intelligence
          </h2>
          <div className="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-cyan/60 to-transparent" />
        </div>

        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="feature-card">
                <HudPanel className="h-full p-8 group hover:border-cyan/20 transition-colors duration-500">
                  <div className="flex flex-col gap-5">
                    <div className="relative w-14 h-14 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full bg-cyan/10 group-hover:bg-cyan/15 transition-colors duration-500" />
                      <div className="absolute inset-0 rounded-full border border-cyan/20 group-hover:border-cyan/40 transition-colors duration-500" />
                      <Icon className="w-6 h-6 text-cyan relative z-10" strokeWidth={1.5} />
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
