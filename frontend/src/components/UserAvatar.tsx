import type { CSSProperties } from 'react'

import { getInitial } from '@/lib/format'

type UserAvatarProps = {
  name: string
  seed?: string
  size?: number
  className?: string
}

const avatarPalettes = [
  { bg: '#FFFBAE', text: '#1F2937', ring: '#F3E97B' },
  { bg: '#BDE2FF', text: '#172033', ring: '#8CCBFF' },
  { bg: '#F7A8C7', text: '#2B1721', ring: '#EC7BA8' },
  { bg: '#C8FFC1', text: '#15331D', ring: '#9BF090' },
  { bg: '#FFD7A3', text: '#3A2410', ring: '#FFC072' },
  { bg: '#D7B8E8', text: '#291633', ring: '#C69BDD' },
  { bg: '#BFF1E5', text: '#12342E', ring: '#8EE1D1' },
  { bg: '#FFC3B8', text: '#3A1913', ring: '#FFA092' },
  { bg: '#C9D8FF', text: '#17213C', ring: '#A9BFFF' },
  { bg: '#E9E0A8', text: '#332F14', ring: '#DACE76' },
]

function hashString (value: string): number {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0
  }

  return hash
}

export default function UserAvatar ({
  name,
  seed = name,
  size = 40,
  className = '',
}: UserAvatarProps) {
  const palette = avatarPalettes[hashString(seed || name) % avatarPalettes.length]
  const label = name.trim() || '사용자'

  const style = {
    '--avatar-size': `${size}px`,
    backgroundColor: palette.bg,
    color: palette.text,
    boxShadow: `inset 0 0 0 1px ${palette.ring}`,
  } as CSSProperties

  return (
    <span
      aria-label={`${label} 프로필 이미지`}
      className={`inline-flex h-[var(--avatar-size)] w-[var(--avatar-size)] shrink-0 items-center justify-center rounded-full text-sm font-semibold ${className}`}
      style={style}
    >
      {getInitial(label)}
    </span>
  )
}
