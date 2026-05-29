export default function GLogo ({ size = 32, color = 'currentColor' }) {
  // open-bottom-right G: circle stroke + horizontal bar from center to right edge
  return (
    <svg width={size} height={size} viewBox='0 0 64 64' fill='none' style={{ display: 'block' }}>
      <path d='M 32 8 A 24 24 0 1 0 56 32' stroke={color} strokeWidth='6' strokeLinecap='round' fill='none' />
      <rect x='32' y='29' width='22' height='6' rx='0.5' fill={color} />
    </svg>
  )
}
