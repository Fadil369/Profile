import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { short, SPID, useBprLive, type BprLive } from "../../bpr/live";
import { BPR_TEXT, type BprAppId, type BprModule } from "../../bpr/modules";
import type { Lang } from "../../content";
import { DeskProps, Reflections, Room, Sunlight } from "./Room";
import { useRiyadhClock } from "./riyadhClock";

// The BPR desk. Everything visible is drawn from live registry data:
//   monitor   → a console showing the credential checks that ran in this browser
//   hologram  → the signed credential card (opens Verify)
//   chain     → one block per transparency-log line plus genesis (opens Ledger)
//   tiles     → one per BPR system (opens that app)
// Text is painted onto CanvasTextures, so no font loader or extra 3D library is needed.

interface Scene3DProps {
  isDark: boolean;
  lang: Lang;
  modules: BprModule[];
  reducedMotion: boolean;
  entering: boolean;
  /** coming back from the BPR OS desktop: the camera starts at the screen and pulls back */
  returning: boolean;
  onOpenApp: (id: BprAppId | null) => void;
  onToggleLamp: () => void;
  onHoverLabel: (label: string | null) => void;
}

type Vec3 = [number, number, number];

/* ---------- canvas texture helper ---------- */

function useCanvasTexture(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void, deps: unknown[]) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, [w, h]);
  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    let alive = true;
    document.fonts?.ready.then(() => alive && setFontsReady(true));
    return () => {
      alive = false;
    };
  }, []);
  useEffect(() => {
    const ctx = (tex.image as HTMLCanvasElement).getContext("2d")!;
    ctx.clearRect(0, 0, w, h);
    draw(ctx);
    tex.needsUpdate = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tex, fontsReady, ...deps]);
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

const MONO = "'IBM Plex Mono', ui-monospace, monospace";
const HEAD = "'Space Grotesk', 'Inter', sans-serif";
const AR = "'Tajawal', 'IBM Plex Sans Arabic', sans-serif";

const mark = (s: string) => (s === "ok" ? "✓" : s === "pending" ? "…" : "✗");
const markColor = (s: string) => (s === "ok" ? "#7dd3a8" : s === "pending" ? "#c9c3f5" : "#ff8a8a");

/* ---------- pointer helper ---------- */

function useHover(label: string, onHoverLabel: (l: string | null) => void) {
  const [hovered, setHovered] = useState(false);
  const { gl } = useThree();
  const bind = {
    onPointerOver: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHovered(true);
      gl.domElement.style.cursor = "pointer";
      onHoverLabel(label);
    },
    onPointerOut: (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      setHovered(false);
      gl.domElement.style.cursor = "";
      onHoverLabel(null);
    }
  };
  return [hovered, bind] as const;
}

/* ---------- camera ---------- */

