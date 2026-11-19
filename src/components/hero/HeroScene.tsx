'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import type { MotionValue } from 'motion/react';

/**
 * Motif 3D riêng của AI Life Hub: bong bóng thủy tinh trôi trong gradient
 * pastel (hồng đào / tím / xanh ngọc), lấy cảm hứng từ cách PeachWeb dùng
 * một "thế giới 3D" xuyên suốt trang — không sao chép hình ảnh của họ.
 * - Tự chuyển động (xoay + trôi) và đổi theo cuộn trang (scrollYProgress).
 * - Tôn trọng prefers-reduced-motion: đứng yên khi người dùng yêu cầu.
 * - Nặng nhẹ: chỉ 1 khối trung tâm + 6 bong bóng, dpr tối đa 1.75.
 */

type BubbleSpec = {
  position: [number, number, number];
  scale: number;
  color: string;
};

/**
 * Layered floating (motion-design skill): mỗi bong bóng trôi theo một lớp
 * riêng — thời lượng 4000/5500/3500ms, lệch pha 0/30%/60%, biên độ
 * ±0.08/0.12/0.10 (đơn vị thế giới ≈ ±8-12px trên màn hình) — nên không
 * bao giờ đồng bộ với nhau. Chuyển động hình sin: ease-in-out tự nhiên
 * (chậm lại ở hai đầu biên độ), chỉ dùng transform.
 */
const FLOAT_LAYERS = [
  { duration: 4, phase: 0, amplitude: 0.08 },
  { duration: 5.5, phase: 0.3, amplitude: 0.12 },
  { duration: 3.5, phase: 0.6, amplitude: 0.1 },
];

const BUBBLES: BubbleSpec[] = [
  { position: [-2.7, 1.1, -1.5], scale: 0.55, color: '#ffb59e' },
  { position: [2.8, 0.9, -1], scale: 0.7, color: '#2dd4bf' },
  { position: [-2.2, -1.3, -0.5], scale: 0.4, color: '#a78bfa' },
  { position: [2.4, -1.2, -0.8], scale: 0.5, color: '#fda4af' },
  { position: [0.4, 1.7, -2], scale: 0.35, color: '#5eead4' },
  { position: [-0.6, -1.8, -1.6], scale: 0.45, color: '#c4b5fd' },
];

function Bubble({
  spec,
  layer,
  reduced,
  compact,
}: {
  spec: BubbleSpec;
  layer: (typeof FLOAT_LAYERS)[number];
  reduced: boolean;
  compact: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const baseY = spec.position[1];

  useFrame(({ clock }, delta) => {
    if (reduced) return;
    const t = clock.getElapsedTime();
    const cycle = (t / layer.duration + layer.phase) % 1;
    groupRef.current.position.y =
      baseY + Math.sin(cycle * Math.PI * 2) * layer.amplitude;
    meshRef.current.rotation.y += delta * 0.25;
  });

  return (
    <group ref={groupRef} position={spec.position}>
      <mesh ref={meshRef} scale={spec.scale}>
        {/* Màn hình nhỏ: ít đỉnh hơn cho nhẹ GPU (32 thay vì 48). */}
        <sphereGeometry args={[1, compact ? 32 : 48, compact ? 32 : 48]} />
        <MeshDistortMaterial
          color={spec.color}
          distort={0.25}
          speed={1.5}
          roughness={0.12}
          metalness={0.05}
          transparent
          opacity={0.75}
        />
      </mesh>
    </group>
  );
}

function Centerpiece({
  reduced,
  scrollYProgress,
  compact,
}: {
  reduced: boolean;
  scrollYProgress?: MotionValue<number>;
  compact: boolean;
}) {
  const group = useRef<THREE.Group>(null!);
  const knot = useRef<THREE.Mesh>(null!);

  useFrame((_state, delta) => {
    if (reduced) return;
    knot.current.rotation.y += delta * 0.35;
    knot.current.rotation.x += delta * 0.12;
    if (scrollYProgress) {
      const p = scrollYProgress.get();
      group.current.position.y = -p * 1.4;
      group.current.rotation.z = p * 0.25;
      // Tiến vào cảnh: khối trung tâm phóng to dần theo cuộn trang.
      const s = 1 + p * 0.4;
      group.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={group}>
      <Float speed={1.6} rotationIntensity={0.3} floatIntensity={1}>
        <mesh ref={knot}>
          {/* Màn hình nhỏ: ít đoạn hơn cho nhẹ GPU. */}
          <torusKnotGeometry
            args={[0.85, 0.3, compact ? 96 : 160, compact ? 12 : 20]}
          />
          <MeshDistortMaterial
            color="#8b5cf6"
            distort={0.3}
            speed={1.8}
            roughness={0.15}
            metalness={0.15}
            transparent
            opacity={0.9}
          />
        </mesh>
      </Float>
      {(compact ? BUBBLES.slice(0, 4) : BUBBLES).map((bubble, i) => (
        <Bubble
          key={i}
          spec={bubble}
          layer={FLOAT_LAYERS[i % FLOAT_LAYERS.length]}
          reduced={reduced}
          compact={compact}
        />
      ))}
    </group>
  );
}

/**
 * Camera dolly-in theo cuộn trang kiểu PeachWeb: khi cuộn xuống, camera
 * tiến từ xa vào giữa cảnh 3D. Đứng yên khi reduced-motion hoặc không có
 * scrollYProgress.
 */
function CameraRig({
  reduced,
  scrollYProgress,
}: {
  reduced: boolean;
  scrollYProgress?: MotionValue<number>;
}) {
  useFrame((state) => {
    if (reduced || !scrollYProgress) return;
    const p = scrollYProgress.get();
    state.camera.position.z = 6 - p * 2.6;
    state.camera.position.y = p * 0.5;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroScene({
  scrollYProgress,
}: {
  scrollYProgress?: MotionValue<number>;
}) {
  // Đọc ngay lúc khởi tạo state (không setState trong effect).
  const [reduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  // Màn hình nhỏ (<=640px): dpr tối đa 1, 4 bong bóng thay vì 6, hình học
  // ít đỉnh hơn — nhẹ GPU và pin hơn. Chỉ giảm tải lúc chạy, không đổi
  // kích thước chunk tải về (xem hero.tsx về việc tải chunk lúc rảnh).
  const [compact] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 640px)').matches
  );

  return (
    <Canvas
      dpr={compact ? [1, 1] : [1, 1.75]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 4, 4]} intensity={1.2} />
      <pointLight position={[-4, -2, 2]} intensity={0.8} color="#ff8f7a" />
      <pointLight position={[4, -3, 1]} intensity={0.8} color="#2dd4bf" />
      <CameraRig reduced={reduced} scrollYProgress={scrollYProgress} />
      <Centerpiece
        reduced={reduced}
        scrollYProgress={scrollYProgress}
        compact={compact}
      />
    </Canvas>
  );
}
