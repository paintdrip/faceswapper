import { render, screen } from '@testing-library/react'
import ProcessingStatus from '@/components/ProcessingStatus'
import { useAppStore } from '@/store/useAppStore'
import { LanguageProvider } from '@/i18n/LanguageContext'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <LanguageProvider>{children}</LanguageProvider>
)

describe('ProcessingStatus', () => {
  beforeEach(() => {
    useAppStore.getState().reset()
  })

  it('renders nothing when idle', () => {
    const { container } = render(<ProcessingStatus />, { wrapper: Wrapper })
    expect(container.firstChild).toBeNull()
  })

  it('renders detecting state', () => {
    useAppStore.getState().setStatus('detecting')
    render(<ProcessingStatus />, { wrapper: Wrapper })
    expect(screen.getByText(/Поиск лиц/i)).toBeInTheDocument()
  })

  it('renders uploading state', () => {
    useAppStore.getState().setStatus('uploading')
    useAppStore.getState().setProgress(45)
    render(<ProcessingStatus />, { wrapper: Wrapper })
    expect(screen.getByText('Загрузка...')).toBeInTheDocument()
    expect(screen.getByText('45%')).toBeInTheDocument()
  })

  it('renders processing state', () => {
    useAppStore.getState().setStatus('processing')
    render(<ProcessingStatus />, { wrapper: Wrapper })
    expect(screen.getByText('AI обрабатывает...')).toBeInTheDocument()
  })

  it('renders completed state', () => {
    useAppStore.getState().setStatus('completed')
    useAppStore.getState().setFacesDetected(2)
    render(<ProcessingStatus />, { wrapper: Wrapper })
    expect(screen.getByText('Готово!')).toBeInTheDocument()
  })

  it('renders error state', () => {
    useAppStore.getState().setStatus('error')
    useAppStore.getState().setError('Network error')
    render(<ProcessingStatus />, { wrapper: Wrapper })
    expect(screen.getByText('Network error')).toBeInTheDocument()
  })
})
