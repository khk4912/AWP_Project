import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import neostandard from 'neostandard'
import { defineConfig, globalIgnores } from 'eslint/config'

const ignores = ['dist', '.**/*']

export default defineConfig([
  globalIgnores(ignores),
  neostandard({
    ts: true,
    ignores,
    filesTs: ['**/*.{ts,tsx}']
  }),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        project: ['./tsconfig.app.json', './tsconfig.node.json'],
        tsconfigRootDir: import.meta.dirname,
      }
    },
  },
])
