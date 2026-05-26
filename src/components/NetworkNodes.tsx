import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';

export default function NetworkNodes() {
  const pointsRef = useRef<THREE.Points>(null);
  const scroll = useScroll();
  
  const particlesCount = 1000;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;     // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20; // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5; // z
    }
    return pos;
  }, [particlesCount]);

  useFrame((_state, delta) => {
    if (pointsRef.current) {
      const offset = scroll.offset; // 0 to 1
      pointsRef.current.rotation.y += delta * 0.1;
      pointsRef.current.rotation.x += delta * 0.05;
      
      pointsRef.current.position.y = offset * 20;
      const material = pointsRef.current.material as THREE.PointsMaterial;
      if (material) {
        material.opacity = Math.max(1 - offset * 4, 0);
      }
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#0066cc"
        transparent
        opacity={1}
        sizeAttenuation
      />
    </points>
  );
}
