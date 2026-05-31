import Link from 'next/link'
import GLogo from '@/components/GLogo'

import LoginForm from './_components/LoginForm'

type LoginPageProps = {
  searchParams: Promise<{
    next?: string
  }>
}

export default async function LoginPage ({ searchParams }: LoginPageProps) {
  const { next } = await searchParams

  return (
    <main className='flex min-h-screen items-center justify-center bg-white px-5 py-10 text-gray-950'>
      <section className='w-[80%] max-w-[26rem] text-center'>
        <div className='flex flex-col items-center space-y-8'>
          <GLogo size={60} color='#111827' />
          <h1 className='text-2xl font-extrabold tracking-normal text-gray-950 sm:text-4xl'>
            로그인
          </h1>
        </div>

        <LoginForm next={next ?? '/home'} />

        <p className='mt-8 text-sm font-medium text-gray-500 sm:text-base'>
          계정이 없으신가요?{' '}
          <Link href='/register' className='font-bold text-blue-500 hover:underline'>
            회원가입
          </Link>
        </p>
      </section>
    </main>
  )
}
