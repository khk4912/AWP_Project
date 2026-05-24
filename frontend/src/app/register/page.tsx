'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { isApiError, register } from '@/lib/api'
import zIconSrc from '@assets/z-icon.png'

export default function RegisterPage () {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit (event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      await register(username, email, password)
      router.push('/login')
    } catch (caughtError) {
      setError(isApiError(caughtError) ? caughtError.message : '회원가입에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-bg px-4'>
      <div className='w-full max-w-sm'>
        <div className='mb-8 flex justify-center'>
          <Image src={zIconSrc} className='h-10 w-auto' alt='Z' priority />
        </div>

        <h1 className='mb-6 text-center text-2xl font-bold text-text-primary'>회원가입</h1>

        <form
          onSubmit={(event) => {
            handleSubmit(event).catch(() => {})
          }}
          className='flex flex-col gap-4'
        >
          <input
            type='text'
            placeholder='사용자 이름'
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            className='w-full rounded-xl border border-border-subtle bg-bg-soft px-4 py-3 text-[15px] text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-primary'
          />
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
            placeholder='비밀번호 (6자 이상)'
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
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <p className='mt-6 text-center text-sm text-text-muted'>
          이미 계정이 있으신가요?{' '}
          <Link href='/login' className='text-primary hover:underline'>
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}
