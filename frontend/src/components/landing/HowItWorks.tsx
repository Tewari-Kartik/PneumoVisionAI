'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap-config';
import { useGSAP } from '@gsap/react';
import HudPanel from '@/components/ui/HudPanel';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { Upload, Brain, ClipboardCheck } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: '01',
    title: 'Upload Radiograph',
    description: 'Drag and drop a frontal chest X-ray in JPEG or PNG format. We support all standard medical imaging resolutions.',
    icon: Upload,
    metric: 10,
    metricSuffix: 'MB',
    metricLabel: 'Max Upload',
  },
  {
    number: '02',
    title: 'AI Analysis',
    description:
      'Our ResNet50 model classifies the image and generates a Grad-CAM attention map highlighting regions of concern.',
    icon: Brain,
    metric: 97.3,
    metricSuffix: '%',
    metricLabel: 'Accuracy',
    metricDecimals: 1,
  },
  {
    number: '03',
    title: 'Review & Export',
    description:
      'Examine the diagnosis, confidence metrics, and heatmap overlay. Export a comprehensive PDF report for clinical records.',
    icon: ClipboardCheck,
    metric: 1,
    metricSuffix: '-click',
    metricLabel: 'PDF Export',
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!stepsRef.current) return;
      const cards = stepsRef.current.querySelectorAll('.step-card');
      const connectors = stepsRef.current.querySelectorAll('.step-connector');

      gsap.fromTo(
        cards,
        { y: 50, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: stepsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      gsap.fromTo(
        connectors,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.6,
          stagger: 0.2,
          delay: 0.3,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: stepsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-abyss/50 to-transparent pointer-events-none" />

      {/* Decorative side lines */}
      <div className="absolute left-[10%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan/10 to-transparent pointer-events-none hidden lg:block" />
      <div className="absolute right-[10%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-cyan/10 to-transparent pointer-events-none hidden lg:block" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 lg:mb-20">
          <span className="inline-block text-cyan text-xs font-mono tracking-[0.3em] uppercase mb-4">
            Workflow
          </span>
          <h2 className="font-display text-3xl lg:text-5xl font-bold text-bright">
            Three Steps to Diagnosis
          </h2>
          <div className="mt-4 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-cyan/60 to-transparent" />
        </div>

        <div ref={stepsRef} className="relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-6 items-stretch">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative flex flex-col">
                  <div className="step-card flex-1">
                    <HudPanel className="h-full p-8 relative overflow-hidden group tilt-card">
                      {/* Hover glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-cyan/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                      
                      <div className="absolute top-4 right-4 font-mono text-5xl lg:text-6xl font-bold text-cyan/[0.07] leading-none select-none">
                        {step.number}
                      </div>

                      <div className="relative z-10 flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-cyan text-sm tracking-wider">
                            Step {step.number}
                          </span>
                        </div>

                        <div className="w-12 h-12 rounded-lg bg-cyan/10 border border-cyan/20 flex items-center justify-center group-hover:bg-cyan/15 group-hover:border-cyan/30 group-hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all duration-500">
                          <Icon className="w-5 h-5 text-cyan" strokeWidth={1.5} />
                        </div>

                        <h3 className="font-display text-xl font-semibold text-bright">
                          {step.title}
                        </h3>

                        <p className="text-muted text-sm leading-relaxed">
                          {step.description}
                        </p>

                        {/* Animated stat */}
                        <div className="mt-2 pt-3 border-t border-line/30">
                          <div className="flex items-baseline gap-1">
                            <AnimatedCounter
                              target={step.metric}
                              suffix={step.metricSuffix}
                              decimals={step.metricDecimals || 0}
                              className="text-lg font-display font-bold text-cyan"
                            />
                          </div>
                          <p className="text-[10px] font-mono text-muted uppercase tracking-widest mt-0.5">{step.metricLabel}</p>
                        </div>
                      </div>
                    </HudPanel>
                  </div>

                  {index < steps.length - 1 && (
                    <>
                      <div className="step-connector hidden md:block absolute top-1/2 -right-3 lg:-right-3 w-6 lg:w-6 h-px origin-left">
                        <div className="w-full h-full border-t border-dashed border-cyan/30" />
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan/60 animate-pulse" />
                      </div>
                      <div className="step-connector md:hidden flex justify-center py-4">
                        <div className="w-px h-8 border-l border-dashed border-cyan/30 relative">
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan/60 animate-pulse" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
