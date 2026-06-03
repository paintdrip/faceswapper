import { render, screen } from '@testing-library/react'
import ProcessingStatus from '@/components/ProcessingStatus'
import { useAppStore } from '@/store/useAppStore'

describe('ProcessingStatus', () => {
  beforeEach(() => {
    useAppStore.getState().reset()
  })

  it('renders nothing when idle', () => {
    const { container } = render(<ProcessingStatus />)
    expect(container.firstChild).toBeNull()
  })

  it('renders uploading state', () => {
    useAppStore.getState().setStatus('uploading')
    useAppStore.getState().setProgress(45)
    render(<ProcessingStatus />)
    expect(screen.getByText('Загрузка изображения...')).toBeInTheDocument()
    expect(screen.getByText('45%')).toBeInTheDocument()
  })

  it('renders processing state', () => {
    useAppStore.getState().setStatus('processing')
    render(<ProcessingStatus />)
    expect(screen.getByText('AI обрабатывает лица...')).toBeInTheDocument()
  })

  it('renders completed state', () => {
    useAppStore.getState().setStatus('completed')
    useAppStore.getState().setFacesDetected(2)
    render(<ProcessingStatus />)
    expect(screen.getByText('Готово! Найдено и заменено лиц: 2.')).toBeInTheDocument()
  })

  it('renders error state', () => {
    useAppStore.getState().setStatus('error')
    useAppStore.getState().setError('Network error')
    render(<ProcessingStatus />)
    expect(screen.getByText('Network error')).toBeInTheDocument()
  })
})
