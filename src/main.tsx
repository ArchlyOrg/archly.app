/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { StrictMode } from 'react'

import App from '@archly/App'
import { ThemeProvider } from '@archly/contexts'
import { createRoot } from 'react-dom/client'
import { MoralisProvider } from 'react-moralis'
import { BrowserRouter } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
import { NotificationProvider } from 'web3uikit'
import './index.css'

registerSW()

const rootElement = document.querySelector('#root')
const root = rootElement && createRoot(rootElement)
// const currentTheme = getInitialTheme()
const moralisAppId = import.meta.env.VITE_MORALIS_APP_ID
const moralisServerUrl = import.meta.env.VITE_MORALIS_SERVER_URL

root?.render(
  <StrictMode>
    <ThemeProvider>
      <MoralisProvider appId={moralisAppId} serverUrl={moralisServerUrl}>
        <NotificationProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </NotificationProvider>
      </MoralisProvider>
    </ThemeProvider>
  </StrictMode>
)
