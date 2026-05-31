export const THEME_STORAGE_KEY = 'project-g:theme'
export const THEME_CHANGED_EVENT = 'project-g:theme-changed'

export type Theme = 'dark' | 'light'

export function isTheme (value: string | null): value is Theme {
  return value === 'dark' || value === 'light'
}

export function getThemeScript (): string {
  return `
(() => {
  try {
    const storedTheme = window.localStorage.getItem('${THEME_STORAGE_KEY}');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : systemTheme;
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch {
    document.documentElement.dataset.theme = 'light';
    document.documentElement.style.colorScheme = 'light';
  }
})();
  `.trim()
}
