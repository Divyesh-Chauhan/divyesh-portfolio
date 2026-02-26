import React, { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import useStore from '../../store/useStore'

export default function MobileControls() {
    const joystickRef = useRef(null)
    const [active, setActive] = useState(false)
    const [handlePos, setHandlePos] = useState({ x: 0, y: 0 })
    const setActiveUI = useStore(state => state.setActiveUI)
    const activeUI = useStore(state => state.activeUI)

    // Disable if a UI panel is open
    if (activeUI) return null

    const handlePointerDown = (e) => {
        setActive(true)
        updateJoystick(e)
    }

    const handlePointerMove = (e) => {
        if (!active) return
        updateJoystick(e)
    }

    const handlePointerUp = () => {
        setActive(false)
        setHandlePos({ x: 0, y: 0 })
        window.dispatchEvent(new CustomEvent('joystickMove', { detail: { x: 0, y: 0 } }))
    }

    const updateJoystick = (e) => {
        if (!joystickRef.current) return
        const rect = joystickRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        // Calculate difference
        let diffX = e.clientX - centerX
        let diffY = e.clientY - centerY

        // Normalize and limit range
        const maxDist = 40 // Radius
        const dist = Math.sqrt(diffX ** 2 + diffY ** 2)

        if (dist > maxDist) {
            diffX = (diffX / dist) * maxDist
            diffY = (diffY / dist) * maxDist
        }

        setHandlePos({ x: diffX, y: diffY })

        // Normalized input (1.0 to -1.0)
        window.dispatchEvent(new CustomEvent('joystickMove', {
            detail: { x: diffX / maxDist, y: diffY / maxDist }
        }))
    }

    // Handle fake E press for interaction
    const triggerInteract = () => {
        const ev = new KeyboardEvent('keydown', { code: 'KeyE' })
        window.dispatchEvent(ev)
    }

    return (
        <div className="absolute inset-0 pointer-events-none z-40 touch-none">
            {/* Joystick Area */}
            <div
                className="absolute bottom-10 left-10 w-24 h-24 rounded-full bg-black/40 border-2 border-pirate-gold/50 flex items-center justify-center pointer-events-auto"
                ref={joystickRef}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
            >
                <motion.div
                    className="w-10 h-10 bg-pirate-primary rounded-full shadow-[0_0_10px_rgba(230,57,70,0.8)]"
                    animate={{ x: handlePos.x, y: handlePos.y }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                />
            </div>

            {/* Action Buttons Area */}
            <div className="absolute bottom-10 right-10 flex gap-4 pointer-events-auto">
                <button
                    className="w-16 h-16 rounded-full bg-pirate-secondary/80 border-2 border-pirate-gold text-pirate-paper font-pirate shadow-lg active:scale-90"
                    onClick={triggerInteract}
                >
                    Action
                </button>
            </div>
        </div>
    )
}
