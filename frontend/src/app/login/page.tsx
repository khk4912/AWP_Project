'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { isApiError, login } from '@/lib/api'
import { setAuthToken } from '@/lib/auth'
import zIconSrc from '@assets/z-icon.png'

export default function LoginPage () {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit (event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await login(email, password)
      setAuthToken(data.accessToken)
      router.push('/')
    } catch (caughtError) {
      setError(isApiError(caughtError) ? caughtError.message : '로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-bg px-4'>
      <div className='w-full max-w-sm'>
        <div className='mb-8 flex justify-center'>
          <Image src={zIconSrc} className='h-10 w-auto' alt='G' priority />
        </div>

        <h1 className='mb-6 text-center text-2xl font-bold text-text-primary'>로그인</h1>

        <form
          onSubmit={(event) => {
            handleSubmit(event).catch(() => {})
          }}
          className='flex flex-col gap-4'
        >
          <input
            type='email'
            placeholder='이메일'
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className='w-full rounded-xl border border-border-subtle bg-bg-soft px-4 py-3 text-[15px] text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-primary'
          />
          <input
            type='password'
            placeholder='비밀번호'
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className='w-full rounded-xl border border-border-subtle bg-bg-soft px-4 py-3 text-[15px] text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-primary'
          />

          {error.length > 0 ? <p className='text-sm text-red-400'>{error}</p> : null}

          <button
            type='submit'
            disabled={loading}
            className='mt-2 w-full rounded-full bg-primary py-3 text-[15px] font-semibold text-white transition-opacity hover:opacity-80 disabled:opacity-50'
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <p className='mt-6 text-center text-sm text-text-muted'>
          계정이 없으신가요?{' '}
          <Link href='/register' className='text-primary hover:underline'>
            회원가입
          </Link>
        </p>
      </div>
    </div>
  )
}
