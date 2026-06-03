import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import HomePage from '@/pages/HomePage'

describe('HomePage', () => {
  it('renders hero section', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    )
    expect(screen.getByText(/Замени лицо на/i)).toBeInTheDocument()
    expect(screen.getByText('лицо Димы Данилина', { selector: 'span' })).toBeInTheDocument()
    expect(screen.getByText(/Оформить/i)).toBeInTheDocument()
  })

  it('renders features section', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    )
    expect(screen.getByText(/Локальная AI обработка/i)).toBeInTheDocument()
    expect(screen.getByText(/100% приватно/i)).toBeInTheDocument()
    expect(screen.getByText(/Несколько лиц/i)).toBeInTheDocument()
  })
})
