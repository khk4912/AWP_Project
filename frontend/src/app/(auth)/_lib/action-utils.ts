export function getBackendUrl (): string {
  return process.env.BACKEND_URL ?? 'http://localhost:3000'
}

export function getStringField (formData: FormData, name: string): string {
  const value = formData.get(name)
  return typeof value === 'string' ? value : ''
}

export function safeRedirectPath (value: FormDataEntryValue | null): string {
  if (typeof value !== 'string') return '/home'
  if (!value.startsWith('/') || value.startsWith('//')) return '/home'
  return value
}

export async function readErrorMessage (response: Response, fallback: string): Promise<string> {
  try {
    const body = await response.json() as { error?: unknown; message?: unknown }
    if (typeof body.message === 'string') return body.message
    if (typeof body.error === 'string') return body.error
    if (typeof body.error === 'object' && body.error !== null && 'message' in body.error) {
      const message = (body.error as { message?: unknown }).message
      if (typeof message === 'string') return message
      if (Array.isArray(message)) return message.join('\n')
    }
  } catch {
    return fallback
  }

  return fallback
}
