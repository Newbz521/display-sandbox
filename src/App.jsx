import { useCallback, useEffect, useMemo, useRef, useState, startTransition } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useReducedMotion,
  useSpring,
} from 'framer-motion'
import {
  LAYOUT,
  LAYOUT_MOBILE,
  mobileBoardFocus,
  PERSPECTIVE_ORIGIN_MOBILE,
  SCENE_DEPTH_MOBILE,
  MOBILE_CAMERA_PADDING,
  MOBILE_CAMERA_SCALE,
  MOBILE_CAMERA_VIEW_OFFSET_Y,
  MOBILE_FOOTER_RESERVE,
  SCENE_DEPTH,
  SPIN_Z,
  SPIN_Z_MOBILE,
  THICKNESS,
  TILT_X,
  TILT_X_MOBILE,
  cameraFor,
} from './lib/layout'
import { focusRect, getFocusTarget } from './lib/focus'
import { detailPadding, cameraSpring, exitHoldMs, returnHoldMs, zoomDelay } from './lib/pieceTiers'
import { RESUME_URL } from './data/portfolio'
import Piece from './components/Piece'
import MarginZone from './components/MarginZone'
import DraftingGrid from './components/DraftingGrid'
import BoardCredit from './components/BoardCredit'
import DetailPanel from './components/DetailPanel'
import CompactPanel from './components/CompactPanel'
import DockPanel from './components/DockPanel'
import MarginPanel from './components/MarginPanel'
import CameraDebug, { createCameraDebugDefaults } from './components/CameraDebug'

const CAMERA_DEBUG_URL = new URLSearchParams(
  typeof window === 'undefined' ? '' : window.location.search,
).has('camera')

