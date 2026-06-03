import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from '@/i18n/LanguageContext'
import HomePage from '@/pages/HomePage'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <LanguageProvider>{children}</LanguageProvider>
  </BrowserRouter>
)

describe('HomePage', () => {
  it('renders hero section', () => {
    render(<HomePage />, { wrapper: Wrapper })
    expect(screen.getByText(/Замени лицо на любое другое/i)).toBeInTheDocument()
    expect(screen.getByText(/за секунды/i)).toBeInTheDocument()
    expect(screen.getByText(/Оформить/i)).toBeInTheDocument()
  })

  it('renders features section', () => {
    render(<HomePage />, { wrapper: Wrapper })
    expect(screen.getByText(/Локальная AI обработка/i)).toBeInTheDocument()
    expect(screen.getByText(/100% приватно/i)).toBeInTheDocument()
    expect(screen.getByText(/Несколько лиц/i)).toBeInTheDocument()
  })
})
