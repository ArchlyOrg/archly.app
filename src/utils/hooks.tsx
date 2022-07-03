import type { ReactNode } from 'react'
import { useCallback, useContext, useLayoutEffect, useState } from 'react'

import { ThemeContext } from '@archly/contexts'
import { unmountComponentAtNode } from 'react-dom'

// eslint-disable-next-line import/prefer-default-export
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => matchMedia(query).matches)

  useLayoutEffect(() => {
    const mediaQuery = matchMedia(query)

    function onMediaQueryChange(): void {
      setMatches(mediaQuery.matches)
    }

    mediaQuery.addEventListener('change', onMediaQueryChange)

    return (): void => {
      mediaQuery.removeEventListener('change', onMediaQueryChange)
    }
  }, [query])

  return matches
}

export interface UseDarkModeType {
  theme: string
  toggleTheme: () => void
}
/**
 * Dark Mode Toggle
 *
 * Allows the user to toggle the light/dark mode of the website.
 *
 */
export function useDarkMode(): UseDarkModeType {
  const { theme, setTheme } = useContext(ThemeContext)

  const toggleTheme = (): void => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }
  return { theme, toggleTheme }
}

// creates a portal element to render a child component outside of the DOM tree
// https://reactjs.org/docs/portal.html
export function usePortal(element: JSX.Element): JSX.Element {
  const [portal, setPortal] = useState({
    render: () => {},
    remove: () => {}
  })

  // create Portal using a useCallback
  const createPortal = useCallback(element => {
    const Portal = ({ children }: JSX.Element): ReactNode =>
      createPortal(children)
    const remove = (): boolean => unmountComponentAtNode(element)
    return { render: Portal, remove }
  }, [])
}
