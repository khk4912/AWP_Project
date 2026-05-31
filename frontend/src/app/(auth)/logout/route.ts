import { redirect } from 'next/navigation'

import { clearAuthToken } from '@/lib/auth'

export async function GET () {
  await clearAuthToken()
  redirect('/login')
}
