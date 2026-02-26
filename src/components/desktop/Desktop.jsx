import React from 'react'
import { motion } from 'framer-motion'
import { useWindowStore } from '../../store/windowStore'
import Window from '../window/Window'
import AboutWindow from '../../windows/AboutWindow'
import ProjectsWindow from '../../windows/ProjectsWindow'
import ResumeWindow from '../../windows/ResumeWindow'
import ContactWindow from '../../windows/ContactWindow'
import SnakeWindow from '../../windows/SnakeWindow'
import MinesweeperWindow from '../../windows/MinesweeperWindow'
import TicTacToeWindow from '../../windows/TicTacToeWindow'
import BlogWindow from '../../windows/BlogWindow'

const PORTFOLIO_ICONS = [
    { id: 'about', icon: '👤', label: 'About Me' },
    { id: 'projects', icon: '💼', label: 'Projects' },
    { id: 'resume', icon: '📄', label: 'Resume' },
    { id: 'contact', icon: '✉️', label: 'Contact' },
    { id: 'blog', icon: '📝', label: 'Blog' },
]

const GAME_ICONS = [
    { id: 'snake', icon: '🐍', label: 'Snake' },
    { id: 'minesweeper', icon: '💣', label: 'Mine Sweep' },
    { id: 'tictactoe', icon: '❌', label: 'Tic Tac Toe' },
]

export default function Desktop() {
    const { openWindow } = useWindowStore()

    return (
        <div id="desktop-surface" className="vista-wallpaper" style={{ height: 'calc(100vh - 48px)', position: 'relative', overflow: 'hidden' }}>
            {/* Aurora glow orb */}
            <div className="vista-aurora" />

            {/* Sphere accents */}
            <div className="vista-sphere" style={{ width: 300, height: 300, left: '15%', top: '30%', background: 'radial-gradient(circle, rgba(30,100,255,0.12), transparent 70%)' }} />
            <div className="vista-sphere" style={{ width: 500, height: 500, right: '-5%', top: '10%', background: 'radial-gradient(circle, rgba(0,80,200,0.08), transparent 70%)' }} />

            {/* Subtle grid pattern */}
            <div style={{
                position: 'absolute', inset: 0, opacity: 0.03,
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                backgroundSize: '60px 60px',
                pointerEvents: 'none'
            }} />

            {/* Desktop icons — portfolio (left) */}
            <div className="absolute top-6 left-6 flex flex-col gap-4">
                {PORTFOLIO_ICONS.map((item, i) => (
                    <DesktopIcon key={item.id} item={item} delay={i * 0.1} onOpen={openWindow} />
                ))}
            </div>

            {/* Desktop icons — games (right) */}
            <div className="absolute top-6 right-6 flex flex-col gap-4">
                {GAME_ICONS.map((item, i) => (
                    <DesktopIcon key={item.id} item={item} delay={0.4 + i * 0.1} onOpen={openWindow} />
                ))}
            </div>

            {/* Center welcome text (fades when windows are open) */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none select-none"
            >
                <div className="text-5xl font-black text-white/10 tracking-widest uppercase mb-2">
                    Divyesh Chauhan
                </div>
                <div className="text-white/20 text-sm tracking-widest uppercase">
                    Double-click icons to open • Drag windows to move
                </div>
            </motion.div>

            {/* Portfolio windows */}
            <Window id="about"><AboutWindow /></Window>
            <Window id="projects"><ProjectsWindow /></Window>
            <Window id="resume"><ResumeWindow /></Window>
            <Window id="contact"><ContactWindow /></Window>
            <Window id="blog"><BlogWindow /></Window>

            {/* Game windows */}
            <Window id="snake"><SnakeWindow /></Window>
            <Window id="minesweeper"><MinesweeperWindow /></Window>
            <Window id="tictactoe"><TicTacToeWindow /></Window>
        </div>
    )
}

function DesktopIcon({ item, delay, onOpen }) {
    const [clicks, setClicks] = React.useState(0)
    const timerRef = React.useRef(null)

    const handleClick = () => {
        setClicks(c => {
            const nc = c + 1
            if (nc === 1) {
                timerRef.current = setTimeout(() => setClicks(0), 300)
            } else if (nc === 2) {
                clearTimeout(timerRef.current)
                setClicks(0)
                onOpen(item.id)
            }
            return nc
        })
    }

    return (
        <motion.button
            initial={{ opacity: 0, x: delay < 0.4 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.35 }}
            onClick={handleClick}
            className="desktop-icon"
        >
            <div
                className="icon-bg"
                style={{
                    width: 52, height: 52, borderRadius: 12,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 28, flexShrink: 0,
                    background: 'rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    transition: 'background 0.15s, border-color 0.15s',
                }}
            >
                {item.icon}
            </div>
            <span className="icon-label">{item.label}</span>
        </motion.button>
    )
}
