import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

// Building component
function Building({ position, height, color }: { position: [number, number, number]; height: number; color: string }) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={[1, height, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

// Road component
function Road({ position, rotation }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <mesh position={position} rotation={rotation} receiveShadow>
      <planeGeometry args={[12, 1]} />
      <meshStandardMaterial color="#404040" />
    </mesh>
  );
}

// Moving car component
function Car({ pathIndex }: { pathIndex: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const paths = [
    { start: -5, end: 5, y: 0.3, z: -2, axis: 'x' as const },
    { start: -5, end: 5, y: 0.3, z: 2, axis: 'x' as const },
    { start: -5, end: 5, x: -2, y: 0.3, axis: 'z' as const },
    { start: -5, end: 5, x: 2, y: 0.3, axis: 'z' as const }
  ];
  
  const path = paths[pathIndex % paths.length];
  const speed = 0.02 + Math.random() * 0.01;

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime() * speed;
      const progress = (Math.sin(time) + 1) / 2;
      const position = path.start + (path.end - path.start) * progress;
      
      if (path.axis === 'x') {
        meshRef.current.position.x = position;
        meshRef.current.position.z = path.z!;
        meshRef.current.rotation.y = progress > 0.5 ? Math.PI : 0;
      } else {
        meshRef.current.position.z = position;
        meshRef.current.position.x = path.x!;
        meshRef.current.rotation.y = progress > 0.5 ? Math.PI / 2 : -Math.PI / 2;
      }
      meshRef.current.position.y = path.y;
    }
  });

  return (
    <mesh ref={meshRef} castShadow>
      <boxGeometry args={[0.3, 0.2, 0.5]} />
      <meshStandardMaterial color="#3b82f6" emissive="#1e40af" emissiveIntensity={0.3} />
    </mesh>
  );
}

// Traffic light component
function TrafficLight({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (lightRef.current) {
      const time = state.clock.getElapsedTime();
      const phase = Math.floor(time / 2) % 3;
      const colors = ['#ef4444', '#eab308', '#22c55e'];
      (lightRef.current.material as THREE.MeshStandardMaterial).color.set(colors[phase]);
    }
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.1, 1, 0.1]} />
        <meshStandardMaterial color="#2d3748" />
      </mesh>
      <mesh ref={lightRef} position={[0, 1.1, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial emissive="#ef4444" emissiveIntensity={1} />
      </mesh>
    </group>
  );
}

// Energy station component
function EnergyStation({ position }: { position: [number, number, number] }) {
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (glowRef.current) {
      const intensity = 0.5 + Math.sin(state.clock.getElapsedTime() * 2) * 0.3;
      (glowRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = intensity;
    }
  });

  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.5, 0.5, 2, 8]} />
        <meshStandardMaterial color="#10b981" />
      </mesh>
      <mesh ref={glowRef} position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial color="#34d399" emissive="#10b981" emissiveIntensity={0.8} />
      </mesh>
    </group>
  );
}

// Main city scene
function CityScene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#60a5fa" />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>

      {/* Buildings */}
      <Building position={[-4, 1.5, -4]} height={3} color="#4f46e5" />
      <Building position={[-4, 1, -1]} height={2} color="#6366f1" />
      <Building position={[-4, 2, 2]} height={4} color="#4f46e5" />
      <Building position={[-4, 1.5, 4]} height={3} color="#6366f1" />
      
      <Building position={[4, 2, -4]} height={4} color="#8b5cf6" />
      <Building position={[4, 1.5, -1]} height={3} color="#a78bfa" />
      <Building position={[4, 1, 2]} height={2} color="#8b5cf6" />
      <Building position={[4, 2.5, 4]} height={5} color="#a78bfa" />

      {/* Roads */}
      <Road position={[0, 0, -2]} />
      <Road position={[0, 0, 2]} />
      <Road position={[-2, 0, 0]} rotation={[0, 0, Math.PI / 2]} />
      <Road position={[2, 0, 0]} rotation={[0, 0, Math.PI / 2]} />

      {/* Traffic lights */}
      <TrafficLight position={[-2.5, 0, -2.5]} />
      <TrafficLight position={[2.5, 0, -2.5]} />
      <TrafficLight position={[-2.5, 0, 2.5]} />
      <TrafficLight position={[2.5, 0, 2.5]} />

      {/* Energy stations */}
      <EnergyStation position={[-5, 1, -5]} />
      <EnergyStation position={[5, 1, -5]} />
      <EnergyStation position={[-5, 1, 5]} />
      <EnergyStation position={[5, 1, 5]} />

      {/* Moving cars */}
      {[0, 1, 2, 3, 4, 5].map(i => <Car key={i} pathIndex={i} />)}

      {/* Camera and controls */}
      <PerspectiveCamera makeDefault position={[8, 8, 8]} fov={50} />
      <OrbitControls 
        enableZoom={true}
        enablePan={true}
        minDistance={5}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2.2}
      />
    </>
  );
}

export default function CityVisualization() {
  return (
    <div className="w-full h-full bg-gradient-to-b from-background to-muted/30 rounded-lg overflow-hidden">
      <Canvas shadows>
        <CityScene />
      </Canvas>
    </div>
  );
}