function Rig({ reducedMotion, narrow, entering, returning }: { reducedMotion: boolean; narrow: boolean; entering: boolean; returning: boolean }) {
  const { camera } = useThree();
  const base = narrow ? { y: 1.6, z: 5.9, look: 1.12 } : { y: 1.45, z: 3.9, look: 0.78 };
  const look = useRef(new THREE.Vector3(0, base.look, 0));
  const pos = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());

  // Arrival: walk up to the desk — or, coming back from the desktop, start at the screen.
  useEffect(() => {
    if (reducedMotion) camera.position.set(0, base.y, base.z);
    else if (returning) camera.position.set(0, 0.68, 0.42);
    else camera.position.set(0.25, base.y + 0.45, base.z + 1.8);
    look.current.set(0, returning && !reducedMotion ? 0.68 : base.look, returning && !reducedMotion ? -0.35 : 0);
    camera.lookAt(look.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useFrame((state, dt) => {
    const t = state.clock.getElapsedTime();
    if (entering) {
      // into the monitor until the screen fills the view
      pos.current.set(0, 0.68, 0.42);
      lookTarget.current.set(0, 0.68, -0.35);
    } else {
      const sway = reducedMotion ? 0 : 1;
      pos.current.set(state.pointer.x * (narrow ? 0.15 : 0.45) * sway, base.y + (state.pointer.y * 0.2 + Math.sin(t * 0.4) * 0.02) * sway, base.z);
      lookTarget.current.set(0, base.look, 0);
    }
    // time-based easing: the same feel at 30 or 120 fps
    const f = reducedMotion ? 1 : 1 - Math.exp(-Math.min(dt, 0.1) * (entering ? 4.2 : 2.2));
    camera.position.lerp(pos.current, f);
    look.current.lerp(lookTarget.current, f);
    camera.lookAt(look.current);
  });
  return null;
}

/* ---------- furniture ---------- */

function Desk({ isDark }: { isDark: boolean }) {
  const wood = useCanvasTexture(
    1024,
    512,
    (ctx) => {
      ctx.fillStyle = isDark ? "#3a2d24" : "#b79576";
      ctx.fillRect(0, 0, 1024, 512);
      let seed = 42;
      const r = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
      for (let i = 0; i < 140; i++) {
        const y = r() * 512;
        ctx.strokeStyle = `rgba(${isDark ? "0,0,0" : "70,40,20"},${0.06 + r() * 0.12})`;
        ctx.lineWidth = 1 + r() * 2.5;
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x <= 1024; x += 64) ctx.lineTo(x, y + Math.sin(x / 90 + i) * 3 + (r() - 0.5) * 2);
        ctx.stroke();
      }
    },
    [isDark]
  );
  return (
    <group position={[0, -0.02, 0]}>
      <mesh position={[0, 0.02, 0]} receiveShadow castShadow>
        <boxGeometry args={[3.6, 0.06, 1.6]} />
        <meshStandardMaterial map={wood} roughness={0.42} metalness={0.02} />
      </mesh>
      {/* glowing edge strip */}
      <mesh position={[0, 0.0, 0.801]}>
        <boxGeometry args={[3.6, 0.012, 0.004]} />
        <meshBasicMaterial color={isDark ? "#a89bf5" : "#6557cf"} toneMapped={false} />
      </mesh>
      {(
        [
          [-1.65, -0.55, 0.6],
          [1.65, -0.55, 0.6],
          [-1.65, -0.55, -0.6],
          [1.65, -0.55, -0.6]
        ] as Vec3[]
      ).map((p, i) => (
        <mesh key={i} position={p}>
          <cylinderGeometry args={[0.035, 0.035, 1.1, 12]} />
          <meshStandardMaterial color="#201812" roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function Dust({ count = 160, reducedMotion }: { count?: number; reducedMotion: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      a[i * 3] = (Math.random() - 0.5) * 7;
      a[i * 3 + 1] = Math.random() * 3 - 0.5;
      a[i * 3 + 2] = -1.5 + Math.random() * 3.2;
    }
    return a;
  }, [count]);
  useFrame((_, d) => {
    if (!reducedMotion && ref.current) ref.current.rotation.y += d * 0.015;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.01} color="#f3e6c8" transparent opacity={0.35} depthWrite={false} />
    </points>
  );
}

/* ---------- monitor with the live console ---------- */

function drawConsole(ctx: CanvasRenderingContext2D, live: BprLive, lang: Lang, isDark: boolean, blink: boolean) {
  const W = 1024;
  const H = 560;
  // The monitor is a terminal: English in both languages, so bidi never reorders its lines.
  void lang;
  const T = BPR_TEXT.en;
  ctx.direction = "ltr";
  ctx.textAlign = "left";
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, isDark ? "#11121b" : "#f4f1ff");
  bg.addColorStop(1, isDark ? "#1b1630" : "#e4ddff");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  // grid
  ctx.strokeStyle = isDark ? "rgba(168,155,245,0.07)" : "rgba(101,87,207,0.08)";
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y < H; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  const ink = isDark ? "#f2f2f6" : "#171922";
  const mut = isDark ? "rgba(235,236,240,0.62)" : "rgba(30,32,42,0.62)";
  const acc = isDark ? "#a89bf5" : "#6557cf";

  // title bar
  ctx.fillStyle = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
  ctx.fillRect(0, 0, W, 54);
  ["#ff6b6b", "#ffd166", "#7dd3a8"].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(30 + i * 24, 27, 7, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = mut;
  ctx.font = `500 20px ${MONO}`;
  ctx.fillText("registry.brainsait.de — BPR OS", 120, 34);
  ctx.fillStyle = "#7dd3a8";
  ctx.beginPath();
  ctx.arc(W - 96, 27, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = mut;
  ctx.fillText("LIVE", W - 82, 34);

  // brand
  ctx.fillStyle = acc;
  ctx.font = `700 64px ${HEAD}`;
  ctx.fillText("BPR", 48, 132);
  ctx.fillStyle = ink;
  ctx.font = `600 26px ${HEAD}`;
  ctx.fillText("BrainSAIT Provider Registry", 196, 112);
  ctx.fillStyle = mut;
  ctx.font = `400 19px ${MONO}`;
  ctx.fillText("did:web:registry.brainsait.de · OID 1.3.6.1.4.1.61026", 196, 140);

  // checks
  ctx.font = `500 22px ${MONO}`;
  ctx.fillStyle = mut;
  ctx.fillText(`$ brainsait verify --provider ${SPID}`, 48, 196);
  const s = live.claims?.credentialSubject;
  const rows: [string, string, string][] = [
    [s ? "ok" : "pending", "credential", s ? `${s.name}` : T.console.fetching],
    [live.signature.state, "signature", live.signature.state === "ok" ? `Ed25519 · ${live.signature.how === "server" ? "server" : "on this device"}` : T.states[live.signature.state]],
    [live.status.state, "status", live.status.value || T.states[live.status.state]],
    [live.chain.state, "log chain", live.chain.state === "ok" ? `#${live.chain.entries.length} ${short(live.head?.hash, 12)}` : T.states[live.chain.state]],
    [live.headSignature.state, "log head", T.states[live.headSignature.state] + (live.head ? ` · ${live.head.at.slice(0, 16)}Z` : "")]
  ];
  rows.forEach(([st, k, v], i) => {
    const y = 240 + i * 42;
    ctx.fillStyle = markColor(st);
    ctx.fillText(mark(st), 48, y);
    ctx.fillStyle = mut;
    ctx.fillText(k.padEnd(11, " "), 82, y);
    ctx.fillStyle = ink;
    ctx.fillText(v.length > 44 ? v.slice(0, 43) + "…" : v, 252, y);
  });
  if (blink) {
    ctx.fillStyle = acc;
    ctx.fillRect(48, 240 + rows.length * 42 - 18, 12, 24);
  }

  // footer stats
  const stats: [string, string][] = [
    [live.providers !== undefined ? String(live.providers) : "…", "providers"],
    [live.research ? String(live.research.counts.dois) : "…", "DOIs"],
    [live.fhir ? `R4 ${live.fhir.version}` : "…", "FHIR"],
    [s?.membership?.validTo ?? "…", "member until"]
  ];
  stats.forEach(([v, l], i) => {
    const x = 48 + i * 238;
    roundRect(ctx, x, 470, 218, 70, 12);
    ctx.fillStyle = isDark ? "rgba(168,155,245,0.1)" : "rgba(101,87,207,0.1)";
    ctx.fill();
    ctx.fillStyle = ink;
    ctx.font = `700 26px ${HEAD}`;
    ctx.fillText(v, x + 16, 502);
    ctx.fillStyle = mut;
    ctx.font = `400 16px ${MONO}`;
    ctx.fillText(l, x + 16, 528);
  });
}

function Monitor({ isDark, lang, live, onOpen, onHoverLabel, label }: { isDark: boolean; lang: Lang; live: BprLive; onOpen: () => void; onHoverLabel: (l: string | null) => void; label: string }) {
  const [hovered, bind] = useHover(label, onHoverLabel);
  const [blink, setBlink] = useState(true);
  useEffect(() => {
    const id = window.setInterval(() => setBlink((b) => !b), 600);
    return () => window.clearInterval(id);
  }, []);
  const tex = useCanvasTexture(1024, 560, (ctx) => drawConsole(ctx, live, lang, isDark, blink), [live, lang, isDark, blink]);
  return (
    <group
      position={[0, 0.68, -0.35]}
      {...bind}
      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
      scale={hovered ? 1.025 : 1}
    >
      {/* stand sits behind the panel */}
      <mesh position={[0, -0.6, -0.12]}>
        <cylinderGeometry args={[0.16, 0.2, 0.04, 28]} />
        <meshStandardMaterial color="#15161c" roughness={0.35} metalness={0.6} />
      </mesh>
      <mesh position={[0, -0.36, -0.12]}>
        <boxGeometry args={[0.07, 0.48, 0.05]} />
        <meshStandardMaterial color="#15161c" roughness={0.35} metalness={0.6} />
      </mesh>
      {/* body */}
      <mesh castShadow>
        <boxGeometry args={[1.66, 0.94, 0.06]} />
        <meshStandardMaterial color="#0b0c11" roughness={0.4} metalness={0.4} />
      </mesh>
      {/* screen */}
      <mesh position={[0, 0, 0.0311]}>
        <planeGeometry args={[1.58, 0.864]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      <pointLight position={[0, 0, 0.5]} intensity={hovered ? 1.2 : 0.7} distance={2.4} color={isDark ? "#a89bf5" : "#8f84e8"} />
    </group>
  );
}

function Keyboard() {
  return (
    <group>
      <mesh position={[0, 0.065, 0.48]} rotation={[-0.05, 0, 0]} castShadow>
        <boxGeometry args={[0.95, 0.035, 0.3]} />
        <meshStandardMaterial color="#1a1b22" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.085, 0.48]} rotation={[-0.05, 0, 0]}>
        <planeGeometry args={[0.88, 0.24]} />
        <meshBasicMaterial color="#a89bf5" transparent opacity={0.08} />
      </mesh>
      <mesh position={[0.66, 0.06, 0.5]} castShadow>
        <capsuleGeometry args={[0.04, 0.05, 6, 12]} />
        <meshStandardMaterial color="#1a1b22" roughness={0.5} />
      </mesh>
    </group>
  );
}

function Lamp({ isDark, onClick, onHoverLabel, label, position }: { isDark: boolean; onClick: () => void; onHoverLabel: (l: string | null) => void; label: string; position: Vec3 }) {
  const [hovered, bind] = useHover(label, onHoverLabel);
  const bulbColor = isDark ? "#ffd9a0" : "#bcd4ff";
  return (
    <group
      position={position}
      {...bind}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      scale={hovered ? 1.08 : 1}
    >
      <mesh>
        <cylinderGeometry args={[0.1, 0.12, 0.03, 20]} />
        <meshStandardMaterial color="#2a2b33" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[-0.05, 0.28, 0]} rotation={[0, 0, 0.35]}>
        <cylinderGeometry args={[0.015, 0.015, 0.56, 10]} />
        <meshStandardMaterial color="#2a2b33" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0.12, 0.55, 0]} rotation={[0, 0, -0.5]}>
        <coneGeometry args={[0.14, 0.2, 20, 1, true]} />
        <meshStandardMaterial color={bulbColor} emissive={bulbColor} emissiveIntensity={hovered ? 1.4 : 0.9} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      <pointLight position={[0.14, 0.5, 0]} intensity={isDark ? 1.1 : 0.5} color={bulbColor} distance={2.6} castShadow shadow-mapSize={[512, 512]} />
    </group>
  );
}

/* ---------- holographic credential ---------- */

function drawCard(ctx: CanvasRenderingContext2D, live: BprLive, lang: Lang) {
  const W = 640;
  const H = 400;
  roundRect(ctx, 6, 6, W - 12, H - 12, 34);
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "rgba(185,170,248,0.92)");
  g.addColorStop(0.55, "rgba(122,104,227,0.88)");
  g.addColorStop(1, "rgba(60,48,140,0.9)");
  ctx.fillStyle = g;
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.stroke();
  // sheen
  ctx.save();
  ctx.clip();
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.beginPath();
  ctx.moveTo(W * 0.55, 0);
  ctx.lineTo(W * 0.75, 0);
  ctx.lineTo(W * 0.45, H);
  ctx.lineTo(W * 0.25, H);
  ctx.fill();
  ctx.restore();

  const s = live.claims?.credentialSubject;
  ctx.fillStyle = "#0d0f15";
  ctx.font = `700 40px ${HEAD}`;
  ctx.fillText("BPR", 40, 74);
  ctx.font = `500 18px ${MONO}`;
  ctx.fillText("VERIFIABLE CREDENTIAL", 136, 70);
  ctx.font = `700 34px ${HEAD}`;
  ctx.fillText(s?.name ?? "Dr. Mohamed El Fadil", 40, 160);
  ctx.font = `700 30px ${AR}`;
  ctx.direction = "rtl";
  ctx.fillText(s?.nameAr ?? "د. محمد الفاضل", W - 40, 206);
  ctx.direction = "ltr";
  ctx.font = `600 24px ${MONO}`;
  ctx.fillText(SPID, 40, 262);
  ctx.font = `400 18px ${MONO}`;
  ctx.fillText(`member until ${s?.membership?.validTo ?? "…"}`, 40, 296);
  // seal
  const ok = live.signature.state === "ok";
  roundRect(ctx, 40, 320, 300, 50, 25);
  ctx.fillStyle = ok ? "rgba(13,15,21,0.85)" : "rgba(13,15,21,0.5)";
  ctx.fill();
  ctx.fillStyle = ok ? "#7dd3a8" : "#f2f2f6";
  ctx.font = `600 20px ${MONO}`;
  ctx.fillText(ok ? "✓ Ed25519 signature valid" : `… ${BPR_TEXT[lang].states[live.signature.state]}`, 58, 352);
  // pseudo QR from the credential id
  const seed = (live.claims?.id ?? "urn:uuid:bpr").split("").reduce((a, c) => (a * 33 + c.charCodeAt(0)) >>> 0, 5381);
  let r = seed;
  const cell = 11;
  const ox = W - 40 - cell * 11;
  const oy = 250;
  ctx.fillStyle = "#0d0f15";
  for (let y = 0; y < 11; y++)
    for (let x = 0; x < 11; x++) {
      r = (r * 1664525 + 1013904223) >>> 0;
      const finder = (x < 3 && y < 3) || (x > 7 && y < 3) || (x < 3 && y > 7);
      if (finder ? !(x % 2 === 1 && y % 2 === 1 && (x === 1 || x === 9) && (y === 1 || y === 9)) : r & 1)
        ctx.fillRect(ox + x * cell, oy + y * cell, cell - 1, cell - 1);
    }
}

