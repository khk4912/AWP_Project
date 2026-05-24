import type { Post, UserSummary } from './types'

export function relativeTime (dateStr: string): string {
  const timestamp = new Date(dateStr).getTime()
  if (Number.isNaN(timestamp)) return ''

  const diff = Math.max(0, Date.now() - timestamp)
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return '방금'
  if (minutes < 60) return `${minutes}분`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간`

  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}일`

  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric'
  }).format(timestamp)
}

export function likedByIncludes (post: Post, userId: string): boolean {
  return post.likedBy.some((likedBy) => {
    if (typeof likedBy === 'string') return likedBy === userId
    return likedBy._id === userId
  })
}

export function getInitial (name: string): string {
  return name.trim().charAt(0).toUpperCase() || 'Z'
}

export function isSameUser (user: UserSummary, userId: string): boolean {
  return user._id === userId
}
