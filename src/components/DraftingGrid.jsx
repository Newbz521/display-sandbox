import { memo, useId, useMemo } from 'react'
import { CELL, GRID_Z } from '../lib/layout'

const LINE = 'rgba(29, 41, 81, 0.42)'
const HASH = 'rgba(29, 41, 81, 0.5)'
const HASH_LEN = 5

function DraftingGrid({ layout, light = false }) {
  const { width, height } = layout.world
  const uid = useId().replace(/:/g, '')
  const cols = Math.ceil(width / CELL)
  const rows = Math.ceil(height / CELL)

  const xs = useMemo(() => Array.from({ length: cols + 1 }, (_, i) => i * CELL), [cols])
  const ys = useMemo(() => Array.from({ length: rows + 1 }, (_, i) => i * CELL), [rows])

  return (
    <svg
      className="drafting-grid pointer-events-none absolute left-0 top-0"
      width={width}
      height={height}
      style={{
        transform: `translateZ(${GRID_Z}px)`,
        transformStyle: 'preserve-3d',
        opacity: 0.72,
      }}
      aria-hidden
    >
      <defs>
        <radialGradient id={`draft-fade-grad-${uid}`} cx="50%" cy="45%" r="82%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="72%" stopColor="white" stopOpacity="1" />
          <stop offset="88%" stopColor="white" stopOpacity="0.55" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id={`draft-fade-${uid}`}>
          <rect width="100%" height="100%" fill={`url(#draft-fade-grad-${uid})`} />
        </mask>
      </defs>

      <g mask={`url(#draft-fade-${uid})`}>
        {xs.map((x) => (
          <line key={`v${x}`} x1={x} y1={0} x2={x} y2={height} stroke={LINE} strokeWidth={1} />
        ))}
        {ys.map((y) => (
          <line key={`h${y}`} x1={0} y1={y} x2={width} y2={y} stroke={LINE} strokeWidth={1} />
        ))}
        {!light &&
          xs.flatMap((x) =>
            ys.map((y) => (
              <g key={`${x}-${y}`}>
                <line
                  x1={x - HASH_LEN}
                  y1={y}
                  x2={x + HASH_LEN}
                  y2={y}
                  stroke={HASH}
                  strokeWidth={0.75}
                />
                <line
                  x1={x}
                  y1={y - HASH_LEN}
                  x2={x}
                  y2={y + HASH_LEN}
                  stroke={HASH}
                  strokeWidth={0.75}
                />
              </g>
            )),
          )}
      </g>
    </svg>
  )
}

export default memo(DraftingGrid)
