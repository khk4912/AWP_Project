export const RECENT_SEARCHES_CHANGED_EVENT = 'project-g:recent-searches-changed'
export const RECENT_SEARCHES_STORAGE_KEY = 'project-g:recent-searches'
export const RECENT_SEARCH_LIMIT = 5

export function normalizeSearchTerm (term: string): string {
  return term.trim().replace(/\s+/g, ' ')
}

export function parseRecentSearches (value: string | null): string[] {
  if (value == null || value.length === 0) return []

  try {
    const parsed = JSON.parse(value) as unknown

    if (!Array.isArray(parsed)) return []

    return parsed
      .filter((term): term is string => typeof term === 'string')
      .map(normalizeSearchTerm)
      .filter((term) => term.length > 0)
      .slice(0, RECENT_SEARCH_LIMIT)
  } catch {
    return []
  }
}

export function addRecentSearch (searches: string[], term: string): string[] {
  const normalizedTerm = normalizeSearchTerm(term)
  if (normalizedTerm.length === 0) return searches.slice(0, RECENT_SEARCH_LIMIT)

  return [
    normalizedTerm,
    ...searches.filter((search) => normalizeSearchTerm(search) !== normalizedTerm),
  ].slice(0, RECENT_SEARCH_LIMIT)
}

export function serializeRecentSearches (searches: string[]): string {
  return JSON.stringify(searches.slice(0, RECENT_SEARCH_LIMIT))
}
