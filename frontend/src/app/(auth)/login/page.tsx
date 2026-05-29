'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import GLogo from '@/components/GLogo'
import { isApiError, login } from '@/lib/api'
import { setAuthToken } from '@/lib/auth'

function getSafeNextPath (): string {
  const nextPath = new URLSearchParams(window.location.search).get('next')
  if (nextPath == null || !nextPath.startsWith('/') || nextPath.startsWith('//')) {
    return '/home'
  }
  return nextPath
}

export default function LoginPage () {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const response = await login(email, password)
      setAuthToken(response.accessToken)
      router.replace(getSafeNextPath())
      router.refresh()
    } catch (error) {
      setErrorMessage(isApiError(error) ? error.message : '로그인에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className='flex min-h-dvh items-center justify-center bg-white px-5 py-10 text-[#1f1f23]'>
      <section className='w-full max-w-[380px]'>
        <div className='mb-8 flex flex-col items-center text-center'>
          <GLogo size={48} color='#1f1f23' />
          <p className='mt-4 text-[20px] font-semibold'>로그인</p>
        </div>

        <form
          className='flex flex-col gap-4'
          onSubmit={(event) => {
            handleSubmit(event).catch(() => {
              setErrorMessage('로그인에 실패했습니다.')
              setIsSubmitting(false)
            })
          }}
        >
          <label className='flex flex-col gap-2 text-[14px] font-semibold'>
            이메일
            <input
              className='h-12 rounded-[8px] border border-[#e7e7eb] px-4 text-[16px] outline-none transition focus:border-[#1f1f23]'
              type='email'
              value={email}
              autoComplete='email'
              required
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className='flex flex-col gap-2 text-[14px] font-semibold'>
            비밀번호
            <input
              className='h-12 rounded-[8px] border border-[#e7e7eb] px-4 text-[16px] outline-none transition focus:border-[#1f1f23]'
              type='password'
              value={password}
              autoComplete='current-password'
              required
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {errorMessage.length > 0 && (
            <p className='rounded-[8px] bg-[#fff2f2] px-4 py-3 text-[14px] font-medium text-[#c23131]'>
              {errorMessage}
            </p>
          )}

          <button
            className='mt-2 h-12 rounded-full bg-[#1f1f23] text-[15px] font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-55'
            type='submit'
            disabled={isSubmitting}
          >
            {isSubmitting ? '로그인 중' : '로그인'}
          </button>
        </form>

        <p className='mt-6 text-center text-[14px] text-[#767676]'>
          계정이 없나요?{' '}
          <Link className='font-semibold text-[#0b70d6]' href='/register'>
            회원가입
          </Link>
        </p>
      </section>
    </main>
  )
}
