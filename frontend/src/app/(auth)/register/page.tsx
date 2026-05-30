import Link from 'next/link'
import GLogo from '@/components/GLogo'
import { UserIcon, LockIcon, MailIcon } from 'lucide-react'

import TextField from '../_components/TextField'

export default function RegisterPage () {
  return (
    <main className='flex min-h-screen items-center justify-center bg-white px-5 py-10 text-gray-950'>
      <section className='w-[80%] max-w-[26rem] text-center'>
        <div className='flex flex-col items-center space-y-8'>
          <GLogo size={60} color='#111827' />
          <h1 className='text-2xl font-extrabold tracking-normal text-gray-950 sm:text-4xl'>
            회원가입
          </h1>
        </div>

        <form className='mt-10 space-y-5 text-left px-1'>
          <TextField
            name='username'
            type='text'
            placeholder='사용자 이름'
            icon={<UserIcon className='h-5 w-5 text-gray-400' />}

          />
          <TextField
            name='email'
            type='email'
            placeholder='이메일'
            icon={<MailIcon className='h-5 w-5 text-gray-400' />}
          />
          <TextField
            name='password'
            type='password'
            placeholder='비밀번호 (6자 이상)'
            icon={<LockIcon className='h-5 w-5 text-gray-400' />}
          />

          <button
            type='submit'
            className='mt-8 h-14 w-full rounded-full bg-blue-500 px-5 text-base font-bold text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:h-16 sm:text-lg'
          >
            회원가입
          </button>
        </form>

        <p className='mt-8 text-sm font-medium text-gray-500 sm:text-base'>
          이미 계정이 있으신가요?{' '}
          <Link href='/login' className='font-bold text-blue-500 hover:underline'>
            로그인
          </Link>
        </p>
      </section>
    </main>
  )
}
