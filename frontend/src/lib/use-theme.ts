'use client'

import { useSyncExternalStore } from 'react'

import { THEME_CHANGED_EVENT, THEME_STORAGE_KEY, type Theme, isTheme } from './theme'

function getSystemTheme (): Theme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getSnapshot (): Theme {
  if (typeof document === 'undefined') return 'light'

  const theme = document.documentElement.dataset.theme ?? null
  return isTheme(theme) ? theme : getSystemTheme()
}

function getServerSnapshot (): Theme {
  return 'light'
}

function applyTheme (theme: Theme) {
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
  window.dispatchEvent(new Event(THEME_CHANGED_EVENT))
}

function subscribe (onStoreChange: () => void) {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  function handleSystemThemeChange () {
    if (isTheme(window.localStorage.getItem(THEME_STORAGE_KEY))) return
    applyTheme(getSystemTheme())
    onStoreChange()
  }

  window.addEventListener(THEME_CHANGED_EVENT, onStoreChange)
  mediaQuery.addEventListener('change', handleSystemThemeChange)

  return () => {
    window.removeEventListener(THEME_CHANGED_EVENT, onStoreChange)
    mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }
}

export function setTheme (theme: Theme) {
  window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  applyTheme(theme)
}

export function useTheme () {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  return {
    theme,
    toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
  }
}
