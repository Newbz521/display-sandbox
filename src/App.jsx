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
import { parseBlogRoute, writeBlogUrl, writeDeskUrl } from './lib/blogRoutes'
import { parsePlayRoute, writePlayUrl } from './lib/playRoutes'
import { BLOG_SEED } from './data/blogSeed'
import { OWNER, RESUME_URL } from './data/portfolio'
import { useAuth } from './lib/AuthContext'
import { deletePost, mergeBlogPosts, seedLocalPosts, subscribePosts } from './lib/blogStore'
import {
  applyLivePage,
  applyLiveSite,
  seedPages,
  subscribePages,
  subscribeSite,
} from './lib/contentStore'
import Piece from './components/Piece'
import MarginZone from './components/MarginZone'
import DraftingGrid from './components/DraftingGrid'
import BoardCredit from './components/BoardCredit'
import DetailPanel from './components/DetailPanel'
import CompactPanel from './components/CompactPanel'
import DockPanel from './components/DockPanel'
import MarginPanel from './components/MarginPanel'
import WriteDesk from './components/WriteDesk'
import CameraDebug, { createCameraDebugDefaults } from './components/CameraDebug'
import SandboxTray from './components/SandboxTray'
import SandboxBoard from './components/SandboxBoard'
import SandboxEntry from './components/SandboxEntry'
import SandboxExpired from './components/SandboxExpired'
import {
  adjustCellHeight,
  applyCharAndAdvance,
  buildPlayScene,
  createSandboxState,
  eraseCell,
  ensureActivePiece,
  resetSandbox,
  setSandboxColor,
  stampCell,
  startNewPiece,
  stepGridFocus,
  stepPieceFocus,
} from './lib/sandbox'
import { loadSandbox, saveSandbox } from './lib/sandboxStore'

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
  const [blogSlug, setBlogSlug] = useState(null)
  const [deskOpen, setDeskOpen] = useState(
    () => (typeof window === 'undefined' ? false : parseBlogRoute().kind === 'write'),
  )
  const [deskView, setDeskView] = useState('home')
  const [livePosts, setLivePosts] = useState([])
  const [livePages, setLivePages] = useState({})
  const [liveSite, setLiveSite] = useState(null)
  const [sandboxOpen, setSandboxOpen] = useState(false)
  const [sandboxState, setSandboxState] = useState(createSandboxState)
  const [sandboxTool, setSandboxTool] = useState('stamp')
  const [sandboxPhase, setSandboxPhase] = useState('board') // board | zooming | detail | exiting | returning
  const [sandboxFocus, setSandboxFocus] = useState(null) // { row, col } | null
  const [sandboxSelectedId, setSandboxSelectedId] = useState(null)
  const [sandboxViewOnly, setSandboxViewOnly] = useState(false)
  const [sandboxExpired, setSandboxExpired] = useState(false)
  const [sandboxLoading, setSandboxLoading] = useState(
    () => (typeof window === 'undefined' ? false : parsePlayRoute().kind === 'play'),
  )
  const [sandboxShareBusy, setSandboxShareBusy] = useState(false)
  const [sandboxShareMessage, setSandboxShareMessage] = useState('')
  const [sandboxShareError, setSandboxShareError] = useState('')
  const { isOwner } = useAuth()

  const compact = vw < 640
  const portfolioScene = compact ? LAYOUT_MOBILE : LAYOUT
  const playScene = useMemo(() => buildPlayScene(sandboxState), [sandboxState])
  // While a shared link is loading, frame the play board (not the home layout)
  // so the veil never lifts onto a camera mid-spring from portfolio → sandbox.
  const scene = sandboxOpen || sandboxLoading ? playScene : portfolioScene
  const suppressHomeBoard = sandboxLoading || sandboxOpen || sandboxExpired

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
      padding:
        typeof window !== 'undefined' && window.innerWidth < 640 ? MOBILE_CAMERA_PADDING : 0.72,
      scaleMultiplier:
        typeof window !== 'undefined' && window.innerWidth < 640 ? MOBILE_CAMERA_SCALE : 1,
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
  const ignorePanelBackUntil = useRef(0)
  const sandboxScatterTimers = useRef([])
  const playLoadGen = useRef(0)

  const focus = useMemo(() => getFocusTarget(selectedId, scene), [selectedId, scene])
  const sandboxPieceFocus = useMemo(
    () => (sandboxOpen ? getFocusTarget(sandboxSelectedId, playScene) : null),
    [sandboxOpen, sandboxSelectedId, playScene],
  )
  const blogItems = useMemo(() => mergeBlogPosts([], livePosts), [livePosts])
  const focusedPiece = useMemo(() => {
    if (focus?.kind !== 'piece') return focus
    const live = applyLivePage(focus, livePages)
    if (live.id !== 'blog') return live
    return { ...live, content: { ...live.content, items: blogItems } }
  }, [focus, livePages, blogItems])
  const hovered = useMemo(
    () => applyLivePage(getFocusTarget(hoveredId, scene), livePages),
    [hoveredId, scene, livePages],
  )
  const owner = useMemo(() => applyLiveSite(OWNER, liveSite), [liveSite])
  const onBoard = phase === 'board' && !sandboxOpen && !sandboxLoading && !sandboxExpired
  const showFooter = phase === 'board' && !sandboxOpen && !sandboxLoading && !sandboxExpired
  const showDetail =
    !sandboxOpen &&
    !sandboxLoading &&
    !sandboxExpired &&
    (phase === 'detail' || phase === 'exiting' || phase === 'returning')
  const panelExiting = phase === 'exiting' || phase === 'returning'
  const showGrid = phase === 'board' && gridReady && !suppressHomeBoard
  const sceneTransitioning =
    (!sandboxOpen && (phase === 'zooming' || phase === 'exiting' || phase === 'returning')) ||
    (sandboxOpen &&
      (sandboxPhase === 'zooming' ||
        sandboxPhase === 'exiting' ||
        sandboxPhase === 'returning'))

  const camera = useMemo(() => {
    const mobileFooter = cameraDebugOpen ? cameraDebug.mobileFooter : MOBILE_FOOTER_RESERVE
    const camVh = compact ? Math.max(vh - mobileFooter, vh * 0.82) : vh
    const padding = cameraDebugOpen ? cameraDebug.padding : compact ? MOBILE_CAMERA_PADDING : 0.72
    const scaleMultiplier = cameraDebugOpen
      ? cameraDebug.scaleMultiplier
      : compact
        ? MOBILE_CAMERA_SCALE
        : 1
    const viewOffsetY = cameraDebugOpen
      ? cameraDebug.viewOffsetY
      : compact
        ? MOBILE_CAMERA_VIEW_OFFSET_Y
        : 0

    const sandboxZoomed =
      sandboxOpen &&
      sandboxPieceFocus &&
      (sandboxPhase === 'zooming' || sandboxPhase === 'detail')

    // Pull back to the board while the panel fades — avoids a camera + piece spike at `returning`.
    const pullToBoard = sandboxZoomed
      ? false
      : sandboxOpen ||
        sandboxLoading ||
        !focus ||
        phase === 'exiting' ||
        phase === 'returning'

    if (pullToBoard) {
      const frame =
        sandboxOpen || sandboxLoading || !compact
          ? { x: 0, y: 0, width: scene.world.width, height: scene.world.height }
          : mobileBoardFocus(scene)
      return cameraFor(frame, vw, camVh, {
        layout: scene,
        tiltX: sceneTilt,
        spinZ: sceneSpin,
        padding: sandboxOpen || sandboxLoading ? 0.78 : padding,
        maxScale: 12,
        scaleMultiplier,
        viewOffsetY,
        zRange: [0, THICKNESS],
      })
    }

    const target = sandboxZoomed ? sandboxPieceFocus : focus
    const rect = focusRect(target)
    const zoomPhase = sandboxZoomed ? sandboxPhase : phase
    return cameraFor(rect, vw, camVh, {
      layout: scene,
      tiltX: sceneTilt,
      spinZ: sceneSpin,
      padding: zoomPhase === 'detail' ? detailPadding(target.tier) : padding,
      maxScale: target.tier === 'dock' ? 8 : target.kind === 'margin' ? 10 : 12,
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
    sandboxOpen,
    sandboxLoading,
    sandboxPhase,
    sandboxPieceFocus,
  ])

  const spring = useMemo(() => {
    if (cameraDebugOpen) return { stiffness: 800, damping: 50 }
    if (sandboxLoading) return { stiffness: 800, damping: 50 }
    if (sandboxOpen) return cameraSpring(sandboxPhase, reduceMotion)
    return cameraSpring(phase, reduceMotion)
  }, [phase, sandboxPhase, sandboxOpen, sandboxLoading, reduceMotion, cameraDebugOpen])
  const camX = useSpring(camera.x, spring)
  const camY = useSpring(camera.y, spring)
  const camScale = useSpring(camera.scale, spring)

  useEffect(() => {
    // Shared-link boot: snap framing instantly under the veil (no portfolio → play spring).
    if (sandboxLoading) {
      camX.jump(camera.x)
      camY.jump(camera.y)
      camScale.jump(camera.scale)
      return
    }
    camX.set(camera.x)
    camY.set(camera.y)
    camScale.set(camera.scale)
  }, [camera, camX, camY, camScale, sandboxLoading])

  const boardTransform = useMotionTemplate`translate3d(${camX}px, ${camY}px, 0) scale(${camScale}) rotateX(${sceneTilt}deg) rotateZ(${sceneSpin}deg)`

  const select = useCallback((id) => {
    if (sandboxOpen) return
    setDeskOpen(false)
    setSelectedId(id)
    setPhase('zooming')
    setHoveredId(null)
    if (id === 'blog') {
      setBlogSlug(null)
      writeBlogUrl(null)
    } else {
      setBlogSlug(null)
      writeBlogUrl(undefined)
    }
  }, [sandboxOpen])

  const enterSandbox = useCallback(() => {
    if (compact || phase !== 'board') return
    setSelectedId(null)
    setHoveredId(null)
    setSandboxState(createSandboxState())
    setSandboxTool('stamp')
    setSandboxPhase('board')
    setSandboxFocus(null)
    setSandboxSelectedId(null)
    setSandboxViewOnly(false)
    setSandboxExpired(false)
    setSandboxShareMessage('')
    setSandboxShareError('')
    setSandboxOpen(true)
  }, [compact, phase])

  const exitSandbox = useCallback(() => {
    playLoadGen.current += 1
    sandboxScatterTimers.current.forEach(clearTimeout)
    sandboxScatterTimers.current = []
    setSandboxOpen(false)
    setSandboxState(resetSandbox())
    setSandboxTool('stamp')
    setSandboxPhase('board')
    setSandboxFocus(null)
    setSandboxSelectedId(null)
    setSandboxViewOnly(false)
    setSandboxShareBusy(false)
    setSandboxShareMessage('')
    setSandboxShareError('')
    setSandboxLoading(false)
    setHoveredId(null)
    if (parsePlayRoute().kind === 'play') writePlayUrl(undefined, { replace: true })
  }, [])

  const closeSandboxPiece = useCallback(() => {
    if (sandboxPhase === 'detail' || sandboxPhase === 'zooming') {
      setSandboxPhase('exiting')
    }
  }, [sandboxPhase])

  const selectSandboxPiece = useCallback(
    (id) => {
      if (!id) return
      if (sandboxPhase === 'detail' || sandboxPhase === 'zooming') {
        if (id === sandboxSelectedId) closeSandboxPiece()
        return
      }
      if (sandboxPhase !== 'board') return
      setSandboxSelectedId(id)
      setSandboxPhase('zooming')
      setHoveredId(null)
    },
    [sandboxPhase, sandboxSelectedId, closeSandboxPiece],
  )

  const openSharedSandbox = useCallback(async (id, { replace = true } = {}) => {
    const gen = ++playLoadGen.current
    setDeskOpen(false)
    setSelectedId(null)
    setHoveredId(null)
    setBlogSlug(null)
    setPhase('board')
    setSandboxExpired(false)
    setSandboxShareMessage('')
    setSandboxShareError('')
    setSandboxLoading(true)
    writePlayUrl(id, { replace })

    try {
      const result = await loadSandbox(id)
      if (gen !== playLoadGen.current) return
      if (result.status !== 'ok') {
        setSandboxOpen(false)
        setSandboxViewOnly(false)
        setSandboxState(resetSandbox())
        setSandboxExpired(true)
        return
      }
      setSandboxState(result.state)
      setSandboxTool('stamp')
      setSandboxPhase('board')
      setSandboxFocus(null)
      setSandboxViewOnly(true)
      setSandboxOpen(true)
      setSandboxExpired(false)
    } catch {
      if (gen !== playLoadGen.current) return
      setSandboxOpen(false)
      setSandboxViewOnly(false)
      setSandboxExpired(true)
    } finally {
      if (gen !== playLoadGen.current) return
      // Let the shared board paint under the veil, then lift it.
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          if (gen === playLoadGen.current) setSandboxLoading(false)
        })
      })
    }
  }, [])

  const dismissSandboxExpired = useCallback(() => {
    setSandboxExpired(false)
    setSandboxLoading(false)
    writePlayUrl(undefined, { replace: true })
  }, [])

  const shareSandboxBoard = useCallback(async () => {
    if (sandboxViewOnly || sandboxShareBusy || sandboxPhase !== 'board') return
    setSandboxShareBusy(true)
    setSandboxShareError('')
    setSandboxShareMessage('')
    try {
      const { url } = await saveSandbox(sandboxState)
      try {
        await navigator.clipboard.writeText(url)
        setSandboxShareMessage('Link copied · expires in 1h')
      } catch {
        setSandboxShareMessage(url)
      }
    } catch (err) {
      setSandboxShareError(err?.message || 'Could not share this board.')
    } finally {
      setSandboxShareBusy(false)
    }
  }, [sandboxViewOnly, sandboxShareBusy, sandboxPhase, sandboxState])

  const onSandboxPaintCell = useCallback(
    (row, col) => {
      if (sandboxViewOnly || sandboxPhase !== 'board') return

      if (sandboxTool === 'erase') {
        setSandboxState((s) => eraseCell(s, row, col))
        setSandboxFocus((f) => (f && f.row === row && f.col === col ? null : f))
        return
      }
      if (sandboxTool === 'raise') {
        setSandboxState((s) => adjustCellHeight(s, row, col, 0.12))
        setSandboxFocus({ row, col })
        return
      }
      if (sandboxTool === 'lower') {
        setSandboxState((s) => adjustCellHeight(s, row, col, -0.12))
        setSandboxFocus({ row, col })
        return
      }

      // Paint: stamp empty / other-piece cells; re-clicking your own just selects for typing.
      setSandboxState((s) => {
        const primed = ensureActivePiece(s)
        const existing = primed.grid[row][col]
        if (existing && existing.pieceId === primed.activePieceId) return primed
        return stampCell(primed, row, col)
      })
      setSandboxFocus({ row, col })
    },
    [sandboxTool, sandboxPhase, sandboxViewOnly],
  )

  const runSandboxScatter = useCallback(() => {
    if (sandboxPhase !== 'board' || playScene.pieces.length === 0) return
    sandboxScatterTimers.current.forEach(clearTimeout)
    sandboxScatterTimers.current = []
    setSandboxSelectedId(null)
    setSandboxPhase('zooming')
    const outMs = reduceMotion ? 200 : 720
    const backMs = outMs + returnHoldMs(reduceMotion)
    sandboxScatterTimers.current.push(
      window.setTimeout(() => setSandboxPhase('returning'), outMs),
      window.setTimeout(() => {
        setSandboxPhase('board')
        setSandboxSelectedId(null)
      }, backMs),
    )
  }, [sandboxPhase, playScene.pieces.length, reduceMotion])

  const back = useCallback(() => {
    if (Date.now() < ignorePanelBackUntil.current) return
    if (phase === 'detail') {
      setBlogSlug(null)
      writeBlogUrl(undefined)
      setPhase('exiting')
    }
  }, [phase])

  const openBlogArticle = useCallback((slug) => {
    setBlogSlug(slug)
    writeBlogUrl(slug, { replace: slug == null })
  }, [])

  const openDesk = useCallback((view = 'home') => {
    setDeskView(view)
    setDeskOpen(true)
    writeDeskUrl()
  }, [])

  const closeDesk = useCallback(() => {
    ignorePanelBackUntil.current = Date.now() + 400
    setDeskOpen(false)
    setDeskView('home')
    const replace = parseBlogRoute().kind === 'write'
    if (selectedId === 'blog') writeBlogUrl(blogSlug, { replace })
    else writeBlogUrl(undefined, { replace })
  }, [selectedId, blogSlug])

  const closeDeskToBoard = useCallback(() => {
    setDeskOpen(false)
    setDeskView('home')
    setBlogSlug(null)
    writeBlogUrl(undefined, { replace: true })
    setPhase((current) => (current === 'detail' || current === 'zooming' ? 'exiting' : current))
  }, [])

  const onPublished = useCallback((slug) => {
    setDeskOpen(false)
    setSelectedId('blog')
    setBlogSlug(slug)
    setPhase('detail')
    writeBlogUrl(slug)
  }, [])

  const onDeletePost = useCallback(async (item) => {
    const slug = item?.slug
    if (!slug) return
    const ok = window.confirm(`Delete “${item.title}”? This cannot be undone.`)
    if (!ok) return
    try {
      await deletePost(slug)
      if (blogSlug === slug) openBlogArticle(null)
    } catch (err) {
      window.alert(err?.message || 'Could not delete that post.')
    }
  }, [blogSlug, openBlogArticle])

  useEffect(() => subscribePosts(setLivePosts, () => setLivePosts([])), [])
  useEffect(() => subscribePages(setLivePages, () => setLivePages({})), [])
  useEffect(() => subscribeSite(setLiveSite, () => setLiveSite(null)), [])

  useEffect(() => {
    if (!isOwner) return undefined
    let cancelled = false
    Promise.all([seedLocalPosts(BLOG_SEED), seedPages()]).catch((err) => {
      if (!cancelled) console.warn('Could not seed content', err)
    })
    return () => {
      cancelled = true
    }
  }, [isOwner])

  // Deep link: /play/{id}, /blog, /blog/{slug}, /write
  useEffect(() => {
    const play = parsePlayRoute()
    if (play.kind === 'play') {
      openSharedSandbox(play.id, { replace: true })
      return
    }
    const route = parseBlogRoute()
    if (route.kind === 'write') {
      setDeskOpen(true)
      return
    }
    if (route.kind !== 'blog') return
    setSelectedId('blog')
    setBlogSlug(route.slug)
    setPhase('detail')
    writeBlogUrl(route.slug, { replace: true })
  }, [openSharedSandbox])

  useEffect(() => {
    const onPopState = () => {
      const play = parsePlayRoute()
      if (play.kind === 'play') {
        openSharedSandbox(play.id, { replace: true })
        return
      }
      if (sandboxOpen || sandboxLoading) {
        playLoadGen.current += 1
        sandboxScatterTimers.current.forEach(clearTimeout)
        sandboxScatterTimers.current = []
        setSandboxOpen(false)
        setSandboxState(resetSandbox())
        setSandboxTool('stamp')
        setSandboxPhase('board')
        setSandboxFocus(null)
        setSandboxSelectedId(null)
        setSandboxViewOnly(false)
        setSandboxShareMessage('')
        setSandboxShareError('')
        setSandboxLoading(false)
        setHoveredId(null)
      }
      setSandboxExpired(false)

      const route = parseBlogRoute()
      if (route.kind === 'write') {
        setDeskOpen(true)
        return
      }
      setDeskOpen(false)
      if (route.kind === 'blog') {
        setSelectedId('blog')
        setBlogSlug(route.slug)
        setHoveredId(null)
        setPhase('detail')
        return
      }
      setBlogSlug(null)
      setPhase((current) => {
        if (current === 'detail' || current === 'zooming') return 'exiting'
        return current
      })
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [openSharedSandbox, sandboxOpen, sandboxLoading])

  useEffect(() => {
    if (compact && sandboxOpen && !sandboxViewOnly) exitSandbox()
  }, [compact, sandboxOpen, sandboxViewOnly, exitSandbox])

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
    if (sandboxPhase !== 'zooming' || !sandboxSelectedId) return
    const tier = sandboxPieceFocus?.tier ?? 'compact'
    const t = setTimeout(() => setSandboxPhase('detail'), zoomDelay(tier, reduceMotion))
    return () => clearTimeout(t)
  }, [sandboxPhase, sandboxSelectedId, sandboxPieceFocus, reduceMotion])

  useEffect(() => {
    if (sandboxPhase !== 'exiting') return
    const t = setTimeout(() => setSandboxPhase('returning'), exitHoldMs(reduceMotion))
    return () => clearTimeout(t)
  }, [sandboxPhase, reduceMotion])

  useEffect(() => {
    if (sandboxPhase !== 'returning') return
    const t = setTimeout(() => {
      startTransition(() => {
        setSandboxSelectedId(null)
        setSandboxPhase('board')
      })
    }, returnHoldMs(reduceMotion))
    return () => clearTimeout(t)
  }, [sandboxPhase, reduceMotion])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && deskOpen) {
        closeDesk()
        return
      }
      if (e.key === 'Escape' && sandboxOpen) {
        if (sandboxPhase === 'detail' || sandboxPhase === 'zooming') {
          closeSandboxPiece()
          return
        }
        if (sandboxFocus) {
          setSandboxFocus(null)
          return
        }
        exitSandbox()
        return
      }
      if (
        sandboxOpen &&
        !sandboxViewOnly &&
        (sandboxPhase === 'board' || sandboxPhase === 'detail') &&
        sandboxFocus &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey
      ) {
        const { row, col } = sandboxFocus

        if (e.key === 'Tab') {
          e.preventDefault()
          setSandboxState((s) => {
            const next = stepPieceFocus(s, row, col, e.shiftKey ? -1 : 1)
            queueMicrotask(() => setSandboxFocus(next))
            return s
          })
          return
        }

        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault()
          const dRow = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0
          const dCol = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
          setSandboxState((s) => {
            const next = stepGridFocus(s, row, col, dRow, dCol)
            queueMicrotask(() => setSandboxFocus(next))
            return s
          })
          return
        }

        if (e.key === 'Backspace' || e.key === 'Delete') {
          e.preventDefault()
          setSandboxState((s) => {
            const prev = stepPieceFocus(s, row, col, -1)
            const next = eraseCell(s, row, col)
            const focus =
              prev.row === row && prev.col === col
                ? null
                : next.grid[prev.row]?.[prev.col]
                  ? prev
                  : null
            queueMicrotask(() => setSandboxFocus(focus))
            return next
          })
          return
        }

        if (e.key === '=' || e.key === '+' || e.key === ']') {
          e.preventDefault()
          setSandboxState((s) => adjustCellHeight(s, row, col, 0.12))
          return
        }
        if (e.key === '-' || e.key === '_' || e.key === '[') {
          e.preventDefault()
          setSandboxState((s) => adjustCellHeight(s, row, col, -0.12))
          return
        }

        if (e.key.length === 1 && /[a-zA-Z0-9]/.test(e.key)) {
          e.preventDefault()
          setSandboxState((s) => {
            const { state: next, focus } = applyCharAndAdvance(s, row, col, e.key)
            queueMicrotask(() => setSandboxFocus(focus))
            return next
          })
          return
        }
      }
      if (e.key === 'Escape' && (phase === 'detail' || phase === 'exiting')) back()
      if (e.key === '?' && phase === 'board' && !cameraDebugOpen && !sandboxOpen) select('legend')
      if (
        (e.key === 'c' || e.key === 'C') &&
        phase === 'board' &&
        !sandboxOpen &&
        !e.metaKey &&
        !e.ctrlKey
      ) {
        setCameraDebugOpen((open) => {
          if (open) setCameraDebugPanelVisible(true)
          return !open
        })
      }
      if (
        (e.key === 'h' || e.key === 'H') &&
        phase === 'board' &&
        cameraDebugOpen &&
        !e.metaKey &&
        !e.ctrlKey
      ) {
        setCameraDebugPanelVisible((visible) => !visible)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [
    selectedId,
    phase,
    back,
    select,
    cameraDebugOpen,
    deskOpen,
    closeDesk,
    sandboxOpen,
    sandboxPhase,
    sandboxFocus,
    sandboxViewOnly,
    exitSandbox,
    closeSandboxPiece,
  ])

  const accent = (sandboxOpen ? sandboxPieceFocus : focus) ?? hovered
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
          {sandboxOpen ? (
            <SandboxBoard
              scene={playScene}
              phase={sandboxPhase}
              tool={sandboxTool}
              selectedId={sandboxSelectedId}
              hoveredId={hoveredId}
              focusedCell={sandboxViewOnly ? null : sandboxFocus}
              onHover={setHoveredId}
              onSelectPiece={selectSandboxPiece}
              onPaintCell={onSandboxPaintCell}
              reduceMotion={reduceMotion}
              viewOnly={sandboxViewOnly}
            />
          ) : suppressHomeBoard ? null : (
            <>
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
              <BoardCredit
                visible={onBoard || phase === 'returning'}
                layout={scene}
                compact={compact}
                owner={owner}
              />
              <SandboxEntry
                entry={portfolioScene.sandboxEntry}
                visible={onBoard && !compact && !deskOpen}
                onEnter={enterSandbox}
              />
            </>
          )}
        </motion.div>
      </div>

      {sandboxOpen && (
        <SandboxTray
          tool={sandboxTool}
          color={sandboxState.activeColor}
          onExit={exitSandbox}
          onTool={setSandboxTool}
          onColor={(c) => setSandboxState((s) => setSandboxColor(s, c))}
          onNewPiece={() => setSandboxState((s) => startNewPiece(s))}
          onScatter={runSandboxScatter}
          onReset={() => {
            setSandboxState(resetSandbox())
            setSandboxTool('stamp')
            setSandboxPhase('board')
            setSandboxFocus(null)
            setSandboxShareMessage('')
            setSandboxShareError('')
          }}
          onShare={shareSandboxBoard}
          shareBusy={sandboxShareBusy}
          shareMessage={sandboxShareMessage}
          shareError={sandboxShareError}
          scatterBusy={sandboxPhase !== 'board'}
          viewOnly={sandboxViewOnly}
        />
      )}

      <AnimatePresence>
        {sandboxLoading && (
          <motion.div
            key="sandbox-loading"
            className="absolute inset-0 z-40 flex items-center justify-center p-6"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.12 : 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="pointer-events-none absolute inset-0 bg-paper/92">
              <div className="paper-grid absolute inset-0 opacity-50" />
              <div className="paper-grain absolute inset-0" />
            </div>
            <motion.div
              className="relative text-center"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="text-[10px] uppercase tracking-[0.22em] text-ink/40">Sandbox</div>
              <p className="mt-2 text-sm text-ink/55">Opening shared board…</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {sandboxExpired && !sandboxLoading && <SandboxExpired onHome={dismissSandboxExpired} />}

      <motion.footer
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-2 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:gap-2 sm:p-10"
        animate={{ opacity: showFooter ? 1 : 0, y: showFooter ? 0 : 12 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <div className="hidden h-6 sm:block">
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
        <div
          className={`flex flex-wrap items-center justify-center gap-3${showFooter ? ' pointer-events-auto' : ' pointer-events-none'}`}
        >
          <a
            href={RESUME_URL}
            download
            className="text-xs uppercase tracking-[0.14em] text-ink/45 underline-offset-4 transition-colors hover:text-ink/75 hover:underline sm:text-[11px] sm:tracking-[0.16em]"
          >
            Résumé ↓
          </a>
          <div className="hidden sm:contents">
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
        </div>
      </motion.footer>

      {showDetail && focusedPiece?.kind === 'piece' && focusedPiece.tier === 'detail' && (
        <DetailPanel
          key={focusedPiece.id}
          piece={focusedPiece}
          onBack={back}
          exiting={panelExiting}
          openSlug={focusedPiece.id === 'blog' ? blogSlug : null}
          onOpenSlug={focusedPiece.id === 'blog' ? openBlogArticle : undefined}
          canWrite={focusedPiece.id === 'blog' && isOwner}
          onCompose={focusedPiece.id === 'blog' ? () => openDesk('post') : undefined}
          onDeletePost={focusedPiece.id === 'blog' && isOwner ? onDeletePost : undefined}
          canEdit={isOwner}
          onEdit={() => openDesk(focusedPiece.id)}
        />
      )}
      {showDetail && focusedPiece?.kind === 'piece' && focusedPiece.tier === 'compact' && (
        <CompactPanel
          key={focusedPiece.id}
          piece={focusedPiece}
          onBack={back}
          exiting={panelExiting}
          canEdit={isOwner}
          onEdit={() => openDesk(focusedPiece.id)}
        />
      )}
      {showDetail && focusedPiece?.kind === 'piece' && focusedPiece.tier === 'dock' && (
        <DockPanel
          key={focusedPiece.id}
          piece={focusedPiece}
          onBack={back}
          exiting={panelExiting}
          canEdit={isOwner}
          onEdit={() => openDesk(focusedPiece.id)}
        />
      )}
      {showDetail && focus?.kind === 'margin' && (
        <MarginPanel key={focus.id} zone={focus} onBack={back} exiting={panelExiting} />
      )}

      <AnimatePresence>
        {deskOpen ? (
          <WriteDesk
            key="write-desk"
            onClose={closeDesk}
            onBackToBoard={closeDeskToBoard}
            onPublished={onPublished}
            initialView={deskView}
            livePages={livePages}
            liveSite={liveSite}
          />
        ) : null}
      </AnimatePresence>

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
