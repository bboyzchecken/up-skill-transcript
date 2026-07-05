import type { DimKey } from '../types'

// ไอคอน 7 โดเมน — SVG stroke สะอาด (ไม่ใช้ emoji)
const PATHS: Record<DimKey, JSX.Element> = {
  knowledge: (
    <>
      <path d="M4 5.5A2 2 0 0 1 6 4h5v15H6a2 2 0 0 0-2 1.2z" />
      <path d="M20 5.5A2 2 0 0 0 18 4h-5v15h5a2 2 0 0 1 2 1.2z" />
    </>
  ),
  skill: (
    <>
      <path d="M14.5 5.5a3.5 3.5 0 0 0-4.9 4.2l-5 5a1.6 1.6 0 0 0 2.3 2.3l5-5a3.5 3.5 0 0 0 4.2-4.9l-2.1 2.1-1.9-1.9z" />
    </>
  ),
  attitude: (
    <>
      <path d="M12 3v2M5 6l1.4 1.4M19 6l-1.4 1.4" />
      <path d="M9 15a4 4 0 1 1 6 0c-.5.6-1 1.2-1 2H10c0-.8-.5-1.4-1-2z" />
      <path d="M10 20h4M10.5 22h3" />
    </>
  ),
  character: (
    <>
      {/* วินัย/อุปนิสัย — โล่กับเข็มทิศ */}
      <circle cx="12" cy="12" r="8.5" />
      <path d="M15 9l-1.6 4.4L9 15l1.6-4.4z" />
    </>
  ),
  ethics: (
    <>
      <path d="M12 3l7 3v5c0 4.2-2.9 7.7-7 9-4.1-1.3-7-4.8-7-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  aesthetics: (
    <>
      <path d="M12 3l2.3 5.6L20 9.2l-4.3 3.9L17 19l-5-3-5 3 1.3-5.9L4 9.2l5.7-.6z" />
    </>
  ),
  wellness: (
    <>
      <path d="M12 20s-7-4.3-7-9.3A3.7 3.7 0 0 1 12 7a3.7 3.7 0 0 1 7 3.7C19 15.7 12 20 12 20z" />
      <path d="M6 12h3l1.5-2.5L13 15l1.3-3H18" />
    </>
  ),
}

export function DimIcon({
  dim,
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.7,
}: {
  dim: DimKey
  size?: number
  color?: string
  strokeWidth?: number
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {PATHS[dim]}
    </svg>
  )
}
