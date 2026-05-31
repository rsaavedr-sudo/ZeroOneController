/**
 * Sparkline — mini gráfico de linha em SVG (sem dependências).
 * props: valores (array de números), width, height, color
 */
export default function Sparkline({
  valores = [],
  width = 84,
  height = 26,
  color = '#3563ff',
}) {
  if (!valores.length) return null

  const min = Math.min(...valores)
  const max = Math.max(...valores)
  const range = max - min || 1
  const pad = 2
  const w = width - pad * 2
  const h = height - pad * 2

  const pontos = valores.map((v, i) => {
    const x = pad + (i / (valores.length - 1 || 1)) * w
    const y = pad + (1 - (v - min) / range) * h
    return [x, y]
  })

  const d = pontos.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const [ux, uy] = pontos[pontos.length - 1]

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={d}
        fill="none"
        stroke={color}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={ux} cy={uy} r="2.2" fill={color} />
    </svg>
  )
}
