import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { LanguageProvider } from './contexts/LanguageContext'
import './index.css'
import App from './App.tsx'
import { applyCustomFonts } from './utils/fontLoader'
import { ErrorBoundary } from './components/ErrorBoundary'

// Synchronously apply custom fonts from cache before initial paint
try {
  const cached = localStorage.getItem('portfolio_settings');
  if (cached) {
    applyCustomFonts(JSON.parse(cached));
  }
} catch {}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>,
)
