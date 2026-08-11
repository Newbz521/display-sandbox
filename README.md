# Block portfolio

A React + Tailwind portfolio whose landing page is a square built out of seven
pieces, floating on a board tilted slightly into perspective. Every piece is made
of individual blocks with real thickness, and each block carries one letter of
that piece's name. Click a piece: the rest scatter out of frame, the camera flies
in until that piece fills the screen, and its page opens.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## The square

Seven pieces partition a 6x6 grid. They are free-form polyominoes, not
tetrominoes — a piece has as many blocks as its name has letters, so the word
sets into the shape one letter per block, read row by row:

```
W P B L O G      WORK      down the left edge
O L T O O L      PLAY      down beside it
R A K I T M      BLOG      across the top
K Y P R O A      TOOLKIT   TOOL, then KIT beneath it
J E C T S I      PROJECTS  PRO, then JECTS beneath it
A B O U T L      MAIL      down the right edge   (Contact)
                 ABOUT     across the bottom
```

The shapes are not decorative — they are what makes the words legible. A word
laid into a two-wide piece comes out as `TO/OL/KI/T`; laid into the right shape
it comes out as `TOOL/KIT`. So the tiling was solved backwards from the reading:
declare the acceptable shape for each word (straight runs, `TOOL`+`KIT`,
`PRO`+`JECTS`, `AB`+`OUT`), then exact-cover the grid using only those. 48
tilings satisfy it; this is the one with the best balance of horizontal and
vertical pieces.

Pieces are then pushed apart — a fixed nudge plus a share of each piece's
distance from the centre (`SPREAD_FIXED` / `SPREAD`) — so they read as separate
pieces loosely forming a square rather than one welded grid.

## The palette

Paper-craft, not screen-dark: everything sits on warm off-white, and the only
"dark" is a navy used as ink. There is no pure black and no pure white anywhere —
the tokens live in [styles.css](src/styles.css) as `paper`, `paper-2`, `card`,
and `ink`.

| piece    | colour          | piece   | colour             |
| -------- | --------------- | ------- | ------------------ |
| Work     | `#ece5d7` stone | Blog    | `#a99be0` lavender |
| Projects | `#e8785c` coral | Play    | `#d9b98c` kraft    |
| Toolkit  | `#7fbfa6` mint  | Contact | `#49a08f` teal     |
| About    | `#7f97c9` slate | slab    | `#16224a` navy     |

The colours are assigned so no two touching pieces share a hue family. Navy is
reserved for the slab so every piece reads against it, which is why Work is stone
rather than navy — and that light piece anchors the composition the way the cream
cards do in a paper-craft set.

Surfaces are matte. Block tops carry a barely-there gradient rather than a gloss,
side walls are only slightly darker (a cut paper edge, not a plastic bevel), and
cast shadows are navy-tinted — on warm paper a neutral grey shadow reads as dirt,
a cool one reads as light. The background carries a faint dot grid and an inline
SVG noise for paper tooth.

## The 3D

The board is one element with `rotateX(41deg) rotateZ(24deg)` under a CSS
`perspective`, sitting on a navy slab ([BoardSlab.jsx](src/components/BoardSlab.jsx))
that occupies z from `-SLAB_THICKNESS` up to 0 — so the blocks stand on its top
face. Each block is built from three faces: a top lifted by `THICKNESS`, plus the
south and east walls. The other two walls always point away from the camera and
are never drawn.

This is a genuine **two-point perspective**. `rotateZ` is applied before
`rotateX`, so it never touches the extrusion axis — every vertical edge stays
vertical on screen, which is the defining trait. The spin then swings both
horizontal axes away from screen-parallel so each runs to its own vanishing
point, and the perspective distance is short enough to make that convergence
visible rather than theoretical. The slab's two visible walls do most of the
work: their edges are the longest straight runs in the scene, so they are what
actually make the vanishing points legible.

Because the slab hangs below z = 0 and blocks rise above it, the camera fit takes
a `zRange` — without it the slab's near corner falls off the bottom of the
viewport.

**Nothing in the 3D chain uses `opacity` or `filter`.** Both force
`transform-style: flat`, which would collapse every block back into a flat shape.
That constraint shapes two things: scattered pieces fly clear of the frame
instead of fading, and the detail view dims the board with an overlay scrim
rather than by fading it. (The cast shadow is exempt — it is a leaf, so
flattening it costs nothing.)

## The camera

Everything is laid out in resolution-independent **world units**; one block is
100 units. The camera is a translate + scale on the board element, which is what
makes "zoom until this piece fills the viewport" exact for any piece at any
window size rather than tuned per-piece.

