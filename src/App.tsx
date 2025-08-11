import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<About />} /> */}
        {/* Route untuk halaman yang tidak ditemukan */}
        <Route path="*" element={<NotFound />} />
      </Routes>
  )
}

export default App
