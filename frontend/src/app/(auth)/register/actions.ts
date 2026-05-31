'use server'

import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { setAuthToken } from '@/lib/auth'
import type { LoginResponse } from '@/lib/types'

import {
  getBackendUrl,
  getStringField,
  readErrorMessage,
  safeRedirectPath,
} from '../_lib/action-utils'

export type RegisterFormState = {
  error?: string
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
  revalidatePath('/', 'layout')

  redirect(next)
}
