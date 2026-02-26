import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import GamePage from './pages/GamePage'
import AdminPage from './pages/AdminPage'
import LoadingScreen from './components/ui/LoadingScreen'

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<GamePage />} />
          <Route path="/grandline-admin" element={<AdminPage />} />
        </Routes>
      </Suspense>
    </Router>
  )
}

export default App
