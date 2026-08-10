import { useCallback, useEffect, useMemo } from 'react'

function parsePerspectiveOrigin(origin) {
  const parts = origin.split(/\s+/)
  const x = parseFloat(parts[0]) || 50
  const y = parseFloat(parts[1] ?? parts[0]) || 50
  return { x, y }
}

export function createCameraDebugDefaults({
  compact,
  tiltX,
  tiltXMobile,
  spinZ,
  spinZMobile,
  sceneDepth,
  perspectiveOriginMobile,
  padding,
  scaleMultiplier,
  viewOffsetY,
  mobileFooter,
}) {
  const origin = parsePerspectiveOrigin(perspectiveOriginMobile)
  return {
    tiltX: compact ? tiltXMobile : tiltX,
    spinZ: compact ? spinZMobile : spinZ,
    sceneDepth,
    perspectiveX: compact ? origin.x : 50,
    perspectiveY: compact ? origin.y : 50,
    padding,
    scaleMultiplier,
    viewOffsetY,
    mobileFooter,
  }
}

export function formatCameraDebug(values, compact) {
  const prefix = compact ? 'MOBILE' : 'DESKTOP'
  const perspectiveOrigin = `${values.perspectiveX}% ${values.perspectiveY}%`
  const lines = compact
    ? {
        TILT_X_MOBILE: Math.round(values.tiltX * 10) / 10,
        SPIN_Z_MOBILE: Math.round(values.spinZ * 10) / 10,
        SCENE_DEPTH: Math.round(values.sceneDepth),
        PERSPECTIVE_ORIGIN_MOBILE: `"${perspectiveOrigin}"`,
        padding: Math.round(values.padding * 100) / 100,
        scaleMultiplier: Math.round(values.scaleMultiplier * 100) / 100,
        viewOffsetY: Math.round(values.viewOffsetY),
        mobileFooter: Math.round(values.mobileFooter),
      }
    : {
        TILT_X: Math.round(values.tiltX * 10) / 10,
        SPIN_Z: Math.round(values.spinZ * 10) / 10,
        SCENE_DEPTH: Math.round(values.sceneDepth),
        PERSPECTIVE_ORIGIN: `"${perspectiveOrigin}"`,
        padding: Math.round(values.padding * 100) / 100,
        scaleMultiplier: Math.round(values.scaleMultiplier * 100) / 100,
        viewOffsetY: Math.round(values.viewOffsetY),
      }

  return { prefix, perspectiveOrigin, lines }
}

export default function CameraDebug({
  active,
  panelVisible,
  compact,
  values,
  onChange,
  onHidePanel,
  onShowPanel,
  onClose,
}) {
  const payload = useMemo(() => formatCameraDebug(values, compact), [values, compact])

  const logValues = useCallback(() => {
    const block = JSON.stringify(payload.lines, null, 2)
    console.log(`[camera-debug ${payload.prefix}]`, payload.lines)
    console.log(`[camera-debug ${payload.prefix}] copy paste:\n${block}`)
    return block
  }, [payload])

  useEffect(() => {
    if (!active || !panelVisible) return
    logValues()
  }, [active, panelVisible, logValues, values])

  const copy = async () => {
    const block = logValues()
    try {
      await navigator.clipboard.writeText(block)
    } catch {
      // clipboard may be blocked; console still has the values
    }
  }

  if (!active) return null

  if (!panelVisible) {
    return (
      <button
        type="button"
        onClick={onShowPanel}
        className="pointer-events-auto fixed right-3 top-3 z-50 rounded-full border border-ink/20 bg-card/90 px-3 py-2 text-[10px] font-medium uppercase tracking-[0.14em] text-ink/60 shadow-md backdrop-blur-sm"
      >
        Camera · H
      </button>
    )
  }

  const set = (key, value) => onChange({ ...values, [key]: value })

  return (
    <div className="pointer-events-auto fixed inset-x-3 top-3 z-50 max-h-[88vh] overflow-y-auto rounded-xl border border-ink/20 bg-card/95 p-4 text-xs text-ink shadow-lg backdrop-blur-md sm:inset-x-auto sm:right-3 sm:w-80">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold uppercase tracking-[0.14em] text-ink/70">Camera debug</p>
          <p className="mt-1 text-[10px] text-ink/45">
            {compact ? 'Mobile' : 'Desktop'} · <kbd className="rounded bg-ink/8 px-1">H</kbd> hide ·{' '}
            <kbd className="rounded bg-ink/8 px-1">C</kbd> exit
          </p>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onHidePanel}
            className="rounded border border-ink/15 px-2 py-1 text-[10px] uppercase tracking-wider text-ink/55"
          >
            Hide
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-ink/15 px-2 py-1 text-[10px] uppercase tracking-wider text-ink/55"
          >
            Exit
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <Slider label="rotateX (tilt)" value={values.tiltX} min={0} max={60} step={0.5} onChange={(v) => set('tiltX', v)} />
        <Slider label="rotateZ (spin)" value={values.spinZ} min={-30} max={30} step={0.5} onChange={(v) => set('spinZ', v)} />
        <Slider
          label="perspective (px)"
          value={values.sceneDepth}
          min={600}
          max={3200}
          step={50}
          onChange={(v) => set('sceneDepth', v)}
        />
        <Slider
          label="perspective origin X %"
          value={values.perspectiveX}
          min={0}
          max={100}
          step={1}
          onChange={(v) => set('perspectiveX', v)}
        />
        <Slider
          label="perspective origin Y %"
          value={values.perspectiveY}
          min={0}
          max={100}
          step={1}
          onChange={(v) => set('perspectiveY', v)}
        />
        <Slider label="padding (zoom fill)" value={values.padding} min={0.4} max={1} step={0.01} onChange={(v) => set('padding', v)} />
        <Slider
          label="scale multiplier"
          value={values.scaleMultiplier}
          min={0.5}
          max={2}
          step={0.01}
          onChange={(v) => set('scaleMultiplier', v)}
        />
        <Slider
          label="view offset Y (px)"
          value={values.viewOffsetY}
          min={-200}
          max={200}
          step={1}
          onChange={(v) => set('viewOffsetY', v)}
        />
        {compact && (
          <Slider
            label="footer reserve (px)"
            value={values.mobileFooter}
            min={60}
            max={160}
            step={1}
            onChange={(v) => set('mobileFooter', v)}
          />
        )}
      </div>

      <pre className="mt-4 max-h-40 overflow-auto rounded bg-ink/5 p-2 font-mono text-[10px] leading-relaxed text-ink/70">
        {JSON.stringify(payload.lines, null, 2)}
      </pre>

      <button
        type="button"
        onClick={copy}
        className="mt-3 w-full rounded-lg border border-ink/20 bg-ink/5 py-2 text-[10px] font-medium uppercase tracking-[0.16em] text-ink/70"
      >
        Log + copy values
      </button>
    </div>
  )
}

function Slider({ label, value, min, max, step, onChange }) {
  return (
    <label className="block">
      <div className="mb-1 flex justify-between text-[10px] text-ink/55">
        <span>{label}</span>
        <span className="font-mono text-ink/70">{typeof value === 'number' ? value.toFixed(step < 1 ? 2 : 0) : value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-ink"
      />
    </label>
  )
}
