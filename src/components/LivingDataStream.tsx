import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';

const getTextPoints = (text: string, count: number) => {
  const canvas = document.createElement('canvas');
  canvas.width = 500;
  canvas.height = 120;
  const ctx = canvas.getContext('2d');
  const pos = new Float32Array(count * 3);

  if (!ctx) return pos;
  
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.font = 'bold 42px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const validPixels: {x: number, y: number}[] = [];
  
  for (let y = 0; y < canvas.height; y++) {
    for (let x = 0; x < canvas.width; x++) {
      const idx = (y * canvas.width + x) * 4;
      if (imgData[idx] > 128) {
        validPixels.push({ x, y });
      }
    }
  }
  
  if (validPixels.length === 0) return pos;
  
  for (let i = 0; i < count; i++) {
    const pixel = validPixels[Math.floor(Math.random() * validPixels.length)];
    // Map canvas coordinates to 3D space, heavily reduced noise so text is sharp
    pos[i * 3] = (pixel.x - canvas.width / 2) * 0.12 + (Math.random() - 0.5) * 0.05;
    pos[i * 3 + 1] = -(pixel.y - canvas.height / 2) * 0.12 + (Math.random() - 0.5) * 0.05;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 0.2;
  }
  return pos;
};

const generateShapes = (count: number) => {
  const shapes: Float32Array[] = [];
  
  // 0: Supply & Demand (Hero)
  const shape0 = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const isSupply = i < count / 2;
    const x = (Math.random() - 0.5) * 40;
    const y = isSupply ? x : -x;
    shape0[i * 3] = x;
    shape0[i * 3 + 1] = y + (Math.random() - 0.5) * 3;
    shape0[i * 3 + 2] = (Math.random() - 0.5) * 8;
  }
  shapes.push(shape0);

  // 1: Simultaneous Shift (Diagnostic Engine)
  const shape1 = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const group = i % 4; // S1, S2, D1, D2
    const x = (Math.random() - 0.5) * 40;
    let y = 0;
    if (group === 0) y = x; 
    if (group === 1) y = x - 5; 
    if (group === 2) y = -x; 
    if (group === 3) y = -x + 5; 
    
    shape1[i * 3] = x;
    shape1[i * 3 + 1] = y + (Math.random() - 0.5) * 1.5;
    shape1[i * 3 + 2] = (Math.random() - 0.5) * 6;
  }
  shapes.push(shape1);

  // 2: Keynesian Cross (Structure) with Axes for context
  const shape2 = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const group = i % 3; // 45-deg line, AE line, Axes
    const x = (Math.random() - 0.5) * 40;
    let y = 0;
    if (group === 0) {
      y = x;
    } else if (group === 1) {
      y = 0.3 * x + 8;
    } else {
      if (Math.random() > 0.5) {
         // X-axis
         shape2[i * 3] = x;
         shape2[i * 3 + 1] = -20;
      } else {
         // Y-axis
         shape2[i * 3] = -20;
         shape2[i * 3 + 1] = x;
      }
      shape2[i * 3 + 2] = (Math.random() - 0.5) * 2;
      continue;
    }
    shape2[i * 3] = x;
    shape2[i * 3 + 1] = y + (Math.random() - 0.5) * 1.5;
    shape2[i * 3 + 2] = (Math.random() - 0.5) * 4;
  }
  shapes.push(shape2);

  // 3: Text Equation (Bento Grid)
  shapes.push(getTextPoints("Y = C + I + G + NX", count));

  // 4: Exponential Trend (Testimonials / CTA)
  const shape4 = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 30;
    const y = Math.exp(0.2 * (x + 10)) * 0.5 - 10; // Adjust exponential scaling
    shape4[i * 3] = x + (Math.random() - 0.5) * 2;
    shape4[i * 3 + 1] = y + (Math.random() - 0.5) * 2;
    shape4[i * 3 + 2] = (Math.random() - 0.5) * 8;
  }
  shapes.push(shape4);

  return shapes;
};

// Easing function for smooth transitions
const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export default function LivingDataStream() {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useScroll();

  // Create a perfectly round dot texture dynamically
  const dotTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.arc(32, 32, 30, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
  }, []);
  
  const particlesCount = 8000;
  const shapes = useMemo(() => generateShapes(particlesCount), [particlesCount]);
  const currentPositions = useMemo(() => new Float32Array(shapes[0]), [shapes]);

  useFrame((state) => {
    if (!pointsRef.current || !groupRef.current) return;

    const t = state.clock.elapsedTime;
    const offset = scroll.offset; // 0 to 1
    
    // Smooth Parallax Rotation
    groupRef.current.rotation.y = offset * Math.PI * 0.5;
    groupRef.current.rotation.z = Math.sin(offset * Math.PI) * 0.1;

    // Determine shapes to interpolate between
    const maxIndex = shapes.length - 1;
    const floatIndex = offset * maxIndex;
    let baseShape = Math.floor(floatIndex);
    let nextShape = Math.min(baseShape + 1, maxIndex);
    let rawLerp = floatIndex - baseShape;

    // Apply easing for snappier, distinct shape formations rather than messy middle-states
    const lerpFactor = easeInOutCubic(rawLerp);

    const array = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < particlesCount; i++) {
      const ix = i * 3;
      const iy = ix + 1;
      const iz = ix + 2;
      
      const targetX = THREE.MathUtils.lerp(shapes[baseShape][ix], shapes[nextShape][ix], lerpFactor);
      const targetY = THREE.MathUtils.lerp(shapes[baseShape][iy], shapes[nextShape][iy], lerpFactor);
      const targetZ = THREE.MathUtils.lerp(shapes[baseShape][iz], shapes[nextShape][iz], lerpFactor);

      // Add subtle breathing sine waves based on time and spatial coordinates
      const waveX = Math.sin(t * 0.5 + targetY * 0.2) * 0.3;
      const waveY = Math.cos(t * 0.5 + targetX * 0.2) * 0.3;
      const waveZ = Math.sin(t * 0.5 + targetZ * 0.2) * 0.3;

      array[ix] = targetX + waveX;
      array[iy] = targetY + waveY;
      array[iz] = targetZ + waveZ;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group ref={groupRef} position={[0, 0, -10]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[currentPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color="#333336" 
          map={dotTexture}
          alphaTest={0.5}
          transparent
          opacity={0.8}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.NormalBlending}
        />
      </points>
    </group>
  );
}
