import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';

export default function LivingDataStream() {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useScroll();
  
  const particlesCount = 6000; // 3000 for Demand, 3000 for Supply

  // Pre-calculate initial positions for intersecting curves (X shape in 3D)
  const initialPositions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    const half = particlesCount / 2;

    for (let i = 0; i < particlesCount; i++) {
      const ix = i * 3;
      // Spread across x axis from -15 to 15
      const x = (Math.random() - 0.5) * 30; 
      
      let y = 0;
      let z = (Math.random() - 0.5) * 8; // Depth spread

      if (i < half) {
        // Curve 1 (Downward slope: y = -x) + noise
        y = -x + (Math.random() - 0.5) * 4;
      } else {
        // Curve 2 (Upward slope: y = x) + noise
        y = x + (Math.random() - 0.5) * 4;
      }

      pos[ix] = x;
      pos[ix + 1] = y;
      pos[ix + 2] = z;
    }
    return pos;
  }, [particlesCount]);

  // Clone initial array for dynamic updates
  const positions = useMemo(() => new Float32Array(initialPositions), [initialPositions]);

  useFrame((state) => {
    if (!pointsRef.current || !groupRef.current) return;

    const t = state.clock.elapsedTime;
    
    // 1. Scroll-linked Y-axis rotation
    // offset goes from 0 to 1 over the full page scroll
    const scrollOffset = scroll.offset;
    // Rotate exactly 1 full rotation (Math.PI * 2) or half rotation as user scrolls
    groupRef.current.rotation.y = scrollOffset * Math.PI;

    // 2. Vertex breathing animation (Sine wave math function)
    const array = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < particlesCount; i++) {
      const ix = i * 3;
      const iy = ix + 1;
      const iz = ix + 2;
      
      const origX = initialPositions[ix];
      const origY = initialPositions[iy];
      const origZ = initialPositions[iz];

      // Subtle undulation based on time and original spatial position
      const waveX = Math.sin(t * 0.5 + origY * 0.2) * 0.3;
      const waveY = Math.cos(t * 0.5 + origX * 0.2) * 0.3;
      const waveZ = Math.sin(t * 0.5 + origZ * 0.2) * 0.3;

      array[ix] = origX + waveX;
      array[iy] = origY + waveY;
      array[iz] = origZ + waveZ;
    }

    // Mark geometry for update
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group ref={groupRef} position={[0, 0, -10]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#1d1d1f" // Dark gray/black for light mode minimalist aesthetic
          transparent
          opacity={0.6}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </points>
    </group>
  );
}
