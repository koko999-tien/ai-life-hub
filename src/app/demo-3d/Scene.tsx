'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export type DemoShape = 'knot' | 'ico' | 'torus';

function Shape({ color, shape }: { color: string; shape: DemoShape }) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((_state, delta) => {
    ref.current.rotation.y += delta * 0.4;
    ref.current.rotation.x += delta * 0.15;
  });

  return (
    <Float speed={2} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={ref}>
        {shape === 'knot' ? (
          <torusKnotGeometry args={[0.9, 0.32, 180, 24]} />
        ) : shape === 'ico' ? (
          <icosahedronGeometry args={[1.25, 0]} />
        ) : (
          <torusGeometry args={[1, 0.42, 24, 80]} />
        )}
        <MeshDistortMaterial
          color={color}
          distort={0.35}
          speed={2}
          roughness={0.25}
          metalness={0.1}
        />
      </mesh>
    </Float>
  );
}

export default function Scene({ color, shape }: { color: string; shape: DemoShape }) {
  return (
    <Canvas dpr={[1, 1.75]} camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 4, 4]} intensity={1.4} />
      <pointLight position={[-4, -3, 2]} intensity={0.6} color="#f97316" />
      <Shape color={color} shape={shape} />
    </Canvas>
  );
}
