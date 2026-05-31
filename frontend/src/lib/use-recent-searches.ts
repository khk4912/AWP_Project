'use client'

import { useSyncExternalStore } from 'react'

import {
  RECENT_SEARCHES_CHANGED_EVENT,
  RECENT_SEARCHES_STORAGE_KEY,
  addRecentSearch,
  parseRecentSearches,
  serializeRecentSearches,
} from './recent-searches'

let snapshot: string[] = []
let snapshotRawValue: string | null = null

function getSnapshot (): string[] {
  if (typeof window === 'undefined') return []

  const rawValue = window.localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY)
  if (rawValue === snapshotRawValue) return snapshot

  snapshotRawValue = rawValue
  snapshot = parseRecentSearches(rawValue)
  return snapshot
}

function getServerSnapshot (): string[] {
  return []
}

function subscribe (onStoreChange: () => void) {
  window.addEventListener(RECENT_SEARCHES_CHANGED_EVENT, onStoreChange)
  window.addEventListener('storage', onStoreChange)

  return () => {
    window.removeEventListener(RECENT_SEARCHES_CHANGED_EVENT, onStoreChange)
    window.removeEventListener('storage', onStoreChange)
  }
}

export function writeRecentSearch (term: string): string[] {
  const searches = addRecentSearch(getSnapshot(), term)
  const rawValue = serializeRecentSearches(searches)

  snapshot = searches
  snapshotRawValue = rawValue
  window.localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, rawValue)
  window.dispatchEvent(new Event(RECENT_SEARCHES_CHANGED_EVENT))

  return searches
}

export function useRecentSearches (): string[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
