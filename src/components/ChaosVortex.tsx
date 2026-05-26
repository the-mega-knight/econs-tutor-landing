import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';

export default function ChaosVortex() {
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useScroll();

  // Create distorted planes
  const planeCount = 30;
  const planes = useMemo(() => {
    return Array.from({ length: planeCount }).map(() => ({
      position: [
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 20 - 10,
      ] as [number, number, number],
      rotation: [
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      ] as [number, number, number],
      scale: Math.random() * 2 + 1,
    }));
  }, []);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;
    
    const offset = scroll.offset; // 0 to 1

    // This section starts around offset = 0.15 and peaks at 0.35
    // Then it morphs to "structure" around 0.5
    
    // Animate the group
    groupRef.current.rotation.z += delta * 0.2;
    
    
    groupRef.current.children.forEach((child, i) => {
      // Chaos mode (0.1 to 0.4)
      // Structure mode (0.4 to 0.6)
      const isStructure = offset > 0.4;
      
      if (isStructure) {
        // Morph into an ordered grid/graph
        const col = i % 5;
        const row = Math.floor(i / 5);
        
        child.position.lerp(new THREE.Vector3((col - 2) * 3, (row - 3) * 3, -10), 0.05);
        child.rotation.x = THREE.MathUtils.lerp(child.rotation.x, 0, 0.05);
        child.rotation.y = THREE.MathUtils.lerp(child.rotation.y, 0, 0.05);
        child.rotation.z = THREE.MathUtils.lerp(child.rotation.z, 0, 0.05);
        
        // Change material color to signify structure
        if ((child as THREE.Mesh).material) {
          ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).color.lerp(new THREE.Color('#00d2ff'), 0.05);
          ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).wireframe = true;
        }
      } else {
        // Chaos mode
        child.position.z += delta * 5;
        child.rotation.x += delta * 0.5;
        child.rotation.y += delta * 0.3;
        
        // Reset if too close
        if (child.position.z > 5) {
          child.position.z = -20;
        }

        if ((child as THREE.Mesh).material) {
          ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).color.lerp(new THREE.Color('#ff3333'), 0.1);
          ((child as THREE.Mesh).material as THREE.MeshBasicMaterial).wireframe = true;
        }
      }

      // Visibility based on scroll
      const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
      if (offset < 0.1 || offset > 0.8) {
        material.opacity = THREE.MathUtils.lerp(material.opacity, 0, 0.1);
      } else {
        material.opacity = THREE.MathUtils.lerp(material.opacity, Math.min(1, (offset - 0.1) * 5), 0.1);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {planes.map((props, i) => (
        <mesh key={i} position={props.position} rotation={props.rotation} scale={props.scale}>
          <planeGeometry args={[1, 1, 4, 4]} />
          {/* Distorted effect achieved by wireframe over complex geometry */}
          <meshBasicMaterial color="#ff3333" wireframe transparent opacity={0} />
        </mesh>
      ))}
    </group>
  );
}
