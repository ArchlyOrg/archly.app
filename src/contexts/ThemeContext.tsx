import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { createContext, useLayoutEffect, useState } from 'react'

export const getInitialTheme = (): string => {
  if (typeof window !== 'undefined' && window.localStorage.length > 0) {
    const storedPrefs = window.localStorage.getItem('current-theme')

    const userMedia = window.matchMedia('(prefers-color-scheme: dark)')
    console.log('storedPrefs', storedPrefs)

    if (typeof storedPrefs === 'string') {
      return storedPrefs
    }
    console.log(
      'loooo',
      window.matchMedia('(prefers-color-scheme: dark)').matches
    )

    if (userMedia.matches) {
      return 'dark'
    }
  }
  return 'light' // light theme as the default;
}

interface IThemeContext {
  theme: string
  setTheme: Dispatch<SetStateAction<string>>
}

export const ThemeContext = createContext<IThemeContext>({
  theme: getInitialTheme(),
  setTheme: () => {}
})

export interface IThemeProvider {
  initialTheme?: string
  children: ReactNode
}
const checkTheme = (existing: string): void => {
  if (typeof window !== 'undefined') {
    const root = window.document.documentElement
    const isDark = existing === 'dark'
    console.log('isDark', isDark)

    root.classList.remove(isDark ? 'light' : 'dark')
    root.classList.add(existing)

    localStorage.setItem('current-theme', existing)
  }
  // return existing
}
export function ThemeProvider({
  initialTheme,
  children
}: IThemeProvider): JSX.Element {
  const [theme, setTheme] = useState<string>(initialTheme ?? getInitialTheme())

  if (initialTheme) {
    checkTheme(initialTheme)
  }

  useLayoutEffect(() => {
    checkTheme(theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

ThemeProvider.defaultProps = {
  initialTheme: getInitialTheme()
}