function useViewport() {
  const [size, setSize] = useState(() => ({
    width: typeof window === 'undefined' ? 1280 : window.innerWidth,
    height: typeof window === 'undefined' ? 800 : window.innerHeight,
  }))

  useEffect(() => {
    const onResize = () => setSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return size
}

export default function App() {
  const { width: vw, height: vh } = useViewport()
  const reduceMotion = useReducedMotion()

  const [selectedId, setSelectedId] = useState(null)
  const [phase, setPhase] = useState('board') // board | zooming | detail | exiting | returning
  const [hoveredId, setHoveredId] = useState(null)

  const compact = vw < 640
  const scene = compact ? LAYOUT_MOBILE : LAYOUT

  const [cameraDebugOpen, setCameraDebugOpen] = useState(CAMERA_DEBUG_URL)
  const [cameraDebugPanelVisible, setCameraDebugPanelVisible] = useState(true)
  const [cameraDebug, setCameraDebug] = useState(() =>
    createCameraDebugDefaults({
      compact: typeof window !== 'undefined' ? window.innerWidth < 640 : false,
      tiltX: TILT_X,
      tiltXMobile: TILT_X_MOBILE,
      spinZ: SPIN_Z,
      spinZMobile: SPIN_Z_MOBILE,
      sceneDepth:
        typeof window !== 'undefined' && window.innerWidth < 640 ? SCENE_DEPTH_MOBILE : SCENE_DEPTH,
      perspectiveOriginMobile: PERSPECTIVE_ORIGIN_MOBILE,
      padding: typeof window !== 'undefined' && window.innerWidth < 640 ? MOBILE_CAMERA_PADDING : 0.72,
      scaleMultiplier: typeof window !== 'undefined' && window.innerWidth < 640 ? MOBILE_CAMERA_SCALE : 1,
      viewOffsetY:
        typeof window !== 'undefined' && window.innerWidth < 640 ? MOBILE_CAMERA_VIEW_OFFSET_Y : 0,
      mobileFooter: MOBILE_FOOTER_RESERVE,
    }),
  )

  useEffect(() => {
    setCameraDebug((prev) => ({
      ...prev,
      tiltX: compact ? TILT_X_MOBILE : TILT_X,
      spinZ: compact ? SPIN_Z_MOBILE : SPIN_Z,
    }))
  }, [compact])

  const sceneTilt = cameraDebugOpen ? cameraDebug.tiltX : compact ? TILT_X_MOBILE : TILT_X
  const sceneSpin = cameraDebugOpen ? cameraDebug.spinZ : compact ? SPIN_Z_MOBILE : SPIN_Z
  const sceneDepth = cameraDebugOpen
    ? cameraDebug.sceneDepth
    : compact
      ? SCENE_DEPTH_MOBILE
      : SCENE_DEPTH
  const perspectiveOrigin = cameraDebugOpen
    ? `${cameraDebug.perspectiveX}% ${cameraDebug.perspectiveY}%`
    : compact
      ? PERSPECTIVE_ORIGIN_MOBILE
      : 'center center'

  const [floatReady, setFloatReady] = useState(true)
  const [gridReady, setGridReady] = useState(true)
  const frozenAccentRef = useRef(null)

  const focus = useMemo(() => getFocusTarget(selectedId, scene), [selectedId, scene])
  const hovered = useMemo(() => getFocusTarget(hoveredId, scene), [hoveredId, scene])
  const onBoard = phase === 'board'
  const showFooter = phase === 'board'
  const showDetail = phase === 'detail' || phase === 'exiting' || phase === 'returning'
  const panelExiting = phase === 'exiting' || phase === 'returning'
  const showGrid = phase === 'board' && gridReady
  const sceneTransitioning = phase === 'zooming' || phase === 'exiting' || phase === 'returning'

  const camera = useMemo(() => {
    const mobileFooter = cameraDebugOpen ? cameraDebug.mobileFooter : MOBILE_FOOTER_RESERVE
    const camVh = compact ? Math.max(vh - mobileFooter, vh * 0.82) : vh
    const padding = cameraDebugOpen
      ? cameraDebug.padding
      : compact
        ? MOBILE_CAMERA_PADDING
        : 0.72
    const scaleMultiplier = cameraDebugOpen ? cameraDebug.scaleMultiplier : compact ? MOBILE_CAMERA_SCALE : 1
    const viewOffsetY = cameraDebugOpen
      ? cameraDebug.viewOffsetY
      : compact
        ? MOBILE_CAMERA_VIEW_OFFSET_Y
        : 0

    // Pull back to the board while the panel fades — avoids a camera + piece spike at `returning`.
    const pullToBoard = !focus || phase === 'exiting' || phase === 'returning'

    if (pullToBoard) {
      const frame = compact ? mobileBoardFocus(scene) : { x: 0, y: 0, ...scene.world }
      return cameraFor(frame, vw, camVh, {
        layout: scene,
        tiltX: sceneTilt,
        spinZ: sceneSpin,
        padding,
        maxScale: 12,
        scaleMultiplier,
        viewOffsetY,
        zRange: [0, THICKNESS],
      })
    }
    const rect = focusRect(focus)
    return cameraFor(rect, vw, camVh, {
      layout: scene,
      tiltX: sceneTilt,
      spinZ: sceneSpin,
      padding: phase === 'detail' ? detailPadding(focus.tier) : padding,
      maxScale: focus.tier === 'dock' ? 8 : focus.kind === 'margin' ? 10 : 12,
      scaleMultiplier: cameraDebugOpen ? scaleMultiplier : 1,
      viewOffsetY: cameraDebugOpen ? viewOffsetY : 0,
    })
  }, [
    focus,
    phase,
    vw,
    vh,
    scene,
    sceneTilt,
    sceneSpin,
    compact,
    cameraDebugOpen,
    cameraDebug,
  ])

  const spring = useMemo(() => {
    if (cameraDebugOpen) return { stiffness: 800, damping: 50 }
    return cameraSpring(phase, reduceMotion)
  }, [phase, reduceMotion, cameraDebugOpen])
  const camX = useSpring(camera.x, spring)
  const camY = useSpring(camera.y, spring)
  const camScale = useSpring(camera.scale, spring)

  useEffect(() => {
    camX.set(camera.x)
    camY.set(camera.y)
    camScale.set(camera.scale)
  }, [camera, camX, camY, camScale])

  const boardTransform = useMotionTemplate`translate3d(${camX}px, ${camY}px, 0) scale(${camScale}) rotateX(${sceneTilt}deg) rotateZ(${sceneSpin}deg)`

  const select = useCallback((id) => {
    setSelectedId(id)
    setPhase('zooming')
    setHoveredId(null)
  }, [])

  const back = useCallback(() => {
    if (phase === 'detail') setPhase('exiting')
  }, [phase])

  useEffect(() => {
    if (phase !== 'board') {
      setFloatReady(false)
      setGridReady(false)
      return
    }
    const gridT = setTimeout(() => setGridReady(true), 200)
    const floatT = setTimeout(() => setFloatReady(true), 360)
    return () => {
      clearTimeout(gridT)
      clearTimeout(floatT)
    }
  }, [phase])

  useEffect(() => {
    if (phase !== 'exiting') return
    const t = setTimeout(() => setPhase('returning'), exitHoldMs(reduceMotion))
    return () => clearTimeout(t)
  }, [phase, reduceMotion])

  useEffect(() => {
    if (phase !== 'returning') return
    const t = setTimeout(() => {
      startTransition(() => {
        setSelectedId(null)
        setPhase('board')
      })
    }, returnHoldMs(reduceMotion))
    return () => clearTimeout(t)
  }, [phase, reduceMotion])

  useEffect(() => {
    if (phase !== 'zooming' || !focus) return
    const t = setTimeout(() => setPhase('detail'), zoomDelay(focus.tier, reduceMotion))
    return () => clearTimeout(t)
  }, [phase, focus, reduceMotion])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && (phase === 'detail' || phase === 'exiting')) back()
      if (e.key === '?' && phase === 'board' && !cameraDebugOpen) select('legend')
      if ((e.key === 'c' || e.key === 'C') && phase === 'board' && !e.metaKey && !e.ctrlKey) {
        setCameraDebugOpen((open) => {
          if (open) setCameraDebugPanelVisible(true)
          return !open
        })
      }
      if ((e.key === 'h' || e.key === 'H') && phase === 'board' && cameraDebugOpen && !e.metaKey && !e.ctrlKey) {
        setCameraDebugPanelVisible((visible) => !visible)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedId, phase, back, select, cameraDebugOpen])

  const accent = focus ?? hovered
  const bgAccent = sceneTransitioning ? frozenAccentRef.current : accent

  useEffect(() => {
    if (!sceneTransitioning) frozenAccentRef.current = accent
  }, [sceneTransitioning, accent])

  return (
    <div className="relative h-full w-full overflow-hidden bg-paper">
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: bgAccent
              ? `radial-gradient(ellipse 70% 60% at 50% 50%, ${bgAccent.color}1f, transparent 72%)`
              : 'radial-gradient(ellipse 75% 65% at 50% 45%, #e6dccb, transparent 75%)',
          }}
          transition={sceneTransitioning ? { duration: 0 } : { duration: 0.8 }}
        />
        <div className="paper-grid absolute inset-0" />
        <div className="paper-grain absolute inset-0" />
      </div>

      <div
        className="absolute inset-0"
        style={{
          perspective: `${sceneDepth}px`,
          perspectiveOrigin,
        }}
      >
        <motion.div
          className="absolute"
          style={{
            width: scene.world.width,
            height: scene.world.height,
            left: '50%',
            top: '50%',
            marginLeft: -scene.world.width / 2,
            marginTop: -scene.world.height / 2,
            transformStyle: 'preserve-3d',
            transform: boardTransform,
            willChange: sceneTransitioning ? 'transform' : 'auto',
          }}
        >
          {scene.pieces.map((piece) => (
            <Piece
              key={piece.id}
              piece={piece}
              phase={phase}
              isSelected={piece.id === selectedId}
              isHovered={piece.id === hoveredId}
              onSelect={select}
              onHover={setHoveredId}
              allowFloat={floatReady}
              reduceMotion={reduceMotion}
            />
          ))}
          {showGrid && (
            <motion.div
              className="absolute inset-0"
              style={{ transformStyle: 'preserve-3d' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              <DraftingGrid layout={scene} light={compact} />
            </motion.div>
          )}
          {scene.margins.map((zone) => (
            <MarginZone
              key={zone.id}
              zone={zone}
              phase={phase}
              isSelected={zone.id === selectedId}
              isHovered={zone.id === hoveredId}
              onSelect={select}
              onHover={setHoveredId}
            />
          ))}
          <BoardCredit visible={onBoard || phase === 'returning'} layout={scene} compact={compact} />
        </motion.div>
      </div>

      <motion.footer
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-2 p-8 sm:p-10"
        animate={{ opacity: showFooter ? 1 : 0, y: showFooter ? 0 : 12 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <div className="h-6">
              <AnimatePresence mode="wait">
                {hovered ? (
                  <motion.div
                    key={hovered.id}
                    className="flex items-baseline gap-3"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-base font-medium" style={{ color: hovered.color }}>
                      {hovered.label}
                    </span>
                    <span className="text-base text-ink/50 sm:text-sm">{hovered.kicker}</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle-hint"
                    className="text-xs uppercase tracking-[0.22em] text-ink/35 sm:text-[11px] sm:tracking-[0.3em]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    Pick a piece — or explore the margin sheets
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
        <div className={`flex flex-wrap items-center justify-center gap-3${showFooter ? ' pointer-events-auto' : ' pointer-events-none'}`}>
              <a
                href={RESUME_URL}
                download
                className="text-xs uppercase tracking-[0.14em] text-ink/45 underline-offset-4 transition-colors hover:text-ink/75 hover:underline sm:text-[11px] sm:tracking-[0.16em]"
              >
                Résumé ↓
              </a>
              <span className="text-ink/20">·</span>
              {[
                { id: 'now', label: 'Now' },
                { id: 'notes', label: 'Notes' },
                { id: 'blog', label: 'Blog' },
                { id: 'colophon', label: 'A-1' },
                { id: 'legend', label: '?' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => select(item.id)}
                  className="rounded-lg border border-ink/15 bg-card px-3.5 py-2 text-xs uppercase tracking-[0.14em] text-ink/55 transition-colors hover:border-ink/30 hover:text-ink sm:px-3 sm:py-1.5 sm:text-[10px] sm:tracking-[0.16em]"
                >
                  {item.label}
                </button>
              ))}
        </div>
      </motion.footer>

      {showDetail && focus?.kind === 'piece' && focus.tier === 'detail' && (
        <DetailPanel key={focus.id} piece={focus} onBack={back} exiting={panelExiting} />
      )}
      {showDetail && focus?.kind === 'piece' && focus.tier === 'compact' && (
        <CompactPanel key={focus.id} piece={focus} onBack={back} exiting={panelExiting} />
      )}
      {showDetail && focus?.kind === 'piece' && focus.tier === 'dock' && (
        <DockPanel key={focus.id} piece={focus} onBack={back} exiting={panelExiting} />
      )}
      {showDetail && focus?.kind === 'margin' && (
        <MarginPanel key={focus.id} zone={focus} onBack={back} exiting={panelExiting} />
      )}

      <CameraDebug
        active={cameraDebugOpen && onBoard}
        panelVisible={cameraDebugPanelVisible}
        compact={compact}
        values={cameraDebug}
        onChange={setCameraDebug}
        onHidePanel={() => setCameraDebugPanelVisible(false)}
        onShowPanel={() => setCameraDebugPanelVisible(true)}
        onClose={() => setCameraDebugOpen(false)}
      />
    </div>
  )
}
