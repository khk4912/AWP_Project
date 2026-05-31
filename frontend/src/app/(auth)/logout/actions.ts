'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { clearAuthToken } from '@/lib/auth'

export async function logoutAction () {
  await clearAuthToken()
  revalidatePath('/', 'layout')
  redirect('/login')
}
