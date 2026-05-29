'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import GLogo from '@/components/GLogo'
import { isApiError, register } from '@/lib/api'

export default function RegisterPage () {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit (event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await register(username, email, password)
      router.replace('/login')
    } catch (error) {
      setErrorMessage(isApiError(error) ? error.message : '회원가입에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className='flex min-h-dvh items-center justify-center bg-white px-5 py-10 text-[#1f1f23]'>
      <section className='w-full max-w-[380px]'>
        <div className='mb-8 flex flex-col items-center text-center'>
          <GLogo size={48} color='#1f1f23' />
          <p className='mt-4 text-[20px] font-semibold'>회원가입</p>
        </div>

        <form
          className='flex flex-col gap-4'
          onSubmit={(event) => {
            handleSubmit(event).catch(() => {
              setErrorMessage('회원가입에 실패했습니다.')
              setIsSubmitting(false)
            })
          }}
        >
          <label className='flex flex-col gap-2 text-[14px] font-semibold'>
            이름
            <input
              className='h-12 rounded-[8px] border border-[#e7e7eb] px-4 text-[16px] outline-none transition focus:border-[#1f1f23]'
              type='text'
              value={username}
              autoComplete='name'
              required
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>

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
              autoComplete='new-password'
              minLength={6}
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
            {isSubmitting ? '가입 중' : '회원가입'}
          </button>
        </form>

        <p className='mt-6 text-center text-[14px] text-[#767676]'>
          이미 계정이 있나요?{' '}
          <Link className='font-semibold text-[#0b70d6]' href='/login'>
            로그인
          </Link>
        </p>
      </section>
    </main>
  )
}
