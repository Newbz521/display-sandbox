import { useState } from 'react'
import { motion } from 'framer-motion'
import { darken, lighten, readableInk } from '../lib/color'

const TRAY = '#cbb89a'
const STAMP = '#e8785c'
const CHISEL = '#1d2951'
const WELLS = ['#6e86b8', '#7fbfa6', '#d9b98c']

/** Low extruded prism sitting on the board plane. */
function Extrude({
  x,
  y,
  w,
  d,
  h,
  color,
  radius = 6,
  children,
  zBase = 0,
}) {
  return (
    <div
      className="absolute"
      style={{
        left: x,
        top: y,
        width: w,
        height: d,
        transformStyle: 'preserve-3d',
        transform: `translateZ(${zBase}px)`,
        pointerEvents: 'none',
      }}
    >
      <div
        className="absolute left-0 top-0"
        style={{
          width: w,
          height: h,
          transformOrigin: '0 0',
          transform: `translateY(${d}px) rotateX(90deg)`,
          background: `linear-gradient(to bottom, ${darken(color, 0.4)}, ${darken(color, 0.18)})`,
          borderBottomLeftRadius: radius * 0.4,
          borderBottomRightRadius: radius * 0.4,
        }}
      />
      <div
        className="absolute left-0 top-0"
        style={{
          width: h,
          height: d,
          transformOrigin: '0 0',
          transform: `translateX(${w}px) rotateY(-90deg)`,
          background: `linear-gradient(to right, ${darken(color, 0.32)}, ${darken(color, 0.08)})`,
          borderTopRightRadius: radius * 0.4,
          borderBottomRightRadius: radius * 0.4,
        }}
      />
      <div
        className="absolute inset-0 grid place-items-center"
        style={{
          transform: `translateZ(${h}px)`,
          borderRadius: radius,
          background: `linear-gradient(155deg, ${lighten(color, 0.1)} 0%, ${color} 58%, ${darken(color, 0.05)} 100%)`,
        }}
      >
        {children}
      </div>
    </div>
  )
}

/**
 * World-space sandbox entry: a small drafting toolkit on the slab
 * (tray, stamp, ink wells, chisel) — not another letter block.
 */
export default function SandboxEntry({ entry, visible, onEnter }) {
  const [hovered, setHovered] = useState(false)
  const [pressed, setPressed] = useState(false)

  if (!entry || !visible) return null

  const W = entry.width
  const D = entry.height
  const pad = 12
  const s = Math.min(W / 190, D / 105)

  const handleEnter = () => {
    onEnter?.()
  }

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label="Open sandbox play board"
      className="absolute outline-none"
      style={{
        left: entry.x,
        top: entry.y,
        width: W,
        height: D,
        transformStyle: 'preserve-3d',
        pointerEvents: 'auto',
        cursor: 'pointer',
      }}
      initial={false}
      animate={{
        z: pressed ? -4 : hovered ? 22 : 0,
        rotateZ: pressed ? 0.6 : hovered ? -1.8 : 0,
        scale: pressed ? 0.97 : hovered ? 1.03 : 1,
      }}
      transition={{ type: 'spring', stiffness: 420, damping: 28 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => {
        setHovered(false)
        setPressed(false)
      }}
      onTapStart={() => setPressed(true)}
      onTap={() => {
        setPressed(false)
        handleEnter()
      }}
      onTapCancel={() => setPressed(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleEnter()
        }
      }}
    >
      {/* Tray base */}
      <Extrude x={0} y={0} w={W} d={D} h={11} color={TRAY} radius={12}>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            borderRadius: 11,
            boxShadow: `inset 0 0 0 1.5px ${darken(TRAY, 0.18)}`,
          }}
        />
      </Extrude>

      {/* Inner sand bed */}
      <Extrude
        x={pad}
        y={pad + 22 * s}
        w={W - pad * 2}
        d={D - pad * 2 - 22 * s}
        h={5}
        color="#e6dccb"
        radius={8}
        zBase={11}
      />

      {/* Stamp — dips a little extra on press */}
      <motion.div
        className="absolute"
        style={{
          left: 0,
          top: 0,
          width: W,
          height: D,
          transformStyle: 'preserve-3d',
          pointerEvents: 'none',
        }}
        animate={{ z: pressed ? -6 : hovered ? 4 : 0 }}
        transition={{ type: 'spring', stiffness: 480, damping: 26 }}
      >
        <Extrude
          x={pad + 10 * s}
          y={pad + 32 * s}
          w={44 * s}
          d={44 * s}
          h={26}
          color={STAMP}
          radius={8}
          zBase={16}
        >
          <span
            className="select-none font-semibold uppercase leading-none tracking-[0.12em]"
            style={{ fontSize: 13 * s, color: readableInk(STAMP) }}
          >
            ▶
          </span>
        </Extrude>
      </motion.div>

      {/* Ink wells — lift slightly on hover */}
      <motion.div
        className="absolute"
        style={{
          left: 0,
          top: 0,
          width: W,
          height: D,
          transformStyle: 'preserve-3d',
          pointerEvents: 'none',
        }}
        animate={{ z: hovered && !pressed ? 6 : 0 }}
        transition={{ type: 'spring', stiffness: 380, damping: 24 }}
      >
        {WELLS.map((c, i) => (
          <Extrude
            key={c}
            x={pad + 68 * s + i * 34 * s}
            y={pad + 38 * s}
            w={24 * s}
            d={24 * s}
            h={16}
            color={c}
            radius={12}
            zBase={16}
          />
        ))}
      </motion.div>

      {/* Height chisel */}
      <motion.div
        className="absolute"
        style={{
          left: 0,
          top: 0,
          width: W,
          height: D,
          transformStyle: 'preserve-3d',
          pointerEvents: 'none',
        }}
        animate={{
          z: hovered && !pressed ? 5 : 0,
          rotateZ: hovered ? 3 : 0,
        }}
        transition={{ type: 'spring', stiffness: 360, damping: 22 }}
      >
        <Extrude
          x={W - pad - 52 * s}
          y={pad + 34 * s}
          w={16 * s}
          d={48 * s}
          h={20}
          color={CHISEL}
          radius={5}
          zBase={16}
        >
          <span
            className="select-none leading-none"
            style={{ fontSize: 12 * s, color: readableInk(CHISEL), transform: 'rotate(-90deg)' }}
          >
            ‖
          </span>
        </Extrude>
      </motion.div>

      {/* Label strip on the tray lip */}
      <div
        className="pointer-events-none absolute grid place-items-center"
        style={{
          left: pad,
          top: 4,
          width: W - pad * 2,
          height: 22,
          transform: 'translateZ(12px)',
        }}
      >
        <span
          className="select-none font-semibold uppercase tracking-[0.22em]"
          style={{
            fontSize: Math.max(14, 15 * s),
            color: hovered ? 'rgba(29, 41, 81, 0.88)' : 'rgba(29, 41, 81, 0.7)',
          }}
        >
          Sandbox
        </span>
      </div>
    </motion.div>
  )
}
