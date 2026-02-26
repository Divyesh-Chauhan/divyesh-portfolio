import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Desktop from './components/desktop/Desktop'
import Taskbar from './components/desktop/Taskbar'
import MobileLayout from './components/MobileLayout'
import ControlPanel from './pages/ControlPanel'
import AdminDashboard from './pages/AdminDashboard'
import VistaBoot from './components/VistaBoot'

const BOOT_KEY = 'vista_booted'

function DesktopView() {
    return (
        <div className="w-screen h-screen overflow-hidden relative">
            <Desktop />
            <Taskbar />
        </div>
    )
}

function PortfolioPage() {
    const [isMobile, setIsMobile] = useState(false)
    const [booted, setBooted] = useState(() => sessionStorage.getItem(BOOT_KEY) === 'true')

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

    const handleBootComplete = () => {
        sessionStorage.setItem(BOOT_KEY, 'true')
        setBooted(true)
    }

    // Mobile never shows boot screen
    if (isMobile) return <MobileLayout />

    // Show boot screen first (once per session)
    if (!booted) return <VistaBoot onComplete={handleBootComplete} />

    return <DesktopView />
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PortfolioPage />} />
                <Route path="/control-panel" element={<ControlPanel />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="*" element={<PortfolioPage />} />
            </Routes>
        </BrowserRouter>
    )
}
