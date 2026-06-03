import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import FaceSwapPage from './pages/FaceSwapPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/swap" element={<FaceSwapPage />} />
      </Routes>
    </Layout>
  )
}

export default App
