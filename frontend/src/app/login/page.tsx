'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import zIconSrc from '@assets/z-icon.png'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000'

export default function LoginPage () {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit (e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error?.message ?? '로그인에 실패했습니다.')
        return
      }

      localStorage.setItem('token', data.accessToken)
      router.push('/')
    } catch {
      setError('서버에 연결할 수 없습니다.')
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

        <h1 className='mb-6 text-center text-2xl font-bold text-text-primary'>로그인</h1>

        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
          <input
            type='email'
            placeholder='이메일'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='w-full rounded-xl border border-border-subtle bg-bg-soft px-4 py-3 text-[15px] text-text-primary placeholder:text-text-muted outline-none focus:border-primary transition-colors'
          />
          <input
            type='password'
            placeholder='비밀번호'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='w-full rounded-xl border border-border-subtle bg-bg-soft px-4 py-3 text-[15px] text-text-primary placeholder:text-text-muted outline-none focus:border-primary transition-colors'
          />

          {error && (
            <p className='text-sm text-red-400'>{error}</p>
          )}

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
