import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useWindowStore } from '../../store/windowStore'

const APPS = [
    { id: 'about', title: 'About Me', icon: '👤' },
    { id: 'projects', title: 'My Projects', icon: '💼' },
    { id: 'resume', title: 'Resume & Links', icon: '📄' },
    { id: 'contact', title: 'Contact Me', icon: '✉️' },
    { id: 'blog', title: 'Blog', icon: '📝' },
]

const GAMES = [
    { id: 'snake', title: 'Snake', icon: '🐍' },
    { id: 'minesweeper', title: 'Minesweeper', icon: '💣' },
    { id: 'tictactoe', title: 'Tic-Tac-Toe', icon: '❌' },
]

export default function StartMenu({ onClose }) {
    const { openWindow } = useWindowStore()
    const menuRef = useRef(null)

    useEffect(() => {
        const handle = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                onClose()
            }
        }
        document.addEventListener('mousedown', handle)
        return () => document.removeEventListener('mousedown', handle)
    }, [onClose])

    const handleOpen = (id) => {
        openWindow(id)
        onClose()
    }

    return (
        <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed bottom-14 left-2 w-72 glass-dark rounded-xl overflow-hidden z-[9100] shadow-2xl"
            style={{ border: '1px solid rgba(100,160,255,0.3)' }}
        >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-blue-800/70 to-blue-900/70 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-black text-sm shadow-lg">
                        DC
                    </div>
                    <div>
                        <div className="text-white font-semibold text-sm">Divyesh Chauhan</div>
                        <div className="text-blue-300 text-xs">Full Stack Developer</div>
                    </div>
                </div>
            </div>

            {/* App list */}
            <div className="py-2">
                {APPS.map((app) => (
                    <button
                        key={app.id}
                        onClick={() => handleOpen(app.id)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-white hover:bg-white/10 transition-colors"
                    >
                        <span className="text-2xl w-8 text-center">{app.icon}</span>
                        <span className="text-sm font-medium">{app.title}</span>
                    </button>
                ))}
            </div>

            {/* Games divider */}
            <div className="border-t border-white/10 px-4 py-1.5 flex items-center gap-2">
                <span className="text-[10px] text-blue-400/60 font-semibold uppercase tracking-widest">Games</span>
            </div>
            <div className="pb-2">
                {GAMES.map((game) => (
                    <button
                        key={game.id}
                        onClick={() => handleOpen(game.id)}
                        className="w-full flex items-center gap-3 px-4 py-2 text-left text-white hover:bg-white/10 transition-colors"
                    >
                        <span className="text-xl w-8 text-center">{game.icon}</span>
                        <span className="text-sm font-medium">{game.title}</span>
                    </button>
                ))}
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 px-4 py-2.5 bg-black/20 flex justify-between items-center">
                <a href="/control-panel" className="text-xs text-blue-300 hover:text-white transition-colors">
                    ⚙️ Control Panel
                </a>
                <span className="text-xs text-gray-400">Vista Portfolio</span>
            </div>
        </motion.div>
    )
}
