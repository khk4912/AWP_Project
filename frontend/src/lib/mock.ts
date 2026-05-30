import type { FollowRelations, Post, UserProfile, UserSummary } from './types'

export const mockCurrentUser: UserProfile = {
  _id: 'user-me',
  username: '김가천',
  email: 'gachon@example.com',
  profileImage: '',
  bio: '프론트엔드와 캠퍼스 소식을 기록하는 중입니다.',
}

export const mockUsers: UserSummary[] = [
  {
    _id: 'user-minji',
    username: '민지',
    email: 'minji@gachon.ac.kr',
    profileImage: '',
    bio: 'UI 디자인',
  },
  {
    _id: 'user-hyun',
    username: '현우',
    email: 'hyun@gachon.ac.kr',
    profileImage: '',
    bio: '웹 개발',
  },
  {
    _id: 'user-soyeon',
    username: '소연',
    email: 'soyeon@gachon.ac.kr',
    profileImage: '',
    bio: '스터디 모집',
  },
]

export const mockFollowRelations: FollowRelations = {
  userId: mockCurrentUser._id,
  followers: mockUsers.slice(0, 2),
  following: mockUsers.slice(1),
  followerCount: 128,
  followingCount: 42,
}

export const mockPosts: Post[] = [
  {
    _id: 'post-1',
    author: mockUsers[0],
    content: '오늘 중앙도서관 3층 자리 꽤 여유 있어요. 과제 마감 전 집중하기 좋은 분위기입니다.',
    imageUrl: '',
    likedBy: [mockCurrentUser._id, mockUsers[1]._id, mockUsers[2]._id],
    commentCount: 8,
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    _id: 'post-2',
    author: mockUsers[1],
    content: 'Next.js App Router로 mockup 먼저 붙이는 중. API 연동은 화면 흐름 확정하고 다시 맞추는 게 좋겠네요.',
    imageUrl: '',
    likedBy: [mockUsers[0]._id],
    commentCount: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    _id: 'post-3',
    author: mockUsers[2],
    content: '이번 주 금요일 저녁에 알고리즘 스터디 같이 할 사람 구합니다. 장소는 AI관 라운지 생각 중이에요.',
    imageUrl: '',
    likedBy: [mockCurrentUser._id],
    commentCount: 5,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
]
