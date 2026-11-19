/**
 * Sketch & Watercolor Bloom Reveal Engine
 * Ported and adapted from `furinamikuvn/antigravity-custom-theme-mod` (`engine/core.js`).
 *
 * Pipeline:
 * 1. Multi-channel Sobel gradient + Canny non-maximum suppression + Ramer-Douglas-Peucker
 *    contour extraction on the active wallpaper image (or procedural architectural/starlight
 *    contours when running in pure-CSS background mode).
 * 2. Phase 1 (0 -> 950ms): Progressive pen-stroke drawing on an opaque dark canvas with a glowing pen tip.
 * 3. Phase 2 (850 -> 2100ms): 8-seed radial `destination-out` watercolor bloom that dissolves
 *    the sketch canvas to reveal the live theme backdrop underneath.
 */

export interface SketchStroke {
  points: [number, number][]
  weight: number
}

interface BloomSeed {
  x: number
  y: number
  delay: number
  maxRadius: number
}

function simplifyChainRDPFlat(
  coords: Float32Array,
  count: number,
  epsilon: number
): [number, number][] {
  if (count <= 2) {
    const out: [number, number][] = []
    for (let i = 0; i < count; i++) {
      out.push([coords[i * 2], coords[i * 2 + 1]])
    }
    return out
  }

  const keep = new Uint8Array(count)
  keep[0] = 1
  keep[count - 1] = 1
  const stack: [number, number][] = [[0, count - 1]]
  const epsSq = epsilon * epsilon

  while (stack.length > 0) {
    const [start, end] = stack.pop()!
    if (end - start <= 1) continue

    const sx = coords[start * 2]
    const sy = coords[start * 2 + 1]
    const ex = coords[end * 2]
    const ey = coords[end * 2 + 1]
    const dx = ex - sx
    const dy = ey - sy
    const lenSq = dx * dx + dy * dy

    let maxDistSq = -1
    let maxIdx = -1

    for (let i = start + 1; i < end; i++) {
      const px = coords[i * 2]
      const py = coords[i * 2 + 1]
      let distSq: number
      if (lenSq < 1e-9) {
        const ddx = px - sx
        const ddy = py - sy
        distSq = ddx * ddx + ddy * ddy
      } else {
        const t = Math.max(0, Math.min(1, ((px - sx) * dx + (py - sy) * dy) / lenSq))
        const projX = sx + t * dx
        const projY = sy + t * dy
        const ddx = px - projX
        const ddy = py - projY
        distSq = ddx * ddx + ddy * ddy
      }
      if (distSq > maxDistSq) {
        maxDistSq = distSq
        maxIdx = i
      }
    }

    if (maxDistSq > epsSq && maxIdx !== -1) {
      keep[maxIdx] = 1
      stack.push([start, maxIdx], [maxIdx, end])
    }
  }

  const result: [number, number][] = []
  for (let i = 0; i < count; i++) {
    if (keep[i]) {
      result.push([coords[i * 2], coords[i * 2 + 1]])
    }
  }
  return result
}

