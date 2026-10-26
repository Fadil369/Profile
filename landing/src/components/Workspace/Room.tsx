import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// The room around the desk. The window shows Riyadh at the visitor's current Riyadh time —
// day, golden hour or night — and the sunlight entering the room follows the same clock.

import type { DayPhase } from "./riyadhClock";

type Vec3 = [number, number, number];

function canvasTexture(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void, repeat?: [number, number]) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(...repeat);
  }
  return t;
}

/** Deterministic pseudo-random so the skyline is the same on every visit. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

/* ---------- Riyadh sky ---------- */

const SKY: Record<DayPhase, [string, string, string]> = {
  night: ["#05070f", "#0d1430", "#1d2350"],
  dawn: ["#2b3a6b", "#c77f6b", "#f3b37a"],
  day: ["#3f7fd1", "#7fb4ea", "#cfe4f6"],
  dusk: ["#1f2350", "#a3506a", "#f19a5a"]
};

function drawRiyadh(ctx: CanvasRenderingContext2D, hour: number, phase: DayPhase) {
  const W = 1024;
  const H = 640;
  const [top, mid, low] = SKY[phase];
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, top);
  g.addColorStop(0.6, mid);
  g.addColorStop(1, low);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  const r = rng(61026);

  if (phase === "night") {
    for (let i = 0; i < 140; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.25 + r() * 0.6})`;
      ctx.fillRect(r() * W, r() * H * 0.55, 1.6, 1.6);
    }
    ctx.fillStyle = "#f4f1e3";
    ctx.beginPath();
    ctx.arc(W * 0.78, H * 0.18, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = top;
    ctx.beginPath();
    ctx.arc(W * 0.78 + 11, H * 0.18 - 6, 24, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // sun travels east → west across the window between 06:00 and 18:30
    const p = Math.min(1, Math.max(0, (hour - 6) / 12.5));
    const sx = W * (0.1 + 0.8 * p);
    const sy = H * (0.62 - Math.sin(p * Math.PI) * 0.5);
    const halo = ctx.createRadialGradient(sx, sy, 0, sx, sy, 140);
    halo.addColorStop(0, "rgba(255,240,200,0.95)");
    halo.addColorStop(0.2, "rgba(255,220,160,0.55)");
    halo.addColorStop(1, "rgba(255,220,160,0)");
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, W, H);
  }

  // distant haze line of the city
  const base = H * 0.86;
  const night = phase === "night" || phase === "dusk";
  const far = phase === "day" ? "#7c8fa8" : phase === "night" ? "#10142a" : "#4a3f5e";
  const near = phase === "day" ? "#55657c" : phase === "night" ? "#070912" : "#2c2440";
  ctx.fillStyle = far;
  for (let x = 0; x < W; ) {
    const w = 20 + r() * 50;
    const h = 30 + r() * 90;
    ctx.fillRect(x, base - h, w, h + 20);
    x += w + r() * 6;
  }

  // Kingdom Centre: tapering tower with the parabolic sky bridge opening at the top
  const kx = W * 0.36;
  const kh = 360;
  ctx.fillStyle = near;
  ctx.beginPath();
  ctx.moveTo(kx - 46, base);
  ctx.quadraticCurveTo(kx - 40, base - kh * 0.6, kx - 6, base - kh);
  ctx.lineTo(kx + 6, base - kh);
  ctx.quadraticCurveTo(kx + 40, base - kh * 0.6, kx + 46, base);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = mid;
  ctx.beginPath();
  ctx.moveTo(kx - 26, base - kh * 0.62);
  ctx.quadraticCurveTo(kx, base - kh * 1.08, kx + 26, base - kh * 0.62);
  ctx.quadraticCurveTo(kx, base - kh * 0.8, kx - 26, base - kh * 0.62);
  ctx.fill();
  if (night) {
    ctx.strokeStyle = "rgba(120,170,255,0.9)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(kx - 26, base - kh * 0.62);
    ctx.quadraticCurveTo(kx, base - kh * 1.08, kx + 26, base - kh * 0.62);
    ctx.stroke();
  }

  // Al Faisaliah: slim pyramid with its golden sphere
  const fx = W * 0.6;
  const fh = 290;
  ctx.fillStyle = near;
  ctx.beginPath();
  ctx.moveTo(fx - 36, base);
  ctx.lineTo(fx, base - fh);
  ctx.lineTo(fx + 36, base);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = night ? "#ffd27a" : "#c9a24a";
  ctx.beginPath();
  ctx.arc(fx, base - fh * 0.66, 11, 0, Math.PI * 2);
  ctx.fill();

  // foreground blocks with lit windows at night
  for (let x = -10; x < W; ) {
    const w = 40 + r() * 70;
    const h = 40 + r() * 130;
    if (Math.abs(x + w / 2 - kx) < 70 || Math.abs(x + w / 2 - fx) < 50) {
      x += w;
      continue;
    }
    ctx.fillStyle = near;
    ctx.fillRect(x, base - h, w, h + 40);
    if (night) {
      for (let wy = base - h + 8; wy < base - 6; wy += 11)
        for (let wx = x + 6; wx < x + w - 6; wx += 10)
          if (r() > 0.55) {
            ctx.fillStyle = r() > 0.3 ? "rgba(255,214,150,0.85)" : "rgba(170,200,255,0.8)";
            ctx.fillRect(wx, wy, 4, 5);
          }
    }
    x += w + 4;
  }
  ctx.fillStyle = near;
  ctx.fillRect(0, base, W, H - base);
}

/* ---------- room ---------- */

export function Room({ isDark, hour, phase }: { isDark: boolean; hour: number; phase: DayPhase }) {
  const wall = useMemo(
    () =>
      canvasTexture(
        512,
        512,
        (ctx) => {
          ctx.fillStyle = isDark ? "#1a1b23" : "#e9e3d8";
          ctx.fillRect(0, 0, 512, 512);
          const r = rng(7);
          for (let i = 0; i < 9000; i++) {
            const v = r();
            ctx.fillStyle = `rgba(${isDark ? "255,255,255" : "0,0,0"},${v * 0.035})`;
            ctx.fillRect(r() * 512, r() * 512, 1.5, 1.5);
          }
        },
        [3, 2]
      ),
    [isDark]
  );
  const floor = useMemo(
    () =>
      canvasTexture(
        512,
        512,
        (ctx) => {
          const r = rng(11);
          for (let row = 0; row < 8; row++) {
            const shade = isDark ? 30 + r() * 10 : 150 + r() * 25;
            ctx.fillStyle = `rgb(${shade + 18},${shade + 8},${shade - 4})`;
            ctx.fillRect(0, row * 64, 512, 62);
            ctx.strokeStyle = `rgba(0,0,0,${isDark ? 0.25 : 0.12})`;
            for (let k = 0; k < 6; k++) {
              ctx.beginPath();
              const y = row * 64 + r() * 60;
              ctx.moveTo(0, y);
              ctx.bezierCurveTo(170, y + r() * 6 - 3, 340, y + r() * 6 - 3, 512, y + r() * 4 - 2);
              ctx.stroke();
            }
            ctx.fillStyle = "rgba(0,0,0,0.35)";
            ctx.fillRect(r() * 512, row * 64, 2, 62);
          }
        },
        [3, 3]
      ),
    [isDark]
  );
  const sky = useMemo(() => canvasTexture(1024, 640, (ctx) => drawRiyadh(ctx, hour, phase)), [hour, phase]);
  useEffect(() => () => [wall, floor, sky].forEach((t) => t.dispose()), [wall, floor, sky]);

  const frame = isDark ? "#2a2b33" : "#f4f1ea";
  const WY = 2.22; // window centre height — above the floating tiles
  const WW = 2.3;
  const WH = 1.25;
  const z = -1.78;

  return (
    <group>
      {/* back wall */}
      <mesh position={[0, 1.4, -1.8]} receiveShadow>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial map={wall} roughness={0.95} />
      </mesh>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.1, 1.2]} receiveShadow>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial map={floor} roughness={0.7} />
      </mesh>
      {/* skirting */}
      <mesh position={[0, -1.04, -1.77]}>
        <boxGeometry args={[12, 0.12, 0.03]} />
        <meshStandardMaterial color={frame} roughness={0.6} />
      </mesh>
      {/* window: sky, frame, mullions, sill */}
      <mesh position={[0, WY, z]}>
        <planeGeometry args={[WW, WH]} />
        <meshBasicMaterial map={sky} toneMapped={false} />
      </mesh>
      <mesh position={[0, WY, z + 0.012]}>
        <planeGeometry args={[WW, WH]} />
        <meshPhysicalMaterial transparent opacity={0.08} roughness={0.05} metalness={0} clearcoat={1} color="#ffffff" />
      </mesh>
      {(
        [
          [0, WY + WH / 2 + 0.03, WW + 0.12, 0.06],
          [0, WY - WH / 2 - 0.03, WW + 0.12, 0.06],
          [-WW / 2 - 0.03, WY, 0.06, WH + 0.12],
          [WW / 2 + 0.03, WY, 0.06, WH + 0.12],
          [0, WY, 0.04, WH],
          [0, WY + 0.1, WW, 0.03]
        ] as [number, number, number, number][]
      ).map(([x, y, w, h], i) => (
        <mesh key={i} position={[x, y, z + 0.03]} castShadow>
          <boxGeometry args={[w, h, 0.06]} />
          <meshStandardMaterial color={frame} roughness={0.5} metalness={0.1} />
        </mesh>
      ))}
      <mesh position={[0, WY - WH / 2 - 0.08, z + 0.09]}>
        <boxGeometry args={[WW + 0.3, 0.04, 0.2]} />
        <meshStandardMaterial color={frame} roughness={0.5} />
      </mesh>
    </group>
  );
}

/** Daylight through the window; at night only a faint city glow, and the lamp does the work. */
export function Sunlight({ phase, isDark }: { phase: DayPhase; isDark: boolean }) {
  const cfg = {
    day: { color: "#fff4e0", intensity: 1.6 },
    dawn: { color: "#ffb98a", intensity: 0.9 },
    dusk: { color: "#ff9a6a", intensity: 0.85 },
    night: { color: "#7d93ff", intensity: 0.25 }
  }[phase];
  return (
    <directionalLight
      position={[-0.6, 3.2, -3.4]}
      color={cfg.color}
      intensity={cfg.intensity * (isDark ? 0.8 : 1)}
      castShadow
      shadow-mapSize={[1024, 1024]}
      shadow-camera-left={-3}
      shadow-camera-right={3}
      shadow-camera-top={3}
      shadow-camera-bottom={-3}
      shadow-bias={-0.0004}
    />
  );
}

/** Soft studio reflections on the monitor, mug and stethoscope. */
export function Reflections({ intensity }: { intensity: number }) {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    return () => {
      scene.environment = null;
      env.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  useEffect(() => {
    scene.environmentIntensity = intensity;
  }, [scene, intensity]);
  return null;
}

/* ---------- desk props: a physician's desk ---------- */

function Steam({ reducedMotion }: { reducedMotion: boolean }) {
  const wisps = useRef<THREE.Mesh[]>([]);
  const tex = useMemo(
    () =>
      canvasTexture(64, 128, (ctx) => {
        const g = ctx.createRadialGradient(32, 64, 2, 32, 64, 30);
        g.addColorStop(0, "rgba(255,255,255,0.55)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 64, 128);
      }),
    []
  );
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    wisps.current.forEach((m, i) => {
      if (!m) return;
      const k = reducedMotion ? 0.4 : (t * 0.35 + i / 3) % 1;
      m.position.y = 0.16 + k * 0.28;
      m.position.x = Math.sin(t * 1.3 + i) * 0.015 * (1 + k);
      (m.material as THREE.MeshBasicMaterial).opacity = (1 - k) * 0.5 * Math.min(1, k * 4);
      m.scale.setScalar(0.6 + k * 0.9);
    });
  });
  return (
    <>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(m) => (wisps.current[i] = m!)}>
          <planeGeometry args={[0.07, 0.14]} />
          <meshBasicMaterial map={tex} transparent depthWrite={false} opacity={0} />
        </mesh>
      ))}
    </>
  );
}

function Mug({ position, reducedMotion }: { position: Vec3; reducedMotion: boolean }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.065, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.045, 0.13, 32, 1, true]} />
        <meshStandardMaterial color="#f2efe9" roughness={0.25} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.002, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.004, 32]} />
        <meshStandardMaterial color="#f2efe9" roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.115, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.047, 32]} />
        <meshStandardMaterial color="#3b2416" roughness={0.15} />
      </mesh>
      <mesh position={[0.06, 0.065, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.03, 0.008, 10, 24, Math.PI]} />
        <meshStandardMaterial color="#f2efe9" roughness={0.25} />
      </mesh>
      <Steam reducedMotion={reducedMotion} />
    </group>
  );
}

function Stethoscope({ position }: { position: Vec3 }) {
  // tubing laid on the desk as a loose loop, then the chest piece
  const tube = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 40; i++) {
      const a = (i / 40) * Math.PI * 1.75 + 0.4;
      const r = 0.15 + Math.sin(i * 0.5) * 0.015;
      pts.push(new THREE.Vector3(Math.cos(a) * r, 0.012, Math.sin(a) * r * 0.75));
    }
    pts.push(new THREE.Vector3(0.24, 0.012, 0.02));
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 120, 0.009, 8, false);
  }, []);
  useEffect(() => () => tube.dispose(), [tube]);
  return (
    <group position={position} rotation={[0, 0.5, 0]}>
      <mesh geometry={tube} castShadow>
        <meshStandardMaterial color="#1d1f26" roughness={0.45} />
      </mesh>
      <mesh position={[0.25, 0.016, 0.02]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.018, 32]} />
        <meshStandardMaterial color="#c9ccd4" metalness={0.95} roughness={0.18} />
      </mesh>
      <mesh position={[0.25, 0.026, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.03, 32]} />
        <meshStandardMaterial color="#2a2c34" roughness={0.6} />
      </mesh>
    </group>
  );
}

function Notebook({ position }: { position: Vec3 }) {
  return (
    <group position={position} rotation={[0, -0.18, 0]}>
      <mesh position={[0, 0.012, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.26, 0.022, 0.34]} />
        <meshStandardMaterial color="#20304a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.0235, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.24, 0.32]} />
        <meshStandardMaterial color="#f3efe4" roughness={0.9} />
      </mesh>
      <mesh position={[0.06, 0.033, 0.02]} rotation={[0, 0.6, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.006, 0.006, 0.16, 12]} />
        <meshStandardMaterial color="#a89bf5" metalness={0.6} roughness={0.25} />
      </mesh>
    </group>
  );
}

function Plant({ position, scale = 1 }: { position: Vec3; scale?: number }) {
  const leaves = useMemo(() => {
    const r = rng(3);
    return Array.from({ length: 11 }, () => ({
      rot: [-0.5 - r() * 0.6, r() * Math.PI * 2, 0] as Vec3,
      s: 0.7 + r() * 0.5
    }));
  }, []);
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.07, 0]} castShadow>
        <cylinderGeometry args={[0.075, 0.06, 0.14, 24]} />
        <meshStandardMaterial color="#d9cfbf" roughness={0.8} />
      </mesh>
      {leaves.map((l, i) => (
        <group key={i} position={[0, 0.13, 0]} rotation={l.rot}>
          <mesh position={[0, 0.11 * l.s, 0]} scale={[1, l.s, 1]} castShadow>
            <sphereGeometry args={[0.03, 10, 10]} />
            <meshStandardMaterial color="#3f7d4e" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.06 * l.s, 0]} scale={[0.3, l.s * 2.4, 0.3]}>
            <cylinderGeometry args={[0.004, 0.006, 0.05, 6]} />
            <meshStandardMaterial color="#3a6b45" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function DeskProps({ narrow, reducedMotion }: { narrow: boolean; reducedMotion: boolean }) {
  return (
    <group>
      <Mug position={narrow ? [0.32, 0.03, 0.72] : [1.02, 0.03, 0.12]} reducedMotion={reducedMotion} />
      <Stethoscope position={narrow ? [-0.3, 0.03, 0.25] : [-0.5, 0.03, 0.05]} />
      {!narrow && <Notebook position={[1.28, 0.03, 0.48]} />}
      {!narrow && <Plant position={[-2.75, -1.1, -1.45]} scale={4} />}
    </group>
  );
}
