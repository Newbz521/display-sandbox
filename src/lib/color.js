/** Small colour helpers for shading the faces of a block. */

const parse = (hex) => {
  const h = hex.replace('#', '')
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
}

const toHex = (rgb) =>
  '#' +
  rgb
    .map((v) =>
      Math.round(Math.min(255, Math.max(0, v)))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')

/** Blend toward white. `amount` is 0–1. */
export const lighten = (hex, amount) => toHex(parse(hex).map((v) => v + (255 - v) * amount))

/** Blend toward black. `amount` is 0–1. */
export const darken = (hex, amount) => toHex(parse(hex).map((v) => v * (1 - amount)))

/**
 * Ink that stays readable on top of `hex`. Never pure black or pure white —
 * navy on the light faces, paper on the dark ones.
 */
export const readableInk = (hex) => {
  const [r, g, b] = parse(hex)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.55 ? 'rgba(29, 41, 81, 0.82)' : 'rgba(248, 245, 239, 0.95)'
}
