'use client';

import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function useXrayTexture() {
  return useMemo(() => {
    const size = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    const cx = size / 2;
    const chestTop = size * 0.22;
    const chestBottom = size * 0.82;
    const chestHalfWidth = size * 0.26;

    ctx.clearRect(0, 0, size, size);

    // ---- Lung field shadows ----
    const drawLung = (x: number, y: number, r: number) => {
      const g = ctx.createRadialGradient(x, y, 4, x, y, r);
      g.addColorStop(0, 'rgba(0, 240, 255, 0.5)');
      g.addColorStop(0.55, 'rgba(0, 240, 255, 0.22)');
      g.addColorStop(1, 'rgba(0, 240, 255, 0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    };
    ctx.save();
    ctx.translate(cx - chestHalfWidth * 0.5, chestTop + (chestBottom - chestTop) * 0.5);
    ctx.scale(1, 1.6);
    drawLung(0, 0, chestHalfWidth * 0.42);
    ctx.restore();

    ctx.save();
    ctx.translate(cx + chestHalfWidth * 0.5, chestTop + (chestBottom - chestTop) * 0.5);
    ctx.scale(1, 1.6);
    drawLung(0, 0, chestHalfWidth * 0.42);
    ctx.restore();

    // ---- Ribcage ----
    ctx.shadowColor = '#00F0FF';
    ctx.strokeStyle = '#00F0FF';
    ctx.lineCap = 'round';

    const ribCount = 11;
    for (let i = 0; i < ribCount; i++) {
      const t = i / (ribCount - 1);
      const y = chestTop + 40 + t * (chestBottom - chestTop - 80);

      const widthT = Math.sin(Math.PI * Math.min(1, t * 1.05));
      const width = chestHalfWidth * (0.4 + 0.7 * widthT);
      const droop = 20 + t * 26;

      ctx.globalAlpha = 0.55 - t * 0.08;
      ctx.lineWidth = 2.4;
      ctx.shadowBlur = 6;

      ctx.beginPath();
      ctx.moveTo(cx + 8, y - 8);
      ctx.quadraticCurveTo(cx + width * 0.7, y - droop * 0.5, cx + width, y + droop);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx - 8, y - 8);
      ctx.quadraticCurveTo(cx - width * 0.7, y - droop * 0.5, cx - width, y + droop);
      ctx.stroke();
    }

    // ---- Spine ----
    ctx.globalAlpha = 0.8;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 8;
    const vertebraCount = 12;
    for (let i = 0; i < vertebraCount; i++) {
      const t = i / vertebraCount;
      const y = chestTop + 20 + t * (chestBottom - chestTop - 40);
      const w = 18 - t * 3;
      ctx.strokeRect(cx - w / 2, y, w, 18);
      ctx.beginPath();
      ctx.moveTo(cx - w / 2, y + 9);
      ctx.lineTo(cx - w / 2 - 9, y + 5);
      ctx.moveTo(cx + w / 2, y + 9);
      ctx.lineTo(cx + w / 2 + 9, y + 5);
      ctx.stroke();
    }

    // ---- Clavicles ----
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 12, chestTop - 6);
    ctx.quadraticCurveTo(cx - chestHalfWidth * 0.75, chestTop - 26, cx - chestHalfWidth * 1.15, chestTop + 6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 12, chestTop - 6);
    ctx.quadraticCurveTo(cx + chestHalfWidth * 0.75, chestTop - 26, cx + chestHalfWidth * 1.15, chestTop + 6);
    ctx.stroke();

    // ---- Shoulder joints ----
    ctx.globalAlpha = 0.4;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx - chestHalfWidth * 1.18, chestTop + 22, 20, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx + chestHalfWidth * 1.18, chestTop + 22, 20, 0, Math.PI * 2);
    ctx.stroke();

    // ---- Diaphragm dome ----
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx - chestHalfWidth * 0.95, chestBottom - 30);
    ctx.quadraticCurveTo(cx - chestHalfWidth * 0.3, chestBottom + 14, cx, chestBottom - 8);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, chestBottom - 8);
    ctx.quadraticCurveTo(cx + chestHalfWidth * 0.3, chestBottom + 34, cx + chestHalfWidth * 0.95, chestBottom - 10);
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
}

function ScanBeam() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.position.y = Math.sin(t * 0.45) * 0.9;
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = 0.35 + 0.2 * Math.sin(t * 3);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0.05]}>
      <planeGeometry args={[1.7, 0.05]} />
      <meshBasicMaterial
        color="#00F0FF"
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        fog={false}
      />
    </mesh>
  );
}

export default function ScanModel() {
  const groupRef = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  const texture = useXrayTexture();

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    const baseScale = 1.6;
    const breathScale = baseScale * (1.0 + 0.015 * Math.sin(t * 1.2));
    groupRef.current.scale.set(breathScale, breathScale, 1);

    groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.1;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      pointer.y * 0.08,
      0.05
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      -pointer.x * 0.05,
      0.05
    );
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh>
        <planeGeometry args={[2.2, 2.2]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          fog={false}
        />
      </mesh>
      <ScanBeam />
    </group>
  );
}