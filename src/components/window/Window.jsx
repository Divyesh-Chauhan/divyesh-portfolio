import React, { useRef, useState } from 'react'
import Draggable from 'react-draggable'
import { motion, AnimatePresence } from 'framer-motion'
import { useWindowStore } from '../../store/windowStore'

export default function Window({ id, children }) {
    const { windows, closeWindow, minimizeWindow, maximizeWindow, focusWindow, updatePosition } = useWindowStore()
    const win = windows[id]
    // nodeRef must point to the plain div that Draggable directly controls —
    // NOT to a motion.div, because Framer Motion's transform would conflict
    const nodeRef = useRef(null)
    const [isDragging, setIsDragging] = useState(false)

    if (!win || !win.isOpen || win.isMinimized) return null

    const handleFocus = () => focusWindow(id)

    const handleDragStop = (e, data) => {
        setIsDragging(false)
        updatePosition(id, data.x, data.y)
    }

    // ── Maximized: fixed full-screen above taskbar ──────────────────────────────
    if (win.isMaximized) {
        return (
            <div
                style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 48,
                    zIndex: win.zIndex, display: 'flex', flexDirection: 'column',
                    overflow: 'hidden',
                    background: 'rgba(8,18,38,0.94)',
                    backdropFilter: 'blur(24px) saturate(180%)',
                    boxShadow: '0 0 0 1px rgba(255,255,255,0.1)',
                }}
                onClick={handleFocus}
            >
                <TitleBar win={win} onMinimize={() => minimizeWindow(id)} onMaximize={() => maximizeWindow(id)} onClose={() => closeWindow(id)} />
                <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>{children}</div>
            </div>
        )
    }

    // ── Normal draggable window ─────────────────────────────────────────────────
    // KEY: Draggable's nodeRef points to a PLAIN div.
    // Framer Motion only animates an inner div's opacity — no transform conflict.
    return (
        <Draggable
            nodeRef={nodeRef}
            handle=".window-drag-handle"
            defaultPosition={{ x: win.x, y: win.y }}
            onStart={() => { setIsDragging(true); focusWindow(id) }}
            onStop={handleDragStop}
            bounds="parent"
        >
            {/* This plain div is what Draggable translates with CSS transform */}
            <div
                ref={nodeRef}
                style={{
                    position: 'absolute',
                    zIndex: win.zIndex,
                    width: win.width,
                    height: win.height,
                    cursor: 'default',
                }}
                onClick={handleFocus}
            >
                {/* Inner motion.div ONLY animates opacity — no scale/y/x transforms that could conflict */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.18 }}
                    style={{
                        width: '100%', height: '100%',
                        display: 'flex', flexDirection: 'column',
                        overflow: 'hidden', borderRadius: 10,
                        background: isDragging ? 'rgba(8,18,38,0.96)' : 'rgba(10,20,40,0.88)',
                        backdropFilter: 'blur(22px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(22px) saturate(180%)',
                        boxShadow: isDragging
                            ? '0 28px 80px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.22)'
                            : '0 16px 50px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.15)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        transition: 'box-shadow 0.15s ease, background 0.15s ease',
                    }}
                >
                    <TitleBar
                        win={win}
                        onMinimize={() => minimizeWindow(id)}
                        onMaximize={() => maximizeWindow(id)}
                        onClose={() => closeWindow(id)}
                    />
                    <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
                        {children}
                    </div>
                </motion.div>
            </div>
        </Draggable>
    )
}

// ── Title bar ────────────────────────────────────────────────────────────────
function TitleBar({ win, onMinimize, onMaximize, onClose }) {
    return (
        <div
            className={`window-drag-handle flex items-center justify-between px-3 h-9 flex-shrink-0 select-none ${!win.isMaximized ? 'cursor-move' : ''}`}
            style={{
                background: 'linear-gradient(180deg, rgba(60,120,220,0.85) 0%, rgba(20,70,180,0.92) 100%)',
                borderBottom: '1px solid rgba(255,255,255,0.12)',
                borderRadius: win.isMaximized ? 0 : '10px 10px 0 0',
            }}
        >
            <div className="flex items-center gap-2 text-white text-sm font-semibold min-w-0 overflow-hidden">
                <span className="text-base flex-shrink-0">{win.icon}</span>
                <span className="truncate">{win.title}</span>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                <WinBtn color="#ffd800" hover="#ffe94a" label="–" title="Minimize" onClick={(e) => { e.stopPropagation(); onMinimize() }} />
                <WinBtn color="#34c955" hover="#45e066" label="□" title={win.isMaximized ? 'Restore' : 'Maximize'} onClick={(e) => { e.stopPropagation(); onMaximize() }} />
                <WinBtn color="#ff5f57" hover="#ff7c75" label="✕" title="Close" onClick={(e) => { e.stopPropagation(); onClose() }} />
            </div>
        </div>
    )
}

function WinBtn({ color, hover, label, title, onClick }) {
    const [hov, setHov] = useState(false)
    return (
        <button
            title={title}
            onClick={onClick}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            onMouseDown={e => e.stopPropagation()}
            style={{
                width: 20, height: 20, borderRadius: '50%',
                background: `radial-gradient(circle at 40% 35%, ${hov ? hover : color} 0%, ${hov ? color : color + 'bb'} 100%)`,
                border: '1px solid rgba(0,0,0,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 900,
                color: hov ? 'rgba(0,0,0,0.65)' : 'transparent',
                cursor: 'pointer',
                transition: 'transform 0.1s ease, color 0.1s ease',
                transform: hov ? 'scale(1.1)' : 'scale(1)',
                flexShrink: 0,
            }}
        >
            {label}
        </button>
    )
}
