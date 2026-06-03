import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/i18n/LanguageContext'
import { useTranslation } from '@/i18n/useTranslation'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { setLang } = useLanguage()
  const { t, lang } = useTranslation()

  return (
    <div className="min-h-screen bg-background text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
              >
                <Sparkles className="w-6 h-6 text-primary" />
              </motion.div>
              <span className="text-xl font-bold gradient-text">{t.brand}</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                {t.navHome}
              </Link>
              <Link
                to="/swap"
                className="text-sm px-4 py-2 rounded-lg bg-primary hover:bg-primaryHover text-white transition-all"
              >
                {t.navSwap}
              </Link>
              <div className="flex items-center gap-1 ml-2 border border-white/10 rounded-lg overflow-hidden">
                <button
                  onClick={() => setLang('ru')}
                  className={`px-2 py-1 text-xs font-medium transition-colors ${
                    lang === 'ru'
                      ? 'bg-primary text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {t.langRu}
                </button>
                <button
                  onClick={() => setLang('en')}
                  className={`px-2 py-1 text-xs font-medium transition-colors ${
                    lang === 'en'
                      ? 'bg-primary text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {t.langEn}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="pt-16">{children}</main>
      <footer className="border-t border-border py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          {t.footer}
        </div>
      </footer>
    </div>
  )
}
