/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { StrictMode } from 'react'

import App from '@archly/App'
import { ThemeProvider } from '@archly/contexts'
import { createRoot } from 'react-dom/client'
// import { initThinBackend } from 'thin-backend'
// import { ThinBackend } from 'thin-backend-react'
import { registerSW } from 'virtual:pwa-register'
import './index.css'

// initThinBackend({ host: import.meta.env.VITE_BACKEND_URL as string })

registerSW()

// const MAX_RETRIES = 1
// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: Number.POSITIVE_INFINITY,
//       retry: MAX_RETRIES
//     }
//   }
// })

const rootElement = document.querySelector('#root')
const root = rootElement && createRoot(rootElement)
// const currentTheme = getInitialTheme()

root?.render(
  <StrictMode>
    <ThemeProvider>
      {/* <ThinBackend requireLogin> */}
      {/* <QueryClientProvider client={queryClient}> */}
      <App />
      {/* </QueryClientProvider> */}
      {/* </ThinBackend> */}
    </ThemeProvider>
  </StrictMode>
)
