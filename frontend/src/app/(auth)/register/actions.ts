'use server'

import { redirect } from 'next/navigation'

import { setAuthToken } from '@/lib/auth'
import type { LoginResponse } from '@/lib/types'

export type RegisterFormState = {
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

async function readErrorMessage (response: Response, fallback: string): Promise<string> {
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

export async function registerAction (
  _prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const username = getStringField(formData, 'username').trim()
  const email = getStringField(formData, 'email').trim()
  const password = getStringField(formData, 'password')
  const next = safeRedirectPath(formData.get('next'))

  if (username.length < 2) return { error: '사용자 이름은 2자 이상이어야 합니다.' }
  if (email.length === 0) return { error: '이메일을 입력해 주세요.' }
  if (password.length < 6) return { error: '비밀번호는 6자 이상이어야 합니다.' }

  const backendUrl = getBackendUrl()
  const registerResponse = await fetch(`${backendUrl}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, email, password }),
    cache: 'no-store',
  })

  if (!registerResponse.ok) {
    return { error: await readErrorMessage(registerResponse, '회원가입에 실패했습니다.') }
  }

  const loginResponse = await fetch(`${backendUrl}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
    cache: 'no-store',
  })

  if (!loginResponse.ok) {
    return { error: '회원가입은 완료됐지만 자동 로그인에 실패했습니다. 로그인해 주세요.' }
  }

  const data = await loginResponse.json() as LoginResponse
  await setAuthToken(data.accessToken)

  redirect(next)
}
