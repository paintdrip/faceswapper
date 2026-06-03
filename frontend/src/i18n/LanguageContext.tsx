import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Language } from './translations'

interface LanguageContextType {
  lang: Language
  setLang: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const stored = localStorage.getItem('faceswapper-lang')
    return (stored === 'ru' || stored === 'en') ? stored : 'ru'
  })

  const setLang = useCallback((newLang: Language) => {
    localStorage.setItem('faceswapper-lang', newLang)
    setLangState(newLang)
  }, [])

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
