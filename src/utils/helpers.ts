import { useLayoutEffect, useState } from 'react'

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

export function copyText(text: string): void {
  if (typeof navigator !== 'undefined') {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // eslint-disable-next-line no-alert
        alert('Copied to clipboard')
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.log("No navigator, you'll need to manually copy", error)
        // eslint-disable-next-line no-alert
        alert('Failed to copy to clipboard') // replace with toast like affair
      })
  }
}

export const handleLocationError = (browserHasGeolocation: boolean): string => {
  console.log(
    browserHasGeolocation
      ? 'Error: The Geolocation service failed.'
      : "Error: Your browser doesn't support geolocation."
  )
  return browserHasGeolocation
    ? 'Error: The Geolocation service failed.'
    : "Error: Your browser doesn't support geolocation."
}