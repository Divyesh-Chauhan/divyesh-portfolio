import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWindowStore } from '../../store/windowStore'
import StartMenu from './StartMenu'

export default function Taskbar() {
    const { windows, openWindow, focusWindow, minimizeWindow } = useWindowStore()
    const [time, setTime] = useState(new Date())
    const [startOpen, setStartOpen] = useState(false)

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    const formatTime = (d) => {
        let h = d.getHours()
        const m = d.getMinutes().toString().padStart(2, '0')
        const ampm = h >= 12 ? 'PM' : 'AM'
        h = h % 12 || 12
        return `${h}:${m} ${ampm}`
    }

    const formatDate = (d) => {
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    const openWindows = Object.values(windows).filter(w => w.isOpen)

    const handleTaskbarClick = (win) => {
        if (win.isMinimized) {
            focusWindow(win.id)
        } else {
            minimizeWindow(win.id)
        }
    }

    return (
        <>
            {/* Start menu popup */}
            <AnimatePresence>
                {startOpen && <StartMenu onClose={() => setStartOpen(false)} />}
            </AnimatePresence>

            {/* Taskbar */}
            <div className="taskbar fixed bottom-0 left-0 right-0 h-12 flex items-center gap-2 px-2 z-[9000]">
                {/* Start button */}
                <button
                    onClick={() => setStartOpen(!startOpen)}
                    className="start-btn flex items-center gap-2 h-9 px-4 rounded-full text-white font-bold text-sm select-none flex-shrink-0"
                >
                    <span className="text-xs font-black tracking-wide">⊞</span>
                    <span>Start</span>
                    <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-xs font-black">DC</span>
                </button>

                {/* Separator */}
                <div className="w-px h-8 bg-white/20 flex-shrink-0" />

                {/* Open window buttons */}
                <div className="flex items-center gap-1 flex-1 overflow-hidden">
                    {openWindows.map(win => (
                        <button
                            key={win.id}
                            onClick={() => handleTaskbarClick(win)}
                            className={`taskbar-btn h-9 px-3 rounded text-xs flex items-center gap-1.5 ${!win.isMinimized ? 'active' : ''}`}
                        >
                            <span>{win.icon}</span>
                            <span className="truncate max-w-[110px]">{win.title}</span>
                        </button>
                    ))}
                </div>

                {/* System clock */}
                <div className="flex-shrink-0 text-right px-3 py-1 rounded glass-button cursor-default">
                    <div className="text-white text-xs font-semibold leading-tight">{formatTime(time)}</div>
                    <div className="text-blue-200 text-[10px] leading-tight">{formatDate(time)}</div>
                </div>
            </div>
        </>
    )
}
