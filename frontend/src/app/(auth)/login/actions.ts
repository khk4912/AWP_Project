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

export type LoginFormState = {
  error?: string
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
    return { error: await readErrorMessage(response, '로그인에 실패했습니다.') }
  }

  const data = await response.json() as LoginResponse
  await setAuthToken(data.accessToken)
  revalidatePath('/', 'layout')

  redirect(next)
}