export function extractStrokesFromImage(img: HTMLImageElement): SketchStroke[] {
  try {
    const targetW = 360
    const aspect =
      img.naturalWidth && img.naturalHeight ? img.naturalHeight / img.naturalWidth : 9 / 16
    const targetH = Math.max(180, Math.min(360, Math.round(targetW * aspect)))

    const offscreen = document.createElement('canvas')
    offscreen.width = targetW
    offscreen.height = targetH
    const ctx = offscreen.getContext('2d', { willReadFrequently: true })
    if (!ctx) return buildProceduralStrokes()

    ctx.drawImage(img, 0, 0, targetW, targetH)
    const imgData = ctx.getImageData(0, 0, targetW, targetH).data
    const n = targetW * targetH

    const lum = new Float32Array(n)
    for (let i = 0; i < n; i++) {
      const idx = i * 4
      lum[i] = 0.299 * imgData[idx] + 0.587 * imgData[idx + 1] + 0.114 * imgData[idx + 2]
    }

    const mag = new Float32Array(n)
    const dir = new Float32Array(n)
    let maxMag = 1

    for (let y = 1; y < targetH - 1; y++) {
      for (let x = 1; x < targetW - 1; x++) {
        const i = y * targetW + x
        const gx =
          -lum[i - targetW - 1] +
          lum[i - targetW + 1] -
          2 * lum[i - 1] +
          2 * lum[i + 1] -
          lum[i + targetW - 1] +
          lum[i + targetW + 1]
        const gy =
          -lum[i - targetW - 1] -
          2 * lum[i - targetW] -
          lum[i - targetW + 1] +
          lum[i + targetW - 1] +
          2 * lum[i + targetW] +
          lum[i + targetW + 1]

        const m = Math.hypot(gx, gy)
        mag[i] = m
        if (m > maxMag) maxMag = m
        dir[i] = Math.atan2(gy, gx)
      }
    }

    const edges = new Uint8Array(n)
    const threshold = maxMag * 0.19
    for (let y = 2; y < targetH - 2; y++) {
      for (let x = 2; x < targetW - 2; x++) {
        const i = y * targetW + x
        const m = mag[i]
        if (m < threshold) continue

        const angle = ((dir[i] * 180) / Math.PI + 180) % 180
        let m1 = 0
        let m2 = 0
        if (angle < 22.5 || angle >= 157.5) {
          m1 = mag[i - 1]
          m2 = mag[i + 1]
        } else if (angle < 67.5) {
          m1 = mag[i - targetW - 1]
          m2 = mag[i + targetW + 1]
        } else if (angle < 112.5) {
          m1 = mag[i - targetW]
          m2 = mag[i + targetW]
        } else {
          m1 = mag[i - targetW + 1]
          m2 = mag[i + targetW - 1]
        }

        if (m >= m1 && m >= m2) {
          edges[i] = 1
        }
      }
    }

    const visited = new Uint8Array(n)
    const strokes: SketchStroke[] = []
    const scratch = new Float32Array(1200)
    const neighbors = [
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
    ]

    for (let y = 2; y < targetH - 2; y += 2) {
      for (let x = 2; x < targetW - 2; x += 2) {
        const startIdx = y * targetW + x
        if (!edges[startIdx] || visited[startIdx]) continue

        let cx = x
        let cy = y
        let count = 0
        let strengthSum = 0

        while (count < 260) {
          const idx = cy * targetW + cx
          visited[idx] = 1
          scratch[count * 2] = cx / targetW
          scratch[count * 2 + 1] = cy / targetH
          strengthSum += mag[idx] / maxMag
          count++

          let foundNext = false
          for (let k = 0; k < neighbors.length; k++) {
            const nx = cx + neighbors[k][0]
            const ny = cy + neighbors[k][1]
            if (nx <= 1 || nx >= targetW - 1 || ny <= 1 || ny >= targetH - 1) continue
            const nIdx = ny * targetW + nx
            if (edges[nIdx] && !visited[nIdx]) {
              cx = nx
              cy = ny
              foundNext = true
              break
            }
          }
          if (!foundNext) break
        }

        if (count >= 9) {
          const simplified = simplifyChainRDPFlat(scratch, count, 0.0045)
          if (simplified.length >= 3) {
            strokes.push({
              points: simplified,
              weight: Math.min(1.9, Math.max(0.75, (strengthSum / count) * 2.2)),
            })
          }
        }
      }
    }

    if (strokes.length < 18) {
      return [...strokes, ...buildProceduralStrokes()]
    }

    strokes.sort((a, b) => b.points.length - a.points.length)
    return strokes.slice(0, 180)
  } catch {
    return buildProceduralStrokes()
  }
}

