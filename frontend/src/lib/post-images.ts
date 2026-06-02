export function parsePostImageUrls (imageUrl: string | undefined): string[] {
  if (imageUrl == null || imageUrl.length === 0) return []

  return imageUrl
    .split(';')
    .map((url) => url.trim())
    .filter((url) => url.length > 0)
}

export function serializePostImageUrls (urls: string[]): string {
  return urls
    .map((url) => url.trim())
    .filter((url) => url.length > 0)
    .join(';')
}
