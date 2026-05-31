'use client'

import { LogOutIcon } from 'lucide-react'

import { logoutAction } from '@/app/(auth)/logout/actions'

type LogoutButtonProps = {
  className: string
  title?: string
}

export default function LogoutButton ({ className, title }: LogoutButtonProps) {
  return (
    <form action={logoutAction}>
      <button type='submit' aria-label='로그아웃' title={title} className={className}>
        <LogOutIcon className='h-5 w-5' />
      </button>
    </form>
  )
}
