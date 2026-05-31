'use server'

import { redirect } from 'next/navigation'

import { setAuthToken } from '@/lib/auth'
import type { LoginResponse } from '@/lib/types'

export type LoginFormState = {
  error?: string
}

function getBackendUrl (): string {
  return process.env.BACKEND_URL ?? 'http://localhost:3000'
}

function safeRedirectPath (value: FormDataEntryValue | null): string {
  if (typeof value !== 'string') return '/home'
  if (!value.startsWith('/') || value.startsWith('//')) return '/home'
  return value
}

function getStringField (formData: FormData, name: string): string {
  const value = formData.get(name)
  return typeof value === 'string' ? value : ''
}

async function readErrorMessage (response: Response): Promise<string> {
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
    return '로그인에 실패했습니다.'
  }

  return '로그인에 실패했습니다.'
}

export async function loginAction (
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const email = getStringField(formData, 'email').trim()
  const password = getStringField(formData, 'password')
  const next = safeRedirectPath(formData.get('next'))

  if (email.length === 0 || password.length === 0) {
    return { error: '이메일과 비밀번호를 입력해 주세요.' }
  }

  const response = await fetch(`${getBackendUrl()}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    cache: 'no-store',
  })

  if (!response.ok) {
    return { error: await readErrorMessage(response) }
  }

  const data = await response.json() as LoginResponse
  await setAuthToken(data.accessToken)

  redirect(next)
}
