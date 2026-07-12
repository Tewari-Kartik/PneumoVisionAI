'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  tiltDegree?: number;
}

export default function GlassCard({ children, className = '', tiltDegree = 8 }: GlassCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(smoothY, [0, 1], [tiltDegree, -tiltDegree]);
  const rotateY = useTransform(smoothX, [0, 1], [-tiltDegree, tiltDegree]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 800,
        transformStyle: 'preserve-3d',
      }}
      className={`glass-panel rounded-2xl border border-cyan/10 hover:border-cyan/25 transition-colors duration-500 ${className}`}
    >
      <div className="relative z-10">{children}</div>
      {/* Gradient shine overlay */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: useTransform(
            smoothX,
            [0, 1],
            [
              'radial-gradient(circle at 0% 50%, rgba(0,240,255,0.06) 0%, transparent 50%)',
              'radial-gradient(circle at 100% 50%, rgba(0,240,255,0.06) 0%, transparent 50%)',
            ]
          ),
        }}
      />
    </motion.div>
  );
}
