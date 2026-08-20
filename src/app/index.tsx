import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Unable to find the plugin UI root element.')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
)
