import {
  type RouteConfig, index, route,
} from '@react-router/dev/routes'

export default [
  route('/', 'layout.tsx', [
    index('page.tsx'),
    route('search', 'search/page.tsx'),
    route('bookmark', 'bookmark/page.tsx'),
    route('chat', 'chat/page.tsx'),
    route('profile', 'profile/page.tsx'),
  ]),
  route('*?', 'catchall.tsx'),
] satisfies RouteConfig
