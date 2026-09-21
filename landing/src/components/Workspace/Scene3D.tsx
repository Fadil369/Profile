import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

interface Scene3DProps {
  isDark: boolean;
  reducedMotion: boolean;
  entering: boolean;
  onOpenComputer: () => void;
  onToggleLamp: () => void;
}

function Rig({ reducedMotion }: { reducedMotion: boolean }) {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (reducedMotion) return;
    const t = state.clock.getElapsedTime();
    target.current.x = state.pointer.x * 0.35;
    target.current.y = state.pointer.y * 0.18;
    camera.position.x += (target.current.x - camera.position.x) * 0.03;
    camera.position.y += (1.35 + target.current.y + Math.sin(t * 0.4) * 0.02 - camera.position.y) * 0.03;
    camera.lookAt(0, 0.55, 0);
  });

  return null;
}

function Desk() {
  return (
    <group position={[0, -0.02, 0]}>
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[3.6, 0.06, 1.6]} />
        <meshStandardMaterial color="#3b2f26" roughness={0.55} metalness={0.05} />
      </mesh>
      {[
        [-1.65, -0.55, 0.6],
        [1.65, -0.55, 0.6],
        [-1.65, -0.55, -0.6],
        [1.65, -0.55, -0.6]
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <cylinderGeometry args={[0.035, 0.035, 1.1, 12]} />
          <meshStandardMaterial color="#201812" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function Monitor({
  hovered,
  isDark,
  onHover,
  onClick
}: {
  hovered: boolean;
  isDark: boolean;
  onHover: (v: boolean) => void;
  onClick: () => void;
}) {
  const screenColor = isDark ? "#a89bf5" : "#6557cf";
  return (
    <group
      position={[0, 0.55, -0.35]}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      scale={hovered ? 1.03 : 1}
    >
      {/* stand */}
      <mesh position={[0, -0.32, 0]}>
        <cylinderGeometry args={[0.14, 0.18, 0.08, 24]} />
        <meshStandardMaterial color="#15161c" roughness={0.4} metalness={0.4} />
      </mesh>
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[0.06, 0.28, 0.06]} />
        <meshStandardMaterial color="#15161c" roughness={0.4} metalness={0.4} />
      </mesh>
      {/* body */}
      <mesh castShadow>
        <boxGeometry args={[1.5, 0.86, 0.06]} />
        <meshStandardMaterial color="#0e0f14" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* screen */}
      <mesh position={[0, 0, 0.034]}>
        <planeGeometry args={[1.38, 0.74]} />
        <meshStandardMaterial
          color={screenColor}
          emissive={screenColor}
          emissiveIntensity={hovered ? 1.1 : 0.65}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

function Keyboard() {
  return (
    <mesh position={[0, 0.06, 0.55]} rotation={[-0.05, 0, 0]}>
      <boxGeometry args={[0.95, 0.04, 0.32]} />
      <meshStandardMaterial color="#1a1b22" roughness={0.7} />
    </mesh>
  );
}

function Lamp({
  hovered,
  isDark,
  onHover,
  onClick
}: {
  hovered: boolean;
  isDark: boolean;
  onHover: (v: boolean) => void;
  onClick: () => void;
}) {
  const bulbColor = isDark ? "#ffd9a0" : "#bcd4ff";
  return (
    <group
      position={[1.35, 0.03, -0.25]}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(true);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      scale={hovered ? 1.08 : 1}
    >
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 0.03, 20]} />
        <meshStandardMaterial color="#2a2b33" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[-0.05, 0.28, 0]} rotation={[0, 0, 0.35]}>
        <cylinderGeometry args={[0.015, 0.015, 0.56, 10]} />
        <meshStandardMaterial color="#2a2b33" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0.12, 0.55, 0]} rotation={[0, 0, -0.5]}>
        <coneGeometry args={[0.14, 0.2, 20, 1, true]} />
        <meshStandardMaterial
          color={bulbColor}
          emissive={bulbColor}
          emissiveIntensity={hovered ? 1.4 : 0.9}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>
      <pointLight position={[0.14, 0.5, 0]} intensity={isDark ? 0.6 : 0.35} color={bulbColor} distance={2.2} />
    </group>
  );
}

function SceneContent({ isDark, reducedMotion, entering, onOpenComputer, onToggleLamp }: Scene3DProps) {
  const [hoveredMonitor, setHoveredMonitor] = useState(false);
  const [hoveredLamp, setHoveredLamp] = useState(false);
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    if (entering) {
      group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, -0.8, reducedMotion ? 1 : 0.08);
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, 0.25, reducedMotion ? 1 : 0.08);
    } else if (!reducedMotion) {
      group.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.15) * 0.02;
    }
    void delta;
  });

  return (
    <>
      <Rig reducedMotion={reducedMotion} />
      <ambientLight intensity={isDark ? 0.35 : 0.55} />
      <directionalLight position={[2, 3, 2]} intensity={isDark ? 0.5 : 0.8} castShadow />
      <group ref={group}>
        <Desk />
        <Monitor hovered={hoveredMonitor} isDark={isDark} onHover={setHoveredMonitor} onClick={onOpenComputer} />
        <Keyboard />
        <Lamp hovered={hoveredLamp} isDark={isDark} onHover={setHoveredLamp} onClick={onToggleLamp} />
      </group>
    </>
  );
}

export function Scene3D(props: Scene3DProps) {
  const dpr = useMemo<[number, number]>(() => [1, Math.min(window.devicePixelRatio || 1, 2)], []);
  const [frameloop, setFrameloop] = useState<"always" | "never">(
    document.visibilityState === "hidden" ? "never" : "always"
  );

  useEffect(() => {
    const onVisibility = () => setFrameloop(document.visibilityState === "hidden" ? "never" : "always");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <Canvas
      shadows
      dpr={dpr}
      camera={{ position: [0, 1.35, 3.4], fov: 42 }}
      gl={{ antialias: true, powerPreference: "low-power" }}
      frameloop={frameloop}
    >
      <color attach="background" args={[props.isDark ? "#0d0f15" : "#faf8f2"]} />
      <Suspense fallback={null}>
        <SceneContent {...props} />
      </Suspense>
    </Canvas>
  );
}
