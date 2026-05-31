'use client'

import { useActionState } from 'react'
import { LockIcon, MailIcon } from 'lucide-react'

import TextField from '../../_components/TextField'
import { loginAction, type LoginFormState } from '../actions'

type LoginFormProps = {
  next: string
}

const initialState: LoginFormState = {}

export default function LoginForm ({ next }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(loginAction, initialState)

  return (
    <form action={formAction} className='mt-20 space-y-5 text-left px-1'>
      <input type='hidden' name='next' value={next} />
      <TextField
        name='email'
        type='email'
        placeholder='이메일'
        autoComplete='email'
        required
        icon={<MailIcon size={20} />}
      />
      <TextField
        name='password'
        type='password'
        placeholder='비밀번호'
        autoComplete='current-password'
        required
        icon={<LockIcon size={20} />}
      />

      {state.error != null && state.error.length > 0
        ? <p className='whitespace-pre-wrap text-sm font-medium text-red-500'>{state.error}</p>
        : null}

      <button
        type='submit'
        disabled={pending}
        className='mt-8 h-14 w-full rounded-full bg-blue-500 px-5 text-base font-bold text-white transition-colors hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 sm:h-16 sm:text-lg'
      >
        {pending ? '로그인 중...' : '로그인'}
      </button>
    </form>
  )
}