`cameraFor()` in [layout.js](src/lib/layout.js) solves for that transform. It
mirrors the board's actual CSS exactly — `translate3d` then a **2D** `scale`
(so depth is not scaled) then the rotations — and accounts for the perspective
divide. Centring is closed-form: the focus centre sits pre-divide at the origin,
and the divide leaves the origin alone. The scale that makes a piece fill the
frame is coupled to that divide, so it is solved by a few rounds of refinement.

The board transform is written out with `useMotionTemplate` rather than left to
Framer Motion's property order, because that maths depends on the exact sequence.

The three phases:

| phase     | camera                    | pieces                                     |
| --------- | ------------------------- | ------------------------------------------ |
| `board`   | frames the whole square   | float on individual loops, ripple on hover |
| `zooming` | flies to the chosen piece | the other six fly clear of the frame       |
| `detail`  | eases back a little       | chosen piece sits behind the copy          |

## Hover

Hovering a piece ripples through **its own blocks**: the block the cursor entered
on rises first, and the rest of that piece follows, each delayed by its distance
from that block (`RIPPLE_SPEED`). Other pieces are untouched. The origin block is
held until the pointer leaves, so the piece settles back in the order it rose.

Cast shadows are siblings of the blocks, not children, so a rising block leaves
its shadow behind on the board. The shadow never moves — it scales about its own
centre and fades, which also softens the blur for free.

The hover target is not the visible block. Blocks are inset by `BLOCK_GAP`, so
using them would leave a seam between every neighbour, and dragging across a
piece would fire leave/enter and make the hover flicker. Instead each block
carries an invisible hit rect covering its whole cell plus a unit of overlap, so
a piece presents one continuous surface. Pieces are spread far enough apart that
these never touch across a boundary.

## Content

Page content comes from the résumé in [public/](public/), which is served from
the site root and linked in two places: the Résumé link in the board header, and
the Contact page. `RESUME_URL` in [portfolio.js](src/data/portfolio.js) is the
single place that path is written down — update it there if the file is renamed.

The two build pages are split by who the work was for:

- **Projects** — what shipped for employers, from the résumé's work history. Cards
  link to the product site where one exists; the rest are deliberately unlinked
  rather than pointing at `#`.
- **Playground** — personal side builds, every one deployed and clickable.

Playground and the company links on **Work** come from the previous portfolio
(`~/Personal/NewPortfolio/rotrk`, deployed at lawnyc.netlify.app). Every external
link was checked live; two had rotted and were repointed:

| link                         | was | now                                    |
| ---------------------------- | --- | -------------------------------------- |
| `ezml.io`                    | 404 | `www.ezml.io`                          |
| `beacon-defender.vercel.app` | 404 | `newbz521.github.io/Beacon-Defender-/` |

**Blog** is still placeholder copy — nothing in the résumé or the old portfolio
fills it. Replace it, or drop the piece and re-cut the square.

Education lives on the About page rather than as its own piece — it is the
optional `education` array on `intro` content.

## Editing it

Nearly everything lives in [portfolio.js](src/data/portfolio.js). Each piece has
a `short` code, a `label`, `kicker`, `color`, its `cells`, and a `content` block.

**`short` must have exactly as many characters as the piece has cells** — that is
what makes the word fill the shape. `label` is the full name, shown on hover and
as the page heading, so the code can be terse without costing clarity.

If you change a `short`, check how it breaks across the rows of its piece: the
shape and the word have to be chosen together, or you get `TO/OL/KI/T` again.

Content is rendered by `kind`, and [DetailPanel.jsx](src/components/DetailPanel.jsx)
has a renderer for each:

`intro` · `timeline` · `cards` · `groups` · `list` · `gallery` · `contact`

`contact` items take an optional `download` flag. In `cards` and `timeline`, the
`link` is optional — omit it and the card renders as a plain panel instead of a
dead anchor. Any `http(s)` link opens in a new tab automatically.

To change a page, edit its `content`. To add a renderer, write a component and
register it in the `RENDERERS` map. To re-cut the square, change the `cells`
arrays — the geometry, camera, scatter directions, and letter placement are all
derived from them (keep the pieces non-overlapping, and keep each one connected).

## Notes

- Keyboard: pieces are focusable, Enter/Space opens one, Escape goes back.
- `prefers-reduced-motion` disables the float loop and shortens the camera move.
- The content is placeholder copy — replace it with your own.

# display-sandbox