function Hologram({ live, lang, reducedMotion, onOpen, onHoverLabel, label, position }: { live: BprLive; lang: Lang; reducedMotion: boolean; onOpen: () => void; onHoverLabel: (l: string | null) => void; label: string; position: Vec3 }) {
  const [hovered, bind] = useHover(label, onHoverLabel);
  const card = useRef<THREE.Group>(null);
  const beam = useRef<THREE.MeshBasicMaterial>(null);
  const tex = useCanvasTexture(640, 400, (ctx) => drawCard(ctx, live, lang), [live.claims, live.signature, lang]);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (card.current && !reducedMotion) {
      card.current.rotation.y = Math.sin(t * 0.6) * 0.35;
      card.current.position.y = 0.62 + Math.sin(t * 1.1) * 0.03;
    }
    if (beam.current) beam.current.opacity = 0.1 + Math.sin(t * 3) * 0.03 + (hovered ? 0.08 : 0);
  });
  return (
    <group position={position}>
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.15, 0.17, 0.04, 32]} />
        <meshStandardMaterial color="#15161c" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.052, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.08, 0.13, 40]} />
        <meshBasicMaterial color="#a89bf5" toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.33, 0]}>
        <cylinderGeometry args={[0.36, 0.11, 0.56, 32, 1, true]} />
        <meshBasicMaterial ref={beam} color="#a89bf5" transparent opacity={0.1} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} />
      </mesh>
      <group
        ref={card}
        position={[0, 0.62, 0]}
        {...bind}
        onClick={(e) => {
          e.stopPropagation();
          onOpen();
        }}
        scale={hovered ? 1.08 : 1}
      >
        <mesh>
          <planeGeometry args={[0.64, 0.4]} />
          <meshBasicMaterial map={tex} transparent side={THREE.DoubleSide} toneMapped={false} depthWrite={false} />
        </mesh>
      </group>
    </group>
  );
}