export function buildProceduralStrokes(): SketchStroke[] {
  const strokes: SketchStroke[] = []
  const cx = 0.5
  const cy = 0.48

  // Concentric celestial astrolabe arcs
  const radii = [0.14, 0.22, 0.31, 0.42]
  radii.forEach((r, idx) => {
    const pts: [number, number][] = []
    const steps = 40
    const startAngle = idx * 0.45
    const endAngle = startAngle + Math.PI * 1.65
    for (let i = 0; i <= steps; i++) {
      const a = startAngle + ((endAngle - startAngle) * i) / steps
      pts.push([cx + Math.cos(a) * r * 0.72, cy + Math.sin(a) * r])
    }
    strokes.push({ points: pts, weight: idx % 2 === 0 ? 1.45 : 0.95 })
  })

  // Diagonal starlight rays & filigree frame lines
  const rays: [number, number][][] = [
    [
      [0.06, 0.14],
      [0.24, 0.14],
      [0.32, 0.22],
      [0.48, 0.22],
    ],
    [
      [0.94, 0.14],
      [0.76, 0.14],
      [0.68, 0.22],
      [0.52, 0.22],
    ],
    [
      [0.08, 0.86],
      [0.28, 0.86],
      [0.38, 0.76],
      [0.5, 0.76],
    ],
    [
      [0.92, 0.86],
      [0.72, 0.86],
      [0.62, 0.76],
      [0.5, 0.76],
    ],
    [
      [0.18, 0.48],
      [0.35, 0.44],
      [0.5, 0.48],
      [0.65, 0.52],
      [0.82, 0.48],
    ],
  ]

  for (const pts of rays) {
    strokes.push({ points: pts, weight: 1.25 })
  }

  return strokes
}

function createBloomSeeds(w: number, h: number): BloomSeed[] {
  const maxDim = Math.hypot(w, h) * 0.75
  return [
    { x: w * 0.5, y: h * 0.46, delay: 0, maxRadius: maxDim },
    { x: w * 0.22, y: h * 0.28, delay: 90, maxRadius: maxDim * 0.85 },
    { x: w * 0.78, y: h * 0.3, delay: 140, maxRadius: maxDim * 0.85 },
    { x: w * 0.25, y: h * 0.75, delay: 190, maxRadius: maxDim * 0.85 },
    { x: w * 0.75, y: h * 0.72, delay: 230, maxRadius: maxDim * 0.85 },
    { x: w * 0.12, y: h * 0.5, delay: 270, maxRadius: maxDim * 0.8 },
    { x: w * 0.88, y: h * 0.52, delay: 310, maxRadius: maxDim * 0.8 },
    { x: w * 0.5, y: h * 0.88, delay: 340, maxRadius: maxDim * 0.85 },
  ]
}

