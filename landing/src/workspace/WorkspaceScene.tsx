import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { ArrowUpRight, BookOpen, BriefcaseBusiness, Lightbulb, Mail, NotebookPen } from 'lucide-react'
import './WorkspaceScene.css'

type AppId = 'about' | 'projects' | 'writing' | 'contact' | 'brainsait' | 'terminal' | 'faq'
type Props = {
  lang: 'ar' | 'en'
  theme: 'dark' | 'light'
  quality: 'low' | 'high'
  onOpen: (app: AppId) => void
  onEnter: () => void
  onTheme: () => void
  onFailure: () => void
}
type Hotspot = 'computer' | 'notebook' | 'books' | 'device' | 'lamp' | 'contact'

const positions: Record<Hotspot, [number, number, number]> = {
  computer: [0.1, 2.28, -0.43],
  notebook: [2.35, 1.05, 0.57],
  books: [-2.55, 1.22, 0.77],
  device: [2.44, 1.16, -1.09],
  lamp: [-2.72, 2.95, -0.8],
  contact: [1.73, 1.01, 1.44],
}

const icons = {
  computer: ArrowUpRight,
  notebook: NotebookPen,
  books: BookOpen,
  device: BriefcaseBusiness,
  lamp: Lightbulb,
  contact: Mail,
}

function canvasTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas is unavailable')
  draw(ctx)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

