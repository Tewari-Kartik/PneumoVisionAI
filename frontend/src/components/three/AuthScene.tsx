'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function DNAHelix() {
  const groupRef = useRef<THREE.Group>(null);
  const particlesCount = 200;

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    const col = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
      const t = (i / particlesCount) * Math.PI * 6;
      const y = (i / particlesCount) * 8 - 4;
      const strand = i % 2 === 0 ? 1 : -1;
      const radius = 1.2;

      pos[i * 3] = Math.cos(t) * radius * strand;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = Math.sin(t) * radius * strand;

      // Cyan to teal gradient
      const ratio = i / particlesCount;
      col[i * 3] = ratio * 0.09;
      col[i * 3 + 1] = 0.7 + ratio * 0.24;
      col[i * 3 + 2] = 0.8 + ratio * 0.2;
    }

    return { positions: pos, colors: col };
  }, []);

  // Connecting bars
  const bars = useMemo(() => {
    const barPositions: [THREE.Vector3, THREE.Vector3][] = [];
    for (let i = 0; i < particlesCount; i += 8) {
      const t = (i / particlesCount) * Math.PI * 6;
      const y = (i / particlesCount) * 8 - 4;
      const radius = 1.2;
      barPositions.push([
        new THREE.Vector3(Math.cos(t) * radius, y, Math.sin(t) * radius),
        new THREE.Vector3(-Math.cos(t) * radius, y, -Math.sin(t) * radius),
      ]);
    }
    return barPositions;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particlesCount} array={positions} itemSize={3} args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" count={particlesCount} array={colors} itemSize={3} args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.08} vertexColors transparent opacity={0.9} sizeAttenuation />
      </points>
      {bars.map((pair, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              array={new Float32Array([...pair[0].toArray(), ...pair[1].toArray()])}
              itemSize={3}
              args={[new Float32Array([...pair[0].toArray(), ...pair[1].toArray()]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00F0FF" transparent opacity={0.15} />
        </line>
      ))}
    </group>
  );
}

function FloatingOrbs() {
  const count = 60;
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.03;
      ref.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#00F0FF" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

export default function AuthScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      style={{ position: 'absolute', inset: 0 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.5} color="#00F0FF" />
      <pointLight position={[-5, -3, 3]} intensity={0.3} color="#17C3B2" />
      <DNAHelix />
      <FloatingOrbs />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </Canvas>
  );
}
