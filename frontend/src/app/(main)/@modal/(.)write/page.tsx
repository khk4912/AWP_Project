import WriteModal from './_components/WriteModal'
import { getCurrentUser } from '@/lib/server/api'

export default async function WriteModalPage () {
  const currentUser = await getCurrentUser()

  return <WriteModal currentUser={currentUser} />
}