/* ---------- transparency chain ---------- */

function Chain({ live, reducedMotion, onOpen, onHoverLabel, label, position }: { live: BprLive; reducedMotion: boolean; onOpen: () => void; onHoverLabel: (l: string | null) => void; label: string; position: Vec3 }) {
  const [hovered, bind] = useHover(label, onHoverLabel);
  const pulse = useRef<THREE.Mesh>(null);
  const n = Math.max(1, live.chain.entries.length) + 1; // genesis + entries
  const gap = 0.24;
  const ok = live.chain.state === "ok";
  const color = live.chain.state === "fail" ? "#ff8a8a" : "#7dd3c0";
  useFrame((state) => {
    if (!pulse.current) return;
    const t = reducedMotion ? 0.5 : (state.clock.getElapsedTime() * 0.5) % 1;
    pulse.current.position.x = t * (n - 1) * gap;
  });
  return (
    <group
      position={position}
      {...bind}
      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
      scale={hovered ? 1.1 : 1}
    >
      {Array.from({ length: n }).map((_, i) => (
        <group key={i} position={[i * gap, 0.07, 0]}>
          <mesh castShadow rotation={[0, 0.5, 0]}>
            <boxGeometry args={[0.11, 0.11, 0.11]} />
            <meshStandardMaterial
              color={i === 0 ? "#5b5c6b" : color}
              emissive={i === 0 ? "#3a3b48" : color}
              emissiveIntensity={ok ? (hovered ? 0.9 : 0.5) : 0.15}
              roughness={0.3}
              metalness={0.2}
            />
          </mesh>
          {i > 0 && (
            <mesh position={[-gap / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.008, 0.008, gap - 0.1, 8]} />
              <meshBasicMaterial color={color} toneMapped={false} />
            </mesh>
          )}
        </group>
      ))}
      {ok && (
        <mesh ref={pulse} position={[0, 0.07, 0]}>
          <sphereGeometry args={[0.022, 12, 12]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}

/* ---------- module tiles ---------- */

const GLYPH: Record<string, string> = {
  key: "⚿",
  link: "⛓",
  fingerprint: "◉",
  users: "⇥",
  flask: "⚗",
  calculator: "∑",
  server: "▤",
  layers: "◈"
};

const hasArabic = (t: string) => /[\u0600-\u06FF]/.test(t);

function drawTile(ctx: CanvasRenderingContext2D, m: BprModule, lang: Lang, live: boolean, liveLabel: string) {
  const W = 360;
  const H = 200;
  const ar = lang === "ar";
  ctx.direction = "ltr";
  ctx.textAlign = "left";
  roundRect(ctx, 4, 4, W - 8, H - 8, 26);
  ctx.fillStyle = "rgba(18,19,28,0.86)";
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = m.color;
  ctx.stroke();
  // icon sits at the reading start: left in English, right in Arabic
  ctx.fillStyle = m.color;
  ctx.font = `600 54px ${HEAD}`;
  ctx.textAlign = ar ? "right" : "left";
  ctx.fillText(GLYPH[m.icon] ?? "•", ar ? W - 26 : 26, 82);
  if (live) {
    ctx.font = `600 ${ar ? 20 : 18}px ${ar ? AR : MONO}`;
    const label = ar ? liveLabel : liveLabel.toUpperCase();
    const lw = ctx.measureText(label).width;
    const lx = ar ? 26 + 18 : W - 26 - lw;
    ctx.textAlign = "left";
    ctx.direction = ar ? "rtl" : "ltr";
    ctx.fillStyle = "#7dd3a8";
    ctx.textAlign = ar ? "right" : "left";
    ctx.fillText(label, ar ? lx + lw : lx, 57);
    ctx.beginPath();
    ctx.arc(ar ? lx + lw + 12 : lx - 14, 50, 7, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.direction = ar ? "rtl" : "ltr";
  ctx.textAlign = ar ? "right" : "left";
  const x = ar ? W - 26 : 26;
  ctx.fillStyle = "#f2f2f6";
  ctx.font = `700 ${ar ? 34 : 31}px ${ar ? AR : HEAD}`;
  ctx.fillText(m.title, x, 136);
  const tag = m.tag.length > 30 ? m.tag.slice(0, 29) + "…" : m.tag;
  const tagAr = hasArabic(tag);
  ctx.fillStyle = "rgba(235,236,240,0.65)";
  ctx.font = tagAr ? `500 20px ${AR}` : `500 17px ${MONO}`;
  ctx.direction = tagAr ? "rtl" : "ltr";
  ctx.textAlign = ar ? "right" : "left";
  ctx.fillText(tag, x, 172);
}

function Tile({ m, lang, position, index, scale, reducedMotion, onOpen, onHoverLabel }: { m: BprModule; lang: Lang; position: Vec3; index: number; scale: number; reducedMotion: boolean; onOpen: () => void; onHoverLabel: (l: string | null) => void }) {
  const [hovered, bind] = useHover(`${m.title} — ${m.tag}`, onHoverLabel);
  const ref = useRef<THREE.Group>(null);
  const tex = useCanvasTexture(360, 200, (ctx) => drawTile(ctx, m, lang, m.live, BPR_TEXT[lang].liveBadge), [m, lang]);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.getElapsedTime();
    const target = (hovered ? 1.14 : 1) * scale;
    ref.current.scale.lerp(new THREE.Vector3(target, target, target), 0.15);
    if (!reducedMotion) ref.current.position.y = position[1] + Math.sin(t * 0.9 + index * 0.8) * 0.025;
    ref.current.lookAt(state.camera.position.x * 0.4, state.camera.position.y, state.camera.position.z);
  });
  return (
    <group
      ref={ref}
      position={position}
      {...bind}
      onClick={(e) => {
        e.stopPropagation();
        onOpen();
      }}
    >
      <mesh>
        <planeGeometry args={[0.54, 0.3]} />
        <meshBasicMaterial map={tex} transparent toneMapped={false} depthWrite={false} />
      </mesh>
      {hovered && <pointLight intensity={0.6} distance={1} color={m.color} position={[0, 0, 0.2]} />}
    </group>
  );
}

function tileLayout(count: number, narrow: boolean): Vec3[] {
  if (narrow) {
    // two rows of four above the monitor
    return Array.from({ length: count }, (_, i) => {
      const row = Math.floor(i / 4);
      const col = i % 4;
      return [(col - 1.5) * 0.47, 1.98 - row * 0.3, -0.2] as Vec3;
    });
  }
  // three tiles on each side of the monitor, two above it — all clear of the hologram and the lamp
  const slots: Vec3[] = [
    [-1.48, 1.78, -0.5],
    [-1.66, 1.42, -0.38],
    [-1.6, 1.06, -0.3],
    [-0.33, 1.6, -0.62],
    [0.33, 1.6, -0.62],
    [1.48, 1.78, -0.5],
    [1.66, 1.42, -0.38],
    [1.6, 1.06, -0.3]
  ];
  return slots.slice(0, count);
}

/* ---------- scene ---------- */

function SceneContent({ isDark, lang, modules, reducedMotion, entering, returning, onOpenApp, onToggleLamp, onHoverLabel }: Scene3DProps) {
  const group = useRef<THREE.Group>(null);
  const live = useBprLive();
  const { size } = useThree();
  const narrow = size.width / size.height < 1;
  const layout = useMemo(() => tileLayout(modules.length, narrow), [modules.length, narrow]);
  const T = BPR_TEXT[lang];
  const verify = modules.find((m) => m.id === "verify")!;
  const ledger = modules.find((m) => m.id === "ledger")!;

  const { hour, phase } = useRiyadhClock();
  const night = phase === "night";

  return (
    <>
      <Rig reducedMotion={reducedMotion} narrow={narrow} entering={entering} returning={returning} />
      <Reflections intensity={isDark ? 0.35 : 0.6} />
      <ambientLight intensity={(isDark ? 0.22 : 0.45) + (night ? 0 : 0.18)} />
      <hemisphereLight args={[night ? "#334" : "#dfe8ff", isDark ? "#1a1410" : "#b8a58c", (isDark ? 0.25 : 0.45) + (night ? 0 : 0.3)]} />
      <Sunlight phase={phase} isDark={isDark} />
      <Room isDark={isDark} hour={hour} phase={phase} />
      <Dust reducedMotion={reducedMotion} />
      <group ref={group}>
        <Desk isDark={isDark} />
        <Monitor isDark={isDark} lang={lang} live={live} onOpen={() => onOpenApp(null)} onHoverLabel={onHoverLabel} label={T.enter3d} />
        <Keyboard />
        <DeskProps narrow={narrow} reducedMotion={reducedMotion} />
        <Lamp isDark={isDark} onClick={onToggleLamp} onHoverLabel={onHoverLabel} label={T.lamp} position={narrow ? [0.74, 0.03, 0.3] : [1.45, 0.03, -0.35]} />
        <Hologram
          live={live}
          lang={lang}
          reducedMotion={reducedMotion}
          onOpen={() => onOpenApp("verify")}
          onHoverLabel={onHoverLabel}
          label={`${verify.title} — ${verify.tag}`}
          position={narrow ? [-0.6, 0.03, 0.62] : [-1.2, 0.03, 0.42]}
        />
        <Chain
          live={live}
          reducedMotion={reducedMotion}
          onOpen={() => onOpenApp("ledger")}
          onHoverLabel={onHoverLabel}
          label={`${ledger.title} — ${ledger.tag}`}
          position={narrow ? [0.22, 0.03, 0.05] : [0.55, 0.03, -0.02]}
        />
        {modules.map((m, i) => (
          <Tile key={m.id} m={m} lang={lang} index={i} scale={narrow ? 0.76 : 1} position={layout[i]} reducedMotion={reducedMotion} onOpen={() => onOpenApp(m.id)} onHoverLabel={onHoverLabel} />
        ))}
      </group>
    </>
  );
}

export function Scene3D(props: Scene3DProps) {
  const dpr = useMemo<[number, number]>(() => [1, Math.min(window.devicePixelRatio || 1, 2)], []);
  const [frameloop, setFrameloop] = useState<"always" | "never">(document.visibilityState === "hidden" ? "never" : "always");

  useEffect(() => {
    const onVisibility = () => setFrameloop(document.visibilityState === "hidden" ? "never" : "always");
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <Canvas
      shadows="soft"
      dpr={dpr}
      camera={{ position: [0, 1.45, 3.9], fov: 42 }}
      gl={{ antialias: true, powerPreference: "low-power" }}
      frameloop={frameloop}
      onPointerMissed={() => props.onHoverLabel(null)}
    >
      <color attach="background" args={[props.isDark ? "#0d0f15" : "#faf8f2"]} />
      <Suspense fallback={null}>
        <SceneContent {...props} />
      </Suspense>
    </Canvas>
  );
}
