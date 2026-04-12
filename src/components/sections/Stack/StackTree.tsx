import { useState } from 'react'
import { groupColors, groupLabels } from '../../../data/stack'
import { getStackNodes } from '../../../data/stackStore'

interface StackTreeProps {
  activeFilter: string | null
}

export function StackTree({ activeFilter }: StackTreeProps) {
  const allNodes = getStackNodes()
  const [hovered, setHovered] = useState<string | null>(null)

  // Group order
  const groupOrder = ['lang', 'framework', 'ai', 'revops', 'devops'] as const

  // Build display: by group, then roots + children under each root
  const groups = groupOrder.filter(g => !activeFilter || g === activeFilter)

  return (
    <div className="rounded-lg border border-border bg-bg p-6" style={{ boxShadow: 'inset 0 0 60px rgba(230,0,76,0.03)' }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map(group => {
          const nodesInGroup = allNodes.filter(n => n.group === group)
          if (nodesInGroup.length === 0) return null

          const color = groupColors[group]
          // Roots = nodes in this group without a parent that belongs to the same group
          const roots = nodesInGroup.filter(n => {
            if (!n.parent) return true
            // parent exists but might belong to another group
            const parentNode = allNodes.find(p => p.id === n.parent)
            return !parentNode || parentNode.group !== group
          })
          // Children = nodes in this group whose parent is also in this group
          const children = nodesInGroup.filter(n => {
            if (!n.parent) return false
            const parentNode = allNodes.find(p => p.id === n.parent)
            return parentNode && parentNode.group === group
          })

          return (
            <div key={group} className="space-y-2">
              {/* Category header */}
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                <span className="text-xs font-mono tracking-widest uppercase" style={{ color }}>
                  {groupLabels[group]}
                </span>
              </div>

              {/* Root nodes */}
              {roots.map(root => {
                const rootChildren = children.filter(c => c.parent === root.id)
                return (
                  <div key={root.id}>
                    {/* Root pill */}
                    <NodePill
                      id={root.id}
                      label={root.label}
                      color={color}
                      isRoot
                      hovered={hovered}
                      onHover={setHovered}
                    />

                    {/* Children indented */}
                    {rootChildren.length > 0 && (
                      <div className="ml-4 mt-1 space-y-1 pl-3 border-l" style={{ borderColor: `${color}30` }}>
                        {rootChildren.map(child => (
                          <NodePill
                            key={child.id}
                            id={child.id}
                            label={child.label}
                            color={color}
                            isRoot={false}
                            hovered={hovered}
                            onHover={setHovered}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Nodes whose parent is in another group — show as roots too */}
              {nodesInGroup
                .filter(n => n.parent && !allNodes.find(p => p.id === n.parent && p.group === group) && !roots.includes(n))
                .map(n => (
                  <NodePill
                    key={n.id}
                    id={n.id}
                    label={n.label}
                    color={color}
                    isRoot
                    hovered={hovered}
                    onHover={setHovered}
                  />
                ))
              }
            </div>
          )
        })}
      </div>

      {/* Legend (shown only when all groups visible) */}
      {!activeFilter && (
        <div className="mt-6 pt-4 border-t border-border flex flex-wrap gap-x-5 gap-y-1.5">
          {groupOrder.map(g => (
            <div key={g} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: groupColors[g] }} />
              <span className="text-xs text-text-tertiary">{groupLabels[g]}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Node pill ────────────────────────────────────────────────────────────────
function NodePill({
  id, label, color, isRoot, hovered, onHover,
}: {
  id: string
  label: string
  color: string
  isRoot: boolean
  hovered: string | null
  onHover: (id: string | null) => void
}) {
  const isHov = hovered === id
  return (
    <div
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm cursor-default select-none transition-all duration-150 mr-1.5 mb-1"
      style={{
        borderColor:     isHov ? color : `${color}40`,
        backgroundColor: isHov ? `${color}18` : `${color}08`,
        color:           isHov ? color : `${color}cc`,
        boxShadow:       isHov ? `0 0 12px ${color}30` : 'none',
        fontSize:        isRoot ? '0.8125rem' : '0.75rem',
      }}
    >
      {!isRoot && (
        <span style={{ color: `${color}80`, fontSize: '0.65rem' }}>↳</span>
      )}
      {label}
    </div>
  )
}
