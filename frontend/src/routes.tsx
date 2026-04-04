import {
  type RouteConfig, index, route,
} from '@react-router/dev/routes'

export default [
  route('/', 'layout.tsx', [
    index('page.tsx')
  ]),
  route('*?', 'catchall.tsx'),
] satisfies RouteConfig