export function runSketchBloomReveal(options: {
  canvas: HTMLCanvasElement
  strokes: SketchStroke[]
  accentHex: string
  secondaryHex: string
  overlayRgb: string
  onComplete?: () => void
}): () => void {
  const { canvas, strokes, accentHex, secondaryHex, overlayRgb, onComplete } = options
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const width = window.innerWidth
  const height = window.innerHeight

  canvas.width = Math.round(width * dpr)
  canvas.height = Math.round(height * dpr)
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
  canvas.style.opacity = '1'

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    onComplete?.()
    return () => {}
  }

  const activeStrokes = strokes.length > 0 ? strokes : buildProceduralStrokes()
  const seeds = createBloomSeeds(width, height)

  const DRAW_DURATION = 920
  const BLOOM_START = 780
  const BLOOM_DURATION = 1180
  const TOTAL_DURATION = BLOOM_START + BLOOM_DURATION

  let rafId = 0
  let cancelled = false
  const startTime = performance.now()

  const renderFrame = (now: number) => {
    if (cancelled) return
    const elapsed = now - startTime
    const drawProgress = Math.min(1, elapsed / DRAW_DURATION)

    ctx.save()
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    // 1. Opaque dark drafting surface
    ctx.globalCompositeOperation = 'source-over'
    ctx.fillStyle = `rgba(${overlayRgb}, 0.94)`
    ctx.fillRect(0, 0, width, height)

    // Subtle radial ambient sheen on drafting surface
    const bgGrad = ctx.createRadialGradient(
      width * 0.5,
      height * 0.45,
      20,
      width * 0.5,
      height * 0.45,
      Math.max(width, height) * 0.65
    )
    bgGrad.addColorStop(0, `${accentHex}22`)
    bgGrad.addColorStop(0.55, `${secondaryHex}12`)
    bgGrad.addColorStop(1, 'transparent')
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, width, height)

    // 2. Progressive contour sketch drawing
    const totalStrokes = activeStrokes.length
    const activeCount = Math.max(1, Math.ceil(drawProgress * totalStrokes))
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    let tipX = width * 0.5
    let tipY = height * 0.48

    for (let i = 0; i < activeCount; i++) {
      const stroke = activeStrokes[i]
      const pts = stroke.points
      if (pts.length < 2) continue

      const strokeStartRatio = i / totalStrokes
      const localProgress = Math.min(
        1,
        Math.max(0, (drawProgress - strokeStartRatio * 0.72) / 0.28)
      )
      const ptLimit = Math.max(2, Math.ceil(localProgress * pts.length))

      ctx.beginPath()
      ctx.moveTo(pts[0][0] * width, pts[0][1] * height)
      for (let j = 1; j < ptLimit; j++) {
        ctx.lineTo(pts[j][0] * width, pts[j][1] * height)
      }

      ctx.strokeStyle = i % 3 === 0 ? secondaryHex : accentHex
      ctx.globalAlpha = 0.42 + 0.45 * localProgress
      ctx.lineWidth = stroke.weight
      ctx.stroke()

      if (i === activeCount - 1) {
        const lastPt = pts[ptLimit - 1]
        tipX = lastPt[0] * width
        tipY = lastPt[1] * height
      }
    }

    // Glowing pen tip spark during sketch phase
    if (drawProgress < 0.98) {
      ctx.globalAlpha = 0.9
      const spark = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 24)
      spark.addColorStop(0, '#ffffff')
      spark.addColorStop(0.35, accentHex)
      spark.addColorStop(1, 'transparent')
      ctx.fillStyle = spark
      ctx.beginPath()
      ctx.arc(tipX, tipY, 24, 0, Math.PI * 2)
      ctx.fill()
    }

    // 3. Multi-seed destination-out watercolor bloom reveal
    if (elapsed > BLOOM_START) {
      const bloomElapsed = elapsed - BLOOM_START

      for (const seed of seeds) {
        const seedTime = bloomElapsed - seed.delay
        if (seedTime <= 0) continue
        const t = Math.min(1, seedTime / (BLOOM_DURATION - seed.delay))
        const eased = 1 - Math.pow(1 - t, 3)
        const radius = Math.max(4, seed.maxRadius * eased)

        // Cut out transparent watercolor window
        ctx.globalCompositeOperation = 'destination-out'
        ctx.globalAlpha = 1
        const cutGrad = ctx.createRadialGradient(
          seed.x,
          seed.y,
          radius * 0.25,
          seed.x,
          seed.y,
          radius
        )
        cutGrad.addColorStop(0, 'rgba(0,0,0,1)')
        cutGrad.addColorStop(0.7, 'rgba(0,0,0,0.92)')
        cutGrad.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = cutGrad
        ctx.beginPath()
        ctx.arc(seed.x, seed.y, radius, 0, Math.PI * 2)
        ctx.fill()

        // Glowing golden/accent rim around expanding bloom front
        if (t < 0.92) {
          ctx.globalCompositeOperation = 'source-over'
          ctx.globalAlpha = (1 - t) * 0.55
          ctx.strokeStyle = accentHex
          ctx.lineWidth = 2.2
          ctx.beginPath()
          ctx.arc(seed.x, seed.y, radius * 0.82, 0, Math.PI * 2)
          ctx.stroke()
        }
      }
    }

    ctx.restore()

    if (elapsed < TOTAL_DURATION) {
      rafId = window.requestAnimationFrame(renderFrame)
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      canvas.style.opacity = '0'
      onComplete?.()
    }
  }

  rafId = window.requestAnimationFrame(renderFrame)

  return () => {
    cancelled = true
    if (rafId) window.cancelAnimationFrame(rafId)
    const c = canvas.getContext('2d')
    c?.clearRect(0, 0, canvas.width, canvas.height)
    canvas.style.opacity = '0'
  }
}
