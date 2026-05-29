'use client'

import { useEffect, useMemo, useState } from 'react'

import Post from '@/components/Post'
import UserAvatar from '@/components/UserAvatar'
import { getPosts, getUsers } from '@/lib/api'
import type { Post as PostModel, UserSummary } from '@/lib/types'

export default function SearchClient () {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState<UserSummary[]>([])
  const [posts, setPosts] = useState<PostModel[]>([])
  const [errorMessage, setErrorMessage] = useState('')
  const normalizedQuery = query.trim().toLowerCase()

  useEffect(() => {
    async function loadSearchData () {
      try {
        const [usersResponse, postsResponse] = await Promise.all([
          getUsers(),
          getPosts({ limit: 20 }),
        ])
        setUsers(usersResponse)
        setPosts(postsResponse.posts)
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : '검색 데이터를 불러오지 못했습니다.')
      }
    }

    loadSearchData().catch((error: unknown) => {
      setErrorMessage(error instanceof Error ? error.message : '검색 데이터를 불러오지 못했습니다.')
    })
  }, [])

  const filteredUsers = useMemo(() => {
    if (normalizedQuery.length === 0) return []
    return users.filter((user) => user.username.toLowerCase().includes(normalizedQuery))
  }, [normalizedQuery, users])

  const filteredPosts = useMemo(() => {
    if (normalizedQuery.length === 0) return []
    return posts.filter((post) => {
      return post.content.toLowerCase().includes(normalizedQuery) ||
        post.author.username.toLowerCase().includes(normalizedQuery)
    })
  }, [normalizedQuery, posts])

  return (
    <>
      <div className='border-b border-gray-200 px-4 py-4'>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className='block w-full rounded-full bg-gray-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500'
          placeholder='검색어를 입력하세요'
        />
      </div>

      {errorMessage.length > 0
        ? (
          <div className='flex min-h-[180px] items-center justify-center px-6 text-center text-gray-500'>
            {errorMessage}
          </div>
          )
        : null}

      {normalizedQuery.length === 0 && errorMessage.length === 0
        ? (
          <div className='flex min-h-[180px] items-center justify-center px-6 text-center text-gray-500'>
            사용자나 게시글을 검색해보세요.
          </div>
          )
        : null}

      {filteredUsers.length > 0
        ? (
          <section className='border-b border-gray-200'>
            <h2 className='px-4 py-3 text-sm font-bold text-gray-500'>사용자</h2>
            {filteredUsers.map((user) => (
              <article key={user._id} className='flex items-center gap-3 px-4 py-3'>
                <UserAvatar name={user.username} seed={user._id} size={40} />
                <div className='min-w-0'>
                  <h3 className='truncate font-bold text-gray-950'>{user.username}</h3>
                  <p className='truncate text-sm text-gray-500'>{user.email ?? user.bio ?? ''}</p>
                </div>
              </article>
            ))}
          </section>
          )
        : null}

      {filteredPosts.length > 0
        ? (
          <section>
            <h2 className='px-4 py-3 text-sm font-bold text-gray-500'>게시글</h2>
            {filteredPosts.map((post) => (
              <Post key={post._id} post={post} href={`/post/${post._id}`} />
            ))}
          </section>
          )
        : null}
    </>
  )
}
