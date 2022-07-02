import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { createContext, useEffect, useState } from 'react'

export const getInitialTheme = (): string => {
  if (
    typeof window !== 'undefined' &&
    window.localStorage.getItem('current-theme') !== null
  ) {
    const storedPrefs = window.localStorage.getItem('current-theme')
    if (typeof storedPrefs === 'string') {
      console.log('storedPrefs', storedPrefs)
      return storedPrefs
    }

    const userMedia = window.matchMedia('(prefers-color-scheme: dark)')

    if (userMedia.matches) {
      return 'dark'
    }
  }
  return 'dark' // light theme as the default;
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
  initialTheme: string
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
  const [theme, setTheme] = useState<string>(getInitialTheme)

  if (initialTheme) {
    checkTheme(initialTheme)
  }

  useEffect(() => {
    checkTheme(theme)
  }, [theme])

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
