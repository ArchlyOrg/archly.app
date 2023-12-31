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

export const handleLocationError = (): string => {
  const browserHasGeolocation = !!(typeof window !== 'undefined' && typeof navigator !== 'undefined')

  // eslint-disable-next-line no-console
  console.log(
    browserHasGeolocation
      ? 'Error: The Geolocation service failed.'
      : "Error: Your browser doesn't support geolocation."
  )
  return browserHasGeolocation
    ? 'Error: The Geolocation service failed.'
    : "Error: Your browser doesn't support geolocation."
}

export const shortenAddress = (address: string): string => {
  const sliceNumber = 5
  const start: string = address.toLowerCase().slice(0, sliceNumber)
  const end: string = address.toLowerCase().slice(Math.max(0, address.length - sliceNumber))
  const shortAddress = `${start}...${end}`
  return shortAddress
}