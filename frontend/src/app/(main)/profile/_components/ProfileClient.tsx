import UserAvatar from '@/components/UserAvatar'
import { mockCurrentUser, mockFollowRelations } from '@/lib/mock'

export default function ProfileClient () {
  const profile = mockCurrentUser
  const relations = mockFollowRelations

  return (
    <div className='border-b border-gray-200 px-4 py-6'>
      <UserAvatar name={profile.username} seed={profile._id} size={72} />
      <div className='mt-4'>
        <h2 className='text-xl font-bold text-gray-950'>{profile.username}</h2>
        <p className='text-sm text-gray-500'>{profile.email ?? '@you'}</p>
        {profile.bio != null && profile.bio.length > 0
          ? <p className='mt-3 whitespace-pre-wrap text-gray-950'>{profile.bio}</p>
          : null}
      </div>
      <dl className='mt-4 flex gap-5 text-sm'>
        <div>
          <dt className='sr-only'>팔로잉</dt>
          <dd><strong>{relations?.followingCount ?? profile.following?.length ?? 0}</strong> 팔로잉</dd>
        </div>
        <div>
          <dt className='sr-only'>팔로워</dt>
          <dd><strong>{relations?.followerCount ?? profile.followers?.length ?? 0}</strong> 팔로워</dd>
        </div>
      </dl>
    </div>
  )
}
