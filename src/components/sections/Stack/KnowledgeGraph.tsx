import { useRef, useCallback, useState, useEffect, useMemo } from 'react'
import ForceGraph2D from 'react-force-graph-2d'
import { groupColors, groupLabels } from '../../../data/stack'
import { getStackNodes, getStackLinks } from '../../../data/stackStore'


type NodeObject = {
  id: string
  group: string
  label: string
  size: number
  x?: number
  y?: number
}

interface KnowledgeGraphProps {
  activeFilter: string | null
}

export function KnowledgeGraph({ activeFilter }: KnowledgeGraphProps) {
  const stackNodes = getStackNodes()
  const stackLinks = getStackLinks()
  const graphRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredNode, setHoveredNode] = useState<NodeObject | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const [dimensions, setDimensions] = useState({ width: 600, height: 480 })

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setDimensions({
          width:  containerRef.current.clientWidth,
          height: Math.min(480, window.innerHeight * 0.55),
        })
      }
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(() => {
    if (!graphRef.current) return
    graphRef.current.d3Force('charge')?.strength(-140)
    graphRef.current.d3Force('link')?.distance(70)
  }, [])

  const graphData = useMemo(() => {
    if (!activeFilter) {
      return {
        nodes: stackNodes.map((n) => ({ ...n })),
        links: stackLinks.map((l) => ({ ...l })),
      }
    }
    const filtered  = stackNodes.filter((n) => n.group === activeFilter)
    const ids       = new Set(filtered.map((n) => n.id))
    return {
      nodes: filtered.map((n) => ({ ...n })),
      links: stackLinks.filter((l) => ids.has(l.source) && ids.has(l.target)).map((l) => ({ ...l })),
    }
  }, [activeFilter])

  useEffect(() => {
    graphRef.current?.d3ReheatSimulation()
  }, [activeFilter])

  const connectionCount = useCallback(
    (id: string) => stackLinks.filter((l) => l.source === id || l.target === id).length,
    []
  )

  const paintNode = useCallback(
    (node: NodeObject, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const color   = groupColors[node.group] ?? '#ffffff'
      const isHover = hoveredNode?.id === node.id
      const r       = (node.size ?? 8) / 2 + (isHover ? 3 : 0)
      const x = node.x ?? 0
      const y = node.y ?? 0

      // Glow
      ctx.shadowBlur  = isHover ? 20 : 6
      ctx.shadowColor = color

      // Circle fill
      ctx.beginPath()
      ctx.arc(x, y, r, 0, 2 * Math.PI)
      ctx.fillStyle   = isHover ? `${color}33` : `${color}1a`
      ctx.fill()
      ctx.strokeStyle = color
      ctx.lineWidth   = isHover ? 2 : 1
      ctx.stroke()
      ctx.shadowBlur  = 0

      // Label
      const fontSize = Math.max(9, 11 / globalScale)
      ctx.font          = `${fontSize}px Inter, sans-serif`
      ctx.textAlign     = 'center'
      ctx.textBaseline  = 'top'
      ctx.fillStyle     = isHover ? '#ffffff' : `${color}cc`
      ctx.fillText(node.label, x, y + r + 3)
    },
    [hoveredNode]
  )

  const handleNodeHover = useCallback(
    (node: NodeObject | null, _: unknown, event?: MouseEvent) => {
      setHoveredNode(node)
      if (node && containerRef.current && event) {
        const rect = containerRef.current.getBoundingClientRect()
        setTooltipPos({ x: event.clientX - rect.left, y: event.clientY - rect.top })
      }
    },
    []
  )

  return (
    <div
      ref={containerRef}
      className="relative rounded-lg overflow-hidden border border-border bg-bg"
      style={{ boxShadow: 'inset 0 0 60px rgba(230,0,76,0.03)' }}
    >
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        width={dimensions.width}
        height={dimensions.height}
        backgroundColor="#080808"
        nodeCanvasObject={paintNode as any}
        nodePointerAreaPaint={(node: NodeObject, color, ctx) => {
          ctx.beginPath()
          ctx.arc(node.x ?? 0, node.y ?? 0, (node.size ?? 8) / 2 + 8, 0, 2 * Math.PI)
          ctx.fillStyle = color
          ctx.fill()
        }}
        linkColor={() => 'rgba(255,255,255,0.06)'}
        linkWidth={1}
        onNodeHover={handleNodeHover as any}
        cooldownTicks={120}
        d3AlphaDecay={0.025}
        d3VelocityDecay={0.4}
        enableZoomInteraction
        enablePanInteraction
      />

      {/* Tooltip */}
      {hoveredNode && (
        <div
          className="absolute pointer-events-none z-10 bg-bg-surface border border-border-strong px-3 py-2.5 rounded-md shadow-lg text-sm"
          style={{
            left: Math.min(tooltipPos.x + 14, dimensions.width - 190),
            top:  Math.min(tooltipPos.y + 14, dimensions.height - 90),
            maxWidth: 180,
          }}
        >
          <div className="font-semibold text-white">{hoveredNode.label}</div>
          <div className="text-text-tertiary text-xs mt-1">{groupLabels[hoveredNode.group]}</div>
          <div className="text-text-tertiary text-xs">{connectionCount(hoveredNode.id)} connexions</div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-x-4 gap-y-1">
        {Object.entries(groupLabels).map(([group, label]) => (
          <div key={group} className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: groupColors[group] }} />
            <span className="text-xs text-text-tertiary">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
