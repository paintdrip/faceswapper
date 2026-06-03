import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
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
              <span className="text-xl font-bold gradient-text">DiminSwap</span>
            </Link>
            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="text-sm text-gray-300 hover:text-white transition-colors"
              >
                Главная
              </Link>
              <Link
                to="/swap"
                className="text-sm px-4 py-2 rounded-lg bg-primary hover:bg-primaryHover text-white transition-all"
              >
                Оформить
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="pt-16">{children}</main>
      <footer className="border-t border-border py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          DiminSwap — Локальный AI Face Swap. Лицо Димы Данилина на любой фотографии
        </div>
      </footer>
    </div>
  )
}
