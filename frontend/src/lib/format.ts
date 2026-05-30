export function getInitial (value: string): string {
  const trimmed = value.trim()
  if (trimmed.length === 0) return '?'

  return [...trimmed][0].toUpperCase()
}

export function relativeTime (value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const seconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000))
  if (seconds < 60) return '방금'

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}분`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}일`

  return date.toLocaleDateString('ko-KR', {
    month: 'short',
    day: 'numeric',
  })
}
