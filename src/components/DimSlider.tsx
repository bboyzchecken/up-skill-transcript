import type { Dims } from '../types'
import { DIM_LIST } from '../theme'
import { DimIcon } from './DimIcon'

export function DimSliders({
  value,
  onChange,
}: {
  value: Dims
  onChange: (next: Dims) => void
}) {
  return (
    <div className="stack" style={{ gap: 14 }}>
      {DIM_LIST.map((d) => (
        <div key={d.key} className="row" style={{ gap: 12 }}>
          <span
            style={{
              display: 'grid',
              placeItems: 'center',
              width: 34,
              height: 34,
              borderRadius: 9,
              background: `color-mix(in srgb, ${d.color} 14%, white)`,
              flex: 'none',
            }}
          >
            <DimIcon dim={d.key} size={18} color={d.color} />
          </span>
          <div className="grow">
            <div className="row between" style={{ marginBottom: 3 }}>
              <span style={{ fontSize: 13.5, fontWeight: 600 }}>
                {d.labelTh}
              </span>
              <span
                className="mono"
                style={{ fontSize: 13, color: d.color, fontWeight: 600 }}
              >
                {value[d.key]}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={value[d.key]}
              style={{
                ['--dim' as string]: d.color,
                ['--track' as string]: `color-mix(in srgb, ${d.color} 22%, #eee)`,
              }}
              onChange={(e) =>
                onChange({ ...value, [d.key]: Number(e.target.value) })
              }
            />
          </div>
        </div>
      ))}
    </div>
  )
}
