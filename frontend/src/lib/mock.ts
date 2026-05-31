import type { Comment, FollowRelations, Post, UserProfile, UserSummary } from './types'

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

export const mockComments: Comment[] = [
  {
    _id: 'comment-1',
    author: mockUsers[1],
    post: 'post-1',
    content: '좋은 정보 감사합니다. 4층보다 3층이 더 조용한 편인가요?',
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
  },
  {
    _id: 'comment-2',
    author: mockUsers[2],
    post: 'post-1',
    content: '방금 다녀왔는데 창가 쪽도 아직 몇 자리 남아 있었어요.',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    _id: 'comment-3',
    author: mockCurrentUser,
    post: 'post-2',
    content: '화면 먼저 고정해두면 API 붙일 때 훨씬 덜 흔들릴 것 같아요.',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    _id: 'comment-4',
    author: mockUsers[0],
    post: 'post-3',
    content: '참여하고 싶어요. 백준 기준으로 어느 난이도 문제 풀 예정인가요?',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    _id: 'comment-5',
    author: mockUsers[1],
    post: 'post-3',
    content: '저도 가능하면 같이 가겠습니다. 시간 확정되면 알려주세요.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
]
