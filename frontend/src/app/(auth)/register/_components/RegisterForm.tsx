'use client'

import { useActionState } from 'react'
import { LockIcon, MailIcon, UserIcon } from 'lucide-react'

import TextField from '../../_components/TextField'
import { registerAction, type RegisterFormState } from '../actions'

type RegisterFormProps = {
  next: string
}

const initialState: RegisterFormState = {}

export default function RegisterForm ({ next }: RegisterFormProps) {
  const [state, formAction, isPending] = useActionState(registerAction, initialState)

  return (
    <form action={formAction} className='mt-10 space-y-5 text-left px-1'>
      <input type='hidden' name='next' value={next} />
      <TextField
        name='username'
        type='text'
        placeholder='사용자 이름'
        autoComplete='username'
        minLength={2}
        required
        icon={<UserIcon className='h-5 w-5 text-gray-400' />}
      />
      <TextField
        name='email'
        type='email'
        placeholder='이메일'
        autoComplete='email'
        required
        icon={<MailIcon className='h-5 w-5 text-gray-400' />}
      />
      <TextField
        name='password'
        type='password'
        placeholder='비밀번호 (6자 이상)'
        autoComplete='new-password'
        minLength={6}
        required
        icon={<LockIcon className='h-5 w-5 text-gray-400' />}
      />

      {state.error != null && state.error.length > 0
        ? <p className='whitespace-pre-wrap text-sm font-medium text-red-500'>{state.error}</p>
        : null}

      <button
        type='submit'
        disabled={isPending}
        className='mt-8 h-14 w-full rounded-full bg-blue-500 px-5 text-base font-bold text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-300 sm:h-16 sm:text-lg'
      >
        {isPending ? '가입 중...' : '회원가입'}
      </button>
    </form>
  )
}