export default function WorkspaceScene({ lang, theme, quality, onOpen, onEnter, onTheme, onFailure }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const buttons = useRef<Partial<Record<Hotspot, HTMLButtonElement>>>({})
  const callbacks = useRef({ onOpen, onEnter, onTheme, onFailure })
  callbacks.current = { onOpen, onEnter, onTheme, onFailure }
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const mount = host.current
    if (!mount) return
    let disposed = false
    let raf = 0
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: quality === 'high', alpha: true, powerPreference: 'low-power' })
    } catch {
      callbacks.current.onFailure()
      return
    }
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60)
    const geometries = new Set<THREE.BufferGeometry>()
    const materials = new Set<THREE.Material>()
    const textures = new Set<THREE.Texture>()
    const isLight = theme === 'light'
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const world = new THREE.Group()
    scene.add(world)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, quality === 'high' ? 1.8 : 1.1))
    renderer.shadowMap.enabled = quality === 'high'
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = isLight ? 1.35 : 1.13
    renderer.setClearColor(0x000000, 0)
    renderer.domElement.setAttribute('aria-hidden', 'true')
    renderer.domElement.className = 'workspace-scene-canvas'
    mount.prepend(renderer.domElement)

    const material = (color: THREE.ColorRepresentation, roughness = 0.65, metalness = 0) => {
      const result = new THREE.MeshStandardMaterial({ color, roughness, metalness })
      materials.add(result)
      return result
    }
    const obsidian = material('#202827', 0.42, 0.42)
    const metal = material('#89928d', 0.36, 0.76)
    const champagne = material('#c4a879', 0.32, 0.68)
    const ivory = material('#e7e3d8', 0.82)
    const black = material('#111715', 0.55)
    const teal = material('#317972', 0.6)
    const paper = material('#d1cabc', 0.93)
    const geometriesForMesh = <T extends THREE.BufferGeometry>(geometry: T) => { geometries.add(geometry); return geometry }
    const box = (w: number, h: number, d: number, mat: THREE.Material, x: number, y: number, z: number, parent: THREE.Object3D = world) => {
      const mesh = new THREE.Mesh(geometriesForMesh(new THREE.BoxGeometry(w, h, d)), mat)
      mesh.position.set(x, y, z)
      mesh.castShadow = true
      mesh.receiveShadow = true
      parent.add(mesh)
      return mesh
    }
    const cylinder = (top: number, bottom: number, height: number, mat: THREE.Material, x: number, y: number, z: number, parent: THREE.Object3D = world) => {
      const mesh = new THREE.Mesh(geometriesForMesh(new THREE.CylinderGeometry(top, bottom, height, 32)), mat)
      mesh.position.set(x, y, z)
      mesh.castShadow = true
      mesh.receiveShadow = true
      parent.add(mesh)
      return mesh
    }
    const rounded = (w: number, h: number, d: number, radius: number, mat: THREE.Material, x: number, y: number, z: number, parent: THREE.Object3D = world) => {
      const shape = new THREE.Shape()
      shape.moveTo(-w / 2 + radius, -h / 2)
      shape.lineTo(w / 2 - radius, -h / 2)
      shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + radius)
      shape.lineTo(w / 2, h / 2 - radius)
      shape.quadraticCurveTo(w / 2, h / 2, w / 2 - radius, h / 2)
      shape.lineTo(-w / 2 + radius, h / 2)
      shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - radius)
      shape.lineTo(-w / 2, -h / 2 + radius)
      shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + radius, -h / 2)
      const geometry = geometriesForMesh(new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.025, bevelThickness: 0.02, curveSegments: 8 }))
      geometry.translate(0, 0, -d / 2)
      const mesh = new THREE.Mesh(geometry, mat)
      mesh.position.set(x, y, z)
      mesh.castShadow = true
      mesh.receiveShadow = true
      parent.add(mesh)
      return mesh
    }
    const texturedMaterial = (texture: THREE.Texture, emissive = false) => {
      textures.add(texture)
      const mat = emissive
        ? new THREE.MeshBasicMaterial({ map: texture, toneMapped: false })
        : new THREE.MeshStandardMaterial({ map: texture, roughness: 0.9 })
      materials.add(mat)
      return mat
    }
    const plane = (w: number, h: number, mat: THREE.Material, x: number, y: number, z: number, parent: THREE.Object3D = world) => {
      const mesh = new THREE.Mesh(geometriesForMesh(new THREE.PlaneGeometry(w, h)), mat)
      mesh.position.set(x, y, z)
      parent.add(mesh)
      return mesh
    }

    scene.add(new THREE.HemisphereLight(isLight ? '#eff8f5' : '#b8ddce', '#333139', isLight ? 2.3 : 1.8))
    const keyLight = new THREE.DirectionalLight('#fff0d2', isLight ? 4 : 3.3)
    keyLight.position.set(-4, 8, 5)
    keyLight.castShadow = quality === 'high'
    keyLight.shadow.mapSize.set(1024, 1024)
    keyLight.shadow.camera.left = -6
    keyLight.shadow.camera.right = 6
    keyLight.shadow.camera.top = 6
    keyLight.shadow.camera.bottom = -6
    keyLight.shadow.normalBias = 0.025
    keyLight.shadow.bias = -0.0001
    scene.add(keyLight)
    const rimLight = new THREE.DirectionalLight('#52b8ae', 2.3)
    rimLight.position.set(5, 4, -5)
    scene.add(rimLight)

    // The entire composition shares one group, so the camera and DOM hotspots stay aligned.
    const desktop = rounded(8.2, 4.25, 0.19, 0.24, material(isLight ? '#878f83' : '#29332f', 0.8), 0, 0.8, 0)
    desktop.rotation.x = -Math.PI / 2
    const deskEdge = rounded(8.21, 4.26, 0.045, 0.24, champagne, 0, 0.689, 0)
    deskEdge.rotation.x = -Math.PI / 2
    box(0.15, 0.8, 3.2, obsidian, -3.32, 0.22, 0)
    box(0.15, 0.8, 3.2, obsidian, 3.32, 0.22, 0)
    const mat = rounded(4.7, 2.35, 0.016, 0.14, material('#1b2826', 0.97), 0.2, 0.92, 0.44)
    mat.rotation.x = -Math.PI / 2

    // Monitor body, inset display, and a gently angled metallic stand.
    rounded(3.85, 2.42, 0.17, 0.11, obsidian, 0, 2.59, -0.79)
    rounded(3.64, 2.17, 0.012, 0.065, black, 0, 2.62, -0.688)
    const screenTexture = canvasTexture(1440, 850, ctx => {
      ctx.fillStyle = '#123a36'; ctx.fillRect(0, 0, 1440, 850)
      ctx.strokeStyle = '#28514a'; ctx.lineWidth = 1
      for (let i = 0; i < 1440; i += 80) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 850); ctx.stroke() }
      for (let i = 0; i < 850; i += 80) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(1440, i); ctx.stroke() }
      ctx.fillStyle = '#11312e'; ctx.fillRect(0, 0, 1440, 78)
      ctx.fillStyle = '#eeeadd'; ctx.font = '500 24px sans-serif'
      ctx.fillText("FADIL'S WORKSPACE", 58, 48)
      ctx.textAlign = 'right'; ctx.fillStyle = '#a8c6b8'; ctx.fillText('RIYADH  /  24.71 N', 1380, 48)
      ctx.textAlign = 'left'; ctx.fillStyle = '#bda67b'; ctx.font = '500 22px sans-serif'
      ctx.fillText('PHYSICIAN. FOUNDER. BUILDER.', 75, 185)
      ctx.fillStyle = '#f4efdf'; ctx.font = '700 160px Georgia, serif'; ctx.fillText('FADIL.', 67, 370)
      ctx.font = lang === 'ar' ? '400 46px sans-serif' : '400 40px Georgia, serif'
      ctx.fillStyle = '#cfddd1'
      if (lang === 'ar') { ctx.direction = 'rtl'; ctx.textAlign = 'right'; ctx.fillText('رؤية طبيب. وعقلية صانع.', 1360, 451); ctx.direction = 'ltr'; ctx.textAlign = 'left' }
      else ctx.fillText("A physician's perspective. A builder's mindset.", 75, 448)
      ctx.strokeStyle = '#55766a'; ctx.beginPath(); ctx.moveTo(75, 509); ctx.lineTo(1365, 509); ctx.stroke()
      const items = lang === 'ar' ? ['عنّي', 'مشاريعي', 'كتاباتي'] : ['ABOUT', 'PROJECTS', 'WRITING']
      items.forEach((label, index) => {
        const x = 75 + index * 437
        ctx.fillStyle = index === 1 ? '#d0b98b' : '#244c42'; ctx.fillRect(x, 553, 409, 134)
        ctx.fillStyle = index === 1 ? '#19352d' : '#e2e9dc'; ctx.font = '500 28px sans-serif'; ctx.fillText(label, x + 25, 633)
        ctx.font = '400 32px sans-serif'; ctx.fillText('↗', x + 355, 630)
      })
      ctx.fillStyle = '#a9beb0'; ctx.font = '400 22px sans-serif'; ctx.fillText('PERSONAL SPACE / SHARED POSSIBILITIES', 75, 784)
      ctx.fillStyle = '#aad0ab'; ctx.beginPath(); ctx.arc(1351, 774, 7, 0, Math.PI * 2); ctx.fill()
    })
    plane(3.54, 2.085, texturedMaterial(screenTexture, true), 0, 2.62, -0.65)
    box(0.12, 0.028, 0.012, champagne, 0, 1.435, -0.694)
    box(0.3, 0.64, 0.18, metal, 0, 1.27, -0.85).rotation.x = -0.15
    const foot = rounded(1.22, 0.66, 0.085, 0.1, metal, 0, 0.982, -0.71)
    foot.rotation.x = -Math.PI / 2

    // Repeated keycaps use one shared geometry.
    const keyboard = new THREE.Group()
    keyboard.position.set(-0.13, 0.965, 0.78)
    keyboard.rotation.y = -0.035
    world.add(keyboard)
    const keyBase = rounded(2.22, 0.75, 0.08, 0.075, metal, 0, 0, 0, keyboard)
    keyBase.rotation.x = -Math.PI / 2
    const keyGeometry = geometriesForMesh(new THREE.BoxGeometry(0.126, 0.052, 0.13))
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 14; col++) {
        if (row === 3 && col > 3 && col < 10) continue
        const key = new THREE.Mesh(keyGeometry, col === 13 ? teal : ivory)
        key.position.set(-0.986 + col * 0.152, 0.068, -0.25 + row * 0.16)
        key.castShadow = quality === 'high'
        keyboard.add(key)
      }
    }
    box(0.94, 0.052, 0.13, ivory, 0, 0.068, 0.23, keyboard)
    const mouse = new THREE.Mesh(geometriesForMesh(new THREE.SphereGeometry(0.22, 24, 16)), ivory)
    mouse.scale.set(0.83, 0.35, 1.34); mouse.position.set(1.38, 1.015, 0.8); mouse.castShadow = true; world.add(mouse)
    box(0.014, 0.012, 0.07, obsidian, 1.38, 1.092, 0.74)

    // Articulated reading lamp with a warm inner diffuser.
    cylinder(0.35, 0.39, 0.07, champagne, -2.83, 0.98, -1.03)
    cylinder(0.047, 0.047, 1.38, champagne, -2.83, 1.7, -1.03)
    const arm = cylinder(0.04, 0.04, 0.97, champagne, -2.61, 2.63, -1.03)
    arm.rotation.z = -0.49
    const shade = cylinder(0.22, 0.47, 0.34, material('#527268', 0.43, 0.35), -2.37, 3.02, -1.03)
    shade.rotation.z = -0.08
    const bulb = new THREE.MeshBasicMaterial({ color: '#ffe2ab', toneMapped: false }); materials.add(bulb)
    cylinder(0.428, 0.428, 0.012, bulb, -2.357, 2.846, -1.03)
    const lampLight = new THREE.PointLight('#ffd69a', isLight ? 2 : 5, 4, 2)
    lampLight.position.set(-2.36, 2.78, -1.03); world.add(lampLight)

    const bookColors = [material('#70847a'), material('#c6b495'), material('#334d47')]
    bookColors.forEach((cover, i) => {
      const book = new THREE.Group(); book.position.set(-2.72, 0.99 + i * 0.145, 0.78); book.rotation.y = [-0.12, 0.08, -0.18][i]; world.add(book)
      box(1.36, 0.027, 0.91, cover, 0, -0.052, 0, book)
      box(1.30, 0.08, 0.85, paper, 0.01, 0, 0, book)
      box(1.36, 0.027, 0.91, cover, 0, 0.052, 0, book)
      box(0.035, 0.13, 0.91, cover, -0.665, 0, 0, book)
    })
    const bookTitle = canvasTexture(700, 440, ctx => {
      ctx.fillStyle = '#334d47'; ctx.fillRect(0, 0, 700, 440); ctx.strokeStyle = '#afad81'; ctx.lineWidth = 3; ctx.strokeRect(28, 28, 644, 384)
      ctx.fillStyle = '#eee3c8'; ctx.font = '400 38px Georgia, serif'; ctx.textAlign = 'center'; ctx.fillText('IDEAS', 350, 159); ctx.fillText('IN', 350, 215); ctx.fillText('PROGRESS', 350, 271)
      ctx.font = '400 18px sans-serif'; ctx.fillText('DR. FADIL', 350, 364)
    })
    const bookCover = plane(1.32, 0.87, texturedMaterial(bookTitle), -2.72, 1.349, 0.78)
    bookCover.rotation.set(-Math.PI / 2, 0, -0.18)

    const notebook = new THREE.Group(); notebook.position.set(2.63, 1.015, 0.38); notebook.rotation.y = -0.22; world.add(notebook)
    box(1.1, 0.085, 1.38, paper, 0, 0, 0, notebook)
    box(1.16, 0.025, 1.44, material('#b39970', 0.97), 0, 0.058, 0, notebook)
    box(0.025, 0.006, 1.44, obsidian, 0.38, 0.075, 0, notebook)
    const notebookLabel = canvasTexture(384, 450, ctx => {
      ctx.fillStyle = '#b39970'; ctx.fillRect(0, 0, 384, 450); ctx.strokeStyle = '#826e52'; ctx.lineWidth = 2; ctx.strokeRect(58, 102, 264, 212)
      ctx.fillStyle = '#354039'; ctx.textAlign = 'center'; ctx.font = '400 28px Georgia, serif'; ctx.fillText('FIELD', 192, 173); ctx.fillText('NOTES', 192, 214); ctx.font = '400 13px sans-serif'; ctx.fillText('OBSERVE. CONNECT. BUILD.', 192, 264)
    })
    const notebookTop = plane(0.97, 1.25, texturedMaterial(notebookLabel), 0, 0.075, 0, notebook); notebookTop.rotation.x = -Math.PI / 2
    const pen = cylinder(0.027, 0.027, 0.97, champagne, 3.44, 1.035, 0.38); pen.rotation.set(Math.PI / 2, 0, 0.17)

    // A small computing device connects the physical desk to the project collection.
    rounded(0.84, 0.45, 0.7, 0.07, obsidian, 2.68, 1.17, -1.22)
    box(0.68, 0.21, 0.012, black, 2.68, 1.19, -0.855)
    const green = new THREE.MeshBasicMaterial({ color: '#82c9a1' }); materials.add(green)
    box(0.035, 0.035, 0.016, green, 2.42, 1.19, -0.842)
    for (let i = 0; i < 5; i++) box(0.052, 0.045, 0.016, metal, 2.56 + i * 0.085, 1.19, -0.842)
    for (let i = 0; i < 7; i++) box(0.018, 0.007, 0.46, black, 2.43 + i * 0.082, 1.424, -1.22)

    rounded(0.94, 0.46, 0.23, 0.05, black, -1.65, 1.185, -0.21)
    let clockTexture: THREE.CanvasTexture
    const drawClock = (ctx: CanvasRenderingContext2D) => {
      ctx.fillStyle = '#15251f'; ctx.fillRect(0, 0, 512, 240)
      ctx.fillStyle = '#ebdbb6'; ctx.textAlign = 'center'; ctx.font = '400 107px monospace'
      ctx.fillText(new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Riyadh', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()), 256, 143)
      ctx.fillStyle = '#9bb49c'; ctx.font = '400 27px sans-serif'; ctx.fillText('RIYADH / UTC+3', 256, 204)
    }
    clockTexture = canvasTexture(512, 240, drawClock)
    plane(0.83, 0.36, texturedMaterial(clockTexture, true), -1.65, 1.19, -0.07)

    const card = new THREE.Group(); card.position.set(1.91, 0.965, 1.51); card.rotation.y = 0.13; world.add(card)
    box(0.98, 0.022, 0.55, ivory, 0, 0, 0, card)
    const cardTexture = canvasTexture(640, 340, ctx => {
      ctx.fillStyle = '#e7e3d8'; ctx.fillRect(0, 0, 640, 340); ctx.fillStyle = '#1d4740'; ctx.font = '700 62px Georgia, serif'; ctx.fillText('Dr. Fadil', 48, 107)
      ctx.font = '400 23px sans-serif'; ctx.fillText('LET\'S BUILD SOMETHING USEFUL.', 48, 172); ctx.fillStyle = '#897347'; ctx.font = '400 25px sans-serif'; ctx.fillText('elfadil.com', 48, 278)
      ctx.strokeStyle = '#31594f'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(538, 268); ctx.lineTo(585, 221); ctx.moveTo(549, 220); ctx.lineTo(586, 220); ctx.lineTo(586, 257); ctx.stroke()
    })
    const cardTop = plane(0.98, 0.55, texturedMaterial(cardTexture), 0, 0.013, 0, card); cardTop.rotation.x = -Math.PI / 2

    const shadowMaterial = new THREE.ShadowMaterial({ opacity: isLight ? 0.14 : 0.23 }); materials.add(shadowMaterial)
    const ground = plane(24, 24, shadowMaterial, 0, -0.19, 0); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true
    let width = 0
    let height = 0
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0
    const base = new THREE.Vector3()
    const target = new THREE.Vector3(0, 1.48, 0)
    const projected = new THREE.Vector3()
    const render = () => {
      raf = 0
      if (disposed || document.hidden) return
      currentX += (targetX - currentX) * 0.12
      currentY += (targetY - currentY) * 0.12
      camera.position.set(base.x + currentX, base.y + currentY, base.z)
      camera.lookAt(target)
      camera.updateMatrixWorld()
      renderer.render(scene, camera)
      for (const id of Object.keys(positions) as Hotspot[]) {
        const button = buttons.current[id]
        if (!button) continue
        projected.set(...positions[id]).project(camera)
        button.style.left = `${Math.max(25, Math.min(width - 25, (projected.x * 0.5 + 0.5) * width))}px`
        button.style.top = `${Math.max(24, Math.min(height - 24, (-projected.y * 0.5 + 0.5) * height))}px`
      }
      if (Math.abs(targetX - currentX) + Math.abs(targetY - currentY) > 0.001) raf = requestAnimationFrame(render)
    }
    const invalidate = () => { if (!disposed && !raf && !document.hidden) raf = requestAnimationFrame(render) }
    const resize = () => {
      width = mount.clientWidth
      height = mount.clientHeight
      if (!width || !height) return
      renderer.setSize(width, height)
      camera.aspect = width / height
      const distance = Math.max(11.7, 9.85 / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect))
      base.set(distance * 0.23, 1.48 + distance * 0.47, distance * 0.85)
      camera.updateProjectionMatrix()
      invalidate()
    }
    const pointerMove = (event: PointerEvent) => {
      if (reducedMotion.matches || event.pointerType !== 'mouse') return
      const rect = mount.getBoundingClientRect()
      targetX = ((event.clientX - rect.left) / width - 0.5) * 0.45
      targetY = ((event.clientY - rect.top) / height - 0.5) * 0.16
      invalidate()
    }
    const pointerLeave = () => { targetX = 0; targetY = 0; invalidate() }
    const visibility = () => {
      if (document.hidden) { cancelAnimationFrame(raf); raf = 0 }
      else invalidate()
    }
    const contextLost = (event: Event) => { event.preventDefault(); callbacks.current.onFailure() }
    const motionChange = () => { targetX = 0; targetY = 0; currentX = 0; currentY = 0; invalidate() }
    const observer = new ResizeObserver(resize)
    observer.observe(mount)
    mount.addEventListener('pointermove', pointerMove)
    mount.addEventListener('pointerleave', pointerLeave)
    document.addEventListener('visibilitychange', visibility)
    renderer.domElement.addEventListener('webglcontextlost', contextLost)
    reducedMotion.addEventListener('change', motionChange)
    const clockInterval = window.setInterval(() => {
      if (document.hidden) return
      const canvas = clockTexture.image as HTMLCanvasElement
      const context = canvas.getContext('2d')
      if (context) { drawClock(context); clockTexture.needsUpdate = true; invalidate() }
    }, 30_000)
    resize()
    setReady(true)
    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      clearInterval(clockInterval)
      observer.disconnect()
      mount.removeEventListener('pointermove', pointerMove)
      mount.removeEventListener('pointerleave', pointerLeave)
      document.removeEventListener('visibilitychange', visibility)
      renderer.domElement.removeEventListener('webglcontextlost', contextLost)
      reducedMotion.removeEventListener('change', motionChange)
      geometries.forEach(geometry => geometry.dispose())
      materials.forEach(mat => mat.dispose())
      textures.forEach(texture => texture.dispose())
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [lang, theme, quality])

  const labels: Record<Hotspot, string> = lang === 'ar'
    ? { computer: 'افتح مساحة عملي', notebook: 'قصتي', books: 'كتاباتي', device: 'مشاريعي', lamp: theme === 'dark' ? 'الوضع الفاتح' : 'الوضع الداكن', contact: 'لنتعاون' }
    : { computer: 'Enter my workspace', notebook: 'My story', books: 'My writing', device: 'My projects', lamp: theme === 'dark' ? 'Light appearance' : 'Dark appearance', contact: "Let's collaborate" }
  const activate = (id: Hotspot) => {
    if (id === 'computer') onEnter()
    else if (id === 'lamp') onTheme()
    else onOpen(({ notebook: 'about', books: 'writing', device: 'projects', contact: 'contact' } as const)[id])
  }

  return <div ref={host} className={`workspace-scene ${ready ? 'is-ready' : ''}`} data-theme={theme} aria-label={lang === 'ar' ? 'مساحة عمل د. فاضل التفاعلية' : "Dr. Fadil's interactive workspace"}>
    <div className="workspace-scene-hotspots" role="group" aria-label={lang === 'ar' ? 'استكشف مساحة العمل' : 'Explore the workspace'}>
      {(Object.keys(positions) as Hotspot[]).map(id => {
        const Icon = icons[id]
        return <button key={id} ref={element => { if (element) buttons.current[id] = element }} type="button" className={`scene-hotspot scene-hotspot-${id}`} aria-label={labels[id]} title={labels[id]} onClick={() => activate(id)}>
          <Icon size={id === 'computer' ? 16 : 15} strokeWidth={1.6} aria-hidden="true" />
          <span className="scene-hotspot-label">{labels[id]}</span>
        </button>
      })}
    </div>
  </div>
}
