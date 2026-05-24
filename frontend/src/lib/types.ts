export type UserSummary = {
  _id: string
  username: string
  email?: string
  profileImage: string
  bio?: string
}

export type UserProfile = UserSummary & {
  followers?: UserSummary[]
  following?: UserSummary[]
}

export type PostAuthor = {
  _id: string
  username: string
  email?: string
  profileImage: string
}

export type Post = {
  _id: string
  author: PostAuthor
  content: string
  imageUrl: string
  likedBy: Array<string | UserSummary>
  commentCount?: number
  createdAt: string
  updatedAt?: string
}

export type PostsResponse = {
  posts: Post[]
  pagination: {
    skip: number
    limit: number
    total: number
    hasMore: boolean
  }
}

export type Comment = {
  _id: string
  author: {
    _id: string
    username: string
    email?: string
    profileImage: string
  }
  post: string
  content: string
  createdAt: string
  updatedAt?: string
}

export type FollowRelations = {
  userId: string
  followers: UserSummary[]
  following: UserSummary[]
  followerCount: number
  followingCount: number
}

export type LoginResponse = {
  accessToken: string
}

export type IdResponse = {
  message: string
  userId?: string
  postId?: string
}
