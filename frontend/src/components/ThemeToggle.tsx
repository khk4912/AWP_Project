'use client'

import { MoonIcon, SunIcon } from 'lucide-react'

import { useTheme } from '@/lib/use-theme'

type ThemeToggleProps = {
  compact?: boolean
}

export default function ThemeToggle ({ compact = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'
  const Icon = isDark ? SunIcon : MoonIcon

  return (
    <button
      type='button'
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      title={isDark ? '라이트 모드' : '다크 모드'}
      className={`inline-flex cursor-pointer items-center justify-center rounded-full text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${compact ? 'h-10 w-10' : 'h-11 w-11'}`}
      onClick={toggleTheme}
    >
      <Icon className='h-5 w-5' />
    </button>
  )
}
