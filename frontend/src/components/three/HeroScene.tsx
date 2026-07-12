'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import ScanModel from './LungModel';
import ParticleField from './ParticleField';

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4], fov: 45 }}
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      className="!absolute !inset-0 !w-full !h-full"
      gl={{ antialias: true, alpha: true }}
    >
      <fog attach="fog" args={['#050A14', 5, 12]} />
      <ambientLight intensity={0.3} />
      <pointLight position={[3, 3, 3]} color="#00F0FF" intensity={1.5} />
      <pointLight position={[-3, -2, 2]} color="#17C3B2" intensity={1.2} />
      <ScanModel />
      <ParticleField />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate={false}
        enableRotate={false}
      />
    </Canvas>
  );
}